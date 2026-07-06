export function explainGenericLogOffline(errorLog: string): string {
  const lines = errorLog.split("\n").filter((l) => l.trim());
  const errorLines = lines.filter((l) =>
    /\b(ERROR|FATAL|Exception|failed|failure)\b/i.test(l)
  );
  const warnLines = lines.filter((l) => /\b(WARN|WARNING)\b/i.test(l));

  const topErrors = errorLines.slice(0, 8);
  const topWarns = warnLines.slice(0, 5);

  let summary = "Log contains ";
  if (errorLines.length > 0) {
    summary += `**${errorLines.length} error line(s)**`;
  } else if (warnLines.length > 0) {
    summary += `**${warnLines.length} warning line(s)** but no explicit ERROR markers`;
  } else {
    summary += "**no standard ERROR/FATAL markers** — review manually for failures";
  }
  summary += ` across **${lines.length} total lines**.`;

  const errorSection =
    topErrors.length > 0
      ? topErrors.map((l) => `- \`${l.trim().slice(0, 200)}\``).join("\n")
      : "- No ERROR lines detected — check for non-standard failure text";

  const warnSection =
    topWarns.length > 0
      ? topWarns.map((l) => `- \`${l.trim().slice(0, 160)}\``).join("\n")
      : "- None highlighted";

  return `## Summary
${summary}

## Key error lines
${errorSection}

## Warnings
${warnSection}

## How to investigate
1. Sort logs by timestamp and find the **first error** before cascading failures
2. Search for \`Caused by\`, \`Exception\`, or exit codes (137 = OOM kill)
3. Correlate with deploy time, traffic spike, or config change
4. Compare with last known good run

## Suggested next steps
- If application logs: enable DEBUG for the relevant package
- If infrastructure: check pod events, node health, and disk space
- Paste a longer stack trace or switch to **Spark** or **Java/Spring** mode for deeper analysis

---
*Instant analysis — extracted from log patterns locally. AI-enhanced analysis returns when capacity is available.*`;
}
