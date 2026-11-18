"use client";

import { useMemo, useState } from "react";
import ix from "./insights.module.css";
import { formatINR } from "@/lib/commission/format";

/* Small interactive chart kit for the desk — hand-drawn SVG, no library. */

export const lakh = (n: number) =>
  n >= 10000000 ? `₹${(n / 10000000).toFixed(2)}Cr` : n >= 100000 ? `₹${(n / 100000).toFixed(n >= 1000000 ? 1 : 2)}L` : formatINR(n);

export const PALETTE = ["#0f3d35", "#a98a52", "#5b7f74", "#c28456", "#2f5d52", "#d9c08d", "#7a4b3a", "#8fa89d"];

/* ---------- trend: area + line with a hover read-out ---------- */
export function Trend({
  points,
  modes,
}: {
  points: { label: string; values: Record<string, number> }[];
  modes: { id: string; label: string; format: (n: number) => string }[];
}) {
  const [mode, setMode] = useState(modes[0].id);
  const [hover, setHover] = useState<number | null>(null);
  const W = 760;
  const H = 240;
  const P = { l: 12, r: 12, t: 22, b: 30 };
  const vals = points.map((p) => p.values[mode] ?? 0);
  const max = Math.max(1, ...vals) * 1.12;
  const x = (i: number) => P.l + (i * (W - P.l - P.r)) / Math.max(points.length - 1, 1);
  const y = (v: number) => H - P.b - (v / max) * (H - P.t - P.b);
  const line = vals.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const area = `${line} L${x(vals.length - 1)},${H - P.b} L${x(0)},${H - P.b} Z`;
  const fmt = modes.find((m) => m.id === mode)!.format;
  const total = vals.reduce((a, b) => a + b, 0);
  const h = hover ?? vals.length - 1;

  return (
    <div className={ix.trend}>
      <div className={ix.trendHead}>
        <div>
          <span className={ix.trendBig}>{fmt(vals[h] ?? 0)}</span>
          <span className={ix.trendSub}>
            {points[h]?.label} · {fmt(total)} across the period
          </span>
        </div>
        <div className={ix.seg} role="tablist">
          {modes.map((m) => (
            <button key={m.id} role="tab" aria-selected={mode === m.id} className={mode === m.id ? ix.segOn : ""} onClick={() => setMode(m.id)}>
              {m.label}
            </button>
          ))}
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className={ix.trendSvg} onMouseLeave={() => setHover(null)} role="img" aria-label="Trend chart">
        <defs>
          <linearGradient id="trendFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#a98a52" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#0f3d35" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75, 1].map((f) => (
          <line key={f} x1={P.l} x2={W - P.r} y1={y(max * f / 1.12)} y2={y(max * f / 1.12)} className={ix.gridLine} />
        ))}
        <path d={area} fill="url(#trendFill)" key={`a-${mode}`} className={ix.trendArea} />
        <path d={line} className={ix.trendLine} key={`l-${mode}`} />
        {points.map((p, i) => (
          <g key={p.label}>
            <rect x={x(i) - (W / points.length) / 2} y={0} width={W / points.length} height={H} fill="transparent" onMouseEnter={() => setHover(i)} onClick={() => setHover(i)} />
            <text x={x(i)} y={H - 8} className={`${ix.axisLabel} ${i === h ? ix.axisOn : ""}`} textAnchor="middle">
              {p.label}
            </text>
          </g>
        ))}
        <line x1={x(h)} x2={x(h)} y1={P.t - 6} y2={H - P.b} className={ix.crosshair} />
        <circle cx={x(h)} cy={y(vals[h] ?? 0)} r={6} className={ix.dotOuter} />
        <circle cx={x(h)} cy={y(vals[h] ?? 0)} r={3} className={ix.dotInner} />
      </svg>
    </div>
  );
}

/* ---------- donut with hoverable segments and legend ---------- */
export function Donut({
  items,
  format = lakh,
  centerLabel,
}: {
  items: { label: string; value: number; note?: string }[];
  format?: (n: number) => string;
  centerLabel: string;
}) {
  const [on, setOn] = useState<number | null>(null);
  const total = items.reduce((a, b) => a + b.value, 0);
  const R = 70;
  const C = 2 * Math.PI * R;
  const arcs = useMemo(() => {
    const fracs = items.map((it) => (total ? it.value / total : 0));
    return fracs.map((frac, i) => ({ frac, start: fracs.slice(0, i).reduce((a, b) => a + b, 0) }));
  }, [items, total]);
  if (!total) return <p className={ix.empty}>Nothing to show yet.</p>;
  const active = on !== null ? items[on] : null;
  return (
    <div className={ix.donutWrap}>
      <svg viewBox="0 0 200 200" className={ix.donut} role="img" aria-label={centerLabel} onMouseLeave={() => setOn(null)}>
        <circle cx="100" cy="100" r={R} className={ix.donutTrack} />
        {arcs.map((a, i) => (
          <circle
            key={i}
            cx="100"
            cy="100"
            r={R}
            fill="none"
            stroke={PALETTE[i % PALETTE.length]}
            strokeWidth={on === i ? 30 : 22}
            strokeDasharray={`${Math.max(a.frac * C - 2, 0.5)} ${C}`}
            strokeDashoffset={-a.start * C}
            transform="rotate(-90 100 100)"
            className={ix.donutSeg}
            style={{ opacity: on === null || on === i ? 1 : 0.35 }}
            onMouseEnter={() => setOn(i)}
            onClick={() => setOn(on === i ? null : i)}
          />
        ))}
        <text x="100" y="94" textAnchor="middle" className={ix.donutValue}>
          {format(active ? active.value : total)}
        </text>
        <text x="100" y="116" textAnchor="middle" className={ix.donutLabel}>
          {active ? `${Math.round((active.value / total) * 100)}% · ${active.label.slice(0, 18)}` : centerLabel}
        </text>
      </svg>
      <ul className={ix.legend}>
        {items.map((it, i) => (
          <li key={it.label} onMouseEnter={() => setOn(i)} onMouseLeave={() => setOn(null)} className={on === i ? ix.legendOn : ""}>
            <i style={{ background: PALETTE[i % PALETTE.length] }} />
            <span>{it.label}</span>
            <b>{it.note ?? format(it.value)}</b>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- funnel ---------- */
export function Funnel({ steps }: { steps: { label: string; value: number }[] }) {
  const [on, setOn] = useState<number | null>(null);
  const max = Math.max(1, steps[0]?.value ?? 1);
  return (
    <ol className={ix.funnel}>
      {steps.map((s, i) => {
        const prev = i ? steps[i - 1].value : null;
        const rate = prev ? Math.round((s.value / prev) * 100) : null;
        return (
          <li key={s.label} onMouseEnter={() => setOn(i)} onMouseLeave={() => setOn(null)} className={on === i ? ix.funnelOn : ""}>
            <span className={ix.funnelBar} style={{ width: `${Math.max((s.value / max) * 100, 6)}%`, background: PALETTE[i % PALETTE.length] }}>
              <b>{s.value}</b>
            </span>
            <span className={ix.funnelLabel}>
              {s.label}
              {rate !== null && <em>{rate}% of previous</em>}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

/* ---------- ring (progress toward a target) ---------- */
export function Ring({ value, label }: { value: number; label: string }) {
  const R = 30;
  const C = 2 * Math.PI * R;
  const v = Math.max(0, Math.min(value, 100));
  return (
    <svg viewBox="0 0 80 80" className={ix.ring} role="img" aria-label={`${label}: ${value}%`}>
      <circle cx="40" cy="40" r={R} className={ix.ringTrack} />
      <circle cx="40" cy="40" r={R} className={ix.ringFill} strokeDasharray={`${(v / 100) * C} ${C}`} transform="rotate(-90 40 40)" />
      <text x="40" y="45" textAnchor="middle" className={ix.ringText}>
        {Math.round(value)}%
      </text>
    </svg>
  );
}
