import { createHash } from "crypto";

const GEMINI_API_KEY =
  process.env.GEMINI_API_KEY ?? process.env.GOOGLE_AI_API_KEY;

const MODEL_CHAIN = (
  process.env.GEMINI_MODEL
    ? [process.env.GEMINI_MODEL]
    : ["gemini-2.0-flash-lite", "gemini-2.0-flash"]
) as string[];

const RETRY_DELAYS_MS = [1500, 3000];
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour — helps across warm instances

const responseCache = new Map<string, { result: string; expires: number }>();

export type AiSource = "ai" | "instant";

export interface AiResponse {
  text: string;
  source: AiSource;
}

export function isAiConfigured(): boolean {
  return Boolean(GEMINI_API_KEY);
}

export function isRateLimitError(message: string): boolean {
  const lower = message.toLowerCase();
  return (
    lower.includes("rate_limit") ||
    lower.includes("rate limit") ||
    lower.includes("resource_exhausted") ||
    lower.includes("quota") ||
    lower.includes("free tier")
  );
}

/**
 * Try Gemini first; on rate limit / outage, return instant fallback so users always get a result.
 */
export async function generateWithFallback(
  systemPrompt: string,
  userPrompt: string,
  fallback: () => string
): Promise<AiResponse> {
  if (!GEMINI_API_KEY) {
    return { text: fallback(), source: "instant" };
  }

  const cacheKey = hashPrompt(systemPrompt, userPrompt);
  const cached = responseCache.get(cacheKey);
  if (cached && cached.expires > Date.now()) {
    return { text: cached.result, source: "ai" };
  }

  try {
    const text = await generateAiResponseRaw(systemPrompt, userPrompt);
    responseCache.set(cacheKey, {
      result: text,
      expires: Date.now() + CACHE_TTL_MS,
    });
    return { text, source: "ai" };
  } catch {
    // Any AI failure (rate limit, bad model, invalid key) → instant fallback
    return { text: fallback(), source: "instant" };
  }
}

async function generateAiResponseRaw(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  let lastError: Error | null = null;

  for (const model of MODEL_CHAIN) {
    for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt++) {
      if (attempt > 0) {
        await sleep(RETRY_DELAYS_MS[attempt - 1]);
      }

      try {
        return await callGemini(model, systemPrompt, userPrompt);
      } catch (e) {
        lastError = e instanceof Error ? e : new Error("AI request failed");
        const isRateLimit = isRateLimitError(lastError.message);
        if (!isRateLimit) break; // try next model on non-rate-limit errors
      }
    }
  }

  throw lastError ?? new Error("AI request failed");
}

async function callGemini(
  model: string,
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system_instruction: {
        parts: [{ text: systemPrompt }],
      },
      contents: [
        {
          role: "user",
          parts: [{ text: userPrompt }],
        },
      ],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 1024,
      },
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(parseGeminiError(response.status, errText));
  }

  const data = (await response.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };

  const content = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  if (!content) throw new Error("Empty AI response");
  return content;
}

function parseGeminiError(status: number, body: string): string {
  try {
    const parsed = JSON.parse(body) as {
      error?: { message?: string; status?: string };
    };
    const message = parsed.error?.message;
    const errorStatus = parsed.error?.status;

    if (status === 429 || errorStatus === "RESOURCE_EXHAUSTED") {
      return "RATE_LIMIT:Gemini quota exhausted";
    }
    if (status === 403 || errorStatus === "PERMISSION_DENIED") {
      return "Invalid Gemini API key";
    }
    if (status === 400 && message?.includes("API key")) {
      return "Invalid Gemini API key";
    }
    if (message) return message;
  } catch {
    // fall through
  }
  return `AI request failed (${status})`;
}

function formatErrorForUser(message: string): string {
  if (isRateLimitError(message)) {
    return "AI is temporarily busy. Instant analysis was used instead.";
  }
  return message.replace(/^RATE_LIMIT:/, "");
}

function hashPrompt(system: string, user: string): string {
  return createHash("sha256").update(`${system}::${user}`).digest("hex");
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Legacy export for any direct usage
export async function generateAiResponse(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  return generateAiResponseRaw(systemPrompt, userPrompt);
}
