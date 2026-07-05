import { md5 } from "@/lib/md5";

export type HashAlgorithm = "MD5" | "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512";

export const HASH_ALGORITHMS: HashAlgorithm[] = [
  "MD5",
  "SHA-1",
  "SHA-256",
  "SHA-384",
  "SHA-512",
];

const SUBTLE_ALGORITHMS: Record<
  Exclude<HashAlgorithm, "MD5">,
  AlgorithmIdentifier
> = {
  "SHA-1": "SHA-1",
  "SHA-256": "SHA-256",
  "SHA-384": "SHA-384",
  "SHA-512": "SHA-512",
};

function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function hashText(
  input: string,
  algorithm: HashAlgorithm
): Promise<string> {
  if (algorithm === "MD5") {
    return md5(input);
  }

  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest(SUBTLE_ALGORITHMS[algorithm], data);
  return bufferToHex(digest);
}

export async function hashAll(input: string): Promise<Record<HashAlgorithm, string>> {
  const entries = await Promise.all(
    HASH_ALGORITHMS.map(async (algorithm) => [algorithm, await hashText(input, algorithm)] as const)
  );
  return Object.fromEntries(entries) as Record<HashAlgorithm, string>;
}
