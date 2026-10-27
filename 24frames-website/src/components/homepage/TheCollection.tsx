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

// Aliases for backward compatibility
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

  // Default active discipline is 01 (Weddings & Royal Unions)
  const [activeId, setActiveId] = useState<string>("weddings");
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  // Element Refs for GSAP Continuous Flex Redistribution
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const activeContentRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const collapsedContentRefs = useRef<Record<string, HTMLDivElement | null>>({});

  /* ── Continuous GSAP Width Redistribution Engine ─────────────── */
  const animateToCard = useCallback((targetId: string, immediate: boolean = false) => {
    const isDesktop = typeof window !== "undefined" && window.matchMedia("(min-width: 821px)").matches;
    if (!isDesktop) return;

    COLLECTION_DISCIPLINES.forEach((disc) => {
      const card = cardRefs.current[disc.id];
      const activeEl = activeContentRefs.current[disc.id];
      const collapsedEl = collapsedContentRefs.current[disc.id];
      if (!card) return;

      const isActive = disc.id === targetId;
      const targetFlexGrow = isActive ? 2.85 : 1.0;

      if (immediate) {
        gsap.set(card, { flexGrow: targetFlexGrow });
        if (activeEl) gsap.set(activeEl, { opacity: isActive ? 1 : 0 });
        if (collapsedEl) gsap.set(collapsedEl, { opacity: isActive ? 0 : 1 });
        return;
      }

      // Smooth, continuous flexGrow morph (1.0s with power2.inOut)
      gsap.to(card, {
        flexGrow: targetFlexGrow,
        duration: 1.0,
        ease: "power2.inOut",
        overwrite: "auto",
      });

      // Active content: reveal smoothly as width becomes available
      if (activeEl) {
        if (isActive) {
          gsap.to(activeEl, {
            opacity: 1,
            duration: 0.55,
            delay: 0.32,
            ease: "power2.out",
            overwrite: "auto",
          });
        } else {
          gsap.to(activeEl, {
            opacity: 0,
            duration: 0.28,
            ease: "power2.in",
            overwrite: "auto",
          });
        }
      }

      // Collapsed content: cross-fade gracefully
      if (collapsedEl) {
        if (isActive) {
          gsap.to(collapsedEl, {
            opacity: 0,
            duration: 0.25,
            ease: "power2.in",
            overwrite: "auto",
          });
        } else {
          gsap.to(collapsedEl, {
            opacity: 1,
            duration: 0.55,
            delay: 0.35,
            ease: "power2.out",
            overwrite: "auto",
          });
        }
      }
    });
  }, []);

  // Initial Layout Setup
  useEffect(() => {
    animateToCard("weddings", true);
  }, [animateToCard]);

  // Handle Window Resize
  useEffect(() => {
    const handleResize = () => {
      const isDesktop = window.matchMedia("(min-width: 821px)").matches;
      if (isDesktop) {
        animateToCard(activeId, true);
      } else {
        // Reset inline flexGrow on mobile
        COLLECTION_DISCIPLINES.forEach((disc) => {
          const card = cardRefs.current[disc.id];
          if (card) gsap.set(card, { clearProps: "flexGrow" });
        });
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [activeId, animateToCard]);

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
            duration: 0.9,
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

  const isTouchRef = useRef(false);

  const switchActiveCard = useCallback(
    (id: string) => {
      if (id === activeId) return;
      setActiveId(id);
      animateToCard(id, false);
    },
    [activeId, animateToCard]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.pointerType === "touch") {
        isTouchRef.current = true;
        return;
      }
      isTouchRef.current = false;
      const target = e.target as HTMLElement | null;
      const card = target?.closest("[data-discipline-id]") as HTMLElement | null;
      if (card) {
        const id = card.getAttribute("data-discipline-id");
        if (id && id !== activeId) {
          switchActiveCard(id);
        }
      }
    },
    [activeId, switchActiveCard]
  );

  const handlePointerLeave = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.pointerType === "touch" || isTouchRef.current) return;
      switchActiveCard("weddings");
    },
    [switchActiveCard]
  );

  const handleCardClick = useCallback(
    (discipline: CollectionDiscipline, displayImage: string) => {
      if (activeId === discipline.id || !isTouchRef.current) {
        navigateWithCameraTransition(discipline.href, {
          image: displayImage,
        });
      } else {
        switchActiveCard(discipline.id);
      }
    },
    [activeId, switchActiveCard]
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
      {/* Anchor alias to support legacy #explore anchor links smoothly */}
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

        {/* ── Outer Showcase Frame (Shared Soft Rounded Outer Container) ── */}
        <div
          ref={showcaseRef}
          className={styles.showcaseContainer}
          role="region"
          aria-label="Six-Discipline Horizontal Editorial Showcase"
        >
          <div
            className={styles.accordionTrack}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
            onMouseLeave={() => {
              if (!isTouchRef.current) switchActiveCard("weddings");
            }}
          >
            {COLLECTION_DISCIPLINES.map((discipline) => {
              const isSelected = discipline.id === activeId;
              const hasError = imgErrors[discipline.id];
              const displayImage = hasError ? discipline.fallbackImage : discipline.image;

              return (
                <div
                  key={discipline.id}
                  ref={(el) => {
                    cardRefs.current[discipline.id] = el;
                  }}
                  data-discipline-id={discipline.id}
                  className={`${styles.card} ${
                    isSelected ? styles.cardActive : styles.cardInactive
                  }`}
                  onPointerEnter={(e) => {
                    if (e.pointerType !== "touch") switchActiveCard(discipline.id);
                  }}
                  onPointerOver={(e) => {
                    if (e.pointerType !== "touch") switchActiveCard(discipline.id);
                  }}
                  onMouseEnter={() => {
                    if (!isTouchRef.current) switchActiveCard(discipline.id);
                  }}
                  onClick={() => handleCardClick(discipline, displayImage)}
                  onKeyDown={(e) => handleCardKeyDown(e, discipline, displayImage)}
                  onFocus={() => switchActiveCard(discipline.id)}
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

                    {/* Gradient Overlay tailored for active vs collapsed states */}
                    <div
                      className={isSelected ? styles.activeGradient : styles.collapsedGradient}
                      aria-hidden="true"
                    />
                  </div>

                  {/* ── Active Featured Panel Content (Always mounted, cross-faded via GSAP) ── */}
                  <div
                    ref={(el) => {
                      activeContentRefs.current[discipline.id] = el;
                    }}
                    className={styles.activeContent}
                    aria-hidden={!isSelected}
                  >
                    {/* Top Header Row with Restrained Editorial Metadata */}
                    <div className={styles.activeTopRow}>
                      <div className={styles.activeMetaTag}>
                        <span className={styles.activeNumber}>DISCIPLINE {discipline.number}</span>
                        <span className={styles.activeDivider}>/</span>
                        <span className={styles.activeCategory}>{discipline.shortTitle}</span>
                      </div>
                      <span className={styles.activeStatusPill}>{discipline.count}</span>
                    </div>

                    {/* Bottom Story & Action Block */}
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
                          Explore {discipline.shortTitle} Gallery{" "}
                          <span className={styles.arrowIcon} aria-hidden="true">
                            →
                          </span>
                        </Link>
                        <Link
                          href="/disciplines/archive"
                          className={styles.btnSecondary}
                          aria-label="View the complete 24 Frames archive"
                        >
                          Archival Index <span aria-hidden="true">↗</span>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* ── Inactive Collapsed Card Content (Always mounted, cross-faded via GSAP) ── */}
                  <div
                    ref={(el) => {
                      collapsedContentRefs.current[discipline.id] = el;
                    }}
                    className={styles.collapsedContent}
                    aria-hidden={isSelected}
                  >
                    {/* Top Number */}
                    <div className={styles.collapsedTop}>
                      <span className={styles.collapsedNumber}>{discipline.number}</span>
                    </div>

                    {/* Bottom Readable Discipline Info */}
                    <div className={styles.collapsedBottom}>
                      <div className={styles.collapsedMeta}>
                        <h4 className={styles.collapsedTitle}>{discipline.shortTitle}</h4>
                        <p className={styles.collapsedCount}>{discipline.count}</p>
                      </div>
                      <span className={styles.collapsedArrow} aria-hidden="true">
                        →
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Footnote / Discoverability Row ──────────────────────── */}
        <div className={styles.footerCueRow}>
          <span className={styles.footerCue}>
            Select any discipline to reveal details · Hover or tap to expand
          </span>
          <Link href="/disciplines/archive" className={styles.footerArchiveLink}>
            Explore Complete 24 Frames Archive →
          </Link>
        </div>
      </div>
    </section>
  );
}
