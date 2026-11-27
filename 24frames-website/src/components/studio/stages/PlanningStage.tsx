"use client";

import { useEffect, useRef, useState } from "react";
import { optimised } from "../ui/optimised";
import styles from "../stages.module.css";
import px from "../planning.module.css";
import { StageFooter, StageHeader } from "./StageChrome";
import PartnerBloom from "./PartnerBloom";
import PartnerShowcase, { type ShowcaseVariant } from "./PartnerShowcase";
import { PLANNING_SERVICES } from "@/lib/commission/planning";
import type { StageProps } from "./types";

/* The first service blooms as the lotus; each one after it opens in its own way. */
const VARIANT: Record<string, ShowcaseVariant> = { decor: "slide", costumes: "fan", jewellery: "necklace", makeup: "orbit" };
const sideBySide = () => window.innerWidth > 820;

type Lenisish = { scrollTo: (to: number, o?: object) => void; resize?: () => void };

/* Keep an opening or closing service exactly where it is on screen: while
   its row grows or shrinks, scroll by however far it would have moved, so
   the flower never drifts up or down. A visitor who scrolls takes over. */
function holdStill(id: string) {
  const el = document.querySelector<HTMLElement>(`[data-stage="${id}"]`);
  if (!el) return () => {};
  const centre = () => {
    const r = el.getBoundingClientRect();
    return r.top + r.height / 2;
  };
  const start = centre();
  const html = document.documentElement;
  const anchor = html.style.overflowAnchor;
  html.style.overflowAnchor = "none"; // the browser's own anchoring would fight us
  const lenis = (window as unknown as { __studioLenis?: Lenisish }).__studioLenis;
  const t0 = performance.now();
  let raf = 0;
  const end = () => {
    cancelAnimationFrame(raf);
    html.style.overflowAnchor = anchor;
    window.removeEventListener("wheel", end);
    window.removeEventListener("touchstart", end);
    window.removeEventListener("keydown", end);
  };
  // Hold until the row has stopped changing size (a slow phone may take
  // longer than the transition says), but never more than a few seconds.
  const row = el.parentElement ?? el;
  let size = -1;
  let settledAt = t0;
  const tick = (now: number) => {
    const drift = centre() - start;
    if (Math.abs(drift) >= 0.5) {
      const to = window.scrollY + drift;
      if (lenis) {
        lenis.resize?.(); // the page just grew; let Lenis know how far it can now go
        lenis.scrollTo(to, { immediate: true, force: true });
      }
      else window.scrollTo(0, to);
    }
    const h = el.offsetHeight + row.offsetHeight;
    if (h !== size) {
      size = h;
      settledAt = now;
    }
    const still = now - settledAt > 300 && now - t0 > 1000;
    if (!still && now - t0 < 4000) raf = requestAnimationFrame(tick);
    else end();
  };
  raf = requestAnimationFrame(tick);
  const opts = { passive: true } as const;
  window.addEventListener("wheel", end, opts);
  window.addEventListener("touchstart", end, opts);
  window.addEventListener("keydown", end);
  return end;
}

/* Frame 02 — the 24 Frames privileges. Nothing to choose here: four
   services, each a single circle set alternately left and right. Opening
   one blooms it into a flower of its five partner brands; couples mention 24 Frames
   at those brands to redeem their privilege, and the sales team walks them
   through the offers on the call or in person. */
export default function PlanningStage({ go }: StageProps) {
  const [open, setOpen] = useState<string | null>(null);
  // The partner whose card is showing beside the open flower (index into its partners).
  const [pick, setPick] = useState<number | null>(null);
  const release = useRef<() => void>(() => {});
  useEffect(() => () => release.current(), []);
  const keep = (id: string | null) => {
    release.current();
    if (id) release.current = holdStill(id);
  };
  const choose = (k: number | null) => {
    if (open && sideBySide()) keep(open); // the card swaps in beside the flower
    setPick(k);
  };
  // On a phone the card lands below the flower, so bring it into view.
  useEffect(() => {
    if (pick === null || sideBySide()) return;
    const t = window.setTimeout(() => {
      const card = document.querySelector<HTMLElement>(`.${px.card}`);
      if (!card) return;
      const r = card.getBoundingClientRect();
      const below = r.bottom + 16 - window.innerHeight;
      if (below <= 0) return; // already in view
      const lenis = (window as unknown as { __studioLenis?: { scrollTo: (to: number, o?: object) => void } }).__studioLenis;
      const top = window.scrollY + Math.min(below, r.top - 72);
      if (lenis) lenis.scrollTo(top, { duration: 0.9 });
      else window.scrollTo({ top, behavior: "smooth" });
    }, 80);
    return () => window.clearTimeout(t);
  }, [pick]);
  const toggle = (id: string) => {
    keep(id);
    setPick(null);
    setOpen((o) => (o === id ? null : id));
  };

  return (
    <div className={styles.stageInner}>
      <StageHeader
        frame="02"
        kicker="Frame 02 · The Planning"
        title={<>Planning an event? <em>We&apos;ve got you covered.</em></>}
        lead="As a 24 Frames couple, the brands we work with welcome you with privileges of their own. Mention our name when you visit — your relationship manager will walk you through every offer."
      />

      <ol className={px.rows} role="list">
        {PLANNING_SERVICES.map((s, i) => {
          const on = open === s.id;
          const side = i % 2 === 0 ? px.left : px.right;
          return (
            <li key={s.id} className={`${px.row} ${side} ${on ? px.rowOpen : ""}`} style={{ "--i": i } as React.CSSProperties}>
              <div className={px.stage} data-stage={s.id} data-v={VARIANT[s.id] ?? "lotus"}>
                {VARIANT[s.id] ? (
                  <PartnerShowcase
                    service={s}
                    variant={VARIANT[s.id]}
                    open={on}
                    onToggle={() => toggle(s.id)}
                    eager={i < 2}
                    selected={on ? pick : null}
                    onPick={(k) => choose(pick === k ? null : k)}
                  />
                ) : (
                  <PartnerBloom
                    service={s}
                    open={on}
                    onToggle={() => toggle(s.id)}
                    eager={i < 2}
                    selected={on ? pick : null}
                    onPick={(k) => choose(pick === k ? null : k)}
                  />
                )}
              </div>

              <div className={px.copy}>
                <span className={px.no}>{String(i + 1).padStart(2, "0")}</span>
                <h3 className={px.title}>{s.title}</h3>
                <p className={px.line}>{s.line}</p>
                {on && pick === null && (
                  <ol className={px.partners}>
                    {s.partners.map((p, k) =>
                      p.placeholder ? null : (
                        <li key={p.name} style={{ "--k": k } as React.CSSProperties}>
                          <button type="button" className={`${px.partnerBtn} ${pick === k ? px.partnerOn : ""}`} onClick={() => choose(k)} aria-expanded={false}>
                            <span className={px.partnerNo}>{String(k + 1).padStart(2, "0")}</span>
                            <span className={px.partnerName}>{p.name}</span>
                            {p.perk && <span className={px.partnerPerk}>{p.perk}</span>}
                          </button>
                        </li>
                      ),
                    )}
                  </ol>
                )}
                {on && pick === null && <p className={px.hint}>Tap {VARIANT[s.id] ? "a partner" : "a petal"} or a name to see the place and the privilege.</p>}
                {on && pick !== null && s.partners[pick] && (() => {
                  const p = s.partners[pick];
                  return (
                    <article key={p.name} className={px.card} aria-live="polite">
                      {p.photo && (
                        <figure className={px.cardPhoto}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={optimised(p.photo, 640)} alt={p.name} decoding="async" />
                        </figure>
                      )}
                      <div className={px.cardBody}>
                        <span className={px.cardKicker}>{s.title}{p.perk ? ` · ${p.perk}` : ""}</span>
                        <h4 className={px.cardTitle}>{p.name}</h4>
                        {p.about && <p className={px.cardText}>{p.about}</p>}
                        <p className={px.cardNote}>Mention 24 Frames when you visit — your relationship manager will confirm the current privilege.</p>
                      </div>
                      <button type="button" className={px.cardClose} onClick={() => choose(null)} aria-label={`Close ${p.name}`}>×</button>
                    </article>
                  );
                })()}
                {on && pick !== null && (
                  <button type="button" className={px.backToList} onClick={() => choose(null)}>
                    <span aria-hidden="true">←</span> All partners
                  </button>
                )}
                <button type="button" className={px.more} onClick={() => toggle(s.id)} aria-expanded={on}>
                  {on ? "Hide partners" : "See our partners"} <span aria-hidden="true">→</span>
                </button>
              </div>
            </li>
          );
        })}
      </ol>

      <p className={px.footnote}>Privileges are offered by each partner and may change; your relationship manager will confirm the current offers. Photographs are from 24 Frames celebrations.</p>

      <StageFooter onBack={() => go("couple")} backLabel="The couple" onNext={() => go("celebration")} nextLabel="Continue to photography" />
    </div>
  );
}
