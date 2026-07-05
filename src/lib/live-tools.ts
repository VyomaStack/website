import type { ComponentType } from "react";

import { Base64EncoderTool } from "@/components/tools/base64-encoder-tool";
import { JsonFormatterTool } from "@/components/tools/json-formatter-tool";
import { JwtDecoderTool } from "@/components/tools/jwt-decoder-tool";
import { SqlFormatterTool } from "@/components/tools/sql-formatter-tool";
import { UrlEncoderTool } from "@/components/tools/url-encoder-tool";
import { UuidGeneratorTool } from "@/components/tools/uuid-generator-tool";

export const LIVE_TOOL_SLUGS = [
  "sql-formatter",
  "json-formatter",
  "jwt-decoder",
  "uuid-generator",
  "base64-encoder",
  "url-encoder",
] as const;

export type LiveToolSlug = (typeof LIVE_TOOL_SLUGS)[number];

export const TOOL_COMPONENTS: Record<LiveToolSlug, ComponentType> = {
  "sql-formatter": SqlFormatterTool,
  "json-formatter": JsonFormatterTool,
  "jwt-decoder": JwtDecoderTool,
  "uuid-generator": UuidGeneratorTool,
  "base64-encoder": Base64EncoderTool,
  "url-encoder": UrlEncoderTool,
};

export function isLiveTool(slug: string): slug is LiveToolSlug {
  return LIVE_TOOL_SLUGS.includes(slug as LiveToolSlug);
}
