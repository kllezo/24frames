"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./FounderRecognitionSection.module.css";

gsap.registerPlugin(ScrollTrigger);

/* ── Verified Honours, Editorial Features & Manufacturer Distinctions ── */
export interface VerifiedRecognition {
  id: string;
  badgeLabel: string;
  milestoneTitle: string;
  conferringBody: string;
  year: string;
  category: string;
  citation: string;
  summary: string;
  imageSrc: string;
  imageAlt: string;
  sourceUrl: string;
  sourceLabel: string;
}

export const VERIFIED_RECOGNITIONS: VerifiedRecognition[] = [
  {
    id: "et-excellence-2025",
    badgeLabel: "JURIED INDUSTRY AWARD",
    milestoneTitle: "ET Excellence Award 2025",
    conferringBody: "The Times of India / ET Now · Conferred by Dia Mirza",
    year: "2025",
    category: "Luxury Wedding Cinematography",
    citation: "Excellence in Luxury Wedding Photography & Cinematic Storytelling",
    summary:
      "Conferred at Novotel HICC, Hyderabad before industry leaders and media dignitaries. Presented by Bollywood icon and UN Goodwill Ambassador Dia Mirza. Awarded for defining high-production cinematic storytelling and cultural preservation in luxury South Indian weddings.",
    imageSrc: "/assets/artist/recognition/et-excellence-award-2025.jpg",
    imageAlt: "Phani Gogireddy receiving the ET Excellence Award 2025 with framed citation and trophy on TV9 Telugu",
    sourceUrl: "https://www.youtube.com/shorts/Lh45ZBRJ1b8",
    sourceLabel: "Watch Award Ceremony Film →",
  },
  {
    id: "nikon-creator-2023",
    badgeLabel: "MANUFACTURER PARTNERSHIP",
    milestoneTitle: "Official Nikon India Creator & Influencer",
    conferringBody: "Nikon India Private Limited",
    year: "2023",
    category: "Official Creator Alliance",
    citation: "Welcoming Phani Gogireddy to the Nikon Creator Family across AP & Telangana",
    summary:
      "Formally appointed by Nikon India Private Limited as an official Nikon Creator and Influencer. Selected to advocate flagship Z-series cinema optics and mirrorless technology, leading educational masterclasses and championing uncompromised camera craft across South India.",
    imageSrc: "/assets/artist/recognition/nikon-creator-announcement-2023.jpg",
    imageAlt: "Official Nikon India Creator announcement creative for Phani Gogireddy",
    sourceUrl: "https://www.instagram.com/p/CqovGPUoPle/",
    sourceLabel: "View Official Nikon Announcement →",
  },
  {
    id: "thecconnects-ceo-2026",
    badgeLabel: "EXECUTIVE LEADERSHIP",
    milestoneTitle: "Visionary CEO in Luxury Wedding Photography",
    conferringBody: "TheCconnects Global Platform · Growth Story Summit",
    year: "2026",
    category: "Industry Leadership & Entrepreneurship",
    citation: "Visionary CEO in Luxury Wedding Photography & Cinematic Storytelling",
    summary:
      "Conferred at the Growth Story Summit & Awards in Hyderabad by senior leadership including Sri Jayesh Ranjan IAS (Special Chief Secretary, Telangana Government). Honoring Phani Gogireddy for scaling 24 Frames into a high-ticket, institutionalized luxury wedding media company.",
    imageSrc: "/assets/artist/recognition/thecconnects-visionary-ceo-award-2026.jpg",
    imageAlt: "Phani Gogireddy receiving the Visionary CEO Award from Sri Jayesh Ranjan IAS on stage",
    sourceUrl: "https://www.youtube.com/post/Ugkxg9gXlVttAKARijuEYBdupvGDuHk8eQtN",
    sourceLabel: "View Ceremony Announcement →",
  },
  {
    id: "borok-times-2023",
    badgeLabel: "NATIONAL PRESS PROFILE",
    milestoneTitle: "“The Art of Storytelling Through Photography”",
    conferringBody: "Borok Times Editorial Press Feature",
    year: "2023",
    category: "Editorial Press Profile",
    citation: "A Look at Phani Gogireddy’s Award-Winning Work & Client Dedication",
    summary:
      "An in-depth editorial profile investigating Phani Gogireddy's cinematic visual language and client relationships. Explores his background in Telugu cinema and how it informed 24 Frames' narrative-led approach to royal South Indian weddings and generational keepsakes.",
    imageSrc: "/assets/artist/recognition/borok-times-phani-gogireddy.jpeg",
    imageAlt: "Borok Times editorial feature header showing Indian Eminent Awards 2023 recognition",
    sourceUrl: "https://boroktimes.com/the-art-of-storytelling-through-photography-a-look-at-phani-gogireddys-award-winning-work/",
    sourceLabel: "Read Editorial Feature →",
  },
];

export default function FounderRecognitionSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const portraitWrapRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const shelfNicheRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const bioBlockRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const [activeItem, setActiveItem] = useState<VerifiedRecognition | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [hasScrolled, setHasScrolled] = useState(false);
  const triggerRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  /* ── Track Scroll Handlers ── */
  const checkScrollBounds = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const atStart = el.scrollLeft <= 4;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 8;
    setCanScrollLeft(!atStart);
    setCanScrollRight(!atEnd);
  }, []);

  const handleScroll = () => {
    checkScrollBounds();
    const el = trackRef.current;
    if (el && el.scrollLeft > 25 && !hasScrolled) {
      setHasScrolled(true);
    }
  };

  const scrollTrack = (direction: "left" | "right") => {
    const el = trackRef.current;
    if (!el) return;
    const scrollDistance = el.clientWidth * 0.65;
    el.scrollBy({
      left: direction === "right" ? scrollDistance : -scrollDistance,
      behavior: "smooth",
    });
    if (!hasScrolled) {
      setHasScrolled(true);
    }
  };

  useEffect(() => {
    checkScrollBounds();
    window.addEventListener("resize", checkScrollBounds);
    return () => window.removeEventListener("resize", checkScrollBounds);
  }, [checkScrollBounds]);

  /* ── Coordinated GSAP ScrollTrigger Reveal ── */
  useEffect(() => {
    const isReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (isReduced) return;

    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      if (!section) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 72%",
          toggleActions: "play none none reverse",
        },
      });

      // 1. Architectural shelf appears first
      if (shelfNicheRef.current) {
        tl.fromTo(
          shelfNicheRef.current,
          { opacity: 0, y: 28 },
          { opacity: 1, y: 0, duration: 0.75, ease: "power2.out" }
        );
      }

      // 2. Recognition cards enter in a gentle stagger
      const covers = gsap.utils.toArray<HTMLElement>(
        `.${styles.magazineCoverItem}`
      );
      if (covers.length) {
        tl.fromTo(
          covers,
          { opacity: 0, y: 16, scale: 0.94 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            stagger: 0.08,
            ease: "back.out(1.2)",
          },
          "-=0.35"
        );
      }

      // 3. Founder portrait reveals with complementary clip-path
      if (portraitWrapRef.current) {
        tl.fromTo(
          portraitWrapRef.current,
          { clipPath: "inset(12% 0% 12% 0%)", opacity: 0, y: 25 },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: "power3.out",
          },
          "-=0.45"
        );
      }

      // 3.B Left statistics reveal beneath portrait
      if (statsRef.current) {
        tl.fromTo(
          statsRef.current,
          { opacity: 0, y: 18 },
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: "power2.out",
          },
          "-=0.35"
        );
      }

      // 4. Biography text elements fade in
      if (bioBlockRef.current) {
        const textNodes = Array.from(bioBlockRef.current.children).filter(
          (child) => child !== ctaRef.current
        );
        tl.fromTo(
          textNodes,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            stagger: 0.06,
            ease: "power2.out",
          },
          "-=0.4"
        );
      }

      // 5. Commission CTA appears directly beneath biography
      if (ctaRef.current) {
        tl.fromTo(
          ctaRef.current,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: "power2.out",
          },
          "-=0.2"
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  /* ── Accessible Modal Handlers ── */
  const handleOpenItem = (item: VerifiedRecognition) => {
    setActiveItem(item);
  };

  const handleCloseItem = useCallback(() => {
    if (activeItem) {
      const trigger = triggerRefs.current[activeItem.id];
      setActiveItem(null);
      setTimeout(() => trigger?.focus(), 40);
    }
  }, [activeItem]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && activeItem) {
        handleCloseItem();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeItem, handleCloseItem]);

  return (
    <section
      ref={sectionRef}
      id="artist"
      className={styles.section}
      aria-label="Founder & Verified Recognition — Phani Gogireddy"
    >
      {/* Anchor alias to support legacy #founder links smoothly */}
      <div id="founder" className={styles.anchorOffset} aria-hidden="true" />

      {/* Ambient Dappled Sunlight & Foliage Shadows */}
      <div className={styles.sunlightLayer} aria-hidden="true" />
      <div className={styles.leafShadowOverlay} aria-hidden="true" />

      <div className={styles.container}>
        <div className={styles.sceneLayout}>
          {/* ── 1. LEFT COLUMN: FOUNDER PORTRAIT + THREE STATISTICS DIRECTLY BENEATH ── */}
          <div className={styles.portraitCol}>
            {/* 1.1 Founder Portrait */}
            <div ref={portraitWrapRef} className={styles.portraitWrap}>
              <img
                src="/images/founder-portrait.jpg"
                alt="Phani Gogireddy — Founder & Creative Director of 24 Frames Photography"
                className={styles.portraitImg}
                loading="eager"
              />
              <div className={styles.portraitGroundShadow} aria-hidden="true" />
            </div>

            {/* 1.2 Statistics Block Directly Beneath Portrait — Three Statistics Arranged Horizontally */}
            <div ref={statsRef} className={styles.leftStatsBlock}>
              {/* Statistics Divider Beneath Portrait */}
              <div className={styles.leftDivider} />

              {/* Three Statistics Arranged Horizontally: 2012, 500+, 5.0 */}
              <div className={styles.leftStatsRow}>
                <div className={styles.statItem}>
                  <span className={styles.statValue}>2012</span>
                  <span className={styles.statLabel}>FOUNDED IN HYDERABAD</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statValue}>500+</span>
                  <span className={styles.statLabel}>MASTER COMMISSIONS</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statValue}>5.0</span>
                  <span className={styles.statLabel}>WEDMEGOOD SCORE</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── 2. RIGHT COLUMN: ARCHITECTURAL RECOGNITION NICHE (TOP) + EDITORIAL BIOGRAPHY & CTA (BOTTOM) ── */}
          <div className={styles.rightContentCol}>
            {/* 2.A UPPER RIGHT: WIDE ARCHITECTURAL RECOGNITION NICHE */}
            <div className={styles.shelfNicheWrapper}>
              <div className={styles.shelfHeaderRow}>
                <div className={styles.shelfHeaderMeta}>
                  <span className={styles.shelfEyebrow}>
                    HONOURS & EDITORIAL RECOGNITION
                  </span>
                  <div className={styles.shelfTitleRow}>
                    <h3 className={styles.shelfTitle}>The Verified Archive</h3>
                    <span className={styles.shelfScriptAccent}>Heritage & Honours</span>
                  </div>
                </div>

                {/* Previous / Next Shelf Arrow Controls */}
                <div className={styles.shelfNavControls}>
                  <button
                    type="button"
                    className={styles.navArrowBtn}
                    onClick={() => scrollTrack("left")}
                    disabled={!canScrollLeft}
                    aria-label="Previous recognition entry"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    className={styles.navArrowBtn}
                    onClick={() => scrollTrack("right")}
                    disabled={!canScrollRight}
                    aria-label="Next recognition entry"
                  >
                    ›
                  </button>
                </div>
              </div>

              {/* Architectural Plaster Niche */}
              <div
                ref={shelfNicheRef}
                className={styles.architecturalShelfNiche}
                role="region"
                aria-label="Architectural Recognition Shelf Track"
              >
                {/* Champagne Cove Lighting Strip */}
                <div className={styles.coveLightStrip} aria-hidden="true" />

                {/* Horizontally Scrollable Recognition Track */}
                <div
                  ref={trackRef}
                  className={styles.magazineTrack}
                  onScroll={handleScroll}
                  tabIndex={0}
                  role="region"
                  aria-label="Interactive verified recognition archive"
                >
                  {VERIFIED_RECOGNITIONS.map((item) => (
                    <div
                      key={item.id}
                      ref={(el) => {
                        triggerRefs.current[item.id] = el;
                      }}
                      className={`${styles.recognitionCardItem} ${styles.magazineCoverItem}`}
                      onClick={() => handleOpenItem(item)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleOpenItem(item);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      aria-haspopup="dialog"
                      aria-label={`View evidence for ${item.milestoneTitle}`}
                    >
                      <div className={styles.cardTopMeta}>
                        <span className={styles.cardBadge}>{item.badgeLabel}</span>
                        <span className={styles.cardYear}>{item.year}</span>
                      </div>

                      <div className={styles.cardImageWrap}>
                        <img
                          src={item.imageSrc}
                          alt={item.imageAlt}
                          className={styles.cardImage}
                          loading="lazy"
                        />
                      </div>

                      <div className={styles.cardContent}>
                        <h4 className={styles.cardTitle}>{item.milestoneTitle}</h4>
                        <span className={styles.cardOrg}>{item.conferringBody}</span>
                        <span className={styles.cardAffordance}>
                          Inspect Evidence →
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Architectural Shelf Lip & Under Glow */}
                <div className={styles.shelfLip} aria-hidden="true" />
                <div className={styles.shelfUnderGlow} aria-hidden="true" />

                {/* Subtle Discoverability Cue at Bottom-Right */}
                <div
                  className={`${styles.discoverCue} ${
                    hasScrolled ? styles.discoverCueFaded : ""
                  }`}
                  onClick={() => scrollTrack("right")}
                  role="button"
                  tabIndex={0}
                  aria-label="Scroll right to discover more recognition entries"
                >
                  <span>EXPLORE VERIFIED EVIDENCE</span>
                  <span className={styles.cueArrow}>→</span>
                </div>
              </div>
            </div>

            {/* 2.B BELOW THE SHELF: FOUNDER EDITORIAL BIOGRAPHY & COMMISSION CTA */}
            <div ref={bioBlockRef} className={styles.founderBioBlock}>
              {/* Chapter Kicker */}
              <div className={styles.chapterKicker}>
                CHAPTER 04 — THE ARTIST & RECOGNITION
              </div>

              {/* Large Serif Founder Name */}
              <h2 className={styles.founderName}>
                <span>PHANI</span>
                <span>GOGIREDDY</span>
              </h2>

              {/* Founder Role */}
              <div className={styles.founderRole}>
                FOUNDER & CREATIVE DIRECTOR
              </div>

              {/* Two Concise Biography Paragraphs */}
              <div className={styles.narrative}>
                <p>
                  From the film sets of Tollywood to directing one of South
                  India&apos;s most revered cinematic wedding studios, Phani has spent
                  fourteen years preserving Telugu heritage, high-profile royal
                  unions, and the quiet intimacy of families.
                </p>
                <p>
                  Every commission is treated as a bespoke feature film — shot on
                  optical cinema primes, graded with archival color discipline,
                  and delivered as generational heirlooms.
                </p>
              </div>

              {/* Forest-Green Commission CTA Directly Beneath Biography */}
              <div ref={ctaRef} className={styles.ctaRow}>
                <a href="#inquire" className={styles.commissionPillBtn}>
                  COMMISSION PHANI GOGIREDDY{" "}
                  <span className={styles.btnArrow}>→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── CLICKABLE RECOGNITION DETAIL MODAL (Forensic Evidence View) ── */}
      {activeItem && (
        <div
          className={styles.modalBackdrop}
          onClick={handleCloseItem}
          role="dialog"
          aria-modal="true"
          aria-label={activeItem.milestoneTitle}
        >
          <div
            className={styles.modalCard}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className={styles.modalCloseBtn}
              onClick={handleCloseItem}
              aria-label="Close presentation"
            >
              ✕
            </button>

            <div className={styles.modalGrid}>
              <div className={styles.modalCoverWrap}>
                <img
                  src={activeItem.imageSrc}
                  alt={activeItem.imageAlt}
                  className={styles.modalCoverImg}
                />
              </div>

              <div className={styles.modalContent}>
                <div className={styles.modalHeaderMeta}>
                  <span className={styles.modalCategoryBadge}>
                    {activeItem.badgeLabel} · {activeItem.category}
                  </span>
                  <span className={styles.modalYear}>{activeItem.year}</span>
                </div>

                <h3 className={styles.modalTitle}>
                  {activeItem.milestoneTitle}
                </h3>
                <p className={styles.modalOrg}>{activeItem.conferringBody}</p>

                <div className={styles.modalCitationBox}>
                  <span className={styles.citationLabel}>OFFICIAL CITATION</span>
                  <p className={styles.citationText}>
                    “{activeItem.citation}”
                  </p>
                </div>

                <p className={styles.modalSummary}>{activeItem.summary}</p>

                {activeItem.sourceUrl && (
                  <a
                    href={activeItem.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.modalSourceLink}
                  >
                    {activeItem.sourceLabel || "View Primary Source →"}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
