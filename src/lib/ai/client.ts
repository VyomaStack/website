const GEMINI_API_KEY =
  process.env.GEMINI_API_KEY ?? process.env.GOOGLE_AI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL ?? "gemini-2.0-flash";

const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

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

  const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
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
        maxOutputTokens: 2048,
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
      error?: { message?: string; status?: string; code?: number };
    };
    const message = parsed.error?.message;
    const errorStatus = parsed.error?.status;

    if (status === 429 || errorStatus === "RESOURCE_EXHAUSTED") {
      return "Gemini rate limit reached. Free tier allows limited requests per minute — wait 60 seconds and try again.";
    }
    if (status === 403 || errorStatus === "PERMISSION_DENIED") {
      return "Invalid Gemini API key. Get a free key at aistudio.google.com/apikey and add GEMINI_API_KEY in Vercel.";
    }
    if (status === 400 && message?.includes("API key")) {
      return "Invalid Gemini API key. Check GEMINI_API_KEY in Vercel environment variables.";
    }
    if (message) return message;
  } catch {
    // fall through
  }
  return `AI request failed (${status}). Check your Gemini API key at aistudio.google.com/apikey`;
}
