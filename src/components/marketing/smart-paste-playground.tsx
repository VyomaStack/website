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
      className="scroll-mt-16 border-t border-border bg-slate-950 text-white"
    >
      <div className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">
              Paste anything
            </h2>
            <p className="mt-0.5 text-sm text-slate-400">
              We detect SQL, JSON, JWT, YAML, or logs — then format or explain.
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {PASTE_EXAMPLES.map((example) => (
              <button
                key={example.id}
                type="button"
                onClick={() => loadExample(example)}
                className="rounded-md border border-slate-700 bg-slate-900 px-2.5 py-1 text-xs text-slate-300 hover:border-primary/40 hover:text-white"
              >
                {example.label}
              </button>
            ))}
          </div>
        </div>

        <div
          className={cn(
            "rounded-xl border p-3 transition-colors sm:p-4",
            detectFlash ? "border-primary/60" : "border-slate-700"
          )}
        >
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <div
              className={cn(
                "inline-flex items-center gap-1.5 text-xs font-medium",
                hasInput ? "text-primary" : "text-slate-500"
              )}
            >
              <Icon className="size-3.5" />
              {hasInput ? meta.label : "Waiting for paste…"}
            </div>
            {hasInput && (
              <Link
                href={meta.toolHref}
                className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white"
              >
                Open full tool
                <ArrowRight className="size-3" />
              </Link>
            )}
          </div>

          <div className="grid gap-3 lg:grid-cols-2">
            <textarea
              id="smart-paste-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste SQL, JWT, JSON, YAML, or a stack trace…"
              spellCheck={false}
              className="min-h-[160px] w-full resize-y rounded-lg border border-slate-700 bg-slate-950 p-3 font-mono text-xs leading-relaxed text-slate-100 outline-none placeholder:text-slate-600 focus:border-primary/50"
            />

            <div className="min-h-[160px] overflow-auto rounded-lg border border-slate-700 bg-slate-950/80 p-3">
              {!hasInput && (
                <p className="text-xs text-slate-500">Result appears here</p>
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
                <p className="text-xs text-slate-400">
                  No instant transform — try Explain with AI.
                </p>
              )}
              {aiLoading && (
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Loader2 className="size-3.5 animate-spin" />
                  Analyzing…
                </div>
              )}
              {aiError && <p className="text-sm text-red-400">{aiError}</p>}
              {aiResult && !aiLoading && (
                <div className="space-y-2">
                  {aiSource && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase text-slate-400">
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

          {meta.canExplain && hasInput && (
            <div className="mt-3">
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
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
