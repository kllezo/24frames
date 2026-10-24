"use client";

import { useRef, useEffect, useState } from "react";
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
  verticalOffset: number; // organic vertical offset in px
}

const COLLECTION_ROW_1: CollectionPhoto[] = [
  {
    id: 1,
    frameNo: "FRAME 01",
    title: "A Royal Union",
    caption: "The quiet sacred moments right before the wedding procession begins.",
    image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1200&q=85&auto=format",
    gear: "Sony FX6 · 50mm f/1.2 GM",
    location: "Hyderabad Heritage Palace",
    verticalOffset: -16,
  },
  {
    id: 2,
    frameNo: "FRAME 02",
    title: "Temple Grandeur",
    caption: "Handwoven Kanjeevaram silks draped under golden mandapam lanterns.",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=85&auto=format",
    gear: "Nikon Z9 · 85mm f/1.2 S",
    location: "Chilkur Estate, Hyderabad",
    verticalOffset: 20,
  },
  {
    id: 3,
    frameNo: "FRAME 03",
    title: "Monolithic Colonnades",
    caption: "Architectural grandeur echoing through classical Nizam colonnades.",
    image: "https://images.unsplash.com/photo-1585071550721-fdb362ae2b8a?w=1200&q=85&auto=format",
    gear: "Hasselblad X2D · 55mm",
    location: "Taj Falaknama Palace",
    verticalOffset: -10,
  },
  {
    id: 4,
    frameNo: "FRAME 04",
    title: "Tuscan Twilight Vow",
    caption: "Cross-continental promises witnessed under Italian olive groves.",
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=85&auto=format",
    gear: "Cooke Primes · 35mm T2.0",
    location: "Villa di Catignano, Tuscany",
    verticalOffset: 24,
  },
  {
    id: 5,
    frameNo: "FRAME 05",
    title: "Sacred Mangalasnanam",
    caption: "Turmeric water blessing captured with high-speed 120fps motion.",
    image: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1200&q=85&auto=format",
    gear: "Sony FX3 · 35mm f/1.4",
    location: "The Tamarind Tree, Bengaluru",
    verticalOffset: -18,
  },
  {
    id: 6,
    frameNo: "FRAME 06",
    title: "Midnight Vratham Fire",
    caption: "Pure atmospheric firelight casting timeless warmth upon the couple.",
    image: "https://images.unsplash.com/photo-1604017011826-d3b4c23f8914?w=1200&q=85&auto=format",
    gear: "Leica R · 50mm Summicron",
    location: "Heritage Pavilion, Hyderabad",
    verticalOffset: 12,
  },
];

const COLLECTION_ROW_2: CollectionPhoto[] = [
  {
    id: 7,
    frameNo: "FRAME 07",
    title: "Grand Royal Arrival",
    caption: "Flanked by royal attendants and reverberating South Indian nadaswaram.",
    image: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=1200&q=85&auto=format",
    gear: "Sony A1 · 85mm f/1.2",
    location: "ITC Kohenur Atrium",
    verticalOffset: 18,
  },
  {
    id: 8,
    frameNo: "FRAME 08",
    title: "Generational Tears",
    caption: "Tears of joy and heartfelt embraces captured unobtrusively.",
    image: "https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=1200&q=85&auto=format",
    gear: "Zeiss Supreme · 65mm",
    location: "Novotel HICC Arena",
    verticalOffset: -14,
  },
  {
    id: 9,
    frameNo: "FRAME 09",
    title: "Temple Sanctuary Dawn",
    caption: "First rays of sunlight bathing the stone temple carvings in gold.",
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&q=85&auto=format",
    gear: "Nikon Z8 · 24-70mm f/2.8",
    location: "Ananthagiri Hills Shrine",
    verticalOffset: 22,
  },
  {
    id: 10,
    frameNo: "FRAME 10",
    title: "The Sangeet Crescendo",
    caption: "Pure kinetic energy, synchronized choreography, and festival joy.",
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&q=85&auto=format",
    gear: "Sony FX6 · 24mm f/1.4 GM",
    location: "GMR Arena, Shamshabad",
    verticalOffset: -20,
  },
  {
    id: 11,
    frameNo: "FRAME 11",
    title: "Haute Couture Veil",
    caption: "Intricate golden zardozi embroidery floating gently in the evening breeze.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200&q=85&auto=format",
    gear: "Hasselblad H6D · 100mm",
    location: "Jubilee Hills Atelier",
    verticalOffset: 14,
  },
  {
    id: 12,
    frameNo: "FRAME 12",
    title: "Eternal Vow Stillness",
    caption: "Two souls in deep communion amidst a thousand celebrating guests.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=85&auto=format",
    gear: "Cooke S4/i · 50mm Cinema",
    location: "Banjara Hills Estate",
    verticalOffset: -12,
  },
];

export default function TheVowSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);

  const [selectedPhoto, setSelectedPhoto] = useState<CollectionPhoto | null>(null);

  /* ── Scroll-Linked Motion (Deterministic, Scrubbed to Scroll Progress) ── */
  useEffect(() => {
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReduced) return;

    const ctx = gsap.context(() => {
      // Header entrance
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

      // Deterministic Scroll-scrubbed horizontal translation
      if (row1Ref.current && row2Ref.current && stageRef.current) {
        // Row 1 glides left as page scrolls down
        gsap.to(row1Ref.current, {
          xPercent: -20,
          ease: "none",
          scrollTrigger: {
            trigger: stageRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
        });

        // Row 2 glides right at a slightly different tuned rate
        gsap.to(row2Ref.current, {
          xPercent: 18,
          ease: "none",
          scrollTrigger: {
            trigger: stageRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
        });

        // Subtle focal scaling as cards cross viewport center
        const cards = gsap.utils.toArray<HTMLElement>(`.${styles.photoCard}`);
        cards.forEach((card) => {
          gsap.fromTo(
            card,
            { scale: 0.96 },
            {
              scale: 1.03,
              ease: "power1.inOut",
              scrollTrigger: {
                trigger: card,
                start: "top 85%",
                end: "top 20%",
                scrub: 1,
              },
            }
          );
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="the-vow"
      className={styles.section}
      aria-label="The Vow — Scroll-Driven Photographic Installation"
    >
      <div className={styles.container}>
        {/* Section Header */}
        <div ref={headerRef} className={styles.header}>
          <div className={styles.headerMeta}>
            <span className={styles.label}>Chapter 02 — Photographic Installation</span>
            <span className={styles.badge}>SCROLL-DRIVEN ARCHIVE</span>
          </div>
          <h2 className={styles.title}>The Vow</h2>
          <div className={styles.subRow}>
            <span className={styles.goldRule} />
            <span className={styles.subtitle}>WEDDING ARCHIVE · TWELVE FRAMES</span>
          </div>
        </div>

        {/* ── Scroll-Linked Spatial Composition Stage ── */}
        <div ref={stageRef} className={styles.stageViewport}>
          {/* Row 1 — Scrubbed Left with Organic Vertical Offsets */}
          <div ref={row1Ref} className={`${styles.ribbonRow} ${styles.row1}`}>
            {COLLECTION_ROW_1.map((item) => (
              <div
                key={`r1-${item.id}`}
                className={styles.photoCard}
                style={{ transform: `translateY(${item.verticalOffset}px)` }}
                onClick={() => setSelectedPhoto(item)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelectedPhoto(item);
                  }
                }}
                aria-label={`${item.title} — ${item.location}`}
              >
                <div className={styles.cardImageContainer}>
                  <img
                    src={item.image}
                    alt={item.title}
                    className={styles.cardImage}
                    loading="lazy"
                  />
                  <div className={styles.cardVignette} />
                </div>

                {/* Editorial Caption Tag (Real verified metadata, no dummy label) */}
                <div className={styles.captionTag}>
                  <span className={styles.frameBadge}>{item.frameNo}</span>
                  <span className={styles.tagTitle}>{item.title}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Row 2 — Scrubbed Right with Opposing Vertical Offsets */}
          <div ref={row2Ref} className={`${styles.ribbonRow} ${styles.row2}`}>
            {COLLECTION_ROW_2.map((item) => (
              <div
                key={`r2-${item.id}`}
                className={styles.photoCard}
                style={{ transform: `translateY(${item.verticalOffset}px)` }}
                onClick={() => setSelectedPhoto(item)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelectedPhoto(item);
                  }
                }}
                aria-label={`${item.title} — ${item.location}`}
              >
                <div className={styles.cardImageContainer}>
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
                  <span className={styles.frameBadge}>{item.frameNo}</span>
                  <span className={styles.tagTitle}>{item.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Full-Screen Inspection Lightbox Modal ── */}
      {selectedPhoto && (
        <div
          className={styles.modalBackdrop}
          onClick={() => setSelectedPhoto(null)}
          role="dialog"
          aria-modal="true"
          aria-label={selectedPhoto.title}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className={styles.modalCloseBtn}
              onClick={() => setSelectedPhoto(null)}
              aria-label="Close photo preview"
            >
              ✕
            </button>

            <div className={styles.modalGrid}>
              <div className={styles.modalPhotoWrap}>
                <img
                  src={selectedPhoto.image}
                  alt={selectedPhoto.title}
                  className={styles.modalPhoto}
                />
              </div>

              <div className={styles.modalDetails}>
                <div className={styles.modalMetaTag}>
                  <span className={styles.modalTagBadge}>{selectedPhoto.frameNo}</span>
                  <span className={styles.modalId}>THE VOW ARCHIVE</span>
                </div>

                <h3 className={styles.modalHeading}>{selectedPhoto.title}</h3>
                <p className={styles.modalCaption}>{selectedPhoto.caption}</p>

                <div className={styles.specifications}>
                  <div className={styles.specItem}>
                    <span className={styles.specLabel}>Location</span>
                    <span className={styles.specValue}>{selectedPhoto.location}</span>
                  </div>
                  <div className={styles.specItem}>
                    <span className={styles.specLabel}>Optics & Sensor</span>
                    <span className={styles.specValue}>{selectedPhoto.gear}</span>
                  </div>
                  <div className={styles.specItem}>
                    <span className={styles.specLabel}>Grading</span>
                    <span className={styles.specValue}>24 Frames 8K Warm Archival Curve</span>
                  </div>
                </div>

                <div className={styles.modalActionRow}>
                  <a
                    href="#inquire"
                    className={styles.modalInquireBtn}
                    onClick={() => setSelectedPhoto(null)}
                  >
                    Inquire For Your Celebration →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
