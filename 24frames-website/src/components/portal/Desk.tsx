"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import cx from "../studio/cinema.module.css";
import base from "../studio/studio.module.css";
import qx from "../studio/quotes/quotes.module.css";
import px from "./portal.module.css";
import ix from "./insights.module.css";
import sx from "./deskStages.module.css";
import dx from "./deliverables.module.css";
import { DEFAULT_DELIVERABLES, MAX_DELIVERABLES, type Deliverable } from "@/lib/commission/deliverables";
import CommissionSheet from "../studio/CommissionSheet";
import DeskTop from "./DeskTop";
import { downloadBlob, useProposalPdf } from "../studio/ProposalPreview";
import { formatDateLong, formatINR, formatTimeRange, plural } from "@/lib/commission/format";
import { coupleNames, eventDisplayName, weddingDateLabel } from "@/lib/commission/model";
import { planningTitles } from "@/lib/commission/planning";
import type { StudioConfig } from "@/lib/commission/types";
import {
  CONSULT_LABEL,
  LOST_LABEL,
  PRODUCTION_LABEL,
  STATUS_LABEL,
  hasUnsharedChanges,
  type LostReason,
  type ConsultMode,
  type PortalQuote,
  type PublicAccount,
  type QuoteStatus,
} from "@/lib/portal/types";

type Tab = "updates" | "inbox" | "approval" | "approved" | "returned" | "shared" | "lost" | "all";
export interface StaffMember {
  id: string;
  name: string;
  role: "sales" | "owner";
}

const ATTENTION_LABEL = {
  submitted: "New quotation from the client",
  update: "The client sent an update",
  accepted: "The client accepted the quotation",
  change_request: "The client asked to change the quotation",
} as const;

const ago = (iso: string) => {
  const m = Math.round((Date.now() - Date.parse(iso)) / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} h ago`;
  return formatDateLong(iso.slice(0, 10));
};

const TABS: { id: Tab; label: string; statuses?: QuoteStatus[] }[] = [
  { id: "updates", label: "Notifications" },
  { id: "inbox", label: "New & in review", statuses: ["submitted"] },
  { id: "approval", label: "Awaiting founder", statuses: ["pending_approval"] },
  { id: "approved", label: "Approved", statuses: ["approved"] },
  { id: "returned", label: "Returned", statuses: ["rejected"] },
  { id: "shared", label: "Shared with clients", statuses: ["sent", "accepted"] },
  { id: "lost", label: "Lost" },
  { id: "all", label: "All" },
];

/* The five stages shown as cards; the rest sit in a quiet row below. */
const STAGES: { id: Tab; label: string; hint: string }[] = [
  { id: "updates", label: "Notifications", hint: "Client changes and replies" },
  { id: "inbox", label: "New & in review", hint: "Fresh requests to check" },
  { id: "approval", label: "Awaiting founder", hint: "Needs the founder's yes" },
  { id: "approved", label: "Ready to share", hint: "Approved, not yet sent" },
  { id: "shared", label: "With clients", hint: "Shared or accepted" },
];
const MORE_TABS = TABS.filter((t) => t.id === "returned" || t.id === "lost" || t.id === "all");

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
  update_shared: "Sent an update to the studio",
  change_requested: "Asked to change the quotation",
  reopened: "Reopened the quotation for changes",
  assigned: "Relationship manager set to",
  consultation: "Logged a guided session",
  booked: "Confirmed the booking",
  lost: "Marked the enquiry as lost",
  revived: "Reopened the lost enquiry",
  production: "Moved production to",
  payment: "Recorded a payment",
  deliverables: "Updated the deliverables",
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
  const [mine, setMine] = useState(false);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [linkMsg, setLinkMsg] = useState<string | null>(null);

  // Deep link from other desk pages: /desk?q=<id> opens that quotation.
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("q");
    if (id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTab("all");
      setOpenId(id);
    }
  }, []);

  useEffect(() => {
    fetch("/api/portal/staff", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { staff: [] }))
      .then((d: { staff?: StaffMember[] }) => setStaff(d.staff ?? []))
      .catch(() => null);
  }, []);

  async function copyLink() {
    setLinkMsg(null);
    const res = await fetch("/api/portal/invite", { method: "POST" }).catch(() => null);
    const data = res ? ((await res.json().catch(() => ({}))) as { url?: string; error?: string }) : {};
    if (!data.url) return setLinkMsg(data.error ?? "Could not create your link.");
    try {
      await navigator.clipboard.writeText(data.url);
      setLinkMsg("Your client link is copied — share it with a new lead. Whoever signs up through it is assigned to you.");
    } catch {
      window.prompt("Your personal client link", data.url);
    }
  }

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
    const pool = (quotes ?? []).filter((q) => !mine || q.managerId === me.id);
    for (const t of TABS) if (t.statuses) c[t.id] = pool.filter((q) => !q.lost && t.statuses!.includes(q.status)).length;
    c.updates = pool.filter((q) => q.attention).length;
    c.lost = pool.filter((q) => q.lost).length;
    c.all = pool.filter((q) => q.status !== "draft").length;
    return c;
  }, [quotes, mine, me.id]);

  const shown = useMemo(() => {
    const t = TABS.find((x) => x.id === tab);
    const term = search.trim().toLowerCase();
    return (quotes ?? [])
      .filter((q) => !mine || q.managerId === me.id)
      .filter((q) => q.status !== "draft" || tab === "all")
      .filter((q) =>
        tab === "updates" ? !!q.attention : tab === "lost" ? !!q.lost : tab === "all" ? true : !q.lost && (!t?.statuses || t.statuses.includes(q.status)),
      )
      .filter(
        (q) =>
          !term ||
          [q.reference, q.clientName, q.clientEmail, q.clientPhone, coupleNames(q.draft.couple, "")]
            .join(" ")
            .toLowerCase()
            .includes(term),
      );
  }, [quotes, tab, search, mine, me.id]);

  const open = quotes?.find((q) => q.id === openId) ?? null;
  const replace = (q: PortalQuote) => setQuotes((qs) => (qs ?? []).map((x) => (x.id === q.id ? q : x)));

  return (
    <div className={`${cx.cinema} ${qx.page}`}>
      <DeskTop me={me} current="quotes" />

      <main className={qx.main}>
        <header className={ix.hero} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "1.5rem", flexWrap: "wrap" }}>
          <div>
            <p className={ix.heroKicker}>{me.role === "owner" ? "Founder's desk" : "Sales desk"} · quotations</p>
            <h1 className={ix.heroTitle}>
              Online quotations, <em>from request to yes.</em>
            </h1>
          </div>
        </header>

        {/* The pipeline at a glance: each stage is a card with its count, and
            clicking a card filters the list to it. */}
        <div className={sx.stages} role="tablist" aria-label="Quotation stages">
          {STAGES.map((st) => {
            const n = counts[st.id] ?? 0;
            const hot = n > 0 && (st.id === "updates" || (st.id === "approval" ? me.role === "owner" : st.id === "inbox"));
            return (
              <button
                key={st.id}
                role="tab"
                aria-selected={tab === st.id}
                className={`${sx.stage} ${tab === st.id ? sx.stageOn : ""} ${hot ? sx.stageHot : ""}`}
                onClick={() => {
                  setTab(st.id);
                  setOpenId(null);
                }}
              >
                <span className={sx.stageLabel}>
                  {hot && <span className={sx.stageDot} aria-hidden="true" />}
                  {st.label}
                </span>
                <span className={sx.stageCount}>{quotes ? n : "—"}</span>
                <span className={sx.stageHint}>{st.hint}</span>
              </button>
            );
          })}
        </div>

        <div className={`${qx.tools} ${sx.tools}`}>
          <div className={sx.more} role="tablist" aria-label="Other quotations">
            {MORE_TABS.map((t) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={tab === t.id}
                className={`${sx.moreTab} ${tab === t.id ? sx.moreOn : ""}`}
                onClick={() => {
                  setTab(t.id);
                  setOpenId(null);
                }}
              >
                {t.label} <span className={sx.moreCount}>{quotes ? (counts[t.id] ?? 0) : "—"}</span>
              </button>
            ))}
          </div>
          <label className={sx.switch}>
            <input type="checkbox" checked={mine} onChange={(e) => setMine(e.target.checked)} />
            <span className={sx.switchTrack} aria-hidden="true" />
            <span>Only my clients</span>
          </label>
          <button className={base.btnSecondary} onClick={copyLink}>
            Copy my client link
          </button>
          <input
            className={px.searchInput}
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search client, couple or reference"
            aria-label="Search quotations"
          />
        </div>

        {linkMsg && <p className={px.ok} role="status">{linkMsg}</p>}
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
                      <span className={px.rowRef}>
                        {q.attention && <i className={px.dot} aria-label="New activity" />}
                        {q.reference}
                      </span>
                      <span className={`${px.chip} ${px[`chip_${q.status}`] ?? ""}`}>{q.lost ? "Lost" : STATUS_LABEL[q.status]}</span>
                    </span>
                    <span className={px.rowName}>{coupleNames(q.draft.couple, q.clientName)}</span>
                    <span className={px.rowMeta}>
                      {q.clientName} · {q.draft.events.length} occasion{q.draft.events.length === 1 ? "" : "s"} ·{" "}
                      {formatINR(q.finalPrice ?? q.quote.grandTotal)}
                    </span>
                    <span className={px.rowMeta}>
                      {q.managerName ? `RM · ${q.managerName}` : "No relationship manager yet"}
                      {q.attention ? ` · ${ago(q.attention.at)}` : ""}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            <section className={px.detail}>
              {open ? (
                <Detail key={open.id} q={open} me={me} config={config} staff={staff} onChange={replace} onReload={load} />
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

export function Detail({
  q,
  me,
  config,
  staff,
  onChange,
  onReload,
}: {
  q: PortalQuote;
  me: PublicAccount;
  config: StudioConfig;
  staff: StaffMember[];
  onChange: (q: PortalQuote) => void;
  onReload: () => Promise<void> | void;
}) {
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
    wantPdf ? { draft: q.draft, quote: q.quote, config, reference: q.reference, issuedAt: q.updatedAt, consultant: q.salesOwner ?? me.name, finalPrice: q.finalPrice, deliverables: q.deliverables ?? null } : null,
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

      {q.attention && (
        <div className={px.attention} role="status">
          <div>
            <b>{ATTENTION_LABEL[q.attention.kind]}</b> · {ago(q.attention.at)}
            {q.attention.note && <p className={px.attentionNote}>“{q.attention.note}”</p>}
          </div>
          <span className={px.attentionActions}>
            {q.attention.kind === "change_request" && (
              <button className={base.btnPrimary} disabled={busy} onClick={() => act("reopen", { note: "At the client's request." }, "Reopened — the client can edit again.")}>
                Reopen for changes
              </button>
            )}
            <button className={base.btnSecondary} disabled={busy} onClick={() => act("seen", {}, "Marked as seen.")}>
              Mark as seen
            </button>
          </span>
        </div>
      )}
      {hasUnsharedChanges(q) && (
        <p className={px.callout}>The client is still editing — they have saved changes they haven&apos;t sent yet.</p>
      )}

      <ManagerRow q={q} me={me} staff={staff} onDone={onReload} />
      <Outcome q={q} busy={busy} act={act} />
      <Brief q={q} config={config} />
      <Consultations q={q} busy={busy} act={act} />

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
        {(q.status === "approved" || q.status === "sent") && (
          <div className={px.actions}>
            <button
              className={base.btnSecondary}
              disabled={busy}
              onClick={() => {
                if (window.confirm("Confirm this booking? The client agreed outside the portal — the production brief is generated for the operations team.")) {
                  void act("confirm_booking", { note: "" }, "Booking confirmed — the production brief is ready.");
                }
              }}
            >
              Client agreed — confirm booking
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

      {q.status !== "draft" && !q.lost && <DeliverablesEditor q={q} busy={busy} act={act} />}

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

/* Who looks after this client. Assigning applies to the client and all of
   their quotations. */
function ManagerRow({ q, me, staff, onDone }: { q: PortalQuote; me: PublicAccount; staff: StaffMember[]; onDone: () => Promise<void> | void }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  async function assign(managerId: string | null) {
    setBusy(true);
    setErr(null);
    const res = await fetch("/api/portal/clients", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId: q.clientId, managerId }),
    }).catch(() => null);
    setBusy(false);
    if (res?.ok) await onDone();
    else setErr(((await res?.json().catch(() => ({}))) as { error?: string })?.error ?? "Could not assign.");
  }
  if (me.role !== "owner") {
    return (
      <section className={px.managerRow}>
        <span className={px.priceLabel}>Relationship manager</span>
        <b>{q.managerName ?? "Not assigned yet"}</b>
        <span className={qx.fine}>Only the founder changes who looks after a client.</span>
      </section>
    );
  }
  return (
    <section className={px.managerRow}>
      <span className={px.priceLabel}>Relationship manager</span>
      <select value={q.managerId ?? ""} disabled={busy} onChange={(e) => assign(e.target.value || null)} aria-label="Relationship manager">
        <option value="">Not assigned</option>
        {staff.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
            {s.role === "owner" ? " (founder level)" : ""}
          </option>
        ))}
      </select>
      {q.managerId !== me.id && (
        <button className={base.btnGhost} disabled={busy} onClick={() => assign(me.id)}>
          Assign to me
        </button>
      )}
      {err && <span className={qx.error}>{err}</span>}
    </section>
  );
}

/* Everything the team needs at a glance: the couple, each occasion with
   its timing, venue, guests and crew, and any planning help requested. */
function Brief({ q, config }: { q: PortalQuote; config: StudioConfig }) {
  const c = q.draft.couple;
  const date = weddingDateLabel(c, formatDateLong);
  const planning = planningTitles(q.draft.planning);
  const events = [...q.draft.events].sort((a, b) => `${a.date || "9"}${a.startTime}`.localeCompare(`${b.date || "9"}${b.startTime}`));
  return (
    <section className={px.brief}>
      <p className={base.kicker}>Client brief</p>
      <dl className={px.briefFacts}>
        <div><dt>Wedding</dt><dd>{date || "Date to be confirmed"}{c.city ? ` · ${c.city}` : ""}</dd></div>
        <div><dt>Scale</dt><dd>{plural(q.draft.events.length, "occasion")} · {plural(q.quote.totalProfessionals, "professional")}</dd></div>
        <div><dt>Prefers</dt><dd>{{ whatsapp: "WhatsApp", call: "Phone call", email: "Email" }[c.preferredContact] ?? "—"}</dd></div>
        <div><dt>Estimate</dt><dd>{formatINR(q.quote.grandTotal)}</dd></div>
        {c.notes && <div className={px.briefWide}><dt>Their notes</dt><dd>{c.notes}</dd></div>}
        {(planning.length > 0 || q.draft.planning?.note) && (
          <div className={px.briefWide}>
            <dt>Planning help</dt>
            <dd>
              <span className={px.briefChips}>
                {planning.map((p) => (
                  <span key={p}>{p}</span>
                ))}
              </span>
              {q.draft.planning?.note && <span className={px.briefNote}>{q.draft.planning.note}</span>}
            </dd>
          </div>
        )}
      </dl>
      {events.length > 0 && (
        <div className={px.tableWrap}>
          <table className={px.table}>
            <thead>
              <tr>
                <th>Occasion</th>
                <th>When</th>
                <th>Where</th>
                <th>Guests</th>
                <th>Crew</th>
              </tr>
            </thead>
            <tbody>
              {events.map((e) => {
                const priced = q.quote.events.find((p) => p.eventId === e.id);
                return (
                  <tr key={e.id}>
                    <td>
                      <span className={px.cellName}>{eventDisplayName(e, config)}</span>
                      {(e.specialRequirements || e.notes) && <span className={px.cellSub}>{[e.specialRequirements, e.notes].filter(Boolean).join(" — ")}</span>}
                    </td>
                    <td>
                      {e.date ? formatDateLong(e.date) : "Date TBC"}
                      {(e.startTime || e.endTime) && <span className={px.cellSub}>{formatTimeRange(e.startTime, e.endTime)}</span>}
                    </td>
                    <td>
                      {e.venue || "—"}
                      {(e.location || e.venueSetting) && <span className={px.cellSub}>{[e.location, e.venueSetting].filter(Boolean).join(" · ")}</span>}
                    </td>
                    <td>{e.guestCount ?? "—"}</td>
                    <td>
                      <span className={px.cellName}>{priced?.professionals ?? 0}</span>
                      <span className={px.cellSub}>{priced?.lines.map((l) => `${l.quantity}× ${l.serviceName}`).join(", ") || "No crew yet"}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

/* Guided sessions: the relationship manager records when they walked the
   client through the quotation — in the studio, on a call or on WhatsApp. */
function Consultations({
  q,
  busy,
  act,
}: {
  q: PortalQuote;
  busy: boolean;
  act: (action: string, extra?: Record<string, unknown>, ok?: string) => Promise<void>;
}) {
  const [mode, setMode] = useState<ConsultMode>("studio");
  const [at, setAt] = useState(() => new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState("");
  const list = q.consultations ?? [];
  return (
    <section className={px.consults}>
      <p className={base.kicker}>Guided sessions</p>
      {list.length === 0 ? (
        <p className={qx.fine}>Not logged yet. Did you build this quotation with the client? Record it here — the founder sees it when approving.</p>
      ) : (
        <ul className={px.consultList}>
          {list.map((c) => (
            <li key={c.id}>
              <b>{CONSULT_LABEL[c.mode]}</b> · {formatDateLong(c.at.slice(0, 10))} · {c.by}
              {c.note && <em> — {c.note}</em>}
            </li>
          ))}
        </ul>
      )}
      <div className={px.consultForm}>
        <select value={mode} onChange={(e) => setMode(e.target.value as ConsultMode)} aria-label="How the session took place">
          {(Object.keys(CONSULT_LABEL) as ConsultMode[]).map((m) => (
            <option key={m} value={m}>{CONSULT_LABEL[m]}</option>
          ))}
        </select>
        <input type="date" value={at} onChange={(e) => setAt(e.target.value)} aria-label="Session date" />
        <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="What you covered (optional)" maxLength={1000} aria-label="Session note" />
        <button
          className={base.btnSecondary}
          disabled={busy}
          onClick={async () => {
            await act("log_consultation", { mode, at: `${at}T12:00:00`, note }, "Session logged.");
            setNote("");
          }}
        >
          Log session
        </button>
      </div>
    </section>
  );
}

/* Where the enquiry ended up: a confirmed booking (with payments and a
   link to production), or lost — with the reason — and able to be revived. */
function Outcome({
  q,
  busy,
  act,
}: {
  q: PortalQuote;
  busy: boolean;
  act: (action: string, extra?: Record<string, unknown>, ok?: string) => Promise<void>;
}) {
  const [reason, setReason] = useState<LostReason>("budget");
  const [detail, setDetail] = useState("");
  const [amount, setAmount] = useState("");
  const [payNote, setPayNote] = useState("");
  const [payAt, setPayAt] = useState(() => new Date().toISOString().slice(0, 10));
  const [lostOpen, setLostOpen] = useState(false);
  const value = q.finalPrice ?? q.quote.grandTotal;
  const received = (q.payments ?? []).reduce((a, p) => a + p.amount, 0);

  if (q.status === "accepted") {
    return (
      <section className={px.pricePanel}>
        <div className={px.priceRow}>
          <div>
            <span className={px.priceLabel}>Booked value</span>
            <span className={px.priceValue}>{formatINR(value)}</span>
          </div>
          <div>
            <span className={px.priceLabel}>Received</span>
            <span className={px.priceValue}>{formatINR(received)}</span>
          </div>
          <div>
            <span className={px.priceLabel}>Outstanding</span>
            <span className={px.priceValue}>{formatINR(Math.max(value - received, 0))}</span>
          </div>
        </div>
        {q.production && (
          <p className={px.callout}>
            <b>Production · {PRODUCTION_LABEL[q.production.status]}</b>
            {q.production.dueDate ? ` · delivery due ${formatDateLong(q.production.dueDate)}` : ""} ·{" "}
            <a href={`/desk/production?q=${q.id}`} data-no-transition>
              Open the production brief →
            </a>
          </p>
        )}
        {(q.payments ?? []).length > 0 && (
          <ul className={px.consultList}>
            {(q.payments ?? []).map((p) => (
              <li key={p.id}>
                <b>{formatINR(p.amount)}</b> · {formatDateLong(p.at.slice(0, 10))} · {p.by}
                {p.note && <em> — {p.note}</em>}
              </li>
            ))}
          </ul>
        )}
        <div className={px.consultForm}>
          <input inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount received (₹)" aria-label="Amount received" />
          <input type="date" value={payAt} onChange={(e) => setPayAt(e.target.value)} aria-label="Date received" />
          <input value={payNote} onChange={(e) => setPayNote(e.target.value)} placeholder="Advance, second instalment…" aria-label="Payment note" />
          <button
            className={base.btnSecondary}
            disabled={busy || !Number(amount.replace(/[^\d.]/g, ""))}
            onClick={async () => {
              await act("record_payment", { amount: Number(amount.replace(/[^\d.]/g, "")), note: payNote, at: `${payAt}T12:00:00` }, "Payment recorded.");
              setAmount("");
              setPayNote("");
            }}
          >
            Record payment
          </button>
        </div>
      </section>
    );
  }

  if (q.lost) {
    return (
      <section className={px.attention} role="status">
        <div>
          <b>Lost · {LOST_LABEL[q.lost.reason]}</b> · {formatDateLong(q.lost.at.slice(0, 10))} · {q.lost.by}
          {q.lost.detail && <p className={px.attentionNote}>“{q.lost.detail}”</p>}
        </div>
        <span className={px.attentionActions}>
          <button className={base.btnSecondary} disabled={busy} onClick={() => act("revive", { note: "" }, "The enquiry is open again.")}>
            Reopen enquiry
          </button>
        </span>
      </section>
    );
  }

  if (q.status === "draft") return null;
  return (
    <section className={px.managerRow}>
      {!lostOpen ? (
        <button className={base.btnGhost} onClick={() => setLostOpen(true)}>
          Mark as lost…
        </button>
      ) : (
        <div className={px.consultForm}>
          <select value={reason} onChange={(e) => setReason(e.target.value as LostReason)} aria-label="Why it was lost">
            {(Object.keys(LOST_LABEL) as LostReason[]).map((r) => (
              <option key={r} value={r}>
                {LOST_LABEL[r]}
              </option>
            ))}
          </select>
          <input value={detail} onChange={(e) => setDetail(e.target.value)} placeholder="What happened (optional)" aria-label="Details" />
          <button
            className={base.btnSecondary}
            disabled={busy}
            onClick={async () => {
              await act("mark_lost", { reason, detail }, "Marked as lost.");
              setLostOpen(false);
            }}
          >
            Mark lost
          </button>
          <button className={base.btnGhost} onClick={() => setLostOpen(false)}>
            Cancel
          </button>
        </div>
      )}
    </section>
  );
}

/* After the quotation is composed with the couple, the sales team can
   tailor what they receive. Saving rewrites the PDF's Deliverables page
   and tells the founder, the relationship manager and the client. */
function DeliverablesEditor({
  q,
  busy,
  act,
}: {
  q: PortalQuote;
  busy: boolean;
  act: (action: string, extra?: Record<string, unknown>, ok?: string) => Promise<void>;
}) {
  const saved = q.deliverables && q.deliverables.length ? q.deliverables : DEFAULT_DELIVERABLES;
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<Deliverable[]>(saved);
  const [note, setNote] = useState("");
  const tailored = !!(q.deliverables && q.deliverables.length);
  const set = (i: number, patch: Partial<Deliverable>) => setRows((r) => r.map((d, j) => (j === i ? { ...d, ...patch } : d)));

  return (
    <section className={dx.panel} aria-labelledby={`dl-${q.id}`}>
      <div className={dx.head}>
        <div>
          <h3 id={`dl-${q.id}`} className={dx.title}>Deliverables</h3>
          <p className={dx.sub}>
            {tailored ? "Tailored for this couple" : "The studio's standard list"}
            {q.deliverablesUpdate && ` · last changed by ${q.deliverablesUpdate.by} ${ago(q.deliverablesUpdate.at)}`}
            {q.deliverablesUpdate && (q.deliverablesUpdate.seenByClient ? " · seen by the client" : " · not yet seen by the client")}
          </p>
        </div>
        {!open && (
          <button type="button" className={base.btnSecondary} onClick={() => { setRows(saved); setOpen(true); }}>
            Edit deliverables
          </button>
        )}
      </div>

      {!open ? (
        <ol className={dx.list}>
          {saved.map((d, i) => (
            <li key={i}><b>{d.title}</b> — {d.detail}</li>
          ))}
        </ol>
      ) : (
        <>
          <ol className={dx.rows}>
            {rows.map((d, i) => (
              <li key={i} className={dx.row}>
                <input className={dx.rowTitle} value={d.title} maxLength={60} placeholder="Title, e.g. Photos" onChange={(e) => set(i, { title: e.target.value })} aria-label={`Deliverable ${i + 1} title`} />
                <textarea className={dx.rowDetail} rows={2} value={d.detail} maxLength={320} placeholder="What the couple receives" onChange={(e) => set(i, { detail: e.target.value })} aria-label={`Deliverable ${i + 1} detail`} />
                <button type="button" className={dx.rowRemove} onClick={() => setRows((r) => r.filter((_, j) => j !== i))} aria-label={`Remove deliverable ${i + 1}`}>
                  Remove
                </button>
              </li>
            ))}
          </ol>
          <div className={dx.tools}>
            <button type="button" className={px.nudge} disabled={rows.length >= MAX_DELIVERABLES} onClick={() => setRows((r) => [...r, { title: "", detail: "" }])}>
              + Add a deliverable
            </button>
            <button type="button" className={px.nudge} onClick={() => setRows(DEFAULT_DELIVERABLES)}>
              Reset to the studio standard
            </button>
            <span className={dx.count}>{rows.length} / {MAX_DELIVERABLES}</span>
          </div>
          <label className={px.field}>
            <span>Note for the client (optional)</span>
            <input value={note} maxLength={400} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Added a second album, as discussed." />
          </label>
          <div className={px.actions}>
            <button type="button" className={base.btnGhost} disabled={busy} onClick={() => setOpen(false)}>Cancel</button>
            <button
              type="button"
              className={base.btnPrimary}
              disabled={busy || !rows.some((d) => d.title.trim() || d.detail.trim())}
              onClick={async () => {
                const same = JSON.stringify(rows) === JSON.stringify(DEFAULT_DELIVERABLES);
                await act("deliverables", { deliverables: same ? null : rows, note }, "Deliverables saved — the PDF is updated, and the founder and client are notified.");
                setOpen(false);
                setNote("");
              }}
            >
              Save &amp; notify
            </button>
          </div>
        </>
      )}
    </section>
  );
}
