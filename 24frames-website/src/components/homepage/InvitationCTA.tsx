"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./InvitationCTA.module.css";

gsap.registerPlugin(ScrollTrigger);

export default function InvitationCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReduced) return;

    const ctx = gsap.context(() => {
      // 1. Header entrance
      gsap.fromTo(
        headerRef.current,
        { y: 30, opacity: 0 },
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

      // 2. Cards entrance with subtle ambient depth
      const cards = gsap.utils.toArray<HTMLElement>(`.${styles.card}`);
      cards.forEach((card, index) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 1.0,
            delay: index * 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );

        const bg = card.querySelector(`.${styles.cardBg}`);
        if (bg) {
          gsap.fromTo(
            bg,
            { scale: 1.15 },
            {
              scale: 1.0,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            }
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="inquire"
      className={styles.section}
      aria-label="Begin Your Story — Inquiry Options"
    >
      {/* Anchor alias to support both #inquire and #invitation */}
      <div id="invitation" className={styles.anchorOffset} aria-hidden="true" />

      <div className={styles.container}>
        {/* Calmer, intimate header */}
        <div ref={headerRef} className={styles.header}>
          <span className={styles.label}>Chapter 05 — The Invitation</span>
          <h2 className={styles.title}>
            Begin your <span className={styles.cursiveAccent}>story</span>
          </h2>
          <p className={styles.subtitle}>
            Every celebration deserves a cinematic memory that lasts generations.
            We take on a limited number of commissions each season to maintain meticulous craft.
          </p>
        </div>

        {/* Dual Inquiry Tracks */}
        <div ref={cardsRef} className={styles.cards}>
          {/* Private & Wedding Card */}
          <a
            href="https://wa.me/919985999999?text=Hello%2024%20Frames,%20I%20would%20like%20to%20inquire%20about%20a%20wedding%20commission."
            target="_blank"
            rel="noopener noreferrer"
            className={styles.card}
            aria-label="Private & Wedding Commissions Inquiry"
          >
            <div className={styles.cardImageWrap}>
              <img
                src="/images/portfolio/sireesh-harshitha/cover.jpg"
                alt=""
                className={styles.cardBg}
                loading="lazy"
                aria-hidden="true"
              />
              <div className={styles.cardVignette} />
            </div>

            <div className={styles.cardContent}>
              <div className={styles.cardIconBox}>
                <span className={styles.cardIcon}>◇</span>
              </div>
              <span className={styles.cardCategory}>PRIVATE COMMISSIONS</span>
              <h3 className={styles.cardTitle}>Weddings & Celebrations</h3>
              <p className={styles.cardDesc}>
                For luxury weddings, royal ceremonies, multi-day festivities, and intimate family milestones.
              </p>
              <div className={styles.cardFooter}>
                <span className={styles.cardCta}>
                  Request Wedding Availability <span className={styles.arrow}>→</span>
                </span>
                <span className={styles.cardMeta}>2026/2027 Calendar Open</span>
              </div>
            </div>
          </a>

          {/* Commercial & Editorial Card */}
          <a
            href="mailto:contact@24frames.in?subject=Commercial%20/%20Editorial%20Commission%20Inquiry"
            className={styles.card}
            aria-label="Commercial & Editorial Commissions Inquiry"
          >
            <div className={styles.cardImageWrap}>
              <img
                src="/images/stories/bellam-srikonda/IMG_6341.jpg"
                alt=""
                className={styles.cardBg}
                loading="lazy"
                aria-hidden="true"
              />
              <div className={styles.cardVignette} />
            </div>

            <div className={styles.cardContent}>
              <div className={styles.cardIconBox}>
                <span className={styles.cardIcon}>▣</span>
              </div>
              <span className={styles.cardCategory}>COMMERCIAL COMMISSIONS</span>
              <h3 className={styles.cardTitle}>Editorial & Campaigns</h3>
              <p className={styles.cardDesc}>
                For brand campaigns, luxury hospitality, fashion editorials, and cultural documentary series.
              </p>
              <div className={styles.cardFooter}>
                <span className={styles.cardCta}>
                  Initiate Project Brief <span className={styles.arrow}>→</span>
                </span>
                <span className={styles.cardMeta}>Direct Agency Inquiries</span>
              </div>
            </div>
          </a>
        </div>

        {/* Quiet Reassurance Banner */}
        <div className={styles.reassurance}>
          <div className={styles.reassuranceItem}>
            <span className={styles.reassuranceDot} />
            <span>Studio: Jubilee Hills, Hyderabad</span>
          </div>
          <span className={styles.reassuranceDivider}>·</span>
          <div className={styles.reassuranceItem}>
            <span className={styles.reassuranceDot} />
            <span>Pan-India & Destination Worldwide</span>
          </div>
          <span className={styles.reassuranceDivider}>·</span>
          <div className={styles.reassuranceItem}>
            <span className={styles.reassuranceDot} />
            <span>Direct Creative Oversight by Phani Gogireddy</span>
          </div>
        </div>
      </div>
    </section>
  );
}
