"use client";

import {
  useEffect,
  useState,
  useRef,
  useCallback,
  useSyncExternalStore,
} from "react";
import { useRouter } from "next/navigation";
import {
  resolveRouteVisual,
  type TransitionEffect,
  type RouteVisualMeta,
} from "@/lib/transitions";
import styles from "./CinematicTransition.module.css";

const SESSION_KEY = "24frames_last_camera_transition";
const EFFECTS: TransitionEffect[] = ["through-the-lens", "viewfinder-lock"];

type TransitionPhase =
  | "idle"
  | "focusing"
  | "closing"
  | "swapping"
  | "opening"
  | "revealing";

const F_STOPS = ["1.2", "1.4", "2", "2.8", "4", "5.6", "8", "11", "16"];

// 8-Blade Aperture Diaphragm geometry
const BLADE_PATH =
  "M 440 250 A 235 235 0 0 1 330 460 L 200 420 C 185 350, 230 260, 440 250 Z";

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

export default function CinematicTransition() {
  const router = useRouter();

  const isReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  const [phase, setPhase] = useState<TransitionPhase>("idle");
  const [effect, setEffect] = useState<TransitionEffect>("through-the-lens");
  const [outgoingVisual, setOutgoingVisual] = useState<RouteVisualMeta | null>(null);
  const [incomingVisual, setIncomingVisual] = useState<RouteVisualMeta | null>(null);

  const isTransitioningRef = useRef(false);
  const safetyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Alternating effect selection (Strictly alternates between the two transitions)
  const pickNextEffect = useCallback((): TransitionEffect => {
    try {
      // Allow testing override if explicitly set in sessionStorage
      const forced = sessionStorage.getItem("24f_force_transition_fx") as TransitionEffect | null;
      if (forced && EFFECTS.includes(forced)) {
        return forced;
      }
      const last = sessionStorage.getItem(SESSION_KEY) as TransitionEffect | null;
      let chosen: TransitionEffect;
      if (last === "through-the-lens") {
        chosen = "viewfinder-lock";
      } else if (last === "viewfinder-lock") {
        chosen = "through-the-lens";
      } else {
        chosen = Math.random() > 0.5 ? "through-the-lens" : "viewfinder-lock";
      }
      sessionStorage.setItem(SESSION_KEY, chosen);
      return chosen;
    } catch {
      return Math.random() > 0.5 ? "through-the-lens" : "viewfinder-lock";
    }
  }, []);

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
    setPhase("idle");
    isTransitioningRef.current = false;
  }, [clearSafetyTimeout]);

  // Execute the animated camera transition
  const triggerTransition = useCallback(
    (
      targetUrl: string,
      targetHash: string,
      customOutgoingImage?: string,
      forcedEffect?: TransitionEffect
    ) => {
      // Prevent duplicate transitions during rapid repeated clicks
      if (isTransitioningRef.current || phase !== "idle") return;
      isTransitioningRef.current = true;

      const chosenEffect = forcedEffect || pickNextEffect();
      setEffect(chosenEffect);

      // Resolve outgoing photographic anchor (from clicked image or current route)
      const currentRouteMeta = resolveRouteVisual(window.location.pathname);
      const outgoing: RouteVisualMeta = {
        image: customOutgoingImage || currentRouteMeta.image,
        webp: currentRouteMeta.webp,
        title: currentRouteMeta.title,
        subtitle: currentRouteMeta.subtitle,
      };
      setOutgoingVisual(outgoing);

      // Resolve incoming photographic anchor
      const targetPath = targetUrl.split("?")[0].split("#")[0];
      const incoming = resolveRouteVisual(targetPath);
      setIncomingVisual(incoming);

      // Safety fallback timeout
      clearSafetyTimeout();
      safetyTimeoutRef.current = setTimeout(() => {
        forceReset();
      }, 2400);

      if (isReducedMotion) {
        setPhase("closing");
        setTimeout(() => {
          setPhase("swapping");
          router.push(targetUrl);
          setTimeout(() => {
            setPhase("opening");
            if (targetHash && targetHash.length > 1) {
              const el = document.querySelector(targetHash);
              if (el) el.scrollIntoView({ behavior: "smooth" });
            } else {
              window.scrollTo({ top: 0, left: 0, behavior: "instant" });
            }
            setTimeout(() => {
              forceReset();
            }, 120);
          }, 60);
        }, 120);
        return;
      }

      // ── Sequence Timing (~760–840ms total) ──
      // State 2: Focus starts & scene stabilizes (50ms)
      setPhase("focusing");

      // State 3: Aperture closes inward / Viewfinder locks focus (340ms)
      setTimeout(() => {
        setPhase("closing");

        // State 4: Route swap initiated underneath the camera overlay
        setTimeout(() => {
          setPhase("swapping");
          router.push(targetUrl);

          // State 4 opening: aperture opens onto incoming photo / optical bloom bridges
          setTimeout(() => {
            setPhase("opening");

            // Reset scroll position or scroll to target anchor underneath overlay
            if (targetHash && targetHash.length > 1) {
              const targetEl = document.querySelector(targetHash);
              if (targetEl) {
                targetEl.scrollIntoView({ behavior: "smooth" });
              }
            } else {
              window.scrollTo({ top: 0, left: 0, behavior: "instant" });
            }

            // State 5: Destination reveals with gentle fade & settling motion
            setTimeout(() => {
              setPhase("revealing");
              setTimeout(() => {
                forceReset();
              }, 120);
            }, 300);
          }, 80);
        }, 340);
      }, 50);
    },
    [phase, pickNextEffect, isReducedMotion, router, clearSafetyTimeout, forceReset]
  );

  // Global click interceptor for eligible internal links and cards
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

      // Exclude external links, downloads and new tabs
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

      // Exclude different origin
      if (url.origin !== window.location.origin) return;

      // Pure in-page scroll on the same page (e.g. clicking /#vows while already at /)
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

      // Check if clicked element or card has a photograph
      let customPhoto: string | undefined;
      const cardImg =
        anchor.querySelector("img") ||
        anchor.closest("[class*='card'], [class*='Card'], [class*='item'], [class*='Item']")?.querySelector("img");
      if (cardImg && (cardImg.currentSrc || cardImg.src)) {
        customPhoto = cardImg.currentSrc || cardImg.src;
      }

      e.preventDefault();
      triggerTransition(
        url.pathname + url.search + url.hash,
        url.hash,
        customPhoto
      );
    };

    document.addEventListener("click", handleClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleClick, { capture: true });
    };
  }, [triggerTransition]);

  // Handle programmatic navigation custom events (e.g. interactive tabs or buttons)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleCustomNav = (e: Event) => {
      const customEvent = e as CustomEvent<{
        url: string;
        image?: string;
        effect?: TransitionEffect;
      }>;
      if (customEvent.detail?.url) {
        triggerTransition(
          customEvent.detail.url,
          "",
          customEvent.detail.image,
          customEvent.detail.effect
        );
      }
    };

    window.addEventListener("24f-navigate", handleCustomNav);
    return () => window.removeEventListener("24f-navigate", handleCustomNav);
  }, [triggerTransition]);

  // Support browser Back and Forward navigation cleanly
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handlePopState = () => {
      // If a transition was mid-flight, safely reset to avoid stuck overlays
      if (isTransitioningRef.current) {
        forceReset();
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [forceReset]);

  // Preload optical and photographic assets so transitions render instantaneously
  useEffect(() => {
    if (typeof window === "undefined") return;
    const assets = [
      "/images/transitions/optical-glass.jpg",
      "/images/stories/sirish-and-harshitha/IMG_6346.webp",
      "/images/portfolio/sireesh-harshitha/cover.jpg",
      "/images/stories/bellam-srikonda/IMG_6339.webp",
      "/images/stories/hrithika-abhishek/IMG_6322.webp",
      "/images/founder-portrait.jpg",
    ];
    assets.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Unmount cleanup
  useEffect(() => {
    return () => {
      clearSafetyTimeout();
    };
  }, [clearSafetyTimeout]);

  if (phase === "idle") {
    return null;
  }

  const isFocusing = phase === "focusing";
  const isClosing = phase === "closing" || phase === "swapping";
  const isOpening = phase === "opening";
  const isRevealing = phase === "revealing";

  const outgoingImgSrc = outgoingVisual?.image || "/images/stories/sirish-and-harshitha/IMG_6346.webp";
  const incomingImgSrc = incomingVisual?.image || outgoingImgSrc;

  // Active F-Stop index for Through the Lens
  const currentFStopIdx = isClosing ? 8 : 0; // f/1.2 when open, f/16 when closed

  return (
    <div
      className={`${styles.overlayRoot} ${styles.overlayRootActive}`}
      role="status"
      aria-live="polite"
      aria-label="Navigating to new frame"
    >
      {/* ── Reduced-Motion Accessible Fallback ── */}
      {isReducedMotion ? (
        <div
          className={`${styles.reducedMotionOverlay} ${
            isClosing ? styles.reducedMotionClosing : styles.reducedMotionOpening
          }`}
        />
      ) : (
        <>
          {/* ══════════════════════════════════════════════════════════ */}
          {/* TRANSITION 01 — THROUGH THE LENS (CAMERA APERTURE IRIS)   */}
          {/* ══════════════════════════════════════════════════════════ */}
          {effect === "through-the-lens" && (
            <div
              className={`${styles.apertureStage} ${
                isFocusing
                  ? styles.apertureFocusing
                  : isClosing
                  ? styles.apertureClosing
                  : isOpening
                  ? styles.apertureOpening
                  : isRevealing
                  ? styles.apertureRevealing
                  : ""
              }`}
            >
              {/* Atmospheric Background Radial Vignette */}
              <div className={styles.apertureBackdropVignette} />

              {/* Optical Glass Streak & Flare Layer */}
              <div className={styles.opticalGlassLayer}>
                <img
                  src="/images/transitions/optical-glass.jpg"
                  alt=""
                  className={styles.opticalGlassImg}
                />
              </div>

              {/* Central Master Camera Lens Barrel */}
              <div className={styles.lensBarrel}>
                {/* Outer Precision Chassis Ring */}
                <div className={styles.lensChassisRing}>
                  <div className={styles.lensBezelRing}>
                    <span className={styles.lensTextTop}>
                      24 FRAMES PHOTOGRAPHY · 50MM F/1.2 PRIME
                    </span>
                    <span className={styles.lensTextBottom}>
                      CINEMA OPTICAL SYSTEM · CALIBRATED IRIS
                    </span>
                  </div>

                  {/* F-Stop Scale Index along bottom rim */}
                  <div className={styles.fStopScale} aria-hidden="true">
                    {F_STOPS.map((stop, idx) => (
                      <span
                        key={stop}
                        className={`${styles.fStopMark} ${
                          idx === currentFStopIdx ? styles.fStopActive : ""
                        }`}
                      >
                        <span className={styles.fStopPip} />
                        f/{stop}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Inner Photographic Chamber */}
                <div className={styles.irisChamber}>
                  {/* Dynamic Iris Aperture Mask with Outgoing & Incoming Photos */}
                  <div className={styles.irisPhotoMask}>
                    <img
                      src={outgoingImgSrc}
                      alt={outgoingVisual?.title || "Selected visual"}
                      className={`${styles.irisPhotoImg} ${styles.irisPhotoOutgoing}`}
                    />
                    <img
                      src={incomingImgSrc}
                      alt={incomingVisual?.title || "Destination visual"}
                      className={`${styles.irisPhotoImg} ${styles.irisPhotoIncoming}`}
                    />
                  </div>

                  {/* Soft Optical Bloom when Iris Opens */}
                  <div className={styles.irisCenterBloom} />

                  {/* 8-Blade Mechanical SVG Aperture Diaphragm */}
                  <svg
                    className={styles.apertureSvg}
                    viewBox="0 0 500 500"
                    aria-hidden="true"
                  >
                    <defs>
                      <radialGradient id="iris-blade-grad" cx="25%" cy="25%" r="75%">
                        <stop offset="0%" stop-color="#2a3530" />
                        <stop offset="40%" stop-color="#1b2420" />
                        <stop offset="75%" stop-color="#101714" />
                        <stop offset="100%" stop-color="#070b09" />
                      </radialGradient>
                      <linearGradient
                        id="iris-blade-stroke"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stop-color="rgba(212, 175, 55, 0.75)" />
                        <stop offset="50%" stop-color="rgba(255, 255, 255, 0.35)" />
                        <stop offset="100%" stop-color="rgba(200, 168, 78, 0.1)" />
                      </linearGradient>
                      <filter
                        id="iris-blade-shadow"
                        x="-20%"
                        y="-20%"
                        width="150%"
                        height="150%"
                      >
                        <feDropShadow
                          dx="-3"
                          dy="4"
                          stdDeviation="4.5"
                          flood-color="#000000"
                          flood-opacity="0.95"
                        />
                      </filter>
                    </defs>

                    {/* 8 Overlapping Curved Blades pivoted around casing */}
                    {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                      <g key={i} transform={`rotate(${i * 45} 250 250)`}>
                        <path
                          d={BLADE_PATH}
                          fill="url(#iris-blade-grad)"
                          stroke="url(#iris-blade-stroke)"
                          strokeWidth="1.2"
                          filter="url(#iris-blade-shadow)"
                          className={styles.apertureBlade}
                        />
                      </g>
                    ))}
                  </svg>
                </div>
              </div>

              {/* Minimal Editorial Footer Meta */}
              <div className={styles.transitionFooterMeta}>
                <span>Through The Lens</span>
                <span className={styles.metaDot}>·</span>
                <span>Optical Aperture Iris</span>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════ */}
          {/* TRANSITION 02 — VIEWFINDER LOCK (EDITORIAL CAMERA FOCUS)  */}
          {/* ══════════════════════════════════════════════════════════ */}
          {effect === "viewfinder-lock" && (
            <div
              className={`${styles.viewfinderStage} ${
                isFocusing
                  ? styles.viewfinderFocusing
                  : isClosing
                  ? styles.viewfinderClosing
                  : isOpening
                  ? styles.viewfinderOpening
                  : isRevealing
                  ? styles.viewfinderRevealing
                  : ""
              }`}
            >
              {/* Fullscreen Photographic Bridge Canvas */}
              <div className={styles.viewfinderCanvas}>
                <img
                  src={outgoingImgSrc}
                  alt={outgoingVisual?.title || "Focusing visual"}
                  className={`${styles.viewfinderPhoto} ${styles.viewfinderPhotoOutgoing}`}
                />
                <img
                  src={incomingImgSrc}
                  alt={incomingVisual?.title || "Destination visual"}
                  className={`${styles.viewfinderPhoto} ${styles.viewfinderPhotoIncoming}`}
                />
                <div className={styles.viewfinderVignetteOverlay} />
              </div>

              {/* Editorial Viewfinder HUD Layer */}
              <div className={styles.viewfinderHudLayer}>
                {/* Outer Viewfinder Corner Framing Brackets [   ] */}
                <div className={styles.outerFrameBrackets} aria-hidden="true">
                  <div className={styles.outerBracketTL} />
                  <div className={styles.outerBracketTR} />
                  <div className={styles.outerBracketBL} />
                  <div className={styles.outerBracketBR} />
                </div>

                {/* Central Autofocus Circular Reticle */}
                <div className={styles.centralFocusReticle} aria-hidden="true">
                  <div className={styles.reticleCenterDot} />
                </div>

                {/* Converging Inner Focus Target Box [ ▫ ] */}
                <div className={styles.focusTargetBox} aria-hidden="true">
                  <div className={styles.innerBracketTL} />
                  <div className={styles.innerBracketTR} />
                  <div className={styles.innerBracketBL} />
                  <div className={styles.innerBracketBR} />

                  {/* Refined "● FOCUS LOCKED" Status Badge */}
                  <div className={styles.focusLockedBadge}>
                    <span className={styles.focusStatusDot} />
                    <span className={styles.focusStatusText}>FOCUS LOCKED</span>
                  </div>
                </div>

                {/* Authentic Exposure Compensation Scale (-3 to +3) */}
                <div className={styles.exposureScaleContainer} aria-hidden="true">
                  <div className={styles.exposureTicksTrack}>
                    <div className={styles.exposureNeedle} />
                    {/* Tick Marks: 19 tick marks total (-3 to +3 with 1/3 EV ticks) */}
                    {[...Array(19)].map((_, i) => {
                      const isMajor = i % 3 === 0;
                      return (
                        <div
                          key={i}
                          className={`${styles.exposureTick} ${
                            isMajor ? styles.exposureTickMajor : ""
                          }`}
                        />
                      );
                    })}
                  </div>
                  <div className={styles.exposureNumbersRow}>
                    <span>-3</span>
                    <span>-2</span>
                    <span>-1</span>
                    <span className={styles.exposureNumZero}>0</span>
                    <span>+1</span>
                    <span>+2</span>
                    <span>+3</span>
                  </div>
                </div>
              </div>

              {/* Soft Optical Bloom Transition Overlay (No Strobe Flash) */}
              <div className={styles.opticalBloomOverlay} />

              {/* Minimal Editorial Footer Meta */}
              <div className={styles.transitionFooterMeta}>
                <span>Viewfinder Lock</span>
                <span className={styles.metaDot}>·</span>
                <span>Editorial Focus Target</span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
