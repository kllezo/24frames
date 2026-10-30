"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ClothParallaxCanvas, { ClothParallaxHandle } from "./ClothParallaxCanvas";
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

  // Stage D: Logo reveal refs
  const logoRevealWrapRef = useRef<HTMLDivElement>(null);

  // Stages E – G: 3D Procedural WebGL Cloth & Mandapam Portal
  const clothHandleRef = useRef<ClothParallaxHandle>(null);

  // Chapter metadata & Golden portal exit bloom
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
      // Authoritative Glare animation state tracker (Single continuous timeline)
      const glareState = {
        x: 18, // vw percentage
        y: 20, // vh percentage
        scale: 0.85,
        rotation: 0,
        spread: 1.0,
      };

      // Set initial element states
      gsap.set(
        [
          shutterLayerRef.current,
          glareRigRef.current,
          logoRevealWrapRef.current,
          portalChapterMetaRef.current,
          portalExitBloomRef.current,
        ],
        { opacity: 0 }
      );

      // Set local blade angle directly on SVG attributes without root-canvas distortion
      const setShutterBladeAngle = (deg: number) => {
        const transformStr = `rotate(${deg} ${PIVOT_X} ${PIVOT_Y})`;
        for (let i = 0; i < bladeActuatorsRef.current.length; i++) {
          const el = bladeActuatorsRef.current[i];
          if (el) {
            el.setAttribute("transform", transformStr);
          }
        }
      };

      // Shutter initial state: blades fully open at -38deg
      setShutterBladeAngle(-38);

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

        // Blades close completely to 36deg (meeting at center)
        const shutterCloseState = { angle: -38 };
        masterTl.fromTo(
          shutterCloseState,
          { angle: -38 },
          {
            angle: 36,
            duration: 0.05,
            ease: "power2.in",
            onUpdate: () => setShutterBladeAngle(shutterCloseState.angle),
          },
          0.05
        );

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

        // Blades reopen completely from 36deg to -38deg
        const shutterOpenState = { angle: 36 };
        masterTl.fromTo(
          shutterOpenState,
          { angle: 36 },
          {
            angle: -38,
            duration: 0.05,
            ease: "power2.out",
            onUpdate: () => setShutterBladeAngle(shutterOpenState.angle),
          },
          0.11
        );

        if (shutterBackdropRef.current) {
          masterTl.to(shutterBackdropRef.current, { opacity: 0, duration: 0.03, ease: "power1.out" }, 0.11);
        }
        masterTl.to(shutterLayerRef.current, { opacity: 0, duration: 0.01 }, 0.16);
      }

      /* ═══════════════════════════════════════════════════════════════════
         STAGE C & D (0.16 – 0.65): CONTINUOUS CAMERA GLARE → 24 FRAMES LOGO
         Single authoritative glare state. Continuous interpolation.
         Zero restarts, zero independent logo glints, pure physical continuity.
         ═══════════════════════════════════════════════════════════════════ */
      if (glareRigRef.current && glareHotspotRef.current) {
        // 1. Initial Glare Approach (0.16 – 0.44):
        // Starts at left (18%, 20%), glides smoothly toward center (50%, 50%).
        // Horizontal spread tightens (1.0 -> 0.35), scale concentrates (0.85 -> 0.48).
        masterTl.fromTo(
          glareRigRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.08, ease: "power1.inOut" },
          0.16
        );

        masterTl.fromTo(
          glareState,
          { x: 18, y: 20, scale: 0.85, rotation: 0, spread: 1.0 },
          {
            x: 50,
            y: 50,
            scale: 0.48,
            rotation: 24,
            spread: 0.35,
            duration: 0.28,
            ease: "power1.inOut",
            onUpdate: () => {
              if (glareHotspotRef.current) {
                glareHotspotRef.current.style.left = `${glareState.x}%`;
                glareHotspotRef.current.style.top = `${glareState.y}%`;
                glareHotspotRef.current.style.transform = `translate(-50%, -50%) scale(${glareState.scale})`;
                glareHotspotRef.current.style.setProperty("--glare-spread", glareState.spread.toString());
              }
              if (starburstRef.current) {
                starburstRef.current.style.transform = `translate(-50%, -50%) rotate(${glareState.rotation}deg)`;
              }
              if (ghost1Ref.current) {
                ghost1Ref.current.style.left = `${Math.min(92, glareState.x * 1.35)}%`;
                ghost1Ref.current.style.top = `${Math.min(88, glareState.y * 1.35)}%`;
              }
              if (ghost2Ref.current) {
                ghost2Ref.current.style.left = `${Math.min(95, glareState.x * 1.6)}%`;
                ghost2Ref.current.style.top = `${Math.min(92, glareState.y * 1.6)}%`;
              }
              if (ghost3Ref.current) {
                ghost3Ref.current.style.left = `${Math.min(97, glareState.x * 1.8)}%`;
                ghost3Ref.current.style.top = `${Math.min(95, glareState.y * 1.8)}%`;
              }
              if (ghost4Ref.current) {
                ghost4Ref.current.style.left = `${Math.min(99, glareState.x * 1.95)}%`;
                ghost4Ref.current.style.top = `${Math.min(97, glareState.y * 1.95)}%`;
              }
            },
          },
          0.16
        );
      }

      // Hero typography dissolves softly during light transit
      if (headlineRef.current) {
        masterTl.to(headlineRef.current, { opacity: 0, y: -14, duration: 0.08, ease: "power2.out" }, 0.24);
      }
      if (metadataRef.current) {
        masterTl.to(metadataRef.current, { opacity: 0, y: 12, duration: 0.08, ease: "power2.out" }, 0.24);
      }
      if (topBarRef.current) {
        masterTl.to(topBarRef.current, { opacity: 0, duration: 0.08, ease: "power2.out" }, 0.26);
      }

      // Optical depth-of-field soft focus & dissolve on hero photograph beneath the light
      if (heroImageRef.current) {
        masterTl.to(
          heroImageRef.current,
          { filter: "blur(6px)", duration: 0.10, ease: "power1.inOut" },
          0.28
        );
        masterTl.to(
          heroImageRef.current,
          { opacity: 0, duration: 0.08, ease: "power1.out" },
          0.36
        );
      }

      // 2. Glare reaches center (0.44): Authentic 24 FRAMES logo reveals directly through the light
      if (logoRevealWrapRef.current) {
        masterTl.fromTo(
          logoRevealWrapRef.current,
          { opacity: 0, scale: 0.95 },
          { opacity: 1, scale: 1.0, duration: 0.08, ease: "power2.out" },
          0.44
        );
      }

      // 3. The SAME glare continues moving across the logo, expanding and softening (0.44 – 0.58)
      if (glareRigRef.current && glareHotspotRef.current) {
        masterTl.to(
          glareState,
          {
            x: 53,
            y: 50,
            scale: 1.35,
            spread: 1.45,
            rotation: 45,
            duration: 0.12,
            ease: "power1.out",
            onUpdate: () => {
              if (glareHotspotRef.current) {
                glareHotspotRef.current.style.left = `${glareState.x}%`;
                glareHotspotRef.current.style.top = `${glareState.y}%`;
                glareHotspotRef.current.style.transform = `translate(-50%, -50%) scale(${glareState.scale})`;
                glareHotspotRef.current.style.setProperty("--glare-spread", glareState.spread.toString());
              }
              if (starburstRef.current) {
                starburstRef.current.style.transform = `translate(-50%, -50%) rotate(${glareState.rotation}deg)`;
              }
            },
          },
          0.44
        );

        // Glare softens and fades out naturally as the logo settles (0.54 – 0.60)
        masterTl.to(
          glareRigRef.current,
          { opacity: 0, duration: 0.06, ease: "power1.in" },
          0.54
        );
      }

      // 4. Authentic 24 FRAMES logo holds for a clear cinematic beat (0.56 – 0.63)
      masterTl.to({}, { duration: 0.07 }, 0.56);

      // 5. Logo dissolves gracefully as silk fabric emerges (0.63 – 0.67)
      if (logoRevealWrapRef.current) {
        masterTl.to(
          logoRevealWrapRef.current,
          { opacity: 0, scale: 1.02, duration: 0.04, ease: "power2.in" },
          0.63
        );
      }

      /* ═══════════════════════════════════════════════════════════════════
         STAGE E, F, G (0.58 – 1.00): 3D PROCEDURAL WEBGL CLOTH & MANDAPAM
         Real-time deforming emerald satin & champagne gold silk surface.
         Folds, billowing, catenary mandapam drape, stone columns,
         mogra garlands, sacred Govinda Namalu, and perspective colonnade portal.
         ═══════════════════════════════════════════════════════════════════ */
      const clothState = { progress: 0 };

      // Fade in WebGL canvas as the logo pauses and begins its gentle exit
      masterTl.call(() => {
        clothHandleRef.current?.setActive(true);
      }, undefined, 0.58);

      // Smoothly drive the 3D WebGL cloth simulation from 0.0 to 1.0
      masterTl.fromTo(
        clothState,
        { progress: 0 },
        {
          progress: 1.0,
          duration: 0.40,
          ease: "none",
          onUpdate: () => {
            clothHandleRef.current?.setProgress(clothState.progress);
          },
        },
        0.58
      );

      // Chapter metadata typography (Panel 10)
      if (portalChapterMetaRef.current) {
        masterTl.fromTo(
          portalChapterMetaRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.05, ease: "power2.out" },
          0.94
        );
      }

      // Golden horizon dawn bloom at colonnade vanishing point
      if (portalExitBloomRef.current) {
        masterTl.fromTo(
          portalExitBloomRef.current,
          { opacity: 0 },
          { opacity: 0.45, duration: 0.03, ease: "power2.in" },
          0.96
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
            clothHandleRef.current?.setProgress(0);
            clothHandleRef.current?.setActive(false);
            if (shutterLayerRef.current) shutterLayerRef.current.style.opacity = "0";
            if (glareRigRef.current) glareRigRef.current.style.opacity = "0";
            if (logoRevealWrapRef.current) logoRevealWrapRef.current.style.opacity = "0";
            if (portalChapterMetaRef.current) portalChapterMetaRef.current.style.opacity = "0";
            if (portalExitBloomRef.current) portalExitBloomRef.current.style.opacity = "0";

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
                transform={`rotate(-38 ${PIVOT_X} ${PIVOT_Y})`}
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

      {/* ── STAGE D: Authentic 24 FRAMES Logo Reveal (Illuminated by Continuous Glare) ── */}
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
      </div>

      {/* ── STAGE E, F, G: 3D Procedural WebGL Silk Cloth & Mandapam Portal ── */}
      <ClothParallaxCanvas ref={clothHandleRef} />

      {/* ── STAGE G: The Vows Typography Emergence (Resolving into Chapter 02) ── */}
      <div ref={portalChapterMetaRef} className={styles.portalChapterMeta}>
        <span className={styles.portalChapterKicker}>CHAPTER 02 · ARCHIVAL ANTHOLOGY</span>
        <h2 className={styles.portalTitle}>The Vows</h2>
        <p className={styles.portalSubtitle}>Curated Exhibition & Wedding Stories Archive</p>
      </div>

      {/* Exit Golden Bloom into The Vows */}
      <div ref={portalExitBloomRef} className={styles.portalExitBloom} />
    </div>
  );
}
