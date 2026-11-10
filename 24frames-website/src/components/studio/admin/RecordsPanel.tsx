"use client";

import { useEffect, useState } from "react";
import styles from "../admin.module.css";
import base from "../studio.module.css";
import CommissionSheet from "../CommissionSheet";
import ShareCenter from "../ShareCenter";
import { stashDraftForNewConsultation } from "../state/store";
import { formatDateLong, formatINR, formatTimestamp } from "@/lib/commission/format";
import { uid } from "@/lib/commission/model";
import type { CommissionRecord, CommissionSummaryRow } from "@/lib/commission/types";

export default function RecordsPanel() {
  const [q, setQ] = useState("");
  const [rows, setRows] = useState<CommissionSummaryRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState<CommissionRecord | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  useEffect(() => {
    const t = window.setTimeout(async () => {
      const res = await fetch(`/api/studio/commissions?q=${encodeURIComponent(q)}`, { cache: "no-store" }).catch(() => null);
      if (res?.status === 403) { window.location.reload(); return; }
      const data = res ? await res.json().catch(() => ({})) : {};
      if (res?.ok) {
        setRows(data.commissions);
        setError(null);
      } else {
        setError(data.error ?? "Records could not be loaded.");
        setRows([]);
      }
    }, 220);
    return () => window.clearTimeout(t);
  }, [q]);

  async function openRecord(id: string) {
    setLoadingId(id);
    const res = await fetch(`/api/studio/commissions/${id}`, { cache: "no-store" }).catch(() => null);
    if (res?.status === 403) { window.location.reload(); return; }
    const data = res ? await res.json().catch(() => ({})) : {};
    setLoadingId(null);
    if (res?.ok) setOpen(data.record);
    else setError(data.error ?? "That commission could not be opened.");
  }

  function duplicate(record: CommissionRecord) {
    const now = new Date().toISOString();
    stashDraftForNewConsultation({
      ...record.draft,
      id: uid("draft"),
      createdAt: now,
      updatedAt: now,
      duplicatedFrom: record.id,
    });
    window.location.assign("/quotebuilder");
  }

  if (open) {
    return (
      <div className={styles.record}>
        <div className={styles.recordBar}>
          <button className={base.btnText} onClick={() => setOpen(null)}>← All commissions</button>
          <span className={base.mono}>
            {open.reference} · SUBMITTED {formatTimestamp(open.createdAt).toUpperCase()} · {open.consultant.toUpperCase()} · CONFIG V{open.configVersion}
          </span>
          <button className={base.btnSecondary} onClick={() => duplicate(open)}>Duplicate into a new consultation</button>
        </div>
        <p className={styles.fine}>
          Shown exactly as submitted, priced with the studio configuration of that moment. A duplicate is re-priced with
          today&apos;s configuration.
        </p>
        <CommissionSheet config={open.configSnapshot} draft={open.draft} quote={open.quote} reference={open.reference} />
        <ShareCenter record={open} />
      </div>
    );
  }

  return (
    <div>
      <div className={styles.searchRow}>
        <label className={base.field}>
          <span className={base.fieldLabel}>Search commissions</span>
          <input className={base.input} type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Couple name, reference, phone, city…" />
        </label>
      </div>
      {error && <div className={base.banner} role="alert">{error}</div>}
      {rows === null ? (
        <p className={styles.fine}>Loading records…</p>
      ) : rows.length === 0 ? (
        <div className={styles.empty}>
          <p>{q ? "No commissions match that search." : "No commissions have been submitted yet."}</p>
          <p className={styles.fine}>Submitted consultations appear here with their full selections, pricing and proposal.</p>
        </div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">Couple</th>
                <th scope="col">Reference</th>
                <th scope="col">Wedding</th>
                <th scope="col">Events</th>
                <th scope="col">Delivery</th>
                <th scope="col">Estimated total</th>
                <th scope="col">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td>
                    <button className={styles.rowLink} onClick={() => openRecord(r.id)} disabled={loadingId === r.id}>
                      {r.coupleNames}
                    </button>
                    <small>{r.city}</small>
                  </td>
                  <td className={base.mono}>{r.reference}</td>
                  <td>{/^\d{4}-\d{2}-\d{2}$/.test(r.weddingDate) ? formatDateLong(r.weddingDate) : r.weddingDate || "—"}</td>
                  <td>{r.eventCount}</td>
                  <td>{r.deliveryLabel ?? "—"}</td>
                  <td>{formatINR(r.grandTotal)}</td>
                  <td>{formatTimestamp(r.createdAt)}<small>{r.consultant}</small></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
