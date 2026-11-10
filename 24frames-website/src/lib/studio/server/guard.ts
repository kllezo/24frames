/* Route-handler guard: re-verifies the studio session (defence in depth —
   the proxy already checks, but handlers never trust that alone). */

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE, SESSION_COOKIE, sessionSecret, verifyAdmin, verifySession, type StudioSession } from "@/lib/studio/session";
import { StorageUnavailableError } from "./repository";

export async function requireStudio(): Promise<StudioSession | NextResponse> {
  const secret = sessionSecret();
  if (!secret) {
    return NextResponse.json({ error: "Studio access is not configured on this server." }, { status: 503 });
  }
  const store = await cookies();
  const session = await verifySession(store.get(SESSION_COOKIE)?.value, secret);
  if (!session) return NextResponse.json({ error: "Studio session expired. Sign in again." }, { status: 401 });
  return session;
}

/** Session plus a fresh admin PIN confirmation (the studio admin). */
export async function requireAdmin(): Promise<StudioSession | NextResponse> {
  const session = await requireStudio();
  if (session instanceof NextResponse) return session;
  const store = await cookies();
  if (!(await verifyAdmin(store.get(ADMIN_COOKIE)?.value, sessionSecret()!))) {
    return NextResponse.json({ error: "Confirm the studio PIN to use the admin.", code: "admin_required" }, { status: 403 });
  }
  return session;
}

export function noStore(res: NextResponse) {
  res.headers.set("Cache-Control", "no-store, max-age=0");
  return res;
}

export function storageError(err: unknown) {
  if (err instanceof StorageUnavailableError) {
    return noStore(NextResponse.json({ error: err.message, code: "storage_unavailable" }, { status: 503 }));
  }
  console.error("[studio] unexpected error", err);
  return noStore(NextResponse.json({ error: "Something went wrong on the studio server." }, { status: 500 }));
}

export async function readJson<T>(request: Request, maxBytes = 512_000): Promise<T | null> {
  const text = await request.text();
  if (text.length > maxBytes) return null;
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}
