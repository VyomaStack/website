import { NextResponse } from "next/server";

import { generateAiResponse, isAiConfigured } from "@/lib/ai/client";

const GENERATORS = {
  "java-pojo": {
    system: `You are an expert Java engineer. Generate clean Java POJO classes from JSON.
Use Java 17+, proper package name com.vyomastack.generated, Jackson annotations (@JsonProperty where needed), and sensible class names.
Output ONLY code in a single markdown code block with language java. Include a brief one-line comment at top if needed.`,
    user: (json: string, className: string) =>
      `Generate Java POJO classes for this JSON. Root class name: ${className}\n\n\`\`\`json\n${json}\n\`\`\``,
  },
  typescript: {
    system: `You are an expert TypeScript engineer. Generate TypeScript interfaces/types from JSON.
Use strict typing, export all types, prefer interfaces over type aliases for objects.
Output ONLY code in a single markdown code block with language typescript.`,
    user: (json: string, className: string) =>
      `Generate TypeScript interfaces for this JSON. Root type name: ${className}\n\n\`\`\`json\n${json}\n\`\`\``,
  },
  openapi: {
    system: `You are an OpenAPI 3.0 expert. Generate a valid OpenAPI 3.0 YAML schema from JSON sample data.
Infer types, properties, and a sample API path /api/data with GET returning this structure.
Output ONLY YAML in a markdown code block with language yaml.`,
    user: (json: string) =>
      `Generate OpenAPI 3.0 schema from this JSON sample:\n\n\`\`\`json\n${json}\n\`\`\``,
  },
  sql: {
    system: `You are a database engineer. Generate SQL CREATE TABLE statements from JSON structure.
Use PostgreSQL syntax, infer appropriate column types, add primary keys where obvious, use snake_case for columns.
Output ONLY SQL in a markdown code block with language sql.`,
    user: (json: string, className: string) =>
      `Generate PostgreSQL CREATE TABLE statements for this JSON. Table prefix: ${className.toLowerCase()}\n\n\`\`\`json\n${json}\n\`\`\``,
  },
} as const;

export type JsonGenerateType = keyof typeof GENERATORS;

export async function POST(request: Request) {
  try {
    const { json, type, className } = (await request.json()) as {
      json?: string;
      type?: JsonGenerateType;
      className?: string;
    };

    if (!json?.trim()) {
      return NextResponse.json({ error: "JSON is required" }, { status: 400 });
    }

    if (!type || !(type in GENERATORS)) {
      return NextResponse.json({ error: "Invalid generation type" }, { status: 400 });
    }

    JSON.parse(json);

    if (!isAiConfigured()) {
      return NextResponse.json(
        {
          error:
            "AI is not configured. Add OPENAI_API_KEY to your environment variables.",
        },
        { status: 503 }
      );
    }

    const generator = GENERATORS[type];
    const rootName = className?.trim() || "RootModel";
    const result = await generateAiResponse(
      generator.system,
      generator.user(json.trim(), rootName)
    );

    return NextResponse.json({ result });
  } catch (e) {
    if (e instanceof SyntaxError) {
      return NextResponse.json({ error: "Invalid JSON input" }, { status: 400 });
    }
    const message = e instanceof Error ? e.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
