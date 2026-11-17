"use client";

import { useEffect, useState } from "react";
import cx from "../studio/cinema.module.css";
import qx from "../studio/quotes/quotes.module.css";
import ix from "./insights.module.css";
import DeskTop from "./DeskTop";
import { Bars, lakh, monthLabel } from "./SalesDashboard";
import { formatDateLong, formatINR } from "@/lib/commission/format";
import type { studioAnalytics } from "@/lib/portal/metrics";
import { PRODUCTION_LABEL, type PublicAccount } from "@/lib/portal/types";

type A = ReturnType<typeof studioAnalytics>;

function HBars({ items, tone = "" }: { items: { label: string; value: number; note?: string }[]; tone?: string }) {
  const max = Math.max(1, ...items.map((i) => i.value));
  return (
    <ul className={ix.hbars}>
      {items.map((i) => (
        <li key={i.label}>
          <span className={ix.hbarLabel}>
            <span>{i.label}</span>
            <span>{i.note ?? lakh(i.value)}</span>
          </span>
          <span className={`${ix.hbarTrack} ${tone}`}>
            <i style={{ width: `${Math.max((i.value / max) * 100, 1)}%` }} />
          </span>
        </li>
      ))}
    </ul>
  );
}

/* Superadmin-only analytics: revenue, conversion, sources, losses,
   discounts, receivables, upcoming weddings, delivery performance and the
   sales team side by side. */
export default function Analytics({ me }: { me: PublicAccount }) {
  const [a, setA] = useState<A | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/portal/insights?scope=studio", { cache: "no-store" }).catch(() => null);
      if (res?.status === 401) return window.location.assign("/desk/login");
      const d = res ? await res.json().catch(() => ({})) : {};
      if (res?.ok) setA((d as { analytics: A }).analytics);
      else setError((d as { error?: string }).error ?? "Could not load analytics.");
    })();
  }, []);

  const t = a?.totals;
  const thisMonth = a?.revenueByMonth[a.revenueByMonth.length - 1];
  const lastMonth = a?.revenueByMonth[a.revenueByMonth.length - 2];
  const trend = thisMonth && lastMonth && lastMonth.value ? Math.round(((thisMonth.value - lastMonth.value) / lastMonth.value) * 100) : null;

  return (
    <div className={`${cx.cinema} ${qx.page}`}>
      <DeskTop me={me} current="analytics" />
      <main className={qx.main}>
        <section className={ix.hero}>
          <p className={ix.heroKicker}>Superadmin · studio analytics</p>
          <h1 className={ix.heroTitle}>
            The studio, <em>in numbers.</em>
          </h1>
          <p className={ix.heroLine}>
            Calculated live from every quotation, booking, payment and production stage. Only you can see this page.
          </p>
        </section>
        {error && <p className={qx.error}>{error}</p>}

        <dl className={ix.kpis}>
          <div className={`${ix.kpi} ${ix.kpiAccent}`}>
            <dt>Revenue booked</dt>
            <dd>{t ? lakh(t.revenue) : "—"}</dd>
            <small>{thisMonth ? `${lakh(thisMonth.value)} this month${trend !== null ? ` · ${trend >= 0 ? "+" : ""}${trend}% vs last` : ""}` : " "}</small>
          </div>
          <div className={ix.kpi}>
            <dt>Average booking value</dt>
            <dd>{t ? lakh(t.averageBookingValue) : "—"}</dd>
            <small>{t ? `${t.bookings} bookings` : " "}</small>
          </div>
          <div className={ix.kpi}>
            <dt>Lead → booking</dt>
            <dd>{t ? `${t.conversion}%` : "—"}</dd>
            <small>{t ? `${t.leads} leads · ${t.enquiries} enquiries` : " "}</small>
          </div>
          <div className={ix.kpi}>
            <dt>Average discount</dt>
            <dd>{t ? `${t.averageDiscount}%` : "—"}</dd>
            <small>Final price vs studio estimate</small>
          </div>
          <div className={ix.kpi}>
            <dt>Outstanding receivables</dt>
            <dd>{t ? lakh(t.outstanding) : "—"}</dd>
            <small>{a ? `${a.receivables.length} bookings with a balance` : " "}</small>
          </div>
          <div className={ix.kpi}>
            <dt>Lost enquiries</dt>
            <dd>{t ? t.lost : "—"}</dd>
            <small>{a?.lostAnalysis[0] ? `Top reason: ${a.lostAnalysis[0].label}` : "None recorded"}</small>
          </div>
        </dl>

        <section className={`${ix.panel} ${ix.panelWide}`}>
          <div className={ix.panelHead}>
            <h2 className={ix.panelTitle}>Revenue by month</h2>
            <span className={ix.panelNote}>Booked value, last 12 months</span>
          </div>
          {a && <Bars data={a.revenueByMonth.map((m) => ({ label: monthLabel(m.month), value: m.value }))} />}
        </section>

        <div className={ix.grid2}>
          <section className={ix.panel}>
            <div className={ix.panelHead}>
              <h2 className={ix.panelTitle}>Revenue by salesperson</h2>
            </div>
            {a && a.revenueBySalesperson.length === 0 && <p className={ix.empty}>No bookings yet.</p>}
            {a && <HBars items={a.revenueBySalesperson.map((r) => ({ label: `${r.name} · ${r.count} booked`, value: r.value }))} />}
          </section>
          <section className={ix.panel}>
            <div className={ix.panelHead}>
              <h2 className={ix.panelTitle}>Revenue by service category</h2>
            </div>
            {a && a.revenueByCategory.length === 0 && <p className={ix.empty}>No bookings yet.</p>}
            {a && <HBars tone={ix.hbarGold} items={a.revenueByCategory.map((r) => ({ label: r.name, value: r.value }))} />}
          </section>
        </div>

        <section className={`${ix.panel} ${ix.panelWide}`}>
          <div className={ix.panelHead}>
            <h2 className={ix.panelTitle}>Sales team performance</h2>
            <span className={ix.panelNote}>This month against target</span>
          </div>
          <div className={ix.tableWrap}>
            <table className={ix.table}>
              <thead>
                <tr>
                  <th>Person</th>
                  <th className={ix.num}>Leads</th>
                  <th className={ix.num}>Proposals</th>
                  <th className={ix.num}>Bookings</th>
                  <th className={ix.num}>Conversion</th>
                  <th className={ix.num}>This month</th>
                  <th className={ix.num}>Target</th>
                  <th className={ix.num}>Commission</th>
                  <th className={ix.num}>Lost</th>
                </tr>
              </thead>
              <tbody>
                {a?.team.map((r) => (
                  <tr key={r.id}>
                    <td>{r.name}</td>
                    <td className={ix.num}>{r.leads}</td>
                    <td className={ix.num}>{r.proposals}</td>
                    <td className={ix.num}>{r.bookings}</td>
                    <td className={ix.num}>{r.conversion}%</td>
                    <td className={ix.num}>{formatINR(r.revenueThisMonth)}</td>
                    <td className={ix.num}>{r.target ? `${r.targetProgress}% of ${lakh(r.target)}` : "—"}</td>
                    <td className={ix.num}>{formatINR(r.commission.total)}</td>
                    <td className={ix.num}>{r.lost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className={ix.grid2}>
          <section className={ix.panel}>
            <div className={ix.panelHead}>
              <h2 className={ix.panelTitle}>Enquiry source performance</h2>
            </div>
            <div className={ix.tableWrap}>
              <table className={ix.table}>
                <thead>
                  <tr>
                    <th>Source</th>
                    <th className={ix.num}>Leads</th>
                    <th className={ix.num}>Booked</th>
                    <th className={ix.num}>Conversion</th>
                    <th className={ix.num}>Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {a?.sourcePerformance.map((s) => (
                    <tr key={s.source}>
                      <td>{s.label}</td>
                      <td className={ix.num}>{s.leads}</td>
                      <td className={ix.num}>{s.bookings}</td>
                      <td className={ix.num}>{s.conversion}%</td>
                      <td className={ix.num}>{lakh(s.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          <section className={ix.panel}>
            <div className={ix.panelHead}>
              <h2 className={ix.panelTitle}>Lost lead analysis</h2>
              <span className={ix.panelNote}>{t?.lost ?? 0} lost</span>
            </div>
            {a && a.lostAnalysis.length === 0 && <p className={ix.empty}>No lost enquiries recorded. Mark them from a quotation so the reasons show here.</p>}
            {a && <HBars tone={ix.hbarWarm} items={a.lostAnalysis.map((l) => ({ label: l.label, value: l.count, note: `${l.count} · ${lakh(l.value)}` }))} />}
            <ul className={ix.list} style={{ marginTop: "1rem" }}>
              {a?.lostList.slice(0, 6).map((l) => (
                <li key={l.id}>
                  <span className={ix.listTitle}>
                    <a href={`/desk?q=${l.id}`}>{l.couple}</a>
                  </span>
                  <span className={`${ix.pill} ${ix.pillRed}`}>{l.reason}</span>
                  <span className={ix.listSub}>
                    {l.reference} · {formatDateLong(l.at.slice(0, 10))} · {l.manager ?? "unassigned"}
                    {l.detail ? ` — ${l.detail}` : ""}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className={ix.grid2}>
          <section className={ix.panel}>
            <div className={ix.panelHead}>
              <h2 className={ix.panelTitle}>Upcoming wedding bookings</h2>
              <span className={ix.panelNote}>{a?.upcoming.length ?? 0}</span>
            </div>
            {a && a.upcoming.length === 0 && <p className={ix.empty}>No upcoming bookings.</p>}
            <ul className={ix.list}>
              {a?.upcoming.slice(0, 12).map((u) => (
                <li key={u.id}>
                  <span className={ix.listTitle}>
                    <a href={`/desk/production?q=${u.id}`}>{u.couple}</a>
                  </span>
                  <span className={ix.pill}>{u.date ? formatDateLong(u.date) : "Date TBC"}</span>
                  <span className={ix.listSub}>
                    {[u.city, `${u.occasions} occasions`, lakh(u.value), u.production ? PRODUCTION_LABEL[u.production] : null, u.manager].filter(Boolean).join(" · ")}
                  </span>
                </li>
              ))}
            </ul>
          </section>
          <section className={ix.panel}>
            <div className={ix.panelHead}>
              <h2 className={ix.panelTitle}>Outstanding receivables</h2>
              <span className={ix.panelNote}>{t ? lakh(t.outstanding) : ""}</span>
            </div>
            {a && a.receivables.length === 0 && <p className={ix.empty}>Every booking is fully paid.</p>}
            <ul className={ix.list}>
              {a?.receivables.slice(0, 12).map((r) => (
                <li key={r.id}>
                  <span className={ix.listTitle}>
                    <a href={`/desk?q=${r.id}`}>{r.couple}</a>
                  </span>
                  <span className={ix.listValue}>{formatINR(r.outstanding)}</span>
                  <span className={ix.listSub}>
                    {r.reference} · {formatINR(r.paid)} of {formatINR(r.value)} received{r.date ? ` · celebrates ${formatDateLong(r.date)}` : ""}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className={`${ix.panel} ${ix.panelWide}`}>
          <div className={ix.panelHead}>
            <h2 className={ix.panelTitle}>Post-production delivery performance</h2>
          </div>
          <dl className={ix.kpis} style={{ marginBottom: 0 }}>
            <div className={ix.kpi}>
              <dt>In production</dt>
              <dd>{a?.deliveryPerformance.inProduction ?? "—"}</dd>
            </div>
            <div className={ix.kpi}>
              <dt>Delivered</dt>
              <dd>{a?.deliveryPerformance.delivered ?? "—"}</dd>
            </div>
            <div className={ix.kpi}>
              <dt>On time</dt>
              <dd>{a ? `${a.deliveryPerformance.onTimeRate}%` : "—"}</dd>
              <small>{a ? `${a.deliveryPerformance.onTime} of ${a.deliveryPerformance.delivered}` : " "}</small>
            </div>
            <div className={ix.kpi}>
              <dt>Average delay</dt>
              <dd>{a ? `${a.deliveryPerformance.averageDaysLate} d` : "—"}</dd>
              <small>When late</small>
            </div>
            <div className={ix.kpi}>
              <dt>Overdue now</dt>
              <dd>{a?.deliveryPerformance.overdue ?? "—"}</dd>
            </div>
          </dl>
        </section>
      </main>
    </div>
  );
}
