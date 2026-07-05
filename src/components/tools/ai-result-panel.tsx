"use client";

import { useState } from "react";
import { Sparkles, Loader2, AlertCircle, Copy, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AiMarkdown } from "@/components/tools/ai-markdown";
import { useAiCooldown } from "@/hooks/use-ai-cooldown";

interface AiResultPanelProps {
  title: string;
  description: string;
  buttonLabel: string;
  onGenerate: () => Promise<string>;
  disabled?: boolean;
}

export function AiResultPanel({
  title,
  description,
  buttonLabel,
  onGenerate,
  disabled,
}: AiResultPanelProps) {
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    cooldown,
    canRequest,
    isRateLimitError,
    triggerCooldown,
    cooldownLabel,
  } = useAiCooldown();

  async function handleGenerate() {
    if (!canRequest) return;
    setLoading(true);
    setError(null);
    try {
      const text = await onGenerate();
      setResult(text);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Something went wrong";
      setError(message);
      setResult(null);
      if (isRateLimitError(message)) triggerCooldown();
    } finally {
      setLoading(false);
    }
  }

  const buttonDisabled = disabled || loading || !canRequest;

  return (
    <Card className="border-primary/20 bg-primary/[0.02]">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="size-5 text-primary" />
          <CardTitle>{title}</CardTitle>
        </div>
        <CardDescription>
          {description} Free tier: ~15 requests/min — wait a few seconds between
          clicks.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={handleGenerate} disabled={buttonDisabled}>
          {loading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Sparkles className="size-4" />
          )}
          {loading
            ? "Thinking..."
            : cooldownLabel ?? buttonLabel}
        </Button>

        {error && (
          <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {cooldown > 0 && !error && (
          <p className="text-sm text-muted-foreground">
            Cooldown: {cooldown}s remaining before next request.
          </p>
        )}

        {result && (
          <div className="rounded-lg border border-border bg-background p-4">
            <AiMarkdown content={result} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface AiCodePanelProps {
  title: string;
  description: string;
  generateLabel: string;
  types: { value: string; label: string }[];
  onGenerate: (type: string, className?: string) => Promise<string>;
  disabled?: boolean;
  classNameField?: boolean;
  defaultClassName?: string;
}

export function AiCodePanel({
  title,
  description,
  generateLabel,
  types,
  onGenerate,
  disabled,
  classNameField,
  defaultClassName = "RootModel",
}: AiCodePanelProps) {
  const [type, setType] = useState(types[0]?.value ?? "");
  const [className, setClassName] = useState(defaultClassName);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const {
    cooldown,
    canRequest,
    isRateLimitError,
    triggerCooldown,
    cooldownLabel,
  } = useAiCooldown();

  async function handleGenerate() {
    if (!canRequest) return;
    setLoading(true);
    setError(null);
    try {
      const text = await onGenerate(type, className);
      setResult(text);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Something went wrong";
      setError(message);
      setResult(null);
      if (isRateLimitError(message)) triggerCooldown();
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    if (!result) return;
    const code = extractCode(result);
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const buttonDisabled = disabled || loading || !canRequest;

  return (
    <Card className="border-primary/20 bg-primary/[0.02]">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="size-5 text-primary" />
          <CardTitle>{title}</CardTitle>
        </div>
        <CardDescription>
          {description} Free tier: wait a few seconds between generations.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="h-8 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {types.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>

          {classNameField && (
            <input
              type="text"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              placeholder="Class name"
              className="h-8 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          )}

          <Button onClick={handleGenerate} disabled={buttonDisabled}>
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Sparkles className="size-4" />
            )}
            {loading
              ? "Generating..."
              : cooldownLabel ?? generateLabel}
          </Button>
        </div>

        {error && (
          <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {result && (
          <div className="space-y-2">
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={handleCopy}>
                {copied ? (
                  <Check className="size-4 text-success" />
                ) : (
                  <Copy className="size-4" />
                )}
                {copied ? "Copied" : "Copy code"}
              </Button>
            </div>
            <AiMarkdown content={result} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function extractCode(content: string): string {
  const match = content.match(/```[\w]*\n([\s\S]*?)```/);
  return match ? match[1].trim() : content;
}
