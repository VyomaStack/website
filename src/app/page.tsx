import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import {
  HomeSearchBar,
  HomeSearchProvider,
  HomeToolGrid,
} from "@/components/home/home-tool-search";
import { FeaturedTools } from "@/components/marketing/featured-tools";
import {
  HeroProductPreview,
  ProductShowcase,
} from "@/components/marketing/product-screenshots";
import { SmartPastePlayground } from "@/components/marketing/smart-paste-playground";
import { TrustStats } from "@/components/marketing/trust-stats";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    <HomeSearchProvider>
      {/* Hero — product + brand */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/15 via-background to-background" />
        <div className="relative mx-auto max-w-6xl px-6 py-16 sm:py-20 lg:py-24">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
            <div className="flex flex-col items-center gap-6 text-center lg:items-start lg:text-left">
              <span className="rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                <Sparkles className="mr-1.5 inline size-3.5" />
                VyomaStack
              </span>
              <h1 className="max-w-xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                The AI Workspace
                <br />
                <span className="text-primary">for Software Engineers</span>
              </h1>
              <p className="max-w-xl text-lg text-muted-foreground">
                Format. Explain. Fix. Generate. — AI-powered workflows for SQL,
                Spark, JSON, and data engineering. Not just tools — an
                intelligent workspace that thinks with you.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                <Link href="/tools/sql-formatter">
                  <Button size="lg">
                    Try SQL Formatter
                    <ArrowRight className="size-4" />
                  </Button>
                </Link>
                <Link href="#try-it">
                  <Button variant="outline" size="lg">
                    Paste anything
                  </Button>
                </Link>
              </div>

              <p className="text-sm text-muted-foreground">
                {AI_TOOL_COUNT} AI workflows · {LIVE_TOOL_SLUGS.length} live
                tools · no login required
              </p>

              <div className="w-full max-w-xl">
                <HomeSearchBar />
              </div>
            </div>

            <HeroProductPreview />
          </div>
        </div>
      </section>

      <SmartPastePlayground />

      <TrustStats />

      <FeaturedTools />

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

      <HomeToolGrid tools={tools} liveSlugs={liveSlugs} />

      {/* Categories */}
      <section id="categories" className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="text-2xl font-semibold tracking-tight">Categories</h2>
        <div className="mt-6 flex flex-wrap gap-3">
          {categories.map((cat) => (
            <Link
              key={cat}
              href="/tools"
              className="rounded-full border border-border bg-muted/50 px-4 py-2 text-sm font-medium transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
            >
              {cat}
            </Link>
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
          <Link href="/tools" className="mt-6 inline-block">
            <Button size="lg">
              Browse all {LIVE_TOOL_SLUGS.length} tools
              <ArrowRight className="size-4" />
            </Button>
          </Link>
        </div>
      </section>
    </HomeSearchProvider>
  );
}
