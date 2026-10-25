"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import gsap from "gsap";
import styles from "./HeroSection.module.css";

/* ── Hero Carousel Data (Large Cinematic Cards) ── */
interface HeroSlide {
  id: number;
  label: string;
  title: string;
  subtitle: string;
  image: string;
  slug: string;
  color: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 1,
    label: "FRAME 01",
    title: "A Royal Union",
    subtitle: "Bellamkonda Sai Sreenivas & Kavya Reddy",
    image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1800&q=90&auto=format",
    slug: "bellamkonda-kavya",
    color: "#0C3028",
  },
  {
    id: 2,
    label: "FRAME 02",
    title: "Temple Grandeur",
    subtitle: "Manoj & Snigdha",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1800&q=90&auto=format",
    slug: "manoj-snigdha",
    color: "#1A4D42",
  },
  {
    id: 3,
    label: "FRAME 05",
    title: "Taj Falaknama",
    subtitle: "Karthik & Vijayalakshmi",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1800&q=90&auto=format",
    slug: "karthik-vijayalakshmi",
    color: "#2E6F62",
  },
  {
    id: 4,
    label: "FRAME 16",
    title: "Cross-Cultural",
    subtitle: "Divya & Federico · Tuscany & Hyderabad",
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1800&q=90&auto=format",
    slug: "divya-federico",
    color: "#4D8F80",
  },
  {
    id: 5,
    label: "FRAME 04",
    title: "A Journey of Love",
    subtitle: "Dhamini & Goutham",
    image: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1800&q=90&auto=format",
    slug: "dhamini-goutham",
    color: "#A6B0A3",
  },
];

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const titleRef = useRef<HTMLDivElement>(null);
  const narrativeRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const touchStart = useRef(0);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const activeSlide = HERO_SLIDES[activeIndex];

  const getPrevIndex = useCallback((i: number) => (i - 1 + HERO_SLIDES.length) % HERO_SLIDES.length, []);
  const getNextIndex = useCallback((i: number) => (i + 1) % HERO_SLIDES.length, []);

  /* ── Navigate between slides with GSAP ── */
  const goToSlide = useCallback((newIndex: number) => {
    if (isAnimating || newIndex === activeIndex) return;
    setIsAnimating(true);

    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const direction = newIndex > activeIndex ? 1 : -1;

    if (isReduced) {
      setActiveIndex(newIndex);
      setIsAnimating(false);
      return;
    }

    // Animate title out
    if (titleRef.current) {
      gsap.to(titleRef.current, {
        opacity: 0, y: direction * -20,
        duration: 0.25, ease: "power2.in",
      });
    }

    // After brief delay, swap index and animate in
    setTimeout(() => {
      setActiveIndex(newIndex);

      // Animate title in
      if (titleRef.current) {
        gsap.fromTo(titleRef.current,
          { opacity: 0, y: direction * 30 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }
        );
      }

      setIsAnimating(false);
    }, 280);

  }, [activeIndex, isAnimating]);

  const goNext = useCallback(() => {
    goToSlide(getNextIndex(activeIndex));
  }, [activeIndex, getNextIndex, goToSlide]);

  const goPrev = useCallback(() => {
    goToSlide(getPrevIndex(activeIndex));
  }, [activeIndex, getPrevIndex, goToSlide]);

  /* ── Autoplay ── */
  useEffect(() => {
    autoplayRef.current = setInterval(goNext, 5000);
    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [goNext]);

  /* ── Keyboard navigation ── */
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goNext, goPrev]);

  /* ── Touch swipe ── */
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext();
      else goPrev();
    }
  };

  /* ── Initial entrance animation ── */
  useEffect(() => {
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReduced) return;

    const ctx = gsap.context(() => {
      // Fade in the narrative area
      if (narrativeRef.current) {
        gsap.fromTo(narrativeRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.9, delay: 0.2, ease: "power3.out" }
        );
      }
      // Fade in carousel
      if (carouselRef.current) {
        gsap.fromTo(carouselRef.current,
          { opacity: 0, scale: 0.97 },
          { opacity: 1, scale: 1, duration: 1.0, delay: 0.1, ease: "power3.out" }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Calculate card positions
  const prevIdx = getPrevIndex(activeIndex);
  const nextIdx = getNextIndex(activeIndex);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className={styles.heroSection}
      aria-label="24 Frames — Featured Photography"
    >
      <div className={styles.container}>
        {/* Narrative Header */}
        <div ref={narrativeRef} className={styles.narrativeHeader}>
          <div className={styles.kickerRow}>
            <span className={styles.chapterBadge}>Chapter 01 — The First Frame</span>
            <span className={styles.heritageBadge}>Hyderabad · Worldwide</span>
          </div>
          <h1 className={styles.headline}>
            A Living Photographic World
          </h1>
          <p className={styles.subheadline}>
            Documenting monumental South Indian heritage, royal celebrations, and intimate human truth
            with the visual discipline and optical depth of master cinema.
          </p>
        </div>

        {/* ── Cinematic Card Carousel (Reference 1) ── */}
        <div
          ref={carouselRef}
          className={styles.carouselViewport}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          role="region"
          aria-roledescription="carousel"
          aria-label="Featured wedding photography projects"
        >
          <div className={styles.carouselTrack}>
            {/* Previous Card (Left Peek) */}
            <div
              ref={(el) => { cardRefs.current[0] = el; }}
              className={`${styles.card} ${styles.cardPrev}`}
              onClick={goPrev}
              role="button"
              tabIndex={-1}
            >
              <div className={styles.cardImageWrap}>
                <img
                  src={HERO_SLIDES[prevIdx].image}
                  alt=""
                  className={styles.cardImage}
                  loading="eager"
                />
              </div>
              <div className={styles.cardLabel}>
                <span>{HERO_SLIDES[prevIdx].label}</span>
              </div>
            </div>

            {/* Active Card (Center) */}
            <div
              ref={(el) => { cardRefs.current[1] = el; }}
              className={`${styles.card} ${styles.cardActive}`}
              aria-current="true"
            >
              <Link href={`/work/${activeSlide.slug}`} className={styles.cardLink}>
                <div className={styles.cardImageWrap}>
                  <img
                    src={activeSlide.image}
                    alt={`${activeSlide.title} — ${activeSlide.subtitle}`}
                    className={styles.cardImage}
                    loading="eager"
                  />
                  <div className={styles.cardVignette} />
                </div>
              </Link>

              {/* Viewfinder Telemetry Reticle HUD */}
              <div className={styles.viewfinderHud}>
                <div className={styles.hudTop}>
                  <div className={styles.recIndicator}>
                    <span className={styles.recDot} />
                    <span>REC ● 24 FPS</span>
                  </div>
                  <span className={styles.telemetryLens}>50mm ƒ/1.2 · 1/48s · 8K RAW</span>
                </div>
                <div className={styles.reticleCornerTL} />
                <div className={styles.reticleCornerTR} />
                <div className={styles.reticleCornerBL} />
                <div className={styles.reticleCornerBR} />
              </div>

              {/* Overlaid Title Text */}
              <div ref={titleRef} className={styles.cardTitleOverlay}>
                <span className={styles.dayLabel}>{activeSlide.label}</span>
                <h2 className={styles.cardTitle}>{activeSlide.title}</h2>
                <p className={styles.cardSubtitle}>{activeSlide.subtitle}</p>
                <span className={styles.categoryLabel}>24 Frames Collection</span>
              </div>
            </div>

            {/* Next Card (Right Peek) */}
            <div
              ref={(el) => { cardRefs.current[2] = el; }}
              className={`${styles.card} ${styles.cardNext}`}
              onClick={goNext}
              role="button"
              tabIndex={-1}
            >
              <div className={styles.cardImageWrap}>
                <img
                  src={HERO_SLIDES[nextIdx].image}
                  alt=""
                  className={styles.cardImage}
                  loading="eager"
                />
              </div>
              <div className={styles.cardLabel}>
                <span>{HERO_SLIDES[nextIdx].label}</span>
              </div>
            </div>
          </div>

          {/* Navigation Dots */}
          <div className={styles.dotsRow}>
            {HERO_SLIDES.map((slide, idx) => (
              <button
                key={slide.id}
                className={`${styles.dot} ${idx === activeIndex ? styles.dotActive : ""}`}
                onClick={() => goToSlide(idx)}
                aria-label={`Go to ${slide.title}`}
              />
            ))}
          </div>
        </div>

        {/* Quick Metrics Bar */}
        <div className={styles.metricsBar}>
          <div className={styles.metricItem}>
            <span className={styles.metricValue}>24</span>
            <span className={styles.metricLabel}>Frames Per Second</span>
          </div>
          <span className={styles.metricDivider}>/</span>
          <div className={styles.metricItem}>
            <span className={styles.metricValue}>14</span>
            <span className={styles.metricLabel}>Years of Archival Craft</span>
          </div>
          <span className={styles.metricDivider}>/</span>
          <div className={styles.metricItem}>
            <span className={styles.metricValue}>500+</span>
            <span className={styles.metricLabel}>Master Commissions</span>
          </div>
        </div>
      </div>
    </section>
  );
}
