"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CameraGlareTransition from "./CameraGlareTransition";
import styles from "./HeroSection.module.css";

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const heroImgRef = useRef<HTMLImageElement>(null);
  const apertureContainerRef = useRef<HTMLDivElement>(null);
  const apertureHoleRef = useRef<SVGCircleElement>(null);
  const apertureRingsRef = useRef<SVGGElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const metadataRef = useRef<HTMLDivElement>(null);
  const topBarRef = useRef<HTMLDivElement>(null);

  /* ── Act I — The First Frame: Aperture Opening & Editorial Reveal ── */
  useEffect(() => {
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReduced) {
      if (apertureContainerRef.current) {
        apertureContainerRef.current.style.display = "none";
      }
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        onComplete: () => {
          gsap.set([heroImgRef.current, headlineRef.current, metadataRef.current], { clearProps: "transform" });
        },
      });

      // 1. Aperture Blade Mask Opens Smoothly from f/16 to f/1.2 (revealing hero photo)
      if (apertureHoleRef.current) {
        tl.fromTo(
          apertureHoleRef.current,
          { attr: { r: 210 } },
          { attr: { r: 920 }, duration: 1.55, ease: "power3.inOut" },
          0.05
        );
      }

      // 2. Optical Lens Collar & Markings expand outward and dissolve gracefully
      if (apertureRingsRef.current) {
        tl.fromTo(
          apertureRingsRef.current,
          { scale: 1, opacity: 0.95 },
          { scale: 1.4, opacity: 0, duration: 1.25, ease: "power2.inOut" },
          0.25
        );
      }

      // 3. Aperture overlay container fades completely as full-frame view is achieved
      if (apertureContainerRef.current) {
        tl.to(
          apertureContainerRef.current,
          { opacity: 0, duration: 0.65, ease: "power2.out" },
          1.15
        );
      }

      // 4. Hero Photograph sharpens and settles: 1.05 -> 1.00
      if (heroImgRef.current) {
        tl.fromTo(
          heroImgRef.current,
          { scale: 1.05, opacity: 0.92 },
          { scale: 1.0, opacity: 1, duration: 1.4, ease: "power2.out" },
          0.1
        );
      }

      // 5. Editorial headline appears in deliberate sequence
      if (headlineRef.current) {
        tl.fromTo(
          headlineRef.current,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.95, ease: "power2.out" },
          0.55
        );
      }

      // 6. Frame metadata & CTA fade in
      if (metadataRef.current) {
        tl.fromTo(
          metadataRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.85, ease: "power2.out" },
          0.85
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

        {/* ── Multi-Blade Camera Aperture Mask Overlay ── */}
        <div ref={apertureContainerRef} className={styles.apertureMaskLayer} aria-hidden="true">
          <svg className={styles.apertureSvg} viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
            <defs>
              <mask id="heroApertureMask">
                <rect width="1000" height="1000" fill="white" />
                <circle ref={apertureHoleRef} cx="500" cy="480" r="210" fill="black" />
              </mask>
            </defs>
            <rect width="1000" height="1000" fill="#0C1411" mask="url(#heroApertureMask)" />
            <g ref={apertureRingsRef} className={styles.apertureGuides}>
              <circle cx="500" cy="480" r="210" fill="none" stroke="rgba(202, 168, 107, 0.45)" strokeWidth="1.5" strokeDasharray="3 5" />
              <circle cx="500" cy="480" r="228" fill="none" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="1" />
              
              {/* 8 Aperture Blade Subtle Radial Reference Marks */}
              <line x1="648" y1="332" x2="740" y2="240" stroke="rgba(255, 255, 255, 0.16)" strokeWidth="1" />
              <line x1="710" y1="480" x2="840" y2="480" stroke="rgba(255, 255, 255, 0.16)" strokeWidth="1" />
              <line x1="648" y1="628" x2="740" y2="720" stroke="rgba(255, 255, 255, 0.16)" strokeWidth="1" />
              <line x1="500" y1="690" x2="500" y2="820" stroke="rgba(255, 255, 255, 0.16)" strokeWidth="1" />
              <line x1="352" y1="628" x2="260" y2="720" stroke="rgba(255, 255, 255, 0.16)" strokeWidth="1" />
              <line x1="290" y1="480" x2="160" y2="480" stroke="rgba(255, 255, 255, 0.16)" strokeWidth="1" />
              <line x1="352" y1="332" x2="260" y2="240" stroke="rgba(255, 255, 255, 0.16)" strokeWidth="1" />
              <line x1="500" y1="270" x2="500" y2="140" stroke="rgba(255, 255, 255, 0.16)" strokeWidth="1" />

              <text x="500" y="235" textAnchor="middle" fill="rgba(202, 168, 107, 0.85)" fontSize="10" letterSpacing="0.22em" fontFamily="var(--font-inter), sans-serif" fontWeight="600">f / 1.4 · 50MM ANAMORPHIC PRIME</text>
              <text x="500" y="735" textAnchor="middle" fill="rgba(255, 255, 255, 0.45)" fontSize="9" letterSpacing="0.18em" fontFamily="var(--font-inter), sans-serif">24 FRAMES · THE FIRST FRAME</text>
            </g>
          </svg>
        </div>

        {/* Top Header Transition Overlay — Ensures navigation legibility without visible panels */}
        <div className={styles.headerUnderlay} aria-hidden="true" />

        {/* Top Eyebrow Tag Row (Positioned below transparent header) */}
        <div ref={topBarRef} className={styles.frameTopBar}>
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

        {/* ── Camera Glare → The Fabric of Frames Cinematic Transition ── */}
        <CameraGlareTransition
          heroSectionRef={sectionRef}
          heroImageRef={heroImgRef}
          headlineRef={headlineRef}
          metadataRef={metadataRef}
          topBarRef={topBarRef}
          apertureRef={apertureContainerRef}
        />
      </div>
    </section>
  );
}
