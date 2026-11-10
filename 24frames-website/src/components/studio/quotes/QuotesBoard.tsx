"use client";

import { useEffect, useMemo, useState } from "react";
import cx from "../cinema.module.css";
import base from "../studio.module.css";
import qx from "./quotes.module.css";
import CommissionSheet from "../CommissionSheet";
import ShareCenter from "../ShareCenter";
import { formatINR, formatTimestamp, todayISO } from "@/lib/commission/format";
import type { CommissionRecord, CommissionSummaryRow } from "@/lib/commission/types";

type Bucket = "past" | "week" | "upcoming" | "tbc";
type Filter = "all" | Bucket | "month";

const BUCKETS: { id: Bucket; title: string; note: string }[] = [
  { id: "past", title: "Before", note: "Celebrations that have already happened" },
  { id: "week", title: "Present", note: "Today and the next seven days" },
  { id: "upcoming", title: "After", note: "Celebrations still to come" },
  { id: "tbc", title: "Date to be confirmed", note: "No exact date given yet" },
];

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "past", label: "Before" },
  { id: "week", label: "This week" },
  { id: "month", label: "This month" },
  { id: "upcoming", label: "After" },
  { id: "tbc", label: "Date TBC" },
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const isISO = (d: string) => /^\d{4}-\d{2}-\d{2}$/.test(d);
const plusDays = (iso: string, n: number) => {
  const [y, m, d] = iso.split("-").map(Number);
  const t = new Date(Date.UTC(y, m - 1, d + n));
  return t.toISOString().slice(0, 10);
};

function bucketOf(date: string, today: string): Bucket {
  if (!isISO(date)) return "tbc";
  if (date < today) return "past";
  if (date <= plusDays(today, 7)) return "week";
  return "upcoming";
}

export default function QuotesBoard({ consultant }: { consultant: string }) {
  const [rows, setRows] = useState<CommissionSummaryRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [who, setWho] = useState("");
  const [open, setOpen] = useState<CommissionRecord | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const today = todayISO();

  useEffect(() => {
    let alive = true;
    (async () => {
      const res = await fetch("/api/studio/commissions", { cache: "no-store" }).catch(() => null);
      if (!alive) return;
      if (res && (res.status === 401 || res.status === 403)) { window.location.reload(); return; }
      const data = res ? await res.json().catch(() => ({})) : {};
      if (res?.ok) setRows(data.commissions ?? []);
      else { setError(data.error ?? "The quote book could not be loaded."); setRows([]); }
    })();
    return () => { alive = false; };
  }, []);

  const consultants = useMemo(() => [...new Set((rows ?? []).map((r) => r.consultant))].sort(), [rows]);

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const month = today.slice(0, 7);
    return (rows ?? [])
      .filter((r) => !who || r.consultant === who)
      .filter((r) => !needle || `${r.coupleNames} ${r.reference} ${r.city} ${r.consultant} ${r.weddingDate}`.toLowerCase().includes(needle))
      .filter((r) => {
        if (filter === "all") return true;
        if (filter === "month") return isISO(r.weddingDate) && r.weddingDate.startsWith(month);
        return bucketOf(r.weddingDate, today) === filter;
      });
  }, [rows, q, filter, who, today]);

  // Before → present → after, each in date order, so the list reads like a calendar.
  const grouped = useMemo(() => {
    const g: Record<Bucket, CommissionSummaryRow[]> = { past: [], week: [], upcoming: [], tbc: [] };
    for (const r of shown) g[bucketOf(r.weddingDate, today)].push(r);
    for (const k of ["past", "week", "upcoming"] as Bucket[]) g[k].sort((a, b) => a.weddingDate.localeCompare(b.weddingDate));
    g.tbc.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return g;
  }, [shown, today]);

  const totals = useMemo(() => ({
    count: shown.length,
    value: shown.reduce((s, r) => s + r.grandTotal, 0),
    ahead: shown.filter((r) => ["week", "upcoming"].includes(bucketOf(r.weddingDate, today))).length,
  }), [shown, today]);

  async function openRecord(id: string) {
    setLoadingId(id);
    const res = await fetch(`/api/studio/commissions/${id}`, { cache: "no-store" }).catch(() => null);
    if (res && (res.status === 401 || res.status === 403)) { window.location.reload(); return; }
    const data = res ? await res.json().catch(() => ({})) : {};
    setLoadingId(null);
    if (res?.ok) { setOpen(data.record); window.scrollTo({ top: 0 }); }
    else setError(data.error ?? "That quote could not be opened.");
  }

  async function signOut() {
    await fetch("/api/studio/auth", { method: "DELETE" }).catch(() => null);
    window.location.reload();
  }

  return (
    <div className={`${cx.cinema} ${qx.page}`}>
      <header className={qx.top}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={qx.logo} src="/images/logo-dark-header.png" alt="24 Frames" />
        <span className={qx.topTitle}>The Quote Book</span>
        <span className={qx.topRight}>
          <span className={qx.who}>{consultant}</span>
          <a className={base.btnText} href="/quotebuilder">New consultation</a>
          <button className={base.btnText} onClick={signOut}>Sign out</button>
        </span>
      </header>

      {open ? (
        <main className={qx.main}>
          <div className={qx.recordBar}>
            <button className={base.btnSecondary} onClick={() => setOpen(null)}>← All quotes</button>
            <span className={base.mono}>
              {open.reference} · {formatTimestamp(open.createdAt).toUpperCase()} · {open.consultant.toUpperCase()}
            </span>
          </div>
          <CommissionSheet config={open.configSnapshot} draft={open.draft} quote={open.quote} reference={open.reference} />
          <ShareCenter record={open} />
        </main>
      ) : (
        <main className={qx.main}>
          <div className={qx.head}>
            <div>
              <p className={base.kicker}>Every commission</p>
              <h1 className={qx.title}>Quotes, <em>before, present &amp; after.</em></h1>
            </div>
            <dl className={qx.stats}>
              <div><dt>Quotes</dt><dd>{totals.count}</dd></div>
              <div><dt>Still ahead</dt><dd>{totals.ahead}</dd></div>
              <div><dt>Total value</dt><dd>{formatINR(totals.value)}</dd></div>
            </dl>
          </div>

          <div className={qx.tools}>
            <label className={qx.search}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5" /><path d="M16 16l4.5 4.5" /></svg>
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search couple, reference, city or consultant" aria-label="Search quotes" />
              {q && <button type="button" onClick={() => setQ("")} aria-label="Clear search">×</button>}
            </label>
            <div className={qx.chips} role="group" aria-label="Quick filters">
              {FILTERS.map((f) => (
                <button key={f.id} type="button" aria-pressed={filter === f.id} className={filter === f.id ? qx.chipOn : ""} onClick={() => setFilter(f.id)}>
                  {f.label}
                </button>
              ))}
            </div>
            {consultants.length > 1 && (
              <select className={qx.select} value={who} onChange={(e) => setWho(e.target.value)} aria-label="Consultant">
                <option value="">All consultants</option>
                {consultants.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            )}
          </div>

          {error && <p className={qx.error} role="alert">{error}</p>}
          {rows === null && <p className={qx.empty}>Opening the quote book…</p>}
          {rows !== null && shown.length === 0 && !error && (
            <p className={qx.empty}>{rows.length ? "No quotes match this search." : "No quotes have been submitted yet."}</p>
          )}

          {BUCKETS.filter((b) => grouped[b.id].length).map((b) => (
            <section key={b.id} className={qx.bucket} data-bucket={b.id}>
              <header className={qx.bucketHead}>
                <h2>{b.title}</h2>
                <span>{b.note} · {grouped[b.id].length}</span>
              </header>
              <ul className={qx.list}>
                {grouped[b.id].map((r) => {
                  const dated = isISO(r.weddingDate);
                  const [, mm, dd] = dated ? r.weddingDate.split("-") : [];
                  return (
                    <li key={r.id}>
                      <button className={qx.row} onClick={() => openRecord(r.id)} disabled={loadingId === r.id}>
                        <span className={qx.date}>
                          {dated ? (<><b>{Number(dd)}</b><i>{MONTHS[Number(mm) - 1]} {r.weddingDate.slice(0, 4)}</i></>) : <i>{r.weddingDate || "TBC"}</i>}
                        </span>
                        <span className={qx.who2}>
                          <b>{r.coupleNames}</b>
                          <small>{[r.city, `${r.eventCount} ${r.eventCount === 1 ? "occasion" : "occasions"}`, r.deliveryLabel].filter(Boolean).join(" · ")}</small>
                        </span>
                        <span className={qx.meta}>
                          <small>{r.reference}</small>
                          <small>{r.consultant} · {formatTimestamp(r.createdAt)}</small>
                        </span>
                        <span className={qx.total}>{formatINR(r.grandTotal)}</span>
                        <span className={qx.go} aria-hidden="true">{loadingId === r.id ? "…" : "→"}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </main>
      )}
    </div>
  );
}
