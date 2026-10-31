"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./InvitationCTA.module.css";

gsap.registerPlugin(ScrollTrigger);

export default function InvitationCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const photoFrameRef = useRef<HTMLDivElement>(null);
  const textContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReduced) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 76%",
          once: true,
        },
      });

      // 1. Reveal CTA background photo through refined diagonal mask
      if (photoFrameRef.current) {
        tl.fromTo(
          photoFrameRef.current,
          { clipPath: "polygon(0 14%, 100% 0%, 100% 86%, 0 100%)", scale: 1.06, opacity: 0.8 },
          { clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0 100%)", scale: 1.0, opacity: 1, duration: 1.35, ease: "power3.out" },
          0
        );
      }

      // 2. Headline, supporting copy, and inquiry button emerge in deliberate sequence
      if (textContentRef.current) {
        tl.fromTo(
          textContentRef.current.children,
          { opacity: 0, y: 22 },
          { opacity: 1, y: 0, duration: 0.85, stagger: 0.12, ease: "power2.out" },
          0.35
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
      aria-label="The Lasting Frame (Begin a Conversation)"
    >
      <div id="invitation" className={styles.anchorOffset} aria-hidden="true" />

      <div className={styles.container}>
        {/* ── THE LASTING FRAME STAGE ── */}
        <div ref={stageRef} className={styles.stage}>
          {/* Photographic Background Canvas (Fades softly into Warm Ivory) */}
          <div ref={photoFrameRef} className={styles.photoCanvasWrap}>
            <img
              src="/images/stories/karthik-and-gayathri/IMG_6330.jpg"
              alt="Tell us what you want to remember — 24 Frames Commission"
              className={styles.canvasImg}
              loading="lazy"
            />
            {/* Atmospheric Ivory Radial & Linear Fade Gradients */}
            <div className={styles.ivoryFadeTop} aria-hidden="true" />
            <div className={styles.ivoryFadeBottom} aria-hidden="true" />
            <div className={styles.atmosphericGaze} aria-hidden="true" />
          </div>

          {/* Restrained Closing Invitation Overlay */}
          <div ref={textContentRef} className={styles.editorialContent}>
            <div className={styles.kickerRow}>
              <span className={styles.kickerLine} aria-hidden="true" />
              <span className={styles.chapterTag}>THE LASTING FRAME</span>
              <span className={styles.kickerLine} aria-hidden="true" />
            </div>

            <h2 className={styles.invitationHeading}>
              Tell us what you want to remember.
            </h2>

            <p className={styles.cursiveNote}>you’ll remember this feeling</p>

            <p className={styles.supportingCopy}>
              Every master commission begins with a quiet dialogue about the rituals, loved ones, and fleeting moments you wish to preserve for generations.
            </p>

            <div className={styles.actionWrap}>
              <Link
                href="/inquire"
                className={styles.btnBeginConversation}
                aria-label="Begin a conversation for 24 Frames commissions"
              >
                <span>BEGIN A CONVERSATION</span>
                <span className={styles.btnArrow} aria-hidden="true">→</span>
              </Link>
            </div>

            <div className={styles.destinationsLine}>
              <span>HYDERABAD</span>
              <span className={styles.bulletDot}>·</span>
              <span>PAN-INDIA COMMISSIONS</span>
              <span className={styles.bulletDot}>·</span>
              <span>INTERNATIONAL CELEBRATIONS</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
