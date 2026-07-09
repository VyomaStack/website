# VyomaStack Chrome Extension

Format SQL, JSON, and decode JWT locally. Analyze SQL and logs with VyomaStack AI from any page.

## Features (v0.2)

- **Popup tools:** SQL format/minify, JSON format/minify, JWT decode
- **AI Analyze tab:** Paste SQL, logs, or text → auto-detect → call VyomaStack API
- **Context menu:** Select text → right-click → VyomaStack → Format / Decode / **Analyze with VyomaStack**
- **Local format/decode** — no data sent for SQL/JSON/JWT transforms
- **AI analyze** — selected text sent to `vyomastack.com/api/ai/analyze-selection` (same AI + instant fallbacks as the website)

## Build

```bash
cd extension
npm install
npm run build
```

Output is in `extension/dist/`.

## Install (unpacked, for development)

1. Run `npm run build`
2. Open Chrome → `chrome://extensions`
3. Enable **Developer mode**
4. Click **Load unpacked**
5. Select the `extension/dist` folder
6. After updates, click **Reload** on the extension card

## Pin the extension

Click the puzzle icon in Chrome toolbar → pin **VyomaStack**.

## Usage

1. Click the extension icon → choose a tab → paste text → Format / Analyze
2. Or select text on any page → right-click → **VyomaStack** → choose action
3. **Analyze** auto-detects SQL vs log/error vs generic text

## Chrome Web Store (later)

1. Create a [Chrome Web Store developer account](https://chrome.google.com/webstore/devconsole) ($5 one-time)
2. Zip the `dist/` folder
3. Upload with description, screenshots, and privacy policy URL (`https://www.vyomastack.com/privacy`)

## Roadmap

- [ ] Prefill vyomastack.com tools from extension
- [ ] YAML format in popup
- [ ] Side panel for longer AI results
- [ ] Firefox port (MV3)
