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

import { Input } from "@/components/ui/input";
import type { Tool } from "@/types/tool";

const AI_TOOL_SLUGS = new Set([
  "sql-formatter",
  "json-formatter",
  "spark-memory-calculator",
  "spark-error-explainer",
  "log-analyzer",
]);

const CATEGORY_ORDER = ["SQL", "JSON", "Spark", "AI", "Security", "Developer"];

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
        placeholder="Find a tool — SQL, Text Compare, JWT, Spark…"
        className="h-11 pl-10"
        aria-label="Search tools"
      />
    </div>
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

  const groups = useMemo(() => {
    const map = new Map<string, Tool[]>();
    for (const tool of liveTools) {
      const list = map.get(tool.category) ?? [];
      list.push(tool);
      map.set(tool.category, list);
    }
    return [...map.entries()].sort(([a], [b]) => {
      const ia = CATEGORY_ORDER.indexOf(a);
      const ib = CATEGORY_ORDER.indexOf(b);
      if (ia === -1 && ib === -1) return a.localeCompare(b);
      if (ia === -1) return 1;
      if (ib === -1) return -1;
      return ia - ib;
    });
  }, [liveTools]);

  const isFiltering = query.trim().length > 0;

  return (
    <section id="tools" className="scroll-mt-16">
      {isFiltering && (
        <p className="mb-3 text-sm text-muted-foreground">
          {liveTools.length === 0
            ? `No tools match "${query.trim()}"`
            : `${liveTools.length} tool${liveTools.length === 1 ? "" : "s"} match "${query.trim()}"`}
        </p>
      )}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {groups.map(([category, items]) => (
          <div key={category}>
            <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              {category}
            </h2>
            <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
              {items.map((tool) => {
                const isAi = AI_TOOL_SLUGS.has(tool.slug);
                return (
                  <li key={tool.slug}>
                    <Link
                      href={`/tools/${tool.slug}`}
                      className="flex items-center justify-between gap-2 px-3 py-2.5 transition-colors hover:bg-muted/70"
                    >
                      <span className="truncate text-sm font-medium">
                        {tool.name}
                      </span>
                      {isAi && (
                        <span className="inline-flex shrink-0 items-center gap-0.5 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                          <Sparkles className="size-2.5" />
                          AI
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

/** @deprecated Prefer HomeToolDirectory — kept for compatibility */
export function HomeToolGrid({
  tools,
  liveSlugs,
}: {
  tools: Tool[];
  liveSlugs: Set<string>;
}) {
  return <HomeToolDirectory tools={tools} liveSlugs={liveSlugs} />;
}
