"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import {
  ArrowRight,
  Binary,
  Braces,
  Clock,
  Database,
  Diff,
  FileCode,
  Fingerprint,
  Hash,
  KeyRound,
  Link2,
  QrCode,
  Regex,
  ScrollText,
  Search,
  Sparkles,
  Timer,
  Wand2,
  type LucideIcon,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import type { Tool } from "@/types/tool";
import { cn } from "@/lib/utils";

const AI_TOOL_SLUGS = new Set([
  "sql-formatter",
  "json-formatter",
  "spark-memory-calculator",
  "spark-error-explainer",
  "log-analyzer",
]);

const TOOL_ICONS: Record<string, LucideIcon> = {
  "sql-formatter": Database,
  "json-formatter": Braces,
  "yaml-formatter": FileCode,
  "text-compare": Diff,
  "jwt-decoder": KeyRound,
  "timestamp-converter": Clock,
  "log-analyzer": ScrollText,
  "spark-error-explainer": Sparkles,
  "spark-memory-calculator": Binary,
  "password-generator": Fingerprint,
  "hash-generator": Hash,
  "regex-tester": Regex,
  "cron-generator": Timer,
  "uuid-generator": Fingerprint,
  "base64-encoder": Binary,
  "url-encoder": Link2,
  "qr-code-generator": QrCode,
};

/** Short action line — what you do, not marketing */
const TOOL_ACTIONS: Record<string, string> = {
  "sql-formatter": "Beautify SQL & get AI explain",
  "json-formatter": "Format JSON · make POJOs",
  "yaml-formatter": "Fix K8s / Docker YAML",
  "text-compare": "Diff two texts side by side",
  "jwt-decoder": "Inspect token claims now",
  "timestamp-converter": "Epoch ↔ human date",
  "log-analyzer": "Paste logs → root cause",
  "spark-error-explainer": "Fix Spark OOM & errors",
  "spark-memory-calculator": "Size Spark executors",
  "password-generator": "Create strong passwords",
  "hash-generator": "MD5 / SHA hash any text",
  "regex-tester": "Test regex live",
  "cron-generator": "Build cron schedules",
  "uuid-generator": "Generate UUIDs",
  "base64-encoder": "Encode or decode Base64",
  "url-encoder": "Encode / decode URLs",
  "qr-code-generator": "Make a QR code PNG",
};

const FEATURED_SLUGS = [
  "text-compare",
  "sql-formatter",
  "log-analyzer",
  "jwt-decoder",
  "json-formatter",
  "spark-error-explainer",
] as const;

type SearchContextValue = {
  query: string;
  setQuery: (query: string) => void;
};

const SearchContext = createContext<SearchContextValue | null>(null);

function useToolSearch() {
  const ctx = useContext(SearchContext);
  if (!ctx) {
    throw new Error("useToolSearch must be used within HomeSearchProvider");
  }
  return ctx;
}

function matchesTool(tool: Tool, query: string): boolean {
  const q = query.toLowerCase().trim();
  if (!q) return true;
  return (
    tool.name.toLowerCase().includes(q) ||
    tool.description.toLowerCase().includes(q) ||
    tool.category.toLowerCase().includes(q) ||
    tool.slug.toLowerCase().includes(q) ||
    (TOOL_ACTIONS[tool.slug]?.toLowerCase().includes(q) ?? false) ||
    (tool.keywords?.some((k) => k.toLowerCase().includes(q)) ?? false)
  );
}

export function HomeSearchProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState("");
  return (
    <SearchContext.Provider value={{ query, setQuery }}>
      {children}
    </SearchContext.Provider>
  );
}

export function HomeSearchBar({ className }: { className?: string }) {
  const { query, setQuery } = useToolSearch();

  const focusTools = useCallback(() => {
    document.getElementById("tools")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  return (
    <div className={`relative w-full ${className ?? ""}`}>
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={focusTools}
        onKeyDown={(e) => {
          if (e.key === "Enter") focusTools();
        }}
        placeholder="Search tools — Text Compare, SQL, JWT, Spark…"
        className="h-11 pl-10"
        aria-label="Search tools"
      />
    </div>
  );
}

function ToolTile({
  tool,
  featured = false,
}: {
  tool: Tool;
  featured?: boolean;
}) {
  const Icon = TOOL_ICONS[tool.slug] ?? Wand2;
  const isAi = AI_TOOL_SLUGS.has(tool.slug);
  const action = TOOL_ACTIONS[tool.slug] ?? tool.description;

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className={cn(
        "group flex h-full flex-col rounded-xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md",
        featured && "border-primary/25 bg-primary/[0.03] sm:p-5"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={cn(
            "inline-flex size-10 items-center justify-center rounded-lg",
            featured ? "bg-primary/15 text-primary" : "bg-muted text-foreground"
          )}
        >
          <Icon className="size-5" />
        </span>
        {isAi && (
          <span className="inline-flex items-center gap-0.5 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
            <Sparkles className="size-2.5" />
            AI
          </span>
        )}
      </div>
      <h3 className="mt-3 text-base font-semibold tracking-tight group-hover:text-primary">
        {tool.name}
      </h3>
      <p className="mt-1 flex-1 text-sm leading-snug text-muted-foreground">
        {action}
      </p>
      <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary opacity-80 group-hover:opacity-100">
        Open tool
        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

export function HomeToolDirectory({
  tools,
  liveSlugs,
}: {
  tools: Tool[];
  liveSlugs: Set<string>;
}) {
  const { query } = useToolSearch();

  const liveTools = useMemo(
    () => tools.filter((t) => liveSlugs.has(t.slug) && matchesTool(t, query)),
    [tools, liveSlugs, query]
  );

  const featured = useMemo(() => {
    if (query.trim()) return [];
    return FEATURED_SLUGS.map((slug) =>
      liveTools.find((t) => t.slug === slug)
    ).filter(Boolean) as Tool[];
  }, [liveTools, query]);

  const rest = useMemo(() => {
    const featuredSet = new Set(FEATURED_SLUGS);
    if (query.trim()) return liveTools;
    return liveTools.filter((t) => !featuredSet.has(t.slug as (typeof FEATURED_SLUGS)[number]));
  }, [liveTools, query]);

  const isFiltering = query.trim().length > 0;

  return (
    <section id="tools" className="scroll-mt-16 space-y-8">
      {isFiltering && (
        <p className="text-sm text-muted-foreground">
          {liveTools.length === 0
            ? `No tools match "${query.trim()}"`
            : `${liveTools.length} tool${liveTools.length === 1 ? "" : "s"} match "${query.trim()}"`}
        </p>
      )}

      {!isFiltering && featured.length > 0 && (
        <div>
          <div className="mb-3 flex items-end justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">
                Start here
              </h2>
              <p className="text-sm text-muted-foreground">
                Most used — click and go straight into the tool
              </p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((tool) => (
              <ToolTile key={tool.slug} tool={tool} featured />
            ))}
          </div>
        </div>
      )}

      <div>
        {!isFiltering && (
          <div className="mb-3">
            <h2 className="text-lg font-semibold tracking-tight">
              All tools
            </h2>
            <p className="text-sm text-muted-foreground">
              Every module in one place — open any in one click
            </p>
          </div>
        )}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {(isFiltering ? liveTools : rest).map((tool) => (
            <ToolTile key={tool.slug} tool={tool} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeToolGrid({
  tools,
  liveSlugs,
}: {
  tools: Tool[];
  liveSlugs: Set<string>;
}) {
  return <HomeToolDirectory tools={tools} liveSlugs={liveSlugs} />;
}
