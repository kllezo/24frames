"use client";

import { useEffect, useState } from "react";
import { optimised } from "../ui/optimised";
import styles from "../stages.module.css";
import px from "../planning.module.css";
import { StageFooter, StageHeader } from "./StageChrome";
import PartnerBloom from "./PartnerBloom";
import { PLANNING_SERVICES } from "@/lib/commission/planning";
import type { StageProps } from "./types";

/* Frame 02 — the 24 Frames privileges. Nothing to choose here: four
   services, each a single circle set alternately left and right. Opening
   one blooms it into a flower of its five partner brands; couples mention 24 Frames
   at those brands to redeem their privilege, and the sales team walks them
   through the offers on the call or in person. */
export default function PlanningStage({ go }: StageProps) {
  const [open, setOpen] = useState<string | null>(null);
  // The partner whose card is showing beside the open flower (index into its partners).
  const [pick, setPick] = useState<number | null>(null);
  // On a phone the card lands below the list, so bring it into view.
  useEffect(() => {
    if (pick === null || window.innerWidth > 820) return;
    const t = window.setTimeout(() => document.querySelector(`.${px.card}`)?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 80);
    return () => window.clearTimeout(t);
  }, [pick]);
  const toggle = (id: string) => {
    setPick(null);
    setOpen((o) => (o === id ? null : id));
  };

  return (
    <div className={styles.stageInner}>
      <StageHeader
        frame="02"
        kicker="Frame 02 · The Planning"
        title={<>Planning an event? <em>We&apos;ve got you covered.</em></>}
        lead="As a 24 Frames couple, the brands we work with welcome you with privileges of their own. Mention our name when you visit — your relationship manager will walk you through every offer."
      />

      <ol className={px.rows} role="list">
        {PLANNING_SERVICES.map((s, i) => {
          const on = open === s.id;
          const side = i % 2 === 0 ? px.left : px.right;
          return (
            <li key={s.id} className={`${px.row} ${side} ${on ? px.rowOpen : ""}`} style={{ "--i": i } as React.CSSProperties}>
              <div className={px.stage}>
                <PartnerBloom
                  service={s}
                  open={on}
                  onToggle={() => toggle(s.id)}
                  eager={i < 2}
                  selected={on ? pick : null}
                  onPick={(k) => setPick((p) => (p === k ? null : k))}
                />
              </div>

              <div className={px.copy}>
                <span className={px.no}>{String(i + 1).padStart(2, "0")}</span>
                <h3 className={px.title}>{s.title}</h3>
                <p className={px.line}>{s.line}</p>
                {on && (
                  <ol className={px.partners}>
                    {s.partners.map((p, k) =>
                      p.placeholder ? null : (
                        <li key={p.name} style={{ "--k": k } as React.CSSProperties}>
                          <button type="button" className={`${px.partnerBtn} ${pick === k ? px.partnerOn : ""}`} onClick={() => setPick(pick === k ? null : k)} aria-expanded={pick === k}>
                            <span className={px.partnerNo}>{String(k + 1).padStart(2, "0")}</span>
                            <span className={px.partnerName}>{p.name}</span>
                            {p.perk && <span className={px.partnerPerk}>{p.perk}</span>}
                          </button>
                        </li>
                      ),
                    )}
                  </ol>
                )}
                {on && pick === null && <p className={px.hint}>Tap a petal or a name to see the place and the privilege.</p>}
                {on && pick !== null && s.partners[pick] && (() => {
                  const p = s.partners[pick];
                  return (
                    <article key={p.name} className={px.card} aria-live="polite">
                      {p.photo && (
                        <figure className={px.cardPhoto}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={optimised(p.photo, 640)} alt={p.name} decoding="async" />
                        </figure>
                      )}
                      <div className={px.cardBody}>
                        <span className={px.cardKicker}>{s.title}{p.perk ? ` · ${p.perk}` : ""}</span>
                        <h4 className={px.cardTitle}>{p.name}</h4>
                        {p.about && <p className={px.cardText}>{p.about}</p>}
                        <p className={px.cardNote}>Mention 24 Frames when you visit — your relationship manager will confirm the current privilege.</p>
                      </div>
                      <button type="button" className={px.cardClose} onClick={() => setPick(null)} aria-label={`Close ${p.name}`}>×</button>
                    </article>
                  );
                })()}
                <button type="button" className={px.more} onClick={() => toggle(s.id)} aria-expanded={on}>
                  {on ? "Hide partners" : "See our partners"} <span aria-hidden="true">→</span>
                </button>
              </div>
            </li>
          );
        })}
      </ol>

      <p className={px.footnote}>Privileges are offered by each partner and may change; your relationship manager will confirm the current offers. Photographs are from 24 Frames celebrations.</p>

      <StageFooter onBack={() => go("couple")} backLabel="The couple" onNext={() => go("celebration")} nextLabel="Continue to photography" />
    </div>
  );
}
