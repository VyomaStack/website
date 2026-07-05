"use client";

import { useCallback, useState } from "react";
import {
  ArrowDownUp,
  Copy,
  Check,
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

const SAMPLE = "https://example.com/search?q=hello world&lang=en";

function encodeUrl(text: string, fullUri: boolean): string {
  return fullUri ? encodeURI(text) : encodeURIComponent(text);
}

function decodeUrl(text: string): string {
  return decodeURIComponent(text.replace(/\+/g, " "));
}

export function UrlEncoderTool() {
  const [input, setInput] = useState(SAMPLE);
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [encodeMode, setEncodeMode] = useState<"component" | "uri">("component");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleConvert = useCallback(() => {
    if (!input.trim()) {
      setOutput("");
      setError("Please enter text to convert.");
      return;
    }
    try {
      if (mode === "encode") {
        setOutput(encodeUrl(input, encodeMode === "uri"));
      } else {
        setOutput(decodeUrl(input));
      }
      setError(null);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Invalid URL encoding. Check your input."
      );
      setOutput("");
    }
  }, [input, mode, encodeMode]);

  const handleSwap = useCallback(() => {
    if (output) {
      setInput(output);
      setOutput("");
      setMode((m) => (m === "encode" ? "decode" : "encode"));
      setError(null);
    }
  }, [output]);

  const handleCopy = useCallback(async () => {
    const text = output || input;
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [output, input]);

  const handleClear = useCallback(() => {
    setInput("");
    setOutput("");
    setError(null);
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>URL Encoder & Decoder</CardTitle>
          <CardDescription>
            Encode or decode URL strings and query parameters. Supports
            encodeURIComponent and encodeURI. Runs in your browser.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex rounded-lg border border-input p-0.5">
              <button
                type="button"
                onClick={() => setMode("encode")}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  mode === "encode"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Encode
              </button>
              <button
                type="button"
                onClick={() => setMode("decode")}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  mode === "decode"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Decode
              </button>
            </div>

            {mode === "encode" && (
              <select
                value={encodeMode}
                onChange={(e) =>
                  setEncodeMode(e.target.value as "component" | "uri")
                }
                className="h-8 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <option value="component">encodeURIComponent (query values)</option>
                <option value="uri">encodeURI (full URL)</option>
              </select>
            )}

            <div className="flex flex-wrap gap-2 sm:ml-auto">
              <Button onClick={handleConvert}>
                {mode === "encode" ? "Encode" : "Decode"}
              </Button>
              <Button variant="outline" onClick={handleSwap} disabled={!output}>
                <ArrowDownUp className="size-4" />
                Swap
              </Button>
              <Button variant="outline" onClick={handleCopy}>
                {copied ? (
                  <Check className="size-4 text-success" />
                ) : (
                  <Copy className="size-4" />
                )}
                {copied ? "Copied" : "Copy"}
              </Button>
              <Button variant="ghost" onClick={handleClear}>
                <Trash2 className="size-4" />
                Clear
              </Button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              <AlertCircle className="size-4 shrink-0" />
              {error}
            </div>
          )}

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="url-input">
                {mode === "encode" ? "Plain text / URL" : "Encoded URL"}
              </label>
              <textarea
                id="url-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter URL or text..."
                spellCheck={false}
                className="min-h-[240px] w-full resize-y rounded-lg border border-input bg-transparent p-3 font-mono text-sm leading-relaxed outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="url-output">
                {mode === "encode" ? "Encoded output" : "Decoded output"}
              </label>
              <textarea
                id="url-output"
                value={output}
                readOnly
                placeholder="Result will appear here..."
                spellCheck={false}
                className="min-h-[240px] w-full resize-y rounded-lg border border-input bg-muted/30 p-3 font-mono text-sm leading-relaxed outline-none"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card size="sm">
        <CardHeader>
          <CardTitle>Encoding modes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            <strong className="text-foreground">encodeURIComponent</strong> —
            encodes all special characters. Use for query parameter values
            (e.g. <code className="text-xs">q=hello%20world</code>).
          </p>
          <p>
            <strong className="text-foreground">encodeURI</strong> — encodes a
            full URI but preserves characters like <code className="text-xs">/</code>,{" "}
            <code className="text-xs">:</code>, <code className="text-xs">?</code>,{" "}
            <code className="text-xs">=</code>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
