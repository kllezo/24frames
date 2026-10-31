"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroLogoTransition from "./HeroLogoTransition";
import styles from "./HeroSection.module.css";

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const heroImgRef = useRef<HTMLImageElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const metadataRef = useRef<HTMLDivElement>(null);
  const topBarRef = useRef<HTMLDivElement>(null);

  /* ── The First Frame: Immediate Hero Photograph Display ── */
  useEffect(() => {
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReduced) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      // Subtle, refined editorial headline entrance
      if (headlineRef.current) {
        tl.fromTo(
          headlineRef.current,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
          0.1
        );
      }

      // Metadata & CTA prompt fade in smoothly
      if (metadataRef.current) {
        tl.fromTo(
          metadataRef.current,
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
          0.3
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
      aria-label="The First Frame"
    >
      {/* ── FULL-BLEED CINEMATIC PHOTOGRAPH (Edge-to-edge) ── */}
      <div ref={frameRef} className={styles.cinematicCanvas}>
        {/* Real Landscape Photograph: Hrithika & Abhishek Cover (with dedicated mobile portrait crop) */}
        <picture>
          <source
            media="(max-width: 820px)"
            srcSet="/images/portfolio/hrithika-abhishek/cover-mobile.webp"
            type="image/webp"
          />
          <source
            media="(max-width: 820px)"
            srcSet="/images/portfolio/hrithika-abhishek/cover-mobile.jpg"
          />
          <img
            ref={heroImgRef}
            src="/images/portfolio/hrithika-abhishek/cover.jpg"
            alt="Some moments deserve to outlive time — 24 Frames Master Wedding Commission"
            className={styles.heroImage}
            loading="eager"
          />
        </picture>

        {/* Subtle, Natural Cinematic Vignette (Preserves Natural Photo Contrast) */}
        <div className={styles.framingVignette} aria-hidden="true" />

        {/* Top Header Transition Overlay — Ensures navigation legibility */}
        <div className={styles.headerUnderlay} aria-hidden="true" />

        {/* Top Eyebrow Tag Row */}
        <div ref={topBarRef} className={styles.frameTopBar}>
          <div className={styles.kickerBadge}>
            <span className={styles.kickerDot} />
            <span>THE FIRST FRAME</span>
          </div>
          <span className={styles.frameEdition}>HYDERABAD · PALACE COMMISSION</span>
        </div>

        {/* Editorial Headline Overlay */}
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

        {/* ── Pure Hero Image → 24 FRAMES Logo Cinematic Transition ── */}
        <HeroLogoTransition
          heroSectionRef={sectionRef}
          heroImageRef={heroImgRef}
          headlineRef={headlineRef}
          metadataRef={metadataRef}
          topBarRef={topBarRef}
        />
      </div>
    </section>
  );
}
