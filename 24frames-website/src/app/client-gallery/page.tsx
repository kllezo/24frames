"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import styles from "./ClientGallery.module.css";

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
  secondaryImage?: string;
  secondaryImageAlt?: string;
  layout: "media-left" | "media-right";
}

const SECTIONS_DATA: GallerySuiteSection[] = [
  {
    id: "private-archive",
    chapterNumber: "01",
    kicker: "INTELLIGENT CURATION · MOMENT DISCOVERY",
    title: "The Private Archive",
    tagline: "Instant facial indexing and private family discovery.",
    introduction:
      "A typical royal Telugu or destination Indian wedding produces thousands of irreplaceable exposures. The Private Archive uses non-invasive biometric moment indexing to organize every guest, ritual, and emotion without tedious manual sorting.",
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
    primaryImage: "/images/stories/hrithika-abhishek/IMG_6324.jpg",
    primaryImageAlt: "Sacred fire wedding moment indexed in Private Archive",
    secondaryImage: "/images/stories/hrithika-abhishek/IMG_6325.jpg",
    secondaryImageAlt: "Candid emotional wedding moment",
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
      "Chapters allow family members to jump directly to specific ceremonies — from the Mangalasnanam ritual bath to the electric choreography of the concert Sangeet stage.",
    ],
    keyCapabilities: [
      "Uncompressed master 4K high-bitrate streaming playback",
      "Interactive chapter markers for ceremony navigation",
      "Spatial sound design & original score playback",
      "Dedicated TV casting & offline cinema downloads",
    ],
    primaryImage: "/videos/portfolio/vinitha-vivekananda/poster.jpg",
    primaryImageAlt: "Vinitha and Vivekananda master wedding film poster",
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
      "Our editorial team hand-selects and color-grades a premier collection of vertical (9:16) and editorial (4:5) frames within hours of key events. Each portrait is balanced for mobile display color profiles, preserving natural skin tones and rich fabric hues.",
      "Ready for direct dispatch to high-fashion publications, editorial features, or private social feeds with zero compression degradation.",
    ],
    keyCapabilities: [
      "Fast-turnaround curated social preview selection",
      "Proportioned 9:16 and 4:5 native portrait aspect ratios",
      "Skin-tone calibrated color grading for mobile displays",
      "Seamless one-tap cloud sharing for wedding guests",
    ],
    primaryImage: "/images/stories/hrithika-abhishek/IMG_6334.jpg",
    primaryImageAlt: "Bridal couture signature portrait in crimson Kanjeevaram silk",
    secondaryImage: "/images/stories/hrithika-abhishek/IMG_6338.jpg",
    secondaryImageAlt: "Editorial couple portrait ready for social curation",
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
      "Revisit your Pellikuthuru, Haldi, Mehendi, Sacred Muhurtham, and Grand Reception as dedicated editorial essays. Each celebration features its own curated hero cover, time stamp, and visual rhythm.",
      "This architecture enables parents, siblings, and extended family to share and enjoy specific celebrations without scrolling through unrelated events.",
    ],
    keyCapabilities: [
      "Dedicated chapters for each individual wedding ceremony",
      "Curated editorial covers and ceremony narrative notes",
      "Shareable sub-gallery links for ceremony-specific guests",
      "Integrated timeline chronology from dawn rituals to midnight reception",
    ],
    primaryImage: "/images/stories/bellam-srikonda/IMG_6339.jpg",
    primaryImageAlt: "Celebrity wedding reception story cover",
    secondaryImage: "/images/stories/bellam-srikonda/IMG_6340.jpg",
    secondaryImageAlt: "High-octane Sangeet celebration story",
    layout: "media-right",
  },
  {
    id: "heirloom-collection",
    chapterNumber: "05",
    kicker: "ARCHIVAL VAULT · GENERATIONAL LEGACY",
    title: "The Heirloom Collection",
    tagline: "Digital longevity and physical hand-bound fine-art preservation.",
    introduction:
      "A photograph only truly fulfills its destiny when it survives to be held by children and grandchildren. The Heirloom Collection couples redundant cloud preservation with museum-grade physical volumes.",
    deepDescription: [
      "All master files are preserved across geographically distributed cold-storage archives, safeguarding your family heritage against device failures or format obsolescence.",
      "Complementing the digital suite, our physical albums are hand-bound in Florence, Italy, using archival pigment inks, heavyweight cotton rag paper, and full-grain Italian leather designed to endure for over a century.",
    ],
    keyCapabilities: [
      "Dual-region redundant archival cloud storage for master deliverables",
      "Bespoke Italian leather and Japanese silk hand-bound album design",
      "Archival 100% cotton rag paper with 100+ year pigment ink certification",
      "Permanent client access vault with generational transfer options",
    ],
    primaryImage: "/images/stories/sirish-and-harshitha/IMG_6346.jpg",
    primaryImageAlt: "Sacred traditional wedding legacy still",
    secondaryImage: "/images/stories/sirish-and-harshitha/IMG_6353.jpg",
    secondaryImageAlt: "Royal mandapam architectural heirloom",
    layout: "media-left",
  },
];

export default function ClientGalleryPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle direct hash navigation with smooth scroll accounting for fixed header
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
              <Link href="/" className={styles.breadcrumbHome}>← 24 FRAMES ARCHIVE</Link>
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
                    {/* Media Column */}
                    <div className={styles.mediaColumn}>
                      <div className={styles.primaryCanvas}>
                        <img
                          src={section.primaryImage}
                          alt={section.primaryImageAlt}
                          className={styles.primaryImg}
                          loading="lazy"
                        />
                        <div className={styles.imageScrim} />
                        <span className={styles.floatingChapterBadge}>
                          CHAPTER {section.chapterNumber}
                        </span>
                      </div>

                      {section.secondaryImage && (
                        <div className={styles.secondaryCanvas}>
                          <img
                            src={section.secondaryImage}
                            alt={section.secondaryImageAlt || section.title}
                            className={styles.secondaryImg}
                            loading="lazy"
                          />
                        </div>
                      )}
                    </div>

                    {/* Content Column */}
                    <div className={styles.contentColumn}>
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

                      {/* Key Capabilities Checklist */}
                      <div className={styles.capabilitiesCard}>
                        <h3 className={styles.capabilitiesHeading}>KEY ARCHIVAL CAPABILITIES</h3>
                        <ul className={styles.capabilitiesList}>
                          {section.keyCapabilities.map((cap, i) => (
                            <li key={i} className={styles.capabilityItem}>
                              <span className={styles.checkIcon} aria-hidden="true">✓</span>
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

      <Footer />
    </>
  );
}
