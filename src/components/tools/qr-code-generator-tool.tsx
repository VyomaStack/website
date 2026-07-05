"use client";

import { useCallback, useEffect, useState } from "react";
import QRCode from "qrcode";
import { Copy, Check, Download, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type ErrorLevel = "L" | "M" | "Q" | "H";

const ERROR_LEVELS: { value: ErrorLevel; label: string }[] = [
  { value: "L", label: "Low (7%)" },
  { value: "M", label: "Medium (15%)" },
  { value: "Q", label: "Quartile (25%)" },
  { value: "H", label: "High (30%)" },
];

export function QrCodeGeneratorTool() {
  const [text, setText] = useState("https://www.vyomastack.com");
  const [size, setSize] = useState(256);
  const [errorLevel, setErrorLevel] = useState<ErrorLevel>("M");
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const generateQr = useCallback(async () => {
    if (!text.trim()) {
      setDataUrl(null);
      setError("Enter text or a URL to encode.");
      return;
    }

    try {
      const url = await QRCode.toDataURL(text, {
        width: size,
        margin: 2,
        errorCorrectionLevel: errorLevel,
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
      });
      setDataUrl(url);
      setError(null);
    } catch {
      setDataUrl(null);
      setError("Could not generate QR code. Try shorter text or a valid URL.");
    }
  }, [text, size, errorLevel]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void generateQr();
    }, 300);
    return () => clearTimeout(timer);
  }, [generateQr]);

  const handleDownload = useCallback(() => {
    if (!dataUrl) return;
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "qrcode.png";
    link.click();
  }, [dataUrl]);

  const handleCopyImage = useCallback(async () => {
    if (!dataUrl) return;

    try {
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [dataUrl, text]);

  const handleClear = useCallback(() => {
    setText("");
    setDataUrl(null);
    setError(null);
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>QR Code Generator</CardTitle>
          <CardDescription>
            Create QR codes from URLs, text, WiFi strings, or contact info.
            Download as PNG or copy to clipboard. Runs in your browser.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="qr-text">
                  Text or URL
                </label>
                <textarea
                  id="qr-text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="https://example.com or any text..."
                  spellCheck={false}
                  className="min-h-[120px] w-full resize-y rounded-lg border border-input bg-transparent p-3 text-sm leading-relaxed outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="qr-size">
                  Size: {size}px
                </label>
                <input
                  id="qr-size"
                  type="range"
                  min={128}
                  max={512}
                  step={32}
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="qr-error">
                  Error correction
                </label>
                <select
                  id="qr-error"
                  value={errorLevel}
                  onChange={(e) => setErrorLevel(e.target.value as ErrorLevel)}
                  className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  {ERROR_LEVELS.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={handleDownload} disabled={!dataUrl}>
                  <Download className="size-4" />
                  Download PNG
                </Button>
                <Button variant="outline" onClick={handleCopyImage} disabled={!dataUrl}>
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

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
            </div>

            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-input bg-muted/20 p-6">
              {dataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={dataUrl}
                  alt={`QR code for ${text.slice(0, 40)}`}
                  width={size}
                  height={size}
                  className="max-w-full rounded-md bg-white p-2"
                />
              ) : (
                <p className="text-sm text-muted-foreground">
                  QR code preview will appear here.
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
