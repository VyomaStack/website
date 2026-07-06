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
  detectLogType,
  LOG_TYPE_LABELS,
  type LogType,
} from "@/lib/ai/log-analyzer";

const SAMPLE_SPARK = `org.apache.spark.memory.SparkOutOfMemoryError: Unable to acquire 65536 bytes of memory
  at org.apache.spark.shuffle.sort.ShuffleExternalSorter.insertRecord(ShuffleExternalSorter.java:415)
25/07/06 12:00:00 WARN TaskSetManager: Lost task 4.0 in stage 3.0: java.lang.OutOfMemoryError: Java heap space`;

const SAMPLE_JAVA = `org.springframework.beans.factory.BeanCreationException: Error creating bean with name 'userService'
  at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.createBean
Caused by: java.net.ConnectException: Connection refused: connect
  at java.net.DualStackPlainSocketImpl.waitForConnect(Native Method)`;

const LOG_TYPES: { value: LogType; label: string }[] = [
  { value: "auto", label: "Auto-detect" },
  { value: "spark", label: "Apache Spark" },
  { value: "java-spring", label: "Java / Spring Boot" },
  { value: "generic", label: "Generic log" },
];

function highlightErrors(text: string): { line: string; isError: boolean }[] {
  return text.split("\n").map((line) => ({
    line,
    isError: /\b(ERROR|FATAL|Exception|Caused by:|WARN|OutOfMemory|failed)\b/i.test(
      line
    ),
  }));
}

export function LogAnalyzerTool() {
  const [errorLog, setErrorLog] = useState(SAMPLE_SPARK);
  const [context, setContext] = useState("");
  const [logType, setLogType] = useState<LogType>("auto");

  const detected =
    logType === "auto" ? detectLogType(errorLog) : logType;
  const highlighted = useMemo(() => highlightErrors(errorLog), [errorLog]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Log Analyzer</CardTitle>
          <CardDescription>
            Paste application, Spark, or Spring Boot logs. Auto-detects log type
            and explains root cause, fixes, and prevention.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <label className="text-sm font-medium" htmlFor="log-type">
              Log type
            </label>
            <select
              id="log-type"
              value={logType}
              onChange={(e) => setLogType(e.target.value as LogType)}
              className="h-8 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {LOG_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            {logType === "auto" && errorLog.trim() && (
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                Detected: {LOG_TYPE_LABELS[detected]}
              </span>
            )}
          </div>

          <div className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-800 dark:text-amber-300">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" />
            Redact passwords, tokens, and internal hostnames before pasting
            production logs.
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setErrorLog(SAMPLE_SPARK)}
              className="rounded-full border border-border px-3 py-1 text-xs font-medium transition-colors hover:border-primary hover:text-primary"
            >
              Sample Spark log
            </button>
            <button
              type="button"
              onClick={() => setErrorLog(SAMPLE_JAVA)}
              className="rounded-full border border-border px-3 py-1 text-xs font-medium transition-colors hover:border-primary hover:text-primary"
            >
              Sample Spring log
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="log-input">
              Log output
            </label>
            <textarea
              id="log-input"
              value={errorLog}
              onChange={(e) => setErrorLog(e.target.value)}
              placeholder="Paste error logs, stack traces, or CI output..."
              spellCheck={false}
              className="min-h-[240px] w-full resize-y rounded-lg border border-input bg-transparent p-3 font-mono text-xs leading-relaxed outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>

          {errorLog.trim() && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Error highlights</p>
              <div className="max-h-32 overflow-y-auto rounded-lg border border-input bg-muted/20 p-2 font-mono text-xs">
                {highlighted
                  .filter((l) => l.isError)
                  .slice(0, 12)
                  .map((l, i) => (
                    <div
                      key={i}
                      className="rounded bg-destructive/10 px-1 py-0.5 text-destructive/90"
                    >
                      {l.line || " "}
                    </div>
                  ))}
                {highlighted.filter((l) => l.isError).length === 0 && (
                  <p className="text-muted-foreground">
                    No ERROR/Exception lines detected — analysis will use full
                    log context.
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="log-context">
              Extra context (optional)
            </label>
            <textarea
              id="log-context"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Environment, version, what changed recently..."
              className="min-h-[72px] w-full resize-y rounded-lg border border-input bg-transparent p-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>
        </CardContent>
      </Card>

      <AiResultPanel
        title="AI Log Analysis"
        description="Root cause, fixes, and prevention. Works instantly — AI-enhanced when available."
        buttonLabel="Analyze Log"
        disabled={!errorLog.trim()}
        onGenerate={async () => {
          const res = await fetch("/api/ai/analyze-log", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ errorLog, context, logType }),
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
    </div>
  );
}
