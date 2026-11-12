"use client";

import Link from "next/link";
import { useState } from "react";
import cx from "../studio/cinema.module.css";
import base from "../studio/studio.module.css";
import qx from "../studio/quotes/quotes.module.css";
import px from "./portal.module.css";
import { downloadBlob, useProposalPdf } from "../studio/ProposalPreview";
import { formatDateLong, formatINR } from "@/lib/commission/format";
import { coupleNames, eventDisplayName } from "@/lib/commission/model";
import type { StudioConfig } from "@/lib/commission/types";
import type { ClientQuote, PublicAccount } from "@/lib/portal/types";

/* The client's own corner of 24 Frames: every quotation they have
   composed, where each one stands, and the final quotation once the
   studio shares it. */
export default function ClientHome({
  account,
  quotes: initial,
  config,
  sentRef,
  storageIssue,
}: {
  account: PublicAccount;
  quotes: ClientQuote[];
  config: StudioConfig;
  sentRef: string | null;
  storageIssue: string | null;
}) {
  const [quotes, setQuotes] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const first = account.name.split(" ")[0];

  async function begin() {
    setBusy(true);
    setError(null);
    const res = await fetch("/api/portal/quotes", { method: "POST" }).catch(() => null);
    const data = res ? ((await res.json().catch(() => ({}))) as { id?: string; error?: string }) : {};
    if (res?.ok && data.id) {
      window.location.assign(`/account/quote/${data.id}`);
      return;
    }
    setError(data.error ?? "We couldn't start a new quotation. Please try again.");
    setBusy(false);
  }

  async function accept(id: string) {
    const res = await fetch(`/api/portal/quotes/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "accept" }),
    }).catch(() => null);
    const data = res ? ((await res.json().catch(() => ({}))) as { quote?: ClientQuote; error?: string }) : {};
    if (res?.ok && data.quote) setQuotes((qs) => qs.map((q) => (q.id === id ? data.quote! : q)));
    else setError(data.error ?? "Could not accept the quotation. Please try again.");
  }

  return (
    <div className={`${cx.cinema} ${qx.page}`}>
      <header className={qx.top}>
        <Link href="/" aria-label="24 Frames home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={qx.logo} src="/images/logo-dark-header.png" alt="24 Frames" />
        </Link>
        <span className={qx.topTitle}>Your quotations</span>
        <div className={qx.topRight}>
          <span className={qx.who}>{account.name}</span>
          <button
            className={base.btnGhost}
            onClick={async () => {
              await fetch("/api/portal/auth", { method: "DELETE" }).catch(() => null);
              window.location.assign("/account/login");
            }}
          >
            Sign out
          </button>
        </div>
      </header>

      <main className={qx.main}>
        {sentRef && (
          <div className={px.flash} role="status">
            <b>Thank you — quotation {sentRef} is with the studio.</b> Our team will review your selections, confirm the
            details with you and share your final quotation here.
          </div>
        )}
        {storageIssue && <p className={qx.error}>Your quotations are unavailable right now: {storageIssue}</p>}

        <div className={qx.head}>
          <div>
            <p className={base.kicker}>Welcome, {first}</p>
            <h1 className={qx.title}>
              Your celebration, <em>composed with us.</em>
            </h1>
          </div>
          <button className={base.btnPrimary} onClick={begin} disabled={busy}>
            {busy ? "Opening…" : "Begin a new quotation"}
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M14 6l6 6-6 6" /></svg>
          </button>
        </div>
        {error && <p className={qx.error} role="alert">{error}</p>}

        {quotes.length === 0 ? (
          <section className={px.empty}>
            <p className={px.emptyTitle}>Your first quotation begins here.</p>
            <p className={qx.fine}>
              Choose your occasions, meet the crew and build your team — your selections save to your account as you go,
              and you can return to change them any time.
            </p>
          </section>
        ) : (
          <ul className={px.cards}>
            {quotes.map((q) => (
              <QuoteCard key={q.id} q={q} config={config} onAccept={() => accept(q.id)} />
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}

function QuoteCard({ q, config, onAccept }: { q: ClientQuote; config: StudioConfig; onAccept: () => void }) {
  const ready = q.status === "sent" || q.status === "accepted";
  const [wantPdf, setWantPdf] = useState(false);
  const { state } = useProposalPdf(
    wantPdf ? { draft: q.draft, quote: q.quote, config, reference: q.reference, issuedAt: q.updatedAt, consultant: "24 Frames", finalPrice: q.finalPrice } : null,
  );
  const names = coupleNames(q.draft.couple, "Your celebration");
  const events = q.draft.events.map((e) => eventDisplayName(e, config));

  return (
    <li className={`${px.card} ${ready ? px.cardReady : ""}`}>
      <div className={px.cardMain}>
        <p className={px.cardRef}>
          {q.reference} · updated {formatDateLong(q.updatedAt.slice(0, 10))}
        </p>
        <h2 className={px.cardTitle}>{names}</h2>
        <p className={px.cardEvents}>{events.length ? events.join(" · ") : "No occasions chosen yet"}</p>
      </div>
      <div className={px.cardSide}>
        <span className={`${px.chip} ${px[`chip_${q.status}`] ?? ""}`}>{q.statusLabel}</span>
        {ready ? (
          <p className={px.cardPrice}>
            {formatINR(q.finalPrice ?? q.quote.grandTotal)}
            <small>Your quotation</small>
          </p>
        ) : (
          <p className={px.cardPrice}>
            {formatINR(q.quote.grandTotal)}
            <small>Estimate</small>
          </p>
        )}
        <div className={px.cardActions}>
          {q.editable && (
            <a className={base.btnSecondary} href={`/account/quote/${q.id}`} data-no-transition>
              {q.status === "draft" ? "Continue" : "Edit selections"}
            </a>
          )}
          {!q.editable && !ready && (
            <a className={base.btnSecondary} href={`/account/quote/${q.id}`} data-no-transition>
              View
            </a>
          )}
          {ready && (
            <button
              className={base.btnSecondary}
              onClick={() => (state.status === "ready" ? downloadBlob(state.blob, state.filename) : setWantPdf(true))}
              disabled={state.status === "rendering"}
            >
              {state.status === "rendering" ? "Preparing PDF…" : state.status === "ready" ? "Download PDF" : "Prepare PDF"}
            </button>
          )}
          {q.status === "sent" && (
            <button className={base.btnPrimary} onClick={onAccept}>
              Accept quotation
            </button>
          )}
        </div>
      </div>
    </li>
  );
}
