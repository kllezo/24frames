"use client";

import { useEffect, useState } from "react";
import styles from "../stages.module.css";
import base from "../studio.module.css";
import { STAGES } from "../state/store";
import { coupleNames } from "@/lib/commission/model";
import type { StageProps } from "./types";

const REEL = [
  { src: "/images/portfolio/sireesh-harshitha/cover.jpg", caption: "Sirish & Harshitha" },
  { src: "/images/disciplines/cinema/IMG_6289.jpg", caption: "The Arches" },
  { src: "/images/stories/hrithika-abhishek/IMG_6337.jpg", caption: "Hrithika · Haldi" },
  { src: "/images/portfolio/hrithika-abhishek/cover.jpg", caption: "Hrithika & Abhishek" },
];

const HEADLINE = ["Every", "celebration", "deserves", "its", "own", "visual", "legacy."];

export default function Overture({ draft, actions, go, hasProgress }: StageProps & { hasProgress: boolean }) {
  const [frame, setFrame] = useState(0);
  const names = coupleNames(draft.couple, "");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(() => setFrame((f) => (f + 1) % REEL.length), 5200);
    return () => window.clearInterval(t);
  }, []);

  return (
    <main className={styles.overture}>
      <div className={styles.reel} aria-hidden="true">
        {REEL.map((r, i) => (
          <figure key={r.src} className={`${styles.reelFrame} ${i === frame ? styles.reelActive : ""}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={r.src} alt="" />
          </figure>
        ))}
        <div className={styles.reelCounter}>
          <span className={base.mono}>
            {String(frame + 1).padStart(2, "0")} / {String(REEL.length).padStart(2, "0")}
          </span>
          <span className={styles.reelCaption}>{REEL[frame].caption}</span>
        </div>
        <div className={styles.sprockets} />
      </div>

      <section className={styles.overtureText}>
        <p className={base.kicker}>24 Frames · A private commission</p>
        <h1 className={styles.overtureTitle} tabIndex={-1}>
          {HEADLINE.map((w, i) => (
            <span key={i}>
              <span className={styles.word} style={{ animationDelay: `${180 + i * 90}ms` }}>
                {w === "legacy." ? <em>{w}</em> : w}
              </span>{" "}
            </span>
          ))}
        </h1>
        <p className={styles.overtureLead}>
          Compose your wedding&apos;s photography and cinematography experience with 24 Frames.
        </p>
        <p className={styles.overtureCredo}>
          You don&apos;t choose a package. <span>You compose your own wedding&apos;s visual legacy.</span>
        </p>

        <div className={styles.overtureCtas}>
          {hasProgress ? (
            <>
              <button className={base.btnPrimaryLg} onClick={() => go("couple")}>
                Resume {names ? `${names}'s` : "the"} commission
              </button>
              <button className={base.btnText} onClick={() => { actions.reset(); actions.go("couple"); }}>
                Begin a new commission instead
              </button>
            </>
          ) : (
            <button className={base.btnPrimaryLg} onClick={() => go("couple")}>
              Begin your commission
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M14 6l6 6-6 6" /></svg>
            </button>
          )}
        </div>

        <ol className={styles.journey} aria-label="The six frames of your commission">
          {STAGES.slice(1).map((s) => (
            <li key={s.id}>
              <span className={base.mono}>{s.frame}</span>
              {s.title}
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
