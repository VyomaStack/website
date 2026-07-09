import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "vite";

const root = resolve(__dirname);

export default defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: resolve(root, "src/popup/popup.html"),
        background: resolve(root, "src/background.ts"),
      },
      output: {
        entryFileNames: (chunk) =>
          chunk.name === "background" ? "background.js" : "assets/[name].js",
        assetFileNames: "assets/[name][extname]",
      },
    },
  },
  plugins: [
    {
      name: "package-extension",
      closeBundle() {
        mkdirSync(resolve(root, "dist/icons"), { recursive: true });

        const nestedPopup = resolve(root, "dist/src/popup/popup.html");
        const flatPopup = resolve(root, "dist/popup.html");

        try {
          let html = readFileSync(nestedPopup, "utf8");
          html = html.replace(/\.\.\/\.\.\/assets\//g, "./assets/");
          writeFileSync(flatPopup, html);
        } catch {
          // popup may already be at dist/popup.html
        }

        const manifest = JSON.parse(
          readFileSync(resolve(root, "manifest.json"), "utf8")
        );
        writeFileSync(
          resolve(root, "dist/manifest.json"),
          JSON.stringify(manifest, null, 2)
        );

        for (const size of [16, 48, 128]) {
          copyFileSync(
            resolve(root, `public/icons/icon${size}.png`),
            resolve(root, `dist/icons/icon${size}.png`)
          );
        }
      },
    },
  ],
});
