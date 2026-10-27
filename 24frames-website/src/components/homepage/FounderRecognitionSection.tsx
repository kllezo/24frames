"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LiquidDotCanvas from "./LiquidDotCanvas";
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
  objectPosition?: string;
}

export const VERIFIED_RECOGNITIONS: VerifiedRecognition[] = [
  {
    id: "nikon-india",
    badgeLabel: "INDUSTRY ASSOCIATION",
    milestoneTitle: "Nikon India Official Association",
    conferringBody: "Nikon India Official",
    year: "2023",
    category: "Creator Community & Imaging Tech",
    citation: "Welcoming Phani Gogireddy (@24framesphotography_official) to the Nikon Creator family",
    summary:
      "Official creator association with Nikon India, highlighting creative innovation, optical precision, and the high standards of craft brought to South Indian wedding cinematography.",
    imageSrc: "/images/magazines/nikon.webp",
    imageAlt: "Official Nikon India association creative welcoming Phani Gogireddy to Nikon Creator family",
    sourceUrl: "https://www.instagram.com/nikonindiaofficial/",
    sourceLabel: "View Official Nikon Announcement →",
    objectPosition: "center 15%",
  },
  {
    id: "times-excellence-dia-mirza",
    badgeLabel: "JURIED INDUSTRY AWARD",
    milestoneTitle: "Excellence in Luxury Wedding Photography",
    conferringBody: "The Times of India · Presented by Dia Mirza at Novotel HICC, Hyderabad",
    year: "2025",
    category: "Luxury Wedding Photography",
    citation: "Conferred for Excellence in Luxury Wedding Photography at Novotel HICC, Hyderabad",
    summary:
      "Conferred at Novotel HICC, Hyderabad before industry leaders and media dignitaries. Presented by Bollywood icon and UN Goodwill Ambassador Dia Mirza to Phani Gogireddy (24 Frames Wedding Films) for setting benchmarks in luxury wedding photography.",
    imageSrc: "/images/magazines/excellence-luxury-photography.webp",
    imageAlt: "Dia Mirza presenting the Excellence in Luxury Wedding Photography award to Phani Gogireddy at Novotel HICC Hyderabad",
    sourceUrl: "https://www.youtube.com/shorts/Lh45ZBRJ1b8",
    sourceLabel: "Watch Award Ceremony Film →",
    objectPosition: "center 22%",
  },
  {
    id: "inovexia-indian-eminent",
    badgeLabel: "REGIONAL DISTINCTION",
    milestoneTitle: "Indian Eminent Awards — Best Photography Service in Hyderabad",
    conferringBody: "Inovexia International · Conferred by Shri Akunuri Murali, IAS",
    year: "2023",
    category: "Best Photography Service",
    citation: "Best Photography Service in Hyderabad, conferred by Guest of Honour Shri Akunuri Murali, IAS",
    summary:
      "Recognised at the Indian Eminent Awards 2023 presented by Inovexia International, honouring 24 Frames for Best Photography Service in Hyderabad, presented by Guest of Honour Shri Akunuri Murali, IAS.",
    imageSrc: "/images/magazines/inovexia.webp",
    imageAlt: "Shri Akunuri Murali IAS conferring the Indian Eminent Award for Best Photography Service in Hyderabad to Phani Gogireddy",
    sourceUrl: "https://boroktimes.com/the-art-of-storytelling-through-photography-a-look-at-phani-gogireddys-award-winning-work/",
    sourceLabel: "Read Feature →",
    objectPosition: "center center",
  },
  {
    id: "times-of-india-spotlight",
    badgeLabel: "EDITORIAL SPOTLIGHT",
    milestoneTitle: "The Times of India Spotlight Feature",
    conferringBody: "The Times of India (Hyderabad Spotlight)",
    year: "2024",
    category: "Press & Media Spotlight",
    citation: "24 FRAMES — Giving you more than just memories to cherish",
    summary:
      "Full-page editorial spotlight in The Times of India celebrating Phani Gogireddy (Nikon India Official Influencer) and 24 Frames for crafting timeless visual legacies and redefining wedding cinematography.",
    imageSrc: "/images/magazines/the-times-of-india.webp",
    imageAlt: "The Times of India full page Hyderabad Spotlight featuring 24 Frames and Phani Gogireddy",
    sourceUrl: "https://timesofindia.indiatimes.com/",
    sourceLabel: "Read Editorial Article →",
    objectPosition: "center top",
  },
  {
    id: "gen-next-india-cover",
    badgeLabel: "MAGAZINE COVER STORY",
    milestoneTitle: "GenNext-India Magazine Cover Feature",
    conferringBody: "GenNext-India Magazine",
    year: "2024",
    category: "Editorial Cover Profile",
    citation: "From a Small Room to South India's Leading Studio — A Journey of Passion. People. Persistence.",
    summary:
      "Cover story documenting the visionary journey of Phani Gogireddy, from establishing 24 Frames with two computers in 2016 to expanding into a 6,000 sq. ft. corporate office with an award-winning team and over 1,000 weddings captured across India and abroad.",
    imageSrc: "/images/magazines/gen-next-india.webp",
    imageAlt: "GenNext-India magazine cover featuring Phani Gogireddy holding the Excellence star award",
    sourceUrl: "https://www.youtube.com/@24framesphotography",
    sourceLabel: "Explore Studio Archive →",
    objectPosition: "center 20%",
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
          start: "top 74%",
          toggleActions: "play none none reverse",
        },
      });

      // 1. Portrait reveals with clip-path
      if (portraitWrapRef.current) {
        tl.fromTo(
          portraitWrapRef.current,
          { clipPath: "inset(8% 0% 8% 0%)", opacity: 0, y: 22 },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: "power3.out",
          }
        );
      }

      // 2. Statistics reveal beneath portrait
      if (statsRef.current) {
        tl.fromTo(
          statsRef.current,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: "power2.out",
          },
          "-=0.4"
        );
      }

      // 3. Architectural shelf reveals
      if (shelfNicheRef.current) {
        tl.fromTo(
          shelfNicheRef.current,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.75, ease: "power2.out" },
          "-=0.35"
        );
      }

      // 4. Recognition cards enter in a gentle stagger
      const covers = gsap.utils.toArray<HTMLElement>(
        `.${styles.magazineCoverItem}`
      );
      if (covers.length) {
        tl.fromTo(
          covers,
          { opacity: 0, y: 14, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            stagger: 0.08,
            ease: "back.out(1.2)",
          },
          "-=0.4"
        );
      }

      // 5. Biography & quotation fade in
      if (bioBlockRef.current) {
        tl.fromTo(
          bioBlockRef.current,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            ease: "power2.out",
          },
          "-=0.3"
        );
      }

      // 6. Commission CTA appears
      if (ctaRef.current) {
        tl.fromTo(
          ctaRef.current,
          { opacity: 0, y: 14 },
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

      {/* Interactive Liquid Dot Matrix Field */}
      <LiquidDotCanvas className={styles.liquidCanvas} />

      {/* Ambient Dappled Sunlight & Foliage Shadows */}
      <div className={styles.sunlightLayer} aria-hidden="true" />
      <div className={styles.leafShadowOverlay} aria-hidden="true" />

      <div className={styles.container}>
        {/* ── HIGH-END EDITORIAL FOUNDER PROFILE (TWO-COLUMN DESKTOP MATCHING IMAGE 5) ── */}
        <div className={styles.artistSectionGrid}>
          {/* ════ LEFT COLUMN ════ */}
          <div className={styles.artistLeftCol}>
            {/* 1. Header Card Panel */}
            <div className={styles.artistHeaderCard}>
              <div className={styles.chapterKicker}>
                CHAPTER 04 — THE ARTIST & VISIONARY
              </div>
              <h2 className={styles.founderName}>PHANI GOGIREDDY</h2>
              <div className={styles.founderRole}>MANAGING DIRECTOR</div>
            </div>

            {/* 2. Large Portrait Frame Card */}
            <div ref={portraitWrapRef} className={styles.portraitWrap}>
              <img
                src="/images/founder-portrait.jpg"
                alt="Phani Gogireddy — Managing Director of 24 Frames Wedding Films"
                className={styles.portraitImg}
                loading="eager"
              />
            </div>

            {/* 3. Prominent Statistics Card */}
            <div ref={statsRef} className={styles.statsCardPanel}>
              <div className={styles.statItem}>
                <span className={styles.statValue}>2016</span>
                <span className={styles.statLabel}>ESTABLISHED IN HYDERABAD</span>
              </div>
              <div className={styles.statDividerVertical} />
              <div className={styles.statItem}>
                <span className={styles.statValue}>1,000+</span>
                <span className={styles.statLabel}>WEDDINGS CAPTURED</span>
              </div>
              <div className={styles.statDividerVertical} />
              <div className={styles.statItem}>
                <span className={styles.statValue}>6,000</span>
                <span className={styles.statLabel}>SQ. FT. CORPORATE HEADQUARTERS</span>
              </div>
            </div>

            {/* 4. Three Core Principles Card */}
            <div className={styles.principlesCardPanel}>
              <span className={styles.coreValuesHeading}>THREE CORE PRINCIPLES</span>
              <div className={styles.coreValuesGrid}>
                <div className={styles.coreValueCard}>
                  <div className={styles.coreValueHeader}>
                    <span className={styles.coreValueNumber}>01</span>
                    <h5 className={styles.coreValueTitle}>On-Time Delivery</h5>
                  </div>
                  <p className={styles.coreValueDesc}>
                    Setting industry benchmarks with a fast, disciplined turnaround for master edits and stills.
                  </p>
                </div>

                <div className={styles.coreValueCard}>
                  <div className={styles.coreValueHeader}>
                    <span className={styles.coreValueNumber}>02</span>
                    <h5 className={styles.coreValueTitle}>Uncompromising Quality</h5>
                  </div>
                  <p className={styles.coreValueDesc}>
                    Blending technical mastery with creative vision on optical cinema primes and archival grades.
                  </p>
                </div>

                <div className={styles.coreValueCard}>
                  <div className={styles.coreValueHeader}>
                    <span className={styles.coreValueNumber}>03</span>
                    <h5 className={styles.coreValueTitle}>Heartfelt Storytelling</h5>
                  </div>
                  <p className={styles.coreValueDesc}>
                    Transforming fleeting, unrepeatable moments into enduring generational heirlooms.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ════ RIGHT COLUMN ════ */}
          <div ref={bioBlockRef} className={styles.artistRightCol}>
            {/* 1. The Verified Archive Shelf Card Panel */}
            <div className={styles.shelfCardPanel}>
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
                          style={{ objectPosition: item.objectPosition || "center 20%" }}
                          loading="lazy"
                        />
                      </div>

                      <div className={styles.cardContent}>
                        <div className={styles.cardInfoRow}>
                          <div className={styles.cardTitleWrap}>
                            <h4 className={styles.cardTitle}>{item.milestoneTitle}</h4>
                            <span className={styles.cardOrg}>{item.conferringBody}</span>
                          </div>
                          <div
                            className={styles.cardArrowAffordance}
                            aria-label={`View evidence for ${item.milestoneTitle}`}
                          >
                            <svg
                              className={styles.cardArrowIcon}
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden="true"
                            >
                              <line x1="5" y1="12" x2="19" y2="12" />
                              <polyline points="12 5 19 12 12 19" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Architectural Shelf Lip & Under Glow */}
                <div className={styles.shelfLip} aria-hidden="true" />
                <div className={styles.shelfUnderGlow} aria-hidden="true" />

                {/* Subtle Discoverability Cue */}
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

            {/* 2. Concise Source-Derived Biography Card Panel */}
            <div className={styles.bioCardPanel}>
              <p className={styles.narrativeText}>
                Established in 2016 from a modest setup of two computers, 24 Frames was founded on an unyielding dedication to heartfelt visual storytelling. Bringing cinematic framing, lighting nuance, and deep emotional sensitivity from Telugu cinema to real weddings, Phani Gogireddy has shaped South India's premier luxury wedding film aesthetic. Today, backed by a 6,000 sq. ft. studio and an award-winning creative team, the company has documented over 1,000 celebrated unions across India and abroad.
              </p>
            </div>

            {/* 3. Closing Signature Editorial Pull Quote Card Panel */}
            <div className={styles.quoteCardPanel}>
              <p className={styles.quoteText}>
                “From reel to real, every dream pursued with heart becomes a timeless shot.”
              </p>
              <span className={styles.quoteAuthor}>
                — PHANI GOGIREDDY, MANAGING DIRECTOR
              </span>
            </div>

            {/* 4. Forest-Green Commission CTA Card Panel */}
            <div ref={ctaRef} className={styles.ctaCardPanel}>
              <a href="#inquire" className={styles.commissionPillBtn}>
                COMMISSION PHANI GOGIREDDY{" "}
                <span className={styles.btnArrow}>→</span>
              </a>
            </div>
          </div>
        </div>

        {/* ── 3. LUXURY CLIENT GALLERY EXPERIENCE SUITE ── */}
        <div className={styles.clientGallerySection}>
          <div className={styles.clientGalleryHeader}>
            <span className={styles.clientGalleryEyebrow}>THE PRIVATE CLIENT SUITE</span>
            <h3 className={styles.clientGalleryHeading}>The 24 Frames Client Gallery Experience</h3>
            <p className={styles.clientGallerySub}>
              An exclusive digital presentation platform delivered with every master commission, engineered to preserve your family's generational legacy.
            </p>
          </div>

          <div className={styles.galleryFeaturesGrid}>
            <div className={styles.galleryFeatureCard}>
              <div className={styles.featureIconBadge}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M15 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path d="M4 20c0-3.3 2.7-6 6-6h4c3.3 0 6 2.7 6 6" />
                </svg>
              </div>
              <h4 className={styles.featureTitle}>AI-Powered Favorite Moments</h4>
              <p className={styles.featureDescription}>
                Smart face recognition enables couples and family guests to effortlessly find their loved ones across thousands of high-resolution stills.
              </p>
            </div>

            <div className={styles.galleryFeatureCard}>
              <div className={styles.featureIconBadge}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="m22 8-6 4 6 4V8Z" />
                  <rect x="2" y="6" width="14" height="12" rx="2" />
                </svg>
              </div>
              <h4 className={styles.featureTitle}>Luxury 4K Video Experience</h4>
              <p className={styles.featureDescription}>
                A cinematic streaming theater for your full-length wedding films, signature teasers, and vertical highlight reels in uncompressed clarity.
              </p>
            </div>

            <div className={styles.galleryFeatureCard}>
              <div className={styles.featureIconBadge}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </div>
              <h4 className={styles.featureTitle}>Instagram-Ready Signature Shots</h4>
              <p className={styles.featureDescription}>
                Master color-graded portraits and candid moments individually calibrated and proportioned for seamless, high-fidelity social sharing.
              </p>
            </div>

            <div className={styles.galleryFeatureCard}>
              <div className={styles.featureIconBadge}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
              </div>
              <h4 className={styles.featureTitle}>Event-Wise Photo Stories</h4>
              <p className={styles.featureDescription}>
                Your wedding memories meticulously structured by ritual, ceremony, and intimate timeline — from Pellikuthuru to the grand reception.
              </p>
            </div>

            <div className={styles.galleryFeatureCard}>
              <div className={styles.featureIconBadge}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
              <h4 className={styles.featureTitle}>The 24 Frames Touch</h4>
              <p className={styles.featureDescription}>
                An exclusive digital heirloom vault designed to keep your wedding story vibrant, accessible, and timeless for generations to come.
              </p>
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
