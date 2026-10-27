"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { navigateWithCameraTransition } from "@/lib/transitions";
import styles from "./LivingContactSheet.module.css";

gsap.registerPlugin(ScrollTrigger);

/* ── Content Interfaces ────────────────────────────────────────── */
export interface GalleryProjectItem {
  id: string;
  orderNumber: string;
  categoryLabel: string;
  clientNames: string;
  captionTitle: string;
  captionSub: string;
  category: string;
  location: string;
  image: string;
  webpImage: string;
  aspectRatio: string;
  storyUrl: string;
  objectPosition?: string;
  narrative?: string;
}

export interface GalleryFilmItem {
  id: string;
  orderNumber: string;
  categoryLabel: string;
  filmTitle: string;
  category: string;
  duration: string;
  youtubeId: string;
  embedUrl: string;
  poster: string;
  webpPoster: string;
  description: string;
}

/* ── Six Verified Client Commissions ────────────────────────────── */

/* Item 1: Dominant Featured Story — Bellamkonda Sai Sreenivas & Kavya Reddy */
export const ITEM_PROJECT_01: GalleryProjectItem = {
  id: "project-01",
  orderNumber: "01",
  categoryLabel: "Featured Commission · Celebrity Wedding Reception",
  clientNames: "Bellamkonda Sai Sreenivas & Kavya Reddy",
  captionTitle: "Bellamkonda Sai Sreenivas & Kavya Reddy",
  captionSub: "Celebrity Wedding Reception · Hyderabad",
  category: "Celebrity Wedding Reception",
  location: "GMR ARENA & SHAMSHABAD ESTATE, HYDERABAD",
  image: "/images/stories/bellam-srikonda/IMG_6339.jpg",
  webpImage: "/images/stories/bellam-srikonda/IMG_6339.webp",
  aspectRatio: "3 / 4",
  storyUrl: "/stories/bellam-srikonda",
  objectPosition: "center 18%",
  narrative:
    "The quiet and overwhelming union of two people, set against the grandeur of celebration, personal moments, and everything in between. A wedding captured with honesty, cinematic depth and timeless transitions.",
};

/* Item 2: Master Cinema Feature — Vinitha & Vivekananda */
export const ITEM_VIDEO_01: GalleryFilmItem = {
  id: "video-01",
  orderNumber: "01",
  categoryLabel: "01 —— WEDDING FILM",
  filmTitle: "Vinitha & Vivekananda",
  category: "Wedding Feature Film",
  duration: "14:55",
  youtubeId: "LNtlLgfT5uY",
  embedUrl:
    "https://www.youtube-nocookie.com/embed/LNtlLgfT5uY?autoplay=1&rel=0&playsinline=1&modestbranding=1",
  poster: "/videos/portfolio/vinitha-vivekananda/poster.jpg",
  webpPoster: "/videos/portfolio/vinitha-vivekananda/poster.webp",
  description:
    "A beautiful film that unfolds a soulful celebration — where two journeys became one.",
};

/* Item 3: Sacred Wedding Union — Sireesh & Harshitha */
export const ITEM_PROJECT_02: GalleryProjectItem = {
  id: "project-02",
  orderNumber: "02",
  categoryLabel: "02 —— TRADITIONAL WEDDING",
  clientNames: "Sireesh & Harshitha",
  captionTitle: "Sireesh & Harshitha",
  captionSub: "Sacred Wedding Union · Telangana",
  category: "Sacred Wedding Union",
  location: "Hyderabad, Telangana",
  image: "/images/stories/sirish-and-harshitha/IMG_6346.jpg",
  webpImage: "/images/stories/sirish-and-harshitha/IMG_6346.webp",
  aspectRatio: "3 / 4",
  storyUrl: "/stories/sirish-and-harshitha",
  objectPosition: "center center",
  narrative:
    "Rooted in legacy, celebrated with emotion, and alive with timeless traditions.",
};

/* Supporting Still: Mandapam Architecture — Sireesh & Harshitha */
export const ITEM_PROJECT_02_MANDAP: GalleryProjectItem = {
  id: "project-02-mandap",
  orderNumber: "02B",
  categoryLabel: "Mandapam Heritage Stage",
  clientNames: "Sireesh & Harshitha Mandapam",
  captionTitle: "Royal Mandapam Under Golden Chandeliers",
  captionSub: "Sacred Mandapam Architecture",
  category: "Traditional Wedding",
  location: "Hyderabad, Telangana",
  image: "/images/stories/sirish-and-harshitha/IMG_6353.jpg",
  webpImage: "/images/stories/sirish-and-harshitha/IMG_6353.webp",
  aspectRatio: "16 / 9",
  storyUrl: "/stories/sirish-and-harshitha",
  objectPosition: "center 40%",
};

/* Item 4: Royal Couture Portrait — Hrithika & Abhishek */
export const ITEM_PROJECT_03: GalleryProjectItem = {
  id: "project-03",
  orderNumber: "03",
  categoryLabel: "03 —— PRE-WEDDING COLLECTION",
  clientNames: "Hrithika & Abhishek",
  captionTitle: "Hrithika & Abhishek",
  captionSub: "Nine-Scene Celebration · Hyderabad",
  category: "Ceremony & Celebrations",
  location: "Hyderabad, Telangana",
  image: "/images/stories/hrithika-abhishek/IMG_6333.jpg",
  webpImage: "/images/stories/hrithika-abhishek/IMG_6333.webp",
  aspectRatio: "16 / 10",
  storyUrl: "/stories/hrithika-abhishek",
  objectPosition: "center 24%",
  narrative:
    "Modern love in a classic setting — real moments, effortlessly beautiful.",
};

/* Item 5: Fine-Art Heritage Embrace — Karthik & Gayathri */
export const ITEM_PROJECT_04: GalleryProjectItem = {
  id: "project-04",
  orderNumber: "04",
  categoryLabel: "04 —— FINE-ART HERITAGE WEDDING",
  clientNames: "Karthik & Gayathri",
  captionTitle: "Karthik & Gayathri",
  captionSub: "Fine-Art Wedding · Botanical Glasshouse",
  category: "Fine-Art Heritage Wedding",
  location: "Botanical Glasshouse · Hyderabad",
  image: "/images/stories/karthik-and-gayathri/IMG_6330.jpg",
  webpImage: "/images/stories/karthik-and-gayathri/IMG_6330.webp",
  aspectRatio: "16 / 10",
  storyUrl: "/stories/karthik-and-gayathri",
  objectPosition: "center 14%",
  narrative:
    "A story of new beginnings, captured in the most honest, cinematic way.",
};

/* Item 6: Couple Shoot Signature Film — Nishanth X Sanzena */
export const ITEM_VIDEO_02: GalleryFilmItem = {
  id: "video-02",
  orderNumber: "05",
  categoryLabel: "05 —— SIGNATURE FILM",
  filmTitle: "Nishanth X Sanzena",
  category: "Couple Shoot Cinema Film",
  duration: "03:12",
  youtubeId: "s32UT21hnBg",
  embedUrl:
    "https://www.youtube-nocookie.com/embed/s32UT21hnBg?autoplay=1&rel=0&playsinline=1&modestbranding=1",
  poster: "/videos/portfolio/nishanth-sanzena/poster.jpg",
  webpPoster: "/videos/portfolio/nishanth-sanzena/poster.webp",
  description:
    "A story of finding home in the most unexpected places — where love felt inevitable, every frame a new chapter, and real emotions took center stage.",
};

export default function LivingContactSheet() {
  const sectionRef = useRef<HTMLElement>(null);
  const openingRef = useRef<HTMLDivElement>(null);
  
  /* Vinitha SVG Morph References */
  const vinithaPathRef = useRef<SVGPathElement>(null);
  const vinithaStageRef = useRef<HTMLDivElement>(null);
  const vinithaOverlaysRef = useRef<HTMLDivElement>(null);
  const vinithaIframeRef = useRef<HTMLDivElement>(null);
  const [vinithaVideoActive, setVinithaVideoActive] = useState(false);
  const vinithaMorphingRef = useRef(false);

  /* Nishanth SVG Morph References */
  const nishanthPathRef = useRef<SVGPathElement>(null);
  const nishanthStageRef = useRef<HTMLDivElement>(null);
  const nishanthOverlaysRef = useRef<HTMLDivElement>(null);
  const nishanthIframeRef = useRef<HTMLDivElement>(null);
  const [nishanthVideoActive, setNishanthVideoActive] = useState(false);
  const nishanthMorphingRef = useRef(false);

  /* Curved shape normalized coordinates [0, 1] for objectBoundingBox */
  const CURVED_COORDS = {
    topY0: 0.11,
    topCp1Y: 0.18,
    topCp2Y: 0.02,
    topY1: 0.09,
    botY1: 0.89,
    botCp2Y: 0.98,
    botCp1Y: 0.80,
    botY0: 0.88,
  };

  const NISHANTH_CURVED_COORDS = {
    topY0: 0.08,
    topCp1Y: 0.01,
    topCp2Y: 0.14,
    topY1: 0.09,
    botY1: 0.93,
    botCp2Y: 0.86,
    botCp1Y: 0.99,
    botY0: 0.92,
  };

  const RECT_COORDS = {
    topY0: 0.00,
    topCp1Y: 0.00,
    topCp2Y: 0.00,
    topY1: 0.00,
    botY1: 1.00,
    botCp2Y: 1.00,
    botCp1Y: 1.00,
    botY0: 1.00,
  };

  // Helper to build SVG path data string for Vinitha
  const buildPathData = (c: typeof CURVED_COORDS) => {
    return `M 0 ${c.topY0.toFixed(4)} C 0.32 ${c.topCp1Y.toFixed(4)}, 0.68 ${c.topCp2Y.toFixed(4)}, 1 ${c.topY1.toFixed(4)} L 1 ${c.botY1.toFixed(4)} C 0.68 ${c.botCp2Y.toFixed(4)}, 0.32 ${c.botCp1Y.toFixed(4)}, 0 ${c.botY0.toFixed(4)} Z`;
  };

  // Helper to build SVG path data string for Nishanth
  const buildNishanthPathData = (c: typeof NISHANTH_CURVED_COORDS) => {
    return `M 0 ${c.topY0.toFixed(4)} C 0.35 ${c.topCp1Y.toFixed(4)}, 0.65 ${c.topCp2Y.toFixed(4)}, 1 ${c.topY1.toFixed(4)} L 1 ${c.botY1.toFixed(4)} C 0.65 ${c.botCp2Y.toFixed(4)}, 0.35 ${c.botCp1Y.toFixed(4)}, 0 ${c.botY0.toFixed(4)} Z`;
  };

  // Trigger Vinitha Video Morph (Curved -> Rectangular Player)
  const openVinithaVideo = useCallback(() => {
    if (vinithaMorphingRef.current || vinithaVideoActive) return;
    vinithaMorphingRef.current = true;

    const path = vinithaPathRef.current;
    const stage = vinithaStageRef.current;
    const overlays = vinithaOverlaysRef.current;
    if (!path || !stage) {
      setVinithaVideoActive(true);
      vinithaMorphingRef.current = false;
      return;
    }

    const currentCoords = { ...CURVED_COORDS };
    const tl = gsap.timeline({
      onComplete: () => {
        setVinithaVideoActive(true);
        vinithaMorphingRef.current = false;
      },
    });

    // 1. Fade out text overlays & play beacon gracefully
    if (overlays) {
      tl.to(overlays, {
        opacity: 0,
        duration: 0.45,
        ease: "power2.out",
      }, 0);
    }

    // 2. Smoothly morph SVG clipPath from curve to flat rectangle
    tl.to(currentCoords, {
      ...RECT_COORDS,
      duration: 1.05,
      ease: "power2.inOut",
      onUpdate: () => {
        path.setAttribute("d", buildPathData(currentCoords));
      },
    }, 0);

    // 3. Coordinate container geometry into clean 16:9 cinematic rectangle
    tl.to(stage, {
      borderRadius: "12px",
      duration: 1.05,
      ease: "power2.inOut",
    }, 0);
  }, [vinithaVideoActive]);

  // Close Vinitha Video Morph (Rectangular -> Curved)
  const closeVinithaVideo = useCallback(() => {
    if (vinithaMorphingRef.current) return;
    vinithaMorphingRef.current = true;

    setVinithaVideoActive(false);

    const path = vinithaPathRef.current;
    const stage = vinithaStageRef.current;
    const overlays = vinithaOverlaysRef.current;
    if (!path || !stage) {
      vinithaMorphingRef.current = false;
      return;
    }

    const currentCoords = { ...RECT_COORDS };
    const tl = gsap.timeline({
      onComplete: () => {
        vinithaMorphingRef.current = false;
      },
    });

    // 1. Smoothly morph SVG clipPath from flat rectangle back to curve
    tl.to(currentCoords, {
      ...CURVED_COORDS,
      duration: 0.95,
      ease: "power2.inOut",
      onUpdate: () => {
        path.setAttribute("d", buildPathData(currentCoords));
      },
    }, 0);

    // 2. Animate container back to organic frame
    tl.to(stage, {
      borderRadius: "0px",
      duration: 0.95,
      ease: "power2.inOut",
    }, 0);

    // 3. Fade text overlays & play beacon back in
    if (overlays) {
      tl.to(overlays, {
        opacity: 1,
        duration: 0.55,
        ease: "power2.in",
      }, 0.45);
    }
  }, []);

  // Trigger Nishanth Video Morph (Curved -> Rectangular Player)
  const openNishanthVideo = useCallback(() => {
    if (nishanthMorphingRef.current || nishanthVideoActive) return;
    nishanthMorphingRef.current = true;

    const path = nishanthPathRef.current;
    const stage = nishanthStageRef.current;
    const overlays = nishanthOverlaysRef.current;
    if (!path || !stage) {
      setNishanthVideoActive(true);
      nishanthMorphingRef.current = false;
      return;
    }

    const currentCoords = { ...NISHANTH_CURVED_COORDS };
    const tl = gsap.timeline({
      onComplete: () => {
        setNishanthVideoActive(true);
        nishanthMorphingRef.current = false;
      },
    });

    // 1. Fade out text overlays & play beacon gracefully
    if (overlays) {
      tl.to(overlays, {
        opacity: 0,
        duration: 0.45,
        ease: "power2.out",
      }, 0);
    }

    // 2. Smoothly morph SVG clipPath from curve to flat rectangle
    tl.to(currentCoords, {
      ...RECT_COORDS,
      duration: 1.05,
      ease: "power2.inOut",
      onUpdate: () => {
        path.setAttribute("d", buildNishanthPathData(currentCoords));
      },
    }, 0);

    // 3. Coordinate container geometry into clean 16:9 cinematic rectangle
    tl.to(stage, {
      borderRadius: "12px",
      duration: 1.05,
      ease: "power2.inOut",
    }, 0);
  }, [nishanthVideoActive]);

  // Close Nishanth Video Morph (Rectangular -> Curved)
  const closeNishanthVideo = useCallback(() => {
    if (nishanthMorphingRef.current) return;
    nishanthMorphingRef.current = true;

    setNishanthVideoActive(false);

    const path = nishanthPathRef.current;
    const stage = nishanthStageRef.current;
    const overlays = nishanthOverlaysRef.current;
    if (!path || !stage) {
      nishanthMorphingRef.current = false;
      return;
    }

    const currentCoords = { ...RECT_COORDS };
    const tl = gsap.timeline({
      onComplete: () => {
        nishanthMorphingRef.current = false;
      },
    });

    // 1. Smoothly morph SVG clipPath from flat rectangle back to curve
    tl.to(currentCoords, {
      ...NISHANTH_CURVED_COORDS,
      duration: 0.95,
      ease: "power2.inOut",
      onUpdate: () => {
        path.setAttribute("d", buildNishanthPathData(currentCoords));
      },
    }, 0);

    // 2. Animate container back to organic frame
    tl.to(stage, {
      borderRadius: "0px",
      duration: 0.95,
      ease: "power2.inOut",
    }, 0);

    // 3. Fade text overlays & play beacon back in
    if (overlays) {
      tl.to(overlays, {
        opacity: 1,
        duration: 0.55,
        ease: "power2.in",
      }, 0.45);
    }
  }, []);

  /* GSAP scroll-triggered entrance animations */
  useEffect(() => {
    const isReduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReduced) return;

    const ctx = gsap.context(() => {
      // Animate opening section elements smoothly into view
      if (openingRef.current) {
        gsap.fromTo(
          openingRef.current,
          { opacity: 0, y: 36 },
          {
            opacity: 1,
            y: 0,
            duration: 1.0,
            ease: "power2.out",
            scrollTrigger: {
              trigger: openingRef.current,
              start: "top 86%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // Animate editorial rhythm blocks
      const blocks = gsap.utils.toArray<HTMLElement>(`.${styles.editorialBlock}`);
      blocks.forEach((block) => {
        gsap.fromTo(
          block,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.95,
            ease: "power2.out",
            scrollTrigger: {
              trigger: block,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  /* Escape key closes inline video players */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (vinithaVideoActive) closeVinithaVideo();
        if (nishanthVideoActive) closeNishanthVideo();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [vinithaVideoActive, nishanthVideoActive, closeVinithaVideo, closeNishanthVideo]);

  return (
    <section
      ref={sectionRef}
      id="vows"
      className={styles.section}
      aria-label="Chapter 02 — The Vows"
    >
      {/* ── Hidden SVG Definition for Smooth Mathematical Path Morphing ── */}
      <svg
        className={styles.svgClipDefs}
        width="1"
        height="1"
        viewBox="0 0 1 1"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <clipPath id="vinithaMorphClip" clipPathUnits="objectBoundingBox">
            <path
              ref={vinithaPathRef}
              d="M 0 0.11 C 0.32 0.18, 0.68 0.02, 1 0.09 L 1 0.89 C 0.68 0.98, 0.32 0.80, 0 0.88 Z"
            />
          </clipPath>
          <clipPath id="nishanthMorphClip" clipPathUnits="objectBoundingBox">
            <path
              ref={nishanthPathRef}
              d="M 0 0.08 C 0.35 0.01, 0.65 0.14, 1 0.09 L 1 0.93 C 0.65 0.86, 0.35 0.99, 0 0.92 Z"
            />
          </clipPath>
        </defs>
      </svg>

      <div className={styles.mainContainer}>
        {/* Curated Exhibition Anchor */}
        <div id="exhibition" className={styles.anchorOffset} aria-hidden="true" />

        {/* ══════════════════════════════════════════════════════════════════════
            01 — FEATURED EDITORIAL OPENING (EXACT 3-COLUMN COMPOSITION)
        ══════════════════════════════════════════════════════════════════════ */}
        <div ref={openingRef} className={styles.openingComposition}>
          {/* Chapter Progress Rail */}
          <div className={styles.progressRail} aria-hidden="true">
            <span className={styles.railNumber}>01</span>
            <div className={styles.railActiveWrap}>
              <span className={`${styles.railNumber} ${styles.railNumberActive}`}>02</span>
              <span className={styles.railIndicatorBar} />
            </div>
            <span className={styles.railNumber}>03</span>
            <span className={styles.railNumber}>05</span>
          </div>

          {/* Left Column: Chapter Title & Editorial Anthology Thesis */}
          <div className={styles.openingLeftCol}>
            <div className={styles.chapterBadgeRow}>
              <span className={styles.chapterLabel}>CHAPTER 02</span>
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

          {/* Center Column: Arched Roman Portrait (Bellamkonda & Kavya) */}
          <div className={styles.openingCenterCol}>
            <Link
              href={ITEM_PROJECT_01.storyUrl}
              className={styles.archedPhotoLink}
              aria-label={`Open featured commission: ${ITEM_PROJECT_01.clientNames}`}
            >
              <div className={styles.archedFrame}>
                <picture>
                  <source srcSet={ITEM_PROJECT_01.webpImage} type="image/webp" />
                  <img
                    src={ITEM_PROJECT_01.image}
                    alt={ITEM_PROJECT_01.clientNames}
                    className={styles.archedPhotoImg}
                    style={{ objectPosition: ITEM_PROJECT_01.objectPosition }}
                    loading="eager"
                  />
                </picture>
                <div className={styles.photoSheenOverlay} />
              </div>
            </Link>
          </div>

          {/* Right Column: Featured Commission Details & Metadata */}
          <div className={styles.openingRightCol}>
            <div className={styles.featuredBadgeRow}>
              <span className={styles.featuredCommissionLabel}>FEATURED COMMISSION</span>
              <span className={styles.labelDividerLine} />
            </div>

            <h3 className={styles.featuredCoupleName}>
              <Link href={ITEM_PROJECT_01.storyUrl} className={styles.nameLink}>
                {ITEM_PROJECT_01.clientNames}
              </Link>
            </h3>

            <p className={styles.featuredVenueSub}>{ITEM_PROJECT_01.location}</p>

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

            <div className={styles.featuredCtaWrap}>
              <Link href={ITEM_PROJECT_01.storyUrl} className={styles.btnExplorePill}>
                EXPLORE FULL STORY <span className={styles.pillArrow}>→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Anchor for Explore Action */}
        <div id="stories-showcase" className={styles.anchorOffset} aria-hidden="true" />

        {/* ══════════════════════════════════════════════════════════════════════
            02 — VINITHA & VIVEKANANDA: CURVED PANEL WITH SVG MORPH ANIMATION
        ══════════════════════════════════════════════════════════════════════ */}
        <div className={`${styles.editorialBlock} ${styles.vinithaSectionBlock}`}>
          <div
            ref={vinithaStageRef}
            className={`${styles.curvedPanelStage} ${
              vinithaVideoActive ? styles.curvedPanelStageActive : ""
            }`}
          >
            {/* Background Poster Image */}
            <picture>
              <source srcSet={ITEM_VIDEO_01.webpPoster} type="image/webp" />
              <img
                src={ITEM_VIDEO_01.poster}
                alt={ITEM_VIDEO_01.filmTitle}
                className={styles.curvedPosterImg}
                loading="lazy"
              />
            </picture>

            {/* Gradient Scrim for Film Typography Legibility */}
            <div className={styles.filmGradientScrim} />

            {/* Overlay Elements (Fade out when morphing to video) */}
            <div ref={vinithaOverlaysRef} className={styles.filmOverlaysLayer}>
              <div className={styles.filmNarrativeSide}>
                <span className={styles.filmIndexLabel}>01 —— WEDDING FILM</span>
                <h3 className={styles.filmHeading}>{ITEM_VIDEO_01.filmTitle}</h3>
                <p className={styles.filmExcerpt}>{ITEM_VIDEO_01.description}</p>
                <button
                  type="button"
                  className={styles.btnWatchFilmText}
                  onClick={openVinithaVideo}
                  aria-label={`Watch cinema film: ${ITEM_VIDEO_01.filmTitle}`}
                >
                  WATCH FILM <span className={styles.actionArrow}>——→</span>
                </button>
              </div>

              <div className={styles.filmPlaySide}>
                <button
                  type="button"
                  className={styles.circularPlayBeacon}
                  onClick={openVinithaVideo}
                  aria-label="Play Vinitha & Vivekananda wedding film"
                >
                  <svg className={styles.playBeaconIcon} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Embedded Cinema Player (Revealed upon morph completion) */}
            {vinithaVideoActive && (
              <div ref={vinithaIframeRef} className={styles.embeddedPlayerStage}>
                <iframe
                  src={ITEM_VIDEO_01.embedUrl}
                  title={ITEM_VIDEO_01.filmTitle}
                  className={styles.cinemaIframe}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
                <button
                  type="button"
                  className={styles.btnCloseCinema}
                  onClick={closeVinithaVideo}
                  aria-label="Close cinema film player"
                >
                  ✕ Close Film
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            03 — HRITHIKA & ABHISHEK (USER INSTRUCTION: PHOTO ON LEFT, TEXT ON RIGHT)
        ══════════════════════════════════════════════════════════════════════ */}
        <div className={`${styles.editorialBlock} ${styles.duoSpreadBlock}`}>
          <div className={styles.duoGridHrithika}>
            {/* LEFT: Photograph (As explicitly instructed) */}
            <div className={styles.duoVisualSide}>
              <Link
                href={ITEM_PROJECT_03.storyUrl}
                className={styles.cardImageLink}
                aria-label={`Open story: ${ITEM_PROJECT_03.clientNames}`}
              >
                <div
                  className={styles.roundedImageCanvas}
                  style={{ aspectRatio: ITEM_PROJECT_03.aspectRatio }}
                >
                  <picture>
                    <source srcSet={ITEM_PROJECT_03.webpImage} type="image/webp" />
                    <img
                      src={ITEM_PROJECT_03.image}
                      alt={ITEM_PROJECT_03.clientNames}
                      className={styles.storyCoverImg}
                      style={{ objectPosition: ITEM_PROJECT_03.objectPosition }}
                      loading="lazy"
                    />
                  </picture>
                  <div className={styles.imageHoverShimmer} />
                </div>
              </Link>
            </div>

            {/* RIGHT: Text and Story Details */}
            <div className={styles.duoContentSide}>
              <span className={styles.storySerialTag}>{ITEM_PROJECT_03.categoryLabel}</span>
              <h4 className={styles.storyTitleLarge}>
                <Link href={ITEM_PROJECT_03.storyUrl} className={styles.nameLink}>
                  {ITEM_PROJECT_03.clientNames}
                </Link>
              </h4>
              <p className={styles.storyDescription}>{ITEM_PROJECT_03.narrative}</p>
              <Link href={ITEM_PROJECT_03.storyUrl} className={styles.btnViewStoryText}>
                VIEW STORY <span className={styles.actionArrow}>——→</span>
              </Link>

              {/* Delicate handwritten accent floating beside */}
              <div className={styles.floatingCursiveAccent} aria-hidden="true">
                Real people.
                <br />
                Timeless stories.
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            04 — KARTHIK & GAYATRI (TEXT ON LEFT, PHOTO ON RIGHT)
        ══════════════════════════════════════════════════════════════════════ */}
        <div className={`${styles.editorialBlock} ${styles.duoSpreadBlock}`}>
          <div className={styles.duoGridKarthik}>
            {/* LEFT: Text and Story Details */}
            <div className={styles.duoContentSide}>
              <span className={styles.storySerialTag}>{ITEM_PROJECT_04.categoryLabel}</span>
              <h4 className={styles.storyTitleLarge}>
                <Link href={ITEM_PROJECT_04.storyUrl} className={styles.nameLink}>
                  {ITEM_PROJECT_04.clientNames}
                </Link>
              </h4>
              <p className={styles.storyDescription}>{ITEM_PROJECT_04.narrative}</p>
              <Link href={ITEM_PROJECT_04.storyUrl} className={styles.btnViewStoryText}>
                VIEW STORY <span className={styles.actionArrow}>——→</span>
              </Link>
            </div>

            {/* RIGHT: Photograph */}
            <div className={styles.duoVisualSide}>
              <Link
                href={ITEM_PROJECT_04.storyUrl}
                className={styles.cardImageLink}
                aria-label={`Open story: ${ITEM_PROJECT_04.clientNames}`}
              >
                <div
                  className={styles.roundedImageCanvas}
                  style={{ aspectRatio: ITEM_PROJECT_04.aspectRatio }}
                >
                  <picture>
                    <source srcSet={ITEM_PROJECT_04.webpImage} type="image/webp" />
                    <img
                      src={ITEM_PROJECT_04.image}
                      alt={ITEM_PROJECT_04.clientNames}
                      className={styles.storyCoverImg}
                      style={{ objectPosition: ITEM_PROJECT_04.objectPosition }}
                      loading="lazy"
                    />
                  </picture>
                  <div className={styles.imageHoverShimmer} />
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            05 — SIREESH & HARSHITHA (ASYMMETRIC EDITORIAL STILLS COMPOSITION)
        ══════════════════════════════════════════════════════════════════════ */}
        <div className={`${styles.editorialBlock} ${styles.layeredSireeshBlock}`}>
          <div className={styles.layeredGrid}>
            {/* Left: Royal Mandapam Architecture Still under Golden Chandeliers */}
            <div className={styles.layeredContentCol}>
              <Link
                href={ITEM_PROJECT_02.storyUrl}
                className={styles.cardImageLink}
                aria-label="View traditional heritage mandapam architecture"
              >
                <div className={styles.wideMandapCanvas}>
                  <picture>
                    <source srcSet={ITEM_PROJECT_02_MANDAP.webpImage} type="image/webp" />
                    <img
                      src={ITEM_PROJECT_02_MANDAP.image}
                      alt={ITEM_PROJECT_02_MANDAP.clientNames}
                      className={styles.storyCoverImg}
                      style={{ objectPosition: ITEM_PROJECT_02_MANDAP.objectPosition }}
                      loading="lazy"
                    />
                  </picture>
                  <div className={styles.imageHoverShimmer} />
                </div>
              </Link>
            </div>

            {/* Right: Sacred Wedding Couple Walking on Tree-Lined Pathway */}
            <div className={styles.layeredPortraitCol}>
              <Link
                href={ITEM_PROJECT_02.storyUrl}
                className={styles.cardImageLink}
                aria-label={`Open traditional wedding: ${ITEM_PROJECT_02.clientNames}`}
              >
                <div className={styles.tallPortraitCanvas}>
                  <picture>
                    <source srcSet={ITEM_PROJECT_02.webpImage} type="image/webp" />
                    <img
                      src={ITEM_PROJECT_02.image}
                      alt={ITEM_PROJECT_02.clientNames}
                      className={styles.storyCoverImg}
                      style={{ objectPosition: ITEM_PROJECT_02.objectPosition }}
                      loading="lazy"
                    />
                  </picture>
                  <div className={styles.imageHoverShimmer} />
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            EDITORIAL STORY NARRATIVE BANNER CARD — HRITHIKA & ABHISHEK
        ══════════════════════════════════════════════════════════════════════ */}
        <div className={`${styles.editorialBlock} ${styles.storyNarrativeBannerWrap}`}>
          <div className={styles.storyNarrativeBannerCard}>
            <div className={styles.bannerImageHeader}>
              <picture>
                <source srcSet="/images/stories/hrithika-abhishek/IMG_6322.webp" type="image/webp" />
                <img
                  src="/images/stories/hrithika-abhishek/IMG_6322.jpg"
                  alt="Hrithika & Abhishek"
                  className={styles.bannerHeaderImg}
                  loading="lazy"
                />
              </picture>
            </div>
            <div className={styles.bannerBodyContent}>
              <h4 className={styles.bannerCoupleTitle}>Hrithika & Abhishek</h4>
              <p className={styles.bannerSubtitle}>
                Modern love in a classic setting — real moments, effortlessly beautiful.
              </p>
              <Link href="/stories/hrithika-abhishek" className={styles.bannerWatchLink}>
                WATCH STORY <span className={styles.actionArrow}>——→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            06 — NISHANTH X SANZENA: CINEMATIC CLOSING FEATURE WITH GSAP MORPH
        ══════════════════════════════════════════════════════════════════════ */}
        <div className={`${styles.editorialBlock} ${styles.nishanthClosingBlock}`}>
          <div
            ref={nishanthStageRef}
            className={`${styles.nishanthCurvedStage} ${
              nishanthVideoActive ? styles.nishanthCurvedStageActive : ""
            }`}
          >
            {/* Sunset Mountain Landscape Poster */}
            <picture>
              <source srcSet={ITEM_VIDEO_02.webpPoster} type="image/webp" />
              <img
                src={ITEM_VIDEO_02.poster}
                alt={ITEM_VIDEO_02.filmTitle}
                className={styles.nishanthPosterImg}
                loading="lazy"
              />
            </picture>

            {/* Gradient Scrim */}
            <div className={styles.nishanthGradientScrim} />

            {/* Overlays Layer (Smoothly fades out during GSAP morph) */}
            <div ref={nishanthOverlaysRef} className={styles.nishanthOverlaysLayer}>
              {/* Left Play Control */}
              <div className={styles.nishanthLeftControl}>
                <button
                  type="button"
                  className={styles.circularPlayBeacon}
                  onClick={openNishanthVideo}
                  aria-label={`Play signature film: ${ITEM_VIDEO_02.filmTitle}`}
                >
                  <svg className={styles.playBeaconIcon} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
                <div className={styles.nishanthFilmLabelGroup}>
                  <span className={styles.nishanthFilmSub}>SIGNATURE FILM</span>
                  <span className={styles.nishanthFilmName}>NISHANTH X SANZENA</span>
                </div>
              </div>

              {/* Right Narrative Overlay */}
              <div className={styles.nishanthRightNarrative}>
                <span className={styles.nishanthTag}>05 —— SIGNATURE FILM</span>
                <h3 className={styles.nishanthTitle}>{ITEM_VIDEO_02.filmTitle}</h3>
                <p className={styles.nishanthExcerpt}>{ITEM_VIDEO_02.description}</p>
                <button
                  type="button"
                  className={styles.btnNishanthPill}
                  onClick={openNishanthVideo}
                >
                  WATCH THE FULL FILM <span className={styles.pillArrow}>——→</span>
                </button>
              </div>
            </div>

            {/* Inline Cinema Player Modal / Overlay (Revealed upon morph completion) */}
            {nishanthVideoActive && (
              <div ref={nishanthIframeRef} className={styles.embeddedPlayerStage}>
                <iframe
                  src={ITEM_VIDEO_02.embedUrl}
                  title={ITEM_VIDEO_02.filmTitle}
                  className={styles.cinemaIframe}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
                <button
                  type="button"
                  className={styles.btnCloseCinema}
                  onClick={closeNishanthVideo}
                  aria-label="Close signature film player"
                >
                  ✕ Close Film
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            07 — SECTION ENDING / BRAND FOOTER BAR
        ══════════════════════════════════════════════════════════════════════ */}
        <div className={styles.sectionEndingBar}>
          <span className={styles.endingBrand}>24 FRAMES PHOTOGRAPHY</span>
          <span className={styles.endingDividerLine} />
          <span className={styles.endingCursivePhrase}>Real people. Timeless stories.</span>
          <span className={styles.endingDividerLine} />
          <Link href="/disciplines/weddings" className={styles.endingExploreLink}>
            Bespoke Wedding Photography & Films <span className={styles.linkArrow}>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
