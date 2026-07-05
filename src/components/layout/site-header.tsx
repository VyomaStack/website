import Link from "next/link";
import { Layers, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold tracking-tight"
        >
          <Layers className="size-5 text-primary" />
          <span>VyomaStack</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
          <Link href="/#tools" className="transition-colors hover:text-foreground">
            Tools
          </Link>
          <Link
            href="/tools/sql-formatter"
            className="transition-colors hover:text-foreground"
          >
            SQL AI
          </Link>
          <Link
            href="/tools/spark-error-explainer"
            className="transition-colors hover:text-foreground"
          >
            Spark
          </Link>
        </nav>

        <Link href="/tools/sql-formatter">
          <Button size="sm">
            <Sparkles className="size-3.5" />
            AI Workspace
          </Button>
        </Link>
      </div>
    </header>
  );
}
