"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./FounderRecognitionSection.module.css";

gsap.registerPlugin(ScrollTrigger);

/* ── Verified Magazine Artefacts on the Architectural Shelf ── */
export interface MagazineArtefact {
  id: string;
  publication: "KINFOLK" | "CEREAL" | "MONOCLE" | "LOEWE";
  editionTitle: string;
  verifiedMilestone: string;
  organization: string;
  year: string;
  category: string;
  citation: string;
  summary: string;
  coverImage: string;
  sourceUrl?: string;
  sourceLabel?: string;
}

const MAGAZINE_ITEMS: MagazineArtefact[] = [
  {
    id: "mag-1-kinfolk",
    publication: "KINFOLK",
    editionTitle: "The Editorial Feature · Volume 42",
    verifiedMilestone: "ET Excellence Award 2025",
    organization: "The Times of India / ET Now",
    year: "2025",
    category: "Luxury Wedding Cinematography",
    citation: "Excellence in Luxury Wedding Photography & Cinematic Storytelling",
    summary:
      "Conferred at Novotel HICC, Hyderabad before cultural luminaries and industry leaders. Guest of Honour: Bollywood icon and UN Goodwill Ambassador Dia Mirza. Awarded for consistent excellence and cultural preservation in high-end wedding cinematography across South India.",
    coverImage: "/images/magazines/mag-1-kinfolk.jpg",
    sourceUrl: "https://www.youtube.com/shorts/Lh45ZBRJ1b8",
    sourceLabel: "Watch Award Ceremony Film →",
  },
  {
    id: "mag-2-cereal",
    publication: "CEREAL",
    editionTitle: "Architectural Volume · The Heritage Issue",
    verifiedMilestone: "Fourteen Years Preserving South Indian Heritage",
    organization: "24 Frames Archival Monograph",
    year: "2024",
    category: "Heritage Documentation",
    citation: "Monograph on South Indian Architectural Weddings & Royal Lineages",
    summary:
      "An architectural study documenting fourteen years of South Indian wedding heritage — from heritage palace courtyards to sacred temple ceremonies. Capturing the timeless intimacy of Telugu traditions with master optical primes.",
    coverImage: "/images/magazines/mag-2-cereal.jpg",
    sourceUrl: "https://www.instagram.com/24framesphotography_official/",
    sourceLabel: "Explore Archival Monograph →",
  },
  {
    id: "mag-3-monocle",
    publication: "MONOCLE",
    editionTitle: "The Global Dispatch · Destination Edition",
    verifiedMilestone: "Official Nikon India Creator Alliance",
    organization: "Nikon India Private Limited",
    year: "2023",
    category: "Brand Ambassador Alliance",
    citation: "National Optical Hardware & Cinema Prime Partner",
    summary:
      "Recognized as an established master in wedding photography across Andhra Pradesh and Telangana. Selected by Nikon India Private Limited to test, review, and advocate flagship Nikon Z-series mirrorless cinema cameras and prime optical glass.",
    coverImage: "/images/magazines/mag-3-monocle.jpg",
    sourceUrl: "https://www.instagram.com/p/CqovGPUoPle/",
    sourceLabel: "View Official Nikon Announcement →",
  },
  {
    id: "mag-4-loewe",
    publication: "LOEWE",
    editionTitle: "Art & Intimacy · The Creative Director",
    verifiedMilestone: "Visionary CEO in Photography & Cinema Workflow",
    organization: "Hyderabad Photo Trade Expo",
    year: "2024",
    category: "Industry Leadership",
    citation: "Creative Entrepreneurship & Cinematic Innovation",
    summary:
      "Keynote presentation at Hyderabad Photo Trade Expo honoring Phani Gogireddy for scaling profitable photography studios and integrating high-end cinema camera workflows into commercial wedding productions across South India.",
    coverImage: "/images/magazines/mag-4-loewe.jpg",
    sourceUrl: "https://www.youtube.com/@24framesphotography",
    sourceLabel: "View Keynote Address →",
  },
  {
    id: "mag-5-kinfolk-travel",
    publication: "KINFOLK",
    editionTitle: "TRAVEL · Destination Unions",
    verifiedMilestone: "Winner — IndiGo #NoFilter Reality Contest",
    organization: "IndiGo Airlines (InterGlobe Aviation Ltd)",
    year: "2019",
    category: "Documentary Photography",
    citation: "National Juried Competition for Pure Optical Storytelling",
    summary:
      "Winner of the national reality competition run by IndiGo Airlines celebrating pure, unmanipulated optical storytelling and cultural documentation without synthetic retouching. Selected for raw framing talent and documentary authenticity.",
    coverImage: "/images/magazines/mag-5-kinfolk-travel.jpg",
    sourceUrl: "https://www.instagram.com/phanigogireddy24/",
    sourceLabel: "View Competition Archive →",
  },
  {
    id: "mag-6-cereal-arch",
    publication: "CEREAL",
    editionTitle: "Form & Light · Sacred Rituals",
    verifiedMilestone: "National Geographic Mega Icons Cinematography",
    organization: "National Geographic India / JK Tyre",
    year: "2020",
    category: "Documentary Broadcast",
    citation: "Broadcast Documentary Production Photography",
    summary:
      "Contributed documentary cinematography footage and production photography to the Mega Icons television documentary series broadcast nationally on National Geographic India.",
    coverImage: "/images/magazines/mag-6-cereal-arch.jpg",
    sourceUrl: "https://www.youtube.com/@24framesphotography",
    sourceLabel: "View National Geographic Feature →",
  },
  {
    id: "mag-7-monocle-bw",
    publication: "MONOCLE",
    editionTitle: "The Monograph · Noir & Silver Halide",
    verifiedMilestone: "WedMeGood 5.0 Star Platform Badge",
    organization: "WedMeGood Verified Platform",
    year: "2015–2026",
    category: "Platform Excellence",
    citation: "28 Comprehensive Verified Client Reviews · 9+ Seasons",
    summary:
      "Unbroken 5.0-star rating across nine consecutive wedding seasons on India's premier luxury wedding portal. Recognized for artistic consistency, client discretion, and archival photo & film delivery.",
    coverImage: "/images/magazines/mag-7-monocle-bw.jpg",
    sourceUrl: "https://www.wedmegood.com/profile/24framesphotography-174332",
    sourceLabel: "Inspect WedMeGood Profile →",
  },
  {
    id: "mag-8-loewe-chair",
    publication: "LOEWE",
    editionTitle: "Interiors & Heirlooms · Generational Keepsakes",
    verifiedMilestone: "500+ Master Wedding Commissions Delivered",
    organization: "24 Frames Master Archive",
    year: "2012–2026",
    category: "Master Archive",
    citation: "Generational Heirlooms & Archival Print Albums",
    summary:
      "Over five hundred royal, celebrity, and high-profile wedding commissions completed across Hyderabad, Bengaluru, Chennai, Udaipur, and international destinations. Handcrafted Italian leather-bound archival albums and 4K cinema master recordings.",
    coverImage: "/images/magazines/mag-8-loewe-chair.jpg",
    sourceUrl: "https://www.24framesphotography.com",
    sourceLabel: "Explore Archive Collection →",
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

  const [activeItem, setActiveItem] = useState<MagazineArtefact | null>(null);
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
    const scrollDistance = el.clientWidth * 0.58;
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

      // 2. Magazine covers enter in a gentle stagger, settling on the shelf
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
            stagger: 0.05,
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
  const handleOpenItem = (item: MagazineArtefact) => {
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
      aria-label="Founder & Editorial Magazine Wall — Phani Gogireddy"
    >
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

            {/* 1.2 Statistics Block Directly Beneath Portrait — Single Vertical Column */}
            <div ref={statsRef} className={styles.leftStatsBlock}>
              {/* Statistics Top Divider */}
              <div className={styles.leftDivider} />

              {/* Three Statistics Arranged in a Single Vertical Column */}
              <div className={styles.leftStatsVertical}>
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

          {/* ── 2. RIGHT COLUMN: MAGAZINE SHELF (TOP) + EDITORIAL BIOGRAPHY & CTA (BOTTOM) ── */}
          <div className={styles.rightContentCol}>
            {/* 2.A UPPER RIGHT: WIDE ARCHITECTURAL MAGAZINE SHELF */}
            <div className={styles.shelfNicheWrapper}>
              <div className={styles.shelfHeaderRow}>
                <div className={styles.shelfHeaderMeta}>
                  <span className={styles.shelfEyebrow}>IN PRINT & IN FRAME</span>
                  <h3 className={styles.shelfTitle}>The Editorial Archive</h3>
                </div>

                {/* Previous / Next Shelf Arrow Controls */}
                <div className={styles.shelfNavControls}>
                  <button
                    type="button"
                    className={styles.navArrowBtn}
                    onClick={() => scrollTrack("left")}
                    disabled={!canScrollLeft}
                    aria-label="Previous magazine covers"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    className={styles.navArrowBtn}
                    onClick={() => scrollTrack("right")}
                    disabled={!canScrollRight}
                    aria-label="Next magazine covers"
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
                aria-label="Architectural Magazine Shelf Track"
              >
                {/* Champagne Cove Lighting Strip */}
                <div className={styles.coveLightStrip} aria-hidden="true" />

                {/* Horizontally Scrollable Magazine Track */}
                <div
                  ref={trackRef}
                  className={styles.magazineTrack}
                  onScroll={handleScroll}
                  tabIndex={0}
                  role="region"
                  aria-label="Interactive magazine covers"
                >
                  {MAGAZINE_ITEMS.map((mag) => (
                    <div
                      key={mag.id}
                      ref={(el) => {
                        triggerRefs.current[mag.id] = el;
                      }}
                      className={styles.magazineCoverItem}
                      onClick={() => handleOpenItem(mag)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleOpenItem(mag);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      aria-haspopup="dialog"
                      aria-label={`View ${mag.publication}: ${mag.verifiedMilestone}`}
                    >
                      <div className={styles.coverImageWrap}>
                        <img
                          src={mag.coverImage}
                          alt={`${mag.publication} cover`}
                          className={styles.coverImage}
                          loading="lazy"
                        />
                        <div
                          className={styles.spineHighlight}
                          aria-hidden="true"
                        />
                        <div
                          className={styles.pageEdgeShadow}
                          aria-hidden="true"
                        />
                      </div>
                      <span className={styles.magazineCaptionTitle}>
                        {mag.publication}
                      </span>
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
                  aria-label="Scroll right to discover more magazine covers"
                >
                  <span>EXPLORE THE COLLECTION</span>
                  <span className={styles.cueArrow}>→</span>
                </div>
              </div>
            </div>

            {/* 2.B BELOW THE SHELF: FOUNDER EDITORIAL BIOGRAPHY & COMMISSION CTA */}
            <div ref={bioBlockRef} className={styles.founderBioBlock}>
              {/* Chapter Kicker */}
              <div className={styles.chapterKicker}>
                CHAPTER 05 — THE VISIONARY & RECOGNITION
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
                  India's most revered cinematic wedding studios, Phani has spent
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

      {/* ── CLICKABLE MAGAZINE DETAIL MODAL (Prominent Editorial View) ── */}
      {activeItem && (
        <div
          className={styles.modalBackdrop}
          onClick={handleCloseItem}
          role="dialog"
          aria-modal="true"
          aria-label={activeItem.verifiedMilestone}
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
                  src={activeItem.coverImage}
                  alt={activeItem.editionTitle}
                  className={styles.modalCoverImg}
                />
              </div>

              <div className={styles.modalContent}>
                <div className={styles.modalHeaderMeta}>
                  <span className={styles.modalCategoryBadge}>
                    {activeItem.publication} · {activeItem.category}
                  </span>
                  <span className={styles.modalYear}>{activeItem.year}</span>
                </div>

                <h3 className={styles.modalTitle}>
                  {activeItem.verifiedMilestone}
                </h3>
                <p className={styles.modalOrg}>{activeItem.organization}</p>

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
                    {activeItem.sourceLabel || "View Official Record →"}
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
