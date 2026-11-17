import { json, leadVisible, portalError, requireRole } from "@/lib/portal/guard";
import { listAllQuotes, listClients, listDocs, listStaff } from "@/lib/portal/store";
import { getSettings } from "@/lib/portal/settings";
import { bookedAt, bookingValue, isBooked, lastMonths, repStats, studioAnalytics } from "@/lib/portal/metrics";
import { coupleNames } from "@/lib/commission/model";
import { CONSULT_LABEL, STATUS_LABEL, type FollowUp } from "@/lib/portal/types";

/* GET ?scope=me      → the signed-in team member's own dashboard
   GET ?scope=studio  → superadmin-only analytics for the whole studio */
export async function GET(request: Request) {
  const me = await requireRole("owner", "sales");
  if (me instanceof Response) return me;
  const scope = new URL(request.url).searchParams.get("scope") ?? "me";
  const today = new Date().toISOString().slice(0, 10);
  try {
    const [quotes, clients, staff, followups, settings] = await Promise.all([
      listAllQuotes(),
      listClients(),
      listStaff(),
      listDocs<FollowUp>("followup"),
      getSettings(),
    ]);

    if (scope === "studio") {
      if (!me.superadmin) return json({ error: "Only the superadmin sees studio analytics." }, 403);
      return json({ analytics: studioAnalytics(quotes, clients, staff, followups, settings, today), settings });
    }

    const mineQ = quotes.filter((q) => q.managerId === me.id);
    const mineC = clients.filter((c) => c.managerId === me.id);
    const stats = repStats(me.id, me.name, quotes, clients, followups, settings, today);
    const myFollowups = followups.filter((f) => f.ownerId === me.id && !f.done).sort((a, b) => a.due.localeCompare(b.due));
    const couple = (q: (typeof quotes)[number]) => coupleNames(q.draft.couple, q.clientName);

    const consultationsToday = [
      ...mineQ.flatMap((q) =>
        (q.consultations ?? [])
          .filter((c) => c.at.slice(0, 10) === today)
          .map((c) => ({ id: c.id, at: c.at, title: couple(q), detail: `${CONSULT_LABEL[c.mode]}${c.note ? ` — ${c.note}` : ""}`, quoteId: q.id })),
      ),
      ...myFollowups
        .filter((f) => f.kind === "meeting" && f.due === today)
        .map((f) => ({ id: f.id, at: `${f.due}T09:00:00`, title: f.clientName, detail: `Meeting${f.note ? ` — ${f.note}` : ""}`, quoteId: f.quoteId })),
    ];

    const tasks = [
      ...mineQ.filter((q) => q.attention).map((q) => ({ id: `a-${q.id}`, quoteId: q.id, title: couple(q), detail: "New activity from the client — review it." })),
      ...mineQ
        .filter((q) => q.status === "submitted" && !q.lost && !q.attention)
        .map((q) => ({ id: `p-${q.id}`, quoteId: q.id, title: couple(q), detail: "Confirm with the client, set the price and send for approval." })),
      ...mineQ.filter((q) => q.status === "rejected").map((q) => ({ id: `r-${q.id}`, quoteId: q.id, title: couple(q), detail: "Returned by the founder — revise and resend." })),
      ...mineQ.filter((q) => q.status === "approved").map((q) => ({ id: `s-${q.id}`, quoteId: q.id, title: couple(q), detail: "Approved — share it with the client." })),
      ...myFollowups.filter((f) => f.due < today).map((f) => ({ id: `f-${f.id}`, quoteId: f.quoteId, title: f.clientName, detail: `Overdue ${f.kind} since ${f.due}${f.note ? ` — ${f.note}` : ""}` })),
    ];

    const months = lastMonths(6, today).map((m) => {
      const b = mineQ.filter((q) => isBooked(q) && bookedAt(q).slice(0, 7) === m);
      return { month: m, value: b.reduce((s, q) => s + bookingValue(q), 0), count: b.length };
    });

    const row = (q: (typeof quotes)[number]) => ({
      id: q.id,
      reference: q.reference,
      couple: couple(q),
      status: STATUS_LABEL[q.status],
      statusId: q.status,
      value: bookingValue(q),
      updatedAt: q.updatedAt,
      lost: !!q.lost,
    });

    return json({
      stats,
      leads: mineC
        .map((c) => {
          const latest = mineQ.filter((q) => q.clientId === c.id)[0];
          return { id: c.id, name: c.name, phone: c.phone, location: c.location, createdAt: c.createdAt, latest: latest ? row(latest) : null };
        })
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
      unassigned: me.role === "sales" ? clients.filter((c) => !c.managerId && leadVisible(me, c.managerId)).length : 0,
      followups: myFollowups,
      consultationsToday,
      proposals: mineQ.filter((q) => q.status !== "draft" && q.status !== "accepted" && !q.lost).map(row),
      bookings: mineQ.filter(isBooked).map((q) => ({ ...row(q), bookedAt: bookedAt(q), production: q.production?.status ?? null })),
      months,
      tasks,
    });
  } catch (err) {
    return portalError(err);
  }
}
