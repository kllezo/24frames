/* Sales and studio metrics, computed from quotations, clients and
   follow-ups — nothing is entered twice. Pure functions, server side. */

import { coupleNames } from "@/lib/commission/model";
import {
  LOST_LABEL,
  SOURCE_LABEL,
  type FollowUp,
  type LeadSource,
  type LostReason,
  type PortalAccount,
  type PortalQuote,
  type SalesSettings,
} from "./types";

export const bookingValue = (q: PortalQuote) => q.finalPrice ?? q.quote.grandTotal;
export const isBooked = (q: PortalQuote) => q.status === "accepted";
export const bookedAt = (q: PortalQuote) =>
  q.bookedAt ?? [...q.history].reverse().find((h) => h.action === "accepted" || h.action === "booked")?.at ?? q.updatedAt;
export const paid = (q: PortalQuote) => (q.payments ?? []).reduce((s, p) => s + p.amount, 0);
export const sourceOf = (c: PortalAccount): LeadSource => c.source ?? (c.createdBy ? "rm_link" : "website");
const pct = (a: number, b: number) => (b ? Math.round((a / b) * 1000) / 10 : 0);
const month = (iso: string) => iso.slice(0, 7);

function firstDate(q: PortalQuote) {
  const d = q.draft.events.map((e) => e.date).filter(Boolean).sort();
  return d[0] || q.draft.couple.weddingDate || "";
}

export function lastMonths(n: number, today: string) {
  const out: string[] = [];
  const d = new Date(`${today.slice(0, 7)}-01T00:00:00Z`);
  for (let i = n - 1; i >= 0; i--) {
    const t = new Date(d);
    t.setUTCMonth(d.getUTCMonth() - i);
    out.push(t.toISOString().slice(0, 7));
  }
  return out;
}

/** Commission on one month's booked value for one person. */
export function commissionFor(personId: string, monthValue: number, settings: SalesSettings) {
  const rate = settings.commissionOverrides[personId] ?? settings.commissionPct;
  const target = settings.targets[personId] ?? 0;
  const base = (monthValue * rate) / 100;
  const bonus = target > 0 && monthValue > target ? ((monthValue - target) * settings.bonusPctAboveTarget) / 100 : 0;
  return { rate, target, base: Math.round(base), bonus: Math.round(bonus), total: Math.round(base + bonus) };
}

export interface RepStats {
  id: string;
  name: string;
  leads: number;
  enquiries: number;
  proposals: number;
  bookings: number;
  lost: number;
  revenueThisMonth: number;
  bookingsThisMonth: number;
  revenueTotal: number;
  conversion: number;
  target: number;
  targetProgress: number;
  commission: ReturnType<typeof commissionFor>;
  followupsOpen: number;
  followupsOverdue: number;
  lastActive: string | null;
  activity30: number;
}

/** One person's book — or the whole studio when `id` is null. */
export function repStats(
  id: string | null,
  name: string,
  quotes: PortalQuote[],
  clients: PortalAccount[],
  followups: FollowUp[],
  settings: SalesSettings,
  today: string,
): RepStats {
  const mineQ = id ? quotes.filter((q) => q.managerId === id) : quotes;
  const mineC = id ? clients.filter((c) => c.managerId === id) : clients;
  const enquiryClients = new Set(mineQ.filter((q) => q.status !== "draft").map((q) => q.clientId));
  const bookedClients = new Set(mineQ.filter(isBooked).map((q) => q.clientId));
  const booked = mineQ.filter(isBooked);
  const thisMonth = booked.filter((q) => month(bookedAt(q)) === month(today));
  const revenueThisMonth = thisMonth.reduce((s, q) => s + bookingValue(q), 0);
  const fu = id ? followups.filter((f) => f.ownerId === id) : followups;
  const since = new Date(Date.parse(`${today}T00:00:00Z`) - 30 * 86400000).toISOString();
  const acts = id
    ? quotes.flatMap((q) => q.history).filter((h) => h.role !== "client" && h.by === name)
    : quotes.flatMap((q) => q.history).filter((h) => h.role !== "client");
  const target = id ? settings.targets[id] ?? 0 : Object.values(settings.targets).reduce((a, b) => a + b, 0);
  return {
    id: id ?? "all",
    name,
    leads: mineC.length,
    enquiries: enquiryClients.size,
    proposals: mineQ.filter((q) => q.status !== "draft").length,
    bookings: booked.length,
    lost: mineQ.filter((q) => q.lost).length,
    revenueThisMonth,
    bookingsThisMonth: thisMonth.length,
    revenueTotal: booked.reduce((s, q) => s + bookingValue(q), 0),
    conversion: pct(bookedClients.size, enquiryClients.size),
    target,
    targetProgress: pct(revenueThisMonth, target),
    commission: commissionFor(id ?? "all", revenueThisMonth, settings),
    followupsOpen: fu.filter((f) => !f.done).length,
    followupsOverdue: fu.filter((f) => !f.done && f.due < today).length,
    lastActive: acts.map((a) => a.at).sort().pop() ?? null,
    activity30: acts.filter((a) => a.at >= since).length,
  };
}

/** Superadmin analytics for the whole studio. */
export function studioAnalytics(
  quotes: PortalQuote[],
  clients: PortalAccount[],
  staff: PortalAccount[],
  followups: FollowUp[],
  settings: SalesSettings,
  today: string,
) {
  const booked = quotes.filter(isBooked);
  const months = lastMonths(12, today);

  const revenueByMonth = months.map((m) => {
    const inMonth = booked.filter((q) => month(bookedAt(q)) === m);
    return { month: m, value: inMonth.reduce((s, q) => s + bookingValue(q), 0), count: inMonth.length };
  });

  // The superadmin isn't part of the sales team's league table.
  const team = staff.filter((s) => s.role !== "client" && !s.superadmin);
  const byRep = team.map((s) => repStats(s.id, s.name, quotes, clients, followups, settings, today));
  const teamIds = new Set(team.map((t) => t.id));
  const unassigned = booked.filter((q) => !q.managerId || !teamIds.has(q.managerId));
  const revenueBySalesperson = [
    ...byRep.map((r) => ({ id: r.id, name: r.name, value: r.revenueTotal, count: r.bookings, conversion: r.conversion })),
    ...(unassigned.length
      ? [{ id: "none", name: "Founder / unassigned", value: unassigned.reduce((s, q) => s + bookingValue(q), 0), count: unassigned.length, conversion: 0 }]
      : []),
  ].sort((a, b) => b.value - a.value);

  // Each booking's final price shared across what it bought, in proportion.
  const cat = new Map<string, number>();
  for (const q of booked) {
    const total = q.quote.grandTotal || 1;
    const scale = bookingValue(q) / total;
    const add = (k: string, v: number) => cat.set(k, (cat.get(k) ?? 0) + v * scale);
    for (const l of q.quote.lines) add(l.serviceName, l.lineTotal);
    add("Post-production & delivery", q.quote.postProduction.finalFee);
    if (q.quote.chargesTotal) add("Studio charges", q.quote.chargesTotal);
    if (q.quote.tax?.amount) add("Tax", q.quote.tax.amount);
  }
  const revenueByCategory = [...cat.entries()].map(([name, value]) => ({ name, value: Math.round(value) })).sort((a, b) => b.value - a.value);

  const enquiryClients = new Set(quotes.filter((q) => q.status !== "draft").map((q) => q.clientId));
  const bookedClients = new Set(booked.map((q) => q.clientId));

  const sources = Object.keys(SOURCE_LABEL) as LeadSource[];
  const sourcePerformance = sources
    .map((src) => {
      const ids = new Set(clients.filter((c) => sourceOf(c) === src).map((c) => c.id));
      const enq = [...enquiryClients].filter((id) => ids.has(id)).length;
      const bk = booked.filter((q) => ids.has(q.clientId));
      return {
        source: src,
        label: SOURCE_LABEL[src],
        leads: ids.size,
        enquiries: enq,
        bookings: new Set(bk.map((q) => q.clientId)).size,
        revenue: bk.reduce((s, q) => s + bookingValue(q), 0),
        conversion: pct(new Set(bk.map((q) => q.clientId)).size, enq),
      };
    })
    .filter((s) => s.leads > 0 && s.source !== "website");

  const lostQ = quotes.filter((q) => q.lost);
  const lostAnalysis = (Object.keys(LOST_LABEL) as LostReason[])
    .map((r) => {
      const items = lostQ.filter((q) => q.lost!.reason === r);
      return { reason: r, label: LOST_LABEL[r], count: items.length, value: items.reduce((s, q) => s + q.quote.grandTotal, 0) };
    })
    .filter((x) => x.count > 0)
    .sort((a, b) => b.count - a.count);
  const lostList = lostQ
    .map((q) => ({
      id: q.id,
      reference: q.reference,
      couple: coupleNames(q.draft.couple, q.clientName),
      reason: LOST_LABEL[q.lost!.reason],
      detail: q.lost!.detail,
      at: q.lost!.at,
      by: q.lost!.by,
      value: q.quote.grandTotal,
      manager: q.managerName ?? null,
    }))
    .sort((a, b) => b.at.localeCompare(a.at));

  const discounted = quotes.filter((q) => q.finalPrice !== null && q.status !== "draft" && q.quote.grandTotal > 0);
  const discounts = discounted.map((q) => ((q.quote.grandTotal - (q.finalPrice as number)) / q.quote.grandTotal) * 100);
  const averageDiscount = discounts.length ? Math.round((discounts.reduce((a, b) => a + b, 0) / discounts.length) * 10) / 10 : 0;

  const receivables = booked
    .map((q) => ({
      id: q.id,
      reference: q.reference,
      couple: coupleNames(q.draft.couple, q.clientName),
      value: bookingValue(q),
      paid: paid(q),
      outstanding: Math.max(bookingValue(q) - paid(q), 0),
      date: firstDate(q),
      manager: q.managerName ?? null,
    }))
    .filter((r) => r.outstanding > 0)
    .sort((a, b) => (a.date || "9").localeCompare(b.date || "9"));

  const upcoming = booked
    .map((q) => ({
      id: q.id,
      reference: q.reference,
      couple: coupleNames(q.draft.couple, q.clientName),
      date: firstDate(q),
      city: q.draft.couple.city,
      occasions: q.draft.events.length,
      value: bookingValue(q),
      production: q.production?.status ?? null,
      manager: q.managerName ?? null,
    }))
    .filter((u) => !u.date || u.date >= today)
    .sort((a, b) => (a.date || "9").localeCompare(b.date || "9"));

  const prod = booked.filter((q) => q.production);
  const delivered = prod.filter((q) => q.production!.status === "delivered");
  const onTime = delivered.filter((q) => !q.production!.dueDate || (q.production!.deliveredAt ?? "").slice(0, 10) <= q.production!.dueDate);
  const lateDays = delivered
    .filter((q) => q.production!.dueDate && (q.production!.deliveredAt ?? "").slice(0, 10) > q.production!.dueDate)
    .map((q) => Math.round((Date.parse((q.production!.deliveredAt ?? "").slice(0, 10)) - Date.parse(q.production!.dueDate!)) / 86400000));
  const deliveryPerformance = {
    inProduction: prod.length - delivered.length,
    delivered: delivered.length,
    onTime: onTime.length,
    onTimeRate: pct(onTime.length, delivered.length),
    averageDaysLate: lateDays.length ? Math.round(lateDays.reduce((a, b) => a + b, 0) / lateDays.length) : 0,
    overdue: prod.filter((q) => q.production!.status !== "delivered" && q.production!.dueDate && q.production!.dueDate < today).length,
  };

  const total = booked.reduce((s, q) => s + bookingValue(q), 0);
  return {
    totals: {
      revenue: total,
      bookings: booked.length,
      averageBookingValue: booked.length ? Math.round(total / booked.length) : 0,
      leads: clients.length,
      enquiries: enquiryClients.size,
      proposals: quotes.filter((q) => q.status !== "draft").length,
      // Funnel steps count couples, not quotations, so each step is a subset of the last.
      approved: new Set(quotes.filter((q) => ["approved", "sent", "accepted"].includes(q.status)).map((q) => q.clientId)).size,
      bookedClients: bookedClients.size,
      conversion: pct(bookedClients.size, enquiryClients.size),
      lost: lostQ.length,
      averageDiscount,
      outstanding: receivables.reduce((s, r) => s + r.outstanding, 0),
    },
    revenueByMonth,
    revenueBySalesperson,
    revenueByCategory,
    sourcePerformance,
    lostAnalysis,
    lostList,
    receivables,
    upcoming,
    deliveryPerformance,
    team: byRep,
  };
}
