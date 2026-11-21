"use client";

import { useEffect, useId, useRef } from "react";
import px from "../planning.module.css";
import type { PlanningService } from "@/lib/commission/planning";

/* One service as a single circle. Opening it spirals five pearl-and-gold
   petals out of the photograph — one per partner brand — while the photo
   shrinks to the heart of the flower and becomes the close button. */

const PETAL =
  "M0,0 C-52,-14 -128,-78 -126,-158 C-124,-226 -62,-252 -22,-276 C-10,-283 -4,-296 0,-312 C4,-296 10,-283 22,-276 C62,-252 124,-226 126,-158 C128,-78 52,-14 0,0 Z";
/* Petals fan from lower-left round to lower-right (126° → 414°). Five is
   the classic bloom; six or more spread evenly over the same arc. */
const anglesFor = (n: number) => (n <= 1 ? [270] : Array.from({ length: n }, (_, k) => 126 + (k * 288) / (n - 1)));
const OPEN_SECONDS = 2.5;
const BASE = 150; // petal base distance from the centre (viewBox units), just under the shrunk photo

const clamp = (x: number) => Math.min(1, Math.max(0, x));
const easeOut = (x: number) => 1 - Math.pow(1 - x, 4);

/* Spiral twist: each petal unwinds 200° into place while it grows. */
function petalAt(k: number, t: number, angles: number[]) {
  const p = clamp((t - k * 0.12) / 1.7);
  const e = easeOut(p);
  const fit = angles.length > 5 ? 5 / angles.length + 0.05 : 1;
  return { angle: angles[k] - 200 * (1 - e), scale: e * fit, opacity: clamp(p * 2) };
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
  const labels = useRef<(SVGGElement | null)[]>([]);
  const time = useRef(0);

  useEffect(() => {
    const angles = anglesFor(service.partners.length);
    const draw = (t: number) =>
      angles.forEach((_, k) => {
        const g = petals.current[k];
        const l = labels.current[k];
        if (!g || !l) return;
        const s = petalAt(k, t, angles);
        g.setAttribute("transform", `rotate(${s.angle + 90}) translate(0,-${BASE}) scale(${Math.max(s.scale, 0.001)})`);
        g.style.opacity = String(s.opacity);
        l.setAttribute("transform", `translate(0,-170) rotate(${-(s.angle + 90)})`);
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
    <div className={`${px.bloom} ${open ? px.bloomOpen : ""}`}>
      <svg className={px.flower} viewBox="-470 -470 940 940" aria-hidden="true">
        <defs>
          <linearGradient id={`pf${uid}`} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#f4e5c8" />
            <stop offset=".5" stopColor="#fbf4e6" />
            <stop offset="1" stopColor="#fffdf8" />
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
            <stop offset="0" stopColor="#f6d58c" stopOpacity=".5" />
            <stop offset="1" stopColor="#f6d58c" stopOpacity="0" />
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
        {/* Drawn last-to-first so the lower-left petal sits on top. */}
        {[...service.partners.keys()].reverse().map((k) => {
          const p = service.partners[k];
          return (
            <g key={k} ref={(n) => void (petals.current[k] = n)} style={{ opacity: 0 }}>
              <path d={PETAL} fill={`url(#pf${uid})`} stroke={`url(#pe${uid})`} strokeWidth="2.4" filter={`url(#sh${uid})`} />
              <path d={PETAL} fill={`url(#ps${uid})`} opacity=".7" />
              <g ref={(n) => void (labels.current[k] = n)}>
                {/* The brand's logo disc — an empty pearl disc until the logo arrives. */}
                <g transform={`translate(0,${p.placeholder || p.image ? 0 : -30})`}>
                  {p.image && p.fit === "contain" ? (
                    <>
                      <circle r="52" fill="#fffdf8" />
                      <image href={p.image} x="-38" y="-38" width="76" height="76" preserveAspectRatio="xMidYMid meet" />
                    </>
                  ) : p.image ? (
                    <>
                      <clipPath id={`lc${uid}${k}`}>
                        <circle r="52" />
                      </clipPath>
                      <image href={p.image} x="-52" y="-52" width="104" height="104" clipPath={`url(#lc${uid}${k})`} preserveAspectRatio="xMidYMid slice" />
                    </>
                  ) : (
                    <>
                      <circle r="52" fill={`url(#pd${uid})`} />
                      <path d="M-14,-6 L-7,-15 H7 L14,-6 L0,14 Z M-14,-6 H14 M-7,-15 L-3,-6 L0,14 M7,-15 L3,-6 L0,14" fill="none" stroke="#b98f4a" strokeWidth="1.6" strokeLinejoin="round" opacity=".75" />
                    </>
                  )}
                  <circle r="52" fill="none" stroke="#c9a768" strokeWidth="2" />
                  <circle r="58" fill="none" stroke="#e5d2a8" strokeWidth="1" />
                </g>
                {/* A logo speaks for itself; only petals without one carry a name. */}
                {!p.placeholder && !p.image && (
                  <>
                    <text
                      className={px.petalName}
                      textAnchor="middle"
                      y="58"
                      {...(p.name.length > 15 ? { textLength: 232, lengthAdjust: "spacingAndGlyphs" as const } : {})}
                    >
                      {p.name}
                    </text>
                    {p.perk && (
                      <text className={px.petalPerk} textAnchor="middle" y="86">
                        {p.perk}
                      </text>
                    )}
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
