"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./HeroLogoTransition.module.css";

gsap.registerPlugin(ScrollTrigger);

interface HeroLogoTransitionProps {
  heroSectionRef: React.RefObject<HTMLElement | null>;
  heroImageRef: React.RefObject<HTMLImageElement | null>;
  headlineRef: React.RefObject<HTMLDivElement | null>;
  metadataRef: React.RefObject<HTMLDivElement | null>;
  topBarRef: React.RefObject<HTMLDivElement | null>;
}

export default function HeroLogoTransition({
  heroSectionRef,
  heroImageRef,
  headlineRef,
  metadataRef,
  topBarRef,
}: HeroLogoTransitionProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const darkBackdropRef = useRef<HTMLDivElement>(null);
  const ivoryBackdropRef = useRef<HTMLDivElement>(null);

  // Stage 01 & 02: Authentic Original 24 FRAMES Studio Logo File
  const logoWrapRef = useRef<HTMLDivElement>(null);
  const aGlowSpotRef = useRef<HTMLDivElement>(null);

  // Stage 03, 04, 05: The Transforming 'A' / Triangle Vector Frame
  const transformingAContainerRef = useRef<HTMLDivElement>(null);
  const apexGlowRef = useRef<HTMLDivElement>(null);
  const letterACrossbarRef = useRef<SVGLineElement>(null);
  const innerTriangleRef = useRef<SVGPolygonElement>(null);
  const photoRevealGroupRef = useRef<SVGGElement>(null);

  // Stage 06: The Vows 3-Column Editorial Stage on Warm Luxury Ivory
  const vowsStageWrapRef = useRef<HTMLDivElement>(null);
  const openingLeftColRef = useRef<HTMLDivElement>(null);
  const openingCenterColRef = useRef<HTMLDivElement>(null);
  const openingRightColRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReducedMotion) {
      if (rootRef.current) rootRef.current.style.display = "none";
      return;
    }

    if (!heroSectionRef.current) return;

    const ctx = gsap.context(() => {
      // Initialize states
      gsap.set(
        [
          darkBackdropRef.current,
          ivoryBackdropRef.current,
          logoWrapRef.current,
          vowsStageWrapRef.current,
        ],
        { opacity: 0 }
      );

      // Transforming 'A' initial state: positioned over letter 'A' of the original logo
      if (transformingAContainerRef.current) {
        gsap.set(transformingAContainerRef.current, {
          opacity: 0,
          scale: 0.20,
          x: 18,
          y: 12,
        });
      }

      if (aGlowSpotRef.current) gsap.set(aGlowSpotRef.current, { opacity: 0 });
      if (apexGlowRef.current) gsap.set(apexGlowRef.current, { opacity: 0 });
      if (letterACrossbarRef.current) gsap.set(letterACrossbarRef.current, { opacity: 1 });
      if (innerTriangleRef.current) gsap.set(innerTriangleRef.current, { opacity: 0 });
      if (photoRevealGroupRef.current) gsap.set(photoRevealGroupRef.current, { opacity: 0, scale: 1.05 });

      if (openingLeftColRef.current) gsap.set(openingLeftColRef.current, { opacity: 0, x: -28 });
      if (openingRightColRef.current) gsap.set(openingRightColRef.current, { opacity: 0, x: 28 });

      // Master timeline scrubbed by ScrollTrigger
      const masterTl = gsap.timeline({
        paused: true,
        defaults: { ease: "none" },
      });

      // ── Stage 01: 0.00 – 0.15 (Hero Dissolves -> Authentic Original Logo Appears on Dark) ──
      if (heroImageRef.current) {
        masterTl.to(
          heroImageRef.current,
          { opacity: 0, scale: 1.025, duration: 0.12, ease: "power2.inOut" },
          0.00
        );
      }
      if (headlineRef.current) {
        masterTl.to(headlineRef.current, { opacity: 0, y: -14, duration: 0.10, ease: "power2.in" }, 0.00);
      }
      if (metadataRef.current) {
        masterTl.to(metadataRef.current, { opacity: 0, y: 14, duration: 0.10, ease: "power2.in" }, 0.00);
      }
      if (topBarRef.current) {
        masterTl.to(topBarRef.current, { opacity: 0, duration: 0.09, ease: "power1.in" }, 0.00);
      }

      // Deep cinematic backdrop emerges
      if (darkBackdropRef.current) {
        masterTl.fromTo(
          darkBackdropRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.12, ease: "power2.inOut" },
          0.00
        );
      }

      // Authentic Original 24 FRAMES Studio Logo File appears in center
      if (logoWrapRef.current) {
        masterTl.fromTo(
          logoWrapRef.current,
          { opacity: 0, scale: 0.95 },
          { opacity: 1, scale: 1.0, duration: 0.12, ease: "power2.out" },
          0.02
        );
      }

      // ── Stage 02: 0.15 – 0.30 (Focus on "A" in Original Logo — Glows in Champagne-Gold) ──
      if (aGlowSpotRef.current) {
        masterTl.fromTo(
          aGlowSpotRef.current,
          { opacity: 0, scale: 0.5 },
          { opacity: 1.0, scale: 1.0, duration: 0.14, ease: "power2.out" },
          0.15
        );
      }

      // ── Stage 03: 0.28 – 0.48 ("A" Transforms — Expands, Crossbar Dissolves, Double-Line Frame Forms) ──
      // Original logo fades out as the transforming 'A' expands from it
      if (logoWrapRef.current) {
        masterTl.to(
          logoWrapRef.current,
          { opacity: 0, duration: 0.12, ease: "power2.in" },
          0.28
        );
      }

      // The Transforming 'A' container fades in at letter position and expands to center frame
      if (transformingAContainerRef.current) {
        masterTl.fromTo(
          transformingAContainerRef.current,
          { opacity: 0, scale: 0.20, x: 18, y: 12 },
          {
            opacity: 1,
            scale: 1.0,
            x: 0,
            y: 0,
            duration: 0.20,
            ease: "power2.inOut",
          },
          0.28
        );
      }

      // Apex backlight blooms as frame expands
      if (apexGlowRef.current) {
        masterTl.fromTo(
          apexGlowRef.current,
          { opacity: 0, scale: 0.6 },
          { opacity: 0.85, scale: 1.0, duration: 0.16, ease: "power2.out" },
          0.30
        );
      }

      // Crossbar of the 'A' dissolves as it opens into an aperture
      if (letterACrossbarRef.current) {
        masterTl.to(
          letterACrossbarRef.current,
          { opacity: 0, duration: 0.14, ease: "power2.out" },
          0.30
        );
      }

      // Inner parallel champagne-gold triangle outline fades in (Double-line architectural frame)
      if (innerTriangleRef.current) {
        masterTl.fromTo(
          innerTriangleRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.16, ease: "power2.out" },
          0.32
        );
      }

      // ── Stage 04 & 05: 0.42 – 0.65 (Warm Luxury Ivory Backdrop Emerges & Photo Reveals) ──
      // Canvas transitions from dark into the signature Warm Luxury Ivory theme of the website
      if (ivoryBackdropRef.current) {
        masterTl.fromTo(
          ivoryBackdropRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.20, ease: "power2.inOut" },
          0.40
        );
      }

      // Wedding photograph reveals inside the triangular aperture
      if (photoRevealGroupRef.current) {
        masterTl.fromTo(
          photoRevealGroupRef.current,
          { opacity: 0, scale: 1.04 },
          { opacity: 1, scale: 1.0, duration: 0.20, ease: "power2.out" },
          0.44
        );
      }

      // Bring in The Vows stage container
      if (vowsStageWrapRef.current) {
        masterTl.fromTo(
          vowsStageWrapRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.16, ease: "power2.out" },
          0.48
        );
      }

      // ── Stage 06: 0.60 – 0.82 (The Vows Content Arrives over Warm Luxury Ivory) ──
      if (openingLeftColRef.current) {
        masterTl.fromTo(
          openingLeftColRef.current,
          { opacity: 0, x: -28 },
          { opacity: 1, x: 0, duration: 0.20, ease: "power2.out" },
          0.60
        );
      }

      if (openingRightColRef.current) {
        masterTl.fromTo(
          openingRightColRef.current,
          { opacity: 0, x: 28 },
          { opacity: 1, x: 0, duration: 0.20, ease: "power2.out" },
          0.62
        );
      }

      // ── Hold for Reading & Interaction ──
      masterTl.to({}, { duration: 0.18 }, 0.82);

      // ── ScrollTrigger Pinning ──
      const isMobile = window.innerWidth < 820;
      const pinDistance = isMobile ? "+=180%" : "+=240%";

      ScrollTrigger.create({
        trigger: heroSectionRef.current,
        start: "top top",
        end: pinDistance,
        pin: true,
        scrub: 0.5,
        onUpdate: (self) => {
          const progress = self.progress;
          masterTl.progress(progress);

          // Synchronize header theme: dark on hero & dark logo intro -> light on Warm Luxury Ivory
          const nextHeaderTheme = progress >= 0.45 ? "light" : "dark";
          if (document.documentElement.dataset.heroHeaderTheme !== nextHeaderTheme) {
            document.documentElement.dataset.heroHeaderTheme = nextHeaderTheme;
            window.dispatchEvent(new Event("scroll"));
          }

          // Boundary Reset on Reverse to Hero Top
          if (progress <= 0.005) {
            document.documentElement.dataset.heroHeaderTheme = "dark";
            if (darkBackdropRef.current) darkBackdropRef.current.style.opacity = "0";
            if (ivoryBackdropRef.current) ivoryBackdropRef.current.style.opacity = "0";
            if (logoWrapRef.current) logoWrapRef.current.style.opacity = "0";
            if (aGlowSpotRef.current) aGlowSpotRef.current.style.opacity = "0";
            if (transformingAContainerRef.current) {
              transformingAContainerRef.current.style.opacity = "0";
              transformingAContainerRef.current.style.transform = "translate(-50%, -50%) scale(0.20) translate(18px, 12px)";
            }
            if (apexGlowRef.current) apexGlowRef.current.style.opacity = "0";
            if (letterACrossbarRef.current) letterACrossbarRef.current.style.opacity = "1";
            if (innerTriangleRef.current) innerTriangleRef.current.style.opacity = "0";
            if (photoRevealGroupRef.current) photoRevealGroupRef.current.style.opacity = "0";
            if (vowsStageWrapRef.current) vowsStageWrapRef.current.style.opacity = "0";
            if (heroImageRef.current) {
              heroImageRef.current.style.opacity = "1";
              heroImageRef.current.style.filter = "none";
              heroImageRef.current.style.transform = "none";
            }
            if (headlineRef.current) {
              headlineRef.current.style.opacity = "1";
              headlineRef.current.style.transform = "none";
            }
            if (metadataRef.current) {
              metadataRef.current.style.opacity = "1";
              metadataRef.current.style.transform = "none";
            }
            if (topBarRef.current) {
              topBarRef.current.style.opacity = "1";
            }
          }
        },
      });
    }, heroSectionRef);

    return () => {
      ctx.revert();
      delete document.documentElement.dataset.heroHeaderTheme;
      if (heroImageRef.current) {
        heroImageRef.current.style.opacity = "";
        heroImageRef.current.style.filter = "";
        heroImageRef.current.style.transform = "";
      }
      if (headlineRef.current) {
        headlineRef.current.style.opacity = "";
        headlineRef.current.style.transform = "";
      }
      if (metadataRef.current) {
        metadataRef.current.style.opacity = "";
        metadataRef.current.style.transform = "";
      }
      if (topBarRef.current) {
        topBarRef.current.style.opacity = "";
      }
    };
  }, [heroSectionRef, heroImageRef, headlineRef, metadataRef, topBarRef]);

  return (
    <div ref={rootRef} className={styles.transitionRoot} aria-hidden="true">
      {/* ── Cinematic Dark Backdrop for Studio Logo Intro ── */}
      <div ref={darkBackdropRef} className={styles.backdropDark} />

      {/* ── Warm Luxury Ivory Backdrop for The Vows & Site Harmony ── */}
      <div ref={ivoryBackdropRef} className={styles.backdropIvory} />

      {/* ── STAGE 01 & 02: Authentic Original 24 FRAMES Logo File ── */}
      <div ref={logoWrapRef} className={styles.logoWrap}>
        <picture>
          <source srcSet="/images/logo-light-header.webp" type="image/webp" />
          <img
            src="/images/logo-light.png"
            alt="24 FRAMES · Phani Gogireddy"
            className={styles.originalLogoImage}
            loading="eager"
          />
        </picture>
        {/* Warm Champagne-Gold Ambient Illumination directly on the letter 'A' */}
        <div ref={aGlowSpotRef} className={styles.aGlowSpot} />
      </div>

      {/* ── STAGE 03, 04, 05: The Transforming Letter 'A' / Double-Line Triangular Frame ── */}
      <div ref={transformingAContainerRef} className={styles.transformingAContainer}>
        {/* Ambient Warm Golden Backlight behind Apex */}
        <div ref={apexGlowRef} className={styles.apexBacklight} />

        <div className={styles.triangleFrameWrap}>
          <svg
            viewBox="0 0 1000 1000"
            className={styles.triangleSvg}
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="vowsChampagneGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#DFD1AC" />
                <stop offset="50%" stopColor="#C8A84E" />
                <stop offset="100%" stopColor="#D9BF7E" />
              </linearGradient>

              {/* Precise triangular photographic aperture */}
              <clipPath id="vowsTrianglePhotoClip">
                <polygon points="500,185 830,845 170,845" />
              </clipPath>
            </defs>

            {/* 1. Photograph inside Triangular Window (Revealed in Stage 04) */}
            <g ref={photoRevealGroupRef} clipPath="url(#vowsTrianglePhotoClip)">
              <image
                href="/images/stories/bellam-srikonda/IMG_6339.webp"
                x="80"
                y="100"
                width="840"
                height="1130"
                preserveAspectRatio="none"
              />
              {/* Subtle champagne-gold cinematic ambient tint */}
              <polygon
                points="500,185 830,845 170,845"
                fill="url(#vowsChampagneGold)"
                opacity="0.04"
              />
            </g>

            {/* 2. Inner Parallel Champagne-Gold Triangle Outline (Fades in during Stage 03) */}
            <polygon
              ref={innerTriangleRef}
              points="500,185 830,845 170,845"
              fill="none"
              stroke="url(#vowsChampagneGold)"
              strokeWidth="2.2"
            />

            {/* 3. Outer Geometric Triangle Frame with Extended Drafting Accents */}
            <g>
              {/* Left Diagonal (from apex down to bottom-left drafting extension) */}
              <line
                x1="500"
                y1="80"
                x2="80"
                y2="920"
                stroke="url(#vowsChampagneGold)"
                strokeWidth="2.8"
                strokeLinecap="square"
              />
              {/* Right Diagonal (from apex down to bottom-right drafting extension) */}
              <line
                x1="500"
                y1="80"
                x2="920"
                y2="920"
                stroke="url(#vowsChampagneGold)"
                strokeWidth="2.8"
                strokeLinecap="square"
              />
              {/* Horizontal Base (extending slightly past left and right drafting vertices) */}
              <line
                x1="60"
                y1="860"
                x2="940"
                y2="860"
                stroke="url(#vowsChampagneGold)"
                strokeWidth="2.8"
                strokeLinecap="square"
              />

              {/* Delicate corner vertex markers */}
              <rect x="96" y="856" width="8" height="8" fill="url(#vowsChampagneGold)" opacity="0.85" />
              <rect x="896" y="856" width="8" height="8" fill="url(#vowsChampagneGold)" opacity="0.85" />
              <rect x="496" y="76" width="8" height="8" fill="url(#vowsChampagneGold)" opacity="0.85" />
            </g>

            {/* 4. Crossbar of the Letter 'A' (Dissolves during Stage 03 transformation) */}
            <line
              ref={letterACrossbarRef}
              x1="330"
              y1="620"
              x2="670"
              y2="620"
              stroke="url(#vowsChampagneGold)"
              strokeWidth="16"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* ── STAGE 06: The Vows 3-Column Editorial Stage on Warm Luxury Ivory ── */}
      <div id="vows" ref={vowsStageWrapRef} className={styles.vowsStageWrap}>
        <div className={styles.vowsComposition}>
          {/* Left Column: Title & Editorial Thesis */}
          <div ref={openingLeftColRef} className={styles.openingLeftCol}>
            <div className={styles.chapterBadgeRow}>
              <span className={styles.chapterLabel}>THE VOWS</span>
              <span className={styles.labelDividerLine} />
            </div>

            <h2 className={styles.monumentalHeading}>
              <span className={styles.headingThe}>The</span>
              <span className={styles.headingVows}>Vows</span>
            </h2>

            <p className={styles.openingNarrative}>
              An anthology of love in its truest, timeless, most authentic form.
              Intimate stories, iconic days, and 35mm inspired imagery of real human souls.
            </p>

            <a href="#stories-showcase" className={styles.exploreActionBtn}>
              <span className={styles.exploreCircleIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className={styles.exploreActionText}>EXPLORE THE STORIES</span>
            </a>
          </div>

          {/* Center Column: Anchor space for the transformed triangular frame */}
          <div ref={openingCenterColRef} className={styles.openingCenterCol}>
            <Link
              href="/stories/bellam-srikonda"
              className={styles.triangleLinkOverlay}
              aria-label="Open featured commission: Bellamkonda Sai Sreenivas & Kavya Reddy"
            />
          </div>

          {/* Right Column: Featured Commission Details & Metadata */}
          <div ref={openingRightColRef} className={styles.openingRightCol}>
            <div className={styles.featuredBadgeRow}>
              <span className={styles.featuredCommissionLabel}>FEATURED COMMISSION</span>
              <span className={styles.labelDividerLine} />
            </div>

            <h3 className={styles.featuredCoupleName}>
              <Link href="/stories/bellam-srikonda" className={styles.nameLink}>
                Bellamkonda Sai Sreenivas &amp; Kavya Reddy
              </Link>
            </h3>

            <p className={styles.featuredVenueSub}>
              GMR ARENA &amp; SHAMSHABAD ESTATE, HYDERABAD
            </p>

            <p className={styles.featuredStoryCopy}>
              The quiet and overwhelming union of two people, set against
              the grandeur of celebration, personal moments, and
              everything in between. A wedding captured with honesty,
              cinematic depth and timeless transitions.
            </p>

            <div className={styles.specsTable}>
              <div className={styles.specRow}>
                <span className={styles.specKey}>DISCIPLINE</span>
                <span className={styles.specValue}>Celebrity Wedding</span>
              </div>
              <div className={styles.specRow}>
                <span className={styles.specKey}>LOCATION</span>
                <span className={styles.specValue}>Hyderabad</span>
              </div>
              <div className={styles.specRow}>
                <span className={styles.specKey}>OPTICAL CREW</span>
                <span className={styles.specValue}>35mm Prime Cinema Optics</span>
              </div>
              <div className={styles.specRow}>
                <span className={styles.specKey}>ARCHIVE ACCESS</span>
                <span className={styles.specValue}>Curated Master Story</span>
              </div>
            </div>

            <Link href="/stories/bellam-srikonda" className={styles.btnViewStory}>
              <span>VIEW FULL COMMISSION</span>
              <span className={styles.actionArrow}>—</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
