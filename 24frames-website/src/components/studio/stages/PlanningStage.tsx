"use client";

import styles from "../stages.module.css";
import px from "../planning.module.css";
import { StageFooter, StageHeader } from "./StageChrome";
import { PLANNING_SERVICES, cleanPlanning } from "@/lib/commission/planning";
import type { StageProps } from "./types";

/* Frame 02 — beyond photography. The couple can tick the planning services
   they would like help with (venues, planning, décor, jewellery, makeup).
   Entirely optional and never priced here: the ticks reach their
   relationship manager as a follow-up, separate from the photography. */
export default function PlanningStage({ draft, actions, go, portal }: StageProps) {
  const chosen = new Set(draft.planning?.services ?? []);
  const note = draft.planning?.note ?? "";
  const locked = !!portal && !portal.editable;

  const set = (services: string[], nextNote = note) => actions.setPlanning(cleanPlanning({ services, note: nextNote }));
  const toggle = (id: string) => {
    if (locked) return;
    const next = new Set(chosen);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    set(PLANNING_SERVICES.map((s) => s.id).filter((s) => next.has(s)));
  };

  return (
    <div className={styles.stageInner}>
      <StageHeader
        frame="02"
        kicker="Frame 02 · The Planning"
        title={<>Planning an event? <em>We&apos;ve got you covered.</em></>}
        lead="Along with capturing your special moments, we can help you plan your celebration too — whether it's a beautiful farmhouse for your Haldi, the perfect wedding venue, décor, jewellery or makeup artists. Tick anything you'd like help with; it's entirely optional."
      />

      <ul className={px.grid} role="list">
        {PLANNING_SERVICES.map((s, i) => {
          const on = chosen.has(s.id);
          return (
            <li key={s.id} className={px.cell} style={{ "--i": i } as React.CSSProperties}>
              <button
                type="button"
                className={`${px.card} ${on ? px.cardOn : ""}`}
                aria-pressed={on}
                onClick={() => toggle(s.id)}
                disabled={locked}
              >
                <span className={px.media}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.image} alt="" loading={i < 3 ? "eager" : "lazy"} decoding="async" />
                  <span className={px.no} aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                  <span className={px.tick} aria-hidden="true">
                    <svg viewBox="0 0 24 24"><path d="M5 12.5l4.2 4.2L19 7" /></svg>
                  </span>
                </span>
                <span className={px.body}>
                  <span className={px.title}>{s.title}</span>
                  <span className={px.line}>{s.line}</span>
                  <span className={px.detail}>{s.detail}</span>
                  <span className={px.tags}>
                    {s.tags.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </span>
                  <span className={px.cta}>{on ? "Added — we'll be in touch" : "I'd like help with this"}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className={`${px.notePanel} ${chosen.size ? px.noteOpen : ""}`}>
        <div className={px.noteHead}>
          <p className={px.noteKicker}>{chosen.size ? `${chosen.size} selected` : "Nothing selected"}</p>
          <p className={px.noteText}>
            {chosen.size
              ? "Your relationship manager will share options and pricing for these separately — they are not added to your photography quotation."
              : "No problem — you can come back to this at any time."}
          </p>
        </div>
        {chosen.size > 0 && (
          <label className={px.noteField}>
            <span>Anything we should know? (optional)</span>
            <textarea
              rows={3}
              maxLength={1500}
              value={note}
              disabled={locked}
              onChange={(e) => set([...chosen], e.target.value)}
              placeholder="A venue you love, a look you have in mind, dates, budget…"
            />
          </label>
        )}
      </div>

      <StageFooter
        onBack={() => go("couple")}
        backLabel="The couple"
        onNext={() => go("celebration")}
        nextLabel={chosen.size ? "Continue to photography" : "Skip to photography"}
      />
    </div>
  );
}
