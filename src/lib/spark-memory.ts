export interface SparkMemoryInput {
  dataSizeGb: number;
  executorMemoryGb: number;
  executorCores: number;
  numExecutors: number;
  driverMemoryGb: number;
  memoryFraction: number;
}

export interface SparkMemoryResult {
  overheadMbPerExecutor: number;
  onHeapMbPerExecutor: number;
  unifiedMbPerExecutor: number;
  storageMbPerExecutor: number;
  executionMbPerExecutor: number;
  totalExecutorMemoryMb: number;
  totalClusterMemoryMb: number;
  totalClusterMemoryGb: number;
  memoryPerCoreMb: number;
  warnings: string[];
}

export function calculateSparkMemory(
  input: SparkMemoryInput
): SparkMemoryResult {
  const executorMemoryMb = input.executorMemoryGb * 1024;
  const overheadMb = Math.max(384, executorMemoryMb * 0.1);
  const onHeapMb = executorMemoryMb - overheadMb;
  const unifiedMb = onHeapMb * input.memoryFraction;
  const storageMb = unifiedMb * 0.5;
  const executionMb = unifiedMb - storageMb;
  const totalExecutorMemoryMb = executorMemoryMb * input.numExecutors;
  const totalClusterMemoryMb =
    totalExecutorMemoryMb + input.driverMemoryGb * 1024;
  const memoryPerCoreMb =
    input.executorCores > 0 ? onHeapMb / input.executorCores : 0;

  const warnings: string[] = [];

  if (input.executorMemoryGb < 4) {
    warnings.push(
      "Executor memory below 4 GB — Spark may struggle with shuffles and joins. Consider 4–8 GB minimum."
    );
  }
  if (input.executorCores > 5) {
    warnings.push(
      "More than 5 cores per executor can cause I/O bottlenecks. Spark recommends 2–5 cores per executor."
    );
  }
  if (memoryPerCoreMb < 1024) {
    warnings.push(
      `Only ${memoryPerCoreMb.toFixed(0)} MB heap per core — aim for at least 1 GB per core.`
    );
  }
  const totalExecutionGb =
    (executionMb * input.numExecutors) / 1024;
  if (input.dataSizeGb > totalExecutionGb * 0.7) {
    warnings.push(
      `Dataset (${input.dataSizeGb} GB) may exceed available execution memory (~${totalExecutionGb.toFixed(1)} GB). Increase executors or memory, or enable spill/disk persistence.`
    );
  }
  if (overheadMb / executorMemoryMb > 0.15) {
    warnings.push(
      "Memory overhead exceeds 15% of executor memory — review spark.executor.memoryOverhead if on YARN/K8s."
    );
  }

  return {
    overheadMbPerExecutor: overheadMb,
    onHeapMbPerExecutor: onHeapMb,
    unifiedMbPerExecutor: unifiedMb,
    storageMbPerExecutor: storageMb,
    executionMbPerExecutor: executionMb,
    totalExecutorMemoryMb,
    totalClusterMemoryMb,
    totalClusterMemoryGb: totalClusterMemoryMb / 1024,
    memoryPerCoreMb,
    warnings,
  };
}

export function formatMb(mb: number): string {
  return mb >= 1024 ? `${(mb / 1024).toFixed(2)} GB` : `${mb.toFixed(0)} MB`;
}
