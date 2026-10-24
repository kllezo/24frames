"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./SignatureCollection.module.css";

gsap.registerPlugin(ScrollTrigger);

export interface StackProject {
  id: number;
  frameNo: string;
  year: string;
  title: string;
  subtitle: string;
  category: string;
  location: string;
  image: string;
  slug: string;
  storyNote: string;
  gear: string;
  aspect: string;
}

const STACK_PROJECTS: StackProject[] = [
  {
    id: 1, frameNo: "FRAME 01/24", year: "2024",
    title: "A Royal Union", subtitle: "Bellamkonda Sai Sreenivas & Kavya Reddy",
    category: "Celebrity Wedding", location: "GMR Arena & Shamshabad Estate, Hyderabad",
    image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=2000&q=88&auto=format",
    slug: "bellamkonda-kavya",
    storyNote: "Over seventy hours of bespoke cinema coverage capturing three days of sacred Vedic rituals, high-profile dignitaries, and intimate family moments.",
    gear: "Sony FX6 Cinema Line · Zeiss Supreme Primes", aspect: "2.39:1 Cinema Anamorphic",
  },
  {
    id: 2, frameNo: "FRAME 02/24", year: "2024",
    title: "Temple Grandeur", subtitle: "Manoj & Snigdha",
    category: "Luxury Heritage Wedding", location: "Chilkur Balaji Heritage Pavilion, Hyderabad",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=2000&q=88&auto=format",
    slug: "manoj-snigdha",
    storyNote: "Bathed in marigolds, ancient Dravidian stone textures, and midnight Vratham sacred firelight without disruptive artificial lighting.",
    gear: "Nikon Z9 Flagship · 35mm f/1.8 S & 85mm f/1.2 S", aspect: "16:9 Cinema Wide",
  },
  {
    id: 3, frameNo: "FRAME 05/24", year: "2024",
    title: "Taj Falaknama", subtitle: "Karthik & Vijayalakshmi",
    category: "Royal Pre-Wedding & Palace Commission", location: "Taj Falaknama Palace, Hyderabad",
    image: "https://images.unsplash.com/photo-1585071550721-fdb362ae2b8a?w=2000&q=88&auto=format",
    slug: "karthik-vijayalakshmi",
    storyNote: "Composed within the Nizam's private marble colonnades and the monumental 101-seat mirror dining hall with aristocratic European poise.",
    gear: "Hasselblad X2D 100C · XCD 55V Medium Format", aspect: "4:5 Medium Format Fine-Art",
  },
  {
    id: 4, frameNo: "FRAME 16/24", year: "2023",
    title: "Cross-Cultural", subtitle: "Divya & Federico",
    category: "Destination Wedding", location: "Villa di Catignano, Tuscany & ITC Kohenur",
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=2000&q=88&auto=format",
    slug: "divya-federico",
    storyNote: "A cross-continental synthesis: Tuscan cypress hills meeting South Indian temple silk, jasmine garlands, and dual family ceremonies.",
    gear: "Cooke S4/i Primes · Sony FX6 Cinema", aspect: "2.39:1 Cinema Scope",
  },
  {
    id: 5, frameNo: "FRAME 04/24", year: "2023",
    title: "A Journey of Love", subtitle: "Dhamini & Goutham",
    category: "Wedding Film & Stills", location: "The Tamarind Tree Estate, Bengaluru",
    image: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=2000&q=88&auto=format",
    slug: "dhamini-goutham",
    storyNote: "Lush canopy foliage, brass urns, and open-sky mandapam courtyards crafted as a seamless cinematic poem.",
    gear: "Leica R Vintage Cinema Primes · Sony A1", aspect: "2.35:1 Anamorphic",
  },
];

/* Extra images for the thick perspective stacks */
const STACK_IMAGES = [
  "https://images.unsplash.com/photo-1604017011826-d3b4c23f8914?w=600&q=70&auto=format",
  "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=600&q=70&auto=format",
  "https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=600&q=70&auto=format",
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&q=70&auto=format",
  "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&q=70&auto=format",
  "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&q=70&auto=format",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=70&auto=format",
  "https://images.unsplash.com/photo-1513725673706-7b5609847580?w=600&q=70&auto=format",
  "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&q=70&auto=format",
  "https://images.unsplash.com/photo-1504151932400-72d4384f04b3?w=600&q=70&auto=format",
  "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&q=70&auto=format",
  "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=600&q=70&auto=format",
];

export default function SignatureCollection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const focalRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPulled, setIsPulled] = useState(true);

  const activeProject = STACK_PROJECTS[activeIndex];

  /* ── Scroll-triggered entrance ── */
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

      gsap.fromTo(stageRef.current,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 1.2, ease: "power3.out",
          scrollTrigger: { trigger: stageRef.current, start: "top 82%", toggleActions: "play none none reverse" }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  /* ── Select a project from the stack ── */
  const selectProject = useCallback((newIndex: number) => {
    if (newIndex === activeIndex) return;
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (isReduced) {
      setActiveIndex(newIndex);
      setIsPulled(true);
      return;
    }

    // Animate focal photo back into stack
    if (focalRef.current) {
      gsap.to(focalRef.current, {
        scale: 0.85, opacity: 0, y: 30,
        duration: 0.3, ease: "power2.in",
        onComplete: () => {
          setActiveIndex(newIndex);
          setIsPulled(true);
          // Pull new photo out
          gsap.fromTo(focalRef.current,
            { scale: 0.7, opacity: 0, y: -40, rotateY: 8 },
            { scale: 1, opacity: 1, y: 0, rotateY: 0, duration: 0.6, ease: "power3.out" }
          );
        },
      });
    }

    // Animate info
    if (infoRef.current) {
      gsap.to(infoRef.current, {
        opacity: 0, x: 20, duration: 0.2, ease: "power2.in",
        onComplete: () => {
          gsap.fromTo(infoRef.current,
            { opacity: 0, x: -20 },
            { opacity: 1, x: 0, duration: 0.45, delay: 0.15, ease: "power3.out" }
          );
        },
      });
    }
  }, [activeIndex]);

  return (
    <section
      ref={sectionRef}
      id="work"
      className={styles.section}
      aria-label="Featured Work — Photographic Archive Stacks"
    >
      <div className={styles.container}>
        {/* Section Header */}
        <div ref={headerRef} className={styles.header}>
          <div className={styles.headerMeta}>
            <span className={styles.label}>Chapter 03 — Featured Commissions</span>
            <span className={styles.stackBadge}>ARCHIVAL STACKS</span>
          </div>
          <h2 className={styles.title}>Our Strongest Work</h2>
          <p className={styles.subtitle}>
            Select any photograph from the archival stacks to pull it forward and explore the full project story.
          </p>
        </div>

        {/* ── 3D Archive Stage ── */}
        <div ref={stageRef} className={styles.archiveStage}>
          {/* Date & Branding Header */}
          <div className={styles.archiveHeader}>
            <div className={styles.datestamp}>
              <span className={styles.dateMain}>{activeProject.year}</span>
              <span className={styles.dateTime}>{activeProject.location}</span>
            </div>
            <span className={styles.archiveBrand}>every : frame</span>
          </div>

          <div className={styles.stacksViewport}>
            {/* ── Bottom-Left 3D Stack ── */}
            <div className={styles.stackCluster + " " + styles.stackBL}>
              {STACK_IMAGES.slice(0, 6).map((img, i) => (
                <div
                  key={`bl-${i}`}
                  className={styles.stackedSlice}
                  style={{
                    "--i": i,
                    backgroundImage: `url(${img})`,
                  } as React.CSSProperties}
                />
              ))}
            </div>

            {/* ── Focal Pulled Photo (Center) ── */}
            <div ref={focalRef} className={styles.focalPhoto}>
              <div className={styles.focalFrame}>
                <img
                  src={activeProject.image}
                  alt={`${activeProject.title} — ${activeProject.subtitle}`}
                  className={styles.focalImage}
                  loading="eager"
                />
                <div className={styles.focalShadow} />
              </div>

              {/* Pull-out metadata beneath photo */}
              <div className={styles.pullMeta}>
                <span className={styles.pullDate}>{activeProject.year}, {activeProject.category}</span>
                <span className={styles.pullLocation}>{activeProject.location}</span>
                <span className={styles.pullCredit}>{activeProject.gear.split("·")[0].trim()}</span>
                <div className={styles.pullActions}>
                  <Link href={`/work/${activeProject.slug}`} className={styles.readMore}>
                    view project →
                  </Link>
                </div>
              </div>
            </div>

            {/* ── Top-Right 3D Stack ── */}
            <div className={styles.stackCluster + " " + styles.stackTR}>
              {STACK_IMAGES.slice(6, 12).map((img, i) => (
                <div
                  key={`tr-${i}`}
                  className={styles.stackedSlice}
                  style={{
                    "--i": i,
                    backgroundImage: `url(${img})`,
                  } as React.CSSProperties}
                />
              ))}
            </div>
          </div>

          {/* ── Category Tags / Project Selector ── */}
          <div ref={infoRef} className={styles.tagCloud}>
            <span className={styles.tagLabel}>
              all <span className={styles.tagCount}>{STACK_PROJECTS.length}</span>
            </span>
            {STACK_PROJECTS.map((proj, idx) => (
              <button
                key={proj.id}
                className={`${styles.tagItem} ${idx === activeIndex ? styles.tagActive : ""}`}
                onClick={() => selectProject(idx)}
              >
                {proj.title.toLowerCase()}
                <span className={styles.tagCount}>{proj.frameNo.split("/")[0].replace("FRAME ", "")}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Project Details Strip ── */}
        <div className={styles.detailsStrip}>
          <div className={styles.detailMain}>
            <h3 className={styles.projectTitle}>{activeProject.title}</h3>
            <p className={styles.projectSubtitle}>{activeProject.subtitle}</p>
            <p className={styles.projectStory}>{activeProject.storyNote}</p>
          </div>
          <div className={styles.detailMeta}>
            <div className={styles.specItem}>
              <span className={styles.specLabel}>Gear</span>
              <span className={styles.specVal}>{activeProject.gear}</span>
            </div>
            <div className={styles.specItem}>
              <span className={styles.specLabel}>Aspect</span>
              <span className={styles.specVal}>{activeProject.aspect}</span>
            </div>
            <Link href={`/work/${activeProject.slug}`} className={styles.viewBtn}>
              Step Inside Full Story <span>→</span>
            </Link>
          </div>
        </div>

        {/* Project Selector Rail */}
        <div className={styles.projectRail}>
          {STACK_PROJECTS.map((proj, idx) => (
            <button
              key={proj.id}
              className={`${styles.railItem} ${idx === activeIndex ? styles.railItemActive : ""}`}
              onClick={() => selectProject(idx)}
            >
              <span className={styles.railNumber}>{proj.frameNo}</span>
              <span className={styles.railTitle}>{proj.title}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
