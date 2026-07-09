import {
  detectInlineFailureTheme,
  extractImportantLogLines,
  isLogLikeText,
} from "@/lib/ai/log-patterns";

const THEME_GUIDANCE: Record<string, string> = {
  memory: `This log points to **memory pressure** (OOM, GC overhead, or exit code 137).

**Try first**
- Increase executor/container memory or reduce heap usage
- Spark: \`spark.executor.memory=8g\`, \`spark.memory.fraction=0.8\`
- Avoid \`collect()\` on large datasets; uncache unused DataFrames
- Check for shuffle + cache happening at the same time`,

  shuffle: `This log suggests a **shuffle failure** — reducers could not fetch map output.

**Try first**
- Check for executor loss or OOM during the shuffle stage
- Spark: \`spark.shuffle.io.maxRetries=10\`, \`spark.network.timeout=300s\`
- Reduce shuffle volume: filter early, broadcast small tables`,

  "executor-lost": `An **executor or container was lost** mid-job.

**Try first**
- Look for exit code **137** (OOM kill) in cluster manager logs
- Increase \`spark.executor.memoryOverhead\` (10–20% of executor memory)
- Reduce cores/memory per node if nodes are overcommitted`,

  connection: `This looks like a **connection failure** — service unreachable or port blocked.

**Try first**
- Verify host/port, security groups, and that the target service is running
- Check DNS and load balancer health
- Look for firewalls or VPC rules blocking traffic`,

  timeout: `This log indicates a **timeout** — an operation took too long.

**Try first**
- Increase client/server timeout settings
- Check downstream latency, DB locks, or slow network
- Spark: raise \`spark.network.timeout\` and shuffle retry settings`,

  kubernetes: `This looks like a **Kubernetes pod health** issue.

**Try first**
- \`kubectl describe pod\` for OOMKilled, probe failures, or image pull errors
- Check resource limits vs actual usage
- Review liveness/readiness probe thresholds`,
};

export function explainGenericLogOffline(errorLog: string): string {
  const lines = errorLog.split("\n").filter((l) => l.trim());
  const { errors, warnings, suspicious } = extractImportantLogLines(errorLog);
  const theme = detectInlineFailureTheme(errorLog);
  const logLike = isLogLikeText(errorLog);

  let summary: string;
  if (errors.length > 0) {
    summary = `Found **${errors.length} likely error line(s)** across **${lines.length} total lines**.`;
  } else if (suspicious.length > 0) {
    summary = `No explicit ERROR/FATAL markers, but **${suspicious.length} suspicious line(s)** matched failure patterns across **${lines.length} lines**.`;
  } else if (warnings.length > 0) {
    summary = `Found **${warnings.length} warning line(s)** but no clear errors in **${lines.length} lines**.`;
  } else if (logLike) {
    summary = `Log-like text (**${lines.length} lines**) with no strong failure markers — review timestamps and the last lines before exit.`;
  } else {
    summary = `Text does not look like a classic error log (**${lines.length} lines**) — paste a stack trace or lines with Exception/Caused by for deeper analysis.`;
  }

  const errorSection =
    errors.length > 0
      ? errors.map((l) => `- \`${l.slice(0, 220)}\``).join("\n")
      : suspicious.length > 0
        ? suspicious.map((l) => `- \`${l.slice(0, 220)}\` _(suspicious)_`).join("\n")
        : lines.length > 0
          ? lines
              .slice(-5)
              .map((l) => `- \`${l.trim().slice(0, 220)}\` _(last lines)_`)
              .join("\n")
          : "- No lines to analyze";

  const warnSection =
    warnings.length > 0
      ? warnings.map((l) => `- \`${l.slice(0, 160)}\``).join("\n")
      : "- None highlighted";

  const themeSection = theme
    ? `\n## Likely issue\n${THEME_GUIDANCE[theme]}\n`
    : "";

  return `## Summary
${summary}
${themeSection}
## Key lines
${errorSection}

## Warnings
${warnSection}

## How to investigate
1. Sort by timestamp and find the **first failure** before cascading messages
2. Search for \`Caused by\`, \`Exception\`, \`killed\`, or exit code **137**
3. Correlate with deploy time, traffic spike, or config change
4. Compare with the last known good run

## Suggested next steps
- Paste more context (50+ lines around the failure) for better detection
- For Spark logs: use **Apache Spark** mode even if ERROR is missing
- For Java/Spring: look for \`org.springframework\` or \`Caused by:\` blocks

---
*Instant analysis — pattern-matched locally. AI-enhanced analysis returns when capacity is available.*`;
}

export function explainGenericTextOffline(text: string): string {
  const lines = text.split("\n").filter((l) => l.trim());
  const preview = lines.slice(0, 8).map((l) => `- ${l.trim().slice(0, 120)}`).join("\n");

  return `## Summary
Short technical text (**${lines.length} line${lines.length === 1 ? "" : "s"}**).

## Key points
${preview || "- _(empty input)_"}

## Suggested next steps
- If this is a log or stack trace, paste the full error block
- If this is SQL, paste a complete query starting with SELECT/INSERT
- Use the matching tool from the workspace for format/decode actions

---
*Instant summary — AI-enhanced analysis returns when capacity is available.*`;
}
