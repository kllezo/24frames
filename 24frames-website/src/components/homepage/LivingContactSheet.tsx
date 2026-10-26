"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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
  location: "GMR Arena & Shamshabad Estate · Hyderabad",
  image: "/images/stories/bellam-srikonda/IMG_6339.jpg",
  webpImage: "/images/stories/bellam-srikonda/IMG_6339.webp",
  aspectRatio: "4 / 5",
  storyUrl: "/stories/bellam-srikonda",
  objectPosition: "center 22%",
  narrative:
    "The quiet sacred moments documented right before the grand celebration procession begins. Captured with theatrical lighting discipline, quiet poise, and master cinema optics.",
};

/* Item 2: Master Cinema Feature — Vinitha & Vivekananda */
export const ITEM_VIDEO_01: GalleryFilmItem = {
  id: "video-01",
  orderNumber: "02",
  categoryLabel: "Cinematic Wedding Film · Master Edit",
  filmTitle: "Vinitha & Vivekananda",
  category: "Wedding Feature Film",
  duration: "14:55",
  youtubeId: "LNtlLgfT5uY",
  embedUrl:
    "https://www.youtube-nocookie.com/embed/LNtlLgfT5uY?autoplay=1&rel=0&playsinline=1&modestbranding=1",
  poster: "/videos/portfolio/vinitha-vivekananda/poster.jpg",
  webpPoster: "/videos/portfolio/vinitha-vivekananda/poster.webp",
  description:
    "A journey of love, patience, and devotion — where two years of togetherness lead to one life-changing sacred promise.",
};

/* Item 3: Heritage Mandapam — Sireesh & Harshitha */
export const ITEM_PROJECT_02: GalleryProjectItem = {
  id: "project-02",
  orderNumber: "03",
  categoryLabel: "Sacred Wedding Union · Telangana",
  clientNames: "Sireesh & Harshitha",
  captionTitle: "Sireesh & Harshitha",
  captionSub: "Sacred Wedding Union · Telangana",
  category: "Sacred Wedding Union",
  location: "Hyderabad, Telangana",
  image: "/images/stories/sirish-and-harshitha/IMG_6353.jpg",
  webpImage: "/images/stories/sirish-and-harshitha/IMG_6353.webp",
  aspectRatio: "4 / 5",
  storyUrl: "/stories/sirish-and-harshitha",
  objectPosition: "center center",
};

/* Item 4: Royal Couture Portrait — Hrithika & Abhishek */
export const ITEM_PROJECT_03: GalleryProjectItem = {
  id: "project-03",
  orderNumber: "04",
  categoryLabel: "Nine-Scene Celebration · Hyderabad",
  clientNames: "Hrithika & Abhishek",
  captionTitle: "Hrithika & Abhishek",
  captionSub: "Nine-Scene Celebration · Hyderabad",
  category: "Ceremony & Celebrations",
  location: "Hyderabad, Telangana",
  image: "/images/stories/hrithika-abhishek/IMG_6333.jpg",
  webpImage: "/images/stories/hrithika-abhishek/IMG_6333.webp",
  aspectRatio: "4 / 5",
  storyUrl: "/stories/hrithika-abhishek",
  objectPosition: "center 22%",
};

/* Item 5: Couple Shoot Film — Nishanth X Sanzena */
export const ITEM_VIDEO_02: GalleryFilmItem = {
  id: "video-02",
  orderNumber: "05",
  categoryLabel: "Couple Shoot Cinema Film · 03:12",
  filmTitle: "Nishanth X Sanzena",
  category: "Couple Shoot Cinema Film",
  duration: "03:12",
  youtubeId: "s32UT21hnBg",
  embedUrl:
    "https://www.youtube-nocookie.com/embed/s32UT21hnBg?autoplay=1&rel=0&playsinline=1&modestbranding=1",
  poster: "/videos/portfolio/nishanth-sanzena/poster.jpg",
  webpPoster: "/videos/portfolio/nishanth-sanzena/poster.webp",
  description:
    "The unfolding love story of Nishanth & Sanzena — where every moment, every frame, and every smile captures their eternal bond.",
};

/* Item 6: Fine-Art Heritage Embrace — Karthik & Gayathri */
export const ITEM_PROJECT_04: GalleryProjectItem = {
  id: "project-04",
  orderNumber: "06",
  categoryLabel: "Fine-Art Heritage Wedding · Hyderabad",
  clientNames: "Karthik & Gayathri",
  captionTitle: "Karthik & Gayathri",
  captionSub: "Fine-Art Wedding · Botanical Glasshouse",
  category: "Fine-Art Heritage Wedding",
  location: "Botanical Glasshouse · Hyderabad",
  image: "/images/stories/karthik-and-gayathri/IMG_6330.jpg",
  webpImage: "/images/stories/karthik-and-gayathri/IMG_6330.webp",
  aspectRatio: "4 / 5",
  storyUrl: "/stories/karthik-and-gayathri",
  objectPosition: "center 12%",
};

export default function LivingContactSheet() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  /* Inline video player state */
  const [activeInlineVideo, setActiveInlineVideo] = useState<string | null>(null);

  /* GSAP scroll-triggered entrance animations */
  useEffect(() => {
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReduced) return;

    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power2.out",
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      const blocks = gsap.utils.toArray<HTMLElement>(`.${styles.rhythmBlock}`);
      blocks.forEach((block) => {
        gsap.fromTo(
          block,
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
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

  /* Escape key closes inline video */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveInlineVideo(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="vows"
      className={styles.section}
      aria-label="The Vows — Wedding Projects & Cinematic Films"
    >
      <div className={styles.container}>
        {/* Curated Exhibition Anchor */}
        <div id="exhibition" className={styles.anchorOffset} aria-hidden="true" />

        {/* ── 01: THE OPENING ───────────────────────────────────── */}
        <div ref={headerRef} className={styles.header}>
          <div className={styles.headerMeta}>
            <span className={styles.chapterTag}>Chapter 02</span>
            <span className={styles.metaDivider}>—</span>
            <span className={styles.curatorialTag}>The Vows</span>
            <span className={styles.referenceBadge}>Curated Commissions</span>
          </div>
          <h2 className={styles.title}>
            The <span className={styles.cursiveAccent}>Vows</span>
          </h2>
          <p className={styles.subtitle}>
            An anthology of sacred Telugu traditions, royal celebrations, and cinematic master films,
            captured with 35mm optical depth and quiet human truth.
          </p>
          <div className={styles.headerDividerLine} />
        </div>

        {/* ── 02: THE FEATURED STORY (DOMINANT EDITORIAL CENTERPIECE) ── */}
        <div className={`${styles.rhythmBlock} ${styles.featuredStoryWrapper}`}>
          <div className={styles.featuredGrid}>
            {/* Visual Column: Large, Commandingly Sized Photograph */}
            <div className={styles.featuredVisualCol}>
              <Link
                href={ITEM_PROJECT_01.storyUrl}
                className={styles.featuredPhotoLink}
                aria-label={`Open featured story: ${ITEM_PROJECT_01.clientNames}`}
              >
                <div
                  className={styles.featuredImageCanvas}
                  style={{ aspectRatio: ITEM_PROJECT_01.aspectRatio }}
                >
                  <picture>
                    <source srcSet={ITEM_PROJECT_01.webpImage} type="image/webp" />
                    <img
                      src={ITEM_PROJECT_01.image}
                      alt={ITEM_PROJECT_01.clientNames}
                      className={styles.featuredImg}
                      style={{ objectPosition: ITEM_PROJECT_01.objectPosition }}
                      loading="eager"
                    />
                  </picture>
                  <div className={styles.imageHighlightGlow} />
                </div>
              </Link>
            </div>

            {/* Narrative Column: Cohesive Typography & Editorial Information */}
            <div className={styles.featuredNarrativeCol}>
              <div className={styles.featuredBadgeRow}>
                <span className={styles.badgeEmphasis}>Featured Commission</span>
                <span className={styles.badgeBullet}>·</span>
                <span className={styles.badgeSub}>Celebrity Reception</span>
              </div>

              <h3 className={styles.featuredTitle}>
                <Link href={ITEM_PROJECT_01.storyUrl} className={styles.titleLink}>
                  {ITEM_PROJECT_01.clientNames}
                </Link>
              </h3>

              <p className={styles.featuredLocation}>{ITEM_PROJECT_01.location}</p>

              <blockquote className={styles.featuredPullQuote}>
                &ldquo;{ITEM_PROJECT_01.narrative}&rdquo;
              </blockquote>

              <div className={styles.specificationsTable}>
                <div className={styles.specRow}>
                  <span className={styles.specKey}>Discipline</span>
                  <span className={styles.specValue}>{ITEM_PROJECT_01.category}</span>
                </div>
                <div className={styles.specRow}>
                  <span className={styles.specKey}>Optical Crew</span>
                  <span className={styles.specValue}>35mm Prime Cinema Optics</span>
                </div>
                <div className={styles.specRow}>
                  <span className={styles.specKey}>Archive Access</span>
                  <span className={styles.specValue}>Curated Master Story</span>
                </div>
              </div>

              <div className={styles.featuredActionRow}>
                <Link href={ITEM_PROJECT_01.storyUrl} className={styles.btnPrimaryCTA}>
                  Explore Full Archival Story <span className={styles.btnArrow}>→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ── 03: THE SUPPORTING STORIES (CONTINUOUS EDITORIAL SEQUENCE) ── */}

        {/* SPREAD PART A: MASTER CINEMA FEATURE (Vinitha & Vivekananda) */}
        <div className={`${styles.rhythmBlock} ${styles.cinemaSpreadWrapper}`}>
          <div className={styles.cinemaSpreadHeader}>
            <div className={styles.cinemaMetaGroup}>
              <span className={styles.cinemaTag}>Cinematic Wedding Film</span>
              <span className={styles.cinemaDurationPill}>14:55 Master Edit</span>
            </div>
            <h3 className={styles.cinemaHeading}>{ITEM_VIDEO_01.filmTitle}</h3>
            <p className={styles.cinemaExcerpt}>&ldquo;{ITEM_VIDEO_01.description}&rdquo;</p>
          </div>

          <div className={styles.cinemaStageContainer}>
            <div className={styles.cinemaFrame}>
              {activeInlineVideo === ITEM_VIDEO_01.id ? (
                <div className={styles.videoPlayerContainer}>
                  <iframe
                    src={ITEM_VIDEO_01.embedUrl}
                    title={ITEM_VIDEO_01.filmTitle}
                    className={styles.videoIframe}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                  <button
                    type="button"
                    className={styles.closePlayerBtn}
                    onClick={() => setActiveInlineVideo(null)}
                    aria-label="Close cinema player"
                  >
                    ✕ Close Cinema
                  </button>
                </div>
              ) : (
                <div
                  className={styles.videoPosterArea}
                  onClick={() => setActiveInlineVideo(ITEM_VIDEO_01.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setActiveInlineVideo(ITEM_VIDEO_01.id);
                    }
                  }}
                  aria-label={`Play cinema film: ${ITEM_VIDEO_01.filmTitle}`}
                >
                  <picture>
                    <source srcSet={ITEM_VIDEO_01.webpPoster} type="image/webp" />
                    <img
                      src={ITEM_VIDEO_01.poster}
                      alt={ITEM_VIDEO_01.filmTitle}
                      className={styles.videoPosterImg}
                      loading="lazy"
                    />
                  </picture>
                  <div className={styles.videoPosterVignette} />

                  <div className={styles.playBeacon}>
                    <div className={styles.playBeaconRing} />
                    <svg className={styles.playBeaconIcon} viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>

                  <div className={styles.posterBottomCredit}>
                    <span className={styles.creditBrand}>24 Frames Master Cinema</span>
                    <span className={styles.creditAction}>Click to Play Inline</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SPREAD PART B: THE HERITAGE DIPTYCH (Sireesh & Harshitha + Hrithika & Abhishek) */}
        <div className={`${styles.rhythmBlock} ${styles.editorialDiptych}`}>
          {/* Left Column: Sireesh & Harshitha */}
          <div className={styles.diptychColLeft}>
            <Link
              href={ITEM_PROJECT_02.storyUrl}
              className={styles.storyCardLink}
              aria-label={`Open wedding story: ${ITEM_PROJECT_02.clientNames}`}
            >
              <div
                className={styles.storyImageCanvas}
                style={{ aspectRatio: ITEM_PROJECT_02.aspectRatio }}
              >
                <picture>
                  <source srcSet={ITEM_PROJECT_02.webpImage} type="image/webp" />
                  <img
                    src={ITEM_PROJECT_02.image}
                    alt={ITEM_PROJECT_02.clientNames}
                    className={styles.storyCardImg}
                    style={{ objectPosition: ITEM_PROJECT_02.objectPosition }}
                    loading="lazy"
                  />
                </picture>
                <div className={styles.imageHoverSheen} />
              </div>

              <div className={styles.storyCardDetails}>
                <span className={styles.storyCategory}>{ITEM_PROJECT_02.categoryLabel}</span>
                <h4 className={styles.storyHeadline}>{ITEM_PROJECT_02.captionTitle}</h4>
                <div className={styles.storyMetaRow}>
                  <span className={styles.storyLocation}>{ITEM_PROJECT_02.location}</span>
                  <span className={styles.storyLinkArrow}>View Archive →</span>
                </div>
              </div>
            </Link>
          </div>

          {/* Right Column: Hrithika & Abhishek (Vertically Staggered for Editorial Asymmetry) */}
          <div className={styles.diptychColRight}>
            <Link
              href={ITEM_PROJECT_03.storyUrl}
              className={styles.storyCardLink}
              aria-label={`Open wedding story: ${ITEM_PROJECT_03.clientNames}`}
            >
              <div
                className={styles.storyImageCanvas}
                style={{ aspectRatio: ITEM_PROJECT_03.aspectRatio }}
              >
                <picture>
                  <source srcSet={ITEM_PROJECT_03.webpImage} type="image/webp" />
                  <img
                    src={ITEM_PROJECT_03.image}
                    alt={ITEM_PROJECT_03.clientNames}
                    className={styles.storyCardImg}
                    style={{ objectPosition: ITEM_PROJECT_03.objectPosition }}
                    loading="lazy"
                  />
                </picture>
                <div className={styles.imageHoverSheen} />
              </div>

              <div className={styles.storyCardDetails}>
                <span className={styles.storyCategory}>{ITEM_PROJECT_03.categoryLabel}</span>
                <h4 className={styles.storyHeadline}>{ITEM_PROJECT_03.captionTitle}</h4>
                <div className={styles.storyMetaRow}>
                  <span className={styles.storyLocation}>{ITEM_PROJECT_03.location}</span>
                  <span className={styles.storyLinkArrow}>View Archive →</span>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* SPREAD PART C: MOTION & INTIMACY DUET (Nishanth X Sanzena + Karthik & Gayathri) */}
        <div className={`${styles.rhythmBlock} ${styles.duetSpread}`}>
          {/* Left Column: Couple Shoot Film */}
          <div className={styles.duetColFilm}>
            <div className={styles.filmHeaderBar}>
              <span className={styles.storyCategory}>{ITEM_VIDEO_02.categoryLabel}</span>
              <h4 className={styles.duetHeading}>{ITEM_VIDEO_02.filmTitle}</h4>
              <p className={styles.duetExcerpt}>&ldquo;{ITEM_VIDEO_02.description}&rdquo;</p>
            </div>

            <div className={styles.duetVideoStage}>
              <div className={styles.cinemaFrame}>
                {activeInlineVideo === ITEM_VIDEO_02.id ? (
                  <div className={styles.videoPlayerContainer}>
                    <iframe
                      src={ITEM_VIDEO_02.embedUrl}
                      title={ITEM_VIDEO_02.filmTitle}
                      className={styles.videoIframe}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                    <button
                      type="button"
                      className={styles.closePlayerBtn}
                      onClick={() => setActiveInlineVideo(null)}
                      aria-label="Close cinema player"
                    >
                      ✕ Close Cinema
                    </button>
                  </div>
                ) : (
                  <div
                    className={styles.videoPosterArea}
                    onClick={() => setActiveInlineVideo(ITEM_VIDEO_02.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setActiveInlineVideo(ITEM_VIDEO_02.id);
                      }
                    }}
                    aria-label={`Play couple shoot film: ${ITEM_VIDEO_02.filmTitle}`}
                  >
                    <picture>
                      <source srcSet={ITEM_VIDEO_02.webpPoster} type="image/webp" />
                      <img
                        src={ITEM_VIDEO_02.poster}
                        alt={ITEM_VIDEO_02.filmTitle}
                        className={styles.videoPosterImg}
                        loading="lazy"
                      />
                    </picture>
                    <div className={styles.videoPosterVignette} />

                    <div className={styles.playBeacon}>
                      <div className={styles.playBeaconRing} />
                      <svg className={styles.playBeaconIcon} viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>

                    <div className={styles.posterBottomCredit}>
                      <span className={styles.creditBrand}>Couple Shoot Master Edit</span>
                      <span className={styles.creditAction}>Click to Play</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Karthik & Gayathri Portrait (Foreheads Touching Visible) */}
          <div className={styles.duetColStill}>
            <Link
              href={ITEM_PROJECT_04.storyUrl}
              className={styles.storyCardLink}
              aria-label={`Open fine-art embrace: ${ITEM_PROJECT_04.clientNames}`}
            >
              <div
                className={styles.storyImageCanvas}
                style={{ aspectRatio: ITEM_PROJECT_04.aspectRatio }}
              >
                <picture>
                  <source srcSet={ITEM_PROJECT_04.webpImage} type="image/webp" />
                  <img
                    src={ITEM_PROJECT_04.image}
                    alt={ITEM_PROJECT_04.clientNames}
                    className={styles.storyCardImg}
                    style={{ objectPosition: ITEM_PROJECT_04.objectPosition }}
                    loading="lazy"
                  />
                </picture>
                <div className={styles.imageHoverSheen} />
              </div>

              <div className={styles.storyCardDetails}>
                <span className={styles.storyCategory}>{ITEM_PROJECT_04.categoryLabel}</span>
                <h4 className={styles.storyHeadline}>{ITEM_PROJECT_04.captionTitle}</h4>
                <div className={styles.storyMetaRow}>
                  <span className={styles.storyLocation}>{ITEM_PROJECT_04.location}</span>
                  <span className={styles.storyLinkArrow}>View Archive →</span>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* ── 04: SECTION TRANSITION ────────────────────────────── */}
        <div className={styles.conclusionTransition}>
          <div className={styles.conclusionRule} />
          <div className={styles.conclusionActionRow}>
            <p className={styles.conclusionNote}>
              Each commission documented with the optical discipline of 35mm master cinema.
            </p>
            <Link href="/stories" className={styles.conclusionLink}>
              Explore Complete Vows Archive <span className={styles.conclusionArrow}>→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
