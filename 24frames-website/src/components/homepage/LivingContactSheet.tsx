"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./LivingContactSheet.module.css";

gsap.registerPlugin(ScrollTrigger);

/* ── Types & Interfaces ────────────────────────────────────────── */
export interface ExhibitionPhoto {
  id: string;
  title: string;
  clientNames: string;
  captionTitle: string;
  captionSub: string;
  category: string;
  location: string;
  image: string;
  webpImage: string;
  aspectRatio: string;
  widthPercent: number;
  offsetY?: number;
  projectSlug: string;
  sourceUrl: string;
  platform: "Pic-Time";
}

export interface ExhibitionFilm {
  id: string;
  title: string;
  filmTitle: string;
  category: string;
  duration: string;
  uploadDate: string;
  youtubeId: string;
  embedUrl: string;
  poster: string;
  webpPoster: string;
  sourceUrl: string;
  description: string;
}

export interface ExhibitionPairingMovement {
  id: string;
  type: "pairing";
  movementLabel: string;
  primary: ExhibitionPhoto;
  secondary: ExhibitionPhoto;
}

export interface ExhibitionCinemaMovement {
  id: string;
  type: "cinema";
  movementLabel: string;
  film: ExhibitionFilm;
}

export type ExhibitionMovement = ExhibitionPairingMovement | ExhibitionCinemaMovement;

/* ── Verified Cinema Films (Swapped per Requirement 3) ──────────── */
/* Position 1: Vinitha & Vivekananda (Swapped from position 2) */
export const FILM_VINITHA_VIVEKANANDA: ExhibitionFilm = {
  id: "film-01",
  title: "Vinitha & Vivekananda",
  filmTitle: "Vinitha & Vivekananda | Wedding Feature Film",
  category: "Wedding Feature Film",
  duration: "14:55",
  uploadDate: "August 2023",
  youtubeId: "LNtlLgfT5uY",
  embedUrl: "https://www.youtube-nocookie.com/embed/LNtlLgfT5uY?autoplay=1&rel=0&playsinline=1&modestbranding=1",
  poster: "/videos/portfolio/vinitha-vivekananda/poster.jpg",
  webpPoster: "/videos/portfolio/vinitha-vivekananda/poster.webp",
  sourceUrl: "https://youtu.be/LNtlLgfT5uY",
  description: "A journey of love, patience, and devotion — where two years of togetherness lead to one life-changing sacred promise.",
};

/* Position 2: Nishanth X Sanzena (Swapped from position 1) */
export const FILM_NISHANTH_SANZENA: ExhibitionFilm = {
  id: "film-02",
  title: "Nishanth & Sanzena",
  filmTitle: "Nishanth X Sanzena | Couple Shoot Film",
  category: "Couple Shoot Cinema Film",
  duration: "03:12",
  uploadDate: "July 2024",
  youtubeId: "s32UT21hnBg",
  embedUrl: "https://www.youtube-nocookie.com/embed/s32UT21hnBg?autoplay=1&rel=0&playsinline=1&modestbranding=1",
  poster: "/videos/portfolio/nishanth-sanzena/poster.jpg",
  webpPoster: "/videos/portfolio/nishanth-sanzena/poster.webp",
  sourceUrl: "https://youtu.be/s32UT21hnBg",
  description: "The unfolding love story of Nishanth & Sanzena — where every moment, every frame, and every smile captures their eternal bond.",
};

/* ── Verified The Vows Editorial Movements ─────────────────────── */
export const VOWS_MOVEMENTS: ExhibitionMovement[] = [
  /* Movement 01: Cinema Feature Film (Position 1 — Vinitha & Vivekananda) */
  {
    id: "movement-01",
    type: "cinema",
    movementLabel: "MOVEMENT 01 / FEATURE WEDDING FILM",
    film: FILM_VINITHA_VIVEKANANDA,
  },

  /* Movement 02: Royal Reception & Sacred Vows (Pairing) */
  {
    id: "movement-02",
    type: "pairing",
    movementLabel: "MOVEMENT 02 / ROYAL RECEPTION & SACRED VOWS",
    primary: {
      id: "vow-photo-01",
      title: "Celebrity Wedding Reception",
      clientNames: "Bellamkonda Sai Sreenivas & Kavya Reddy",
      captionTitle: "BELLAMKONDA SAI SREENIVAS & KAVYA REDDY",
      captionSub: "ROYAL RECEPTION · HYDERABAD",
      category: "Celebrity Wedding Reception",
      location: "GMR Arena & Shamshabad Estate, Hyderabad",
      image: "/images/portfolio/bellamkonda-kavya-reception/cover.jpg",
      webpImage: "/images/portfolio/bellamkonda-kavya-reception/cover.webp",
      aspectRatio: "16 / 9",
      widthPercent: 54,
      projectSlug: "bellamkonda-kavya-reception",
      sourceUrl: "https://24frames.pic-time.com/8P0kK5ZUmew5F",
      platform: "Pic-Time",
    },
    secondary: {
      id: "vow-photo-02",
      title: "Sacred Wedding Union",
      clientNames: "Sireesh & Harshitha",
      captionTitle: "SIREESH & HARSHITHA",
      captionSub: "WEDDING CELEBRATION · TELANGANA",
      category: "Wedding Celebration",
      location: "Hyderabad, Telangana",
      image: "/images/portfolio/sireesh-harshitha/cover.jpg",
      webpImage: "/images/portfolio/sireesh-harshitha/cover.webp",
      aspectRatio: "4 / 5",
      widthPercent: 34,
      offsetY: 55,
      projectSlug: "sireesh-harshitha",
      sourceUrl: "https://24frames.pic-time.com/8Nq0pv3SJbxKn",
      platform: "Pic-Time",
    },
  },

  /* Movement 03: Cinema Couple Film (Position 2 — Nishanth X Sanzena) */
  {
    id: "movement-03",
    type: "cinema",
    movementLabel: "MOVEMENT 03 / CINEMATIC COUPLE FILM",
    film: FILM_NISHANTH_SANZENA,
  },

  /* Movement 04: Classical Fine-Art & Multi-Day Rituals (Pairing) */
  {
    id: "movement-04",
    type: "pairing",
    movementLabel: "MOVEMENT 04 / FINE-ART HERITAGE & SACRED CELEBRATION",
    primary: {
      id: "vow-photo-03",
      title: "Ceremony & Celebrations",
      clientNames: "Hrithika & Abhishek",
      captionTitle: "HRITHIKA & ABHISHEK",
      captionSub: "WEDDING & NINE-SCENE CELEBRATION",
      category: "Wedding & Celebrations",
      location: "Hyderabad, Telangana",
      image: "/images/portfolio/hrithika-abhishek/cover.jpg",
      webpImage: "/images/portfolio/hrithika-abhishek/cover.webp",
      aspectRatio: "16 / 9",
      widthPercent: 54,
      projectSlug: "hrithika-abhishek",
      sourceUrl: "https://24frames.pic-time.com/whZsXRiO6XgQn",
      platform: "Pic-Time",
    },
    secondary: {
      id: "vow-photo-04",
      title: "Fine-Art Heritage Wedding",
      clientNames: "Karthik & Gayathri",
      captionTitle: "KARTHIK & GAYATHRI",
      captionSub: "FINE-ART WEDDING · HYDERABAD",
      category: "Wedding Celebrations",
      location: "Hyderabad, Telangana",
      image: "/images/portfolio/karthik-gayathri/cover.jpg",
      webpImage: "/images/portfolio/karthik-gayathri/cover.webp",
      aspectRatio: "3 / 4",
      widthPercent: 34,
      offsetY: -30,
      projectSlug: "karthik-gayathri",
      sourceUrl: "https://24frames.pic-time.com/yBCmkKcczvWql",
      platform: "Pic-Time",
    },
  },
];

export default function LivingContactSheet() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const movementsRef = useRef<HTMLDivElement>(null);

  /* Inline video player state: when set to film.id, plays directly in the same area */
  const [activeInlineVideo, setActiveInlineVideo] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<ExhibitionPhoto | null>(null);

  /* GSAP entrance animation */
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
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      const blocks = gsap.utils.toArray<HTMLElement>(`.${styles.movementBlock}`);
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
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  /* Keyboard escape for inline video or photo lightbox */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveInlineVideo(null);
        setSelectedPhoto(null);
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
      aria-label="The Vows — Cinematic Wedding Films & Photography"
    >
      <div className={styles.container}>
        {/* Anchor aliases for backward compatibility */}
        <div id="collection" className={styles.anchorOffset} aria-hidden="true" />
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

        {/* ── Editorial Movements Stream (Spacious Ivory Whitespace) ── */}
        <div ref={movementsRef} className={styles.movementsContainer}>
          {VOWS_MOVEMENTS.map((mov) => {
            if (mov.type === "cinema") {
              const film = mov.film;
              const isPlaying = activeInlineVideo === film.id;

              return (
                <div key={mov.id} className={`${styles.movementBlock} ${styles.cinemaMovement}`}>
                  <div className={styles.movementLabelRow}>
                    <span className={styles.movementLabel}>{mov.movementLabel}</span>
                    <span className={styles.movementDurationBadge}>DURATION · {film.duration}</span>
                  </div>

                  <div className={styles.cinemaStage}>
                    <div className={styles.cinemaFrame}>
                      {isPlaying ? (
                        /* Inline Official Video Player — Plays directly inside container */
                        <div className={styles.inlinePlayerContainer}>
                          <iframe
                            src={film.embedUrl}
                            title={film.filmTitle}
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
                        /* Standalone Video Preview with Gold Play Affordance */
                        <div
                          className={styles.previewClickArea}
                          onClick={() => setActiveInlineVideo(film.id)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              setActiveInlineVideo(film.id);
                            }
                          }}
                          aria-label={`Play ${film.filmTitle} inline`}
                        >
                          <picture>
                            <source srcSet={film.webpPoster} type="image/webp" />
                            <img
                              src={film.poster}
                              alt={film.filmTitle}
                              className={styles.cinemaPoster}
                              loading="lazy"
                            />
                          </picture>
                          <div className={styles.cinemaVignette} />

                          {/* Gold Play Button Affordance */}
                          <div className={styles.playBeacon}>
                            <div className={styles.playPulse} />
                            <svg className={styles.playIcon} viewBox="0 0 24 24" fill="currentColor">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>

                          {/* Top Badges */}
                          <div className={styles.cinemaTopBar}>
                            <span className={styles.cinemaBadge}>24 FRAMES WEDDING FILMS</span>
                            <span className={styles.cinemaDuration}>{film.duration}</span>
                          </div>

                          {/* Bottom Film Narrative */}
                          <div className={styles.cinemaBottomBar}>
                            <span className={styles.cinemaCategory}>{film.category.toUpperCase()}</span>
                            <h3 className={styles.cinemaTitle}>{film.filmTitle}</h3>
                            <p className={styles.cinemaQuote}>&ldquo;{film.description}&rdquo;</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className={styles.filmUnderMeta}>
                      <span className={styles.filmClickHint}>
                        {isPlaying
                          ? "Playing inline — use player controls for volume or full-screen"
                          : "Click preview to begin playback inline without navigating away"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            }

            /* Pairing Movement: Two balanced photographs with generous 14% canal */
            return (
              <div key={mov.id} className={`${styles.movementBlock} ${styles.pairingMovement}`}>
                <div className={styles.movementLabelRow}>
                  <span className={styles.movementLabel}>{mov.movementLabel}</span>
                </div>

                <div className={styles.pairingRow}>
                  {/* Primary Photograph */}
                  <div
                    className={`${styles.galleryFigure} ${styles.primaryFigure}`}
                    style={{
                      "--photo-width": `${mov.primary.widthPercent}%`,
                      "--photo-offset-y": `${mov.primary.offsetY || 0}px`,
                    } as React.CSSProperties}
                    onClick={() => setSelectedPhoto(mov.primary)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedPhoto(mov.primary);
                      }
                    }}
                    aria-label={`${mov.primary.clientNames} — ${mov.primary.category}. Click to enlarge.`}
                  >
                    <div
                      className={styles.imageContainer}
                      style={{ aspectRatio: mov.primary.aspectRatio }}
                    >
                      <picture>
                        <source srcSet={mov.primary.webpImage} type="image/webp" />
                        <img
                          src={mov.primary.image}
                          alt={mov.primary.title}
                          className={styles.galleryImage}
                          loading="lazy"
                        />
                      </picture>
                      <div className={styles.imageCornerBadge}>PIC-TIME ARCHIVE</div>
                    </div>
                    <div className={styles.editorialCaption}>
                      <div className={styles.captionMain}>
                        <span className={styles.captionTitle}>{mov.primary.captionTitle}</span>
                        <span className={styles.captionMeta}>{mov.primary.captionSub}</span>
                      </div>
                      <a
                        href={mov.primary.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.sourceExternalLink}
                        onClick={(e) => e.stopPropagation()}
                        title="Open official Pic-Time gallery"
                      >
                        Pic-Time ↗
                      </a>
                    </div>
                  </div>

                  {/* Secondary Photograph */}
                  <div
                    className={`${styles.galleryFigure} ${styles.secondaryFigure}`}
                    style={{
                      "--photo-width": `${mov.secondary.widthPercent}%`,
                      "--photo-offset-y": `${mov.secondary.offsetY || 0}px`,
                    } as React.CSSProperties}
                    onClick={() => setSelectedPhoto(mov.secondary)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedPhoto(mov.secondary);
                      }
                    }}
                    aria-label={`${mov.secondary.clientNames} — ${mov.secondary.category}. Click to enlarge.`}
                  >
                    <div
                      className={styles.imageContainer}
                      style={{ aspectRatio: mov.secondary.aspectRatio }}
                    >
                      <picture>
                        <source srcSet={mov.secondary.webpImage} type="image/webp" />
                        <img
                          src={mov.secondary.image}
                          alt={mov.secondary.title}
                          className={styles.galleryImage}
                          loading="lazy"
                        />
                      </picture>
                      <div className={styles.imageCornerBadge}>PIC-TIME ARCHIVE</div>
                    </div>
                    <div className={styles.editorialCaption}>
                      <div className={styles.captionMain}>
                        <span className={styles.captionTitle}>{mov.secondary.captionTitle}</span>
                        <span className={styles.captionMeta}>{mov.secondary.captionSub}</span>
                      </div>
                      <a
                        href={mov.secondary.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.sourceExternalLink}
                        onClick={(e) => e.stopPropagation()}
                        title="Open official Pic-Time gallery"
                      >
                        Pic-Time ↗
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 35MM PHOTOGRAPH LIGHTBOX MODAL ───────────────────── */}
      {selectedPhoto && (
        <div
          className={styles.modalBackdrop}
          onClick={() => setSelectedPhoto(null)}
          role="dialog"
          aria-modal="true"
          aria-label={selectedPhoto.title}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.modalCloseBtn}
              onClick={() => setSelectedPhoto(null)}
              aria-label="Close frame preview"
            >
              ✕
            </button>

            <div className={styles.modalLayout}>
              <div className={styles.modalImageWrap}>
                <img
                  src={selectedPhoto.webpImage || selectedPhoto.image}
                  alt={selectedPhoto.title}
                  className={styles.modalImage}
                />
              </div>

              <div className={styles.modalSidebar}>
                <div className={styles.modalHeaderStrip}>
                  <span className={styles.modalFrameNo}>VERIFIED ARCHIVE</span>
                  <span className={styles.modalCategory}>
                    {selectedPhoto.category.toUpperCase()}
                  </span>
                </div>

                <h3 className={styles.modalTitle}>{selectedPhoto.clientNames}</h3>
                <p className={styles.modalLocation}>{selectedPhoto.location}</p>

                <div className={styles.specBox}>
                  <div className={styles.specRow}>
                    <span className={styles.specLabel}>Provenance</span>
                    <span className={styles.specVal}>Official 24 Frames Pic-Time Gallery</span>
                  </div>
                  <div className={styles.specRow}>
                    <span className={styles.specLabel}>Color Emulsion</span>
                    <span className={styles.specVal}>24F Custom Warm Curve</span>
                  </div>
                  <div className={styles.specRow}>
                    <span className={styles.specLabel}>Master Curator</span>
                    <span className={styles.specVal}>Phani Gogireddy</span>
                  </div>
                </div>

                <div className={styles.modalActions}>
                  <a
                    href={selectedPhoto.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.modalExternalBtn}
                  >
                    Open Official Pic-Time Gallery ↗
                  </a>
                  {selectedPhoto.projectSlug && (
                    <Link
                      href={`/work/${selectedPhoto.projectSlug}`}
                      className={styles.modalStoryBtn}
                      onClick={() => setSelectedPhoto(null)}
                    >
                      Step Inside Project Archive →
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
