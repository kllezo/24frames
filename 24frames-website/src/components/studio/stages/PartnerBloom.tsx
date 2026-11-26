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

/* A lotus petal: narrow at the heart, full through the body, drawn to a soft point. */
const PETAL =
  "M0,0 C-48,-16 -124,-82 -124,-160 C-124,-226 -66,-262 -26,-286 C-12,-294 -4,-304 0,-318 C4,-304 12,-294 26,-286 C66,-262 124,-226 124,-160 C124,-82 48,-16 0,0 Z";
/* The fine midrib and two side veins that make a petal read as a petal. */
const VEINS = "M0,-14 C-2,-120 -2,-220 0,-300 M0,-40 C-30,-110 -46,-190 -40,-260 M0,-40 C30,-110 46,-190 40,-260";

/* A full ring: the first petal points straight up, the rest evenly round. */
const anglesFor = (n: number) => Array.from({ length: Math.max(n, 1) }, (_, k) => 270 + (k * 360) / Math.max(n, 1));
const OPEN_SECONDS = 2.9;
const BASE = 150; // ivory petal base distance from the centre (viewBox units), just outside the shrunk heart
const OUTER_BASE = 132; // the blush petals start a little further in, behind
const OUTER_SCALE = 1.1; // and reach further out, so their tips frame the ivory ring
const DISC_Y = 168; // the logo disc sits at the widest part of the petal
const R = 92; // logo disc radius

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
          {/* Ivory petal: warm champagne at the heart, pearl through the body, the faintest blush at the tip. */}
          <linearGradient id={`pf${uid}`} x1="0" y1="0" x2="0" y2="-318" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#ecd7a8" />
            <stop offset=".22" stopColor="#f7ebd2" />
            <stop offset=".6" stopColor="#fffaf1" />
            <stop offset=".92" stopColor="#fdf3ec" />
            <stop offset="1" stopColor="#f7e3dc" />
          </linearGradient>
          {/* Blush petal: pale at the heart, deepening to a rose tip, like a real lotus. */}
          <linearGradient id={`pb${uid}`} x1="0" y1="0" x2="0" y2="-318" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#fbeee6" />
            <stop offset=".35" stopColor="#f6d5d2" />
            <stop offset=".75" stopColor="#eaaab4" />
            <stop offset="1" stopColor="#d9848f" />
          </linearGradient>
          {/* Side light across each petal, so it reads as curved, not flat. */}
          <linearGradient id={`pl${uid}`} x1="-124" y1="0" x2="124" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#fff" stopOpacity=".55" />
            <stop offset=".45" stopColor="#fff" stopOpacity="0" />
            <stop offset="1" stopColor="#7a4a3a" stopOpacity=".08" />
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
            <feDropShadow dx="0" dy="10" stdDeviation="11" floodColor="#6b5530" floodOpacity=".2" />
          </filter>
          <filter id={`so${uid}`} x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="6" stdDeviation="9" floodColor="#a0606a" floodOpacity=".16" />
          </filter>
        </defs>
        <circle className={px.halo} r="490" fill={`url(#pg${uid})`} />

        {/* The outer ring: large blush petals, opening first, behind. */}
        {[...service.partners.keys()].map((k) => (
          <g key={`o${k}`} ref={(n) => void (outers.current[k] = n)} style={{ opacity: 0 }}>
            <path d={PETAL} fill={`url(#pb${uid})`} stroke="#dba3aa" strokeWidth="1.4" filter={`url(#so${uid})`} />
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
              <path d={PETAL} fill={`url(#pf${uid})`} stroke={`url(#pe${uid})`} strokeWidth="2.2" filter={`url(#sh${uid})`} />
              <path d={PETAL} fill={`url(#pl${uid})`} />
              <path d={VEINS} fill="none" stroke="#c9a768" strokeWidth="1.1" strokeLinecap="round" opacity=".22" />
              {selected === k && <path d={PETAL} fill="none" stroke="#b8904c" strokeWidth="5" opacity=".85" />}
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
                    <circle r={R} fill="none" stroke="#c9a768" strokeWidth="2.2" />
                    <circle r={R + 7} fill="none" stroke="#e8cfa6" strokeWidth="1" />
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
