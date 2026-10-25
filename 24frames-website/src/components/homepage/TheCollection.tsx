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
  archiveLabel: string;
  archiveUrl: string;
  category: string;
  location: string;
  venue: string;
  year: string;
  image: string;
  webpImage?: string;
  fallbackImage: string;
  facePosition: string;
  storyNote: string;
}

/* ── Six Curated Commissions (Direct Internal Archive Routes) ────────── */
export const COLLECTION_PROJECTS: CollectionProject[] = [
  {
    id: "bellamkonda-kavya",
    number: "01",
    frameNo: "01/24",
    title: "A Royal Union",
    coupleName: "Bellamkonda Sai Sreenivas & Kavya Reddy",
    archiveLabel: "Bellam Srikonda",
    archiveUrl: "/stories/bellam-srikonda",
    category: "Celebrity Wedding Reception",
    location: "GMR Arena & Shamshabad Estate, Hyderabad",
    venue: "GMR Arena & Shamshabad Estate",
    year: "2025",
    image: "/images/portfolio/bellamkonda-kavya-reception/cover.jpg",
    webpImage: "/images/portfolio/bellamkonda-kavya-reception/cover.webp",
    fallbackImage: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1600&q=88&auto=format",
    facePosition: "center 28%",
    storyNote: "Over seventy hours of bespoke cinema coverage capturing three days of sacred Vedic rituals, high-profile dignitaries, and intimate family moments.",
  },
  {
    id: "sireesh-harshitha",
    number: "02",
    frameNo: "02/24",
    title: "Sacred Union",
    coupleName: "Sireesh & Harshitha",
    archiveLabel: "Sireesh & Harshitha",
    archiveUrl: "/stories/sirish-and-harshitha",
    category: "Sacred Wedding Union",
    location: "Palace Grounds, Hyderabad",
    venue: "Heritage Mandapam Pavilion",
    year: "2025",
    image: "/images/portfolio/sireesh-harshitha/cover.jpg",
    webpImage: "/images/portfolio/sireesh-harshitha/cover.webp",
    fallbackImage: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=88&auto=format",
    facePosition: "center 24%",
    storyNote: "Steeped in ancient Dravidian temple stone textures, marigolds, and sacred midnight Vratham firelight without disruptive artificial lighting.",
  },
  {
    id: "karthik-vijayalakshmi",
    number: "03",
    frameNo: "05/24",
    title: "Taj Falaknama",
    coupleName: "Karthik & Vijayalakshmi",
    archiveLabel: "Taj Falaknama",
    archiveUrl: "/work/karthik-vijayalakshmi",
    category: "Palace Commission",
    location: "Falaknama Palace, Hyderabad",
    venue: "The Nizam's Mirror Colonnades",
    year: "2024",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=88&auto=format",
    fallbackImage: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=88&auto=format",
    facePosition: "center 32%",
    storyNote: "Composed within the Nizam's private marble colonnades and the monumental 101-seat mirror dining hall with aristocratic European poise.",
  },
  {
    id: "hrithika-abhishek",
    number: "04",
    frameNo: "08/24",
    title: "Ceremony & Celebrations",
    coupleName: "Hrithika & Abhishek",
    archiveLabel: "Hrithika & Abhishek",
    archiveUrl: "/stories/hrithika-abhishek",
    category: "Wedding & Celebrations",
    location: "Hyderabad, Telangana",
    venue: "Celebration Estate",
    year: "2024",
    image: "/images/portfolio/hrithika-abhishek/cover.jpg",
    webpImage: "/images/portfolio/hrithika-abhishek/cover.webp",
    fallbackImage: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1600&q=88&auto=format",
    facePosition: "center 28%",
    storyNote: "A multi-day anthology transitioning from quiet sacred Mangalasnanam rituals to the vibrant energy of the concert Sangeet stage.",
  },
  {
    id: "karthik-gayathri",
    number: "05",
    frameNo: "11/24",
    title: "Botanical Splendor",
    coupleName: "Karthik & Gayathri",
    archiveLabel: "Karthik & Gayathri",
    archiveUrl: "/stories/karthik-and-gayathri",
    category: "Fine-Art Heritage Wedding",
    location: "Botanical Pavilion, Hyderabad",
    venue: "Glasshouse Conservatory",
    year: "2024",
    image: "/images/portfolio/karthik-gayathri/cover.jpg",
    webpImage: "/images/portfolio/karthik-gayathri/cover.webp",
    fallbackImage: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1600&q=88&auto=format",
    facePosition: "center 25%",
    storyNote: "Lush botanical glasshouse foliage, peach urns, and open-sky mandapam courtyards crafted as an intimate fine-art poem.",
  },
  {
    id: "dhamini-goutham",
    number: "06",
    frameNo: "16/24",
    title: "A Journey of Love",
    coupleName: "Dhamini & Goutham",
    archiveLabel: "Dhamini & Goutham",
    archiveUrl: "/work/dhamini-goutham",
    category: "Wedding Film & Stills",
    location: "Bengaluru, Karnataka",
    venue: "The Tamarind Tree Courtyards",
    year: "2023",
    image: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1800&q=88&auto=format",
    fallbackImage: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1800&q=88&auto=format",
    facePosition: "center 22%",
    storyNote: "Lush canopy foliage, brass urns, and open-sky mandapam courtyards crafted as a seamless cinematic poem.",
  },
];

export default function TheCollection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
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
            duration: 0.9,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 78%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      if (gridRef.current) {
        const cards = gridRef.current.querySelectorAll(`.${styles.projectCard}`);
        gsap.fromTo(
          cards,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: gridRef.current,
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
            <span className={styles.chapterLabel}>Chapter 02 — The Collection</span>
            <span className={styles.curatorialBadge}>SIX MASTER COMMISSIONS</span>
          </div>
          <h2 className={styles.title}>The Collection</h2>
          <p className={styles.subtitle}>
            Explore the photographic world of 24 Frames. Select any commission to open its internal archive directly and view curated master frames.
          </p>
        </div>

        {/* ── The Collection Gallery Grid (Direct Internal Archive Links) ── */}
        <div
          ref={gridRef}
          className={styles.grid}
          role="region"
          aria-label="Photographic collection commissions"
        >
          {COLLECTION_PROJECTS.map((project) => {
            const hasError = imgErrors[project.id];
            const displayImage = hasError ? project.fallbackImage : project.image;

            return (
              <Link
                key={project.id}
                href={project.archiveUrl}
                className={styles.projectCard}
                aria-label={`Open ${project.archiveLabel} archive — ${project.coupleName}`}
                style={{ "--face-pos": project.facePosition } as React.CSSProperties}
              >
                {/* ── Photographic Canvas ────────────────────────── */}
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
                  <div className={styles.vignette} aria-hidden="true" />
                </div>

                {/* ── Top Bar Metadata Badge ─────────────────────── */}
                <div className={styles.cardTopBar}>
                  <span className={styles.frameBadge}>FRAME {project.frameNo}</span>
                  <span className={styles.categoryBadge}>{project.category}</span>
                </div>

                {/* ── Bottom Caption: Couple Name + Arrow-Only Control ── */}
                <div className={styles.cardBottomBar}>
                  <div className={styles.titleRow}>
                    <h3 className={styles.coupleTitle}>{project.coupleName}</h3>
                    <span
                      className={styles.cardArrow}
                      aria-label={`Open ${project.archiveLabel} archive`}
                      title={`Open ${project.archiveLabel} archive`}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </span>
                  </div>

                  <p className={styles.venueLocation}>
                    {project.venue} · {project.year}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* ── Footnote / Discoverability Row ──────────────────────── */}
        <div className={styles.footerCueRow}>
          <span className={styles.footerCue}>
            Select any commission to open its internal archive directly
          </span>
          <Link href="/stories" className={styles.footerArchiveLink}>
            Explore All Archival Stories →
          </Link>
        </div>
      </div>
    </section>
  );
}
