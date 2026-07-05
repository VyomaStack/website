"use client";

import { useCallback, useState } from "react";
import { Copy, Check, RefreshCw, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function generateUuid(): string {
  return crypto.randomUUID();
}

export function UuidGeneratorTool() {
  const [uuids, setUuids] = useState<string[]>([generateUuid()]);
  const [count, setCount] = useState(1);
  const [uppercase, setUppercase] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const format = useCallback(
    (uuid: string) => (uppercase ? uuid.toUpperCase() : uuid.toLowerCase()),
    [uppercase]
  );

  const handleGenerate = useCallback(() => {
    const n = Math.min(Math.max(count, 1), 100);
    setUuids(Array.from({ length: n }, () => format(generateUuid())));
  }, [count, format]);

  const handleCopyOne = useCallback(async (uuid: string) => {
    await navigator.clipboard.writeText(uuid);
    setCopied(uuid);
    setTimeout(() => setCopied(null), 2000);
  }, []);

  const handleCopyAll = useCallback(async () => {
    await navigator.clipboard.writeText(uuids.join("\n"));
    setCopied("all");
    setTimeout(() => setCopied(null), 2000);
  }, [uuids]);

  const handleClear = useCallback(() => {
    setUuids([]);
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>UUID v4 Generator</CardTitle>
          <CardDescription>
            Generate cryptographically random UUID v4 identifiers. Runs
            entirely in your browser.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium" htmlFor="uuid-count">
                Count
              </label>
              <input
                id="uuid-count"
                type="number"
                min={1}
                max={100}
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="h-8 w-20 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </div>

            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={uppercase}
                onChange={(e) => {
                  setUppercase(e.target.checked);
                  setUuids((prev) =>
                    prev.map((u) =>
                      e.target.checked ? u.toUpperCase() : u.toLowerCase()
                    )
                  );
                }}
                className="size-4 rounded border-input"
              />
              Uppercase
            </label>

            <div className="flex flex-wrap gap-2 sm:ml-auto">
              <Button onClick={handleGenerate}>
                <RefreshCw className="size-4" />
                Generate
              </Button>
              {uuids.length > 0 && (
                <>
                  <Button variant="outline" onClick={handleCopyAll}>
                    {copied === "all" ? (
                      <Check className="size-4 text-success" />
                    ) : (
                      <Copy className="size-4" />
                    )}
                    {copied === "all" ? "Copied" : "Copy All"}
                  </Button>
                  <Button variant="ghost" onClick={handleClear}>
                    <Trash2 className="size-4" />
                    Clear
                  </Button>
                </>
              )}
            </div>
          </div>

          {uuids.length > 0 ? (
            <ul className="space-y-2">
              {uuids.map((uuid, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between gap-3 rounded-lg border border-input bg-muted/30 px-3 py-2 font-mono text-sm"
                >
                  <span className="break-all">{uuid}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopyOne(uuid)}
                  >
                    {copied === uuid ? (
                      <Check className="size-4 text-success" />
                    ) : (
                      <Copy className="size-4" />
                    )}
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              Click Generate to create UUIDs.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
