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
  {
    slug: "base64-encode-decode-online",
    title: "Base64 Encode and Decode Online — Free Guide",
    description:
      "Encode and decode Base64 strings in your browser. UTF-8 support for text, JSON, and binary data. Free Base64 converter with no signup.",
    publishedAt: "2026-07-08",
    readTime: "4 min",
    toolHref: "/tools/base64-encoder",
    toolLabel: "Open Base64 Tool",
    keywords: [
      "base64 encoder",
      "base64 decoder",
      "base64 encode online",
      "text to base64",
    ],
    content: `Base64 turns binary data into plain ASCII text. You'll see it in JWT tokens, email attachments, data URIs, API payloads, and config files. When you need to encode or decode fast, a browser tool beats writing a one-off script.

## What is Base64?

Base64 maps every 3 bytes of input to 4 printable characters using A–Z, a–z, 0–9, +, and /. Padding \`=\` is added when input length isn't a multiple of 3.

Common uses:

- Embedding small images in HTML/CSS (\`data:image/png;base64,...\`)
- Encoding credentials in HTTP Basic Auth headers
- Serializing binary blobs in JSON APIs
- Decoding JWT header and payload segments (Base64URL variant)

## Encode and decode in your browser

The [VyomaStack Base64 Encoder](/tools/base64-encoder) runs **100% locally**:

1. Paste text into the input field
2. Click **Encode** to get Base64 output
3. Paste Base64 into the input and click **Decode** to reverse it
4. Use **Swap** to move output back to input for chained operations

Full **UTF-8** support — emoji, CJK characters, and accented text encode correctly.

## Base64 vs Base64URL

| Standard Base64 | Base64URL (JWT, URLs) |
|-----------------|----------------------|
| Uses \`+\` and \`/\` | Uses \`-\` and \`_\` |
| Padding \`=\` | Often strips padding |
| Email, MIME | JSON Web Tokens, filenames |

JWT decoding uses Base64URL. For standard Base64 text, use the encoder tool directly.

## When developers reach for Base64

- Quick-check an API response that returns encoded content
- Decode a config value from Kubernetes secrets or CI variables
- Encode a small JSON snippet for a query parameter (prefer proper URL encoding for full URLs)
- Debug MIME multipart email bodies

## Security notes

- Base64 is **encoding**, not **encryption** — anyone can decode it
- Never treat Base64 as a way to hide passwords or API keys
- VyomaStack processes locally, but still avoid pasting production secrets into any online tool when possible

## Base64 tool vs command line

\`\`\`bash
# macOS / Linux
echo -n "hello" | base64
echo "aGVsbG8=" | base64 -d
\`\`\`

The browser tool is faster for one-off debugging — no terminal, no flags, copy button included.

## Related tools

- [JWT Decoder](/tools/jwt-decoder) — tokens use Base64URL-encoded parts
- [URL Encoder](/tools/url-encoder) — percent-encoding for query strings
- [Hash Generator](/tools/hash-generator) — checksums and fingerprints

## Try it free

Encode and decode Base64 instantly — no account, no server upload.`,
  },
  {
    slug: "strong-password-generator-guide",
    title: "Strong Password Generator — Create Secure Passwords Online",
    description:
      "Generate cryptographically secure random passwords with custom length and character sets. Free browser-based password generator with strength indicator.",
    publishedAt: "2026-07-08",
    readTime: "4 min",
    toolHref: "/tools/password-generator",
    toolLabel: "Generate Password",
    keywords: [
      "password generator",
      "strong password generator",
      "random password generator",
      "secure password",
    ],
    content: `Weak and reused passwords are still one of the top causes of breaches. A good password generator removes guesswork — cryptographically random, long enough to resist brute force, and unique per account.

## What makes a strong password?

- **Length** — 12+ characters; 16+ for high-value accounts
- **Randomness** — not dictionary words, names, or keyboard patterns
- **Character variety** — uppercase, lowercase, numbers, symbols
- **Uniqueness** — never reuse across sites or services

Password managers store what humans can't remember. Generate random, store safely, autofill everywhere.

## Generate passwords in your browser

The [VyomaStack Password Generator](/tools/password-generator) uses \`crypto.getRandomValues()\` — the same CSPRNG browsers use for TLS keys. **Nothing is sent to a server.**

1. Set **length** (8–128 characters)
2. Toggle character sets: uppercase, lowercase, numbers, symbols
3. Enable **Exclude ambiguous** to omit \`0\`, \`O\`, \`1\`, \`l\`, \`I\`
4. Click **Generate** — strength indicator updates live
5. Generate **multiple passwords** at once with bulk mode

## Password length vs crack time

| Length | Character sets | Rough strength |
|--------|----------------|----------------|
| 8 | letters only | Weak |
| 12 | mixed + symbols | Good |
| 16 | mixed + symbols | Strong |
| 20+ | mixed + symbols | Very strong |

Length matters more than exotic symbols. A 20-character random passphrase beats an 8-character \`P@ssw0rd!\`.

## Common mistakes

- Using **memorable** passwords (pet names, birthdays) — predictable
- **Rotating** passwords by adding \`1\` or \`!\` at the end — still weak
- Sharing passwords over Slack or email — use a manager's secure share instead
- Storing plaintext in a Notes app — use 1Password, Bitwarden, or similar

## Password generator vs browser autofill

Modern browsers suggest passwords too. VyomaStack is useful when you need:

- Custom length for legacy systems with strict rules
- Bulk passwords for test accounts or API keys
- A password **without** saving it to browser storage
- Copy-ready output with strength feedback

## Related tools

- [Hash Generator](/tools/hash-generator) — fingerprint API keys (not for password storage)
- [UUID Generator](/tools/uuid-generator) — random identifiers for tokens and IDs

## Try it now

Generate a strong password in one click — free, private, no signup.`,
  },
  {
    slug: "hash-generator-md5-sha256-guide",
    title: "Hash Generator — MD5, SHA-256, SHA-512 Online",
    description:
      "Compute MD5, SHA-1, SHA-256, SHA-384, and SHA-512 hashes from text in your browser. Free checksum and fingerprint tool with no signup.",
    publishedAt: "2026-07-08",
    readTime: "5 min",
    toolHref: "/tools/hash-generator",
    toolLabel: "Generate Hash",
    keywords: [
      "hash generator",
      "sha256 generator",
      "md5 hash",
      "online hash calculator",
      "checksum generator",
    ],
    content: `Hash functions turn any input into a fixed-size fingerprint. Developers use them for checksums, cache keys, file integrity, API signatures, and debugging — not for storing passwords (use bcrypt or Argon2 for that).

## Supported algorithms

The [VyomaStack Hash Generator](/tools/hash-generator) computes:

| Algorithm | Output size | Common use |
|-----------|-------------|------------|
| MD5 | 128 bits | Legacy checksums, non-security etag |
| SHA-1 | 160 bits | Git object IDs, legacy systems |
| SHA-256 | 256 bits | Modern checksums, blockchain, TLS |
| SHA-384 | 384 bits | High-security applications |
| SHA-512 | 512 bits | File integrity, strong fingerprints |

**SHA-256** and **SHA-512** are recommended for anything security-sensitive. MD5 and SHA-1 are fine for quick non-cryptographic checksums but are broken for collision resistance.

## How to use it

1. Paste or type text into the input field
2. Select one or more algorithms
3. Hashes **update as you type** — instant feedback
4. Click **Copy** on any hash output

All hashing runs in your browser via the Web Crypto API. Your input never leaves your device.

## Real-world use cases

- **Verify file downloads** — compare SHA-256 against the publisher's checksum
- **Cache keys** — hash long query strings for Redis/Memcached keys
- **API debugging** — reproduce HMAC or signature inputs step by step
- **Database migrations** — fingerprint config blobs before and after changes
- **Git-style object IDs** — SHA-1 of \`blob <size>\\0<content>\`

## Hash vs encryption

| Hash | Encryption |
|------|------------|
| One-way — cannot reverse | Two-way — decrypt with key |
| Fixed output size | Output size ≈ input size |
| Same input → same hash | Same input → different ciphertext (with IV) |
| Checksums, fingerprints | Confidentiality |

If you need to recover the original text, you need encryption — not hashing.

## Never hash passwords with MD5/SHA

Password storage requires slow, salted algorithms:

- **bcrypt**, **scrypt**, **Argon2** — designed to resist brute force
- Plain SHA-256 of a password is fast to crack with rainbow tables

Use the hash generator for **data fingerprints**, not credential storage.

## Hash generator vs command line

\`\`\`bash
echo -n "hello" | shasum -a 256
echo -n "hello" | md5
\`\`\`

The browser tool is faster for quick checks while debugging — especially when you're already in VyomaStack for SQL, JSON, or JWT work.

## Related tools

- [Password Generator](/tools/password-generator) — random credentials (store in a manager)
- [Base64 Encoder](/tools/base64-encoder) — encode binary before hashing in some pipelines
- [JWT Decoder](/tools/jwt-decoder) — inspect signed token payloads

## Try it free

Compute MD5, SHA-1, SHA-256, SHA-384, and SHA-512 instantly — browser-secure, no login.`,
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export const BLOG_SLUGS = blogPosts.map((p) => p.slug);
