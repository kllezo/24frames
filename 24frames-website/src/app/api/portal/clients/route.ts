import { getAccount, listAllQuotes, listClients, listQuotesForClient, listStaff, mutateQuote, updateAccount } from "@/lib/portal/store";
import { body, deskAllowed, json, leadVisible, portalError, requireRole, sameOrigin } from "@/lib/portal/guard";
import { applyAction } from "@/lib/portal/workflow";
import { notify } from "@/lib/portal/notify";
import { cleanFactor, factorLabel } from "@/lib/portal/pricing";
import { SOURCE_LABEL, type CrmClient, type LeadSource } from "@/lib/portal/types";

/* The client CRM for the founder and sales: everyone who has signed up,
   how to reach them, who looks after them and where their latest
   quotation stands. A salesperson only sees their own (and unassigned)
   leads unless the superadmin lets them see the whole book. */
export async function GET() {
  const me = await requireRole("owner", "sales");
  if (me instanceof Response) return me;
  try {
    const [clients, quotes, staff] = await Promise.all([listClients(), listAllQuotes(), listStaff()]);
    const names = new Map(staff.map((s) => [s.id, s.name]));
    const rows: CrmClient[] = clients
      .filter((c) => leadVisible(me, c.managerId))
      .map((c) => {
        const mine = quotes.filter((q) => q.clientId === c.id);
        const latest = mine[0] ?? null;
        return {
          id: c.id,
          name: c.name,
          email: c.email,
          phone: c.phone,
          location: c.location ?? "",
          managerId: c.managerId ?? null,
          managerName: c.managerId ? names.get(c.managerId) ?? null : null,
          createdAt: c.createdAt,
          lastLoginAt: c.lastLoginAt,
          quotes: mine.length,
          latestStatus: latest?.status ?? null,
          latestReference: latest?.reference ?? null,
          latestValue: latest ? latest.finalPrice ?? latest.quote.grandTotal : null,
          latestUpdatedAt: latest?.updatedAt ?? null,
          source: c.source ?? (c.createdBy ? "rm_link" : "website"),
          priceFactor: c.priceFactor ?? null,
          priceOverrides: c.priceOverrides ?? null,
          enquiry: c.enquiry ?? null,
        };
      });
    return json({ clients: rows });
  } catch (err) {
    return portalError(err);
  }
}

/* Changes to a client:
   · managerId   — only the founder (re)assigns a relationship manager; the
                   team members involved are notified.
   · priceFactor — a custom rate card (founder, or the client's own manager).
   · source      — where the enquiry came from.                              */
export async function PATCH(request: Request) {
  if (!sameOrigin(request)) return json({ error: "Not allowed." }, 403);
  const me = await requireRole("owner", "sales");
  if (me instanceof Response) return me;
  const b = await body<{ clientId?: string; managerId?: string | null; priceFactor?: number | null; source?: string }>(request, 2000);
  if (!b?.clientId) return json({ error: "Missing client." }, 400);
  try {
    const client = await getAccount(b.clientId);
    if (!client || client.role !== "client" || !leadVisible(me, client.managerId)) return json({ error: "Client not found." }, 404);

    if (b.source !== undefined) {
      if (!Object.hasOwn(SOURCE_LABEL, String(b.source))) return json({ error: "Choose a lead source." }, 422);
      if (me.role !== "owner" && client.managerId !== me.id) return json({ error: "Only this client's manager can change that." }, 403);
      await updateAccount(client.id, { source: b.source as LeadSource });
      return json({ ok: true, source: b.source });
    }

    if (b.priceFactor !== undefined) {
      if (me.role !== "owner" && client.managerId !== me.id) return json({ error: "Only the founder or this client's manager can set custom rates." }, 403);
      const factor = b.priceFactor === null ? null : cleanFactor(b.priceFactor);
      /* Removing custom rates also clears any exact prices set through a link. */
      const patch = b.priceFactor === null ? { priceFactor: null, priceOverrides: null } : { priceFactor: factor };
      await updateAccount(client.id, patch);
      return json({ ok: true, priceFactor: factor, priceOverrides: b.priceFactor === null ? null : client.priceOverrides ?? null, label: factorLabel(factor) });
    }

    if (b.managerId === undefined) return json({ error: "Nothing to change." }, 400);
    if (me.role !== "owner") return json({ error: "Only the founder can change a client's relationship manager." }, 403);
    let managerName: string | null = null;
    const managerId = b.managerId || null;
    if (managerId) {
      const m = await getAccount(managerId);
      if (!m || !m.active || m.role === "client" || !(await deskAllowed(m))) return json({ error: "Choose an active team member." }, 422);
      managerName = m.name;
    }
    const previous = client.managerId ?? null;
    if (previous === managerId) return json({ ok: true, managerId, managerName });
    await updateAccount(client.id, { managerId });
    const quotes = await listQuotesForClient(client.id);
    for (const q of quotes) {
      await mutateQuote(q.id, (cur) => applyAction(cur, { type: "assign", managerId, managerName }, me));
    }
    const ref = { clientId: client.id, quoteId: quotes[0]?.id ?? null };
    if (managerId && managerId !== me.id) {
      await notify([managerId], "lead_assigned", `${me.name} assigned ${client.name} to you as their relationship manager.`, ref);
    }
    if (previous && previous !== me.id) {
      await notify([previous], "lead_removed", `${me.name} moved ${client.name} to ${managerName ?? "no relationship manager"}.`, ref);
    }
    // The rest of the sales team hears about it too — but only those allowed
    // to see other people's leads, so a private lead stays private.
    const others = (await listStaff()).filter(
      (s) => s.active && s.role === "sales" && s.seeAllLeads && s.id !== managerId && s.id !== previous && s.id !== me.id,
    );
    await notify(
      others.map((s) => s.id),
      "rm_changed",
      `${me.name} changed ${client.name}'s relationship manager to ${managerName ?? "nobody"}.`,
      ref,
    );
    return json({ ok: true, managerId, managerName });
  } catch (err) {
    return portalError(err);
  }
}
