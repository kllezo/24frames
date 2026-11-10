"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import px from "./pickers.module.css";

const ITEM = 42;
const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const MINS = Array.from({ length: 12 }, (_, i) => i * 5);
const HALVES = ["AM", "PM"] as const;

function parse(v: string) {
  const m = /^(\d{2}):(\d{2})$/.exec(v);
  if (!m) return null;
  const h24 = +m[1];
  return { h: ((h24 + 11) % 12) + 1, min: Math.round(+m[2] / 5) * 5 % 60, half: h24 >= 12 ? 1 : 0 };
}
const to24 = (h: number, min: number, half: number) => `${String((h % 12) + (half ? 12 : 0)).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
export const formatTime = (v: string) => {
  const p = parse(v);
  return p ? `${p.h}:${String(p.min).padStart(2, "0")} ${HALVES[p.half]}` : "";
};

/** One scrolling drum of the picker; it settles on the value under the band. */
function Drum<T extends string | number>({ items, index, onPick, render, label }: {
  items: readonly T[];
  index: number;
  onPick: (i: number) => void;
  render: (v: T) => string;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const timer = useRef(0);
  useLayoutEffect(() => {
    if (ref.current) ref.current.scrollTop = index * ITEM;
    // only on mount: afterwards the drum is driven by the finger
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div
      className={px.drum}
      ref={ref}
      role="listbox"
      aria-label={label}
      data-lenis-prevent
      onScroll={(e) => {
        const el = e.currentTarget;
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => {
          const i = Math.max(0, Math.min(items.length - 1, Math.round(el.scrollTop / ITEM)));
          if (i !== index) onPick(i);
        }, 90);
      }}
    >
      {items.map((v, i) => (
        <button
          type="button"
          key={String(v)}
          role="option"
          aria-selected={i === index}
          className={`${px.drumItem} ${i === index ? px.drumOn : ""}`}
          onClick={() => {
            ref.current?.scrollTo({ top: i * ITEM, behavior: "smooth" });
            onPick(i);
          }}
        >
          {render(v)}
        </button>
      ))}
    </div>
  );
}

/* A time picker with scrolling drums (hour · minute · AM/PM), like a
   watch crown. Shows a suggested time in the field until one is chosen. */
export default function TimePicker({
  value,
  onChange,
  label,
  suggest,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
  /** Suggested time shown in the field, e.g. "18:00". */
  suggest: string;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const p = parse(value) ?? parse(suggest) ?? { h: 6, min: 0, half: 1 };

  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => { if (!root.current?.contains(e.target as Node)) setOpen(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("pointerdown", away);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", away);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  const set = (h: number, min: number, half: number) => onChange(to24(h, min, half));

  return (
    <div className={px.field} ref={root}>
      <span className={px.label}>{label}</span>
      <button
        type="button"
        className={`${px.trigger} ${value ? "" : px.empty}`}
        onClick={() => {
          if (!open && !value) onChange(to24(p.h, p.min, p.half));
          setOpen((o) => !o);
        }}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span>{value ? formatTime(value) : formatTime(suggest)}</span>
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></svg>
      </button>

      {open && (
        <div className={`${px.pop} ${px.popTime}`} role="dialog" aria-label={`${label} time`}>
          <div className={px.drums}>
            <span className={px.band} aria-hidden="true" />
            <Drum label="Hour" items={HOURS} index={HOURS.indexOf(p.h)} render={(v) => String(v)} onPick={(i) => set(HOURS[i], p.min, p.half)} />
            <span className={px.colon} aria-hidden="true">:</span>
            <Drum label="Minutes" items={MINS} index={Math.max(0, MINS.indexOf(p.min))} render={(v) => String(v).padStart(2, "0")} onPick={(i) => set(p.h, MINS[i], p.half)} />
            <Drum label="AM or PM" items={HALVES} index={p.half} render={(v) => v} onPick={(i) => set(p.h, p.min, i)} />
          </div>
          <div className={px.foot}>
            <button type="button" className={px.link} onClick={() => { onChange(""); setOpen(false); }}>Clear</button>
            <button type="button" className={px.done} onClick={() => setOpen(false)}>Done</button>
          </div>
        </div>
      )}
    </div>
  );
}
