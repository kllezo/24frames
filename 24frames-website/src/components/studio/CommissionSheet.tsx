"use client";

import styles from "./sheet.module.css";
import IllustrativeTag from "./ui/IllustrativeTag";
import {
  formatDateLong,
  formatINR,
  formatTimeRange,
  groupIndian,
  plural,
  roman,
  weekdayOf,
} from "@/lib/commission/format";
import { coupleNames, eventDisplayName, eventTypeLabel, weddingDateLabel } from "@/lib/commission/model";
import type { CommissionDraft, CommissionQuote, StudioConfig } from "@/lib/commission/types";

export type SheetSection = "couple" | "celebration" | "ensemble" | "delivery";

const CONTACT_LABEL = { whatsapp: "WhatsApp", call: "Phone call", email: "Email" } as const;

/* The commission as a document — used for the live review and for stored
   records in Studio admin. Purely presentational: every figure comes from
   the quote, which comes from the single pricing engine. */
export default function CommissionSheet({
  config,
  draft,
  quote,
  reference,
  onEdit,
}: {
  config: StudioConfig;
  draft: CommissionDraft;
  quote: CommissionQuote;
  reference?: string;
  onEdit?: (section: SheetSection) => void;
}) {
  const c = draft.couple;
  const pp = quote.postProduction;
  const date = weddingDateLabel(c, formatDateLong);
  const edit = (section: SheetSection, label = "Revise") =>
    onEdit ? (
      <button className={styles.revise} onClick={() => onEdit(section)}>
        {label}
      </button>
    ) : null;

  return (
    <article className={styles.sheet}>
      <header className={styles.masthead}>
        <span className={styles.mastMono}>24 FRAMES · WEDDING COMMISSION{reference ? ` · ${reference}` : " · DRAFT"}</span>
        <h2 className={styles.mastNames}>{coupleNames(c)}</h2>
        <p className={styles.mastMeta}>
          {[date, c.city, plural(draft.events.length, "event"), plural(quote.totalProfessionals, "professional")]
            .filter(Boolean)
            .join(" · ")}
        </p>
        <IllustrativeTag show={quote.illustrative} />
      </header>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <span className={styles.numeral}>I</span>
          <h3>The couple</h3>
          {edit("couple")}
        </div>
        <dl className={styles.facts}>
          <div><dt>Names</dt><dd>{coupleNames(c, "—")}</dd></div>
          <div><dt>Contact</dt><dd>{[c.phone, c.email].filter(Boolean).join(" · ") || "—"}</dd></div>
          <div><dt>Wedding</dt><dd>{date || "Date to be confirmed"}{c.city ? `, ${c.city}` : ""}</dd></div>
          <div><dt>Prefers</dt><dd>{CONTACT_LABEL[c.preferredContact]}</dd></div>
          {c.notes && <div className={styles.wide}><dt>Notes</dt><dd>{c.notes}</dd></div>}
        </dl>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <span className={styles.numeral}>II</span>
          <h3>The celebration &amp; creative team</h3>
          {edit("celebration", "Revise events")}
          {edit("ensemble", "Revise team")}
        </div>
        <ol className={styles.events}>
          {draft.events.map((e, i) => {
            const pe = quote.events.find((x) => x.eventId === e.id);
            return (
              <li key={e.id} className={styles.event}>
                <div className={styles.eventHead}>
                  <span className={styles.eventNo}>{roman(i)}</span>
                  <div>
                    <h4>{eventDisplayName(e, config)}</h4>
                    <p className={styles.eventMeta}>
                      {[
                        eventTypeLabel(e, config) !== eventDisplayName(e, config) ? eventTypeLabel(e, config) : "",
                        e.date ? `${weekdayOf(e.date)}, ${formatDateLong(e.date)}` : "Date to be confirmed",
                        formatTimeRange(e.startTime, e.endTime),
                      ].filter(Boolean).join(" · ")}
                    </p>
                    <p className={styles.eventMeta}>
                      {[e.venue, e.location, e.guestCount ? `${groupIndian(e.guestCount)} guests` : ""].filter(Boolean).join(" · ")}
                    </p>
                    {(e.specialRequirements || e.notes) && (
                      <p className={styles.eventNote}>{[e.specialRequirements, e.notes].filter(Boolean).join(" — ")}</p>
                    )}
                  </div>
                  <span className={styles.eventSubtotal}>{formatINR(pe?.subtotal ?? 0)}</span>
                </div>
                {pe && pe.lines.length > 0 ? (
                  <table className={styles.lines}>
                    <thead>
                      <tr><th scope="col">Professional</th><th scope="col">No.</th><th scope="col">Rate each</th><th scope="col">Amount</th></tr>
                    </thead>
                    <tbody>
                      {pe.lines.map((l) => (
                        <tr key={l.assignmentId}>
                          <td>
                            <b>{l.serviceName}</b>
                          </td>
                          <td>{l.quantity}</td>
                          <td>
                            {formatINR(l.unitPrice)}
                            {l.overridden && <small>Studio adjusted · {l.overrideReason}</small>}
                          </td>
                          <td>{formatINR(l.lineTotal)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className={styles.noTeam}>No creative team selected for this event.</p>
                )}
              </li>
            );
          })}
        </ol>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <span className={styles.numeral}>III</span>
          <h3>Post-production &amp; delivery</h3>
          {edit("delivery")}
        </div>
        <dl className={styles.facts}>
          <div><dt>Timeline</dt><dd>{pp.tierLabel ? `${pp.priorityName} — ${pp.tierLabel}` : "Not yet chosen"}</dd></div>
          <div><dt>Base fee</dt><dd>{formatINR(pp.baseFee)}</dd></div>
          <div><dt>Priority multiplier</dt><dd>{pp.multiplier !== null ? `${pp.multiplier}×` : "—"}</dd></div>
          <div><dt>Post-production fee</dt><dd>{formatINR(pp.finalFee)}{pp.overridden ? ` (studio adjusted from ${formatINR(pp.computedFee)} — ${pp.overrideReason})` : ""}</dd></div>
        </dl>
      </section>

      <section className={`${styles.section} ${styles.finance}`}>
        <div className={styles.sectionHead}>
          <span className={styles.numeral}>IV</span>
          <h3>Financial summary</h3>
        </div>
        <dl className={styles.totals}>
          <div><dt>Creative production</dt><dd>{formatINR(quote.productionSubtotal)}</dd></div>
          <div><dt>Post-production</dt><dd>{formatINR(pp.finalFee)}</dd></div>
          {quote.charges.map((ch) => (
            <div key={ch.id}><dt>{ch.label}</dt><dd>{formatINR(ch.amount)}</dd></div>
          ))}
          {quote.tax ? (
            <div><dt>{quote.tax.label} ({quote.tax.ratePercent}%)</dt><dd>{formatINR(quote.tax.amount)}</dd></div>
          ) : (
            <div className={styles.muted}><dt>Taxes</dt><dd>Not applied</dd></div>
          )}
          <div className={styles.grand}><dt>Estimated total commission</dt><dd>{formatINR(quote.grandTotal)}</dd></div>
        </dl>
        {quote.issues.length > 0 && (
          <ul className={styles.issues}>{quote.issues.map((i) => <li key={i}>{i}</li>)}</ul>
        )}
      </section>
    </article>
  );
}
