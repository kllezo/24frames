import { body, json, portalError, requireSuperadmin, sameOrigin } from "@/lib/portal/guard";
import {
  createAccount,
  DuplicateEmailError,
  findAccountByEmail,
  getAccess,
  getAccount,
  listAccess,
  listAllQuotes,
  listClients,
  listDocs,
  listStaff,
  saveAccess,
  updateAccount,
} from "@/lib/portal/store";
import { hashPassword, passwordProblem } from "@/lib/portal/password";
import { getSettings, saveSettings } from "@/lib/portal/settings";
import { repStats } from "@/lib/portal/metrics";
import { notify } from "@/lib/portal/notify";
import { coupleNames } from "@/lib/commission/model";
import { CONSULT_LABEL, type FollowUp, type SalesSettings } from "@/lib/portal/types";

/* Superadmin controls: the team, their permissions, targets and
   commission, what everyone has been doing, and every conversation and
   note across the book. */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function GET() {
  const me = await requireSuperadmin();
  if (me instanceof Response) return me;
  const today = new Date().toISOString().slice(0, 10);
  try {
    const [staff, access, quotes, clients, followups, settings] = await Promise.all([
      listStaff(),
      listAccess(),
      listAllQuotes(),
      listClients(),
      listDocs<FollowUp>("followup"),
      getSettings(),
    ]);
    const accessBy = new Map(access.map((a) => [a.email, a]));
    const team = staff
      .filter((s) => !s.superadmin)
      .map((s) => ({
        id: s.id,
        name: s.name,
        email: s.email,
        phone: s.phone,
        role: s.role,
        active: s.active && (accessBy.get(s.email)?.active ?? false),
        seeAllLeads: !!s.seeAllLeads,
        lastLoginAt: s.lastLoginAt,
        createdAt: s.createdAt,
        stats: repStats(s.id, s.name, quotes, clients, followups, settings, today),
      }));
    const pending = access
      .filter((a) => a.active && !staff.some((s) => s.email === a.email))
      .map((a) => ({ email: a.email, name: a.name, role: a.role, grantedAt: a.grantedAt }));

    const couple = (q: (typeof quotes)[number]) => coupleNames(q.draft.couple, q.clientName);
    const activity = quotes
      .flatMap((q) => q.history.map((h) => ({ ...h, quoteId: q.id, reference: q.reference, couple: couple(q) })))
      .filter((h) => h.role !== "client")
      .sort((a, b) => b.at.localeCompare(a.at))
      .slice(0, 150);

    const conversations = [
      ...quotes.flatMap((q) =>
        (q.consultations ?? []).map((c) => ({ at: c.at, by: c.by, kind: CONSULT_LABEL[c.mode], text: c.note, quoteId: q.id, reference: q.reference, couple: couple(q) })),
      ),
      ...quotes.filter((q) => q.salesNote).map((q) => ({ at: q.updatedAt, by: q.salesOwner ?? "Sales", kind: "Note for the founder", text: q.salesNote, quoteId: q.id, reference: q.reference, couple: couple(q) })),
      ...quotes.filter((q) => q.founderComment).map((q) => ({ at: q.decidedAt ?? q.updatedAt, by: q.decidedBy ?? "Founder", kind: "Founder's comment", text: q.founderComment, quoteId: q.id, reference: q.reference, couple: couple(q) })),
      ...quotes.flatMap((q) =>
        q.history
          .filter((h) => (h.action === "change_requested" || h.action === "update_shared" || h.action === "lost") && h.note)
          .map((h) => ({ at: h.at, by: h.by, kind: h.action === "lost" ? "Lost enquiry" : "Client message", text: h.note ?? "", quoteId: q.id, reference: q.reference, couple: couple(q) })),
      ),
      ...followups.filter((f) => f.note).map((f) => ({ at: f.createdAt, by: f.ownerName, kind: `Follow-up (${f.kind}, due ${f.due})`, text: f.note, quoteId: f.quoteId, reference: "", couple: f.clientName })),
    ].sort((a, b) => b.at.localeCompare(a.at));

    const unassignedLeads = clients
      .filter((c) => !c.managerId)
      .map((c) => ({ id: c.id, name: c.name, phone: c.phone, location: c.location, createdAt: c.createdAt }));

    return json({ team, pending, settings, activity, conversations, unassignedLeads });
  } catch (err) {
    return portalError(err);
  }
}

/* Create a sales (or founder-level) account with a temporary password. */
export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ error: "Not allowed." }, 403);
  const me = await requireSuperadmin();
  if (me instanceof Response) return me;
  const b = await body<{ name?: string; email?: string; phone?: string; password?: string; role?: string }>(request, 4000);
  const email = (b?.email ?? "").trim().toLowerCase();
  const name = (b?.name ?? "").trim();
  const role = b?.role === "owner" ? "owner" : "sales";
  if (name.length < 2) return json({ error: "Enter their name." }, 422);
  if (!EMAIL.test(email)) return json({ error: "Enter a valid email address." }, 422);
  const problem = passwordProblem(b?.password ?? "");
  if (problem) return json({ error: problem }, 422);
  try {
    if (await findAccountByEmail(email)) return json({ error: "An account with this email already exists." }, 409);
    await saveAccess({ email, name, role, note: "Created by the superadmin", active: true, grantedBy: me.name, grantedAt: new Date().toISOString(), revokedBy: null, revokedAt: null });
    const account = await createAccount({ role, name, email, phone: (b?.phone ?? "").trim(), passwordHash: await hashPassword(b!.password!), createdBy: me.id });
    await updateAccount(account.id, { lastLoginAt: null });
    return json({ ok: true, id: account.id }, 201);
  } catch (err) {
    if (err instanceof DuplicateEmailError) return json({ error: "An account with this email already exists." }, 409);
    return portalError(err);
  }
}

/* Activate / deactivate a team member, or change what they may see. */
export async function PATCH(request: Request) {
  if (!sameOrigin(request)) return json({ error: "Not allowed." }, 403);
  const me = await requireSuperadmin();
  if (me instanceof Response) return me;
  const b = await body<{ id?: string; active?: boolean; seeAllLeads?: boolean }>(request, 2000);
  if (!b?.id) return json({ error: "Missing team member." }, 400);
  try {
    const acc = await getAccount(b.id);
    if (!acc || acc.role === "client" || acc.superadmin) return json({ error: "Team member not found." }, 404);
    const patch: Record<string, unknown> = {};
    if (typeof b.seeAllLeads === "boolean") patch.seeAllLeads = b.seeAllLeads;
    if (typeof b.active === "boolean") {
      patch.active = b.active;
      const now = new Date().toISOString();
      const prev = await getAccess(acc.email);
      await saveAccess(
        b.active
          ? { email: acc.email, name: acc.name, role: acc.role as "sales" | "owner", note: prev?.note ?? "", active: true, grantedBy: me.name, grantedAt: now, revokedBy: null, revokedAt: null }
          : { email: acc.email, name: acc.name, role: acc.role as "sales" | "owner", note: prev?.note ?? "", active: false, grantedBy: prev?.grantedBy ?? me.name, grantedAt: prev?.grantedAt ?? now, revokedBy: me.name, revokedAt: now },
      );
    }
    const next = await updateAccount(acc.id, patch);
    return json({ ok: true, active: next?.active, seeAllLeads: !!next?.seeAllLeads });
  } catch (err) {
    return portalError(err);
  }
}

/* Targets and commission. */
export async function PUT(request: Request) {
  if (!sameOrigin(request)) return json({ error: "Not allowed." }, 403);
  const me = await requireSuperadmin();
  if (me instanceof Response) return me;
  const b = await body<Partial<SalesSettings>>(request, 20000);
  if (!b) return json({ error: "Missing settings." }, 400);
  const num = (v: unknown, max: number) => {
    const n = Number(v);
    return Number.isFinite(n) && n >= 0 && n <= max ? Math.round(n * 100) / 100 : null;
  };
  try {
    const cur = await getSettings();
    const targets: Record<string, number> = {};
    for (const [k, v] of Object.entries(b.targets ?? cur.targets)) {
      const n = num(v, 1_000_000_000);
      if (n) targets[k] = Math.round(n);
    }
    const overrides: Record<string, number> = {};
    for (const [k, v] of Object.entries(b.commissionOverrides ?? cur.commissionOverrides)) {
      if (v === null || String(v) === "") continue;
      const n = num(v, 50);
      if (n !== null) overrides[k] = n;
    }
    const next = await saveSettings({
      targets,
      commissionPct: num(b.commissionPct, 50) ?? cur.commissionPct,
      commissionOverrides: overrides,
      bonusPctAboveTarget: num(b.bonusPctAboveTarget, 50) ?? cur.bonusPctAboveTarget,
      updatedAt: new Date().toISOString(),
      updatedBy: me.name,
    });
    const changed = Object.keys(targets).filter((k) => targets[k] !== cur.targets[k]);
    for (const id of changed) {
      await notify([id], "target", `${me.name} set your monthly target to ₹${targets[id].toLocaleString("en-IN")}.`);
    }
    return json({ settings: next });
  } catch (err) {
    return portalError(err);
  }
}
