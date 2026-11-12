/* Portal session — a signed, http-only cookie holding who is signed in.
   Clients stay signed in for 30 days (so they can return to edit their
   quotation); studio staff for 12 hours. The account is re-read on every
   request, so disabling a team member takes effect immediately. */

import { sessionSecret, signToken, verifyToken } from "@/lib/studio/session";
import type { PortalRole } from "./types";

export const PORTAL_COOKIE = "tf_portal";
const CLIENT_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const STAFF_TTL_MS = 12 * 60 * 60 * 1000;

export interface PortalSession {
  v: 1;
  uid: string;
  role: PortalRole;
  iat: number;
}

export const portalTtl = (role: PortalRole) => (role === "client" ? CLIENT_TTL_MS : STAFF_TTL_MS);

export async function signPortal(uid: string, role: PortalRole): Promise<string | null> {
  const secret = sessionSecret();
  if (!secret) return null;
  return signToken({ v: 1, uid, role, iat: Date.now() } satisfies PortalSession, secret);
}

export async function readPortal(token: string | undefined): Promise<PortalSession | null> {
  const secret = sessionSecret();
  if (!secret) return null;
  const s = await verifyToken<PortalSession>(token, secret);
  if (!s || s.v !== 1 || !s.uid) return null;
  if (Date.now() - s.iat > portalTtl(s.role)) return null;
  return s;
}

export function portalCookieOptions(role: PortalRole) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: Math.floor(portalTtl(role) / 1000),
  };
}
