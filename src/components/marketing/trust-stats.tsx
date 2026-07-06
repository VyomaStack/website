import { Lock, LogIn, Sparkles, Zap } from "lucide-react";

import { TRUST_STATS } from "@/lib/site-stats";

const ICONS = [Zap, Sparkles, Lock, LogIn] as const;

export function TrustStats() {
  return (
    <section
      className="border-y border-border bg-muted/30"
      aria-label="Platform trust metrics"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-6 py-8 sm:grid-cols-4">
        {TRUST_STATS.map((stat, i) => {
          const Icon = ICONS[i] ?? Zap;
          return (
            <div key={stat.label} className="text-center">
              <Icon className="mx-auto mb-2 size-5 text-primary" aria-hidden />
              <p className="text-2xl font-bold tracking-tight sm:text-3xl">
                {stat.value}
              </p>
              <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                {stat.label}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
