import { decodeJwt, formatJson, minifyJson } from "./lib/formatters";
import { formatSql, minifySql } from "./lib/sql";

const SITE = "https://www.vyomastack.com";

type Tool = "sql" | "json" | "jwt";

type PendingPayload = {
  tool: Tool;
  input: string;
  action: "format" | "minify" | "decode";
};

const TOOL_PATHS: Record<Tool, string> = {
  sql: "/tools/sql-formatter",
  json: "/tools/json-formatter",
  jwt: "/tools/jwt-decoder",
};

function runTransform(payload: PendingPayload): string {
  const { tool, input, action } = payload;
  if (tool === "sql") {
    return action === "minify" ? minifySql(input) : formatSql(input);
  }
  if (tool === "json") {
    return action === "minify" ? minifyJson(input) : formatJson(input);
  }
  return decodeJwt(input);
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: "vyoma-parent",
      title: "VyomaStack",
      contexts: ["selection"],
    });
    chrome.contextMenus.create({
      id: "vyoma-sql",
      parentId: "vyoma-parent",
      title: "Format SQL",
      contexts: ["selection"],
    });
    chrome.contextMenus.create({
      id: "vyoma-json",
      parentId: "vyoma-parent",
      title: "Format JSON",
      contexts: ["selection"],
    });
    chrome.contextMenus.create({
      id: "vyoma-jwt",
      parentId: "vyoma-parent",
      title: "Decode JWT",
      contexts: ["selection"],
    });
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  const selection = info.selectionText?.trim();
  if (!selection) return;

  let payload: PendingPayload | null = null;

  if (info.menuItemId === "vyoma-sql") {
    payload = { tool: "sql", input: selection, action: "format" };
  } else if (info.menuItemId === "vyoma-json") {
    payload = { tool: "json", input: selection, action: "format" };
  } else if (info.menuItemId === "vyoma-jwt") {
    payload = { tool: "jwt", input: selection, action: "decode" };
  }

  if (!payload) return;

  try {
    const output = runTransform(payload);
    await chrome.storage.session.set({ pending: payload, output });
    await chrome.action.openPopup();
  } catch (e) {
    const message = e instanceof Error ? e.message : "Transform failed";
    await chrome.storage.session.set({
      pending: payload,
      output: "",
      error: message,
    });
    await chrome.action.openPopup();
  }
});

export { SITE, TOOL_PATHS, runTransform };
export type { PendingPayload, Tool };
