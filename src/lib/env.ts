/**
 * Read a server env var by dynamic key.
 * Prefer process.env (Vercel / Node SSR), then import.meta.env for local .env values.
 * Do not import from "vite" here — it pulls Rolldown into the serverless bundle.
 */
export function getEnv(key: string): string {
  const fromProcess = process.env[key];
  const fromMeta = (import.meta.env as Record<string, string | boolean | undefined>)[
    key
  ];
  const raw = fromProcess ?? fromMeta ?? "";
  return String(raw)
    .trim()
    .replace(/^["']|["']$/g, "");
}
