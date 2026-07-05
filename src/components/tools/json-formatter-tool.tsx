"use client";

import { useCallback, useState } from "react";
import {
  AlignLeft,
  Copy,
  Download,
  Minimize2,
  Check,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AiCodePanel } from "@/components/tools/ai-result-panel";

const SAMPLE_JSON = `{"name":"VyomaStack","tools":["sql-formatter","json-formatter","jwt-decoder"],"meta":{"version":1,"public":true}}`;

export function JsonFormatterTool() {
  const [input, setInput] = useState(SAMPLE_JSON);
  const [output, setOutput] = useState("");
  const [indent, setIndent] = useState(2);
  const [error, setError] = useState<string | null>(null);
  const [valid, setValid] = useState<boolean | null>(null);
  const [copied, setCopied] = useState(false);

  const parseJson = useCallback((text: string) => {
    return JSON.parse(text) as unknown;
  }, []);

  const handleFormat = useCallback(() => {
    if (!input.trim()) {
      setOutput("");
      setError("Please enter JSON data.");
      setValid(null);
      return;
    }
    try {
      const parsed = parseJson(input);
      setOutput(JSON.stringify(parsed, null, indent));
      setError(null);
      setValid(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid JSON.");
      setOutput("");
      setValid(false);
    }
  }, [input, indent, parseJson]);

  const handleMinify = useCallback(() => {
    if (!input.trim()) {
      setOutput("");
      setError("Please enter JSON data.");
      setValid(null);
      return;
    }
    try {
      const parsed = parseJson(input);
      setOutput(JSON.stringify(parsed));
      setError(null);
      setValid(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid JSON.");
      setOutput("");
      setValid(false);
    }
  }, [input, parseJson]);

  const handleValidate = useCallback(() => {
    if (!input.trim()) {
      setError("Please enter JSON data.");
      setValid(null);
      setOutput("");
      return;
    }
    try {
      parseJson(input);
      setError(null);
      setValid(true);
      setOutput("✓ Valid JSON");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid JSON.");
      setValid(false);
      setOutput("");
    }
  }, [input, parseJson]);

  const handleCopy = useCallback(async () => {
    const text = output.startsWith("✓") ? input : output || input;
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [output, input]);

  const handleDownload = useCallback(() => {
    const text = output.startsWith("✓") ? input : output || input;
    if (!text) return;
    const blob = new Blob([text], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.json";
    a.click();
    URL.revokeObjectURL(url);
  }, [output, input]);

  const handleClear = useCallback(() => {
    setInput("");
    setOutput("");
    setError(null);
    setValid(null);
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>JSON Formatter & Validator</CardTitle>
          <CardDescription>
            Format, validate, and minify JSON instantly. All processing runs in
            your browser.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <label className="text-sm font-medium" htmlFor="indent">
              Indent
            </label>
            <select
              id="indent"
              value={indent}
              onChange={(e) => setIndent(Number(e.target.value))}
              className="h-8 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <option value={2}>2 spaces</option>
              <option value={4}>4 spaces</option>
              <option value={1}>1 space</option>
            </select>

            {valid === true && (
              <span className="flex items-center gap-1 text-sm text-success">
                <CheckCircle2 className="size-4" />
                Valid JSON
              </span>
            )}

            <div className="flex flex-wrap gap-2 sm:ml-auto">
              <Button onClick={handleFormat}>
                <AlignLeft className="size-4" />
                Format
              </Button>
              <Button variant="outline" onClick={handleMinify}>
                <Minimize2 className="size-4" />
                Minify
              </Button>
              <Button variant="outline" onClick={handleValidate}>
                Validate
              </Button>
              <Button variant="outline" onClick={handleCopy}>
                {copied ? (
                  <Check className="size-4 text-success" />
                ) : (
                  <Copy className="size-4" />
                )}
                {copied ? "Copied" : "Copy"}
              </Button>
              <Button variant="outline" onClick={handleDownload}>
                <Download className="size-4" />
                Download
              </Button>
              <Button variant="ghost" onClick={handleClear}>
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
              <label className="text-sm font-medium" htmlFor="json-input">
                Input JSON
              </label>
              <textarea
                id="json-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder='{"key": "value"}'
                spellCheck={false}
                className="min-h-[320px] w-full resize-y rounded-lg border border-input bg-transparent p-3 font-mono text-sm leading-relaxed outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="json-output">
                Output
              </label>
              <textarea
                id="json-output"
                value={output}
                readOnly
                placeholder="Formatted JSON will appear here..."
                spellCheck={false}
                className="min-h-[320px] w-full resize-y rounded-lg border border-input bg-muted/30 p-3 font-mono text-sm leading-relaxed outline-none"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <AiCodePanel
        title="AI JSON Studio"
        description="Generate Java POJOs, TypeScript interfaces, OpenAPI schemas, or SQL tables from your JSON."
        generateLabel="Generate"
        disabled={!input.trim()}
        classNameField
        defaultClassName="RootModel"
        types={[
          { value: "java-pojo", label: "Java POJOs" },
          { value: "typescript", label: "TypeScript interfaces" },
          { value: "openapi", label: "OpenAPI schema" },
          { value: "sql", label: "SQL CREATE TABLE" },
        ]}
        onGenerate={async (type, className) => {
          const res = await fetch("/api/ai/json-generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              json: input,
              type,
              className,
            }),
          });
          const data = (await res.json()) as { result?: string; error?: string };
          if (!res.ok) throw new Error(data.error ?? "Request failed");
          return data.result ?? "";
        }}
      />
    </div>
  );
}
