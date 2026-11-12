import { findAccountByEmail, getAccess, listAccess, normaliseEmail, saveAccess } from "@/lib/portal/store";
import { body, json, portalError, requireSuperadmin, sameOrigin } from "@/lib/portal/guard";
import type { StaffAccess } from "@/lib/portal/types";

/* Desk access is an allowlist the superadmin (the founder) controls.
   Only authorised emails can activate a desk account or sign in to it;
   revoking an email signs that person out on their next request. */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

async function withAccount(a: StaffAccess) {
  const acc = await findAccountByEmail(a.email);
  return {
    ...a,
    account: acc
      ? { name: acc.name, phone: acc.phone, createdAt: acc.createdAt, lastLoginAt: acc.lastLoginAt, role: acc.role }
      : null,
  };
}

export async function GET() {
  const me = await requireSuperadmin();
  if (me instanceof Response) return me;
  try {
    return json({ access: await Promise.all((await listAccess()).map(withAccount)) });
  } catch (err) {
    return portalError(err);
  }
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ error: "Not allowed." }, 403);
  const me = await requireSuperadmin();
  if (me instanceof Response) return me;
  const b = await body<{ email?: string; name?: string; role?: string; note?: string }>(request, 4000);
  const email = normaliseEmail(b?.email ?? "");
  const name = (b?.name ?? "").trim().slice(0, 80);
  if (!EMAIL.test(email)) return json({ error: "Enter a valid email address." }, 422);
  if (name.length < 2) return json({ error: "Enter their name." }, 422);
  if (email === me.email) return json({ error: "That is your own superadmin email." }, 409);
  try {
    const existing = await findAccountByEmail(email);
    if (existing?.role === "client") return json({ error: "This email belongs to a client account. Use a different email for desk access." }, 409);
    const role = b?.role === "owner" ? "owner" : "sales";
    if (existing && existing.role !== role) return json({ error: `This person already has a ${existing.role} account — keep the same level.` }, 409);
    const prev = await getAccess(email);
    const entry = await saveAccess({
      email,
      name,
      role,
      note: (b?.note ?? "").trim().slice(0, 300),
      active: true,
      grantedBy: me.name,
      grantedAt: prev?.grantedAt && prev.active ? prev.grantedAt : new Date().toISOString(),
      revokedBy: null,
      revokedAt: null,
    });
    return json({ entry: await withAccount(entry) }, 201);
  } catch (err) {
    return portalError(err);
  }
}

export async function PATCH(request: Request) {
  if (!sameOrigin(request)) return json({ error: "Not allowed." }, 403);
  const me = await requireSuperadmin();
  if (me instanceof Response) return me;
  const b = await body<{ email?: string; active?: boolean }>(request, 2000);
  if (!b?.email || typeof b.active !== "boolean") return json({ error: "Missing details." }, 400);
  try {
    const prev = await getAccess(b.email);
    if (!prev) return json({ error: "That email isn't on the access list." }, 404);
    const now = new Date().toISOString();
    const entry = await saveAccess(
      b.active
        ? { ...prev, active: true, revokedBy: null, revokedAt: null, grantedBy: me.name, grantedAt: now }
        : { ...prev, active: false, revokedBy: me.name, revokedAt: now },
    );
    return json({ entry: await withAccount(entry) });
  } catch (err) {
    return portalError(err);
  }
}
