"use client";

import { useEffect, useState } from "react";
import cx from "../studio/cinema.module.css";
import base from "../studio/studio.module.css";
import qx from "../studio/quotes/quotes.module.css";
import ix from "./insights.module.css";
import DeskTop from "./DeskTop";
import { Funnel, Ring, Trend, lakh } from "./charts";
import { formatDateLong, formatINR } from "@/lib/commission/format";
import type { RepStats } from "@/lib/portal/metrics";
import { PRODUCTION_LABEL, SOURCE_LABEL, type LeadSource, type ProductionStatus, type PublicAccount } from "@/lib/portal/types";

interface Founder {
  revenueThisMonth: number;
  revenueLastMonth: number;
  bookingsThisMonth: number;
  teamTarget: number;
  pipelineValue: number;
  pipelineCount: number;
  totals: { leads: number; enquiries: number; proposals: number; approved: number; bookings: number; bookedClients: number; conversion: number; revenue: number };
  months: { month: string; value: number; count: number }[];
  approvals: { id: string; reference: string; couple: string; price: number; estimate: number; by: string; note: string; at: string }[];
  newLeads: { id: string; name: string; createdAt: string; source: LeadSource; manager: string | null; summary: string | null }[];
  unassigned: number;
  league: RepStats[];
  upcoming: { id: string; couple: string; date: string; city: string; occasions: number; value: number; production: ProductionStatus | null; manager: string | null }[];
  overdueDeliveries: number;
  pulse: { at: string; by: string; action: string; note?: string; quoteId: string; couple: string }[];
}

const ACTION: Record<string, string> = {
  priced: "priced",
  sent_for_approval: "sent for your approval",
  forwarded: "shared with the client",
  consultation: "logged a session with",
  booked: "confirmed a booking for",
  lost: "marked lost",
  production: "moved production for",
  payment: "recorded a payment from",
  deliverables: "updated the deliverables for",
  reopened: "reopened",
  assigned: "reassigned",
};
const monthShort = (m: string) => new Date(`${m}-01T00:00:00Z`).toLocaleDateString("en-IN", { month: "short", timeZone: "UTC" });
const ago = (iso: string) => {
  const m = Math.round((Date.now() - Date.parse(iso)) / 60000);
  if (m < 60) return `${Math.max(m, 1)}m`;
  const h = Math.round(m / 60);
  return h < 24 ? `${h}h` : `${Math.round(h / 24)}d`;
};

/* The founder's desk: the studio at a glance — what needs your decision,
   this month against target, the pipeline, the team's race, new leads and
   the celebrations coming up. */
export default function FounderDesk({ me }: { me: PublicAccount }) {
  const [f, setF] = useState<Founder | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/portal/insights?scope=me", { cache: "no-store" }).catch(() => null);
      if (res?.status === 401) return window.location.assign("/desk/login");
      const d = res ? await res.json().catch(() => ({})) : {};
      if (res?.ok && (d as { founder?: Founder }).founder) setF((d as { founder: Founder }).founder);
      else setErr((d as { error?: string }).error ?? "Could not load your desk.");
    })();
  }, []);

  const delta = f && f.revenueLastMonth ? Math.round(((f.revenueThisMonth - f.revenueLastMonth) / f.revenueLastMonth) * 100) : null;
  const toTarget = f && f.teamTarget ? Math.round((f.revenueThisMonth / f.teamTarget) * 100) : 0;
  const greet = new Date().getHours() < 12 ? "Good morning" : new Date().getHours() < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className={`${cx.cinema} ${qx.page}`}>
      <DeskTop me={me} current="dashboard" />
      <main className={qx.main}>
        <header className={ix.hero} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "1.5rem", flexWrap: "wrap" }}>
          <div>
            <p className={ix.heroKicker}>Founder&apos;s desk · {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}</p>
            <h1 className={ix.heroTitle}>
              {greet}, <em>{me.name.split(" ")[0]}.</em>
            </h1>
          </div>
          <ul className={ix.strip} style={{ margin: 0 }}>
            <li className={f?.approvals.length ? ix.stripHot : ""}>
              Awaiting you <b>{f?.approvals.length ?? "—"}</b>
            </li>
            <li className={f?.unassigned ? ix.stripHot : ""}>
              Unassigned leads <b>{f?.unassigned ?? "—"}</b>
            </li>
            <li className={f?.overdueDeliveries ? ix.stripHot : ""}>
              Overdue deliveries <b>{f?.overdueDeliveries ?? "—"}</b>
            </li>
          </ul>
        </header>
        {err && <p className={qx.error}>{err}</p>}

        <div className={ix.grid3}>
          <section className={`${ix.panel} ${ix.kpiAccent}`} style={{ display: "flex", gap: "1.2rem", alignItems: "center" }}>
            <Ring value={toTarget} label="Of team target" />
            <div>
              <p className={base.kicker} style={{ margin: 0 }}>This month</p>
              <p className={ix.trendBig}>{f ? lakh(f.revenueThisMonth) : "—"}</p>
              <p className={ix.trendSub}>
                {f ? `${f.bookingsThisMonth} booking${f.bookingsThisMonth === 1 ? "" : "s"}` : ""}
                {delta !== null ? ` · ${delta >= 0 ? "+" : ""}${delta}% vs last month` : ""}
                {f && f.teamTarget ? ` · target ${lakh(f.teamTarget)}` : f ? " · no targets set" : ""}
              </p>
            </div>
          </section>
          <section className={ix.panel}>
            <p className={base.kicker} style={{ margin: 0 }}>Open pipeline</p>
            <p className={ix.trendBig}>{f ? lakh(f.pipelineValue) : "—"}</p>
            <p className={ix.trendSub}>{f ? `${f.pipelineCount} quotations in play` : ""}</p>
          </section>
          <section className={ix.panel}>
            <p className={base.kicker} style={{ margin: 0 }}>Lead → booking</p>
            <p className={ix.trendBig}>{f ? `${f.totals.conversion}%` : "—"}</p>
            <p className={ix.trendSub}>{f ? `${f.totals.bookings} booked · ${lakh(f.totals.revenue)} all time` : ""}</p>
          </section>
        </div>

        <div className={ix.grid2} style={{ gridTemplateColumns: "minmax(0, 1.25fr) minmax(0, 1fr)" }}>
          <section className={ix.panel}>
            <div className={ix.panelHead}>
              <h2 className={ix.panelTitle}>Awaiting your approval</h2>
              <a className={ix.panelNote} href="/desk">
                All quotations →
              </a>
            </div>
            {f && f.approvals.length === 0 && <p className={ix.empty}>Nothing waiting on you.</p>}
            <ul className={ix.list}>
              {f?.approvals.map((q) => {
                const off = q.estimate ? Math.round(((q.estimate - q.price) / q.estimate) * 100) : 0;
                return (
                  <li key={q.id}>
                    <span className={ix.listTitle}>
                      <a href={`/desk?q=${q.id}`}>{q.couple}</a>
                    </span>
                    <span className={ix.listActions}>
                      <span className={ix.listValue}>{formatINR(q.price)}</span>
                      <a className={base.btnPrimary} href={`/desk?q=${q.id}`}>
                        Review
                      </a>
                    </span>
                    <span className={ix.listSub}>
                      {q.reference} · from {q.by} · {ago(q.at)} ago
                      {off ? ` · ${off > 0 ? `${off}% below` : `${-off}% above`} estimate` : ""}
                      {q.note ? ` — “${q.note}”` : ""}
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>
          <section className={ix.panel}>
            <div className={ix.panelHead}>
              <h2 className={ix.panelTitle}>Pipeline</h2>
            </div>
            {f && (
              <Funnel
                steps={[
                  { label: "Leads", value: f.totals.leads },
                  { label: "Sent a quotation", value: f.totals.enquiries },
                  { label: "Priced & approved", value: f.totals.approved },
                  { label: "Booked", value: f.totals.bookedClients },
                ]}
              />
            )}
          </section>
        </div>

        <div className={ix.grid2} style={{ gridTemplateColumns: "minmax(0, 1.25fr) minmax(0, 1fr)" }}>
          <section className={ix.panel}>
            <div className={ix.panelHead}>
              <h2 className={ix.panelTitle}>Revenue, last six months</h2>
              <a className={ix.panelNote} href="/desk/analytics">
                Full analytics →
              </a>
            </div>
            {f && (
              <Trend
                points={f.months.map((m) => ({ label: monthShort(m.month), values: { revenue: m.value, bookings: m.count } }))}
                modes={[
                  { id: "revenue", label: "Revenue", format: lakh },
                  { id: "bookings", label: "Bookings", format: (n) => `${n} booking${n === 1 ? "" : "s"}` },
                ]}
              />
            )}
          </section>
          <section className={ix.panel}>
            <div className={ix.panelHead}>
              <h2 className={ix.panelTitle}>The team this month</h2>
              <a className={ix.panelNote} href="/desk/team">
                Team →
              </a>
            </div>
            {f && f.league.length === 0 && <p className={ix.empty}>No salespeople yet.</p>}
            <ul className={ix.list}>
              {[...(f?.league ?? [])]
                .sort((a, b) => b.revenueThisMonth - a.revenueThisMonth)
                .map((r, i) => (
                  <li key={r.id}>
                    <span className={ix.listTitle}>
                      <span className={ix.leagueRank}>#{i + 1}</span> {r.name}
                    </span>
                    <span className={ix.listValue}>{lakh(r.revenueThisMonth)}</span>
                    <span className={ix.listSub}>
                      {r.target ? `${r.targetProgress}% of ${lakh(r.target)}` : "no target"} · {r.conversion}% conversion · {r.leads} leads
                      {r.followupsOverdue ? ` · ${r.followupsOverdue} overdue follow-ups` : ""}
                    </span>
                  </li>
                ))}
            </ul>
          </section>
        </div>

        <div className={ix.grid3}>
          <section className={ix.panel}>
            <div className={ix.panelHead}>
              <h2 className={ix.panelTitle}>New leads</h2>
              <span className={ix.panelNote}>Last 14 days</span>
            </div>
            {f && f.newLeads.length === 0 && <p className={ix.empty}>No new leads.</p>}
            <ul className={ix.list}>
              {f?.newLeads.map((l) => (
                <li key={l.id}>
                  <span className={ix.listTitle}>
                    <a href={`/desk/clients?c=${l.id}`}>{l.name}</a>
                  </span>
                  <span className={`${ix.pill} ${l.manager ? "" : ix.pillRed}`}>{l.manager ?? "Unassigned"}</span>
                  <span className={ix.listSub}>
                    {SOURCE_LABEL[l.source] ?? l.source} · {ago(l.createdAt)} ago
                    {l.summary ? ` — ${l.summary.slice(0, 140)}${l.summary.length > 140 ? "…" : ""}` : ""}
                  </span>
                </li>
              ))}
            </ul>
          </section>
          <section className={ix.panel}>
            <div className={ix.panelHead}>
              <h2 className={ix.panelTitle}>Coming up</h2>
              <span className={ix.panelNote}>Next 45 days</span>
            </div>
            {f && f.upcoming.length === 0 && <p className={ix.empty}>No celebrations in the next 45 days.</p>}
            <ul className={ix.list}>
              {f?.upcoming.map((u) => (
                <li key={u.id}>
                  <span className={ix.listTitle}>
                    <a href={`/desk/production?q=${u.id}`}>{u.couple}</a>
                  </span>
                  <span className={ix.pill}>{formatDateLong(u.date)}</span>
                  <span className={ix.listSub}>
                    {[u.city, `${u.occasions} occasions`, u.production ? PRODUCTION_LABEL[u.production] : null, u.manager].filter(Boolean).join(" · ")}
                  </span>
                </li>
              ))}
            </ul>
          </section>
          <section className={ix.panel}>
            <div className={ix.panelHead}>
              <h2 className={ix.panelTitle}>Team pulse</h2>
            </div>
            {f && f.pulse.length === 0 && <p className={ix.empty}>Quiet so far.</p>}
            <ul className={ix.list}>
              {f?.pulse.map((p, i) => (
                <li key={i}>
                  <span className={ix.listTitle}>
                    <b>{p.by}</b> {ACTION[p.action] ?? p.action} <a href={`/desk?q=${p.quoteId}`}>{p.couple}</a>
                  </span>
                  <span className={ix.panelNote}>{ago(p.at)}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}
