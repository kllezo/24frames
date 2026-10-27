"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { navigateWithCameraTransition } from "@/lib/transitions";
import styles from "./TheCollection.module.css";

gsap.registerPlugin(ScrollTrigger);

export interface CollectionDiscipline {
  id: string;
  slug: string;
  number: string;
  title: string;
  shortTitle: string;
  count: string;
  tagline: string;
  heroDescription: string;
  image: string;
  webpImage?: string;
  fallbackImage: string;
  href: string;
  objectPosition?: string;
}

export type CollectionProject = CollectionDiscipline;

export const COLLECTION_DISCIPLINES: CollectionDiscipline[] = [
  {
    id: "weddings",
    slug: "weddings",
    number: "01",
    title: "Weddings & Royal Unions",
    shortTitle: "Weddings",
    count: "40+ Master Stories",
    tagline: "Sacred Telugu traditions, royal muhurthams & emotional generational tears.",
    heroDescription:
      "Multi-day coverage spanning Mangalasnanam, Sangeet galas, and dawn ceremonies. Documented without invasive lighting or forced poses.",
    image: "/images/portfolio/sireesh-harshitha/cover.jpg",
    webpImage: "/images/portfolio/sireesh-harshitha/cover.webp",
    fallbackImage: "/images/portfolio/sireesh-harshitha/cover.jpg",
    href: "/disciplines/weddings",
    objectPosition: "center 22%",
  },
  {
    id: "celebrities",
    slug: "celebrities",
    number: "02",
    title: "Celebrities & Portraits",
    shortTitle: "Celebrities",
    count: "15+ Character Studies",
    tagline: "High-fashion bridal couture, Tollywood actors, and private family patriarchs.",
    heroDescription:
      "Medium-format optical portraits lit with master cinema fixtures. Preserving quiet dignity, sculptural elegance, and commanding presence.",
    image: "/images/portfolio/bellamkonda-kavya-reception/cover.jpg",
    webpImage: "/images/portfolio/bellamkonda-kavya-reception/cover.webp",
    fallbackImage: "/images/stories/bellam-srikonda/IMG_6339.jpg",
    href: "/disciplines/celebrities",
    objectPosition: "center 20%",
  },
  {
    id: "events",
    slug: "events",
    number: "03",
    title: "Events & Cultural Galas",
    shortTitle: "Events",
    count: "20+ Grand Celebrations",
    tagline: "High-octane Sangeet stages, milestone anniversaries, and national events.",
    heroDescription:
      "Capturing the electric choreography, live orchestral music, and grand architectural ambiance of premier celebration venues.",
    image: "/images/stories/bellam-srikonda/IMG_6340.jpg",
    webpImage: "/images/stories/bellam-srikonda/IMG_6340.webp",
    fallbackImage: "/images/stories/bellam-srikonda/IMG_6340.jpg",
    href: "/disciplines/events",
    objectPosition: "center 30%",
  },
  {
    id: "fashion",
    slug: "fashion",
    number: "04",
    title: "Fashion & Editorial",
    shortTitle: "Fashion",
    count: "10+ Editorial Spreads",
    tagline: "Bespoke designer lookbooks and high-jewelry editorial campaigns.",
    heroDescription:
      "Crafted for prestigious publications and couture designers, combining experimental art direction with sharp optical discipline.",
    image: "/images/stories/bellam-srikonda/IMG_6341.jpg",
    webpImage: "/images/stories/bellam-srikonda/IMG_6341.webp",
    fallbackImage: "/images/stories/bellam-srikonda/IMG_6341.jpg",
    href: "/disciplines/fashion",
    objectPosition: "center 20%",
  },
  {
    id: "cinema",
    slug: "cinema",
    number: "05",
    title: "Cinema & Feature Films",
    shortTitle: "Cinema",
    count: "50+ Anamorphic Films",
    tagline: "2.39:1 Anamorphic motion pictures paired with orchestral audio scores.",
    heroDescription:
      "Shot with dedicated cinema crews on ARRI and Sony FX cinema lines. Edited as theatrical-grade wedding features.",
    image: "/images/portfolio/karthik-falaknama/cover.jpg",
    webpImage: "/images/portfolio/karthik-falaknama/cover.jpg",
    fallbackImage: "/images/portfolio/karthik-falaknama/cover.jpg",
    href: "/disciplines/cinema",
    objectPosition: "center 35%",
  },
  {
    id: "archive",
    slug: "archive",
    number: "06",
    title: "The Complete Archive",
    shortTitle: "Archive",
    count: "500+ Commissions",
    tagline: "Fourteen years of optical storytelling across South India and abroad.",
    heroDescription:
      "A continuous visual lineage established in 2012 by founder Phani Gogireddy, preserving over 500 bespoke commissions.",
    image: "/images/stories/sirish-and-harshitha/IMG_6346.jpg",
    webpImage: "/images/stories/sirish-and-harshitha/IMG_6346.webp",
    fallbackImage: "/images/stories/sirish-and-harshitha/IMG_6346.jpg",
    href: "/disciplines/archive",
    objectPosition: "center 25%",
  },
];

export const COLLECTION_PROJECTS = COLLECTION_DISCIPLINES;

export default function TheCollection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const showcaseRef = useRef<HTMLDivElement>(null);

  // Default active discipline on initial load is 01 (Weddings & Royal Unions)
  const [activeId, setActiveId] = useState<string>("weddings");
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  const isTouchRef = useRef(false);

  /* ── Clean Single-Source Card Activation & Persistence ──────── */
  // The most recently activated card remains expanded; pointer leaving does not reset it.
  const activateCard = useCallback((id: string) => {
    setActiveId(id);
  }, []);

  const handleCardPointerEnter = useCallback(
    (id: string, e: React.PointerEvent) => {
      if (e.pointerType === "touch") {
        isTouchRef.current = true;
        return;
      }
      isTouchRef.current = false;
      activateCard(id);
    },
    [activateCard]
  );

  /* ── GSAP Scroll-Triggered Entrance ─────────────────────────── */
  useEffect(() => {
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReduced) return;

    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 78%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      if (showcaseRef.current) {
        gsap.fromTo(
          showcaseRef.current,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.95,
            ease: "power2.out",
            scrollTrigger: {
              trigger: showcaseRef.current,
              start: "top 82%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleImageError = (id: string) => {
    setImgErrors((prev) => ({ ...prev, [id]: true }));
  };

  const handleCardClick = useCallback(
    (discipline: CollectionDiscipline, displayImage: string) => {
      if (activeId === discipline.id || !isTouchRef.current) {
        navigateWithCameraTransition(discipline.href, {
          image: displayImage,
        });
      } else {
        activateCard(discipline.id);
      }
    },
    [activeId, activateCard]
  );

  const handleCardKeyDown = useCallback(
    (e: React.KeyboardEvent, discipline: CollectionDiscipline, displayImage: string) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleCardClick(discipline, displayImage);
      }
    },
    [handleCardClick]
  );

  const handleNavigateClick = useCallback(
    (e: React.MouseEvent, discipline: CollectionDiscipline, displayImage: string) => {
      e.stopPropagation();
      e.preventDefault();
      navigateWithCameraTransition(discipline.href, {
        image: displayImage,
      });
    },
    []
  );

  return (
    <section
      ref={sectionRef}
      id="collection"
      className={styles.section}
      aria-label="The Collection — Six Practices of Cinema & Optics"
    >
      <div id="explore" className={styles.anchorOffset} aria-hidden="true" />

      <div className={styles.container}>
        {/* ── Section Header ────────────────────────────────────── */}
        <div ref={headerRef} className={styles.header}>
          <div className={styles.headerMeta}>
            <span className={styles.chapterLabel}>Chapter 03 — The Collection</span>
            <span className={styles.curatorialBadge}>Six Practices of Optics</span>
          </div>
          <h2 className={styles.title}>
            The <span className={styles.cursiveAccent}>Collection</span>
          </h2>
          <p className={styles.subtitle}>
            From intimate Vedic rituals to high-fashion spreads and cinematic master films.
            Select any discipline to enter its dedicated portfolio.
          </p>
        </div>

        {/* ── Outer Showcase Frame ──────────────────────────────── */}
        <div
          ref={showcaseRef}
          className={styles.showcaseContainer}
          role="region"
          aria-label="Six-Discipline Horizontal Editorial Showcase"
        >
          <div className={styles.accordionTrack}>
            {COLLECTION_DISCIPLINES.map((discipline) => {
              const isSelected = discipline.id === activeId;
              const hasError = imgErrors[discipline.id];
              const displayImage = hasError ? discipline.fallbackImage : discipline.image;

              return (
                <div
                  key={discipline.id}
                  data-discipline-id={discipline.id}
                  className={`${styles.card} ${
                    isSelected ? styles.cardActive : styles.cardInactive
                  }`}
                  onPointerEnter={(e) => handleCardPointerEnter(discipline.id, e)}
                  onClick={() => handleCardClick(discipline, displayImage)}
                  onKeyDown={(e) => handleCardKeyDown(e, discipline, displayImage)}
                  onFocus={() => activateCard(discipline.id)}
                  tabIndex={0}
                  role="button"
                  aria-expanded={isSelected}
                  aria-label={`${discipline.number} — ${discipline.title}`}
                >
                  {/* Background Photographic Canvas */}
                  <div className={styles.imageCanvas}>
                    <picture>
                      {!hasError && discipline.webpImage && (
                        <source srcSet={discipline.webpImage} type="image/webp" />
                      )}
                      <img
                        src={displayImage}
                        alt={discipline.title}
                        className={styles.cardImage}
                        style={{ objectPosition: discipline.objectPosition || "center 25%" }}
                        loading="lazy"
                        onError={() => handleImageError(discipline.id)}
                      />
                    </picture>

                    <div
                      className={isSelected ? styles.activeGradient : styles.collapsedGradient}
                      aria-hidden="true"
                    />
                  </div>

                  {/* ── Active Featured Panel Content (Complete Synchronized Fade Reveal) ── */}
                  <div
                    className={styles.activeContent}
                    aria-hidden={!isSelected}
                  >
                    <div className={styles.activeTopRow}>
                      <div className={styles.activeMetaTag}>
                        <span className={styles.activeNumber}>DISCIPLINE {discipline.number}</span>
                        <span className={styles.activeDivider}>/</span>
                        <span className={styles.activeCategory}>{discipline.shortTitle}</span>
                      </div>
                      <span className={styles.activeStatusPill}>{discipline.count}</span>
                    </div>

                    <div className={styles.activeBottomBlock}>
                      <h3 className={styles.activeTitle}>{discipline.title}</h3>
                      <p className={styles.activeTagline}>{discipline.tagline}</p>
                      <p className={styles.activeDescription}>{discipline.heroDescription}</p>

                      <div className={styles.activeButtonRow}>
                        <Link
                          href={discipline.href}
                          className={styles.btnPrimary}
                          onClick={(e) => handleNavigateClick(e, discipline, displayImage)}
                          aria-label={`Enter the full ${discipline.title} portfolio`}
                        >
                          <span>EXPLORE {discipline.shortTitle.toUpperCase()} GALLERY</span>
                          <span className={styles.btnArrow}>→</span>
                        </Link>

                        <Link
                          href="/stories"
                          className={styles.btnSecondary}
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            navigateWithCameraTransition("/stories", {
                              image: displayImage,
                            });
                          }}
                          aria-label="View archival index"
                        >
                          <span>ARCHIVAL INDEX</span>
                          <span className={styles.btnSubArrow}>↗</span>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* ── Inactive Collapsed Card Content ─────────────────── */}
                  <div
                    className={styles.collapsedContent}
                    aria-hidden={isSelected}
                  >
                    <div className={styles.collapsedTop}>
                      <span className={styles.collapsedNumber}>{discipline.number}</span>
                    </div>

                    <div className={styles.collapsedBottom}>
                      <div className={styles.collapsedMeta}>
                        <h4 className={styles.collapsedTitle}>{discipline.shortTitle}</h4>
                        <div className={styles.collapsedCountRow}>
                          <span className={styles.collapsedCount}>{discipline.count.split(" ")[0]}</span>
                          <span className={styles.collapsedArrow}>→</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Bottom Subtle Interaction Cue & Complete Archive Link ── */}
        <div className={styles.footerRow}>
          <span className={styles.interactionCue}>
            Select any discipline to reveal details · Hover or tap to expand
          </span>
          <Link
            href="/stories"
            className={styles.archiveLink}
            onClick={(e) => {
              e.preventDefault();
              navigateWithCameraTransition("/stories");
            }}
          >
            EXPLORE COMPLETE 24 FRAMES ARCHIVE →
          </Link>
        </div>
      </div>
    </section>
  );
}
