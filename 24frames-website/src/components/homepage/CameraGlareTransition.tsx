"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./CameraGlareTransition.module.css";

gsap.registerPlugin(ScrollTrigger);

// ── 8-Blade Aperture Geometry Constants (Matching CinematicTransition) ──
const PIVOT_X = 750;
const PIVOT_Y = 320;
const BLADE_PATH =
  "M 750 320 " +
  "C 460 490, 150 500, -165 415 " +
  "C -190 390, -220 360, -250 320 " +
  "L -1000 2500 " +
  "L 2500 2500 " +
  "L 2500 320 " +
  "Z";

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
}: CameraGlareTransitionProps) {
  // DOM element refs for all transition stages
  const rootRef = useRef<HTMLDivElement>(null);

  // Stage B: Camera Shutter refs
  const shutterLayerRef = useRef<HTMLDivElement>(null);
  const shutterBackdropRef = useRef<HTMLDivElement>(null);
  const guideRingsRef = useRef<SVGSVGElement>(null);
  const bladeActuatorsRef = useRef<SVGGElement[]>([]);

  // Stage C: Optical Glare refs
  const glareRigRef = useRef<HTMLDivElement>(null);
  const glareHotspotRef = useRef<HTMLDivElement>(null);
  const starburstRef = useRef<SVGSVGElement>(null);
  const bokehGhostChainRef = useRef<HTMLDivElement>(null);
  const ghost1Ref = useRef<HTMLDivElement>(null);
  const ghost2Ref = useRef<HTMLDivElement>(null);
  const ghost3Ref = useRef<HTMLDivElement>(null);
  const ghost4Ref = useRef<HTMLDivElement>(null);

  // Stage D: Champagne wash & Logo reveal refs
  const champagneWashRef = useRef<HTMLDivElement>(null);
  const logoRevealWrapRef = useRef<HTMLDivElement>(null);
  const logoGlintRef = useRef<HTMLDivElement>(null);

  // Stages E – G: Photorealistic Master Plates (05 – 10)
  const plate05Ref = useRef<HTMLImageElement>(null);
  const plate06Ref = useRef<HTMLImageElement>(null);
  const plate07Ref = useRef<HTMLImageElement>(null);
  const plate08Ref = useRef<HTMLImageElement>(null);
  const plate09Ref = useRef<HTMLImageElement>(null);
  const plate10Ref = useRef<HTMLImageElement>(null);

  // Sacred Govinda Namalu devotional symbol & Chapter metadata
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
      // Glare animation state tracker
      const glareState = {
        x: 18, // vw percentage
        y: 18, // vh percentage
        scale: 0.85,
        rotation: 0,
      };

      // Set initial element states
      gsap.set(
        [
          shutterLayerRef.current,
          glareRigRef.current,
          champagneWashRef.current,
          logoRevealWrapRef.current,
          plate05Ref.current,
          plate06Ref.current,
          plate07Ref.current,
          plate08Ref.current,
          plate09Ref.current,
          plate10Ref.current,
          govindaNamaluWrapRef.current,
          portalChapterMetaRef.current,
          portalExitBloomRef.current,
        ],
        { opacity: 0 }
      );

      // Shutter initial state: blades fully open at -38deg
      if (bladeActuatorsRef.current.length > 0) {
        gsap.set(bladeActuatorsRef.current, {
          svgOrigin: `${PIVOT_X} ${PIVOT_Y}`,
          rotation: -38,
        });
      }

      // Create the single coordinated master timeline scrubbed by ScrollTrigger
      const masterTl = gsap.timeline({
        paused: true,
        defaults: { ease: "none" },
      });

      /* ═══════════════════════════════════════════════════════════════════
         STAGE A (0.00 – 0.05): HOMEPAGE HERO RESTING STATE
         Hero photograph, typography, and framing remain 100% intact.
         ═══════════════════════════════════════════════════════════════════ */
      masterTl.to({}, { duration: 0.05 }, 0.0);

      /* ═══════════════════════════════════════════════════════════════════
         STAGE B (0.05 – 0.16): CAMERA SHUTTER CLOSES 100% THEN REOPENS
         All 8 blades meet at the center with a complete black seal,
         then reopen completely. Neither photograph nor shutter zooms.
         ═══════════════════════════════════════════════════════════════════ */
      if (shutterLayerRef.current) {
        masterTl.to(shutterLayerRef.current, { opacity: 1, duration: 0.01 }, 0.04);
        masterTl.to(guideRingsRef.current, { opacity: 0.45, duration: 0.03, ease: "power1.out" }, 0.05);

        // Blades close completely to 34deg (meeting at center)
        if (bladeActuatorsRef.current.length > 0) {
          masterTl.fromTo(
            bladeActuatorsRef.current,
            { rotation: -38 },
            { rotation: 34, duration: 0.05, ease: "power2.in" },
            0.05
          );
        }

        // Shutter backdrop seals 100% at full close
        if (shutterBackdropRef.current) {
          masterTl.fromTo(
            shutterBackdropRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 0.02, ease: "power2.in" },
            0.08
          );
        }

        // Brief cinematic hold at 100% seal (0.10)
        masterTl.to({}, { duration: 0.01 }, 0.10);

        // Blades reopen completely from 34deg to -38deg
        if (bladeActuatorsRef.current.length > 0) {
          masterTl.fromTo(
            bladeActuatorsRef.current,
            { rotation: 34 },
            { rotation: -38, duration: 0.05, ease: "power2.out" },
            0.11
          );
        }

        if (shutterBackdropRef.current) {
          masterTl.to(shutterBackdropRef.current, { opacity: 0, duration: 0.03, ease: "power1.out" }, 0.11);
        }
        masterTl.to(guideRingsRef.current, { opacity: 0, duration: 0.03, ease: "power1.out" }, 0.13);
        masterTl.to(shutterLayerRef.current, { opacity: 0, duration: 0.01 }, 0.16);
      }

      /* ═══════════════════════════════════════════════════════════════════
         STAGE C (0.16 – 0.42): CAMERA GLARE APPEARS & TRAVELS ACROSS
         Natural optical lens flare catches upper-left of hero photo,
         then physically traverses diagonally to center-right.
         Hero photo remains intact beneath. Headline dissolves gently.
         ═══════════════════════════════════════════════════════════════════ */
      if (glareRigRef.current && glareHotspotRef.current) {
        masterTl.fromTo(
          glareRigRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.08, ease: "power1.inOut" },
          0.16
        );

        masterTl.fromTo(
          glareState,
          { x: 18, y: 18, scale: 0.85, rotation: 0 },
          {
            x: 52,
            y: 35,
            scale: 1.45,
            rotation: 45,
            duration: 0.24,
            ease: "power1.inOut",
            onUpdate: () => {
              if (glareHotspotRef.current) {
                glareHotspotRef.current.style.left = `${glareState.x}%`;
                glareHotspotRef.current.style.top = `${glareState.y}%`;
                glareHotspotRef.current.style.transform = `translate(-50%, -50%) scale(${glareState.scale})`;
              }
              if (starburstRef.current) {
                starburstRef.current.style.transform = `translate(-50%, -50%) rotate(${glareState.rotation}deg)`;
              }
              if (ghost1Ref.current) {
                ghost1Ref.current.style.left = `${Math.min(92, glareState.x * 1.4)}%`;
                ghost1Ref.current.style.top = `${Math.min(88, glareState.y * 1.45)}%`;
              }
              if (ghost2Ref.current) {
                ghost2Ref.current.style.left = `${Math.min(95, glareState.x * 1.7)}%`;
                ghost2Ref.current.style.top = `${Math.min(92, glareState.y * 1.75)}%`;
              }
              if (ghost3Ref.current) {
                ghost3Ref.current.style.left = `${Math.min(97, glareState.x * 1.9)}%`;
                ghost3Ref.current.style.top = `${Math.min(95, glareState.y * 1.95)}%`;
              }
              if (ghost4Ref.current) {
                ghost4Ref.current.style.left = `${Math.min(99, glareState.x * 2.1)}%`;
                ghost4Ref.current.style.top = `${Math.min(97, glareState.y * 2.15)}%`;
              }
            },
          },
          0.16
        );
      }

      // Hero typography dissolves softly during light transit
      if (headlineRef.current) {
        masterTl.to(headlineRef.current, { opacity: 0, y: -14, duration: 0.08, ease: "power2.out" }, 0.25);
      }
      if (metadataRef.current) {
        masterTl.to(metadataRef.current, { opacity: 0, y: 12, duration: 0.08, ease: "power2.out" }, 0.25);
      }
      if (topBarRef.current) {
        masterTl.to(topBarRef.current, { opacity: 0, duration: 0.08, ease: "power2.out" }, 0.27);
      }

      // Optical depth-of-field soft focus on photograph as glare sweeps across (Panel 03)
      if (heroImageRef.current) {
        masterTl.to(
          heroImageRef.current,
          { filter: "blur(5px)", duration: 0.12, ease: "power1.inOut" },
          0.30
        );
      }

      /* ═══════════════════════════════════════════════════════════════════
         STAGE D (0.40 – 0.64): CHAMPAGNE WASH & 24 FRAMES LOGO REVEAL
         Glare blooms into controlled champagne-white wash.
         Underneath, hero photo dissolves into cosmic bokeh plate (05).
         Wash clears 100%. Authentic 24 FRAMES logo revealed with glint.
         ═══════════════════════════════════════════════════════════════════ */
      if (champagneWashRef.current) {
        masterTl.fromTo(
          champagneWashRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.05, ease: "power2.in" },
          0.40
        );

        // Photo dissolves under wash
        if (heroImageRef.current) {
          masterTl.to(heroImageRef.current, { opacity: 0, duration: 0.04, ease: "power1.out" }, 0.42);
        }

        // Cosmic backdrop plate 05 fades in under wash
        if (plate05Ref.current) {
          masterTl.to(plate05Ref.current, { opacity: 1, duration: 0.06 }, 0.43);
        }

        // Glare rig fades into bloom
        if (glareRigRef.current) {
          masterTl.to(glareRigRef.current, { opacity: 0, duration: 0.04 }, 0.44);
        }

        // Champagne wash clears completely
        masterTl.to(champagneWashRef.current, { opacity: 0, duration: 0.06, ease: "power2.out" }, 0.46);
      }

      // Authentic 24 FRAMES logo emerges
      if (logoRevealWrapRef.current) {
        masterTl.fromTo(
          logoRevealWrapRef.current,
          { opacity: 0, scale: 0.94 },
          { opacity: 1, scale: 1.0, duration: 0.05, ease: "power2.out" },
          0.49
        );

        if (logoGlintRef.current) {
          masterTl.fromTo(
            logoGlintRef.current,
            { opacity: 0, scaleX: 0.6 },
            { opacity: 0.9, scaleX: 1.15, duration: 0.05, ease: "power2.out" },
            0.51
          );
        }

        // Visual pause for perception
        masterTl.to({}, { duration: 0.05 }, 0.55);

        // Logo dissolves gracefully before silk emergence
        masterTl.to(
          logoRevealWrapRef.current,
          { opacity: 0, scale: 1.02, duration: 0.04, ease: "power2.in" },
          0.60
        );
      }

      /* ═══════════════════════════════════════════════════════════════════
         STAGE E (0.62 – 0.86): HIGH-QUALITY SILK TRANSITION (PANELS 06 & 07)
         Master Plate 06 (Fabric Emerges) billows from top-left.
         Master Plate 07 (Fabric Flows Forward) flows forward in 3D perspective.
         Liquid champagne gold ribbon & emerald satin ripples move with depth.
         ═══════════════════════════════════════════════════════════════════ */
      // 1. Plate 06: Fabric Emerges (Causally connected to light from top-left)
      if (plate06Ref.current) {
        masterTl.fromTo(
          plate06Ref.current,
          { opacity: 0, scale: 1.08, xPercent: -3, yPercent: -2 },
          { opacity: 1, scale: 1.0, xPercent: 0, yPercent: 0, duration: 0.07, ease: "power2.out" },
          0.62
        );

        // Cosmic backdrop plate 05 dissolves out
        if (plate05Ref.current) {
          masterTl.to(plate05Ref.current, { opacity: 0, duration: 0.05 }, 0.63);
        }
      }

      // 2. Plate 07: Fabric Flows Forward (billowing ripples & gold satin)
      if (plate07Ref.current) {
        masterTl.fromTo(
          plate07Ref.current,
          { opacity: 0, scale: 0.95, xPercent: 2, yPercent: 2 },
          { opacity: 1, scale: 1.04, xPercent: -1, yPercent: -1, duration: 0.10, ease: "sine.inOut" },
          0.74
        );

        // Plate 06 dissolves seamlessly as Plate 07 takes over
        if (plate06Ref.current) {
          masterTl.to(plate06Ref.current, { opacity: 0, duration: 0.08, ease: "sine.inOut" }, 0.76);
        }
      }

      /* ═══════════════════════════════════════════════════════════════════
         STAGE F (0.84 – 0.96): SOUTH INDIAN MANDAPAM (PANELS 08 & 09)
         Plate 08: Fabric drapes into South Indian mandapam arch with
         carved golden stone pillars and lush white jasmine mogra arrangements.
         Plate 09: Mandapam arch opens, revealing the sacred Govinda Namalu
         symbol centered with radiating golden divine aura!
         ═══════════════════════════════════════════════════════════════════ */
      // 1. Plate 08: Drapes into Mandapam Arch
      if (plate08Ref.current) {
        masterTl.fromTo(
          plate08Ref.current,
          { opacity: 0, scale: 0.96, yPercent: 2 },
          { opacity: 1, scale: 1.0, yPercent: 0, duration: 0.07, ease: "power2.out" },
          0.84
        );

        if (plate07Ref.current) {
          masterTl.to(plate07Ref.current, { opacity: 0, duration: 0.06, ease: "sine.inOut" }, 0.85);
        }
      }

      // 2. Plate 09: Mandapam Arch Opens with Govinda Namalu
      if (plate09Ref.current) {
        masterTl.fromTo(
          plate09Ref.current,
          { opacity: 0, scale: 0.98 },
          { opacity: 1, scale: 1.0, duration: 0.06, ease: "power2.out" },
          0.89
        );

        if (plate08Ref.current) {
          masterTl.to(plate08Ref.current, { opacity: 0, duration: 0.05, ease: "sine.inOut" }, 0.90);
        }
      }

      // Sacred Govinda Namalu Divine Radiance Aura (Centered on arch medallion)
      if (govindaNamaluWrapRef.current) {
        masterTl.fromTo(
          govindaNamaluWrapRef.current,
          { opacity: 0, scale: 0.85 },
          { opacity: 0.9, scale: 1.08, duration: 0.04, ease: "power2.out" },
          0.90
        );
        masterTl.to(
          govindaNamaluWrapRef.current,
          { opacity: 0, duration: 0.04, ease: "power1.out" },
          0.95
        );
      }

      /* ═══════════════════════════════════════════════════════════════════
         STAGE G (0.95 – 1.00): ENTER THE FABRIC OF FRAMES (PANEL 10)
         Perspective colonnade portal corridor reveals horizon light.
         Chapter typography appears: "The Fabric of Frames · Chapter 02"
         Section releases directly into LivingContactSheet (The Vows).
         ═══════════════════════════════════════════════════════════════════ */
      if (plate10Ref.current) {
        masterTl.fromTo(
          plate10Ref.current,
          { opacity: 0, scale: 0.96 },
          { opacity: 1, scale: 1.04, duration: 0.06, ease: "power2.out" },
          0.94
        );

        if (plate09Ref.current) {
          masterTl.to(plate09Ref.current, { opacity: 0, duration: 0.04 }, 0.95);
        }
      }

      if (portalChapterMetaRef.current) {
        masterTl.fromTo(
          portalChapterMetaRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.04, ease: "power2.out" },
          0.96
        );
      }

      if (portalExitBloomRef.current) {
        masterTl.fromTo(
          portalExitBloomRef.current,
          { opacity: 0 },
          { opacity: 0.45, duration: 0.03, ease: "power2.in" },
          0.97
        );
        masterTl.to(portalExitBloomRef.current, { opacity: 0, duration: 0.02 }, 0.99);
      }

      // ── Create ScrollTrigger pinning the Hero container ──────────────
      const isMobile = window.innerWidth < 820;
      const pinDistance = isMobile ? "+=200%" : "+=260%";

      ScrollTrigger.create({
        trigger: heroSectionRef.current,
        start: "top top",
        end: pinDistance,
        pin: true,
        scrub: 0.5,
        onUpdate: (self) => {
          const progress = self.progress;

          // Scrub the coordinated master timeline directly
          masterTl.progress(progress);

          // Fast scroll & reverse scroll boundary safety:
          if (progress <= 0.005) {
            if (shutterLayerRef.current) shutterLayerRef.current.style.opacity = "0";
            if (glareRigRef.current) glareRigRef.current.style.opacity = "0";
            if (champagneWashRef.current) champagneWashRef.current.style.opacity = "0";
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
  }, [heroSectionRef, heroImageRef, headlineRef, metadataRef, topBarRef]);

  return (
    <div ref={rootRef} className={styles.transitionRoot} aria-hidden="true">
      {/* ── STAGE B: Camera Shutter Diaphragm (8 Mechanical Blades) ── */}
      <div ref={shutterLayerRef} className={styles.shutterLayer}>
        <div ref={shutterBackdropRef} className={styles.shutterBackdrop} />

        {/* Concentric Guide Rings */}
        <svg
          ref={guideRingsRef}
          className={styles.guideRingsSvg}
          viewBox="0 0 800 800"
          fill="none"
        >
          <circle cx="400" cy="400" r="160" stroke="rgba(200, 168, 78, 0.4)" strokeDasharray="4 6" />
          <circle cx="400" cy="400" r="260" stroke="rgba(250, 248, 242, 0.25)" strokeWidth="1" />
          <circle cx="400" cy="400" r="360" stroke="rgba(200, 168, 78, 0.25)" strokeWidth="1" />
        </svg>

        {/* 8 Radially-Symmetric Mechanical Blades */}
        <svg
          className={styles.shutterSvg}
          viewBox="-1000 -1000 2000 2000"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <radialGradient id="shutter-blade-grad" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#222222" />
              <stop offset="45%" stopColor="#141414" />
              <stop offset="85%" stopColor="#080808" />
              <stop offset="100%" stopColor="#000000" />
            </radialGradient>
            <linearGradient id="shutter-blade-edge" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.45)" />
              <stop offset="50%" stopColor="rgba(180, 180, 180, 0.25)" />
              <stop offset="100%" stopColor="rgba(40, 40, 40, 0.12)" />
            </linearGradient>
          </defs>

          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <g key={i} transform={`rotate(${i * 45} 0 0)`}>
              <g
                ref={(el) => {
                  if (el) bladeActuatorsRef.current[i] = el;
                }}
                className={styles.bladeActuator}
              >
                <path
                  d={BLADE_PATH}
                  fill="url(#shutter-blade-grad)"
                  stroke="url(#shutter-blade-edge)"
                  strokeWidth="1.8"
                />
              </g>
            </g>
          ))}
        </svg>
      </div>

      {/* ── STAGE C: Moving Optical Camera Glare & Anamorphic Streak ── */}
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

      {/* ── STAGE D: Controlled Champagne-White Optical Bloom Wash ── */}
      <div ref={champagneWashRef} className={styles.champagneWash} />

      {/* ── STAGE E: Authentic 24 FRAMES Logo Reveal ── */}
      <div ref={logoRevealWrapRef} className={styles.logoRevealWrap}>
        <picture>
          <source srcSet="/images/logo-light-header.webp" type="image/webp" />
          <img
            src="/images/logo-light-header.png"
            alt="Phani Gogireddy · 24 FRAMES"
            className={styles.logoImage}
            loading="eager"
          />
        </picture>
        <div ref={logoGlintRef} className={styles.logoGlint}>
          <div className={styles.logoStreak} />
        </div>
      </div>

      {/* ── PHOTOREALISTIC MASTER PLATES (STAGES 5 – 10) ── */}
      <div className={styles.plateContainer}>
        {/* Plate 05: Cosmic Emerald Bokeh Atmosphere */}
        <img
          ref={plate05Ref}
          src="/images/transitions/fabric-parallax/05_logo_reveal.webp"
          alt=""
          className={styles.plateLayer}
          loading="eager"
        />

        {/* Plate 06: Silk Fabric Emergence (Panel 06) */}
        <img
          ref={plate06Ref}
          src="/images/transitions/fabric-parallax/06_fabric_emerge.webp"
          alt=""
          className={styles.plateLayer}
          loading="eager"
        />

        {/* Plate 07: Fabric Flows Forward (Panel 07) */}
        <img
          ref={plate07Ref}
          src="/images/transitions/fabric-parallax/07_fabric_flow.webp"
          alt=""
          className={styles.plateLayer}
          loading="eager"
        />

        {/* Plate 08: Drapes into South Indian Mandapam Arch (Panel 08) */}
        <img
          ref={plate08Ref}
          src="/images/transitions/fabric-parallax/08_mandapam_drape.webp"
          alt=""
          className={styles.plateLayer}
          loading="eager"
        />

        {/* Plate 09: Mandapam Arch Opens with Govinda Namalu (Panel 09) */}
        <img
          ref={plate09Ref}
          src="/images/transitions/fabric-parallax/09_mandapam_open.webp"
          alt=""
          className={styles.plateLayer}
          loading="eager"
        />

        {/* Plate 10: Perspective Colonnade Portal Corridor (Panel 10) */}
        <img
          ref={plate10Ref}
          src="/images/transitions/fabric-parallax/10_colonnade_portal.webp"
          alt=""
          className={styles.plateLayer}
          loading="eager"
        />
      </div>

      {/* ── Sacred Govinda Namalu Divine Radiance Aura (Centered Above Mandapam Arch Medallion) ── */}
      <div ref={govindaNamaluWrapRef} className={styles.namaluHaloWrap} aria-hidden="true">
        <div className={styles.namaluHalo} />
      </div>

      {/* ── STAGE G: Chapter Typography (Panel 10) ── */}
      <div ref={portalChapterMetaRef} className={styles.portalChapterMeta}>
        <h2 className={styles.portalTitle}>The Fabric of Frames</h2>
        <p className={styles.portalSubtitle}>Chapter 02 · Five-Frame Parallax Archive</p>
      </div>

      {/* Exit Golden Bloom into The Vows */}
      <div ref={portalExitBloomRef} className={styles.portalExitBloom} />
    </div>
  );
}
