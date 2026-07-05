"use client";

import { useCallback, useEffect, useState } from "react";
import { Copy, Check, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  HASH_ALGORITHMS,
  hashAll,
  type HashAlgorithm,
} from "@/lib/hash";

export function HashGeneratorTool() {
  const [input, setInput] = useState("Hello, VyomaStack!");
  const [hashes, setHashes] = useState<Record<HashAlgorithm, string> | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const computeHashes = useCallback(async (text: string) => {
    if (!text) {
      setHashes(null);
      return;
    }

    setLoading(true);
    try {
      const result = await hashAll(text);
      setHashes(result);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void computeHashes(input);
    }, 200);
    return () => clearTimeout(timer);
  }, [input, computeHashes]);

  const handleCopy = useCallback(async (algorithm: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(algorithm);
    setTimeout(() => setCopied(null), 2000);
  }, []);

  const handleClear = useCallback(() => {
    setInput("");
    setHashes(null);
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Hash Generator</CardTitle>
          <CardDescription>
            Generate MD5, SHA-1, SHA-256, SHA-384, and SHA-512 hashes from text.
            All hashing runs in your browser — your input never leaves your device.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button variant="ghost" onClick={handleClear}>
              <Trash2 className="size-4" />
              Clear
            </Button>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="hash-input">
              Input text
            </label>
            <textarea
              id="hash-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter text to hash..."
              spellCheck={false}
              className="min-h-[120px] w-full resize-y rounded-lg border border-input bg-transparent p-3 font-mono text-sm leading-relaxed outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>

          {loading && (
            <p className="text-sm text-muted-foreground">Computing hashes...</p>
          )}

          {hashes && (
            <ul className="space-y-3">
              {HASH_ALGORITHMS.map((algorithm) => (
                <li
                  key={algorithm}
                  className="rounded-lg border border-input bg-muted/30 p-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium">{algorithm}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(algorithm, hashes[algorithm])}
                    >
                      {copied === algorithm ? (
                        <Check className="size-4 text-success" />
                      ) : (
                        <Copy className="size-4" />
                      )}
                    </Button>
                  </div>
                  <p className="mt-1 break-all font-mono text-xs text-muted-foreground sm:text-sm">
                    {hashes[algorithm]}
                  </p>
                </li>
              ))}
            </ul>
          )}

          {!input && (
            <p className="text-sm text-muted-foreground">
              Enter text above to generate hashes.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
