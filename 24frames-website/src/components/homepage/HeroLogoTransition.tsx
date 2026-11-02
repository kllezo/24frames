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
  const greenBackdropRef = useRef<HTMLDivElement>(null);
  const ivoryBackdropRef = useRef<HTMLDivElement>(null);
  const logoWrapRef = useRef<HTMLDivElement>(null);
  const vowsStageWrapRef = useRef<HTMLDivElement>(null);
  const openingLeftColRef = useRef<HTMLDivElement>(null);
  const headingTheRef = useRef<HTMLSpanElement>(null);
  const headingVowsRef = useRef<HTMLSpanElement>(null);
  const openingCenterColRef = useRef<HTMLDivElement>(null);
  const openingRightColRef = useRef<HTMLDivElement>(null);

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
      if (openingLeftColRef.current) gsap.set(openingLeftColRef.current, { opacity: 0 });
      if (headingTheRef.current) gsap.set(headingTheRef.current, { opacity: 0, y: 18, filter: "blur(6px)" });
      if (headingVowsRef.current) {
        gsap.set(headingVowsRef.current, {
          opacity: 0,
          y: 14,
          scale: 0.95,
          WebkitMaskPosition: "100% 0",
          maskPosition: "100% 0",
        });
      }
      if (openingCenterColRef.current) gsap.set(openingCenterColRef.current, { opacity: 0, scale: 0.94 });
      if (openingRightColRef.current) gsap.set(openingRightColRef.current, { opacity: 0, y: 24 });
      if (archedPhotoImgRef.current) {
        gsap.set(archedPhotoImgRef.current, { opacity: 1, scale: 1.0 });
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
          { scale: 1.02, duration: 0.04, ease: "power1.inOut" },
          0.12
        );
      }

      // ── Stage B: 0.16 – 0.26 (Logo smoothly dissolves out as warm ivory emerges) ──
      if (logoWrapRef.current) {
        masterTl.to(
          logoWrapRef.current,
          { opacity: 0, scale: 1.04, duration: 0.10, ease: "power2.in" },
          0.16
        );
      }

      if (ivoryBackdropRef.current) {
        masterTl.fromTo(
          ivoryBackdropRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.14, ease: "power2.inOut" },
          0.18
        );
      }

      if (vowsStageWrapRef.current) {
        masterTl.fromTo(
          vowsStageWrapRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.10, ease: "power2.out" },
          0.20
        );
      }

      // ── STEP 1: 0.20 – 0.46: THE VOWS CINEMATIC TITLE REVEAL ──
      // Organic, delicate, memorable entrance like a luxury wedding film opening title:
      // "The" softly breathes in with gentle focus pull, followed by "Vows" sweeping in with a delicate ink-spread reveal
      if (openingLeftColRef.current) {
        masterTl.fromTo(
          openingLeftColRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.08, ease: "power1.out" },
          0.20
        );
      }

      if (headingTheRef.current) {
        masterTl.fromTo(
          headingTheRef.current,
          { opacity: 0, y: 18, filter: "blur(6px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.18, ease: "power2.out" },
          0.21
        );
      }

      if (headingVowsRef.current) {
        masterTl.fromTo(
          headingVowsRef.current,
          {
            opacity: 0,
            y: 14,
            scale: 0.95,
            WebkitMaskPosition: "100% 0",
            maskPosition: "100% 0",
          },
          {
            opacity: 1,
            y: 0,
            scale: 1.0,
            WebkitMaskPosition: "0% 0",
            maskPosition: "0% 0",
            duration: 0.24,
            ease: "power2.out",
          },
          0.25
        );
      }

      const leftColItems = openingLeftColRef.current?.querySelectorAll(
        `.${styles.chapterBadgeRow}, .${styles.openingNarrative}, .${styles.exploreActionBtn}`
      );
      if (leftColItems && leftColItems.length > 0) {
        masterTl.fromTo(
          leftColItems,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.18, stagger: 0.04, ease: "power2.out" },
          0.30
        );
      }

      // ── STEP 2: 0.46 – 0.70: BELAMKONDA PHOTOGRAPH (Golden Vintage Arch) ──
      // As visitor continues scrolling, central photograph arrives into view inside golden arch frame
      if (openingCenterColRef.current) {
        masterTl.fromTo(
          openingCenterColRef.current,
          { opacity: 0, scale: 0.94 },
          { opacity: 1, scale: 1.0, duration: 0.24, ease: "power2.out" },
          0.46
        );
      }

      // Ensure photograph is 100% crisp and fully opaque
      if (archedPhotoImgRef.current) {
        gsap.set(archedPhotoImgRef.current, { opacity: 1 });
      }

      // ── STEP 3: 0.70 – 0.92: COUPLE INFORMATION ──
      // Couple's name, venue, story copy & CTA enter to complete unified 3-column composition
      if (openingRightColRef.current) {
        masterTl.fromTo(
          openingRightColRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.22, ease: "power2.out" },
          0.70
        );
      }

      // ── Full Composition Settle & Hold (0.92 – 1.00) ──
      masterTl.to({}, { duration: 0.08 }, 0.92);

      // ── ScrollTrigger Pinning (Optimized for 1–2 deliberate scrolls) ──
      const isMobile = window.innerWidth < 820;
      const pinDistance = isMobile ? "+=95%" : "+=120%";

      ScrollTrigger.create({
        trigger: heroSectionRef.current,
        start: "top top",
        end: pinDistance,
        pin: true,
        scrub: 0.35,
        onUpdate: (self) => {
          const progress = self.progress;
          masterTl.progress(progress);

          // Single authoritative hero transition state for header:
          // Phase 1 (progress < 0.26): Hero photograph dissolves, green backdrop & 24 FRAMES logo hold -> header is completely transparent.
          // Phase 2 (progress >= 0.26): 24 FRAMES logo has exited and warm ivory has arrived -> header transitions to solid light (themeLight, warm ivory).
          const heroExited = progress >= 0.26;
          const nextHeroStage = heroExited ? "hero-exited" : "hero-active";
          const nextHeaderTheme = heroExited ? "light" : "dark";

          let stateChanged = false;
          if (document.documentElement.dataset.heroStage !== nextHeroStage) {
            document.documentElement.dataset.heroStage = nextHeroStage;
            stateChanged = true;
          }
          if (document.documentElement.dataset.heroHeaderTheme !== nextHeaderTheme) {
            document.documentElement.dataset.heroHeaderTheme = nextHeaderTheme;
            stateChanged = true;
          }
          if (stateChanged) {
            window.dispatchEvent(new Event("scroll"));
          }

          // Interactivity toggle: enable links only once composition has settled (progress >= 0.70)
          if (vowsStageWrapRef.current) {
            if (progress >= 0.70) {
              vowsStageWrapRef.current.classList.add(styles.vowsStageInteractive);
            } else {
              vowsStageWrapRef.current.classList.remove(styles.vowsStageInteractive);
            }
          }

          // Boundary Reset on Reverse to Hero
          if (progress <= 0.005) {
            document.documentElement.dataset.heroStage = "hero-active";
            document.documentElement.dataset.heroHeaderTheme = "dark";
            window.dispatchEvent(new Event("scroll"));
            if (greenBackdropRef.current) greenBackdropRef.current.style.opacity = "0";
            if (ivoryBackdropRef.current) ivoryBackdropRef.current.style.opacity = "0";
            if (logoWrapRef.current) logoWrapRef.current.style.opacity = "0";
            if (vowsStageWrapRef.current) {
              vowsStageWrapRef.current.style.opacity = "0";
              vowsStageWrapRef.current.classList.remove(styles.vowsStageInteractive);
            }
            if (headingTheRef.current) {
              headingTheRef.current.style.opacity = "0";
              headingTheRef.current.style.transform = "none";
              headingTheRef.current.style.filter = "none";
            }
            if (headingVowsRef.current) {
              headingVowsRef.current.style.opacity = "0";
              headingVowsRef.current.style.transform = "none";
              headingVowsRef.current.style.webkitMaskPosition = "100% 0";
            }
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
      if (vowsStageWrapRef.current) {
        vowsStageWrapRef.current.classList.remove(styles.vowsStageInteractive);
      }
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
              <span ref={headingTheRef} className={styles.headingThe}>The</span>
              <span ref={headingVowsRef} className={styles.headingVows}>Vows</span>
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

          {/* Center Column: Refined Editorial Photo Frame (Golden Vintage Arch Reference) */}
          <div ref={openingCenterColRef} className={styles.openingCenterCol}>
            <Link
              href="/stories/bellam-srikonda"
              className={styles.archedPhotoLink}
              aria-label="Open featured commission: Bellamkonda Sai Sreenivas & Kavya Reddy"
            >
              <div className={styles.archedFrame}>
                <div className={styles.archPhotoMask}>
                  <picture>
                    <source
                      type="image/avif"
                      srcSet="/images/stories/bellam-srikonda/IMG_6339-mobile.avif 720w, /images/stories/bellam-srikonda/IMG_6339.avif 1108w"
                      sizes="(max-width: 768px) 720px, 350px"
                    />
                    <source
                      type="image/webp"
                      srcSet="/images/stories/bellam-srikonda/IMG_6339-mobile.webp 720w, /images/stories/bellam-srikonda/IMG_6339.webp 1108w"
                      sizes="(max-width: 768px) 720px, 350px"
                    />
                    <img
                      ref={archedPhotoImgRef}
                      src="/images/stories/bellam-srikonda/IMG_6339.jpg"
                      alt="Bellamkonda Sai Sreenivas & Kavya Reddy"
                      className={styles.archedPhotoImg}
                      loading="eager"
                      decoding="async"
                      draggable={false}
                    />
                  </picture>
                  <div className={styles.photoSheenOverlay} />
                </div>
                <svg
                  className={styles.archGoldFrameSvg}
                  viewBox="0 0 245 404"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <defs>
                    <linearGradient id="champagneGoldArchVows" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#E8D7AD" />
                      <stop offset="25%" stopColor="#C8A84E" />
                      <stop offset="50%" stopColor="#F3E8C8" />
                      <stop offset="75%" stopColor="#BE9E46" />
                      <stop offset="100%" stopColor="#D8C082" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 1,122.5 A 121.5,121.5 0 0,1 244,122.5 L 244,403 L 1,403 Z"
                    fill="none"
                    stroke="url(#champagneGoldArchVows)"
                    strokeWidth="1.75"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
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
