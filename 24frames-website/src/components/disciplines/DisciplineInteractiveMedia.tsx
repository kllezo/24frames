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

const DISCIPLINE_LOVE_STORY_FRAGMENTS = [
  {
    chapter: "Chapter I · The Anticipation",
    note: "Somewhere between the dream and the day, your forever quietly begins.",
  },
  {
    chapter: "Chapter II · The Sacred Vow",
    note: "One glance across the mandap. A thousand unspoken promises.",
  },
  {
    chapter: "Chapter III · The Unguarded Moment",
    note: "The moments you never planned often become the ones you hold closest.",
  },
  {
    chapter: "Chapter IV · Optical Memory",
    note: "A day passes in an instant. The way it made you feel deserves to endure.",
  },
  {
    chapter: "Chapter IV · The Seen and Unseen",
    note: "We look beyond how a moment appears, towards what it means.",
  },
  {
    chapter: "Chapter V · The Legacy",
    note: "When the day becomes memory, let it still feel genuinely yours.",
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

  // Split gallery items for the two staggered editorial columns
  const leftGallery = gallery
    .map((item, originalIndex) => ({ item, originalIndex }))
    .filter((_, idx) => idx % 2 === 0);

  const rightGallery = gallery
    .map((item, originalIndex) => ({ item, originalIndex }))
    .filter((_, idx) => idx % 2 !== 0);

  const renderGalleryCard = (item: DisciplineGalleryImage, originalIndex: number) => {
    const isLandscape = item.aspect === "landscape" || item.aspect === "panoramic";

    return (
      <article
        key={item.id}
        className={styles.galleryCard}
        onClick={() => setActiveImageIndex(originalIndex)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setActiveImageIndex(originalIndex);
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
            FRAME {String(originalIndex + 1).padStart(2, "0")}
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
                Step Inside Story →
              </Link>
            )}
          </div>
        </div>
      </article>
    );
  };

  const renderNarrativeNote = (
    fragmentIndex: number,
    align: "left" | "right" | "center" = "left"
  ) => {
    const fragment =
      DISCIPLINE_LOVE_STORY_FRAGMENTS[
        fragmentIndex % DISCIPLINE_LOVE_STORY_FRAGMENTS.length
      ];

    return (
      <div
        key={`note-${fragmentIndex}`}
        className={`${styles.narrativeNote} ${styles[`align_${align}`]}`}
      >
        <span className={styles.noteChapter}>{fragment.chapter}</span>
        <p className={styles.notePoem}>{fragment.note}</p>
      </div>
    );
  };

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
              </div>

              {/* Master Film Meta Strip */}
              <div className={styles.featuredInfoStrip}>
                <div className={styles.featuredMetaCol}>
                  <span className={styles.featuredKicker}>THEATRICAL COMMISSION</span>
                  <h3 className={styles.featuredFilmTitle}>{featuredVideo.title}</h3>
                  <p className={styles.featuredFilmDesc}>{featuredVideo.description}</p>
                </div>

                <div className={styles.featuredSpecsCol}>
                  <div className={styles.specCell}>
                    <span className={styles.specName}>CLIENT &amp; VENUE</span>
                    <span className={styles.specVal}>{featuredVideo.client}</span>
                  </div>
                  <div className={styles.specCell}>
                    <span className={styles.specName}>OPTICAL FORMAT</span>
                    <span className={styles.specVal}>4K DCI · 2.39:1 Scope</span>
                  </div>
                  <div className={styles.specCell}>
                    <span className={styles.specName}>SOUND SYSTEM</span>
                    <span className={styles.specVal}>32-bit Float Orchestral</span>
                  </div>
                  <div className={styles.specCell}>
                    <span className={styles.specName}>COLOR SCIENCE</span>
                    <span className={styles.specVal}>24F Archival Celluloid</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── 2-COLUMN VIDEO GRID (THEATRICAL COMMISSIONS) ── */}
      {secondaryVideos.length > 0 && (
        <section
          className={styles.videoGridSection}
          aria-label="Theatrical Wedding Features Archive"
        >
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionMeta}>
                <span className={styles.sectionChapter}>MOTION ARCHIVE</span>
                <span className={styles.sectionBadge}>
                  {secondaryVideos.length} THEATRICAL COMMISSIONS
                </span>
              </div>
              <h2 className={styles.sectionTitle}>Theatrical Wedding Features</h2>
              <p className={styles.sectionSubtitle}>
                Screened in 4K high-bitrate video with custom color grades and spatial music design.
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

      {/* ── PHOTOGRAPHIC GALLERY (CONTINUOUS STAGGERED EDITORIAL RHYTHM) ── */}
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
              Continuous staggered editorial composition. When one image appears on the left, the next begins beside it on the right with natural medium-format proportions.
            </p>
          </div>

          {/* ── DESKTOP & TABLET: TWO-COLUMN STAGGERED EDITORIAL VIEW ── */}
          <div className={styles.desktopStaggeredView}>
            {/* Left Column (Starts at 0) */}
            <div className={styles.staggerColLeft}>
              {leftGallery.map(({ item, originalIndex }, idx) => (
                <div key={item.id} className={styles.itemSlot}>
                  {renderGalleryCard(item, originalIndex)}
                  {idx === 0 && renderNarrativeNote(1, "left")}
                  {idx === 1 && renderNarrativeNote(3, "left")}
                </div>
              ))}
            </div>

            {/* Right Column (Starts at vertical midpoint of Left Column) */}
            <div className={styles.staggerColRight}>
              {/* Opening handwritten thought discovered in margin */}
              {renderNarrativeNote(0, "right")}

              {rightGallery.map(({ item, originalIndex }, idx) => (
                <div key={item.id} className={styles.itemSlot}>
                  {renderGalleryCard(item, originalIndex)}
                  {idx === 0 && renderNarrativeNote(2, "right")}
                  {idx === 1 && renderNarrativeNote(4, "right")}
                </div>
              ))}
            </div>
          </div>

          {/* ── MOBILE: BALANCED SINGLE-COLUMN SEQUENTIAL VIEW ── */}
          <div className={styles.mobileSequentialView}>
            {gallery.map((item, index) => (
              <div key={item.id} className={styles.mobileSlot}>
                {renderGalleryCard(item, index)}
                {index === 1 && renderNarrativeNote(1, "center")}
                {index === 3 && renderNarrativeNote(2, "center")}
                {index === 5 && renderNarrativeNote(4, "center")}
              </div>
            ))}
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
          aria-label={`Watch ${activeVideo.title}`}
        >
          <div
            className={styles.videoModalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <div className={styles.modalTitleBlock}>
                <span className={styles.modalBadge}>4K CINEMA MASTER</span>
                <h3 className={styles.modalVideoTitle}>{activeVideo.title}</h3>
                <span className={styles.modalVideoClient}>· {activeVideo.client}</span>
              </div>
              <button
                className={styles.modalCloseBtn}
                onClick={handleCloseVideo}
                aria-label="Close video player (Escape)"
              >
                ✕
              </button>
            </div>

            <div className={styles.videoPlayerWrap}>
              <iframe
                src={`${activeVideo.embedUrl}?autoplay=1&rel=0&modestbranding=1&color=white`}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className={styles.videoIframe}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── FULL-SCREEN IMAGE LIGHTBOX MODAL ── */}
      {activeImageIndex !== null && (
        <div
          className={styles.modalBackdrop}
          onClick={handleCloseImage}
          role="dialog"
          aria-modal="true"
          aria-label={`View full frame: ${gallery[activeImageIndex].title}`}
        >
          <div
            className={styles.imageModalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <div className={styles.modalTitleBlock}>
                <span className={styles.modalBadge}>
                  FRAME {activeImageIndex + 1} OF {gallery.length}
                </span>
                <h3 className={styles.modalVideoTitle}>
                  {gallery[activeImageIndex].title}
                </h3>
              </div>
              <button
                className={styles.modalCloseBtn}
                onClick={handleCloseImage}
                aria-label="Close image lightbox (Escape)"
              >
                ✕
              </button>
            </div>

            <div className={styles.imageViewerWrap}>
              <img
                src={gallery[activeImageIndex].image}
                alt={gallery[activeImageIndex].title}
                className={styles.modalFullImg}
              />

              <button
                className={`${styles.imageNavBtn} ${styles.imagePrevBtn}`}
                onClick={() =>
                  setActiveImageIndex((prev) =>
                    prev !== null && prev > 0 ? prev - 1 : gallery.length - 1
                  )
                }
                aria-label="Previous frame (Arrow Left)"
              >
                ←
              </button>
              <button
                className={`${styles.imageNavBtn} ${styles.imageNextBtn}`}
                onClick={() =>
                  setActiveImageIndex((prev) =>
                    prev !== null && prev < gallery.length - 1 ? prev + 1 : 0
                  )
                }
                aria-label="Next frame (Arrow Right)"
              >
                →
              </button>
            </div>

            <div className={styles.modalImageFooter}>
              <p className={styles.modalImageCaption}>
                {gallery[activeImageIndex].caption}
              </p>
              {gallery[activeImageIndex].storySlug && (
                <Link
                  href={`/stories/${gallery[activeImageIndex].storySlug}`}
                  className={styles.modalStoryBtn}
                >
                  Step Inside Story →
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}