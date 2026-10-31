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

/* Authentic Cusped Torana Arch Silhouette derivation */
const buildBellamArchPaths = (p: number) => {
  const yApex = -20 + 170 * Math.pow(Math.min(1, Math.max(0, p)), 1.1);
  const cH = 44.8 * (1 - p * 0.2);
  const yW = yApex + cH;

  const contourD = `M 0 ${yW.toFixed(1)} L 0 ${(yApex + 0.72 * cH).toFixed(1)} C 0 ${(yApex + 0.54 * cH).toFixed(1)}, 8 ${(yApex + 0.54 * cH).toFixed(1)}, 14 ${(yApex + 0.45 * cH).toFixed(1)} C 18 ${(yApex + 0.38 * cH).toFixed(1)}, 24 ${(yApex + 0.40 * cH).toFixed(1)}, 28 ${(yApex + 0.31 * cH).toFixed(1)} C 33 ${(yApex + 0.20 * cH).toFixed(1)}, 40 ${(yApex + 0.18 * cH).toFixed(1)}, 46 ${(yApex + 0.07 * cH).toFixed(1)} C 48 ${(yApex + 0.02 * cH).toFixed(1)}, 49 ${yApex.toFixed(1)}, 50 ${yApex.toFixed(1)} C 51 ${yApex.toFixed(1)}, 52 ${(yApex + 0.02 * cH).toFixed(1)}, 54 ${(yApex + 0.07 * cH).toFixed(1)} C 60 ${(yApex + 0.18 * cH).toFixed(1)}, 67 ${(yApex + 0.20 * cH).toFixed(1)}, 72 ${(yApex + 0.31 * cH).toFixed(1)} C 76 ${(yApex + 0.40 * cH).toFixed(1)}, 82 ${(yApex + 0.38 * cH).toFixed(1)}, 86 ${(yApex + 0.45 * cH).toFixed(1)} C 92 ${(yApex + 0.54 * cH).toFixed(1)}, 100 ${(yApex + 0.54 * cH).toFixed(1)}, 100 ${(yApex + 0.72 * cH).toFixed(1)} L 100 ${yW.toFixed(1)}`;
  const veilD = `${contourD} L 100 144 L 0 144 Z`;
  return { contourD, veilD };
};

export default function HeroLogoTransition({
  heroSectionRef,
  heroImageRef,
  headlineRef,
  metadataRef,
  topBarRef,
}: HeroLogoTransitionProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const greenBackdropRef = useRef<HTMLDivElement>(null);
  const ivoryBackdropRef = useRef<HTMLDivElement>(null);
  const logoWrapRef = useRef<HTMLDivElement>(null);
  const vowsStageWrapRef = useRef<HTMLDivElement>(null);
  const openingLeftColRef = useRef<HTMLDivElement>(null);
  const openingCenterColRef = useRef<HTMLDivElement>(null);
  const openingRightColRef = useRef<HTMLDivElement>(null);

  const archMaskPathRef = useRef<SVGPathElement>(null);
  const archContourPathRef = useRef<SVGPathElement>(null);
  const archGlowRef = useRef<HTMLDivElement>(null);
  const archedPhotoImgRef = useRef<HTMLImageElement>(null);

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
          greenBackdropRef.current,
          ivoryBackdropRef.current,
          logoWrapRef.current,
          vowsStageWrapRef.current,
        ],
        { opacity: 0 }
      );
      if (openingLeftColRef.current) gsap.set(openingLeftColRef.current, { opacity: 0, x: -24 });
      if (openingRightColRef.current) gsap.set(openingRightColRef.current, { opacity: 0, x: 24 });
      if (openingCenterColRef.current) gsap.set(openingCenterColRef.current, { opacity: 0, scale: 0.88 });
      if (archedPhotoImgRef.current) {
        gsap.set(archedPhotoImgRef.current, { opacity: 0, scale: 1.05, filter: "blur(6px) brightness(0.75)" });
      }

      // Master timeline scrubbed by ScrollTrigger
      const masterTl = gsap.timeline({
        paused: true,
        defaults: { ease: "none" },
      });

      // ── Stage A: 0.00 – 0.15 (Hero Dissolve & Living Green 24 FRAMES Logo Hold) ──
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

      if (greenBackdropRef.current) {
        masterTl.fromTo(
          greenBackdropRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.12, ease: "power2.inOut" },
          0.00
        );
      }

      if (logoWrapRef.current) {
        masterTl.fromTo(
          logoWrapRef.current,
          { opacity: 0, scale: 0.95 },
          { opacity: 1, scale: 1.0, duration: 0.12, ease: "power2.out" },
          0.02
        );
        // Living depth / breathing illumination
        masterTl.to(
          logoWrapRef.current,
          { scale: 1.02, duration: 0.03, ease: "power1.inOut" },
          0.12
        );
      }

      // ── Stage B: 0.15 – 0.35 (Logo morphs into Mandapam Arch silhouette) ──
      if (logoWrapRef.current) {
        masterTl.to(
          logoWrapRef.current,
          { opacity: 0, scale: 0.94, duration: 0.14, ease: "power2.in" },
          0.15
        );
      }

      if (vowsStageWrapRef.current) {
        masterTl.fromTo(
          vowsStageWrapRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.14, ease: "power2.out" },
          0.18
        );
      }

      if (openingCenterColRef.current) {
        masterTl.fromTo(
          openingCenterColRef.current,
          { opacity: 0, scale: 0.88 },
          { opacity: 1, scale: 0.94, duration: 0.17, ease: "power2.out" },
          0.18
        );
      }

      // ── Stage C: 0.30 – 0.55 (Arch Defined & Background Ivory Transition) ──
      if (ivoryBackdropRef.current) {
        masterTl.fromTo(
          ivoryBackdropRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.22, ease: "power2.inOut" },
          0.30
        );
      }

      if (openingCenterColRef.current) {
        masterTl.to(
          openingCenterColRef.current,
          { scale: 1.0, duration: 0.20, ease: "power2.out" },
          0.35
        );
      }

      if (archedPhotoImgRef.current) {
        masterTl.fromTo(
          archedPhotoImgRef.current,
          { opacity: 0, filter: "blur(6px) brightness(0.75)" },
          { opacity: 1, filter: "blur(1.5px) brightness(0.95)", duration: 0.22, ease: "power2.out" },
          0.32
        );
      }

      // ── Stage D: 0.45 – 0.70 (Photo Scaling, Alignment & Crystal Clarity) ──
      if (archedPhotoImgRef.current) {
        masterTl.to(
          archedPhotoImgRef.current,
          {
            scale: 1.0,
            filter: "blur(0px) brightness(1.0)",
            duration: 0.25,
            ease: "power2.out",
          },
          0.45
        );
      }

      // ── Stage E: 0.55 – 0.80 (The Vows Side Text Entrances) ──
      if (openingLeftColRef.current) {
        masterTl.fromTo(
          openingLeftColRef.current,
          { opacity: 0, x: -24 },
          { opacity: 1, x: 0, duration: 0.22, ease: "power2.out" },
          0.55
        );
      }

      if (openingRightColRef.current) {
        masterTl.fromTo(
          openingRightColRef.current,
          { opacity: 0, x: 24 },
          { opacity: 1, x: 0, duration: 0.22, ease: "power2.out" },
          0.57
        );
      }

      // ── Stage F: 0.80 – 1.00 (Full 3-Column Composition Settled & Holding) ──
      masterTl.to({}, { duration: 0.20 }, 0.80);

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

          // Update header theme synchronously: dark green intro -> warm ivory
          const nextHeaderTheme = progress >= 0.45 ? "light" : "dark";
          if (document.documentElement.dataset.heroHeaderTheme !== nextHeaderTheme) {
            document.documentElement.dataset.heroHeaderTheme = nextHeaderTheme;
            // Dispatch custom event so Navigation updates smoothly
            window.dispatchEvent(new Event("scroll"));
          }

          // Dynamic Arch Contour & Mask Scrubbing
          if (progress >= 0.16 && progress <= 0.80) {
            const archProg = Math.min(1, Math.max(0, (progress - 0.16) / 0.48));
            const { contourD, veilD } = buildBellamArchPaths(archProg);

            if (archMaskPathRef.current) {
              archMaskPathRef.current.setAttribute("d", veilD);
            }
            if (archContourPathRef.current) {
              archContourPathRef.current.setAttribute("d", contourD);
              archContourPathRef.current.style.opacity = archProg > 0.85 ? `${Math.max(0, 1 - (archProg - 0.85) / 0.15)}` : "1";
            }
            if (archGlowRef.current) {
              const glowOp = archProg < 0.35 ? (archProg / 0.35) * 0.85 : Math.max(0, 0.85 * (1 - (archProg - 0.35) / 0.65));
              archGlowRef.current.style.opacity = `${glowOp}`;
              archGlowRef.current.style.transform = `scale(${0.7 + archProg * 0.5})`;
            }
          } else if (progress > 0.80) {
            if (archContourPathRef.current) archContourPathRef.current.style.opacity = "0";
            if (archGlowRef.current) archGlowRef.current.style.opacity = "0";
          }

          // Boundary Reset on Reverse to Hero
          if (progress <= 0.005) {
            document.documentElement.dataset.heroHeaderTheme = "dark";
            if (greenBackdropRef.current) greenBackdropRef.current.style.opacity = "0";
            if (ivoryBackdropRef.current) ivoryBackdropRef.current.style.opacity = "0";
            if (logoWrapRef.current) logoWrapRef.current.style.opacity = "0";
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
      {/* ── Mathematical Clip Path Defs for Arch ── */}
      <svg className={styles.svgClipDefs} width="1" height="1" viewBox="0 0 1 1">
        <defs>
          <clipPath id="mandapamArchClip" clipPathUnits="objectBoundingBox">
            <path d="M 0 1 L 0 0.32 C 0 0.24, 0.08 0.24, 0.14 0.20 C 0.18 0.17, 0.24 0.18, 0.28 0.14 C 0.33 0.09, 0.40 0.08, 0.46 0.03 C 0.48 0.01, 0.49 0.00, 0.50 0.00 C 0.51 0.00, 0.52 0.01, 0.54 0.03 C 0.60 0.08, 0.67 0.09, 0.72 0.14 C 0.76 0.18, 0.82 0.17, 0.86 0.20 C 0.92 0.24, 1.00 0.24, 1.00 0.32 L 1 1 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* ── Deep Luxury Green Backdrop (Living Tonal Illumination) ── */}
      <div ref={greenBackdropRef} className={styles.backdropGreen} />

      {/* ── Warm Ivory Backdrop (Transforms into The Vows) ── */}
      <div ref={ivoryBackdropRef} className={styles.backdropIvory} />

      {/* ── Authentic 24 FRAMES Studio Signature ── */}
      <div ref={logoWrapRef} className={styles.logoWrap}>
        <picture>
          <source srcSet="/images/logo-light-header.webp" type="image/webp" />
          <img
            src="/images/logo-light-header.png"
            alt="24 FRAMES · Phani Gogireddy"
            className={styles.logoImage}
            loading="eager"
          />
        </picture>
      </div>

      {/* ── The Vows 3-Column Editorial Stage ── */}
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

          {/* Center Column: Arched Mandapam Portrait (Bellamkonda & Kavya) */}
          <div ref={openingCenterColRef} className={styles.openingCenterCol}>
            <Link
              href="/stories/bellam-srikonda"
              className={styles.archedPhotoLink}
              aria-label="Open featured commission: Bellamkonda Sai Sreenivas & Kavya Reddy"
            >
              <div className={styles.archedFrame}>
                <picture>
                  <source srcSet="/images/stories/bellam-srikonda/IMG_6339.webp" type="image/webp" />
                  <img
                    ref={archedPhotoImgRef}
                    src="/images/stories/bellam-srikonda/IMG_6339.jpg"
                    alt="Bellamkonda Sai Sreenivas & Kavya Reddy"
                    className={styles.archedPhotoImg}
                    loading="eager"
                  />
                </picture>
                <div className={styles.photoSheenOverlay} />

                {/* Mandapam Arch Reveal SVG */}
                <svg
                  className={styles.archRevealSvg}
                  viewBox="0 0 100 140"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <defs>
                    <radialGradient id="archPalaceVeilGradHero" cx="50%" cy="18%" r="80%">
                      <stop offset="0%" stopColor="#092a23" />
                      <stop offset="75%" stopColor="#061812" />
                      <stop offset="100%" stopColor="#04100c" />
                    </radialGradient>
                  </defs>
                  <path ref={archMaskPathRef} fill="url(#archPalaceVeilGradHero)" />
                  <path
                    ref={archContourPathRef}
                    fill="none"
                    stroke="#D4AF37"
                    strokeWidth="1.6"
                    strokeOpacity="0.85"
                  />
                </svg>
                <div ref={archGlowRef} className={styles.archApexGlow} />
              </div>
            </Link>
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

            <p className={styles.featuredVenueSub}>GMR ARENA &amp; SHAMSHABAD ESTATE, HYDERABAD</p>

            <p className={styles.featuredStoryCopy}>
              The quiet and overwhelming union of two people, set against the grandeur
              of celebration, personal moments, and everything in between. A wedding
              captured with honesty, cinematic depth and timeless transitions.
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
              <span className={styles.actionArrow}>——→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
