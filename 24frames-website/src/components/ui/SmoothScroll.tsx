"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "lenis/dist/lenis.css";

export default function SmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Accessibility Check: Prefers-reduced-motion
    const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReducedMotion) {
      return;
    }

    // 2. Strict Platform Separation:
    // Mobile (< 820px) is STRICTLY LOCKED to existing Lenis behavior.
    // Desktop (>= 820px) uses pure native browser vertical scrolling without Lenis interference.
    const isMobile = () => window.innerWidth < 820;

    let lenis: Lenis | null = null;
    let tickerCallback: ((time: number) => void) | null = null;
    let updateScrollTrigger: (() => void) | null = null;

    const initLenisMobile = () => {
      if (lenisRef.current) return;
      lenis = new Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Clean exponential deceleration
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        wheelMultiplier: 1.0,
        touchMultiplier: 1.0,
        infinite: false,
      });

      lenisRef.current = lenis;
      (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

      updateScrollTrigger = () => {
        ScrollTrigger.update();
      };
      lenis.on("scroll", updateScrollTrigger);

      tickerCallback = (time: number) => {
        lenis?.raf(time * 1000);
      };
      gsap.ticker.add(tickerCallback);
      gsap.ticker.lagSmoothing(500, 33);
    };

    const destroyLenis = () => {
      if (updateScrollTrigger && lenisRef.current) {
        lenisRef.current.off("scroll", updateScrollTrigger);
      }
      if (tickerCallback) {
        gsap.ticker.remove(tickerCallback);
        tickerCallback = null;
      }
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
      lenis = null;
      (window as unknown as { __lenis?: Lenis }).__lenis = undefined;
    };

    if (isMobile()) {
      initLenisMobile();
    } else {
      // Desktop: Pure native browser vertical scrolling.
      destroyLenis();
      ScrollTrigger.refresh();
    }

    // 3. Universal Anchor Navigation with Fixed Luxury Header Offset (-80px)
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest("a") as HTMLAnchorElement | null;
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      if (href.startsWith("#") && href.length > 1) {
        const targetElement = document.querySelector(href);
        if (targetElement) {
          e.preventDefault();
          if (lenisRef.current) {
            lenisRef.current.scrollTo(targetElement as HTMLElement, {
              offset: -80,
              duration: 1.2,
            });
          } else {
            const top = targetElement.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({
              top,
              behavior: "smooth",
            });
          }
        }
      }
    };

    document.addEventListener("click", handleAnchorClick, { capture: true });

    // Handle responsive breakpoint changes
    const handleResize = () => {
      if (isMobile()) {
        if (!lenisRef.current) {
          initLenisMobile();
        }
      } else {
        if (lenisRef.current) {
          destroyLenis();
          ScrollTrigger.refresh();
        }
      }
    };

    window.addEventListener("resize", handleResize, { passive: true });

    // 4. Cleanup on Unmount
    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("click", handleAnchorClick, { capture: true });
      destroyLenis();
    };
  }, []);

  return null;
}
