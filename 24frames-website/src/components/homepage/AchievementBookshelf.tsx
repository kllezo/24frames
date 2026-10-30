"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useScrollLock } from "@/lib/scrollLock";
import styles from "./AchievementBookshelf.module.css";

gsap.registerPlugin(ScrollTrigger);

/* ── Achievement Data (verified from research) ── */
interface Achievement {
  id: string;
  type: "award" | "partnership" | "publication" | "testimonial";
  title: string;
  organization: string;
  year: string;
  citation: string;
  description: string;
  image: string;
  linkUrl?: string;
  linkText?: string;
  shelf: number; // 0 = top shelf, 1 = middle, 2 = bottom
  color: string;
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: "et-award",
    type: "award",
    title: "ET Excellence Award 2025",
    organization: "The Times of India / ET Now",
    year: "2025",
    citation: "Excellence in Luxury Wedding Photography",
    description: "Honoured at Novotel HICC, Hyderabad. Guest of Honour: Dia Mirza. Presented before an audience of industry leaders and cultural luminaries for consistent excellence in luxury wedding photography and cinematic storytelling.",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80&auto=format",
    linkUrl: "https://www.youtube.com/shorts/Lh45ZBRJ1b8",
    linkText: "Watch ceremony →",
    shelf: 0,
    color: "#164B40",
  },
  {
    id: "nikon",
    type: "partnership",
    title: "Official Nikon India Partner",
    organization: "Nikon India Private Limited",
    year: "2023",
    citation: "National Creator Alliance",
    description: "Recognised as an established name in wedding photography across Andhra Pradesh and Telangana. Testing and advocating flagship Z-series cinema and optical hardware as an official Nikon India Influencer.",
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&q=80&auto=format",
    linkUrl: "https://www.instagram.com/p/CqovGPUoPle/",
    linkText: "View announcement →",
    shelf: 0,
    color: "#C8A84E",
  },
  {
    id: "wedmegood",
    type: "publication",
    title: "5.0 / 5.0 Flawless Client Score",
    organization: "WedMeGood Verified Platform",
    year: "2015–2026",
    citation: "28 Verified Client Critiques",
    description: "Twenty-eight comprehensive client reviews spanning nine consecutive wedding seasons. Unbroken 5.0 five-star rating across consistency, conduct, and visual delivery on India's premier wedding directory.",
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80&auto=format",
    linkUrl: "https://www.wedmegood.com/profile/24framesphotography-174332",
    linkText: "View profile →",
    shelf: 1,
    color: "#2E6F62",
  },
  {
    id: "indigo",
    type: "award",
    title: "IndiGo #NoFilter Winner",
    organization: "IndiGo Airlines National Juried Contest",
    year: "2019",
    citation: "Pure Optical Storytelling",
    description: "National reality competition celebrating pure, unmanipulated optical storytelling and cultural street documentation without synthetic retouching. Won through raw framing talent and documentary vision.",
    image: "https://images.unsplash.com/photo-1504151932400-72d4384f04b3?w=800&q=80&auto=format",
    shelf: 1,
    color: "#4D8F80",
  },
  {
    id: "natgeo",
    type: "partnership",
    title: "National Geographic Contributor",
    organization: "National Geographic India & JK Tyre",
    year: "2020",
    citation: "Mega Icons Series",
    description: "Contributed documentary cinema footage and production photography to the Mega Icons television documentary series broadcast nationally on National Geographic India.",
    image: "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=800&q=80&auto=format",
    shelf: 2,
    color: "#A6B0A3",
  },
  {
    id: "visionary-ceo",
    type: "award",
    title: "Visionary CEO Award",
    organization: "Hyderabad Photo Trade Expo",
    year: "2024",
    citation: "Creative Entrepreneurship & Industry Leadership",
    description: "Keynote speaker and honoree for scaling profitable photography businesses and integrating cinema camera workflows into commercial wedding studios across South India.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80&auto=format",
    shelf: 2,
    color: "#77766E",
  },
];

const TYPE_LABELS: Record<string, string> = {
  award: "JURIED AWARD",
  partnership: "INDUSTRY PARTNERSHIP",
  publication: "INDEPENDENT AUDIT",
  testimonial: "CLIENT TESTIMONIAL",
};

const TYPE_ICONS: Record<string, string> = {
  award: "◆",
  partnership: "◇",
  publication: "▣",
  testimonial: "❝",
};

export default function AchievementBookshelf() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const shelfRef = useRef<HTMLDivElement>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  useScrollLock(expandedId !== null);
  const expandedRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});

  /* ── Scroll entrance ── */
  useEffect(() => {
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(headerRef.current,
        { y: 35, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: "power2.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%", toggleActions: "play none none reverse" }
        }
      );

      // Shelves reveal with stagger
      const shelves = gsap.utils.toArray<HTMLElement>(`.${styles.shelf}`);
      shelves.forEach((shelf, i) => {
        gsap.fromTo(shelf,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, delay: i * 0.15, ease: "power3.out",
            scrollTrigger: { trigger: shelf, start: "top 85%", toggleActions: "play none none reverse" }
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const closeItem = useCallback(() => {
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (isReduced || !expandedRef.current) {
      setExpandedId(null);
      return;
    }

    gsap.to(expandedRef.current, {
      opacity: 0, scale: 0.92, y: 20,
      duration: 0.3, ease: "power2.in",
      onComplete: () => setExpandedId(null),
    });
  }, []);

  /* ── Pull item from shelf ── */
  const pullItem = useCallback((id: string) => {
    if (expandedId === id) {
      // Close - return to shelf
      closeItem();
      return;
    }

    setExpandedId(id);

    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReduced) return;

    // Animate the expanded view in
    requestAnimationFrame(() => {
      if (expandedRef.current) {
        gsap.fromTo(expandedRef.current,
          { opacity: 0, scale: 0.9, y: 30 },
          { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "power3.out" }
        );
      }
    });
  }, [expandedId, closeItem]);

  /* ── Escape key ── */
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && expandedId) closeItem();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [expandedId, closeItem]);

  const expandedItem = ACHIEVEMENTS.find((a) => a.id === expandedId);

  // Group by shelf
  const shelves = [0, 1, 2].map((shelfNo) =>
    ACHIEVEMENTS.filter((a) => a.shelf === shelfNo)
  );

  return (
    <section
      ref={sectionRef}
      id="recognition"
      className={styles.section}
      aria-label="Proven Legacy — Achievement Bookshelf"
    >
      <div className={styles.container}>
        <div ref={headerRef} className={styles.header}>
          <div className={styles.headerMeta}>
            <span className={styles.label}>Proven Legacy</span>
            <span className={styles.citationBadge}>Verified Portfolio Citations</span>
          </div>
          <h2 className={styles.title}>Earned, Not Claimed</h2>
          <p className={styles.subtitle}>
            Independent honors, national media partnerships, and fourteen years of documented client trust.
            Select any item from the shelf to examine it closer.
          </p>
        </div>

        {/* ── The Bookshelf ── */}
        <div ref={shelfRef} className={styles.bookshelf}>
          {shelves.map((shelfItems, shelfIndex) => (
            <div key={shelfIndex} className={styles.shelf}>
              <div className={styles.shelfSurface}>
                {shelfItems.map((item) => {
                  const isPulled = expandedId === item.id;
                  return (
                    <div
                      key={item.id}
                      ref={(el) => { itemRefs.current[item.id] = el; }}
                      className={`${styles.shelfItem} ${isPulled ? styles.shelfItemPulled : ""}`}
                      onClick={() => pullItem(item.id)}
                      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") pullItem(item.id); }}
                      role="button"
                      tabIndex={0}
                      aria-expanded={isPulled}
                      aria-label={`${item.title} — ${item.organization}`}
                      style={{ "--item-color": item.color } as React.CSSProperties}
                    >
                      {/* Book/Frame visual */}
                      <div className={styles.itemVisual}>
                        {item.image ? (
                          <img src={item.image} alt="" className={styles.itemImage} loading="lazy" />
                        ) : (
                          <div className={styles.itemColorBlock} style={{ background: item.color }} />
                        )}
                        <div className={styles.itemSpine} style={{ background: item.color }}>
                          <span className={styles.spineIcon}>{TYPE_ICONS[item.type]}</span>
                        </div>
                      </div>

                      {/* Label under item */}
                      <div className={styles.itemLabel}>
                        <span className={styles.itemType}>{TYPE_LABELS[item.type]}</span>
                        <span className={styles.itemTitle}>{item.title}</span>
                        <span className={styles.itemYear}>{item.year}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* Shelf ledge */}
              <div className={styles.shelfLedge} />
            </div>
          ))}
        </div>

        {/* ── Expanded Article View ── */}
        {expandedItem && (
          <div className={styles.expandedBackdrop} onClick={closeItem}>
            <div
              ref={expandedRef}
              className={styles.expandedCard}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label={expandedItem.title}
            >
              <button
                className={styles.closeBtn}
                onClick={closeItem}
                aria-label="Return item to shelf"
              >
                ✕
              </button>

              <div className={styles.expandedLayout}>
                {expandedItem.image && (
                  <div className={styles.expandedImageWrap}>
                    <img
                      src={expandedItem.image}
                      alt={expandedItem.title}
                      className={styles.expandedImage}
                    />
                  </div>
                )}

                <div className={styles.expandedContent}>
                  <div className={styles.expandedBadgeRow}>
                    <span className={styles.expandedType} style={{ color: expandedItem.color }}>
                      {TYPE_ICONS[expandedItem.type]} {TYPE_LABELS[expandedItem.type]}
                    </span>
                    <span className={styles.expandedYear}>{expandedItem.year}</span>
                  </div>

                  <h3 className={styles.expandedTitle}>{expandedItem.title}</h3>
                  <p className={styles.expandedOrg}>{expandedItem.organization}</p>
                  <p className={styles.expandedCitation}>{expandedItem.citation}</p>

                  <div className={styles.expandedDivider} />

                  <p className={styles.expandedDesc}>{expandedItem.description}</p>

                  {expandedItem.linkUrl && (
                    <a
                      href={expandedItem.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.expandedLink}
                    >
                      {expandedItem.linkText || "View source →"}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className={styles.shelfFooter}>
          <Link href="/#artist" className={styles.viewAll}>
            Discover the artist behind the lens
            <span className={styles.arrow}>↓</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
