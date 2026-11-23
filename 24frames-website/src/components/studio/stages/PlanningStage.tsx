"use client";

import { useState } from "react";
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
                <PartnerBloom service={s} open={on} onToggle={() => setOpen(on ? null : s.id)} eager={i < 2} />
              </div>

              <div className={px.copy}>
                <span className={px.no}>{String(i + 1).padStart(2, "0")}</span>
                <h3 className={px.title}>{s.title}</h3>
                <p className={px.line}>{s.line}</p>
                {on && (
                  <ol className={px.partners}>
                    {s.partners
                      .filter((p) => !p.placeholder)
                      .map((p, k) => (
                        <li key={p.name} style={{ "--k": k } as React.CSSProperties}>
                          <span className={px.partnerNo}>{String(k + 1).padStart(2, "0")}</span>
                          <span className={px.partnerName}>{p.name}</span>
                          {p.perk && <span className={px.partnerPerk}>{p.perk}</span>}
                        </li>
                      ))}
                  </ol>
                )}
                <button type="button" className={px.more} onClick={() => setOpen(on ? null : s.id)} aria-expanded={on}>
                  {on ? "Hide partners" : "See our partners"} <span aria-hidden="true">→</span>
                </button>
              </div>
            </li>
          );
        })}
      </ol>

      <p className={px.footnote}>Privileges are offered by each partner and may change; your relationship manager will confirm the current offers.</p>

      <StageFooter onBack={() => go("couple")} backLabel="The couple" onNext={() => go("celebration")} nextLabel="Continue to photography" />
    </div>
  );
}
