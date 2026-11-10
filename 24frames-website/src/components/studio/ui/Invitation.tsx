"use client";

import { useState } from "react";
import cx from "../cinema.module.css";
import Crest from "./Crest";
import { formatDateLong, weekdayOf } from "@/lib/commission/format";
import type { CoupleDetails } from "@/lib/commission/types";

const CONTACT_LABEL = { whatsapp: "WhatsApp", call: "a phone call", email: "email" } as const;

/* A wedding invitation that writes itself as the couple types. It tilts
   toward the pointer and turns over to show how the studio will reach them. */
export default function Invitation({ couple: c }: { couple: CoupleDetails }) {
  const [flipped, setFlipped] = useState(false);
  const [hint, setHint] = useState(false);
  const blank = !c.brideName.trim() && !c.groomName.trim();
  /** The card is a preview: tapping it while blank points to the form. */
  function tapCard() {
    if (blank && !flipped) {
      setHint(true);
      window.setTimeout(() => setHint(false), 4200);
      const field = document.getElementById("bride-name") as HTMLInputElement | null;
      field?.scrollIntoView({ behavior: "smooth", block: "center" });
      window.setTimeout(() => field?.focus({ preventScroll: true }), 450);
      return;
    }
    setFlipped((f) => !f);
  }
  const bride = c.brideName.trim();
  const groom = c.groomName.trim();
  const when = c.weddingDate
    ? `${weekdayOf(c.weddingDate)}, ${formatDateLong(c.weddingDate)}`
    : c.approximateDate.trim() || "A date to be announced";

  return (
    <div className={cx.invite}>
      <div
        className={`${cx.inviteCard} ${flipped ? cx.inviteFlipped : ""}`}
        data-tilt="9"
        onClick={tapCard}
        role="button"
        tabIndex={0}
        aria-label={flipped ? "Turn the invitation to the front" : "Turn the invitation over"}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); tapCard(); } }}
      >
        <div className={cx.inviteFace}>
          <Crest className={cx.inviteCrest} numeral={[bride[0], groom[0]].filter(Boolean).join("") || undefined} />
          <p className={cx.inviteSmall}>Together with their families</p>
          <p className={cx.inviteNames}>
            <span className={bride ? "" : cx.inviteGhost}>{bride || "The bride"}</span>
            <em>&amp;</em>
            <span className={groom ? "" : cx.inviteGhost}>{groom || "The groom"}</span>
          </p>
          <p className={cx.inviteSmall}>request the pleasure of your company</p>
          <span className={cx.ornament} aria-hidden="true"><i /></span>
          <p className={cx.inviteWhen}>{when}</p>
          <p className={cx.inviteWhere}>{c.city.trim() || "City to be announced"}</p>
          <p className={cx.inviteFoot}>Photographed &amp; filmed by 24 Frames</p>
        </div>
        <div className={`${cx.inviteFace} ${cx.inviteBack}`}>
          <p className={cx.inviteSmall}>Répondez s&apos;il vous plaît</p>
          <p className={cx.inviteBackTitle}>How we&apos;ll reach you</p>
          <dl className={cx.inviteDl}>
            <div><dt>Phone</dt><dd>{c.phone.trim() || "—"}</dd></div>
            <div><dt>Email</dt><dd>{c.email.trim() || "—"}</dd></div>
            <div><dt>Prefers</dt><dd>{CONTACT_LABEL[c.preferredContact]}</dd></div>
          </dl>
          {c.notes.trim() && <p className={cx.inviteNote}>&ldquo;{c.notes.trim().slice(0, 140)}{c.notes.length > 140 ? "…" : ""}&rdquo;</p>}
        </div>
      </div>
      {hint && (
        <p className={cx.inviteHint} role="status">
          This card is a preview — type the names in the form and it writes itself.
        </p>
      )}
      <button type="button" className={cx.inviteTurn} onClick={() => setFlipped((f) => !f)}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3M18 3v4h-4M6 21v-4h4" /></svg>
        {flipped ? "Turn to the front" : "Turn the card"}
      </button>
    </div>
  );
}
