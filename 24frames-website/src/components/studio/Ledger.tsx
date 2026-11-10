"use client";

import { useEffect, useState } from "react";
import styles from "./studio.module.css";
import AnimatedNumber from "./ui/AnimatedNumber";
import IllustrativeTag from "./ui/IllustrativeTag";
import Crest from "./ui/Crest";
import { formatINR, plural } from "@/lib/commission/format";
import { eventDisplayName } from "@/lib/commission/model";
import type { CommissionDraft, CommissionQuote, StudioConfig } from "@/lib/commission/types";

/* The live commission ledger. Desktop: a quiet column beside the stage.
   Tablet / mobile: a sticky bar with the total that opens into a sheet. */
export default function Ledger({
  config,
  draft,
  quote,
  onReview,
}: {
  config: StudioConfig;
  draft: CommissionDraft;
  quote: CommissionQuote;
  onReview: () => void;
}) {
  const [open, setOpen] = useState(false);
  const pp = quote.postProduction;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
    {open && <div className={styles.ledgerScrim} onClick={() => setOpen(false)} aria-hidden="true" />}
    <aside data-lenis-prevent className={`${styles.ledger} ${open ? styles.ledgerOpen : ""}`} aria-label="Live commission estimate">
      <button
        className={styles.ledgerBar}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="ledger-body"
      >
        <span className={styles.ledgerBarLabel}>
          Estimated commission
          <small>{plural(quote.totalProfessionals, "professional")} · {plural(draft.events.length, "event")}</small>
        </span>
        <AnimatedNumber value={quote.grandTotal} className={styles.ledgerBarTotal} />
        <svg className={styles.ledgerChevron} viewBox="0 0 16 16" aria-hidden="true"><path d="M4 10l4-4 4 4" /></svg>
      </button>

      <div className={styles.ledgerBody} id="ledger-body">
        <div className={styles.ledgerHead}>
          <Crest className={styles.ledgerCrest} />
          <p className={styles.kicker}>Private folio</p>
          <h2 className={styles.ledgerTitle}>Your commission</h2>
          <span className={styles.ledgerFolio}>NO. {draft.id.replace(/[^a-z0-9]/gi, "").slice(-6).toUpperCase()}</span>
          <IllustrativeTag show={quote.illustrative} compact />
        </div>

        {draft.events.length === 0 ? (
          <p className={styles.ledgerEmpty}>Your events and creative team will appear here as you compose them.</p>
        ) : (
          <ol className={styles.ledgerEvents}>
            {draft.events.map((e, i) => {
              const pe = quote.events.find((x) => x.eventId === e.id);
              return (
                <li key={e.id}>
                  <span className={styles.ledgerIdx}>{String(i + 1).padStart(2, "0")}</span>
                  <span className={styles.ledgerEventName}>
                    {eventDisplayName(e, config)}
                    <small>{pe && pe.professionals > 0 ? plural(pe.professionals, "professional") : "No team yet"}</small>
                  </span>
                  <AnimatedNumber value={pe?.subtotal ?? 0} className={styles.ledgerAmt} />
                </li>
              );
            })}
          </ol>
        )}

        <dl className={styles.ledgerTotals}>
          <div>
            <dt>Creative production</dt>
            <dd><AnimatedNumber value={quote.productionSubtotal} /></dd>
          </div>
          <div>
            <dt>
              Post-production
              <small>
                {pp.tierLabel
                  ? `${pp.priorityName} · ${pp.multiplier}×${pp.overridden ? " · adjusted" : ""}`
                  : "Choose a delivery timeline"}
              </small>
            </dt>
            <dd><AnimatedNumber value={pp.finalFee} /></dd>
          </div>
          {quote.charges.map((c) => (
            <div key={c.id}>
              <dt>{c.label}</dt>
              <dd>{formatINR(c.amount)}</dd>
            </div>
          ))}
          {quote.tax && (
            <div>
              <dt>{quote.tax.label} ({quote.tax.ratePercent}%)</dt>
              <dd><AnimatedNumber value={quote.tax.amount} /></dd>
            </div>
          )}
        </dl>

        <div className={styles.ledgerGrand} aria-live="polite">
          <span>Estimated total</span>
          <span className={styles.ledgerGlintWrap}>
            <AnimatedNumber value={quote.grandTotal} className={styles.ledgerGrandFig} />
            <i key={quote.grandTotal} className={styles.ledgerGlint} aria-hidden="true" />
          </span>
          {!quote.tax && <small>{config.tax.enabled ? "" : "Taxes not included"}</small>}
        </div>

        {draft.events.length > 0 && (
          <button className={styles.btnText} onClick={() => { setOpen(false); onReview(); }}>
            Review the full commission →
          </button>
        )}
      </div>
    </aside>
    </>
  );
}
