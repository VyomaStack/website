import type { ComponentType } from "react";

import { JsonFormatterTool } from "@/components/tools/json-formatter-tool";
import { JwtDecoderTool } from "@/components/tools/jwt-decoder-tool";
import { SqlFormatterTool } from "@/components/tools/sql-formatter-tool";

export const LIVE_TOOL_SLUGS = [
  "sql-formatter",
  "json-formatter",
  "jwt-decoder",
] as const;

export type LiveToolSlug = (typeof LIVE_TOOL_SLUGS)[number];

export const TOOL_COMPONENTS: Record<LiveToolSlug, ComponentType> = {
  "sql-formatter": SqlFormatterTool,
  "json-formatter": JsonFormatterTool,
  "jwt-decoder": JwtDecoderTool,
};

export function isLiveTool(slug: string): slug is LiveToolSlug {
  return LIVE_TOOL_SLUGS.includes(slug as LiveToolSlug);
}
