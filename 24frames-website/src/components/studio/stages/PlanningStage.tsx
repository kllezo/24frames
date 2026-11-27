"use client";

import { useEffect, useRef, useState } from "react";
import { optimised } from "../ui/optimised";
import styles from "../stages.module.css";
import px from "../planning.module.css";
import { StageFooter, StageHeader } from "./StageChrome";
import PartnerBloom from "./PartnerBloom";
import { PLANNING_SERVICES } from "@/lib/commission/planning";
import type { StageProps } from "./types";

const sideBySide = () => window.innerWidth > 820;

type Lenisish = { scrollTo: (to: number, o?: object) => void; resize?: () => void };

const studioLenis = () => (window as unknown as { __studioLenis?: Lenisish }).__studioLenis;
const jumpTo = (y: number) => {
  const lenis = studioLenis();
  if (lenis) {
    lenis.resize?.(); // the page may just have grown; let Lenis know how far it can go
    lenis.scrollTo(y, { immediate: true, force: true });
  } else window.scrollTo(0, y);
};

/* Glide the page until a service's circle sits in the middle of the screen,
   then resolve — the flower opens or closes only once it is centred. The
   aim is re-measured every frame, so it lands true even if the page shifts. */
function glideToCentre(id: string): Promise<void> {
  const el = document.querySelector<HTMLElement>(`[data-stage="${id}"]`);
  if (!el) return Promise.resolve();
  const aim = () => {
    const r = el.getBoundingClientRect();
    const want = window.scrollY + r.top + r.height / 2 - window.innerHeight / 2;
    return Math.max(0, Math.min(want, document.documentElement.scrollHeight - window.innerHeight));
  };
  const from = window.scrollY;
  const distance = Math.abs(aim() - from);
  if (distance < 3) return Promise.resolve();
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    jumpTo(aim());
    return Promise.resolve();
  }
  // Short hops are quick; long ones take a little longer, never sluggish.
  const duration = Math.min(1000, 420 + distance * 0.45);
  return new Promise((resolve) => {
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      const eased = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2; // ease in and out
      jumpTo(from + (aim() - from) * eased);
      if (p < 1) requestAnimationFrame(tick);
      else resolve();
    };
    requestAnimationFrame(tick);
  });
}

/* Keep an opening or closing service exactly where it is on screen: while
   its row grows or shrinks, scroll by however far it would have moved, so
   the flower never drifts up or down. A visitor who scrolls takes over. */
function holdStill(id: string, opening?: boolean) {
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
    if (Math.abs(drift) >= 0.5) jumpTo(window.scrollY + drift);
    const h = el.offsetHeight + row.offsetHeight;
    if (h !== size) {
      size = h;
      settledAt = now;
    }
    // When opening or closing, also wait for the stage to reach its final
    // size: a busy phone can start the growth a beat late.
    const core = el.querySelector<HTMLElement>("button[aria-expanded]");
    const target = opening === undefined ? null : opening ? el.offsetWidth : core?.offsetWidth ?? el.offsetHeight;
    const arrived = target === null || Math.abs(el.offsetHeight - target) <= 1;
    const still = arrived && now - settledAt > 300 && now - t0 > 1000;
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
  const keep = (id: string | null, opening?: boolean) => {
    release.current();
    if (id) release.current = holdStill(id, opening);
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
  // Opening or closing: first glide the circle to the middle of the screen,
  // then bloom or fold it there, holding it still while its row resizes.
  const busy = useRef(false);
  const toggle = async (id: string) => {
    if (busy.current) return;
    busy.current = true;
    release.current();
    try {
      await glideToCentre(id);
    } finally {
      keep(id, open !== id);
      setPick(null);
      setOpen((o) => (o === id ? null : id));
      busy.current = false;
    }
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
              <div className={px.stage} data-stage={s.id}>
                <PartnerBloom
                  service={s}
                  open={on}
                  onToggle={() => toggle(s.id)}
                  eager={i < 2}
                  selected={on ? pick : null}
                  onPick={(k) => choose(pick === k ? null : k)}
                />
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
                {on && pick === null && <p className={px.hint}>Tap a petal or a name to see the place and the privilege.</p>}
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
