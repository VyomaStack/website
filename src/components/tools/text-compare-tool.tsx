"use client";

import { useCallback, useMemo, useState } from "react";
import { format } from "sql-formatter";
import {
  ArrowDownUp,
  Braces,
  Copy,
  Check,
  Database,
  GitCompare,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  if (type === "removed") {
    return "bg-destructive/10";
  }
  if (type === "added") {
    return "bg-success/10";
  }
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
    <div className="overflow-x-auto rounded-lg border border-input">
      <table className="w-full min-w-[640px] border-collapse font-mono text-xs">
        <thead>
          <tr className="border-b border-input bg-muted/50 text-left text-muted-foreground">
            <th className="w-10 px-2 py-2">#</th>
            <th className="min-w-[45%] px-2 py-2">Original</th>
            <th className="w-10 px-2 py-2">#</th>
            <th className="min-w-[45%] px-2 py-2">Modified</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={rowClass(row.type)}>
              <td className="border-t border-input/50 px-2 py-1 text-muted-foreground align-top">
                {row.left?.num ?? ""}
              </td>
              <td className="border-t border-input/50 px-2 py-1 whitespace-pre-wrap break-all align-top text-foreground">
                {row.type === "added" ? (
                  <span className="text-muted-foreground/40">—</span>
                ) : (
                  row.left?.text
                )}
              </td>
              <td className="border-t border-input/50 px-2 py-1 text-muted-foreground align-top">
                {row.right?.num ?? ""}
              </td>
              <td className="border-t border-input/50 px-2 py-1 whitespace-pre-wrap break-all align-top text-foreground">
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
    <pre className="overflow-x-auto rounded-lg border border-input bg-muted/30 p-4 font-mono text-xs leading-relaxed">
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
  const [left, setLeft] = useState(SAMPLE_LEFT);
  const [right, setRight] = useState(SAMPLE_RIGHT);
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
        if (side === "left") {
          setLeft(formatted);
        } else {
          setRight(formatted);
        }
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Text Compare & Diff</CardTitle>
          <CardDescription>
            Compare two texts side by side. Format SQL or JSON before diffing.
            Runs entirely in your browser.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={ignoreWhitespace}
                onChange={(e) => setIgnoreWhitespace(e.target.checked)}
                className="rounded border-input"
              />
              Ignore whitespace
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={ignoreCase}
                onChange={(e) => setIgnoreCase(e.target.checked)}
                className="rounded border-input"
              />
              Ignore case
            </label>

            <div className="flex flex-wrap gap-2 sm:ml-auto">
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
                <ArrowDownUp className="size-4" />
                Swap
              </Button>
              <Button variant="outline" size="sm" onClick={handleLoadSample}>
                Sample
              </Button>
              <Button variant="outline" size="sm" onClick={handleCopyDiff}>
                {copied ? (
                  <Check className="size-4 text-success" />
                ) : (
                  <Copy className="size-4" />
                )}
                {copied ? "Copied" : "Copy diff"}
              </Button>
              <Button variant="ghost" size="sm" onClick={handleClear}>
                <Trash2 className="size-4" />
                Clear
              </Button>
            </div>
          </div>

          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="text-sm font-medium" htmlFor="compare-left">
                  Original (left)
                </label>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => applyFormat("left", "sql")}
                  >
                    <Database className="size-3.5" />
                    SQL
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => applyFormat("left", "json")}
                  >
                    <Braces className="size-3.5" />
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
                placeholder="Paste original text..."
                spellCheck={false}
                className="min-h-[240px] w-full resize-y rounded-lg border border-input bg-transparent p-3 font-mono text-sm leading-relaxed outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="text-sm font-medium" htmlFor="compare-right">
                  Modified (right)
                </label>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => applyFormat("right", "sql")}
                  >
                    <Database className="size-3.5" />
                    SQL
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => applyFormat("right", "json")}
                  >
                    <Braces className="size-3.5" />
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
                placeholder="Paste modified text..."
                spellCheck={false}
                className="min-h-[240px] w-full resize-y rounded-lg border border-input bg-transparent p-3 font-mono text-sm leading-relaxed outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </div>
          </div>

          {hasDiff && (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="flex items-center gap-1.5 font-medium">
                  <GitCompare className="size-4 text-primary" />
                  Diff results
                </span>
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
          )}
        </CardContent>
      </Card>

      <Card size="sm">
        <CardHeader>
          <CardTitle>How it works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            <strong className="text-foreground">Compare</strong> — line-by-line
            diff updates as you type. Green = added, red = removed.
          </p>
          <p>
            <strong className="text-foreground">Format</strong> — beautify SQL or
            JSON on either side before comparing config, queries, or API payloads.
          </p>
          <p>
            <strong className="text-foreground">Private</strong> — all diffing runs
            locally in your browser. Nothing is uploaded.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
