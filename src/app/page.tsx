import Link from "next/link";
import { ArrowRight, Search, Sparkles } from "lucide-react";

import { ProductShowcase } from "@/components/marketing/product-screenshots";
import { TrustStats } from "@/components/marketing/trust-stats";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LIVE_TOOL_SLUGS } from "@/lib/live-tools";
import { AI_TOOL_COUNT } from "@/lib/site-stats";
import { categories, tools } from "@/lib/tools";

const aiHighlights = [
  {
    title: "AI SQL Assistant",
    description:
      "Format SQL, then get AI explanations, performance notes, and improvements.",
    href: "/tools/sql-formatter",
  },
  {
    title: "AI JSON Studio",
    description:
      "Format JSON, generate Java POJOs, TypeScript interfaces, and OpenAPI schemas.",
    href: "/tools/json-formatter",
  },
  {
    title: "Spark AI Tools",
    description:
      "Memory calculator with AI tuning and AI error explainer for stack traces.",
    href: "/tools/spark-error-explainer",
  },
];

export default function Home() {
  const liveSlugs = new Set<string>(LIVE_TOOL_SLUGS);

  return (
    <>
      {/* Hero — brand-first */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/15 via-background to-background" />
        <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-20 text-center sm:py-28">
          <span className="rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <Sparkles className="mr-1.5 inline size-3.5" />
            VyomaStack
          </span>
          <h1 className="max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            The AI Workspace
            <br />
            <span className="text-primary">for Software Engineers</span>
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Format. Explain. Fix. Generate. — AI-powered workflows for SQL,
            Spark, JSON, and data engineering. Not just tools — an intelligent
            workspace that thinks with you.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/tools/sql-formatter">
              <Button size="lg">
                Open AI Workspace
                <ArrowRight className="size-4" />
              </Button>
            </Link>
            <Link href="#showcase">
              <Button variant="outline" size="lg">
                See it in action
              </Button>
            </Link>
          </div>

          <p className="text-sm text-muted-foreground">
            {AI_TOOL_COUNT} AI workflows · {LIVE_TOOL_SLUGS.length} live tools ·
            no login required
          </p>

          <div className="relative mt-2 w-full max-w-xl">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search the workspace — SQL, Spark, JSON, Regex..."
              className="h-11 pl-10"
            />
          </div>
        </div>
      </section>

      <TrustStats />

      <div id="showcase">
        <ProductShowcase />
      </div>

      {/* AI Highlights */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-2xl font-semibold tracking-tight">
          AI workflows, not just utilities
        </h2>
        <p className="mt-1 max-w-2xl text-muted-foreground">
          Every AI tool follows the same path: paste your input, get analysis and
          suggestions, export the result. Built for how engineers actually work.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {aiHighlights.map((item) => (
            <Link key={item.title} href={item.href}>
              <Card className="h-full transition-all hover:ring-primary/40">
                <CardHeader>
                  <span className="inline-flex w-fit items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    <Sparkles className="size-3" />
                    AI Workflow
                  </span>
                  <CardTitle className="mt-2">{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* All Tools */}
      <section id="tools" className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="text-2xl font-semibold tracking-tight">
          The workspace toolkit
        </h2>
        <p className="mt-1 text-muted-foreground">
          Browser-secure utilities with AI where it matters. More launching
          every week.
        </p>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => {
            const isLive = liveSlugs.has(tool.slug);
            const isAi =
              tool.slug === "sql-formatter" ||
              tool.slug === "json-formatter" ||
              tool.slug === "spark-memory-calculator" ||
              tool.slug === "spark-error-explainer";

            const content = (
              <Card
                className={
                  isLive
                    ? "transition-all hover:ring-primary/40"
                    : "opacity-70"
                }
              >
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-primary">
                      {tool.category}
                    </span>
                    {isAi && isLive && (
                      <span className="inline-flex items-center gap-0.5 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                        <Sparkles className="size-2.5" />
                        AI
                      </span>
                    )}
                  </div>
                  <CardTitle>{tool.name}</CardTitle>
                  <CardDescription>{tool.description}</CardDescription>
                  {!isLive && (
                    <span className="text-xs text-muted-foreground">
                      Coming soon
                    </span>
                  )}
                </CardHeader>
              </Card>
            );

            return isLive ? (
              <Link key={tool.slug} href={`/tools/${tool.slug}`}>
                {content}
              </Link>
            ) : (
              <div key={tool.slug}>{content}</div>
            );
          })}
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="text-2xl font-semibold tracking-tight">Categories</h2>
        <div className="mt-6 flex flex-wrap gap-3">
          {categories.map((cat) => (
            <span
              key={cat}
              className="cursor-default rounded-full border border-border bg-muted/50 px-4 py-2 text-sm font-medium transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
            >
              {cat}
            </span>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-muted/20 px-6 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-semibold sm:text-3xl">
            Your AI workspace is ready
          </h2>
          <p className="mt-2 text-muted-foreground">
            SQL, Spark, JSON, Java, Spring Boot, data pipelines — start with
            any workflow. No account. No friction.
          </p>
          <Link href="/tools/sql-formatter" className="mt-6 inline-block">
            <Button size="lg">
              Enter the AI Workspace
              <ArrowRight className="size-4" />
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
