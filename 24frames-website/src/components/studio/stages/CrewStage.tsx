"use client";

import { optimised } from "../ui/optimised";
import { useEffect, useMemo, useRef, useState } from "react";
import { shutter } from "../ui/shutter";
import cx from "../cinema.module.css";
import st from "../stages.module.css";
import base from "../studio.module.css";
import { StageFooter, StageHeader } from "./StageChrome";
import { roman } from "@/lib/commission/format";
import { eventDisplayName } from "@/lib/commission/model";
import { storyFor } from "@/lib/commission/stories";
import type { StageProps } from "./types";

/* Frame 03 — the crew on a single screen. A name on the left brings
   that person forward on the right; nothing to scroll through. */
/* Frame 03 — the crew as medallions on a gilded orbit. The seven
   portraits sit around a fine gold circle; the chosen one rests at the
   crown, enlarged and in colour, and its story is set inside the orbit
   like the words on a crest. Tap a medallion, swipe, or use the arrows:
   the whole orbit turns, and every medallion stays upright as it travels. */
/* The focus scale of a lens barrel: fine ticks every 3°, a long tick
   every 15°, and distance marks every 30°. It turns with the orbit. */
const LENS_TICKS = Array.from({ length: 120 }, (_, i) => ({ a: i * 3, major: i % 5 === 0 }));
const LENS_MARKS = ["∞", "30", "15", "10", "7", "5", "3", "2", "1.5", "1.2", "1", "0.8"].map((label, i) => ({ a: i * 30, label }));

export default function CrewStage({ config, draft, go }: StageProps) {
  const services = useMemo(
    () => config.services.filter((s) => s.active).sort((a, b) => a.order - b.order),
    [config.services],
  );
  const n = Math.max(1, services.length);
  const step = 360 / n;
  const [active, setActive] = useState(0);
  // The way forward unlocks once they've met every member of the crew.
  const [seen, setSeen] = useState<Set<number>>(() => new Set([0]));
  const choose = (i: number) => {
    setActive(i);
    setSeen((prev) => (prev.has(i) ? prev : new Set(prev).add(i)));
  };
  const [turn, setTurn] = useState(0);
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{ x: number; start: number } | null>(null);
  const moved = useRef(false);

  const norm = (i: number) => ((i % n) + n) % n;
  /** Turn the orbit the short way round so medallion i rests at the crown. */
  function go1(i: number) {
    const target = norm(i);
    let delta = (norm(active) - target) * step;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    if (target !== norm(active)) shutter();
    setTurn((t) => t + delta);
    choose(target);
  }
  /** Degrees the orbit turns per pixel of finger travel, so the medallion
      under the finger follows it along the arc. */
  const degPerPx = () => {
    const r = Math.min(400, Math.max(170, window.innerWidth * (window.innerWidth <= 640 ? 0.38 : 0.36)));
    return 57.3 / r;
  };
  function onDown(e: React.PointerEvent) {
    if ((e.target as HTMLElement).closest("[data-no-drag]")) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    drag.current = { x: e.clientX, start: turn };
    moved.current = false;
  }
  function onMove(e: React.PointerEvent) {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x;
    if (Math.abs(dx) > 6 && !moved.current) {
      moved.current = true;
      setDragging(true);
      try { (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); } catch { /* pointer already gone */ }
    }
    if (moved.current) setTurn(drag.current.start + dx * degPerPx());
  }
  function onUp(e: React.PointerEvent) {
    if (!drag.current) return;
    const { x, start } = drag.current;
    drag.current = null;
    setDragging(false);
    if (!moved.current) return;
    const dx = e.clientX - x;
    const delta = dx * degPerPx();
    // Any deliberate swipe moves at least one medallion; longer swipes move more.
    const steps = Math.abs(dx) < 24 ? 0 : Math.sign(delta) * Math.max(1, Math.round(Math.abs(delta) / step));
    const snapped = start + steps * step;
    if (steps) shutter();
    setTurn(snapped);
    choose(norm(Math.round(-snapped / step)));
    window.setTimeout(() => { moved.current = false; }, 0);
  }

  // Trackpad: a sideways two-finger swipe turns the orbit, then it settles.
  const section = useRef<HTMLElement>(null);
  const turnRef = useRef(turn);
  const activeRef = useRef(active);
  useEffect(() => {
    turnRef.current = turn;
    activeRef.current = active;
  }, [turn, active]);
  useEffect(() => {
    const el = section.current;
    if (!el) return;
    let settle = 0;
    let from: number | null = null;
    let travel = 0;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) || Math.abs(e.deltaX) < 1) return;
      e.preventDefault();
      if (from === null) { from = turnRef.current; travel = 0; }
      travel += e.deltaX;
      setDragging(true);
      const next = turnRef.current - e.deltaX * degPerPx();
      turnRef.current = next;
      setTurn(next);
      window.clearTimeout(settle);
      settle = window.setTimeout(() => {
        setDragging(false);
        // A deliberate swipe always moves at least one medallion.
        const start = from ?? turnRef.current;
        const delta = turnRef.current - start;
        const steps = Math.abs(travel) < 30 ? 0 : Math.sign(delta || -travel) * Math.max(1, Math.round(Math.abs(delta) / step));
        from = null;
        const snapped = Math.round(start / step) * step + steps * step;
        const idx = norm(Math.round(-snapped / step));
        if (idx !== activeRef.current) shutter();
        setTurn(snapped);
        choose(idx);
      }, 140);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      window.clearTimeout(settle);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const need = services.length;
  const svc = services[active];
  const occasions = draft.events.slice(0, 3);

  return (
    <div className={st.stageInner}>
      <div className={cx.crewHead}>
        <StageHeader
          frame="03"
          kicker="Frame 03 · The Crew"
          title={<>Know your crew <em>before you choose.</em></>}
          lead="Seven kinds of photographers and filmmakers, each seeing your day differently. Understand what each one brings — then pick who joins every occasion."
        />
        <div className={cx.crewGate} aria-live="polite">
          {seen.size >= need ? (
            <button type="button" className={`${base.btnPrimary} ${cx.crewNext}`} onClick={() => go("ensemble")}>
              Choose your crew
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M14 6l6 6-6 6" /></svg>
            </button>
          ) : (
            <>
              <span className={cx.crewDots} aria-hidden="true">
                {Array.from({ length: need }, (_, i) => <i key={i} className={i < seen.size ? cx.crewDotOn : ""} />)}
              </span>
              <p className={cx.crewProgress}>{seen.size} of {need} explored</p>
              <p className={cx.crewScrollHint}>Swipe the lens to meet the others →</p>
            </>
          )}
        </div>
      </div>

      <section
        ref={section}
        className={`${cx.med} ${dragging ? cx.medDragging : ""}`}
        aria-label="The crew"
        style={{ "--turn": `${turn}deg` } as React.CSSProperties}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") { e.preventDefault(); go1(active + 1); }
          if (e.key === "ArrowLeft") { e.preventDefault(); go1(active - 1); }
        }}
      >
        <div className={cx.medStage}>
          <span className={cx.medKnurl} aria-hidden="true" />
          <span className={cx.medIndex} aria-hidden="true" />
          <svg className={cx.medLens} viewBox="-500 -500 1000 1000" aria-hidden="true">
            <circle r="499" className={cx.medLensRim} />
            <circle r="440" className={cx.medLensRim} />
            {LENS_TICKS.map((t) => (
              <line key={t.a} x1="0" y1={-499} x2="0" y2={t.major ? -462 : -478} transform={`rotate(${t.a})`} className={t.major ? cx.medTickMajor : cx.medTick} />
            ))}
            {LENS_MARKS.map((m) => (
              <text key={m.a} x="0" y="-420" transform={`rotate(${m.a})`} className={cx.medMark}>{m.label}</text>
            ))}
          </svg>
          <div className={cx.medWheel}>
            {services.map((s, i) => {
              let ang = (i * step + turn) % 360;
              if (ang > 180) ang -= 360;
              if (ang < -180) ang += 360;
              const dist = Math.abs(ang) / step;
              const on = i === active;
              // Grows as it nears the crown — continuously while dragging.
              const scale = 1 + 1.05 * Math.max(0, 1 - dist);
              const opacity = dist < 0.5 ? 1 : dist <= 2.3 ? Math.max(0.35, 0.95 - (dist - 1) * 0.35) : 0;
              return (
                <button
                  key={s.id}
                  type="button"
                  className={`${cx.medItem} ${on ? cx.medOn : ""}`}
                  style={{ "--a": `${i * step}deg`, "--s": scale.toFixed(3), opacity, pointerEvents: opacity ? undefined : "none" } as React.CSSProperties}
                  onClick={() => { if (!moved.current) go1(i); }}
                  aria-label={s.name}
                  aria-pressed={on}
                  tabIndex={opacity ? 0 : -1}
                >
                  <span className={cx.medInner}>
                    <span className={cx.medDisc}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={optimised(s.image, 384)} alt="" draggable={false} loading="eager" decoding="async" />
                    </span>
                    <span className={cx.medNo}>{roman(i)}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {svc && (
          <div className={cx.medInfo}>
            <div key={svc.id} className={cx.medInfoBody} aria-live="polite">
              <p className={cx.fanEpithet}>{svc.epithet}</p>
              <h2 className={cx.spotName}>{svc.name}</h2>
              <p className={cx.spotIntro}>{svc.introduction}</p>
              {occasions.length > 0 && (
                <ul className={cx.spotAt}>
                  {occasions.map((e) => {
                    const story = storyFor(svc.id, e.type, eventDisplayName(e, config));
                    return story ? (
                      <li key={e.id}><span>{eventDisplayName(e, config)}</span>{story.headline}</li>
                    ) : null;
                  })}
                </ul>
              )}
            </div>
            <div className={cx.medNav} data-no-drag>
              <button type="button" className={cx.reelArrow} onClick={() => go1(active - 1)} aria-label="Previous">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
              </button>
              <span className={cx.reelCount}>{roman(active)} <small>/ {roman(n - 1)}</small></span>
              <button type="button" className={cx.reelArrow} onClick={() => go1(active + 1)} aria-label="Next">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>
        )}
      </section>

      <StageFooter onBack={() => go("celebration")} backLabel="Occasions" />
    </div>
  );
}
