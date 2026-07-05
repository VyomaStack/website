const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

export function isAiConfigured(): boolean {
  return Boolean(OPENAI_API_KEY);
}

export async function generateAiResponse(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  if (!OPENAI_API_KEY) {
    throw new Error("AI_NOT_CONFIGURED");
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      temperature: 0.3,
      max_tokens: 1500,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(parseOpenAiError(response.status, errText));
  }

  const data = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };

  const content = data.choices?.[0]?.message?.content?.trim();
  if (!content) throw new Error("Empty AI response");
  return content;
}

function parseOpenAiError(status: number, body: string): string {
  try {
    const parsed = JSON.parse(body) as {
      error?: { message?: string; code?: string; type?: string };
    };
    const code = parsed.error?.code;
    const message = parsed.error?.message;

    if (code === "insufficient_quota" || status === 429) {
      return "OpenAI quota exceeded. Add billing and credits at platform.openai.com/settings/billing, then try again.";
    }
    if (status === 401) {
      return "Invalid OpenAI API key. Check OPENAI_API_KEY in Vercel environment variables.";
    }
    if (status === 429) {
      return "OpenAI rate limit hit. Wait a moment and try again.";
    }
    if (message) return message;
  } catch {
    // fall through
  }
  return `AI request failed (${status}). Check your OpenAI account billing and API key.`;
}
