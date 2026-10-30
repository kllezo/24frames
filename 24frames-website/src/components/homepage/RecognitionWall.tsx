"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./RecognitionWall.module.css";

gsap.registerPlugin(ScrollTrigger);

interface RecognitionItem {
  id: string;
  type: "award" | "partnership" | "directory_badge" | "testimonial";
  title: string;
  organization: string;
  year: string;
  citation: string;
  description: string;
  image: string;
  size: "large" | "medium" | "small";
}

const ITEMS: RecognitionItem[] = [
  {
    id: "et-award",
    type: "award",
    title: "ET Excellence Award 2025",
    organization: "The Times of India / ET Now",
    year: "2025",
    citation: "AWD-001 · Novotel HICC, Hyderabad",
    description:
      "Honoured for Excellence in Luxury Wedding Photography. Presented by actor Dia Mirza before an audience of industry leaders and cultural luminaries.",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80&auto=format",
    size: "large",
  },
  {
    id: "nikon",
    type: "partnership",
    title: "Official Nikon India Partner",
    organization: "Nikon India Private Limited",
    year: "2023",
    citation: "AWD-002 · National Creator Alliance",
    description:
      "Recognised as an established name in wedding photography across Andhra Pradesh and Telangana, testing flagship Z-series cinema and optical hardware.",
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&q=80&auto=format",
    size: "medium",
  },
  {
    id: "wedmegood",
    type: "directory_badge",
    title: "5.0 / 5.0 Flawless Client Score",
    organization: "WedMeGood Verified Platform",
    year: "2015–2026",
    citation: "DIR-001 · 28 Verified Client Critiques",
    description:
      "Twenty-eight comprehensive client reviews spanning nine consecutive wedding seasons. Unbroken 5.0 five-star rating across consistency, conduct, and visual delivery.",
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80&auto=format",
    size: "medium",
  },
  {
    id: "indigo",
    type: "award",
    title: "IndiGo #NoFilter Winner",
    organization: "IndiGo Airlines National Juried Contest",
    year: "2019",
    citation: "AWD-003 · Pure Optical Storytelling",
    description:
      "National reality competition celebrating pure, unmanipulated optical storytelling and cultural street documentation without synthetic retouching.",
    image: "https://images.unsplash.com/photo-1504151932400-72d4384f04b3?w=800&q=80&auto=format",
    size: "small",
  },
  {
    id: "natgeo",
    type: "partnership",
    title: "National Geographic Contributor",
    organization: "National Geographic India & JK Tyre",
    year: "2020",
    citation: "AWD-004 · Mega Icons Series",
    description:
      "Contributed documentary cinema footage and production photography to the Mega Icons television documentary series broadcast nationally.",
    image: "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=800&q=80&auto=format",
    size: "small",
  },
  {
    id: "testimonial-1",
    type: "testimonial",
    title: "\"Phani and his team captured our wedding like a high-budget Telugu movie.\"",
    organization: "Verified Client · WedMeGood Review",
    year: "2024",
    citation: "TST-001 · Heritage Wedding Review",
    description:
      "The teaser brought tears to my parents' eyes. The background score and slow-motion shots of the Talambralu were beyond what we imagined. They never forced poses; they preserved the sacred rhythm.",
    image: "",
    size: "medium",
  },
];

const TYPE_LABELS: Record<string, string> = {
  award: "JURIED AWARD",
  partnership: "INDUSTRY PARTNERSHIP",
  directory_badge: "INDEPENDENT AUDIT",
  testimonial: "CLIENT TESTIMONIAL",
};

export default function RecognitionWall() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const wallRef = useRef<HTMLDivElement>(null);
  const [expandedId, setExpandedId] = useState<string | null>("et-award");

  useEffect(() => {
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReduced) return;

    const ctx = gsap.context(() => {
      // 1. Header reveal
      gsap.fromTo(
        headerRef.current,
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // 2. Exhibition Wall cards with alternating depth parallax
      const cards = gsap.utils.toArray<HTMLElement>(`.${styles.card}`);
      cards.forEach((card, index) => {
        const isOdd = index % 2 === 1;
        gsap.fromTo(
          card,
          { opacity: 0, y: isOdd ? 45 : 25, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.0,
            delay: (index % 3) * 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );

        // Salon Parallax Scrub
        gsap.to(card, {
          y: isOdd ? -20 : 15,
          ease: "none",
          scrollTrigger: {
            trigger: wallRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="recognition"
      className={styles.section}
      aria-label="Recognition & Legacy"
    >
      <div className={styles.container}>
        <div ref={headerRef} className={styles.header}>
          <div className={styles.headerMeta}>
            <span className={styles.label}>Proven Legacy</span>
            <span className={styles.citationBadge}>Verified Portfolio Citations</span>
          </div>
          <h2 className={styles.title}>Earned, not claimed</h2>
          <p className={styles.subtitle}>
            Independent honors, national media partnerships, and fourteen years of documented client trust.
          </p>
        </div>

        {/* Salon Exhibition Wall */}
        <div ref={wallRef} className={styles.wall}>
          {ITEMS.map((item) => {
            const isExpanded = expandedId === item.id;

            return (
              <div
                key={item.id}
                className={`${styles.card} ${styles[`size_${item.size}`]} ${
                  styles[`type_${item.type}`]
                } ${isExpanded ? styles.cardExpanded : ""}`}
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setExpandedId(isExpanded ? null : item.id);
                  }
                }}
                aria-expanded={isExpanded}
                aria-label={`${item.title} — ${item.organization}`}
              >
                {item.image && (
                  <div className={styles.cardImageWrap}>
                    <img
                      src={item.image}
                      alt=""
                      className={styles.cardBg}
                      loading="lazy"
                      aria-hidden="true"
                    />
                    <div className={styles.cardVignette} />
                  </div>
                )}

                <div className={styles.cardContent}>
                  <div className={styles.cardTopStrip}>
                    <span className={styles.cardType}>{TYPE_LABELS[item.type]}</span>
                    {item.year && <span className={styles.cardYear}>{item.year}</span>}
                  </div>

                  <h3 className={styles.cardTitle}>{item.title}</h3>
                  <p className={styles.cardOrg}>{item.organization}</p>
                  <span className={styles.cardCitation}>{item.citation}</span>

                  <div className={styles.cardBody}>
                    <p className={styles.cardDesc}>{item.description}</p>
                    <span className={styles.expandPrompt}>
                      {isExpanded ? "Collapse citation −" : "Read full citation +"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className={styles.footer}>
          <Link href="/#artist" className={styles.viewAll}>
            Discover the artist behind the lens
            <span className={styles.arrow}>↓</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
