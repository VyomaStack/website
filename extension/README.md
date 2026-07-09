# VyomaStack Chrome Extension

Format SQL, JSON, and decode JWT from any webpage — locally in the extension popup.

## Features (v0.1)

- **Popup tools:** SQL format/minify, JSON format/minify, JWT decode
- **Context menu:** Select text → right-click → VyomaStack → Format SQL / JSON / Decode JWT
- **100% local** for format/decode (no data sent to servers)
- **Open full tool** link to [vyomastack.com](https://www.vyomastack.com)

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

## Pin the extension

Click the puzzle icon in Chrome toolbar → pin **VyomaStack**.

## Usage

1. Click the extension icon → paste SQL/JSON/JWT → Format
2. Or select text on any page → right-click → **VyomaStack** → choose action

## Chrome Web Store (later)

1. Create a [Chrome Web Store developer account](https://chrome.google.com/webstore/devconsole) ($5 one-time)
2. Zip the `dist/` folder
3. Upload with description, screenshots, and privacy policy URL (`https://www.vyomastack.com/privacy`)

## Roadmap

- [ ] Prefill vyomastack.com tools from extension
- [ ] AI explain via website (Pro)
- [ ] YAML format in popup
- [ ] Firefox port (MV3)
