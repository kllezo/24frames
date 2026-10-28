"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./ClientGalleryExperience.module.css";

import LiquidDotCanvas from "./LiquidDotCanvas";

gsap.registerPlugin(ScrollTrigger);

export interface GalleryCardItem {
  id: string;
  hash: string;
  number: string;
  title: string;
  description: string;
  artImage: string;
  artAlt: string;
  href: string;
  theme?: string;
  gradientClass?: string;
  fillColor: string;
  textColor: string;
  descColor: string;
}

export const CLIENT_GALLERY_FEATURES: GalleryCardItem[] = [
  {
    id: "private-archive",
    hash: "private-archive",
    number: "01",
    title: "The Private Archive",
    description: "AI-assisted facial indexing and moment discovery, categorizing thousands of frames into family albums.",
    artImage: "/images/gallery-experience/the-private-archive.png",
    artAlt: "Private archive facial indexing interface and moment discovery albums",
    href: "/client-gallery#private-archive",
    theme: "warm",
    gradientClass: styles.cardWarmCanvas,
    fillColor: "#EDE6D8",
    textColor: "#09453E",
    descColor: "#4D5450",
  },
  {
    id: "cinema-room",
    hash: "cinema-room",
    number: "02",
    title: "The Cinema Room",
    description: "Private cinematic streaming theater presenting master films, ceremony teasers, and vertical cuts.",
    artImage: "/images/gallery-experience/card2_art.png",
    artAlt: "Private cinema room streaming suite for 4K master wedding films",
    href: "/client-gallery#cinema-room",
    theme: "warm",
    gradientClass: styles.cardWarmCanvas,
    fillColor: "#EDE6D8",
    textColor: "#09453E",
    descColor: "#4D5450",
  },
  {
    id: "signature-shots",
    hash: "signature-shots",
    number: "03",
    title: "Instagram-Ready Signature Shots",
    description: "Curated, color-calibrated portraits and candids individually proportioned for social sharing.",
    artImage: "/images/gallery-experience/instagram-ready-shots.jpg",
    artAlt: "Color-calibrated bridal portrait proportioned for social sharing",
    href: "/client-gallery#signature-shots",
    theme: "warm",
    gradientClass: styles.cardWarmCanvas,
    fillColor: "#EDE6D8",
    textColor: "#09453E",
    descColor: "#4D5450",
  },
  {
    id: "event-stories",
    hash: "event-stories",
    number: "04",
    title: "Event-Wise Photo Stories",
    description: "Chronological ceremony chapters organizing your journey from Pellikuthuru to the grand reception.",
    artImage: "/images/gallery-experience/event-wise-photos.png",
    artAlt: "Event-wise photo stories organized chronologically by ritual",
    href: "/client-gallery#event-stories",
    theme: "warm",
    gradientClass: styles.cardWarmCanvas,
    fillColor: "#EDE6D8",
    textColor: "#09453E",
    descColor: "#4D5450",
  },
  {
    id: "heirloom-collection",
    hash: "heirloom-collection",
    number: "05",
    title: "The Heirloom Collection",
    description: "Long-term archival preservation safeguarding family heirlooms, albums, and generational cinema.",
    artImage: "/images/gallery-experience/heirloom-collection.png",
    artAlt: "Generational wedding album and heirloom preservation archive",
    href: "/client-gallery#heirloom-collection",
    theme: "warm",
    gradientClass: styles.cardWarmCanvas,
    fillColor: "#EDE6D8",
    textColor: "#09453E",
    descColor: "#4D5450",
  },
];

export default function ClientGalleryExperience() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  /* ── GSAP Entrance Animation ── */
  useEffect(() => {
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReduced) return;

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
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      if (gridRef.current) {
        gsap.fromTo(
          gridRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power2.out",
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="client-gallery"
      className={styles.section}
      aria-label="The 24 Frames Client Gallery Experience"
    >
      {/* ── Interactive Liquid Dot Matrix Field (Authentic organic bulge) ── */}
      <LiquidDotCanvas className={styles.liquidCanvas} />

      <div className={styles.container}>
        {/* ── 1. EDITORIAL SECTION HEADER ── */}
        <div ref={headerRef} className={styles.editorialHeader}>
          <div className={styles.chapterBadgeRow}>
            <span className={styles.goldRule} aria-hidden="true" />
            <span className={styles.chapterMarker}>
              PRIVATE CLIENT SUITE · 5 CURATED CAPABILITIES
            </span>
            <span className={styles.goldRule} aria-hidden="true" />
          </div>

          <h2 className={styles.editorialTitle}>
            THE 24 FRAMES CLIENT GALLERY EXPERIENCE
          </h2>

          <p className={styles.editorialSubtitle}>
            Every wedding and editorial commission includes access to our private client gallery suite — designed to preserve, organize, and present your memories with archival fidelity.
          </p>
        </div>

        {/* ── 2. FIVE SCULPTED CARDS IN A SINGLE HORIZONTAL ROW ── */}
        <div ref={gridRef} className={styles.cardsShowcaseWrapper}>
          <div
            className={styles.cardsGrid}
            role="list"
            onMouseLeave={() => setActiveCardId(null)}
          >
            {CLIENT_GALLERY_FEATURES.map((item) => {
              const isOpen = activeCardId === item.id;
              const themeClass = styles[`card_${item.theme}`] || "";

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`${styles.card} ${themeClass} ${isOpen ? styles.cardOpen : ""}`}
                  role="listitem"
                  onMouseEnter={() => setActiveCardId(item.id)}
                  onClick={(e) => {
                    // On touch devices, first tap opens flap, second tap follows link
                    if (typeof window !== "undefined" && window.matchMedia("(hover: none)").matches && !isOpen) {
                      e.preventDefault();
                      setActiveCardId(item.id);
                    }
                  }}
                  aria-label={`${item.number} ${item.title} — Click to view section`}
                >
                  {/* Layer 1: Artwork Canvas (Expands across card on hover) */}
                  <div className={`${styles.artCanvas} ${item.gradientClass}`}>
                    <img
                      src={item.artImage}
                      alt={item.artAlt}
                      className={styles.artImage}
                      loading="lazy"
                    />
                    <div className={styles.hoverOverlayGradient} aria-hidden="true" />
                  </div>

                  {/* Layer 2: Sliding Notch Flap with Sculpted SVG Contour */}
                  <div className={styles.slidingFlap}>
                    <svg
                      className={styles.flapSvg}
                      viewBox="0 0 240 450"
                      preserveAspectRatio="none"
                      aria-hidden="true"
                    >
                      {/* Sculpted Notch: Left high shelf -> smooth S-curve notch -> Right lower shoulder */}
                      <path
                        d="M 0 0 L 118 0 C 128 0, 134 6, 138 14 C 142 22, 149 26, 160 26 L 240 26 L 240 450 L 0 450 Z"
                        fill={item.fillColor}
                      />
                    </svg>

                    {/* Bold Sequence Number on Left Shelf */}
                    <div
                      className={styles.cardNumber}
                      style={{ color: item.textColor }}
                    >
                      {item.number}
                    </div>

                    {/* Angled Action Arrow on Right Shoulder */}
                    <div
                      className={styles.cardArrow}
                      style={{ color: item.textColor }}
                      aria-hidden="true"
                    >
                      ↗
                    </div>
                  </div>

                  {/* Layer 3: Pinned Bottom Typography */}
                  <div className={styles.cardBottomText}>
                    <h3
                      className={styles.cardTitle}
                      style={{ color: item.textColor }}
                    >
                      {item.title}
                    </h3>
                    <p
                      className={styles.cardDesc}
                      style={{ color: item.descColor }}
                    >
                      {item.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Bottom Clarifying Editorial Bar */}
          <div className={styles.footnoteRow}>
            <span className={styles.footnoteText}>
              Included with all master commissions · Facial recognition indexing · Private 4K cinematic streaming
            </span>
            <Link href="/client-gallery" className={styles.suiteExploreLink}>
              <span>EXPLORE COMPLETE SUITE</span>
              <span className={styles.linkArrow}>→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
