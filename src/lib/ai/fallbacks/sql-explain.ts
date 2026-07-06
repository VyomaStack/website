/**
 * Rule-based SQL explainer — works without any API.
 * Used when Gemini is rate-limited or unavailable.
 */

export function explainSqlOffline(sql: string, dialect = "sql"): string {
  const normalized = sql.trim();
  const upper = normalized.toUpperCase();

  const sections: string[] = [];

  sections.push("## Summary\n");
  sections.push(describeQueryType(upper, normalized));

  const breakdown = buildBreakdown(normalized, upper);
  if (breakdown.length > 0) {
    sections.push("\n## Step-by-step breakdown\n");
    sections.push(breakdown.join("\n"));
  }

  sections.push("\n## Performance notes\n");
  sections.push(performanceNotes(upper, normalized));

  sections.push("\n## Potential improvements\n");
  sections.push(improvements(upper, normalized, dialect));

  sections.push(
    "\n---\n*Instant analysis — generated locally in your browser's request path. AI-enhanced explanations load when capacity is available.*"
  );

  return sections.join("");
}

function describeQueryType(upper: string, sql: string): string {
  if (upper.startsWith("SELECT")) {
    const tables = extractFromTables(sql);
    const joins = (sql.match(/\bJOIN\b/gi) ?? []).length;
    if (joins > 0) {
      return `This is a **SELECT** query that reads from **${tables.join(", ") || "one or more tables"}** with **${joins} join(s)**. It retrieves and combines rows based on your join conditions and filters.`;
    }
    return `This is a **SELECT** query reading from **${tables.join(", ") || "table(s)"}**. It returns rows matching your filters and projections.`;
  }
  if (upper.startsWith("INSERT")) return "This is an **INSERT** statement that adds new rows to a table.";
  if (upper.startsWith("UPDATE")) return "This is an **UPDATE** statement that modifies existing rows.";
  if (upper.startsWith("DELETE")) return "This is a **DELETE** statement that removes rows from a table.";
  if (upper.startsWith("WITH") || upper.includes("WITH ")) {
    return "This query uses a **CTE (WITH clause)** to define temporary named result sets before the main query runs.";
  }
  return "This SQL statement performs a database operation. Review each clause below for its role in the execution plan.";
}

function buildBreakdown(sql: string, upper: string): string[] {
  const lines: string[] = [];

  const selectMatch = sql.match(/SELECT\s+([\s\S]*?)\s+FROM/i);
  if (selectMatch) {
    const cols = selectMatch[1].trim();
    const colCount = cols === "*" ? "all columns (*)" : `${cols.split(",").length} column(s)`;
    lines.push(`- **SELECT** — projects ${colCount}: \`${truncate(cols, 80)}\``);
  }

  const fromMatch = sql.match(/\bFROM\s+([\w.`"]+(?:\s+\w+)?)/i);
  if (fromMatch) {
    lines.push(`- **FROM** — primary source: \`${fromMatch[1]}\``);
  }

  const joinMatches = sql.matchAll(
    /\b((?:LEFT|RIGHT|INNER|OUTER|CROSS|FULL)?\s*JOIN)\s+([\w.`"]+)\s+(?:\w+\s+)?ON\s+([^(\n]+?)(?=\s+(?:LEFT|RIGHT|INNER|JOIN|WHERE|GROUP|ORDER|LIMIT|$))/gi
  );
  for (const m of joinMatches) {
    lines.push(`- **${m[1].trim()}** — joins \`${m[2]}\` on \`${m[3].trim()}\``);
  }

  const whereMatch = sql.match(/\bWHERE\s+([\s\S]*?)(?=\bGROUP\b|\bHAVING\b|\bORDER\b|\bLIMIT\b|$)/i);
  if (whereMatch) {
    lines.push(`- **WHERE** — filters rows: \`${truncate(whereMatch[1].trim(), 100)}\``);
  }

  const groupMatch = sql.match(/\bGROUP\s+BY\s+([^;]+?)(?=\bHAVING\b|\bORDER\b|\bLIMIT\b|$)/i);
  if (groupMatch) {
    lines.push(`- **GROUP BY** — aggregates by: \`${groupMatch[1].trim()}\``);
  }

  const havingMatch = sql.match(/\bHAVING\s+([^;]+?)(?=\bORDER\b|\bLIMIT\b|$)/i);
  if (havingMatch) {
    lines.push(`- **HAVING** — filters groups: \`${truncate(havingMatch[1].trim(), 80)}\``);
  }

  const orderMatch = sql.match(/\bORDER\s+BY\s+([^;]+?)(?=\bLIMIT\b|$)/i);
  if (orderMatch) {
    lines.push(`- **ORDER BY** — sorts results: \`${orderMatch[1].trim()}\``);
  }

  const limitMatch = sql.match(/\bLIMIT\s+(\d+)/i);
  if (limitMatch) {
    lines.push(`- **LIMIT** — returns at most **${limitMatch[1]}** rows`);
  }

  if (upper.includes("COUNT(")) lines.push("- Uses **COUNT()** aggregation — scans matching rows to compute totals.");
  if (upper.includes("DISTINCT")) lines.push("- **DISTINCT** removes duplicate rows — can be expensive on large sets without indexes.");

  return lines;
}

function performanceNotes(upper: string, sql: string): string {
  const notes: string[] = [];

  if (/\bJOIN\b/i.test(sql)) {
    notes.push("- **Joins**: Ensure join keys are indexed on both sides. Missing indexes often cause full table scans.");
  }
  if (/\bWHERE\b/i.test(sql)) {
    notes.push("- **Filters**: Push selective predicates early. Index columns used in WHERE when queries run frequently.");
  }
  if (/\bGROUP\s+BY\b/i.test(sql) || /COUNT\s*\(/i.test(sql)) {
    notes.push("- **Aggregations**: GROUP BY + HAVING can spill to disk on large datasets. Consider pre-aggregating or limiting input size.");
  }
  if (/\bSELECT\s+\*/i.test(sql)) {
    notes.push("- **SELECT ***: Fetches all columns — avoid in production; list only needed columns to reduce I/O.");
  }
  if (!/\bLIMIT\b/i.test(sql) && upper.startsWith("SELECT")) {
    notes.push("- **No LIMIT**: On large tables, add LIMIT during development or use pagination for UI queries.");
  }
  if (notes.length === 0) {
    notes.push("- Review the execution plan (`EXPLAIN`) on your database to confirm index usage and row estimates.");
  }

  return notes.join("\n");
}

function improvements(upper: string, sql: string, dialect: string): string {
  const tips: string[] = [];

  if (/\bSELECT\s+\*/i.test(sql)) {
    tips.push("- Replace `SELECT *` with explicit column names.");
  }
  if (/\bJOIN\b/i.test(sql) && !/\bON\b/i.test(sql)) {
    tips.push("- Verify every JOIN has an explicit ON condition to avoid Cartesian products.");
  }
  if (!/\bLIMIT\b/i.test(sql) && upper.startsWith("SELECT")) {
    tips.push("- Add `LIMIT` for exploratory queries on production data.");
  }
  if (dialect === "spark" || dialect === "redshift" || dialect === "bigquery") {
    tips.push("- For warehouse engines, partition prune on date/cluster keys and avoid wide shuffles before aggregations.");
  }
  tips.push("- Run `EXPLAIN` / `EXPLAIN ANALYZE` before deploying to production.");
  tips.push("- Add indexes on foreign keys and frequently filtered columns.");

  return tips.map((t) => `- ${t.replace(/^- /, "")}`).join("\n");
}

function extractFromTables(sql: string): string[] {
  const tables: string[] = [];
  const fromRe = /\bFROM\s+([\w.`"]+)/gi;
  let m: RegExpExecArray | null;
  while ((m = fromRe.exec(sql)) !== null) {
    tables.push(m[1].replace(/`/g, ""));
  }
  const joinRe = /\bJOIN\s+([\w.`"]+)/gi;
  while ((m = joinRe.exec(sql)) !== null) {
    tables.push(m[1].replace(/`/g, ""));
  }
  return [...new Set(tables)];
}

function truncate(s: string, max: number): string {
  const oneLine = s.replace(/\s+/g, " ");
  return oneLine.length > max ? `${oneLine.slice(0, max)}…` : oneLine;
}
