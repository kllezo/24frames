"use client";

import cx from "../cinema.module.css";
import styles from "../stages.module.css";
import base from "../studio.module.css";
import DatePicker from "../ui/DatePicker";
import { StageFooter, StageHeader } from "./StageChrome";
import Invitation from "../ui/Invitation";
import { coupleHints } from "@/lib/commission/validation";
import { formatDateLong, isPastDate, todayISO, weekdayOf } from "@/lib/commission/format";
import type { PreferredContact } from "@/lib/commission/types";
import type { StageProps } from "./types";

const CONTACTS: { id: PreferredContact; label: string }[] = [
  { id: "whatsapp", label: "WhatsApp" },
  { id: "call", label: "Phone call" },
  { id: "email", label: "Email" },
];

export default function CoupleStage({ draft, actions, go }: StageProps) {
  const c = draft.couple;
  const hints = coupleHints(draft);
  const hasName = !!(c.brideName.trim() || c.groomName.trim());
  const past = isPastDate(c.weddingDate);

  return (
    <div className={styles.stageInner}>
      <StageHeader
        frame="01"
        kicker="Frame 01 · The Couple"
        title={<>Tell us whose story <em>we are telling.</em></>}
        lead="Only a name is needed to begin. Watch the invitation write itself as you go."
      />

      <div className={cx.coupleLayout}>
        <div className={cx.atelierForm}>
          <section className={cx.formCard} aria-labelledby="f-names">
            <h2 id="f-names" className={cx.formCardTitle}><span>I</span> The couple</h2>
            <div className={cx.namePair}>
              <label className={cx.lux}>
                <input id="bride-name" value={c.brideName} onChange={(e) => actions.couple({ brideName: e.target.value })} placeholder=" " maxLength={60} autoComplete="off" />
                <span>Bride&apos;s name</span>
              </label>
              <span className={cx.nameAmp} aria-hidden="true">&amp;</span>
              <label className={cx.lux}>
                <input value={c.groomName} onChange={(e) => actions.couple({ groomName: e.target.value })} placeholder=" " maxLength={60} autoComplete="off" />
                <span>Groom&apos;s name</span>
              </label>
            </div>
          </section>

          <section className={cx.formCard} aria-labelledby="f-date">
            <h2 id="f-date" className={cx.formCardTitle}><span>II</span> The date</h2>
            <div className={cx.datePair}>
              <DatePicker
                label="Exact date"
                value={c.weddingDate}
                min={todayISO()}
                invalid={past}
                disabled={!!c.approximateDate.trim()}
                onChange={(v) => actions.couple({ weddingDate: v && isPastDate(v) ? "" : v })}
              />
              <span className={cx.orRule} aria-hidden="true">or</span>
              <label className={cx.lux}>
                <input
                  value={c.approximateDate}
                  onChange={(e) => actions.couple({ approximateDate: e.target.value })}
                  placeholder=" "
                  maxLength={60}
                  disabled={!!c.weddingDate}
                />
                <span>Approximate, e.g. late February 2027</span>
              </label>
            </div>
            <div className={cx.dateFoot}>
              <span className={`${base.hint} ${past ? base.hintError : ""}`} role={past ? "alert" : undefined}>
                {past
                  ? "That date has already passed — choose today or a later date."
                  : c.weddingDate
                    ? `${weekdayOf(c.weddingDate)}, ${formatDateLong(c.weddingDate)}`
                    : c.approximateDate.trim() ? "Using the approximate date." : "Choose one — an exact date or an approximate one."}
              </span>
              {(c.weddingDate || c.approximateDate) && (
                <button type="button" className={base.btnText} onClick={() => actions.couple({ weddingDate: "", approximateDate: "" })}>
                  Clear date
                </button>
              )}
            </div>
          </section>

          <section className={cx.formCard} aria-labelledby="f-reach">
            <h2 id="f-reach" className={cx.formCardTitle}><span>III</span> How to reach you</h2>
            <div className={cx.reachGrid}>
              <label className={cx.lux}>
                <input type="tel" inputMode="tel" value={c.phone} onChange={(e) => actions.couple({ phone: e.target.value })} placeholder=" " maxLength={20} aria-invalid={!!hints.phone} />
                <span>Phone number</span>
                {hints.phone && <small className={base.hint}>{hints.phone}</small>}
              </label>
              <label className={cx.lux}>
                <input type="email" value={c.email} onChange={(e) => actions.couple({ email: e.target.value })} placeholder=" " maxLength={120} aria-invalid={!!hints.email} />
                <span>Email address</span>
                {hints.email && <small className={base.hint}>{hints.email}</small>}
              </label>
              <label className={cx.lux}>
                <input value={c.city} onChange={(e) => actions.couple({ city: e.target.value })} placeholder=" " maxLength={60} />
                <span>City</span>
              </label>
              <fieldset className={cx.contactPick}>
                <legend>Best way to reach you</legend>
                <div>
                  {CONTACTS.map((o) => (
                    <label key={o.id} className={c.preferredContact === o.id ? cx.contactOn : ""}>
                      <input
                        type="radio"
                        name="preferredContact"
                        value={o.id}
                        checked={c.preferredContact === o.id}
                        onChange={() => actions.couple({ preferredContact: o.id })}
                      />
                      {o.label}
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>
          </section>

          <section className={cx.formCard} aria-labelledby="f-note">
            <h2 id="f-note" className={cx.formCardTitle}><span>IV</span> Anything we should know</h2>
            <label className={`${cx.lux} ${cx.luxArea}`}>
              <textarea rows={3} value={c.notes} onChange={(e) => actions.couple({ notes: e.target.value })} placeholder=" " maxLength={2000} />
              <span>Family traditions, people who must be photographed, things you love…</span>
            </label>
          </section>
        </div>

        <aside className={cx.coupleAside} aria-label="Invitation preview">
          <Invitation couple={c} />
        </aside>
      </div>

      <StageFooter
        onBack={() => go("overture")}
        backLabel="Opening"
        onNext={() => go("planning")}
        nextLabel="Continue"
        nextDisabled={past}
        hint={past ? "The wedding date has already passed." : hasName ? undefined : "Add at least one name — it will appear on the proposal."}
      />
    </div>
  );
}
