"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Braces,
  Clock,
  Database,
  FileCode,
  Key,
  Loader2,
  ScrollText,
  Sparkles,
  Wand2,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { AiMarkdown } from "@/components/tools/ai-markdown";
import type { AiSource } from "@/lib/ai/client";
import {
  detectPasteKind,
  getPasteMeta,
  PASTE_EXAMPLES,
  transformPaste,
  type PasteKind,
} from "@/lib/smart-paste";
import { cn } from "@/lib/utils";

const KIND_ICONS: Record<PasteKind, typeof Database> = {
  sql: Database,
  json: Braces,
  jwt: Key,
  yaml: FileCode,
  log: ScrollText,
  cron: Clock,
  unknown: Wand2,
};

const LOG_HINT = `This looks like a log or stack trace.

Click "Explain with AI" below for root cause, fixes, and Spark configs — or open the full Log Analyzer.`;

export function SmartPastePlayground() {
  const [input, setInput] = useState("");
  const [kind, setKind] = useState<PasteKind>("unknown");
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [detectFlash, setDetectFlash] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [aiSource, setAiSource] = useState<AiSource | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  const meta = useMemo(() => getPasteMeta(kind), [kind]);
  const Icon = KIND_ICONS[kind];
  const hasInput = input.trim().length > 0;

  const runDetection = useCallback((text: string) => {
    const detected = detectPasteKind(text);
    setKind(detected);
    const { output: transformed, error: transformError } = transformPaste(
      text,
      detected
    );
    setOutput(detected === "log" ? LOG_HINT : transformed);
    setError(transformError);
    setAiResult(null);
    setAiSource(null);
    setAiError(null);

    if (text.trim()) {
      setDetectFlash(true);
      window.setTimeout(() => setDetectFlash(false), 600);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => runDetection(input), 200);
    return () => window.clearTimeout(timer);
  }, [input, runDetection]);

  const loadExample = (example: (typeof PASTE_EXAMPLES)[number]) => {
    setInput(example.text);
  };

  const explainWithAi = async () => {
    if (!input.trim() || aiLoading) return;

    setAiLoading(true);
    setAiError(null);

    try {
      const res = await fetch("/api/ai/analyze-selection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input.trim() }),
      });
      const data = (await res.json()) as {
        explanation?: string;
        source?: AiSource;
        error?: string;
      };

      if (!res.ok) {
        throw new Error(data.error ?? "Analysis failed");
      }

      setAiResult(data.explanation ?? "");
      setAiSource(data.source ?? "instant");
    } catch (e) {
      setAiError(e instanceof Error ? e.message : "Analysis failed");
      setAiResult(null);
      setAiSource(null);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <section
      id="try-it"
      className="relative overflow-hidden border-b border-border bg-slate-950 text-white"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-slate-950 to-slate-950" />
      <div className="pointer-events-none absolute -top-24 left-1/2 size-96 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            <Wand2 className="size-3.5" />
            Try it now
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Paste anything. We&apos;ll figure it out.
          </h2>
          <p className="mt-3 text-slate-400">
            SQL, JSON, JWT, YAML, Spark logs, cron — drop it in and watch
            VyomaStack auto-detect, format, or explain. No account. Runs in your
            browser.
          </p>
        </div>

        <div
          className={cn(
            "relative mx-auto mt-10 max-w-5xl rounded-2xl p-[1px] transition-all duration-500",
            detectFlash
              ? "bg-gradient-to-r from-primary via-violet-400 to-cyan-400 shadow-lg shadow-primary/25"
              : "bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700"
          )}
        >
          <div className="rounded-2xl bg-slate-900/95 p-4 sm:p-5">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium transition-all duration-300",
                  hasInput
                    ? "border-primary/50 bg-primary/15 text-primary"
                    : "border-slate-700 bg-slate-800/80 text-slate-400"
                )}
              >
                <Icon className="size-4" />
                {hasInput ? `Detected: ${meta.label}` : "Waiting for paste…"}
              </div>
              {hasInput && (
                <Link
                  href={meta.toolHref}
                  className="inline-flex items-center gap-1 text-sm font-medium text-slate-300 transition-colors hover:text-white"
                >
                  Open {meta.label} tool
                  <ArrowRight className="size-3.5" />
                </Link>
              )}
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div>
                <label
                  htmlFor="smart-paste-input"
                  className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500"
                >
                  Paste here
                </label>
                <textarea
                  id="smart-paste-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Paste SQL, a JWT, JSON, YAML, or a Spark stack trace…"
                  spellCheck={false}
                  className="min-h-[220px] w-full resize-y rounded-xl border border-slate-700 bg-slate-950/80 p-4 font-mono text-xs leading-relaxed text-slate-100 outline-none ring-primary/30 placeholder:text-slate-600 focus:border-primary/50 focus:ring-2"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">
                  {kind === "log" || aiResult ? "AI analysis" : "Instant result"}
                </label>
                <div className="min-h-[220px] overflow-auto rounded-xl border border-slate-700 bg-slate-950/60 p-4">
                  {!hasInput && (
                    <p className="text-sm text-slate-500">
                      Your formatted output or AI explanation appears here.
                    </p>
                  )}

                  {hasInput && error && (
                    <p className="text-sm text-red-400">{error}</p>
                  )}

                  {hasInput && !error && !aiResult && output && (
                    <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-slate-200">
                      {output}
                    </pre>
                  )}

                  {hasInput && !error && !aiResult && !output && kind !== "log" && (
                    <p className="text-sm text-slate-400">
                      No instant transform for this input — try{" "}
                      <strong className="text-slate-200">Explain with AI</strong>.
                    </p>
                  )}

                  {aiLoading && (
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Loader2 className="size-4 animate-spin" />
                      Analyzing…
                    </div>
                  )}

                  {aiError && (
                    <p className="text-sm text-red-400">{aiError}</p>
                  )}

                  {aiResult && !aiLoading && (
                    <div className="space-y-3">
                      {aiSource && (
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                            aiSource === "ai"
                              ? "bg-primary/20 text-primary"
                              : "bg-slate-800 text-slate-300"
                          )}
                        >
                          {aiSource === "ai" ? (
                            <Sparkles className="size-3" />
                          ) : (
                            <Zap className="size-3" />
                          )}
                          {aiSource === "ai" ? "AI" : "Instant"}
                        </span>
                      )}
                      <div className="text-sm text-slate-200">
                        <AiMarkdown content={aiResult} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              {meta.canExplain && hasInput && (
                <Button
                  size="sm"
                  onClick={() => void explainWithAi()}
                  disabled={aiLoading}
                  className="gap-1.5"
                >
                  {aiLoading ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="size-3.5" />
                  )}
                  Explain with AI
                </Button>
              )}

              <div className="flex flex-wrap gap-2">
                {PASTE_EXAMPLES.map((example) => (
                  <button
                    key={example.id}
                    type="button"
                    onClick={() => loadExample(example)}
                    className="rounded-full border border-slate-700 bg-slate-800/60 px-3 py-1 text-xs font-medium text-slate-300 transition-colors hover:border-primary/50 hover:bg-primary/10 hover:text-white"
                  >
                    {example.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          Local format for SQL, JSON, JWT & YAML · AI explain for logs & queries ·
          nothing stored without your click
        </p>
      </div>
    </section>
  );
}
