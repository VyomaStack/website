"use client";

import { useCallback, useMemo, useState } from "react";
import { parse, stringify } from "yaml";
import {
  AlignLeft,
  Braces,
  Check,
  CheckCircle2,
  Copy,
  Download,
  Minimize2,
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

const SAMPLE_YAML = `apiVersion: apps/v1
kind: Deployment
metadata:
  name: vyomastack-api
  labels:
    app: api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api
    spec:
      containers:
        - name: api
          image: vyomastack/api:1.0
          ports:
            - containerPort: 8080
          env:
            - name: LOG_LEVEL
              value: info`;

function formatYaml(text: string, indent: number): string {
  const doc = parse(text);
  return stringify(doc, { indent, lineWidth: 80 });
}

function minifyYaml(text: string): string {
  const doc = parse(text);
  return stringify(doc, { lineWidth: 0, indent: 2 }).replace(/\n$/, "");
}

function yamlToJson(text: string): string {
  const doc = parse(text);
  return JSON.stringify(doc, null, 2);
}

export function YamlFormatterTool() {
  const [input, setInput] = useState(SAMPLE_YAML);
  const [output, setOutput] = useState(() => {
    try {
      return formatYaml(SAMPLE_YAML, 2);
    } catch {
      return "";
    }
  });
  const [indent, setIndent] = useState(2);
  const [error, setError] = useState<string | null>(null);
  const [valid, setValid] = useState<boolean | null>(true);
  const [copied, setCopied] = useState(false);

  const handleFormat = useCallback(() => {
    if (!input.trim()) {
      setOutput("");
      setError("Please enter YAML content.");
      setValid(null);
      return;
    }
    try {
      setOutput(formatYaml(input, indent));
      setError(null);
      setValid(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid YAML.");
      setOutput("");
      setValid(false);
    }
  }, [input, indent]);

  const handleMinify = useCallback(() => {
    if (!input.trim()) {
      setOutput("");
      setError("Please enter YAML content.");
      setValid(null);
      return;
    }
    try {
      setOutput(minifyYaml(input));
      setError(null);
      setValid(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid YAML.");
      setOutput("");
      setValid(false);
    }
  }, [input]);

  const handleValidate = useCallback(() => {
    if (!input.trim()) {
      setError("Please enter YAML content.");
      setValid(null);
      setOutput("");
      return;
    }
    try {
      parse(input);
      setError(null);
      setValid(true);
      setOutput("✓ Valid YAML");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid YAML.");
      setValid(false);
      setOutput("");
    }
  }, [input]);

  const handleToJson = useCallback(() => {
    if (!input.trim()) {
      setOutput("");
      setError("Please enter YAML content.");
      return;
    }
    try {
      setOutput(yamlToJson(input));
      setError(null);
      setValid(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid YAML.");
      setOutput("");
      setValid(false);
    }
  }, [input]);

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
    const blob = new Blob([text], { type: "text/yaml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "config.yaml";
    a.click();
    URL.revokeObjectURL(url);
  }, [output, input]);

  const handleClear = useCallback(() => {
    setInput("");
    setOutput("");
    setError(null);
    setValid(null);
  }, []);

  const lineCount = useMemo(() => input.split("\n").length, [input]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>YAML Formatter & Validator</CardTitle>
          <CardDescription>
            Format, validate, minify, and convert YAML to JSON. Perfect for
            Kubernetes, Docker Compose, and CI configs — runs in your browser.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <label className="text-sm font-medium" htmlFor="yaml-indent">
              Indent
            </label>
            <select
              id="yaml-indent"
              value={indent}
              onChange={(e) => setIndent(Number(e.target.value))}
              className="h-8 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <option value={2}>2 spaces</option>
              <option value={4}>4 spaces</option>
            </select>
            <span className="text-sm text-muted-foreground">
              {lineCount} lines
            </span>
            {valid === true && (
              <span className="flex items-center gap-1 text-sm text-success">
                <CheckCircle2 className="size-4" />
                Valid YAML
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
              <Button variant="outline" onClick={handleToJson}>
                <Braces className="size-4" />
                To JSON
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
              <label className="text-sm font-medium" htmlFor="yaml-input">
                Input YAML
              </label>
              <textarea
                id="yaml-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste Kubernetes, Docker, or CI YAML..."
                spellCheck={false}
                className="min-h-[320px] w-full resize-y rounded-lg border border-input bg-transparent p-3 font-mono text-sm leading-relaxed outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="yaml-output">
                Output
              </label>
              <textarea
                id="yaml-output"
                value={output}
                readOnly
                placeholder="Formatted YAML or JSON will appear here..."
                spellCheck={false}
                className="min-h-[320px] w-full resize-y rounded-lg border border-input bg-muted/30 p-3 font-mono text-sm leading-relaxed outline-none"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card size="sm">
        <CardHeader>
          <CardTitle>How it works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            <strong className="text-foreground">Format</strong> — beautifies YAML
            with consistent indentation for K8s manifests and configs.
          </p>
          <p>
            <strong className="text-foreground">To JSON</strong> — convert YAML
            to JSON for APIs and debugging. Pair with{" "}
            <strong className="text-foreground">Text Compare</strong> for config
            diffs.
          </p>
          <p>
            <strong className="text-foreground">Private</strong> — all processing
            runs locally. Your cluster secrets never leave your browser.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
