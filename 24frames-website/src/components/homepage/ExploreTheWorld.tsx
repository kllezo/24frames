"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DISCIPLINES_LIST, DisciplineItem } from "@/data/disciplines";
import styles from "./ExploreTheWorld.module.css";

gsap.registerPlugin(ScrollTrigger);

export default function ExploreTheWorld() {
  const router = useRouter();
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  // Default to first discipline (Weddings & Royal Unions)
  const [activeDiscipline, setActiveDiscipline] = useState<DisciplineItem>(
    DISCIPLINES_LIST[0]
  );

  /* ── GSAP Scroll-Triggered Entrance ─────────────────────────── */
  useEffect(() => {
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReduced) return;

    const ctx = gsap.context(() => {
      // 1. Header entrance
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { y: 35, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // 2. Stage entrance
      if (stageRef.current) {
        gsap.fromTo(
          stageRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: stageRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  /* ── Desktop Hover Selection ────────────────────────────────── */
  const handleMouseEnter = useCallback((discipline: DisciplineItem) => {
    setActiveDiscipline(discipline);
  }, []);

  /* ── Keyboard Focus Selection ───────────────────────────────── */
  const handleFocus = useCallback((discipline: DisciplineItem) => {
    setActiveDiscipline(discipline);
  }, []);

  /* ── Click / Touch Navigation ───────────────────────────────── */
  const handleClick = useCallback(
    (discipline: DisciplineItem) => {
      // If already active (hovered on desktop or tapped once on mobile), navigate to page
      if (activeDiscipline.id === discipline.id) {
        router.push(discipline.href);
      } else {
        // First tap on touch devices: activate preview
        setActiveDiscipline(discipline);
      }
    },
    [activeDiscipline.id, router]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, discipline: DisciplineItem) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        router.push(discipline.href);
      }
    },
    [router]
  );

  return (
    <section
      ref={sectionRef}
      id="explore"
      className={styles.section}
      aria-label="Discover the World of 24 Frames — Editorial Disciplines"
    >
      <div className={styles.container}>
        {/* Section Header */}
        <div ref={headerRef} className={styles.header}>
          <div className={styles.headerMeta}>
            <span className={styles.label}>Chapter 04 — Editorial Disciplines</span>
            <span className={styles.disciplineBadge}>SIX PRACTICES OF CINEMA & OPTICS</span>
          </div>
          <h2 className={styles.title}>Discover the World of 24 Frames</h2>
          <p className={styles.subtitle}>
            From intimate Vedic rituals to high-fashion spreads and cinematic master films.
            Select any discipline to enter its dedicated portfolio.
          </p>
        </div>

        {/* ── Immersive Interactive Stage ── */}
        <div ref={stageRef} className={styles.stage}>
          {/* ── Monumental Active Photography Display (One Immersive Image, No Overlapping Cards) ── */}
          <div
            id="hero-discipline-panel"
            className={styles.monumentalDisplay}
            role="region"
            aria-live="polite"
            aria-label={`${activeDiscipline.title} preview`}
          >
            {/* Smooth Photographic Crossfade Layer Stack */}
            <div className={styles.displayImgWrap}>
              {DISCIPLINES_LIST.map((discipline) => {
                const isSelected = activeDiscipline.id === discipline.id;
                return (
                  <div
                    key={discipline.id}
                    className={`${styles.imageLayer} ${
                      isSelected ? styles.imageLayerActive : ""
                    }`}
                    aria-hidden={!isSelected}
                  >
                    <picture>
                      {discipline.heroWebp && (
                        <source srcSet={discipline.heroWebp} type="image/webp" />
                      )}
                      <img
                        src={discipline.heroImage}
                        alt={discipline.title}
                        className={styles.displayImg}
                        loading="lazy"
                      />
                    </picture>
                  </div>
                );
              })}
              {/* Restrained Vignette Gradient for Typography Contrast */}
              <div className={styles.displayVignette} aria-hidden="true" />
            </div>

            {/* Display Editorial Metadata Overlay (Spacious, Single-Hero Composition) */}
            <div className={styles.displayOverlay}>
              <div className={styles.displayTags}>
                <span className={styles.worldNumber}>
                  DISCIPLINE {activeDiscipline.number}
                </span>
                <span className={styles.worldCountBadge}>
                  {activeDiscipline.count}
                </span>
              </div>

              <h3 className={styles.worldTitle}>{activeDiscipline.title}</h3>
              <p className={styles.worldTagline}>{activeDiscipline.tagline}</p>
              <p className={styles.worldDesc}>{activeDiscipline.heroDescription}</p>

              <div className={styles.ctaRow}>
                <Link
                  href={activeDiscipline.href}
                  className={styles.worldCta}
                  aria-label={`Enter the full ${activeDiscipline.title} discipline gallery`}
                >
                  Explore {activeDiscipline.shortTitle} Gallery{" "}
                  <span className={styles.arrow} aria-hidden="true">
                    →
                  </span>
                </Link>

                <span className={styles.quickHint}>
                  Click discipline or press Enter to view dedicated page
                </span>
              </div>
            </div>
          </div>

          {/* ── Interactive Category Selector Rail (Discipline Index) ── */}
          <nav
            className={styles.categoryRail}
            aria-label="Editorial Discipline Index"
          >
            <div className={styles.railHeaderRow}>
              <span className={styles.railHeader}>DISCIPLINE INDEX</span>
              <span className={styles.railSubHeader}>HOVER OR CLICK TO EXPLORE</span>
            </div>

            <div className={styles.railList} role="tablist" aria-orientation="vertical">
              {DISCIPLINES_LIST.map((discipline) => {
                const isActive = activeDiscipline.id === discipline.id;

                return (
                  <button
                    key={discipline.id}
                    type="button"
                    role="tab"
                    id={`tab-${discipline.id}`}
                    aria-selected={isActive}
                    aria-controls="hero-discipline-panel"
                    className={`${styles.railItem} ${
                      isActive ? styles.railItemActive : ""
                    }`}
                    onMouseEnter={() => handleMouseEnter(discipline)}
                    onMouseOver={() => handleMouseEnter(discipline)}
                    onFocus={() => handleFocus(discipline)}
                    onClick={() => handleClick(discipline)}
                    onKeyDown={(e) => handleKeyDown(e, discipline)}
                    tabIndex={0}
                  >
                    <span className={styles.railNumber}>{discipline.number}</span>
                    <div className={styles.railInfo}>
                      <span className={styles.railLabel}>{discipline.title}</span>
                      <span className={styles.railCount}>{discipline.count}</span>
                    </div>
                    <span className={styles.railIndicator} aria-hidden="true">
                      →
                    </span>
                  </button>
                );
              })}
            </div>
          </nav>
        </div>
      </div>
    </section>
  );
}
