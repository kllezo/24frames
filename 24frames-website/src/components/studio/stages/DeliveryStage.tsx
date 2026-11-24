"use client";

import { useEffect, useMemo, useRef } from "react";
import { lockClick } from "../ui/shutter";
import cx from "../cinema.module.css";
import st from "../stages.module.css";
import { StageFooter, StageHeader } from "./StageChrome";
import AnimatedNumber from "../ui/AnimatedNumber";
import IllustrativeTag from "../ui/IllustrativeTag";
import { formatINR } from "@/lib/commission/format";
import type { StageProps } from "./types";

const ICONS = {
  bolt: <path d="M13 2 4.5 13.5H11L10 22l8.5-11.5H12z" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
    </>
  ),
};

export default function DeliveryStage({ config, draft, quote, actions, go }: StageProps) {
  const tiers = useMemo(
    () => config.deliveryTiers.filter((t) => t.available).sort((a, b) => a.days - b.days),
    [config.deliveryTiers],
  );
  const pp = quote.postProduction;
  const selected = tiers.find((t) => t.id === draft.deliveryTierId) ?? null;
  const lastTier = useRef(draft.deliveryTierId);
  useEffect(() => {
    if (lastTier.current && draft.deliveryTierId && lastTier.current !== draft.deliveryTierId) lockClick();
    lastTier.current = draft.deliveryTierId;
  }, [draft.deliveryTierId]);
  const roundTo = config.postProduction.roundTo || 1;
  const priceOf = (t: (typeof tiers)[number]) =>
    typeof t.fee === "number" ? t.fee : pp.baseFee > 0 ? Math.round((pp.baseFee * t.multiplier) / roundTo) * roundTo : null;

  function onKey(e: React.KeyboardEvent, i: number) {
    let next = -1;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = Math.min(tiers.length - 1, i + 1);
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = Math.max(0, i - 1);
    if (next >= 0) {
      e.preventDefault();
      actions.setTier(tiers[next].id);
      document.getElementById(`tier-${tiers[next].id}`)?.focus();
    }
  }

  return (
    <div className={st.stageInner}>
      <StageHeader
        frame="06"
        kicker="Frame 06 · The Delivery"
        title={<>When would you like to <em>relive it?</em></>}
        lead="Choose how soon your story comes home. Every timeline carries the same quality standards."
      >
        <IllustrativeTag show={config.pricingIsIllustrative} />
      </StageHeader>

      {tiers.length === 0 ? (
        <div className={st.emptyState}>
          <p>No delivery timelines are set up yet.</p>
          <p className={st.muted}>Delivery timelines are managed in the admin → Post-production.</p>
        </div>
      ) : (
        <>
          <div className={cx.dtList} role="radiogroup" aria-label="Delivery timeline">
            {tiers.map((t, i) => {
              const on = t.id === draft.deliveryTierId;
              const price = priceOf(t);
              return (
                <button
                  key={t.id}
                  id={`tier-${t.id}`}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  tabIndex={on || (!selected && i === 0) ? 0 : -1}
                  className={`${cx.dtCard} ${on ? cx.dtOn : ""}`}
                  onClick={() => actions.setTier(t.id)}
                  onKeyDown={(e) => onKey(e, i)}
                >
                  <span className={cx.dtTop}>
                    <span className={cx.dtName}>{t.priorityName}</span>
                    {t.badge && <span className={cx.dtBadge}>{t.badge}</span>}
                    <span className={cx.dtRadio} aria-hidden="true" />
                  </span>
                  <span className={cx.dtPrice}>{price !== null ? formatINR(price) : "—"}</span>
                  <span className={cx.dtWindow}>
                    <svg viewBox="0 0 24 24" aria-hidden="true" className={t.icon === "bolt" ? cx.dtIconBolt : ""}>
                      {ICONS[t.icon ?? (i === 0 ? "bolt" : i === tiers.length - 1 ? "calendar" : "clock")]}
                    </svg>
                    {t.window ?? t.label}
                  </span>
                  <span className={cx.dtMeaning}>{t.meaning}</span>
                  {t.covers.length > 0 && (
                    <span className={cx.dtCovers}>
                      {t.covers.slice(0, 4).map((c) => <span key={c}>{c}</span>)}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {selected ? (
            <section className={cx.dtSummary} aria-live="polite">
              <div>
                <p className={cx.vaultLabel}>Post-production · {selected.window ?? selected.label}</p>
                <details className={cx.vaultTerms}>
                  <summary>Terms</summary>
                  <p>{selected.expectations}</p>
                  <p>{selected.conditions}</p>
                </details>
              </div>
              <div className={cx.dtSummaryFee}>
                <AnimatedNumber value={pp.finalFee} className={cx.vaultFeeFig} />
                {pp.overridden && <small>Adjusted — {pp.overrideReason}</small>}
                {!pp.overridden && pp.finalFee === 0 && <small>Charged once your crew is chosen</small>}
              </div>
            </section>
          ) : (
            <p className={cx.vaultHint}>Choose a timeline to continue.</p>
          )}
        </>
      )}

      <StageFooter
        onBack={() => go("ensemble")}
        onNext={() => go("commission")}
        nextLabel="Review the commission"
        nextDisabled={!selected}
        hint={!selected ? "Choose a delivery timeline to continue." : undefined}
      />
    </div>
  );
}
