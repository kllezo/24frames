/* ============================================================
   Proxy — protects the private studio experience.
   · /studio/**        → redirect to /studio/login without a valid session
   · /api/studio/**    → 401 without a valid session (auth endpoint exempt)
   · Every studio response carries X-Robots-Tag: noindex and no-store.
   · Valid sessions are re-signed (sliding idle timeout).
   Route handlers re-verify the session themselves — the proxy is
   the first line, not the only one.
   ============================================================ */

import { NextResponse, type NextRequest } from "next/server";
import {
  REFRESH_AFTER_MS,
  SESSION_COOKIE,
  sessionCookieOptions,
  sessionSecret,
  signSession,
  verifySession,
} from "@/lib/studio/session";

const PUBLIC_STUDIO_PATHS = new Set(["/studio/login", "/api/studio/auth"]);

function harden(res: NextResponse) {
  res.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  res.headers.set("Cache-Control", "no-store, max-age=0");
  res.headers.set("Referrer-Policy", "no-referrer");
  return res;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isApi = pathname.startsWith("/api/studio");

  if (PUBLIC_STUDIO_PATHS.has(pathname)) return harden(NextResponse.next());

  const secret = sessionSecret();
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = secret ? await verifySession(token, secret) : null;

  if (!session) {
    if (isApi) {
      return harden(NextResponse.json({ error: "Studio session expired. Sign in again." }, { status: 401 }));
    }
    const url = request.nextUrl.clone();
    url.pathname = "/studio/login";
    url.search = "";
    if (pathname !== "/studio") url.searchParams.set("next", pathname);
    const res = NextResponse.redirect(url);
    if (token) res.cookies.delete(SESSION_COOKIE);
    return harden(res);
  }

  const res = NextResponse.next();
  const now = Date.now();
  // A passive keep-alive ping must not count as activity, otherwise an open tab
  // would never time out. The client only pings after real interaction.
  if (secret && now - session.last > REFRESH_AFTER_MS) {
    res.cookies.set(SESSION_COOKIE, await signSession({ ...session, last: now }, secret), sessionCookieOptions());
  }
  return harden(res);
}

export const config = {
  matcher: ["/studio", "/studio/:path*", "/api/studio/:path*"],
};
