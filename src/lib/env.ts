import { loadEnv } from "vite";
import { fileURLToPath } from "node:url";
import path from "node:path";

const rootDir = path.resolve(fileURLToPath(new URL("../..", import.meta.url)));
const mode = import.meta.env.MODE || process.env.NODE_ENV || "development";

/** All keys from `.env` / `.env.[mode]` (empty prefix = no PUBLIC_ filter). */
const fileEnv = loadEnv(mode, rootDir, "");

/**
 * Read a server env var. Prefer file/.process env over dynamic import.meta.env
 * (Vite does not support import.meta.env[dynamicKey]).
 */
export function getEnv(key: string): string {
  const raw = fileEnv[key] ?? process.env[key] ?? "";
  return String(raw)
    .trim()
    .replace(/^["']|["']$/g, "");
}
