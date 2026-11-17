import { randomBytes, randomUUID } from "node:crypto";
import { body, deskAllowed, json, portalError, sameOrigin } from "@/lib/portal/guard";
import { createAccount, findAccountByEmail, listClients, listStaff, putDoc, updateAccount } from "@/lib/portal/store";
import { hashPassword } from "@/lib/portal/password";
import { notify } from "@/lib/portal/notify";
import type { EnquiryBrief, FollowUp, PortalAccount } from "@/lib/portal/types";

/* The website enquiry form → a new lead on the studio desk.
   The couple becomes a client record (they set a password if they later
   sign up with the same email), a relationship manager is assigned —
   whoever on the sales team has the lightest book — and a short brief of
   everything they chose is written for that manager to read before the
   first call. Public endpoint, throttled per address. */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const hits = new Map<string, number[]>();
const clientKey = (r: Request) => r.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || r.headers.get("x-real-ip") || "local";

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const list = (v: unknown, max: number) => (Array.isArray(v) ? v.map((x) => str(x, 80)).filter(Boolean).slice(0, max) : []);

function summarise(name: string, e: Omit<EnquiryBrief, "summary" | "at">) {
  const dated = e.events.filter((x) => x.date).map((x) => x.date).sort();
  const cities = Array.from(new Set(e.events.map((x) => x.city).filter(Boolean)));
  const parts = [
    `${name} enquired about ${e.category.toLowerCase()}`,
    e.events.length ? `${e.events.length} occasion${e.events.length === 1 ? "" : "s"}${dated[0] ? ` from ${dated[0]}` : ""}${cities.length ? ` in ${cities.join(", ")}` : ""}` : "",
    e.scale ? `${e.scale.toLowerCase()} scale` : "",
    e.investment ? `budget ${e.investment}` : "",
  ].filter(Boolean);
  const likes = [e.directions.length ? `drawn to ${e.directions.join(", ")}` : "", e.services.length ? `asked for ${e.services.join(", ")}` : ""].filter(Boolean);
  return `${parts.join(" · ")}.${likes.length ? ` They are ${likes.join(" and ")}.` : ""}${e.notes ? ` Notes: “${e.notes}”` : ""}`;
}

/** The active salesperson with the fewest leads (founder if nobody else). */
async function pickManager(): Promise<PortalAccount | null> {
  const staff: PortalAccount[] = [];
  for (const s of await listStaff()) if (s.active && (await deskAllowed(s))) staff.push(s);
  const sales = staff.filter((s) => s.role === "sales");
  const pool = sales.length ? sales : staff;
  if (!pool.length) return null;
  const clients = await listClients();
  const load = (id: string) => clients.filter((c) => c.managerId === id).length;
  return [...pool].sort((a, b) => load(a.id) - load(b.id) || a.createdAt.localeCompare(b.createdAt))[0];
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ error: "Not allowed." }, 403);
  const key = clientKey(request);
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < 60 * 60 * 1000);
  if (recent.length >= 6) return json({ error: "Too many enquiries — please try again later." }, 429);
  hits.set(key, [...recent, now]);

  const b = await body<Record<string, unknown>>(request, 20000);
  const name = str(b?.name, 80);
  const email = str(b?.email, 120).toLowerCase();
  const phone = str(b?.phone, 30);
  if (name.length < 2 || !EMAIL.test(email) || phone.length < 6) return json({ error: "Please add your name, email and phone." }, 422);

  const events = (Array.isArray(b?.events) ? b!.events : []).slice(0, 12).map((x) => {
    const o = (x ?? {}) as Record<string, unknown>;
    return { name: str(o.name, 80), date: str(o.date, 20), city: str(o.city, 60), venue: str(o.venue, 100) };
  });
  const base = {
    category: str(b?.category, 80) || "Weddings & Celebrations",
    events,
    directions: list(b?.directions, 10),
    services: list(b?.services, 12),
    scale: str(b?.scale, 60),
    investment: str(b?.investment, 60),
    notes: [str(b?.projectScope, 600), str(b?.inspiration, 600)].filter(Boolean).join(" — "),
    memories: str(b?.memories, 600),
  };
  const enquiry: EnquiryBrief = { ...base, at: new Date().toISOString(), summary: summarise(name, base) };

  try {
    let client = await findAccountByEmail(email);
    if (client && client.role !== "client") return json({ ok: true }); // a team member testing — nothing to file
    if (!client) {
      client = await createAccount({
        role: "client",
        name,
        email,
        phone,
        location: events.find((e) => e.city)?.city ?? "",
        // No one can sign in with this until the couple sets their own password at sign-up.
        passwordHash: await hashPassword(randomBytes(24).toString("base64url")),
        createdBy: null,
      });
      client = (await updateAccount(client.id, { lastLoginAt: null, pendingSignup: true, source: "enquiry" })) ?? client;
    }
    let manager = client.managerId ? null : await pickManager();
    if (client.managerId) manager = null;
    client = (await updateAccount(client.id, { enquiry, ...(manager ? { managerId: manager.id } : {}) })) ?? client;

    const owners = (await listStaff()).filter((s) => s.role === "owner" && s.active);
    const managerId = client.managerId ?? null;
    if (managerId) {
      await notify([managerId], "enquiry", `New website enquiry from ${name} — assigned to you. ${enquiry.summary}`.slice(0, 400), { clientId: client.id });
      const f: FollowUp = {
        id: randomUUID(),
        ownerId: managerId,
        ownerName: manager?.name ?? "",
        clientId: client.id,
        clientName: name,
        quoteId: null,
        kind: "call",
        due: new Date().toISOString().slice(0, 10),
        note: "First call — new website enquiry. Read their brief before calling.",
        done: false,
        doneAt: null,
        createdAt: new Date().toISOString(),
      };
      await putDoc("followup", f);
    }
    await notify(
      owners.map((o) => o.id).filter((id) => id !== managerId),
      "enquiry",
      `New website enquiry from ${name}${manager ? ` — assigned to ${manager.name}` : ""}.`,
      { clientId: client.id },
    );
    return json({ ok: true }, 201);
  } catch (err) {
    return portalError(err);
  }
}
