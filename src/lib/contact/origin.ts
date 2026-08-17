/**
 * Bots posting straight to /api/contact usually omit Origin.
 * Browser fetch() from the site always sends it.
 * Compare against Host / x-forwarded-host because on Vercel
 * request.url may be the deployment hostname, not the custom domain.
 */
export function isSameOriginRequest(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;

  try {
    const originHost = new URL(origin).host;
    const candidates = [
      request.headers.get("x-forwarded-host"),
      request.headers.get("host"),
      new URL(request.url).host,
    ];

    return candidates.some((host) => {
      if (!host) return false;
      const first = host.split(",")[0].trim();
      return first === originHost;
    });
  } catch {
    return false;
  }
}
