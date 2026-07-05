import { NextResponse } from "next/server";

import { generateAiResponse, isAiConfigured } from "@/lib/ai/client";

export async function POST(request: Request) {
  try {
    const { errorLog, context } = (await request.json()) as {
      errorLog?: string;
      context?: string;
    };

    if (!errorLog?.trim()) {
      return NextResponse.json({ error: "Error log is required" }, { status: 400 });
    }

    if (!isAiConfigured()) {
      return NextResponse.json(
        {
          error:
            "AI is not configured. Add OPENAI_API_KEY to your environment variables.",
        },
        { status: 503 }
      );
    }

    const systemPrompt = `You are an Apache Spark expert who debugs production failures daily.
Analyze Spark error logs and stack traces for data engineers. Structure your response with markdown headers:
## Root cause
## What happened
## How to fix
## Prevention & best practices
## Relevant Spark configs

Be specific with spark-submit flags, config keys, and code changes. Mention YARN/K8s considerations when relevant.`;

    const userPrompt = `Analyze this Spark error:

\`\`\`
${errorLog.trim()}
\`\`\`

${context?.trim() ? `Additional context from the user:\n${context.trim()}` : ""}`;

    const explanation = await generateAiResponse(systemPrompt, userPrompt);

    return NextResponse.json({ explanation });
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Failed to analyze error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
