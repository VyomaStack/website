import { Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

function BrowserChrome({ url }: { url: string }) {
  return (
    <div className="flex items-center gap-3 border-b border-border/80 bg-muted/60 px-4 py-2.5">
      <div className="flex gap-1.5">
        <span className="size-2.5 rounded-full bg-red-400/80" />
        <span className="size-2.5 rounded-full bg-yellow-400/80" />
        <span className="size-2.5 rounded-full bg-green-400/80" />
      </div>
      <div className="min-w-0 flex-1 rounded-md bg-background/80 px-3 py-1 text-[10px] text-muted-foreground sm:text-xs">
        {url}
      </div>
    </div>
  );
}

function MockupFrame({
  url,
  children,
  label,
  hideLabel = false,
  className,
}: {
  url: string;
  children: React.ReactNode;
  label: string;
  hideLabel?: boolean;
  className?: string;
}) {
  return (
    <figure className={cn("group", className)}>
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-2xl shadow-primary/10 ring-1 ring-border/50 transition-transform duration-300 group-hover:scale-[1.01]">
        <BrowserChrome url={url} />
        <div className="p-3 sm:p-4">{children}</div>
      </div>
      {!hideLabel && (
        <figcaption className="mt-3 text-center text-sm font-medium text-muted-foreground">
          {label}
        </figcaption>
      )}
    </figure>
  );
}

function SqlFormatterContent() {
  return (
    <>
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-muted/30 p-2.5">
          <p className="mb-1.5 text-[10px] font-medium text-muted-foreground">
            Input
          </p>
          <pre className="overflow-hidden text-[9px] leading-relaxed text-muted-foreground sm:text-[10px]">
            <code>{`SELECT u.id, u.name
FROM users u
LEFT JOIN orders o
  ON u.id = o.user_id
WHERE u.active = true`}</code>
          </pre>
        </div>
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-2.5">
          <p className="mb-1.5 text-[10px] font-medium text-primary">
            Formatted
          </p>
          <pre className="overflow-hidden text-[9px] leading-relaxed sm:text-[10px]">
            <code>
              <span className="text-blue-500">SELECT</span>{" "}
              <span className="text-foreground">u.id,</span>
              {"\n       "}
              <span className="text-foreground">u.name</span>
              {"\n"}
              <span className="text-blue-500">FROM</span> users u
              {"\n"}
              <span className="text-blue-500">LEFT JOIN</span> orders o
            </code>
          </pre>
        </div>
      </div>
      <div className="mt-2 rounded-lg border border-primary/30 bg-gradient-to-r from-primary/10 to-primary/5 p-2.5">
        <div className="mb-1 flex items-center gap-1.5 text-[10px] font-medium text-primary">
          <Sparkles className="size-3" />
          AI Analysis
        </div>
        <p className="text-[9px] leading-relaxed text-muted-foreground sm:text-[10px]">
          Joins users to orders on user_id. Consider an index on orders.user_id
          for faster lookups. LIMIT recommended for large tables.
        </p>
      </div>
    </>
  );
}

export function HeroProductPreview() {
  return (
    <MockupFrame
      url="vyomastack.com/tools/sql-formatter"
      label="AI SQL Formatter"
      hideLabel
      className="mx-auto w-full max-w-xl lg:mx-0"
    >
      <SqlFormatterContent />
    </MockupFrame>
  );
}

export function SqlFormatterScreenshot() {
  return (
    <MockupFrame
      url="vyomastack.com/tools/sql-formatter"
      label="AI SQL Formatter"
    >
      <SqlFormatterContent />
    </MockupFrame>
  );
}

export function JsonAiScreenshot() {
  return (
    <MockupFrame
      url="vyomastack.com/tools/json-formatter"
      label="AI JSON Studio"
    >
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-muted/30 p-2.5">
          <p className="mb-1.5 text-[10px] font-medium text-muted-foreground">
            JSON Input
          </p>
          <pre className="text-[9px] leading-relaxed sm:text-[10px]">
            <code>{`{
  "id": 1,
  "name": "Vyoma",
  "active": true
}`}</code>
          </pre>
        </div>
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-2.5">
          <p className="mb-1.5 text-[10px] font-medium text-primary">
            Generated Java POJO
          </p>
          <pre className="text-[9px] leading-relaxed sm:text-[10px]">
            <code>{`public class User {
  private Long id;
  private String name;
  private Boolean active;
}`}</code>
          </pre>
        </div>
      </div>
      <div className="mt-2 flex gap-1">
        {["POJO", "TypeScript", "OpenAPI", "SQL"].map((tab, i) => (
          <span
            key={tab}
            className={`rounded px-2 py-0.5 text-[9px] font-medium ${
              i === 0
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {tab}
          </span>
        ))}
      </div>
    </MockupFrame>
  );
}

export function SparkAiScreenshot() {
  return (
    <MockupFrame
      url="vyomastack.com/tools/spark-error-explainer"
      label="Spark AI Error Explainer"
    >
      <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-2.5">
        <p className="mb-1.5 text-[10px] font-medium text-destructive">
          Error Log
        </p>
        <pre className="overflow-hidden text-[9px] leading-relaxed text-destructive/80 sm:text-[10px]">
          <code>{`java.lang.OutOfMemoryError: GC overhead limit exceeded
  at org.apache.spark.sql.execution`}</code>
        </pre>
      </div>
      <div className="mt-2 rounded-lg border border-primary/30 bg-gradient-to-r from-primary/10 to-primary/5 p-2.5">
        <div className="mb-1 flex items-center gap-1.5 text-[10px] font-medium text-primary">
          <Sparkles className="size-3" />
          AI Root Cause
        </div>
        <p className="mb-1.5 text-[9px] font-semibold sm:text-[10px]">
          Executor memory too low for shuffle + cache
        </p>
        <ul className="space-y-0.5 text-[9px] text-muted-foreground sm:text-[10px]">
          <li>→ Increase spark.executor.memory to 8g</li>
          <li>→ Set spark.memory.fraction=0.8</li>
          <li>→ Reduce spark.sql.shuffle.partitions</li>
        </ul>
      </div>
    </MockupFrame>
  );
}

export function TextCompareScreenshot() {
  return (
    <MockupFrame
      url="vyomastack.com/tools/text-compare"
      label="Text Compare & Diff"
    >
      <div className="overflow-hidden rounded-lg border border-border text-[9px] sm:text-[10px]">
        <div className="grid grid-cols-2 border-b border-border bg-muted/50 text-muted-foreground">
          <span className="px-2 py-1 font-medium">Original</span>
          <span className="border-l border-border px-2 py-1 font-medium">
            Modified
          </span>
        </div>
        <div className="grid grid-cols-2">
          <div className="bg-destructive/10 px-2 py-1 font-mono line-through text-destructive/80">
            WHERE active = 1
          </div>
          <div className="border-l border-border bg-success/10 px-2 py-1 font-mono text-success">
            WHERE u.active = true
          </div>
        </div>
        <div className="grid grid-cols-2 border-t border-border">
          <div className="px-2 py-1 font-mono text-muted-foreground"> </div>
          <div className="border-l border-border bg-success/10 px-2 py-1 font-mono text-success">
            + LIMIT 100
          </div>
        </div>
      </div>
      <div className="mt-2 flex gap-2 text-[9px] text-muted-foreground sm:text-[10px]">
        <span className="rounded bg-success/15 px-1.5 py-0.5 text-success">
          2 added
        </span>
        <span className="rounded bg-destructive/15 px-1.5 py-0.5 text-destructive">
          1 removed
        </span>
        <span className="rounded bg-muted px-1.5 py-0.5">SQL format</span>
      </div>
    </MockupFrame>
  );
}

export function ProductShowcase() {
  return (
    <section className="bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <div className="text-center">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            See the AI workspace in action
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-slate-400">
            Input → AI Analysis → Suggestions → Export. Every AI workflow follows
            the same simple path engineers already think in.
          </p>
        </div>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 [&_figcaption]:text-slate-400">
          <SqlFormatterScreenshot />
          <JsonAiScreenshot />
          <SparkAiScreenshot />
          <TextCompareScreenshot />
        </div>
      </div>
    </section>
  );
}
