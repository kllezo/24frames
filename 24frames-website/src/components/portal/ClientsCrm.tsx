"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import cx from "../studio/cinema.module.css";
import base from "../studio/studio.module.css";
import qx from "../studio/quotes/quotes.module.css";
import px from "./portal.module.css";
import ix from "./insights.module.css";
import DeskTop from "./DeskTop";
import { Detail, type StaffMember } from "./Desk";
import { formatDateLong, formatINR } from "@/lib/commission/format";
import { coupleNames } from "@/lib/commission/model";
import type { StudioConfig } from "@/lib/commission/types";
import { factorLabel } from "@/lib/portal/pricing";
import {
  SOURCE_LABEL,
  STATUS_LABEL,
  type CrmClient,
  type FollowUp,
  type LeadSource,
  type PortalQuote,
  type PublicAccount,
} from "@/lib/portal/types";

const when = (iso: string | null) => (iso ? formatDateLong(iso.slice(0, 10)) : "—");

/* The client CRM: everyone who signed up online — name, mobile, email,
   location — and where their latest quotation stands. Click a client to
   open their quotations (current and past) right here, beside the list. */
export default function ClientsCrm({ me, config }: { me: PublicAccount; config: StudioConfig }) {
  const [rows, setRows] = useState<CrmClient[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [mine, setMine] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const isOwner = me.role === "owner";

  useEffect(() => {
    fetch("/api/portal/staff", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { staff: [] }))
      .then((d: { staff?: StaffMember[] }) => setStaff(d.staff ?? []))
      .catch(() => null);
    const c = new URLSearchParams(window.location.search).get("c");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (c) setOpenId(c);
  }, []);

  const load = useCallback(async () => {
    const res = await fetch("/api/portal/clients", { cache: "no-store" }).catch(() => null);
    if (res?.status === 401) return window.location.assign("/desk/login");
    const data = res ? ((await res.json().catch(() => ({}))) as { clients?: CrmClient[]; error?: string }) : {};
    if (res?.ok && data.clients) setRows(data.clients);
    else setError(data.error ?? "Could not load clients.");
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  async function assign(clientId: string, managerId: string | null) {
    const res = await fetch("/api/portal/clients", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId, managerId }),
    }).catch(() => null);
    const data = res ? ((await res.json().catch(() => ({}))) as { managerId?: string | null; managerName?: string | null; error?: string }) : {};
    if (res?.ok) setRows((rs) => (rs ?? []).map((r) => (r.id === clientId ? { ...r, managerId: data.managerId ?? null, managerName: data.managerName ?? null } : r)));
    else setError(data.error ?? "Could not assign the relationship manager.");
  }

  const cities = useMemo(
    () => Array.from(new Set((rows ?? []).map((r) => r.location.trim()).filter(Boolean))).sort((a, b) => a.localeCompare(b)),
    [rows],
  );
  const shown = useMemo(() => {
    const t = search.trim().toLowerCase();
    return (rows ?? []).filter(
      (r) =>
        (!mine || r.managerId === me.id) &&
        (!city || r.location.trim() === city) &&
        (!t || [r.name, r.email, r.phone, r.location, r.latestReference ?? ""].join(" ").toLowerCase().includes(t)),
    );
  }, [rows, search, city, mine, me.id]);

  const thisMonth = (rows ?? []).filter((r) => r.createdAt.slice(0, 7) === new Date().toISOString().slice(0, 7)).length;
  const open = rows?.find((r) => r.id === openId) ?? null;

  function exportCsv() {
    const esc = (v: string | number | null) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const head = ["Name", "Mobile", "Email", "Location", "Source", "Relationship manager", "Signed up", "Last sign-in", "Quotations", "Latest reference", "Latest status", "Latest value"];
    const lines = shown.map((r) =>
      [r.name, r.phone, r.email, r.location, SOURCE_LABEL[r.source], r.managerName ?? "", r.createdAt.slice(0, 10), r.lastLoginAt?.slice(0, 10) ?? "", r.quotes, r.latestReference ?? "", r.latestStatus ? STATUS_LABEL[r.latestStatus] : "", r.latestValue ?? ""]
        .map(esc)
        .join(","),
    );
    const blob = new Blob([[head.map(esc).join(","), ...lines].join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `24-frames-clients-${new Date().toISOString().slice(0, 10)}.csv`;
    a.setAttribute("data-no-transition", "");
    a.click();
    window.setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  }

  return (
    <div className={`${cx.cinema} ${qx.page}`}>
      <DeskTop me={me} current="clients" />
      <main className={qx.main}>
        <section className={ix.hero}>
          <p className={ix.heroKicker}>Client CRM</p>
          <h1 className={ix.heroTitle}>
            Every couple who <em>found us.</em>
          </h1>
          <p className={ix.heroLine}>
            {isOwner
              ? "Every lead in the studio. Choose a client to open their quotations, set custom rates or plan a follow-up."
              : "Your leads (and unassigned ones). Choose a client to open their quotations, set custom rates or plan a follow-up."}
          </p>
        </section>

        <dl className={ix.kpis}>
          <div className={ix.kpi}>
            <dt>Clients</dt>
            <dd>{rows ? rows.length : "—"}</dd>
          </div>
          <div className={ix.kpi}>
            <dt>New this month</dt>
            <dd>{rows ? thisMonth : "—"}</dd>
          </div>
          <div className={ix.kpi}>
            <dt>With a quotation</dt>
            <dd>{rows ? rows.filter((r) => r.quotes > 0).length : "—"}</dd>
          </div>
          <div className={ix.kpi}>
            <dt>On custom rates</dt>
            <dd>{rows ? rows.filter((r) => r.priceFactor).length : "—"}</dd>
          </div>
        </dl>

        <div className={qx.tools}>
          <select className={px.searchInput} style={{ maxWidth: 220, marginLeft: 0 }} value={city} onChange={(e) => setCity(e.target.value)} aria-label="Filter by location">
            <option value="">All locations</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <label className={px.mineToggle}>
            <input type="checkbox" checked={mine} onChange={(e) => setMine(e.target.checked)} />
            <span>Only my clients</span>
          </label>
          <input className={px.searchInput} type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, mobile, email or reference" aria-label="Search clients" />
          <button className={base.btnSecondary} onClick={exportCsv} disabled={!shown.length}>
            Export CSV
          </button>
        </div>

        {error && <p className={qx.error} role="alert">{error}</p>}

        <div className={`${px.tableWrap} ${ix.panel}`} style={{ padding: 0 }}>
          <table className={px.table}>
            <thead>
              <tr>
                <th>Client</th>
                <th>Mobile</th>
                <th>Location</th>
                <th>Relationship manager</th>
                <th>Signed up</th>
                <th>Latest quotation</th>
              </tr>
            </thead>
            <tbody>
              {rows === null && !error && (
                <tr>
                  <td colSpan={6}>Loading…</td>
                </tr>
              )}
              {rows !== null && shown.length === 0 && (
                <tr>
                  <td colSpan={6}>No clients match.</td>
                </tr>
              )}
              {shown.map((r) => {
                const wa = r.phone.replace(/[^\d]/g, "");
                return (
                  <tr
                    key={r.id}
                    className={`${ix.rowButton} ${r.id === openId ? ix.rowOn : ""}`}
                    onClick={(e) => {
                      if ((e.target as HTMLElement).closest("a,select,button,input")) return;
                      setOpenId(r.id);
                    }}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") setOpenId(r.id);
                    }}
                    aria-label={`Open ${r.name}`}
                  >
                    <td>
                      <span className={px.cellName}>{r.name}</span>
                      <span className={px.cellSub}>
                        <a href={`mailto:${r.email}`}>{r.email}</a>
                      </span>
                      {r.priceFactor && <span className={`${ix.pill} ${ix.pillGold}`}>{factorLabel(r.priceFactor)}</span>}
                    </td>
                    <td>
                      {r.phone ? <a href={`tel:${r.phone}`}>{r.phone}</a> : "—"}
                      {wa && (
                        <span className={px.cellSub}>
                          <a href={`https://wa.me/${wa}`} target="_blank" rel="noreferrer">
                            WhatsApp
                          </a>
                        </span>
                      )}
                    </td>
                    <td>
                      {r.location || "—"}
                      <span className={px.cellSub}>{SOURCE_LABEL[r.source]}</span>
                    </td>
                    <td>
                      {isOwner ? (
                        <select
                          className={px.cellSelect}
                          value={r.managerId ?? ""}
                          onChange={(e) => assign(r.id, e.target.value || null)}
                          aria-label={`Relationship manager for ${r.name}`}
                        >
                          <option value="">Not assigned</option>
                          {staff.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className={px.cellName}>{r.managerName ?? "Not assigned"}</span>
                      )}
                    </td>
                    <td>
                      {when(r.createdAt)}
                      <span className={px.cellSub}>Last in {when(r.lastLoginAt)}</span>
                    </td>
                    <td>
                      {r.latestStatus ? (
                        <>
                          <span className={`${px.chip} ${px[`chip_${r.latestStatus}`] ?? ""}`}>{STATUS_LABEL[r.latestStatus]}</span>
                          <span className={px.cellSub}>
                            {r.latestReference} · {r.latestValue !== null ? formatINR(r.latestValue) : "—"}
                            {r.quotes > 1 ? ` · ${r.quotes} quotations` : ""}
                          </span>
                        </>
                      ) : (
                        <span className={px.cellSub}>No quotation yet</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>

      {open && (
        <ClientDrawer
          client={open}
          me={me}
          config={config}
          staff={staff}
          onClose={() => setOpenId(null)}
          onClientChange={(patch) => setRows((rs) => (rs ?? []).map((r) => (r.id === open.id ? { ...r, ...patch } : r)))}
        />
      )}
    </div>
  );
}

/* One client, beside the list: their details, custom rates, follow-ups and
   every quotation they have made — choose one to see it in full. */
function ClientDrawer({
  client,
  me,
  config,
  staff,
  onClose,
  onClientChange,
}: {
  client: CrmClient;
  me: PublicAccount;
  config: StudioConfig;
  staff: StaffMember[];
  onClose: () => void;
  onClientChange: (patch: Partial<CrmClient>) => void;
}) {
  const [quotes, setQuotes] = useState<PortalQuote[] | null>(null);
  const [active, setActive] = useState<string | null>(null);
  const [followups, setFollowups] = useState<FollowUp[]>([]);
  const canPrice = me.role === "owner" || client.managerId === me.id;

  const load = useCallback(async () => {
    const [qr, fr] = await Promise.all([
      fetch("/api/portal/quotes", { cache: "no-store" }).catch(() => null),
      fetch("/api/portal/followups", { cache: "no-store" }).catch(() => null),
    ]);
    const qd = qr?.ok ? ((await qr.json()) as { quotes: PortalQuote[] }) : { quotes: [] };
    const fd = fr?.ok ? ((await fr.json()) as { followups: FollowUp[] }) : { followups: [] };
    const mine = qd.quotes.filter((q) => q.clientId === client.id).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    setQuotes(mine);
    setActive((cur) => cur ?? mine.find((q) => q.status !== "draft")?.id ?? mine[0]?.id ?? null);
    setFollowups(fd.followups.filter((f) => f.clientId === client.id));
  }, [client.id]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [load, onClose]);

  const current = quotes?.find((q) => q.id === active) ?? null;

  return (
    <>
      <div className={ix.drawerShade} onClick={onClose} />
      <aside className={ix.drawer} role="dialog" aria-modal="true" aria-label={client.name}>
        <div className={ix.drawerHead}>
          <div>
            <p className={base.kicker}>
              {SOURCE_LABEL[client.source]} · signed up {when(client.createdAt)}
            </p>
            <h2 className={px.detailTitle}>{client.name}</h2>
            <p className={px.detailClient}>
              <a href={`mailto:${client.email}`}>{client.email}</a>
              {client.phone && (
                <>
                  {" "}· <a href={`tel:${client.phone}`}>{client.phone}</a>
                </>
              )}
              {client.location && <> · {client.location}</>} · RM {client.managerName ?? "not assigned"}
            </p>
          </div>
          <button className={ix.closeBtn} onClick={onClose}>
            Close
          </button>
        </div>

        <div className={ix.drawerBody}>
          <div className={ix.grid2} style={{ marginBottom: 0 }}>
            <Rates client={client} canPrice={canPrice} onChange={onClientChange} />
            <FollowUps client={client} quoteId={current?.id ?? null} list={followups} onChange={load} />
          </div>

          <section>
            <p className={base.kicker}>Quotations · {quotes ? quotes.length : "…"}</p>
            {quotes && quotes.length === 0 && <p className={ix.empty}>No quotation yet.</p>}
            <ul className={ix.quoteTabs}>
              {(quotes ?? []).map((q) => (
                <li key={q.id}>
                  <button className={`${ix.quoteTab} ${q.id === active ? ix.quoteTabOn : ""}`} onClick={() => setActive(q.id)}>
                    <b>
                      {q.reference} · {formatDateLong(q.updatedAt.slice(0, 10))}
                    </b>
                    <span>{coupleNames(q.draft.couple, q.clientName)}</span>
                    <span>
                      {q.lost ? "Lost" : STATUS_LABEL[q.status]} · {formatINR(q.finalPrice ?? q.quote.grandTotal)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>

          {current && (
            <section className={px.detail} style={{ minHeight: 0 }}>
              <Detail
                key={current.id}
                q={current}
                me={me}
                config={config}
                staff={staff}
                onChange={(q) => setQuotes((qs) => (qs ?? []).map((x) => (x.id === q.id ? q : x)))}
                onReload={load}
              />
            </section>
          )}
        </div>
      </aside>
    </>
  );
}

/* Custom rates for one client — they only ever see the adjusted prices. */
function Rates({ client, canPrice, onChange }: { client: CrmClient; canPrice: boolean; onChange: (patch: Partial<CrmClient>) => void }) {
  const [pct, setPct] = useState(client.priceFactor ? String(Math.round((client.priceFactor - 1) * 1000) / 10) : "");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [source, setSource] = useState<LeadSource>(client.source);

  async function save(factor: number | null) {
    setMsg(null);
    const res = await fetch("/api/portal/clients", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId: client.id, priceFactor: factor }),
    }).catch(() => null);
    const d = res ? ((await res.json().catch(() => ({}))) as { priceFactor?: number | null; label?: string; error?: string }) : {};
    if (res?.ok) {
      onChange({ priceFactor: d.priceFactor ?? null });
      setMsg({ ok: true, text: `${d.label}. Applies to every quotation they open or start from now on.` });
    } else setMsg({ ok: false, text: d.error ?? "Could not save." });
  }

  async function saveSource(next: LeadSource) {
    setSource(next);
    const res = await fetch("/api/portal/clients", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId: client.id, source: next }),
    }).catch(() => null);
    if (res?.ok) onChange({ source: next });
  }

  return (
    <div className={ix.panel}>
      <div className={ix.panelHead}>
        <h3 className={ix.panelTitle}>Rate card</h3>
        <span className={`${ix.pill} ${client.priceFactor ? ix.pillGold : ""}`}>{factorLabel(client.priceFactor)}</span>
      </div>
      {canPrice ? (
        <div className={ix.form}>
          <div className={ix.formRow}>
            <label>
              Adjustment on normal rates (%)
              <input inputMode="decimal" value={pct} onChange={(e) => setPct(e.target.value)} placeholder="e.g. 20 or -5" />
            </label>
            <button className={base.btnSecondary} onClick={() => save(pct.trim() ? 1 + Number(pct) / 100 : null)} disabled={pct.trim() !== "" && !Number.isFinite(Number(pct))}>
              Save rates
            </button>
          </div>
          {client.priceFactor && (
            <button className={base.btnGhost} onClick={() => (setPct(""), save(null))}>
              Back to standard rates
            </button>
          )}
          <label>
            Lead source
            <select value={source} onChange={(e) => saveSource(e.target.value as LeadSource)}>
              {(Object.keys(SOURCE_LABEL) as LeadSource[]).map((s) => (
                <option key={s} value={s}>
                  {SOURCE_LABEL[s]}
                </option>
              ))}
            </select>
          </label>
          <p className={ix.panelNote}>The client sees only the adjusted prices — on every visit, and in every quotation they redo.</p>
          {msg && <p className={msg.ok ? ix.msgOk : ix.msgErr}>{msg.text}</p>}
        </div>
      ) : (
        <p className={ix.empty}>Only the founder or this client&apos;s relationship manager sets their rates.</p>
      )}
    </div>
  );
}

function FollowUps({ client, quoteId, list, onChange }: { client: CrmClient; quoteId: string | null; list: FollowUp[]; onChange: () => void }) {
  const [kind, setKind] = useState<FollowUp["kind"]>("call");
  const [due, setDue] = useState(() => new Date(Date.now() + 86400000).toISOString().slice(0, 10));
  const [note, setNote] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const today = new Date().toISOString().slice(0, 10);

  async function add() {
    setErr(null);
    const res = await fetch("/api/portal/followups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId: client.id, quoteId, kind, due, note }),
    }).catch(() => null);
    if (res?.ok) {
      setNote("");
      onChange();
    } else setErr(((await res?.json().catch(() => ({}))) as { error?: string })?.error ?? "Could not add.");
  }
  async function toggle(f: FollowUp) {
    await fetch("/api/portal/followups", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: f.id, done: !f.done }) }).catch(() => null);
    onChange();
  }

  return (
    <div className={ix.panel}>
      <div className={ix.panelHead}>
        <h3 className={ix.panelTitle}>Follow-ups</h3>
        <span className={ix.panelNote}>{list.filter((f) => !f.done).length} open</span>
      </div>
      <ul className={ix.list}>
        {list.map((f) => (
          <li key={f.id}>
            <span className={ix.listTitle} style={f.done ? { textDecoration: "line-through", opacity: 0.6 } : undefined}>
              {f.kind[0].toUpperCase() + f.kind.slice(1)} · <span className={!f.done && f.due < today ? ix.overdue : ""}>{formatDateLong(f.due)}</span>
            </span>
            <button className={base.btnGhost} onClick={() => toggle(f)}>
              {f.done ? "Undo" : "Done"}
            </button>
            {(f.note || f.ownerName) && <span className={ix.listSub}>{[f.note, f.ownerName].filter(Boolean).join(" · ")}</span>}
          </li>
        ))}
      </ul>
      <div className={ix.form} style={{ marginTop: "1rem" }}>
        <div className={ix.formRow}>
          <label>
            Type
            <select value={kind} onChange={(e) => setKind(e.target.value as FollowUp["kind"])}>
              <option value="call">Call</option>
              <option value="meeting">Meeting</option>
              <option value="message">Message</option>
              <option value="task">Task</option>
            </select>
          </label>
          <label>
            Due
            <input type="date" value={due} onChange={(e) => setDue(e.target.value)} />
          </label>
        </div>
        <label>
          Note
          <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="What to cover" maxLength={600} />
        </label>
        <button className={base.btnSecondary} onClick={add}>
          Add follow-up
        </button>
        {err && <p className={ix.msgErr}>{err}</p>}
      </div>
    </div>
  );
}
