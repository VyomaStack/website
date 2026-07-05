import { createHash } from "crypto";

const GEMINI_API_KEY =
  process.env.GEMINI_API_KEY ?? process.env.GOOGLE_AI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL ?? "gemini-2.0-flash-lite";

const RETRY_DELAYS_MS = [2000, 5000, 10000];
const CACHE_TTL_MS = 10 * 60 * 1000;

const responseCache = new Map<string, { result: string; expires: number }>();

export function isAiConfigured(): boolean {
  return Boolean(GEMINI_API_KEY);
}

export async function generateAiResponse(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error("AI_NOT_CONFIGURED");
  }

  const cacheKey = hashPrompt(systemPrompt, userPrompt);
  const cached = responseCache.get(cacheKey);
  if (cached && cached.expires > Date.now()) {
    return cached.result;
  }

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt++) {
    if (attempt > 0) {
      await sleep(RETRY_DELAYS_MS[attempt - 1]);
    }

    try {
      const result = await callGemini(systemPrompt, userPrompt);
      responseCache.set(cacheKey, {
        result,
        expires: Date.now() + CACHE_TTL_MS,
      });
      return result;
    } catch (e) {
      lastError = e instanceof Error ? e : new Error("AI request failed");
      const isRateLimit = lastError.message.includes("RATE_LIMIT");
      if (!isRateLimit || attempt === RETRY_DELAYS_MS.length) {
        throw new Error(formatErrorForUser(lastError.message));
      }
    }
  }

  throw new Error(formatErrorForUser(lastError?.message ?? "AI request failed"));
}

async function callGemini(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

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
      return "RATE_LIMIT:Gemini free tier limit hit";
    }
    if (status === 403 || errorStatus === "PERMISSION_DENIED") {
      return "Invalid Gemini API key. Get a free key at aistudio.google.com/apikey";
    }
    if (status === 400 && message?.includes("API key")) {
      return "Invalid Gemini API key. Check GEMINI_API_KEY in Vercel.";
    }
    if (message) return message;
  } catch {
    // fall through
  }
  return `AI request failed (${status})`;
}

function formatErrorForUser(message: string): string {
  if (message.includes("RATE_LIMIT")) {
    return "Gemini free tier limit reached. Wait 30–60 seconds between requests, or try the same query again (cached results return instantly).";
  }
  return message.replace(/^RATE_LIMIT:/, "");
}

function hashPrompt(system: string, user: string): string {
  return createHash("sha256").update(`${system}::${user}`).digest("hex");
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
