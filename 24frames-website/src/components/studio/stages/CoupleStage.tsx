"use client";

import styles from "../stages.module.css";
import base from "../studio.module.css";
import { StageFooter, StageHeader } from "./StageChrome";
import { coupleHints } from "@/lib/commission/validation";
import { formatDateLong, weekdayOf } from "@/lib/commission/format";
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
  const initials = [c.brideName.trim()[0], c.groomName.trim()[0]].filter(Boolean).join("");

  return (
    <div className={styles.stageInner}>
      <StageHeader
        frame="01"
        kicker="Frame 01 · The Couple"
        title={<>Tell us whose story <em>we are telling.</em></>}
        lead="Only a name is needed to begin — everything else can be added whenever it is known."
      />

      <section className={styles.dedication} aria-label="Couple names">
        <div className={styles.monogram} aria-hidden="true">
          <span>{initials || "24"}</span>
        </div>
        <p className={styles.dedicationLine}>
          <span className={styles.dedicationPre}>This commission is composed for</span>
          <span className={styles.nameRow}>
            <label className={styles.nameField}>
              <span className="sr-only">Bride&apos;s name</span>
              <input
                value={c.brideName}
                onChange={(e) => actions.couple({ brideName: e.target.value })}
                placeholder="Bride"
                maxLength={60}
                autoComplete="off"
                size={Math.max(6, c.brideName.length + 1)}
              />
              <small>Bride</small>
            </label>
            <span className={styles.ampersand} aria-hidden="true">&amp;</span>
            <label className={styles.nameField}>
              <span className="sr-only">Groom&apos;s name</span>
              <input
                value={c.groomName}
                onChange={(e) => actions.couple({ groomName: e.target.value })}
                placeholder="Groom"
                maxLength={60}
                autoComplete="off"
                size={Math.max(6, c.groomName.length + 1)}
              />
              <small>Groom</small>
            </label>
          </span>
        </p>
      </section>

      <section className={styles.formGrid} aria-label="Contact and wedding details">
        <label className={base.field}>
          <span className={base.fieldLabel}>Primary contact number</span>
          <input
            className={base.input}
            type="tel"
            inputMode="tel"
            value={c.phone}
            onChange={(e) => actions.couple({ phone: e.target.value })}
            placeholder="+91 98765 43210"
            maxLength={20}
            aria-invalid={!!hints.phone}
          />
          {hints.phone && <span className={base.hint}>{hints.phone}</span>}
        </label>
        <label className={base.field}>
          <span className={base.fieldLabel}>Email address</span>
          <input
            className={base.input}
            type="email"
            value={c.email}
            onChange={(e) => actions.couple({ email: e.target.value })}
            placeholder="name@example.com"
            maxLength={120}
            aria-invalid={!!hints.email}
          />
          {hints.email && <span className={base.hint}>{hints.email}</span>}
        </label>
        <label className={base.field}>
          <span className={base.fieldLabel}>Wedding date</span>
          <input
            className={base.input}
            type="date"
            value={c.weddingDate}
            onChange={(e) => actions.couple({ weddingDate: e.target.value })}
          />
          <span className={base.hint}>
            {c.weddingDate ? `${weekdayOf(c.weddingDate)}, ${formatDateLong(c.weddingDate)}` : "Leave blank if not yet fixed."}
          </span>
        </label>
        <label className={base.field}>
          <span className={base.fieldLabel}>Or an approximate date</span>
          <input
            className={base.input}
            value={c.approximateDate}
            onChange={(e) => actions.couple({ approximateDate: e.target.value })}
            placeholder="e.g. Late February 2027"
            maxLength={60}
            disabled={!!c.weddingDate}
          />
        </label>
        <label className={base.field}>
          <span className={base.fieldLabel}>City</span>
          <input
            className={base.input}
            value={c.city}
            onChange={(e) => actions.couple({ city: e.target.value })}
            placeholder="Hyderabad"
            maxLength={60}
          />
        </label>
        <fieldset className={base.field}>
          <legend className={base.fieldLabel}>Preferred contact</legend>
          <div className={base.segmented}>
            {CONTACTS.map((o) => (
              <label key={o.id} className={c.preferredContact === o.id ? base.segOn : ""}>
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
        <label className={`${base.field} ${styles.span2}`}>
          <span className={base.fieldLabel}>Special notes</span>
          <textarea
            className={base.textarea}
            rows={3}
            value={c.notes}
            onChange={(e) => actions.couple({ notes: e.target.value })}
            placeholder="Family traditions, people who must be photographed, things you love…"
            maxLength={2000}
          />
        </label>
      </section>

      <StageFooter
        onBack={() => go("overture")}
        backLabel="Opening"
        onNext={() => go("celebration")}
        nextLabel="Build the celebration"
        hint={hasName ? undefined : "Add at least one name — it will appear on the proposal."}
      />
    </div>
  );
}
