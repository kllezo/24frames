"use client";

import { useState, useEffect, useCallback } from "react";
import { StoryFrame } from "@/data/stories";
import styles from "./StoryStillsGallery.module.css";

interface Props {
  frames: StoryFrame[];
  storyTitle: string;
}

const EDITORIAL_MOMENTS = [
  {
    quote: "“Tradition, held gently in the present.”",
    sub: "SACRED OBSERVATION · TELUGU WEDDING HERITAGE",
  },
  {
    quote: "“The smallest gestures often tell the greatest stories.”",
    sub: "UNGUARDED EMOTION · ARCHIVAL STILLS",
  },
  {
    quote: "“Framed in light. Kept for a lifetime.”",
    sub: "OPTICAL CLARITY · 24 FRAMES ARCHIVE",
  },
  {
    quote: "“Some moments are remembered. Others become part of us.”",
    sub: "GENERATIONAL HEIRLOOM · THE VOWS",
  },
];

export default function StoryStillsGallery({ frames, storyTitle }: Props) {
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);

  const handleClose = useCallback(() => {
    setActiveImageIndex(null);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      } else if (activeImageIndex !== null) {
        if (e.key === "ArrowLeft") {
          setActiveImageIndex((prev) =>
            prev !== null && prev > 0 ? prev - 1 : frames.length - 1
          );
        } else if (e.key === "ArrowRight") {
          setActiveImageIndex((prev) =>
            prev !== null && prev < frames.length - 1 ? prev + 1 : 0
          );
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeImageIndex, frames.length, handleClose]);

  // Lock body scroll on lightbox open
  useEffect(() => {
    if (activeImageIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeImageIndex]);

  // Handle direct hash navigation to #stills on initial load
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#stills") {
      setTimeout(() => {
        const el = document.getElementById("stills");
        if (el) {
          const lenis = (window as unknown as { __lenis?: { scrollTo: (t: HTMLElement, opt?: object) => void } }).__lenis;
          if (lenis) {
            lenis.scrollTo(el, { offset: -90 });
          } else {
            const top = el.getBoundingClientRect().top + window.scrollY - 90;
            window.scrollTo({ top, behavior: "smooth" });
          }
        }
      }, 300);
    }
  }, []);

  return (
    <section id="stills" className={styles.section} aria-label="Selected Exhibition Stills">
      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.header}>
          <div className={styles.badgeRow}>
            <span className={styles.ruleLine} aria-hidden="true" />
            <span className={styles.badge}>ARCHIVAL STILLS · TWELVE-INCH REEL</span>
            <span className={styles.ruleLine} aria-hidden="true" />
          </div>
          <h2 className={styles.title}>Selected Exhibition Stills</h2>
          <p className={styles.subtitle}>
            Sequenced with deliberate pacing, ample ivory whitespace, and pure optical focus. Every frame preserves authentic light and emotion.
          </p>
        </div>

        {/* Alternating Editorial Flow Grid */}
        <div className={styles.editorialGrid}>
          {frames.map((frame, index) => {
            const isLandscape = frame.aspect === "landscape";
            // Place an editorial quote interlude after every 2-3 frames
            const shouldInsertText = index === 2 || index === 4;
            const textMoment = EDITORIAL_MOMENTS[index % EDITORIAL_MOMENTS.length];

            // Alternating alignment pattern:
            // Frame 0: Left Column (medium)
            // Frame 1: Right Column (medium)
            // Frame 2: Left Column (landscape)
            // Frame 3: Right Column (portrait)
            // Frame 4: Left Column (portrait)
            // Frame 5: Right Column (landscape)
            const isLeft = index % 2 === 0;

            return (
              <div key={frame.id} className={styles.frameWrapper}>
                {shouldInsertText && (
                  <div className={styles.editorialInterlude}>
                    <span className={styles.interludeKicker}>{textMoment.sub}</span>
                    <blockquote className={styles.interludeQuote}>
                      {textMoment.quote}
                    </blockquote>
                    <span className={styles.interludeDivider} aria-hidden="true" />
                  </div>
                )}

                <figure
                  className={`${styles.frameFigure} ${
                    isLeft ? styles.figureLeft : styles.figureRight
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
                  aria-label={`View full frame ${frame.frameNo}: ${frame.caption}`}
                >
                  <div
                    className={`${styles.imageFrameWrap} ${
                      isLandscape ? styles.aspectLandscape : styles.aspectPortrait
                    }`}
                  >
                    <picture>
                      <source srcSet={frame.webpUrl} type="image/webp" />
                      <img
                        src={frame.url}
                        alt={frame.caption}
                        className={styles.galleryImg}
                        loading={index < 2 ? "eager" : "lazy"}
                        decoding="async"
                        width={frame.width}
                        height={frame.height}
                      />
                    </picture>
                    <span className={styles.expandTag} aria-hidden="true">
                      FRAME {frame.frameNo} ↗
                    </span>
                  </div>

                  <figcaption className={styles.captionBar}>
                    <div className={styles.captionHeaderRow}>
                      <span className={styles.frameIdentifier}>
                        FRAME {frame.frameNo} · 24 FRAMES ARCHIVE
                      </span>
                      <span className={styles.dimensionBadge}>
                        {frame.width} × {frame.height}PX
                      </span>
                    </div>
                    <p className={styles.captionText}>{frame.caption}</p>
                  </figcaption>
                </figure>
              </div>
            );
          })}
        </div>
      </div>

      {/* Full-Screen Exhibition Frame Lightbox */}
      {activeImageIndex !== null && frames[activeImageIndex] && (
        <div
          className={styles.lightboxBackdrop}
          onClick={handleClose}
          role="dialog"
          aria-modal="true"
          aria-label={frames[activeImageIndex].caption}
        >
          <div
            className={styles.lightboxContainer}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.lightboxTopBar}>
              <span className={styles.lightboxCounter}>
                FRAME {frames[activeImageIndex].frameNo} OF {frames.length} · {storyTitle}
              </span>
              <button
                className={styles.lightboxCloseBtn}
                onClick={handleClose}
                aria-label="Close lightbox"
              >
                ✕
              </button>
            </div>

            <div className={styles.lightboxImgArea}>
              <img
                src={frames[activeImageIndex].url}
                alt={frames[activeImageIndex].caption}
                className={styles.lightboxImg}
              />

              {frames.length > 1 && (
                <>
                  <button
                    className={`${styles.lightboxArrowBtn} ${styles.lightboxArrowLeft}`}
                    onClick={() =>
                      setActiveImageIndex((prev) =>
                        prev !== null && prev > 0 ? prev - 1 : frames.length - 1
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
                        prev !== null && prev < frames.length - 1 ? prev + 1 : 0
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
              <p className={styles.lightboxCaptionText}>
                {frames[activeImageIndex].caption}
              </p>
              <span className={styles.lightboxMetadata}>
                24 FRAMES MASTER EXHIBITION STILL · {frames[activeImageIndex].width} × {frames[activeImageIndex].height}PX
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

