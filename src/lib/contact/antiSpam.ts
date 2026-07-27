const MIN_FORM_OPEN_SECONDS = 4;
const MAX_FORM_AGE_MS = 2 * 60 * 60 * 1000; // 2 hours

export type AntiSpamInput = {
  honeypot?: string;
  honeypotCompany?: string;
  formOpenTimestamp?: number;
};

export type AntiSpamResult =
  | { ok: true }
  | { ok: false; error: "spam" | "too_fast" | "expired" };

/**
 * Server-side bot checks: honeypots, minimum dwell time, and stale form sessions.
 */
export function validateAntiSpam(input: AntiSpamInput): AntiSpamResult {
  if (input.honeypot?.trim() || input.honeypotCompany?.trim()) {
    return { ok: false, error: "spam" };
  }

  const openedAt =
    typeof input.formOpenTimestamp === "number" ? input.formOpenTimestamp : 0;

  if (!openedAt || openedAt <= 0) {
    return { ok: false, error: "spam" };
  }

  const now = Date.now();

  if (openedAt > now) {
    return { ok: false, error: "spam" };
  }

  if (now - openedAt < MIN_FORM_OPEN_SECONDS * 1000) {
    return { ok: false, error: "too_fast" };
  }

  if (now - openedAt > MAX_FORM_AGE_MS) {
    return { ok: false, error: "expired" };
  }

  return { ok: true };
}
