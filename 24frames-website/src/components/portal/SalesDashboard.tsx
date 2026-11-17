"use client";

import { useEffect, useState } from "react";
import cx from "../studio/cinema.module.css";
import base from "../studio/studio.module.css";
import qx from "../studio/quotes/quotes.module.css";
import ix from "./insights.module.css";
import DeskTop from "./DeskTop";
import { formatDateLong, formatINR } from "@/lib/commission/format";
import type { RepStats } from "@/lib/portal/metrics";
import { PRODUCTION_LABEL, type FollowUp, type ProductionStatus, type PublicAccount } from "@/lib/portal/types";

interface Row {
  id: string;
  reference: string;
  couple: string;
  status: string;
  value: number;
  updatedAt: string;
}
interface Data {
  stats: RepStats;
  leads: { id: string; name: string; phone: string; location: string; createdAt: string; latest: Row | null; summary: string | null }[];
  unassigned: number;
  followups: FollowUp[];
  consultationsToday: { id: string; at: string; title: string; detail: string; quoteId: string | null }[];
  proposals: Row[];
  bookings: (Row & { bookedAt: string; production: ProductionStatus | null })[];
  months: { month: string; value: number; count: number }[];
  tasks: { id: string; quoteId: string | null; title: string; detail: string }[];
}

export const monthLabel = (m: string) => new Date(`${m}-01T00:00:00Z`).toLocaleDateString("en-IN", { month: "short", year: "2-digit", timeZone: "UTC" });
export const lakh = (n: number) => (n >= 100000 ? `₹${(n / 100000).toFixed(n >= 1000000 ? 1 : 2)}L` : formatINR(n));

export function Bars({ data }: { data: { label: string; value: number; sub?: string }[] }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <div className={ix.bars}>
      {data.map((d) => (
        <div key={d.label} className={ix.bar} title={`${d.label}: ${formatINR(d.value)}`}>
          <b>{d.value ? lakh(d.value) : ""}</b>
          <div className={ix.barTrack}>
            <i style={{ height: `${Math.max((d.value / max) * 100, d.value ? 3 : 1)}%` }} />
          </div>
          <span>{d.label}</span>
        </div>
      ))}
    </div>
  );
}

/* A salesperson's own desk: their leads, follow-ups, today's sessions,
   proposals, bookings, monthly sales, conversion and pending tasks. */
export default function SalesDashboard({ me }: { me: PublicAccount }) {
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState<string | null>(null);
  const today = new Date().toISOString().slice(0, 10);

  async function load() {
    const res = await fetch("/api/portal/insights?scope=me", { cache: "no-store" }).catch(() => null);
    if (res?.status === 401) return window.location.assign("/desk/login");
    const d = res ? await res.json().catch(() => ({})) : {};
    if (res?.ok) setData(d as Data);
    else setError((d as { error?: string }).error ?? "Could not load your desk.");
  }
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, []);

  async function done(f: FollowUp) {
    await fetch("/api/portal/followups", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: f.id, done: true }) }).catch(() => null);
    void load();
  }

  const s = data?.stats;
  const first = me.name.split(" ")[0];
  return (
    <div className={`${cx.cinema} ${qx.page}`}>
      <DeskTop me={me} current="dashboard" />
      <main className={qx.main}>
        <section className={ix.hero}>
          <p className={ix.heroKicker}>
            My desk · {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
          </p>
          <h1 className={ix.heroTitle}>
            Good to see you, <em>{first}.</em>
          </h1>
          <p className={ix.heroLine}>
            {data
              ? `${data.tasks.length} pending task${data.tasks.length === 1 ? "" : "s"}, ${data.consultationsToday.length} session${data.consultationsToday.length === 1 ? "" : "s"} today and ${data.followups.length} open follow-up${data.followups.length === 1 ? "" : "s"}.`
              : "Gathering your book…"}
            {data && data.unassigned > 0 ? ` ${data.unassigned} unassigned lead${data.unassigned === 1 ? " is" : "s are"} waiting for the founder to assign.` : ""}
          </p>
        </section>

        {error && <p className={qx.error}>{error}</p>}

        <dl className={ix.kpis}>
          <div className={`${ix.kpi} ${ix.kpiAccent}`}>
            <dt>My sales this month</dt>
            <dd>{s ? lakh(s.revenueThisMonth) : "—"}</dd>
            <small>{s ? (s.target ? `${s.targetProgress}% of ${lakh(s.target)} target` : "No target set yet") : " "}</small>
            {s && s.target > 0 && (
              <div className={ix.meter}>
                <span style={{ width: `${Math.min(s.targetProgress, 100)}%` }} />
              </div>
            )}
          </div>
          <div className={ix.kpi}>
            <dt>My conversion rate</dt>
            <dd>{s ? `${s.conversion}%` : "—"}</dd>
            <small>{s ? `${s.bookings} booked of ${s.enquiries} enquiries` : " "}</small>
          </div>
          <div className={ix.kpi}>
            <dt>Confirmed bookings</dt>
            <dd>{s ? s.bookings : "—"}</dd>
            <small>{s ? `${lakh(s.revenueTotal)} booked in total` : " "}</small>
          </div>
          <div className={ix.kpi}>
            <dt>Assigned leads</dt>
            <dd>{s ? s.leads : "—"}</dd>
            <small>{s ? `${s.lost} lost` : " "}</small>
          </div>
          <div className={ix.kpi}>
            <dt>Commission this month</dt>
            <dd>{s ? lakh(s.commission.total) : "—"}</dd>
            <small>{s ? `${s.commission.rate}% on bookings${s.commission.bonus ? ` + ${lakh(s.commission.bonus)} bonus` : ""}` : " "}</small>
          </div>
        </dl>

        <div className={ix.grid2}>
          <section className={ix.panel}>
            <div className={ix.panelHead}>
              <h2 className={ix.panelTitle}>Today&apos;s consultations</h2>
              <span className={ix.panelNote}>Logged sessions and meetings due today</span>
            </div>
            {data && data.consultationsToday.length === 0 && <p className={ix.empty}>Nothing scheduled today.</p>}
            <ul className={ix.list}>
              {data?.consultationsToday.map((c) => (
                <li key={c.id}>
                  <span className={ix.listTitle}>{c.quoteId ? <a href={`/desk?q=${c.quoteId}`}>{c.title}</a> : c.title}</span>
                  <span className={ix.pill}>{new Date(c.at).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })}</span>
                  <span className={ix.listSub}>{c.detail}</span>
                </li>
              ))}
            </ul>
          </section>
          <section className={ix.panel}>
            <div className={ix.panelHead}>
              <h2 className={ix.panelTitle}>My pending tasks</h2>
              <span className={ix.panelNote}>{data?.tasks.length ?? 0}</span>
            </div>
            {data && data.tasks.length === 0 && <p className={ix.empty}>All clear.</p>}
            <ul className={ix.list}>
              {data?.tasks.map((t) => (
                <li key={t.id}>
                  <span className={ix.listTitle}>{t.quoteId ? <a href={`/desk?q=${t.quoteId}`}>{t.title}</a> : t.title}</span>
                  {t.quoteId && (
                    <a className={base.btnGhost} href={`/desk?q=${t.quoteId}`}>
                      Open
                    </a>
                  )}
                  <span className={ix.listSub}>{t.detail}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className={ix.grid2}>
          <section className={ix.panel}>
            <div className={ix.panelHead}>
              <h2 className={ix.panelTitle}>My follow-ups</h2>
              <a className={ix.panelNote} href="/desk/clients">
                Add from a client →
              </a>
            </div>
            {data && data.followups.length === 0 && <p className={ix.empty}>No open follow-ups. Add one from a client&apos;s page.</p>}
            <ul className={ix.list}>
              {data?.followups.map((f) => (
                <li key={f.id}>
                  <span className={ix.listTitle}>
                    <a href={`/desk/clients?c=${f.clientId}`}>{f.clientName}</a> · {f.kind}
                  </span>
                  <span className={ix.listActions}>
                    <span className={`${ix.pill} ${f.due < today ? ix.pillRed : f.due === today ? ix.pillGold : ""}`}>{f.due === today ? "Today" : formatDateLong(f.due)}</span>
                    <button className={base.btnGhost} onClick={() => done(f)}>
                      Done
                    </button>
                  </span>
                  {f.note && <span className={ix.listSub}>{f.note}</span>}
                </li>
              ))}
            </ul>
          </section>
          <section className={ix.panel}>
            <div className={ix.panelHead}>
              <h2 className={ix.panelTitle}>My monthly sales</h2>
              <span className={ix.panelNote}>Booked value, last 6 months</span>
            </div>
            {data && <Bars data={data.months.map((m) => ({ label: monthLabel(m.month), value: m.value }))} />}
          </section>
        </div>

        <div className={ix.grid2}>
          <section className={ix.panel}>
            <div className={ix.panelHead}>
              <h2 className={ix.panelTitle}>My proposals</h2>
              <span className={ix.panelNote}>{data?.proposals.length ?? 0} open</span>
            </div>
            {data && data.proposals.length === 0 && <p className={ix.empty}>No open proposals.</p>}
            <ul className={ix.list}>
              {data?.proposals.map((p) => (
                <li key={p.id}>
                  <span className={ix.listTitle}>
                    <a href={`/desk?q=${p.id}`}>{p.couple}</a>
                  </span>
                  <span className={ix.listValue}>{formatINR(p.value)}</span>
                  <span className={ix.listSub}>
                    {p.reference} · {p.status} · updated {formatDateLong(p.updatedAt.slice(0, 10))}
                  </span>
                </li>
              ))}
            </ul>
          </section>
          <section className={ix.panel}>
            <div className={ix.panelHead}>
              <h2 className={ix.panelTitle}>My confirmed bookings</h2>
              <span className={ix.panelNote}>{data?.bookings.length ?? 0}</span>
            </div>
            {data && data.bookings.length === 0 && <p className={ix.empty}>No bookings yet — the first one is close.</p>}
            <ul className={ix.list}>
              {data?.bookings.map((b) => (
                <li key={b.id}>
                  <span className={ix.listTitle}>
                    <a href={`/desk/production?q=${b.id}`}>{b.couple}</a>
                  </span>
                  <span className={ix.listValue}>{formatINR(b.value)}</span>
                  <span className={ix.listSub}>
                    {b.reference} · booked {formatDateLong(b.bookedAt.slice(0, 10))}
                    {b.production ? ` · ${PRODUCTION_LABEL[b.production]}` : ""}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className={`${ix.panel} ${ix.panelWide}`}>
          <div className={ix.panelHead}>
            <h2 className={ix.panelTitle}>My assigned leads</h2>
            <span className={ix.panelNote}>{data?.leads.length ?? 0}</span>
          </div>
          {data && data.leads.length === 0 && <p className={ix.empty}>No leads assigned to you yet. Share your client link from the Quotations page.</p>}
          {data && data.leads.length > 0 && (
            <div className={ix.tableWrap}>
              <table className={ix.table}>
                <thead>
                  <tr>
                    <th>Lead</th>
                    <th>Mobile</th>
                    <th>Location</th>
                    <th>Latest</th>
                    <th className={ix.num}>Value</th>
                  </tr>
                </thead>
                <tbody>
                  {data.leads.map((l) => (
                    <tr key={l.id}>
                      <td>
                        <a href={`/desk/clients?c=${l.id}`}>{l.name}</a>
                        {l.summary && <div className={ix.jobMeta} style={{ maxWidth: 420 }}>{l.summary}</div>}
                      </td>
                      <td>{l.phone || "—"}</td>
                      <td>{l.location || "—"}</td>
                      <td>{l.latest ? l.latest.status : "No quotation yet"}</td>
                      <td className={ix.num}>{l.latest ? formatINR(l.latest.value) : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
