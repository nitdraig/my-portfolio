import { getEnv } from "../env";

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export function getTurnstileSiteKey(): string {
  return getEnv("PUBLIC_TURNSTILE_SITE_KEY");
}

function getTurnstileSecret(): string {
  return getEnv("TURNSTILE_SECRET_KEY");
}

export function isTurnstileConfigured(): boolean {
  return Boolean(getTurnstileSiteKey() && getTurnstileSecret());
}

export async function verifyTurnstileToken(
  token: string | undefined,
  ip: string,
): Promise<boolean> {
  const secret = getTurnstileSecret();
  if (!secret) return false;
  if (!token?.trim()) return false;

  const body = new URLSearchParams({
    secret,
    response: token,
  });
  if (ip && ip !== "unknown") {
    body.set("remoteip", ip);
  }

  const res = await fetch(VERIFY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!res.ok) return false;

  const data = (await res.json()) as { success?: boolean };
  return data.success === true;
}
