import { randomUUID } from "node:crypto";
import { getConfig } from "@/lib/studio/server/repository";
import { createDraft } from "@/lib/commission/model";
import { getAccount, insertQuote, listAllQuotes, listQuotesForClient, managerCard, newQuoteReference } from "@/lib/portal/store";
import { json, portalError, requireRole, sameOrigin } from "@/lib/portal/guard";
import { prepareClientDraft } from "@/lib/portal/drafts";
import { forClient, type PortalQuote } from "@/lib/portal/types";

export async function GET() {
  const me = await requireRole();
  if (me instanceof Response) return me;
  try {
    if (me.role === "client") {
      const manager = await managerCard(me.managerId);
      return json({ quotes: (await listQuotesForClient(me.id)).map((q) => forClient(q, manager)) });
    }
    return json({ quotes: await listAllQuotes() });
  } catch (err) {
    return portalError(err);
  }
}

/* A client begins a new quotation. */
export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ error: "Not allowed." }, 403);
  const me = await requireRole("client");
  if (me instanceof Response) return me;
  try {
    const existing = await listQuotesForClient(me.id);
    if (existing.filter((q) => q.status === "draft").length >= 10) {
      return json({ error: "You have several quotations in progress — please continue one of those." }, 429);
    }
    const { config } = await getConfig();
    const blank = createDraft(config);
    blank.couple = { ...blank.couple, phone: me.phone, email: me.email };
    const { draft, quote } = prepareClientDraft(blank, config);
    const now = new Date().toISOString();
    const manager = me.managerId ? await getAccount(me.managerId) : null;
    const q: PortalQuote = {
      id: randomUUID(),
      reference: newQuoteReference(new Set(existing.map((x) => x.reference))),
      clientId: me.id,
      clientName: me.name,
      clientEmail: me.email,
      clientPhone: me.phone,
      status: "draft",
      draft,
      quote,
      configVersion: config.version,
      finalPrice: null,
      salesNote: "",
      salesOwner: null,
      founderComment: "",
      decidedBy: null,
      decidedAt: null,
      history: [{ at: now, by: me.name, role: "client", action: "created" }],
      createdAt: now,
      updatedAt: now,
      managerId: manager?.id ?? null,
      managerName: manager?.name ?? null,
      attention: null,
      consultations: [],
      revision: 0,
      sharedRevision: 0,
      lastSharedAt: null,
    };
    await insertQuote(q);
    return json({ id: q.id }, 201);
  } catch (err) {
    return portalError(err);
  }
}
