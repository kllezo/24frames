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
          const top = targetElement.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({
            top,
            behavior: "smooth",
          });
        }
      }
    };

    document.addEventListener("click", handleAnchorClick, { capture: true });

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
