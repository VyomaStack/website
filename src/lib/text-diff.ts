import { diffArrays } from "diff";

export interface DiffOptions {
  ignoreWhitespace: boolean;
  ignoreCase: boolean;
}

export interface DiffLineSide {
  num: number;
  text: string;
}

export interface DiffRow {
  type: "unchanged" | "added" | "removed";
  left?: DiffLineSide;
  right?: DiffLineSide;
}

export interface DiffStats {
  added: number;
  removed: number;
  unchanged: number;
}

function normalizeLine(line: string, options: DiffOptions): string {
  let result = line;
  if (options.ignoreWhitespace) {
    result = result.trim();
  }
  if (options.ignoreCase) {
    result = result.toLowerCase();
  }
  return result;
}

export function computeLineDiff(
  left: string,
  right: string,
  options: DiffOptions
): DiffRow[] {
  const leftLines = left.length > 0 ? left.split("\n") : [];
  const rightLines = right.length > 0 ? right.split("\n") : [];

  const changes = diffArrays(
    leftLines.map((line) => normalizeLine(line, options)),
    rightLines.map((line) => normalizeLine(line, options)),
    { comparator: (a, b) => a === b }
  );

  let leftIdx = 0;
  let rightIdx = 0;
  let leftNum = 1;
  let rightNum = 1;
  const rows: DiffRow[] = [];

  for (const change of changes) {
    const count = change.value.length;

    if (change.removed && !change.added) {
      for (let i = 0; i < count; i++) {
        rows.push({
          type: "removed",
          left: { num: leftNum++, text: leftLines[leftIdx++] ?? "" },
        });
      }
      continue;
    }

    if (change.added && !change.removed) {
      for (let i = 0; i < count; i++) {
        rows.push({
          type: "added",
          right: { num: rightNum++, text: rightLines[rightIdx++] ?? "" },
        });
      }
      continue;
    }

    for (let i = 0; i < count; i++) {
      rows.push({
        type: "unchanged",
        left: { num: leftNum++, text: leftLines[leftIdx++] ?? "" },
        right: { num: rightNum++, text: rightLines[rightIdx++] ?? "" },
      });
    }
  }

  return rows;
}

export function getDiffStats(rows: DiffRow[]): DiffStats {
  return rows.reduce(
    (acc, row) => {
      if (row.type === "added") acc.added++;
      else if (row.type === "removed") acc.removed++;
      else acc.unchanged++;
      return acc;
    },
    { added: 0, removed: 0, unchanged: 0 }
  );
}

export function toUnifiedDiff(rows: DiffRow[]): string {
  return rows
    .map((row) => {
      if (row.type === "removed") {
        return `- ${row.left?.text ?? ""}`;
      }
      if (row.type === "added") {
        return `+ ${row.right?.text ?? ""}`;
      }
      return `  ${row.left?.text ?? ""}`;
    })
    .join("\n");
}
