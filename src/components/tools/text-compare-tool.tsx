"use client";

import { useCallback, useMemo, useState } from "react";
import { format } from "sql-formatter";
import {
  ArrowDownUp,
  Braces,
  Copy,
  Check,
  Database,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  computeLineDiff,
  getDiffStats,
  toUnifiedDiff,
  type DiffRow,
} from "@/lib/text-diff";

const SAMPLE_LEFT = `SELECT id, name, email
FROM users
WHERE active = 1
ORDER BY created_at DESC;`;

const SAMPLE_RIGHT = `SELECT u.id, u.name, u.email, u.role
FROM users u
LEFT JOIN teams t ON u.team_id = t.id
WHERE u.active = true
ORDER BY u.created_at DESC
LIMIT 100;`;

type ViewMode = "split" | "unified";

function rowClass(type: DiffRow["type"]): string {
  if (type === "removed") return "bg-destructive/10";
  if (type === "added") return "bg-success/10";
  return "";
}

function formatJson(text: string): string {
  return JSON.stringify(JSON.parse(text) as unknown, null, 2);
}

function formatSql(text: string): string {
  return format(text, {
    language: "sql",
    tabWidth: 2,
    keywordCase: "upper",
    linesBetweenQueries: 2,
  });
}

function DiffTable({ rows }: { rows: DiffRow[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[720px] border-collapse font-mono text-xs sm:text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50 text-left text-muted-foreground">
            <th className="w-12 px-3 py-2">#</th>
            <th className="min-w-[45%] px-3 py-2">Original</th>
            <th className="w-12 px-3 py-2">#</th>
            <th className="min-w-[45%] px-3 py-2">Modified</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={rowClass(row.type)}>
              <td className="border-t border-border/50 px-3 py-1 text-muted-foreground align-top">
                {row.left?.num ?? ""}
              </td>
              <td className="border-t border-border/50 px-3 py-1 whitespace-pre-wrap break-all align-top">
                {row.type === "added" ? (
                  <span className="text-muted-foreground/40">—</span>
                ) : (
                  row.left?.text
                )}
              </td>
              <td className="border-t border-border/50 px-3 py-1 text-muted-foreground align-top">
                {row.right?.num ?? ""}
              </td>
              <td className="border-t border-border/50 px-3 py-1 whitespace-pre-wrap break-all align-top">
                {row.type === "removed" ? (
                  <span className="text-muted-foreground/40">—</span>
                ) : (
                  row.right?.text
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function UnifiedDiff({ rows }: { rows: DiffRow[] }) {
  return (
    <pre className="overflow-x-auto rounded-xl border border-border bg-muted/30 p-4 font-mono text-xs leading-relaxed sm:text-sm">
      {rows.map((row, i) => {
        const prefix =
          row.type === "removed" ? "-" : row.type === "added" ? "+" : " ";
        const text =
          row.type === "added"
            ? row.right?.text
            : row.left?.text ?? row.right?.text;
        const color =
          row.type === "removed"
            ? "text-destructive"
            : row.type === "added"
              ? "text-success"
              : "text-foreground";

        return (
          <div key={i} className={`${rowClass(row.type)} ${color}`}>
            <span className="select-none opacity-60">{prefix} </span>
            {text}
          </div>
        );
      })}
    </pre>
  );
}

export function TextCompareTool() {
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);
  const [ignoreCase, setIgnoreCase] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("split");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const diffOptions = useMemo(
    () => ({ ignoreWhitespace, ignoreCase }),
    [ignoreWhitespace, ignoreCase]
  );

  const rows = useMemo(
    () => computeLineDiff(left, right, diffOptions),
    [left, right, diffOptions]
  );

  const stats = useMemo(() => getDiffStats(rows), [rows]);
  const unified = useMemo(() => toUnifiedDiff(rows), [rows]);

  const applyFormat = useCallback(
    (side: "left" | "right", kind: "json" | "sql") => {
      const text = side === "left" ? left : right;
      if (!text.trim()) {
        setError("Nothing to format on that side.");
        return;
      }
      try {
        const formatted = kind === "json" ? formatJson(text) : formatSql(text);
        if (side === "left") setLeft(formatted);
        else setRight(formatted);
        setError(null);
      } catch (e) {
        setError(
          e instanceof Error
            ? e.message
            : `Failed to format as ${kind.toUpperCase()}.`
        );
      }
    },
    [left, right]
  );

  const handleSwap = useCallback(() => {
    setLeft(right);
    setRight(left);
    setError(null);
  }, [left, right]);

  const handleClear = useCallback(() => {
    setLeft("");
    setRight("");
    setError(null);
  }, []);

  const handleLoadSample = useCallback(() => {
    setLeft(SAMPLE_LEFT);
    setRight(SAMPLE_RIGHT);
    setError(null);
  }, []);

  const handleCopyDiff = useCallback(async () => {
    if (!unified) return;
    await navigator.clipboard.writeText(unified);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [unified]);

  const hasDiff = left.trim() || right.trim();

  return (
    <div className="space-y-3">
      {/* Compact toolbar */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={ignoreWhitespace}
            onChange={(e) => setIgnoreWhitespace(e.target.checked)}
            className="rounded border-input"
          />
          Ignore whitespace
        </label>
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={ignoreCase}
            onChange={(e) => setIgnoreCase(e.target.checked)}
            className="rounded border-input"
          />
          Ignore case
        </label>

        <div className="flex flex-wrap gap-1.5 sm:ml-auto">
          <Button
            variant={viewMode === "split" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("split")}
          >
            Side by side
          </Button>
          <Button
            variant={viewMode === "unified" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("unified")}
          >
            Unified
          </Button>
          <Button variant="outline" size="sm" onClick={handleSwap}>
            <ArrowDownUp className="size-3.5" />
            Swap
          </Button>
          <Button variant="outline" size="sm" onClick={handleLoadSample}>
            Sample
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyDiff}
            disabled={!hasDiff}
          >
            {copied ? (
              <Check className="size-3.5 text-success" />
            ) : (
              <Copy className="size-3.5" />
            )}
            {copied ? "Copied" : "Copy diff"}
          </Button>
          <Button variant="ghost" size="sm" onClick={handleClear}>
            <Trash2 className="size-3.5" />
            Clear
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Big dual paste — the only thing that matters */}
      <div className="grid gap-3 lg:grid-cols-2">
        <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-background">
          <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-1.5">
            <label
              className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
              htmlFor="compare-left"
            >
              Original
            </label>
            <div className="flex gap-0.5">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => applyFormat("left", "sql")}
              >
                <Database className="size-3" />
                SQL
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => applyFormat("left", "json")}
              >
                <Braces className="size-3" />
                JSON
              </Button>
            </div>
          </div>
          <textarea
            id="compare-left"
            value={left}
            onChange={(e) => {
              setLeft(e.target.value);
              setError(null);
            }}
            placeholder="Paste original text…"
            spellCheck={false}
            className="min-h-[min(58vh,560px)] w-full flex-1 resize-y border-0 bg-transparent p-4 font-mono text-sm leading-relaxed outline-none"
          />
        </div>

        <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-background">
          <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-1.5">
            <label
              className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
              htmlFor="compare-right"
            >
              Modified
            </label>
            <div className="flex gap-0.5">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => applyFormat("right", "sql")}
              >
                <Database className="size-3" />
                SQL
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => applyFormat("right", "json")}
              >
                <Braces className="size-3" />
                JSON
              </Button>
            </div>
          </div>
          <textarea
            id="compare-right"
            value={right}
            onChange={(e) => {
              setRight(e.target.value);
              setError(null);
            }}
            placeholder="Paste modified text…"
            spellCheck={false}
            className="min-h-[min(58vh,560px)] w-full flex-1 resize-y border-0 bg-transparent p-4 font-mono text-sm leading-relaxed outline-none"
          />
        </div>
      </div>

      {hasDiff ? (
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="font-medium">Diff</span>
            <span className="text-muted-foreground">
              <span className="text-success">{stats.added} added</span>
              {" · "}
              <span className="text-destructive">{stats.removed} removed</span>
              {" · "}
              {stats.unchanged} unchanged
            </span>
          </div>
          {viewMode === "split" ? (
            <DiffTable rows={rows} />
          ) : (
            <UnifiedDiff rows={rows} />
          )}
        </div>
      ) : (
        <p className="text-center text-sm text-muted-foreground">
          Paste on both sides — or{" "}
          <button
            type="button"
            onClick={handleLoadSample}
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            load sample
          </button>
        </p>
      )}
    </div>
  );
}
