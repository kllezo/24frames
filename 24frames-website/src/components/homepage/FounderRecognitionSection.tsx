"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LiquidDotCanvas from "./LiquidDotCanvas";
import { useScrollLock } from "@/lib/scrollLock";
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
  aspectRatio: string;
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
    aspectRatio: "620 / 818",
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
    aspectRatio: "450 / 604",
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
    aspectRatio: "630 / 686",
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
    aspectRatio: "512 / 612",
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
    aspectRatio: "505 / 811",
  },
];

export default function FounderRecognitionSection() {
  const sectionRef = useRef<HTMLElement>(null);

  /* Living Portrait References */
  const portraitWrapRef = useRef<HTMLDivElement>(null);
  const portraitImgRef = useRef<HTMLImageElement>(null);
  const darkroomOverlayRef = useRef<HTMLDivElement>(null);
  const viewfinderHudRef = useRef<HTMLDivElement>(null);
  const lightBandRef = useRef<HTMLDivElement>(null);
  const namePanelRef = useRef<HTMLDivElement>(null);
  const interactiveGlareRef = useRef<HTMLDivElement>(null);

  /* Layout References */
  const statsRef = useRef<HTMLDivElement>(null);
  const recognitionCardRef = useRef<HTMLDivElement>(null);
  const bioRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const principlesRef = useRef<HTMLDivElement>(null);
  const ctaContainerRef = useRef<HTMLDivElement>(null);

  /* Carousel Track References */
  const carouselTrackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  /* Evidence Modal State */
  const [activeItem, setActiveItem] = useState<VerifiedRecognition | null>(null);
  useScrollLock(activeItem !== null);
  const triggerRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  /* ── Track Carousel Navigation & Horizontal Wheel Handler ── */
  const updateScrollState = useCallback(() => {
    if (!carouselTrackRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = carouselTrackRef.current;
    setCanScrollLeft(scrollLeft > 6);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 6);
  }, []);

  const scrollTrack = useCallback((direction: "left" | "right") => {
    if (!carouselTrackRef.current) return;
    const offset = direction === "left" ? -260 : 260;
    carouselTrackRef.current.scrollBy({ left: offset, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const track = carouselTrackRef.current;
    if (!track) return;

    // Normal vertical scrolling moves the entire page up/down naturally.
    // Horizontal navigation is handled via the circular arrow buttons and natural horizontal swipe/drag.
    track.addEventListener("scroll", updateScrollState, { passive: true });
    updateScrollState();

    return () => {
      track.removeEventListener("scroll", updateScrollState);
    };
  }, [updateScrollState]);

  /* ── Interactive Artist Portrait Studio Lighting ── */
  useEffect(() => {
    const wrap = portraitWrapRef.current;
    const glare = interactiveGlareRef.current;
    if (!wrap || !glare) return;

    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouch = window.matchMedia("(hover: none)").matches;
    if (isReduced || isTouch) return;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      glare.style.setProperty("--glare-x", `${x}%`);
      glare.style.setProperty("--glare-y", `${y}%`);
      glare.style.opacity = "0.5";
    };

    const handlePointerLeave = () => {
      glare.style.opacity = "0";
      glare.style.setProperty("--glare-x", "50%");
      glare.style.setProperty("--glare-y", "40%");
    };

    wrap.addEventListener("pointermove", handlePointerMove, { passive: true });
    wrap.addEventListener("pointerleave", handlePointerLeave, { passive: true });

    return () => {
      wrap.removeEventListener("pointermove", handlePointerMove);
      wrap.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  /* ── Living Portrait & Section GSAP Entrance Animation ── */
  useEffect(() => {
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReduced) return;

    const ctx = gsap.context(() => {
      /* 1. Coordinated 5-Stage Living Portrait Reveal Timeline */
      if (portraitWrapRef.current && portraitImgRef.current) {
        const portraitTl = gsap.timeline({
          scrollTrigger: {
            trigger: portraitWrapRef.current,
            start: "top 78%",
            once: true,
          },
        });

        // Stage 0: Portrait frame emerges with subtle elevation
        portraitTl.fromTo(
          portraitWrapRef.current,
          { clipPath: "polygon(0 8%, 100% 0%, 100% 92%, 0 100%)", opacity: 0.85, y: 20 },
          { clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0 100%)", opacity: 1, y: 0, duration: 1.1, ease: "power3.out" },
          0
        );

        // Stage 1: Viewfinder 4 corners converge toward focus center (0.0s - 0.45s)
        if (viewfinderHudRef.current) {
          portraitTl.fromTo(
            viewfinderHudRef.current,
            { opacity: 0, scale: 1.22 },
            { opacity: 1, scale: 1.0, duration: 0.5, ease: "power3.out" },
            0.1
          );
        }

        // Stage 2: Vertical light band sweeps through portrait (0.35s - 1.15s)
        if (lightBandRef.current) {
          portraitTl.fromTo(
            lightBandRef.current,
            { left: "-20%", opacity: 0.85 },
            { left: "120%", opacity: 0, duration: 0.85, ease: "power2.inOut" },
            0.35
          );
        }

        // Stage 3: Darkroom shadow fades as portrait focus settles into crisp clarity
        if (darkroomOverlayRef.current) {
          portraitTl.to(
            darkroomOverlayRef.current,
            { opacity: 0, duration: 0.75, ease: "power2.out" },
            0.35
          );
        }

        portraitTl.fromTo(
          portraitImgRef.current,
          { scale: 1.05, filter: "blur(6px)" },
          { scale: 1.0, filter: "blur(0px)", duration: 0.75, ease: "power2.out" },
          0.45
        );

        // Stage 4: Viewfinder corners retreat as shot is acquired
        if (viewfinderHudRef.current) {
          portraitTl.to(
            viewfinderHudRef.current,
            { opacity: 0, scale: 1.1, duration: 0.45, ease: "power2.in" },
            1.2
          );
        }

        // Stage 5: The Signature name panel appears
        if (namePanelRef.current) {
          portraitTl.fromTo(
            namePanelRef.current,
            { opacity: 0, y: 14 },
            { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
            1.45
          );
        }
      }

      /* 2. Entrance for Panels (Staggered Soft Fade) */
      const panelsTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 72%",
          once: true,
        },
      });

      if (statsRef.current) {
        panelsTl.fromTo(
          statsRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
          0.3
        );
      }

      if (recognitionCardRef.current) {
        panelsTl.fromTo(
          recognitionCardRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
          0.2
        );
      }

      if (bioRef.current) {
        panelsTl.fromTo(
          bioRef.current,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
          0.35
        );
      }

      if (quoteRef.current) {
        panelsTl.fromTo(
          quoteRef.current,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
          0.45
        );
      }

      if (principlesRef.current) {
        panelsTl.fromTo(
          principlesRef.current,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
          0.55
        );
      }

      if (ctaContainerRef.current) {
        panelsTl.fromTo(
          ctaContainerRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
          0.65
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
      aria-label="Chapter 04 — The Artist & Visionary, Phani Gogireddy"
    >
      {/* Anchor alias to support legacy #founder links smoothly */}
      <div id="founder" className={styles.anchorOffset} aria-hidden="true" />

      {/* Interactive Liquid Dot Matrix Field (Single authentic dotted layer) */}
      <LiquidDotCanvas className={styles.liquidCanvas} />

      <div className={styles.container}>
        {/* ── TWO-COLUMN DESKTOP COMPOSITION MATCHING REFERENCE SCREENSHOT ── */}
        <div className={styles.twoColumnGrid}>
          {/* ══════════ LEFT COLUMN ══════════ */}
          <div className={styles.leftColumn}>
            {/* 1. Founder Name Panel */}
            <div ref={namePanelRef} className={styles.founderNamePanel}>
              <span className={styles.namePanelKicker}>
                CHAPTER 04 — THE ARTIST &amp; VISIONARY
              </span>
              <h2 className={styles.founderNameHeading}>PHANI GOGIREDDY</h2>
              <span className={styles.founderDesignation}>MANAGING DIRECTOR</span>
            </div>

            {/* 2. Large Founder Portrait with Living Portrait Animation & Interactive Studio Glare */}
            <div ref={portraitWrapRef} className={styles.portraitWrap}>
              <img
                ref={portraitImgRef}
                src="/images/founder-portrait.jpg"
                alt="Phani Gogireddy — Managing Director of 24 Frames Wedding Films"
                className={styles.portraitImg}
                loading="eager"
              />

              {/* Subdued Darkroom Starting Overlay */}
              <div
                ref={darkroomOverlayRef}
                className={styles.darkroomOverlay}
                aria-hidden="true"
              />

              {/* Interactive Cinematic Studio Light Reflection Layer */}
              <div
                ref={interactiveGlareRef}
                className={styles.interactiveGlare}
                aria-hidden="true"
              />

              {/* Vertical Light Band for Viewfinder Focus Sweep */}
              <div
                ref={lightBandRef}
                className={styles.verticalLightBand}
                aria-hidden="true"
              />

              {/* Viewfinder Corners HUD */}
              <div
                ref={viewfinderHudRef}
                className={styles.viewfinderHud}
                aria-hidden="true"
              >
                <span className={`${styles.vfCorner} ${styles.vfCornerTL}`} />
                <span className={`${styles.vfCorner} ${styles.vfCornerTR}`} />
                <span className={`${styles.vfCorner} ${styles.vfCornerBL}`} />
                <span className={`${styles.vfCorner} ${styles.vfCornerBR}`} />
              </div>
            </div>

            {/* 3. Horizontal Statistics Panel with 3 Equal Sections */}
            <div ref={statsRef} className={styles.statsPanel}>
              <div className={styles.statBox}>
                <span className={styles.statNumber}>2016</span>
                <span className={styles.statDesc}>ESTABLISHED IN HYDERABAD</span>
              </div>
              <div className={styles.statDivider} aria-hidden="true" />
              <div className={styles.statBox}>
                <span className={styles.statNumber}>1,000+</span>
                <span className={styles.statDesc}>WEDDINGS CAPTURED</span>
              </div>
              <div className={styles.statDivider} aria-hidden="true" />
              <div className={styles.statBox}>
                <span className={styles.statNumber}>6,000</span>
                <span className={styles.statDesc}>SQ. FT. CORPORATE HEADQUARTERS</span>
              </div>
            </div>

            {/* 4. Three Core Principles Stacked Directly Beneath Statistics */}
            <div ref={principlesRef} className={styles.principlesContainer}>
              <div className={styles.principlesHeaderRow}>
                <span className={styles.principlesKicker}>THREE CORE PRINCIPLES</span>
                <span className={styles.principlesLine} aria-hidden="true" />
              </div>
              <div className={styles.principlesList}>
                {/* Principle 01 */}
                <div className={styles.principleCard}>
                  <div className={styles.principleTitleRow}>
                    <span className={styles.principleNumber}>01</span>
                    <h4 className={styles.principleTitle}>On-Time Delivery</h4>
                  </div>
                  <p className={styles.principleDescription}>
                    Setting industry benchmarks with a fast, disciplined turnaround for master edits and stills.
                  </p>
                </div>

                {/* Principle 02 */}
                <div className={styles.principleCard}>
                  <div className={styles.principleTitleRow}>
                    <span className={styles.principleNumber}>02</span>
                    <h4 className={styles.principleTitle}>Uncompromising Quality</h4>
                  </div>
                  <p className={styles.principleDescription}>
                    Blending technical mastery with creative vision on optical cinema primes and archival grades.
                  </p>
                </div>

                {/* Principle 03 */}
                <div className={styles.principleCard}>
                  <div className={styles.principleTitleRow}>
                    <span className={styles.principleNumber}>03</span>
                    <h4 className={styles.principleTitle}>Heartfelt Storytelling</h4>
                  </div>
                  <p className={styles.principleDescription}>
                    Transforming fleeting, unrepeatable moments into enduring generational heirlooms.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ══════════ RIGHT COLUMN ══════════ */}
          <div className={styles.rightColumn}>
            {/* 1. Honours & Editorial Recognition Panel with Inner Carousel */}
            <div ref={recognitionCardRef} className={styles.recognitionPanel}>
              {/* Header with Title and Prev/Next Carousel Arrows */}
              <div className={styles.recognitionHeader}>
                <div className={styles.recognitionTitleBlock}>
                  <span className={styles.recognitionKicker}>
                    HONOURS &amp; EDITORIAL RECOGNITION
                  </span>
                  <h3 className={styles.recognitionMainTitle}>
                    The Verified Archive{" "}
                    <span className={styles.cursiveTag}>Heritage &amp; Honours</span>
                  </h3>
                </div>

                {/* Circular Navigation Arrows */}
                <div className={styles.carouselNavButtons}>
                  <button
                    className={styles.navCircleBtn}
                    onClick={() => scrollTrack("left")}
                    disabled={!canScrollLeft}
                    aria-label="Previous honours and recognitions"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                  </button>
                  <button
                    className={styles.navCircleBtn}
                    onClick={() => scrollTrack("right")}
                    disabled={!canScrollRight}
                    aria-label="Next honours and recognitions"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Recessed Warm Illuminated Carousel Container */}
              <div className={styles.carouselWell}>
                <div
                  ref={carouselTrackRef}
                  className={styles.carouselTrack}
                >
                  {VERIFIED_RECOGNITIONS.map((item, idx) => (
                    <div
                      key={item.id}
                      ref={(el) => {
                        triggerRefs.current[item.id] = el;
                      }}
                      className={styles.magazineCard}
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
                      <div className={styles.cardHeaderMeta}>
                        <span className={styles.cardBadge}>{item.badgeLabel}</span>
                        <span className={styles.cardYear}>{item.year}</span>
                      </div>

                      <div className={styles.cardImageContainer}>
                        <img
                          src={item.imageSrc}
                          alt={item.imageAlt}
                          className={styles.cardCoverImg}
                          loading="lazy"
                        />
                      </div>

                      <div className={styles.cardFooterInfo}>
                        <div className={styles.cardTextGroup}>
                          <h4 className={styles.cardMilestoneTitle}>{item.milestoneTitle}</h4>
                          <span className={styles.cardConferringBody}>{item.conferringBody}</span>
                        </div>
                        <div
                          className={`${styles.cardArrowBtn} ${idx === 0 ? styles.cardArrowBtnActive : ""}`}
                          aria-hidden="true"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Baseline Link */}
              <div className={styles.recognitionBottomLinkRow}>
                <button
                  className={styles.exploreEvidenceLink}
                  onClick={() => scrollTrack("right")}
                  aria-label="Explore verified recognition evidence"
                >
                  <span>EXPLORE VERIFIED EVIDENCE</span>
                  <span className={styles.linkArrow}>→</span>
                </button>
              </div>

              {/* Fine Editorial Divider separating recognition from narrative biography */}
              <div className={styles.editorialDivider} aria-hidden="true" />
            </div>

            {/* 2. Wide Cream Biography Panel */}
            <div ref={bioRef} className={styles.bioPanel}>
              <p className={styles.bioText}>
                Established in 2016 from a modest setup of two computers, 24 Frames was founded on an unyielding dedication to heartfelt visual storytelling. Bringing cinematic framing, lighting nuance, and deep emotional sensitivity from Telugu cinema to real weddings, Phani Gogireddy has shaped South India's premier luxury wedding film aesthetic. Today, backed by a 6,000 sq. ft. studio and an award-winning creative team, the company has documented over 1,000 celebrated unions across India and abroad.
              </p>
            </div>

            {/* 3. Founder Pull Quote Panel with Forest-Green Left Rule */}
            <div ref={quoteRef} className={styles.quotePanel}>
              <p className={styles.quoteText}>
                “From reel to real, every dream pursued with heart becomes a timeless shot.”
              </p>
              <span className={styles.quoteAttribution}>
                — PHANI GOGIREDDY, MANAGING DIRECTOR
              </span>
            </div>

            {/* 4. Commission Phani Gogireddy CTA Button */}
            <div ref={ctaContainerRef} className={styles.rightColumnCtaWrap}>
              <Link
                href="/inquire"
                className={styles.commissionPillBtn}
                aria-label="Commission Phani Gogireddy for your wedding film"
              >
                <span>COMMISSION PHANI GOGIREDDY</span>
                <span className={styles.btnArrow}>→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── FORENSIC EVIDENCE MODAL FOR VERIFIED RECOGNITIONS ── */}
      {activeItem && (
        <div
          className={styles.modalBackdrop}
          onClick={handleCloseItem}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div
            className={styles.modalContainer}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <div className={styles.modalHeaderMeta}>
                <span className={styles.modalBadge}>{activeItem.badgeLabel}</span>
                <span className={styles.modalYear}>{activeItem.year}</span>
              </div>
              <button
                className={styles.modalCloseBtn}
                onClick={handleCloseItem}
                aria-label="Close dialog"
              >
                ✕
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.modalMediaCol}>
                <img
                  src={activeItem.imageSrc}
                  alt={activeItem.imageAlt}
                  className={styles.modalImg}
                />
              </div>

              <div className={styles.modalContentCol}>
                <span className={styles.modalCategory}>{activeItem.category}</span>
                <h3 id="modal-title" className={styles.modalTitle}>
                  {activeItem.milestoneTitle}
                </h3>
                <p className={styles.modalConferring}>{activeItem.conferringBody}</p>

                <blockquote className={styles.modalCitation}>
                  "{activeItem.citation}"
                </blockquote>

                <p className={styles.modalSummary}>{activeItem.summary}</p>

                <div className={styles.modalActions}>
                  <a
                    href={activeItem.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.modalSourceLink}
                  >
                    <span>{activeItem.sourceLabel}</span>
                    <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
