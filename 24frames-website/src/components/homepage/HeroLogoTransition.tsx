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

/* Authentic Traditional South Indian Hindu Mandapam Torana Architecture
   Stepped Corbel Brackets (Bodikai), Cusped Multi-foil Arch, and Sacred Stepped Temple Kalasa Crown */
const buildBellamArchPaths = (p: number) => {
  const normP = Math.min(1, Math.max(0, p));
  if (normP >= 1) {
    return { contourD: "", veilD: "" };
  }
  const yApex = -20 + 172 * Math.pow(normP, 1.12);
  const cH = 44.8 * (1 - normP * 0.18);
  const yW = yApex + cH;

  // Traditional South Indian Torana contour scaling smoothly with scroll scrub
  const contourD = `M 0 ${yW.toFixed(1)} L 0 ${(yApex + 0.32 * cH).toFixed(1)} L 5 ${(yApex + 0.32 * cH).toFixed(1)} L 5 ${(yApex + 0.28 * cH).toFixed(1)} L 8 ${(yApex + 0.28 * cH).toFixed(1)} L 8 ${(yApex + 0.24 * cH).toFixed(1)} C 8 ${(yApex + 0.19 * cH).toFixed(1)}, 14 ${(yApex + 0.17 * cH).toFixed(1)}, 18 ${(yApex + 0.16 * cH).toFixed(1)} L 20 ${(yApex + 0.17 * cH).toFixed(1)} C 22 ${(yApex + 0.12 * cH).toFixed(1)}, 28 ${(yApex + 0.08 * cH).toFixed(1)}, 36 ${(yApex + 0.06 * cH).toFixed(1)} L 38 ${(yApex + 0.07 * cH).toFixed(1)} C 40 ${(yApex + 0.04 * cH).toFixed(1)}, 44 ${(yApex + 0.03 * cH).toFixed(1)}, 46 ${(yApex + 0.025 * cH).toFixed(1)} L 46 ${(yApex + 0.015 * cH).toFixed(1)} L 48 ${(yApex + 0.015 * cH).toFixed(1)} L 48 ${yApex.toFixed(1)} L 52 ${yApex.toFixed(1)} L 52 ${(yApex + 0.015 * cH).toFixed(1)} L 54 ${(yApex + 0.015 * cH).toFixed(1)} L 54 ${(yApex + 0.025 * cH).toFixed(1)} C 56 ${(yApex + 0.03 * cH).toFixed(1)}, 60 ${(yApex + 0.04 * cH).toFixed(1)}, 62 ${(yApex + 0.07 * cH).toFixed(1)} L 64 ${(yApex + 0.06 * cH).toFixed(1)} C 72 ${(yApex + 0.08 * cH).toFixed(1)}, 78 ${(yApex + 0.12 * cH).toFixed(1)}, 80 ${(yApex + 0.17 * cH).toFixed(1)} L 82 ${(yApex + 0.16 * cH).toFixed(1)} C 86 ${(yApex + 0.17 * cH).toFixed(1)}, 92 ${(yApex + 0.19 * cH).toFixed(1)}, 92 ${(yApex + 0.24 * cH).toFixed(1)} L 92 ${(yApex + 0.28 * cH).toFixed(1)} L 95 ${(yApex + 0.28 * cH).toFixed(1)} L 95 ${(yApex + 0.32 * cH).toFixed(1)} L 100 ${(yApex + 0.32 * cH).toFixed(1)} L 100 ${yW.toFixed(1)}`;
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
  const archRevealSvgRef = useRef<SVGSVGElement>(null);

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

      if (archRevealSvgRef.current) {
        masterTl.to(
          archRevealSvgRef.current,
          { opacity: 0, duration: 0.16, ease: "power2.out" },
          0.46
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
          if (progress >= 0.16 && progress <= 0.65) {
            const archProg = Math.min(1, Math.max(0, (progress - 0.16) / 0.36));
            const { contourD, veilD } = buildBellamArchPaths(archProg);

            if (archMaskPathRef.current) {
              archMaskPathRef.current.setAttribute("d", veilD);
              archMaskPathRef.current.style.opacity = `${Math.max(0, 1 - archProg * 1.1)}`;
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
          } else if (progress > 0.65) {
            if (archMaskPathRef.current) {
              archMaskPathRef.current.setAttribute("d", "");
              archMaskPathRef.current.style.opacity = "0";
            }
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
      {/* ── Mathematical Clip Path Defs for South Indian Hindu Mandapam Torana Arch ── */}
      <svg className={styles.svgClipDefs} width="1" height="1" viewBox="0 0 1 1">
        <defs>
          <clipPath id="mandapamArchClip" clipPathUnits="objectBoundingBox">
            <path d="M 0 1 L 0 0.32 L 0.05 0.32 L 0.05 0.28 L 0.08 0.28 L 0.08 0.24 C 0.08 0.19, 0.14 0.17, 0.18 0.16 L 0.20 0.17 C 0.22 0.12, 0.28 0.08, 0.36 0.06 L 0.38 0.07 C 0.40 0.04, 0.44 0.03, 0.46 0.025 L 0.46 0.015 L 0.48 0.015 L 0.48 0 L 0.52 0 L 0.52 0.015 L 0.54 0.015 L 0.54 0.025 C 0.56 0.03, 0.60 0.04, 0.62 0.07 L 0.64 0.06 C 0.72 0.08, 0.78 0.12, 0.80 0.17 L 0.82 0.16 C 0.86 0.17, 0.92 0.19, 0.92 0.24 L 0.92 0.28 L 0.95 0.28 L 0.95 0.32 L 1 0.32 L 1 1 Z" />
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
                  ref={archRevealSvgRef}
                  className={styles.archRevealSvg}
                  viewBox="0 0 100 140"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <defs>
                    <radialGradient id="archPalaceVeilGradHero" cx="50%" cy="18%" r="80%">
                      <stop offset="0%" stopColor="#082A20" />
                      <stop offset="75%" stopColor="#061A12" />
                      <stop offset="100%" stopColor="#061A12" />
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

                {/* Permanent Traditional South Indian Hindu Mandapam Torana Architectural Frame */}
                <svg
                  className={styles.mandapamArchitecturalBorderSvg}
                  viewBox="0 0 100 140"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <defs>
                    <linearGradient id="goldToranaBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#F5E29E" />
                      <stop offset="30%" stopColor="#D4AF37" />
                      <stop offset="65%" stopColor="#8C6E26" />
                      <stop offset="100%" stopColor="#C8A84E" />
                    </linearGradient>
                  </defs>
                  {/* Outer Torana Contour */}
                  <path
                    d="M 0 140 L 0 44.8 L 5 44.8 L 5 39.2 L 8 39.2 L 8 33.6 C 8 26.6, 14 23.8, 18 22.4 L 20 23.8 C 22 16.8, 28 11.2, 36 8.4 L 38 9.8 C 40 5.6, 44 4.2, 46 3.5 L 46 2.1 L 48 2.1 L 48 0 L 52 0 L 52 2.1 L 54 2.1 L 54 3.5 C 56 4.2, 60 5.6, 62 9.8 L 64 8.4 C 72 11.2, 78 16.8, 80 23.8 L 82 22.4 C 86 23.8, 92 26.6, 92 33.6 L 92 39.2 L 95 39.2 L 95 44.8 L 100 44.8 L 100 140"
                    fill="none"
                    stroke="url(#goldToranaBorderGrad)"
                    strokeWidth="1.2"
                    strokeOpacity="0.88"
                  />
                  {/* Subtle Inner Carved Relief Line */}
                  <path
                    d="M 1.5 140 L 1.5 46 L 6.5 46 L 6.5 40.5 L 9.5 40.5 L 9.5 35 C 9.5 28.5, 15 25.5, 19 24.2 L 20.8 25.5 C 23 18.5, 29 13, 37 10.2 L 38.8 11.5 C 41 7.5, 45 6, 47 5.2 L 47 3.8 L 49 3.8 L 49 1.5 L 51 1.5 L 51 3.8 L 53 3.8 L 53 5.2 C 55 6, 59 7.5, 61.2 11.5 L 63 10.2 C 71 13, 77 18.5, 79.2 25.5 L 81 24.2 C 85 25.5, 90.5 28.5, 90.5 35 L 90.5 40.5 L 93.5 40.5 L 93.5 46 L 98.5 46 L 98.5 140"
                    fill="none"
                    stroke="#D4AF37"
                    strokeWidth="0.5"
                    strokeOpacity="0.4"
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
