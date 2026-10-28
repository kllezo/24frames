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

      // 0.0s - 0.3s: Initial clean frame appears
      if (darkroomRef.current) {
        tl.to(darkroomRef.current, { opacity: 0.15, duration: 1.2, ease: "power1.inOut" }, 0.2);
      }

      // 0.3s - 1.4s: Feathered light sweep across the photograph
      if (lightSweepRef.current) {
        tl.fromTo(
          lightSweepRef.current,
          { x: "-110%", opacity: 0 },
          { x: "130%", opacity: 0.75, duration: 1.3, ease: "power2.inOut" },
          0.3
        );
      }

      // 0.8s - 1.8s: Photograph resolves from slight blur and settles scale 1.03 to 1.00
      if (heroImgRef.current) {
        tl.fromTo(
          heroImgRef.current,
          { scale: 1.035, filter: "blur(4px)" },
          { scale: 1.0, filter: "blur(0px)", duration: 1.1, ease: "power2.out" },
          0.6
        );
      }

      // 1.5s - 2.2s: Complete headline and supporting lines fade in
      if (headlineRef.current) {
        tl.fromTo(
          headlineRef.current,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.85, ease: "power3.out" },
          1.2
        );
      }

      if (metadataRef.current) {
        tl.fromTo(
          metadataRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.6, ease: "power2.out" },
          1.6
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
      <div className={styles.container}>
        {/* ── CINEMATIC PHOTOGRAPHIC SCENE (90-95% Width, 68-76vh Height) ── */}
        <div ref={frameRef} className={styles.cinematicFrame}>
          {/* Real Landscape Photograph: Hrithika & Abhishek Cover */}
          <img
            ref={heroImgRef}
            src="/images/portfolio/hrithika-abhishek/cover.jpg"
            alt="Some moments deserve to outlive time — 24 Frames Master Wedding Commission"
            className={styles.heroImage}
            loading="eager"
          />

          {/* Subdued Darkroom Atmosphere Overlay */}
          <div ref={darkroomRef} className={styles.darkroomOverlay} aria-hidden="true" />

          {/* Feathered Warm Light Sweep Beam */}
          <div ref={lightSweepRef} className={styles.lightSweepBeam} aria-hidden="true" />

          {/* Subtle Photographic Framing Vignette */}
          <div className={styles.framingVignette} aria-hidden="true" />

          {/* Top Frame Eyebrow Tag */}
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

        {/* ── PEDIGREE METRICS BAR ── */}
        <div className={styles.metricsBar}>
          <div className={styles.metricItem}>
            <span className={styles.metricValue}>14</span>
            <span className={styles.metricLabel}>Years Preserving Heritage</span>
          </div>
          <span className={styles.metricDivider}>/</span>
          <div className={styles.metricItem}>
            <span className={styles.metricValue}>1,000+</span>
            <span className={styles.metricLabel}>Weddings Documented</span>
          </div>
          <span className={styles.metricDivider}>/</span>
          <div className={styles.metricItem}>
            <span className={styles.metricValue}>ET Excellence</span>
            <span className={styles.metricLabel}>Award 2025 Winner</span>
          </div>
          <span className={styles.metricDivider}>/</span>
          <div className={styles.metricItem}>
            <span className={styles.metricValue}>Nikon India</span>
            <span className={styles.metricLabel}>Official Creator Family</span>
          </div>
        </div>
      </div>
    </section>
  );
}
