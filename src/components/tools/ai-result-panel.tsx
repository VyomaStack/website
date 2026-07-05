"use client";

import { useState } from "react";
import { Sparkles, Loader2, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    try {
      const text = await onGenerate();
      setResult(text);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="border-primary/20 bg-primary/[0.02]">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="size-5 text-primary" />
          <CardTitle>{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={handleGenerate} disabled={disabled || loading}>
          {loading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Sparkles className="size-4" />
          )}
          {loading ? "Thinking..." : buttonLabel}
        </Button>

        {error && (
          <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {result && (
          <div className="prose prose-sm dark:prose-invert max-w-none rounded-lg border border-border bg-background p-4">
            <AiMarkdown content={result} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function AiMarkdown({ content }: { content: string }) {
  const lines = content.split("\n");
  return (
    <div className="space-y-2 text-sm leading-relaxed text-foreground">
      {lines.map((line, i) => {
        if (line.startsWith("## ")) {
          return (
            <h3 key={i} className="mt-4 text-base font-semibold first:mt-0">
              {line.replace("## ", "")}
            </h3>
          );
        }
        if (line.startsWith("- ") || line.startsWith("* ")) {
          return (
            <p key={i} className="ml-4 text-muted-foreground">
              • {line.slice(2)}
            </p>
          );
        }
        if (line.trim() === "") return <br key={i} />;
        return (
          <p key={i} className="text-muted-foreground">
            {line}
          </p>
        );
      })}
    </div>
  );
}
