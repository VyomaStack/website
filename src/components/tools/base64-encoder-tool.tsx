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

function encodeBase64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary);
}

function decodeBase64(encoded: string): string {
  const binary = atob(encoded.replace(/\s/g, ""));
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function Base64EncoderTool() {
  const [input, setInput] = useState("Hello, VyomaStack!");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleConvert = useCallback(() => {
    if (!input.trim()) {
      setOutput("");
      setError("Please enter text to convert.");
      return;
    }
    try {
      setOutput(mode === "encode" ? encodeBase64(input) : decodeBase64(input));
      setError(null);
    } catch (e) {
      setError(
        mode === "decode"
          ? "Invalid Base64 string. Check your input and try again."
          : e instanceof Error
            ? e.message
            : "Conversion failed."
      );
      setOutput("");
    }
  }, [input, mode]);

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
          <CardTitle>Base64 Encoder & Decoder</CardTitle>
          <CardDescription>
            Encode text to Base64 or decode Base64 back to plain text. Supports
            UTF-8. Runs in your browser.
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
              <label className="text-sm font-medium" htmlFor="b64-input">
                {mode === "encode" ? "Plain text" : "Base64 input"}
              </label>
              <textarea
                id="b64-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  mode === "encode" ? "Enter text to encode..." : "Enter Base64..."
                }
                spellCheck={false}
                className="min-h-[240px] w-full resize-y rounded-lg border border-input bg-transparent p-3 font-mono text-sm leading-relaxed outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="b64-output">
                {mode === "encode" ? "Base64 output" : "Decoded text"}
              </label>
              <textarea
                id="b64-output"
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
    </div>
  );
}
