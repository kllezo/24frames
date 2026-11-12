/* ============================================================
   Studio session — signed, http-only cookie.
   ------------------------------------------------------------
   Token = base64url(JSON payload) + "." + base64url(HMAC-SHA256)
   Uses Web Crypto only, so it runs in the proxy and in route
   handlers alike. Two expiries:
     · idle     — 30 minutes since the last studio request (sliding)
     · absolute — 12 hours since sign-in
   ============================================================ */

export const SESSION_COOKIE = "tf_studio_session";
export const IDLE_TIMEOUT_MS = 30 * 60 * 1000;
export const ABSOLUTE_TIMEOUT_MS = 12 * 60 * 60 * 1000;
/** Re-issue the cookie at most once per minute to keep it sliding. */
export const REFRESH_AFTER_MS = 60 * 1000;

export interface StudioSession {
  v: 1;
  /** Consultant display name entered at sign-in. */
  consultant: string;
  /** Issued at (ms). */
  iat: number;
  /** Last activity (ms). */
  last: number;
}

const enc = new TextEncoder();

function b64url(bytes: Uint8Array): string {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromB64url(s: string): Uint8Array {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  const bin = atob(s.replace(/-/g, "+").replace(/_/g, "/") + pad);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

export function sessionSecret(): string | null {
  const s = process.env.STUDIO_SESSION_SECRET;
  return s && s.length >= 32 ? s : null;
}

async function hmacKey(secret: string) {
  return crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, [
    "sign",
    "verify",
  ]);
}

export async function signSession(session: StudioSession, secret: string): Promise<string> {
  const body = b64url(enc.encode(JSON.stringify(session)));
  const sig = new Uint8Array(await crypto.subtle.sign("HMAC", await hmacKey(secret), enc.encode(body)));
  return `${body}.${b64url(sig)}`;
}

export async function verifySession(
  token: string | undefined,
  secret: string,
  now = Date.now(),
): Promise<StudioSession | null> {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  try {
    const ok = await crypto.subtle.verify(
      "HMAC",
      await hmacKey(secret),
      fromB64url(sig) as BufferSource,
      enc.encode(body),
    );
    if (!ok) return null;
    const session = JSON.parse(new TextDecoder().decode(fromB64url(body))) as StudioSession;
    if (session.v !== 1) return null;
    if (now - session.last > IDLE_TIMEOUT_MS) return null;
    if (now - session.iat > ABSOLUTE_TIMEOUT_MS) return null;
    return session;
  } catch {
    return null;
  }
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "strict" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: Math.floor(IDLE_TIMEOUT_MS / 1000),
  };
}

/** Constant-time string comparison (avoids leaking PIN length/prefix timing). */
export function safeEqual(a: string, b: string): boolean {
  const x = enc.encode(a);
  const y = enc.encode(b);
  let diff = x.length ^ y.length;
  const len = Math.max(x.length, y.length);
  for (let i = 0; i < len; i++) diff |= (x[i] ?? 0) ^ (y[i] ?? 0);
  return diff === 0;
}

/* ------------------------------------------------------------
   Admin elevation: the studio admin asks for the PIN again and
   holds a separate, short-lived signed cookie (15 minutes).
   ------------------------------------------------------------ */
export const ADMIN_COOKIE = "tf_studio_admin";
export const ADMIN_TTL_MS = 15 * 60 * 1000;
const ADMIN_MARK = "\u0000admin";

export async function signAdmin(secret: string, now = Date.now()): Promise<string> {
  return signSession({ v: 1, consultant: ADMIN_MARK, iat: now, last: now }, secret);
}

export async function verifyAdmin(token: string | undefined, secret: string, now = Date.now()): Promise<boolean> {
  const s = await verifySession(token, secret, now);
  return !!s && s.consultant === ADMIN_MARK && now - s.iat <= ADMIN_TTL_MS;
}

export function adminCookieOptions() {
  return { ...sessionCookieOptions(), maxAge: Math.floor(ADMIN_TTL_MS / 1000) };
}

/* ------------------------------------------------------------
   Generic signed tokens (used by the client & studio portal).
   ------------------------------------------------------------ */
export async function signToken(payload: object, secret: string): Promise<string> {
  const body = b64url(enc.encode(JSON.stringify(payload)));
  const sig = new Uint8Array(await crypto.subtle.sign("HMAC", await hmacKey(secret), enc.encode(body)));
  return `${body}.${b64url(sig)}`;
}

export async function verifyToken<T>(token: string | undefined, secret: string): Promise<T | null> {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  try {
    const ok = await crypto.subtle.verify("HMAC", await hmacKey(secret), fromB64url(sig) as BufferSource, enc.encode(body));
    return ok ? (JSON.parse(new TextDecoder().decode(fromB64url(body))) as T) : null;
  } catch {
    return null;
  }
}
