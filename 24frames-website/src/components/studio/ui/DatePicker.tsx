"use client";

import { useEffect, useRef, useState } from "react";
import px from "./pickers.module.css";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const WEEKDAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const pad = (n: number) => String(n).padStart(2, "0");
const iso = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`;
function parse(v: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v);
  return m ? { y: +m[1], m: +m[2] - 1, d: +m[3] } : null;
}

export function formatLongDate(v: string) {
  const p = parse(v);
  if (!p) return "";
  const wd = new Date(p.y, p.m, p.d).getDay();
  return `${WEEKDAY[wd]} · ${p.d} ${MONTHS[p.m]} ${p.y}`;
}

/* A calendar that opens beneath its field: month title in serif, past
   days quietly struck out, today ringed in gold, the chosen day sealed
   in green. Keyboard: Escape closes; arrows move between months. */
export default function DatePicker({
  value,
  onChange,
  min,
  label,
  placeholder = "Choose a date",
  invalid,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  min?: string;
  label: string;
  placeholder?: string;
  invalid?: boolean;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const start = parse(value) ?? parse(min ?? "") ?? (() => { const t = new Date(); return { y: t.getFullYear(), m: t.getMonth(), d: t.getDate() }; })();
  const [view, setView] = useState({ y: start.y, m: start.m });
  const [dir, setDir] = useState(0);
  const [mode, setMode] = useState<"days" | "months" | "years">("days");
  const root = useRef<HTMLDivElement>(null);

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

  const minP = parse(min ?? "");
  const minKey = minP ? iso(minP.y, minP.m, minP.d) : "";
  const now = new Date();
  const todayKey = iso(now.getFullYear(), now.getMonth(), now.getDate());
  const canPrev = !minP || view.y > minP.y || (view.y === minP.y && view.m > minP.m);

  function shift(d: number) {
    if (d < 0 && !canPrev) return;
    if (minP && d < 0) {
      // never step back before the earliest allowed month
      const m = view.m + d;
      const y = view.y + Math.floor(m / 12);
      const mm = ((m % 12) + 12) % 12;
      if (y < minP.y || (y === minP.y && mm < minP.m)) {
        setDir(d);
        setView({ y: minP.y, m: minP.m });
        return;
      }
    }
    setDir(d);
    setView((v) => {
      const m = v.m + d;
      return { y: v.y + Math.floor(m / 12), m: ((m % 12) + 12) % 12 };
    });
  }

  const first = new Date(view.y, view.m, 1).getDay();
  const count = new Date(view.y, view.m + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(first).fill(null), ...Array.from({ length: count }, (_, i) => i + 1)];

  return (
    <div className={px.field} ref={root}>
      <span className={px.label}>{label}</span>
      <button
        type="button"
        className={`${px.trigger} ${value ? "" : px.empty} ${invalid ? px.invalid : ""}`}
        onClick={() => {
          const p = parse(value);
          if (p) setView({ y: p.y, m: p.m });
          setMode("days");
          setOpen((o) => !o);
        }}
        aria-haspopup="dialog"
        aria-expanded={open}
        disabled={disabled}
      >
        <span>{value ? formatLongDate(value) : placeholder}</span>
        <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15" rx="1.5" /><path d="M3.5 9.5h17M8 3v4M16 3v4" /></svg>
      </button>

      {open && (
        <div className={px.pop} role="dialog" aria-label={`${label} calendar`} data-lenis-prevent
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft" && e.altKey) shift(-1);
            if (e.key === "ArrowRight" && e.altKey) shift(1);
          }}
        >
          <div className={px.calHead}>
            <button type="button" className={px.nav} onClick={() => shift(mode === "days" ? -1 : -12)} disabled={mode === "days" ? !canPrev : !!minP && view.y <= minP.y} aria-label="Previous">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
            </button>
            <p className={px.month} key={`${view.y}-${view.m}-${mode}`}>
              <button type="button" className={`${px.titleBtn} ${mode === "months" ? px.titleOn : ""}`} onClick={() => setMode((m) => (m === "months" ? "days" : "months"))} aria-label="Choose month">
                <em>{MONTHS[view.m]}</em>
              </button>{" "}
              <button type="button" className={`${px.titleBtn} ${px.titleYear} ${mode === "years" ? px.titleOn : ""}`} onClick={() => setMode((m) => (m === "years" ? "days" : "years"))} aria-label="Choose year">
                {view.y}
              </button>
            </p>
            <button type="button" className={px.nav} onClick={() => shift(mode === "days" ? 1 : 12)} aria-label="Next">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
          {mode === "months" && (
            <div className={px.pickGrid} key={`m${view.y}`}>
              {MONTHS.map((name, m) => {
                const past = !!minP && (view.y < minP.y || (view.y === minP.y && m < minP.m));
                return (
                  <button type="button" key={name} disabled={past} className={`${px.pick} ${m === view.m ? px.pickOn : ""}`}
                    onClick={() => { setView((v) => ({ ...v, m })); setMode("days"); }}>
                    {name.slice(0, 3)}
                  </button>
                );
              })}
            </div>
          )}
          {mode === "years" && (
            <div className={px.pickGrid} key={`y${view.y}`}>
              {Array.from({ length: 12 }, (_, i) => (minP ? minP.y : view.y - 2) + i).map((y) => (
                <button type="button" key={y} className={`${px.pick} ${y === view.y ? px.pickOn : ""}`}
                  onClick={() => {
                    setView((v) => (minP && y === minP.y && v.m < minP.m ? { y, m: minP.m } : { ...v, y }));
                    setMode("months");
                  }}>
                  {y}
                </button>
              ))}
            </div>
          )}
          {mode === "days" && (<>
          <div className={px.week} aria-hidden="true">
            {DAYS.map((d) => <span key={d}>{d}</span>)}
          </div>
          <div className={px.grid} key={`${view.y}-${view.m}`} data-dir={dir}>
            {cells.map((d, i) => {
              if (d === null) return <span key={`b${i}`} />;
              const key = iso(view.y, view.m, d);
              const past = !!minKey && key < minKey;
              const on = key === value;
              return (
                <button
                  type="button"
                  key={key}
                  disabled={past}
                  className={`${px.day} ${on ? px.dayOn : ""} ${key === todayKey ? px.today : ""}`}
                  onClick={() => { onChange(key); setOpen(false); }}
                  aria-pressed={on}
                  aria-label={formatLongDate(key)}
                >
                  {d}
                </button>
              );
            })}
          </div>
          </>)}
          <div className={px.foot}>
            {(!minKey || todayKey >= minKey) && (
              <button type="button" className={px.link} onClick={() => { onChange(todayKey); setOpen(false); }}>Today</button>
            )}
            {value && <button type="button" className={px.link} onClick={() => { onChange(""); setOpen(false); }}>Clear</button>}
          </div>
        </div>
      )}
    </div>
  );
}
