"use client";

import { optimised } from "../ui/optimised";
import styles from "../stages.module.css";
import base from "../studio.module.css";
import { STAGES } from "../state/store";
import Crest from "../ui/Crest";
import Motes from "../ui/Motes";
import cx from "../cinema.module.css";
import { coupleNames } from "@/lib/commission/model";
import type { StageProps } from "./types";

/* One still frame, shown whole: the photograph sits centred on a soft,
   blurred wash of itself, so nothing is cropped and nothing moves. */
const STILL = { src: "/images/portfolio/sireesh-harshitha/cover.jpg", caption: "Sirish & Harshitha" };

const HEADLINE = ["Every", "celebration", "deserves", "its", "own", "visual", "legacy."];

export default function Overture({ draft, actions, go, hasProgress }: StageProps & { hasProgress: boolean }) {
  const names = coupleNames(draft.couple, "");

  return (
    <main className={styles.overture}>
      <div className={styles.reel} aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={styles.reelWash} src={optimised(STILL.src, 640)} alt="" decoding="async" />
        <figure className={styles.reelStill}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={optimised(STILL.src, 1200)} alt="" decoding="async" fetchPriority="high" />
        </figure>
        <div className={styles.reelCounter}>
          <span className={styles.reelCaption}>{STILL.caption}</span>
        </div>
      </div>

      <section className={styles.overtureText}>
        <Motes className={cx.motes} />
        <span className={cx.depthWrap}><Crest className={cx.overtureCrest} /></span>
        <p className={base.kicker}>By private appointment · 24 Frames</p>
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

        <ol className={styles.journey} aria-label="The seven frames of your commission">
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
