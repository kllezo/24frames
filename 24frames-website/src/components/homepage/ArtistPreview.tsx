"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./ArtistPreview.module.css";

gsap.registerPlugin(ScrollTrigger);

export default function ArtistPreview() {
  const sectionRef = useRef<HTMLElement>(null);
  const portraitWrapRef = useRef<HTMLDivElement>(null);
  const portraitImgRef = useRef<HTMLImageElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLQuoteElement>(null);

  useEffect(() => {
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReduced) return;

    const ctx = gsap.context(() => {
      // 1. Portrait entrance with clip-mask
      gsap.fromTo(
        portraitWrapRef.current,
        { clipPath: "inset(10% 0% 10% 0%)", opacity: 0, y: 30 },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          opacity: 1,
          y: 0,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // 2. Dual-rate Parallax: Portrait moves at a different speed than content
      gsap.fromTo(
        portraitImgRef.current,
        { yPercent: -10 },
        {
          yPercent: 10,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );

      // 3. Content editorial entrance
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1.0,
          delay: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // 4. Subtle parallax drift on quote
      gsap.to(quoteRef.current, {
        y: -12,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="artist"
      className={styles.section}
      aria-label="The Artist — Founder Profile"
    >
      <div className={styles.container}>
        <div className={styles.layout}>
          {/* Monumental Portrait Column with Fine Art Gallery Matting */}
          <div ref={portraitWrapRef} className={styles.portraitWrap}>
            <div className={styles.portraitFrame}>
              <div className={styles.imageOverflow}>
                <img
                  ref={portraitImgRef}
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=88&auto=format"
                  alt="Phani Gogireddy — Founder & Creative Director of 24 Frames Photography"
                  className={styles.portrait}
                  loading="lazy"
                />
              </div>
              <div className={styles.frameApertureBadge}>
                <span>35MM CINEMA STILL · PHANI GOGIREDDY</span>
              </div>
            </div>
            <div className={styles.portraitShadow} aria-hidden="true" />
          </div>

          {/* Editorial Content Column */}
          <div ref={contentRef} className={styles.content}>
            <div className={styles.metaRow}>
              <span className={styles.label}>Chapter 06 — The Visionary</span>
              <span className={styles.locationTag}>Hyderabad · Worldwide</span>
            </div>

            <blockquote ref={quoteRef} className={styles.quote}>
              &ldquo;A wedding is not a photo session; it is a sacred cultural milestone.
              Our mission is to capture its soul with the exact visual language of master cinema.&rdquo;
            </blockquote>

            <div className={styles.attribution}>
              <h3 className={styles.name}>Phani Gogireddy</h3>
              <p className={styles.role}>Founder & Creative Director</p>
            </div>

            <div className={styles.biography}>
              <p className={styles.bio}>
                From the film sets of Tollywood to directing one of South India&apos;s most
                revered cinematic wedding studios, Phani has spent fourteen years preserving
                Telugu heritage, high-profile royal unions, and the quiet intimacy of families.
              </p>
              <p className={styles.bioSecondary}>
                Every commission is treated as a bespoke feature film — shot on optical cinema primes,
                graded with archival color discipline, and delivered as generational heirlooms.
              </p>
            </div>

            {/* Credibility Milestones */}
            <div className={styles.milestones}>
              <div className={styles.milestone}>
                <span className={styles.milestoneValue}>2012</span>
                <span className={styles.milestoneLabel}>Founded in Hyderabad</span>
              </div>
              <div className={styles.milestone}>
                <span className={styles.milestoneValue}>500+</span>
                <span className={styles.milestoneLabel}>Master Commissions</span>
              </div>
              <div className={styles.milestone}>
                <span className={styles.milestoneValue}>5.0</span>
                <span className={styles.milestoneLabel}>WedMeGood Score</span>
              </div>
            </div>

            <div className={styles.actions}>
              <Link href="/#inquire" className={styles.inquireBtn}>
                Commission Phani Gogireddy
                <span className={styles.arrow}>→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
