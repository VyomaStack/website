"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, Menu, Sparkles, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type NavTool = {
  slug: string;
  name: string;
  category: string;
  isAi: boolean;
};

type ToolsNavProps = {
  tools: NavTool[];
};

const AI_SLUGS = new Set([
  "sql-formatter",
  "json-formatter",
  "spark-memory-calculator",
  "spark-error-explainer",
  "log-analyzer",
]);

function groupByCategory(tools: NavTool[]): [string, NavTool[]][] {
  const map = new Map<string, NavTool[]>();
  for (const tool of tools) {
    const list = map.get(tool.category) ?? [];
    list.push(tool);
    map.set(tool.category, list);
  }
  // Prefer practical order for the menu
  const order = ["SQL", "JSON", "Spark", "AI", "Security", "Developer"];
  return [...map.entries()].sort(([a], [b]) => {
    const ia = order.indexOf(a);
    const ib = order.indexOf(b);
    if (ia === -1 && ib === -1) return a.localeCompare(b);
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });
}

export function ToolsNav({ tools }: ToolsNavProps) {
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const groups = groupByCategory(tools);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: MouseEvent) {
      const target = e.target as Node;
      if (
        panelRef.current?.contains(target) ||
        buttonRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      {/* Desktop */}
      <nav className="hidden items-center gap-5 text-sm font-medium text-muted-foreground lg:flex">
        <div className="relative">
          <button
            ref={buttonRef}
            type="button"
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => setOpen((v) => !v)}
            className={cn(
              "inline-flex items-center gap-1 transition-colors hover:text-foreground",
              open && "text-foreground"
            )}
          >
            All tools
            <ChevronDown
              className={cn("size-3.5 transition-transform", open && "rotate-180")}
            />
          </button>

          {open && (
            <div
              id={menuId}
              ref={panelRef}
              className="absolute left-0 top-full z-50 mt-3 w-[min(880px,calc(100vw-2rem))] rounded-xl border border-border bg-background p-4 shadow-xl"
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-foreground">
                  Jump to any tool
                </p>
                <Link
                  href="/tools"
                  onClick={() => setOpen(false)}
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Tools directory →
                </Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {groups.map(([category, items]) => (
                  <div key={category}>
                    <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      {category}
                    </p>
                    <ul className="space-y-0.5">
                      {items.map((tool) => (
                        <li key={tool.slug}>
                          <Link
                            href={`/tools/${tool.slug}`}
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-foreground transition-colors hover:bg-muted"
                          >
                            <span className="truncate">{tool.name}</span>
                            {(tool.isAi || AI_SLUGS.has(tool.slug)) && (
                              <Sparkles className="size-3 shrink-0 text-primary" />
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <Link href="/blog" className="transition-colors hover:text-foreground">
          Blog
        </Link>
        <Link
          href="/tools/text-compare"
          className="transition-colors hover:text-foreground"
        >
          Text Compare
        </Link>
        <Link
          href="/tools/sql-formatter"
          className="transition-colors hover:text-foreground"
        >
          SQL
        </Link>
        <Link
          href="/tools/spark-error-explainer"
          className="transition-colors hover:text-foreground"
        >
          Spark
        </Link>
      </nav>

      {/* Mobile toggle */}
      <button
        type="button"
        className="inline-flex items-center justify-center rounded-md border border-border p-2 text-foreground lg:hidden"
        aria-label={mobileOpen ? "Close menu" : "Open menu"}
        aria-expanded={mobileOpen}
        onClick={() => setMobileOpen((v) => !v)}
      >
        {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>

      {/* Mobile panel */}
      {mobileOpen && (
        <div className="fixed inset-0 top-14 z-40 overflow-y-auto border-t border-border bg-background lg:hidden">
          <div className="mx-auto max-w-6xl space-y-6 px-6 py-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">All tools</p>
              <Link
                href="/tools"
                onClick={() => setMobileOpen(false)}
                className="text-xs font-medium text-primary"
              >
                Directory →
              </Link>
            </div>
            {groups.map(([category, items]) => (
              <div key={category}>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {category}
                </p>
                <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2">
                  {items.map((tool) => (
                    <li key={tool.slug}>
                      <Link
                        href={`/tools/${tool.slug}`}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-1.5 rounded-md border border-border/60 px-3 py-2.5 text-sm font-medium"
                      >
                        {tool.name}
                        {(tool.isAi || AI_SLUGS.has(tool.slug)) && (
                          <Sparkles className="size-3 text-primary" />
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="flex flex-wrap gap-4 border-t border-border pt-4 text-sm">
              <Link href="/blog" onClick={() => setMobileOpen(false)}>
                Blog
              </Link>
              <Link href="/extension" onClick={() => setMobileOpen(false)}>
                Extension
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function ToolsCta() {
  return (
    <Link href="/tools">
      <Button size="sm">
        All tools
      </Button>
    </Link>
  );
}
