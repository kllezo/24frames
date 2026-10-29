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
    title: "Weddings & Celebrations",
    shortTitle: "Weddings",
    count: "40+",
    tagline: "Sacred Telugu traditions, royal muhurthams & emotional generational tears.",
    heroDescription:
      "Multi-day coverage spanning Mangalasnanam, Sangeet galas, and dawn ceremonies. Documented without invasive lighting or forced poses.",
    image: "/images/portfolio/sireesh-harshitha/cover.jpg",
    webpImage: "/images/portfolio/sireesh-harshitha/cover.webp",
    fallbackImage: "/images/disciplines/weddings/223fd95b-d4b5-4f7d-840e-3f484b8d8966.JPG",
    href: "/disciplines/weddings",
    objectPosition: "center 22%",
  },
  {
    id: "celebrities",
    slug: "celebrities",
    number: "02",
    title: "Celebrities & Portraits",
    shortTitle: "Celebrities",
    count: "15+",
    tagline: "High-fashion bridal couture, Tollywood actors, and private family patriarchs.",
    heroDescription:
      "Medium-format optical portraits lit with master cinema fixtures. Preserving quiet dignity, sculptural elegance, and commanding presence.",
    image: "/images/disciplines/celebrities/IMG_6476.jpg",
    fallbackImage: "/images/disciplines/celebrities/IMG_6472.jpg",
    href: "/disciplines/celebrities",
    objectPosition: "center 18%",
  },
  {
    id: "events",
    slug: "events",
    number: "03",
    title: "Events & Cultural Galas",
    shortTitle: "Events",
    count: "20+",
    tagline: "High-octane Sangeet stages, milestone anniversaries, and national events.",
    heroDescription:
      "Capturing the electric choreography, live orchestral music, and grand architectural ambiance of premier celebration venues.",
    image: "/images/disciplines/events/IMG_6485.jpg",
    fallbackImage: "/images/disciplines/events/IMG_6487.jpg",
    href: "/disciplines/events",
    objectPosition: "48% 45%",
  },
  {
    id: "fashion",
    slug: "fashion",
    number: "04",
    title: "Fashion & Editorial",
    shortTitle: "Fashion",
    count: "10+",
    tagline: "Bespoke designer lookbooks and high-jewelry editorial campaigns.",
    heroDescription:
      "Crafted for prestigious publications and couture designers, combining experimental art direction with sharp optical discipline.",
    image: "/images/disciplines/fashion/IMG_6280.jpg",
    fallbackImage: "/images/disciplines/fashion/IMG_6288.jpg",
    href: "/disciplines/fashion",
    objectPosition: "center 18%",
  },
  {
    id: "cinema",
    slug: "cinema",
    number: "05",
    title: "Cinema & Feature Films",
    shortTitle: "Cinema",
    count: "50+ ANAMORPHIC FILMS",
    tagline: "2.39:1 Anamorphic motion pictures paired with orchestral audio scores.",
    heroDescription:
      "Shot with dedicated cinema crews on ARRI and Sony FX cinema lines. Edited as theatrical-grade wedding features.",
    image: "/images/disciplines/cinema/IMG_6319.jpg",
    fallbackImage: "/images/disciplines/cinema/IMG_6467.jpg",
    href: "/disciplines/cinema",
    objectPosition: "center 25%",
  },
];

export const COLLECTION_PROJECTS = COLLECTION_DISCIPLINES;

interface TheCollectionProps {
  isDedicatedRoute?: boolean;
}

export default function TheCollection({ isDedicatedRoute = false }: TheCollectionProps = {}) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const showcaseRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Default active discipline on initial load is Cinema & Feature Films (as featured card)
  const [activeId, setActiveId] = useState<string>("cinema");
  const [activeMobileIndex, setActiveMobileIndex] = useState<number>(0);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  const isTouchRef = useRef(false);

  /* ── Clean Single-Source Card Activation & Persistence ──────── */
  // The most recently activated card remains expanded; pointer leaving does not reset it.
  const activateCard = useCallback((id: string) => {
    setActiveId(id);
    const idx = COLLECTION_DISCIPLINES.findIndex((d) => d.id === id);
    if (idx !== -1) setActiveMobileIndex(idx);
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

  /* ── Mobile Scroll & Pagination Synchronization ──────────────── */
  const handleTrackScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const firstCard = track.firstElementChild as HTMLElement | null;
    if (!firstCard) return;
    const cardWidthWithGap = firstCard.offsetWidth + 12;
    if (cardWidthWithGap <= 0) return;

    const nextIndex = Math.round(track.scrollLeft / cardWidthWithGap);
    const clampedIndex = Math.max(0, Math.min(COLLECTION_DISCIPLINES.length - 1, nextIndex));
    setActiveMobileIndex(clampedIndex);

    if (typeof window !== "undefined" && window.innerWidth <= 820) {
      setActiveId(COLLECTION_DISCIPLINES[clampedIndex].id);
    }
  }, []);

  const scrollToMobileCard = useCallback((index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const cards = track.querySelectorAll(`.${styles.card}`);
    const targetCard = cards[index] as HTMLElement | null;
    if (targetCard) {
      targetCard.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
    } else {
      const cardWidthWithGap = (track.firstElementChild as HTMLElement)?.offsetWidth + 12 || 320;
      track.scrollTo({ left: index * cardWidthWithGap, behavior: "smooth" });
    }
    setActiveMobileIndex(index);
    setActiveId(COLLECTION_DISCIPLINES[index].id);
  }, []);

  /* ── GSAP Scroll-Triggered Left-to-Right Sequential Reveal ──── */
  useEffect(() => {
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth <= 820;
    if (isReduced || isMobile) return;

    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 78%",
              once: true,
            },
          }
        );
      }

      if (showcaseRef.current) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: showcaseRef.current,
            start: "top 78%",
            once: true,
          },
        });

        // Frame fades in smoothly with clean canvas
        tl.fromTo(
          showcaseRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.35, ease: "power2.out" }
        );

        // Five-stage horizontal reveal: Weddings -> Celebrities -> Events -> Fashion -> Cinema
        const cards = gsap.utils.toArray<HTMLElement>(`.${styles.card}`);
        cards.forEach((card, idx) => {
          const startTime = 0.08 + idx * 0.18; // 180ms stagger
          tl.fromTo(
            card,
            { clipPath: "inset(0 100% 0 0)", opacity: 0, x: -20 },
            { clipPath: "inset(0 0% 0 0)", opacity: 1, x: 0, duration: 0.65, ease: "power3.out" },
            startTime
          );

          // Inner image settles smoothly with subtle optical deceleration
          const img = card.querySelector(`.${styles.cardImage}`);
          if (img) {
            tl.fromTo(
              img,
              { scale: 1.08 },
              { scale: 1.0, duration: 0.75, ease: "power2.out" },
              startTime
            );
          }
        });

        // Content elements reveal cleanly as cards settle
        const contentElements = showcaseRef.current.querySelectorAll(
          `.${styles.compactContent}, .${styles.activeContent}`
        );
        if (contentElements.length) {
          tl.fromTo(
            contentElements,
            { opacity: 0 },
            { opacity: 1, duration: 0.45, stagger: 0.06, ease: "power2.out" },
            0.62
          );
        }
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
      className={`${styles.section} ${isDedicatedRoute ? styles.sectionDedicated : ""}`}
      aria-label="The Collection — Five Practices of Cinema & Optics"
    >
      <div id="explore" className={styles.anchorOffset} aria-hidden="true" />

      <div className={styles.container}>
        {/* ── Section Header ────────────────────────────────────── */}
        <div ref={headerRef} className={styles.header}>
          <div className={styles.headerTop}>
            <div className={styles.headerMeta}>
              <span className={styles.chapterLabel}>Chapter 03 — The Collection</span>
              <span className={styles.curatorialBadge}>Five Practices of Optics</span>
            </div>
          </div>
          <h2 className={styles.title}>
            The <span className={styles.cursiveAccent}>Collection</span>
          </h2>
          <p className={styles.subtitle}>
            From intimate Vedic rituals to high-fashion spreads and cinematic master films.
            Select any discipline to enter its dedicated portfolio.
          </p>
          <p className={styles.headerCursiveQuote}>
            “Every fleeting ritual holds a lifetime of meaning.”
          </p>
        </div>

        {/* ── Outer Showcase Frame ──────────────────────────────── */}
        <div
          ref={showcaseRef}
          className={styles.showcaseContainer}
          role="region"
          aria-label="Five-Discipline Horizontal Editorial Showcase"
        >
          <div
            ref={trackRef}
            className={styles.accordionTrack}
            onScroll={handleTrackScroll}
          >
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
                  aria-label={`${discipline.title} portfolio`}
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

                  {/* ── Active Featured Panel Content (Fully Responsive Editorial Layout) ── */}
                  <div
                    className={styles.activeContent}
                    aria-hidden={!isSelected}
                  >
                    <div className={styles.activeTopRow}>
                      <div className={styles.activeMetaTag}>
                        <span className={styles.activeCategory}>{discipline.shortTitle}</span>
                      </div>
                      <span className={styles.activeStatusPill}>
                        {discipline.count.includes("ANAMORPHIC")
                          ? discipline.count
                          : `${discipline.count} Master Films`}
                      </span>
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
                          <span>VIEW GALLERY</span>
                          <span className={styles.btnArrow}>→</span>
                        </Link>

                        {discipline.id === "weddings" && (
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
                            aria-label="Explore client love stories"
                          >
                            <span>EXPLORE LOVE STORIES</span>
                            <span className={styles.btnSubArrow}>↗</span>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ── Inactive Collapsed Card Content (Refined, Zero-Overflow Typography) ── */}
                  <div
                    className={styles.compactContent}
                    aria-hidden={isSelected}
                  >
                    <div className={styles.compactBottomBlock}>
                      <h4 className={styles.compactTitle}>{discipline.title}</h4>

                      <Link
                        href={discipline.href}
                        className={styles.compactBtn}
                        onClick={(e) => handleNavigateClick(e, discipline, displayImage)}
                        aria-label={`View ${discipline.title} gallery`}
                      >
                        <span>VIEW GALLERY</span>
                        <span className={styles.compactBtnArrow}>→</span>
                      </Link>

                      <div className={styles.compactCountRow}>
                        <span className={styles.compactCount}>{discipline.count.split(" ")[0]}</span>
                        <span className={styles.compactArrow}>→</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Mobile Touch Pagination Dots (Forest Green Active, Muted Grey Inactive) ── */}
        <div
          className={styles.mobilePagination}
          role="tablist"
          aria-label="Collection categories navigation"
        >
          {COLLECTION_DISCIPLINES.map((discipline, idx) => (
            <button
              key={discipline.id}
              type="button"
              role="tab"
              aria-selected={activeMobileIndex === idx}
              aria-label={`Jump to ${discipline.title}`}
              className={`${styles.paginationDot} ${
                activeMobileIndex === idx ? styles.paginationDotActive : ""
              }`}
              onClick={() => scrollToMobileCard(idx)}
            />
          ))}
        </div>

        {/* ── Subtle Mid-Page Cursive Editorial Note ── */}
        <div className={styles.bottomCursiveQuoteRow} aria-hidden="true">
          <p className={styles.bottomCursiveQuote}>
            “Five disciplines of optics, devoted to moments that never come again.”
          </p>
        </div>

        {/* ── Discreet Standalone Archive Link with Deliberate Whitespace ── */}
        <div className={styles.standaloneArchiveRow}>
          <Link
            href="/stories"
            className={styles.discreetArchiveLink}
            onClick={(e) => {
              e.preventDefault();
              navigateWithCameraTransition("/stories");
            }}
          >
            <span>Explore Complete 24 Frames Archive</span>
            <span className={styles.archiveArrow} aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
