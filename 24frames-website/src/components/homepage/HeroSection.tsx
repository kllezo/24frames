"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import styles from "./HeroSection.module.css";

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const heroImgRef = useRef<HTMLImageElement>(null);
  const darkroomRef = useRef<HTMLDivElement>(null);
  const lightSweepRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const metadataRef = useRef<HTMLDivElement>(null);

  /* ── Act I — The First Frame Reveal Animation ── */
  useEffect(() => {
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReduced) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      // Clean, glare-free photograph settling: subtle scale 1.025 -> 1.00, no blur
      if (heroImgRef.current) {
        tl.fromTo(
          heroImgRef.current,
          { scale: 1.025, opacity: 0.92 },
          { scale: 1.0, opacity: 1, duration: 1.2, ease: "power2.out" },
          0.1
        );
      }

      // Editorial headline and supporting copy fade in together as an elegant group
      if (headlineRef.current) {
        tl.fromTo(
          headlineRef.current,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.85, ease: "power2.out" },
          0.4
        );
      }

      // Frame metadata & Explore CTA fade in
      if (metadataRef.current) {
        tl.fromTo(
          metadataRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.7, ease: "power2.out" },
          0.7
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleScrollToVows = () => {
    const vowsEl = document.getElementById("the-vows") || document.getElementById("vows");
    if (vowsEl) {
      vowsEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className={styles.heroSection}
      aria-label="Act I — The First Frame"
    >
      {/* ── FULL-BLEED CINEMATIC PHOTOGRAPH (Edge-to-edge, 85vh) ── */}
      <div ref={frameRef} className={styles.cinematicCanvas}>
        {/* Real Landscape Photograph: Hrithika & Abhishek Cover */}
        <img
          ref={heroImgRef}
          src="/images/portfolio/hrithika-abhishek/cover.jpg"
          alt="Some moments deserve to outlive time — 24 Frames Master Wedding Commission"
          className={styles.heroImage}
          loading="eager"
        />

        {/* Subtle, Natural Cinematic Vignette (Preserves Natural Photo Lighting) */}
        <div className={styles.framingVignette} aria-hidden="true" />

        {/* Top Header Transition Overlay — Ensures navigation legibility without visible panels */}
        <div className={styles.headerUnderlay} aria-hidden="true" />

        {/* Top Eyebrow Tag Row (Positioned below transparent header) */}
        <div className={styles.frameTopBar}>
          <div className={styles.kickerBadge}>
            <span className={styles.kickerDot} />
            <span>ACT I · THE FIRST FRAME</span>
          </div>
          <span className={styles.frameEdition}>HYDERABAD · PALACE COMMISSION</span>
        </div>

        {/* Editorial Headline Overlay — Positioned in Natural Negative Space */}
        <div ref={headlineRef} className={styles.editorialTextOverlay}>
          <h1 className={styles.headline}>
            Some moments deserve to outlive time.
          </h1>
          <p className={styles.supportingCopy}>
            Quiet honesty, cinematic framing, and generational memories documented by Phani Gogireddy.
          </p>
        </div>

        {/* Bottom Bar: Frame Metadata & Scroll Prompt */}
        <div ref={metadataRef} className={styles.frameBottomBar}>
          <div className={styles.filmMetadata}>
            <span className={styles.filmStock}>OPTICAL CINEMA PRIMES · 24 FRAMES ARCHIVE</span>
            <span className={styles.filmSubject}>HRITHIKA &amp; ABHISHEK · NINE-SCENE UNION</span>
          </div>

          <button
            onClick={handleScrollToVows}
            className={styles.scrollDownBtn}
            aria-label="Scroll to The Vows chapter"
          >
            <span>EXPLORE THE LIVING CINEMA</span>
            <span className={styles.arrowIcon}>↓</span>
          </button>
        </div>
      </div>
    </section>
  );
}
