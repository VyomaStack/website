import { NextResponse } from "next/server";

import { generateWithFallback } from "@/lib/ai/client";
import {
  detectSelectionKind,
  SELECTION_KIND_LABELS,
  type SelectionKind,
} from "@/lib/ai/detect-selection";
import { explainSqlOffline } from "@/lib/ai/fallbacks/sql-explain";
import {
  analyzeLogOffline,
  LOG_TYPE_LABELS,
  resolveLogType,
} from "@/lib/ai/log-analyzer";
import { explainGenericLogOffline } from "@/lib/ai/fallbacks/generic-log";

const LOG_SYSTEM_PROMPTS = {
  spark: `You are an Apache Spark expert. Analyze error logs for data engineers.
Structure with markdown: ## Root cause, ## What happened, ## How to fix, ## Prevention, ## Relevant Spark configs.
Be specific with spark-submit flags and configuration keys.`,

  "java-spring": `You are a Java and Spring Boot expert. Analyze application logs and stack traces.
Structure with markdown: ## Root cause, ## What happened, ## How to fix, ## Prevention.
Reference Spring Boot configuration keys and common patterns.`,

  generic: `You are a senior software engineer analyzing application logs.
Structure with markdown: ## Summary, ## Key findings, ## Root cause, ## How to fix, ## Prevention.
Extract the most important error lines and explain them clearly.`,
} as const;

const SQL_SYSTEM_PROMPT = `You are an expert SQL engineer and database performance specialist.
Explain SQL queries clearly for software engineers. Structure your response with these sections using markdown headers:
## Summary
## Step-by-step breakdown
## Performance notes
## Potential improvements

Be concise but thorough. Use bullet points where helpful.`;

const GENERIC_SYSTEM_PROMPT = `You are a senior software engineer helping developers understand technical text.
Structure with markdown: ## Summary, ## Key points, ## Suggested next steps.
Be concise and practical.`;

export async function POST(request: Request) {
  try {
    const { text, context } = (await request.json()) as {
      text?: string;
      context?: string;
    };

    if (!text?.trim()) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const trimmed = text.trim();
    const kind = detectSelectionKind(trimmed);
    const contextBlock = context?.trim()
      ? `\n\nAdditional context:\n${context.trim()}`
      : "";

    if (kind === "sql") {
      const userPrompt = `Explain this SQL query:

\`\`\`sql
${trimmed}
\`\`\`${contextBlock}`;

      const { text: explanation, source } = await generateWithFallback(
        SQL_SYSTEM_PROMPT,
        userPrompt,
        () => explainSqlOffline(trimmed, "standard SQL")
      );

      return NextResponse.json({
        explanation,
        source,
        kind,
        label: SELECTION_KIND_LABELS.sql,
      });
    }

    if (kind === "log") {
      const resolvedType = resolveLogType("auto", trimmed);
      const label = LOG_TYPE_LABELS[resolvedType];

      const userPrompt = `Log type: ${label}

Analyze this log:

\`\`\`
${trimmed}
\`\`\`${contextBlock}`;

      const { text: explanation, source } = await generateWithFallback(
        LOG_SYSTEM_PROMPTS[resolvedType],
        userPrompt,
        () => analyzeLogOffline(trimmed, "auto").text
      );

      return NextResponse.json({
        explanation,
        source,
        kind,
        label,
        resolvedType,
      });
    }

    const userPrompt = `Explain or summarize this for a software engineer:

\`\`\`
${trimmed}
\`\`\`${contextBlock}`;

    const { text: explanation, source } = await generateWithFallback(
      GENERIC_SYSTEM_PROMPT,
      userPrompt,
      () => explainGenericLogOffline(trimmed)
    );

    return NextResponse.json({
      explanation,
      source,
      kind: "generic" satisfies SelectionKind,
      label: SELECTION_KIND_LABELS.generic,
    });
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Failed to analyze selection";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
