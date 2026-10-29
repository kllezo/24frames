"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { useScrollLock } from "@/lib/scrollLock";
import styles from "./ClientGallery.module.css";

const CLIENT_GALLERY_POEMS = [
  {
    chapter: "Chapter I · The Discovery",
    poem: "Opening your private vault is like stepping back into the exact warmth of that morning.",
  },
  {
    chapter: "Chapter II · Living Heritage",
    poem: "Some traditions are not merely observed. They are felt in the pulse of generations.",
  },
  {
    chapter: "Chapter III · The Unguarded Moment",
    poem: "The laughter between planned portraits is the frame your grandchildren will treasure most.",
  },
  {
    chapter: "Chapter IV · Optical Movement",
    poem: "Light becomes memory. Movement becomes legacy.",
  },
  {
    chapter: "Chapter V · Generational Vault",
    poem: "Preserved in uncompressed cinema fidelity, held safely for lifetimes to come.",
  },
];

export interface GallerySuiteSection {
  id: string;
  chapterNumber: string;
  kicker: string;
  title: string;
  tagline: string;
  introduction: string;
  deepDescription: string[];
  keyCapabilities: string[];
  primaryImage: string;
  primaryImageAlt: string;
  primaryAspect: string;
  primaryFit: "contain" | "cover";
  secondaryImage?: string;
  secondaryImageAlt?: string;
  secondaryAspect?: string;
  secondaryFit?: "contain" | "cover";
  layout: "media-left" | "media-right";
}

const SECTIONS_DATA: GallerySuiteSection[] = [
  {
    id: "private-archive",
    chapterNumber: "01",
    kicker: "INTELLIGENT CURATION · MOMENT DISCOVERY",
    title: "The Private Archive",
    tagline: "Instant facial indexing, guest tagging, and private family vaults.",
    introduction:
      "A grand wedding produces thousands of irreplaceable exposures. The Private Archive uses non-invasive moment indexing and facial recognition to organize every guest, ritual, and emotion into beautifully structured family albums.",
    deepDescription: [
      "Guests and immediate family members can effortlessly find their private portraits across multi-day celebrations by indexing their portrait once, eliminating the struggle of searching through raw hard drives or generic gallery links.",
      "Every frame retains its uncompressed optical fidelity, master camera metadata, and natural cinematic color grading, allowing instantaneous high-resolution downloads for personal printing or archival storage.",
    ],
    keyCapabilities: [
      "Biometric facial recognition indexing for family & guests",
      "Event-wide search by person, ceremony, or mood",
      "Instant full-resolution RAW & JPEG downloads",
      "Private pin-protected client access vaults",
    ],
    primaryImage: "/images/gallery-experience/the-private-archive-primary.png",
    primaryImageAlt: "The Private Archive interface displaying facial recognition moment discovery and client family albums",
    primaryAspect: "968 / 1138",
    primaryFit: "contain",
    secondaryImage: "/images/gallery-experience/the-private-archive-secondary.png",
    secondaryImageAlt: "Private archive digital client vault browsing interface with family search",
    secondaryAspect: "992 / 1552",
    secondaryFit: "contain",
    layout: "media-left",
  },
  {
    id: "cinema-room",
    chapterNumber: "02",
    kicker: "MASTER CINEMA SUITE · PRIVATE PLAYBACK",
    title: "The Cinema Room",
    tagline: "A private screening theater engineered for cinematic master films.",
    introduction:
      "Captured on optical cinema primes, anamorphic glass, and 12-bit cinema sensors, our wedding films are intended to be experienced as feature motion pictures, not compressed social media clips.",
    deepDescription: [
      "The Cinema Room provides a high-bitrate streaming environment calibrated for OLED televisions, tablets, and desktop displays. Watch your full-length feature film, ceremony highlights, and teaser reels in uncompromised color and dynamic range.",
      "Interactive chapter markers allow family members to jump directly to specific ceremonies — from the sacred Mangalasnanam ritual bath to the electric choreography of the concert Sangeet stage.",
    ],
    keyCapabilities: [
      "Uncompressed master 4K high-bitrate streaming playback",
      "Interactive chapter markers for ceremony navigation",
      "Spatial sound design & original orchestral score playback",
      "Dedicated TV casting & offline cinema downloads",
    ],
    primaryImage: "/videos/portfolio/vinitha-vivekananda/poster.jpg",
    primaryImageAlt: "Vinitha and Vivekananda master 4K theatrical wedding film screening",
    primaryAspect: "16 / 9",
    primaryFit: "cover",
    secondaryImage: "/images/disciplines/cinema/IMG_6471.jpg",
    secondaryImageAlt: "Anamorphic master cinema frame captured on 2.39:1 scope",
    secondaryAspect: "16 / 9",
    secondaryFit: "cover",
    layout: "media-right",
  },
  {
    id: "signature-shots",
    chapterNumber: "03",
    kicker: "SOCIAL CURATION · COLOR-CALIBRATED STILLS",
    title: "Instagram-Ready Signature Shots",
    tagline: "Art-directed portraiture and candid highlights proportioned for modern curation.",
    introduction:
      "While full wedding galleries demand weeks of rigorous color science, couples and families cherish immediate, impeccably finished signature stills to commemorate their union with the world.",
    deepDescription: [
      "Our editorial team hand-selects and color-grades a premier collection of vertical (4:5 and 9:16) frames within hours of key events. Each portrait is balanced for mobile display color profiles, preserving natural skin tones, intricate temple jewellery, and rich silk hues.",
      "Every frame preserves the complete subject—from head to bridal attire—ready for direct dispatch to high-fashion publications, editorial features, or private social feeds with zero compression degradation.",
    ],
    keyCapabilities: [
      "Fast-turnaround curated social preview selection",
      "Proportioned 4:5 and 9:16 native portrait aspect ratios preserving full head & jewellery",
      "Skin-tone calibrated color grading for mobile OLED displays",
      "Seamless one-tap cloud sharing for wedding guests",
    ],
    primaryImage: "/images/gallery-experience/instagram-ready-shots-primary.jpg",
    primaryImageAlt: "Bridal couture signature portrait in crimson Kanjeevaram silk with temple gold jewellery, complete composition",
    primaryAspect: "1050 / 1415",
    primaryFit: "contain",
    secondaryImage: "/images/gallery-experience/instagram-ready-shots-secondary.jpg",
    secondaryImageAlt: "Intimate royal couple portrait ready for editorial curation, full head and attire preserved",
    secondaryAspect: "1168 / 1736",
    secondaryFit: "contain",
    layout: "media-left",
  },
  {
    id: "event-stories",
    chapterNumber: "04",
    kicker: "CHRONOLOGICAL ANTHOLOGY · SACRED CEREMONIES",
    title: "Event-Wise Photo Stories",
    tagline: "Sacred ceremonies and rituals structured in their natural emotional sequence.",
    introduction:
      "Indian weddings are not isolated photo sessions; they are emotional epics that unfold across multiple days, sacred traditions, and monumental environments. Event-Wise Photo Stories arranges each chapter with curatorial care.",
    deepDescription: [
      "Revisit your Pellikuthuru, Haldi, Mehendi, Sacred Muhurtham, and Grand Reception as dedicated editorial chapters. Each celebration features its own curated hero cover, timestamp, and visual rhythm.",
      "This architecture enables parents, siblings, and extended family to share and enjoy specific celebrations without scrolling through unrelated events.",
    ],
    keyCapabilities: [
      "Dedicated chapters for each individual wedding ceremony",
      "Curated editorial covers and ceremony narrative notes",
      "Shareable sub-gallery links for ceremony-specific guests",
      "Integrated timeline chronology from dawn rituals to midnight reception",
    ],
    primaryImage: "/images/gallery-experience/event-wise-photos-primary.png",
    primaryImageAlt: "Event-wise photo stories organized chronologically into Pellikuthuru, Mehendi, Sangeet, Muhurtham, and Reception",
    primaryAspect: "1014 / 1512",
    primaryFit: "contain",
    secondaryImage: "/images/gallery-experience/event-wise-photos-secondary.jpg",
    secondaryImageAlt: "Authentic ceremony moment captured during sacred wedding rituals",
    secondaryAspect: "1170 / 1747",
    secondaryFit: "contain",
    layout: "media-right",
  },
  {
    id: "heirloom-collection",
    chapterNumber: "05",
    kicker: "ARCHIVAL VAULT · GENERATIONAL LEGACY",
    title: "The Heirloom Collection",
    tagline: "Digital longevity and physical hand-bound fine-art preservation.",
    introduction:
      "Beyond digital galleries, true visual legacies belong in physical heirlooms that can be held, cherished, and passed down across generations.",
    deepDescription: [
      "Handcrafted in Italy and Japan with archival fine-art cotton rag paper, custom debossed leather, and museum-grade pigment inks guaranteed to resist fading for over two centuries.",
      "Every heirloom book is custom-designed by our senior art directors, balancing monumental double-page spreads with intimate details of your sacred union.",
    ],
    keyCapabilities: [
      "Museum-grade cotton rag fine-art papers (200+ year archival guarantee)",
      "Bespoke hand-bound Italian leather & Japanese silk covers",
      "Custom velvet presentation boxes with metallic hot-stamped typography",
      "Lifetime digital vault redundancy across global cloud storage",
    ],
    primaryImage: "/images/gallery-experience/heirloom-collection-primary.png",
    primaryImageAlt: "Custom velvet presentation box with hand-bound fine-art heirloom wedding album and debossed gold typography",
    primaryAspect: "900 / 852",
    primaryFit: "contain",
    secondaryImage: "/images/gallery-experience/heirloom-collection-secondary.png",
    secondaryImageAlt: "Fine-art bookbinding and archival photographic spread detail",
    secondaryAspect: "432 / 670",
    secondaryFit: "contain",
    layout: "media-left",
  },
];

interface LightboxItem {
  src: string;
  alt: string;
  title: string;
  caption: string;
}

export default function ClientGalleryPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeLightbox, setActiveLightbox] = useState<LightboxItem | null>(null);

  const handleCloseLightbox = useCallback(() => {
    setActiveLightbox(null);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleCloseLightbox();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleCloseLightbox]);

  // Lock body & Lenis scrolling when lightbox modal is open
  useScrollLock(activeLightbox !== null);

  // Support direct hash jumps from the homepage cards smoothly
  useEffect(() => {
    if (typeof window === "undefined") return;

    const hash = window.location.hash;
    if (hash) {
      const targetId = hash.replace("#", "");
      const elem = document.getElementById(targetId);
      if (elem) {
        setTimeout(() => {
          elem.scrollIntoView({ behavior: "smooth" });
        }, 300);
      }
    }
  }, []);

  return (
    <>
      <Navigation />

      <main className={styles.clientGalleryMain}>
        {/* Top Breadcrumb & Hero Masthead */}
        <header className={styles.pageHeader}>
          <div className={styles.headerContainer}>
            <div className={styles.breadcrumbRow}>
              <Link href="/" className={styles.breadcrumbHome}>
                ← 24 FRAMES ARCHIVE
              </Link>
              <span className={styles.breadcrumbSlash}>/</span>
              <span className={styles.breadcrumbCurrent}>CLIENT GALLERY EXPERIENCE</span>
            </div>

            <span className={styles.kicker}>THE ROYAL CLIENT SUITE</span>
            <h1 className={styles.pageMainTitle}>
              Curated for Generations to Come.
            </h1>
            <p className={styles.pageSubtitle}>
              Explore the five pillars of the 24 Frames Client Gallery Experience — an uncompromising digital palace vault designed to preserve, organize, and present your family’s most sacred celebrations.
            </p>

            {/* Quick Navigation Anchor Bar */}
            <nav className={styles.quickAnchorBar} aria-label="Quick jump to feature">
              {SECTIONS_DATA.map((sec) => (
                <a key={sec.id} href={`#${sec.id}`} className={styles.anchorPill}>
                  <span className={styles.anchorNum}>{sec.chapterNumber}</span>
                  <span className={styles.anchorLabel}>{sec.title}</span>
                </a>
              ))}
            </nav>
          </div>
        </header>

        {/* ── 5 DISTINCT VERTICALLY ARRANGED FEATURE SECTIONS ── */}
        <div ref={containerRef} className={styles.sectionsContainer}>
          {SECTIONS_DATA.map((section, idx) => {
            const isMediaLeft = section.layout === "media-left";

            return (
              <section
                key={section.id}
                id={section.id}
                className={`${styles.featureSection} ${
                  idx % 2 === 1 ? styles.featureSectionAlt : ""
                }`}
                aria-labelledby={`${section.id}-heading`}
              >
                <div className={styles.sectionInner}>
                  <div
                    className={`${styles.featureGrid} ${
                      isMediaLeft ? styles.gridMediaLeft : styles.gridMediaRight
                    }`}
                  >
                    {/* Media Column with Adaptive Aspect Ratios */}
                    <div className={styles.mediaColumn}>
                      {/* Primary Canvas */}
                      <div
                        className={styles.primaryCanvas}
                        style={{ aspectRatio: section.primaryAspect }}
                        onClick={() =>
                          setActiveLightbox({
                            src: section.primaryImage,
                            alt: section.primaryImageAlt,
                            title: section.title,
                            caption: section.tagline,
                          })
                        }
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setActiveLightbox({
                              src: section.primaryImage,
                              alt: section.primaryImageAlt,
                              title: section.title,
                              caption: section.tagline,
                            });
                          }
                        }}
                        aria-label={`View full frame: ${section.title}`}
                      >
                        <img
                          src={section.primaryImage}
                          alt={section.primaryImageAlt}
                          className={styles.primaryImg}
                          style={{ objectFit: section.primaryFit }}
                          loading="lazy"
                        />
                        <div className={styles.imageScrim} />
                        <span className={styles.floatingChapterBadge}>
                          CHAPTER {section.chapterNumber}
                        </span>
                        <span className={styles.expandPill} aria-hidden="true">
                          EXPAND ↗
                        </span>
                      </div>

                      {/* Secondary Canvas */}
                      {section.secondaryImage && (
                        <div
                          className={styles.secondaryCanvas}
                          style={{ aspectRatio: section.secondaryAspect || "3 / 4" }}
                          onClick={() =>
                            setActiveLightbox({
                              src: section.secondaryImage!,
                              alt: section.secondaryImageAlt || section.title,
                              title: `${section.title} · Detail View`,
                              caption: section.tagline,
                            })
                          }
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              setActiveLightbox({
                                src: section.secondaryImage!,
                                alt: section.secondaryImageAlt || section.title,
                                title: `${section.title} · Detail View`,
                                caption: section.tagline,
                              });
                            }
                          }}
                          aria-label={`View detail frame: ${section.title}`}
                        >
                          <img
                            src={section.secondaryImage}
                            alt={section.secondaryImageAlt || section.title}
                            className={styles.secondaryImg}
                            style={{ objectFit: section.secondaryFit || "contain" }}
                            loading="lazy"
                          />
                          <span className={styles.expandPill} aria-hidden="true">
                            EXPAND ↗
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content Column */}
                    <div className={styles.contentColumn}>
                      {/* Organic Discovered Thought in Whitespace — Section 0 only */}
                      {idx === 0 && (
                        <div className={styles.sectionPoemNote}>
                          <span className={styles.sectionPoemChapter}>
                            {CLIENT_GALLERY_POEMS[0].chapter}
                          </span>
                          <p className={styles.sectionPoemText}>
                            “{CLIENT_GALLERY_POEMS[0].poem}”
                          </p>
                        </div>
                      )}

                      <div className={styles.chapterBadgeLine}>
                        <span className={styles.goldLine} />
                        <span className={styles.sectionKicker}>{section.kicker}</span>
                      </div>

                      <h2 id={`${section.id}-heading`} className={styles.sectionTitle}>
                        {section.title}
                      </h2>

                      <p className={styles.sectionTagline}>{section.tagline}</p>

                      <p className={styles.sectionIntroduction}>{section.introduction}</p>

                      <div className={styles.paragraphsBlock}>
                        {section.deepDescription.map((p, i) => (
                          <p key={i} className={styles.deepParagraph}>
                            {p}
                          </p>
                        ))}
                      </div>

                      {/* Varied Natural Quote Placement — Section 3 after deep description */}
                      {idx === 3 && (
                        <div className={styles.sectionPoemNote} style={{ marginTop: '1.25rem', marginBottom: '1.5rem' }}>
                          <span className={styles.sectionPoemChapter}>
                            {CLIENT_GALLERY_POEMS[3 % CLIENT_GALLERY_POEMS.length].chapter}
                          </span>
                          <p className={styles.sectionPoemText}>
                            “{CLIENT_GALLERY_POEMS[3 % CLIENT_GALLERY_POEMS.length].poem}”
                          </p>
                        </div>
                      )}

                      {/* Key Capabilities Checklist */}
                      <div className={styles.capabilitiesCard}>
                        <h3 className={styles.capabilitiesHeading}>KEY ARCHIVAL CAPABILITIES</h3>
                        <ul className={styles.capabilitiesList}>
                          {section.keyCapabilities.map((cap, i) => (
                            <li key={i} className={styles.capabilityItem}>
                              <span className={styles.checkIcon} aria-hidden="true">
                                ✓
                              </span>
                              <span>{cap}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className={styles.ctaRow}>
                        <Link href="/inquire" className={styles.commissionBtn}>
                          <span>COMMISSION YOUR STORY</span>
                          <span className={styles.btnArrow}>→</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            );
          })}
        </div>

        {/* Closing Invitation Band */}
        <section className={styles.closingBand} aria-label="Begin your wedding inquiry">
          <div className={styles.closingInner}>
            <span className={styles.closingKicker}>BEGIN YOUR EXPERIENCE</span>
            <h2 className={styles.closingTitle}>Ready to commission your visual legacy?</h2>
            <p className={styles.closingText}>
              Every commission begins with a conversation. Tell us your date, destination, and the moments you wish to remember.
            </p>
            <Link href="/inquire" className={styles.closingCtaBtn}>
              <span>ENTER THE COMMISSION ATELIER</span>
              <span className={styles.btnArrow}>→</span>
            </Link>
          </div>
        </section>
      </main>

      {/* ── FULL-SCREEN LIGHTBOX MODAL ── */}
      {activeLightbox && (
        <div
          className={styles.modalBackdrop}
          onClick={handleCloseLightbox}
          role="dialog"
          aria-modal="true"
          aria-label={`Exhibition viewer: ${activeLightbox.title}`}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <div className={styles.modalTitleBlock}>
                <span className={styles.modalBadge}>ARCHIVE EXHIBITION</span>
                <h3 className={styles.modalHeading}>{activeLightbox.title}</h3>
              </div>
              <button
                className={styles.modalCloseBtn}
                onClick={handleCloseLightbox}
                aria-label="Close exhibition viewer (Escape)"
              >
                ✕
              </button>
            </div>

            <div className={styles.modalImageViewport}>
              <img
                src={activeLightbox.src}
                alt={activeLightbox.alt}
                className={styles.modalImg}
              />
            </div>

            <div className={styles.modalFooter}>
              <p className={styles.modalCaption}>{activeLightbox.caption}</p>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}