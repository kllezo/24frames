"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import styles from "./CinematicTransition.module.css";

export type TransitionEffect =
  | "through-the-lens"
  | "contact-sheet"
  | "viewfinder-lock"
  | "parallax-slide";

const EFFECTS: TransitionEffect[] = [
  "through-the-lens",
  "contact-sheet",
  "viewfinder-lock",
  "parallax-slide",
];

const SESSION_KEY = "24frames_last_transition";

export default function CinematicTransition() {
  const router = useRouter();
  const pathname = usePathname();

  const [phase, setPhase] = useState<"idle" | "closing" | "swapping" | "opening">("idle");
  const [effect, setEffect] = useState<TransitionEffect>("through-the-lens");
  const [shutterFlash, setShutterFlash] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  const pendingUrlRef = useRef<string | null>(null);
  const pendingHashRef = useRef<string | null>(null);
  const safetyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check reduced-motion preference
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mediaQuery.matches);

    const listener = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  // Pick random effect ensuring no immediate consecutive repeats
  const pickNextEffect = useCallback((): TransitionEffect => {
    try {
      const forced = sessionStorage.getItem("24f_force_transition_fx") as TransitionEffect | null;
      if (forced && EFFECTS.includes(forced)) {
        sessionStorage.removeItem("24f_force_transition_fx");
        return forced;
      }
      const last = sessionStorage.getItem(SESSION_KEY) as TransitionEffect | null;
      const candidates = EFFECTS.filter((e) => e !== last);
      const chosen = candidates[Math.floor(Math.random() * candidates.length)] || "through-the-lens";
      sessionStorage.setItem(SESSION_KEY, chosen);
      return chosen;
    } catch {
      return EFFECTS[Math.floor(Math.random() * EFFECTS.length)];
    }
  }, []);

  // Cleanup safety timeout
  const clearSafetyTimeout = useCallback(() => {
    if (safetyTimeoutRef.current) {
      clearTimeout(safetyTimeoutRef.current);
      safetyTimeoutRef.current = null;
    }
  }, []);

  // Force reset if navigation is interrupted
  const forceReset = useCallback(() => {
    clearSafetyTimeout();
    setPhase("idle");
    setShutterFlash(false);
    pendingUrlRef.current = null;
    pendingHashRef.current = null;
  }, [clearSafetyTimeout]);

  // Execute transition
  const triggerTransition = useCallback(
    (targetUrl: string, targetHash: string) => {
      if (phase !== "idle") return;

      const chosenEffect = pickNextEffect();
      setEffect(chosenEffect);
      pendingUrlRef.current = targetUrl;
      pendingHashRef.current = targetHash;
      setPhase("closing");

      // Flash trigger for viewfinder
      if (chosenEffect === "viewfinder-lock") {
        setTimeout(() => setShutterFlash(true), 280);
        setTimeout(() => setShutterFlash(false), 440);
      }

      // Safety timeout in case navigation stalls
      clearSafetyTimeout();
      safetyTimeoutRef.current = setTimeout(() => {
        forceReset();
      }, 2400);

      const closeDuration = isReducedMotion ? 120 : 480;

      setTimeout(() => {
        setPhase("swapping");
        // Push the route to Next.js router
        router.push(targetUrl);

        // After route has initiated, wait for opening reveal
        setTimeout(() => {
          setPhase("opening");

          // Reset scroll or scroll to hash anchor
          if (targetHash && targetHash.length > 1) {
            const targetEl = document.querySelector(targetHash);
            if (targetEl) {
              targetEl.scrollIntoView({ behavior: "smooth" });
            }
          } else {
            window.scrollTo({ top: 0, left: 0, behavior: "instant" });
          }

          const openDuration = isReducedMotion ? 120 : 500;
          setTimeout(() => {
            forceReset();
          }, openDuration);
        }, isReducedMotion ? 60 : 180);
      }, closeDuration);
    },
    [phase, pickNextEffect, isReducedMotion, router, clearSafetyTimeout, forceReset]
  );

  // Global click interceptor for eligible internal links
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleClick = (e: MouseEvent) => {
      // Only handle regular left-clicks without modifiers
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return;
      }

      const target = e.target as HTMLElement | null;
      const anchor = target?.closest("a") as HTMLAnchorElement | null;
      if (!anchor) return;

      // Skip special attributes
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

      // Verify same origin
      if (url.origin !== window.location.origin) return;

      // In-page anchor link on the current exact page (e.g. href="#stills")
      const currentUrl = new URL(window.location.href);
      if (
        url.pathname === currentUrl.pathname &&
        url.search === currentUrl.search &&
        url.hash
      ) {
        // Pure in-page scroll on the same page, do not trigger full page transition
        return;
      }

      // If clicking link to the exact identical URL with identical hash
      if (
        url.pathname === currentUrl.pathname &&
        url.search === currentUrl.search &&
        url.hash === currentUrl.hash
      ) {
        return;
      }

      // Eligible internal navigation!
      e.preventDefault();
      triggerTransition(url.pathname + url.search + url.hash, url.hash);
    };

    document.addEventListener("click", handleClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleClick, { capture: true });
    };
  }, [triggerTransition]);

  // Preload transition optical and photographic assets so they render instantaneously
  useEffect(() => {
    if (typeof window === "undefined") return;
    const assets = [
      "/images/transitions/aperture-iris.jpg",
      "/images/transitions/optical-glass.jpg",
      "/images/stories/bellam-srikonda/IMG_6339.webp",
      "/images/stories/sirish-and-harshitha/IMG_6346.webp",
      "/images/stories/hrithika-abhishek/IMG_6322.webp",
    ];
    assets.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      clearSafetyTimeout();
    };
  }, [clearSafetyTimeout]);

  if (phase === "idle") {
    return null;
  }

  const isClosing = phase === "closing";
  const isOpening = phase === "opening" || phase === "swapping";

  return (
    <div
      className={`${styles.overlayRoot} ${styles.overlayRootActive}`}
      role="status"
      aria-live="polite"
      aria-label="Loading page transition"
    >
      {/* ────────────────────────────────────────────────────────── */}
      {/* Reduced-Motion Fallback                                   */}
      {/* ────────────────────────────────────────────────────────── */}
      {isReducedMotion ? (
        <div
          className={`${styles.reducedMotionOverlay} ${
            isClosing ? styles.reducedMotionClosing : styles.reducedMotionOpening
          }`}
        />
      ) : (
        <>
          {/* ────────────────────────────────────────────────────── */}
          {/* 01 — Through The Lens (Photorealistic Aperture Iris)    */}
          {/* ────────────────────────────────────────────────────── */}
          {effect === "through-the-lens" && (
            <div
              className={`${styles.apertureContainer} ${
                isClosing ? styles.apertureClosing : styles.apertureOpening
              }`}
            >
              {/* Optical Glass Streak & Flare Layer */}
              <div className={styles.opticalGlassOverlay}>
                <img
                  src="/images/transitions/optical-glass.jpg"
                  alt=""
                  className={styles.opticalGlassImg}
                />
              </div>

              {/* Central Precision Aperture Housing */}
              <div className={styles.lensBarrel}>
                {/* Outer Lens Chassis Ring */}
                <div className={styles.lensRingOuter}>
                  <div className={styles.lensRingBezel}>
                    <span className={styles.lensRingTextTop}>
                      24 FRAMES PHOTOGRAPHY · 50MM F/1.2 PRIME
                    </span>
                    <span className={styles.lensRingTextBottom}>
                      CINEMA OPTICAL SYSTEM · CALIBRATED IRIS
                    </span>
                  </div>
                </div>

                {/* Photorealistic Aperture Mechanism */}
                <div className={styles.apertureIrisFrame}>
                  <img
                    src="/images/transitions/aperture-iris.jpg"
                    alt=""
                    className={styles.apertureIrisImg}
                  />
                  {/* Circular Optical Mask */}
                  <div className={styles.apertureIrisMask} />
                </div>

                {/* Center Dynamic Iris Core */}
                <div className={styles.apertureCenterCore} />
              </div>

              {/* Minimal Luxury Editorial Caption */}
              <div className={styles.apertureFooterMeta}>
                <span>Through The Lens</span>
                <span className={styles.metaDot}>·</span>
                <span>Optical Aperture Iris</span>
              </div>
            </div>
          )}

          {/* ────────────────────────────────────────────────────── */}
          {/* 02 — Contact Sheet Expansion (35mm Archival Proof)    */}
          {/* ────────────────────────────────────────────────────── */}
          {effect === "contact-sheet" && (
            <div
              className={`${styles.contactSheetContainer} ${
                isClosing ? styles.contactSheetClosing : styles.contactSheetOpening
              }`}
            >
              {/* Top Film Rebate */}
              <div className={styles.filmRebateHeader}>
                <div className={styles.sprocketTrack}>
                  {[...Array(14)].map((_, i) => (
                    <div key={i} className={styles.sprocketHole} />
                  ))}
                </div>
                <div className={styles.filmRebateText}>
                  <span>KODAK VISION3 500T · 5219</span>
                  <span className={styles.rebateSep}>·</span>
                  <span>24 FRAMES MASTER ARCHIVE</span>
                </div>
                <div className={styles.sprocketTrack}>
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className={styles.sprocketHole} />
                  ))}
                </div>
              </div>

              {/* Contact Sheet Frames Grid */}
              <div className={styles.contactGrid}>
                {/* Left Flanking Proof Frame */}
                <div className={`${styles.contactFrame} ${styles.contactFrameSide}`}>
                  <img
                    src="/images/stories/bellam-srikonda/IMG_6339.webp"
                    alt="Archival proof still"
                    loading="eager"
                    className={styles.contactImg}
                  />
                  <div className={styles.contactFrameMeta}>
                    <span>FRAME 01</span>
                    <span>BELLA</span>
                  </div>
                </div>

                {/* Center Anchor Frame (Lifting & Expanding into Destination) */}
                <div className={`${styles.contactFrame} ${styles.contactFrameCenter}`}>
                  <img
                    src="/images/stories/sirish-and-harshitha/IMG_6346.webp"
                    alt="Active visual anchor"
                    loading="eager"
                    className={styles.contactImg}
                  />
                  <div className={styles.cropMarkTL} />
                  <div className={styles.cropMarkBR} />
                  <div className={styles.contactFrameMeta}>
                    <span className={styles.framePill}>FRAME 02 / 24</span>
                    <span className={styles.frameLabel}>SACRED UNION</span>
                  </div>
                </div>

                {/* Right Flanking Proof Frame */}
                <div className={`${styles.contactFrame} ${styles.contactFrameSide}`}>
                  <img
                    src="/images/stories/hrithika-abhishek/IMG_6322.webp"
                    alt="Archival proof still"
                    loading="eager"
                    className={styles.contactImg}
                  />
                  <div className={styles.contactFrameMeta}>
                    <span>FRAME 03</span>
                    <span>HRITHIKA</span>
                  </div>
                </div>
              </div>

              {/* Bottom Film Rebate */}
              <div className={styles.filmRebateFooter}>
                <div className={styles.filmRebateText}>
                  <span>SAFETY FILM · EMULSION COATED</span>
                  <span className={styles.rebateSep}>·</span>
                  <span>24F CURATED PROOF</span>
                </div>
                <div className={styles.sprocketTrack}>
                  {[...Array(20)].map((_, i) => (
                    <div key={i} className={styles.sprocketHole} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ────────────────────────────────────────────────────── */}
          {/* 03 — Viewfinder Lock (Restrained Quiet Luxury)         */}
          {/* ────────────────────────────────────────────────────── */}
          {effect === "viewfinder-lock" && (
            <div
              className={`${styles.viewfinderContainer} ${
                isClosing ? styles.viewfinderClosing : styles.viewfinderOpening
              }`}
            >
              {/* Soft Photographic Backdrop */}
              <div className={styles.viewfinderBackdrop}>
                <img
                  src="/images/stories/sirish-and-harshitha/IMG_6346.webp"
                  alt=""
                  loading="eager"
                  className={styles.viewfinderBgImg}
                />
                <div className={styles.viewfinderVignette} />
              </div>

              {/* Center Minimal Focus Target */}
              <div className={styles.viewfinderCenterStage}>
                <div className={styles.focusBox}>
                  {/* Subtle Titanium 1px Corner Brackets */}
                  <div className={styles.bracketTL} />
                  <div className={styles.bracketTR} />
                  <div className={styles.bracketBL} />
                  <div className={styles.bracketBR} />

                  {/* Restrained Center Reticle */}
                  <div className={styles.centerReticle}>
                    <div className={styles.crossHair} />
                    <div className={`${styles.crossHair} ${styles.crossHairVert}`} />
                  </div>

                  {/* Minimal Luxury Focus Pill */}
                  <div className={styles.focusLockBadge}>
                    <span className={styles.focusDot} />
                    <span>AF-LOCK · 24 FRAMES</span>
                  </div>
                </div>
              </div>

              {/* Whisper-Soft Shutter Flash Bloom */}
              <div
                className={`${styles.shutterFlashOverlay} ${
                  shutterFlash ? styles.shutterFlashing : ""
                }`}
              />
            </div>
          )}

          {/* ────────────────────────────────────────────────────── */}
          {/* 04 — Parallax Slide (Spatial Editorial Depth)          */}
          {/* ────────────────────────────────────────────────────── */}
          {effect === "parallax-slide" && (
            <div
              className={`${styles.parallaxContainer} ${
                isClosing ? styles.parallaxClosing : styles.parallaxOpening
              }`}
            >
              {/* Layer 1: Deep Emerald Textured Canvas (Background) */}
              <div className={styles.parallaxLayerBg}>
                <div className={styles.parallaxCanvasWatermark}>24 FRAMES</div>
              </div>

              {/* Optical Depth Lighting */}
              <div className={styles.parallaxGlassStreak}>
                <img
                  src="/images/transitions/optical-glass.jpg"
                  alt=""
                  className={styles.parallaxGlassImg}
                />
              </div>

              {/* Layer 2: Main Floating Editorial Print (Middle-ground) */}
              <div className={styles.parallaxMidPrint}>
                <div className={styles.printMatting}>
                  <img
                    src="/images/stories/sirish-and-harshitha/IMG_6346.webp"
                    alt="Editorial wedding print"
                    loading="eager"
                    className={styles.printPhoto}
                  />
                  <div className={styles.printCaptionRow}>
                    <span className={styles.printCaptionKicker}>24 FRAMES · PROVENANCE</span>
                    <span className={styles.printCaptionTitle}>Sacred Union · Hyderabad</span>
                  </div>
                </div>
              </div>

              {/* Layer 3: Narrow High-Speed Forefront Still (Foreground) */}
              <div className={styles.parallaxForeStill}>
                <img
                  src="/images/stories/bellam-srikonda/IMG_6339.webp"
                  alt="Fine art still"
                  loading="eager"
                  className={styles.foreStillImg}
                />
                <div className={styles.foreStillBorder} />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
