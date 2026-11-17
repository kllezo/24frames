"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import cx from "../studio/cinema.module.css";
import base from "../studio/studio.module.css";
import qx from "../studio/quotes/quotes.module.css";
import ix from "./insights.module.css";
import DeskTop from "./DeskTop";
import { lakh } from "./SalesDashboard";
import { formatDateLong, formatINR } from "@/lib/commission/format";
import type { RepStats } from "@/lib/portal/metrics";
import type { PublicAccount, SalesSettings } from "@/lib/portal/types";

interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "sales" | "owner";
  active: boolean;
  seeAllLeads: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  stats: RepStats;
}
interface TeamData {
  team: Member[];
  pending: { email: string; name: string; role: string; grantedAt: string }[];
  settings: SalesSettings;
  activity: { at: string; by: string; action: string; note?: string; price?: number; quoteId: string; reference: string; couple: string }[];
  conversations: { at: string; by: string; kind: string; text: string; quoteId: string | null; reference: string; couple: string }[];
  unassignedLeads: { id: string; name: string; phone: string; location: string; createdAt: string }[];
}

const ACTION: Record<string, string> = {
  priced: "set a price",
  sent_for_approval: "sent for approval",
  approved: "approved",
  rejected: "returned",
  forwarded: "shared with the client",
  reopened: "reopened",
  assigned: "assigned a manager",
  consultation: "logged a session",
  booked: "confirmed a booking",
  lost: "marked lost",
  revived: "revived",
  production: "moved production",
  payment: "recorded a payment",
  note: "added a note",
};

const ago = (iso: string) => {
  const m = Math.round((Date.now() - Date.parse(iso)) / 60000);
  if (m < 60) return `${Math.max(m, 1)} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} h ago`;
  return formatDateLong(iso.slice(0, 10));
};

/* Superadmin controls: create and deactivate sales accounts, decide who
   sees whose leads, assign and reassign leads, set targets and commission,
   and watch activity, performance and every conversation. */
export default function Team({ me }: { me: PublicAccount }) {
  const [d, setD] = useState<TeamData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [filter, setFilter] = useState("");

  const load = useCallback(async () => {
    const res = await fetch("/api/portal/team", { cache: "no-store" }).catch(() => null);
    if (res?.status === 401) return window.location.assign("/desk/login");
    const j = res ? await res.json().catch(() => ({})) : {};
    if (res?.ok) setD(j as TeamData);
    else setError((j as { error?: string }).error ?? "Could not load the team.");
  }, []);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  async function call(method: string, url: string, payload: unknown, ok: string) {
    setMsg(null);
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }).catch(() => null);
    const j = res ? ((await res.json().catch(() => ({}))) as { error?: string }) : {};
    if (res?.ok) {
      setMsg({ ok: true, text: ok });
      await load();
      return true;
    }
    setMsg({ ok: false, text: j.error ?? "That didn't go through." });
    return false;
  }

  const conversations = useMemo(() => {
    const t = filter.trim().toLowerCase();
    return (d?.conversations ?? []).filter((c) => !t || [c.by, c.kind, c.text, c.couple, c.reference].join(" ").toLowerCase().includes(t)).slice(0, 80);
  }, [d, filter]);

  const sales = (d?.team ?? []).filter((m) => m.active);

  return (
    <div className={`${cx.cinema} ${qx.page}`}>
      <DeskTop me={me} current="team" />
      <main className={qx.main}>
        <section className={ix.hero}>
          <p className={ix.heroKicker}>Superadmin · the team</p>
          <h1 className={ix.heroTitle}>
            Your sales team, <em>at a glance.</em>
          </h1>
          <p className={ix.heroLine}>
            Create and deactivate accounts, decide who may see others&apos; leads, assign leads, set monthly targets and commission, and follow every
            conversation.
          </p>
        </section>
        {error && <p className={qx.error}>{error}</p>}
        {msg && <p className={msg.ok ? ix.msgOk : ix.msgErr} style={{ marginBottom: "1.4rem" }}>{msg.text}</p>}

        <section className={`${ix.panel} ${ix.panelWide}`}>
          <div className={ix.panelHead}>
            <h2 className={ix.panelTitle}>Compare individual performance</h2>
            <span className={ix.panelNote}>This month · targets and commission are editable</span>
          </div>
          <div className={ix.tableWrap}>
            <table className={ix.table}>
              <thead>
                <tr>
                  <th>Person</th>
                  <th className={ix.num}>Leads</th>
                  <th className={ix.num}>Booked</th>
                  <th className={ix.num}>Conversion</th>
                  <th className={ix.num}>This month</th>
                  <th className={ix.num}>Monthly target (₹)</th>
                  <th className={ix.num}>Commission %</th>
                  <th className={ix.num}>Earned</th>
                  <th>Activity</th>
                  <th>Access</th>
                </tr>
              </thead>
              <tbody>
                {d?.team.map((m) => (
                  <MemberRow key={m.id} m={m} settings={d.settings} call={call} />
                ))}
                {d && d.team.length === 0 && (
                  <tr>
                    <td colSpan={10}>No team members yet — create the first account below.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <div className={ix.grid2}>
          <CreateAccount call={call} pending={d?.pending ?? []} />
          {d && <Commission settings={d.settings} call={call} />}
        </div>

        <section className={`${ix.panel} ${ix.panelWide}`}>
          <div className={ix.panelHead}>
            <h2 className={ix.panelTitle}>Assign leads</h2>
            <span className={ix.panelNote}>{d?.unassignedLeads.length ?? 0} unassigned · reassign any client from the Clients page</span>
          </div>
          {d && d.unassignedLeads.length === 0 && <p className={ix.empty}>Every lead has a relationship manager.</p>}
          <ul className={ix.list}>
            {d?.unassignedLeads.map((l) => (
              <li key={l.id}>
                <span className={ix.listTitle}>
                  <a href={`/desk/clients?c=${l.id}`}>{l.name}</a>
                </span>
                <select
                  defaultValue=""
                  aria-label={`Assign ${l.name}`}
                  onChange={(e) =>
                    e.target.value &&
                    call("PATCH", "/api/portal/clients", { clientId: l.id, managerId: e.target.value }, `${l.name} assigned — they've been notified.`)
                  }
                >
                  <option value="">Assign to…</option>
                  {sales.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                  <option value={me.id}>Myself</option>
                </select>
                <span className={ix.listSub}>
                  {[l.phone, l.location, `signed up ${formatDateLong(l.createdAt.slice(0, 10))}`].filter(Boolean).join(" · ")}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <div className={ix.grid2}>
          <section className={ix.panel}>
            <div className={ix.panelHead}>
              <h2 className={ix.panelTitle}>Salesperson activity</h2>
              <span className={ix.panelNote}>Latest first</span>
            </div>
            <ul className={ix.list}>
              {d?.activity.slice(0, 40).map((a, i) => (
                <li key={i}>
                  <span className={ix.listTitle}>
                    <b>{a.by}</b> {ACTION[a.action] ?? a.action} · <a href={`/desk?q=${a.quoteId}`}>{a.couple}</a>
                  </span>
                  <span className={ix.panelNote}>{ago(a.at)}</span>
                  {(a.note || a.price) && (
                    <span className={ix.listSub}>
                      {a.price ? formatINR(a.price) : ""}
                      {a.price && a.note ? " — " : ""}
                      {a.note}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </section>
          <section className={ix.panel}>
            <div className={ix.panelHead}>
              <h2 className={ix.panelTitle}>All conversations & notes</h2>
              <input style={{ maxWidth: 220, padding: "0.5rem 0.7rem", border: "1px solid var(--line)", background: "#fffdf8", font: "inherit", fontSize: 13 }} value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Filter…" aria-label="Filter conversations" />
            </div>
            {d && conversations.length === 0 && <p className={ix.empty}>Nothing yet.</p>}
            <ul className={ix.list}>
              {conversations.map((c, i) => (
                <li key={i}>
                  <span className={ix.listTitle}>
                    <b>{c.by}</b> · {c.kind}
                  </span>
                  <span className={ix.panelNote}>{ago(c.at)}</span>
                  <span className={ix.listSub}>
                    {c.quoteId ? <a href={`/desk?q=${c.quoteId}`}>{c.couple}</a> : c.couple}
                    {c.reference ? ` · ${c.reference}` : ""} — “{c.text}”
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}

function MemberRow({ m, settings, call }: { m: Member; settings: SalesSettings; call: (method: string, url: string, payload: unknown, ok: string) => Promise<boolean> }) {
  const [target, setTarget] = useState(String(settings.targets[m.id] ?? ""));
  const [rate, setRate] = useState(settings.commissionOverrides[m.id] !== undefined ? String(settings.commissionOverrides[m.id]) : "");
  const s = m.stats;
  async function saveNumbers() {
    const targets = { ...settings.targets, [m.id]: Number(target) || 0 };
    const overrides: Record<string, number | string> = { ...settings.commissionOverrides };
    if (rate.trim() === "") delete overrides[m.id];
    else overrides[m.id] = Number(rate);
    await call("PUT", "/api/portal/team", { ...settings, targets, commissionOverrides: overrides }, `${m.name}'s target and commission saved.`);
  }
  return (
    <tr style={m.active ? undefined : { opacity: 0.55 }}>
      <td>
        <b>{m.name}</b>
        <div className={ix.jobMeta}>
          {m.role === "owner" ? "Founder level" : "Sales"} · {m.email}
        </div>
      </td>
      <td className={ix.num}>{s.leads}</td>
      <td className={ix.num}>{s.bookings}</td>
      <td className={ix.num}>{s.conversion}%</td>
      <td className={ix.num}>
        {lakh(s.revenueThisMonth)}
        {s.target > 0 && <div className={ix.jobMeta}>{s.targetProgress}% of target</div>}
      </td>
      <td className={ix.num}>
        <input style={{ width: 110, textAlign: "right" }} inputMode="numeric" value={target} onChange={(e) => setTarget(e.target.value)} onBlur={saveNumbers} aria-label={`${m.name} monthly target`} placeholder="—" />
      </td>
      <td className={ix.num}>
        <input style={{ width: 64, textAlign: "right" }} inputMode="decimal" value={rate} onChange={(e) => setRate(e.target.value)} onBlur={saveNumbers} aria-label={`${m.name} commission percent`} placeholder={String(settings.commissionPct)} />
      </td>
      <td className={ix.num}>{formatINR(s.commission.total)}</td>
      <td>
        {s.activity30} actions in 30 days
        <div className={ix.jobMeta}>{m.lastLoginAt ? `Signed in ${ago(m.lastLoginAt)}` : "Never signed in"}</div>
        {s.followupsOverdue > 0 && <div className={`${ix.jobMeta} ${ix.overdue}`}>{s.followupsOverdue} overdue follow-ups</div>}
      </td>
      <td>
        <label className={ix.jobMeta} style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <input type="checkbox" checked={m.seeAllLeads} onChange={(e) => call("PATCH", "/api/portal/team", { id: m.id, seeAllLeads: e.target.checked }, e.target.checked ? `${m.name} can now see every lead.` : `${m.name} now sees only their own leads.`)} />
          Sees all leads
        </label>
        <button
          className={base.btnGhost}
          onClick={() => {
            if (m.active && !window.confirm(`Deactivate ${m.name}? They are signed out at once and can't sign in again until you reactivate them.`)) return;
            void call("PATCH", "/api/portal/team", { id: m.id, active: !m.active }, m.active ? `${m.name} is deactivated.` : `${m.name} is active again.`);
          }}
        >
          {m.active ? "Deactivate" : "Reactivate"}
        </button>
      </td>
    </tr>
  );
}

function CreateAccount({ call, pending }: { call: (method: string, url: string, payload: unknown, ok: string) => Promise<boolean>; pending: TeamData["pending"] }) {
  const [f, setF] = useState({ name: "", email: "", phone: "", password: "", role: "sales" });
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF((x) => ({ ...x, [k]: e.target.value }));
  return (
    <section className={ix.panel}>
      <div className={ix.panelHead}>
        <h2 className={ix.panelTitle}>Create a sales account</h2>
      </div>
      <div className={ix.form}>
        <div className={ix.formRow}>
          <label>
            Name
            <input value={f.name} onChange={set("name")} />
          </label>
          <label>
            Level
            <select value={f.role} onChange={set("role")}>
              <option value="sales">Sales</option>
              <option value="owner">Founder level</option>
            </select>
          </label>
        </div>
        <div className={ix.formRow}>
          <label>
            Email
            <input type="email" value={f.email} onChange={set("email")} />
          </label>
          <label>
            Mobile
            <input value={f.phone} onChange={set("phone")} />
          </label>
        </div>
        <label>
          Temporary password
          <input value={f.password} onChange={set("password")} placeholder="Share it with them privately" />
        </label>
        <button
          className={base.btnPrimary}
          onClick={async () => {
            if (await call("POST", "/api/portal/team", f, `${f.name}'s account is ready — they sign in at /desk/login.`)) setF({ name: "", email: "", phone: "", password: "", role: "sales" });
          }}
        >
          Create account
        </button>
        {pending.length > 0 && (
          <p className={ix.panelNote}>
            Authorised but not activated yet: {pending.map((p) => `${p.name} (${p.email})`).join(", ")}
          </p>
        )}
      </div>
    </section>
  );
}

function Commission({ settings, call }: { settings: SalesSettings; call: (method: string, url: string, payload: unknown, ok: string) => Promise<boolean> }) {
  const [pct, setPct] = useState(String(settings.commissionPct));
  const [bonus, setBonus] = useState(String(settings.bonusPctAboveTarget));
  return (
    <section className={ix.panel}>
      <div className={ix.panelHead}>
        <h2 className={ix.panelTitle}>Commission & incentives</h2>
        {settings.updatedAt && <span className={ix.panelNote}>Updated by {settings.updatedBy}</span>}
      </div>
      <div className={ix.form}>
        <div className={ix.formRow}>
          <label>
            Commission on booked value (%)
            <input inputMode="decimal" value={pct} onChange={(e) => setPct(e.target.value)} />
          </label>
          <label>
            Extra above monthly target (%)
            <input inputMode="decimal" value={bonus} onChange={(e) => setBonus(e.target.value)} />
          </label>
        </div>
        <p className={ix.panelNote}>
          Example: with {pct || 0}% commission and {bonus || 0}% extra, a ₹10L month against an ₹8L target earns{" "}
          {formatINR(Math.round(1000000 * (Number(pct) || 0) / 100 + 200000 * (Number(bonus) || 0) / 100))}. Per-person rates in the table override the
          default.
        </p>
        <button className={base.btnSecondary} onClick={() => call("PUT", "/api/portal/team", { ...settings, commissionPct: Number(pct), bonusPctAboveTarget: Number(bonus) }, "Commission structure saved.")}>
          Save commission
        </button>
      </div>
    </section>
  );
}
