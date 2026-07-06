import { NextResponse } from "next/server";

import { generateWithFallback } from "@/lib/ai/client";
import {
  analyzeLogOffline,
  LOG_TYPE_LABELS,
  resolveLogType,
  type LogType,
} from "@/lib/ai/log-analyzer";

const SYSTEM_PROMPTS: Record<Exclude<LogType, "auto">, string> = {
  spark: `You are an Apache Spark expert. Analyze error logs for data engineers.
Structure with markdown: ## Root cause, ## What happened, ## How to fix, ## Prevention, ## Relevant Spark configs.
Be specific with spark-submit flags and configuration keys.`,

  "java-spring": `You are a Java and Spring Boot expert. Analyze application logs and stack traces.
Structure with markdown: ## Root cause, ## What happened, ## How to fix, ## Prevention.
Reference Spring Boot configuration keys and common patterns.`,

  generic: `You are a senior software engineer analyzing application logs.
Structure with markdown: ## Summary, ## Key findings, ## Root cause, ## How to fix, ## Prevention.
Extract the most important error lines and explain them clearly.`,
};

export async function POST(request: Request) {
  try {
    const { errorLog, context, logType } = (await request.json()) as {
      errorLog?: string;
      context?: string;
      logType?: LogType;
    };

    if (!errorLog?.trim()) {
      return NextResponse.json({ error: "Log text is required" }, { status: 400 });
    }

    const type = logType ?? "auto";
    const resolvedType = resolveLogType(type, errorLog.trim());
    const label = LOG_TYPE_LABELS[resolvedType];

    const userPrompt = `Log type: ${label}

Analyze this log:

\`\`\`
${errorLog.trim()}
\`\`\`

${context?.trim() ? `Additional context:\n${context.trim()}` : ""}`;

    const { text, source } = await generateWithFallback(
      SYSTEM_PROMPTS[resolvedType],
      userPrompt,
      () => analyzeLogOffline(errorLog.trim(), type).text
    );

    return NextResponse.json({
      explanation: text,
      source,
      resolvedType,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to analyze log";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
