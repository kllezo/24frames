"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Link from "next/link";
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

  /* ── The Private Client Suite 3-Card Interaction State & GSAP ── */
  const [activeSuiteCard, setActiveSuiteCard] = useState<number>(1); // Middle card 02 is active initial target
  const suiteCardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const artworkRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleCardPointerMove = (index: number, e: React.PointerEvent<HTMLDivElement>) => {
    const card = suiteCardRefs.current[index];
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(card, {
      rotateY: x * 7,
      rotateX: -y * 7,
      duration: 0.25,
      ease: "power1.out",
      transformPerspective: 1000,
    });
  };

  const handleCardPointerLeave = (index: number) => {
    const card = suiteCardRefs.current[index];
    if (!card) return;
    gsap.to(card, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.45,
      ease: "power2.out",
    });
  };

  useEffect(() => {
    suiteCardRefs.current.forEach((card, idx) => {
      if (!card) return;
      const artwork = artworkRefs.current[idx];
      const isActive = idx === activeSuiteCard;
      if (isActive) {
        gsap.to(card, {
          y: -8,
          scale: 1.02,
          opacity: 1,
          duration: 0.55,
          ease: "power2.out",
        });
        if (artwork) {
          gsap.to(artwork, {
            y: 0,
            scale: 1,
            opacity: 1,
            duration: 0.65,
            ease: "power2.out",
          });
        }
      } else {
        gsap.to(card, {
          y: 0,
          scale: 0.98,
          opacity: 0.72,
          duration: 0.4,
          ease: "power2.out",
        });
        if (artwork) {
          gsap.to(artwork, {
            y: 14,
            scale: 0.94,
            opacity: 0.65,
            duration: 0.4,
            ease: "power2.out",
          });
        }
      }
    });
  }, [activeSuiteCard]);

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

            {/* 3. Forest-Green Commission CTA Card Panel */}
            <div ref={ctaRef} className={styles.ctaCardPanel}>
              <Link href="/inquire" className={styles.commissionPillBtn}>
                COMMISSION PHANI GOGIREDDY{" "}
                <span className={styles.btnArrow}>→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* ── 2. HONOURS & EDITORIAL RECOGNITION (OVERSIZED TILTED FRAME REDESIGN) ── */}
        <div className={styles.honoursShowcaseSection} role="region" aria-label="Honours and Editorial Recognition">
          {/* Dedicated Clockwise-Tilted Sharp Rectangular Outline Frame (+10° desktop) */}
          <div className={styles.tiltedOutlineFrame} aria-hidden="true" />

          {/* Upright, Fully Interactive Content Container */}
          <div className={styles.honoursContentWrap}>
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
        </div>

        {/* ── 3. THE PRIVATE CLIENT SUITE — CINEMATIC 3-CARD SHOWCASE ── */}
        <div className={styles.clientGallerySection} aria-label="The Private Client Suite">
          <div className={styles.clientGalleryHeader}>
            <span className={styles.clientGalleryEyebrow}>THE PRIVATE CLIENT SUITE</span>
            <h3 className={styles.clientGalleryHeading}>The 24 Frames Client Gallery Experience</h3>
            <p className={styles.clientGallerySub}>
              An exclusive digital presentation platform delivered with every master commission, engineered to preserve your family's generational legacy.
            </p>
          </div>

          <div className={styles.threeCardStage}>
            {/* Card 01: Violet / Indigo — AI-Powered Moments */}
            <div
              ref={(el) => {
                suiteCardRefs.current[0] = el;
              }}
              className={`${styles.showcaseCard} ${styles.cardViolet} ${
                activeSuiteCard === 0 ? styles.cardVioletActive : ""
              }`}
              onPointerEnter={() => setActiveSuiteCard(0)}
              onPointerMove={(e) => handleCardPointerMove(0, e)}
              onPointerLeave={() => handleCardPointerLeave(0)}
              onClick={() => setActiveSuiteCard(0)}
              role="button"
              tabIndex={0}
              aria-label="Card 01: AI-Powered Favorite Moments"
            >
              <div className={styles.cardTopRow}>
                <span className={styles.cardNumber}>01</span>
                <span className={styles.cardPillBadge}>AI VAULT</span>
              </div>

              <div className={styles.cardArtworkCanvas}>
                <div
                  ref={(el) => {
                    artworkRefs.current[0] = el;
                  }}
                  className={styles.cardArtworkInner}
                >
                  <svg width="150" height="120" viewBox="0 0 150 120" fill="none" aria-hidden="true">
                    <circle cx="75" cy="55" r="38" stroke="rgba(196, 181, 253, 0.4)" strokeDasharray="4 4" />
                    <circle cx="75" cy="55" r="26" stroke="#C4B5FD" strokeWidth="1.5" />
                    <circle cx="75" cy="55" r="4" fill="#C4B5FD" />
                    {/* Targeting Brackets */}
                    <path d="M 45 35 L 45 25 L 55 25" stroke="#C4B5FD" strokeWidth="2" strokeLinecap="round" />
                    <path d="M 105 35 L 105 25 L 95 25" stroke="#C4B5FD" strokeWidth="2" strokeLinecap="round" />
                    <path d="M 45 75 L 45 85 L 55 85" stroke="#C4B5FD" strokeWidth="2" strokeLinecap="round" />
                    <path d="M 105 75 L 105 85 L 95 85" stroke="#C4B5FD" strokeWidth="2" strokeLinecap="round" />
                    <text x="75" y="110" fill="#C4B5FD" fontSize="9" fontFamily="monospace" textAnchor="middle" letterSpacing="2">
                      FACE RECOGNITION AI
                    </text>
                  </svg>
                </div>
              </div>

              <div className={styles.cardBottomContent}>
                <h4 className={styles.cardTitle}>AI-Powered Favorite Moments</h4>
                <p className={styles.cardDescription}>
                  Smart facial recognition enables couples and family guests to effortlessly locate every smile and candid ritual across thousands of high-resolution master stills.
                </p>
                <div className={styles.cardInteractiveAffordance}>
                  <span>SMART SEARCH ENGINE</span>
                  <span>→</span>
                </div>
              </div>
            </div>

            {/* Card 02: Warm Coral / Cream Hero — Luxury 4K Cinema Theater (Middle Hero) */}
            <div
              ref={(el) => {
                suiteCardRefs.current[1] = el;
              }}
              className={`${styles.showcaseCard} ${styles.cardCoral} ${
                activeSuiteCard === 1 ? styles.cardCoralActive : ""
              }`}
              onPointerEnter={() => setActiveSuiteCard(1)}
              onPointerMove={(e) => handleCardPointerMove(1, e)}
              onPointerLeave={() => handleCardPointerLeave(1)}
              onClick={() => setActiveSuiteCard(1)}
              role="button"
              tabIndex={0}
              aria-label="Card 02: Luxury 4K Video Experience"
            >
              <div className={styles.cardTopRow}>
                <span className={styles.cardNumber}>02</span>
                <span className={styles.cardPillBadge}>4K STREAMING</span>
              </div>

              <div className={styles.cardArtworkCanvas}>
                <div
                  ref={(el) => {
                    artworkRefs.current[1] = el;
                  }}
                  className={styles.cardArtworkInner}
                >
                  <svg width="150" height="120" viewBox="0 0 150 120" fill="none" aria-hidden="true">
                    <rect x="20" y="25" width="110" height="65" rx="6" stroke="#FED7AA" strokeWidth="1.5" />
                    <polygon points="68,48 90,58 68,68" fill="#FED7AA" />
                    <circle cx="75" cy="58" r="28" stroke="rgba(254, 215, 170, 0.35)" strokeDasharray="3 4" />
                    <text x="75" y="108" fill="#FED7AA" fontSize="9" fontFamily="monospace" textAnchor="middle" letterSpacing="2">
                      MASTER CINEMA 4K
                    </text>
                  </svg>
                </div>
              </div>

              <div className={styles.cardBottomContent}>
                <h4 className={styles.cardTitle}>Luxury 4K Video Experience</h4>
                <p className={styles.cardDescription}>
                  A private high-bitrate streaming theater for your full-length wedding films, signature teasers, and vertical highlight reels in uncompressed optical clarity.
                </p>
                <div className={styles.cardInteractiveAffordance}>
                  <span>THEATER STREAMING</span>
                  <span>→</span>
                </div>
              </div>
            </div>

            {/* Card 03: Cool Silver / Charcoal — Generational Legacy Archive */}
            <div
              ref={(el) => {
                suiteCardRefs.current[2] = el;
              }}
              className={`${styles.showcaseCard} ${styles.cardSilver} ${
                activeSuiteCard === 2 ? styles.cardSilverActive : ""
              }`}
              onPointerEnter={() => setActiveSuiteCard(2)}
              onPointerMove={(e) => handleCardPointerMove(2, e)}
              onPointerLeave={() => handleCardPointerLeave(2)}
              onClick={() => setActiveSuiteCard(2)}
              role="button"
              tabIndex={0}
              aria-label="Card 03: Generational Legacy Archive"
            >
              <div className={styles.cardTopRow}>
                <span className={styles.cardNumber}>03</span>
                <span className={styles.cardPillBadge}>HEIRLOOM VAULT</span>
              </div>

              <div className={styles.cardArtworkCanvas}>
                <div
                  ref={(el) => {
                    artworkRefs.current[2] = el;
                  }}
                  className={styles.cardArtworkInner}
                >
                  <svg width="150" height="120" viewBox="0 0 150 120" fill="none" aria-hidden="true">
                    {/* Tiered photo ceremony stories stack */}
                    <rect x="25" y="42" width="70" height="48" rx="4" stroke="rgba(226, 232, 240, 0.4)" strokeWidth="1.2" />
                    <rect x="40" y="32" width="70" height="48" rx="4" stroke="rgba(226, 232, 240, 0.7)" strokeWidth="1.2" />
                    <rect x="55" y="22" width="70" height="48" rx="4" stroke="#E2E8F0" strokeWidth="1.5" />
                    <circle cx="102" cy="35" r="4" fill="#E2E8F0" />
                    <text x="75" y="108" fill="#E2E8F0" fontSize="9" fontFamily="monospace" textAnchor="middle" letterSpacing="2">
                      EVENT-WISE TIMELINE
                    </text>
                  </svg>
                </div>
              </div>

              <div className={styles.cardBottomContent}>
                <h4 className={styles.cardTitle}>Generational Legacy & Social Stories</h4>
                <p className={styles.cardDescription}>
                  Master color-graded stills and event-wise ceremony timelines proportioned for seamless social sharing and long-term multi-generational preservation.
                </p>
                <div className={styles.cardInteractiveAffordance}>
                  <span>TIMELESS PRESERVATION</span>
                  <span>→</span>
                </div>
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
