import { getAccount, listAllQuotes, listClients, listQuotesForClient, listStaff, mutateQuote, updateAccount } from "@/lib/portal/store";
import { body, deskAllowed, json, portalError, requireRole, sameOrigin } from "@/lib/portal/guard";
import { applyAction } from "@/lib/portal/workflow";
import type { CrmClient } from "@/lib/portal/types";

/* The client CRM for the founder and sales: everyone who has signed up,
   how to reach them, who looks after them and where their latest
   quotation stands. */
export async function GET() {
  const me = await requireRole("owner", "sales");
  if (me instanceof Response) return me;
  try {
    const [clients, quotes, staff] = await Promise.all([listClients(), listAllQuotes(), listStaff()]);
    const names = new Map(staff.map((s) => [s.id, s.name]));
    const rows: CrmClient[] = clients.map((c) => {
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
      };
    });
    return json({ clients: rows });
  } catch (err) {
    return portalError(err);
  }
}

/* Assign (or clear) a client's relationship manager — applies to the
   client's account and every quotation they have. */
export async function PATCH(request: Request) {
  if (!sameOrigin(request)) return json({ error: "Not allowed." }, 403);
  const me = await requireRole("owner", "sales");
  if (me instanceof Response) return me;
  const b = await body<{ clientId?: string; managerId?: string | null }>(request, 2000);
  if (!b?.clientId) return json({ error: "Missing client." }, 400);
  try {
    const client = await getAccount(b.clientId);
    if (!client || client.role !== "client") return json({ error: "Client not found." }, 404);
    let managerName: string | null = null;
    const managerId = b.managerId || null;
    if (managerId) {
      const m = await getAccount(managerId);
      if (!m || !m.active || m.role === "client" || !(await deskAllowed(m))) return json({ error: "Choose an active team member." }, 422);
      managerName = m.name;
    }
    await updateAccount(client.id, { managerId });
    for (const q of await listQuotesForClient(client.id)) {
      await mutateQuote(q.id, (cur) => applyAction(cur, { type: "assign", managerId, managerName }, me));
    }
    return json({ ok: true, managerId, managerName });
  } catch (err) {
    return portalError(err);
  }
}
