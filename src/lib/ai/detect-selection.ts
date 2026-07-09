export type SelectionKind = "sql" | "log" | "generic";

const SQL_START =
  /^\s*(SELECT|INSERT|UPDATE|DELETE|WITH|CREATE|ALTER|DROP|MERGE|EXPLAIN|TRUNCATE)\b/i;

const SQL_FRAGMENT = /\b(SELECT|INSERT)\b[\s\S]{0,2000}\b(FROM|INTO)\b/i;

function hasLogMarkers(text: string): boolean {
  return (
    /\b(ERROR|FATAL|Exception|Traceback|Caused by:)\b/i.test(text) ||
    /\tat\s+[\w.$]+\([\w./]+:\d+\)/m.test(text) ||
    /\borg\.apache\.(spark|hadoop)/i.test(text) ||
    /\borg\.springframework/i.test(text)
  );
}

export function detectSelectionKind(text: string): SelectionKind {
  const trimmed = text.trim();
  if (!trimmed) return "generic";

  if (SQL_START.test(trimmed) || SQL_FRAGMENT.test(trimmed)) {
    return "sql";
  }

  if (hasLogMarkers(trimmed)) {
    return "log";
  }

  return "generic";
}

export const SELECTION_KIND_LABELS: Record<SelectionKind, string> = {
  sql: "SQL query",
  log: "Log / error",
  generic: "Text",
};
