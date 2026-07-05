"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import cronstrue from "cronstrue";
import parser from "cron-parser";
import { Copy, Check, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const CRON_FIELDS = [
  { key: "minute", label: "Minute", range: "0-59", placeholder: "*" },
  { key: "hour", label: "Hour", range: "0-23", placeholder: "*" },
  { key: "dayOfMonth", label: "Day (month)", range: "1-31", placeholder: "*" },
  { key: "month", label: "Month", range: "1-12", placeholder: "*" },
  { key: "dayOfWeek", label: "Day (week)", range: "0-6 (Sun=0)", placeholder: "*" },
] as const;

type CronParts = Record<(typeof CRON_FIELDS)[number]["key"], string>;

const DEFAULT_PARTS: CronParts = {
  minute: "0",
  hour: "9",
  dayOfMonth: "*",
  month: "*",
  dayOfWeek: "*",
};

const PRESETS: { label: string; parts: CronParts }[] = [
  {
    label: "Every minute",
    parts: { minute: "*", hour: "*", dayOfMonth: "*", month: "*", dayOfWeek: "*" },
  },
  {
    label: "Every 5 min",
    parts: { minute: "*/5", hour: "*", dayOfMonth: "*", month: "*", dayOfWeek: "*" },
  },
  {
    label: "Every hour",
    parts: { minute: "0", hour: "*", dayOfMonth: "*", month: "*", dayOfWeek: "*" },
  },
  {
    label: "Daily 9 AM",
    parts: { minute: "0", hour: "9", dayOfMonth: "*", month: "*", dayOfWeek: "*" },
  },
  {
    label: "Weekdays 9 AM",
    parts: { minute: "0", hour: "9", dayOfMonth: "*", month: "*", dayOfWeek: "1-5" },
  },
  {
    label: "Monday 9 AM",
    parts: { minute: "0", hour: "9", dayOfMonth: "*", month: "*", dayOfWeek: "1" },
  },
  {
    label: "1st of month",
    parts: { minute: "0", hour: "0", dayOfMonth: "1", month: "*", dayOfWeek: "*" },
  },
  {
    label: "Every Sunday",
    parts: { minute: "0", hour: "0", dayOfMonth: "*", month: "*", dayOfWeek: "0" },
  },
];

function partsToExpression(parts: CronParts): string {
  return CRON_FIELDS.map((f) => parts[f.key] || "*").join(" ");
}

function expressionToParts(expression: string): CronParts | null {
  const trimmed = expression.trim().replace(/\s+/g, " ");
  const fields = trimmed.split(" ");

  if (fields.length !== 5) return null;

  return {
    minute: fields[0],
    hour: fields[1],
    dayOfMonth: fields[2],
    month: fields[3],
    dayOfWeek: fields[4],
  };
}

function getDescription(expression: string): string | null {
  try {
    return cronstrue.toString(expression, { use24HourTimeFormat: false });
  } catch {
    return null;
  }
}

function getNextRuns(expression: string, count = 5): { runs: string[]; error: string | null } {
  try {
    const interval = parser.parse(expression, { tz: Intl.DateTimeFormat().resolvedOptions().timeZone });
    const runs: string[] = [];

    for (let i = 0; i < count; i++) {
      const next = interval.next();
      runs.push(
        next.toDate().toLocaleString(undefined, {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    }

    return { runs, error: null };
  } catch (e) {
    return {
      runs: [],
      error: e instanceof Error ? e.message : "Invalid cron expression",
    };
  }
}

export function CronGeneratorTool() {
  const [parts, setParts] = useState<CronParts>(DEFAULT_PARTS);
  const [expression, setExpression] = useState(partsToExpression(DEFAULT_PARTS));
  const [editMode, setEditMode] = useState<"builder" | "expression">("builder");
  const [copied, setCopied] = useState(false);

  const description = useMemo(() => getDescription(expression), [expression]);
  const { runs, error } = useMemo(() => getNextRuns(expression), [expression]);

  useEffect(() => {
    if (editMode === "builder") {
      setExpression(partsToExpression(parts));
    }
  }, [parts, editMode]);

  const handleExpressionChange = useCallback((value: string) => {
    setExpression(value);
    const parsed = expressionToParts(value);
    if (parsed) {
      setParts(parsed);
    }
  }, []);

  const handlePartChange = useCallback((key: keyof CronParts, value: string) => {
    setParts((prev) => ({ ...prev, [key]: value }));
  }, []);

  const applyPreset = useCallback((preset: CronParts) => {
    setParts(preset);
    setEditMode("builder");
  }, []);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(expression);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [expression]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Cron Expression Generator</CardTitle>
          <CardDescription>
            Build cron schedules for Linux, Kubernetes, GitHub Actions, and Spring
            @Scheduled. See human-readable descriptions and next run times.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => applyPreset(preset.parts)}
                className="rounded-full border border-border px-3 py-1 text-xs font-medium transition-colors hover:border-primary hover:text-primary"
              >
                {preset.label}
              </button>
            ))}
          </div>

          <div className="flex rounded-lg border border-input p-0.5 w-fit">
            <button
              type="button"
              onClick={() => setEditMode("builder")}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                editMode === "builder"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Builder
            </button>
            <button
              type="button"
              onClick={() => setEditMode("expression")}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                editMode === "expression"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Expression
            </button>
          </div>

          {editMode === "builder" ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {CRON_FIELDS.map((field) => (
                <div key={field.key} className="space-y-1">
                  <label
                    className="text-sm font-medium"
                    htmlFor={`cron-${field.key}`}
                  >
                    {field.label}
                  </label>
                  <p className="text-xs text-muted-foreground">{field.range}</p>
                  <input
                    id={`cron-${field.key}`}
                    value={parts[field.key]}
                    onChange={(e) => handlePartChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    spellCheck={false}
                    className="h-9 w-full rounded-lg border border-input bg-transparent px-3 font-mono text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="cron-expression">
                Cron expression (5 fields)
              </label>
              <input
                id="cron-expression"
                value={expression}
                onChange={(e) => handleExpressionChange(e.target.value)}
                placeholder="* * * * *"
                spellCheck={false}
                className="h-10 w-full rounded-lg border border-input bg-transparent px-3 font-mono text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </div>
          )}

          <div className="rounded-lg border border-input bg-muted/30 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-medium">Cron expression</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCopy}>
                  {copied ? (
                    <Check className="size-4 text-success" />
                  ) : (
                    <Copy className="size-4" />
                  )}
                  {copied ? "Copied" : "Copy"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => applyPreset(DEFAULT_PARTS)}
                >
                  <RefreshCw className="size-4" />
                  Reset
                </Button>
              </div>
            </div>
            <p className="mt-2 font-mono text-lg">{expression}</p>
            {description && (
              <p className="mt-2 text-sm text-muted-foreground">{description}</p>
            )}
          </div>

          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}

          {runs.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Next run times (local timezone)</h3>
              <ul className="space-y-1">
                {runs.map((run, i) => (
                  <li
                    key={i}
                    className="rounded-md border border-input bg-muted/20 px-3 py-2 font-mono text-sm"
                  >
                    {run}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            Standard 5-field cron: minute hour day-of-month month day-of-week.
            Compatible with crontab, Kubernetes CronJob, GitHub Actions, and Quartz.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
