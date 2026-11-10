"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { lockClick } from "../ui/shutter";
import styles from "../delivery.module.css";
import cx from "../cinema.module.css";
import st from "../stages.module.css";
import base from "../studio.module.css";
import { StageFooter, StageHeader } from "./StageChrome";
import AnimatedNumber from "../ui/AnimatedNumber";
import IllustrativeTag from "../ui/IllustrativeTag";
import { formatINR } from "@/lib/commission/format";
import type { StageProps } from "./types";

/** A brass padlock. Closed on every timeline; the chosen one springs open. */
function BrassLock({ open, className }: { open?: boolean; className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg className={`${className ?? ""} ${open ? cx.lockOpen : ""}`} viewBox="0 0 40 50" aria-hidden="true">
      <defs>
        <linearGradient id={`b${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f3dfa6" />
          <stop offset="0.45" stopColor="#c9a25a" />
          <stop offset="1" stopColor="#8a6a32" />
        </linearGradient>
        <linearGradient id={`s${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#8a6a32" />
          <stop offset="0.5" stopColor="#f0d99a" />
          <stop offset="1" stopColor="#8a6a32" />
        </linearGradient>
      </defs>
      <path className={cx.lockShackle} d="M12.5 23v-8a7.5 7.5 0 0 1 15 0v8" fill="none" stroke={`url(#s${id})`} strokeWidth="3.4" strokeLinecap="round" />
      <rect x="6" y="22" width="28" height="23" rx="4.5" fill={`url(#b${id})`} />
      <rect x="8.2" y="24.2" width="23.6" height="18.6" rx="3" fill="none" stroke="rgba(255,248,225,0.55)" strokeWidth="0.8" />
      <g className={cx.lockKey}>
        <circle cx="20" cy="31.5" r="2.6" fill="#3a2a10" />
        <path d="M18.7 33h2.6l.8 5.2h-4.2z" fill="#3a2a10" />
      </g>
    </svg>
  );
}

export default function DeliveryStage({ config, draft, quote, actions, go }: StageProps) {
  const tiers = useMemo(
    () => config.deliveryTiers.filter((t) => t.available).sort((a, b) => a.days - b.days),
    [config.deliveryTiers],
  );
  const pp = quote.postProduction;
  const selectedIdx = tiers.findIndex((t) => t.id === draft.deliveryTierId);
  const selected = selectedIdx >= 0 ? tiers[selectedIdx] : null;
  // Stops sit at the centre of equal columns, so labels and track align.
  const pos = (i: number) => ((i + 0.5) / Math.max(1, tiers.length)) * 100;
  const track = useRef<HTMLDivElement>(null);
  const lastTier = useRef(draft.deliveryTierId);
  useEffect(() => {
    if (lastTier.current && draft.deliveryTierId && lastTier.current !== draft.deliveryTierId) lockClick();
    lastTier.current = draft.deliveryTierId;
  }, [draft.deliveryTierId]);
  const dragging = useRef(false);
  /** Slide: the knob jumps to the stop nearest the finger. */
  function pickAt(x: number) {
    const r = track.current?.getBoundingClientRect();
    if (!r || !tiers.length) return;
    const f = Math.min(0.999, Math.max(0, (x - r.left) / r.width));
    const t = tiers[Math.floor(f * tiers.length)];
    if (t && t.id !== draft.deliveryTierId) actions.setTier(t.id);
  }
  const roundTo = config.postProduction.roundTo || 1;
  const feeAt = (m: number) => Math.round((pp.baseFee * m) / roundTo) * roundTo;

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
        frame="05"
        kicker="Frame 05 · The Delivery"
        title={<>When would you like to <em>relive it?</em></>}
        lead="Choose how soon your story comes home. Sooner moves it to the front of our edit suite."
      >
        <IllustrativeTag show={config.pricingIsIllustrative} />
      </StageHeader>

      {tiers.length === 0 ? (
        <div className={st.emptyState}>
          <p>The studio has not configured any delivery timelines yet.</p>
          <p className={st.muted}>Delivery tiers are managed in Studio admin → Post-production.</p>
        </div>
      ) : (
        <>
          <section
            className={cx.tl}
            role="radiogroup"
            aria-label="Delivery timeline"
            style={{ "--sel": `${selected ? pos(selectedIdx) : pos(0)}%`, "--first": `${pos(0)}%`, "--n": tiers.length } as React.CSSProperties}
            onPointerDown={(e) => {
              dragging.current = true;
              (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
              pickAt(e.clientX);
            }}
            onPointerMove={(e) => { if (dragging.current) pickAt(e.clientX); }}
            onPointerUp={() => { dragging.current = false; }}
            onPointerCancel={() => { dragging.current = false; }}
          >
            <div className={cx.tlStops}>
              {tiers.map((t, i) => {
                const isSel = t.id === draft.deliveryTierId;
                const months = t.days >= 90;
                return (
                  <button
                    key={t.id}
                    id={`tier-${t.id}`}
                    role="radio"
                    aria-checked={isSel}
                    tabIndex={isSel || (!selected && i === 0) ? 0 : -1}
                    className={`${cx.tlStop} ${isSel ? cx.tlOn : ""}`}
                    onClick={() => actions.setTier(t.id)}
                    onKeyDown={(e) => onKey(e, i)}
                    aria-label={`${t.priorityName}, ${months ? Math.round(t.days / 30) + " months" : t.days + " days"}`}
                  >
                    <span className={cx.tlNum}>{months ? Math.round(t.days / 30) : t.days}</span>
                    <span className={cx.tlUnit}>{months ? "months" : "days"}</span>
                  </button>
                );
              })}
            </div>
            <div className={cx.tlTrack} ref={track} aria-hidden="true">
              <span className={cx.tlFill} />
              {tiers.map((t, i) => {
                const on = t.id === draft.deliveryTierId;
                return (
                  <span key={on ? `${t.id}-open` : t.id} className={`${cx.tlMed} ${on ? cx.tlMedOn : ""}`} style={{ left: `${pos(i)}%` }}>
                    <span className={cx.tlMedRing} />
                    <BrassLock open={on} className={cx.tlMedLock} />
                  </span>
                );
              })}
            </div>
            <div className={cx.tlNames} aria-hidden="true">
              {tiers.map((t) => (
                <span key={t.id} className={t.id === draft.deliveryTierId ? cx.tlOn : ""}>
                  <b>{t.priorityName}</b>
                  <small>{pp.baseFee > 0 ? formatINR(feeAt(t.multiplier)) : "—"}</small>
                </span>
              ))}
            </div>
          </section>

          {selected ? (
            <section className={cx.vaultResult} key={selected.id} aria-live="polite">
              <div className={cx.vaultCopy}>
                <p className={cx.vaultLabel}>{selected.label}</p>
                <h2 className={cx.vaultTitle}>{selected.priorityName}</h2>
                <p className={cx.vaultMeaning}>{selected.meaning}</p>
                {selected.covers.length > 0 && (
                  <div className={cx.dosChips}>
                    {selected.covers.slice(0, 4).map((c) => <span key={c}>{c}</span>)}
                  </div>
                )}
                <details className={cx.vaultTerms}>
                  <summary>Terms</summary>
                  <p>{selected.expectations}</p>
                  <p>{selected.conditions}</p>
                </details>
              </div>
              <div className={cx.vaultFeeCard}>
                <p>Post-production</p>
                <AnimatedNumber value={pp.finalFee} className={cx.vaultFeeFig} />
                <small>
                  {pp.overridden
                    ? `Studio adjusted — ${pp.overrideReason}`
                    : `${formatINR(pp.baseFee)} base × ${pp.multiplier ?? 1}× for this timeline`}
                </small>
              </div>
            </section>
          ) : (
            <p className={cx.vaultHint}>Slide the key, or tap a lock to open its timeline.</p>
          )}

          <StudioAdjustments config={config} draft={draft} quote={quote} actions={actions} />
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

function StudioAdjustments({ config, draft, quote, actions }: Pick<StageProps, "config" | "draft" | "quote" | "actions">) {
  const [open, setOpen] = useState(draft.appliedChargeIds.length > 0 || !!draft.postProductionOverride);
  const [amount, setAmount] = useState(draft.postProductionOverride ? String(draft.postProductionOverride.amount) : "");
  const [reason, setReason] = useState(draft.postProductionOverride?.reason ?? "");
  const charges = config.charges.filter((c) => c.available);
  const n = Number(amount);
  const valid = amount !== "" && Number.isFinite(n) && n >= 0 && reason.trim().length > 0;

  return (
    <section className={styles.adjust}>
      <button className={styles.adjustHead} onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <span className={base.mono}>FOR THE CONSULTANT</span>
        <span>Studio adjustments &amp; additional charges</span>
        <svg viewBox="0 0 16 16" aria-hidden="true"><path d={open ? "M4 10l4-4 4 4" : "M4 6l4 4 4-4"} /></svg>
      </button>
      {open && (
        <div className={styles.adjustBody}>
          <div>
            <h3>Additional charges</h3>
            <p className={st.muted}>Only charges you tick are added — and every one is itemised on the proposal.</p>
            {charges.length === 0 && <p className={st.muted}>No additional charges are configured.</p>}
            {charges.map((c) => (
              <label key={c.id} className={`${base.field} ${base.checkField}`}>
                <input type="checkbox" checked={draft.appliedChargeIds.includes(c.id)} onChange={() => actions.toggleCharge(c.id)} />
                <span>
                  <b>{c.label}</b> — {c.kind === "fixed" ? formatINR(c.amount) : `${c.amount}% of creative production`}
                  <small>{c.description}</small>
                </span>
              </label>
            ))}
          </div>
          <div>
            <h3>Post-production override</h3>
            <p className={st.muted}>Replaces the computed fee of {formatINR(quote.postProduction.computedFee)}. Shown on the proposal as a studio adjustment.</p>
            <div className={styles.overrideRow}>
              <label className={base.field}>
                <span className={base.fieldLabel}>Amount (₹)</span>
                <input className={base.input} type="number" min={0} value={amount} onChange={(e) => setAmount(e.target.value)} />
              </label>
              <label className={base.field}>
                <span className={base.fieldLabel}>Reason</span>
                <input className={base.input} value={reason} maxLength={120} onChange={(e) => setReason(e.target.value)} />
              </label>
            </div>
            <div className={styles.overrideActions}>
              <button className={base.btnSecondary} disabled={!valid} onClick={() => actions.setPostOverride({ amount: Math.round(n), reason: reason.trim() })}>
                Apply override
              </button>
              {draft.postProductionOverride && (
                <button className={base.btnText} onClick={() => { actions.setPostOverride(null); setAmount(""); setReason(""); }}>
                  Remove override
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
