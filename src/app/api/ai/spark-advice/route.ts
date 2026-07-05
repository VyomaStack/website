import { NextResponse } from "next/server";

import { generateAiResponse, isAiConfigured } from "@/lib/ai/client";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      config?: Record<string, unknown>;
      results?: Record<string, unknown>;
      warnings?: string[];
    };

    if (!body.config || !body.results) {
      return NextResponse.json(
        { error: "Config and results are required" },
        { status: 400 }
      );
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

    const systemPrompt = `You are an Apache Spark performance expert with deep experience in memory tuning, executor sizing, and cost optimization on YARN, Kubernetes, and standalone clusters.
Provide actionable recommendations based on the user's Spark memory configuration.
Structure your response with:
## Assessment
## Recommended changes
## Cost & performance trade-offs
## Best practices

Be specific with spark-submit flags and config keys. Keep it practical for data engineers.`;

    const userPrompt = `Spark cluster configuration:
${JSON.stringify(body.config, null, 2)}

Calculated memory breakdown:
${JSON.stringify(body.results, null, 2)}

Warnings detected:
${(body.warnings ?? []).join("\n") || "None"}

Provide tuning recommendations and explain why.`;

    const advice = await generateAiResponse(systemPrompt, userPrompt);

    return NextResponse.json({ advice });
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Failed to generate advice";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
