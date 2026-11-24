/* The site's public address. Behind Hostinger's proxy the request URL is
   the server's internal address (https://0.0.0.0:3000), so links and
   redirects must never be built from it. */

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://24framesphotography.in").replace(/\/$/, "");

const INTERNAL = /^(0\.0\.0\.0|127\.|localhost|\[::1?\])/i;

/** The origin the visitor actually used — for links we hand out and redirects. */
export function publicOrigin(request: Request): string {
  const h = request.headers;
  const host = (h.get("x-forwarded-host") || h.get("host") || "").split(",")[0].trim();
  const proto = (h.get("x-forwarded-proto") || "").split(",")[0].trim() || "https";
  if (host && !INTERNAL.test(host)) return `${proto}://${host}`;
  const origin = h.get("origin");
  if (origin && !INTERNAL.test(new URL(origin).host)) return origin;
  // Local development keeps its own address; anywhere else falls back to the real domain.
  const own = new URL(request.url);
  return process.env.NODE_ENV === "production" ? SITE_URL : own.origin;
}

/** An absolute URL on the public site, for NextResponse.redirect. */
export const publicUrl = (request: Request, path: string) => new URL(path, publicOrigin(request));
