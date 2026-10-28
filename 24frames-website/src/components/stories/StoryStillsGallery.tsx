"use client";

import { useState, useEffect, useCallback } from "react";
import { StoryFrame } from "@/data/stories";
import styles from "./StoryStillsGallery.module.css";

interface Props {
  frames: StoryFrame[];
  storyTitle: string;
}

const LOVE_STORY_FRAGMENTS = [
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
    chapter: "Chapter III · The Feeling Remains",
    note: "Years from now, you may forget the schedule. Never the way it felt.",
  },
  {
    chapter: "Chapter IV · Optical Memory",
    note: "A day passes in an instant. The way it made you feel deserves to endure.",
  },
  {
    chapter: "Chapter V · The Legacy",
    note: "When the day becomes memory, let it still feel genuinely yours.",
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

  // Split frames for the two staggered editorial columns
  const leftFrames = frames
    .map((frame, originalIndex) => ({ frame, originalIndex }))
    .filter((_, i) => i % 2 === 0);

  const rightFrames = frames
    .map((frame, originalIndex) => ({ frame, originalIndex }))
    .filter((_, i) => i % 2 !== 0);

  const renderFrameCard = (frame: StoryFrame, originalIndex: number) => {
    const isLandscape = frame.aspect === "landscape";

    return (
      <figure
        key={frame.id}
        className={styles.frameFigure}
        onClick={() => setActiveImageIndex(originalIndex)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setActiveImageIndex(originalIndex);
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
              loading={originalIndex < 2 ? "eager" : "lazy"}
            />
          </picture>
          <div className={styles.imageOverlay} />
          <span className={styles.frameBadge}>{frame.frameNo}</span>
          <span className={styles.expandPrompt} aria-hidden="true">
            EXPAND ↗
          </span>
        </div>

        <figcaption className={styles.captionBlock}>
          <span className={styles.captionText}>{frame.caption}</span>
        </figcaption>
      </figure>
    );
  };

  const renderNarrativeNote = (
    fragmentIndex: number,
    align: "left" | "right" | "center" = "left"
  ) => {
    const fragment =
      LOVE_STORY_FRAGMENTS[fragmentIndex % LOVE_STORY_FRAGMENTS.length];

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
    <section
      id="stills"
      className={styles.section}
      aria-label={`${storyTitle} Curated Exhibition Stills`}
    >
      <div className={styles.container}>
        {/* Editorial Section Header */}
        <div className={styles.header}>
          <div className={styles.badgeRow}>
            <span className={styles.ruleLine} aria-hidden="true" />
            <span className={styles.badge}>SELECTED EXHIBITION STILLS</span>
            <span className={styles.ruleLine} aria-hidden="true" />
          </div>
          <h2 className={styles.title}>The Archival Sequence</h2>
          <p className={styles.subtitle}>
            Continuous staggered editorial rhythm. Each frame preserves uncompressed optical truth and authentic emotion.
          </p>
        </div>

        {/* ── DESKTOP & TABLET: TWO-COLUMN STAGGERED EDITORIAL VIEW ── */}
        <div className={styles.desktopStaggeredView}>
          {/* Left Column (Starts at 0) */}
          <div className={styles.staggerColLeft}>
            {leftFrames.map(({ frame, originalIndex }, idx) => (
              <div key={frame.id} className={styles.itemSlot}>
                {renderFrameCard(frame, originalIndex)}
                {/* Organically discovered handwritten thought in margin whitespace */}
                {idx === 0 && renderNarrativeNote(1, "left")}
                {idx === 1 && renderNarrativeNote(3, "left")}
              </div>
            ))}
          </div>

          {/* Right Column (Starts at vertical midpoint of Left Column) */}
          <div className={styles.staggerColRight}>
            {/* Initial opening discovered line resting beside Frame 0 */}
            {renderNarrativeNote(0, "right")}

            {rightFrames.map(({ frame, originalIndex }, idx) => (
              <div key={frame.id} className={styles.itemSlot}>
                {renderFrameCard(frame, originalIndex)}
                {/* Organically discovered handwritten thought in margin whitespace */}
                {idx === 0 && renderNarrativeNote(2, "right")}
                {idx === 1 && renderNarrativeNote(4, "right")}
              </div>
            ))}
          </div>
        </div>

        {/* ── MOBILE: BALANCED SINGLE-COLUMN SEQUENTIAL VIEW ── */}
        <div className={styles.mobileSequentialView}>
          {frames.map((frame, index) => (
            <div key={frame.id} className={styles.mobileSlot}>
              {renderFrameCard(frame, index)}
              {index === 1 && renderNarrativeNote(1, "center")}
              {index === 3 && renderNarrativeNote(2, "center")}
              {index === 5 && renderNarrativeNote(4, "center")}
            </div>
          ))}
        </div>
      </div>

      {/* ── FULL-SCREEN IMAGE LIGHTBOX MODAL ── */}
      {activeImageIndex !== null && (
        <div
          className={styles.modalBackdrop}
          onClick={handleClose}
          role="dialog"
          aria-modal="true"
          aria-label={`Frame exhibition viewer: ${frames[activeImageIndex].caption}`}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className={styles.modalHeader}>
              <div className={styles.modalMeta}>
                <span className={styles.modalBadge}>
                  {frames[activeImageIndex].frameNo}
                </span>
                <span className={styles.modalCount}>
                  FRAME {activeImageIndex + 1} OF {frames.length}
                </span>
              </div>
              <button
                className={styles.modalCloseBtn}
                onClick={handleClose}
                aria-label="Close exhibition viewer (Escape)"
              >
                ✕
              </button>
            </div>

            {/* Modal Image Viewport */}
            <div className={styles.modalImageViewport}>
              <img
                src={frames[activeImageIndex].url}
                alt={frames[activeImageIndex].caption}
                className={styles.modalImg}
              />

              {/* Prev / Next Modal Arrows */}
              <button
                className={`${styles.modalNavBtn} ${styles.modalPrevBtn}`}
                onClick={() =>
                  setActiveImageIndex((prev) =>
                    prev !== null && prev > 0 ? prev - 1 : frames.length - 1
                  )
                }
                aria-label="Previous frame (Arrow Left)"
              >
                ←
              </button>
              <button
                className={`${styles.modalNavBtn} ${styles.modalNextBtn}`}
                onClick={() =>
                  setActiveImageIndex((prev) =>
                    prev !== null && prev < frames.length - 1 ? prev + 1 : 0
                  )
                }
                aria-label="Next frame (Arrow Right)"
              >
                →
              </button>
            </div>

            {/* Modal Caption */}
            <div className={styles.modalCaptionWrap}>
              <p className={styles.modalCaption}>
                {frames[activeImageIndex].caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}