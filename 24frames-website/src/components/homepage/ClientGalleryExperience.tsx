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
  theme: "ivory" | "green";
  fillColor: string;
  textColor: string;
  descColor: string;
  borderColor: string;
  btnBorder: string;
  btnColor: string;
  origin?: string;
  objectPosition?: string;
  objectFit?: "cover" | "contain";
}

export const CLIENT_GALLERY_FEATURES: GalleryCardItem[] = [
  {
    id: "private-archive",
    hash: "private-archive",
    number: "01",
    title: "The Private Archive",
    description: "AI-assisted facial indexing and moment discovery, categorizing thousands of memories effortlessly.",
    artImage: "/images/gallery-experience/the-private-archive-primary.png",
    artAlt: "Private archive facial indexing interface and moment discovery albums",
    href: "/client-gallery#private-archive",
    theme: "ivory",
    fillColor: "#FBF8F2",
    textColor: "#09453E",
    descColor: "#4D5450",
    borderColor: "rgba(9, 69, 62, 0.12)",
    btnBorder: "rgba(9, 69, 62, 0.25)",
    btnColor: "#09453E",
    origin: "20% bottom",
    objectPosition: "center 20%",
    objectFit: "cover",
  },
  {
    id: "cinema-room",
    hash: "cinema-room",
    number: "02",
    title: "The Cinema Room",
    description: "Private cinematic streaming theater presenting master films, ceremony edits, and more.",
    artImage: "/images/gallery-experience/cinema-room-primary.jpg",
    artAlt: "Dramatic sunset silhouette portrait of wedding couple embracing through palace triple arches",
    href: "/client-gallery#cinema-room",
    theme: "green",
    fillColor: "#09453E",
    textColor: "#FAF8F2",
    descColor: "#C5D1CB",
    borderColor: "rgba(255, 255, 255, 0.12)",
    btnBorder: "rgba(255, 255, 255, 0.3)",
    btnColor: "#FAF8F2",
    origin: "38% bottom",
    objectPosition: "center 38%",
    objectFit: "cover",
  },
  {
    id: "signature-shots",
    hash: "signature-shots",
    number: "03",
    title: "Instagram-Ready Signature Shots",
    description: "Curated, color-calibrated portraits and candids individually proportioned for social media.",
    artImage: "/images/gallery-experience/instagram-ready-shots-primary.jpg",
    artAlt: "Color-calibrated bridal portrait in crimson silk with complete head and temple jewellery preserved",
    href: "/client-gallery#signature-shots",
    theme: "ivory",
    fillColor: "#FBF8F2",
    textColor: "#09453E",
    descColor: "#4D5450",
    borderColor: "rgba(9, 69, 62, 0.12)",
    btnBorder: "rgba(9, 69, 62, 0.25)",
    btnColor: "#09453E",
    origin: "50% bottom",
    objectPosition: "center 12%",
    objectFit: "cover",
  },
  {
    id: "event-stories",
    hash: "event-stories",
    number: "04",
    title: "Event-Wise Photo Stories",
    description: "Chronological ceremony chapters organizing your journey from rituals to reception.",
    artImage: "/images/gallery-experience/event-wise-photos-primary.png",
    artAlt: "Event-wise photo stories organized chronologically by ritual chapters",
    href: "/client-gallery#event-stories",
    theme: "green",
    fillColor: "#09453E",
    textColor: "#FAF8F2",
    descColor: "#C5D1CB",
    borderColor: "rgba(255, 255, 255, 0.12)",
    btnBorder: "rgba(255, 255, 255, 0.3)",
    btnColor: "#FAF8F2",
    origin: "62% bottom",
    objectPosition: "center 15%",
    objectFit: "cover",
  },
  {
    id: "heirloom-collection",
    hash: "heirloom-collection",
    number: "05",
    title: "The Heirloom Collection",
    description: "Long-term archival preservation safeguarding family heirlooms, albums, and legacy stories.",
    artImage: "/images/gallery-experience/heirloom-collection-primary.png",
    artAlt: "Generational wedding album and heirloom preservation archive",
    href: "/client-gallery#heirloom-collection",
    theme: "ivory",
    fillColor: "#FBF8F2",
    textColor: "#09453E",
    descColor: "#4D5450",
    borderColor: "rgba(9, 69, 62, 0.12)",
    btnBorder: "rgba(9, 69, 62, 0.25)",
    btnColor: "#09453E",
    origin: "80% bottom",
    objectPosition: "center 35%",
    objectFit: "cover",
  },
];

interface ClientGalleryExperienceProps {
  showSubFooter?: boolean;
}

export default function ClientGalleryExperience({
  showSubFooter = false,
}: ClientGalleryExperienceProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const isTouchRef = useRef(false);

  // Close open folder when tapping outside on touch/mobile devices
  useEffect(() => {
    if (!activeCardId) return;
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (gridRef.current && !gridRef.current.contains(e.target as Node)) {
        setActiveCardId(null);
      }
    };
    document.addEventListener("pointerdown", handleOutsideClick);
    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
    };
  }, [activeCardId]);

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

  const handlePointerEnter = (id: string, e: React.PointerEvent) => {
    if (e.pointerType === "touch") {
      isTouchRef.current = true;
      return;
    }
    isTouchRef.current = false;
    setActiveCardId(id);
  };

  const handlePointerLeave = () => {
    if (!isTouchRef.current) {
      setActiveCardId(null);
    }
  };

  const handleCardClick = (e: React.MouseEvent, href: string, id: string) => {
    const isTouch =
      isTouchRef.current ||
      (typeof window !== "undefined" && window.innerWidth <= 820);

    if (isTouch) {
      if (activeCardId !== id) {
        // First tap anywhere on a folder card: smoothly open folder and pop photograph outward
        e.preventDefault();
        e.stopPropagation();
        setActiveCardId(id);
        return;
      }
      // Second tap on the open card/photograph/arrow: navigate to destination
      return;
    }
    // Desktop: normal click-to-navigate
  };

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
            <span className={styles.cursiveSubtitleNote}>for the years still to come</span>
          </p>
        </div>

        {/* ── 2. FIVE SCULPTED ARCHIVAL FOLDERS IN A SINGLE ROW ── */}
        <div ref={gridRef} className={styles.cardsShowcaseWrapper}>
          <div
            className={styles.cardsGrid}
            role="list"
          >
            {CLIENT_GALLERY_FEATURES.map((item) => {
              const themeClass = styles[`card_${item.theme}`] || "";
              const isOpen = activeCardId === item.id;

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`${styles.card} ${themeClass} ${isOpen ? styles.cardOpen : ""}`}
                  aria-label={`${item.number} ${item.title} — Click to view section`}
                  aria-expanded={isOpen}
                  onPointerEnter={(e) => handlePointerEnter(item.id, e)}
                  onPointerLeave={handlePointerLeave}
                  onClick={(e) => handleCardClick(e, item.href, item.id)}
                  onFocus={() => setActiveCardId(item.id)}
                  onBlur={() => setActiveCardId(null)}
                >
                  {/* Layer 1: Back Photographic Canvas (Revealed vertically as cover compresses) */}
                  <div className={styles.cardPhotoArea}>
                    <img
                      src={item.artImage}
                      alt={item.artAlt}
                      className={styles.cardPhotoImg}
                      style={{
                        objectPosition: item.objectPosition,
                        objectFit: item.objectFit || "cover",
                      }}
                      loading="lazy"
                    />
                    <div className={styles.photoVignette} aria-hidden="true" />

                    {/* Elegant close (×) button on revealed photograph for mobile touch */}
                    {isOpen && (
                      <span
                        role="button"
                        tabIndex={0}
                        aria-label={`Close ${item.title} folder`}
                        className={styles.closeFolderBtn}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setActiveCardId(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            e.stopPropagation();
                            setActiveCardId(null);
                          }
                        }}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          width="14"
                          height="14"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          fill="none"
                          aria-hidden="true"
                        >
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </span>
                    )}
                  </div>

                  {/* Layer 2: Front Stepped Archival Folder Cover (Compresses vertically upward to 15-20%) */}
                  <div
                    className={styles.folderCover}
                    style={{
                      backgroundColor: item.fillColor,
                    }}
                  >
                    {/* Stepped Tab Header (Remains visible as the top 15-20% strip) */}
                    <div className={styles.folderTabHeader}>
                      <div className={styles.folderBrandBlock}>
                        <span
                          className={styles.folderFounderName}
                          style={{ color: item.textColor }}
                        >
                          PHANI GOGIREDDY
                        </span>
                        <span
                          className={styles.folderBrandName}
                          style={{ color: item.textColor }}
                        >
                          24 FRAMES
                        </span>
                      </div>
                      <span
                        className={styles.folderDiagonalArrow}
                        style={{ color: item.textColor }}
                        aria-hidden="true"
                      >
                        ↗
                      </span>
                    </div>

                    {/* Folder Body Content (Smoothly fades out during vertical compression) */}
                    <div className={styles.folderBody}>
                      <div
                        className={styles.folderNumber}
                        style={{ color: item.textColor }}
                      >
                        {item.number}
                      </div>

                      <h3
                        className={styles.folderTitle}
                        style={{ color: item.textColor }}
                      >
                        {item.title}
                      </h3>

                      <p
                        className={styles.folderDesc}
                        style={{ color: item.descColor }}
                      >
                        {item.description}
                      </p>

                      {/* Circular Action Arrow Bottom-Right */}
                      <div
                        className={styles.folderCircleBtn}
                        style={{
                          borderColor: item.btnBorder,
                          color: item.btnColor,
                        }}
                        aria-hidden="true"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className={styles.folderCircleIcon}
                        >
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Bottom Clarifying Editorial Bar */}
          <div className={styles.footnoteRow}>
            <span className={styles.footnoteText}>
              Included with all master commissions · Facial recognition indexing · Private 4K cinematic streaming · Archival storage · Secure access
            </span>
            <Link href="/client-gallery" className={styles.suiteExploreLink}>
              <span>EXPLORE COMPLETE SUITE</span>
              <span className={styles.suiteCircleBtn} aria-hidden="true">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </span>
            </Link>
          </div>
        </div>

        {/* ── 3. REFINED BRAND CREST DIVIDER & SUB-FOOTER LINE MATCHING REFERENCE ── */}
        {showSubFooter && (
          <>
            <div className={styles.brandCrestDivider} aria-hidden="true">
              <span className={styles.crestLine} />
              <div className={styles.crestCenter}>
                <span className={styles.compassStar}>✦</span>
                <span className={styles.crestText}>PEOPLE · FILMS · LEGACIES</span>
              </div>
              <span className={styles.crestLine} />
            </div>

            <div className={styles.subFooterBar}>
              <p className={styles.subFooterCopyright}>
                © {new Date().getFullYear()} 24 Frames Photography &amp; Cinema. All rights reserved.
              </p>

              <div className={styles.subFooterNav}>
                <Link href="/client-gallery" className={styles.subFooterLink}>
                  Client Archive
                </Link>
                <span className={styles.subFooterDot}>·</span>
                <Link href="/inquire" className={styles.subFooterLink}>
                  Commence Dialogue
                </Link>
              </div>

              <div className={styles.subFooterSocials}>
                <a
                  href="https://www.instagram.com/24framesphotography_official/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialIconBtn}
                  aria-label="Instagram"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={styles.socialSvg}>
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
                <a
                  href="https://youtube.com/@24framesphotography"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialIconBtn}
                  aria-label="YouTube"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={styles.socialSvg}>
                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
                  </svg>
                </a>
                <a
                  href="https://wa.me/919014433074"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialIconBtn}
                  aria-label="WhatsApp"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={styles.socialSvg}>
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg>
                </a>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
