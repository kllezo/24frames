"use client";

import { useEffect, useRef } from "react";
import styles from "./Ornament.module.css";

/* A quiet section divider: two gold hairlines drawn out from a small
   diamond, as the divider scrolls into view. The one repeated motif
   between homepage chapters. Decorative only. */
export default function Ornament({ label }: { label?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add(styles.shown);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add(styles.shown);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={styles.ornament} aria-hidden="true">
      <span className={styles.line} />
      <span className={styles.diamond} />
      {label && <span className={styles.label}>{label}</span>}
      {label && <span className={styles.diamond} />}
      <span className={styles.line} />
    </div>
  );
}
