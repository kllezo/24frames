"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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

  return (
    <section
      ref={sectionRef}
      id="hero"
      className={styles.heroSection}
      aria-label="Homepage Hero"
    >
      {/* ── FULL-BLEED CINEMATIC PHOTOGRAPH (Edge-to-edge) ── */}
      <div ref={frameRef} className={styles.cinematicCanvas}>
        {/* Laptop/desktop: Shravan & Manasa at dusk on the beach. Phones keep the Hrithika & Abhishek portrait crop. */}
        <picture>
          <source
            media="(max-width: 820px)"
            srcSet="/images/portfolio/hrithika-abhishek/cover-mobile.avif"
            type="image/avif"
          />
          <source
            media="(max-width: 820px)"
            srcSet="/images/portfolio/hrithika-abhishek/cover-mobile.avif"
            type="image/avif"
          />
          <source
            media="(max-width: 820px)"
            srcSet="/images/portfolio/hrithika-abhishek/cover-mobile.webp"
            type="image/webp"
          />
          <source
            media="(max-width: 820px)"
            srcSet="/images/portfolio/hrithika-abhishek/cover-mobile.jpg"
          />
          <source srcSet="/images/v3/hero/beach-dusk-wide.avif" type="image/avif" />
          <source srcSet="/images/v3/hero/beach-dusk-wide.webp" type="image/webp" />
          <img
            ref={heroImgRef}
            src="/images/v3/hero/beach-dusk-wide.jpg"
            alt="Some moments deserve to outlive time — 24 Frames Master Wedding Commission"
            className={styles.heroImage}
            loading="eager"
            fetchPriority="high"
            decoding="sync"
          />
        </picture>

        {/* Subtle, Natural Cinematic Vignette (Preserves Natural Photo Contrast) */}
        <div className={styles.framingVignette} aria-hidden="true" />

        {/* Top Eyebrow Tag Row (Metadata Edition Only — First Frame Pill Removed) */}
        <div ref={topBarRef} className={styles.frameTopBar}>
          <span className={styles.frameEdition}>Wedding photography &amp; films · Hyderabad</span>
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
            <span className={styles.filmSubject}>
              <span className={styles.subjectDesk}>Shravan &amp; Manasa · Pre-wedding</span>
              <span className={styles.subjectMobile}>Hrithika &amp; Abhishek · Hyderabad</span>
            </span>
          </div>

          <Link
            href="/version3#artist"
            className={styles.scrollDownBtn}
            aria-label="Meet the artist"
          >
            <span>Meet the artist</span>
            <span className={styles.arrowIcon} aria-hidden="true">↓</span>
          </Link>
        </div>

      </div>
    </section>
  );
}
