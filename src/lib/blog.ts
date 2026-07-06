export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  readTime: string;
  toolHref: string;
  toolLabel: string;
  keywords: string[];
  content: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "format-sql-online-free",
    title: "How to Format SQL Online for Free (With AI Explain)",
    description:
      "Learn how to beautify, minify, and explain SQL queries online — no signup, no install. Works for PostgreSQL, MySQL, Spark SQL, and more.",
    publishedAt: "2026-07-07",
    readTime: "5 min",
    toolHref: "/tools/sql-formatter",
    toolLabel: "Try SQL Formatter",
    keywords: ["sql formatter", "format sql online", "sql beautifier"],
    content: `Messy SQL slows down debugging, code reviews, and incident response. Whether you inherited a one-line query from a log or you're cleaning up a stored procedure before deploy, a good formatter saves time.

## Why format SQL?

Readable SQL helps you:

- Spot missing JOIN conditions and logic bugs faster
- Review pull requests without squinting at minified queries
- Share queries with analysts and stakeholders
- Prepare examples for documentation and runbooks

## Format SQL in your browser (free)

VyomaStack SQL Formatter runs **entirely in your browser** for format and minify — your query never leaves your device for basic formatting.

1. Open the [SQL Formatter](/tools/sql-formatter)
2. Paste your SQL into the input panel
3. Select your dialect (PostgreSQL, MySQL, Spark SQL, T-SQL, etc.)
4. Click **Format** for beautified output or **Minify** for a single line

## Supported SQL dialects

The formatter supports Standard SQL, MySQL, PostgreSQL, MariaDB, SQL Server (T-SQL), Spark SQL, Redshift, BigQuery, SQLite, and PL/SQL.

## Go further with AI Explain

After formatting, click **Explain SQL with AI** to get:

- Plain-English summary of what the query does
- Step-by-step breakdown of JOINs, filters, and aggregations
- Performance notes (indexes, LIMIT, SELECT *)
- Improvement suggestions

VyomaStack uses instant local analysis when AI is busy — you always get a result.

## SQL formatter vs ChatGPT

| ChatGPT | VyomaStack SQL Formatter |
|---------|--------------------------|
| Write a prompt each time | Paste → Format → done |
| No dialect-aware formatting | sql-formatter library per dialect |
| General chat UI | Dedicated tool + download/copy |

## Tips for production SQL

- Always redact sensitive literals before pasting into any online tool
- Use **Minify** for logging pipelines; use **Format** for human review
- Pair formatted SQL with EXPLAIN / EXPLAIN ANALYZE on your database

## Try it now

Format and explain your SQL free — no account required.`,
  },
  {
    slug: "fix-spark-oom-error",
    title: "How to Fix Spark OOM Errors (Out of Memory)",
    description:
      "Step-by-step guide to diagnosing Spark OutOfMemoryError, shuffle failures, and executor OOM — with free AI log analysis.",
    publishedAt: "2026-07-07",
    readTime: "6 min",
    toolHref: "/tools/log-analyzer",
    toolLabel: "Analyze Spark Log",
    keywords: ["spark oom", "spark out of memory", "spark error"],
    content: `Spark OutOfMemoryError is one of the most common failures in data engineering. It usually appears during shuffles, caching, or when the driver collects too much data.

## Common Spark OOM symptoms

- \`java.lang.OutOfMemoryError: Java heap space\`
- \`SparkOutOfMemoryError: Unable to acquire N bytes of memory\`
- \`GC overhead limit exceeded\`
- Stage failed with shuffle read/write in the Spark UI

## Quick fixes (try in order)

### 1. Increase executor memory

\`\`\`
spark.executor.memory=8g
spark.executor.memoryOverhead=1g
\`\`\`

### 2. Reduce shuffle pressure

\`\`\`
spark.sql.shuffle.partitions=100
spark.sql.adaptive.enabled=true
\`\`\`

### 3. Avoid collect() on large datasets

Use \`take()\`, writes, or aggregates instead of pulling full DataFrames to the driver.

### 4. Uncache unused data

Call \`.unpersist()\` on cached RDDs/DataFrames you no longer need.

## Use the Spark UI

1. Open the **Stages** tab for the failed job
2. Check **Shuffle Read/Write** size
3. Look for **skewed tasks** (one task much larger than others)
4. Review **Storage** tab for unexpected caching

## Analyze your error log with AI

Paste your stack trace into the [VyomaStack Log Analyzer](/tools/log-analyzer) — choose **Apache Spark** or **Auto-detect** mode.

You get structured output:

- Root cause
- What happened
- How to fix
- Relevant spark-submit flags

Instant analysis works even when AI capacity is limited.

## Prevention checklist

- Right-size executors: 4–8 GB, 2–5 cores is a solid default
- Filter early; avoid wide transformations before filters
- Monitor shuffle bytes in production jobs
- Use AQE and salting for skewed keys

## Related tools

- [Spark Memory Calculator](/tools/spark-memory-calculator) — size executors before you deploy
- [Spark Error Explainer](/tools/spark-error-explainer) — Spark-specific deep dive`,
  },
  {
    slug: "json-to-java-pojo-guide",
    title: "JSON to Java POJO — Free Online Guide",
    description:
      "Convert JSON to Java POJOs, TypeScript interfaces, OpenAPI schemas, or SQL tables with VyomaStack AI JSON Studio.",
    publishedAt: "2026-07-07",
    readTime: "4 min",
    toolHref: "/tools/json-formatter",
    toolLabel: "Open JSON Studio",
    keywords: ["json to java pojo", "json to typescript", "json formatter"],
    content: `APIs return JSON. Your Java backend needs POJOs. Doing that by hand is tedious and error-prone — especially for nested objects and arrays.

## When you need JSON → POJO

- Integrating a third-party REST API into Spring Boot
- Generating DTOs from sample API responses
- Bootstrapping OpenAPI schemas from example payloads
- Creating database tables from JSON documents

## Format and validate first

Before generating code, paste JSON into the [JSON Formatter](/tools/json-formatter):

1. Click **Format** to beautify
2. Click **Validate** to catch syntax errors
3. Fix any issues before code generation

## AI JSON Studio — four outputs

From the same JSON payload, generate:

| Output | Use case |
|--------|----------|
| **Java POJOs** | Spring Boot DTOs with Jackson-friendly fields |
| **TypeScript interfaces** | Frontend types matching your API |
| **OpenAPI 3.0** | API documentation bootstrap |
| **PostgreSQL CREATE TABLE** | Schema from JSON structure |

## How to use it

1. Paste JSON into the formatter input
2. Scroll to **AI JSON Studio**
3. Select output type (POJO, TypeScript, OpenAPI, SQL)
4. Set root class name (e.g. \`UserResponse\`)
5. Click **Generate**

VyomaStack generates instantly with local fallback, or AI-enhanced output when available.

## Tips for better POJOs

- Use representative JSON — include nullable fields if they appear in production
- Name the root class after your API resource
- Review generated annotations; add validation (\`@NotNull\`, etc.) as needed
- For large payloads, generate nested classes incrementally

## JSON Studio vs manual coding

Manual POJOs for a 20-field nested response can take 30+ minutes. AI JSON Studio does the scaffolding in seconds — you refine from there.

## Try it free

No signup. Format, validate, and generate — all in one workspace.`,
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export const BLOG_SLUGS = blogPosts.map((p) => p.slug);
