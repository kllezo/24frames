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

  return (
    <>
      {/* ── MOTION PICTURE ARCHIVE (VIDEOS WITH CINEMA LIGHTBOX) ── */}
      {videos && videos.length > 0 && (
        <section
          className={styles.videoSection}
          aria-label="Theatrical Cinema Motion Pictures"
        >
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionMeta}>
                <span className={styles.sectionChapter}>MOTION PICTURE ARCHIVE</span>
                <span className={styles.sectionBadge}>2.39:1 ANAMORPHIC WIDESCREEN</span>
              </div>
              <h2 className={styles.sectionTitle}>Theatrical Wedding Features</h2>
              <p className={styles.sectionSubtitle}>
                Dedicated cinema units utilizing prime cinema glass, multi-track audio, and
                custom film emulsion grading. Click any film to watch in the 16:9 Cinema Lightbox.
              </p>
            </div>

            <div className={styles.videoGrid}>
              {videos.map((video) => (
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

                    {/* Subtle Play Button Affordance */}
                    <div className={styles.playButton} aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="7 4 19 12 7 20 7 4" />
                      </svg>
                    </div>

                    {/* Duration Badge */}
                    <div className={styles.durationBadge}>{video.duration}</div>

                    <div className={styles.playHint}>
                      <span>PLAY THEATRICAL FILM</span>
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

      {/* ── PHOTOGRAPHIC RECORD WITH FULL-SCREEN LIGHTBOX ── */}
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
              Curated master stills and authentic commission coverage in natural medium-format proportions.
            </p>
          </div>

          <div className={styles.galleryGrid}>
            {gallery.map((item, index) => {
              const isWide = item.aspect === "landscape" || item.aspect === "panoramic";

              return (
                <article
                  key={item.id}
                  className={`${styles.galleryCard} ${
                    isWide ? styles.galleryCardWide : styles.galleryCardTall
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
                  <div className={styles.galleryImgWrap}>
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
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 16:9 VIDEO LIGHTBOX MODAL ── */}
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
            {/* Top Bar with Count & Close */}
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

            {/* Central High-Resolution Frame */}
            <div className={styles.lightboxImgArea}>
              <img
                src={gallery[activeImageIndex].image}
                alt={gallery[activeImageIndex].title}
                className={styles.lightboxImg}
              />

              {/* Prev / Next Controls */}
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

            {/* Metadata Bar */}
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
