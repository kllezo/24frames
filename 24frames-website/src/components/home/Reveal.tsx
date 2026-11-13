"use client";

import { useEffect, useRef } from "react";

/* A gentle fade-up as a block enters the viewport — no scroll-jacking,
   no pinning. Skipped entirely under prefers-reduced-motion. */
export default function Reveal({
  children,
  as: Tag = "div",
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  as?: "div" | "section" | "li" | "article" | "figure";
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      el.dataset.shown = "1";
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.dataset.shown = "1";
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.08 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag
      ref={ref as React.Ref<never>}
      className={className}
      data-reveal=""
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
