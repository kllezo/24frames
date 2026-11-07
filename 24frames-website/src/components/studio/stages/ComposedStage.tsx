"use client";

import ShareCenter from "../ShareCenter";
import styles from "../proposal.module.css";
import base from "../studio.module.css";
import { formatINR } from "@/lib/commission/format";
import { coupleNames } from "@/lib/commission/model";
import type { StageProps } from "./types";

export default function ComposedStage({ submitted, actions }: StageProps) {
  if (!submitted) return null;
  const { draft, quote } = submitted;
  return (
    <main className={styles.composed}>
      <section className={styles.composedHero}>
        <div className={styles.composedSeal} aria-hidden="true">
          <svg viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="56" />
            <circle cx="60" cy="60" r="46" />
            <path d="M40 61l13 13 28-30" />
          </svg>
        </div>
        <p className={base.kicker}>Commission recorded · {submitted.reference}</p>
        <h1 className={styles.composedTitle} tabIndex={-1}>
          Your celebration has been <em>composed.</em>
        </h1>
        <p className={styles.composedLead}>Your visual legacy begins here.</p>
        <dl className={styles.composedFacts}>
          <div><dt>For</dt><dd>{coupleNames(draft.couple)}</dd></div>
          <div><dt>Reference</dt><dd>{submitted.reference}</dd></div>
          <div><dt>Estimated total</dt><dd>{formatINR(quote.grandTotal)}</dd></div>
          <div><dt>Delivery</dt><dd>{quote.postProduction.tierLabel ? `${quote.postProduction.priorityName} · ${quote.postProduction.tierLabel}` : "—"}</dd></div>
        </dl>
      </section>

      <ShareCenter record={submitted} />

      <div className={styles.composedEnd}>
        <a className={base.btnSecondary} href="/quotebuilder/admin" data-no-transition>Open studio records</a>
        <button className={base.btnPrimary} onClick={() => actions.reset()}>Begin a new consultation</button>
      </div>
    </main>
  );
}
