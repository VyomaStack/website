export interface WorkflowStep {
  title: string;
  description: string;
}

export const AI_WORKFLOW_STEPS: WorkflowStep[] = [
  {
    title: "Input",
    description: "Paste your SQL, JSON, Spark logs, or configuration",
  },
  {
    title: "AI Analysis",
    description: "AI reads context, structure, and intent in seconds",
  },
  {
    title: "Suggestions",
    description: "Get explanations, fixes, optimizations, and generated code",
  },
  {
    title: "Export",
    description: "Copy, download, or apply results to your pipeline",
  },
];

export const STANDARD_WORKFLOW_STEPS: WorkflowStep[] = [
  {
    title: "Input",
    description: "Paste or type your data, text, or expression",
  },
  {
    title: "Process",
    description: "Instant transformation runs locally in your browser",
  },
  {
    title: "Output",
    description: "Review formatted, encoded, or generated results",
  },
  {
    title: "Export",
    description: "Copy to clipboard or download with one click",
  },
];

const AI_TOOL_SLUGS = new Set([
  "sql-formatter",
  "json-formatter",
  "spark-memory-calculator",
  "spark-error-explainer",
  "log-analyzer",
]);

const WORKFLOW_OVERRIDES: Record<string, WorkflowStep[]> = {
  "sql-formatter": [
    { title: "Input", description: "Paste messy or minified SQL queries" },
    { title: "Format", description: "Beautify and minify in your browser instantly" },
    { title: "AI Analysis", description: "Explain query logic, performance, and improvements" },
    { title: "Export", description: "Copy formatted SQL or download for your IDE" },
  ],
  "json-formatter": [
    { title: "Input", description: "Paste JSON payloads from APIs or logs" },
    { title: "Validate", description: "Format, validate, and minify locally" },
    { title: "AI Generate", description: "Produce Java POJOs, TypeScript, OpenAPI, or SQL" },
    { title: "Export", description: "Copy generated code into your project" },
  ],
  "spark-memory-calculator": [
    { title: "Input", description: "Set executor memory, cores, and cluster size" },
    { title: "Calculate", description: "See overhead, unified memory, and totals" },
    { title: "AI Advisor", description: "Get tuning recommendations for your workload" },
    { title: "Export", description: "Copy config values for spark-submit" },
  ],
  "log-analyzer": [
    { title: "Input", description: "Paste Spark, Spring, or application logs" },
    { title: "Detect", description: "Auto-detect log type or choose mode manually" },
    { title: "AI Analysis", description: "Root cause, key errors, and failure pattern" },
    { title: "Export", description: "Copy fixes and prevention steps to your runbook" },
  ],
  "spark-error-explainer": [
    { title: "Input", description: "Paste OOM errors, stack traces, or stage failures" },
    { title: "AI Analysis", description: "AI identifies root cause and failure pattern" },
    { title: "Suggestions", description: "Get fixes, prevention tips, and config keys" },
    { title: "Export", description: "Copy the action plan to your runbook" },
  ],
  "text-compare": [
    { title: "Input", description: "Paste original and modified text, SQL, or JSON" },
    { title: "Format", description: "Beautify SQL or JSON on either side before diffing" },
    { title: "Compare", description: "Line-by-line diff with added and removed highlights" },
    { title: "Export", description: "Copy unified diff or review side-by-side" },
  ],
  "yaml-formatter": [
    { title: "Input", description: "Paste Kubernetes, Docker, or CI YAML configs" },
    { title: "Format", description: "Beautify, validate, or minify with consistent indent" },
    { title: "Convert", description: "Transform YAML to JSON for APIs and debugging" },
    { title: "Export", description: "Copy or download formatted YAML" },
  ],
  "timestamp-converter": [
    { title: "Input", description: "Paste Unix timestamp or pick a date/time" },
    { title: "Convert", description: "Auto-detect seconds vs milliseconds" },
    { title: "Output", description: "Local time, UTC, ISO 8601, and relative time" },
    { title: "Export", description: "Copy results for logs, JWT debugging, or tickets" },
  ],
};

export function getToolWorkflow(slug: string): {
  steps: WorkflowStep[];
  hasAi: boolean;
} {
  const hasAi = AI_TOOL_SLUGS.has(slug);
  const steps =
    WORKFLOW_OVERRIDES[slug] ??
    (hasAi ? AI_WORKFLOW_STEPS : STANDARD_WORKFLOW_STEPS);

  return { steps, hasAi };
}
