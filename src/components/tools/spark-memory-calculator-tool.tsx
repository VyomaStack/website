"use client";

import { useMemo, useState } from "react";
import { AlertTriangle } from "lucide-react";

import { AiResultPanel } from "@/components/tools/ai-result-panel";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  calculateSparkMemory,
  formatMb,
  type SparkMemoryInput,
} from "@/lib/spark-memory";

const DEFAULTS: SparkMemoryInput = {
  dataSizeGb: 100,
  executorMemoryGb: 8,
  executorCores: 4,
  numExecutors: 10,
  driverMemoryGb: 4,
  memoryFraction: 0.6,
};

function NumberField({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
        {unit && (
          <span className="shrink-0 text-sm text-muted-foreground">{unit}</span>
        )}
      </div>
    </div>
  );
}

export function SparkMemoryCalculatorTool() {
  const [input, setInput] = useState<SparkMemoryInput>(DEFAULTS);

  const result = useMemo(() => calculateSparkMemory(input), [input]);

  const sparkSubmit = useMemo(
    () =>
      [
        `spark-submit \\`,
        `  --executor-memory ${input.executorMemoryGb}g \\`,
        `  --executor-cores ${input.executorCores} \\`,
        `  --num-executors ${input.numExecutors} \\`,
        `  --driver-memory ${input.driverMemoryGb}g \\`,
        `  --conf spark.memory.fraction=${input.memoryFraction} \\`,
        `  your-app.jar`,
      ].join("\n"),
    [input]
  );

  function update<K extends keyof SparkMemoryInput>(
    key: K,
    value: SparkMemoryInput[K]
  ) {
    setInput((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Spark Memory Calculator</CardTitle>
          <CardDescription>
            Estimate executor overhead, unified memory, and cluster totals using
            Spark&apos;s default memory model. Get AI tuning recommendations.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <NumberField
              label="Dataset size"
              value={input.dataSizeGb}
              onChange={(v) => update("dataSizeGb", v)}
              min={1}
              max={10000}
              unit="GB"
            />
            <NumberField
              label="Executor memory"
              value={input.executorMemoryGb}
              onChange={(v) => update("executorMemoryGb", v)}
              min={1}
              max={64}
              unit="GB"
            />
            <NumberField
              label="Executor cores"
              value={input.executorCores}
              onChange={(v) => update("executorCores", v)}
              min={1}
              max={16}
            />
            <NumberField
              label="Number of executors"
              value={input.numExecutors}
              onChange={(v) => update("numExecutors", v)}
              min={1}
              max={500}
            />
            <NumberField
              label="Driver memory"
              value={input.driverMemoryGb}
              onChange={(v) => update("driverMemoryGb", v)}
              min={1}
              max={32}
              unit="GB"
            />
            <NumberField
              label="spark.memory.fraction"
              value={input.memoryFraction}
              onChange={(v) => update("memoryFraction", v)}
              min={0.1}
              max={0.9}
              step={0.05}
            />
          </div>

          {result.warnings.length > 0 && (
            <div className="space-y-2">
              {result.warnings.map((w) => (
                <div
                  key={w}
                  className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-800 dark:text-amber-300"
                >
                  <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                  {w}
                </div>
              ))}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <ResultCard
              label="Overhead / executor"
              value={formatMb(result.overheadMbPerExecutor)}
            />
            <ResultCard
              label="On-heap / executor"
              value={formatMb(result.onHeapMbPerExecutor)}
            />
            <ResultCard
              label="Execution memory / executor"
              value={formatMb(result.executionMbPerExecutor)}
            />
            <ResultCard
              label="Storage memory / executor"
              value={formatMb(result.storageMbPerExecutor)}
            />
            <ResultCard
              label="Memory per core"
              value={formatMb(result.memoryPerCoreMb)}
            />
            <ResultCard
              label="Total cluster memory"
              value={`${result.totalClusterMemoryGb.toFixed(2)} GB`}
              highlight
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Suggested spark-submit</h3>
            <pre className="overflow-x-auto rounded-lg border border-input bg-muted/30 p-3 font-mono text-xs leading-relaxed">
              {sparkSubmit}
            </pre>
          </div>
        </CardContent>
      </Card>

      <AiResultPanel
        title="AI Spark Tuning Advisor"
        description="Get expert recommendations on executor sizing, memory tuning, and cost optimization based on your configuration."
        buttonLabel="Get AI Recommendations"
        onGenerate={async () => {
          const res = await fetch("/api/ai/spark-advice", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              config: input,
              results: {
                overheadPerExecutor: formatMb(result.overheadMbPerExecutor),
                onHeapPerExecutor: formatMb(result.onHeapMbPerExecutor),
                executionPerExecutor: formatMb(result.executionMbPerExecutor),
                storagePerExecutor: formatMb(result.storageMbPerExecutor),
                memoryPerCore: formatMb(result.memoryPerCoreMb),
                totalClusterMemoryGb: result.totalClusterMemoryGb.toFixed(2),
              },
              warnings: result.warnings,
            }),
          });
          const data = (await res.json()) as {
            advice?: string;
            error?: string;
          };
          if (!res.ok) throw new Error(data.error ?? "Request failed");
          return data.advice ?? "";
        }}
      />

      <Card size="sm">
        <CardHeader>
          <CardTitle>How memory is calculated</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            <strong className="text-foreground">Overhead</strong> — max(384 MB,
            10% of executor memory), reserved off-heap for JVM metaspace and
            threads.
          </p>
          <p>
            <strong className="text-foreground">Unified memory</strong> —
            on-heap × spark.memory.fraction (default 0.6), split 50/50 between
            execution and storage.
          </p>
          <p>
            <strong className="text-foreground">AI Advisor</strong> — analyzes
            your config and suggests production-ready tuning.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function ResultCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border p-4 ${highlight ? "border-primary/40 bg-primary/5" : "border-border"}`}
    >
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-lg font-semibold">{value}</p>
    </div>
  );
}
