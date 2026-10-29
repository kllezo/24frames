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
  const shutterSvgRef = useRef<SVGSVGElement>(null);
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
      overlayRef.current.style.display = "none";
      gsap.set(overlayRef.current, {
        opacity: 0,
        visibility: "hidden",
        pointerEvents: "none",
        clearProps: "all",
      });
    }

    if (shutterSvgRef.current) {
      shutterSvgRef.current.style.display = "";
    }
    if (backdropRef.current) {
      backdropRef.current.style.display = "";
      gsap.set(backdropRef.current, { opacity: 0, clearProps: "all" });
    }
    if (vignetteRef.current) {
      vignetteRef.current.style.display = "";
      gsap.set(vignetteRef.current, { opacity: 0, clearProps: "all" });
    }
    if (cornersRef.current) {
      cornersRef.current.style.display = "";
      gsap.set(cornersRef.current, { opacity: 0, clearProps: "all" });
    }
    if (guideRingsRef.current) {
      guideRingsRef.current.style.display = "";
      gsap.set(guideRingsRef.current, { opacity: 0, clearProps: "all" });
    }

    if (focusRingRef.current) {
      gsap.set(focusRingRef.current, {
        xPercent: -50,
        yPercent: -50,
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

  // Resolve the real destination DOM element specified by user
  const resolveTargetElement = useCallback((targetUrl: string, targetHash: string): HTMLElement | null => {
    const cleanUrl = targetUrl.split("?")[0].replace(/\/$/, "");

    // 1. Explicit hash targeting
    if (targetHash && targetHash.length > 1) {
      if (targetHash.includes("artist")) {
        const el = document.querySelector(
          "#artist img.portraitImg, #artist img[src*='founder-portrait'], #artist [class*='portraitWrap'] img, #artist img, .portraitImg"
        ) as HTMLElement | null;
        if (el) return el;
      }
      if (targetHash.includes("vows")) {
        const el = document.querySelector(
          "#vows img[alt*='Bellamkonda'], #vows [class*='archedPhotoImg'], #vows [class*='archedFrame'] img, #vows picture img, #the-vow [class*='photoCard']:first-child img, #vows [class*='photoCard']:first-child img, #vows img"
        ) as HTMLElement | null;
        if (el) return el;
      }
      if (targetHash.includes("collection")) {
        const el = document.querySelector(
          "#collection [data-discipline-id='weddings'] img, [data-discipline-id='weddings'] img, #collection [data-discipline-id='weddings'], [data-discipline-id='weddings'], #collection [class*='card']:first-child"
        ) as HTMLElement | null;
        if (el) return el;
      }
      if (targetHash.includes("hero")) {
        const el = document.querySelector(
          "#hero img[class*='heroImage'], #hero .cinematicCanvas img, #hero img"
        ) as HTMLElement | null;
        if (el) return el;
      }
      const el = document.querySelector(
        `${targetHash} img, ${targetHash} [class*='photo'], ${targetHash} [class*='card'], ${targetHash} [class*='image']`
      ) as HTMLElement | null;
      if (el) return el;
    }

    // 2. Exact user-specified destinations
    if (cleanUrl === "" || cleanUrl === "/") {
      // Home: the existing homepage hero
      return document.querySelector(
        "#hero img[class*='heroImage'], #hero .cinematicCanvas img, #hero img"
      ) as HTMLElement | null;
    }
    if (cleanUrl.includes("artist")) {
      // Artist: Phani Gogireddy's portrait
      return document.querySelector(
        "#artist img.portraitImg, #artist img[src*='founder-portrait'], #artist [class*='portraitWrap'] img, #artist img, .portraitImg"
      ) as HTMLElement | null;
    }
    if (cleanUrl.includes("vows")) {
      // The Vows: the Bellamkonda Sai Sreenivas & Kavya Reddy wedding hero
      return document.querySelector(
        "#vows img[alt*='Bellamkonda'], #vows [class*='archedPhotoImg'], #vows [class*='archedFrame'] img, #vows picture img, #the-vow [class*='photoCard']:first-child img, #vows [class*='photoCard']:first-child img, #vows img"
      ) as HTMLElement | null;
    }
    if (cleanUrl.includes("collection")) {
      // Collection: the first Weddings & Celebrations card
      return document.querySelector(
        "#collection [data-discipline-id='weddings'] img, [data-discipline-id='weddings'] img, #collection [data-discipline-id='weddings'], [data-discipline-id='weddings'], #collection [class*='card']:first-child"
      ) as HTMLElement | null;
    }
    if (cleanUrl.includes("stories") && !cleanUrl.startsWith("/stories/")) {
      // Stories: the primary Sireesh & Harshitha wedding image
      return document.querySelector(
        "a[href*='sirish-and-harshitha'] img, a[href*='sireesh'] img, [class*='storiesGrid'] a:first-child img, [class*='storyCard']:first-child img"
      ) as HTMLElement | null;
    }
    if (cleanUrl.startsWith("/stories/")) {
      // Individual story pages: that story's own hero photograph
      return document.querySelector(
        "[class*='heroImageFrame'] img, img[class*='heroImage'], [class*='heroVisualCol'] img, [class*='heroSection'] img"
      ) as HTMLElement | null;
    }
    if (cleanUrl.startsWith("/disciplines/")) {
      // Category pages: the first featured photograph
      return document.querySelector(
        "[class*='heroCanvas'] img, [class*='heroImg'], [class*='heroSection'] img"
      ) as HTMLElement | null;
    }
    if (cleanUrl.includes("inquire")) {
      // Inquire: the commission form heading
      return document.querySelector(
        "h1[class*='invitationTitle'], [class*='invitationTitle'], #commissionContactForm h1, #commission-form h1, h1"
      ) as HTMLElement | null;
    }
    if (cleanUrl.includes("client-gallery")) {
      return document.querySelector(
        "#client-gallery a[class*='card']:first-child, [class*='cardsGrid'] [class*='card']:first-child"
      ) as HTMLElement | null;
    }

    return null;
  }, []);

  // Compute on-screen focal coordinates from real DOM element
  const computeTargetCoordinates = useCallback((targetEl: HTMLElement, cleanUrl: string) => {
    const rect = targetEl.getBoundingClientRect();
    const winW = typeof window !== "undefined" ? window.innerWidth : 1200;
    const winH = typeof window !== "undefined" ? window.innerHeight : 800;
    const isMobile = winW <= 820;

    const isPortrait = cleanUrl.includes("artist") || cleanUrl.startsWith("/stories/");
    const isHero = cleanUrl === "" || cleanUrl === "/";
    const focalYRatio = isPortrait ? 0.35 : isHero ? 0.38 : 0.50;

    const targetScreenX = rect.left + rect.width * 0.5;
    const targetScreenY = Math.max(70, Math.min(winH - 70, rect.top + rect.height * focalYRatio));

    const size = Math.max(
      90,
      Math.min(180, isMobile ? rect.width * 0.48 : Math.min(rect.width, rect.height) * 0.50)
    );

    return {
      x: targetScreenX - winW * 0.5,
      y: targetScreenY - winH * 0.5,
      width: size,
      height: size,
    };
  }, []);

  // Perform route swap or scroll while sealed
  const performRouteSwapOrScroll = useCallback(async (targetUrl: string, targetHash: string) => {
    let destUrl: URL;
    try {
      destUrl = new URL(targetUrl, window.location.href);
    } catch {
      return;
    }

    const currentUrl = new URL(window.location.href);
    const isSamePath = destUrl.pathname === currentUrl.pathname;

    if (isSamePath) {
      if (destUrl.hash && destUrl.hash.length > 1) {
        if (typeof window !== "undefined" && (window as unknown as { __lenis?: { scrollTo: (t: unknown, opt?: unknown) => void } }).__lenis) {
          const l = (window as unknown as { __lenis: { scrollTo: (t: unknown, opt?: unknown) => void } }).__lenis;
          l.scrollTo(destUrl.hash, { offset: -80, immediate: true });
        } else {
          const el = document.querySelector(destUrl.hash);
          if (el) el.scrollIntoView({ behavior: "instant", block: "start" });
        }
        try {
          window.history.pushState(null, "", targetUrl);
        } catch {
          // fallback
        }
      } else {
        if (typeof window !== "undefined" && (window as unknown as { __lenis?: { scrollTo: (t: unknown, opt?: unknown) => void } }).__lenis) {
          const l = (window as unknown as { __lenis: { scrollTo: (t: unknown, opt?: unknown) => void } }).__lenis;
          l.scrollTo(0, { immediate: true });
        } else {
          window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        }
        try {
          window.history.pushState(null, "", targetUrl);
        } catch {
          // fallback
        }
      }
      await new Promise((r) => setTimeout(r, 60));
    } else {
      startTransition(() => {
        router.push(targetUrl);
      });

      if (destUrl.hash && destUrl.hash.length > 1) {
        if (typeof window !== "undefined" && (window as unknown as { __lenis?: { scrollTo: (t: unknown, opt?: unknown) => void } }).__lenis) {
          const l = (window as unknown as { __lenis: { scrollTo: (t: unknown, opt?: unknown) => void } }).__lenis;
          l.scrollTo(destUrl.hash, { offset: -80, immediate: true });
        }
      } else {
        if (typeof window !== "undefined" && (window as unknown as { __lenis?: { scrollTo: (t: unknown, opt?: unknown) => void } }).__lenis) {
          const l = (window as unknown as { __lenis: { scrollTo: (t: unknown, opt?: unknown) => void } }).__lenis;
          l.scrollTo(0, { immediate: true });
        } else {
          window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        }
      }

      // Await DOM readiness of the destination route while still sealed (poll up to 800ms)
      const startPoll = Date.now();
      while (Date.now() - startPoll < 800) {
        if (window.location.pathname === destUrl.pathname) {
          const found = resolveTargetElement(targetUrl, targetHash);
          if (found) {
            const rect = found.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) break;
          }
        }
        await new Promise((r) => setTimeout(r, 25));
      }
    }
  }, [router, resolveTargetElement]);

  // Execute the exact 4-phase sequence requested:
  // SHUTTER CLOSES 100% -> BRIEF HOLD -> SHUTTER OPENS 100% -> SHUTTER CLEANUP -> RING TRAVELS TO REAL TARGET -> BRIEF FOCUS -> RING CLEANUP -> CONTINUE
  const triggerTransition = useCallback(
    async (targetUrl: string, targetHash: string, _customImage?: string) => {
      void _customImage;
      if (isTransitioningRef.current) return;
      isTransitioningRef.current = true;

      try {
        router.prefetch(targetUrl);
      } catch {
        // prefetch fallback
      }

      clearSafetyTimeout();
      safetyTimeoutRef.current = setTimeout(() => {
        forceReset();
      }, 3200);

      // Reduced motion accessibility fallback
      if (isReducedMotion) {
        if (overlayRef.current) {
          overlayRef.current.style.display = "block";
          overlayRef.current.classList.add(styles.overlayRootActive);
        }
        gsap.fromTo(overlayRef.current, { opacity: 0 }, {
          opacity: 1, duration: 0.12, ease: "power1.inOut",
          onComplete: async () => {
            await performRouteSwapOrScroll(targetUrl, targetHash);
            gsap.to(overlayRef.current, {
              opacity: 0, duration: 0.12, ease: "power1.inOut",
              onComplete: forceReset,
            });
          }
        });
        return;
      }

      if (overlayRef.current) {
        overlayRef.current.style.display = "block";
        overlayRef.current.classList.add(styles.overlayRootActive);
        gsap.set(overlayRef.current, { opacity: 1, visibility: "visible", pointerEvents: "auto" });
      }

      // Reset shutter elements to visible for Phase 1
      if (shutterSvgRef.current) shutterSvgRef.current.style.display = "";
      if (backdropRef.current) backdropRef.current.style.display = "";
      if (cornersRef.current) cornersRef.current.style.display = "";
      if (vignetteRef.current) vignetteRef.current.style.display = "";
      if (guideRingsRef.current) guideRingsRef.current.style.display = "";

      // Gold ring MUST NOT sit on top of closing blades
      if (focusRingRef.current) {
        gsap.set(focusRingRef.current, {
          xPercent: -50,
          yPercent: -50,
          x: 0,
          y: 0,
          width: 130,
          height: 130,
          opacity: 0,
          scale: 1,
        });
      }

      if (bladeActuatorsRef.current.length > 0) {
        gsap.set(bladeActuatorsRef.current, {
          svgOrigin: `${PIVOT_X} ${PIVOT_Y}`,
          rotation: -38,
        });
      }
      if (backdropRef.current) gsap.set(backdropRef.current, { opacity: 0 });
      if (cornersRef.current) gsap.set(cornersRef.current, { opacity: 0 });
      if (vignetteRef.current) gsap.set(vignetteRef.current, { opacity: 0 });
      if (guideRingsRef.current) gsap.set(guideRingsRef.current, { opacity: 0 });

      // ── PHASE 1: CAMERA SHUTTER CLOSES COMPLETELY (0.34s) ──
      const closeTl = gsap.timeline();
      masterTimelineRef.current = closeTl;

      closeTl.to([vignetteRef.current, cornersRef.current], {
        opacity: 0.85,
        duration: 0.16,
        ease: "power1.out",
      }, 0.00);

      closeTl.to(guideRingsRef.current, {
        opacity: 0.35,
        duration: 0.16,
        ease: "power1.out",
      }, 0.00);

      if (bladeActuatorsRef.current.length > 0) {
        closeTl.to(bladeActuatorsRef.current, {
          rotation: 34,
          duration: 0.34,
          ease: "power2.in",
        }, 0.00);
      }

      if (backdropRef.current) {
        closeTl.to(backdropRef.current, {
          opacity: 1,
          duration: 0.20,
          ease: "power2.in",
        }, 0.14);
      }

      await new Promise<void>((resolve) => {
        closeTl.eventCallback("onComplete", () => resolve());
      });

      // ── BRIEF CINEMATIC HOLD (100ms) WHILE FULLY SEALED ──
      await new Promise((r) => setTimeout(r, 100));

      // ── ROUTE SWAP / SCROLL OCCURS WHILE SEALED ──
      await performRouteSwapOrScroll(targetUrl, targetHash);

      // ── PHASE 2: CAMERA SHUTTER OPENS COMPLETELY (0.34s) ──
      const openTl = gsap.timeline();
      masterTimelineRef.current = openTl;

      if (bladeActuatorsRef.current.length > 0) {
        openTl.to(bladeActuatorsRef.current, {
          rotation: -38,
          duration: 0.34,
          ease: "power2.out",
        }, 0.00);
      }

      if (backdropRef.current) {
        openTl.to(backdropRef.current, {
          opacity: 0,
          duration: 0.24,
          ease: "power2.out",
        }, 0.00);
      }

      openTl.to([cornersRef.current, guideRingsRef.current, vignetteRef.current], {
        opacity: 0,
        duration: 0.22,
        ease: "power1.out",
      }, 0.04);

      await new Promise<void>((resolve) => {
        openTl.eventCallback("onComplete", () => resolve());
      });

      // ── SHUTTER CLEANUP: REMOVE SHUTTER FROM VISIBLE COMPOSITION ──
      if (shutterSvgRef.current) shutterSvgRef.current.style.display = "none";
      if (backdropRef.current) backdropRef.current.style.display = "none";
      if (cornersRef.current) cornersRef.current.style.display = "none";
      if (vignetteRef.current) vignetteRef.current.style.display = "none";
      if (guideRingsRef.current) guideRingsRef.current.style.display = "none";

      // ── PHASE 3: THE EXISTING GOLD FOCUS RING TRAVELS TO THE DESTINATION ──
      if (!focusRingRef.current) {
        forceReset();
        return;
      }

      const cleanUrl = targetUrl.split("?")[0].replace(/\/$/, "");
      const targetEl = resolveTargetElement(targetUrl, targetHash);

      if (!targetEl) {
        // "If the target is unavailable, fail gracefully rather than tracking toward an invented position."
        forceReset();
        return;
      }

      const targetCoords = computeTargetCoordinates(targetEl, cleanUrl);

      // Make ring visible at center (0, 0)
      gsap.set(focusRingRef.current, {
        xPercent: -50,
        yPercent: -50,
        x: 0,
        y: 0,
        width: 130,
        height: 130,
        scale: 1,
        opacity: 1,
      });

      // Ring physically travels across screen to target element
      await new Promise<void>((resolve) => {
        ringTimelineRef.current = gsap.to(focusRingRef.current, {
          xPercent: -50,
          yPercent: -50,
          x: targetCoords.x,
          y: targetCoords.y,
          width: targetCoords.width,
          height: targetCoords.height,
          duration: 0.52,
          ease: "power2.inOut",
          onComplete: () => resolve(),
        });
      });

      // ── PHASE 4: BRIEF FOCUS SNAP & CLEANUP ──
      await new Promise<void>((resolve) => {
        if (!focusRingRef.current) {
          resolve();
          return;
        }
        gsap.to(focusRingRef.current, {
          scale: 1.08,
          duration: 0.08,
          ease: "power1.out",
          onComplete: () => {
            if (!focusRingRef.current) {
              resolve();
              return;
            }
            gsap.to(focusRingRef.current, {
              scale: 1.0,
              opacity: 0,
              duration: 0.16,
              ease: "power1.inOut",
              onComplete: () => resolve(),
            });
          },
        });
      });

      forceReset();
    },
    [isReducedMotion, router, clearSafetyTimeout, forceReset, resolveTargetElement, computeTargetCoordinates, performRouteSwapOrScroll]
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

      // Identical path and hash: do not re-trigger transition
      const currentUrl = new URL(window.location.href);
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
            ref={shutterSvgRef}
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
