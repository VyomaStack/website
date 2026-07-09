import { decodeJwt, formatJson, minifyJson } from "../lib/formatters";
import { formatSql, minifySql } from "../lib/sql";
import "./popup.css";

const SITE = "https://www.vyomastack.com";

type Tool = "sql" | "json" | "jwt";

const TOOL_PATHS: Record<Tool, string> = {
  sql: "/tools/sql-formatter",
  json: "/tools/json-formatter",
  jwt: "/tools/jwt-decoder",
};

const inputEl = document.getElementById("input") as HTMLTextAreaElement;
const outputEl = document.getElementById("output") as HTMLTextAreaElement;
const errorEl = document.getElementById("error") as HTMLParagraphElement;
const btnPrimary = document.getElementById("btn-primary") as HTMLButtonElement;
const btnSecondary = document.getElementById("btn-secondary") as HTMLButtonElement;
const btnCopy = document.getElementById("btn-copy") as HTMLButtonElement;
const openSite = document.getElementById("open-site") as HTMLAnchorElement;
const tabs = document.querySelectorAll<HTMLButtonElement>(".tab");

let currentTool: Tool = "sql";

function setError(message: string | null) {
  if (message) {
    errorEl.textContent = message;
    errorEl.hidden = false;
  } else {
    errorEl.textContent = "";
    errorEl.hidden = true;
  }
}

function updateUiForTool() {
  const isJwt = currentTool === "jwt";
  btnPrimary.textContent = isJwt ? "Decode" : "Format";
  btnSecondary.hidden = isJwt;
  openSite.href = `${SITE}${TOOL_PATHS[currentTool]}`;

  tabs.forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.tool === currentTool);
  });
}

function transform(action: "format" | "minify" | "decode") {
  const text = inputEl.value.trim();
  if (!text) {
    setError("Paste some text first.");
    outputEl.value = "";
    return;
  }

  try {
    let result = "";
    if (currentTool === "sql") {
      result = action === "minify" ? minifySql(text) : formatSql(text);
    } else if (currentTool === "json") {
      result = action === "minify" ? minifyJson(text) : formatJson(text);
    } else {
      result = decodeJwt(text);
    }
    outputEl.value = result;
    setError(null);
  } catch (e) {
    outputEl.value = "";
    setError(e instanceof Error ? e.message : "Failed to process input.");
  }
}

async function loadPendingFromContextMenu() {
  const data = await chrome.storage.session.get(["pending", "output", "error"]);
  const pending = data.pending as
    | { tool: Tool; input: string; action: string }
    | undefined;

  if (pending?.input) {
    currentTool = pending.tool;
    inputEl.value = pending.input;
    updateUiForTool();
  }

  if (typeof data.error === "string" && data.error) {
    setError(data.error);
    outputEl.value = "";
  } else if (typeof data.output === "string" && data.output) {
    outputEl.value = data.output;
    setError(null);
  }

  if (pending) {
    await chrome.storage.session.remove(["pending", "output", "error"]);
  }
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    currentTool = tab.dataset.tool as Tool;
    updateUiForTool();
    setError(null);
  });
});

btnPrimary.addEventListener("click", () =>
  transform(currentTool === "jwt" ? "decode" : "format")
);
btnSecondary.addEventListener("click", () => transform("minify"));
btnCopy.addEventListener("click", async () => {
  const text = outputEl.value || inputEl.value;
  if (!text) return;
  await navigator.clipboard.writeText(text);
  btnCopy.textContent = "Copied!";
  setTimeout(() => {
    btnCopy.textContent = "Copy";
  }, 1500);
});

updateUiForTool();
void loadPendingFromContextMenu();
