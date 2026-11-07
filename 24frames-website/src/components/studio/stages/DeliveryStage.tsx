"use client";

import { useMemo, useState } from "react";
import styles from "../delivery.module.css";
import st from "../stages.module.css";
import base from "../studio.module.css";
import { StageFooter, StageHeader } from "./StageChrome";
import AnimatedNumber from "../ui/AnimatedNumber";
import IllustrativeTag from "../ui/IllustrativeTag";
import { formatINR, formatINRCompact } from "@/lib/commission/format";
import type { BandTable } from "@/lib/commission/types";
import type { StageProps } from "./types";

function Lock({ open }: { open: boolean }) {
  return (
    <svg className={`${styles.lock} ${open ? styles.lockOpen : ""}`} viewBox="0 0 40 48" aria-hidden="true">
      <path className={styles.shackle} d="M12 22v-7.5a8 8 0 0 1 16 0V22" />
      <rect className={styles.lockBody} x="7" y="22" width="26" height="20" rx="1.5" />
      <circle className={styles.keyhole} cx="20" cy="30.5" r="2" />
      <path className={styles.keyhole} d="M20 32.5v3.5" />
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
  const pos = (i: number) => (tiers.length === 1 ? 50 : (i / (tiers.length - 1)) * 100);
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
        frame="04"
        kicker="Frame 04 · The Delivery"
        title={<>When would you like to <em>relive it?</em></>}
        lead="After the last guest leaves, our edit suite begins: selection, retouching, colour grading, sound design and final exports. Choose how quickly your story returns to you."
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
          <div className={styles.timelineWrap}>
          <section className={styles.timelineStage} aria-label="Delivery timeline">
            <div className={styles.origin}>
              <span className={base.mono}>DAY 0</span>
              <span>Your final event</span>
            </div>
            <div className={styles.track} style={{ ["--sel" as string]: selected ? `${pos(selectedIdx)}%` : "0%" }}>
              <div className={styles.rail} aria-hidden="true">
                <span className={styles.railFill} />
                <span className={`${styles.indicator} ${selected ? styles.indicatorOn : ""}`}>
                  <i />
                </span>
              </div>
              <div className={styles.milestones} role="radiogroup" aria-label="Delivery timeline">
                {tiers.map((t, i) => {
                  const isSel = t.id === draft.deliveryTierId;
                  return (
                    <button
                      key={t.id}
                      id={`tier-${t.id}`}
                      role="radio"
                      aria-checked={isSel}
                      tabIndex={isSel || (!selected && i === 0) ? 0 : -1}
                      className={`${styles.milestone} ${isSel ? styles.milestoneOn : ""} ${selected && i < selectedIdx ? styles.milestonePassed : ""}`}
                      style={{ ["--x" as string]: `${pos(i)}%` }}
                      onClick={() => actions.setTier(t.id)}
                      onKeyDown={(e) => onKey(e, i)}
                    >
                      <span className={styles.lockWrap}><Lock open={isSel} /></span>
                      <span className={styles.msDays}>{t.days < 90 ? `${t.days} days` : `${Math.round(t.days / 30)} months`}</span>
                      <span className={styles.msName}>{t.priorityName}</span>
                      <span className={styles.msMult}>{t.multiplier}×</span>
                      <span className={styles.msFee}>{pp.baseFee > 0 ? formatINR(feeAt(t.multiplier)) : "—"}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
          </div>

          <div className={styles.detailGrid}>
            <section className={styles.tierDetail} aria-live="polite">
              {selected ? (
                <div key={selected.id} className={styles.tierDetailInner}>
                  <p className={base.kicker}>{selected.label}</p>
                  <h2 className={styles.tierTitle}>{selected.priorityName}</h2>
                  <p className={styles.tierMeaning}>{selected.meaning}</p>
                  <dl className={styles.tierFacts}>
                    <div><dt>Why this price</dt><dd>{selected.whyPrice}</dd></div>
                    <div><dt>What to expect</dt><dd>{selected.expectations}</dd></div>
                    <div><dt>Covers</dt><dd>{selected.covers.join(" · ")}</dd></div>
                    <div><dt>Conditions</dt><dd>{selected.conditions}</dd></div>
                  </dl>
                </div>
              ) : (
                <p className={st.muted}>Select a milestone to unlock its delivery promise.</p>
              )}
            </section>

            <section className={styles.feeCard} aria-label="Post-production fee">
              <p className={base.kicker}>Post-production</p>
              <div className={styles.feeFigure}>
                <AnimatedNumber value={pp.finalFee} />
                {pp.overridden && <small>Studio adjusted — {pp.overrideReason}</small>}
              </div>
              <div className={styles.equation}>
                <span><small>Base fee</small>{formatINR(pp.baseFee)}</span>
                <span className={styles.op}>×</span>
                <span><small>Priority</small>{pp.multiplier !== null ? `${pp.multiplier}×` : "—"}</span>
                <span className={styles.op}>=</span>
                <span><small>Computed</small>{formatINR(pp.computedFee)}</span>
              </div>
              {pp.resolutions.map((r) => (
                <div key={r.pool} className={styles.bandBlock}>
                  <BandChart
                    table={config.postProduction.mode === "split" ? config.postProduction[r.pool as "photo" | "video"] : config.postProduction.combined}
                    subtotal={r.subtotal}
                    fee={r.fee}
                    label={r.pool === "combined" ? "Creative production" : r.pool === "photo" ? "Photography" : "Video"}
                  />
                  <p className={styles.bandNote}>
                    {r.pool === "combined" ? "Production subtotal" : `${r.pool[0].toUpperCase()}${r.pool.slice(1)} subtotal`}{" "}
                    <b>{formatINR(r.subtotal)}</b> → base fee <b>{formatINR(r.fee)}</b>. {r.explanation}
                  </p>
                </div>
              ))}
              <p className={styles.bandFoot}>
                The base fee follows the studio&apos;s budget bands — it is not a fixed percentage
                {quote.otherSubtotal > 0 ? "; live streaming needs no post-production and is excluded" : ""}.
              </p>
            </section>
          </div>

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

function BandChart({ table, subtotal, fee, label }: { table: BandTable; subtotal: number; fee: number; label: string }) {
  const bands = [...table.bands].sort((a, b) => a.threshold - b.threshold);
  if (bands.length === 0) return null;
  const W = 320, H = 96, P = 10;
  const maxX = Math.max(bands[bands.length - 1].threshold * 1.15, subtotal * 1.05);
  const maxY = Math.max(...bands.map((b) => b.fee), fee) * 1.2 || 1;
  const x = (v: number) => P + (v / maxX) * (W - 2 * P);
  const y = (v: number) => H - P - (v / maxY) * (H - 2 * P);
  const pts: [number, number][] = [];
  if (table.belowFirstBand === "proportional") pts.push([0, 0]);
  else pts.push([0, bands[0].fee]);
  bands.forEach((b, i) => {
    if (table.interpolation === "step" && i > 0) pts.push([b.threshold, bands[i - 1].fee]);
    pts.push([b.threshold, b.fee]);
  });
  pts.push([maxX, bands[bands.length - 1].fee]);
  const d = pts.map(([a, b], i) => `${i ? "L" : "M"}${x(a).toFixed(1)},${y(b).toFixed(1)}`).join(" ");
  return (
    <svg className={styles.bandChart} viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${label} budget bands: base fee ${formatINR(fee)} at ${formatINR(subtotal)}`}>
      <path className={styles.bandAxis} d={`M${P},${H - P}H${W - P}`} />
      <path className={styles.bandLine} d={d} />
      {bands.map((b) => (
        <g key={b.threshold}>
          <circle className={styles.bandPt} cx={x(b.threshold)} cy={y(b.fee)} r="2.2" />
          <text className={styles.bandTick} x={x(b.threshold)} y={H - 1} textAnchor="middle">{formatINRCompact(b.threshold).replace("₹", "")}</text>
        </g>
      ))}
      {subtotal > 0 && (
        <g className={styles.bandMarker} style={{ transform: `translate(${x(Math.min(subtotal, maxX))}px, ${y(fee)}px)` }}>
          <line x1="0" y1="0" x2="0" y2={H - P - y(fee)} />
          <circle r="4.5" />
        </g>
      )}
    </svg>
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
