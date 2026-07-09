import { analyzeSelection } from "../lib/api";
import { decodeJwt, formatJson, minifyJson } from "../lib/formatters";
import { formatSql, minifySql } from "../lib/sql";
import "./popup.css";

const SITE = "https://www.vyomastack.com";

type Tool = "sql" | "json" | "jwt" | "analyze";

const TOOL_PATHS: Record<Exclude<Tool, "analyze">, string> = {
  sql: "/tools/sql-formatter",
  json: "/tools/json-formatter",
  jwt: "/tools/jwt-decoder",
};

const inputEl = document.getElementById("input") as HTMLTextAreaElement;
const outputEl = document.getElementById("output") as HTMLTextAreaElement;
const errorEl = document.getElementById("error") as HTMLParagraphElement;
const metaEl = document.getElementById("meta") as HTMLParagraphElement;
const btnPrimary = document.getElementById("btn-primary") as HTMLButtonElement;
const btnSecondary = document.getElementById("btn-secondary") as HTMLButtonElement;
const btnCopy = document.getElementById("btn-copy") as HTMLButtonElement;
const openSite = document.getElementById("open-site") as HTMLAnchorElement;
const tabs = document.querySelectorAll<HTMLButtonElement>(".tab");

let currentTool: Tool = "sql";
let analyzing = false;

function setError(message: string | null) {
  if (message) {
    errorEl.textContent = message;
    errorEl.hidden = false;
  } else {
    errorEl.textContent = "";
    errorEl.hidden = true;
  }
}

function setMeta(message: string | null) {
  if (message) {
    metaEl.textContent = message;
    metaEl.hidden = false;
  } else {
    metaEl.textContent = "";
    metaEl.hidden = true;
  }
}

function updateUiForTool() {
  const isAnalyze = currentTool === "analyze";
  const isJwt = currentTool === "jwt";

  btnPrimary.textContent = isAnalyze ? "Analyze" : isJwt ? "Decode" : "Format";
  btnSecondary.hidden = isJwt || isAnalyze;
  openSite.href = isAnalyze
    ? `${SITE}/tools`
    : `${SITE}${TOOL_PATHS[currentTool as Exclude<Tool, "analyze">]}`;
  openSite.textContent = isAnalyze ? "Open VyomaStack →" : "Open full tool →";

  tabs.forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.tool === currentTool);
  });

  inputEl.placeholder = isAnalyze
    ? "Paste SQL, a log snippet, or any text to analyze..."
    : "Paste or use right-click → VyomaStack on selected text...";

  outputEl.placeholder = isAnalyze
    ? "AI explanation appears here..."
    : "Output appears here...";
}

function transform(action: "format" | "minify" | "decode") {
  const text = inputEl.value.trim();
  if (!text) {
    setError("Paste some text first.");
    outputEl.value = "";
    setMeta(null);
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
    setMeta(null);
  } catch (e) {
    outputEl.value = "";
    setMeta(null);
    setError(e instanceof Error ? e.message : "Failed to process input.");
  }
}

async function runAnalyze() {
  const text = inputEl.value.trim();
  if (!text) {
    setError("Paste some text first.");
    outputEl.value = "";
    setMeta(null);
    return;
  }

  if (analyzing) return;

  analyzing = true;
  btnPrimary.disabled = true;
  btnPrimary.textContent = "Analyzing…";
  setError(null);
  setMeta(null);
  outputEl.value = "";

  try {
    const result = await analyzeSelection(text);
    outputEl.value = result.explanation;
    const sourceLabel = result.source === "ai" ? "AI" : "Instant";
    setMeta(`${result.label} · ${sourceLabel}`);
  } catch (e) {
    outputEl.value = "";
    setMeta(null);
    setError(e instanceof Error ? e.message : "Analysis failed.");
  } finally {
    analyzing = false;
    btnPrimary.disabled = false;
    btnPrimary.textContent = "Analyze";
  }
}

async function loadPendingFromContextMenu() {
  const data = await chrome.storage.session.get(["pending", "output", "error"]);
  const pending = data.pending as
    | {
        kind?: string;
        tool?: Tool;
        input: string;
        action?: string;
        autoRun?: boolean;
      }
    | undefined;

  if (pending?.input) {
    inputEl.value = pending.input;

    if (pending.kind === "analyze") {
      currentTool = "analyze";
      updateUiForTool();
      if (pending.autoRun) {
        await runAnalyze();
      }
    } else if (pending.tool) {
      currentTool = pending.tool;
      updateUiForTool();
    }
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
    setMeta(null);
  });
});

btnPrimary.addEventListener("click", () => {
  if (currentTool === "analyze") {
    void runAnalyze();
    return;
  }
  transform(currentTool === "jwt" ? "decode" : "format");
});

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
