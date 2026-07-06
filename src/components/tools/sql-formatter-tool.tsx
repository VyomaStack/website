"use client";

import { useCallback, useState } from "react";
import { format, type FormatOptionsWithLanguage } from "sql-formatter";
import {
  AlignLeft,
  Copy,
  Download,
  Minimize2,
  Check,
  AlertCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AiResultPanel } from "@/components/tools/ai-result-panel";

const DIALECTS: { label: string; value: FormatOptionsWithLanguage["language"] }[] =
  [
    { label: "Standard SQL", value: "sql" },
    { label: "MySQL", value: "mysql" },
    { label: "PostgreSQL", value: "postgresql" },
    { label: "MariaDB", value: "mariadb" },
    { label: "SQL Server (T-SQL)", value: "tsql" },
    { label: "Spark SQL", value: "spark" },
    { label: "Redshift", value: "redshift" },
    { label: "BigQuery", value: "bigquery" },
    { label: "SQLite", value: "sqlite" },
    { label: "PL/SQL", value: "plsql" },
  ];

const SAMPLE_SQL = `SELECT u.id, u.name, COUNT(o.id) AS order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.active = true AND o.created_at >= '2024-01-01'
GROUP BY u.id, u.name
HAVING COUNT(o.id) > 0
ORDER BY order_count DESC
LIMIT 10;`;

function minifySql(sql: string): string {
  return sql
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/--.*$/gm, "")
    .replace(/\s+/g, " ")
    .trim();
}

function formatSqlOutput(
  sql: string,
  dialect: FormatOptionsWithLanguage["language"]
): string {
  return format(sql, {
    language: dialect,
    tabWidth: 2,
    keywordCase: "upper",
    linesBetweenQueries: 2,
  });
}

export function SqlFormatterTool() {
  const [input, setInput] = useState(SAMPLE_SQL);
  const [output, setOutput] = useState(() => formatSqlOutput(SAMPLE_SQL, "sql"));
  const [dialect, setDialect] =
    useState<FormatOptionsWithLanguage["language"]>("sql");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleFormat = useCallback(() => {
    if (!input.trim()) {
      setOutput("");
      setError("Please enter a SQL query.");
      return;
    }
    try {
      setOutput(formatSqlOutput(input, dialect));
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to format SQL.");
      setOutput("");
    }
  }, [input, dialect]);

  const handleMinify = useCallback(() => {
    if (!input.trim()) {
      setOutput("");
      setError("Please enter a SQL query.");
      return;
    }
    try {
      const formatted = format(input, {
        language: dialect,
        tabWidth: 0,
        useTabs: false,
        keywordCase: "upper",
      });
      setOutput(minifySql(formatted));
      setError(null);
    } catch {
      setOutput(minifySql(input));
      setError(null);
    }
  }, [input, dialect]);

  const handleCopy = useCallback(async () => {
    const text = output || input;
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [output, input]);

  const handleDownload = useCallback(() => {
    const text = output || input;
    if (!text) return;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "query.sql";
    a.click();
    URL.revokeObjectURL(url);
  }, [output, input]);

  const handleClear = useCallback(() => {
    setInput("");
    setOutput("");
    setError(null);
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>SQL Formatter & Beautifier</CardTitle>
          <CardDescription>
            Format or minify SQL instantly. Runs 100% in your browser — nothing
            is sent to a server.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <label className="text-sm font-medium" htmlFor="dialect">
              Dialect
            </label>
            <select
              id="dialect"
              value={dialect}
              onChange={(e) =>
                setDialect(e.target.value as FormatOptionsWithLanguage["language"])
              }
              className="h-8 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {DIALECTS.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>

            <div className="flex flex-wrap gap-2 sm:ml-auto">
              <Button onClick={handleFormat}>
                <AlignLeft className="size-4" />
                Format
              </Button>
              <Button variant="outline" onClick={handleMinify}>
                <Minimize2 className="size-4" />
                Minify
              </Button>
              <Button variant="outline" onClick={handleCopy}>
                {copied ? (
                  <Check className="size-4 text-success" />
                ) : (
                  <Copy className="size-4" />
                )}
                {copied ? "Copied" : "Copy"}
              </Button>
              <Button variant="outline" onClick={handleDownload}>
                <Download className="size-4" />
                Download
              </Button>
              <Button variant="ghost" onClick={handleClear}>
                Clear
              </Button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              <AlertCircle className="size-4 shrink-0" />
              {error}
            </div>
          )}

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="sql-input">
                Input SQL
              </label>
              <textarea
                id="sql-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste your SQL query here..."
                spellCheck={false}
                className="min-h-[320px] w-full resize-y rounded-lg border border-input bg-transparent p-3 font-mono text-sm leading-relaxed outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="sql-output">
                Output
              </label>
              <textarea
                id="sql-output"
                value={output}
                readOnly
                placeholder="Formatted SQL will appear here..."
                spellCheck={false}
                className="min-h-[320px] w-full resize-y rounded-lg border border-input bg-muted/30 p-3 font-mono text-sm leading-relaxed outline-none"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card size="sm">
        <CardHeader>
          <CardTitle>How it works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            <strong className="text-foreground">Format</strong> — beautifies SQL
            with proper indentation, line breaks, and uppercase keywords.
          </p>
          <p>
            <strong className="text-foreground">Minify</strong> — compresses SQL
            into a single line for storage or transmission.
          </p>
          <p>
            <strong className="text-foreground">Format</strong> runs locally in
            your browser. <strong className="text-foreground">AI Explain</strong>{" "}
            sends your query to our AI for analysis (optional).
          </p>
        </CardContent>
      </Card>

      <AiResultPanel
        title="AI SQL Explain"
        description="Plain-English explanation, performance notes, and improvements. Works instantly — AI-enhanced when available."
        buttonLabel="Explain SQL with AI"
        disabled={!input.trim()}
        onGenerate={async () => {
          const res = await fetch("/api/ai/explain-sql", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sql: input, dialect }),
          });
          const data = (await res.json()) as {
            explanation?: string;
            source?: "ai" | "instant";
            error?: string;
          };
          if (!res.ok) throw new Error(data.error ?? "Request failed");
          return {
            text: data.explanation ?? "",
            source: data.source,
          };
        }}
      />
    </div>
  );
}
