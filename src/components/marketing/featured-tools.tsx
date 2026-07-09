import Link from "next/link";
import { ArrowRight, Clock, Database, FileCode, Key } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LIVE_TOOL_SLUGS } from "@/lib/live-tools";

const FEATURED = [
  {
    slug: "yaml-formatter",
    name: "YAML Formatter",
    description:
      "Format K8s, Docker & CI YAML. Validate and convert to JSON.",
    href: "/tools/yaml-formatter",
    icon: FileCode,
    badge: "New",
  },
  {
    slug: "timestamp-converter",
    name: "Timestamp Converter",
    description: "Unix epoch ↔ human dates. Seconds & milliseconds.",
    href: "/tools/timestamp-converter",
    icon: Clock,
    badge: "New",
  },
  {
    slug: "sql-formatter",
    name: "SQL Formatter",
    description: "Beautify SQL + AI explain for any dialect.",
    href: "/tools/sql-formatter",
    icon: Database,
    badge: "Popular",
  },
  {
    slug: "jwt-decoder",
    name: "JWT Decoder",
    description: "Decode tokens instantly in your browser.",
    href: "/tools/jwt-decoder",
    icon: Key,
    badge: "Popular",
  },
] as const;

export function FeaturedTools() {
  return (
    <section className="border-b border-border bg-primary/[0.03]">
      <div className="mx-auto max-w-6xl px-6 py-10 sm:py-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              Popular & new tools
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Start with YAML, timestamps, SQL, or JWT — no signup.
            </p>
          </div>
          <Link href="/tools">
            <Button variant="outline" size="sm">
              All {LIVE_TOOL_SLUGS.length} tools
              <ArrowRight className="size-4" />
            </Button>
          </Link>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURED.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link key={tool.slug} href={tool.href}>
                <Card className="h-full transition-all hover:ring-primary/40">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between gap-2">
                      <Icon className="size-5 text-primary" />
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                          tool.badge === "New"
                            ? "bg-success/15 text-success"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        {tool.badge}
                      </span>
                    </div>
                    <CardTitle className="text-base">{tool.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {tool.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
