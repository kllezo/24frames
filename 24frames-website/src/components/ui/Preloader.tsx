"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import styles from "./Preloader.module.css";

/* ── 24 Frames Color Progression: Deep Forest to Warm Stone to Pure Ivory ── */
const FRAME_COLORS = [
  "#0C3028", "#123C34", "#1A4D42", "#245E52", "#2E6F62", "#3D8070", // Row 1: 0–5
  "#4D8F80", "#5E9D8E", "#6FAA9B", "#7FB5A8", "#8FBFB4", "#9EC7BE", // Row 2: 6–11
  "#A6B0A3", "#AEB9AB", "#B6C1B3", "#BFC8BB", "#C5CCBF", "#CFC5B5", // Row 3: 12–17
  "#D5CCBC", "#DBD3C3", "#E1DACB", "#E7E1D3", "#EDE7DB", "#FFFFFF", // Row 4: 18–23
];

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const tileRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cueRef = useRef<HTMLDivElement>(null);
  const finalTileRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  const runAnimation = useCallback(() => {
    // Respect reduced motion
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReduced) {
      setVisible(false);
      onComplete();
      return;
    }

    const overlay = overlayRef.current;
    const grid = gridRef.current;
    const tiles = tileRefs.current.filter(Boolean) as HTMLDivElement[];
    const cue = cueRef.current;
    const finalTile = finalTileRef.current;

    if (!overlay || !grid || tiles.length < 23 || !finalTile) {
      // Fallback if elements not ready
      onComplete();
      return;
    }

    const row1 = tiles.slice(0, 6);
    const row2 = tiles.slice(6, 12);
    const row3 = tiles.slice(12, 18);
    const row4 = tiles.slice(18, 23); // excludes 24th frame

    // Initial state setup
    gsap.set(tiles, { opacity: 0, scale: 0.92, y: 14 });
    gsap.set(finalTile, { opacity: 0, scale: 0.92, y: 14 });
    if (cue) gsap.set(cue, { opacity: 0, y: -8 });

    const tl = gsap.timeline({
      onComplete: () => {
        // Phase 5 — Smooth coordinated transition to reveal homepage
        gsap.to(overlay, {
          opacity: 0,
          duration: 0.5,
          ease: "power2.inOut",
          onComplete: () => {
            setVisible(false);
            onComplete();
          },
        });
      },
    });

    /* ── Phase 1: The First Frame ──
       Opens on warm ivory, subtle cue appears, followed by first frame */
    if (cue) {
      tl.to(cue, { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" }, 0.05);
      tl.to(cue, { opacity: 0, duration: 0.2, ease: "power2.in" }, 0.35);
    }

    /* ── Phase 2 & 3: The Living Grid & Overlapping Fading Sequence ── */
    // Row 1 reveals (0.15s – 0.50s)
    tl.to(row1, {
      opacity: 1, scale: 1, y: 0,
      duration: 0.35, stagger: 0.04, ease: "power2.out",
    }, 0.15);

    // Row 2 reveals, while Row 1 begins to fade (0.45s – 0.85s)
    tl.to(row2, {
      opacity: 1, scale: 1, y: 0,
      duration: 0.35, stagger: 0.04, ease: "power2.out",
    }, 0.45);
    tl.to(row1, {
      opacity: 0, scale: 0.88,
      duration: 0.32, stagger: 0.03, ease: "power2.inOut",
    }, 0.52);

    // Row 3 reveals, while Row 2 begins to fade (0.78s – 1.18s)
    tl.to(row3, {
      opacity: 1, scale: 1, y: 0,
      duration: 0.35, stagger: 0.04, ease: "power2.out",
    }, 0.78);
    tl.to(row2, {
      opacity: 0, scale: 0.88,
      duration: 0.32, stagger: 0.03, ease: "power2.inOut",
    }, 0.86);

    // Row 4 (frames 19–23) reveals, while Row 3 fades (1.10s – 1.50s)
    tl.to(row4, {
      opacity: 1, scale: 1, y: 0,
      duration: 0.35, stagger: 0.04, ease: "power2.out",
    }, 1.10);
    tl.to(row3, {
      opacity: 0, scale: 0.88,
      duration: 0.32, stagger: 0.03, ease: "power2.inOut",
    }, 1.18);

    // Row 4 fades away (1.35s – 1.70s), progressively reducing until only 24th remains
    tl.to(row4, {
      opacity: 0, scale: 0.88,
      duration: 0.35, stagger: 0.03, ease: "power2.inOut",
    }, 1.35);

    /* ── Phase 4: The Final 24th Frame Standalone ──
       The last surviving tile is the 24th frame against warm ivory */
    tl.to(finalTile, {
      opacity: 1, scale: 1.05, y: 0,
      duration: 0.42, ease: "power3.out",
    }, 1.48);

    // Subtle breath / highlight on the final 24 FRAMES signature
    tl.to(finalTile, {
      scale: 1.0,
      duration: 0.35, ease: "power2.out",
    }, 1.90);

    /* ── Phase 5: Homepage Reveal ──
       Final tile fades out completely */
    tl.to(finalTile, {
      opacity: 0, scale: 0.94,
      duration: 0.38, ease: "power2.in",
    }, 2.25);

  }, [onComplete]);

  useEffect(() => {
    // Brief timer for DOM layout
    const timer = setTimeout(runAnimation, 40);
    return () => clearTimeout(timer);
  }, [runAnimation]);

  if (!visible) return null;

  return (
    <div
      ref={overlayRef}
      className={styles.overlay}
      aria-hidden="true"
      role="presentation"
    >
      {/* Subtle First Frame Visual Cue */}
      <div ref={cueRef} className={styles.firstCue}>
        <span className={styles.cueReticle}>┌ ┐</span>
        <span className={styles.cueText}>01 / 24</span>
      </div>

      <div ref={gridRef} className={styles.grid}>
        {FRAME_COLORS.map((color, index) => {
          const isFinal = index === 23;

          if (isFinal) {
            return (
              <div
                key="frame-24"
                ref={finalTileRef}
                className={`${styles.tile} ${styles.finalTile}`}
              >
                <div className={styles.finalTileInner}>
                  <span className={styles.finalFrameNo}>24 / 24</span>
                  <span className={styles.finalBrand}>24 FRAMES</span>
                  <span className={styles.finalTag}>CINEMA STUDIO</span>
                </div>
              </div>
            );
          }

          return (
            <div
              key={index}
              ref={(el) => { tileRefs.current[index] = el; }}
              className={styles.tile}
              style={{ backgroundColor: color }}
            >
              <span className={styles.tileNo}>
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
