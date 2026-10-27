"use client";

import {
  useEffect,
  useRef,
  useCallback,
  useSyncExternalStore,
} from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import styles from "./CinematicTransition.module.css";

// ── Accessibility Helper: Reduced Motion ────────────────────────────────
function subscribeReducedMotion(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

// ── 8-Blade Aperture Geometry Constants ─────────────────────────────────
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

export default function CinematicTransition() {
  const router = useRouter();

  const isReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  // Animation DOM refs
  const overlayRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const vignetteRef = useRef<HTMLDivElement>(null);
  const cornersRef = useRef<HTMLDivElement>(null);
  const focusRingRef = useRef<HTMLDivElement>(null);
  const guideRingsRef = useRef<SVGSVGElement>(null);
  const bladeActuatorsRef = useRef<SVGGElement[]>([]);

  // Safety & timeline control refs
  const isTransitioningRef = useRef(false);
  const masterTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const safetyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clear safety watchdog timeout
  const clearSafetyTimeout = useCallback(() => {
    if (safetyTimeoutRef.current) {
      clearTimeout(safetyTimeoutRef.current);
      safetyTimeoutRef.current = null;
    }
  }, []);

  // Force reset transition overlay and restore interaction
  const forceReset = useCallback(() => {
    clearSafetyTimeout();
    if (masterTimelineRef.current) {
      masterTimelineRef.current.kill();
      masterTimelineRef.current = null;
    }
    isTransitioningRef.current = false;

    if (overlayRef.current) {
      overlayRef.current.classList.remove(styles.overlayRootActive);
      gsap.set(overlayRef.current, {
        opacity: 0,
        visibility: "hidden",
        pointerEvents: "none",
      });
    }

    if (backdropRef.current) {
      gsap.set(backdropRef.current, { opacity: 0 });
    }

    if (bladeActuatorsRef.current.length > 0) {
      gsap.set(bladeActuatorsRef.current, {
        svgOrigin: `${PIVOT_X} ${PIVOT_Y}`,
        rotation: -38,
      });
    }
  }, [clearSafetyTimeout]);

  // Execute the animated camera shutter transition
  const triggerTransition = useCallback(
    (targetUrl: string, targetHash: string) => {
      // Prevent duplicate transitions during rapid repeated clicks
      if (isTransitioningRef.current) return;
      isTransitioningRef.current = true;

      if (overlayRef.current) {
        overlayRef.current.classList.add(styles.overlayRootActive);
      }

      // Safety watchdog fallback (2.4s limit)
      clearSafetyTimeout();
      safetyTimeoutRef.current = setTimeout(() => {
        forceReset();
      }, 2400);

      // ── ACCESSIBILITY: REDUCED MOTION FADE ──
      if (isReducedMotion) {
        const reducedTl = gsap.timeline({
          onComplete: () => {
            forceReset();
          },
        });
        masterTimelineRef.current = reducedTl;

        reducedTl.set(overlayRef.current, { visibility: "visible", pointerEvents: "auto" });
        reducedTl.to(overlayRef.current, {
          opacity: 1,
          duration: 0.12,
          ease: "power1.inOut",
        });
        reducedTl.call(() => {
          router.push(targetUrl);
          if (typeof window !== "undefined" && (window as unknown as { __lenis?: { scrollTo: (t: unknown, opt?: unknown) => void } }).__lenis) {
            const l = (window as unknown as { __lenis: { scrollTo: (t: unknown, opt?: unknown) => void } }).__lenis;
            if (targetHash && targetHash.length > 1) {
              l.scrollTo(targetHash, { offset: -80, immediate: true });
            } else {
              l.scrollTo(0, { immediate: true });
            }
          } else if (targetHash && targetHash.length > 1) {
            const el = document.querySelector(targetHash);
            if (el) el.scrollIntoView({ behavior: "smooth" });
          } else {
            window.scrollTo({ top: 0, left: 0, behavior: "instant" });
          }
        }, undefined, 0.12);
        reducedTl.to(overlayRef.current, {
          opacity: 0,
          duration: 0.12,
          ease: "power1.inOut",
        }, 0.16);
        return;
      }

      // ── FULL MECHANICAL CAMERA SHUTTER (30-FRAME GSAP MASTER TIMELINE) ──
      if (masterTimelineRef.current) {
        masterTimelineRef.current.kill();
      }

      const tl = gsap.timeline({
        onComplete: () => {
          forceReset();
        },
      });
      masterTimelineRef.current = tl;

      // Pre-set initial states at 0.00s (Frame 01: Activation)
      tl.set(overlayRef.current, { opacity: 1, visibility: "visible", pointerEvents: "auto" }, 0.00);
      tl.set(backdropRef.current, { opacity: 0 }, 0.00);
      tl.set(vignetteRef.current, { opacity: 0 }, 0.00);
      tl.set(cornersRef.current, { opacity: 0 }, 0.00);
      tl.set(focusRingRef.current, { opacity: 0, scale: 1.25 }, 0.00);
      tl.set(guideRingsRef.current, { opacity: 0 }, 0.00);

      // Initialize all 8 blades to retracted position (-38 deg)
      if (bladeActuatorsRef.current.length > 0) {
        tl.set(bladeActuatorsRef.current, {
          svgOrigin: `${PIVOT_X} ${PIVOT_Y}`,
          rotation: -38,
        }, 0.00);
      }

      // ── ACT I: NAVIGATION AND FOCUS (0.00s - 0.20s) ──
      // Frame 02 (0.04s): Subtle darkening vignette begins
      tl.to(vignetteRef.current, {
        opacity: 1,
        duration: 0.04,
        ease: "power1.out",
      }, 0.04);

      // Frame 03 (0.08s): Viewfinder corners fade in
      tl.to(cornersRef.current, {
        opacity: 1,
        duration: 0.04,
        ease: "power1.out",
      }, 0.08);

      // Frame 04 (0.12s): Central focus reticle circle appears
      tl.to(focusRingRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.04,
        ease: "power2.out",
      }, 0.12);

      // Frame 05 (0.16s): Shutter concentric guide rings form around focus circle
      tl.to(guideRingsRef.current, {
        opacity: 0.65,
        duration: 0.04,
        ease: "power1.out",
      }, 0.16);

      // ── ACT II: SHUTTER CLOSING (0.20s - 0.52s) ──
      // Frames 06 - 14: 8 camera aperture blades rotate inward into full closure
      // Interpolates through 70% (0.24s), 55% (0.28s), 35% (0.32s), 20% (0.36s), 10% (0.40s), 5% (0.44s), 2% (0.48s), 0% (0.52s)
      if (bladeActuatorsRef.current.length > 0) {
        tl.to(bladeActuatorsRef.current, {
          rotation: 32,
          duration: 0.32,
          ease: "power2.inOut",
        }, 0.20);
      }

      // Backdrop smoothly transitions to opaque as blades meet, sealing the screen in darkness
      tl.to(backdropRef.current, {
        opacity: 1,
        duration: 0.24,
        ease: "power2.in",
      }, 0.28);

      // Frame 14 (0.52s): Complete shutter lock with zero light leak

      // ── ACT III: ROUTE CHANGE IN DARKNESS (0.52s - 0.68s) ──
      // Frame 15 (0.56s): Commit route swap while screen is completely covered in darkness
      tl.call(() => {
        router.push(targetUrl);

        // Scroll management underneath closed shutter (coordinate with Lenis if active)
        if (typeof window !== "undefined" && (window as unknown as { __lenis?: { scrollTo: (t: unknown, opt?: unknown) => void } }).__lenis) {
          const l = (window as unknown as { __lenis: { scrollTo: (t: unknown, opt?: unknown) => void } }).__lenis;
          if (targetHash && targetHash.length > 1) {
            l.scrollTo(targetHash, { offset: -80, immediate: true });
          } else {
            l.scrollTo(0, { immediate: true });
          }
        } else if (targetHash && targetHash.length > 1) {
          const el = document.querySelector(targetHash);
          if (el) el.scrollIntoView({ behavior: "smooth" });
        } else {
          window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        }
      }, undefined, 0.56);

      // Frame 16 (0.60s) & Frame 17 (0.64s): Brief hold at full close

      // ── ACT IV: SHUTTER OPENING (0.68s - 1.00s) ──
      // Frames 18 - 26: Blades rotate outward in reverse, revealing the real destination page
      // Interpolates through 5% (0.72s), 10% (0.76s), 20% (0.80s), 35% (0.84s), 55% (0.88s), 70% (0.92s), 85% (0.96s), 100% (1.00s)
      if (bladeActuatorsRef.current.length > 0) {
        tl.to(bladeActuatorsRef.current, {
          rotation: -38,
          duration: 0.32,
          ease: "power2.inOut",
        }, 0.68);
      }

      // Backdrop fades to reveal new page content cleanly through expanding iris
      tl.to(backdropRef.current, {
        opacity: 0,
        duration: 0.24,
        ease: "power2.out",
      }, 0.68);

      // ── ACT V: SETTLE AND RELEASE (1.00s - 1.20s) ──
      // Frame 27 (1.04s): HUD marks, focus circle, and guide rings fade out cleanly
      tl.to([cornersRef.current, focusRingRef.current, guideRingsRef.current, vignetteRef.current], {
        opacity: 0,
        duration: 0.04,
        ease: "power1.out",
      }, 1.00);

      // Frame 28 & 29 (1.08s - 1.14s): Settle and release overlay
      tl.to(overlayRef.current, {
        opacity: 0,
        duration: 0.08,
        ease: "power1.out",
      }, 1.08);

      // Frame 30 (1.20s): Complete settlement handled by tl.onComplete
    },
    [isReducedMotion, router, clearSafetyTimeout, forceReset]
  );

  // Global click interceptor for eligible internal links
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleClick = (e: MouseEvent) => {
      // Regular left clicks only, ignore modifier keys
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return;
      }

      const target = e.target as HTMLElement | null;
      const anchor = target?.closest("a") as HTMLAnchorElement | null;
      if (!anchor) return;

      // Exclude external links, downloads, and new tabs
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;
      if (anchor.getAttribute("rel")?.includes("external")) return;

      const href = anchor.getAttribute("href");
      if (!href) return;
      if (
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("javascript:")
      ) {
        return;
      }

      let url: URL;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }

      // Exclude different origins
      if (url.origin !== window.location.origin) return;

      // In-page scroll on the same page (e.g. clicking /#vows while already at /)
      const currentUrl = new URL(window.location.href);
      if (
        url.pathname === currentUrl.pathname &&
        url.search === currentUrl.search &&
        url.hash
      ) {
        return;
      }

      // Identical path and hash
      if (
        url.pathname === currentUrl.pathname &&
        url.search === currentUrl.search &&
        url.hash === currentUrl.hash
      ) {
        return;
      }

      e.preventDefault();
      triggerTransition(
        url.pathname + url.search + url.hash,
        url.hash
      );
    };

    document.addEventListener("click", handleClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleClick, { capture: true });
    };
  }, [triggerTransition]);

  // Handle programmatic navigation custom events (24f-navigate)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleCustomNav = (e: Event) => {
      const customEvent = e as CustomEvent<{
        url: string;
      }>;
      if (customEvent.detail?.url) {
        triggerTransition(
          customEvent.detail.url,
          ""
        );
      }
    };

    window.addEventListener("24f-navigate", handleCustomNav);
    return () => window.removeEventListener("24f-navigate", handleCustomNav);
  }, [triggerTransition]);

  // Support browser Back and Forward navigation cleanly
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handlePopState = () => {
      if (isTransitioningRef.current) {
        forceReset();
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [forceReset]);

  // Unmount cleanup
  useEffect(() => {
    return () => {
      clearSafetyTimeout();
      if (masterTimelineRef.current) {
        masterTimelineRef.current.kill();
      }
    };
  }, [clearSafetyTimeout]);

  return (
    <div
      ref={overlayRef}
      className={styles.overlayRoot}
      role="status"
      aria-live="polite"
      aria-label="Navigating to new frame"
    >
      {/* ── Accessible Reduced-Motion Fallback ── */}
      {isReducedMotion ? (
        <div className={styles.reducedMotionOverlay} />
      ) : (
        <>
          {/* ── Solid Near-Black Optical Shutter Backdrop ── */}
          <div ref={backdropRef} className={styles.shutterBackdrop} />

          {/* ── Radial Optical Vignette ── */}
          <div ref={vignetteRef} className={styles.vignetteOverlay} />

          {/* ── Viewfinder HUD Corner Brackets [   ] ── */}
          <div ref={cornersRef} className={styles.hudCorners} aria-hidden="true">
            <div className={`${styles.cornerBracket} ${styles.cornerTL}`} />
            <div className={`${styles.cornerBracket} ${styles.cornerTR}`} />
            <div className={`${styles.cornerBracket} ${styles.cornerBL}`} />
            <div className={`${styles.cornerBracket} ${styles.cornerBR}`} />
          </div>

          {/* ── Central Autofocus Reticle Ring ── */}
          <div ref={focusRingRef} className={styles.focusReticleRing} aria-hidden="true" />

          {/* ── Concentric Shutter Mechanism Guide Rings ── */}
          <svg
            ref={guideRingsRef}
            className={styles.guideRingsSvg}
            width="800"
            height="800"
            viewBox="0 0 800 800"
            aria-hidden="true"
          >
            <circle
              cx="400"
              cy="400"
              r="160"
              fill="none"
              stroke="rgba(200, 168, 78, 0.4)"
              strokeDasharray="4 6"
            />
            <circle
              cx="400"
              cy="400"
              r="260"
              fill="none"
              stroke="rgba(250, 248, 242, 0.25)"
              strokeWidth="1"
            />
            <circle
              cx="400"
              cy="400"
              r="360"
              fill="none"
              stroke="rgba(200, 168, 78, 0.25)"
              strokeWidth="1"
            />
          </svg>

          {/* ── 8-Blade Mechanical Camera Aperture Shutter Diaphragm ── */}
          <svg
            className={styles.shutterSvg}
            viewBox="-1000 -1000 2000 2000"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
          >
            <defs>
              <radialGradient id="shutter-blade-grad" cx="30%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#222222" />
                <stop offset="45%" stopColor="#141414" />
                <stop offset="85%" stopColor="#080808" />
                <stop offset="100%" stopColor="#000000" />
              </radialGradient>
              <linearGradient
                id="shutter-blade-edge"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="rgba(255, 255, 255, 0.45)" />
                <stop offset="50%" stopColor="rgba(180, 180, 180, 0.25)" />
                <stop offset="100%" stopColor="rgba(40, 40, 40, 0.12)" />
              </linearGradient>
              <filter
                id="shutter-blade-shadow"
                x="-30%"
                y="-30%"
                width="160%"
                height="160%"
              >
                <feDropShadow
                  dx="-4"
                  dy="6"
                  stdDeviation="7"
                  floodColor="#000000"
                  floodOpacity="0.95"
                />
              </filter>
            </defs>

            {/* 8 Radially-Symmetric Mechanical Blades */}
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
                    filter="url(#shutter-blade-shadow)"
                  />
                </g>
              </g>
            ))}
          </svg>
        </>
      )}
    </div>
  );
}

export { CinematicTransition as CameraShutterTransition };
