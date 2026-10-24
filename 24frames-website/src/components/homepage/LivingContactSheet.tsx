"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./LivingContactSheet.module.css";

gsap.registerPlugin(ScrollTrigger);

/* ── Authenticated 24 Tile Data ───────────────────────────────── */
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
}

export const TILES: ContactTile[] = [
  { id: 1,  frameNo: "01/24", color: "#0C3028", image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1200&q=85&auto=format", category: "weddings", title: "A Royal Union", location: "Hyderabad", gear: "Sony FX6 · 50mm f/1.2", projectSlug: "bellamkonda-kavya" },
  { id: 2,  frameNo: "02/24", color: "#123C34", image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=85&auto=format", category: "weddings", title: "Temple Grandeur", location: "Chilkur Estate", gear: "Nikon Z9 · 35mm f/1.8", projectSlug: "manoj-snigdha" },
  { id: 3,  frameNo: "03/24", color: "#1A4D42", image: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1200&q=85&auto=format", category: "weddings", title: "Sacred Ceremony", location: "Hyderabad", gear: "Leica R · 50mm", projectSlug: "dhamini-goutham" },
  { id: 4,  frameNo: "04/24", color: "#245E52", image: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=1200&q=85&auto=format", category: "weddings", title: "Twilight Garden", location: "Bengaluru", gear: "Sony FX3 · 85mm f/1.4", projectSlug: "dhamini-goutham" },
  { id: 5,  frameNo: "05/24", color: "#2E6F62", image: "https://images.unsplash.com/photo-1585071550721-fdb362ae2b8a?w=1200&q=85&auto=format", category: "portraits", title: "Taj Falaknama", location: "Falaknama Palace", gear: "Hasselblad X2D · 55mm", projectSlug: "karthik-vijayalakshmi" },
  { id: 6,  frameNo: "06/24", color: "#3D8070", image: "https://images.unsplash.com/photo-1604017011826-d3b4c23f8914?w=1200&q=85&auto=format", category: "weddings", title: "Heritage Ballroom", location: "Hyderabad", gear: "Nikon Z8 · 24-70mm", projectSlug: "manoj-snigdha" },
  { id: 7,  frameNo: "07/24", color: "#4D8F80", image: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=1200&q=85&auto=format", category: "portraits", title: "Bridal Portrait", location: "Hyderabad", gear: "Sony A1 · 85mm f/1.2", projectSlug: "bellamkonda-kavya" },
  { id: 8,  frameNo: "08/24", color: "#5E9D8E", image: "https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=1200&q=85&auto=format", category: "weddings", title: "Sacred Vows", location: "Tirupati", gear: "Cooke Primes · 35mm", projectSlug: "bellamkonda-kavya" },
  { id: 9,  frameNo: "09/24", color: "#6FAA9B", image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&q=85&auto=format", category: "portraits", title: "Pre-Wedding Dawn", location: "Ananthagiri Hills", gear: "Nikon Z9 · 58mm f/0.95", projectSlug: "karthik-vijayalakshmi" },
  { id: 10, frameNo: "10/24", color: "#7FB5A8", image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&q=85&auto=format", category: "events", title: "Grand Celebration", location: "HITEX Arena", gear: "Sony FX6 · 24-105mm", projectSlug: "bellamkonda-kavya" },
  { id: 11, frameNo: "11/24", color: "#8FBFB4", image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200&q=85&auto=format", category: "fashion", title: "Fashion Editorial", location: "Studio 24", gear: "Hasselblad H6D · 100mm", projectSlug: "karthik-vijayalakshmi" },
  { id: 12, frameNo: "12/24", color: "#9EC7BE", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=85&auto=format", category: "weddings", title: "Sacred Fire", location: "Hyderabad", gear: "Zeiss Supreme · 65mm", projectSlug: "manoj-snigdha" },
  { id: 13, frameNo: "13/24", color: "#A6B0A3", image: "https://images.unsplash.com/photo-1513725673706-7b5609847580?w=1200&q=85&auto=format", category: "weddings", title: "Sangeet Night", location: "ITC Kohenur", gear: "Sony A7S III · 24mm f/1.4", projectSlug: "bellamkonda-kavya" },
  { id: 14, frameNo: "14/24", color: "#AEB9AB", image: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1200&q=85&auto=format", category: "weddings", title: "Grand Arrival", location: "Novotel HICC", gear: "Nikon Z8 · 70-200mm", projectSlug: "divya-federico" },
  { id: 15, frameNo: "15/24", color: "#B6C1B3", image: "https://images.unsplash.com/photo-1504151932400-72d4384f04b3?w=1200&q=85&auto=format", category: "events", title: "Birthday Celebration", location: "Jubilee Hills", gear: "Sony FX3 · 35mm f/1.4", projectSlug: "dhamini-goutham" },
  { id: 16, frameNo: "16/24", color: "#BFC8BB", image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=85&auto=format", category: "weddings", title: "Cross-Cultural", location: "Tuscany & Hyderabad", gear: "Cooke Primes · 50mm", projectSlug: "divya-federico" },
  { id: 17, frameNo: "17/24", color: "#C5CCBF", image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=85&auto=format", category: "recognition", title: "ET Excellence Award", location: "Hyderabad", gear: "Archival Frame", projectSlug: "bellamkonda-kavya" },
  { id: 18, frameNo: "18/24", color: "#CFC5B5", image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=1200&q=85&auto=format", category: "recognition", title: "Nikon Partnership", location: "Tokyo / India", gear: "Archival Frame", projectSlug: "manoj-snigdha" },
  { id: 19, frameNo: "19/24", color: "#D5CCBC", image: "https://images.unsplash.com/photo-1609151162474-e1e0e1d0e8ba?w=1200&q=85&auto=format", category: "films", title: "Talambralu Emotion", location: "Hyderabad", gear: "Sony FX6 · 2.39:1 Cinema", projectSlug: "bellamkonda-kavya" },
  { id: 20, frameNo: "20/24", color: "#DBD3C3", image: "https://images.unsplash.com/photo-1596455607563-ad6193f5f082?w=1200&q=85&auto=format", category: "portraits", title: "Bridal Couture", location: "Banjara Hills", gear: "Hasselblad · 80mm", projectSlug: "karthik-vijayalakshmi" },
  { id: 21, frameNo: "21/24", color: "#E1DACB", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=85&auto=format", category: "events", title: "The Studio Atrium", location: "Hyderabad", gear: "Nikon Z9 · 14-24mm", projectSlug: "manoj-snigdha" },
  { id: 22, frameNo: "22/24", color: "#E7E1D3", image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1200&q=85&auto=format", category: "films", title: "Cinematic Still", location: "Araku Valley", gear: "Sony FX6 · Anamorphic", projectSlug: "dhamini-goutham" },
  { id: 23, frameNo: "23/24", color: "#EDE7DB", image: "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=1200&q=85&auto=format", category: "portraits", title: "Behind The Lens", location: "On Set", gear: "Sony A1 · 35mm", projectSlug: "karthik-vijayalakshmi" },
  { id: 24, frameNo: "24/24", color: "#FAF8F2", image: "", category: "brand", title: "24 Frames", location: "Est. 2012 · Hyderabad", gear: "Cinema Wedding Studio", projectSlug: "identity" },
];

/* ── Transforming Lineup Items (Inspired by Reference 2) ─────── */
const LINEUP_ITEMS = [
  TILES[0],  // A Royal Union (#0C3028)
  TILES[1],  // Temple Grandeur (#123C34)
  TILES[4],  // Taj Falaknama (#2E6F62)
  TILES[6],  // Bridal Portrait (#4D8F80)
  TILES[13], // Grand Arrival (#AEB9AB)
  TILES[15], // Cross-Cultural (#BFC8BB)
  TILES[23], // 24 Frames Hallmark (#FAF8F2)
];

const CATEGORIES = [
  { key: "all", label: "All Frames (24)" },
  { key: "weddings", label: "Weddings" },
  { key: "portraits", label: "Portraits" },
  { key: "events", label: "Events" },
  { key: "films", label: "Films" },
];

export default function LivingContactSheet() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const lineupRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const [activeCategory, setActiveCategory] = useState("all");
  const [lineupActiveId, setLineupActiveId] = useState<number>(TILES[0].id);
  const [hoveredGridTileId, setHoveredGridTileId] = useState<number | null>(null);
  const [selectedLightboxTile, setSelectedLightboxTile] = useState<ContactTile | null>(null);

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

      // Staggered grid reveal
      const tiles = gsap.utils.toArray<HTMLElement>(`.${styles.gridTile}`);
      gsap.fromTo(
        tiles,
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: {
            grid: [4, 6],
            from: "start",
            amount: 0.6,
          },
          ease: "power2.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  /* ── Keyboard escape for lightbox modal ────────────────────── */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedLightboxTile(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filteredTiles = TILES.filter(
    (t) => activeCategory === "all" || t.category === activeCategory || t.id === 24
  );

  return (
    <section
      ref={sectionRef}
      id="collection"
      className={styles.section}
      aria-label="The Living Contact Sheet — 24 Frame Showcase"
    >
      <div className={styles.container}>
        {/* Section Header */}
        <div ref={headerRef} className={styles.header}>
          <div className={styles.headerMeta}>
            <span className={styles.label}>Chapter 02 — The Living Contact Sheet</span>
            <span className={styles.referenceBadge}>24 FRAMES ARCHIVE</span>
          </div>
          <h2 className={styles.title}>The Collection</h2>
          <p className={styles.subtitle}>
            Explore the photographic world of 24 Frames. Touch or hover any frame in the lineup to transform
            the composition, or view the complete 24-frame archival matrix below.
          </p>
        </div>

        {/* ── EXPERIENCE 2: TRANSFORMING PHOTOGRAPHIC LINEUP (Reference 2) ── */}
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
                  aria-expanded={isSelected}
                  aria-label={`${item.title} — Frame ${item.frameNo}`}
                >
                  {/* Background Color Base */}
                  <div className={styles.panelColorBase} />

                  {/* Panel Photography */}
                  {item.image && (
                    <div className={styles.panelImageWrap}>
                      <img
                        src={item.image}
                        alt={item.title}
                        className={styles.panelImage}
                        loading="lazy"
                      />
                      <div className={styles.panelVignette} />
                    </div>
                  )}

                  {/* Collapsed State Spine (Vertical Title & Frame No) */}
                  <div className={styles.panelSpine}>
                    <span className={styles.spineFrameNo}>{item.frameNo}</span>
                    <span className={styles.spineTitle}>{item.title}</span>
                  </div>

                  {/* Expanded State Full Card Content */}
                  <div className={styles.panelExpandedContent}>
                    <div className={styles.expandedTopRow}>
                      <span className={styles.expandedFrameNo}>{item.frameNo}</span>
                      <span className={styles.expandedCategory}>{item.category}</span>
                    </div>

                    <h3 className={styles.expandedTitle}>{item.title}</h3>
                    <p className={styles.expandedMeta}>
                      <span>{item.location}</span> · <span>{item.gear}</span>
                    </p>

                    <div className={styles.expandedActions}>
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
                            setSelectedLightboxTile(item);
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

        {/* ── COMPLETE 24-FRAME CONTACT MATRIX (6 Columns × 4 Rows) ── */}
        <div className={styles.matrixSection}>
          <div className={styles.matrixHeader}>
            <div className={styles.matrixTitleGroup}>
              <h3 className={styles.matrixTitle}>The Complete 24-Frame Matrix</h3>
              <p className={styles.matrixDesc}>
                All twenty-four archival frames arranged in original forest-green to warm-ivory sequence.
              </p>
            </div>

            {/* Filter Pills */}
            <div className={styles.filters} role="tablist">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.key}
                  role="tab"
                  aria-selected={activeCategory === cat.key}
                  className={`${styles.filterBtn} ${
                    activeCategory === cat.key ? styles.filterBtnActive : ""
                  }`}
                  onClick={() => setActiveCategory(cat.key)}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* 6x4 Grid Container */}
          <div ref={gridRef} className={styles.grid}>
            {filteredTiles.map((tile) => {
              const isLogoTile = tile.id === 24;
              const isHovered = hoveredGridTileId === tile.id;

              if (isLogoTile) {
                return (
                  <Link
                    key={tile.id}
                    href="/identity"
                    className={`${styles.gridTile} ${styles.logoGridTile}`}
                    aria-label="24 Frames — Visit dedicated brand identity page"
                  >
                    <div className={styles.logoTileContent}>
                      <span className={styles.logoBadge}>FRAME 24/24</span>
                      <span className={styles.logoTitle}>24 FRAMES</span>
                      <span className={styles.logoSub}>The Brand Story →</span>
                    </div>
                  </Link>
                );
              }

              return (
                <div
                  key={tile.id}
                  className={`${styles.gridTile} ${isHovered ? styles.gridTileHovered : ""}`}
                  style={{ "--tile-accent": tile.color } as React.CSSProperties}
                  onMouseEnter={() => setHoveredGridTileId(tile.id)}
                  onMouseLeave={() => setHoveredGridTileId(null)}
                  onClick={() => setSelectedLightboxTile(tile)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setSelectedLightboxTile(tile);
                    }
                  }}
                  aria-label={`${tile.title} — Frame ${tile.frameNo}`}
                >
                  {tile.image ? (
                    <div className={styles.gridImageWrap}>
                      <img
                        src={tile.image}
                        alt={tile.title}
                        className={styles.gridImage}
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div
                      className={styles.gridColorWrap}
                      style={{ backgroundColor: tile.color }}
                    />
                  )}

                  <div className={styles.gridTileFooter}>
                    <span className={styles.gridFrameNo}>{tile.frameNo}</span>
                    <span className={styles.gridTitleText}>{tile.title}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── 35MM FILM REEL LIGHTBOX MODAL (Light Theme) ────────────── */}
      {selectedLightboxTile && (
        <div
          className={styles.modalBackdrop}
          onClick={() => setSelectedLightboxTile(null)}
          role="dialog"
          aria-modal="true"
          aria-label={selectedLightboxTile.title}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.modalCloseBtn}
              onClick={() => setSelectedLightboxTile(null)}
              aria-label="Close frame preview"
            >
              ✕
            </button>

            <div className={styles.modalLayout}>
              <div className={styles.modalImageWrap}>
                <img
                  src={selectedLightboxTile.image}
                  alt={selectedLightboxTile.title}
                  className={styles.modalImage}
                />
              </div>

              <div className={styles.modalSidebar}>
                <div className={styles.modalHeaderStrip}>
                  <span className={styles.modalFrameNo}>
                    FRAME {selectedLightboxTile.frameNo}
                  </span>
                  <span className={styles.modalCategory}>
                    {selectedLightboxTile.category.toUpperCase()}
                  </span>
                </div>

                <h3 className={styles.modalTitle}>{selectedLightboxTile.title}</h3>
                <p className={styles.modalLocation}>{selectedLightboxTile.location}</p>

                <div className={styles.specBox}>
                  <div className={styles.specRow}>
                    <span className={styles.specLabel}>Optical Gear</span>
                    <span className={styles.specVal}>{selectedLightboxTile.gear}</span>
                  </div>
                  <div className={styles.specRow}>
                    <span className={styles.specLabel}>Color Emulsion</span>
                    <span className={styles.specVal}>24F Custom Warm Curve</span>
                  </div>
                  <div className={styles.specRow}>
                    <span className={styles.specLabel}>Curator</span>
                    <span className={styles.specVal}>Phani Gogireddy</span>
                  </div>
                </div>

                <div className={styles.modalActions}>
                  {selectedLightboxTile.projectSlug ? (
                    <Link
                      href={`/work/${selectedLightboxTile.projectSlug}`}
                      className={styles.modalStoryBtn}
                      onClick={() => setSelectedLightboxTile(null)}
                    >
                      Step Inside Project Archive →
                    </Link>
                  ) : (
                    <a
                      href="/#inquire"
                      className={styles.modalStoryBtn}
                      onClick={() => setSelectedLightboxTile(null)}
                    >
                      Inquire About This Work →
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
