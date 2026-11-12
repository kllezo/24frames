"use client";

import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import cx from "../cinema.module.css";
import Crest from "./Crest";

/* The projection layer: film grain, a soft light that follows the
   pointer, a reading-progress hairline, scroll reveals for anything
   marked [data-reveal], and a title-card curtain between stages.
   Everything here is decorative and pointer-transparent; all motion
   is skipped under prefers-reduced-motion. */
export default function Cinema({
  stage,
  frame,
  title,
}: {
  stage: string;
  frame?: string;
  title?: string;
  scope?: React.RefObject<HTMLElement | null>;
}) {
  const lightRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const first = useRef(true);
  const [card, setCard] = useState<{ key: number; frame?: string; title?: string } | null>(null);

  // Title card between stages (never on first paint).
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (stage === "overture") return;
    const show = window.setTimeout(() => setCard({ key: Date.now(), frame, title }), 0);
    const hide = window.setTimeout(() => setCard(null), 1150);
    return () => {
      window.clearTimeout(show);
      window.clearTimeout(hide);
    };
  }, [stage, frame, title]);

  // Inertial smooth scrolling — the studio glides like the main site.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({
      lerp: 0.085,
      smoothWheel: true,
      wheelMultiplier: 0.95,
      // Nested scroll areas (ledger, dialogs, tables) keep native scrolling.
      prevent: (node: HTMLElement) => !!node.closest?.("[data-lenis-prevent], dialog"),
    });
    (window as unknown as { __studioLenis?: Lenis }).__studioLenis = lenis;
    let id = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      id = requestAnimationFrame(loop);
    };
    id = requestAnimationFrame(loop);
    // Freeze the page while any modal dialog is open.
    const sync = () => (document.querySelector("dialog[open]") ? lenis.stop() : lenis.start());
    const mo = new MutationObserver(sync);
    mo.observe(document.body, { subtree: true, attributes: true, attributeFilter: ["open"] });
    return () => {
      cancelAnimationFrame(id);
      mo.disconnect();
      lenis.destroy();
      delete (window as unknown as { __studioLenis?: Lenis }).__studioLenis;
    };
  }, []);

  // Pointer light + reading progress.
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    let raf = 0;
    const root = document.documentElement;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 3;
    const paint = () => {
      raf = 0;
      if (lightRef.current) lightRef.current.style.transform = `translate3d(${x - 400}px, ${y - 400}px, 0)`;
      if (progressRef.current) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        progressRef.current.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
      }
      if (!reduce) {
        // Scroll fade: heroes recede as the page moves past them.
        document.querySelectorAll<HTMLElement>("[data-scroll-fade]").forEach((el) => {
          const r = el.getBoundingClientRect();
          const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height)));
          el.style.setProperty("--sf", p.toFixed(3));
        });
        // Parallax: each image drifts against the scroll inside its frame.
        const vh = window.innerHeight;
        document.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
          const r = (el.parentElement ?? el).getBoundingClientRect();
          if (r.bottom < -200 || r.top > vh + 200) return;
          const offset = (r.top + r.height / 2 - vh / 2) / vh;
          el.style.setProperty("--py", `${(offset * -7).toFixed(2)}%`);
        });
        // Speed layers: [data-speed] elements travel faster or slower than the page.
        document.querySelectorAll<HTMLElement>("[data-speed]").forEach((el) => {
          const r = (el.parentElement ?? el).getBoundingClientRect();
          if (r.bottom < -400 || r.top > vh + 400) return;
          const offset = r.top + r.height / 2 - vh / 2;
          el.style.setProperty("--sy", `${(offset * Number(el.dataset.speed)).toFixed(1)}px`);
        });
        // Pinned horizontal sections: vertical scroll drives a sideways track.
        document.querySelectorAll<HTMLElement>("[data-hscroll]").forEach((el) => {
          const r = el.getBoundingClientRect();
          const span = Math.max(1, r.height - (vh - topbarH()));
          const p = Math.min(1, Math.max(0, (topbarH() - r.top) / span));
          el.style.setProperty("--hp", p.toFixed(4));
        });
      }
    };
    const topbarH = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--topbar-px")) || 64;
    const queue = () => { if (!raf) raf = requestAnimationFrame(paint); };
    let tilted: HTMLElement | null = null;
    const move = (e: PointerEvent) => {
      // Hold the page still behind an open dialog (profiles, confirmations):
      // parallax and tilt moving under its blurred backdrop read as flicker.
      if (document.querySelector("dialog[open]")) {
        if (tilted) {
          tilted.style.removeProperty("--rx");
          tilted.style.removeProperty("--ry");
          tilted.style.removeProperty("--glare");
          tilted = null;
        }
        return;
      }
      x = e.clientX;
      y = e.clientY;
      // Depth: layers marked [data-depth] drift against the pointer.
      root.style.setProperty("--mx", ((x / window.innerWidth) * 2 - 1).toFixed(3));
      root.style.setProperty("--my", ((y / window.innerHeight) * 2 - 1).toFixed(3));
      // Tilt: cards marked [data-tilt] lean toward the pointer and catch the light.
      const t = (e.target as HTMLElement | null)?.closest?.<HTMLElement>("[data-tilt]") ?? null;
      if (tilted && tilted !== t) {
        tilted.style.removeProperty("--rx");
        tilted.style.removeProperty("--ry");
        tilted.style.removeProperty("--glare");
      }
      tilted = t;
      if (t) {
        const r = t.getBoundingClientRect();
        const px = (x - r.left) / r.width;
        const py = (y - r.top) / r.height;
        const k = Number(t.dataset.tilt) || 5;
        t.style.setProperty("--rx", `${((0.5 - py) * k).toFixed(2)}deg`);
        t.style.setProperty("--ry", `${((px - 0.5) * k).toFixed(2)}deg`);
        t.style.setProperty("--gx", `${(px * 100).toFixed(1)}%`);
        t.style.setProperty("--gy", `${(py * 100).toFixed(1)}%`);
        t.style.setProperty("--glare", "1");
      }
      queue();
    };
    if (fine && !reduce) window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    const repaint = window.setInterval(queue, 700);
    paint();
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
      window.clearInterval(repaint);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Scroll reveals for [data-reveal], including elements added later.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      document.documentElement.dataset.revealOff = "1";
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            (e.target as HTMLElement).dataset.revealed = "1";
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
    );
    const scan = () =>
      document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-revealed])").forEach((el) => io.observe(el));
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return (
    <>
      <div className={cx.grain} aria-hidden="true" />
      <div className={cx.vignette} aria-hidden="true" />
      <div className={cx.light} ref={lightRef} aria-hidden="true" />
      <div className={cx.progress} ref={progressRef} aria-hidden="true" />
      <div className={cx.frame} aria-hidden="true">
        <i /><i /><i /><i />
      </div>
      {card && (
        <div className={cx.curtain} key={card.key} aria-hidden="true">
          <i className={cx.barTop} />
          <i className={cx.barBottom} />
          <div className={cx.card}>
            <Crest className={cx.cardCrest} />
            {card.frame && <span className={cx.cardFrame}>Frame {card.frame}</span>}
            {card.title && <span className={cx.cardTitle}>{card.title}</span>}
          </div>
        </div>
      )}
    </>
  );
}
