"use client";

import { useEffect, useMemo, useState } from "react";
import cx from "../studio/cinema.module.css";
import base from "../studio/studio.module.css";
import qx from "../studio/quotes/quotes.module.css";
import px from "./portal.module.css";
import DeskTop from "./DeskTop";
import { formatDateLong, formatINR } from "@/lib/commission/format";
import { STATUS_LABEL, type CrmClient, type PublicAccount } from "@/lib/portal/types";

const when = (iso: string | null) => (iso ? formatDateLong(iso.slice(0, 10)) : "—");

/* The client CRM: everyone who signed up online — name, mobile, email,
   location — and where their latest quotation stands. Exportable as CSV. */
export default function ClientsCrm({ me }: { me: PublicAccount }) {
  const [rows, setRows] = useState<CrmClient[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [staff, setStaff] = useState<{ id: string; name: string }[]>([]);
  const [mine, setMine] = useState(false);

  useEffect(() => {
    fetch("/api/portal/staff", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { staff: [] }))
      .then((d: { staff?: { id: string; name: string }[] }) => setStaff(d.staff ?? []))
      .catch(() => null);
  }, []);

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

  useEffect(() => {
    let alive = true;
    (async () => {
      const res = await fetch("/api/portal/clients", { cache: "no-store" }).catch(() => null);
      if (res?.status === 401) return window.location.assign("/desk/login");
      const data = res ? ((await res.json().catch(() => ({}))) as { clients?: CrmClient[]; error?: string }) : {};
      if (!alive) return;
      if (res?.ok && data.clients) setRows(data.clients);
      else setError(data.error ?? "Could not load clients.");
    })();
    return () => {
      alive = false;
    };
  }, []);

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

  function exportCsv() {
    const esc = (v: string | number | null) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const head = ["Name", "Mobile", "Email", "Location", "Relationship manager", "Signed up", "Last sign-in", "Quotations", "Latest reference", "Latest status", "Latest value"];
    const lines = shown.map((r) =>
      [r.name, r.phone, r.email, r.location, r.managerName ?? "", r.createdAt.slice(0, 10), r.lastLoginAt?.slice(0, 10) ?? "", r.quotes, r.latestReference ?? "", r.latestStatus ? STATUS_LABEL[r.latestStatus] : "", r.latestValue ?? ""]
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
        <div className={qx.head}>
          <div>
            <p className={base.kicker}>Client CRM</p>
            <h1 className={qx.title}>
              Every couple who <em>found us online.</em>
            </h1>
          </div>
          <dl className={qx.stats}>
            <div><dt>Clients</dt><dd>{rows ? rows.length : "—"}</dd></div>
            <div><dt>New this month</dt><dd>{rows ? thisMonth : "—"}</dd></div>
            <div><dt>With a quotation</dt><dd>{rows ? rows.filter((r) => r.quotes > 0).length : "—"}</dd></div>
          </dl>
        </div>

        <div className={qx.tools}>
          <select className={px.searchInput} style={{ maxWidth: 220, marginLeft: 0 }} value={city} onChange={(e) => setCity(e.target.value)} aria-label="Filter by location">
            <option value="">All locations</option>
            {cities.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <label className={px.mineToggle}>
            <input type="checkbox" checked={mine} onChange={(e) => setMine(e.target.checked)} />
            <span>Only my clients</span>
          </label>
          <input className={px.searchInput} type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, mobile, email or reference" aria-label="Search clients" />
          <button className={base.btnSecondary} onClick={exportCsv} disabled={!shown.length}>Export CSV</button>
        </div>

        {error && <p className={qx.error} role="alert">{error}</p>}

        <div className={px.tableWrap}>
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
                <tr><td colSpan={6}>Loading…</td></tr>
              )}
              {rows !== null && shown.length === 0 && (
                <tr><td colSpan={6}>No clients match.</td></tr>
              )}
              {shown.map((r) => {
                const wa = r.phone.replace(/[^\d]/g, "");
                return (
                  <tr key={r.id}>
                    <td>
                      <span className={px.cellName}>{r.name}</span>
                      <span className={px.cellSub}><a href={`mailto:${r.email}`}>{r.email}</a></span>
                    </td>
                    <td>
                      {r.phone ? <a href={`tel:${r.phone}`}>{r.phone}</a> : "—"}
                      {wa && (
                        <span className={px.cellSub}>
                          <a href={`https://wa.me/${wa}`} target="_blank" rel="noreferrer">WhatsApp</a>
                        </span>
                      )}
                    </td>
                    <td>{r.location || "—"}</td>
                    <td>
                      <select
                        className={px.cellSelect}
                        value={r.managerId ?? ""}
                        onChange={(e) => assign(r.id, e.target.value || null)}
                        aria-label={`Relationship manager for ${r.name}`}
                      >
                        <option value="">Not assigned</option>
                        {staff.map((s) => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
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
    </div>
  );
}
