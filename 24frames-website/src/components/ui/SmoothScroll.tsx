"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function SmoothScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Accessibility Check: Prefers-reduced-motion
    const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReducedMotion) {
      return;
    }

    // 2. Pure Native Browser Scrolling Architecture across both Desktop and Mobile:
    // Guarantees zero touch interception, zero scroll lock, 60fps native GPU compositor scrolling,
    // and instant tactile responsiveness without competing RAF loops.
    ScrollTrigger.refresh();

    // Ensure document is never trapped in an unintended overflow lock
    if (document.body.style.overflow === "hidden") {
      document.body.style.overflow = "";
    }
    if (document.documentElement.style.overflow === "hidden") {
      document.documentElement.style.overflow = "";
    }

    // 3. Universal Anchor Navigation with Fixed Luxury Header Offset (-80px)
    const scrollToHash = (hash: string) => {
      if (!hash || hash.length <= 1) return;
      if (hash === "#vows") {
        window.scrollTo({
          top: Math.round(window.innerHeight * 0.60),
          behavior: "smooth",
        });
        return;
      }
      const targetElement = document.querySelector(hash);
      if (targetElement) {
        const top = targetElement.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({
          top,
          behavior: "smooth",
        });
      }
    };

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

    if (window.location.hash) {
      setTimeout(() => scrollToHash(window.location.hash), 200);
    }

    // Handle responsive breakpoint changes
    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("click", handleAnchorClick, { capture: true });
    };
  }, []);

  return null;
}
