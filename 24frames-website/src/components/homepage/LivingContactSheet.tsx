"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./LivingContactSheet.module.css";

gsap.registerPlugin(ScrollTrigger);

/* ── Authenticated 24 Tile Data (Contact Sheet Reference & Archive) ─ */
export interface ContactTile {
  id: number;
  frameNo: string;
  color: string;
  image: string;
  category: "weddings" | "portraits" | "events" | "films" | "fashion" | "recognition" | "brand";
  title: string;
  location: string;
  gear: string;
  projectSlug: string;
  externalSourceUrl?: string;
}

export const TILES: ContactTile[] = [
  { id: 1,  frameNo: "01/24", color: "#0C3028", image: "/images/portfolio/bellamkonda-kavya-reception/cover.webp", category: "weddings", title: "A Royal Union", location: "Hyderabad", gear: "Sony FX6 · 50mm f/1.2", projectSlug: "bellamkonda-kavya-reception", externalSourceUrl: "https://24frames.pic-time.com/8P0kK5ZUmew5F" },
  { id: 2,  frameNo: "02/24", color: "#123C34", image: "/images/portfolio/sireesh-harshitha/cover.webp", category: "weddings", title: "Sireesh & Harshitha", location: "Hyderabad", gear: "Nikon Z9 · 35mm f/1.8", projectSlug: "sireesh-harshitha", externalSourceUrl: "https://24frames.pic-time.com/8Nq0pv3SJbxKn" },
  { id: 3,  frameNo: "03/24", color: "#1A4D42", image: "/images/portfolio/hrithika-abhishek/cover.webp", category: "weddings", title: "Hrithika & Abhishek", location: "Hyderabad", gear: "Hasselblad X2D · 55mm", projectSlug: "hrithika-abhishek", externalSourceUrl: "https://24frames.pic-time.com/whZsXRiO6XgQn" },
  { id: 4,  frameNo: "04/24", color: "#245E52", image: "/images/portfolio/karthik-gayathri/cover.webp", category: "weddings", title: "Karthik & Gayathri", location: "Hyderabad", gear: "Sony FX3 · 85mm f/1.4", projectSlug: "karthik-gayathri", externalSourceUrl: "https://24frames.pic-time.com/yBCmkKcczvWql" },
  { id: 5,  frameNo: "05/24", color: "#2E6F62", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=85&auto=format", category: "portraits", title: "Taj Falaknama", location: "Falaknama Palace", gear: "Hasselblad X2D · 55mm", projectSlug: "taj-falaknuma-royal-wedding" },
  { id: 6,  frameNo: "06/24", color: "#3D8070", image: "https://images.unsplash.com/photo-1604017011826-d3b4c23f8914?w=1200&q=85&auto=format", category: "weddings", title: "Heritage Ballroom", location: "Hyderabad", gear: "Nikon Z8 · 24-70mm", projectSlug: "manoj-snigdha" },
  { id: 7,  frameNo: "07/24", color: "#4D8F80", image: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=1200&q=85&auto=format", category: "portraits", title: "Bridal Portrait", location: "Hyderabad", gear: "Sony A1 · 85mm f/1.2", projectSlug: "bellamkonda-kavya" },
  { id: 8,  frameNo: "08/24", color: "#5E9D8E", image: "https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=1200&q=85&auto=format", category: "weddings", title: "Sacred Vows", location: "Tirupati", gear: "Cooke Primes · 35mm", projectSlug: "bellamkonda-kavya" },
  { id: 9,  frameNo: "09/24", color: "#6FAA9B", image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&q=85&auto=format", category: "portraits", title: "Pre-Wedding Dawn", location: "Ananthagiri Hills", gear: "Nikon Z9 · 58mm f/0.95", projectSlug: "karthik-vijayalakshmi" },
  { id: 10, frameNo: "10/24", color: "#7FB5A8", image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&q=85&auto=format", category: "events", title: "Grand Celebration", location: "HITEX Arena", gear: "Sony FX6 · 24-105mm", projectSlug: "bellamkonda-kavya" },
  { id: 11, frameNo: "11/24", color: "#8FBFB4", image: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=1200&q=85&auto=format", category: "fashion", title: "Fashion Editorial", location: "Studio 24", gear: "Hasselblad H6D · 100mm", projectSlug: "karthik-vijayalakshmi" },
  { id: 12, frameNo: "12/24", color: "#9EC7BE", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=85&auto=format", category: "weddings", title: "Sacred Fire", location: "Hyderabad", gear: "Zeiss Supreme · 65mm", projectSlug: "manoj-snigdha" },
  { id: 13, frameNo: "13/24", color: "#A6B0A3", image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&q=85&auto=format", category: "weddings", title: "Sangeet Night", location: "ITC Kohenur", gear: "Sony A7S III · 24mm f/1.4", projectSlug: "bellamkonda-kavya" },
  { id: 14, frameNo: "14/24", color: "#AEB9AB", image: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1200&q=85&auto=format", category: "weddings", title: "Grand Arrival", location: "Novotel HICC", gear: "Nikon Z8 · 70-200mm", projectSlug: "divya-federico" },
  { id: 15, frameNo: "15/24", color: "#B6C1B3", image: "https://images.unsplash.com/photo-1504151932400-72d4384f04b3?w=1200&q=85&auto=format", category: "events", title: "Birthday Celebration", location: "Jubilee Hills", gear: "Sony FX3 · 35mm f/1.4", projectSlug: "dhamini-goutham" },
  { id: 16, frameNo: "16/24", color: "#BFC8BB", image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=85&auto=format", category: "weddings", title: "Cross-Cultural", location: "Tuscany & Hyderabad", gear: "Cooke Primes · 50mm", projectSlug: "divya-federico" },
  { id: 17, frameNo: "17/24", color: "#C5CCBF", image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=85&auto=format", category: "recognition", title: "ET Excellence Award", location: "Hyderabad", gear: "Archival Frame", projectSlug: "bellamkonda-kavya" },
  { id: 18, frameNo: "18/24", color: "#CFC5B5", image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=1200&q=85&auto=format", category: "recognition", title: "Nikon Partnership", location: "Tokyo / India", gear: "Archival Frame", projectSlug: "manoj-snigdha" },
  { id: 19, frameNo: "19/24", color: "#D5CCBC", image: "/videos/portfolio/nishanth-sanzena/poster.webp", category: "films", title: "Nishanth & Sanzena", location: "Couple Shoot Film", gear: "Sony FX6 · Cinema Film", projectSlug: "nishanth-sanzena", externalSourceUrl: "https://youtu.be/s32UT21hnBg" },
  { id: 20, frameNo: "20/24", color: "#DBD3C3", image: "/videos/portfolio/vinitha-vivekananda/poster.webp", category: "films", title: "Vinitha & Vivekananda", location: "Wedding Teaser", gear: "Sony FX6 · 2.39:1 Cinema", projectSlug: "vinitha-vivekananda", externalSourceUrl: "https://youtu.be/LNtlLgfT5uY" },
  { id: 21, frameNo: "21/24", color: "#E1DACB", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=85&auto=format", category: "events", title: "The Studio Atrium", location: "Hyderabad", gear: "Nikon Z9 · 14-24mm", projectSlug: "manoj-snigdha" },
  { id: 22, frameNo: "22/24", color: "#E7E1D3", image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1200&q=85&auto=format", category: "films", title: "Cinematic Still", location: "Araku Valley", gear: "Sony FX6 · Anamorphic", projectSlug: "dhamini-goutham" },
  { id: 23, frameNo: "23/24", color: "#EDE7DB", image: "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=1200&q=85&auto=format", category: "portraits", title: "Behind The Lens", location: "On Set", gear: "Sony A1 · 35mm", projectSlug: "karthik-vijayalakshmi" },
  { id: 24, frameNo: "24/24", color: "#FAF8F2", image: "", category: "brand", title: "24 Frames", location: "Est. 2012 · Hyderabad", gear: "Cinema Wedding Studio", projectSlug: "identity" },
];

/* ── Transforming Lineup Items ───────────────────────────────── */
const LINEUP_ITEMS = [
  TILES[0],  // Bellamkonda Reception
  TILES[1],  // Sireesh & Harshitha
  TILES[2],  // Hrithika & Abhishek
  TILES[3],  // Karthik & Gayathri
  TILES[18], // Nishanth & Sanzena Film
  TILES[19], // Vinitha & Vivekananda Film
  TILES[23], // 24 Frames Hallmark
];

/* ── Verified Client Exhibition Movements (Generous Editorial Whitespace) ─ */
export interface ExhibitionPhoto {
  id: string;
  title: string;
  clientNames: string;
  captionTitle: string;
  captionSub: string;
  category: string;
  location: string;
  image: string;
  webpImage: string;
  aspectRatio: string;
  widthPercent: number;
  offsetY?: number;
  projectSlug: string;
  sourceUrl: string;
  platform: "Pic-Time" | "YouTube";
}

export interface ExhibitionFilm {
  id: string;
  title: string;
  filmTitle: string;
  category: string;
  duration: string;
  uploadDate: string;
  youtubeId: string;
  embedUrl: string;
  poster: string;
  webpPoster: string;
  sourceUrl: string;
  description: string;
}

export interface ExhibitionPairingMovement {
  id: string;
  type: "pairing";
  movementLabel: string;
  primary: ExhibitionPhoto;
  secondary: ExhibitionPhoto;
}

export interface ExhibitionCinemaMovement {
  id: string;
  type: "cinema";
  movementLabel: string;
  film: ExhibitionFilm;
}

export type ExhibitionMovement = ExhibitionPairingMovement | ExhibitionCinemaMovement;

export const EXHIBITION_MOVEMENTS: ExhibitionMovement[] = [
  /* Movement 01: Royal Reception & Sacred Vows (Asymmetric Pairing with generous 14% canal) */
  {
    id: "movement-01",
    type: "pairing",
    movementLabel: "MOVEMENT 01 / ROYAL RECEPTION & SACRED VOWS",
    primary: {
      id: "ex-01-a",
      title: "Celebrity Wedding Reception",
      clientNames: "Bellamkonda Sai Sreenivas & Kavya Reddy",
      captionTitle: "BELLAMKONDA SAI SREENIVAS & KAVYA REDDY",
      captionSub: "ROYAL RECEPTION · HYDERABAD",
      category: "Celebrity Wedding Reception",
      location: "GMR Arena & Shamshabad Estate, Hyderabad",
      image: "/images/portfolio/bellamkonda-kavya-reception/cover.jpg",
      webpImage: "/images/portfolio/bellamkonda-kavya-reception/cover.webp",
      aspectRatio: "16 / 9",
      widthPercent: 52,
      projectSlug: "bellamkonda-kavya-reception",
      sourceUrl: "https://24frames.pic-time.com/8P0kK5ZUmew5F",
      platform: "Pic-Time",
    },
    secondary: {
      id: "ex-01-b",
      title: "Sacred Wedding Union",
      clientNames: "Sireesh & Harshitha",
      captionTitle: "SIREESH & HARSHITHA",
      captionSub: "WEDDING CELEBRATION · TELANGANA",
      category: "Wedding Celebration",
      location: "Hyderabad, Telangana",
      image: "/images/portfolio/sireesh-harshitha/cover.jpg",
      webpImage: "/images/portfolio/sireesh-harshitha/cover.webp",
      aspectRatio: "4 / 5",
      widthPercent: 34,
      offsetY: 65,
      projectSlug: "sireesh-harshitha",
      sourceUrl: "https://24frames.pic-time.com/8Nq0pv3SJbxKn",
      platform: "Pic-Time",
    },
  },

  /* Movement 02: Cinematic Masterwork Centerpiece (Spacious Standalone Cinema Canvas) */
  {
    id: "movement-02",
    type: "cinema",
    movementLabel: "MOVEMENT 02 / CINEMATIC COUPLE FILM",
    film: {
      id: "film-01",
      title: "Nishanth & Sanzena",
      filmTitle: "Nishanth X Sanzena | Couple Shoot Film",
      category: "Couple Shoot Cinema Film",
      duration: "04:17",
      uploadDate: "September 2025",
      youtubeId: "s32UT21hnBg",
      embedUrl: "https://www.youtube-nocookie.com/embed/s32UT21hnBg?autoplay=1&rel=0",
      poster: "/videos/portfolio/nishanth-sanzena/poster.jpg",
      webpPoster: "/videos/portfolio/nishanth-sanzena/poster.webp",
      sourceUrl: "https://youtu.be/s32UT21hnBg",
      description: "The unfold love story of Nishanth & Sanzena — where every moment, every frame, and every smile captures their eternal bond.",
    },
  },

  /* Movement 03: Classical Fine-Art & Monumental Scale (Reverse Asymmetric Pairing) */
  {
    id: "movement-03",
    type: "pairing",
    movementLabel: "MOVEMENT 03 / CLASSICAL EMBROIDERY & NOBLE RITUAL",
    primary: {
      id: "ex-03-a",
      title: "Fine-Art Heritage Wedding",
      clientNames: "Karthik & Gayathri",
      captionTitle: "KARTHIK & GAYATHRI",
      captionSub: "FINE-ART WEDDING · HYDERABAD",
      category: "Wedding Celebrations",
      location: "Hyderabad, Telangana",
      image: "/images/portfolio/karthik-gayathri/cover.jpg",
      webpImage: "/images/portfolio/karthik-gayathri/cover.webp",
      aspectRatio: "3 / 4",
      widthPercent: 34,
      offsetY: -30,
      projectSlug: "karthik-gayathri",
      sourceUrl: "https://24frames.pic-time.com/yBCmkKcczvWql",
      platform: "Pic-Time",
    },
    secondary: {
      id: "ex-03-b",
      title: "Ceremony & Celebrations",
      clientNames: "Hrithika & Abhishek",
      captionTitle: "HRITHIKA & ABHISHEK",
      captionSub: "WEDDING & NINE-SCENE CELEBRATION",
      category: "Wedding & Celebrations",
      location: "Hyderabad, Telangana",
      image: "/images/portfolio/hrithika-abhishek/cover.jpg",
      webpImage: "/images/portfolio/hrithika-abhishek/cover.webp",
      aspectRatio: "16 / 9",
      widthPercent: 52,
      projectSlug: "hrithika-abhishek",
      sourceUrl: "https://24frames.pic-time.com/whZsXRiO6XgQn",
      platform: "Pic-Time",
    },
  },

  /* Movement 04: Cinematic Epilogue Feature (Spacious Standalone Cinema Canvas) */
  {
    id: "movement-04",
    type: "cinema",
    movementLabel: "MOVEMENT 04 / WEDDING FEATURE FILM",
    film: {
      id: "film-02",
      title: "Vinitha & Vivekananda",
      filmTitle: "Two Years, One Question | Wedding Feature Film",
      category: "Wedding Teaser & Feature Film",
      duration: "02:33",
      uploadDate: "September 2025",
      youtubeId: "LNtlLgfT5uY",
      embedUrl: "https://www.youtube-nocookie.com/embed/LNtlLgfT5uY?autoplay=1&rel=0",
      poster: "/videos/portfolio/vinitha-vivekananda/poster.jpg",
      webpPoster: "/videos/portfolio/vinitha-vivekananda/poster.webp",
      sourceUrl: "https://youtu.be/LNtlLgfT5uY",
      description: "A journey of love, patience, and devotion — where two years of togetherness lead to one life-changing sacred promise.",
    },
  },
];

export default function LivingContactSheet() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const lineupRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  const [lineupActiveId, setLineupActiveId] = useState<number>(TILES[0].id);
  const [selectedPhoto, setSelectedPhoto] = useState<ExhibitionPhoto | ContactTile | null>(null);
  const [activeFilm, setActiveFilm] = useState<ExhibitionFilm | null>(null);

  /* ── GSAP Scroll Trigger for Section Entrance ─────────────── */
  useEffect(() => {
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReduced) return;

    const ctx = gsap.context(() => {
      // Header entrance
      gsap.fromTo(
        headerRef.current,
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Lineup stage reveal
      gsap.fromTo(
        lineupRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: lineupRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Exhibition movements reveal
      const movements = gsap.utils.toArray<HTMLElement>(`.${styles.movementBlock}`);
      movements.forEach((block) => {
        gsap.fromTo(
          block,
          { opacity: 0, y: 45 },
          {
            opacity: 1,
            y: 0,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: block,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  /* ── Keyboard escape for modals ────────────────────────────── */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedPhoto(null);
        setActiveFilm(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="collection"
      className={styles.section}
      aria-label="The Living Contact Sheet — Photography Exhibition"
    >
      <div className={styles.container}>
        {/* Section Header */}
        <div ref={headerRef} className={styles.header}>
          <div className={styles.headerMeta}>
            <span className={styles.label}>Chapter 02 — The Living Contact Sheet</span>
            <span className={styles.referenceBadge}>EDITORIAL ARCHIVE</span>
          </div>
          <h2 className={styles.title}>The Collection</h2>
          <p className={styles.subtitle}>
            An art-directed anthology of monumental wedding photography and cinematic films, capturing sacred traditions and intimate generational tears.
          </p>
        </div>

        {/* ── EXPERIENCE: TRANSFORMING PHOTOGRAPHIC LINEUP ── */}
        <div ref={lineupRef} className={styles.lineupContainer}>
          <div className={styles.lineupStage}>
            {LINEUP_ITEMS.map((item) => {
              const isSelected = lineupActiveId === item.id;
              const isLogo = item.id === 24;

              return (
                <div
                  key={item.id}
                  className={`${styles.lineupPanel} ${isSelected ? styles.lineupPanelActive : ""}`}
                  style={{ "--panel-accent": item.color } as React.CSSProperties}
                  onMouseEnter={() => setLineupActiveId(item.id)}
                  onClick={() => setLineupActiveId(item.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setLineupActiveId(item.id);
                    }
                  }}
                  aria-label={`Frame ${item.frameNo}: ${item.title}`}
                >
                  <div className={styles.panelBackground}>
                    {isLogo ? (
                      <div className={styles.logoTileGraphic}>
                        <span className={styles.logoMarkLarge}>24</span>
                        <span className={styles.logoTextSub}>FRAMES</span>
                        <span className={styles.hallmarkTag}>HYDERABAD · EST. 2012</span>
                      </div>
                    ) : (
                      <img
                        src={item.image}
                        alt={item.title}
                        className={styles.panelImage}
                        loading="lazy"
                      />
                    )}
                    <div className={styles.panelOverlay} />
                  </div>

                  <div className={styles.collapsedContent}>
                    <span className={styles.collapsedFrameNo}>{item.frameNo}</span>
                    <span className={styles.collapsedCategory}>{item.category.toUpperCase()}</span>
                  </div>

                  <div className={styles.expandedContent}>
                    <div className={styles.expandedTitleGroup}>
                      <span className={styles.expandedFrameNo}>FRAME {item.frameNo}</span>
                      <h3 className={styles.expandedTitle}>{item.title}</h3>
                      <p className={styles.expandedLocation}>{item.location}</p>
                    </div>

                    <div className={styles.expandedSpecs}>
                      <div className={styles.specItem}>
                        <span className={styles.specLabel}>Optical Reference</span>
                        <span className={styles.specValue}>{item.gear}</span>
                      </div>
                      <div className={styles.specItem}>
                        <span className={styles.specLabel}>Archival Medium</span>
                        <span className={styles.specValue}>Custom 24F Natural Tone</span>
                      </div>
                    </div>

                    <div className={styles.expandedActionRow}>
                      {isLogo ? (
                        <Link href="/identity" className={styles.expandedCta}>
                          The 24 Frames Brand Story <span className={styles.arrow}>→</span>
                        </Link>
                      ) : (
                        <Link
                          href={`/work/${item.projectSlug}`}
                          className={styles.expandedCta}
                        >
                          Step Inside Full Story <span className={styles.arrow}>→</span>
                        </Link>
                      )}
                      {!isLogo && (
                        <button
                          type="button"
                          className={styles.inspectBtn}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPhoto(item);
                          }}
                        >
                          View 35mm Frame
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className={styles.lineupHint}>
            <span>Hover or tap panels to transform the photographic lineup</span>
          </div>
        </div>

        {/* ── REDESIGNED CURATED EXHIBITION (Spacious Luxury Editorial Layout) ── */}
        <div
          ref={galleryRef}
          id="exhibition"
          className={styles.editorialGallery}
          aria-label="Curated Archival Exhibition"
        >
          {/* Exhibition Editorial Title Header with Generous Negative Space */}
          <div className={styles.exhibitionHeaderWrapper}>
            <div className={styles.exhibitionOverlineRow}>
              <span className={styles.exhibitionDividerLine} />
              <span className={styles.exhibitionOverlineText}>CHAPTER 02.B — CURATED ARCHIVAL EXHIBITION</span>
              <span className={styles.exhibitionDividerLine} />
            </div>

            <div className={styles.exhibitionTitleArea}>
              <h3 className={styles.exhibitionMainTitle}>The Curated Exhibition</h3>
              <p className={styles.exhibitionCuratorialStatement}>
                A quiet anthology of commissioned wedding masterworks and cinematic couple films, captured across palace colonnades, sacred sanctuaries, and intimate generational vows.
              </p>
              <div className={styles.exhibitionMetaTags}>
                <span className={styles.exhibitionBadge}>FOUR PHOTOGRAPHIC EDITIONS</span>
                <span className={styles.exhibitionBadgeDot}>·</span>
                <span className={styles.exhibitionBadge}>TWO CINEMATIC FILMS</span>
                <span className={styles.exhibitionBadgeDot}>·</span>
                <span className={styles.exhibitionBadge}>VERIFIED CLIENT DELIVERABLES</span>
              </div>
            </div>
          </div>

          {/* Exhibition Movements Stream */}
          <div className={styles.movementsContainer}>
            {EXHIBITION_MOVEMENTS.map((mov) => {
              if (mov.type === "cinema") {
                const film = mov.film;
                return (
                  <div key={mov.id} className={`${styles.movementBlock} ${styles.cinemaMovement}`}>
                    <div className={styles.movementLabelRow}>
                      <span className={styles.movementLabel}>{mov.movementLabel}</span>
                    </div>

                    <div
                      className={styles.cinemaStage}
                      onClick={() => setActiveFilm(film)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setActiveFilm(film);
                        }
                      }}
                      aria-label={`Play film: ${film.filmTitle}`}
                    >
                      <div className={styles.cinemaFrame}>
                        <picture>
                          <source srcSet={film.webpPoster} type="image/webp" />
                          <img
                            src={film.poster}
                            alt={film.filmTitle}
                            className={styles.cinemaPoster}
                            loading="lazy"
                          />
                        </picture>
                        <div className={styles.cinemaVignette} />

                        {/* Gold Play Button Beacon */}
                        <div className={styles.playBeacon}>
                          <div className={styles.playPulse} />
                          <svg className={styles.playIcon} viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>

                        {/* Top Badges */}
                        <div className={styles.cinemaTopBar}>
                          <span className={styles.cinemaBadge}>24 FRAMES WEDDING FILMS</span>
                          <span className={styles.cinemaDurationBadge}>{film.duration}</span>
                        </div>

                        {/* Bottom Film Caption */}
                        <div className={styles.cinemaBottomBar}>
                          <span className={styles.cinemaCategory}>{film.category.toUpperCase()}</span>
                          <h4 className={styles.cinemaTitle}>{film.filmTitle}</h4>
                          <p className={styles.cinemaQuote}>"{film.description}"</p>
                        </div>
                      </div>

                      <div className={styles.filmUnderMeta}>
                        <span className={styles.filmClickHint}>Click to watch film in cinema theater</span>
                        <a
                          href={film.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.sourceExternalLink}
                          onClick={(e) => e.stopPropagation()}
                        >
                          YouTube Channel ↗
                        </a>
                      </div>
                    </div>
                  </div>
                );
              }

              // Pairing Movement
              return (
                <div key={mov.id} className={`${styles.movementBlock} ${styles.pairingMovement}`}>
                  <div className={styles.movementLabelRow}>
                    <span className={styles.movementLabel}>{mov.movementLabel}</span>
                  </div>

                  <div className={styles.pairingRow}>
                    {/* Primary Photograph */}
                    <div
                      className={`${styles.galleryFigure} ${styles.primaryFigure}`}
                      style={{
                        "--photo-width": `${mov.primary.widthPercent}%`,
                        "--photo-offset-y": `${mov.primary.offsetY || 0}px`,
                      } as React.CSSProperties}
                      onClick={() => setSelectedPhoto(mov.primary)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setSelectedPhoto(mov.primary);
                        }
                      }}
                      aria-label={`${mov.primary.clientNames} — ${mov.primary.category}. Click to enlarge.`}
                    >
                      <div
                        className={styles.imageContainer}
                        style={{ aspectRatio: mov.primary.aspectRatio }}
                      >
                        <picture>
                          <source srcSet={mov.primary.webpImage} type="image/webp" />
                          <img
                            src={mov.primary.image}
                            alt={mov.primary.title}
                            className={styles.galleryImage}
                            loading="lazy"
                          />
                        </picture>
                        <div className={styles.imageCornerBadge}>PIC-TIME ARCHIVE</div>
                      </div>
                      <div className={styles.editorialCaption}>
                        <div className={styles.captionMain}>
                          <span className={styles.captionTitle}>{mov.primary.captionTitle}</span>
                          <span className={styles.captionMeta}>{mov.primary.captionSub}</span>
                        </div>
                        <a
                          href={mov.primary.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.sourceExternalLink}
                          onClick={(e) => e.stopPropagation()}
                          title="Open official Pic-Time gallery"
                        >
                          Pic-Time ↗
                        </a>
                      </div>
                    </div>

                    {/* Secondary Photograph */}
                    <div
                      className={`${styles.galleryFigure} ${styles.secondaryFigure}`}
                      style={{
                        "--photo-width": `${mov.secondary.widthPercent}%`,
                        "--photo-offset-y": `${mov.secondary.offsetY || 0}px`,
                      } as React.CSSProperties}
                      onClick={() => setSelectedPhoto(mov.secondary)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setSelectedPhoto(mov.secondary);
                        }
                      }}
                      aria-label={`${mov.secondary.clientNames} — ${mov.secondary.category}. Click to enlarge.`}
                    >
                      <div
                        className={styles.imageContainer}
                        style={{ aspectRatio: mov.secondary.aspectRatio }}
                      >
                        <picture>
                          <source srcSet={mov.secondary.webpImage} type="image/webp" />
                          <img
                            src={mov.secondary.image}
                            alt={mov.secondary.title}
                            className={styles.galleryImage}
                            loading="lazy"
                          />
                        </picture>
                        <div className={styles.imageCornerBadge}>PIC-TIME ARCHIVE</div>
                      </div>
                      <div className={styles.editorialCaption}>
                        <div className={styles.captionMain}>
                          <span className={styles.captionTitle}>{mov.secondary.captionTitle}</span>
                          <span className={styles.captionMeta}>{mov.secondary.captionSub}</span>
                        </div>
                        <a
                          href={mov.secondary.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.sourceExternalLink}
                          onClick={(e) => e.stopPropagation()}
                          title="Open official Pic-Time gallery"
                        >
                          Pic-Time ↗
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── 35MM FILM REEL LIGHTBOX MODAL (Photographs) ───────── */}
      {selectedPhoto && (
        <div
          className={styles.modalBackdrop}
          onClick={() => setSelectedPhoto(null)}
          role="dialog"
          aria-modal="true"
          aria-label={"title" in selectedPhoto ? selectedPhoto.title : "Photograph"}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.modalCloseBtn}
              onClick={() => setSelectedPhoto(null)}
              aria-label="Close frame preview"
            >
              ✕
            </button>

            <div className={styles.modalLayout}>
              <div className={styles.modalImageWrap}>
                <img
                  src={"webpImage" in selectedPhoto ? selectedPhoto.webpImage : selectedPhoto.image}
                  alt={"title" in selectedPhoto ? selectedPhoto.title : "Exhibition Frame"}
                  className={styles.modalImage}
                />
              </div>

              <div className={styles.modalSidebar}>
                <div className={styles.modalHeaderStrip}>
                  <span className={styles.modalFrameNo}>
                    {"frameNo" in selectedPhoto ? `FRAME ${selectedPhoto.frameNo}` : "VERIFIED ARCHIVE"}
                  </span>
                  <span className={styles.modalCategory}>
                    {"category" in selectedPhoto ? selectedPhoto.category.toUpperCase() : "WEDDING"}
                  </span>
                </div>

                <h3 className={styles.modalTitle}>
                  {"clientNames" in selectedPhoto ? selectedPhoto.clientNames : selectedPhoto.title}
                </h3>
                <p className={styles.modalLocation}>{selectedPhoto.location}</p>

                <div className={styles.specBox}>
                  <div className={styles.specRow}>
                    <span className={styles.specLabel}>Provenance</span>
                    <span className={styles.specVal}>
                      {"sourceUrl" in selectedPhoto && selectedPhoto.sourceUrl.includes("pic-time")
                        ? "Official 24 Frames Pic-Time Gallery"
                        : "24 Frames Permanent Master Collection"}
                    </span>
                  </div>
                  <div className={styles.specRow}>
                    <span className={styles.specLabel}>Color Emulsion</span>
                    <span className={styles.specVal}>24F Custom Warm Curve</span>
                  </div>
                  <div className={styles.specRow}>
                    <span className={styles.specLabel}>Master Curator</span>
                    <span className={styles.specVal}>Phani Gogireddy</span>
                  </div>
                </div>

                <div className={styles.modalActions}>
                  {"sourceUrl" in selectedPhoto && selectedPhoto.sourceUrl && (
                    <a
                      href={selectedPhoto.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.modalExternalBtn}
                    >
                      Open Official Pic-Time Gallery ↗
                    </a>
                  )}
                  {selectedPhoto.projectSlug ? (
                    <Link
                      href={`/work/${selectedPhoto.projectSlug}`}
                      className={styles.modalStoryBtn}
                      onClick={() => setSelectedPhoto(null)}
                    >
                      Step Inside Project Archive →
                    </Link>
                  ) : (
                    <a
                      href="/#inquire"
                      className={styles.modalStoryBtn}
                      onClick={() => setSelectedPhoto(null)}
                    >
                      Inquire About This Commission →
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── CINEMA FILM PLAYER MODAL (YouTube Video) ──────────── */}
      {activeFilm && (
        <div
          className={styles.modalBackdrop}
          onClick={() => setActiveFilm(null)}
          role="dialog"
          aria-modal="true"
          aria-label={activeFilm.filmTitle}
        >
          <div
            className={styles.cinemaModalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.modalCloseBtn}
              onClick={() => setActiveFilm(null)}
              aria-label="Close cinema player"
            >
              ✕
            </button>

            <div className={styles.cinemaPlayerContainer}>
              <iframe
                src={activeFilm.embedUrl}
                title={activeFilm.filmTitle}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className={styles.cinemaIframe}
              />
            </div>

            <div className={styles.cinemaModalDetails}>
              <div className={styles.cinemaModalMetaRow}>
                <span className={styles.cinemaModalBadge}>24 FRAMES FILMS</span>
                <span className={styles.cinemaModalDuration}>{activeFilm.duration}</span>
                <span className={styles.cinemaModalDate}>{activeFilm.uploadDate}</span>
              </div>
              <h3 className={styles.cinemaModalTitle}>{activeFilm.filmTitle}</h3>
              <p className={styles.cinemaModalDesc}>{activeFilm.description}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
