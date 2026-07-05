"use client";

import { useCallback, useMemo, useState } from "react";
import { Copy, Check, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type RegexFlag = "g" | "i" | "m" | "s" | "u" | "y";

const FLAGS: { flag: RegexFlag; label: string; hint: string }[] = [
  { flag: "g", label: "Global", hint: "Find all matches" },
  { flag: "i", label: "Ignore case", hint: "Case-insensitive" },
  { flag: "m", label: "Multiline", hint: "^ and $ match line boundaries" },
  { flag: "s", label: "Dotall", hint: ". matches newlines" },
  { flag: "u", label: "Unicode", hint: "Unicode-aware matching" },
  { flag: "y", label: "Sticky", hint: "Match only at lastIndex" },
];

const EXAMPLES = [
  { label: "Email", pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}" },
  { label: "URL", pattern: "https?:\\/\\/[\\w\\-._~:/?#[\\]@!$&'()*+,;=%]+" },
  { label: "IPv4", pattern: "\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b" },
  { label: "Digits", pattern: "\\d+" },
  { label: "Words", pattern: "\\b\\w+\\b" },
];

interface MatchResult {
  match: string;
  index: number;
  groups: string[];
}

function getMatches(
  pattern: string,
  flags: Set<RegexFlag>,
  text: string
): { matches: MatchResult[]; error: string | null } {
  if (!pattern) {
    return { matches: [], error: null };
  }

  try {
    const regex = new RegExp(pattern, Array.from(flags).join(""));
    const matches: MatchResult[] = [];

    if (flags.has("g") || flags.has("y")) {
      let match: RegExpExecArray | null;
      const re = new RegExp(regex.source, regex.flags);
      while ((match = re.exec(text)) !== null) {
        matches.push({
          match: match[0],
          index: match.index,
          groups: match.slice(1),
        });
        if (match[0].length === 0) {
          re.lastIndex++;
        }
      }
    } else {
      const match = regex.exec(text);
      if (match) {
        matches.push({
          match: match[0],
          index: match.index,
          groups: match.slice(1),
        });
      }
    }

    return { matches, error: null };
  } catch (e) {
    return {
      matches: [],
      error: e instanceof Error ? e.message : "Invalid regular expression",
    };
  }
}

function HighlightedText({
  text,
  matches,
}: {
  text: string;
  matches: MatchResult[];
}) {
  if (!text || matches.length === 0) {
    return <span className="whitespace-pre-wrap break-words">{text}</span>;
  }

  const segments: { text: string; highlight: boolean }[] = [];
  let cursor = 0;

  const sorted = [...matches].sort((a, b) => a.index - b.index);

  for (const m of sorted) {
    if (m.index > cursor) {
      segments.push({ text: text.slice(cursor, m.index), highlight: false });
    }
    segments.push({
      text: text.slice(m.index, m.index + m.match.length),
      highlight: true,
    });
    cursor = m.index + m.match.length;
  }

  if (cursor < text.length) {
    segments.push({ text: text.slice(cursor), highlight: false });
  }

  return (
    <span className="whitespace-pre-wrap break-words">
      {segments.map((seg, i) =>
        seg.highlight ? (
          <mark
            key={i}
            className="rounded bg-primary/25 px-0.5 text-foreground"
          >
            {seg.text}
          </mark>
        ) : (
          <span key={i}>{seg.text}</span>
        )
      )}
    </span>
  );
}

export function RegexTesterTool() {
  const [pattern, setPattern] = useState("\\d+");
  const [testString, setTestString] = useState(
    "Order #12345 shipped on 2024-01-15. Contact: user@example.com"
  );
  const [flags, setFlags] = useState<Set<RegexFlag>>(new Set(["g"]));
  const [copied, setCopied] = useState(false);

  const { matches, error } = useMemo(
    () => getMatches(pattern, flags, testString),
    [pattern, flags, testString]
  );

  const toggleFlag = useCallback((flag: RegexFlag) => {
    setFlags((prev) => {
      const next = new Set(prev);
      if (next.has(flag)) next.delete(flag);
      else next.add(flag);
      return next;
    });
  }, []);

  const handleCopyMatches = useCallback(async () => {
    const text = matches.map((m) => m.match).join("\n");
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [matches]);

  const handleClear = useCallback(() => {
    setPattern("");
    setTestString("");
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Regex Tester</CardTitle>
          <CardDescription>
            Test regular expressions against sample text. See matches, capture
            groups, and highlighted results. Runs entirely in your browser.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="regex-pattern">
              Regular expression
            </label>
            <div className="flex gap-2">
              <span className="flex h-9 items-center rounded-l-lg border border-r-0 border-input bg-muted/50 px-2 font-mono text-sm text-muted-foreground">
                /
              </span>
              <input
                id="regex-pattern"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                placeholder="Enter pattern..."
                spellCheck={false}
                className="h-9 min-w-0 flex-1 rounded-none border border-input bg-transparent px-3 font-mono text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
              <span className="flex h-9 items-center rounded-r-lg border border-l-0 border-input bg-muted/50 px-2 font-mono text-sm text-muted-foreground">
                /{Array.from(flags).join("")}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {FLAGS.map(({ flag, label, hint }) => (
              <label
                key={flag}
                title={hint}
                className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  flags.has(flag)
                    ? "border-primary bg-primary/10"
                    : "border-input"
                }`}
              >
                <input
                  type="checkbox"
                  checked={flags.has(flag)}
                  onChange={() => toggleFlag(flag)}
                  className="size-3.5 rounded border-input"
                />
                {label}
              </label>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-muted-foreground self-center">Examples:</span>
            {EXAMPLES.map((ex) => (
              <button
                key={ex.label}
                type="button"
                onClick={() => setPattern(ex.pattern)}
                className="rounded-full border border-border px-3 py-1 text-xs font-medium transition-colors hover:border-primary hover:text-primary"
              >
                {ex.label}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="regex-test">
              Test string
            </label>
            <textarea
              id="regex-test"
              value={testString}
              onChange={(e) => setTestString(e.target.value)}
              placeholder="Enter text to test against..."
              spellCheck={false}
              className="min-h-[120px] w-full resize-y rounded-lg border border-input bg-transparent p-3 font-mono text-sm leading-relaxed outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {matches.length > 0 && (
              <Button variant="outline" onClick={handleCopyMatches}>
                {copied ? (
                  <Check className="size-4 text-success" />
                ) : (
                  <Copy className="size-4" />
                )}
                {copied ? "Copied" : "Copy matches"}
              </Button>
            )}
            <Button variant="ghost" onClick={handleClear}>
              <Trash2 className="size-4" />
              Clear
            </Button>
          </div>

          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}

          {!error && pattern && (
            <p className="text-sm text-muted-foreground">
              {matches.length} match{matches.length === 1 ? "" : "es"} found
            </p>
          )}

          {testString && matches.length > 0 && (
            <div className="rounded-lg border border-input bg-muted/20 p-3 font-mono text-sm">
              <p className="mb-2 text-xs font-medium text-muted-foreground">
                Highlighted matches
              </p>
              <HighlightedText text={testString} matches={matches} />
            </div>
          )}

          {matches.length > 0 && (
            <ul className="space-y-2">
              {matches.map((m, i) => (
                <li
                  key={`${m.index}-${i}`}
                  className="rounded-lg border border-input bg-muted/30 p-3 font-mono text-sm"
                >
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span>#{i + 1}</span>
                    <span>index: {m.index}</span>
                    <span>length: {m.match.length}</span>
                  </div>
                  <p className="mt-1 break-all">{m.match}</p>
                  {m.groups.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {m.groups.map((g, gi) => (
                        <p key={gi} className="text-xs text-muted-foreground">
                          Group {gi + 1}: {g ?? "(empty)"}
                        </p>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
