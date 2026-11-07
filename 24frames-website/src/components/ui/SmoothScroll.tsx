"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "lenis/dist/lenis.css";

export default function SmoothScroll() {
  const pathname = usePathname();
  const hasScrolledDownRef = useRef(false);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // The private studio experience uses native scrolling (nested scroll
    // panes, sticky ledger, modal sheets).
    if (pathname?.startsWith("/quotebuilder")) return;

    // 1. Accessibility Check: Prefers-reduced-motion
    const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Refresh ScrollTrigger calculations
    ScrollTrigger.refresh();

    // Ensure document is never trapped in an unintended overflow lock
    if (document.body.style.overflow === "hidden") {
      document.body.style.overflow = "";
    }
    if (document.documentElement.style.overflow === "hidden") {
      document.documentElement.style.overflow = "";
    }

    let lenis: Lenis | null = null;
    let tickerCallback: ((time: number) => void) | null = null;
    let onLenisScroll: (() => void) | null = null;

    if (!isReducedMotion) {
      // 2. Lenis smooth scroll normalizes wheel delta across Windows desktop & macOS
      lenis = new Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        wheelMultiplier: 1.0,
        touchMultiplier: 1.0,
        infinite: false,
      });

      lenisRef.current = lenis;
      (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

      onLenisScroll = () => {
        ScrollTrigger.update();
      };
      lenis.on("scroll", onLenisScroll);

      tickerCallback = (time: number) => {
        lenis?.raf(time * 1000);
      };
      gsap.ticker.add(tickerCallback);
      gsap.ticker.lagSmoothing(0);
    }

    // Exact scroll position for The Vows section (#vows)
    const getVowsScrollPosition = (): number => {
      try {
        const st = ScrollTrigger.getById("heroLogoTransition");
        if (st && typeof st.start === "number" && typeof st.end === "number") {
          // Progress 0.96 aligns precisely with the settled 3-column hold state
          return Math.round(st.start + (st.end - st.start) * 0.96);
        }
      } catch {
        // Fallback to calculation
      }

      const heroEl = document.getElementById("hero");
      const heroTop = heroEl ? heroEl.offsetTop : 0;
      const isMobile = window.innerWidth < 820;
      const pinDistance = window.innerHeight * (isMobile ? 1.80 : 2.20);
      return Math.round(heroTop + pinDistance * 0.96);
    };

    // 3. Universal Anchor Navigation with Fixed Luxury Header Offset (-80px)
    const scrollToHash = (hash: string) => {
      if (!hash || hash.length <= 1) return;

      let top = 0;
      if (hash === "#vows") {
        top = getVowsScrollPosition();
      } else {
        const targetElement = document.querySelector(hash);
        if (targetElement) {
          top = Math.max(0, targetElement.getBoundingClientRect().top + window.scrollY - 80);
        } else {
          return;
        }
      }

      const activeLenis = lenisRef.current;
      if (activeLenis && !isReducedMotion) {
        activeLenis.scrollTo(top, { duration: 1.2 });
      } else {
        window.scrollTo({
          top,
          behavior: isReducedMotion ? "auto" : "smooth",
        });
      }
    };

    // Clean hash only when visitor returns to top of page after having scrolled down
    const handleScrollTopHash = () => {
      const scrollY = window.scrollY;
      if (scrollY >= 120) {
        hasScrolledDownRef.current = true;
      } else if (hasScrolledDownRef.current && scrollY < 10 && window.location.hash) {
        hasScrolledDownRef.current = false;
        try {
          history.replaceState(null, "", window.location.pathname + window.location.search);
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener("scroll", handleScrollTopHash, { passive: true });

    // Universal anchor click handler (capture phase to intercept before native jumps)
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest("a") as HTMLAnchorElement | null;
      if (!anchor) return;

      const rawHref = anchor.getAttribute("href");
      if (!rawHref) return;

      let targetId = "";
      if (rawHref.startsWith("#") && rawHref.length > 1) {
        targetId = rawHref;
      } else if (rawHref.startsWith("/#") && rawHref.length > 2) {
        if (window.location.pathname === "/" || window.location.pathname === "") {
          targetId = rawHref.substring(1);
        }
      }

      if (targetId) {
        e.preventDefault();
        scrollToHash(targetId);
        try {
          history.pushState(null, "", targetId);
        } catch {
          // fallback
        }
      }
    };

    document.addEventListener("click", handleAnchorClick, { capture: true });

    // Handle initial hash or hash from cross-route navigation
    const handleInitialHash = () => {
      const hash = window.location.hash;
      if (hash) {
        setTimeout(() => scrollToHash(hash), 150);
        setTimeout(() => scrollToHash(hash), 450);
      }
    };
    handleInitialHash();

    // Handle browser back / forward navigation
    const handlePopState = () => {
      const hash = window.location.hash;
      if (hash) {
        scrollToHash(hash);
      } else if (window.location.pathname === "/" || window.location.pathname === "") {
        const activeLenis = lenisRef.current;
        if (activeLenis && !isReducedMotion) {
          activeLenis.scrollTo(0, { duration: 1.0 });
        } else {
          window.scrollTo({ top: 0, behavior: isReducedMotion ? "auto" : "smooth" });
        }
      }
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("hashchange", handlePopState);

    // Handle responsive breakpoint changes
    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScrollTopHash);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("hashchange", handlePopState);
      document.removeEventListener("click", handleAnchorClick, { capture: true });

      if (lenis && onLenisScroll) {
        lenis.off("scroll", onLenisScroll);
      }
      if (tickerCallback) {
        gsap.ticker.remove(tickerCallback);
      }
      if (lenis) {
        lenis.destroy();
      }
      lenisRef.current = null;
      delete (window as unknown as { __lenis?: unknown }).__lenis;
    };
  }, [pathname]);

  return null;
}
