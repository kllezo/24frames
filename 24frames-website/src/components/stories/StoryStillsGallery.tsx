"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { StoryFrame, StoryGalleryEditorial } from "@/data/stories";
import { useScrollLock } from "@/lib/scrollLock";
import styles from "./StoryStillsGallery.module.css";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  frames: StoryFrame[];
  storyTitle: string;
  editorial?: StoryGalleryEditorial;
}

export default function StoryStillsGallery({ frames, storyTitle, editorial }: Props) {
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  const galleryRef = useRef<HTMLElement>(null);

  const handleClose = useCallback(() => {
    setActiveImageIndex(null);
  }, []);

  /* ── Smooth In-Place Fade Entrance on Scroll (No directional wipes) ── */
  useEffect(() => {
    const isReduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReduced) return;

    const ctx = gsap.context(() => {
      const figures = gsap.utils.toArray<HTMLElement>(`.${styles.frameFigure}`);
      figures.forEach((fig) => {
        gsap.fromTo(
          fig,
          { opacity: 0.85, y: 14 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: fig,
              start: "top 90%",
              once: true,
            },
          }
        );
      });
    }, galleryRef);

    return () => ctx.revert();
  }, [frames]);

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

  // Centralized scroll lock (including Lenis) on lightbox open
  useScrollLock(activeImageIndex !== null);

  // Split frames for the two staggered editorial columns
  const leftFrames = frames
    .map((frame, originalIndex) => ({ frame, originalIndex }))
    .filter((_, i) => i % 2 === 0);

  const rightFrames = frames
    .map((frame, originalIndex) => ({ frame, originalIndex }))
    .filter((_, i) => i % 2 !== 0);

  const fragments = editorial?.narrativeFragments && editorial.narrativeFragments.length > 0
    ? editorial.narrativeFragments
    : [
        {
          chapter: "Curatorial Record",
          note: "Preserved in uncompressed medium-format truth.",
          position: "right" as const,
        },
      ];

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
    fallbackAlign: "left" | "right" | "center" = "left"
  ) => {
    const fragment = fragments[fragmentIndex % fragments.length];
    const align = fragment.position || fallbackAlign;

    return (
      <div
        key={`note-${fragmentIndex}-${fragment.chapter}`}
        className={`${styles.narrativeNote} ${styles[`align_${align}`]}`}
      >
        <span className={styles.noteChapter}>{fragment.chapter}</span>
        <p className={styles.notePoem}>{fragment.note}</p>
      </div>
    );
  };

  const badgeText = editorial?.badge || "SELECTED EXHIBITION STILLS";
  const titleText = editorial?.title || "The Archival Sequence";
  const subtitleText =
    editorial?.subtitle ||
    "Continuous staggered editorial rhythm. Each frame preserves uncompressed optical truth and authentic emotion.";

  return (
    <section
      ref={galleryRef}
      id="stills"
      className={styles.section}
      aria-label={`${storyTitle} Curated Exhibition Stills`}
    >
      <div className={styles.container}>
        {/* Editorial Section Header */}
        <div className={styles.header}>
          <div className={styles.badgeRow}>
            <span className={styles.ruleLine} aria-hidden="true" />
            <span className={styles.badge}>{badgeText}</span>
            <span className={styles.ruleLine} aria-hidden="true" />
          </div>
          <h2 className={styles.title}>{titleText}</h2>
          <p className={styles.subtitle}>{subtitleText}</p>
        </div>

        {/* ── DESKTOP & TABLET: TWO-COLUMN STAGGERED EDITORIAL VIEW ── */}
        <div className={styles.desktopStaggeredView}>
          {/* Left Column (Starts at 0) */}
          <div className={styles.staggerColLeft}>
            {leftFrames.map(({ frame, originalIndex }, idx) => (
              <div key={frame.id} className={styles.itemSlot}>
                {renderFrameCard(frame, originalIndex)}
                {/* Organically discovered handwritten thoughts in margin whitespace */}
                {idx === 0 && renderNarrativeNote(1, "left")}
                {idx === 1 && renderNarrativeNote(3, "left")}
              </div>
            ))}
          </div>

          {/* Right Column (Starts at vertical midpoint of Left Column) */}
          <div className={styles.staggerColRight}>
            {/* Opening discovered thought resting beside Frame 0 */}
            {renderNarrativeNote(0, "right")}

            {rightFrames.map(({ frame, originalIndex }, idx) => (
              <div key={frame.id} className={styles.itemSlot}>
                {renderFrameCard(frame, originalIndex)}
                {/* Subsequent discovered thoughts */}
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

            {/* Modal Image */}
            <div className={styles.modalImageWrap}>
              <picture>
                <source
                  srcSet={frames[activeImageIndex].webpUrl}
                  type="image/webp"
                />
                <img
                  src={frames[activeImageIndex].url}
                  alt={frames[activeImageIndex].caption}
                  className={styles.modalImg}
                />
              </picture>
            </div>

            {/* Modal Caption */}
            <div className={styles.modalCaptionBlock}>
              <p className={styles.modalCaptionText}>
                {frames[activeImageIndex].caption}
              </p>
            </div>

            {/* Modal Navigation Arrows */}
            <button
              className={`${styles.modalNavBtn} ${styles.prevBtn}`}
              onClick={(e) => {
                e.stopPropagation();
                setActiveImageIndex((prev) =>
                  prev !== null && prev > 0 ? prev - 1 : frames.length - 1
                );
              }}
              aria-label="Previous frame"
            >
              ←
            </button>
            <button
              className={`${styles.modalNavBtn} ${styles.nextBtn}`}
              onClick={(e) => {
                e.stopPropagation();
                setActiveImageIndex((prev) =>
                  prev !== null && prev < frames.length - 1 ? prev + 1 : 0
                );
              }}
              aria-label="Next frame"
            >
              →
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
