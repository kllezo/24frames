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
          {/* 01 — Through The Lens (Aperture Iris)                  */}
          {/* ────────────────────────────────────────────────────── */}
          {effect === "through-the-lens" && (
            <div
              className={`${styles.apertureContainer} ${
                isClosing ? styles.apertureClosing : styles.apertureOpening
              }`}
            >
              <div className={styles.lensBarrel}>
                {/* Rotating Outer Markings Ring */}
                <div className={styles.lensRingOuter}>
                  <span className={styles.lensRingText} style={{ top: "12px" }}>
                    24 FRAMES · N° 02489 · 50MM F/1.2
                  </span>
                  <span className={styles.lensRingText} style={{ bottom: "12px" }}>
                    CINEMA OPTICAL SYSTEM · APERTURE IRIS
                  </span>
                </div>

                {/* SVG Aperture Blades */}
                <svg
                  viewBox="0 0 400 400"
                  className={styles.apertureSvg}
                  aria-hidden="true"
                >
                  <g transform="translate(200, 200)">
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                      <path
                        key={i}
                        d="M -70 -160 C 20 -150, 130 -110, 150 -10 L 90 90 C 20 50, -40 20, -70 -160 Z"
                        transform={`rotate(${angle})`}
                        className={styles.apertureBlade}
                      />
                    ))}
                  </g>
                </svg>

                {/* Center Iris Opening */}
                <div className={styles.apertureCenterHole}>
                  <span className={styles.apertureBrandText}>24F</span>
                </div>
              </div>

              <div className={styles.apertureFooterMeta}>
                <span>Through The Lens</span>
                <span>·</span>
                <span>Calibrated Iris Transition</span>
              </div>
            </div>
          )}

          {/* ────────────────────────────────────────────────────── */}
          {/* 02 — Contact Sheet Expansion                           */}
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
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className={styles.sprocketHole} />
                  ))}
                </div>
                <span>KODAK VISION3 500T · 24 FRAMES ARCHIVE</span>
                <div className={styles.sprocketTrack}>
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className={styles.sprocketHole} />
                  ))}
                </div>
              </div>

              {/* Contact Sheet Frames Grid */}
              <div className={styles.contactGrid}>
                {/* Left Side Frame */}
                <div className={`${styles.contactFrame} ${styles.contactFrameSide}`}>
                  <img
                    src="/images/stories/bellam-srikonda/IMG_6339.jpg"
                    alt="Archival frame preview"
                    className={styles.contactImg}
                  />
                  <div className={styles.contactFrameMeta}>
                    <span>01</span>
                    <span>BELLA</span>
                  </div>
                </div>

                {/* Center Hero Frame (Lifting & Expanding) */}
                <div className={`${styles.contactFrame} ${styles.contactFrameCenter}`}>
                  <img
                    src="/images/stories/sirish-and-harshitha/DSC07086.jpg"
                    alt="Selected story frame"
                    className={styles.contactImg}
                  />
                  <div className={styles.cropMarkTL} />
                  <div className={styles.cropMarkBR} />
                  <div className={styles.contactFrameMeta}>
                    <span>FRAME 02 / 24</span>
                    <span>SACRED UNION</span>
                  </div>
                </div>

                {/* Right Side Frame */}
                <div className={`${styles.contactFrame} ${styles.contactFrameSide}`}>
                  <img
                    src="/images/stories/hrithika-abhishek/DSC06072.jpg"
                    alt="Archival frame preview"
                    className={styles.contactImg}
                  />
                  <div className={styles.contactFrameMeta}>
                    <span>03</span>
                    <span>HRITHIKA</span>
                  </div>
                </div>
              </div>

              {/* Bottom Film Rebate */}
              <div className={styles.filmRebateFooter}>
                <span>SAFETY FILM · EMULSION COATED · 24F PROOF</span>
                <div className={styles.sprocketTrack}>
                  {[...Array(18)].map((_, i) => (
                    <div key={i} className={styles.sprocketHole} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ────────────────────────────────────────────────────── */}
          {/* 03 — Viewfinder Lock                                  */}
          {/* ────────────────────────────────────────────────────── */}
          {effect === "viewfinder-lock" && (
            <div
              className={`${styles.viewfinderContainer} ${
                isClosing ? styles.viewfinderClosing : styles.viewfinderOpening
              }`}
            >
              {/* Top HUD */}
              <div className={styles.viewfinderTopHUD}>
                <span className={styles.recIndicator}>
                  <span className={styles.recDot} />
                  ● REC 4K 24P
                </span>
                <span>RAW UNCOMPRESSED · WB 5600K</span>
                <span>BAT 98% ▮▮▮</span>
              </div>

              {/* Center HUD with Focus Brackets */}
              <div className={styles.viewfinderCenterStage}>
                <div className={styles.focusBox}>
                  <div className={styles.bracketTL} />
                  <div className={styles.bracketTR} />
                  <div className={styles.bracketBL} />
                  <div className={styles.bracketBR} />

                  <div className={styles.centerReticle}>
                    <div className={styles.crossHair} />
                    <div className={`${styles.crossHair} ${styles.crossHairVert}`} />
                  </div>

                  <span className={styles.focusLockPill}>
                    {shutterFlash ? "EXPOSURE LOCK" : "AF-C · FOCUS LOCK"}
                  </span>
                </div>
              </div>

              {/* Bottom HUD */}
              <div className={styles.viewfinderBottomHUD}>
                <span>1/250 SEC</span>
                <span>F/1.4 PRIME</span>
                <span>ISO 100</span>
                <span>EV 0.0</span>
                <span>24 FRAMES CINEMA HUD</span>
              </div>

              {/* Soft Shutter Flash Bloom */}
              <div
                className={`${styles.shutterFlashOverlay} ${
                  shutterFlash ? styles.shutterFlashing : ""
                }`}
              />
            </div>
          )}

          {/* ────────────────────────────────────────────────────── */}
          {/* 04 — Parallax Slide                                   */}
          {/* ────────────────────────────────────────────────────── */}
          {effect === "parallax-slide" && (
            <div
              className={`${styles.parallaxContainer} ${
                isClosing ? styles.parallaxClosing : styles.parallaxOpening
              }`}
            >
              {/* Background Deep Emerald Canvas */}
              <div className={styles.parallaxLayerBg} />

              {/* Foreground Typography */}
              <div className={styles.parallaxLayerFore}>
                <span className={styles.parallaxKicker}>CHAPTER TRANSITION</span>
                <h2 className={styles.parallaxTitle}>24 Frames Cinematic Passage</h2>
              </div>

              {/* Middle Floating Staggered Photographic Cards */}
              <div className={styles.parallaxLayerCards}>
                <div className={styles.parallaxSlideCard}>
                  <img
                    src="/images/stories/sirish-and-harshitha/DSC07086.jpg"
                    alt="Cinematic frame"
                    className={styles.parallaxCardImg}
                  />
                  <div className={styles.parallaxCardGradient} />
                  <div className={styles.parallaxCardMeta}>
                    <span className={styles.parallaxCardFrame}>FRAME 01</span>
                    <h3 className={styles.parallaxCardTitle}>Sacred Union</h3>
                  </div>
                </div>

                <div className={styles.parallaxSlideCard}>
                  <img
                    src="/images/stories/bellam-srikonda/IMG_6339.jpg"
                    alt="Cinematic frame"
                    className={styles.parallaxCardImg}
                  />
                  <div className={styles.parallaxCardGradient} />
                  <div className={styles.parallaxCardMeta}>
                    <span className={styles.parallaxCardFrame}>FRAME 02</span>
                    <h3 className={styles.parallaxCardTitle}>Royal Reception</h3>
                  </div>
                </div>

                <div className={styles.parallaxSlideCard}>
                  <img
                    src="/images/stories/karthik-and-gayathri/DSC04179.jpg"
                    alt="Cinematic frame"
                    className={styles.parallaxCardImg}
                  />
                  <div className={styles.parallaxCardGradient} />
                  <div className={styles.parallaxCardMeta}>
                    <span className={styles.parallaxCardFrame}>FRAME 03</span>
                    <h3 className={styles.parallaxCardTitle}>Glasshouse Union</h3>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
