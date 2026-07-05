import type { Tool } from "@/types/tool";

export const tools: Tool[] = [
  {
    slug: "sql-formatter",
    name: "SQL Formatter",
    category: "SQL",
    h1: "Free SQL Formatter & Beautifier Online",
    seoTitle: "SQL Formatter & Beautifier Online — Free | VyomaStack",
    seoDescription:
      "Free online SQL formatter and beautifier. Format, minify, and prettify SQL for MySQL, PostgreSQL, T-SQL, Spark SQL, Redshift, BigQuery, and more. Runs in your browser — no signup.",
    description:
      "Beautify and minify SQL queries instantly. Supports MySQL, PostgreSQL, T-SQL, Spark SQL, Redshift, BigQuery, and more. 100% private — runs in your browser.",
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
    h1: "Free JSON Formatter & Validator Online",
    seoTitle: "JSON Formatter & Validator Online — Free | VyomaStack",
    seoDescription:
      "Free online JSON formatter, validator, and minifier. Beautify JSON with syntax highlighting, validate structure, and compress to a single line. Runs in your browser.",
    description:
      "Format, validate, and minify JSON instantly. Pretty-print with custom indentation or compress to one line. 100% private — runs in your browser.",
    keywords: [
      "json formatter",
      "json validator",
      "json beautifier",
      "format json online",
      "json minifier",
      "pretty print json",
    ],
    relatedTools: ["sql-formatter", "jwt-decoder"],
    faqs: [
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
        question: "Is my JSON data sent to a server?",
        answer:
          "No. All formatting and validation runs in your browser. Your data never leaves your device.",
      },
      {
        question: "Can I minify JSON?",
        answer:
          "Yes. Use the Minify button to remove all whitespace and compress JSON to a single line.",
      },
      {
        question: "Is this JSON formatter free?",
        answer:
          "Yes. Completely free with no signup, no limits, and no watermarks.",
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
    relatedTools: ["json-formatter", "base64-encoder"],
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
    description: "Generate random UUID v4 identifiers.",
  },
  {
    slug: "base64-encoder",
    name: "Base64 Encoder",
    category: "Developer",
    description: "Encode and decode Base64 strings.",
  },
  {
    slug: "spark-memory-calculator",
    name: "Spark Memory Calculator",
    category: "Spark",
    description: "Estimate Spark executor memory requirements.",
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
