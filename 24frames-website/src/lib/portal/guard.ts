/* Portal guards for pages and route handlers. The cookie only says who
   claims to be signed in; the account is re-read every time so a
   disabled team member or a deleted account loses access at once. */

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getAccess, getAccount, StorageUnavailableError } from "./store";
import { PORTAL_COOKIE, readPortal } from "./session";
import type { PortalAccount, PortalRole } from "./types";

export async function currentAccount(): Promise<PortalAccount | null> {
  const session = await readPortal((await cookies()).get(PORTAL_COOKIE)?.value);
  if (!session) return null;
  try {
    const account = await getAccount(session.uid);
    if (!account || !account.active || account.role !== session.role) return null;
    if (!(await deskAllowed(account))) return null;
    return account;
  } catch {
    return null;
  }
}

export function json(body: unknown, status = 200) {
  const res = NextResponse.json(body, { status });
  res.headers.set("Cache-Control", "no-store, max-age=0");
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  return res;
}

export async function requireRole(...roles: PortalRole[]): Promise<PortalAccount | NextResponse> {
  const account = await currentAccount();
  if (!account) return json({ error: "Please sign in again." }, 401);
  if (roles.length && !roles.includes(account.role)) return json({ error: "You don't have access to this." }, 403);
  return account;
}

export function portalError(err: unknown) {
  if (err instanceof StorageUnavailableError) return json({ error: err.message, code: "storage_unavailable" }, 503);
  console.error("[portal] unexpected error", err);
  return json({ error: "Something went wrong. Please try again." }, 500);
}

export async function body<T>(request: Request, maxBytes = 600_000): Promise<T | null> {
  const text = await request.text();
  if (text.length > maxBytes) return null;
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

/** Same-origin check for state-changing requests (defence against CSRF). */
export function sameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    const host = new URL(origin).host;
    return host === new URL(request.url).host || host === request.headers.get("x-forwarded-host");
  } catch {
    return false;
  }
}

/** Studio desk access: the superadmin always; everyone else only while the
    superadmin keeps their email authorised (revoking takes effect at once). */
export async function deskAllowed(account: PortalAccount): Promise<boolean> {
  if (account.role === "client" || account.superadmin) return true;
  const access = await getAccess(account.email);
  return !!access && access.active && access.role === account.role;
}

export async function requireSuperadmin(): Promise<PortalAccount | NextResponse> {
  const me = await requireRole("owner");
  if (me instanceof NextResponse) return me;
  if (!me.superadmin) return json({ error: "Only the superadmin can manage desk access." }, 403);
  return me;
}
