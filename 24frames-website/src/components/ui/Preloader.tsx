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
  const finalTileRef = useRef<HTMLDivElement>(null);
  const finalInnerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  // Lock body scroll while intro plays
  useEffect(() => {
    const origBodyOverflow = document.body.style.overflow;
    const origHtmlOverflow = document.documentElement.style.overflow;
    const origBodyMargin = document.body.style.margin;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.body.style.margin = "0";

    return () => {
      document.body.style.overflow = origBodyOverflow;
      document.documentElement.style.overflow = origHtmlOverflow;
      document.body.style.margin = origBodyMargin;
    };
  }, []);

  const runAnimation = useCallback(() => {
    // Respect reduced motion
    const isReduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReduced) {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      setVisible(false);
      onComplete();
      return;
    }

    const overlay = overlayRef.current;
    const grid = gridRef.current;
    const tiles = tileRefs.current.filter(Boolean) as HTMLDivElement[];
    const finalTile = finalTileRef.current;
    const finalInner = finalInnerRef.current;

    if (!overlay || !grid || tiles.length < 23 || !finalTile) {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      onComplete();
      return;
    }

    const row1 = tiles.slice(0, 6);
    const row2 = tiles.slice(6, 12);
    const row3 = tiles.slice(12, 18);
    const row4 = tiles.slice(18, 23); // excludes 24th frame

    // Initial state setup: tiles positioned in edge-to-edge grid with subtle prep scale
    gsap.set(tiles, { opacity: 0, scale: 0.94, y: 10 });
    gsap.set(finalTile, { opacity: 0, scale: 0.94, y: 10 });
    if (finalInner) gsap.set(finalInner, { opacity: 0.8 });

    const tl = gsap.timeline({
      onComplete: () => {
        // Unlock scroll right as overlay fades out
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";

        // Final clean unmount
        gsap.to(overlay, {
          opacity: 0,
          duration: 0.42,
          ease: "power2.inOut",
          onComplete: () => {
            setVisible(false);
            onComplete();
          },
        });
      },
    });

    /* ── Step 1: Reveal the first row from left to right (0.08s – 0.44s) ── */
    tl.to(row1, {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.32,
      stagger: 0.045,
      ease: "power2.out",
    }, 0.08);

    /* ── Step 2: Progressively reveal remaining rows & Step 3: Fade earlier frames away ── */
    // Row 2 reveals (0.40s – 0.76s)
    tl.to(row2, {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.32,
      stagger: 0.045,
      ease: "power2.out",
    }, 0.40);

    // Row 1 begins fading as Row 2 establishes (0.48s – 0.78s)
    tl.to(row1, {
      opacity: 0,
      scale: 0.90,
      duration: 0.30,
      stagger: 0.03,
      ease: "power2.inOut",
    }, 0.48);

    // Row 3 reveals (0.72s – 1.08s)
    tl.to(row3, {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.32,
      stagger: 0.045,
      ease: "power2.out",
    }, 0.72);

    // Row 2 begins fading as Row 3 establishes (0.80s – 1.10s)
    tl.to(row2, {
      opacity: 0,
      scale: 0.90,
      duration: 0.30,
      stagger: 0.03,
      ease: "power2.inOut",
    }, 0.80);

    // Row 4 (frames 19–23) reveals left to right (1.04s – 1.36s)
    tl.to(row4, {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.32,
      stagger: 0.045,
      ease: "power2.out",
    }, 1.04);

    // Final 24th Tile reveals in natural cadence directly after tile 23 (1.24s – 1.62s)
    tl.to(finalTile, {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.38,
      ease: "power2.out",
    }, 1.24);

    // Row 3 begins fading as Row 4 establishes (1.12s – 1.42s)
    tl.to(row3, {
      opacity: 0,
      scale: 0.90,
      duration: 0.30,
      stagger: 0.03,
      ease: "power2.inOut",
    }, 1.12);

    /* ── Step 4: Continue until only the 24th tile remains ── */
    // Row 4 (frames 19–23) fades away (1.38s – 1.72s)
    tl.to(row4, {
      opacity: 0,
      scale: 0.90,
      duration: 0.32,
      stagger: 0.03,
      ease: "power2.inOut",
    }, 1.38);

    /* ── Step 5: Let the final tile resolve into the 24 FRAMES wordmark ── */
    if (finalInner) {
      tl.to(finalInner, {
        opacity: 1,
        duration: 0.35,
        ease: "power2.out",
      }, 1.65);
    }

    // Subtle breath & luminous warm gold elevation on the standalone 24th frame
    tl.to(finalTile, {
      scale: 1.03,
      boxShadow: "0 18px 48px rgba(22, 75, 64, 0.16), 0 0 28px rgba(200, 168, 78, 0.32)",
      duration: 0.35,
      ease: "power2.out",
    }, 1.70);

    tl.to(finalTile, {
      scale: 1.0,
      duration: 0.30,
      ease: "power2.inOut",
    }, 2.05);

    /* ── Step 6: Fade the final tile and wordmark out completely to reveal the homepage ── */
    tl.to(finalTile, {
      opacity: 0,
      scale: 0.94,
      duration: 0.36,
      ease: "power2.in",
    }, 2.38);

  }, [onComplete]);

  useEffect(() => {
    const timer = setTimeout(runAnimation, 30);
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
      <div ref={gridRef} className={styles.grid}>
        {FRAME_COLORS.map((color, index) => {
          const isFinal = index === 23;
          const isDarkTile = index < 12;

          if (isFinal) {
            return (
              <div
                key="frame-24"
                ref={finalTileRef}
                className={`${styles.tile} ${styles.finalTile}`}
              >
                <div ref={finalInnerRef} className={styles.finalTileInner}>
                  <span className={styles.finalFrameNo}>24 / 24</span>
                  <div className={styles.finalBrand}>
                    <span className={styles.finalNum}>24</span>
                    <span className={styles.finalWord}>FRAMES</span>
                  </div>
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
              <span
                className={`${styles.tileNo} ${
                  isDarkTile ? styles.tileNoLight : styles.tileNoDark
                }`}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
