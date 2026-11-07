"use client";

import { useEffect, useRef, useState } from "react";
import { formatINR } from "@/lib/commission/format";

/* Counts smoothly from the previous value to the new one. The final value is
   always the exact figure (no rounding drift); screen readers get the final
   value only via aria-live on the parent. */
export default function AnimatedNumber({
  value,
  format = formatINR,
  duration = 700,
  className,
}: {
  value: number;
  format?: (n: number) => string;
  duration?: number;
  className?: string;
}) {
  const [shown, setShown] = useState(value);
  const from = useRef(value);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = from.current;
    if (reduce || start === value) {
      from.current = value;
      setShown(value);
      return;
    }
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 4);
      const v = Math.round(start + (value - start) * eased);
      setShown(p >= 1 ? value : v);
      from.current = p >= 1 ? value : v;
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    // rAF pauses in background tabs — guarantee the exact figure lands anyway.
    const settle = window.setTimeout(() => {
      if (raf.current) cancelAnimationFrame(raf.current);
      from.current = value;
      setShown(value);
    }, duration + 80);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      window.clearTimeout(settle);
    };
  }, [value, duration]);

  return <span className={className}>{format(shown)}</span>;
}
