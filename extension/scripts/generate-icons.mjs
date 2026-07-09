import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const svgPath = join(root, "../public/icon.svg");
const outDir = join(root, "public/icons");

const sizes = [16, 48, 128];

const svg = await readFile(svgPath);
await mkdir(outDir, { recursive: true });

for (const size of sizes) {
  const buf = await sharp(svg).resize(size, size).png().toBuffer();
  await writeFile(join(outDir, `icon${size}.png`), buf);
}

// Copy manifest into dist after vite - handled in build script
console.log("Generated extension icons:", sizes.map((s) => `icon${s}.png`).join(", "));
