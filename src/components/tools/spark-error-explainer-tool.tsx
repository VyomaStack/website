"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";

import { AiResultPanel } from "@/components/tools/ai-result-panel";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const SAMPLE_ERROR = `org.apache.spark.memory.SparkOutOfMemoryError: Unable to acquire 65536 bytes of memory, got 0, from offset 67108864
  at org.apache.spark.memory.MemoryConsumer.throwOom(MemoryConsumer.java:157)
  at org.apache.spark.memory.MemoryManager.allocatePage(MemoryManager.java:117)
  at org.apache.spark.shuffle.sort.ShuffleExternalSorter.acquireNewPage(ShuffleExternalSorter.java:383)
  at org.apache.spark.shuffle.sort.ShuffleExternalSorter.insertRecord(ShuffleExternalSorter.java:415)

Driver stacktrace:
Stage 3 contains a task of very large size (1524 MiB). The maximum recommended task size is 1000 MiB.

25/07/06 12:00:00 WARN TaskSetManager: Lost task 4.0 in stage 3.0 (TID 42) (executor-2): java.lang.OutOfMemoryError: Java heap space`;

export function SparkErrorExplainerTool() {
  const [errorLog, setErrorLog] = useState(SAMPLE_ERROR);
  const [context, setContext] = useState("");

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Spark Error Log Analyzer</CardTitle>
          <CardDescription>
            Paste Spark driver or executor stack traces, OOM errors, shuffle
            failures, or stage failures. AI explains root cause and fixes.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-800 dark:text-amber-300">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" />
            Redact hostnames, credentials, and internal paths before pasting
            production logs.
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="spark-error">
              Error log / stack trace
            </label>
            <textarea
              id="spark-error"
              value={errorLog}
              onChange={(e) => setErrorLog(e.target.value)}
              placeholder="Paste Spark error output here..."
              spellCheck={false}
              className="min-h-[280px] w-full resize-y rounded-lg border border-input bg-transparent p-3 font-mono text-xs leading-relaxed outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="spark-context">
              Extra context (optional)
            </label>
            <textarea
              id="spark-context"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Cluster size, Spark version, workload type, what you were running..."
              className="min-h-[80px] w-full resize-y rounded-lg border border-input bg-transparent p-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>
        </CardContent>
      </Card>

      <AiResultPanel
        title="AI Spark Error Explainer"
        description="Root cause, fixes, and Spark config keys. Works instantly — AI-enhanced when available."
        buttonLabel="Explain Spark Error"
        disabled={!errorLog.trim()}
        onGenerate={async () => {
          const res = await fetch("/api/ai/explain-spark-error", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ errorLog, context }),
          });
          const data = (await res.json()) as {
            explanation?: string;
            source?: "ai" | "instant";
            error?: string;
          };
          if (!res.ok) throw new Error(data.error ?? "Request failed");
          return { text: data.explanation ?? "", source: data.source };
        }}
      />

      <Card size="sm">
        <CardHeader>
          <CardTitle>Common Spark errors we analyze</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
          <p>• Java heap space / OOM</p>
          <p>• SparkOutOfMemoryError</p>
          <p>• Shuffle fetch failures</p>
          <p>• Stage task too large</p>
          <p>• Executor lost / container killed</p>
          <p>• Serialization errors</p>
        </CardContent>
      </Card>
    </div>
  );
}
