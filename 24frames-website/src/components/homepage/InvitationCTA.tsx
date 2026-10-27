"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./InvitationCTA.module.css";

gsap.registerPlugin(ScrollTrigger);

export default function InvitationCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReduced) return;

    const ctx = gsap.context(() => {
      if (contentRef.current) {
        gsap.fromTo(
          contentRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 1.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="inquire"
      className={styles.section}
      aria-label="Begin Your Enquiry"
    >
      <div id="invitation" className={styles.anchorOffset} aria-hidden="true" />

      <div className={styles.container}>
        <div ref={contentRef} className={styles.minimalStage}>
          <h2 className={styles.headline}>
            Some stories deserve to be{" "}
            <span className={styles.cursiveAccent}>remembered forever.</span>
          </h2>

          <p className={styles.supportingCopy}>
            Tell us what you are imagining. We’ll help you turn it into something timeless.
          </p>

          <div className={styles.actionWrap}>
            <Link
              href="/inquire"
              className={styles.btnBeginEnquiry}
              aria-label="Begin your enquiry for 24 Frames commissions"
            >
              <span>BEGIN YOUR ENQUIRY</span>
              <span aria-hidden="true">↗</span>
            </Link>
          </div>

          <p className={styles.footerLine}>
            Weddings · Celebrations · Editorial · Films
          </p>
        </div>
      </div>
    </section>
  );
}
