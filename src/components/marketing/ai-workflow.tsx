import {
  ArrowDown,
  Download,
  FileInput,
  Lightbulb,
  Sparkles,
} from "lucide-react";

import type { WorkflowStep } from "@/lib/tool-workflows";

const STEP_ICONS = [FileInput, Sparkles, Lightbulb, Download] as const;

interface AiWorkflowProps {
  steps: WorkflowStep[];
  hasAi?: boolean;
  title?: string;
}

export function AiWorkflow({
  steps,
  hasAi = false,
  title = "How it works",
}: AiWorkflowProps) {
  return (
    <section className="mb-8 rounded-xl border border-border bg-muted/20 p-6">
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <h2 className="text-lg font-semibold">{title}</h2>
        {hasAi && (
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
            <Sparkles className="size-3" />
            AI-powered
          </span>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, i) => {
          const Icon = STEP_ICONS[i] ?? FileInput;
          return (
            <div key={step.title} className="relative">
              {i < steps.length - 1 && (
                <ArrowDown
                  className="absolute -bottom-3 left-1/2 z-10 hidden size-4 -translate-x-1/2 text-muted-foreground/50 lg:hidden"
                  aria-hidden
                />
              )}
              <div className="flex h-full flex-col rounded-lg border border-border bg-background p-4">
                <div className="mb-3 flex items-center gap-2">
                  <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                    {i + 1}
                  </span>
                  <Icon className="size-4 text-primary" aria-hidden />
                  <span className="font-medium">{step.title}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
              {i < steps.length - 1 && (
                <div
                  className="absolute top-1/2 -right-2 z-10 hidden h-px w-4 bg-border lg:block"
                  aria-hidden
                />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
