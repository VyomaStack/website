export function explainSparkErrorOffline(errorLog: string): string {
  const log = errorLog.toLowerCase();

  if (
    log.includes("outofmemory") ||
    log.includes("out of memory") ||
    log.includes("gc overhead")
  ) {
    return `## Root cause
Executor or driver **ran out of heap memory** during a stage — often shuffle, cache, or a large collect/broadcast.

## What happened
Spark could not allocate enough on-heap memory. The JVM spent too much time in GC (\`GC overhead limit exceeded\`) or hit a hard OOM. Common triggers: large shuffles, \`cache()\` on big datasets, \`collect()\` to driver, or undersized \`spark.executor.memory\`.

## How to fix
- Increase \`spark.executor.memory\` (try **4g–8g** per executor for most workloads)
- Set \`spark.memory.fraction=0.8\` and \`spark.memory.storageFraction=0.3\`
- Reduce shuffle: lower \`spark.sql.shuffle.partitions\` (e.g. 200 → 50–100) or repartition before heavy joins
- Avoid \`collect()\` on large RDDs/DataFrames; use \`take()\`, writes, or aggregates instead
- Uncache (\`.unpersist()\`) datasets no longer needed
- For skewed keys: salting or \`spark.sql.adaptive.enabled=true\` (AQE)

## Prevention & best practices
- Right-size executors: **4–8 GB** and **2–5 cores** per executor is a solid default
- Monitor Spark UI → Stages → shuffle read/write sizes
- Use parquet with predicate pushdown; filter early

## Relevant Spark configs
\`\`\`
spark.executor.memory=8g
spark.memory.fraction=0.8
spark.sql.shuffle.partitions=100
spark.sql.adaptive.enabled=true
\`\`\`

---
*Instant analysis — pattern-matched locally. AI-enhanced analysis returns when capacity is available.*`;
  }

  if (log.includes("shuffle") && (log.includes("fetch failed") || log.includes("failure"))) {
    return `## Root cause
**Shuffle fetch failure** — an executor could not read shuffle blocks from another executor (network timeout, lost executor, or disk issue).

## What happened
During a shuffle stage, reducers tried to fetch map output and failed. Often caused by executor OOM/kill, spot instance loss, slow nodes, or \`spark.shuffle.io.maxRetries\` exhausted.

## How to fix
- Check YARN/K8s for **executor lost** or **container killed** events
- Increase \`spark.shuffle.io.maxRetries\` (default 3 → **10**)
- Increase \`spark.network.timeout\` (e.g. **300s**)
- Reduce shuffle volume: broadcast small tables, filter early, repartition wisely
- Enable \`spark.speculation\` for straggler tasks

## Prevention & best practices
- Avoid huge shuffles; use bucketed tables or pre-partitioned joins where possible
- Keep executor memory stable so nodes are not killed mid-shuffle

## Relevant Spark configs
\`\`\`
spark.shuffle.io.maxRetries=10
spark.network.timeout=300s
spark.speculation=true
\`\`\`

---
*Instant analysis — pattern-matched locally. AI-enhanced analysis returns when capacity is available.*`;
  }

  if (log.includes("executor lost") || log.includes("container killed")) {
    return `## Root cause
An **executor was lost** — the cluster manager removed the container (OOM kill, preemption, node failure, or exceeding memory limits).

## What happened
Spark marked the executor as lost and may retry the stage. Root cause is usually memory overcommit on the node, YARN/K8s memory limit, or infrastructure instability.

## How to fix
- Check cluster logs for **Exit code 137** (OOM kill)
- Lower \`spark.executor.memory\` + overhead or increase node memory
- Set \`spark.executor.memoryOverhead\` (or \`spark.yarn.executor.memoryOverhead\`) to **10–20%** of executor memory
- Reduce concurrent executors per node if memory is tight

## Prevention & best practices
- Do not pack too many executors per host
- Use dynamic allocation with sensible min/max executors

## Relevant Spark configs
\`\`\`
spark.executor.memoryOverhead=1g
spark.dynamicAllocation.enabled=true
\`\`\`

---
*Instant analysis — pattern-matched locally. AI-enhanced analysis returns when capacity is available.*`;
  }

  return `## Root cause
Review the **first \`Caused by:\`** line in the stack trace — that is usually the real failure (not the wrapper exception).

## What happened
Spark reported a stage or task failure. Check the Spark UI → Stages tab for the failed stage, shuffle bytes, and task duration skew.

## How to fix
1. Identify failed stage ID from the log
2. Open Spark UI → Stages → failed stage → failed tasks
3. Look for OOM, serialization errors, or missing files
4. Retry with more memory or fewer partitions if shuffle-heavy

## Prevention & best practices
- Enable event logging and retain driver logs
- Use structured logging with application ID for correlation

## Relevant Spark configs
\`\`\`
spark.eventLog.enabled=true
spark.sql.adaptive.enabled=true
\`\`\`

---
*Instant analysis — general guidance. Paste a more specific stack trace, or wait for AI-enhanced analysis when capacity is available.*`;
}

export function sparkAdviceOffline(
  config: Record<string, unknown>,
  results: Record<string, unknown>
): string {
  const executorMem = Number(config.executorMemoryGb ?? 4);
  const cores = Number(config.executorCores ?? 2);

  return `## Assessment
Your configuration uses **${executorMem} GB** per executor with **${cores} core(s)**. Unified memory and overhead are derived from standard Spark on-heap formulas.

## Recommended changes
- For mixed ETL + shuffle workloads: **6–8 GB** executors often outperform very large single executors (less GC pressure)
- Keep **2–5 cores** per executor; more cores increase shuffle parallelism but also memory contention per task
- Set \`spark.sql.shuffle.partitions\` to roughly **2–3× total executor cores** in the cluster

## Cost & performance trade-offs
- **More executors, smaller memory**: better fault tolerance, more parallelism, higher overhead
- **Fewer executors, larger memory**: fewer JVMs, but worse GC and longer recovery on failure

## Best practices
- Enable AQE: \`spark.sql.adaptive.enabled=true\`
- Use \`spark.serializer=org.apache.spark.serializer.KryoSerializer\` for large object graphs
- Monitor storage memory vs execution memory in Spark UI

**Calculated breakdown (summary):** ${JSON.stringify(results, null, 2).slice(0, 400)}…

---
*Instant analysis — rule-based tuning guide. AI-enhanced recommendations return when capacity is available.*`;
}
