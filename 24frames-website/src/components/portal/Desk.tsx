"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import cx from "../studio/cinema.module.css";
import base from "../studio/studio.module.css";
import qx from "../studio/quotes/quotes.module.css";
import px from "./portal.module.css";
import CommissionSheet from "../studio/CommissionSheet";
import DeskTop from "./DeskTop";
import { downloadBlob, useProposalPdf } from "../studio/ProposalPreview";
import { formatDateLong, formatINR } from "@/lib/commission/format";
import { coupleNames } from "@/lib/commission/model";
import type { StudioConfig } from "@/lib/commission/types";
import { STATUS_LABEL, type PortalQuote, type PublicAccount, type QuoteStatus } from "@/lib/portal/types";

type Tab = "inbox" | "approval" | "approved" | "returned" | "shared" | "all";

const TABS: { id: Tab; label: string; statuses?: QuoteStatus[] }[] = [
  { id: "inbox", label: "New & in review", statuses: ["submitted"] },
  { id: "approval", label: "Awaiting founder", statuses: ["pending_approval"] },
  { id: "approved", label: "Approved", statuses: ["approved"] },
  { id: "returned", label: "Returned", statuses: ["rejected"] },
  { id: "shared", label: "Shared with clients", statuses: ["sent", "accepted"] },
  { id: "all", label: "All" },
];

const ACTION_LABEL: Record<string, string> = {
  created: "Started the quotation",
  saved: "Saved",
  submitted: "Sent it to the studio",
  revised: "Revised the selections",
  priced: "Set the price",
  sent_for_approval: "Sent to the founder for approval",
  approved: "Approved",
  rejected: "Returned with a comment",
  forwarded: "Shared the quotation with the client",
  accepted: "Accepted the quotation",
  note: "Added a note",
};

/* The studio desk: sales review online quotations, set the final price,
   confirm with the client and ask the founder to approve; the founder
   approves or returns them with a comment; approved quotations are then
   shared back to the client. */
export default function Desk({ me, config }: { me: PublicAccount; config: StudioConfig }) {
  const [quotes, setQuotes] = useState<PortalQuote[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>(me.role === "owner" ? "approval" : "inbox");
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/portal/quotes", { cache: "no-store" }).catch(() => null);
    if (res?.status === 401) {
      window.location.assign("/desk/login");
      return;
    }
    const data = res ? ((await res.json().catch(() => ({}))) as { quotes?: PortalQuote[]; error?: string }) : {};
    if (res?.ok && data.quotes) {
      setQuotes(data.quotes);
      setError(null);
    } else setError(data.error ?? "The desk could not load quotations.");
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
    const t = window.setInterval(load, 30000);
    return () => window.clearInterval(t);
  }, [load]);

  const counts = useMemo(() => {
    const c: Partial<Record<Tab, number>> = {};
    for (const t of TABS) if (t.statuses) c[t.id] = (quotes ?? []).filter((q) => t.statuses!.includes(q.status)).length;
    return c;
  }, [quotes]);

  const shown = useMemo(() => {
    const t = TABS.find((x) => x.id === tab);
    const term = search.trim().toLowerCase();
    return (quotes ?? [])
      .filter((q) => q.status !== "draft" || tab === "all")
      .filter((q) => !t?.statuses || t.statuses.includes(q.status))
      .filter(
        (q) =>
          !term ||
          [q.reference, q.clientName, q.clientEmail, q.clientPhone, coupleNames(q.draft.couple, "")]
            .join(" ")
            .toLowerCase()
            .includes(term),
      );
  }, [quotes, tab, search]);

  const open = quotes?.find((q) => q.id === openId) ?? null;
  const replace = (q: PortalQuote) => setQuotes((qs) => (qs ?? []).map((x) => (x.id === q.id ? q : x)));

  return (
    <div className={`${cx.cinema} ${qx.page}`}>
      <DeskTop me={me} current="quotes" />

      <main className={qx.main}>
        <div className={qx.head}>
          <div>
            <p className={base.kicker}>{me.role === "owner" ? "Founder's desk" : "Sales desk"}</p>
            <h1 className={qx.title}>
              Online quotations, <em>from request to yes.</em>
            </h1>
          </div>
          <dl className={qx.stats}>
            <div><dt>In review</dt><dd>{counts.inbox ?? "—"}</dd></div>
            <div><dt>Awaiting founder</dt><dd>{counts.approval ?? "—"}</dd></div>
            <div><dt>Ready to share</dt><dd>{counts.approved ?? "—"}</dd></div>
          </dl>
        </div>

        <div className={qx.tools}>
          <div className={px.tabs} role="tablist" aria-label="Quotations">
            {TABS.map((t) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={tab === t.id}
                className={`${px.tab} ${tab === t.id ? px.tabOn : ""}`}
                onClick={() => {
                  setTab(t.id);
                  setOpenId(null);
                }}
              >
                {t.label}
                {counts[t.id] ? <span className={px.tabCount}>{counts[t.id]}</span> : null}
              </button>
            ))}
          </div>
          {(
            <input
              className={px.searchInput}
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search client, couple or reference"
              aria-label="Search quotations"
            />
          )}
        </div>

        {error && <p className={qx.error} role="alert">{error}</p>}

        {(
          <div className={px.split}>
            <ul className={px.list} aria-label="Quotations">
              {quotes === null && <li className={px.listEmpty}>Loading…</li>}
              {quotes !== null && shown.length === 0 && <li className={px.listEmpty}>Nothing here right now.</li>}
              {shown.map((q) => (
                <li key={q.id}>
                  <button className={`${px.row} ${q.id === openId ? px.rowOn : ""}`} onClick={() => setOpenId(q.id)}>
                    <span className={px.rowTop}>
                      <span className={px.rowRef}>{q.reference}</span>
                      <span className={`${px.chip} ${px[`chip_${q.status}`] ?? ""}`}>{STATUS_LABEL[q.status]}</span>
                    </span>
                    <span className={px.rowName}>{coupleNames(q.draft.couple, q.clientName)}</span>
                    <span className={px.rowMeta}>
                      {q.clientName} · {q.draft.events.length} occasion{q.draft.events.length === 1 ? "" : "s"} ·{" "}
                      {formatINR(q.finalPrice ?? q.quote.grandTotal)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            <section className={px.detail}>
              {open ? (
                <Detail key={open.id} q={open} me={me} config={config} onChange={replace} />
              ) : (
                <div className={px.detailEmpty}>
                  <p className={px.emptyTitle}>Choose a quotation</p>
                  <p className={qx.fine}>Its selections, price and history open here.</p>
                </div>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

function Detail({ q, me, config, onChange }: { q: PortalQuote; me: PublicAccount; config: StudioConfig; onChange: (q: PortalQuote) => void }) {
  const estimate = q.quote.grandTotal;
  const [price, setPrice] = useState(String(q.finalPrice ?? estimate));
  const [note, setNote] = useState(q.salesNote);
  const [confirmed, setConfirmed] = useState(false);
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [wantPdf, setWantPdf] = useState(false);
  const numeric = Math.round(Number(price.replace(/[^\d.]/g, "")) || 0);
  const delta = numeric - estimate;
  const pct = estimate ? (delta / estimate) * 100 : 0;
  const editingPrice = q.status === "submitted" || q.status === "rejected";
  const { state } = useProposalPdf(
    wantPdf ? { draft: q.draft, quote: q.quote, config, reference: q.reference, issuedAt: q.updatedAt, consultant: q.salesOwner ?? me.name, finalPrice: q.finalPrice } : null,
  );

  async function act(action: string, extra: Record<string, unknown> = {}, ok = "Saved.") {
    setBusy(true);
    setMsg(null);
    const res = await fetch(`/api/portal/quotes/${q.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, ...extra }),
    }).catch(() => null);
    const data = res ? ((await res.json().catch(() => ({}))) as { quote?: PortalQuote; error?: string }) : {};
    setBusy(false);
    if (res?.ok && data.quote) {
      onChange(data.quote);
      setMsg({ kind: "ok", text: ok });
    } else setMsg({ kind: "err", text: data.error ?? "That didn't go through. Please try again." });
  }

  const nudge = (f: number) => setPrice(String(Math.round((numeric * (1 + f)) / 1000) * 1000));
  const c = q.draft.couple;
  const wa = q.clientPhone.replace(/[^\d]/g, "");

  return (
    <div className={px.detailInner}>
      <div className={px.detailHead}>
        <div>
          <p className={px.cardRef}>
            {q.reference} · received {formatDateLong(q.createdAt.slice(0, 10))}
          </p>
          <h2 className={px.detailTitle}>{coupleNames(c, q.clientName)}</h2>
          <p className={px.detailClient}>
            {q.clientName} · <a href={`mailto:${q.clientEmail}`}>{q.clientEmail}</a>
            {q.clientPhone && (
              <>
                {" "}· <a href={`tel:${q.clientPhone}`}>{q.clientPhone}</a>
                {wa && (
                  <>
                    {" "}· <a href={`https://wa.me/${wa}`} target="_blank" rel="noreferrer">WhatsApp</a>
                  </>
                )}
              </>
            )}
          </p>
        </div>
        <span className={`${px.chip} ${px[`chip_${q.status}`] ?? ""}`}>{STATUS_LABEL[q.status]}</span>
      </div>

      {/* Price & decision */}
      <section className={px.pricePanel}>
        <div className={px.priceRow}>
          <div>
            <span className={px.priceLabel}>Studio estimate</span>
            <span className={px.priceValue}>{formatINR(estimate)}</span>
          </div>
          <div>
            <span className={px.priceLabel}>Final price</span>
            <span className={px.priceValue}>{formatINR(q.finalPrice ?? estimate)}</span>
          </div>
        </div>

        {editingPrice && (
          <>
            {q.status === "rejected" && q.founderComment && (
              <p className={px.callout}>
                <b>{q.decidedBy ?? "Founder"} returned this:</b> {q.founderComment}
              </p>
            )}
            <label className={px.field}>
              <span>Price for the client (₹)</span>
              <input inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value)} />
            </label>
            <div className={px.nudges}>
              {[-0.1, -0.05, 0.05, 0.1].map((f) => (
                <button key={f} type="button" className={px.nudge} onClick={() => nudge(f)}>
                  {f > 0 ? "+" : "−"}
                  {Math.abs(f * 100)}%
                </button>
              ))}
              <button type="button" className={px.nudge} onClick={() => setPrice(String(estimate))}>
                Reset to estimate
              </button>
              <span className={delta === 0 ? px.deltaZero : delta < 0 ? px.deltaDown : px.deltaUp}>
                {delta === 0 ? "Same as estimate" : `${delta < 0 ? "−" : "+"}${formatINR(Math.abs(delta))} (${pct.toFixed(1)}%)`}
              </span>
            </div>
            <label className={px.field}>
              <span>Note for the founder</span>
              <textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder="What you agreed with the client, and why this price." />
            </label>
            <label className={px.check}>
              <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} />
              <span>I have confirmed these selections and this price with the client.</span>
            </label>
            <div className={px.actions}>
              <button className={base.btnSecondary} disabled={busy} onClick={() => act("price", { finalPrice: numeric, note }, "Price saved.")}>
                Save price
              </button>
              <button
                className={base.btnPrimary}
                disabled={busy || !confirmed || numeric <= 0}
                onClick={() => act("send_for_approval", { finalPrice: numeric, note }, "Sent to the founder.")}
              >
                Send to founder for approval
              </button>
            </div>
          </>
        )}

        {q.status === "pending_approval" && (
          <>
            {q.salesNote && (
              <p className={px.callout}>
                <b>{q.salesOwner ?? "Sales"}:</b> {q.salesNote}
              </p>
            )}
            {me.role === "owner" ? (
              <>
                <label className={px.field}>
                  <span>Your comment</span>
                  <textarea rows={3} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Optional when approving; required when returning." />
                </label>
                <div className={px.actions}>
                  <button className={base.btnSecondary} disabled={busy} onClick={() => act("reject", { comment }, "Returned to sales.")}>
                    Return to sales
                  </button>
                  <button className={base.btnPrimary} disabled={busy} onClick={() => act("approve", { comment }, "Approved.")}>
                    Approve quotation
                  </button>
                </div>
              </>
            ) : (
              <p className={qx.fine}>With the founder for approval.</p>
            )}
          </>
        )}

        {(q.status === "approved" || q.status === "sent" || q.status === "accepted") && q.founderComment && (
          <p className={px.callout}>
            <b>{q.decidedBy ?? "Founder"}:</b> {q.founderComment}
          </p>
        )}

        {q.status === "approved" && (
          <div className={px.actions}>
            <button className={base.btnPrimary} disabled={busy} onClick={() => act("forward", { note: "" }, "Shared with the client.")}>
              Share with the client
            </button>
          </div>
        )}

        <div className={px.actions}>
          <button
            className={base.btnGhost}
            onClick={() => (state.status === "ready" ? downloadBlob(state.blob, state.filename) : setWantPdf(true))}
            disabled={state.status === "rendering"}
          >
            {state.status === "rendering" ? "Preparing PDF…" : state.status === "ready" ? "Download quotation PDF" : "Prepare quotation PDF"}
          </button>
        </div>
        {msg && (
          <p className={msg.kind === "ok" ? px.ok : qx.error} role="status">
            {msg.text}
          </p>
        )}
      </section>

      <section className={px.sheet}>
        <CommissionSheet config={config} draft={q.draft} quote={q.quote} reference={q.reference} />
      </section>

      <section>
        <p className={base.kicker}>History</p>
        <ol className={px.history}>
          {[...q.history].reverse().map((h, i) => (
            <li key={i}>
              <span className={px.histWhen}>{new Date(h.at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</span>
              <span>
                <b>{h.by}</b> {ACTION_LABEL[h.action] ?? h.action}
                {h.price ? ` · ${formatINR(h.price)}` : ""}
                {h.note ? <em> — {h.note}</em> : null}
              </span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
