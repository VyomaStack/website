import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles } from "lucide-react";

import { LIVE_TOOL_SLUGS } from "@/lib/live-tools";
import { getTool, SITE_URL } from "@/lib/tools";

const AI_TOOL_SLUGS = new Set([
  "sql-formatter",
  "json-formatter",
  "spark-memory-calculator",
  "spark-error-explainer",
  "log-analyzer",
]);

export const metadata: Metadata = {
  title: "Free Developer Tools — SQL, JSON, Spark & More",
  description:
    "Browse all free browser-based developer tools: SQL formatter, JSON studio, JWT decoder, text compare, Spark log analyzer, and more. No signup required.",
  alternates: { canonical: `${SITE_URL}/tools` },
};

const CATEGORY_ORDER = ["SQL", "JSON", "Spark", "AI", "Security", "Developer"];

export default function ToolsPage() {
  const tools = LIVE_TOOL_SLUGS.map((slug) => getTool(slug)).filter(Boolean);

  const groups = new Map<string, NonNullable<(typeof tools)[number]>[]>();
  for (const tool of tools) {
    if (!tool) continue;
    const list = groups.get(tool.category) ?? [];
    list.push(tool);
    groups.set(tool.category, list);
  }

  const ordered = [...groups.entries()].sort(([a], [b]) => {
    const ia = CATEGORY_ORDER.indexOf(a);
    const ib = CATEGORY_ORDER.indexOf(b);
    if (ia === -1 && ib === -1) return a.localeCompare(b);
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            All tools
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {LIVE_TOOL_SLUGS.length} tools · one click · no login
          </p>
        </div>
        <Link
          href="/#try-it"
          className="text-sm font-medium text-primary hover:underline"
        >
          Paste anything →
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
        {ordered.map(([category, items]) => (
          <section key={category}>
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {category}
            </h2>
            <ul className="divide-y divide-border rounded-xl border border-border bg-card">
              {items.map((tool) => {
                const isAi = AI_TOOL_SLUGS.has(tool.slug);
                return (
                  <li key={tool.slug}>
                    <Link
                      href={`/tools/${tool.slug}`}
                      className="flex items-start justify-between gap-3 px-3 py-2.5 transition-colors hover:bg-muted/60"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="truncate text-sm font-medium">
                            {tool.name}
                          </span>
                          {isAi && (
                            <span className="inline-flex items-center gap-0.5 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                              <Sparkles className="size-2.5" />
                              AI
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                          {tool.description}
                        </p>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
