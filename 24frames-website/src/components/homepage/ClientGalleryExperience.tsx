"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./ClientGalleryExperience.module.css";

gsap.registerPlugin(ScrollTrigger);

export interface GalleryCardItem {
  id: string;
  hash: string;
  number: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  href: string;
}

export const CLIENT_GALLERY_FEATURES: GalleryCardItem[] = [
  {
    id: "private-archive",
    hash: "private-archive",
    number: "01",
    title: "The Private Archive",
    description: "AI-assisted facial indexing and moment discovery, categorizing thousands of frames into family albums.",
    image: "/images/stories/hrithika-abhishek/IMG_6324.jpg",
    imageAlt: "Intelligent facial recognition moment discovery archive",
    href: "/client-gallery#private-archive",
  },
  {
    id: "cinema-room",
    hash: "cinema-room",
    number: "02",
    title: "The Cinema Room",
    description: "Private cinematic streaming theater presenting master films, ceremony teasers, and vertical cuts.",
    image: "/videos/portfolio/vinitha-vivekananda/poster.jpg",
    imageAlt: "Private cinema playback theater for master wedding films",
    href: "/client-gallery#cinema-room",
  },
  {
    id: "signature-shots",
    hash: "signature-shots",
    number: "03",
    title: "Instagram-Ready Signature Shots",
    description: "Curated, color-calibrated portraits and candids individually proportioned for social sharing.",
    image: "/images/stories/hrithika-abhishek/IMG_6334.jpg",
    imageAlt: "High-fidelity color-calibrated portrait ready for social curation",
    href: "/client-gallery#signature-shots",
  },
  {
    id: "event-stories",
    hash: "event-stories",
    number: "04",
    title: "Event-Wise Photo Stories",
    description: "Chronological ceremony chapters organizing your journey from Pellikuthuru to the grand reception.",
    image: "/images/stories/bellam-srikonda/IMG_6339.jpg",
    imageAlt: "Chronological event-wise ritual organization and timeline",
    href: "/client-gallery#event-stories",
  },
  {
    id: "heirloom-collection",
    hash: "heirloom-collection",
    number: "05",
    title: "The Heirloom Collection",
    description: "Long-term archival preservation safeguarding family heirlooms, albums, and generational cinema.",
    image: "/images/stories/sirish-and-harshitha/IMG_6346.jpg",
    imageAlt: "Archival generational family preservation vault",
    href: "/client-gallery#heirloom-collection",
  },
];

export default function ClientGalleryExperience() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

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

        {/* ── 2. FIVE CARDS IN A SINGLE HORIZONTAL ROW (IVORY & FOREST GREEN) ── */}
        <div ref={gridRef} className={styles.cardsShowcaseWrapper}>
          <div className={styles.cardsGrid} role="list">
            {CLIENT_GALLERY_FEATURES.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={styles.card}
                role="listitem"
                aria-label={`${item.number} ${item.title} — Click to view section`}
              >
                {/* Visual Image Header */}
                <div className={styles.imageCanvas}>
                  <img
                    src={item.image}
                    alt={item.imageAlt}
                    className={styles.cardCoverImg}
                    loading="lazy"
                  />
                  <div className={styles.imageOverlay} />
                  <span className={styles.cardIndexBadge}>{item.number}</span>
                </div>

                {/* Editorial Typography Body */}
                <div className={styles.cardBody}>
                  <div className={styles.cardMetaRow}>
                    <span className={styles.exploreTag}>EXPLORE FEATURE</span>
                    <span className={styles.cardArrow} aria-hidden="true">↗</span>
                  </div>

                  <h3 className={styles.cardTitle}>{item.title}</h3>
                  <p className={styles.cardDescription}>{item.description}</p>
                </div>
              </Link>
            ))}
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
