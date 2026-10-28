"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./ClientGalleryExperience.module.css";

gsap.registerPlugin(ScrollTrigger);

interface GalleryCardItem {
  id: string;
  number: string;
  title: string;
  description: string;
  artImage: string;
  artAlt: string;
  href: string;
  theme: "indigo" | "light" | "obsidian" | "emerald" | "parchment";
  gradientClass: string;
  fillColor: string;
  textColor: string;
  descColor: string;
}

const GALLERY_CARDS: GalleryCardItem[] = [
  {
    id: "ai-discovery",
    number: "01",
    title: "The Private Archive",
    description: "Intelligent facial recognition discreetly indexes sacred moments into effortless family collections.",
    artImage: "/images/gallery-experience/card1_art.png",
    artAlt: "3D Chrome dynamic prism representing AI moment discovery",
    href: "/inquire",
    theme: "indigo",
    gradientClass: styles.card1Gradient,
    fillColor: "#141428",
    textColor: "#FFFFFF",
    descColor: "rgba(224, 231, 255, 0.72)",
  },
  {
    id: "private-cinema",
    number: "02",
    title: "The Cinema Room",
    description: "Bespoke screening theater streaming uncompressed master wedding films, trailers, and vertical reels.",
    artImage: "/images/gallery-experience/card2_art.png",
    artAlt: "Translucent golden dual cinema screens representing 4K private streaming theater",
    href: "/disciplines/cinema",
    theme: "light",
    gradientClass: styles.card2Gradient,
    fillColor: "url(#c2-gradient)",
    textColor: "#0F172A",
    descColor: "#475569",
  },
  {
    id: "signature-shots",
    number: "03",
    title: "Instagram-Ready Signature Shots",
    description: "Master color-graded portraits and candid moments individually calibrated and proportioned for seamless, high-fidelity social sharing.",
    artImage: "/images/stories/bellam-srikonda/IMG_6341.jpg",
    artAlt: "Master color-graded portraits proportioned for high-fidelity social sharing",
    href: "/disciplines/weddings",
    theme: "emerald",
    gradientClass: styles.cardEmeraldGradient,
    fillColor: "#082823",
    textColor: "#FFFFFF",
    descColor: "rgba(235, 245, 242, 0.78)",
  },
  {
    id: "photo-stories",
    number: "04",
    title: "Event-Wise Photo Stories",
    description: "Your wedding memories meticulously structured by ritual, ceremony, and intimate timeline — from Pellikuthuru to the grand reception.",
    artImage: "/images/stories/bellam-srikonda/IMG_6339.jpg",
    artAlt: "Wedding ritual ceremony timeline structured by event",
    href: "/stories",
    theme: "parchment",
    gradientClass: styles.cardParchmentGradient,
    fillColor: "#EFE8DA",
    textColor: "#141713",
    descColor: "#454D45",
  },
  {
    id: "heirloom-vault",
    number: "05",
    title: "The Heirloom Collection",
    description: "Color-calibrated digital archive engineered to safeguard family traditions and culture across generations.",
    artImage: "/images/gallery-experience/card3_art.png",
    artAlt: "Precision optical cinema lens elements representing generational heirloom vault",
    href: "/stories",
    theme: "obsidian",
    gradientClass: styles.card3Gradient,
    fillColor: "#121418",
    textColor: "#FFFFFF",
    descColor: "rgba(203, 213, 225, 0.72)",
  },
];

export default function ClientGalleryExperience() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const showcaseRef = useRef<HTMLDivElement>(null);

  // Active hover/touch state for cards
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  /* ── GSAP Entrance Animation ── */
  useEffect(() => {
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReduced) return;

    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              once: true,
            },
          }
        );
      }

      if (showcaseRef.current) {
        gsap.fromTo(
          showcaseRef.current,
          { opacity: 0, y: 40, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: showcaseRef.current,
              start: "top 82%",
              once: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const renderCard = (item: GalleryCardItem) => {
    const isOpen = activeCardId === item.id;

    return (
      <Link
        key={item.id}
        href={item.href}
        className={`${styles.card} ${styles[`card_${item.theme}`]} ${
          isOpen ? styles.cardOpen : ""
        }`}
        onMouseEnter={() => setActiveCardId(item.id)}
        onClick={(e) => {
          // On touch devices, first tap opens, second tap follows link
          if (window.matchMedia("(pointer: coarse)").matches && !isOpen) {
            e.preventDefault();
            setActiveCardId(item.id);
          }
        }}
        aria-label={`${item.number} ${item.title} — ${item.description}`}
      >
        {/* Layer 1: Artwork Canvas (Top window behind flap) */}
        <div className={`${styles.artCanvas} ${item.gradientClass}`}>
          <img
            src={item.artImage}
            alt={item.artAlt}
            className={styles.artImage}
            loading="lazy"
          />
        </div>

        {/* Layer 2: Sliding Notch Flap with SVG Notch Profile */}
        <div className={styles.slidingFlap}>
          <svg
            className={styles.flapSvg}
            viewBox="0 0 340 500"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {item.theme === "light" && (
              <defs>
                <linearGradient
                  id="c2-gradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#F4F6F9" />
                  <stop offset="60%" stopColor="#E6E9EF" />
                  <stop offset="100%" stopColor="#D8DCE4" />
                </linearGradient>
              </defs>
            )}
            {/* Notch contour: Left high shelf (y=0) -> S-curve step down (y=32) -> Right low shelf */}
            <path
              d="M 0 0 L 180 0 C 193 0, 201 8, 205 18 C 209 27, 217 32, 230 32 L 340 32 L 340 500 L 0 500 Z"
              fill={item.fillColor}
            />
          </svg>

          {/* Bold Giant Number on Left */}
          <div
            className={styles.cardNumber}
            style={{ color: item.textColor }}
          >
            {item.number}
          </div>

          {/* Angled Arrow on Right Shoulder */}
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
  };

  return (
    <section
      ref={sectionRef}
      id="client-gallery"
      className={styles.section}
      aria-label="The 24 Frames Client Gallery Experience"
    >
      <div className={styles.container}>
        {/* ── 1. EDITORIAL SECTION HEADER ── */}
        <div ref={headerRef} className={styles.editorialHeader}>
          <div className={styles.chapterBadgeRow}>
            <span className={styles.goldRule} aria-hidden="true" />
            <span className={styles.chapterMarker}>
              PRIVATE PALACE SUITE · GENERATIONAL VAULT
            </span>
            <span className={styles.goldRule} aria-hidden="true" />
          </div>

          <h2 className={styles.editorialTitle}>
            THE 24 FRAMES CLIENT GALLERY EXPERIENCE
          </h2>

          <p className={styles.editorialSubtitle}>
            Each master commission is endowed with a private digital archive — an exquisite palace vault engineered to preserve, curate, and relive your family’s most sacred memories for generations.
          </p>
        </div>

        {/* ── 2. DARK LUXURY SHOWCASE CONTAINER (EXACT REFERENCE FRAME) ── */}
        <div ref={showcaseRef} className={styles.darkShowcaseFrame}>
          {/* Top Bar matching Reference Video ("CARD" badge + close / indicator) */}
          <div className={styles.frameTopBar}>
            <div className={styles.pillBadge}>
              <span className={styles.pillBadgeDot} />
              <span>CARD SUITE</span>
            </div>

            <div className={styles.frameActionGroup}>
              <span className={styles.suiteLabel}>ROYAL CLIENT ARCHIVE SUITE · 5 FEATURES</span>
              <div className={styles.closeIconCircle} aria-hidden="true">
                <svg viewBox="0 0 16 16" fill="currentColor" width="12" height="12">
                  <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.75.75 0 1 1 1.06 1.06L9.06 8l3.22 3.22a.75.75 0 1 1-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 0 1-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Balanced 3 + 2 Cards Layout */}
          <div
            className={styles.cardsLayout}
            onMouseLeave={() => setActiveCardId(null)}
          >
            {/* Top Row: 3 Feature Cards */}
            <div className={styles.cardsRowTop}>
              {GALLERY_CARDS.slice(0, 3).map(renderCard)}
            </div>

            {/* Bottom Row: 2 Balanced Feature Cards Centered */}
            <div className={styles.cardsRowBottom}>
              {GALLERY_CARDS.slice(3, 5).map(renderCard)}
            </div>
          </div>

          {/* Bottom Footnote */}
          <div className={styles.frameFooter}>
            <span className={styles.footerNote}>
              Complimentary with every master cinema commission · Biometric facial indexing · Instant uncompressed 4K download
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
