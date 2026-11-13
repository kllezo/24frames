/* ============================================================
   Demo logins for the client & studio portal — LOCAL ONLY.
   ------------------------------------------------------------
   Run:   npm run seed:demo
   Then:  npm run dev  →  /account/login (clients) · /desk/login (studio)

   Creates a demo boss (superadmin), two relationship managers, three
   clients and quotations at different stages of the journey, in the
   local file store (.studio-data/portal-db.json, or STUDIO_DATA_DIR).

   It refuses to run against a database (DATABASE_URL / POSTGRES_URL) so
   these well-known passwords can never reach the live site.
   Every demo address ends in .test, a domain that can't receive mail.
   ============================================================ */

import { randomUUID } from "node:crypto";
import { DEFAULT_STUDIO_CONFIG, reviseConfig } from "@/lib/commission/defaults";
import { createDraft, createEvent } from "@/lib/commission/model";
import { prepareClientDraft } from "@/lib/portal/drafts";
import { hashPassword } from "@/lib/portal/password";
import { applyAction, type QuoteAction } from "@/lib/portal/workflow";
import {
  createAccount,
  findAccountByEmail,
  insertQuote,
  listQuotesForClient,
  mutateQuote,
  newQuoteReference,
  saveAccess,
  updateAccount,
} from "@/lib/portal/store";
import type { PortalAccount, PortalQuote } from "@/lib/portal/types";

/** One shared password for every demo account (local only). */
export const DEMO_PASSWORD = "Frames24-demo";

export const DEMO_ACCOUNTS = {
  boss: { email: "boss@demo.24frames.test", name: "Phani G (Demo Boss)", phone: "+91 90000 00000" },
  ananya: { email: "ananya@demo.24frames.test", name: "Ananya Rao", phone: "+91 90000 00001" },
  karthik: { email: "karthik@demo.24frames.test", name: "Karthik Varma", phone: "+91 90000 00002" },
  priya: { email: "priya@demo.24frames.test", name: "Priya Reddy", phone: "+91 90000 00011", location: "Hyderabad" },
  meera: { email: "meera@demo.24frames.test", name: "Meera Sharma", phone: "+91 90000 00012", location: "Bengaluru" },
  rohan: { email: "rohan@demo.24frames.test", name: "Rohan Kapoor", phone: "+91 90000 00013", location: "Vijayawada" },
} as const;

if (process.env.DATABASE_URL || process.env.POSTGRES_URL) {
  console.error("Refusing to seed demo logins into a database. Unset DATABASE_URL / POSTGRES_URL — demo accounts are for the local file store only.");
  process.exit(1);
}

const config = reviseConfig(DEFAULT_STUDIO_CONFIG);
const hash = await hashPassword(DEMO_PASSWORD);

async function account(
  key: keyof typeof DEMO_ACCOUNTS,
  role: PortalAccount["role"],
  extra: { superadmin?: boolean; managerId?: string | null } = {},
): Promise<PortalAccount> {
  const a = DEMO_ACCOUNTS[key];
  const existing = await findAccountByEmail(a.email);
  if (existing) return existing;
  const created = await createAccount({
    role,
    name: a.name,
    email: a.email,
    phone: a.phone,
    location: "location" in a ? a.location : "Hyderabad",
    superadmin: extra.superadmin,
    passwordHash: hash,
    createdBy: null,
  });
  return extra.managerId ? ((await updateAccount(created.id, { managerId: extra.managerId })) ?? created) : created;
}

const boss = await account("boss", "owner", { superadmin: true });
const ananya = await account("ananya", "sales");
const karthik = await account("karthik", "sales");
for (const rm of [ananya, karthik]) {
  await saveAccess({
    email: rm.email,
    name: rm.name,
    role: "sales",
    note: "Demo relationship manager",
    active: true,
    grantedBy: boss.name,
    grantedAt: new Date().toISOString(),
    revokedBy: null,
    revokedAt: null,
  });
}
const priya = await account("priya", "client", { managerId: ananya.id });
const meera = await account("meera", "client", { managerId: karthik.id });
const rohan = await account("rohan", "client", { managerId: ananya.id });

/* A believable wedding: occasions, crew, delivery and planning interests. */
function wedding(bride: string, groom: string, city: string, monthsAhead: number, events: string[], crew: Record<string, number>, planning: string[]) {
  const draft = createDraft(config);
  const day = new Date();
  day.setMonth(day.getMonth() + monthsAhead);
  const iso = (offset: number) => {
    const d = new Date(day);
    d.setDate(d.getDate() + offset);
    return d.toISOString().slice(0, 10);
  };
  draft.couple = { ...draft.couple, brideName: bride, groomName: groom, city, weddingDate: iso(events.length - 1), preferredContact: "whatsapp" };
  draft.events = events.map((type, i) =>
    createEvent(type, config, { date: iso(i), startTime: type === "wedding" ? "09:00" : "18:30", endTime: type === "wedding" ? "15:00" : "23:00", venue: type === "haldi" ? "Farmhouse, Moinabad" : "Taj Falaknuma Palace", location: city, guestCount: type === "wedding" ? 600 : 250 }),
  );
  draft.assignments = draft.events.flatMap((e) =>
    Object.entries(crew).map(([serviceId, quantity]) => ({ id: randomUUID(), eventId: e.id, serviceId, quantity, unitPriceOverride: null, overrideReason: "" })),
  );
  draft.planning = planning.length ? { services: planning, note: "We'd love a farmhouse for the Haldi." } : undefined;
  return prepareClientDraft(draft, config);
}

async function quotation(client: PortalAccount, manager: PortalAccount, built: ReturnType<typeof wedding>, steps: { by: PortalAccount; action: QuoteAction }[]) {
  if ((await listQuotesForClient(client.id)).length) return;
  const now = new Date().toISOString();
  const q: PortalQuote = {
    id: randomUUID(),
    reference: newQuoteReference(),
    clientId: client.id,
    clientName: client.name,
    clientEmail: client.email,
    clientPhone: client.phone,
    status: "draft",
    draft: built.draft,
    quote: built.quote,
    configVersion: config.version,
    finalPrice: null,
    salesNote: "",
    salesOwner: null,
    founderComment: "",
    decidedBy: null,
    decidedAt: null,
    history: [{ at: now, by: client.name, role: "client", action: "created" }],
    createdAt: now,
    updatedAt: now,
    managerId: manager.id,
    managerName: manager.name,
    attention: null,
    consultations: [],
    revision: 0,
    sharedRevision: 0,
    lastSharedAt: null,
  };
  await insertQuote(q);
  for (const s of steps) {
    const r = await mutateQuote(q.id, (cur) => applyAction(cur, s.action, s.by));
    if (r instanceof Error) throw r;
  }
}

const submit = (b: ReturnType<typeof wedding>): QuoteAction => ({ type: "submit", draft: b.draft, quote: b.quote, configVersion: config.version });

// Priya — just sent her quotation; a new notification waits on the desk.
const p = wedding("Priya", "Arjun", "Hyderabad", 4, ["haldi", "sangeet", "wedding", "reception"], { "candid-photographer": 2, "candid-videographer": 1, "traditional-photographer": 1 }, ["venues", "decor", "makeup"]);
await quotation(priya, ananya, p, [{ by: priya, action: submit(p) }]);

// Meera — composed with Karthik in the studio, priced, now with the boss for approval.
const m = wedding("Meera", "Siddharth", "Bengaluru", 6, ["engagement", "wedding", "reception"], { "candid-photographer": 2, "creative-cinematography": 1, "aerial-drone": 1 }, ["jewellery"]);
await quotation(meera, karthik, m, [
  { by: meera, action: submit(m) },
  { by: karthik, action: { type: "log_consultation", id: randomUUID(), mode: "studio", at: new Date().toISOString(), note: "Walked through the crew and delivery at the studio." } },
  { by: karthik, action: { type: "send_for_approval", finalPrice: Math.round(m.quote.grandTotal * 0.95), note: "Agreed 5% off for booking three events together." } },
]);

// Rohan — approved by the boss and shared; ready for him to accept.
const r = wedding("Ritika", "Rohan", "Vijayawada", 3, ["mehendi", "wedding"], { "candid-photographer": 1, "traditional-videographer": 1 }, []);
await quotation(rohan, ananya, r, [
  { by: rohan, action: submit(r) },
  { by: ananya, action: { type: "log_consultation", id: randomUUID(), mode: "video", at: new Date().toISOString(), note: "Zoom call with the family." } },
  { by: ananya, action: { type: "send_for_approval", finalPrice: r.quote.grandTotal, note: "Standard pricing." } },
  { by: boss, action: { type: "approve", comment: "Looks good." } },
  { by: ananya, action: { type: "forward", note: "" } },
]);

console.log(`
Demo logins are ready (local file store only). Password for every account: see DEMO_PASSWORD in scripts/seed-portal-demo.mts

  Studio desk  →  /desk/login
    Boss (superadmin) ...... ${DEMO_ACCOUNTS.boss.email}
    Relationship manager ... ${DEMO_ACCOUNTS.ananya.email}
    Relationship manager ... ${DEMO_ACCOUNTS.karthik.email}

  Clients      →  /account/login
    New quotation sent ..... ${DEMO_ACCOUNTS.priya.email}
    Awaiting the boss ...... ${DEMO_ACCOUNTS.meera.email}
    Ready to accept ........ ${DEMO_ACCOUNTS.rohan.email}
`);
