"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./TheVowSection.module.css";

gsap.registerPlugin(ScrollTrigger);

export interface CollectionPhoto {
  id: number;
  frameNo: string;
  title: string;
  caption: string;
  image: string;
  gear: string;
  location: string;
  projectSlug: string;
  verticalOffset: number; // organic vertical offset in px
  aspectRatio: string;
  width: string;
}

export const COLLECTION_ROW_1: CollectionPhoto[] = [
  {
    id: 1,
    frameNo: "FRAME 01",
    title: "A Royal Union",
    caption: "The quiet sacred moments right before the wedding procession begins.",
    image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1200&q=85&auto=format",
    gear: "Sony FX6 · 50mm f/1.2 GM",
    location: "Hyderabad Heritage Palace",
    projectSlug: "bellamkonda-kavya",
    verticalOffset: -16,
    aspectRatio: "16 / 10",
    width: "380px",
  },
  {
    id: 2,
    frameNo: "FRAME 02",
    title: "Temple Grandeur",
    caption: "Handwoven Kanjeevaram silks draped under golden mandapam lanterns.",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=85&auto=format",
    gear: "Nikon Z9 · 85mm f/1.2 S",
    location: "Chilkur Estate, Hyderabad",
    projectSlug: "manoj-snigdha",
    verticalOffset: 20,
    aspectRatio: "4 / 5",
    width: "300px",
  },
  {
    id: 3,
    frameNo: "FRAME 03",
    title: "Monolithic Colonnades",
    caption: "Architectural grandeur echoing through classical Nizam colonnades.",
    // FIXED: Approved high-res authentic palace colonnade asset (Taj Falaknama, HTTP 200)
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=85&auto=format",
    gear: "Hasselblad X2D · 55mm",
    location: "Taj Falaknama Palace",
    projectSlug: "karthik-vijayalakshmi",
    verticalOffset: -10,
    aspectRatio: "16 / 10",
    width: "380px",
  },
  {
    id: 4,
    frameNo: "FRAME 04",
    title: "Tuscan Twilight Vow",
    caption: "Cross-continental promises witnessed under Italian olive groves.",
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=85&auto=format",
    gear: "Cooke Primes · 35mm T2.0",
    location: "Villa di Catignano, Tuscany",
    projectSlug: "divya-federico",
    verticalOffset: 24,
    aspectRatio: "3 / 2",
    width: "330px",
  },
  {
    id: 5,
    frameNo: "FRAME 05",
    title: "Sacred Mangalasnanam",
    caption: "Turmeric water blessing captured with high-speed 120fps motion.",
    image: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1200&q=85&auto=format",
    gear: "Sony FX3 · 35mm f/1.4",
    location: "The Tamarind Tree, Bengaluru",
    projectSlug: "dhamini-goutham",
    verticalOffset: -18,
    aspectRatio: "4 / 5",
    width: "290px",
  },
  {
    id: 6,
    frameNo: "FRAME 06",
    title: "Midnight Vratham Fire",
    caption: "Pure atmospheric firelight casting timeless warmth upon the couple.",
    image: "https://images.unsplash.com/photo-1604017011826-d3b4c23f8914?w=1200&q=85&auto=format",
    gear: "Leica R · 50mm Summicron",
    location: "Heritage Pavilion, Hyderabad",
    projectSlug: "manoj-snigdha",
    verticalOffset: 14,
    aspectRatio: "4 / 3",
    width: "340px",
  },
];

export const COLLECTION_ROW_2: CollectionPhoto[] = [
  {
    id: 7,
    frameNo: "FRAME 07",
    title: "Grand Royal Arrival",
    caption: "Flanked by royal attendants and reverberating South Indian nadaswaram.",
    image: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=1200&q=85&auto=format",
    gear: "Sony A1 · 85mm f/1.2",
    location: "ITC Kohenur Atrium",
    projectSlug: "divya-federico",
    verticalOffset: 18,
    aspectRatio: "4 / 5",
    width: "300px",
  },
  {
    id: 8,
    frameNo: "FRAME 08",
    title: "Generational Tears",
    caption: "Tears of joy and heartfelt embraces captured unobtrusively.",
    image: "https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=1200&q=85&auto=format",
    gear: "Zeiss Supreme · 65mm",
    location: "Novotel HICC Arena",
    projectSlug: "bellamkonda-kavya",
    verticalOffset: -14,
    aspectRatio: "16 / 10",
    width: "370px",
  },
  {
    id: 9,
    frameNo: "FRAME 09",
    title: "Temple Sanctuary Dawn",
    caption: "First rays of sunlight bathing the stone temple carvings in gold.",
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&q=85&auto=format",
    gear: "Nikon Z8 · 24-70mm f/2.8",
    location: "Ananthagiri Hills Shrine",
    projectSlug: "karthik-vijayalakshmi",
    verticalOffset: 22,
    aspectRatio: "3 / 2",
    width: "320px",
  },
  {
    id: 10,
    frameNo: "FRAME 10",
    title: "The Sangeet Crescendo",
    caption: "Pure kinetic energy, synchronized choreography, and festival joy.",
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&q=85&auto=format",
    gear: "Sony FX6 · 24mm f/1.4 GM",
    location: "GMR Arena, Shamshabad",
    projectSlug: "bellamkonda-kavya",
    verticalOffset: -20,
    aspectRatio: "16 / 10",
    width: "380px",
  },
  {
    id: 11,
    frameNo: "FRAME 11",
    title: "Haute Couture Veil",
    caption: "Intricate golden zardozi embroidery floating gently in the evening breeze.",
    // FIXED: Approved bridal couture portrait in golden light (HTTP 200)
    image: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=1200&q=85&auto=format",
    gear: "Hasselblad H6D · 100mm",
    location: "Jubilee Hills Atelier",
    projectSlug: "karthik-vijayalakshmi",
    verticalOffset: 16,
    aspectRatio: "4 / 5",
    width: "280px",
  },
  {
    id: 12,
    frameNo: "FRAME 12",
    title: "Eternal Vow Stillness",
    caption: "Two souls in deep communion amidst a thousand celebrating guests.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=85&auto=format",
    gear: "Cooke S4/i · 50mm Cinema",
    location: "Banjara Hills Estate",
    projectSlug: "manoj-snigdha",
    verticalOffset: -12,
    aspectRatio: "4 / 3",
    width: "350px",
  },
];

export default function TheVowSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  // Active / pinned photograph for click & touch interactions
  const [pinnedPhotoId, setPinnedPhotoId] = useState<number | null>(null);
  const [pinnedRowIndex, setPinnedRowIndex] = useState<number | null>(null);
  const [isTabHidden, setIsTabHidden] = useState(false);

  /* ── Pause movement when page is not visible ────────────────── */
  useEffect(() => {
    const handleVisibility = () => {
      setIsTabHidden(document.hidden);
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  /* ── Scroll-triggered entrance reveal ───────────────────────── */
  useEffect(() => {
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReduced) return;

    const ctx = gsap.context(() => {
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
            start: "top 78%",
            toggleActions: "play none none reverse",
          },
        }
      );

      gsap.fromTo(
        stageRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: stageRef.current,
            start: "top 82%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  /* ── Tap / Click interaction: toggle enlargement and pause ─── */
  const handlePhotoClick = (item: CollectionPhoto, rowIndex: number) => {
    if (pinnedPhotoId === item.id) {
      // Dismiss on second tap
      setPinnedPhotoId(null);
      setPinnedRowIndex(null);
    } else {
      // Select & pin enlarged
      setPinnedPhotoId(item.id);
      setPinnedRowIndex(rowIndex);
    }
  };

  const handleDismissPinned = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPinnedPhotoId(null);
    setPinnedRowIndex(null);
  };

  return (
    <section
      ref={sectionRef}
      id="the-vow"
      className={styles.section}
      aria-label="The Vow — Floating Photographic Installation"
      onClick={() => {
        // Clicking canvas background dismisses any pinned photo
        if (pinnedPhotoId !== null) {
          setPinnedPhotoId(null);
          setPinnedRowIndex(null);
        }
      }}
    >
      <div className={styles.container}>
        {/* Section Header */}
        <div ref={headerRef} className={styles.header}>
          <div className={styles.headerMeta}>
            <span className={styles.label}>Chapter 02.b — Photographic Installation</span>
            <span className={styles.badge}>FLOATING GALLERY</span>
          </div>
          <h2 className={styles.title}>The Vow</h2>
          <div className={styles.subRow}>
            <span className={styles.goldRule} />
            <span className={styles.subtitle}>WEDDING ARCHIVE · TWELVE FRAMES IN MOTION</span>
          </div>
        </div>
      </div>

      {/* ── Continuous Horizontal Floating Gallery ── */}
      <div
        ref={stageRef}
        className={`${styles.stageViewport} ${isTabHidden ? styles.stagePaused : ""}`}
      >
        {/* Row 1 — Continuous Drifting Left */}
        <div
          className={`${styles.rowTrack} ${
            pinnedRowIndex === 1 ? styles.rowPinnedPaused : ""
          }`}
          tabIndex={0}
          aria-label="Row 1 — Drifting left. Hover, focus, or tap to pause and inspect."
        >
          <div className={`${styles.ribbonRow} ${styles.ribbonLeft}`}>
            {/* Primary sequence */}
            {COLLECTION_ROW_1.map((item) => {
              const isPinned = pinnedPhotoId === item.id;
              return (
                <div
                  key={`r1-${item.id}`}
                  className={`${styles.photoCard} ${isPinned ? styles.photoCardPinned : ""}`}
                  style={{
                    width: item.width,
                    "--offset": `${item.verticalOffset}px`,
                  } as React.CSSProperties}
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePhotoClick(item, 1);
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handlePhotoClick(item, 1);
                    }
                    if (e.key === "Escape") {
                      setPinnedPhotoId(null);
                      setPinnedRowIndex(null);
                    }
                  }}
                  aria-label={`${item.title} — ${item.location}. Tap to inspect.`}
                >
                  <div
                    className={styles.cardImageContainer}
                    style={{ aspectRatio: item.aspectRatio }}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className={styles.cardImage}
                      loading="lazy"
                    />
                    <div className={styles.cardVignette} />
                  </div>

                  {/* Editorial Caption Tag */}
                  <div className={styles.captionTag}>
                    <div className={styles.captionTop}>
                      <span className={styles.frameBadge}>{item.frameNo}</span>
                      <span className={styles.tagTitle}>{item.title}</span>
                    </div>
                    <span className={styles.tagLocation}>{item.location}</span>

                    {/* Secondary Direct Action Link (always accessible on hover/enlarge) */}
                    <div className={styles.enlargedActionRow}>
                      <Link
                        href={`/work/${item.projectSlug}`}
                        className={styles.openProjectLink}
                        onClick={(e) => e.stopPropagation()}
                      >
                        Step Inside Story →
                      </Link>
                      {isPinned && (
                        <button
                          type="button"
                          className={styles.dismissBtn}
                          onClick={handleDismissPinned}
                          aria-label="Dismiss enlarged inspection"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Duplicate sequence for seamless loop */}
            {COLLECTION_ROW_1.map((item) => (
              <div
                key={`r1-dup-${item.id}`}
                className={styles.photoCard}
                style={{
                  width: item.width,
                  "--offset": `${item.verticalOffset}px`,
                } as React.CSSProperties}
                aria-hidden="true"
                tabIndex={-1}
              >
                <div
                  className={styles.cardImageContainer}
                  style={{ aspectRatio: item.aspectRatio }}
                >
                  <img
                    src={item.image}
                    alt=""
                    className={styles.cardImage}
                    loading="lazy"
                  />
                  <div className={styles.cardVignette} />
                </div>
                <div className={styles.captionTag}>
                  <div className={styles.captionTop}>
                    <span className={styles.frameBadge}>{item.frameNo}</span>
                    <span className={styles.tagTitle}>{item.title}</span>
                  </div>
                  <span className={styles.tagLocation}>{item.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 — Continuous Drifting Right */}
        <div
          className={`${styles.rowTrack} ${
            pinnedRowIndex === 2 ? styles.rowPinnedPaused : ""
          }`}
          tabIndex={0}
          aria-label="Row 2 — Drifting right. Hover, focus, or tap to pause and inspect."
        >
          <div className={`${styles.ribbonRow} ${styles.ribbonRight}`}>
            {/* Primary sequence */}
            {COLLECTION_ROW_2.map((item) => {
              const isPinned = pinnedPhotoId === item.id;
              return (
                <div
                  key={`r2-${item.id}`}
                  className={`${styles.photoCard} ${isPinned ? styles.photoCardPinned : ""}`}
                  style={{
                    width: item.width,
                    "--offset": `${item.verticalOffset}px`,
                  } as React.CSSProperties}
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePhotoClick(item, 2);
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handlePhotoClick(item, 2);
                    }
                    if (e.key === "Escape") {
                      setPinnedPhotoId(null);
                      setPinnedRowIndex(null);
                    }
                  }}
                  aria-label={`${item.title} — ${item.location}. Tap to inspect.`}
                >
                  <div
                    className={styles.cardImageContainer}
                    style={{ aspectRatio: item.aspectRatio }}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className={styles.cardImage}
                      loading="lazy"
                    />
                    <div className={styles.cardVignette} />
                  </div>

                  {/* Editorial Caption Tag */}
                  <div className={styles.captionTag}>
                    <div className={styles.captionTop}>
                      <span className={styles.frameBadge}>{item.frameNo}</span>
                      <span className={styles.tagTitle}>{item.title}</span>
                    </div>
                    <span className={styles.tagLocation}>{item.location}</span>

                    {/* Secondary Direct Action Link */}
                    <div className={styles.enlargedActionRow}>
                      <Link
                        href={`/work/${item.projectSlug}`}
                        className={styles.openProjectLink}
                        onClick={(e) => e.stopPropagation()}
                      >
                        Step Inside Story →
                      </Link>
                      {isPinned && (
                        <button
                          type="button"
                          className={styles.dismissBtn}
                          onClick={handleDismissPinned}
                          aria-label="Dismiss enlarged inspection"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Duplicate sequence for seamless loop */}
            {COLLECTION_ROW_2.map((item) => (
              <div
                key={`r2-dup-${item.id}`}
                className={styles.photoCard}
                style={{
                  width: item.width,
                  "--offset": `${item.verticalOffset}px`,
                } as React.CSSProperties}
                aria-hidden="true"
                tabIndex={-1}
              >
                <div
                  className={styles.cardImageContainer}
                  style={{ aspectRatio: item.aspectRatio }}
                >
                  <img
                    src={item.image}
                    alt=""
                    className={styles.cardImage}
                    loading="lazy"
                  />
                  <div className={styles.cardVignette} />
                </div>
                <div className={styles.captionTag}>
                  <div className={styles.captionTop}>
                    <span className={styles.frameBadge}>{item.frameNo}</span>
                    <span className={styles.tagTitle}>{item.title}</span>
                  </div>
                  <span className={styles.tagLocation}>{item.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
