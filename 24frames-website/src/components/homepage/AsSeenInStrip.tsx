"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./AsSeenInStrip.module.css";

gsap.registerPlugin(ScrollTrigger);

interface PressLogo {
  name: string;
  src: string;
  alt: string;
  heightRatio?: number;
}

const PRESS_LOGOS: PressLogo[] = [
  { name: "The Indian Express", src: "/images/press/indian-express.png", alt: "The Indian Express editorial feature" },
  { name: "Telangana Today", src: "/images/press/telangana-today.png", alt: "Telangana Today feature coverage" },
  { name: "The Times of India", src: "/images/press/times-of-india.png", alt: "The Times of India spotlight feature" },
  { name: "The Hindu", src: "/images/press/the-hindu.png", alt: "The Hindu publication feature" },
  { name: "Vogue", src: "/images/press/vogue.png", alt: "Vogue India editorial feature" },
  { name: "Nikon", src: "/images/press/nikon.png", alt: "Nikon creator community & optical imaging partner" },
  { name: "Times Business Awards", src: "/images/press/times-business-awards.png", alt: "Times Business Awards distinction" },
  { name: "ET Excellence", src: "/images/press/et-excellence.png", alt: "Economic Times Excellence Awards" },
  { name: "Inovexia International", src: "/images/press/inovexia.png", alt: "Indian Eminent Awards presented by Inovexia International" },
  { name: "WPPI", src: "/images/press/wppi.png", alt: "WPPI international wedding & portrait photography association" },
  { name: "TCEI", src: "/images/press/tcei.png", alt: "Telangana Chamber of Events Industry distinction" },
  { name: "WedMeGood", src: "/images/press/wedmegood.png", alt: "WedMeGood partner platform" },
  { name: "PIC-TIME", src: "/images/press/pic-time.png", alt: "Pic-Time global client gallery delivery platform" },
];

export default function AsSeenInStrip() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isReduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReduced) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          once: true,
        },
      });

      // 1. Header kicker and title emerge cleanly
      if (headerRef.current) {
        tl.fromTo(
          headerRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.85, ease: "power2.out" }
        );
      }

      // 2. Publication logos reveal cleanly into focus
      if (marqueeRef.current) {
        tl.fromTo(
          marqueeRef.current,
          { opacity: 0.35, y: 10 },
          {
            opacity: 1,
            y: 0,
            duration: 1.0,
            ease: "power2.out",
          },
          0.2
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={styles.section} aria-label="Media Publications, Industry Affiliations and Creative Platforms">
      <div className={styles.container}>
        {/* Editorial Heading */}
        <div ref={headerRef} className={styles.header}>
          <div className={styles.kickerRow}>
            <span className={styles.ruleLine} aria-hidden="true" />
            <h2 className={styles.title}>AS SEEN IN &amp; AFFILIATIONS</h2>
            <span className={styles.ruleLine} aria-hidden="true" />
          </div>
          <p className={styles.subtitle}>
            Press features, creator community partnerships, juried awards, and archival delivery platforms.
          </p>
        </div>

        {/* Seamless Continuous Marquee Strip */}
        <div ref={marqueeRef} className={styles.marqueeWrapper}>
          <div className={styles.marqueeTrack} aria-hidden="true">
            {/* Set 1 */}
            {PRESS_LOGOS.map((logo, idx) => (
              <div key={`logo-1-${idx}`} className={styles.logoItem}>
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className={styles.logoImg}
                  loading="lazy"
                />
              </div>
            ))}

            {/* Set 2 (for seamless infinite loop) */}
            {PRESS_LOGOS.map((logo, idx) => (
              <div key={`logo-2-${idx}`} className={styles.logoItem}>
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className={styles.logoImg}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

