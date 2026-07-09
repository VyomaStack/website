const API_BASE = "https://www.vyomastack.com";

export type AnalyzeResponse = {
  explanation: string;
  source: "ai" | "instant";
  kind: "sql" | "log" | "generic";
  label: string;
  resolvedType?: string;
};

export async function analyzeSelection(text: string): Promise<AnalyzeResponse> {
  const res = await fetch(`${API_BASE}/api/ai/analyze-selection`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  const data = (await res.json()) as AnalyzeResponse & { error?: string };

  if (!res.ok) {
    throw new Error(data.error ?? "Analysis failed");
  }

  return data;
}
