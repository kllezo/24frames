"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./FounderRecognitionSection.module.css";

gsap.registerPlugin(ScrollTrigger);

/* ── Verified Achievement Artefacts (from research dossier) ── */
export interface RecognitionItem {
  id: string;
  rail: 1 | 2; // 1 = upper rail, 2 = lower rail
  title: string;
  organization: string;
  year: string;
  category: string;
  citation: string;
  summary: string;
  image: string;
  sourceUrl?: string;
  sourceLabel?: string;
  accent: string;
}

const RECOGNITION_ITEMS: RecognitionItem[] = [
  // Upper Curved Rail
  {
    id: "et-award",
    rail: 1,
    title: "ET Excellence Award 2025",
    organization: "The Times of India / ET Now",
    year: "2025",
    category: "Luxury Wedding Photography",
    citation: "Excellence in Luxury Wedding Photography & Cinematic Storytelling",
    summary: "Conferred at Novotel HICC, Hyderabad. Guest of Honour: Bollywood icon and UN Goodwill Ambassador Dia Mirza. Awarded before cultural luminaries and industry leaders for consistent excellence in luxury wedding cinematography.",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80&auto=format",
    sourceUrl: "https://www.youtube.com/shorts/Lh45ZBRJ1b8",
    sourceLabel: "Watch Ceremony Film →",
    accent: "#164B40",
  },
  {
    id: "nikon-partner",
    rail: 1,
    title: "Official Nikon India Creator",
    organization: "Nikon India Private Limited",
    year: "2023",
    category: "Brand Ambassador Alliance",
    citation: "National Creator Alliance & Optical Hardware Partner",
    summary: "Recognized as an established name in wedding photography across Andhra Pradesh and Telangana. Selected to test, review, and advocate flagship Nikon Z-series mirrorless cameras and cinema optical glass.",
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&q=80&auto=format",
    sourceUrl: "https://www.instagram.com/p/CqovGPUoPle/",
    sourceLabel: "View Official Announcement →",
    accent: "#C8A84E",
  },
  {
    id: "wedmegood-score",
    rail: 1,
    title: "5.0 / 5.0 Platform Score",
    organization: "WedMeGood Verified Platform",
    year: "2015–2026",
    category: "Directory Excellence Badge",
    citation: "28 Verified Client Reviews · 9+ Consecutive Seasons",
    summary: "Twenty-eight comprehensive verified reviews spanning nine wedding seasons. Unbroken 5.0-star rating across consistency, conduct, and visual delivery on India's premier luxury wedding directory.",
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80&auto=format",
    sourceUrl: "https://www.wedmegood.com/profile/24framesphotography-174332",
    sourceLabel: "View Verified Profile →",
    accent: "#2E6F62",
  },

  // Lower Curved Rail
  {
    id: "indigo-contest",
    rail: 2,
    title: "IndiGo #NoFilter Winner",
    organization: "IndiGo Airlines National Contest",
    year: "2019",
    category: "Documentary Photography",
    citation: "National Juried Competition for Pure Optical Storytelling",
    summary: "National reality competition celebrating pure, unmanipulated optical storytelling and cultural documentation without synthetic retouching. Won through raw framing talent and documentary eye.",
    image: "https://images.unsplash.com/photo-1504151932400-72d4384f04b3?w=800&q=80&auto=format",
    accent: "#4D8F80",
  },
  {
    id: "natgeo-icons",
    rail: 2,
    title: "National Geographic Creator",
    organization: "NatGeo India & JK Tyre",
    year: "2020",
    category: "Mega Icons Documentary Series",
    citation: "Broadcast Documentary Production Photography",
    summary: "Contributed documentary cinematography footage and production photography to the Mega Icons television documentary series broadcast nationally on National Geographic India.",
    image: "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=800&q=80&auto=format",
    accent: "#8FBFB4",
  },
  {
    id: "visionary-ceo",
    rail: 2,
    title: "Visionary CEO in Photography",
    organization: "Hyderabad Photo Trade Expo",
    year: "2024",
    category: "Industry Leadership",
    citation: "Creative Entrepreneurship & Cinema Workflow Innovation",
    summary: "Keynote speaker and honoree for scaling profitable photography enterprises and integrating cinema camera workflows into commercial wedding studios across South India.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80&auto=format",
    accent: "#A6B0A3",
  },
];

export default function FounderRecognitionSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const portraitWrapRef = useRef<HTMLDivElement>(null);
  const portraitImgRef = useRef<HTMLImageElement>(null);
  const contentColRef = useRef<HTMLDivElement>(null);
  const rail1Ref = useRef<HTMLDivElement>(null);
  const rail2Ref = useRef<HTMLDivElement>(null);

  const [activeItem, setActiveItem] = useState<RecognitionItem | null>(null);
  const triggerButtonRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  /* ── GSAP Scroll Trigger Entrance ── */
  useEffect(() => {
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReduced) return;

    const ctx = gsap.context(() => {
      // 1. Portrait entrance: soft vertical clip mask + opacity
      if (portraitWrapRef.current) {
        gsap.fromTo(
          portraitWrapRef.current,
          { clipPath: "inset(12% 0% 12% 0%)", opacity: 0, y: 28 },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            opacity: 1,
            y: 0,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 72%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // 2. Content & curved rails entrance
      if (contentColRef.current) {
        gsap.fromTo(
          contentColRef.current,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 1.0,
            delay: 0.15,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 70%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // 3. Staggered rail item entrance
      const railItems = gsap.utils.toArray<HTMLElement>(`.${styles.artefact}`);
      gsap.fromTo(
        railItems,
        { opacity: 0, y: 20, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          stagger: 0.08,
          ease: "back.out(1.4)",
          scrollTrigger: {
            trigger: contentColRef.current,
            start: "top 65%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  /* ── Accessible Keyboard & Modal Handlers ── */
  const handleOpenItem = (item: RecognitionItem) => {
    setActiveItem(item);
  };

  const handleCloseItem = useCallback(() => {
    if (activeItem) {
      const btn = triggerButtonRefs.current[activeItem.id];
      setActiveItem(null);
      // Return focus to the clicked item
      setTimeout(() => btn?.focus(), 50);
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

  const upperItems = RECOGNITION_ITEMS.filter((i) => i.rail === 1);
  const lowerItems = RECOGNITION_ITEMS.filter((i) => i.rail === 2);

  return (
    <section
      ref={sectionRef}
      id="artist"
      className={styles.section}
      aria-label="Founder & Recognition — Phani Gogireddy"
    >
      <div className={styles.container}>
        <div className={styles.layout}>
          {/* ── LEFT COLUMN: Dominant Founder Portrait (40–45% width) ── */}
          <div className={styles.portraitCol}>
            <div ref={portraitWrapRef} className={styles.portraitWrap}>
              <div className={styles.portraitFrame}>
                <img
                  ref={portraitImgRef}
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=88&auto=format"
                  alt="Phani Gogireddy — Founder & Creative Director of 24 Frames Photography"
                  className={styles.portraitImg}
                  loading="lazy"
                />
                {/* Lower edge editorial caption */}
                <div className={styles.portraitCaption}>
                  <span className={styles.captionTag}>35MM CINEMA STILL</span>
                  <span className={styles.captionDivider}>·</span>
                  <span className={styles.captionName}>PHANI GOGIREDDY</span>
                </div>
              </div>
              <div className={styles.portraitRealisticShadow} aria-hidden="true" />
            </div>
          </div>

          {/* ── RIGHT COLUMN: Sculptural Curved Rails + Editorial Biography ── */}
          <div ref={contentColRef} className={styles.contentCol}>
            {/* Header Kicker */}
            <div className={styles.metaRow}>
              <span className={styles.label}>Chapter 05 — The Visionary & Recognition</span>
              <span className={styles.locationBadge}>Hyderabad · Worldwide</span>
            </div>

            {/* ── SCULPTURAL RECOGNITION WALL: Two Curved Gallery Rails ── */}
            <div className={styles.railsInstallation} role="region" aria-label="Recognition Gallery Rails">
              <div className={styles.railsHeader}>
                <span className={styles.railsTitle}>Verified Honours & Editorial Features</span>
                <span className={styles.railsHint}>Select an artefact to inspect archive</span>
              </div>

              {/* Curved Rail 1 (Upper) */}
              <div ref={rail1Ref} className={`${styles.curvedRail} ${styles.upperRail}`}>
                <div className={styles.railTrack}>
                  <div className={styles.railSurfaceHighlight} />
                  <div className={styles.artefactsRow}>
                    {upperItems.map((item) => (
                      <div
                        key={item.id}
                        ref={(el) => { triggerButtonRefs.current[item.id] = el; }}
                        className={styles.artefact}
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
                        aria-label={`View award details: ${item.title}`}
                      >
                        <div className={styles.artefactVisual}>
                          <img
                            src={item.image}
                            alt=""
                            className={styles.artefactCover}
                            loading="lazy"
                          />
                          <div className={styles.artefactGlow} />
                          <div className={styles.artefactAnchorShadow} />
                        </div>
                        <div className={styles.artefactInfo}>
                          <span className={styles.artefactTitle}>{item.title}</span>
                          <span className={styles.artefactOrg}>{item.organization}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className={styles.railLedgeUnderlay} />
              </div>

              {/* Curved Rail 2 (Lower) */}
              <div ref={rail2Ref} className={`${styles.curvedRail} ${styles.lowerRail}`}>
                <div className={styles.railTrack}>
                  <div className={styles.railSurfaceHighlight} />
                  <div className={styles.artefactsRow}>
                    {lowerItems.map((item) => (
                      <div
                        key={item.id}
                        ref={(el) => { triggerButtonRefs.current[item.id] = el; }}
                        className={styles.artefact}
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
                        aria-label={`View award details: ${item.title}`}
                      >
                        <div className={styles.artefactVisual}>
                          <img
                            src={item.image}
                            alt=""
                            className={styles.artefactCover}
                            loading="lazy"
                          />
                          <div className={styles.artefactGlow} />
                          <div className={styles.artefactAnchorShadow} />
                        </div>
                        <div className={styles.artefactInfo}>
                          <span className={styles.artefactTitle}>{item.title}</span>
                          <span className={styles.artefactOrg}>{item.organization}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className={styles.railLedgeUnderlay} />
              </div>
            </div>

            {/* ── EDITORIAL CONTENT BELOW THE WALL ── */}
            <div className={styles.bioBlock}>
              <blockquote className={styles.pullQuote}>
                “A wedding is not a photo session; it is a sacred cultural milestone. Our mission is to capture its soul with the exact visual language of master cinema.”
              </blockquote>

              <div className={styles.artistIdentity}>
                <h2 className={styles.name}>Phani Gogireddy</h2>
                <span className={styles.role}>Founder & Creative Director</span>
              </div>

              <div className={styles.narrative}>
                <p>
                  From the film sets of Tollywood to directing one of South India's most revered cinematic wedding studios, Phani has spent fourteen years preserving Telugu heritage, high-profile royal unions, and the quiet intimacy of families.
                </p>
                <p>
                  Every commission is treated as a bespoke feature film — shot on optical cinema primes, graded with archival color discipline, and delivered as generational heirlooms.
                </p>
              </div>

              <div className={styles.editorialDivider} />

              {/* Verified Studio Statistics */}
              <div className={styles.statisticsRow}>
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

              {/* Commission CTA Button */}
              <div className={styles.actionRow}>
                <a href="#inquire" className={styles.commissionBtn}>
                  COMMISSION PHANI GOGIREDDY <span className={styles.btnArrow}>→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── CLICK-TO-EXPAND EDITORIAL MODAL (Non-black, warm subdued blur) ── */}
      {activeItem && (
        <div
          className={styles.modalBackdrop}
          onClick={handleCloseItem}
          role="dialog"
          aria-modal="true"
          aria-label={activeItem.title}
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
                  src={activeItem.image}
                  alt={activeItem.title}
                  className={styles.modalCoverImg}
                />
              </div>

              <div className={styles.modalContent}>
                <div className={styles.modalHeaderMeta}>
                  <span className={styles.modalCategoryBadge}>{activeItem.category}</span>
                  <span className={styles.modalYear}>{activeItem.year}</span>
                </div>

                <h3 className={styles.modalTitle}>{activeItem.title}</h3>
                <p className={styles.modalOrg}>{activeItem.organization}</p>

                <div className={styles.modalCitationBox}>
                  <span className={styles.citationLabel}>OFFICIAL CITATION</span>
                  <p className={styles.citationText}>“{activeItem.citation}”</p>
                </div>

                <p className={styles.modalSummary}>{activeItem.summary}</p>

                {activeItem.sourceUrl && (
                  <div className={styles.modalLinkRow}>
                    <a
                      href={activeItem.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.modalSourceLink}
                    >
                      {activeItem.sourceLabel || "View Verification Record →"}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
