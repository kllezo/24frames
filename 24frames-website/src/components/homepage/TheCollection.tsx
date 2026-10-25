"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./TheCollection.module.css";

gsap.registerPlugin(ScrollTrigger);

export interface CollectionProject {
  id: string;
  number: string;
  frameNo: string;
  title: string;
  coupleName: string;
  category: string;
  location: string;
  venue: string;
  venueShort: string;
  year: string;
  image: string;
  webpImage?: string;
  fallbackImage: string;
  archiveUrl: string;
  storyNote: string;
}

export const COLLECTION_PROJECTS: CollectionProject[] = [
  {
    id: "bellamkonda-kavya",
    number: "01",
    frameNo: "01/24",
    title: "A Royal Union",
    coupleName: "Bellamkonda Sai Sreenivas & Kavya Reddy",
    category: "Celebrity Wedding Reception",
    location: "Shamshabad, Hyderabad",
    venue: "GMR Arena & Shamshabad Estate",
    venueShort: "GMR ARENA",
    year: "2025",
    image: "/images/portfolio/bellamkonda-kavya-reception/cover.jpg",
    webpImage: "/images/portfolio/bellamkonda-kavya-reception/cover.webp",
    fallbackImage: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1600&q=88&auto=format",
    archiveUrl: "/stories/bellam-srikonda",
    storyNote: "A grand three-day celebration blending royal Telugu heritage with contemporary cinematic grandeur across seventy hours of bespoke coverage.",
  },
  {
    id: "sireesh-harshitha",
    number: "02",
    frameNo: "02/24",
    title: "Sacred Union",
    coupleName: "Sireesh & Harshitha",
    category: "Sacred Wedding Union",
    location: "Hyderabad",
    venue: "Palace Grounds, Hyderabad",
    venueShort: "PALACE GROUNDS",
    year: "2024",
    image: "/images/portfolio/sireesh-harshitha/cover.jpg",
    webpImage: "/images/portfolio/sireesh-harshitha/cover.webp",
    fallbackImage: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=88&auto=format",
    archiveUrl: "/stories/sirish-and-harshitha",
    storyNote: "Steeped in ancient Dravidian temple stone textures, marigolds, and sacred midnight Vratham firelight without disruptive artificial lighting.",
  },
  {
    id: "karthik-vijayalakshmi",
    number: "03",
    frameNo: "03/24",
    title: "Taj Falaknama",
    coupleName: "Karthik & Vijayalakshmi",
    category: "Palace Commission",
    location: "Falaknama Palace, Hyderabad",
    venue: "The Nizam's Mirror Colonnades",
    venueShort: "THE NIZAM'S MIRR...",
    year: "2024",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=88&auto=format",
    fallbackImage: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=88&auto=format",
    archiveUrl: "/stories/karthik-and-gayathri",
    storyNote: "Composed within the Nizam's private marble colonnades and monumental 101-seat mirror dining hall with aristocratic European poise.",
  },
  {
    id: "hrithika-abhishek",
    number: "04",
    frameNo: "04/24",
    title: "Ceremony & Celebrations",
    coupleName: "Hrithika & Abhishek",
    category: "Wedding & Celebrations",
    location: "Hyderabad, Telangana",
    venue: "Celebration Estate",
    venueShort: "CELEBRATION ESTA...",
    year: "2024",
    image: "/images/portfolio/hrithika-abhishek/cover.jpg",
    webpImage: "/images/portfolio/hrithika-abhishek/cover.webp",
    fallbackImage: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1600&q=88&auto=format",
    archiveUrl: "/stories/hrithika-abhishek",
    storyNote: "A multi-day anthology transitioning from quiet sacred Mangalasnanam rituals to the vibrant energy of the concert Sangeet stage.",
  },
  {
    id: "karthik-gayathri",
    number: "05",
    frameNo: "05/24",
    title: "Botanical Splendor",
    coupleName: "Karthik & Gayathri",
    category: "Fine-Art Heritage Wedding",
    location: "Hyderabad",
    venue: "Glasshouse Conservatory",
    venueShort: "GLASSHOUSE CONSE...",
    year: "2024",
    image: "/images/portfolio/karthik-gayathri/cover.jpg",
    webpImage: "/images/portfolio/karthik-gayathri/cover.webp",
    fallbackImage: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1600&q=88&auto=format",
    archiveUrl: "/stories/karthik-and-gayathri",
    storyNote: "Lush botanical glasshouse foliage, peach urns, and open-sky mandapam courtyards crafted as an intimate fine-art poem.",
  },
  {
    id: "nishanth-sanzena",
    number: "06",
    frameNo: "06/24",
    title: "A Journey of Love",
    coupleName: "Nishanth & Sanzena",
    category: "Outdoor Fine Art Wedding",
    location: "Bengaluru, Karnataka",
    venue: "Heritage Villa Grounds",
    venueShort: "HERITAGE VILLA G...",
    year: "2024",
    image: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1800&q=88&auto=format",
    fallbackImage: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1800&q=88&auto=format",
    archiveUrl: "/stories/bellam-srikonda",
    storyNote: "Embracing beneath open skies and whispering eucalyptus trees, captured on master optical cinema glass with natural archival light.",
  },
];

export default function TheCollection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const showcaseRef = useRef<HTMLDivElement>(null);

  // Default active commission is 02 (Sireesh & Harshitha) exactly matching Reference Image 2
  const [activeId, setActiveId] = useState<string>("sireesh-harshitha");
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  /* ── GSAP Scroll-Triggered Entrance ─────────────────────────── */
  useEffect(() => {
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReduced) return;

    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 78%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      if (showcaseRef.current) {
        gsap.fromTo(
          showcaseRef.current,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power2.out",
            scrollTrigger: {
              trigger: showcaseRef.current,
              start: "top 82%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleImageError = (id: string) => {
    setImgErrors((prev) => ({ ...prev, [id]: true }));
  };

  const activeProject =
    COLLECTION_PROJECTS.find((p) => p.id === activeId) || COLLECTION_PROJECTS[1];

  return (
    <section
      ref={sectionRef}
      id="collection"
      className={styles.section}
      aria-label="The Collection — Featured Photographic Commissions"
    >
      <div className={styles.container}>
        {/* ── Section Header ────────────────────────────────────── */}
        <div ref={headerRef} className={styles.header}>
          <div className={styles.headerMeta}>
            <span className={styles.chapterLabel}>CHAPTER 02 — THE COLLECTION</span>
            <span className={styles.curatorialBadge}>SIX MASTER COMMISSIONS</span>
          </div>
          <h2 className={styles.title}>The Collection</h2>
          <p className={styles.subtitle}>
            Explore the photographic world of 24 Frames. Select any commission to reveal the full
            story, or explore the complete archival portfolio.
          </p>
        </div>

        {/* ── Outer Showcase Frame (Shared Soft Rounded Container) ── */}
        <div
          ref={showcaseRef}
          className={styles.showcaseContainer}
          role="region"
          aria-label="Six-Project Horizontal Editorial Showcase"
        >
          <div className={styles.accordionTrack}>
            {COLLECTION_PROJECTS.map((project) => {
              const isSelected = project.id === activeId;
              const hasError = imgErrors[project.id];
              const displayImage = hasError ? project.fallbackImage : project.image;

              return (
                <div
                  key={project.id}
                  className={`${styles.card} ${isSelected ? styles.cardActive : styles.cardInactive}`}
                  onClick={() => setActiveId(project.id)}
                  onMouseEnter={() => setActiveId(project.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setActiveId(project.id);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-expanded={isSelected}
                  aria-label={`${project.number} — ${project.coupleName} (${project.title})`}
                >
                  {/* Background Photographic Canvas */}
                  <div className={styles.imageCanvas}>
                    <picture>
                      {!hasError && project.webpImage && (
                        <source srcSet={project.webpImage} type="image/webp" />
                      )}
                      <img
                        src={displayImage}
                        alt={`${project.title} — ${project.coupleName}`}
                        className={styles.cardImage}
                        loading="lazy"
                        onError={() => handleImageError(project.id)}
                      />
                    </picture>

                    {/* Gradient Overlay tailored for active vs collapsed states */}
                    <div
                      className={isSelected ? styles.activeGradient : styles.collapsedGradient}
                      aria-hidden="true"
                    />
                  </div>

                  {/* ── Active Featured Panel Content ── */}
                  {isSelected ? (
                    <div className={styles.activeContent}>
                      {/* Top Header Row with Badges */}
                      <div className={styles.activeTopRow}>
                        <div className={styles.activeTopMeta}>
                          <span className={styles.watermarkBrand}>24 FRAMES</span>
                          <span className={styles.framePill}>FRAME {project.frameNo}</span>
                          <span className={styles.categoryPill}>{project.category}</span>
                        </div>
                        <div className={styles.activeCommissionBadge}>
                          <span>Active Commission</span>
                        </div>
                      </div>

                      {/* Bottom Story & Action Block */}
                      <div className={styles.activeBottomBlock}>
                        <h3 className={styles.activeTitle}>{project.title}</h3>
                        <p className={styles.activeCouple}>{project.coupleName}</p>

                        <p className={styles.activeMeta}>
                          {project.location ? `${project.location.toUpperCase()} · ` : ""}
                          {project.year}
                        </p>

                        <p className={styles.activeDescription}>{project.storyNote}</p>

                        <div className={styles.activeButtonRow}>
                          <Link href={project.archiveUrl} className={styles.btnPrimary}>
                            VIEW STORY <span>→</span>
                          </Link>
                          <Link href="/stories" className={styles.btnSecondary}>
                            Archival Index <span>↗</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* ── Inactive Collapsed Card Content ── */
                    <div className={styles.collapsedContent}>
                      {/* Top Frame Number Pill */}
                      <div className={styles.collapsedTop}>
                        <span className={styles.collapsedNumber}>{project.number}</span>
                      </div>

                      {/* Bottom Minimal Project Info */}
                      <div className={styles.collapsedBottom}>
                        <h4 className={styles.collapsedTitle}>{project.coupleName}</h4>
                        <p className={styles.collapsedVenue}>{project.venueShort}</p>
                        <span className={styles.collapsedView}>VIEW →</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Footnote / Discoverability Row ──────────────────────── */}
        <div className={styles.footerCueRow}>
          <span className={styles.footerCue}>
            SELECT ANY COMMISSION TO REVEAL STORY DETAILS · HOVER OR CLICK TO EXPAND
          </span>
          <Link href="/stories" className={styles.footerArchiveLink}>
            EXPLORE ALL 24 FRAMES IN ARCHIVE →
          </Link>
        </div>
      </div>
    </section>
  );
}
