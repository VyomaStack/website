"use client";

import { useCallback, useMemo, useState } from "react";
import { Copy, Check, AlertCircle, AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const SAMPLE_JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjk5OTk5OTk5OTl9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

function decodeBase64Url(segment: string): string {
  const padded = segment.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4;
  const base64 = pad ? padded + "=".repeat(4 - pad) : padded;
  return decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );
}

function formatJson(obj: unknown): string {
  return JSON.stringify(obj, null, 2);
}

function formatExpiry(exp?: number): string | null {
  if (!exp) return null;
  const date = new Date(exp * 1000);
  const expired = date < new Date();
  return `${date.toUTCString()}${expired ? " (expired)" : ""}`;
}

export function JwtDecoderTool() {
  const [token, setToken] = useState(SAMPLE_JWT);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const decoded = useMemo(() => {
    if (!token.trim()) return null;
    try {
      const parts = token.trim().split(".");
      if (parts.length !== 3) {
        throw new Error("JWT must have exactly 3 parts separated by dots.");
      }
      const header = JSON.parse(decodeBase64Url(parts[0])) as Record<
        string,
        unknown
      >;
      const payload = JSON.parse(decodeBase64Url(parts[1])) as Record<
        string,
        unknown
      >;
      return { header, payload, signature: parts[2] };
    } catch (e) {
      return null;
    }
  }, [token]);

  const handleDecode = useCallback(() => {
    if (!token.trim()) {
      setError("Please paste a JWT token.");
      return;
    }
    const parts = token.trim().split(".");
    if (parts.length !== 3) {
      setError("Invalid JWT format. Expected header.payload.signature");
      return;
    }
    try {
      JSON.parse(decodeBase64Url(parts[0]));
      JSON.parse(decodeBase64Url(parts[1]));
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to decode JWT.");
    }
  }, [token]);

  const handleCopy = useCallback(async (label: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  }, []);

  const expiry = decoded?.payload?.exp
    ? formatExpiry(decoded.payload.exp as number)
    : null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>JWT Decoder</CardTitle>
          <CardDescription>
            Decode JWT header and payload. Does not verify signatures — for
            inspection only.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-700 dark:text-amber-400">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" />
            Never paste production secrets. This tool does not verify token
            signatures.
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="jwt-input">
              Encoded JWT
            </label>
            <textarea
              id="jwt-input"
              value={token}
              onChange={(e) => {
                setToken(e.target.value);
                setError(null);
              }}
              placeholder="eyJhbGciOiJIUzI1NiIs..."
              spellCheck={false}
              className="min-h-[100px] w-full resize-y rounded-lg border border-input bg-transparent p-3 font-mono text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>

          <Button onClick={handleDecode}>Decode JWT</Button>

          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              <AlertCircle className="size-4 shrink-0" />
              {error}
            </div>
          )}

          {decoded && !error && (
            <div className="space-y-4">
              {expiry && (
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Expires:</strong>{" "}
                  {expiry}
                </p>
              )}

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold">Header</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      handleCopy("header", formatJson(decoded.header))
                    }
                  >
                    {copied === "header" ? (
                      <Check className="size-4 text-success" />
                    ) : (
                      <Copy className="size-4" />
                    )}
                    Copy
                  </Button>
                </div>
                <pre className="overflow-x-auto rounded-lg border border-input bg-muted/30 p-3 font-mono text-sm">
                  {formatJson(decoded.header)}
                </pre>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold">Payload</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      handleCopy("payload", formatJson(decoded.payload))
                    }
                  >
                    {copied === "payload" ? (
                      <Check className="size-4 text-success" />
                    ) : (
                      <Copy className="size-4" />
                    )}
                    Copy
                  </Button>
                </div>
                <pre className="overflow-x-auto rounded-lg border border-input bg-muted/30 p-3 font-mono text-sm">
                  {formatJson(decoded.payload)}
                </pre>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-semibold">Signature</h3>
                <pre className="overflow-x-auto rounded-lg border border-input bg-muted/30 p-3 font-mono text-xs break-all text-muted-foreground">
                  {decoded.signature}
                </pre>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
