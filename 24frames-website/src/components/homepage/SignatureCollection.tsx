"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./SignatureCollection.module.css";

gsap.registerPlugin(ScrollTrigger);

export interface SalonProject {
  id: number;
  number: string;
  frameNo: string;
  year: string;
  title: string;
  subtitle: string;
  category: string;
  location: string;
  venue: string;
  image: string;
  slug: string;
  storyNote: string;
  gear: string;
  aspect: string;
}

const SALON_PROJECTS: SalonProject[] = [
  {
    id: 1,
    number: "01",
    frameNo: "01/24",
    year: "2024",
    title: "A Royal Union",
    subtitle: "Bellamkonda Sai Sreenivas & Kavya Reddy",
    category: "Celebrity Wedding",
    location: "Hyderabad, Telangana",
    venue: "GMR Arena & Shamshabad Estate",
    image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1800&q=88&auto=format",
    slug: "bellamkonda-kavya",
    storyNote: "Over seventy hours of bespoke cinema coverage capturing three days of sacred Vedic rituals, high-profile dignitaries, and intimate family moments.",
    gear: "Sony FX6 Cinema Line · Zeiss Supreme Primes",
    aspect: "2.39:1 Cinema Anamorphic",
  },
  {
    id: 2,
    number: "02",
    frameNo: "02/24",
    year: "2024",
    title: "Temple Grandeur",
    subtitle: "Manoj & Snigdha",
    category: "Luxury Heritage Wedding",
    location: "Chilkur Estate, Hyderabad",
    venue: "Chilkur Balaji Heritage Pavilion",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1800&q=88&auto=format",
    slug: "manoj-snigdha",
    storyNote: "Bathed in marigolds, ancient Dravidian stone textures, and midnight Vratham sacred firelight without disruptive artificial lighting.",
    gear: "Nikon Z9 Flagship · 35mm f/1.8 S & 85mm f/1.2 S",
    aspect: "16:9 Cinema Wide",
  },
  {
    id: 3,
    number: "03",
    frameNo: "05/24",
    year: "2024",
    title: "Taj Falaknama",
    subtitle: "Karthik & Vijayalakshmi",
    category: "Palace Commission",
    location: "Falaknama Palace, Hyderabad",
    venue: "The Nizam's Mirror Colonnades",
    // FIXED: Approved high-res authentic palace colonnade asset (Taj Falaknama, HTTP 200)
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1800&q=88&auto=format",
    slug: "karthik-vijayalakshmi",
    storyNote: "Composed within the Nizam's private marble colonnades and the monumental 101-seat mirror dining hall with aristocratic European poise.",
    gear: "Hasselblad X2D 100C · XCD 55V Medium Format",
    aspect: "4:5 Medium Format Fine-Art",
  },
  {
    id: 4,
    number: "04",
    frameNo: "16/24",
    year: "2023",
    title: "Cross-Cultural",
    subtitle: "Divya & Federico",
    category: "Destination Wedding",
    location: "Tuscany & Hyderabad",
    venue: "Villa di Catignano, Siena & ITC Kohenur",
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1800&q=88&auto=format",
    slug: "divya-federico",
    storyNote: "A cross-continental synthesis: Tuscan cypress hills meeting South Indian temple silk, jasmine garlands, and dual family ceremonies.",
    gear: "Cooke S4/i Primes · Sony FX6 Cinema",
    aspect: "2.39:1 Cinema Scope",
  },
  {
    id: 5,
    number: "05",
    frameNo: "04/24",
    year: "2023",
    title: "A Journey of Love",
    subtitle: "Dhamini & Goutham",
    category: "Wedding Film & Stills",
    location: "Bengaluru, Karnataka",
    venue: "The Tamarind Tree Heritage Courtyards",
    image: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1800&q=88&auto=format",
    slug: "dhamini-goutham",
    storyNote: "Lush canopy foliage, brass urns, and open-sky mandapam courtyards crafted as a seamless cinematic poem.",
    gear: "Leica R Vintage Cinema Primes · Sony A1",
    aspect: "2.35:1 Anamorphic",
  },
];

export default function SignatureCollection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const focalImageRef = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const activeProject = SALON_PROJECTS[activeIndex];

  /* ── Scroll-triggered subtle entrance ───────────────────────── */
  useEffect(() => {
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 78%",
            toggleActions: "play none none reverse",
          },
        }
      );

      gsap.fromTo(
        stageRef.current,
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: stageRef.current,
            start: "top 82%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  /* ── Switch active project with smooth focal transition ──────── */
  const selectProject = (index: number) => {
    if (index === activeIndex) return;
    setActiveIndex(index);

    if (focalImageRef.current) {
      gsap.fromTo(
        focalImageRef.current,
        { opacity: 0.65, scale: 0.985 },
        { opacity: 1, scale: 1, duration: 0.45, ease: "power2.out" }
      );
    }
  };

  return (
    <section
      ref={sectionRef}
      id="work"
      className={styles.section}
      aria-label="Featured Work — Curatorial Masterwork Showcase"
    >
      <div className={styles.container}>
        {/* Section Header */}
        <div ref={headerRef} className={styles.header}>
          <div className={styles.headerMeta}>
            <span className={styles.label}>Chapter 03 — Featured Commissions</span>
            <span className={styles.salonBadge}>CURATORIAL SALON</span>
          </div>
          <h2 className={styles.title}>Signature Masterworks</h2>
          <p className={styles.subtitle}>
            Five landmark commissions selected for their cinematic intimacy, architectural scale, and cultural resonance.
          </p>
        </div>

        {/* ── THE CURATORIAL MASTERWORK SALON (Distinct Split Composition) ── */}
        <div ref={stageRef} className={styles.salonStage}>
          {/* Left: Masterwork Focal Canvas (approx 62% width) */}
          <div className={styles.focalCanvas}>
            <div ref={focalImageRef} className={styles.focalFrameWrap}>
              <div className={styles.focalMetaBar}>
                <span className={styles.focalFrameNo}>FRAME {activeProject.frameNo}</span>
                <span className={styles.focalYear}>{activeProject.year} · {activeProject.venue}</span>
                <span className={styles.focalLiveBadge}>EXHIBITING NOW</span>
              </div>

              <div className={styles.focalImageContainer}>
                <img
                  src={activeProject.image}
                  alt={`${activeProject.title} — ${activeProject.subtitle}`}
                  className={styles.focalImage}
                  key={activeProject.id}
                />
              </div>

              {/* Editorial Masterwork Details Strip */}
              <div className={styles.focalDetails}>
                <div className={styles.focalTitleGroup}>
                  <span className={styles.focalCategory}>{activeProject.category}</span>
                  <h3 className={styles.focalTitle}>{activeProject.title}</h3>
                  <p className={styles.focalSubtitle}>{activeProject.subtitle}</p>
                </div>

                <p className={styles.focalStory}>{activeProject.storyNote}</p>

                <div className={styles.focalFooterRow}>
                  <div className={styles.focalSpecs}>
                    <span className={styles.specItem}>
                      <strong className={styles.specKey}>OPTICS</strong> {activeProject.gear}
                    </span>
                    <span className={styles.specItem}>
                      <strong className={styles.specKey}>RATIO</strong> {activeProject.aspect}
                    </span>
                  </div>

                  <Link href={`/work/${activeProject.slug}`} className={styles.exploreBtn}>
                    Step Inside Full Story <span className={styles.btnArrow}>→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Curatorial Index Rail (approx 38% width) */}
          <div className={styles.curatorialIndex} role="tablist" aria-label="Curated masterworks index">
            <div className={styles.indexHeader}>
              <span className={styles.indexHeaderLabel}>SELECTED COMMISSIONS</span>
              <span className={styles.indexCount}>05 MASTERWORKS</span>
            </div>

            <div className={styles.indexList}>
              {SALON_PROJECTS.map((proj, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <button
                    key={proj.id}
                    role="tab"
                    aria-selected={isActive}
                    className={`${styles.indexCard} ${isActive ? styles.indexCardActive : ""}`}
                    onClick={() => selectProject(idx)}
                    onMouseEnter={() => selectProject(idx)}
                  >
                    {/* Thumbnail preview */}
                    <div className={styles.indexThumbWrap}>
                      <img
                        src={proj.image}
                        alt=""
                        className={styles.indexThumb}
                        loading="lazy"
                      />
                    </div>

                    {/* Content */}
                    <div className={styles.indexInfo}>
                      <div className={styles.indexTopRow}>
                        <span className={styles.indexNumber}>{proj.number}</span>
                        <span className={styles.indexYear}>{proj.year}</span>
                      </div>
                      <h4 className={styles.indexTitle}>{proj.title}</h4>
                      <p className={styles.indexLocation}>{proj.location}</p>
                    </div>

                    {/* Active Accent Indicator */}
                    {isActive && <div className={styles.activeIndicator} />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
