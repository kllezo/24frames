"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./ClientGalleryExperience.module.css";

gsap.registerPlugin(ScrollTrigger);

interface GalleryExperienceItem {
  id: string;
  number: string;
  romanNumeral: string;
  categoryTag: string;
  title: string;
  headline: string;
  description: string;
  mediaImage: string;
  mediaBadge: string;
  mediaType: "ai-archive" | "cinema-room" | "heirloom-vault";
  actionLabel: string;
  actionUrl: string;
}

const GALLERY_EXPERIENCES: GalleryExperienceItem[] = [
  {
    id: "private-archive",
    number: "01",
    romanNumeral: "I",
    categoryTag: "FACIAL RECOGNITION & MOMENT DISCOVERY",
    title: "The Private Archive",
    headline: "AI-Powered Moment Discovery",
    description:
      "Intelligent facial recognition discreetly indexes thousands of high-resolution stills into effortless family collections, allowing couples and distinguished guests to uncover cherished candid memories in seconds.",
    mediaImage: "/images/stories/bellam-srikonda/IMG_6340.jpg",
    mediaBadge: "AI SMART FACIAL DETECTION · 1,400+ STILLS INDEXED",
    mediaType: "ai-archive",
    actionLabel: "Access Archival Vault",
    actionUrl: "/inquire",
  },
  {
    id: "cinema-room",
    number: "02",
    romanNumeral: "II",
    categoryTag: "PRIVATE 4K STREAMING THEATER",
    title: "The Cinema Room",
    headline: "Luxury 4K Screening Experience",
    description:
      "A bespoke screening room engineered for private home theaters and personal devices, delivering master wedding films, signature teasers, and vertical ceremony reels in uncompressed 4K optical fidelity.",
    mediaImage: "/videos/portfolio/vinitha-vivekananda/poster.jpg",
    mediaBadge: "4K DCI · THEATRICAL MASTER GRADE · 24 FPS",
    mediaType: "cinema-room",
    actionLabel: "Enter Screening Theater",
    actionUrl: "/disciplines/cinema",
  },
  {
    id: "heirloom-collection",
    number: "03",
    romanNumeral: "III",
    categoryTag: "GENERATIONAL HERITAGE PRESERVATION",
    title: "The Heirloom Collection",
    headline: "Generational Legacy Vault",
    description:
      "Master color-calibrated assets organized ritual-by-ritual into an enduring digital vault, tailored to safeguard family heritage, cultural traditions, and high-fidelity social celebrations across generations.",
    mediaImage: "/images/stories/sirish-and-harshitha/IMG_6346.jpg",
    mediaBadge: "CERTIFIED HEIRLOOM VAULT · LIFETIME PRESERVATION",
    mediaType: "heirloom-vault",
    actionLabel: "Explore Heritage Vault",
    actionUrl: "/stories",
  },
];

export default function ClientGalleryExperience() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  // Active card: default to Card 02 ("The Cinema Room" - the visual centerpiece)
  const [activeId, setActiveId] = useState<string>("cinema-room");

  /* ── GSAP Entrance Animation ── */
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
            duration: 0.9,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 78%",
              once: true,
            },
          }
        );
      }

      const cards = gsap.utils.toArray<HTMLElement>(`.${styles.folderCard}`);
      if (cards.length) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 36, scale: 0.97 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.75,
            stagger: 0.14,
            ease: "power3.out",
            scrollTrigger: {
              trigger: cardsContainerRef.current,
              start: "top 82%",
              once: true,
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
        {/* ── 1. EDITORIAL OPENING MOMENT ── */}
        <div ref={headerRef} className={styles.editorialHeader}>
          <div className={styles.chapterBadgeRow}>
            <span className={styles.antiqueGoldRule} aria-hidden="true" />
            <span className={styles.chapterMarker}>
              PRIVATE PALACE ARCHIVE · EXCLUSIVE CLIENT PORTAL
            </span>
            <span className={styles.antiqueGoldRule} aria-hidden="true" />
          </div>

          <h2 className={styles.editorialTitle}>
            THE 24 FRAMES CLIENT GALLERY EXPERIENCE
          </h2>

          <p className={styles.editorialSubtitle}>
            Each master commission is endowed with a private digital archive — an exquisite palace vault engineered to preserve, curate, and relive your family’s most sacred memories for generations.
          </p>
        </div>

        {/* ── 2. THREE ROYAL ARCHIVAL FOLDER CARDS (EXACT REFERENCE ANIMATION) ── */}
        <div ref={cardsContainerRef} className={styles.cardsGrid}>
          {GALLERY_EXPERIENCES.map((item) => {
            const isActive = activeId === item.id;

            return (
              <div
                key={item.id}
                className={`${styles.folderCard} ${isActive ? styles.folderCardActive : ""}`}
                onMouseEnter={() => setActiveId(item.id)}
                onPointerEnter={() => setActiveId(item.id)}
                onClick={() => setActiveId(item.id)}
                role="region"
                aria-label={`${item.title} — ${item.headline}`}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActiveId(item.id);
                  }
                }}
              >
                {/* ── LAYER 1: BACK MEDIA CANVAS (Revealed as flap slides down) ── */}
                <div className={styles.mediaCanvas}>
                  <img
                    src={item.mediaImage}
                    alt={item.title}
                    className={styles.mediaImg}
                    loading="lazy"
                  />
                  <div className={styles.mediaAtmosphere} />

                  {/* Curated Interactive Badges per Media Type */}
                  {item.mediaType === "ai-archive" && (
                    <div className={styles.aiDetectionOverlay}>
                      <div className={styles.faceTargetRing}>
                        <span className={styles.targetCornerTL} />
                        <span className={styles.targetCornerTR} />
                        <span className={styles.targetCornerBL} />
                        <span className={styles.targetCornerBR} />
                        <div className={styles.targetCenterDot} />
                      </div>
                      <div className={styles.aiTagPill}>
                        <span className={styles.aiTagDot} />
                        <span>SMART CURATION MATCH 99.4%</span>
                      </div>
                    </div>
                  )}

                  {item.mediaType === "cinema-room" && (
                    <div className={styles.cinemaPlayOverlay}>
                      <div className={styles.theatricalPlayBtn} aria-label="Play 4K preview">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <polygon points="6 3 20 12 6 21 6 3" />
                        </svg>
                      </div>
                      <div className={styles.theaterSpecsTag}>
                        <span>4K DCI · 24 FPS · DOLBY COLOR</span>
                      </div>
                    </div>
                  )}

                  {item.mediaType === "heirloom-vault" && (
                    <div className={styles.heirloomCrestOverlay}>
                      <div className={styles.heirloomSeal}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      </div>
                      <div className={styles.heirloomSealText}>
                        <span>GENERATIONAL HEIRLOOM GRADE</span>
                      </div>
                    </div>
                  )}

                  {/* Top Subtle Media Specification Badge */}
                  <div className={styles.mediaTopTagRow}>
                    <span className={styles.mediaSpecBadge}>{item.mediaBadge}</span>
                  </div>
                </div>

                {/* ── LAYER 2: SLIDING ARCHIVAL FOLDER FLAP WITH TAB ── */}
                <div
                  className={`${styles.slidingFlap} ${
                    isActive ? styles.slidingFlapDown : styles.slidingFlapUp
                  }`}
                >
                  {/* Distinctive Archival Folder Tab Ear on Left */}
                  <div className={styles.folderTabEar}>
                    <div className={styles.tabContentRow}>
                      <span className={styles.tabNumber}>{item.number}</span>
                      <span className={styles.tabArrow} aria-hidden="true">↗</span>
                    </div>
                  </div>

                  {/* Flap Body with Editorial Details */}
                  <div className={styles.flapBody}>
                    <div className={styles.flapEyebrowRow}>
                      <span className={styles.flapRomanNumeral}>{item.romanNumeral}</span>
                      <span className={styles.flapDotDivider}>·</span>
                      <span className={styles.flapCategoryTag}>{item.categoryTag}</span>
                    </div>

                    <h3 className={styles.flapTitle}>{item.title}</h3>
                    <h4 className={styles.flapHeadline}>{item.headline}</h4>

                    <p className={styles.flapDescription}>{item.description}</p>

                    <div className={styles.flapActionRow}>
                      <Link
                        href={item.actionUrl}
                        className={styles.flapActionBtn}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span>{item.actionLabel.toUpperCase()}</span>
                        <span className={styles.btnArrowIcon}>→</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── 3. BOTTOM SUBTLE EXCLUSIVITY FOOTNOTE ── */}
        <div className={styles.archiveFootnoteRow}>
          <span className={styles.footnoteText}>
            Delivered complimentary with every 24 Frames master cinema commission · Cloud-synced &amp; private
          </span>
        </div>
      </div>
    </section>
  );
}
