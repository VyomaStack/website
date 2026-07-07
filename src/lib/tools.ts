import type { Tool } from "@/types/tool";

export const tools: Tool[] = [
  {
    slug: "sql-formatter",
    name: "SQL Formatter",
    category: "SQL",
    h1: "Free SQL Formatter & Beautifier Online",
    seoTitle: "SQL Formatter & Beautifier Online — Free | VyomaStack",
    seoDescription:
      "Free online SQL formatter with AI explain. Beautify, minify, and get AI-powered explanations, performance notes, and improvements for MySQL, PostgreSQL, T-SQL, Spark SQL, and more.",
    description:
      "Beautify and minify SQL instantly, then explain it with AI. Performance notes and improvement suggestions for MySQL, PostgreSQL, T-SQL, Spark SQL, and more.",
    relatedTools: ["json-formatter", "jwt-decoder"],
    keywords: [
      "sql formatter",
      "sql beautifier",
      "sql prettifier",
      "format sql online",
      "postgresql formatter",
      "mysql sql formatter",
      "tsql formatter",
      "spark sql formatter",
      "sql minifier",
    ],
    dialects: [
      {
        name: "PostgreSQL",
        description:
          "Format PostgreSQL queries with proper indentation for SELECT, JOIN, CTEs, and window functions.",
      },
      {
        name: "MySQL",
        description:
          "Beautify MySQL and MariaDB syntax including stored procedures, backtick identifiers, and LIMIT clauses.",
      },
      {
        name: "SQL Server (T-SQL)",
        description:
          "Prettify T-SQL with support for DECLARE, BEGIN/END blocks, and SQL Server-specific keywords.",
      },
      {
        name: "Spark SQL",
        description:
          "Format Spark SQL and Hive queries for data engineering and big data pipelines.",
      },
      {
        name: "Redshift & BigQuery",
        description:
          "Clean up warehouse SQL for Amazon Redshift and Google BigQuery analytics workloads.",
      },
    ],
    faqs: [
      {
        question: "What is a SQL formatter?",
        answer:
          "A SQL formatter (also called a SQL beautifier or prettifier) takes unreadable, minified SQL and reformats it with proper indentation, line breaks, and keyword casing so it's easier to read and debug.",
      },
      {
        question: "What SQL dialects are supported?",
        answer:
          "MySQL, PostgreSQL, MariaDB, SQL Server (T-SQL), Spark SQL, Redshift, BigQuery, SQLite, PL/SQL, and standard SQL.",
      },
      {
        question: "Is this SQL formatter free?",
        answer:
          "Yes. VyomaStack SQL Formatter is completely free with no signup, no limits, and no watermarks.",
      },
      {
        question: "Is my SQL sent to a server?",
        answer:
          "No. All formatting runs entirely in your browser. Your queries never leave your device — ideal for sensitive production SQL.",
      },
      {
        question: "Can I minify SQL as well as format it?",
        answer:
          "Yes. Use the Minify button to compress SQL into a single line for storage, logging, or transmission.",
      },
      {
        question: "How do I format a PostgreSQL query online?",
        answer:
          "Paste your query, select PostgreSQL from the dialect dropdown, and click Format. The output will use PostgreSQL-compatible keyword handling.",
      },
      {
        question: "Can AI explain my SQL query?",
        answer:
          "Yes. Click 'Explain SQL with AI' to get a step-by-step breakdown, performance notes, and improvement suggestions powered by AI.",
      },
      {
        question: "Does this work on mobile?",
        answer:
          "Yes. The formatter is fully responsive and works on phones, tablets, and desktops.",
      },
    ],
  },
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    category: "JSON",
    h1: "Free JSON Formatter & AI JSON Studio",
    seoTitle: "JSON Formatter & AI Studio — POJO, TypeScript, OpenAPI | VyomaStack",
    seoDescription:
      "Free JSON formatter, validator, and AI studio. Generate Java POJOs, TypeScript interfaces, OpenAPI schemas, and SQL tables from JSON. Format and minify in your browser.",
    description:
      "Format, validate, and minify JSON — then generate Java POJOs, TypeScript interfaces, OpenAPI schemas, or SQL tables with AI.",
    keywords: [
      "json formatter",
      "json to java pojo",
      "json to typescript",
      "json to openapi",
      "json validator",
      "json beautifier",
      "json studio",
    ],
    relatedTools: ["sql-formatter", "jwt-decoder", "base64-encoder"],
    faqs: [
      {
        question: "What is AI JSON Studio?",
        answer:
          "AI JSON Studio generates Java POJOs, TypeScript interfaces, OpenAPI 3.0 schemas, and PostgreSQL CREATE TABLE statements from your JSON data using AI.",
      },
      {
        question: "What is a JSON formatter?",
        answer:
          "A JSON formatter takes compact or messy JSON and restructures it with proper indentation and line breaks, making it easier to read and debug.",
      },
      {
        question: "Can this tool validate JSON?",
        answer:
          "Yes. Click Validate to check if your JSON is syntactically correct. Errors show the exact parse failure message.",
      },
      {
        question: "Is formatting done in the browser?",
        answer:
          "Yes. Format, validate, and minify run locally. AI generation sends JSON to our API for code generation.",
      },
      {
        question: "Is this JSON formatter free?",
        answer:
          "Yes. Formatting is completely free. AI generation requires an API key configured by the site operator.",
      },
    ],
  },
  {
    slug: "jwt-decoder",
    name: "JWT Decoder",
    category: "Security",
    h1: "Free JWT Decoder Online",
    seoTitle: "JWT Decoder Online — Free | VyomaStack",
    seoDescription:
      "Free online JWT decoder. Instantly decode JSON Web Token headers and payloads. Inspect claims, expiration, and algorithms. Runs in your browser — no data sent to servers.",
    description:
      "Decode JWT headers and payloads instantly. Inspect claims, expiration dates, and algorithms. Does not verify signatures — for debugging only.",
    keywords: [
      "jwt decoder",
      "decode jwt",
      "jwt parser",
      "json web token decoder",
      "jwt debugger",
      "inspect jwt",
    ],
    relatedTools: ["json-formatter", "base64-encoder", "hash-generator", "password-generator"],
    faqs: [
      {
        question: "What is a JWT decoder?",
        answer:
          "A JWT decoder extracts and displays the header and payload from a JSON Web Token (JWT) without verifying the cryptographic signature.",
      },
      {
        question: "Does this verify JWT signatures?",
        answer:
          "No. This tool only decodes Base64URL-encoded header and payload sections. Signature verification requires the secret key and is not performed.",
      },
      {
        question: "Is it safe to paste my JWT here?",
        answer:
          "Decoding happens entirely in your browser — nothing is uploaded. However, avoid pasting production tokens with sensitive claims.",
      },
      {
        question: "What are the three parts of a JWT?",
        answer:
          "A JWT has three dot-separated parts: Header (algorithm and type), Payload (claims and data), and Signature (verification hash).",
      },
      {
        question: "Can I see token expiration?",
        answer:
          "Yes. If the payload contains an exp (expiration) claim, the decoder shows the expiry date and whether the token has expired.",
      },
    ],
  },
  {
    slug: "uuid-generator",
    name: "UUID Generator",
    category: "Developer",
    h1: "Free UUID Generator Online",
    seoTitle: "UUID Generator — Free UUID v4 Online | VyomaStack",
    seoDescription:
      "Free online UUID v4 generator. Create one or bulk random UUIDs instantly. Copy to clipboard. Cryptographically secure, runs in your browser — no signup.",
    description:
      "Generate random UUID v4 identifiers instantly. Create single or bulk UUIDs, copy to clipboard. Cryptographically secure — runs in your browser.",
    keywords: [
      "uuid generator",
      "generate uuid",
      "uuid v4",
      "random uuid",
      "guid generator",
      "bulk uuid generator",
    ],
    relatedTools: ["base64-encoder", "jwt-decoder"],
    faqs: [
      {
        question: "What is a UUID?",
        answer:
          "A UUID (Universally Unique Identifier) is a 128-bit identifier used to uniquely identify objects in software systems. Version 4 UUIDs are randomly generated.",
      },
      {
        question: "What version of UUID does this generate?",
        answer:
          "This tool generates UUID version 4 (random) using the browser's cryptographically secure crypto.randomUUID() API.",
      },
      {
        question: "Can I generate multiple UUIDs at once?",
        answer:
          "Yes. Set the count (1–100) and click Generate to create multiple UUIDs. Use Copy All to copy them as a list.",
      },
      {
        question: "Is this UUID generator free?",
        answer:
          "Yes. Completely free with no limits, no signup, and no watermarks.",
      },
    ],
  },
  {
    slug: "base64-encoder",
    name: "Base64 Encoder",
    category: "Developer",
    h1: "Free Base64 Encoder & Decoder Online",
    seoTitle: "Base64 Encoder & Decoder Online — Free | VyomaStack",
    seoDescription:
      "Free online Base64 encoder and decoder. Convert text to Base64 and back. Supports UTF-8. Runs entirely in your browser — private and instant.",
    description:
      "Encode text to Base64 or decode Base64 strings instantly. Full UTF-8 support. Swap, copy, and clear — all in your browser.",
    keywords: [
      "base64 encoder",
      "base64 decoder",
      "base64 encode",
      "base64 decode online",
      "text to base64",
      "base64 converter",
    ],
    relatedTools: ["url-encoder", "jwt-decoder", "uuid-generator"],
    faqs: [
      {
        question: "What is Base64 encoding?",
        answer:
          "Base64 is a binary-to-text encoding scheme that represents binary data as ASCII text. It's commonly used for embedding data in JSON, XML, email, and URLs.",
      },
      {
        question: "Does this support UTF-8?",
        answer:
          "Yes. The encoder and decoder handle multi-byte UTF-8 characters correctly, including emoji and non-Latin scripts.",
      },
      {
        question: "Is my data sent to a server?",
        answer:
          "No. All encoding and decoding runs in your browser. Your data never leaves your device.",
      },
      {
        question: "Can I decode Base64 as well as encode?",
        answer:
          "Yes. Switch to Decode mode or use the Swap button to move the output back to input and decode it.",
      },
    ],
  },
  {
    slug: "url-encoder",
    name: "URL Encoder",
    category: "Developer",
    h1: "Free URL Encoder & Decoder Online",
    seoTitle: "URL Encoder & Decoder Online — Free | VyomaStack",
    seoDescription:
      "Free online URL encoder and decoder. Encode query strings with encodeURIComponent or full URLs with encodeURI. Decode percent-encoded URLs instantly.",
    description:
      "Encode and decode URLs and query parameters. Supports encodeURIComponent and encodeURI modes. Runs entirely in your browser.",
    keywords: [
      "url encoder",
      "url decoder",
      "encode url online",
      "url encode decode",
      "percent encoding",
      "encodeURIComponent",
    ],
    relatedTools: ["base64-encoder", "json-formatter"],
    faqs: [
      {
        question: "What is URL encoding?",
        answer:
          "URL encoding (percent-encoding) converts characters into a format that can be safely transmitted in URLs, replacing unsafe characters with % followed by hex digits.",
      },
      {
        question: "encodeURIComponent vs encodeURI?",
        answer:
          "encodeURIComponent encodes all special characters and is used for individual query parameter values. encodeURI encodes a full URL but preserves characters like /, :, ?, and =.",
      },
      {
        question: "Can I decode percent-encoded URLs?",
        answer:
          "Yes. Switch to Decode mode to convert percent-encoded strings back to readable text.",
      },
      {
        question: "Is this URL encoder free?",
        answer:
          "Yes. Completely free, no signup, runs in your browser.",
      },
    ],
  },
  {
    slug: "password-generator",
    name: "Password Generator",
    category: "Security",
    h1: "Free Strong Password Generator Online",
    seoTitle: "Password Generator — Strong Random Passwords | VyomaStack",
    seoDescription:
      "Free online password generator. Create strong random passwords with custom length, uppercase, lowercase, numbers, and symbols. Cryptographically secure — runs in your browser.",
    description:
      "Generate strong random passwords with custom length and character sets. Strength indicator, bulk generation, and one-click copy. Runs in your browser.",
    keywords: [
      "password generator",
      "random password generator",
      "strong password generator",
      "secure password generator",
      "generate password online",
      "password maker",
    ],
    relatedTools: ["hash-generator", "jwt-decoder", "uuid-generator"],
    faqs: [
      {
        question: "How are passwords generated?",
        answer:
          "Passwords use the browser's crypto.getRandomValues() API for cryptographically secure randomness. Nothing is sent to a server.",
      },
      {
        question: "What makes a strong password?",
        answer:
          "Long passwords (12+ characters) with a mix of uppercase, lowercase, numbers, and symbols are hardest to crack. Avoid common words and reused passwords.",
      },
      {
        question: "Can I exclude confusing characters?",
        answer:
          "Yes. Enable 'Exclude ambiguous' to omit characters like 0, O, 1, l, and I that are easy to misread.",
      },
      {
        question: "Is this password generator free?",
        answer:
          "Yes. Completely free with no signup, no limits, and no watermarks.",
      },
    ],
  },
  {
    slug: "hash-generator",
    name: "Hash Generator",
    category: "Security",
    h1: "Free Online Hash Generator",
    seoTitle: "Hash Generator — MD5, SHA-1, SHA-256 Online | VyomaStack",
    seoDescription:
      "Free online hash generator. Compute MD5, SHA-1, SHA-256, SHA-384, and SHA-512 hashes from text instantly. Runs in your browser — private and secure.",
    description:
      "Generate MD5, SHA-1, SHA-256, SHA-384, and SHA-512 hashes from any text. Auto-updates as you type. All hashing runs locally in your browser.",
    keywords: [
      "hash generator",
      "md5 generator",
      "sha256 generator",
      "sha1 hash",
      "online hash calculator",
      "text to hash",
      "checksum generator",
    ],
    relatedTools: ["password-generator", "base64-encoder", "jwt-decoder"],
    faqs: [
      {
        question: "What hash algorithms are supported?",
        answer:
          "MD5, SHA-1, SHA-256, SHA-384, and SHA-512. SHA-256 and SHA-512 are recommended for security-sensitive use cases.",
      },
      {
        question: "Is my text sent to a server?",
        answer:
          "No. All hashing runs entirely in your browser using Web Crypto API (and local MD5 for compatibility).",
      },
      {
        question: "What is a hash used for?",
        answer:
          "Hashes create a fixed-size fingerprint of data. Developers use them for checksums, cache keys, API signatures, and verifying file integrity.",
      },
      {
        question: "Is MD5 still safe?",
        answer:
          "MD5 is not cryptographically secure for passwords or signatures. Use it only for legacy checksums. Prefer SHA-256 or SHA-512 for security.",
      },
    ],
  },
  {
    slug: "qr-code-generator",
    name: "QR Code Generator",
    category: "Developer",
    h1: "Free QR Code Generator Online",
    seoTitle: "QR Code Generator — Create QR Codes Free | VyomaStack",
    seoDescription:
      "Free online QR code generator. Create QR codes from URLs, text, WiFi credentials, and more. Download PNG or copy to clipboard. Runs in your browser.",
    description:
      "Generate QR codes from URLs or any text. Adjust size and error correction, then download PNG or copy. Runs entirely in your browser.",
    keywords: [
      "qr code generator",
      "create qr code",
      "qr code maker",
      "free qr code",
      "url to qr code",
      "qr code online",
      "generate qr code",
    ],
    relatedTools: ["url-encoder", "uuid-generator", "password-generator"],
    faqs: [
      {
        question: "What can I encode in a QR code?",
        answer:
          "URLs, plain text, email addresses, phone numbers, WiFi credentials (WIFI:T:WPA;S:Network;P:password;;), and vCard contact info.",
      },
      {
        question: "Can I download the QR code?",
        answer:
          "Yes. Click Download PNG to save a high-quality image. You can also copy it to the clipboard.",
      },
      {
        question: "What is error correction?",
        answer:
          "Higher error correction (H) lets the QR code be read even if part of it is damaged or obscured. Medium (M) works well for most URLs.",
      },
      {
        question: "Is this QR code generator free?",
        answer:
          "Yes. Completely free with no signup and no watermarks on generated codes.",
      },
    ],
  },
  {
    slug: "regex-tester",
    name: "Regex Tester",
    category: "Developer",
    h1: "Free Online Regex Tester",
    seoTitle: "Regex Tester — Test Regular Expressions Online | VyomaStack",
    seoDescription:
      "Free online regex tester. Test regular expressions with flags, capture groups, and highlighted matches. Debug patterns for JavaScript, Python, and Java. Runs in your browser.",
    description:
      "Test regular expressions against sample text. Toggle flags, see matches with capture groups, and highlighted results. Runs entirely in your browser.",
    keywords: [
      "regex tester",
      "regular expression tester",
      "regex online",
      "test regex",
      "regex debugger",
      "regex matcher",
      "javascript regex tester",
    ],
    relatedTools: ["json-formatter", "url-encoder", "hash-generator"],
    faqs: [
      {
        question: "What regex flags are supported?",
        answer:
          "Global (g), ignore case (i), multiline (m), dotall (s), unicode (u), and sticky (y) — matching JavaScript RegExp flags.",
      },
      {
        question: "Can I see capture groups?",
        answer:
          "Yes. Each match shows numbered capture groups from parentheses in your pattern.",
      },
      {
        question: "Does this work for Python or Java regex?",
        answer:
          "This tester uses JavaScript RegExp syntax. Most basic patterns are portable, but lookaheads and Unicode features may differ across languages.",
      },
      {
        question: "Is my data sent to a server?",
        answer:
          "No. All matching runs entirely in your browser.",
      },
    ],
  },
  {
    slug: "cron-generator",
    name: "Cron Generator",
    category: "Developer",
    h1: "Free Cron Expression Generator",
    seoTitle: "Cron Generator — Build Cron Expressions Online | VyomaStack",
    seoDescription:
      "Free cron expression generator. Build schedules with presets, see human-readable descriptions and next run times. For Linux crontab, Kubernetes, GitHub Actions, and Spring.",
    description:
      "Build cron expressions with presets or a field-by-field builder. Human-readable description and next 5 run times in your local timezone.",
    keywords: [
      "cron generator",
      "cron expression generator",
      "cron builder",
      "crontab generator",
      "cron schedule maker",
      "kubernetes cronjob generator",
      "github actions cron",
    ],
    relatedTools: ["regex-tester", "uuid-generator", "spark-memory-calculator"],
    faqs: [
      {
        question: "What cron format does this use?",
        answer:
          "Standard 5-field Unix cron: minute hour day-of-month month day-of-week. Example: 0 9 * * 1-5 runs weekdays at 9:00 AM.",
      },
      {
        question: "Where can I use these cron expressions?",
        answer:
          "Linux crontab, Kubernetes CronJob, GitHub Actions schedule, AWS EventBridge, Quartz scheduler, and Spring @Scheduled(cron = \"...\").",
      },
      {
        question: "What do the day-of-week numbers mean?",
        answer:
          "0 = Sunday, 1 = Monday, through 6 = Saturday. Use ranges like 1-5 for weekdays or lists like 0,6 for weekends.",
      },
      {
        question: "Can I see when the job will run next?",
        answer:
          "Yes. The tool shows the next 5 execution times in your local timezone based on the current expression.",
      },
    ],
  },
  {
    slug: "spark-memory-calculator",
    name: "Spark Memory Calculator",
    category: "Spark",
    h1: "Spark Executor Memory Calculator",
    seoTitle: "Spark Memory Calculator — Executor Sizing & AI Advisor | VyomaStack",
    seoDescription:
      "Free Spark memory calculator. Estimate executor overhead, unified memory, execution vs storage split, and total cluster memory. AI-powered tuning recommendations for data engineers.",
    description:
      "Calculate Spark executor memory, overhead, and cluster totals. Get AI-powered tuning recommendations for production workloads.",
    keywords: [
      "spark memory calculator",
      "spark executor memory",
      "spark memory tuning",
      "spark executor sizing",
      "apache spark memory",
      "spark submit memory",
    ],
    relatedTools: ["spark-error-explainer", "sql-formatter"],
    faqs: [
      {
        question: "How does Spark executor memory work?",
        answer:
          "Spark reserves off-heap overhead (max 384 MB or 10% of executor memory), then splits remaining on-heap memory between user code and unified memory (execution + storage) based on spark.memory.fraction.",
      },
      {
        question: "What is a good executor memory size?",
        answer:
          "Most workloads run well with 4–8 GB per executor and 2–5 cores. Larger executors increase GC pressure; smaller ones may spill to disk during shuffles.",
      },
      {
        question: "Does this include AI recommendations?",
        answer:
          "Yes. After calculating memory breakdown, use the AI Spark Tuning Advisor for personalized recommendations based on your configuration.",
      },
      {
        question: "Is this calculator free?",
        answer:
          "Yes. Memory calculation runs in your browser. AI recommendations require an API key configured by the site operator.",
      },
    ],
  },
  {
    slug: "text-compare",
    name: "Text Compare",
    category: "Developer",
    h1: "Free Text Compare & Diff Checker Online",
    seoTitle: "Text Compare — Online Diff Checker | VyomaStack",
    seoDescription:
      "Free online text compare and diff tool. Side-by-side or unified diff with SQL and JSON formatting. Ignore whitespace and case. Runs in your browser — private and instant.",
    description:
      "Compare two texts with line-by-line diff. Format SQL or JSON before comparing. Side-by-side or unified view, ignore whitespace and case — all in your browser.",
    keywords: [
      "text compare",
      "diff checker",
      "compare text online",
      "text diff",
      "diff tool",
      "compare two texts",
      "sql diff",
      "json diff",
    ],
    relatedTools: ["sql-formatter", "json-formatter", "regex-tester"],
    faqs: [
      {
        question: "What is a text compare tool?",
        answer:
          "A text compare (diff) tool shows line-by-line differences between two blocks of text — added lines, removed lines, and unchanged lines — so you can spot changes quickly.",
      },
      {
        question: "Can I compare SQL or JSON?",
        answer:
          "Yes. Use the Format SQL or Format JSON buttons on each side to beautify before diffing. Ideal for comparing queries, configs, and API payloads.",
      },
      {
        question: "What does ignore whitespace do?",
        answer:
          "When enabled, leading and trailing spaces on each line are ignored during comparison. Useful when indentation differs but content is the same.",
      },
      {
        question: "Is my text sent to a server?",
        answer:
          "No. All comparison runs entirely in your browser. Your data never leaves your device.",
      },
    ],
  },
  {
    slug: "log-analyzer",
    name: "AI Log Analyzer",
    category: "AI",
    h1: "Free AI Log Analyzer Online",
    seoTitle: "AI Log Analyzer — Spark, Spring & App Logs | VyomaStack",
    seoDescription:
      "Free online log analyzer. Paste Spark, Java, Spring Boot, or application logs. Get root cause analysis, fixes, and prevention tips. Instant + AI-enhanced.",
    description:
      "Analyze Spark, Java/Spring, or generic application logs. Auto-detect log type, highlight errors, and get AI-powered root cause analysis.",
    keywords: [
      "log analyzer online",
      "spring boot error log analyzer",
      "spark log analyzer",
      "stack trace analyzer",
      "application log analyzer",
      "error log explainer",
    ],
    relatedTools: ["spark-error-explainer", "spark-memory-calculator", "sql-formatter"],
    faqs: [
      {
        question: "What log types are supported?",
        answer:
          "Apache Spark, Java/Spring Boot, and generic application logs. Auto-detect picks the best mode from your paste.",
      },
      {
        question: "Is my log sent to a server?",
        answer:
          "For AI-enhanced analysis, log text is sent to our API. Instant analysis uses local pattern matching. Redact secrets before pasting.",
      },
      {
        question: "How is this different from Spark Error Explainer?",
        answer:
          "Log Analyzer supports multiple log types (Spark, Spring, generic) with auto-detect. Spark Error Explainer is Spark-only.",
      },
      {
        question: "Does it work without AI?",
        answer:
          "Yes. Instant analysis always returns structured root cause and fixes even when AI capacity is busy.",
      },
    ],
  },
  {
    slug: "spark-error-explainer",
    name: "Spark Error Explainer",
    category: "Spark",
    h1: "AI Spark Error Explainer",
    seoTitle: "Spark Error Explainer — AI Stack Trace Analyzer | VyomaStack",
    seoDescription:
      "Free AI Spark error explainer. Paste OOM errors, shuffle failures, and stack traces. Get root cause analysis, fixes, and Spark config recommendations.",
    description:
      "Paste Spark error logs and stack traces. AI explains root cause, fixes, prevention tips, and relevant configuration keys.",
    keywords: [
      "spark error explainer",
      "spark oom error",
      "spark stack trace analyzer",
      "spark shuffle failure",
      "apache spark debugging",
      "spark executor lost",
    ],
    relatedTools: ["log-analyzer", "spark-memory-calculator", "sql-formatter"],
    faqs: [
      {
        question: "What Spark errors can this analyze?",
        answer:
          "OOM errors, SparkOutOfMemoryError, shuffle fetch failures, stage failures, executor lost, container killed, serialization errors, and general driver/executor stack traces.",
      },
      {
        question: "How is this different from pasting into ChatGPT?",
        answer:
          "VyomaStack Spark Error Explainer is tuned for Spark-specific failures with structured output: root cause, fix, prevention, and relevant spark-submit flags and config keys.",
      },
      {
        question: "Is my error log sent to a server?",
        answer:
          "Yes, for AI analysis the log is sent to our AI API. Redact sensitive hostnames and credentials before pasting production logs.",
      },
      {
        question: "Is this tool free?",
        answer:
          "Yes. Requires a free GEMINI_API_KEY from Google AI Studio.",
      },
    ],
  },
];

export const categories = [
  "AI",
  "Developer",
  "SQL",
  "JSON",
  "PDF",
  "Images",
  "Security",
  "Spark",
  "API",
] as const;

export function getTool(slug: string): Tool | undefined {
  return tools.find((t) => t.slug === slug);
}

export function getToolsByCategory(category: string): Tool[] {
  return tools.filter((t) => t.category === category);
}

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.vyomastack.com";
