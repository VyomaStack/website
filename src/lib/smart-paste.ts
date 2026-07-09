import { format } from "sql-formatter";
import { parse as parseYaml, stringify as stringifyYaml } from "yaml";

import { detectSelectionKind } from "@/lib/ai/detect-selection";
import { isLogLikeText } from "@/lib/ai/log-patterns";

export type PasteKind =
  | "sql"
  | "json"
  | "jwt"
  | "yaml"
  | "log"
  | "cron"
  | "unknown";

export type PasteExample = {
  id: string;
  label: string;
  kind: PasteKind;
  text: string;
};

export const PASTE_EXAMPLES: PasteExample[] = [
  {
    id: "spark-oom",
    label: "Spark OOM",
    kind: "log",
    text: `ERROR org.apache.spark.SparkException: Job aborted due to stage failure
Caused by: org.apache.spark.memory.SparkOutOfMemoryError: Unable to acquire 65536 bytes of memory
  at org.apache.spark.shuffle.sort.ShuffleExternalSorter.growPointerArray`,
  },
  {
    id: "messy-sql",
    label: "Messy SQL",
    kind: "sql",
    text: `select u.id,u.name,count(o.id) from users u left join orders o on u.id=o.user_id where u.active=true group by u.id,u.name having count(o.id)>0 order by 2 desc limit 10`,
  },
  {
    id: "jwt",
    label: "JWT token",
    kind: "jwt",
    text: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
  },
  {
    id: "k8s-yaml",
    label: "K8s YAML",
    kind: "yaml",
    text: `apiVersion: v1\nkind: Pod\nmetadata:\n  name: spark-driver\nspec:\n  containers:\n  - name: spark\n    image: spark:3.5\n    resources:\n      limits:\n        memory: 4Gi`,
  },
  {
    id: "json-blob",
    label: "JSON blob",
    kind: "json",
    text: '{"event":"pipeline_failed","job":"daily_etl","error":"OOM","retries":3,"spark":{"executor_memory":"4g","shuffle_partitions":200}}',
  },
];

const PASTE_META: Record<
  PasteKind,
  { label: string; toolHref: string; canExplain: boolean }
> = {
  sql: { label: "SQL query", toolHref: "/tools/sql-formatter", canExplain: true },
  json: { label: "JSON", toolHref: "/tools/json-formatter", canExplain: false },
  jwt: { label: "JWT token", toolHref: "/tools/jwt-decoder", canExplain: false },
  yaml: { label: "YAML", toolHref: "/tools/yaml-formatter", canExplain: false },
  log: { label: "Log / error", toolHref: "/tools/log-analyzer", canExplain: true },
  cron: { label: "Cron expression", toolHref: "/tools/cron-generator", canExplain: false },
  unknown: { label: "Text", toolHref: "/tools", canExplain: true },
};

function decodeBase64Url(segment: string): string {
  const padded = segment.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4;
  const base64 = pad ? padded + "=".repeat(4 - pad) : padded;
  return decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );
}

function looksLikeJwt(text: string): boolean {
  const trimmed = text.trim();
  const parts = trimmed.split(".");
  if (parts.length !== 3) return false;
  if (!/^[A-Za-z0-9_-]+$/.test(parts[0] + parts[1] + parts[2])) return false;
  try {
    JSON.parse(decodeBase64Url(parts[0]));
    JSON.parse(decodeBase64Url(parts[1]));
    return true;
  } catch {
    return false;
  }
}

function looksLikeJson(text: string): boolean {
  const trimmed = text.trim();
  if (!(trimmed.startsWith("{") || trimmed.startsWith("["))) return false;
  try {
    JSON.parse(trimmed);
    return true;
  } catch {
    return false;
  }
}

function looksLikeYaml(text: string): boolean {
  const trimmed = text.trim();
  if (looksLikeJson(trimmed)) return false;
  if (!/^[a-zA-Z0-9_-]+:\s/m.test(trimmed)) return false;
  try {
    parseYaml(trimmed);
    return true;
  } catch {
    return false;
  }
}

function looksLikeCron(text: string): boolean {
  const trimmed = text.trim();
  const parts = trimmed.split(/\s+/);
  if (parts.length < 5 || parts.length > 7) return false;
  return /^[\d*,\-/A-Z?LW#]+$/i.test(trimmed.replace(/\s+/g, " "));
}

function looksLikeSql(text: string): boolean {
  return detectSelectionKind(text) === "sql";
}

function looksLikeLog(text: string): boolean {
  return detectSelectionKind(text) === "log" || isLogLikeText(text);
}

export function detectPasteKind(text: string): PasteKind {
  const trimmed = text.trim();
  if (!trimmed) return "unknown";

  if (looksLikeJwt(trimmed)) return "jwt";
  if (looksLikeJson(trimmed)) return "json";
  if (looksLikeYaml(trimmed)) return "yaml";
  if (looksLikeCron(trimmed)) return "cron";
  if (looksLikeSql(trimmed)) return "sql";
  if (looksLikeLog(trimmed)) return "log";

  return "unknown";
}

export function getPasteMeta(kind: PasteKind) {
  return PASTE_META[kind];
}

export function transformPaste(
  text: string,
  kind: PasteKind
): { output: string | null; error: string | null } {
  const trimmed = text.trim();
  if (!trimmed) {
    return { output: null, error: null };
  }

  try {
    switch (kind) {
      case "sql":
        return {
          output: format(trimmed, {
            language: "sql",
            tabWidth: 2,
            keywordCase: "upper",
          }),
          error: null,
        };
      case "json":
        return {
          output: JSON.stringify(JSON.parse(trimmed) as unknown, null, 2),
          error: null,
        };
      case "jwt": {
        const parts = trimmed.split(".");
        const header = JSON.parse(decodeBase64Url(parts[0])) as unknown;
        const payload = JSON.parse(decodeBase64Url(parts[1])) as unknown;
        return {
          output: `// Header\n${JSON.stringify(header, null, 2)}\n\n// Payload\n${JSON.stringify(payload, null, 2)}`,
          error: null,
        };
      }
      case "yaml":
        return {
          output: stringifyYaml(parseYaml(trimmed), { indent: 2 }),
          error: null,
        };
      case "log":
        return {
          output: null,
          error: null,
        };
      case "cron":
        return {
          output: `Detected cron: ${trimmed}\n\nOpen the Cron Generator for a human-readable schedule and next run times.`,
          error: null,
        };
      default:
        return { output: null, error: null };
    }
  } catch (e) {
    return {
      output: null,
      error: e instanceof Error ? e.message : "Could not transform input.",
    };
  }
}
