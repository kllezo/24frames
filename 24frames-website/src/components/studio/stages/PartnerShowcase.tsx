"use client";

import type { CSSProperties } from "react";
import px from "../planning.module.css";
import type { PlanningPartner, PlanningService } from "@/lib/commission/planning";

/* The services after the lotus each open in a way of their own, all drawn
   around the same circle so the page keeps one rhythm:
     slide    — partner tiles slide out from behind the circle, one after another
     fan      — arched cards fan open above it, like a hand of cards
     necklace — a gold chain drapes beneath it, each partner hanging as a pendant
     orbit    — partners spiral out and settle in a ring around it
   Everything moves with CSS transforms and opacity only, so it stays smooth.
   Positions are in units of the circle's diameter (--D). */

export type ShowcaseVariant = "slide" | "fan" | "necklace" | "orbit";

type Slot = { x: number; y: number; r?: number };

/** Where the circle sits once open (in D, from the stage's centre). */
const CORE_Y: Record<ShowcaseVariant, number> = { slide: -0.5, fan: 0.5, necklace: -0.5, orbit: 0 };

/** How far the fan's cards sit from its pivot, the circle's centre. */
const FAN_R = 1.1;

/* The necklace chain: a quadratic curve from one top corner to the other. */
const CHAIN = { x: 1.1, top: -0.78, ctrl: 1.82 };
const chainAt = (t: number) => ({
  x: CHAIN.x * (2 * t - 1),
  y: CHAIN.top * ((1 - t) ** 2 + t ** 2) + 2 * CHAIN.ctrl * t * (1 - t),
});

function slots(v: ShowcaseVariant, n: number): Slot[] {
  const mid = (n - 1) / 2;
  return Array.from({ length: n }, (_, k) => {
    switch (v) {
      case "slide":
        return { x: (k - mid) * 0.47, y: 0.45 };
      case "fan": {
        const span = Math.min(96, 24 * (n - 1));
        return { x: 0, y: CORE_Y.fan - FAN_R, r: n > 1 ? -span / 2 + (k * span) / (n - 1) : 0 };
      }
      case "necklace": {
        // Pendants spread along the chain, hanging just below it.
        const t = n > 1 ? 0.1 + (k * 0.8) / (n - 1) : 0.5;
        const c = chainAt(t);
        return { x: c.x, y: c.y + 0.22 };
      }
      case "orbit":
        return { x: 0, y: 0, r: (k * 360) / n };
    }
  });
}

const monogram = (name: string) =>
  name
    .split(/[\s&]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w, i) => (i === 0 ? w[0].toUpperCase() : w[0].toLowerCase()))
    .join("");

/** The partner's mark: its logo, a gold monogram, or an empty pearl until confirmed. */
function Mark({ p }: { p: PlanningPartner }) {
  if (p.placeholder) return <span className={px.mark} />;
  if (p.image)
    return (
      <span className={`${px.mark} ${p.fit === "contain" ? px.markContain : ""}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={p.image} alt="" loading="lazy" decoding="async" />
      </span>
    );
  return (
    <span className={px.mark}>
      <span className={px.markMono}>{monogram(p.name)}</span>
    </span>
  );
}

export default function PartnerShowcase({
  service,
  variant,
  open,
  onToggle,
  eager,
  selected,
  onPick,
}: {
  service: PlanningService;
  variant: ShowcaseVariant;
  open: boolean;
  onToggle: () => void;
  eager?: boolean;
  selected?: number | null;
  onPick?: (index: number) => void;
}) {
  const at = slots(variant, service.partners.length);
  const named = variant === "slide" || variant === "fan";

  return (
    <div
      className={`${px.bloom} ${px.show} ${px[`v_${variant}`]} ${open ? `${px.bloomOpen} ${px.showOpen}` : ""}`}
      style={{ "--cy": CORE_Y[variant] } as CSSProperties}
    >
      {variant === "necklace" && (
        <svg className={px.chain} viewBox="-1.225 -1 2.45 2" preserveAspectRatio="none" aria-hidden="true">
          <path
            d={`M${-CHAIN.x},${CHAIN.top} Q0,${CHAIN.ctrl} ${CHAIN.x},${CHAIN.top}`}
            pathLength={1}
            fill="none"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      )}
      {variant === "orbit" && <span className={px.ring} aria-hidden="true" />}

      {service.partners.map((p, k) => {
        const s = at[k];
        const pickable = open && !p.placeholder && !!onPick;
        return (
          <button
            key={k}
            type="button"
            tabIndex={pickable ? 0 : -1}
            aria-hidden={!pickable}
            disabled={!pickable}
            className={`${px.tok} ${selected === k ? px.tokOn : ""} ${p.placeholder ? px.tokSoon : ""}`}
            style={{ "--x": s.x, "--y": s.y, "--r": `${s.r ?? 0}deg`, "--d": `${0.18 + k * 0.13}s` } as CSSProperties}
            onClick={pickable ? () => onPick!(k) : undefined}
            aria-label={pickable ? `${p.name}${p.perk ? ` — ${p.perk}` : ""}` : undefined}
            title={pickable ? p.name : undefined}
          >
            <Mark p={p} />
            {named && !p.placeholder && <span className={px.tokName}>{p.name}</span>}
          </button>
        );
      })}

      <button
        type="button"
        className={px.core}
        onClick={onToggle}
        aria-expanded={open}
        aria-label={open ? `Close ${service.title} partners` : `See ${service.title} partners`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={service.image} alt="" loading={eager ? "eager" : "lazy"} decoding="async" />
        <span className={px.coreSeal} aria-hidden="true">
          <small>Privileges by</small>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo-dark-header.webp" alt="" />
          <i>Close ×</i>
        </span>
      </button>
    </div>
  );
}
