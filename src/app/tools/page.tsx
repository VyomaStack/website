import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles } from "lucide-react";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    "Browse 15+ free browser-based developer tools: SQL formatter, JSON studio, JWT decoder, text compare, Spark log analyzer, and more. No signup required.",
  alternates: { canonical: `${SITE_URL}/tools` },
};

export default function ToolsPage() {
  const tools = LIVE_TOOL_SLUGS.map((slug) => getTool(slug)).filter(Boolean);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <nav
        className="mb-6 text-sm text-muted-foreground"
        aria-label="Breadcrumb"
      >
        <Link href="/" className="transition-colors hover:text-primary">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">Tools</span>
      </nav>

      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Developer tools workspace
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          {LIVE_TOOL_SLUGS.length} free tools for SQL, JSON, Spark, security, and
          data engineering — all run in your browser. No login required.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => {
          if (!tool) return null;
          const isAi = AI_TOOL_SLUGS.has(tool.slug);

          return (
            <Link key={tool.slug} href={`/tools/${tool.slug}`}>
              <Card className="h-full transition-all hover:ring-primary/40">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-primary">
                      {tool.category}
                    </span>
                    {isAi && (
                      <span className="inline-flex items-center gap-0.5 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                        <Sparkles className="size-2.5" />
                        AI
                      </span>
                    )}
                  </div>
                  <CardTitle>{tool.name}</CardTitle>
                  <CardDescription>{tool.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
