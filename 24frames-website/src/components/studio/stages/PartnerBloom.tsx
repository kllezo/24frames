"use client";

import { useEffect, useId, useRef } from "react";
import px from "../planning.module.css";
import type { PlanningService } from "@/lib/commission/planning";

/* One service as a single circle. Opening it blooms a lotus out of the
   photograph: a ring of blush under-petals unfurls first, then the pearl
   petals — one per partner brand, each carrying its logo — spiral open
   with a soft overshoot, while the photo shrinks to the heart of the
   flower and becomes the close button. Opening also glides the page so
   the flower sits in the middle of the screen. */

const PETAL =
  "M0,0 C-52,-14 -128,-78 -126,-158 C-124,-226 -62,-252 -22,-276 C-10,-283 -4,-296 0,-312 C4,-296 10,-283 22,-276 C62,-252 124,-226 126,-158 C128,-78 52,-14 0,0 Z";
/* Petals fan from lower-left round to lower-right (126° → 414°). Five is
   the classic bloom; six or more spread evenly over the same arc. */
const anglesFor = (n: number) => (n <= 1 ? [270] : Array.from({ length: n }, (_, k) => 126 + (k * 288) / (n - 1)));
const OPEN_SECONDS = 2.9;
const BASE = 150; // petal base distance from the centre (viewBox units), just under the shrunk photo
const DISC_Y = 172; // the logo disc sits at the widest part of the petal
const R = 94; // logo disc radius — as large as the petal allows

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
  const c = 1.45;
  return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2);
};

/* Spiral twist: each petal unwinds into place while it grows. */
function petalAt(k: number, t: number, angles: number[]) {
  const p = clamp((t - 0.35 - k * 0.13) / 1.75);
  const fit = angles.length > 5 ? 5 / angles.length + 0.06 : 1;
  return { angle: angles[k] - 160 * (1 - easeOut(p)), scale: easeBack(p) * fit, opacity: clamp(p * 2.2) };
}

/* The blush under-petals sit between the main ones and open first. */
function sepalAt(k: number, t: number, angles: number[]) {
  const p = clamp((t - k * 0.05) / 1.3);
  const gap = angles.length > 1 ? (angles[1] - angles[0]) / 2 : 36;
  const fit = angles.length > 5 ? 5 / angles.length + 0.06 : 1;
  return { angle: angles[k] + gap - 90 * (1 - easeOut(p)), scale: easeOut(p) * 0.8 * fit, opacity: clamp(p * 1.6) * 0.95 };
}

export default function PartnerBloom({
  service,
  open,
  onToggle,
  eager,
}: {
  service: PlanningService;
  open: boolean;
  onToggle: () => void;
  eager?: boolean;
}) {
  const uid = useId().replace(/:/g, "");
  const petals = useRef<(SVGGElement | null)[]>([]);
  const sepals = useRef<(SVGGElement | null)[]>([]);
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
        const sp = sepals.current[k];
        if (sp) {
          const q = sepalAt(k, t, angles);
          sp.setAttribute("transform", `rotate(${q.angle + 90}) translate(0,-${BASE - 14}) scale(${Math.max(q.scale, 0.001)})`);
          sp.style.opacity = String(q.opacity);
        }
        if (!g || !l) return;
        const s = petalAt(k, t, angles);
        g.setAttribute("transform", `rotate(${s.angle + 90}) translate(0,-${BASE}) scale(${Math.max(s.scale, 0.001)})`);
        g.style.opacity = String(s.opacity);
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
      <svg className={px.flower} viewBox="-470 -470 940 940" aria-hidden="true">
        <defs>
          {/* Lotus petal: pale gold at the base, ivory through the body, blush at the tip. */}
          <linearGradient id={`pf${uid}`} x1="0" y1="0" x2="0" y2="-312" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#f1dcb0" />
            <stop offset=".3" stopColor="#fbf3e4" />
            <stop offset=".68" stopColor="#fffaf3" />
            <stop offset=".9" stopColor="#f8dcdc" />
            <stop offset="1" stopColor="#efb9c0" />
          </linearGradient>
          <linearGradient id={`pb${uid}`} x1="0" y1="0" x2="0" y2="-312" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#e9c99a" />
            <stop offset=".55" stopColor="#f3cfcf" />
            <stop offset="1" stopColor="#d98f9d" />
          </linearGradient>
          <linearGradient id={`pe${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f3d9a0" />
            <stop offset=".5" stopColor="#b98f4a" />
            <stop offset="1" stopColor="#f0d394" />
          </linearGradient>
          <radialGradient id={`ps${uid}`} cx=".35" cy=".3" r=".7">
            <stop offset="0" stopColor="#fff" stopOpacity=".8" />
            <stop offset=".55" stopColor="#fff" stopOpacity=".12" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`pg${uid}`} cx=".5" cy=".5" r=".5">
            <stop offset="0" stopColor="#f6d58c" stopOpacity=".55" />
            <stop offset=".55" stopColor="#f3c6c6" stopOpacity=".22" />
            <stop offset="1" stopColor="#f3c6c6" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`pd${uid}`} cx=".38" cy=".32" r=".8">
            <stop offset="0" stopColor="#fffdf8" />
            <stop offset=".6" stopColor="#f1e3c6" />
            <stop offset="1" stopColor="#dcc394" />
          </radialGradient>
          <filter id={`sh${uid}`} x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="12" stdDeviation="12" floodColor="#6b5530" floodOpacity=".22" />
          </filter>
        </defs>
        <circle className={px.halo} r="460" fill={`url(#pg${uid})`} />
        {/* Blush under-petals, opening first. */}
        {[...service.partners.keys()].map((k) => (
          <g key={`s${k}`} ref={(n) => void (sepals.current[k] = n)} style={{ opacity: 0 }}>
            <path d={PETAL} fill={`url(#pb${uid})`} stroke="#d9a7a7" strokeWidth="1.6" opacity=".9" />
            <path d={PETAL} fill={`url(#ps${uid})`} opacity=".45" />
          </g>
        ))}
        {/* Drawn last-to-first so the lower-left petal sits on top. */}
        {[...service.partners.keys()].reverse().map((k) => {
          const p = service.partners[k];
          return (
            <g key={k} ref={(n) => void (petals.current[k] = n)} style={{ opacity: 0 }}>
              <path d={PETAL} fill={`url(#pf${uid})`} stroke={`url(#pe${uid})`} strokeWidth="2.4" filter={`url(#sh${uid})`} />
              <path d={PETAL} fill={`url(#ps${uid})`} opacity=".7" />
              <g ref={(n) => void (labels.current[k] = n)}>
                {/* A large disc at the heart of the petal: the brand's logo, or a
                    gold monogram for partners without one. Names are listed
                    beside the flower, not squeezed into the petal. */}
                {!p.placeholder && (
                  <>
                    {p.image && p.fit === "contain" ? (
                      <>
                        <circle r={R} fill="#fffdf8" />
                        <image href={p.image} x={-R * 0.74} y={-R * 0.74} width={R * 1.48} height={R * 1.48} preserveAspectRatio="xMidYMid meet" />
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
                    <circle r={R} fill="none" stroke="#c9a768" strokeWidth="2.4" />
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
        <span className={px.coreClose} aria-hidden="true">
          ×
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
