"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { DisciplineVideo, DisciplineGalleryImage } from "@/data/disciplines";
import styles from "./DisciplineInteractiveMedia.module.css";

interface DisciplineInteractiveMediaProps {
  videos?: DisciplineVideo[];
  gallery: DisciplineGalleryImage[];
  shortTitle: string;
}

const CINEMA_EDITORIAL_INTERLUDES = [
  {
    quote: "“Every frame holds a world beyond the moment.”",
    sub: "ANAMORPHIC SCOPE · 2.39:1 CELLULOID GRAIN",
  },
  {
    quote: "“Light becomes memory. Movement becomes story.”",
    sub: "THEATRICAL DISCIPLINE · VOLUMETRIC ILLUMINATION",
  },
  {
    quote: "“The art of seeing what others feel.”",
    sub: "ORCHESTRAL SOUND · UNGUARDED TRUTH",
  },
  {
    quote: "“A fleeting moment, composed to endure.”",
    sub: "ARCHIVAL COLOR SCIENCE · MASTER PRINTS",
  },
];

export default function DisciplineInteractiveMedia({
  videos,
  gallery,
  shortTitle,
}: DisciplineInteractiveMediaProps) {
  // Modal states
  const [activeVideo, setActiveVideo] = useState<DisciplineVideo | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);

  // Close handlers
  const handleCloseVideo = useCallback(() => {
    setActiveVideo(null);
  }, []);

  const handleCloseImage = useCallback(() => {
    setActiveImageIndex(null);
  }, []);

  // Keyboard navigation for modals (Escape, Left, Right)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (activeVideo) handleCloseVideo();
        if (activeImageIndex !== null) handleCloseImage();
      } else if (activeImageIndex !== null) {
        if (e.key === "ArrowLeft") {
          setActiveImageIndex((prev) =>
            prev !== null && prev > 0 ? prev - 1 : gallery.length - 1
          );
        } else if (e.key === "ArrowRight") {
          setActiveImageIndex((prev) =>
            prev !== null && prev < gallery.length - 1 ? prev + 1 : 0
          );
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeVideo, activeImageIndex, gallery.length, handleCloseVideo, handleCloseImage]);

  // Lock body scroll when any modal is open
  useEffect(() => {
    if (activeVideo || activeImageIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeVideo, activeImageIndex]);

  const featuredVideo = videos && videos.length > 0 ? videos[0] : null;
  const secondaryVideos = videos && videos.length > 1 ? videos.slice(1) : [];

  return (
    <>
      {/* ── FEATURED CINEMATIC MASTERPIECE (WHERE AVAILABLE) ── */}
      {featuredVideo && (
        <section
          className={styles.featuredVideoSection}
          aria-label="Featured Cinema Masterpiece"
        >
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionMeta}>
                <span className={styles.sectionChapter}>FEATURED MOTION PICTURE</span>
                <span className={styles.sectionBadge}>MASTER SELECTION · 4K THEATRICAL</span>
              </div>
              <h2 className={styles.sectionTitle}>The Theatrical Master Film</h2>
              <p className={styles.sectionSubtitle}>
                Crafted with prime anamorphic glass, 32-bit float orchestral sound recording, and custom 24F celluloid color science.
              </p>
            </div>

            {/* Featured 16:9 Screen */}
            <div
              className={styles.featuredPlayerCard}
              onClick={() => setActiveVideo(featuredVideo)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setActiveVideo(featuredVideo);
                }
              }}
              aria-label={`Watch featured cinema film: ${featuredVideo.title}`}
            >
              <div className={styles.featuredPosterWrap}>
                <img
                  src={featuredVideo.poster}
                  alt={featuredVideo.title}
                  className={styles.featuredPosterImg}
                  loading="eager"
                />
                <div className={styles.featuredVignette} />

                {/* Prominent Golden Play Affordance */}
                <div className={styles.featuredPlayBtn}>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="7 4 19 12 7 20 7 4" />
                  </svg>
                </div>

                <div className={styles.featuredDurationBadge}>
                  {featuredVideo.duration} · 2.39:1 ANAMORPHIC
                </div>

                <div className={styles.featuredTitleOverlay}>
                  <span className={styles.featuredClientKicker}>
                    COMMISSION · {featuredVideo.client}
                  </span>
                  <h3 className={styles.featuredMovieTitle}>
                    {featuredVideo.title}
                  </h3>
                </div>
              </div>

              {/* Concise Film Information Strip */}
              <div className={styles.filmInfoStrip}>
                <div className={styles.infoCell}>
                  <span className={styles.infoLabel}>DIRECTOR & LEAD CINEMATOGRAPHER</span>
                  <span className={styles.infoVal}>Phani Gogireddy</span>
                </div>
                <div className={styles.infoCell}>
                  <span className={styles.infoLabel}>OPTICS & FORMAT</span>
                  <span className={styles.infoVal}>Sony FX Cinema Line & Anamorphic Primes</span>
                </div>
                <div className={styles.infoCell}>
                  <span className={styles.infoLabel}>AUDIO RECORDING</span>
                  <span className={styles.infoVal}>32-Bit Float Multi-Track Orchestral</span>
                </div>
                <div className={styles.infoCell}>
                  <span className={styles.infoLabel}>COLOR SCIENCE</span>
                  <span className={styles.infoVal}>24F Custom Celluloid Emulsion</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── THEATRICAL WEDDING FEATURES (TWO-COLUMN EDITORIAL VIDEO GRID) ── */}
      {secondaryVideos.length > 0 && (
        <section
          className={styles.videoSection}
          aria-label="Theatrical Cinema Wedding Features"
        >
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionMeta}>
                <span className={styles.sectionChapter}>MOTION PICTURE ARCHIVE</span>
                <span className={styles.sectionBadge}>2.39:1 WIDESCREEN REEL</span>
              </div>
              <h2 className={styles.sectionTitle}>Theatrical Wedding Features</h2>
              <p className={styles.sectionSubtitle}>
                Every film is documented with dedicated cinema units, capturing unscripted family emotion and sacred Telugu ceremonies.
              </p>
            </div>

            <div className={styles.videoGrid}>
              {secondaryVideos.map((video) => (
                <div
                  key={video.id}
                  className={styles.videoCard}
                  onClick={() => setActiveVideo(video)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setActiveVideo(video);
                    }
                  }}
                  aria-label={`Play cinema film: ${video.title}`}
                >
                  <div className={styles.posterContainer}>
                    <img
                      src={video.poster}
                      alt={video.title}
                      className={styles.posterImg}
                      loading="lazy"
                    />
                    <div className={styles.posterOverlay} />

                    <div className={styles.playButton} aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="7 4 19 12 7 20 7 4" />
                      </svg>
                    </div>

                    <div className={styles.durationBadge}>{video.duration}</div>

                    <div className={styles.playHint}>
                      <span>PLAY IN 16:9 LIGHTBOX</span>
                      <span className={styles.playHintIcon}>▶</span>
                    </div>
                  </div>

                  <div className={styles.videoDetails}>
                    <div className={styles.videoHeader}>
                      <h3 className={styles.videoTitle}>{video.title}</h3>
                    </div>
                    <p className={styles.videoDescription}>{video.description}</p>
                    <div className={styles.videoClientRow}>
                      <span className={styles.clientLabel}>COMMISSION</span>
                      <span className={styles.videoClient}>{video.client}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CINEMA PHOTOGRAPHIC GALLERY (ALTERNATING 2-COLUMN EDITORIAL) ── */}
      <section
        className={styles.gallerySection}
        aria-label={`${shortTitle} Photographic Record`}
      >
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionMeta}>
              <span className={styles.sectionChapter}>PHOTOGRAPHIC RECORD</span>
              <span className={styles.sectionBadge}>VERIFIED MASTER FRAMES</span>
            </div>
            <h2 className={styles.sectionTitle}>
              {shortTitle} Photographic Gallery
            </h2>
            <p className={styles.sectionSubtitle}>
              Curated master stills sequenced in alternating editorial rhythm with natural medium-format proportions.
            </p>
          </div>

          <div className={styles.alternatingGallery}>
            {gallery.map((item, index) => {
              const isLandscape = item.aspect === "landscape" || item.aspect === "panoramic";
              const isLeft = index % 2 === 0;
              const shouldShowInterlude = index === 2 || index === 4;
              const interlude = CINEMA_EDITORIAL_INTERLUDES[index % CINEMA_EDITORIAL_INTERLUDES.length];

              return (
                <div key={item.id} className={styles.galleryItemWrap}>
                  {shouldShowInterlude && (
                    <div className={styles.galleryInterlude}>
                      <span className={styles.interludeKicker}>{interlude.sub}</span>
                      <blockquote className={styles.interludeQuote}>
                        {interlude.quote}
                      </blockquote>
                      <span className={styles.interludeLine} aria-hidden="true" />
                    </div>
                  )}

                  <article
                    className={`${styles.alternatingCard} ${
                      isLeft ? styles.cardLeft : styles.cardRight
                    }`}
                    onClick={() => setActiveImageIndex(index)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setActiveImageIndex(index);
                      }
                    }}
                    aria-label={`View full frame: ${item.title}`}
                  >
                    <div
                      className={`${styles.galleryImgWrap} ${
                        isLandscape ? styles.aspectLandscape : styles.aspectPortrait
                      }`}
                    >
                      <picture>
                        {item.webp && <source srcSet={item.webp} type="image/webp" />}
                        <img
                          src={item.image}
                          alt={item.title}
                          className={styles.galleryImg}
                          loading="lazy"
                        />
                      </picture>
                      <div className={styles.cardGradient} />
                      <span className={styles.framePill}>
                        FRAME {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className={styles.expandPill} aria-hidden="true">
                        EXPAND ↗
                      </span>
                    </div>

                    <div className={styles.cardMeta}>
                      <h3 className={styles.cardTitle}>{item.title}</h3>
                      <p className={styles.cardCaption}>{item.caption}</p>

                      <div className={styles.cardFooter}>
                        {item.location && (
                          <span className={styles.cardLocation}>
                            {item.location} {item.year ? `· ${item.year}` : ""}
                          </span>
                        )}

                        {item.storySlug && (
                          <Link
                            href={`/stories/${item.storySlug}`}
                            className={styles.storyLink}
                            onClick={(e) => e.stopPropagation()}
                          >
                            Read Full Story →
                          </Link>
                        )}
                      </div>
                    </div>
                  </article>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 16:9 CINEMA LIGHTBOX MODAL ── */}
      {activeVideo && (
        <div
          className={styles.modalBackdrop}
          onClick={handleCloseVideo}
          role="dialog"
          aria-modal="true"
          aria-label={activeVideo.title}
        >
          <div
            className={styles.modalContainer}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <div className={styles.modalHeaderInfo}>
                <span className={styles.modalBadge}>THEATRICAL WEDDING FEATURE</span>
                <span className={styles.modalTitleText}>{activeVideo.title}</span>
              </div>
              <button
                className={styles.modalCloseBtn}
                onClick={handleCloseVideo}
                aria-label="Close video player"
              >
                ✕
              </button>
            </div>

            <div className={styles.modalVideoPlayerWrap}>
              <iframe
                src={`${activeVideo.embedUrl}?autoplay=1&rel=0&modestbranding=1`}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className={styles.modalIframe}
              />
            </div>

            <div className={styles.modalFooter}>
              <div className={styles.modalFooterCol}>
                <span className={styles.modalFooterLabel}>COMMISSION</span>
                <span className={styles.modalFooterValue}>{activeVideo.client}</span>
              </div>
              <div className={styles.modalFooterCol}>
                <span className={styles.modalFooterLabel}>DURATION</span>
                <span className={styles.modalFooterValue}>{activeVideo.duration}</span>
              </div>
              <p className={styles.modalFooterDesc}>{activeVideo.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* ── FULL-SCREEN IMAGE LIGHTBOX MODAL ── */}
      {activeImageIndex !== null && gallery[activeImageIndex] && (
        <div
          className={styles.modalBackdrop}
          onClick={handleCloseImage}
          role="dialog"
          aria-modal="true"
          aria-label={gallery[activeImageIndex].title}
        >
          <div
            className={styles.imageLightboxContainer}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.lightboxTopBar}>
              <span className={styles.lightboxCounter}>
                FRAME {activeImageIndex + 1} OF {gallery.length}
              </span>
              <button
                className={styles.modalCloseBtn}
                onClick={handleCloseImage}
                aria-label="Close image lightbox"
              >
                ✕
              </button>
            </div>

            <div className={styles.lightboxImgArea}>
              <img
                src={gallery[activeImageIndex].image}
                alt={gallery[activeImageIndex].title}
                className={styles.lightboxImg}
              />

              {gallery.length > 1 && (
                <>
                  <button
                    className={`${styles.lightboxArrowBtn} ${styles.lightboxArrowLeft}`}
                    onClick={() =>
                      setActiveImageIndex((prev) =>
                        prev !== null && prev > 0 ? prev - 1 : gallery.length - 1
                      )
                    }
                    aria-label="Previous frame"
                  >
                    ‹
                  </button>
                  <button
                    className={`${styles.lightboxArrowBtn} ${styles.lightboxArrowRight}`}
                    onClick={() =>
                      setActiveImageIndex((prev) =>
                        prev !== null && prev < gallery.length - 1 ? prev + 1 : 0
                      )
                    }
                    aria-label="Next frame"
                  >
                    ›
                  </button>
                </>
              )}
            </div>

            <div className={styles.lightboxCaptionBar}>
              <h3 className={styles.lightboxTitle}>
                {gallery[activeImageIndex].title}
              </h3>
              <p className={styles.lightboxDesc}>
                {gallery[activeImageIndex].caption}
              </p>
              {gallery[activeImageIndex].location && (
                <span className={styles.lightboxMeta}>
                  {gallery[activeImageIndex].location}{" "}
                  {gallery[activeImageIndex].year
                    ? `· ${gallery[activeImageIndex].year}`
                    : ""}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
