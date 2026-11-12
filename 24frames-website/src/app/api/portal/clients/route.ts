import { listAllQuotes, listClients } from "@/lib/portal/store";
import { json, portalError, requireRole } from "@/lib/portal/guard";
import type { CrmClient } from "@/lib/portal/types";

/* The client CRM for the founder and sales: everyone who has signed up,
   how to reach them, and where their latest quotation stands. */
export async function GET() {
  const me = await requireRole("owner", "sales");
  if (me instanceof Response) return me;
  try {
    const [clients, quotes] = await Promise.all([listClients(), listAllQuotes()]);
    const rows: CrmClient[] = clients.map((c) => {
      const mine = quotes.filter((q) => q.clientId === c.id);
      const latest = mine[0] ?? null;
      return {
        id: c.id,
        name: c.name,
        email: c.email,
        phone: c.phone,
        location: c.location ?? "",
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
