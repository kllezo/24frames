"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./FounderRecognitionSection.module.css";

gsap.registerPlugin(ScrollTrigger);

/* ── Verified Magazine Artefacts on the Architectural Shelves ── */
export interface MagazineArtefact {
  id: string;
  shelf: 1 | 2; // 1 = Top shelf, 2 = Bottom shelf
  position: number; // 1–4
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
  /* ── SHELF 1 (TOP) ── */
  {
    id: "mag-1-kinfolk",
    shelf: 1,
    position: 1,
    publication: "KINFOLK",
    editionTitle: "The Editorial Feature · Volume 42",
    verifiedMilestone: "ET Excellence Award 2025",
    organization: "The Times of India / ET Now",
    year: "2025",
    category: "Luxury Wedding Cinematography",
    citation: "Excellence in Luxury Wedding Photography & Cinematic Storytelling",
    summary:
      "Conferred at Novotel HICC, Hyderabad before industry leaders and cultural luminaries. Guest of Honour: Bollywood icon and UN Goodwill Ambassador Dia Mirza. Awarded for consistent excellence and cultural preservation in high-end wedding cinematography across South India.",
    coverImage: "/images/magazines/mag-1-kinfolk.jpg",
    sourceUrl: "https://www.youtube.com/shorts/Lh45ZBRJ1b8",
    sourceLabel: "Watch Award Ceremony Film →",
  },
  {
    id: "mag-2-cereal",
    shelf: 1,
    position: 2,
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
    shelf: 1,
    position: 3,
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
    shelf: 1,
    position: 4,
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

  /* ── SHELF 2 (BOTTOM) ── */
  {
    id: "mag-5-kinfolk-travel",
    shelf: 2,
    position: 1,
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
    shelf: 2,
    position: 2,
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
    shelf: 2,
    position: 3,
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
    shelf: 2,
    position: 4,
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
  const bioColRef = useRef<HTMLDivElement>(null);
  const nicheRef = useRef<HTMLDivElement>(null);
  const coveLightRef = useRef<HTMLDivElement>(null);

  const [activeItem, setActiveItem] = useState<MagazineArtefact | null>(null);
  const triggerRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  /* ── GSAP Scroll Trigger Entrance Sequence ── */
  useEffect(() => {
    const isReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (isReduced) return;

    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      if (!section) return;

      // 1. Founder portrait reveals through a soft vertical mask
      if (portraitWrapRef.current) {
        gsap.fromTo(
          portraitWrapRef.current,
          { clipPath: "inset(12% 0% 12% 0%)", opacity: 0, y: 30 },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            opacity: 1,
            y: 0,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 72%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // 2. Editorial biography & heading fade in with restrained stagger
      if (bioColRef.current) {
        const bioElements = bioColRef.current.children;
        gsap.fromTo(
          bioElements,
          { opacity: 0, y: 22 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.08,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 70%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // 3. The architectural niche reveals smoothly from the right
      if (nicheRef.current) {
        gsap.fromTo(
          nicheRef.current,
          { opacity: 0, x: 45 },
          {
            opacity: 1,
            x: 0,
            duration: 0.95,
            delay: 0.2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 68%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // 4. Magazine covers appear sequentially, settling onto shelves
      const magazineElements = gsap.utils.toArray<HTMLElement>(
        `.${styles.magazineCover}`
      );
      if (magazineElements.length) {
        gsap.fromTo(
          magazineElements,
          { opacity: 0, y: 18, scale: 0.94 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.05,
            ease: "back.out(1.3)",
            scrollTrigger: {
              trigger: nicheRef.current,
              start: "top 70%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // 5. The shelf and cove lighting resolves subtly after covers arrive
      if (coveLightRef.current) {
        gsap.fromTo(
          coveLightRef.current,
          { opacity: 0.3 },
          {
            opacity: 1,
            duration: 0.8,
            delay: 0.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: nicheRef.current,
              start: "top 70%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  /* ── Modal and Accessibility Controls ── */
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

  const shelf1Magazines = MAGAZINE_ITEMS.filter((m) => m.shelf === 1);
  const shelf2Magazines = MAGAZINE_ITEMS.filter((m) => m.shelf === 2);

  return (
    <section
      ref={sectionRef}
      id="artist"
      className={styles.section}
      aria-label="Founder & Recognition — Phani Gogireddy"
    >
      {/* Ambient Dappled Sunlight & Tree Shadows Layer */}
      <div className={styles.sunlightLayer} aria-hidden="true" />
      <div className={styles.leafShadowOverlay} aria-hidden="true" />

      <div className={styles.container}>
        <div className={styles.sceneGrid}>
          {/* ── 1. LEFT: DOMINANT FOUNDER PORTRAIT (28–32% Viewport Width) ── */}
          <div className={styles.portraitCol}>
            <div ref={portraitWrapRef} className={styles.portraitWrap}>
              <img
                src="/images/founder-portrait.jpg"
                alt="Phani Gogireddy — Founder & Creative Director of 24 Frames Photography"
                className={styles.portraitImg}
                loading="eager"
              />
              <div className={styles.portraitGroundShadow} aria-hidden="true" />
            </div>
          </div>

          {/* ── 2. CENTER: EDITORIAL BIOGRAPHY & STATISTICS ── */}
          <div ref={bioColRef} className={styles.bioCol}>
            {/* Chapter Kicker */}
            <div className={styles.chapterKicker}>
              CHAPTER 05 — THE VISIONARY & RECOGNITION
            </div>

            {/* Monumental Founder Heading */}
            <h2 className={styles.founderName}>
              <span>PHANI</span>
              <span>GOGIREDDY</span>
            </h2>

            {/* Role Subtitle */}
            <div className={styles.founderRole}>
              FOUNDER & CREATIVE DIRECTOR
            </div>

            {/* Narrative Paragraphs */}
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

            {/* Fine Horizontal Divider */}
            <div className={styles.divider} />

            {/* Three Evenly Spaced Statistics */}
            <div className={styles.statsRow}>
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

            {/* Commission CTA Pill Button */}
            <div className={styles.ctaRow}>
              <a href="#inquire" className={styles.commissionPillBtn}>
                COMMISSION PHANI GOGIREDDY{" "}
                <span className={styles.btnArrow}>→</span>
              </a>
            </div>
          </div>

          {/* ── 3. RIGHT: ARCHITECTURAL ILLUMINATED NICHE & DISPLAY SHELVES (38–42% Width) ── */}
          <div className={styles.nicheCol}>
            <div
              ref={nicheRef}
              className={styles.architecturalNiche}
              role="region"
              aria-label="Recognition & Publication Shelves"
            >
              {/* Integrated Cove Light Strip along curved ceiling */}
              <div
                ref={coveLightRef}
                className={styles.coveLightStrip}
                aria-hidden="true"
              />

              {/* Shelf 1 (Upper Shelf — 4 Magazines) */}
              <div className={styles.displayShelf}>
                <div className={styles.magazineRow}>
                  {shelf1Magazines.map((mag) => (
                    <div
                      key={mag.id}
                      ref={(el) => {
                        triggerRefs.current[mag.id] = el;
                      }}
                      className={styles.magazineCover}
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
                  ))}
                </div>
                <div className={styles.shelfLip} aria-hidden="true" />
                <div className={styles.shelfUnderGlow} aria-hidden="true" />
              </div>

              {/* Shelf 2 (Lower Shelf — 4 Magazines) */}
              <div className={styles.displayShelf}>
                <div className={styles.magazineRow}>
                  {shelf2Magazines.map((mag) => (
                    <div
                      key={mag.id}
                      ref={(el) => {
                        triggerRefs.current[mag.id] = el;
                      }}
                      className={styles.magazineCover}
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
                  ))}
                </div>
                <div className={styles.shelfLip} aria-hidden="true" />
                <div className={styles.shelfUnderGlow} aria-hidden="true" />
              </div>

              {/* Bottom-Right Foreground Architectural Depth (Sunlit Table & Bowl) */}
              <div className={styles.foregroundLayer} aria-hidden="true">
                <img
                  src="/images/foreground-table.png"
                  alt=""
                  className={styles.foregroundImg}
                  loading="lazy"
                />
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
                <p className={styles.modalOrg}>
                  {activeItem.organization}
                </p>

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
