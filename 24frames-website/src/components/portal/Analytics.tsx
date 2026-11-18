"use client";

import { useEffect, useMemo, useState } from "react";
import cx from "../studio/cinema.module.css";
import qx from "../studio/quotes/quotes.module.css";
import ix from "./insights.module.css";
import DeskTop from "./DeskTop";
import { Donut, Funnel, Ring, Trend, lakh } from "./charts";
import { formatDateLong } from "@/lib/commission/format";
import type { studioAnalytics } from "@/lib/portal/metrics";
import type { PublicAccount } from "@/lib/portal/types";

type A = ReturnType<typeof studioAnalytics>;
const monthShort = (m: string) => new Date(`${m}-01T00:00:00Z`).toLocaleDateString("en-IN", { month: "short", timeZone: "UTC" });

/* Superadmin-only analytics, drawn to be explored: hover the trend, the
   donuts and the funnel; re-rank the team by what matters today. */
export default function Analytics({ me }: { me: PublicAccount }) {
  const [a, setA] = useState<A | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rank, setRank] = useState<"revenue" | "conversion" | "bookings" | "target">("revenue");

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
  const team = useMemo(() => {
    const key = { revenue: (r: A["team"][number]) => r.revenueThisMonth, conversion: (r: A["team"][number]) => r.conversion, bookings: (r: A["team"][number]) => r.bookings, target: (r: A["team"][number]) => r.targetProgress }[rank];
    return [...(a?.team ?? [])].sort((x, y) => key(y) - key(x));
  }, [a, rank]);

  return (
    <div className={`${cx.cinema} ${qx.page}`}>
      <DeskTop me={me} current="analytics" />
      <main className={qx.main}>
        <header className={ix.hero}>
          <p className={ix.heroKicker}>Superadmin · studio analytics</p>
          <h1 className={ix.heroTitle}>
            The studio, <em>in numbers.</em>
          </h1>
        </header>
        {error && <p className={qx.error}>{error}</p>}

        <ul className={ix.strip}>
          <li className={ix.stripHot}>
            Revenue booked <b>{t ? lakh(t.revenue) : "—"}</b>
          </li>
          <li>
            Bookings <b>{t?.bookings ?? "—"}</b>
          </li>
          <li>
            Average booking <b>{t ? lakh(t.averageBookingValue) : "—"}</b>
          </li>
          <li>
            Lead → booking <b>{t ? `${t.conversion}%` : "—"}</b>
          </li>
          <li>
            Average discount <b>{t ? `${t.averageDiscount}%` : "—"}</b>
          </li>
          <li>
            Lost <b>{t?.lost ?? "—"}</b>
          </li>
        </ul>

        <div className={ix.grid2} style={{ gridTemplateColumns: "minmax(0, 1.6fr) minmax(0, 1fr)" }}>
          <section className={ix.panel}>
            <div className={ix.panelHead}>
              <h2 className={ix.panelTitle}>Monthly revenue trend</h2>
              <span className={ix.panelNote}>Hover a month</span>
            </div>
            {a && (
              <Trend
                points={a.revenueByMonth.map((m) => ({ label: monthShort(m.month), values: { revenue: m.value, bookings: m.count } }))}
                modes={[
                  { id: "revenue", label: "Revenue", format: lakh },
                  { id: "bookings", label: "Bookings", format: (n) => `${n} booking${n === 1 ? "" : "s"}` },
                ]}
              />
            )}
          </section>
          <section className={ix.panel}>
            <div className={ix.panelHead}>
              <h2 className={ix.panelTitle}>Lead-to-booking funnel</h2>
            </div>
            {t && (
              <Funnel
                steps={[
                  { label: "Leads", value: t.leads },
                  { label: "Sent a quotation", value: t.enquiries },
                  { label: "Priced & approved", value: t.approved },
                  { label: "Booked", value: t.bookedClients },
                ]}
              />
            )}
          </section>
        </div>

        <section className={`${ix.panel} ${ix.panelWide}`}>
          <div className={ix.panelHead}>
            <h2 className={ix.panelTitle}>Sales team performance</h2>
            <div className={ix.seg} role="tablist" aria-label="Rank by">
              {(
                [
                  ["revenue", "This month"],
                  ["target", "Target"],
                  ["conversion", "Conversion"],
                  ["bookings", "Bookings"],
                ] as const
              ).map(([id, label]) => (
                <button key={id} role="tab" aria-selected={rank === id} className={rank === id ? ix.segOn : ""} onClick={() => setRank(id)}>
                  {label}
                </button>
              ))}
            </div>
          </div>
          {a && team.length === 0 && <p className={ix.empty}>No salespeople yet — add them on the Team page.</p>}
          <div className={ix.league}>
            {team.map((r, i) => (
              <div key={r.id} className={ix.leagueCard}>
                <Ring value={rank === "conversion" ? r.conversion : r.target ? r.targetProgress : 0} label={rank === "conversion" ? "Conversion" : "Target"} />
                <div>
                  <span className={ix.leagueName}>
                    <span className={ix.leagueRank}>#{i + 1}</span>
                    {r.name}
                  </span>
                  <span className={ix.leagueStats}>
                    <span>
                      <b>{lakh(r.revenueThisMonth)}</b> this month
                    </span>
                    <span>
                      <b>{r.bookings}</b> booked
                    </span>
                    <span>
                      <b>{r.conversion}%</b> conv.
                    </span>
                    <span>
                      <b>{r.leads}</b> leads
                    </span>
                    <span>{r.target ? `target ${lakh(r.target)}` : "no target"}</span>
                    <span>
                      earns <b>{lakh(r.commission.total)}</b>
                    </span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className={ix.grid2}>
          <section className={ix.panel}>
            <div className={ix.panelHead}>
              <h2 className={ix.panelTitle}>Revenue by salesperson</h2>
            </div>
            {a && <Donut centerLabel="Booked" items={a.revenueBySalesperson.filter((r) => r.value > 0).map((r) => ({ label: r.name, value: r.value }))} />}
          </section>
          <section className={ix.panel}>
            <div className={ix.panelHead}>
              <h2 className={ix.panelTitle}>Revenue by service</h2>
            </div>
            {a && <Donut centerLabel="All services" items={a.revenueByCategory.slice(0, 7).map((r) => ({ label: r.name, value: r.value }))} />}
          </section>
        </div>

        <div className={ix.grid2}>
          <section className={ix.panel}>
            <div className={ix.panelHead}>
              <h2 className={ix.panelTitle}>Enquiry sources</h2>
            </div>
            {a && a.sourcePerformance.length === 0 && <p className={ix.empty}>No tracked sources yet.</p>}
            {a && (
              <Donut
                centerLabel="Leads"
                format={(n) => String(n)}
                items={a.sourcePerformance.map((s) => ({ label: s.label, value: s.leads, note: `${s.leads} · ${s.conversion}% · ${lakh(s.revenue)}` }))}
              />
            )}
          </section>
          <section className={ix.panel}>
            <div className={ix.panelHead}>
              <h2 className={ix.panelTitle}>Lost lead analysis</h2>
              <span className={ix.panelNote}>{t?.lost ?? 0} lost</span>
            </div>
            {a && a.lostAnalysis.length === 0 && <p className={ix.empty}>No lost enquiries recorded. Mark them from a quotation so the reasons show here.</p>}
            {a && a.lostAnalysis.length > 0 && (
              <Donut centerLabel="Lost" format={(n) => String(n)} items={a.lostAnalysis.map((l) => ({ label: l.label, value: l.count, note: `${l.count} · ${lakh(l.value)}` }))} />
            )}
            <ul className={ix.list} style={{ marginTop: "1rem" }}>
              {a?.lostList.slice(0, 4).map((l) => (
                <li key={l.id}>
                  <span className={ix.listTitle}>
                    <a href={`/desk?q=${l.id}`}>{l.couple}</a>
                  </span>
                  <span className={`${ix.pill} ${ix.pillRed}`}>{l.reason}</span>
                  <span className={ix.listSub}>
                    {formatDateLong(l.at.slice(0, 10))} · {l.manager ?? "unassigned"}
                    {l.detail ? ` — ${l.detail}` : ""}
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
          <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem", alignItems: "center" }}>
            {a && <Ring value={a.deliveryPerformance.onTimeRate} label="On time" />}
            <ul className={ix.strip} style={{ margin: 0 }}>
              <li>
                In production <b>{a?.deliveryPerformance.inProduction ?? "—"}</b>
              </li>
              <li>
                Delivered <b>{a?.deliveryPerformance.delivered ?? "—"}</b>
              </li>
              <li>
                On time <b>{a ? `${a.deliveryPerformance.onTime}/${a.deliveryPerformance.delivered}` : "—"}</b>
              </li>
              <li>
                Average delay <b>{a ? `${a.deliveryPerformance.averageDaysLate}d` : "—"}</b>
              </li>
              <li className={a?.deliveryPerformance.overdue ? ix.stripHot : ""}>
                Overdue now <b>{a?.deliveryPerformance.overdue ?? "—"}</b>
              </li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
