import { NextResponse } from "next/server";

import { generateWithFallback } from "@/lib/ai/client";
import { explainSqlOffline } from "@/lib/ai/fallbacks/sql-explain";

export async function POST(request: Request) {
  try {
    const { sql, dialect } = (await request.json()) as {
      sql?: string;
      dialect?: string;
    };

    if (!sql?.trim()) {
      return NextResponse.json({ error: "SQL is required" }, { status: 400 });
    }

    const dialectLabel = dialect ?? "standard SQL";

    const systemPrompt = `You are an expert SQL engineer and database performance specialist.
Explain SQL queries clearly for software engineers. Structure your response with these sections using markdown headers:
## Summary
## Step-by-step breakdown
## Performance notes
## Potential improvements

Be concise but thorough. Use bullet points where helpful. If the dialect is specified, tailor explanations to that engine.`;

    const userPrompt = `Dialect: ${dialectLabel}

Explain this SQL query:

\`\`\`sql
${sql.trim()}
\`\`\``;

    const { text, source } = await generateWithFallback(
      systemPrompt,
      userPrompt,
      () => explainSqlOffline(sql.trim(), dialectLabel)
    );

    return NextResponse.json({ explanation: text, source });
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Failed to generate explanation";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
