/** Shared heuristics for log-like text and failure line extraction. */

const FAILURE_LINE =
  /\b(ERROR|FATAL|Exception|Traceback|Caused by:|failed|failure|denied|refused|timeout|timed out|abort|panic|killed|OOMKilled|CrashLoopBackOff|Unhealthy|Back-off|segfault|OutOfMemory|out of memory|GC overhead|exit code 137|Exit code: 137|container killed|executor lost|Job aborted|Stage \d+ failed|task failed|shuffle fetch failed|Connection reset|ECONNREFUSED|5\d{2}\s|level=error|severity=(ERROR|CRITICAL)|\[ERROR\]|\[FATAL\]|\[WARN\])\b/i;

const STACK_TRACE = /\tat\s+[\w.$]+\([\w./]+:\d+\)/m;

const SPARK_HINT =
  /\b(spark|shuffle|executor|stage \d+|driver|task \d+|org\.apache\.(spark|hadoop))\b/i;

const LOG_STRUCTURE =
  /^\[?\d{4}[-/]\d{2}[-/]\d{2}|\d{2}:\d{2}:\d{2}|^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/m;

export function isLogLikeText(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return false;

  const lines = trimmed.split("\n").filter((l) => l.trim());
  if (lines.length < 2) {
    return (
      FAILURE_LINE.test(trimmed) ||
      STACK_TRACE.test(trimmed) ||
      SPARK_HINT.test(trimmed)
    );
  }

  const failureHits = lines.filter((l) => FAILURE_LINE.test(l)).length;
  const stackHits = lines.filter((l) => STACK_TRACE.test(l)).length;
  const structuredHits = lines.filter((l) => LOG_STRUCTURE.test(l.trim())).length;

  return (
    failureHits > 0 ||
    stackHits > 0 ||
    structuredHits >= Math.min(3, Math.ceil(lines.length * 0.3)) ||
    (lines.length >= 3 && SPARK_HINT.test(trimmed))
  );
}

export function scoreLogLine(line: string): number {
  let score = 0;
  const trimmed = line.trim();
  if (!trimmed) return 0;

  if (/\b(ERROR|FATAL|Exception|Traceback|Caused by:)\b/i.test(trimmed)) score += 10;
  if (/\b(failed|failure|killed|abort|panic|denied|refused|timeout)\b/i.test(trimmed))
    score += 6;
  if (/\b(OutOfMemory|out of memory|GC overhead|OOMKilled|exit code 137)\b/i.test(trimmed))
    score += 8;
  if (/\b(WARN|WARNING)\b/i.test(trimmed)) score += 3;
  if (STACK_TRACE.test(trimmed)) score += 5;
  if (SPARK_HINT.test(trimmed)) score += 4;
  if (/\b(CrashLoopBackOff|Unhealthy|Back-off|Liveness probe)\b/i.test(trimmed)) score += 7;

  return score;
}

export function extractImportantLogLines(text: string): {
  errors: string[];
  warnings: string[];
  suspicious: string[];
} {
  const lines = text.split("\n").filter((l) => l.trim());

  const scored = lines
    .map((line) => ({ line, score: scoreLogLine(line) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);

  const errors = scored
    .filter(({ line }) =>
      /\b(ERROR|FATAL|Exception|failed|failure|killed|OutOfMemory|Caused by:|Traceback)\b/i.test(
        line
      )
    )
    .slice(0, 8)
    .map(({ line }) => line.trim());

  const warnings = lines
    .filter((l) => /\b(WARN|WARNING)\b/i.test(l))
    .slice(0, 5)
    .map((l) => l.trim());

  const suspicious = scored
    .filter(({ line }) => !errors.includes(line.trim()))
    .slice(0, 6)
    .map(({ line }) => line.trim());

  return { errors, warnings, suspicious };
}

export function detectInlineFailureTheme(text: string): string | null {
  const lower = text.toLowerCase();

  if (
    lower.includes("outofmemory") ||
    lower.includes("out of memory") ||
    lower.includes("gc overhead") ||
    lower.includes("oomkilled") ||
    lower.includes("exit code 137")
  ) {
    return "memory";
  }
  if (lower.includes("shuffle") && (lower.includes("fail") || lower.includes("fetch"))) {
    return "shuffle";
  }
  if (lower.includes("executor lost") || lower.includes("container killed")) {
    return "executor-lost";
  }
  if (lower.includes("connection refused") || lower.includes("econnrefused")) {
    return "connection";
  }
  if (lower.includes("timeout") || lower.includes("timed out")) {
    return "timeout";
  }
  if (lower.includes("crashloopbackoff") || lower.includes("liveness probe")) {
    return "kubernetes";
  }

  return null;
}

export { FAILURE_LINE, SPARK_HINT, STACK_TRACE };
