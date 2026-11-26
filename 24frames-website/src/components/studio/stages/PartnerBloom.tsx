"use client";

import { useEffect, useId, useRef } from "react";
import px from "../planning.module.css";
import type { PlanningService } from "@/lib/commission/planning";

/* One service as a single circle. Opening it blooms a lotus out of the
   photograph: a ring of large blush petals unfurls behind, then the
   ivory petals — one per partner brand, each carrying its logo — spiral
   open in front of them, while the photograph gives way to the 24 Frames
   seal at the heart of the flower. Tapping a petal opens that partner's
   card beside the flower. Opening also glides the page so the flower
   sits in the middle of the screen. */

/* A lotus petal: a slender almond, narrow at the heart and drawn to a fine point. */
const PETAL =
  "M0,0 C-38,-34 -98,-112 -98,-192 C-98,-262 -44,-306 0,-340 C44,-306 98,-262 98,-192 C98,-112 38,-34 0,0 Z";
/* The fine midrib and side veins that make a petal read as a petal. */
const VEINS = "M0,-18 C-1,-130 -1,-240 0,-326 M0,-46 C-26,-120 -40,-200 -34,-280 M0,-46 C26,-120 40,-200 34,-280";
/* Gold stamens ringing the heart, between the seal and the petals. */
const STAMENS = Array.from({ length: 36 }, (_, i) => (i * 360) / 36);

/* A full ring: the first petal points straight up, the rest evenly round. */
const anglesFor = (n: number) => Array.from({ length: Math.max(n, 1) }, (_, k) => 270 + (k * 360) / Math.max(n, 1));
const OPEN_SECONDS = 2.9;
const BASE = 146; // ivory petal base distance from the centre (viewBox units), just outside the shrunk heart
const OUTER_BASE = 128; // the blush petals start a little further in, behind
const OUTER_SCALE = 1.06; // and reach further out, so their tips frame the ivory ring
const DISC_Y = 196; // the logo medallion sits at the widest part of the petal
const R = 72; // logo medallion radius — a jewel on the petal, not a plate

/** "Lakefront venues" → "Lv"; "Farmhouses" → "F". */
const monogram = (name: string) =>
  name
    .split(/[\s&]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w, i) => (i === 0 ? w[0].toUpperCase() : w[0].toLowerCase()))
    .join("");

const clamp = (x: number) => Math.min(1, Math.max(0, x));
const easeOut = (x: number) => 1 - Math.pow(1 - x, 4);
/* A gentle overshoot, so each petal settles like it is breathing open. */
const easeBack = (x: number) => {
  const c = 1.3;
  return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2);
};

/* Spiral twist: each ivory petal unwinds into place while it grows. */
function petalAt(k: number, t: number, angles: number[]) {
  const p = clamp((t - 0.45 - k * 0.12) / 1.7);
  return { angle: angles[k] - 140 * (1 - easeOut(p)), scale: easeBack(p), opacity: clamp(p * 2.2) };
}

/* The blush petals sit between and behind the ivory ones, and open first. */
function outerAt(k: number, t: number, angles: number[]) {
  const p = clamp((t - k * 0.06) / 1.4);
  const gap = 180 / angles.length;
  return { angle: angles[k] + gap - 80 * (1 - easeOut(p)), scale: easeOut(p) * OUTER_SCALE, opacity: clamp(p * 1.6) };
}

export default function PartnerBloom({
  service,
  open,
  onToggle,
  eager,
  selected,
  onPick,
}: {
  service: PlanningService;
  open: boolean;
  onToggle: () => void;
  eager?: boolean;
  /** Index of the partner whose card is showing, if any. */
  selected?: number | null;
  onPick?: (index: number) => void;
}) {
  const uid = useId().replace(/:/g, "");
  const petals = useRef<(SVGGElement | null)[]>([]);
  const outers = useRef<(SVGGElement | null)[]>([]);
  const labels = useRef<(SVGGElement | null)[]>([]);
  const root = useRef<HTMLDivElement>(null);
  const time = useRef(0);

  // Glide the page so the opened flower sits in the middle of the screen.
  // Run again once the stage has finished growing, since the page may
  // have been too short to reach the right spot at first.
  useEffect(() => {
    if (!open || !root.current) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const glide = (duration: number) => {
      const stage = root.current?.parentElement;
      if (!stage) return;
      const r = stage.getBoundingClientRect();
      const finalHeight = r.width; // the stage grows to a square the size of the flower
      const top = Math.max(0, window.scrollY + r.top + finalHeight / 2 - window.innerHeight / 2);
      const lenis = (window as unknown as { __lenis?: { scrollTo: (to: number, o?: object) => void } }).__lenis;
      if (lenis) lenis.scrollTo(top, { duration: reduce ? 0 : duration, immediate: reduce });
      else window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
    };
    glide(1.4);
    const again = window.setTimeout(() => glide(0.6), 1000);
    return () => window.clearTimeout(again);
  }, [open]);

  useEffect(() => {
    const angles = anglesFor(service.partners.length);
    const draw = (t: number) =>
      angles.forEach((_, k) => {
        const g = petals.current[k];
        const l = labels.current[k];
        const o = outers.current[k];
        if (o) {
          const q = outerAt(k, t, angles);
          o.setAttribute("transform", `rotate(${q.angle + 90}) translate(0,-${OUTER_BASE}) scale(${Math.max(q.scale, 0.001)})`);
          o.style.opacity = String(q.opacity);
        }
        if (!g || !l) return;
        const s = petalAt(k, t, angles);
        g.setAttribute("transform", `rotate(${s.angle + 90}) translate(0,-${BASE}) scale(${Math.max(s.scale, 0.001)})`);
        g.style.opacity = String(s.opacity);
        // Keep each logo upright whatever the petal's angle.
        l.setAttribute("transform", `translate(0,-${DISC_Y}) rotate(${-(s.angle + 90)})`);
      });

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      time.current = open ? OPEN_SECONDS : 0;
      draw(time.current);
      return;
    }
    let raf = 0;
    let last = performance.now();
    const step = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      time.current = Math.min(OPEN_SECONDS, Math.max(0, time.current + dt * (open ? 1 : -2.6)));
      draw(time.current);
      if (open ? time.current < OPEN_SECONDS : time.current > 0) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [open, service.partners.length]);

  return (
    <div ref={root} className={`${px.bloom} ${open ? px.bloomOpen : ""}`}>
      <svg className={px.flower} viewBox="-500 -500 1000 1000" aria-hidden="true">
        <defs>
          {/* Ivory petal: warm champagne at the heart, pearl through the body, a natural lotus blush at the tip. */}
          <linearGradient id={`pf${uid}`} x1="0" y1="0" x2="0" y2="-340" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#efdcb4" />
            <stop offset=".2" stopColor="#f9efdc" />
            <stop offset=".55" stopColor="#fffbf4" />
            <stop offset=".8" stopColor="#fdf1ec" />
            <stop offset=".93" stopColor="#f6d6d6" />
            <stop offset="1" stopColor="#eab3bb" />
          </linearGradient>
          {/* Blush petal: pale at the heart, deepening to a rose tip. */}
          <linearGradient id={`pb${uid}`} x1="0" y1="0" x2="0" y2="-340" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#fbefe9" />
            <stop offset=".4" stopColor="#f5d4d3" />
            <stop offset=".78" stopColor="#e8a8b2" />
            <stop offset="1" stopColor="#d4818e" />
          </linearGradient>
          {/* Side light across each petal, so it reads as gently cupped, not flat. */}
          <linearGradient id={`pl${uid}`} x1="-98" y1="0" x2="98" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#fff" stopOpacity=".6" />
            <stop offset=".42" stopColor="#fff" stopOpacity="0" />
            <stop offset="1" stopColor="#7a4a3a" stopOpacity=".07" />
          </linearGradient>
          <linearGradient id={`pe${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ecd29c" />
            <stop offset=".5" stopColor="#b8904c" />
            <stop offset="1" stopColor="#e9cf94" />
          </linearGradient>
          <radialGradient id={`pg${uid}`} cx=".5" cy=".5" r=".5">
            <stop offset="0" stopColor="#f6dca0" stopOpacity=".5" />
            <stop offset=".55" stopColor="#f3cccc" stopOpacity=".2" />
            <stop offset="1" stopColor="#f3cccc" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`pd${uid}`} cx=".38" cy=".32" r=".8">
            <stop offset="0" stopColor="#fffdf8" />
            <stop offset=".6" stopColor="#f3e7cd" />
            <stop offset="1" stopColor="#dfc79a" />
          </radialGradient>
          <filter id={`sh${uid}`} x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#6b5530" floodOpacity=".14" />
          </filter>
          <filter id={`so${uid}`} x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="4" stdDeviation="7" floodColor="#a0606a" floodOpacity=".12" />
          </filter>
        </defs>
        <circle className={px.halo} r="490" fill={`url(#pg${uid})`} />

        {/* The outer ring: large blush petals, opening first, behind. */}
        {[...service.partners.keys()].map((k) => (
          <g key={`o${k}`} ref={(n) => void (outers.current[k] = n)} style={{ opacity: 0 }}>
            <path d={PETAL} fill={`url(#pb${uid})`} stroke="#d99aa4" strokeWidth="1" filter={`url(#so${uid})`} />
            <path d={PETAL} fill={`url(#pl${uid})`} />
            <path d={VEINS} fill="none" stroke="#c97f8b" strokeWidth="1.3" strokeLinecap="round" opacity=".28" />
          </g>
        ))}

        {/* The inner ring: ivory petals, one per partner, each holding its logo. */}
        {[...service.partners.keys()].reverse().map((k) => {
          const p = service.partners[k];
          const pickable = open && !p.placeholder && !!onPick;
          return (
            <g
              key={k}
              ref={(n) => void (petals.current[k] = n)}
              style={{ opacity: 0 }}
              className={`${pickable ? px.petalPick : ""} ${selected === k ? px.petalOn : ""}`}
              onClick={pickable ? () => onPick!(k) : undefined}
            >
              <path d={PETAL} fill={`url(#pf${uid})`} stroke={`url(#pe${uid})`} strokeWidth="1.4" filter={`url(#sh${uid})`} />
              <path d={PETAL} fill={`url(#pl${uid})`} />
              <path d={VEINS} fill="none" stroke="#c9a768" strokeWidth="1.1" strokeLinecap="round" opacity=".22" />
              {selected === k && <path d={PETAL} fill="none" stroke="#b8904c" strokeWidth="3.5" opacity=".9" />}
              <g ref={(n) => void (labels.current[k] = n)}>
                {/* A disc at the heart of the petal: the brand's logo, or a
                    gold monogram for partners without one. Names are listed
                    beside the flower, not squeezed into the petal. */}
                {!p.placeholder && (
                  <>
                    {p.image && p.fit === "contain" ? (
                      <>
                        <circle r={R} fill="#fffdf8" />
                        <image href={p.image} x={-R * 0.72} y={-R * 0.72} width={R * 1.44} height={R * 1.44} preserveAspectRatio="xMidYMid meet" />
                      </>
                    ) : p.image ? (
                      <>
                        <clipPath id={`lc${uid}${k}`}>
                          <circle r={R} />
                        </clipPath>
                        <image href={p.image} x={-R} y={-R} width={R * 2} height={R * 2} clipPath={`url(#lc${uid}${k})`} preserveAspectRatio="xMidYMid slice" />
                      </>
                    ) : (
                      <>
                        <circle r={R} fill={`url(#pd${uid})`} />
                        <text className={px.petalMono} textAnchor="middle" dominantBaseline="central">
                          {monogram(p.name)}
                        </text>
                      </>
                    )}
                    <circle r={R} fill="none" stroke="#c9a768" strokeWidth="1.6" />
                    <circle r={R + 6} fill="none" stroke="#e3c999" strokeWidth=".8" />
                  </>
                )}
                {p.placeholder && (
                  <>
                    <circle r={R} fill={`url(#pd${uid})`} />
                    <circle r={R} fill="none" stroke="#c9a768" strokeWidth="2" opacity=".6" />
                  </>
                )}
              </g>
            </g>
          );
        })}

        {/* A ring of fine gold stamens around the heart — the lotus's own crown. */}
        <g className={px.stamens}>
          {STAMENS.map((a) => (
            <g key={a} transform={`rotate(${a})`}>
              <line x1="0" y1="-128" x2="0" y2={a % 20 === 0 ? -150 : -142} stroke="#c9a768" strokeWidth="1.2" strokeLinecap="round" opacity=".75" />
              <circle cy={a % 20 === 0 ? -152 : -144} r={a % 20 === 0 ? 3.4 : 2.4} fill="#d8b46a" />
            </g>
          ))}
        </g>
      </svg>

      <button
        type="button"
        className={px.core}
        onClick={onToggle}
        aria-expanded={open}
        aria-label={open ? `Close ${service.title} partners` : `See ${service.title} partners`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={service.image} alt="" loading={eager ? "eager" : "lazy"} decoding="async" />
        {/* Once open, the photograph gives way to the 24 Frames seal. */}
        <span className={px.coreSeal} aria-hidden="true">
          <small>Privileges by</small>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo-dark-header.webp" alt="" />
          <i>Close ×</i>
        </span>
      </button>

      {/* Screen readers get the partners as a plain list. */}
      <ul className={px.srOnly}>
        {service.partners.filter((p) => !p.placeholder).map((p, k) => (
          <li key={k}>
            {p.name}
            {p.perk ? ` — ${p.perk}` : ""}
          </li>
        ))}
      </ul>
    </div>
  );
}
