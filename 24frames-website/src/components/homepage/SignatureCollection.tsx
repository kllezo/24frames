"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./SignatureCollection.module.css";

gsap.registerPlugin(ScrollTrigger);

export interface ArchivePhotoItem {
  id: string;
  title: string;
  category: string;
  location: string;
  year: string;
  image: string;
  slug: string;
  aspectRatio: string;
  width: string;
}

/* ── Authentic Project Imagery Curated for Track 1 (Moving Left) ── */
const TRACK_1_ITEMS: ArchivePhotoItem[] = [
  {
    id: "t1-1",
    title: "A Royal Union",
    category: "Celebrity Wedding",
    location: "Hyderabad",
    year: "2024",
    image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1000&q=85&auto=format",
    slug: "bellamkonda-kavya",
    aspectRatio: "16 / 10",
    width: "350px",
  },
  {
    id: "t1-2",
    title: "Taj Falaknama",
    category: "Palace Commission",
    location: "Falaknama Palace",
    year: "2024",
    image: "https://images.unsplash.com/photo-1585071550721-fdb362ae2b8a?w=1000&q=85&auto=format",
    slug: "karthik-vijayalakshmi",
    aspectRatio: "4 / 5",
    width: "250px",
  },
  {
    id: "t1-3",
    title: "Temple Grandeur",
    category: "Heritage Union",
    location: "Chilkur Estate",
    year: "2024",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1000&q=85&auto=format",
    slug: "manoj-snigdha",
    aspectRatio: "3 / 2",
    width: "330px",
  },
  {
    id: "t1-4",
    title: "Cross-Cultural",
    category: "Destination Wedding",
    location: "Tuscany & Hyderabad",
    year: "2023",
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1000&q=85&auto=format",
    slug: "divya-federico",
    aspectRatio: "16 / 10",
    width: "350px",
  },
  {
    id: "t1-5",
    title: "Grand Sangeet",
    category: "Festival Celebration",
    location: "ITC Kohenur",
    year: "2024",
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1000&q=85&auto=format",
    slug: "bellamkonda-kavya",
    aspectRatio: "3 / 2",
    width: "320px",
  },
  {
    id: "t1-6",
    title: "Sacred Ceremony",
    category: "Vedic Vows",
    location: "Bengaluru",
    year: "2023",
    image: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1000&q=85&auto=format",
    slug: "dhamini-goutham",
    aspectRatio: "4 / 5",
    width: "250px",
  },
];

/* ── Authentic Project Imagery Curated for Track 2 (Moving Right) ── */
const TRACK_2_ITEMS: ArchivePhotoItem[] = [
  {
    id: "t2-1",
    title: "Midnight Vratham",
    category: "Atmospheric Fire",
    location: "Heritage Pavilion",
    year: "2024",
    image: "https://images.unsplash.com/photo-1604017011826-d3b4c23f8914?w=1000&q=85&auto=format",
    slug: "manoj-snigdha",
    aspectRatio: "4 / 5",
    width: "250px",
  },
  {
    id: "t2-2",
    title: "Grand Arrival",
    category: "Royal Entourage",
    location: "Novotel HICC",
    year: "2023",
    image: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1000&q=85&auto=format",
    slug: "divya-federico",
    aspectRatio: "16 / 10",
    width: "350px",
  },
  {
    id: "t2-3",
    title: "Pre-Wedding Dawn",
    category: "Sanctuary Dawn",
    location: "Ananthagiri Hills",
    year: "2024",
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1000&q=85&auto=format",
    slug: "karthik-vijayalakshmi",
    aspectRatio: "3 / 4",
    width: "260px",
  },
  {
    id: "t2-4",
    title: "Bridal Portrait",
    category: "Editorial Couture",
    location: "Hyderabad",
    year: "2024",
    image: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=1000&q=85&auto=format",
    slug: "bellamkonda-kavya",
    aspectRatio: "4 / 5",
    width: "250px",
  },
  {
    id: "t2-5",
    title: "Twilight Garden",
    category: "Garden Pavilion",
    location: "The Tamarind Tree",
    year: "2023",
    image: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=1000&q=85&auto=format",
    slug: "dhamini-goutham",
    aspectRatio: "16 / 9",
    width: "350px",
  },
  {
    id: "t2-6",
    title: "Sacred Vows",
    category: "Timeless Emotion",
    location: "Tirupati",
    year: "2024",
    image: "https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=1000&q=85&auto=format",
    slug: "bellamkonda-kavya",
    aspectRatio: "3 / 2",
    width: "320px",
  },
];

export default function SignatureCollection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const [isTabHidden, setIsTabHidden] = useState(false);

  /* ── Pause movement when page is not visible ────────────────── */
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabHidden(document.hidden);
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

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

  return (
    <section
      ref={sectionRef}
      id="work"
      className={styles.section}
      aria-label="Featured Work — The Moving Editorial Archive"
    >
      <div className={styles.container}>
        {/* Section Header */}
        <div ref={headerRef} className={styles.header}>
          <div className={styles.headerMeta}>
            <span className={styles.label}>Chapter 03 — Featured Commissions</span>
            <span className={styles.archiveBadge}>MOVING ARCHIVE</span>
          </div>
          <h2 className={styles.title}>Featured Work</h2>
          <p className={styles.subtitle}>
            A curated moving archive of celebrated wedding films, royal unions, and commissioned celebrations.
          </p>
        </div>
      </div>

      {/* ── THE MOVING EDITORIAL ARCHIVE (Two Opposing Horizontal Tracks) ── */}
      <div
        ref={stageRef}
        className={`${styles.archiveStage} ${isTabHidden ? styles.stagePaused : ""}`}
        aria-label="Moving photographic archive"
      >
        {/* Track 1: Glides Left */}
        <div
          className={styles.trackWrapper}
          tabIndex={0}
          aria-label="Curated collection — Track 1, moving left. Hover or focus to pause."
        >
          <div className={`${styles.trackRibbon} ${styles.ribbonLeft}`}>
            {/* Primary sequence */}
            {TRACK_1_ITEMS.map((item) => (
              <Link
                key={item.id}
                href={`/work/${item.slug}`}
                className={styles.photoCard}
                style={{ width: item.width }}
                aria-label={`${item.title} — ${item.category}, ${item.location}`}
              >
                <div
                  className={styles.imageContainer}
                  style={{ aspectRatio: item.aspectRatio }}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className={styles.photoImg}
                    loading="lazy"
                  />
                </div>
                <div className={styles.photoCaption}>
                  <span className={styles.photoTitle}>{item.title}</span>
                  <span className={styles.photoMeta}>
                    {item.category} · {item.year}
                  </span>
                </div>
              </Link>
            ))}

            {/* Seamless loop duplicate sequence (hidden from screen reader redundancy) */}
            {TRACK_1_ITEMS.map((item) => (
              <Link
                key={`dup-${item.id}`}
                href={`/work/${item.slug}`}
                className={styles.photoCard}
                style={{ width: item.width }}
                aria-hidden="true"
                tabIndex={-1}
              >
                <div
                  className={styles.imageContainer}
                  style={{ aspectRatio: item.aspectRatio }}
                >
                  <img
                    src={item.image}
                    alt=""
                    className={styles.photoImg}
                    loading="lazy"
                  />
                </div>
                <div className={styles.photoCaption}>
                  <span className={styles.photoTitle}>{item.title}</span>
                  <span className={styles.photoMeta}>
                    {item.category} · {item.year}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Track 2: Glides Right */}
        <div
          className={styles.trackWrapper}
          tabIndex={0}
          aria-label="Curated collection — Track 2, moving right. Hover or focus to pause."
        >
          <div className={`${styles.trackRibbon} ${styles.ribbonRight}`}>
            {/* Primary sequence */}
            {TRACK_2_ITEMS.map((item) => (
              <Link
                key={item.id}
                href={`/work/${item.slug}`}
                className={styles.photoCard}
                style={{ width: item.width }}
                aria-label={`${item.title} — ${item.category}, ${item.location}`}
              >
                <div
                  className={styles.imageContainer}
                  style={{ aspectRatio: item.aspectRatio }}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className={styles.photoImg}
                    loading="lazy"
                  />
                </div>
                <div className={styles.photoCaption}>
                  <span className={styles.photoTitle}>{item.title}</span>
                  <span className={styles.photoMeta}>
                    {item.category} · {item.year}
                  </span>
                </div>
              </Link>
            ))}

            {/* Seamless loop duplicate sequence */}
            {TRACK_2_ITEMS.map((item) => (
              <Link
                key={`dup-${item.id}`}
                href={`/work/${item.slug}`}
                className={styles.photoCard}
                style={{ width: item.width }}
                aria-hidden="true"
                tabIndex={-1}
              >
                <div
                  className={styles.imageContainer}
                  style={{ aspectRatio: item.aspectRatio }}
                >
                  <img
                    src={item.image}
                    alt=""
                    className={styles.photoImg}
                    loading="lazy"
                  />
                </div>
                <div className={styles.photoCaption}>
                  <span className={styles.photoTitle}>{item.title}</span>
                  <span className={styles.photoMeta}>
                    {item.category} · {item.year}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
