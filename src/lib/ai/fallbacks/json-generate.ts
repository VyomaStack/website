type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

function inferTsType(value: JsonValue): string {
  if (value === null) return "null";
  if (Array.isArray(value)) {
    if (value.length === 0) return "unknown[]";
    return `${inferTsType(value[0])}[]`;
  }
  switch (typeof value) {
    case "string":
      return "string";
    case "number":
      return Number.isInteger(value) ? "number" : "number";
    case "boolean":
      return "boolean";
    case "object":
      return toPascalCase("Nested") + "";
    default:
      return "unknown";
  }
}

function toPascalCase(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, c: string) => c.toUpperCase())
    .replace(/^./, (c) => c.toUpperCase())
    .replace(/[^a-zA-Z0-9]/g, "") || "RootModel";
}

function toCamelCase(name: string): string {
  const p = toPascalCase(name);
  return p.charAt(0).toLowerCase() + p.slice(1);
}

function sqlType(value: JsonValue): string {
  if (value === null) return "TEXT";
  if (typeof value === "boolean") return "BOOLEAN";
  if (typeof value === "number") return Number.isInteger(value) ? "BIGINT" : "DOUBLE PRECISION";
  if (typeof value === "string") {
    if (/^\d{4}-\d{2}-\d{2}/.test(value)) return "TIMESTAMP";
    return "TEXT";
  }
  if (Array.isArray(value)) return "JSONB";
  return "JSONB";
}

export function generateFromJsonOffline(
  jsonStr: string,
  type: string,
  className: string
): string {
  const data = JSON.parse(jsonStr) as JsonValue;
  const root = toPascalCase(className);

  switch (type) {
    case "java-pojo":
      return generateJavaPojo(data, root);
    case "typescript":
      return generateTypeScript(data, root);
    case "openapi":
      return generateOpenApi(data, root);
    case "sql":
      return generateSql(data, root);
    default:
      return "Unsupported generation type.";
  }
}

function generateJavaPojo(data: JsonValue, className: string): string {
  if (typeof data !== "object" || data === null || Array.isArray(data)) {
    return "```java\n// Root must be a JSON object\n```";
  }

  const lines: string[] = [
    "```java",
    "package com.vyomastack.generated;",
    "",
    "import com.fasterxml.jackson.annotation.JsonProperty;",
    "",
    `public class ${className} {`,
  ];

  for (const [key, value] of Object.entries(data)) {
    const javaType = javaTypeFor(value, key);
    lines.push(`  @JsonProperty("${key}")`);
    lines.push(`  private ${javaType} ${toCamelCase(key)};`);
    lines.push("");
    lines.push(`  public ${javaType} get${toPascalCase(key)}() { return ${toCamelCase(key)}; }`);
    lines.push(`  public void set${toPascalCase(key)}(${javaType} v) { this.${toCamelCase(key)} = v; }`);
    lines.push("");
  }

  lines.push("}");
  lines.push("```");
  lines.push("\n*Instant generation — built locally from your JSON structure.*");
  return lines.join("\n");
}

function javaTypeFor(value: JsonValue, key: string): string {
  if (value === null) return "Object";
  if (Array.isArray(value)) {
    if (value.length === 0) return "List<Object>";
    return `List<${javaTypeFor(value[0], key)}>`;
  }
  switch (typeof value) {
    case "string":
      return "String";
    case "number":
      return Number.isInteger(value) ? "Long" : "Double";
    case "boolean":
      return "Boolean";
    case "object":
      return toPascalCase(key);
    default:
      return "Object";
  }
}

function generateTypeScript(data: JsonValue, rootName: string): string {
  const iface = buildTsInterface(data, rootName, new Set());
  return `\`\`\`typescript\n${iface}\n\`\`\`\n\n*Instant generation — built locally from your JSON structure.*`;
}

function buildTsInterface(
  data: JsonValue,
  name: string,
  seen: Set<string>
): string {
  if (typeof data !== "object" || data === null || Array.isArray(data)) {
    return `export type ${name} = ${inferTsType(data)};`;
  }

  const lines: string[] = [`export interface ${name} {`];
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      const nested = toPascalCase(key);
      if (!seen.has(nested)) {
        seen.add(nested);
        lines.push(buildTsInterface(value, nested, seen));
        lines.push("");
      }
      lines.push(`  ${key}: ${nested};`);
    } else {
      lines.push(`  ${key}: ${inferTsType(value)};`);
    }
  }
  lines.push("}");
  return lines.join("\n");
}

function generateOpenApi(data: JsonValue, rootName: string): string {
  const schema = jsonToOpenApiSchema(data);
  return `\`\`\`yaml
openapi: 3.0.3
info:
  title: Generated API
  version: 1.0.0
paths:
  /api/data:
    get:
      summary: Get ${rootName}
      responses:
        '200':
          description: Success
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/${rootName}'
components:
  schemas:
    ${rootName}:
${schema}
\`\`\`

*Instant generation — built locally from your JSON structure.*`;
}

function jsonToOpenApiSchema(data: JsonValue, indent = "      "): string {
  if (Array.isArray(data)) {
    return `${indent}type: array\n${indent}items:\n${jsonToOpenApiSchema(data[0] ?? null, indent + "  ")}`;
  }
  if (typeof data === "object" && data !== null) {
    const props = Object.entries(data)
      .map(([k, v]) => `${indent}  ${k}:\n${jsonToOpenApiSchema(v, indent + "    ")}`)
      .join("\n");
    return `${indent}type: object\n${indent}properties:\n${props}`;
  }
  if (typeof data === "string") return `${indent}type: string`;
  if (typeof data === "number") return `${indent}type: number`;
  if (typeof data === "boolean") return `${indent}type: boolean`;
  return `${indent}type: string`;
}

function generateSql(data: JsonValue, tablePrefix: string): string {
  if (typeof data !== "object" || data === null || Array.isArray(data)) {
    return "```sql\n-- Root must be a JSON object\n```";
  }

  const table = tablePrefix.toLowerCase().replace(/[^a-z0-9_]/g, "_");
  const cols = Object.entries(data)
    .map(([key, value]) => `  ${key.toLowerCase()} ${sqlType(value)}`)
    .join(",\n");

  return `\`\`\`sql
CREATE TABLE ${table} (
  id BIGSERIAL PRIMARY KEY,
${cols},
  created_at TIMESTAMP DEFAULT NOW()
);
\`\`\`

*Instant generation — built locally from your JSON structure.*`;
}
