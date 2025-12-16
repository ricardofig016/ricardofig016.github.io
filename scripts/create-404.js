import { access, copyFile } from "node:fs/promises";
import { constants } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import process from "node:process";

const repoRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const distDir = resolve(repoRoot, "dist");
const source = resolve(distDir, "index.html");
const target = resolve(distDir, "404.html");

async function ensureSpaFallback() {
  try {
    await access(source, constants.F_OK);
  } catch {
    console.warn("Skipping SPA fallback: dist/index.html not found.");
    return;
  }

  try {
    await copyFile(source, target);
    console.log("SPA fallback ready: copied dist/index.html to dist/404.html.");
  } catch (error) {
    console.error("Failed to create SPA fallback 404.html:", error);
    process.exit(1);
  }
}

ensureSpaFallback();
