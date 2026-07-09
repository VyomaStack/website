"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Check,
  Clock,
  Copy,
  ArrowDownUp,
  AlertCircle,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Unit = "seconds" | "milliseconds";

function detectUnit(ts: string): Unit {
  const n = Number(ts.trim());
  if (String(Math.floor(n)).length >= 13) return "milliseconds";
  return "seconds";
}

function toMs(value: string, unit: Unit): number {
  const n = Number(value);
  if (Number.isNaN(n)) throw new Error("Invalid timestamp number.");
  return unit === "milliseconds" ? n : n * 1000;
}

function timestampToDates(ms: number) {
  const date = new Date(ms);
  if (Number.isNaN(date.getTime())) {
    throw new Error("Timestamp out of valid range.");
  }
  return {
    local: date.toLocaleString(undefined, {
      dateStyle: "full",
      timeStyle: "long",
    }),
    utc: date.toUTCString(),
    iso: date.toISOString(),
    relative: formatRelative(ms),
  };
}

function formatRelative(ms: number): string {
  const diff = ms - Date.now();
  const abs = Math.abs(diff);
  const mins = Math.floor(abs / 60000);
  const hours = Math.floor(abs / 3600000);
  const days = Math.floor(abs / 86400000);
  const suffix = diff < 0 ? "ago" : "from now";
  if (days > 0) return `${days} day${days === 1 ? "" : "s"} ${suffix}`;
  if (hours > 0) return `${hours} hour${hours === 1 ? "" : "s"} ${suffix}`;
  if (mins > 0) return `${mins} minute${mins === 1 ? "" : "s"} ${suffix}`;
  return "just now";
}

function dateInputToTimestamp(input: string, unit: Unit): string {
  const ms = new Date(input).getTime();
  if (Number.isNaN(ms)) throw new Error("Invalid date. Use the picker or ISO format.");
  return unit === "milliseconds" ? String(ms) : String(Math.floor(ms / 1000));
}

export function TimestampConverterTool() {
  const [timestamp, setTimestamp] = useState("");
  const [dateInput, setDateInput] = useState("");
  const [unit, setUnit] = useState<Unit>("seconds");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const handleTimestampToDate = useCallback(() => {
    if (!timestamp.trim()) {
      setError("Enter a Unix timestamp.");
      setOutput("");
      return;
    }
    try {
      const detected = detectUnit(timestamp);
      const ms = toMs(timestamp, detected);
      const dates = timestampToDates(ms);
      setOutput(
        [
          `Local:  ${dates.local}`,
          `UTC:    ${dates.utc}`,
          `ISO:    ${dates.iso}`,
          `Relative: ${dates.relative}`,
          "",
          `Detected unit: ${detected}`,
        ].join("\n")
      );
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Conversion failed.");
      setOutput("");
    }
  }, [timestamp]);

  const handleDateToTimestamp = useCallback(() => {
    if (!dateInput.trim()) {
      setError("Enter or pick a date.");
      setOutput("");
      return;
    }
    try {
      const result = dateInputToTimestamp(dateInput, unit);
      const ms = toMs(result, unit);
      const dates = timestampToDates(ms);
      setOutput(
        [
          `${unit === "milliseconds" ? "Milliseconds" : "Seconds"}: ${result}`,
          `ISO: ${dates.iso}`,
          `UTC: ${dates.utc}`,
        ].join("\n")
      );
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Conversion failed.");
      setOutput("");
    }
  }, [dateInput, unit]);

  const handleNow = useCallback(() => {
    const sec = Math.floor(now / 1000);
    const ms = now;
    setTimestamp(unit === "milliseconds" ? String(ms) : String(sec));
    setDateInput(new Date(now).toISOString().slice(0, 16));
    const dates = timestampToDates(now);
    setOutput(
      [
        `Now (${unit}): ${unit === "milliseconds" ? ms : sec}`,
        `Local:  ${dates.local}`,
        `UTC:    ${dates.utc}`,
        `ISO:    ${dates.iso}`,
      ].join("\n")
    );
    setError(null);
  }, [now, unit]);

  const handleCopy = useCallback(async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [output]);

  const handleClear = useCallback(() => {
    setTimestamp("");
    setDateInput("");
    setOutput("");
    setError(null);
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Unix Timestamp Converter</CardTitle>
          <CardDescription>
            Convert Unix epoch timestamps to human-readable dates and back.
            Auto-detects seconds vs milliseconds. Runs in your browser.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <label className="text-sm font-medium">Output unit</label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value as Unit)}
              className="h-8 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <option value="seconds">Seconds</option>
              <option value="milliseconds">Milliseconds</option>
            </select>
            <Button variant="outline" size="sm" onClick={handleNow}>
              <Clock className="size-4" />
              Now
            </Button>
            {output && (
              <Button variant="outline" size="sm" onClick={handleCopy}>
                {copied ? (
                  <Check className="size-4 text-success" />
                ) : (
                  <Copy className="size-4" />
                )}
                {copied ? "Copied" : "Copy"}
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={handleClear}>
              <Trash2 className="size-4" />
              Clear
            </Button>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              <AlertCircle className="size-4 shrink-0" />
              {error}
            </div>
          )}

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-3 rounded-lg border border-input p-4">
              <p className="text-sm font-medium">Timestamp → Date</p>
              <input
                type="text"
                value={timestamp}
                onChange={(e) => setTimestamp(e.target.value)}
                placeholder="e.g. 1717200000 or 1717200000000"
                className="h-10 w-full rounded-lg border border-input bg-transparent px-3 font-mono text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
              <Button onClick={handleTimestampToDate} className="w-full">
                <ArrowDownUp className="size-4" />
                Convert to date
              </Button>
            </div>

            <div className="space-y-3 rounded-lg border border-input p-4">
              <p className="text-sm font-medium">Date → Timestamp</p>
              <input
                type="datetime-local"
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
                className="h-10 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
              <Button
                variant="outline"
                onClick={handleDateToTimestamp}
                className="w-full"
              >
                <ArrowDownUp className="size-4" />
                Convert to timestamp
              </Button>
            </div>
          </div>

          {output && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Result</label>
              <pre className="overflow-x-auto rounded-lg border border-input bg-muted/30 p-4 font-mono text-sm leading-relaxed">
                {output}
              </pre>
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            Current time: {Math.floor(now / 1000)} s · {now} ms
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
