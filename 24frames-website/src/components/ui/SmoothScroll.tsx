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

    // 2. Initialize Single Reusable Lenis Controller with Restrained, Natural Easing
    const lenis = new Lenis({
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

    // 3. Official GSAP ScrollTrigger Synchronization
    const updateScrollTrigger = () => {
      ScrollTrigger.update();
    };
    lenis.on("scroll", updateScrollTrigger);

    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(500, 33);

    // 4. Handle Anchor Navigation with Fixed Luxury Header Offset (-80px)
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
          lenis.scrollTo(targetElement as HTMLElement, {
            offset: -80,
            duration: 1.2,
          });
        }
      }
    };

    document.addEventListener("click", handleAnchorClick, { capture: true });

    // 5. Cleanup on Unmount
    return () => {
      document.removeEventListener("click", handleAnchorClick, { capture: true });
      lenis.off("scroll", updateScrollTrigger);
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
      lenisRef.current = null;
      (window as unknown as { __lenis?: Lenis }).__lenis = undefined;
    };
  }, []);

  return null;
}
