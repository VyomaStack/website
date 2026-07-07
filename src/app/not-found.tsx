import Link from "next/link";
import { ArrowRight, Home, Wrench } from "lucide-react";

import { Button } from "@/components/ui/button";

const POPULAR_TOOLS = [
  { name: "SQL Formatter", href: "/tools/sql-formatter" },
  { name: "JSON Formatter", href: "/tools/json-formatter" },
  { name: "JWT Decoder", href: "/tools/jwt-decoder" },
  { name: "Text Compare", href: "/tools/text-compare" },
  { name: "Log Analyzer", href: "/tools/log-analyzer" },
];

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-6 py-24 text-center">
      <p className="text-6xl font-bold text-primary">404</p>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight">
        Page not found
      </h1>
      <p className="mt-2 text-muted-foreground">
        This page doesn&apos;t exist or was moved. Try one of our tools instead.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/">
          <Button>
            <Home className="size-4" />
            Home
          </Button>
        </Link>
        <Link href="/tools">
          <Button variant="outline">
            <Wrench className="size-4" />
            All tools
          </Button>
        </Link>
      </div>

      <div className="mt-10 w-full text-left">
        <p className="text-sm font-medium">Popular tools</p>
        <ul className="mt-3 space-y-2">
          {POPULAR_TOOLS.map((tool) => (
            <li key={tool.href}>
              <Link
                href={tool.href}
                className="flex items-center justify-between rounded-lg border border-border px-4 py-2.5 text-sm transition-colors hover:border-primary hover:text-primary"
              >
                {tool.name}
                <ArrowRight className="size-4 text-muted-foreground" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
