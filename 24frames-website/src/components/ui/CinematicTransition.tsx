"use client";

import {
  useEffect,
  useRef,
  useCallback,
  useSyncExternalStore,
  startTransition,
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
  const ringTimelineRef = useRef<gsap.core.Tween | null>(null);
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
    if (ringTimelineRef.current) {
      ringTimelineRef.current.kill();
      ringTimelineRef.current = null;
    }
    isTransitioningRef.current = false;

    if (overlayRef.current) {
      overlayRef.current.classList.remove(styles.overlayRootActive);
      gsap.set(overlayRef.current, {
        opacity: 0,
        visibility: "hidden",
        pointerEvents: "none",
        clearProps: "all",
      });
      overlayRef.current.style.display = "none";
    }

    if (backdropRef.current) {
      gsap.set(backdropRef.current, { opacity: 0, clearProps: "all" });
    }

    if (vignetteRef.current) {
      gsap.set(vignetteRef.current, { opacity: 0, clearProps: "all" });
    }

    if (cornersRef.current) {
      gsap.set(cornersRef.current, { opacity: 0, clearProps: "all" });
    }

    if (guideRingsRef.current) {
      gsap.set(guideRingsRef.current, { opacity: 0, clearProps: "all" });
    }

    if (focusRingRef.current) {
      gsap.set(focusRingRef.current, {
        x: 0,
        y: 0,
        opacity: 0,
        scale: 1,
        clearProps: "all",
      });
    }

    if (bladeActuatorsRef.current.length > 0) {
      gsap.set(bladeActuatorsRef.current, {
        svgOrigin: `${PIVOT_X} ${PIVOT_Y}`,
        rotation: -38,
      });
    }
  }, [clearSafetyTimeout]);

  // Compute destination target focal point coordinates
  const computeTargetFocalPoint = useCallback((targetUrl: string, targetHash: string) => {
    const winW = typeof window !== "undefined" ? window.innerWidth : 1200;
    const winH = typeof window !== "undefined" ? window.innerHeight : 800;
    const isMobile = winW <= 820;

    let targetEl: HTMLElement | null = null;
    const cleanUrl = targetUrl.split("?")[0].replace(/\/$/, "");

    if (targetHash && targetHash.length > 1) {
      targetEl = document.querySelector(targetHash) as HTMLElement | null;
    }

    if (!targetEl) {
      if (cleanUrl === "" || cleanUrl === "/") {
        targetEl = document.querySelector("#hero img, .heroImage, #hero") as HTMLElement | null;
      } else if (cleanUrl.includes("vows")) {
        targetEl = document.querySelector("#vows, #the-vows, [aria-label*='Vows']") as HTMLElement | null;
      } else if (cleanUrl.includes("collection")) {
        targetEl = document.querySelector("#collection [data-discipline-id='weddings'], #collection .card:first-child, #collection") as HTMLElement | null;
      } else if (cleanUrl.includes("artist")) {
        targetEl = document.querySelector("#artist img, #founder-recognition img, [aria-label*='Artist']") as HTMLElement | null;
      } else if (cleanUrl.includes("stories") && !cleanUrl.startsWith("/stories/")) {
        targetEl = document.querySelector("#stories a[href*='sirish-and-harshitha'], #stories article:first-child, #stories") as HTMLElement | null;
      } else if (cleanUrl.startsWith("/stories/")) {
        targetEl = document.querySelector("[class*='heroImageFrame'] img, img[class*='heroImage'], [class*='heroSection'] img") as HTMLElement | null;
      } else if (cleanUrl.startsWith("/disciplines/")) {
        targetEl = document.querySelector("[class*='heroSection'] img, [class*='heroImage']") as HTMLElement | null;
      } else if (cleanUrl.includes("inquire")) {
        targetEl = document.querySelector("#commission-form h1, h1, form") as HTMLElement | null;
      } else if (cleanUrl.includes("client-gallery")) {
        targetEl = document.querySelector("#client-gallery, [class*='cardsShowcaseWrapper']") as HTMLElement | null;
      }
    }

    if (targetEl) {
      const rect = targetEl.getBoundingClientRect();
      if (rect.width > 20 && rect.height > 20) {
        const focalYRatio = cleanUrl.includes("artist") || cleanUrl.startsWith("/stories/") ? 0.3 : 0.42;
        const targetScreenX = rect.left + rect.width * 0.5;
        const targetScreenY = Math.max(80, Math.min(winH - 80, rect.top + rect.height * focalYRatio));
        const size = Math.max(90, Math.min(170, isMobile ? rect.width * 0.45 : rect.width * 0.35));

        return {
          x: targetScreenX - winW / 2,
          y: targetScreenY - winH / 2,
          width: size,
          height: size,
        };
      }
    }

    // Calibrated responsive fallback coordinates
    let defaultXRatio = 0;
    let defaultYRatio = -0.06;

    if (cleanUrl.includes("artist")) {
      defaultXRatio = isMobile ? 0 : 0.16;
      defaultYRatio = -0.14;
    } else if (cleanUrl.includes("collection")) {
      defaultXRatio = isMobile ? 0 : -0.25;
      defaultYRatio = 0.04;
    } else if (cleanUrl.startsWith("/stories/")) {
      defaultXRatio = isMobile ? 0 : -0.22;
      defaultYRatio = -0.08;
    } else if (cleanUrl.includes("inquire")) {
      defaultXRatio = 0;
      defaultYRatio = -0.16;
    } else if (cleanUrl.includes("vows")) {
      defaultXRatio = 0;
      defaultYRatio = -0.08;
    }

    return {
      x: defaultXRatio * winW,
      y: defaultYRatio * winH,
      width: isMobile ? 110 : 140,
      height: isMobile ? 110 : 140,
    };
  }, []);

  // Execute the camera shutter transition with gold focus ring traveling to destination
  const triggerTransition = useCallback(
    (targetUrl: string, targetHash: string, _customImage?: string) => {
      void _customImage;
      // Prevent duplicate transitions during rapid repeated clicks
      if (isTransitioningRef.current) return;
      isTransitioningRef.current = true;

      // Immediately initiate destination prefetch
      try {
        router.prefetch(targetUrl);
      } catch {
        // prefetch fallback
      }

      if (overlayRef.current) {
        overlayRef.current.style.display = "block";
        overlayRef.current.classList.add(styles.overlayRootActive);
      }

      // Safety watchdog fallback (2.8s limit)
      clearSafetyTimeout();
      safetyTimeoutRef.current = setTimeout(() => {
        forceReset();
      }, 2800);

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

      // ── PHASE 1 & 2: SHUTTER CLOSES, SWAPS ROUTE, RE-OPENS TO DESTINATION ──
      if (masterTimelineRef.current) {
        masterTimelineRef.current.kill();
      }

      const DURATION_CLOSE = 0.32;
      const DURATION_OPEN = 0.32;

      const tl = gsap.timeline();
      masterTimelineRef.current = tl;

      // 1. Initial State: Centered Shutter & Centered Gold Focus Ring (Time 0.00s)
      tl.set(overlayRef.current, { opacity: 1, visibility: "visible", pointerEvents: "auto" }, 0.00);
      tl.set(backdropRef.current, { opacity: 0 }, 0.00);
      tl.set([vignetteRef.current, cornersRef.current, guideRingsRef.current], { opacity: 0 }, 0.00);

      if (focusRingRef.current) {
        tl.set(focusRingRef.current, {
          x: 0,
          y: 0,
          width: 130,
          height: 130,
          opacity: 0,
          scale: 1.15,
        }, 0.00);
      }

      if (bladeActuatorsRef.current.length > 0) {
        tl.set(bladeActuatorsRef.current, {
          svgOrigin: `${PIVOT_X} ${PIVOT_Y}`,
          rotation: -38,
        }, 0.00);
      }

      // 2. Optical Ambient & HUD Fade
      tl.to([vignetteRef.current, cornersRef.current], {
        opacity: 0.9,
        duration: 0.14,
        ease: "power1.out",
      }, 0.00);

      tl.to(focusRingRef.current, {
        opacity: 0.95,
        scale: 1,
        duration: 0.16,
        ease: "power2.out",
      }, 0.00);

      tl.to(guideRingsRef.current, {
        opacity: 0.45,
        duration: 0.18,
        ease: "power1.out",
      }, 0.00);

      // 3. Shutter Closes Centered (0.00s – 0.32s)
      if (bladeActuatorsRef.current.length > 0) {
        tl.to(bladeActuatorsRef.current, {
          rotation: 34,
          duration: DURATION_CLOSE,
          ease: "power2.in",
        }, 0.00);
      }

      tl.to(backdropRef.current, {
        opacity: 1,
        duration: DURATION_CLOSE * 0.65,
        ease: "power2.in",
      }, DURATION_CLOSE * 0.35);

      // 4. ROUTE SWAP AT FULL SHUTTER SEAL (At exactly 0.32s, zero pause)
      tl.call(() => {
        startTransition(() => {
          router.push(targetUrl);
        });

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
      }, undefined, DURATION_CLOSE);

      // 5. SHUTTER OPENS CENTERING ON DESTINATION (0.32s – 0.64s)
      if (bladeActuatorsRef.current.length > 0) {
        tl.to(bladeActuatorsRef.current, {
          rotation: -38,
          duration: DURATION_OPEN,
          ease: "power2.out",
        }, DURATION_CLOSE);
      }

      tl.to(backdropRef.current, {
        opacity: 0,
        duration: DURATION_OPEN * 0.65,
        ease: "power2.out",
      }, DURATION_CLOSE);

      // Fade out HUD guide rings and brackets as iris opens
      tl.to([cornersRef.current, guideRingsRef.current, vignetteRef.current], {
        opacity: 0,
        duration: DURATION_OPEN * 0.5,
        ease: "power1.out",
      }, DURATION_CLOSE + DURATION_OPEN * 0.2);

      // ── PHASE 3 & 4: GOLD FOCUS RING TRAVELS TO DESTINATION & SETTLES ──
      // Triggers ONLY after shutter has fully re-opened (0.64s), never while shutter is closing or opening
      tl.call(() => {
        if (!focusRingRef.current) return;
        const target = computeTargetFocalPoint(targetUrl, targetHash);

        // Gold ring smoothly moves across the screen directly to the destination focal point
        ringTimelineRef.current = gsap.to(focusRingRef.current, {
          x: target.x,
          y: target.y,
          width: target.width,
          height: target.height,
          duration: 0.50,
          ease: "power2.inOut",
          onComplete: () => {
            // Camera focus settle snap (subtle micro pulse)
            if (!focusRingRef.current) {
              forceReset();
              return;
            }
            gsap.to(focusRingRef.current, {
              scale: 1.06,
              duration: 0.08,
              ease: "power1.out",
              onComplete: () => {
                if (!focusRingRef.current) {
                  forceReset();
                  return;
                }
                gsap.to(focusRingRef.current, {
                  scale: 1.0,
                  opacity: 0,
                  duration: 0.14,
                  ease: "power1.inOut",
                  onComplete: () => {
                    forceReset();
                  },
                });
              },
            });
          },
        });
      }, undefined, DURATION_CLOSE + DURATION_OPEN);
    },
    [isReducedMotion, router, clearSafetyTimeout, forceReset, computeTargetFocalPoint]
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

      // Exclude external links, downloads, and custom-nav elements
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;
      if (anchor.getAttribute("rel")?.includes("external")) return;
      if (anchor.hasAttribute("data-no-transition") || anchor.hasAttribute("data-custom-nav")) return;

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

    // Proactively prefetch destination page on hover/pointer-enter before shutter triggers
    const handlePointerOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest("a") as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (href && href.startsWith("/") && !href.startsWith("//") && !href.includes(":")) {
        try {
          router.prefetch(href);
        } catch {
          // prefetch graceful fallback
        }
      }
    };

    document.addEventListener("pointerover", handlePointerOver, { passive: true });
    return () => {
      document.removeEventListener("click", handleClick, { capture: true });
      document.removeEventListener("pointerover", handlePointerOver);
    };
  }, [triggerTransition, router]);

  // Handle programmatic navigation custom events (24f-navigate)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleCustomNav = (e: Event) => {
      const customEvent = e as CustomEvent<{
        url: string;
        image?: string;
        effect?: string;
      }>;
      if (customEvent.detail?.url) {
        const urlStr = customEvent.detail.url;
        const hash = urlStr.includes("#") ? "#" + urlStr.split("#")[1] : "";
        triggerTransition(
          urlStr,
          hash,
          customEvent.detail.image
        );
      }
    };

    window.addEventListener("24f-navigate", handleCustomNav);
    return () => window.removeEventListener("24f-navigate", handleCustomNav);
  }, [triggerTransition, router]);

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
            </defs>

            {/* 8 Radially-Symmetric Mechanical Blades (GPU-accelerated vector transform) */}
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
        </>
      )}
    </div>
  );
}

export { CinematicTransition as CameraShutterTransition };
