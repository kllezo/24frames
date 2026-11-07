"use client";

import { useEffect } from "react";

// Central ref counter to safely handle nested or multiple open dialogs
let activeScrollLocks = 0;
let previousBodyOverflow = "";
let previousHtmlOverflow = "";
let savedScrollY = 0;

export function lockScroll() {
  if (typeof window === "undefined") return;

  if (activeScrollLocks === 0) {
    savedScrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
    previousBodyOverflow = document.body.style.overflow;
    previousHtmlOverflow = document.documentElement.style.overflow;
  }

  document.body.style.overflow = "hidden";
  document.documentElement.style.overflow = "hidden";

  // Pause Lenis smooth scrolling so wheel/touch gestures don't scroll the page behind the modal
  const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } }).__lenis;
  if (lenis?.stop) {
    lenis.stop();
  }

  activeScrollLocks++;
}

export function unlockScroll() {
  if (typeof window === "undefined") return;

  activeScrollLocks = Math.max(0, activeScrollLocks - 1);

  if (activeScrollLocks === 0) {
    document.body.style.overflow = previousBodyOverflow === "hidden" ? "" : previousBodyOverflow;
    document.documentElement.style.overflow = previousHtmlOverflow === "hidden" ? "" : previousHtmlOverflow;

    // Resume Lenis smooth scrolling
    const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void; scrollTo: (target: number, opt?: { immediate?: boolean }) => void } }).__lenis;
    if (lenis?.start) {
      lenis.start();
    }

    // Restore exact prior scroll position
    if (lenis?.scrollTo) {
      lenis.scrollTo(savedScrollY, { immediate: true });
    } else {
      window.scrollTo(0, savedScrollY);
    }
  }
}

export function forceUnlockAllScroll() {
  if (typeof window === "undefined") return;
  activeScrollLocks = 0;
  document.body.style.overflow = "";
  document.documentElement.style.overflow = "";
  const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } }).__lenis;
  if (lenis?.start) {
    lenis.start();
  }
}

export function useScrollLock(isLocked: boolean) {
  useEffect(() => {
    if (!isLocked) return;

    lockScroll();

    return () => {
      unlockScroll();
    };
  }, [isLocked]);
}
