"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./HeroLogoTransition.module.css";

gsap.registerPlugin(ScrollTrigger);

interface HeroLogoTransitionProps {
  heroSectionRef: React.RefObject<HTMLElement | null>;
  heroImageRef: React.RefObject<HTMLImageElement | null>;
  headlineRef: React.RefObject<HTMLDivElement | null>;
  metadataRef: React.RefObject<HTMLDivElement | null>;
  topBarRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * HeroLogoTransition
 *
 * Clean, Coordinated Homepage Opening:
 * 1. Existing Hero Photograph (Resting state, 100% visible immediately)
 * 2. 24 FRAMES Logo Reveal (Smooth, elegant transition, restrained scale & opacity)
 * 3. Final Cinematic Hold (Clear, prominent studio signature moment)
 * 4. Natural Handoff (Transitions smoothly into existing homepage content)
 *
 * Zero camera shutter, zero glare, zero cloth/mandapam, zero background RAF loops.
 */
export default function HeroLogoTransition({
  heroSectionRef,
  heroImageRef,
  headlineRef,
  metadataRef,
  topBarRef,
}: HeroLogoTransitionProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const logoWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReducedMotion) {
      if (rootRef.current) rootRef.current.style.display = "none";
      return;
    }

    if (!heroSectionRef.current) return;

    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set([backdropRef.current, logoWrapRef.current], { opacity: 0 });

      // Master timeline scrubbed by ScrollTrigger
      const masterTl = gsap.timeline({
        paused: true,
        defaults: { ease: "none" },
      });

      // ── Stage 1: Hero Photograph Resting State (0.00 – 0.18) ────────
      masterTl.to({}, { duration: 0.18 }, 0.0);

      // ── Stage 2: Direct Cinematic Transition to 24 FRAMES Logo (0.18 – 0.50) ──
      // Backdrop fades in smoothly to deep luxury dark
      if (backdropRef.current) {
        masterTl.fromTo(
          backdropRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.32, ease: "power2.inOut" },
          0.18
        );
      }

      // Hero photo and editorial typography dissolve gently
      if (heroImageRef.current) {
        masterTl.to(
          heroImageRef.current,
          { opacity: 0, scale: 1.025, duration: 0.30, ease: "power2.inOut" },
          0.18
        );
      }
      if (headlineRef.current) {
        masterTl.to(
          headlineRef.current,
          { opacity: 0, y: -14, duration: 0.24, ease: "power2.in" },
          0.18
        );
      }
      if (metadataRef.current) {
        masterTl.to(
          metadataRef.current,
          { opacity: 0, y: 14, duration: 0.24, ease: "power2.in" },
          0.18
        );
      }
      if (topBarRef.current) {
        masterTl.to(
          topBarRef.current,
          { opacity: 0, duration: 0.20, ease: "power1.in" },
          0.18
        );
      }

      // Authentic 24 FRAMES Logo emerges cleanly with restrained scale & opacity
      if (logoWrapRef.current) {
        masterTl.fromTo(
          logoWrapRef.current,
          { opacity: 0, scale: 0.94 },
          { opacity: 1, scale: 1.0, duration: 0.30, ease: "power2.out" },
          0.20
        );
      }

      // ── Stage 3: Final Cinematic Logo Hold (0.50 – 0.78) ───────────
      masterTl.to({}, { duration: 0.28 }, 0.50);

      // ── Stage 4: Natural Handoff to Existing Homepage Content (0.78 – 1.00) ──
      if (logoWrapRef.current) {
        masterTl.to(
          logoWrapRef.current,
          { opacity: 0, scale: 1.025, duration: 0.20, ease: "power2.in" },
          0.78
        );
      }
      if (backdropRef.current) {
        masterTl.to(
          backdropRef.current,
          { opacity: 0, duration: 0.16, ease: "power1.in" },
          0.84
        );
      }

      // ── ScrollTrigger pinning the Hero container ───────────────────
      const isMobile = window.innerWidth < 820;
      const pinDistance = isMobile ? "+=100%" : "+=130%";

      ScrollTrigger.create({
        trigger: heroSectionRef.current,
        start: "top top",
        end: pinDistance,
        pin: true,
        scrub: 0.5,
        onUpdate: (self) => {
          const progress = self.progress;
          masterTl.progress(progress);

          // Fast scroll & reverse boundary reset
          if (progress <= 0.005) {
            if (backdropRef.current) backdropRef.current.style.opacity = "0";
            if (logoWrapRef.current) logoWrapRef.current.style.opacity = "0";
            if (heroImageRef.current) {
              heroImageRef.current.style.opacity = "1";
              heroImageRef.current.style.filter = "none";
              heroImageRef.current.style.transform = "none";
            }
            if (headlineRef.current) {
              headlineRef.current.style.opacity = "1";
              headlineRef.current.style.transform = "none";
            }
            if (metadataRef.current) {
              metadataRef.current.style.opacity = "1";
              metadataRef.current.style.transform = "none";
            }
            if (topBarRef.current) {
              topBarRef.current.style.opacity = "1";
            }
          }
        },
      });
    }, heroSectionRef);

    return () => {
      ctx.revert();
      if (heroImageRef.current) {
        heroImageRef.current.style.opacity = "";
        heroImageRef.current.style.filter = "";
        heroImageRef.current.style.transform = "";
      }
      if (headlineRef.current) {
        headlineRef.current.style.opacity = "";
        headlineRef.current.style.transform = "";
      }
      if (metadataRef.current) {
        metadataRef.current.style.opacity = "";
        metadataRef.current.style.transform = "";
      }
      if (topBarRef.current) {
        topBarRef.current.style.opacity = "";
      }
    };
  }, [heroSectionRef, heroImageRef, headlineRef, metadataRef, topBarRef]);

  return (
    <div ref={rootRef} className={styles.transitionRoot} aria-hidden="true">
      {/* Luxury Cinematic Backdrop */}
      <div ref={backdropRef} className={styles.backdrop} />

      {/* Authentic 24 FRAMES Logo Reveal */}
      <div ref={logoWrapRef} className={styles.logoWrap}>
        <picture>
          <source srcSet="/images/logo-light-header.webp" type="image/webp" />
          <img
            src="/images/logo-light-header.png"
            alt="24 FRAMES · Phani Gogireddy"
            className={styles.logoImage}
            loading="eager"
          />
        </picture>
      </div>
    </div>
  );
}
