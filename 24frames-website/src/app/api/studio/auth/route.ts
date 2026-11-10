import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  adminCookieOptions,
  signAdmin,
  SESSION_COOKIE,
  safeEqual,
  sessionCookieOptions,
  sessionSecret,
  signSession,
} from "@/lib/studio/session";
import { noStore, readJson } from "@/lib/studio/server/guard";

/* Sign-in with the studio PIN. Failed attempts are throttled per client
   address: 5 failures → 5-minute lockout (in-memory; per server instance). */

const attempts = new Map<string, { count: number; until: number }>();
const MAX_FAILURES = 5;
const LOCKOUT_MS = 5 * 60 * 1000;

function clientKey(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "local";
}

export async function POST(request: Request) {
  const pin = process.env.STUDIO_PIN;
  const secret = sessionSecret();
  if (!pin || pin.length < 4 || !secret) {
    return noStore(
      NextResponse.json(
        { error: "Studio access is not configured. Set STUDIO_PIN and STUDIO_SESSION_SECRET on the server." },
        { status: 503 },
      ),
    );
  }

  const key = clientKey(request);
  const state = attempts.get(key);
  const now = Date.now();
  if (state && state.until > now) {
    const minutes = Math.ceil((state.until - now) / 60000);
    return noStore(NextResponse.json({ error: `Too many attempts. Try again in ${minutes} min.` }, { status: 429 }));
  }

  const body = await readJson<{ pin?: unknown; consultant?: unknown; scope?: unknown }>(request, 2000);
  const given = typeof body?.pin === "string" ? body.pin.trim() : "";
  if (!safeEqual(given, pin)) {
    const count = (state && state.until <= now && state.count >= MAX_FAILURES ? 0 : state?.count ?? 0) + 1;
    attempts.set(key, { count, until: count >= MAX_FAILURES ? now + LOCKOUT_MS : 0 });
    return noStore(NextResponse.json({ error: "That PIN isn't right." }, { status: 401 }));
  }
  attempts.delete(key);

  // Re-confirmation for the studio admin: issue only the admin cookie.
  if (body?.scope === "admin") {
    const res = NextResponse.json({ ok: true, scope: "admin" });
    res.cookies.set(ADMIN_COOKIE, await signAdmin(secret, now), adminCookieOptions());
    return noStore(res);
  }

  const consultant =
    typeof body?.consultant === "string" && body.consultant.trim() ? body.consultant.trim().slice(0, 60) : "Studio";
  const token = await signSession({ v: 1, consultant, iat: now, last: now }, secret);
  const res = NextResponse.json({ ok: true, consultant });
  res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
  return noStore(res);
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", { ...sessionCookieOptions(), maxAge: 0 });
  res.cookies.set(ADMIN_COOKIE, "", { ...sessionCookieOptions(), maxAge: 0 });
  return noStore(res);
}
