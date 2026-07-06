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
import { Search, Sparkles } from "lucide-react";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Tool } from "@/types/tool";

const AI_TOOL_SLUGS = new Set([
  "sql-formatter",
  "json-formatter",
  "spark-memory-calculator",
  "spark-error-explainer",
  "log-analyzer",
]);

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

export function HomeSearchBar() {
  const { query, setQuery } = useToolSearch();

  const scrollToTools = useCallback(() => {
    document.getElementById("tools")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  return (
    <div className="relative mt-2 w-full max-w-xl">
      <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && query.trim()) scrollToTools();
        }}
        placeholder="Search the workspace — SQL, Spark, JSON, Regex..."
        className="h-11 pl-10"
        aria-label="Search tools"
      />
    </div>
  );
}

export function HomeToolGrid({
  tools,
  liveSlugs,
}: {
  tools: Tool[];
  liveSlugs: Set<string>;
}) {
  const { query } = useToolSearch();

  const filtered = useMemo(
    () => tools.filter((t) => matchesTool(t, query)),
    [tools, query]
  );

  const isFiltering = query.trim().length > 0;

  return (
    <section id="tools" className="mx-auto max-w-6xl px-6 py-12">
      <h2 className="text-2xl font-semibold tracking-tight">
        The workspace toolkit
      </h2>
      <p className="mt-1 text-muted-foreground">
        Browser-secure utilities with AI where it matters. More launching every
        week.
      </p>
      {isFiltering && (
        <p className="mt-2 text-sm text-muted-foreground">
          {filtered.length === 0
            ? `No tools match "${query.trim()}"`
            : `Showing ${filtered.length} of ${tools.length} tools for "${query.trim()}"`}
        </p>
      )}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((tool) => {
          const isLive = liveSlugs.has(tool.slug);
          const isAi = AI_TOOL_SLUGS.has(tool.slug);

          const content = (
            <Card
              className={
                isLive ? "transition-all hover:ring-primary/40" : "opacity-70"
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
  );
}
