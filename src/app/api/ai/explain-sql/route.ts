import { NextResponse } from "next/server";

import { generateAiResponse, isAiConfigured } from "@/lib/ai/client";

export async function POST(request: Request) {
  try {
    const { sql, dialect } = (await request.json()) as {
      sql?: string;
      dialect?: string;
    };

    if (!sql?.trim()) {
      return NextResponse.json({ error: "SQL is required" }, { status: 400 });
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

    const systemPrompt = `You are an expert SQL engineer and database performance specialist.
Explain SQL queries clearly for software engineers. Structure your response with these sections using markdown headers:
## Summary
## Step-by-step breakdown
## Performance notes
## Potential improvements

Be concise but thorough. Use bullet points where helpful. If the dialect is specified, tailor explanations to that engine.`;

    const userPrompt = `Dialect: ${dialect ?? "standard SQL"}

Explain this SQL query:

\`\`\`sql
${sql.trim()}
\`\`\``;

    const explanation = await generateAiResponse(systemPrompt, userPrompt);

    return NextResponse.json({ explanation });
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Failed to generate explanation";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
