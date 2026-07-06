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
  {
    slug: "decode-jwt-online-free",
    title: "How to Decode JWT Tokens Online (Safely)",
    description:
      "Decode JSON Web Token headers and payloads in your browser. Inspect claims, expiration, and algorithms — free JWT decoder with no signup.",
    publishedAt: "2026-07-08",
    readTime: "4 min",
    toolHref: "/tools/jwt-decoder",
    toolLabel: "Decode JWT Now",
    keywords: ["jwt decoder", "decode jwt", "jwt debugger", "inspect jwt"],
    content: `JWTs (JSON Web Tokens) show up everywhere in modern apps — OAuth logins, API gateways, microservices, and session cookies. When auth breaks at 2 AM, you need to read the token fast.

## What is a JWT?

A JWT has three Base64URL-encoded parts separated by dots:

\`\`\`
header.payload.signature
\`\`\`

- **Header** — algorithm (\`alg\`) and token type (\`typ\`)
- **Payload** — claims like \`sub\`, \`exp\`, \`iat\`, \`roles\`
- **Signature** — proves the token wasn't tampered with (requires the secret key)

Decoding shows header and payload. **Verifying** the signature needs your server's secret — online decoders don't do that.

## When to decode a JWT

- Debug **401 Unauthorized** or **403 Forbidden** responses
- Check if \`exp\` (expiration) has passed
- Inspect \`iss\` (issuer) and \`aud\` (audience) mismatches
- Verify roles/scopes in the payload match what your API expects
- Compare a token from staging vs production

## Decode JWT in your browser (free)

The [VyomaStack JWT Decoder](/tools/jwt-decoder) runs **100% in your browser** — nothing is sent to a server.

1. Paste your JWT into the input field
2. See decoded **header** and **payload** as formatted JSON
3. Check expiration, issued-at, and custom claims at a glance

## Common JWT claims

| Claim | Meaning |
|-------|---------|
| \`sub\` | Subject (user ID) |
| \`exp\` | Expiration time (Unix timestamp) |
| \`iat\` | Issued at |
| \`iss\` | Issuer |
| \`aud\` | Audience |
| \`roles\` / \`scope\` | Permissions |

## Security rules

- **Never paste production tokens** with sensitive PII into untrusted sites
- VyomaStack processes locally — still redact tokens in screenshots and bug reports
- Decoding ≠ verifying — a forged payload decodes fine; only signature verification catches tampering
- Rotate secrets if a token with elevated claims leaks

## JWT decoder vs jwt.io

Both decode locally. VyomaStack keeps JWT debugging alongside your other dev tools — SQL, JSON, regex, cron — in one workspace with no account.

## Related tools

- [Base64 Encoder](/tools/base64-encoder) — JWT parts are Base64URL-encoded
- [Hash Generator](/tools/hash-generator) — checksum API keys and secrets

## Try it now

Paste a JWT and inspect claims in seconds — no login required.`,
  },
  {
    slug: "cron-expression-generator-guide",
    title: "Cron Expression Generator — Build Schedules Online",
    description:
      "Learn cron syntax and build expressions with presets. Human-readable descriptions and next run times for Linux, Kubernetes, GitHub Actions, and Spring.",
    publishedAt: "2026-07-08",
    readTime: "5 min",
    toolHref: "/tools/cron-generator",
    toolLabel: "Open Cron Generator",
    keywords: [
      "cron generator",
      "cron expression",
      "crontab generator",
      "cron schedule",
    ],
    content: `Cron expressions schedule recurring jobs — backups, ETL pipelines, report generation, cache warming. The syntax is compact but easy to get wrong. One wrong field and your job runs every minute instead of once a day.

## Cron field order (Unix 5-field)

\`\`\`
* * * * *
│ │ │ │ │
│ │ │ │ └── day of week (0-6, Sun=0)
│ │ │ └──── month (1-12)
│ │ └────── day of month (1-31)
│ └──────── hour (0-23)
└────────── minute (0-59)
\`\`\`

## Common cron examples

| Expression | Meaning |
|------------|---------|
| \`0 9 * * 1-5\` | Weekdays at 9:00 AM |
| \`0 */6 * * *\` | Every 6 hours |
| \`30 2 * * *\` | Daily at 2:30 AM |
| \`0 0 1 * *\` | First day of every month at midnight |
| \`*/15 * * * *\` | Every 15 minutes |

## Where cron expressions are used

- **Linux crontab** — \`crontab -e\`
- **Kubernetes CronJob** — \`spec.schedule\`
- **GitHub Actions** — \`on.schedule\`
- **AWS EventBridge** — rate and cron rules
- **Spring Boot** — \`@Scheduled(cron = "0 0 9 * * MON-FRI")\`
- **Quartz scheduler** — enterprise job scheduling

Note: some systems use 6 fields (seconds first) or different day-of-week conventions. Always check your platform's docs.

## Build cron expressions visually

The [VyomaStack Cron Generator](/tools/cron-generator) helps you:

1. Pick a **preset** (every hour, weekdays at 9 AM, etc.)
2. Or build field-by-field with the visual editor
3. See a **human-readable description** of what the expression does
4. Preview the **next 5 run times** in your local timezone

All processing runs in your browser.

## Cron debugging tips

- Test in staging before deploying a new schedule
- Watch for timezone mismatches — crontab uses server time; Spring can use a zone
- \`*/1\` in the wrong field runs far more often than you expect
- Use monitoring alerts on job duration and failure rate

## Cron vs interval schedulers

| Cron | Fixed interval (e.g. every 30m) |
|------|----------------------------------|
| Wall-clock times (9 AM daily) | Relative timing from last run |
| Calendar-aware (1st of month) | Simpler mental model |
| Harder to read | Easier for "every N minutes" |

## Related tools

- [Regex Tester](/tools/regex-tester) — validate log patterns from scheduled jobs
- [Spark Memory Calculator](/tools/spark-memory-calculator) — size nightly ETL jobs

## Try it free

Build and validate cron expressions — no account required.`,
  },
  {
    slug: "regex-tester-online-guide",
    title: "Regex Tester Online — Debug Regular Expressions Fast",
    description:
      "Test regular expressions with flags and capture groups. Highlighted matches for JavaScript, Python, and Java patterns. Free browser-based regex debugger.",
    publishedAt: "2026-07-08",
    readTime: "5 min",
    toolHref: "/tools/regex-tester",
    toolLabel: "Test Regex Now",
    keywords: [
      "regex tester",
      "regular expression tester",
      "test regex online",
      "regex debugger",
    ],
    content: `Regular expressions are powerful and easy to get wrong. A greedy quantifier, a missing anchor, or the wrong flag can silently match the wrong text — or nothing at all.

## When you need a regex tester

- Validate log parsing patterns before shipping to production
- Debug **grep**, **sed**, and **awk** one-liners
- Test API input validation rules
- Extract fields from unstructured text (emails, URLs, IDs)
- Refactor legacy patterns without breaking capture groups

## How the VyomaStack Regex Tester works

The [Regex Tester](/tools/regex-tester) runs entirely in your browser:

1. Enter your **regular expression** in the pattern field
2. Paste **sample text** to test against
3. Toggle **flags** (global, case-insensitive, multiline, dotall)
4. See **highlighted matches** and **capture groups** instantly

No server round-trip. Your test data stays on your device.

## Essential regex flags

| Flag | Effect |
|------|--------|
| \`g\` | Global — find all matches, not just the first |
| \`i\` | Case-insensitive |
| \`m\` | Multiline — \`^\` and \`$\` match line boundaries |
| \`s\` | Dotall — \`.\` matches newlines |

## Common patterns (starting points)

\`\`\`
Email (simple):     [\\w.-]+@[\\w.-]+\\.\\w+
URL:                https?://[\\w.-]+(?:/[\\w./?%&=-]*)?
IPv4:               \\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b
Date (YYYY-MM-DD):  \\d{4}-\\d{2}-\\d{2}
UUID:               [0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}
\`\`\`

Always tailor patterns to your exact validation needs — these are templates, not production-ready validators.

## Regex pitfalls

- **Catastrophic backtracking** — nested quantifiers like \`(a+)+\` on long input can hang
- **Greedy vs lazy** — \`.*\` eats everything; \`.*?\` stops at the first match
- **Anchors** — \`^\` and \`$\` prevent partial matches when you need full-string validation
- **Engine differences** — Java, Python, and JavaScript differ on lookbehind and Unicode classes

## Regex tester vs regex101

regex101 is excellent for deep debugging. VyomaStack gives you a fast, integrated tester alongside SQL, JSON, JWT, and cron tools — one workspace, no tabs, no login.

## Related tools

- [Log Analyzer](/tools/log-analyzer) — paste error logs that your regex should parse
- [URL Encoder](/tools/url-encoder) — encode patterns for query strings

## Try it now

Test your regex pattern in seconds — free, browser-secure, no signup.`,
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export const BLOG_SLUGS = blogPosts.map((p) => p.slug);
