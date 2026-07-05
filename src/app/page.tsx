import Link from "next/link";
import { ArrowRight, Search, Sparkles, Zap, Shield } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { categories, tools } from "@/lib/tools";

const features = [
  {
    icon: Zap,
    title: "Instant & Free",
    description: "Most tools run in your browser — no signup, no waiting.",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "Your data stays on your device. Nothing sent to our servers.",
  },
  {
    icon: Sparkles,
    title: "AI-Powered",
    description: "Smart explanations and optimizations coming soon.",
  },
];

export default function Home() {
  const liveSlugs = new Set(["sql-formatter"]);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-24 text-center sm:py-32">
          <span className="rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            AI-Powered Developer Platform
          </span>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
            Build Faster.
            <br />
            <span className="text-primary">Ship Smarter.</span>
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            500+ developer tools for SQL, JSON, security, Spark, and more. The
            GitHub of Developer Tools.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/tools/sql-formatter">
              <Button size="lg">
                Explore Tools
                <ArrowRight className="size-4" />
              </Button>
            </Link>
            <Link href="/tools/sql-formatter">
              <Button variant="outline" size="lg">
                Try SQL Formatter
              </Button>
            </Link>
          </div>

          <div className="relative mt-4 w-full max-w-xl">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search 500+ Developer Tools..."
              className="h-11 pl-10"
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 py-16">
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
        <h2 className="text-2xl font-semibold tracking-tight">Popular Tools</h2>
        <p className="mt-1 text-muted-foreground">
          Free online utilities — more launching every week.
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
                    <span className="text-xs text-muted-foreground">Coming soon</span>
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

      {/* Latest */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="text-2xl font-semibold tracking-tight">Latest Tools</h2>
        <Card className="mt-4" size="sm">
          <CardHeader>
            <CardTitle>SQL Formatter</CardTitle>
            <CardDescription>
              Our first live tool — beautify and minify SQL in your browser.
            </CardDescription>
            <Link href="/tools/sql-formatter">
              <Button variant="link" className="h-auto p-0">
                Open SQL Formatter →
              </Button>
            </Link>
          </CardHeader>
        </Card>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="text-2xl font-semibold tracking-tight">Latest Articles</h2>
        <p className="mt-2 text-muted-foreground">Coming soon.</p>
      </section>
    </>
  );
}
