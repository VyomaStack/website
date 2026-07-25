import Link from "next/link";
import { Layers } from "lucide-react";

import { ToolsCta, ToolsNav } from "@/components/layout/tools-nav";
import { LIVE_TOOL_SLUGS } from "@/lib/live-tools";
import { getTool } from "@/lib/tools";

const AI_TOOL_SLUGS = new Set([
  "sql-formatter",
  "json-formatter",
  "spark-memory-calculator",
  "spark-error-explainer",
  "log-analyzer",
]);

export function SiteHeader() {
  const navTools = LIVE_TOOL_SLUGS.map((slug) => {
    const tool = getTool(slug);
    if (!tool) return null;
    return {
      slug: tool.slug,
      name: tool.name,
      category: tool.category,
      isAi: AI_TOOL_SLUGS.has(tool.slug),
    };
  }).filter(Boolean) as {
    slug: string;
    name: string;
    category: string;
    isAi: boolean;
  }[];

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 font-semibold tracking-tight"
        >
          <Layers className="size-5 text-primary" />
          <span>VyomaStack</span>
        </Link>

        <ToolsNav tools={navTools} />

        <div className="hidden lg:block">
          <ToolsCta />
        </div>
      </div>
    </header>
  );
}
