import { format } from "sql-formatter";

export function formatSql(text: string): string {
  return format(text, {
    language: "sql",
    tabWidth: 2,
    keywordCase: "upper",
    linesBetweenQueries: 2,
  });
}

export function minifySql(text: string): string {
  return format(text, {
    language: "sql",
    tabWidth: 0,
    keywordCase: "upper",
  })
    .replace(/\s+/g, " ")
    .trim();
}
