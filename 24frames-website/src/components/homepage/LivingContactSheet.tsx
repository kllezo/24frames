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
  movementLabel: string;
  clientNames: string;
  captionTitle: string;
  captionSub: string;
  category: string;
  location: string;
  image: string;
  webpImage: string;
  aspectRatio: string;
  storyUrl: string;
}

export interface GalleryFilmItem {
  id: string;
  orderNumber: string;
  movementLabel: string;
  filmTitle: string;
  category: string;
  duration: string;
  youtubeId: string;
  embedUrl: string;
  poster: string;
  webpPoster: string;
  description: string;
}

/* ── Six Verified Alternating Items ───────────────────────────────
   Rhythm: Project 1 → Video 1 → Project 2 → Project 3 → Video 2 → Project 4
   ──────────────────────────────────────────────────────────────── */

/* Item 1: Wedding Project 1 — Bellamkonda Sai Sreenivas & Kavya Reddy */
export const ITEM_PROJECT_01: GalleryProjectItem = {
  id: "project-01",
  orderNumber: "01",
  movementLabel: "01 / ROYAL RECEPTION ARCHIVE",
  clientNames: "Bellamkonda Sai Sreenivas & Kavya Reddy",
  captionTitle: "BELLAMKONDA SAI SREENIVAS & KAVYA REDDY",
  captionSub: "ROYAL RECEPTION · HYDERABAD",
  category: "Celebrity Wedding Reception",
  location: "GMR Arena & Shamshabad Estate, Hyderabad",
  image: "/images/stories/bellam-srikonda/IMG_6339.jpg",
  webpImage: "/images/stories/bellam-srikonda/IMG_6339.webp",
  aspectRatio: "3 / 4",
  storyUrl: "/stories/bellam-srikonda",
};

/* Item 2: Video 1 — The Existing First Video (Vinitha & Vivekananda) */
export const ITEM_VIDEO_01: GalleryFilmItem = {
  id: "video-01",
  orderNumber: "02",
  movementLabel: "02 / CINEMATIC FEATURE FILM",
  filmTitle: "Vinitha & Vivekananda | Wedding Feature Film",
  category: "Wedding Feature Film",
  duration: "14:55",
  youtubeId: "LNtlLgfT5uY",
  embedUrl: "https://www.youtube-nocookie.com/embed/LNtlLgfT5uY?autoplay=1&rel=0&playsinline=1&modestbranding=1",
  poster: "/videos/portfolio/vinitha-vivekananda/poster.jpg",
  webpPoster: "/videos/portfolio/vinitha-vivekananda/poster.webp",
  description: "A journey of love, patience, and devotion — where two years of togetherness lead to one life-changing sacred promise.",
};

/* Item 3: Wedding Project 2 — Sireesh & Harshitha */
export const ITEM_PROJECT_02: GalleryProjectItem = {
  id: "project-02",
  orderNumber: "03",
  movementLabel: "03 / SACRED WEDDING UNION",
  clientNames: "Sireesh & Harshitha",
  captionTitle: "SIREESH & HARSHITHA",
  captionSub: "SACRED WEDDING UNION · TELANGANA",
  category: "Sacred Wedding Union",
  location: "Hyderabad, Telangana",
  image: "/images/stories/sirish-and-harshitha/IMG_6353.jpg",
  webpImage: "/images/stories/sirish-and-harshitha/IMG_6353.webp",
  aspectRatio: "4 / 5",
  storyUrl: "/stories/sirish-and-harshitha",
};

/* Item 4: Wedding Project 3 — Hrithika & Abhishek */
export const ITEM_PROJECT_03: GalleryProjectItem = {
  id: "project-03",
  orderNumber: "04",
  movementLabel: "04 / CEREMONY & CELEBRATIONS",
  clientNames: "Hrithika & Abhishek",
  captionTitle: "HRITHIKA & ABHISHEK",
  captionSub: "NINE-SCENE CELEBRATION · HYDERABAD",
  category: "Ceremony & Celebrations",
  location: "Hyderabad, Telangana",
  image: "/images/stories/hrithika-abhishek/IMG_6333.jpg",
  webpImage: "/images/stories/hrithika-abhishek/IMG_6333.webp",
  aspectRatio: "4 / 3",
  storyUrl: "/stories/hrithika-abhishek",
};

/* Item 5: Video 2 — The Existing Second Video (Nishanth X Sanzena - Noticeably Smaller) */
export const ITEM_VIDEO_02: GalleryFilmItem = {
  id: "video-02",
  orderNumber: "05",
  movementLabel: "05 / CINEMA COUPLE INSERT",
  filmTitle: "Nishanth X Sanzena | Couple Shoot Film",
  category: "Couple Shoot Cinema Film",
  duration: "03:12",
  youtubeId: "s32UT21hnBg",
  embedUrl: "https://www.youtube-nocookie.com/embed/s32UT21hnBg?autoplay=1&rel=0&playsinline=1&modestbranding=1",
  poster: "/videos/portfolio/nishanth-sanzena/poster.jpg",
  webpPoster: "/videos/portfolio/nishanth-sanzena/poster.webp",
  description: "The unfolding love story of Nishanth & Sanzena — where every moment, every frame, and every smile captures their eternal bond.",
};

/* Item 6: Wedding Project 4 — Karthik & Gayathri */
export const ITEM_PROJECT_04: GalleryProjectItem = {
  id: "project-04",
  orderNumber: "06",
  movementLabel: "06 / FINE-ART HERITAGE ARCHIVE",
  clientNames: "Karthik & Gayathri",
  captionTitle: "KARTHIK & GAYATHRI",
  captionSub: "FINE-ART WEDDING · HYDERABAD",
  category: "Fine-Art Heritage Wedding",
  location: "Hyderabad, Telangana",
  image: "/images/stories/karthik-and-gayathri/IMG_6330.jpg",
  webpImage: "/images/stories/karthik-and-gayathri/IMG_6330.webp",
  aspectRatio: "3 / 4",
  storyUrl: "/stories/karthik-and-gayathri",
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
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
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
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power2.out",
            scrollTrigger: {
              trigger: block,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  /* Keyboard escape to dismiss inline video players */
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

        {/* ── Section Header ───────────────────────────────────── */}
        <div ref={headerRef} className={styles.header}>
          <div className={styles.headerMeta}>
            <span className={styles.label}>Chapter 02 — Archival Cinema &amp; Photography</span>
            <span className={styles.referenceBadge}>ORIGINAL COMMISSIONS</span>
          </div>
          <h2 className={styles.title}>THE VOWS</h2>
          <p className={styles.subtitle}>
            An intimate anthology of sacred promises, royal unions, and cinematic wedding films, capturing monumental celebrations and quiet generational moments.
          </p>
          <div className={styles.headerRuleRow}>
            <span className={styles.headerRule} />
            <span className={styles.headerRuleLabel}>CURATED SELECTION</span>
            <span className={styles.headerRule} />
          </div>
        </div>

        {/* ── Editorial Asymmetric Stream: Refined Balanced Compositions ─────────────── */}
        <div className={styles.editorialStream}>
          {/* ─────────────────────────────────────────────────────────────
              ITEM 1: Lead Editorial Feature — Bellamkonda Sai Sreenivas & Kavya Reddy
              Balanced Two-Column Journal Composition: Controlled Image (Left) + Editorial Panel (Right)
              ───────────────────────────────────────────────────────────── */}
          <div className={`${styles.rhythmBlock} ${styles.itemLeadWrapper}`}>
            <div className={styles.leadJournalGrid}>
              {/* Left: Controlled Editorial Photo (scaled down ~25%, 480–520px) */}
              <div className={styles.leadVisualCol}>
                <Link
                  href={ITEM_PROJECT_01.storyUrl}
                  className={`${styles.photoFigure} ${styles.figureLead}`}
                  aria-label={`Open Bellam Srikonda archive — ${ITEM_PROJECT_01.clientNames}`}
                >
                  <div
                    className={styles.imageContainer}
                    style={{ aspectRatio: ITEM_PROJECT_01.aspectRatio }}
                  >
                    <picture>
                      <source srcSet={ITEM_PROJECT_01.webpImage} type="image/webp" />
                      <img
                        src={ITEM_PROJECT_01.image}
                        alt={ITEM_PROJECT_01.clientNames}
                        className={styles.galleryImage}
                        loading="eager"
                      />
                    </picture>
                  </div>
                </Link>
              </div>

              {/* Right: Restrained Supporting Editorial Journal Info */}
              <div className={styles.leadEditorialCol}>
                <div className={styles.leadLabelBadge}>
                  <span className={styles.itemLabel}>{ITEM_PROJECT_01.movementLabel}</span>
                </div>

                <h3 className={styles.leadTitle}>{ITEM_PROJECT_01.clientNames}</h3>
                <p className={styles.leadMeta}>{ITEM_PROJECT_01.category} · {ITEM_PROJECT_01.location}</p>

                <p className={styles.leadNarrative}>
                  The quiet sacred moments captured right before the grand celebration procession begins. Documented with theatrical lighting discipline, quiet poise, and prime cinema optics.
                </p>

                <div className={styles.leadActionRow}>
                  <Link href={ITEM_PROJECT_01.storyUrl} className={styles.leadStoryLink}>
                    Step Inside Archival Story <span>→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              ITEM 2: Video 1 — Existing First Video (Vinitha & Vivekananda)
              Refined Cinema Stage · Balanced 80% Span (~860px) · Elegant Controls
              ───────────────────────────────────────────────────────────── */}
          <div className={`${styles.rhythmBlock} ${styles.itemVideoHeroWrapper}`}>
            <div className={styles.itemLabelRow}>
              <span className={styles.itemLabel}>{ITEM_VIDEO_01.movementLabel}</span>
              <span className={styles.durationBadge}>DURATION · {ITEM_VIDEO_01.duration}</span>
            </div>

            <div className={styles.cinemaStageHero}>
              <div className={styles.cinemaFrameHero}>
                {activeInlineVideo === ITEM_VIDEO_01.id ? (
                  <div className={styles.inlinePlayerContainer}>
                    <iframe
                      src={ITEM_VIDEO_01.embedUrl}
                      title={ITEM_VIDEO_01.filmTitle}
                      className={styles.inlineIframe}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                    <button
                      type="button"
                      className={styles.inlineCloseBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveInlineVideo(null);
                      }}
                      aria-label="Stop video and return to preview"
                    >
                      ✕ Close Player
                    </button>
                  </div>
                ) : (
                  <div
                    className={styles.previewClickArea}
                    onClick={() => setActiveInlineVideo(ITEM_VIDEO_01.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setActiveInlineVideo(ITEM_VIDEO_01.id);
                      }
                    }}
                    aria-label={`Play ${ITEM_VIDEO_01.filmTitle} inline`}
                  >
                    <picture>
                      <source srcSet={ITEM_VIDEO_01.webpPoster} type="image/webp" />
                      <img
                        src={ITEM_VIDEO_01.poster}
                        alt={ITEM_VIDEO_01.filmTitle}
                        className={styles.cinemaPoster}
                        loading="lazy"
                      />
                    </picture>
                    <div className={styles.cinemaVignette} />

                    <div className={styles.playBeacon}>
                      <div className={styles.playPulse} />
                      <svg className={styles.playIcon} viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>

                    <div className={styles.cinemaTopBar}>
                      <span className={styles.cinemaBadge}>24 FRAMES WEDDING FILMS</span>
                      <span className={styles.cinemaDuration}>{ITEM_VIDEO_01.duration}</span>
                    </div>

                    <div className={styles.cinemaBottomBar}>
                      <span className={styles.cinemaCategory}>{ITEM_VIDEO_01.category.toUpperCase()}</span>
                      <h3 className={styles.cinemaTitle}>{ITEM_VIDEO_01.filmTitle}</h3>
                      <p className={styles.cinemaQuote}>&ldquo;{ITEM_VIDEO_01.description}&rdquo;</p>
                    </div>
                  </div>
                )}
              </div>

              <div className={styles.filmUnderMeta}>
                <span className={styles.filmClickHint}>
                  {activeInlineVideo === ITEM_VIDEO_01.id
                    ? "Playing inline — use player controls for volume or full-screen"
                    : "Click preview to begin playback inline without navigating away"}
                </span>
              </div>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              MIDDLE SECTION: Two Projects (Items 3 & 4)
              Balanced Asymmetric Pair: Sireesh & Harshitha (Portrait) + Hrithika & Abhishek (Landscape)
              ───────────────────────────────────────────────────────────── */}
          <div className={`${styles.rhythmBlock} ${styles.middleSection}`}>
            {/* ITEM 3: Wedding Project 2 — Sireesh & Harshitha (Left, Portrait) */}
            <div className={styles.middleColLeft}>
              <div className={styles.itemLabelRow}>
                <span className={styles.itemLabel}>{ITEM_PROJECT_02.movementLabel}</span>
              </div>

              <Link
                href={ITEM_PROJECT_02.storyUrl}
                className={`${styles.photoFigure} ${styles.figureMiddleL}`}
                aria-label={`Open Sireesh & Harshitha archive — ${ITEM_PROJECT_02.clientNames}`}
              >
                <div
                  className={styles.imageContainer}
                  style={{ aspectRatio: ITEM_PROJECT_02.aspectRatio }}
                >
                  <picture>
                    <source srcSet={ITEM_PROJECT_02.webpImage} type="image/webp" />
                    <img
                      src={ITEM_PROJECT_02.image}
                      alt={ITEM_PROJECT_02.clientNames}
                      className={styles.galleryImage}
                      loading="eager"
                    />
                  </picture>
                </div>
                <div className={styles.editorialCaption}>
                  <div className={styles.captionMain}>
                    <div className={styles.captionTitleRow}>
                      <span className={styles.captionTitle}>{ITEM_PROJECT_02.captionTitle}</span>
                      <span
                        className={styles.cardArrow}
                        aria-label="Open Sireesh & Harshitha archive"
                        title="Open Sireesh & Harshitha archive"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                          <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                      </span>
                    </div>
                    <span className={styles.captionMeta}>{ITEM_PROJECT_02.captionSub}</span>
                  </div>
                </div>
              </Link>
            </div>

            {/* ITEM 4: Wedding Project 3 — Hrithika & Abhishek (Right, Landscape) */}
            <div className={styles.middleColRight}>
              <div className={styles.itemLabelRow}>
                <span className={styles.itemLabel}>{ITEM_PROJECT_03.movementLabel}</span>
              </div>

              <Link
                href={ITEM_PROJECT_03.storyUrl}
                className={`${styles.photoFigure} ${styles.figureMiddleR}`}
                aria-label={`Open Hrithika & Abhishek archive — ${ITEM_PROJECT_03.clientNames}`}
              >
                <div
                  className={styles.imageContainer}
                  style={{ aspectRatio: ITEM_PROJECT_03.aspectRatio }}
                >
                  <picture>
                    <source srcSet={ITEM_PROJECT_03.webpImage} type="image/webp" />
                    <img
                      src={ITEM_PROJECT_03.image}
                      alt={ITEM_PROJECT_03.clientNames}
                      className={styles.galleryImage}
                      style={{ objectPosition: "center 22%" }}
                      loading="eager"
                    />
                  </picture>
                </div>
                <div className={styles.editorialCaption}>
                  <div className={styles.captionMain}>
                    <div className={styles.captionTitleRow}>
                      <span className={styles.captionTitle}>{ITEM_PROJECT_03.captionTitle}</span>
                      <span
                        className={styles.cardArrow}
                        aria-label="Open Hrithika & Abhishek archive"
                        title="Open Hrithika & Abhishek archive"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                          <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                      </span>
                    </div>
                    <span className={styles.captionMeta}>{ITEM_PROJECT_03.captionSub}</span>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              CONCLUDING COMPOSITION: Motion & Still Duet (Items 5 & 6 Paired)
              Left: Item 5 (Nishanth X Sanzena Film) · Right: Item 6 (Karthik & Gayathri Portrait)
              Eliminates accidental empty columns and long vertical scroll
              ───────────────────────────────────────────────────────────── */}
          <div className={`${styles.rhythmBlock} ${styles.concludingDuet}`}>
            {/* Left: Couple Shoot Cinema Film (Nishanth X Sanzena) */}
            <div className={styles.concludingFilmCol}>
              <div className={styles.insertHeaderRow}>
                <span className={styles.itemLabel}>{ITEM_VIDEO_02.movementLabel}</span>
                <span className={styles.durationBadge}>DURATION · {ITEM_VIDEO_02.duration}</span>
              </div>

              <div className={styles.cinemaStageInsert}>
                <div className={styles.cinemaFrameInsert}>
                  {activeInlineVideo === ITEM_VIDEO_02.id ? (
                    <div className={styles.inlinePlayerContainer}>
                      <iframe
                        src={ITEM_VIDEO_02.embedUrl}
                        title={ITEM_VIDEO_02.filmTitle}
                        className={styles.inlineIframe}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                      <button
                        type="button"
                        className={styles.inlineCloseBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveInlineVideo(null);
                        }}
                        aria-label="Stop video and return to preview"
                      >
                        ✕ Close Player
                      </button>
                    </div>
                  ) : (
                    <div
                      className={styles.previewClickArea}
                      onClick={() => setActiveInlineVideo(ITEM_VIDEO_02.id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setActiveInlineVideo(ITEM_VIDEO_02.id);
                        }
                      }}
                      aria-label={`Play ${ITEM_VIDEO_02.filmTitle} inline`}
                    >
                      <picture>
                        <source srcSet={ITEM_VIDEO_02.webpPoster} type="image/webp" />
                        <img
                          src={ITEM_VIDEO_02.poster}
                          alt={ITEM_VIDEO_02.filmTitle}
                          className={styles.cinemaPoster}
                          loading="lazy"
                        />
                      </picture>
                      <div className={styles.cinemaVignette} />

                      <div className={`${styles.playBeacon} ${styles.playBeaconInsert}`}>
                        <div className={styles.playPulse} />
                        <svg className={styles.playIcon} viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>

                      <div className={styles.cinemaTopBar}>
                        <span className={styles.cinemaBadge}>CINEMA INSERT</span>
                        <span className={styles.cinemaDuration}>{ITEM_VIDEO_02.duration}</span>
                      </div>

                      <div className={styles.cinemaBottomBar}>
                        <span className={styles.cinemaCategory}>{ITEM_VIDEO_02.category.toUpperCase()}</span>
                        <h3 className={`${styles.cinemaTitle} ${styles.cinemaTitleInsert}`}>{ITEM_VIDEO_02.filmTitle}</h3>
                        <p className={`${styles.cinemaQuote} ${styles.cinemaQuoteInsert}`}>&ldquo;{ITEM_VIDEO_02.description}&rdquo;</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className={styles.filmUnderMeta}>
                  <span className={styles.filmClickHint}>
                    {activeInlineVideo === ITEM_VIDEO_02.id
                      ? "Playing inline — use player controls"
                      : "Click preview to begin playback inline"}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Fine-Art Wedding Portrait (Karthik & Gayathri) */}
            <div className={styles.concludingStillCol}>
              <div className={styles.itemLabelRow}>
                <span className={styles.itemLabel}>{ITEM_PROJECT_04.movementLabel}</span>
              </div>

              <Link
                href={ITEM_PROJECT_04.storyUrl}
                className={`${styles.photoFigure} ${styles.figureFinal}`}
                aria-label={`Open Karthik & Gayathri archive — ${ITEM_PROJECT_04.clientNames}`}
              >
                <div
                  className={styles.imageContainer}
                  style={{ aspectRatio: ITEM_PROJECT_04.aspectRatio }}
                >
                  <picture>
                    <source srcSet={ITEM_PROJECT_04.webpImage} type="image/webp" />
                    <img
                      src={ITEM_PROJECT_04.image}
                      alt={ITEM_PROJECT_04.clientNames}
                      className={styles.galleryImage}
                      loading="eager"
                    />
                  </picture>
                </div>
                <div className={styles.editorialCaption}>
                  <div className={styles.captionMain}>
                    <div className={styles.captionTitleRow}>
                      <span className={styles.captionTitle}>{ITEM_PROJECT_04.captionTitle}</span>
                      <span
                        className={styles.cardArrow}
                        aria-label="Open Karthik & Gayathri archive"
                        title="Open Karthik & Gayathri archive"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                          <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                      </span>
                    </div>
                    <span className={styles.captionMeta}>{ITEM_PROJECT_04.captionSub}</span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
