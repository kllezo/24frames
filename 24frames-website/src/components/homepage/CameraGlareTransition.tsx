"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./CameraGlareTransition.module.css";

gsap.registerPlugin(ScrollTrigger);

interface CameraGlareTransitionProps {
  heroSectionRef: React.RefObject<HTMLElement | null>;
  heroImageRef: React.RefObject<HTMLImageElement | null>;
  headlineRef: React.RefObject<HTMLDivElement | null>;
  metadataRef: React.RefObject<HTMLDivElement | null>;
  topBarRef: React.RefObject<HTMLDivElement | null>;
  apertureRef: React.RefObject<HTMLDivElement | null>;
}

export default function CameraGlareTransition({
  heroSectionRef,
  heroImageRef,
  headlineRef,
  metadataRef,
  topBarRef,
  apertureRef,
}: CameraGlareTransitionProps) {
  // DOM element refs for all transition stages
  const rootRef = useRef<HTMLDivElement>(null);
  const greenBackdropRef = useRef<HTMLDivElement>(null);
  const glareRigRef = useRef<HTMLDivElement>(null);
  const glareHotspotRef = useRef<HTMLDivElement>(null);
  const starburstRef = useRef<SVGSVGElement>(null);
  const bokehGhostChainRef = useRef<HTMLDivElement>(null);
  const ghost1Ref = useRef<HTMLDivElement>(null);
  const ghost2Ref = useRef<HTMLDivElement>(null);
  const ghost3Ref = useRef<HTMLDivElement>(null);
  const ghost4Ref = useRef<HTMLDivElement>(null);
  const champagneWashRef = useRef<HTMLDivElement>(null);
  const logoRevealWrapRef = useRef<HTMLDivElement>(null);
  const logoGlintRef = useRef<HTMLDivElement>(null);
  const fabricStageRef = useRef<HTMLDivElement>(null);
  const fabricGroupRef = useRef<SVGGElement>(null);
  const mandapamStageRef = useRef<HTMLDivElement>(null);
  const mandapamGroupRef = useRef<SVGGElement>(null);
  const colonnadePerspectiveRef = useRef<SVGGElement>(null);
  const govindaNamaluWrapRef = useRef<HTMLDivElement>(null);
  const portalChapterMetaRef = useRef<HTMLDivElement>(null);
  const portalExitBloomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Accessibility check: Reduced motion
    const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReducedMotion) {
      if (rootRef.current) rootRef.current.style.display = "none";
      return;
    }

    if (!heroSectionRef.current) return;

    const ctx = gsap.context(() => {
      // Proxy object to smoothly interpolate coordinates & opacities
      const state = {
        glareX: 18, // vw percentage
        glareY: 18, // vh percentage
        glareScale: 0.85,
        starburstRotation: 0,
      };

      // Set initial element states
      gsap.set(
        [
          greenBackdropRef.current,
          glareRigRef.current,
          champagneWashRef.current,
          logoRevealWrapRef.current,
          fabricStageRef.current,
          mandapamStageRef.current,
          portalChapterMetaRef.current,
          portalExitBloomRef.current,
        ],
        { opacity: 0 }
      );

      // Create the single master coordinated timeline driven by ScrollTrigger
      const masterTl = gsap.timeline({
        paused: true,
        defaults: { ease: "none" },
      });

      /* ═══════════════════════════════════════════════════════════════════
         STAGE 1 (0.00 – 0.15): HOMEPAGE HERO RESTING STATE
         The existing hero photograph, typography, and content remain
         100% intact, crisp, and stable. No filters or zooms.
         ═══════════════════════════════════════════════════════════════════ */
      masterTl.to({}, { duration: 0.15 }, 0.0);

      /* ═══════════════════════════════════════════════════════════════════
         STAGE 2 (0.15 – 0.30): CAMERA GLARE APPEARS (TOP-LEFT)
         Natural cinematic lens flare catches the lens near upper-left.
         Original photograph remains completely recognizable beneath.
         ═══════════════════════════════════════════════════════════════════ */
      if (glareRigRef.current && glareHotspotRef.current) {
        masterTl.fromTo(
          glareRigRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.12, ease: "power1.inOut" },
          0.15
        );

        masterTl.fromTo(
          state,
          { glareX: 18, glareY: 18, glareScale: 0.85, starburstRotation: 0 },
          {
            glareX: 25,
            glareY: 22,
            glareScale: 1.0,
            starburstRotation: 15,
            duration: 0.15,
            ease: "sine.inOut",
            onUpdate: () => {
              if (glareHotspotRef.current) {
                glareHotspotRef.current.style.left = `${state.glareX}%`;
                glareHotspotRef.current.style.top = `${state.glareY}%`;
                glareHotspotRef.current.style.transform = `translate(-50%, -50%) scale(${state.glareScale})`;
              }
              if (starburstRef.current) {
                starburstRef.current.style.transform = `translate(-50%, -50%) rotate(${state.starburstRotation}deg)`;
              }
              // Coaxial bokeh orbs track along lens optical axis towards bottom right
              if (ghost1Ref.current) {
                ghost1Ref.current.style.left = `${state.glareX * 1.5}%`;
                ghost1Ref.current.style.top = `${state.glareY * 1.6}%`;
              }
              if (ghost2Ref.current) {
                ghost2Ref.current.style.left = `${state.glareX * 2.2}%`;
                ghost2Ref.current.style.top = `${state.glareY * 2.1}%`;
              }
              if (ghost3Ref.current) {
                ghost3Ref.current.style.left = `${state.glareX * 2.9}%`;
                ghost3Ref.current.style.top = `${state.glareY * 2.6}%`;
              }
              if (ghost4Ref.current) {
                ghost4Ref.current.style.left = `${state.glareX * 3.6}%`;
                ghost4Ref.current.style.top = `${state.glareY * 3.1}%`;
              }
            },
          },
          0.15
        );
      }

      /* ═══════════════════════════════════════════════════════════════════
         STAGE 3 (0.30 – 0.45): GLARE TRAVELS ACROSS THE SCENE
         Light travels diagonally towards the center/right.
         Hero photo remains intact in place (no zooming!).
         Headline and metadata dissolve gently to focus attention.
         ═══════════════════════════════════════════════════════════════════ */
      masterTl.to(
        state,
        {
          glareX: 50,
          glareY: 36,
          glareScale: 1.45,
          starburstRotation: 42,
          duration: 0.15,
          ease: "power2.inOut",
          onUpdate: () => {
            if (glareHotspotRef.current) {
              glareHotspotRef.current.style.left = `${state.glareX}%`;
              glareHotspotRef.current.style.top = `${state.glareY}%`;
              glareHotspotRef.current.style.transform = `translate(-50%, -50%) scale(${state.glareScale})`;
            }
            if (starburstRef.current) {
              starburstRef.current.style.transform = `translate(-50%, -50%) rotate(${state.starburstRotation}deg)`;
            }
            if (ghost1Ref.current) {
              ghost1Ref.current.style.left = `${Math.min(90, state.glareX * 1.4)}%`;
              ghost1Ref.current.style.top = `${Math.min(85, state.glareY * 1.45)}%`;
            }
            if (ghost2Ref.current) {
              ghost2Ref.current.style.left = `${Math.min(94, state.glareX * 1.7)}%`;
              ghost2Ref.current.style.top = `${Math.min(88, state.glareY * 1.75)}%`;
            }
            if (ghost3Ref.current) {
              ghost3Ref.current.style.left = `${Math.min(96, state.glareX * 1.9)}%`;
              ghost3Ref.current.style.top = `${Math.min(92, state.glareY * 1.95)}%`;
            }
            if (ghost4Ref.current) {
              ghost4Ref.current.style.left = `${Math.min(98, state.glareX * 2.1)}%`;
              ghost4Ref.current.style.top = `${Math.min(95, state.glareY * 2.15)}%`;
            }
          },
        },
        0.30
      );

      // Hero UI typography dissolves softly during light transit
      if (headlineRef.current) {
        masterTl.to(headlineRef.current, { opacity: 0, y: -12, duration: 0.11, ease: "power2.out" }, 0.28);
      }
      if (metadataRef.current) {
        masterTl.to(metadataRef.current, { opacity: 0, y: 10, duration: 0.11, ease: "power2.out" }, 0.28);
      }
      if (topBarRef.current) {
        masterTl.to(topBarRef.current, { opacity: 0, duration: 0.10, ease: "power2.out" }, 0.30);
      }

      /* ═══════════════════════════════════════════════════════════════════
         STAGE 4 (0.45 – 0.60): CONTROLLED CHAMPAGNE-WHITE OPTICAL WASH
         Moving glare blooms into a soft, radiant champagne wash.
         Transitions naturally into deep forest-green cinematic stage.
         Hero photo fades out under wash. Wash clears completely.
         ═══════════════════════════════════════════════════════════════════ */
      if (champagneWashRef.current) {
        // Bloom opens smoothly
        masterTl.fromTo(
          champagneWashRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.08, ease: "power2.in" },
          0.44
        );

        // Backdrop shifts to deep forest green
        if (greenBackdropRef.current) {
          masterTl.to(greenBackdropRef.current, { opacity: 1, duration: 0.08, ease: "none" }, 0.47);
        }

        // Hero image fades out underneath the wash
        if (heroImageRef.current) {
          masterTl.to(heroImageRef.current, { opacity: 0, duration: 0.07, ease: "power1.out" }, 0.46);
        }

        // Glare rig fades into the bloom
        if (glareRigRef.current) {
          masterTl.to(glareRigRef.current, { opacity: 0, duration: 0.06 }, 0.49);
        }

        // Champagne wash clears completely
        masterTl.to(
          champagneWashRef.current,
          { opacity: 0, duration: 0.09, ease: "power2.out" },
          0.52
        );
      }

      /* ═══════════════════════════════════════════════════════════════════
         STAGE 5 (0.60 – 0.70): ACTUAL 24 FRAMES LOGO REVEAL
         Authentic logo component/asset revealed in exact proportions.
         Glare glint settles briefly near logo, perceptual pause, fades.
         ═══════════════════════════════════════════════════════════════════ */
      if (logoRevealWrapRef.current) {
        masterTl.fromTo(
          logoRevealWrapRef.current,
          { opacity: 0, scale: 0.94 },
          { opacity: 1, scale: 1.0, duration: 0.04, ease: "power2.out" },
          0.59
        );

        if (logoGlintRef.current) {
          masterTl.fromTo(
            logoGlintRef.current,
            { opacity: 0, scale: 0.8 },
            { opacity: 0.85, scale: 1.1, duration: 0.04, ease: "power2.out" },
            0.60
          );
        }

        // Visual pause from 0.63 to 0.67
        masterTl.to({}, { duration: 0.04 }, 0.63);

        // Logo and glint dissolve gracefully before fabric emergence
        masterTl.to(
          logoRevealWrapRef.current,
          { opacity: 0, scale: 1.02, duration: 0.04, ease: "power2.in" },
          0.67
        );
      }

      /* ═══════════════════════════════════════════════════════════════════
         STAGE 6 (0.70 – 0.85): EMERALD & CHAMPAGNE FABRIC EMERGES & FLOWS
         Silk fabric emerges from top-left (connecting causally to light).
         Layered, organic folds with realistic sheen billow across scene.
         ═══════════════════════════════════════════════════════════════════ */
      if (fabricStageRef.current && fabricGroupRef.current) {
        masterTl.fromTo(
          fabricStageRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.05, ease: "power1.out" },
          0.69
        );

        masterTl.fromTo(
          fabricGroupRef.current,
          { x: -90, y: -70, scale: 0.92 },
          { x: 0, y: 0, scale: 1.0, duration: 0.15, ease: "power2.out" },
          0.70
        );
      }

      /* ═══════════════════════════════════════════════════════════════════
         STAGE 7 (0.85 – 0.95): FABRIC FORMS THE SOUTH INDIAN MANDAPAM
         Fabric drapes gracefully into traditional ceremonial mandapam arch.
         Carved golden pillars, jasmine/mogra garlands, and the sacred
         Govinda Namalu symbol prominently centered above the archway.
         ═══════════════════════════════════════════════════════════════════ */
      if (mandapamStageRef.current && mandapamGroupRef.current) {
        masterTl.fromTo(
          mandapamStageRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.06, ease: "power2.out" },
          0.84
        );

        masterTl.fromTo(
          mandapamGroupRef.current,
          { scale: 0.96, y: 15 },
          { scale: 1.0, y: 0, duration: 0.10, ease: "power2.out" },
          0.85
        );

        // Draping transition: fabric smoothly integrates into the mandapam canopy
        if (fabricStageRef.current) {
          masterTl.to(
            fabricStageRef.current,
            { opacity: 0.45, duration: 0.08, ease: "sine.inOut" },
            0.87
          );
        }
      }

      /* ═══════════════════════════════════════════════════════════════════
         STAGE 8 (0.95 – 1.00): ARCH OPENS & ENTER THE FABRIC OF FRAMES
         Mandapam perspective colonnade reveals golden horizon depth.
         Chapter metadata appears, guiding eye into The Vows sequence.
         Composition stays stable and directly releases into Chapter 02.
         ═══════════════════════════════════════════════════════════════════ */
      if (colonnadePerspectiveRef.current) {
        masterTl.fromTo(
          colonnadePerspectiveRef.current,
          { opacity: 0, scale: 0.92 },
          { opacity: 1, scale: 1.0, duration: 0.08, ease: "power2.out" },
          0.90
        );
      }

      if (portalChapterMetaRef.current) {
        masterTl.fromTo(
          portalChapterMetaRef.current,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.06, ease: "power2.out" },
          0.93
        );
      }

      if (portalExitBloomRef.current) {
        masterTl.fromTo(
          portalExitBloomRef.current,
          { opacity: 0 },
          { opacity: 0.45, duration: 0.04, ease: "power2.in" },
          0.93
        );
        masterTl.to(
          portalExitBloomRef.current,
          { opacity: 0, duration: 0.03, ease: "power2.out" },
          0.97
        );
      }

      // ── Create ScrollTrigger pinning the Hero container ──────────────
      const isMobile = window.innerWidth < 820;
      const pinDistance = isMobile ? "+=180%" : "+=240%";

      ScrollTrigger.create({
        trigger: heroSectionRef.current,
        start: "top top",
        end: pinDistance,
        pin: true,
        scrub: 0.6,
        onUpdate: (self) => {
          const progress = self.progress;

          // Scrub the coordinated master timeline directly
          masterTl.progress(progress);

          // Fast scroll & reverse scroll boundary safety:
          if (progress <= 0.005) {
            if (glareRigRef.current) glareRigRef.current.style.opacity = "0";
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
      // Ensure all inline styles are completely reset on cleanup/route change
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
  }, [heroSectionRef, heroImageRef, headlineRef, metadataRef, topBarRef, apertureRef]);

  return (
    <div ref={rootRef} className={styles.transitionRoot} aria-hidden="true">
      {/* ── Layer 1: Deep Forest Green Cinematic Backdrop Stage ── */}
      <div ref={greenBackdropRef} className={styles.greenBackdrop} />

      {/* ── Layer 2: Moving Camera Glare & Optical Anamorphic Flare ── */}
      <div ref={glareRigRef} className={styles.glareRig}>
        <div ref={glareHotspotRef} className={styles.glareHotspot}>
          <div className={styles.glareSoftAura} />
          <div className={styles.glareCoreLight} />
          <div className={styles.anamorphicSoftGlow} />
          <div className={styles.anamorphicStreak} />

          {/* 12-Blade Optical Prime Starburst Diffraction Rays */}
          <svg
            ref={starburstRef}
            className={styles.starburstRays}
            viewBox="0 0 200 200"
            fill="none"
          >
            <line x1="100" y1="10" x2="100" y2="190" stroke="rgba(255, 250, 230, 0.45)" strokeWidth="1" />
            <line x1="10" y1="100" x2="190" y2="100" stroke="rgba(255, 250, 230, 0.45)" strokeWidth="1" />
            <line x1="36" y1="36" x2="164" y2="164" stroke="rgba(245, 225, 175, 0.35)" strokeWidth="0.8" />
            <line x1="36" y1="164" x2="164" y2="36" stroke="rgba(245, 225, 175, 0.35)" strokeWidth="0.8" />
            <line x1="65" y1="20" x2="135" y2="180" stroke="rgba(255, 240, 200, 0.22)" strokeWidth="0.6" />
            <line x1="20" y1="65" x2="180" y2="135" stroke="rgba(255, 240, 200, 0.22)" strokeWidth="0.6" />
            <line x1="20" y1="135" x2="180" y2="65" stroke="rgba(255, 240, 200, 0.22)" strokeWidth="0.6" />
            <line x1="65" y1="180" x2="135" y2="20" stroke="rgba(255, 240, 200, 0.22)" strokeWidth="0.6" />
          </svg>
        </div>

        {/* Coaxial Bokeh Ghosts along the Optical Axis */}
        <div ref={bokehGhostChainRef} className={styles.bokehGhostChain}>
          <div ref={ghost1Ref} className={`${styles.bokehOrb} ${styles.ghost1}`} />
          <div ref={ghost2Ref} className={`${styles.bokehOrb} ${styles.ghost2}`} />
          <div ref={ghost3Ref} className={`${styles.bokehOrb} ${styles.ghost3}`} />
          <div ref={ghost4Ref} className={`${styles.bokehOrb} ${styles.ghost4}`} />
        </div>
      </div>

      {/* ── Layer 3: Controlled Champagne-White Optical Wash (Stage 4) ── */}
      <div ref={champagneWashRef} className={styles.champagneWash} />

      {/* ── Layer 4: Authentic 24 FRAMES Logo Reveal (Stage 5) ── */}
      <div ref={logoRevealWrapRef} className={styles.logoRevealWrap}>
        <picture>
          <source srcSet="/images/logo-light-header.webp" type="image/webp" />
          <img
            src="/images/logo-light.png"
            alt="Phani Gogireddy · 24 FRAMES"
            className={styles.logoImage}
            loading="eager"
          />
        </picture>
        <div ref={logoGlintRef} className={styles.logoGlint}>
          <div className={styles.logoStreak} />
        </div>
      </div>

      {/* ── Layer 5: Emerald & Champagne Silk Fabric billows (Stage 6) ── */}
      <div ref={fabricStageRef} className={styles.fabricStage}>
        <svg
          className={styles.fabricSvg}
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            {/* Deep Emerald Silk Gradient */}
            <linearGradient id="emeraldSilkGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#082c22" />
              <stop offset="35%" stopColor="#0d4637" />
              <stop offset="65%" stopColor="#17634f" />
              <stop offset="85%" stopColor="#093025" />
              <stop offset="100%" stopColor="#041610" />
            </linearGradient>

            <linearGradient id="emeraldSilkHighlight" x1="0%" y1="20%" x2="100%" y2="80%">
              <stop offset="0%" stopColor="rgba(38, 140, 112, 0.1)" />
              <stop offset="50%" stopColor="rgba(48, 168, 134, 0.45)" />
              <stop offset="100%" stopColor="rgba(10, 48, 38, 0.1)" />
            </linearGradient>

            {/* Champagne Gold Ribbon Gradient */}
            <linearGradient id="champagneRibbonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f7e6b5" />
              <stop offset="30%" stopColor="#e5c158" />
              <stop offset="55%" stopColor="#fff2cf" />
              <stop offset="80%" stopColor="#c59b28" />
              <stop offset="100%" stopColor="#7a5a0d" />
            </linearGradient>

            <linearGradient id="champagneGoldSheen" x1="20%" y1="0%" x2="80%" y2="100%">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.7)" />
              <stop offset="50%" stopColor="rgba(235, 198, 110, 0.9)" />
              <stop offset="100%" stopColor="rgba(180, 140, 40, 0.4)" />
            </linearGradient>
          </defs>

          <g ref={fabricGroupRef}>
            {/* Primary Billowing Emerald Silk Fold */}
            <path
              d="M -120 -80 C 180 120, 380 260, 680 320 C 980 380, 1260 280, 1560 410 L 1580 940 L -120 940 Z"
              fill="url(#emeraldSilkGrad1)"
              opacity="0.95"
            />
            {/* Specular Fold Crest for Natural Silk Depth */}
            <path
              d="M -120 40 C 220 210, 480 310, 740 340 C 1020 370, 1280 320, 1560 480"
              stroke="url(#emeraldSilkHighlight)"
              strokeWidth="28"
              fill="none"
              filter="blur(6px)"
            />

            {/* Flowing Champagne-Gold Silk Ribbon (Causally Connected to Glare) */}
            <path
              d="M -90 -60 C 240 160, 460 240, 720 270 C 1010 300, 1240 210, 1540 330 L 1520 420 C 1220 310, 990 410, 700 370 C 440 330, 220 260, -90 50 Z"
              fill="url(#champagneRibbonGrad)"
              opacity="0.92"
            />
            {/* Gold Silk Specular Core Light */}
            <path
              d="M -90 -5 C 230 200, 450 250, 710 285 C 1000 320, 1230 260, 1530 375"
              stroke="url(#champagneGoldSheen)"
              strokeWidth="7"
              fill="none"
              filter="blur(2px)"
            />

            {/* Secondary Undulating Emerald Layer for Fluid South Indian Aesthetic */}
            <path
              d="M -100 240 C 260 380, 520 460, 820 440 C 1120 420, 1340 540, 1560 590 L 1560 920 L -100 920 Z"
              fill="#061d16"
              opacity="0.88"
            />
          </g>
        </svg>
      </div>

      {/* ── Layer 6: Traditional South Indian Mandapam Architecture (Stage 7 & 8) ── */}
      <div ref={mandapamStageRef} className={styles.mandapamStage}>
        <svg
          className={styles.mandapamSvg}
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            {/* Ornate Gold Pillar Gradient */}
            <linearGradient id="goldPillarGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#876618" />
              <stop offset="25%" stopColor="#d4af37" />
              <stop offset="50%" stopColor="#fae7a5" />
              <stop offset="75%" stopColor="#d4af37" />
              <stop offset="100%" stopColor="#684e12" />
            </linearGradient>

            {/* Receding Perspective Colonnade Gold Stroke */}
            <linearGradient id="portalArchGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(212, 175, 55, 0.15)" />
              <stop offset="50%" stopColor="rgba(255, 235, 160, 0.75)" />
              <stop offset="100%" stopColor="rgba(212, 175, 55, 0.15)" />
            </linearGradient>

            {/* Jasmine Mogra Floral Garland Gradient */}
            <linearGradient id="jasmineGarlandGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="40%" stopColor="#fffdfa" />
              <stop offset="70%" stopColor="#f3ede2" />
              <stop offset="100%" stopColor="#d9cebd" />
            </linearGradient>

            {/* Auspicious Marigold Accent Gradient */}
            <linearGradient id="marigoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffb300" />
              <stop offset="100%" stopColor="#e65100" />
            </linearGradient>

            {/* Draped Emerald Canopy Toranam Gradient */}
            <linearGradient id="toranamSilkGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0d4637" />
              <stop offset="50%" stopColor="#082b21" />
              <stop offset="100%" stopColor="#041510" />
            </linearGradient>

            {/* Sacred Namam White Tiruman Gradient */}
            <linearGradient id="namamWhiteGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="60%" stopColor="#fffcf5" />
              <stop offset="100%" stopColor="#ece4d4" />
            </linearGradient>

            {/* Sacred Namam Srichurnam Red Tilak Gradient */}
            <linearGradient id="srichurnamRedGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ff2a3a" />
              <stop offset="50%" stopColor="#d61120" />
              <stop offset="100%" stopColor="#8f000b" />
            </linearGradient>

            {/* Golden Medallion & Pendant Gradient */}
            <linearGradient id="goldMedallionGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fae7a5" />
              <stop offset="50%" stopColor="#d4af37" />
              <stop offset="100%" stopColor="#7a5a0d" />
            </linearGradient>

            {/* Vanishing Point Golden Horizon Bloom */}
            <radialGradient id="portalHorizonLight" cx="50%" cy="54%" r="48%">
              <stop offset="0%" stopColor="rgba(255, 252, 240, 0.95)" />
              <stop offset="25%" stopColor="rgba(245, 220, 140, 0.65)" />
              <stop offset="55%" stopColor="rgba(212, 175, 55, 0.22)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>

          <g ref={mandapamGroupRef}>
            {/* ── Receding Colonnade Perspective Portal (Panel 10 Architecture) ── */}
            <g ref={colonnadePerspectiveRef}>
              {/* Vanishing Point Divine Golden Horizon Light */}
              <circle cx="720" cy="480" r="160" fill="url(#portalHorizonLight)" />

              {/* Converging Floor Reflection Lines */}
              <line x1="270" y1="715" x2="680" y2="480" stroke="rgba(240, 215, 145, 0.28)" strokeWidth="1.5" />
              <line x1="1170" y1="715" x2="760" y2="480" stroke="rgba(240, 215, 145, 0.28)" strokeWidth="1.5" />
              <line x1="450" y1="715" x2="700" y2="480" stroke="rgba(255, 240, 180, 0.20)" strokeWidth="1" />
              <line x1="990" y1="715" x2="740" y2="480" stroke="rgba(255, 240, 180, 0.20)" strokeWidth="1" />
              <line x1="610" y1="715" x2="715" y2="480" stroke="rgba(255, 250, 210, 0.18)" strokeWidth="0.8" />
              <line x1="830" y1="715" x2="725" y2="480" stroke="rgba(255, 250, 210, 0.18)" strokeWidth="0.8" />

              {/* Receding Perspective Arch 3 */}
              <path
                d="M 520 715 L 520 410 C 520 330, 600 295, 720 295 C 840 295, 920 330, 920 410 L 920 715"
                fill="none"
                stroke="url(#portalArchGrad)"
                strokeWidth="2"
              />
              {/* Receding Perspective Arch 2 */}
              <path
                d="M 430 715 L 430 365 C 430 275, 545 235, 720 235 C 895 235, 1010 275, 1010 365 L 1010 715"
                fill="none"
                stroke="url(#portalArchGrad)"
                strokeWidth="2.5"
              />
              {/* Receding Perspective Arch 1 */}
              <path
                d="M 350 715 L 350 335 C 350 230, 495 185, 720 185 C 945 185, 1090 230, 1090 335 L 1090 715"
                fill="none"
                stroke="url(#portalArchGrad)"
                strokeWidth="3"
              />
            </g>

            {/* ── Left Pillar Base & Shaft (South Indian Dravidian Temple Stambha) ── */}
            {/* Plinth / Upapitha */}
            <rect x="170" y="740" width="130" height="45" rx="3" fill="url(#goldPillarGrad)" />
            <rect x="180" y="715" width="110" height="25" rx="2" fill="url(#goldPillarGrad)" />
            {/* Fluted Vertical Shaft */}
            <rect x="200" y="190" width="70" height="525" fill="url(#goldPillarGrad)" />
            <line x1="215" y1="190" x2="215" y2="715" stroke="rgba(255, 248, 220, 0.6)" strokeWidth="2" />
            <line x1="235" y1="190" x2="235" y2="715" stroke="rgba(100, 75, 15, 0.55)" strokeWidth="2.5" />
            <line x1="255" y1="190" x2="255" y2="715" stroke="rgba(255, 248, 220, 0.45)" strokeWidth="2" />
            {/* Lotus Bracket Capital (Potika) */}
            <path d="M 175 190 L 295 190 L 280 155 L 190 155 Z" fill="url(#goldPillarGrad)" />
            <path d="M 160 155 L 310 155 L 290 125 L 180 125 Z" fill="url(#goldPillarGrad)" />

            {/* ── Right Pillar Base & Shaft ── */}
            {/* Plinth */}
            <rect x="1140" y="740" width="130" height="45" rx="3" fill="url(#goldPillarGrad)" />
            <rect x="1150" y="715" width="110" height="25" rx="2" fill="url(#goldPillarGrad)" />
            {/* Shaft */}
            <rect x="1170" y="190" width="70" height="525" fill="url(#goldPillarGrad)" />
            <line x1="1185" y1="190" x2="1185" y2="715" stroke="rgba(255, 248, 220, 0.6)" strokeWidth="2" />
            <line x1="1205" y1="190" x2="1205" y2="715" stroke="rgba(100, 75, 15, 0.55)" strokeWidth="2.5" />
            <line x1="1225" y1="190" x2="1225" y2="715" stroke="rgba(255, 248, 220, 0.45)" strokeWidth="2" />
            {/* Capital */}
            <path d="M 1145 190 L 1265 190 L 1250 155 L 1160 155 Z" fill="url(#goldPillarGrad)" />
            <path d="M 1130 155 L 1280 155 L 1260 125 L 1150 125 Z" fill="url(#goldPillarGrad)" />

            {/* ── Main Arch Lintel Beam (Uttiram) ── */}
            <rect x="150" y="95" width="1140" height="32" rx="3" fill="url(#goldPillarGrad)" />
            <line x1="150" y1="111" x2="1290" y2="111" stroke="rgba(255, 250, 230, 0.7)" strokeWidth="1.5" />

            {/* ── Draped Emerald Silk & Champagne Toranam Valance ── */}
            {/* Left Scalloped Valance Swag */}
            <path
              d="M 170 127 C 320 230, 480 230, 620 130 C 580 180, 520 220, 395 220 C 270 220, 210 180, 170 127 Z"
              fill="url(#toranamSilkGrad)"
              stroke="url(#champagneRibbonGrad)"
              strokeWidth="2"
            />
            {/* Right Scalloped Valance Swag */}
            <path
              d="M 820 130 C 960 230, 1120 230, 1270 127 C 1230 180, 1170 220, 1045 220 C 920 220, 860 180, 820 130 Z"
              fill="url(#toranamSilkGrad)"
              stroke="url(#champagneRibbonGrad)"
              strokeWidth="2"
            />
            {/* Central Majestic Ceremonial Archway Frame */}
            <path
              d="M 270 715 L 270 310 C 270 190, 470 145, 720 145 C 970 145, 1170 190, 1170 310 L 1170 715"
              fill="none"
              stroke="url(#goldPillarGrad)"
              strokeWidth="5"
            />

            {/* ── Jasmine & Marigold Floral Poo Malai (Garlands) ── */}
            {/* Left Pillar Cascading Jasmine Garland */}
            <path
              d="M 190 135 Q 235 240 200 340 Q 240 440 205 540 Q 240 640 210 715"
              fill="none"
              stroke="url(#jasmineGarlandGrad)"
              strokeWidth="16"
              strokeDasharray="4 2"
              strokeLinecap="round"
            />
            <path
              d="M 190 135 Q 235 240 200 340 Q 240 440 205 540 Q 240 640 210 715"
              fill="none"
              stroke="url(#marigoldGrad)"
              strokeWidth="7"
              strokeDasharray="2 12"
              strokeLinecap="round"
            />

            {/* Right Pillar Cascading Jasmine Garland */}
            <path
              d="M 1250 135 Q 1205 240 1240 340 Q 1200 440 1235 540 Q 1200 640 1230 715"
              fill="none"
              stroke="url(#jasmineGarlandGrad)"
              strokeWidth="16"
              strokeDasharray="4 2"
              strokeLinecap="round"
            />
            <path
              d="M 1250 135 Q 1205 240 1240 340 Q 1200 440 1235 540 Q 1200 640 1230 715"
              fill="none"
              stroke="url(#marigoldGrad)"
              strokeWidth="7"
              strokeDasharray="2 12"
              strokeLinecap="round"
            />
          </g>
        </svg>

        {/* ── Layer 7: The Sacred Govinda Namalu Devotional Symbol (Centered at Apex) ── */}
        <div ref={govindaNamaluWrapRef} className={styles.govindaNamaluWrap}>
          {/* Divine Radiant Golden Aura */}
          <div className={styles.namaluHalo} />

          <svg
            className={styles.namaluSvg}
            viewBox="0 0 120 150"
            fill="none"
          >
            {/* Symmetrical Outer White Tiruman (Feet of Sri Venkateswara / Conch) */}
            <path
              d="M 24 15 C 26 35, 36 75, 42 105 C 46 118, 52 126, 60 126 C 68 126, 74 118, 78 105 C 84 75, 94 35, 96 15 C 92 14, 84 14, 82 22 C 78 45, 71 80, 68 98 C 65 106, 63 108, 60 108 C 57 108, 55 106, 52 98 C 49 80, 42 45, 38 22 C 36 14, 28 14, 24 15 Z"
              fill="url(#namamWhiteGrad)"
              stroke="rgba(212, 175, 55, 0.65)"
              strokeWidth="1"
            />

            {/* Central Sacred Red Srichurnam Tilak (Mahalakshmi) */}
            <path
              d="M 57 32 C 57 28, 63 28, 63 32 L 63 118 C 63 121, 57 121, 57 118 Z"
              fill="url(#srichurnamRedGrad)"
            />

            {/* Golden Lotus Base Medallion */}
            <circle cx="60" cy="128" r="7.5" fill="url(#goldMedallionGrad)" stroke="#684e12" strokeWidth="0.8" />
            <circle cx="60" cy="128" r="3.5" fill="#ff2a3a" />

            {/* Auspicious Hanging Temple Pendant */}
            <path d="M 60 136 L 55 145 L 65 145 Z" fill="url(#goldMedallionGrad)" />
            <circle cx="60" cy="147" r="2.5" fill="url(#goldMedallionGrad)" />
          </svg>
        </div>

        {/* ── Layer 8: Storyboard Panel 10 Chapter Typography ── */}
        <div ref={portalChapterMetaRef} className={styles.portalChapterMeta}>
          <h2 className={styles.portalTitle}>The Fabric of Frames</h2>
          <p className={styles.portalSubtitle}>Chapter 02 · Five-Frame Parallax Archive</p>
        </div>
      </div>

      {/* ── Layer 9: Golden Portal Bloom into The Vows (Stage 8) ── */}
      <div ref={portalExitBloomRef} className={styles.portalExitBloom} />
    </div>
  );
}
