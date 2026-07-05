"use client";

import { useCallback, useMemo, useState } from "react";
import { Copy, Check, RefreshCw, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const LOWER = "abcdefghijklmnopqrstuvwxyz";
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DIGITS = "0123456789";
const SYMBOLS = "!@#$%^&*()-_=+[]{}|;:,.<>?";
const AMBIGUOUS = "0O1lI";

type Strength = "weak" | "fair" | "good" | "strong";

function buildCharset(options: {
  lowercase: boolean;
  uppercase: boolean;
  numbers: boolean;
  symbols: boolean;
  excludeAmbiguous: boolean;
}): string {
  let charset = "";
  if (options.lowercase) charset += LOWER;
  if (options.uppercase) charset += UPPER;
  if (options.numbers) charset += DIGITS;
  if (options.symbols) charset += SYMBOLS;

  if (options.excludeAmbiguous) {
    charset = charset
      .split("")
      .filter((c) => !AMBIGUOUS.includes(c))
      .join("");
  }

  return charset;
}

function getStrength(password: string, charsetSize: number): Strength {
  if (!password) return "weak";

  let score = 0;
  if (password.length >= 12) score += 2;
  else if (password.length >= 8) score += 1;

  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;
  if (charsetSize >= 70) score += 1;

  if (score >= 6) return "strong";
  if (score >= 4) return "good";
  if (score >= 2) return "fair";
  return "weak";
}

const STRENGTH_STYLES: Record<Strength, string> = {
  weak: "bg-destructive/15 text-destructive",
  fair: "bg-orange-500/15 text-orange-600 dark:text-orange-400",
  good: "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400",
  strong: "bg-success/15 text-success",
};

function generatePassword(length: number, charset: string): string {
  if (!charset) return "";

  const values = new Uint32Array(length);
  crypto.getRandomValues(values);

  return Array.from(values, (v) => charset[v % charset.length]).join("");
}

export function PasswordGeneratorTool() {
  const [length, setLength] = useState(16);
  const [count, setCount] = useState(1);
  const [lowercase, setLowercase] = useState(true);
  const [uppercase, setUppercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [passwords, setPasswords] = useState<string[]>([generatePassword(16, buildCharset({
    lowercase: true,
    uppercase: true,
    numbers: true,
    symbols: true,
    excludeAmbiguous: false,
  }))]);
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const charset = useMemo(
    () =>
      buildCharset({
        lowercase,
        uppercase,
        numbers,
        symbols,
        excludeAmbiguous,
      }),
    [lowercase, uppercase, numbers, symbols, excludeAmbiguous]
  );

  const strength = useMemo(
    () => getStrength(passwords[0] ?? "", charset.length),
    [passwords, charset.length]
  );

  const handleGenerate = useCallback(() => {
    if (!charset) {
      setError("Select at least one character type.");
      setPasswords([]);
      return;
    }

    const n = Math.min(Math.max(count, 1), 50);
    const len = Math.min(Math.max(length, 4), 128);
    setPasswords(Array.from({ length: n }, () => generatePassword(len, charset)));
    setError(null);
  }, [charset, count, length]);

  const handleCopyOne = useCallback(async (password: string) => {
    await navigator.clipboard.writeText(password);
    setCopied(password);
    setTimeout(() => setCopied(null), 2000);
  }, []);

  const handleCopyAll = useCallback(async () => {
    await navigator.clipboard.writeText(passwords.join("\n"));
    setCopied("all");
    setTimeout(() => setCopied(null), 2000);
  }, [passwords]);

  const handleClear = useCallback(() => {
    setPasswords([]);
    setError(null);
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Password Generator</CardTitle>
          <CardDescription>
            Create strong random passwords with custom length and character sets.
            Uses crypto.getRandomValues — runs entirely in your browser.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="pwd-length">
                Length: {length}
              </label>
              <input
                id="pwd-length"
                type="range"
                min={4}
                max={128}
                value={length}
                onChange={(e) => setLength(Number(e.target.value))}
                className="w-full accent-primary"
              />
            </div>
            <div className="flex items-end gap-2">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="pwd-count">
                  Count
                </label>
                <input
                  id="pwd-count"
                  type="number"
                  min={1}
                  max={50}
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  className="h-8 w-20 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-3">
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={lowercase}
                onChange={(e) => setLowercase(e.target.checked)}
                className="size-4 rounded border-input"
              />
              Lowercase (a-z)
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={uppercase}
                onChange={(e) => setUppercase(e.target.checked)}
                className="size-4 rounded border-input"
              />
              Uppercase (A-Z)
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={numbers}
                onChange={(e) => setNumbers(e.target.checked)}
                className="size-4 rounded border-input"
              />
              Numbers (0-9)
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={symbols}
                onChange={(e) => setSymbols(e.target.checked)}
                className="size-4 rounded border-input"
              />
              Symbols (!@#...)
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={excludeAmbiguous}
                onChange={(e) => setExcludeAmbiguous(e.target.checked)}
                className="size-4 rounded border-input"
              />
              Exclude ambiguous (0, O, 1, l, I)
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={handleGenerate}>
              <RefreshCw className="size-4" />
              Generate
            </Button>
            {passwords.length > 0 && (
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
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${STRENGTH_STYLES[strength]}`}
                >
                  {strength} password
                </span>
              </>
            )}
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          {passwords.length > 0 ? (
            <ul className="space-y-2">
              {passwords.map((password, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between gap-3 rounded-lg border border-input bg-muted/30 px-3 py-2 font-mono text-sm"
                >
                  <span className="break-all">{password}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopyOne(password)}
                  >
                    {copied === password ? (
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
              Click Generate to create passwords.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
