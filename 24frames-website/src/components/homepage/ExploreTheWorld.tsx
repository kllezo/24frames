"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./ExploreTheWorld.module.css";

gsap.registerPlugin(ScrollTrigger);

interface CategoryWorld {
  id: string;
  number: string;
  label: string;
  count: string;
  tagline: string;
  description: string;
  mainImage: string;
  secondaryImage: string;
  href: string;
}

const WORLDS: CategoryWorld[] = [
  {
    id: "weddings",
    number: "01",
    label: "Weddings & Royal Unions",
    count: "40+ Master Stories",
    tagline: "Sacred Telugu traditions, royal muhurthams & emotional generational tears.",
    description: "Multi-day coverage spanning Mangalasnanam, Sangeet galas, and dawn ceremonies. Documented without invasive lighting or forced poses.",
    mainImage: "https://images.unsplash.com/photo-1519741497674-611481863552?w=2000&q=88&auto=format",
    secondaryImage: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1000&q=85&auto=format",
    href: "/#vows",
  },
  {
    id: "portraits",
    number: "02",
    label: "Celebrities & Portraits",
    count: "15+ Character Studies",
    tagline: "High-fashion bridal couture, Tollywood actors, and private family patriarchs.",
    description: "Medium-format optical portraits lit with master cinema fixtures. Preserving quiet dignity and sculptural elegance.",
    mainImage: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=2000&q=88&auto=format",
    secondaryImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1000&q=85&auto=format",
    href: "/#vows",
  },
  {
    id: "events",
    number: "03",
    label: "Events & Cultural Galas",
    count: "20+ Grand Celebrations",
    tagline: "High-octane Sangeet stages, milestone anniversaries, and national events.",
    description: "Capturing the electric choreography, live orchestral music, and grand architectural ambiance of premier venues.",
    mainImage: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=2000&q=88&auto=format",
    secondaryImage: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1000&q=85&auto=format",
    href: "/#vows",
  },
  {
    id: "fashion",
    number: "04",
    label: "Fashion & Editorial",
    count: "10+ Editorial Spreads",
    tagline: "Bespoke designer lookbooks and high-jewelry editorial campaigns.",
    description: "Crafted for prestigious publications and couture designers, combining experimental art direction with sharp optical discipline.",
    mainImage: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=2000&q=88&auto=format",
    secondaryImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1000&q=85&auto=format",
    href: "/#vows",
  },
  {
    id: "films",
    number: "05",
    label: "Cinema & Feature Films",
    count: "50+ Anamorphic Films",
    tagline: "2.39:1 Anamorphic motion pictures paired with orchestral audio scores.",
    description: "Shot with dedicated cinema crews on ARRI and Sony FX cinema lines. Edited as theatrical-grade wedding features.",
    mainImage: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=2000&q=88&auto=format",
    secondaryImage: "https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=1000&q=85&auto=format",
    href: "/#vows",
  },
  {
    id: "archive",
    number: "06",
    label: "The Complete Archive",
    count: "500+ Commissions",
    tagline: "Fourteen years of optical storytelling across South India and abroad.",
    description: "A continuous visual lineage established in 2012 by founder Phani Gogireddy.",
    mainImage: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=2000&q=88&auto=format",
    secondaryImage: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1000&q=85&auto=format",
    href: "/#vows",
  },
];

export default function ExploreTheWorld() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [activeWorld, setActiveWorld] = useState<CategoryWorld>(WORLDS[0]);

  useEffect(() => {
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReduced) return;

    const ctx = gsap.context(() => {
      // 1. Header entrance
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

      // 2. Stage entrance
      gsap.fromTo(
        stageRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: stageRef.current,
            start: "top 80%",
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
      id="explore"
      className={styles.section}
      aria-label="Discover the World of 24 Frames — Editorial Disciplines"
    >
      <div className={styles.container}>
        {/* Section Header */}
        <div ref={headerRef} className={styles.header}>
          <span className={styles.label}>Chapter 04 — Editorial Disciplines</span>
          <h2 className={styles.title}>Discover the World of 24 Frames</h2>
          <p className={styles.subtitle}>
            From intimate Vedic rituals to high-fashion spreads and cinematic master films.
          </p>
        </div>

        {/* ── Immersive Interactive Stage ── */}
        <div ref={stageRef} className={styles.stage}>
          {/* Monumental Active Photography Display */}
          <div className={styles.monumentalDisplay}>
            <div className={styles.displayImgWrap}>
              <img
                key={activeWorld.id}
                src={activeWorld.mainImage}
                alt={activeWorld.label}
                className={styles.displayImg}
              />
              <div className={styles.displayVignette} />
            </div>

            {/* Floating Supporting Detail Still */}
            <div className={styles.floatingStillWrap} aria-hidden="true">
              <img
                key={`sec-${activeWorld.id}`}
                src={activeWorld.secondaryImage}
                alt=""
                className={styles.floatingStill}
              />
              <span className={styles.floatingLabel}>OPTICAL STILL</span>
            </div>

            {/* Display Editorial Metadata Overlay */}
            <div className={styles.displayOverlay}>
              <div className={styles.displayTags}>
                <span className={styles.worldNumber}>{activeWorld.number}</span>
                <span className={styles.worldCountBadge}>{activeWorld.count}</span>
              </div>
              <h3 className={styles.worldTitle}>{activeWorld.label}</h3>
              <p className={styles.worldTagline}>{activeWorld.tagline}</p>
              <p className={styles.worldDesc}>{activeWorld.description}</p>
              <a href={activeWorld.href} className={styles.worldCta}>
                Explore {activeWorld.label} <span className={styles.arrow}>→</span>
              </a>
            </div>
          </div>

          {/* Interactive Category Selector Rail */}
          <nav className={styles.categoryRail} aria-label="Select photographic discipline">
            <span className={styles.railHeader}>DISCIPLINE INDEX</span>
            <div className={styles.railList}>
              {WORLDS.map((world) => {
                const isActive = activeWorld.id === world.id;

                return (
                  <button
                    key={world.id}
                    className={`${styles.railItem} ${isActive ? styles.railItemActive : ""}`}
                    onClick={() => setActiveWorld(world)}
                    onMouseEnter={() => setActiveWorld(world)}
                    aria-selected={isActive}
                    role="tab"
                  >
                    <span className={styles.railNumber}>{world.number}</span>
                    <div className={styles.railInfo}>
                      <span className={styles.railLabel}>{world.label}</span>
                      <span className={styles.railCount}>{world.count}</span>
                    </div>
                    <span className={styles.railIndicator} aria-hidden="true">→</span>
                  </button>
                );
              })}
            </div>
          </nav>
        </div>
      </div>
    </section>
  );
}
