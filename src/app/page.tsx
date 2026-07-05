import Link from "next/link";
import { ArrowRight, Search, Sparkles, Shield, Brain, Flame } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LIVE_TOOL_SLUGS } from "@/lib/live-tools";
import { categories, tools } from "@/lib/tools";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Workflows",
    description:
      "Format, explain, optimize, and fix — not just static utilities.",
  },
  {
    icon: Flame,
    title: "Spark & Data Engineering",
    description:
      "Memory calculators, config tuning, and AI advisors built for real pipelines.",
  },
  {
    icon: Shield,
    title: "Free Tools + Smart AI",
    description:
      "Browser-based formatters are free. AI explain and optimize when you need more.",
  },
];

const aiHighlights = [
  {
    title: "AI SQL Assistant",
    description: "Format SQL, then get AI explanations, performance notes, and improvements.",
    href: "/tools/sql-formatter",
    badge: "Live",
  },
  {
    title: "AI JSON Studio",
    description: "Format JSON, generate Java POJOs, TypeScript interfaces, and OpenAPI schemas.",
    href: "/tools/json-formatter",
    badge: "Live",
  },
  {
    title: "Spark AI Tools",
    description: "Memory calculator with AI tuning and AI error explainer for stack traces.",
    href: "/tools/spark-error-explainer",
    badge: "Live",
  },
];

export default function Home() {
  const liveSlugs = new Set<string>(LIVE_TOOL_SLUGS);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/15 via-background to-background" />
        <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-24 text-center sm:py-32">
          <span className="rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <Sparkles className="mr-1.5 inline size-3.5" />
            AI Workspace for Software Engineers
          </span>
          <h1 className="max-w-4xl text-4xl font-bold tracking-tight sm:text-6xl">
            Format. Explain.
            <br />
            <span className="text-primary">Fix. Generate.</span>
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            The AI workspace for SQL, Spark, Java, and data engineering.
            Free browser tools bring you in — AI workflows make you stay.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/tools/sql-formatter">
              <Button size="lg">
                Try AI SQL Assistant
                <ArrowRight className="size-4" />
              </Button>
            </Link>
            <Link href="/tools/spark-memory-calculator">
              <Button variant="outline" size="lg">
                Spark Memory Calculator
              </Button>
            </Link>
          </div>

          <div className="relative mt-4 w-full max-w-xl">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search tools — SQL, Spark, JSON, Regex, Cron..."
              className="h-11 pl-10"
            />
          </div>
        </div>
      </section>

      {/* AI Highlights */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-2xl font-semibold tracking-tight">
          AI-Powered Workflows
        </h2>
        <p className="mt-1 text-muted-foreground">
          More than formatters — real engineering assistance.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {aiHighlights.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className={item.badge === "Coming soon" ? "pointer-events-none" : ""}
            >
              <Card
                className={`h-full transition-all ${item.badge === "Live" ? "hover:ring-primary/40" : "opacity-70"}`}
              >
                <CardHeader>
                  <span className="text-xs font-medium text-primary">
                    {item.badge}
                  </span>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="size-4 text-primary" />
                    {item.title}
                  </CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid gap-6 sm:grid-cols-3">
          {features.map((f) => (
            <Card key={f.title} size="sm">
              <CardHeader>
                <f.icon className="mb-1 size-5 text-primary" />
                <CardTitle>{f.title}</CardTitle>
                <CardDescription>{f.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Popular Tools */}
      <section id="tools" className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="text-2xl font-semibold tracking-tight">All Tools</h2>
        <p className="mt-1 text-muted-foreground">
          Free utilities + AI enhancements. More launching every week.
        </p>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => {
            const isLive = liveSlugs.has(tool.slug);
            const content = (
              <Card
                className={
                  isLive
                    ? "transition-all hover:ring-primary/40"
                    : "opacity-70"
                }
              >
                <CardHeader>
                  <span className="text-xs font-medium text-primary">
                    {tool.category}
                  </span>
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
          <h2 className="text-2xl font-semibold">Built for engineers like you</h2>
          <p className="mt-2 text-muted-foreground">
            Spark, SQL, Java, Spring Boot, data pipelines — AI-assisted
            workflows around real enterprise problems.
          </p>
          <Link href="/tools/sql-formatter" className="mt-6 inline-block">
            <Button size="lg">
              Start with AI SQL Assistant
              <ArrowRight className="size-4" />
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
