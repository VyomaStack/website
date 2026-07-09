export function decodeJwt(token: string): string {
  const parts = token.trim().split(".");
  if (parts.length < 2) {
    throw new Error("Invalid JWT — expected header.payload.signature");
  }

  const decodePart = (part: string) => {
    const padded = part.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(padded.padEnd(padded.length + ((4 - (padded.length % 4)) % 4), "="));
    return JSON.stringify(JSON.parse(json), null, 2);
  };

  return [
    "=== HEADER ===",
    decodePart(parts[0]!),
    "",
    "=== PAYLOAD ===",
    decodePart(parts[1]!),
    parts[2] ? "\n=== SIGNATURE ===\n(present — not verified)" : "",
  ]
    .filter(Boolean)
    .join("\n");
}

export function formatJson(text: string, indent = 2): string {
  return JSON.stringify(JSON.parse(text) as unknown, null, indent);
}

export function minifyJson(text: string): string {
  return JSON.stringify(JSON.parse(text) as unknown);
}
