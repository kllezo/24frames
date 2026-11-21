import Link from "next/link";
import s from "./submitted.module.css";
import { formatINR } from "@/lib/commission/format";
import type { ManagerCard } from "@/lib/portal/types";

export default function Submitted({
  first,
  couple,
  reference,
  estimate,
  events,
  changes,
  manager,
}: {
  first: string;
  couple: string;
  reference: string;
  estimate: number;
  events: number;
  changes: boolean;
  manager: ManagerCard | null;
}) {
  const rm = manager?.name.split(" ")[0];
  const wa = manager?.phone.replace(/[^\d]/g, "") ?? "";
  const steps = changes
    ? [
        ["Your changes reach the studio", `${rm ?? "Your relationship manager"} has been told what changed.`],
        ["We review them", "Prices are re-checked against your updated selections."],
        ["Your updated quotation", "It appears in your account as soon as it is ready."],
      ]
    : [
        ["We review your selections", "The team looks over every event, crew and deliverable you chose."],
        [`${rm ? `${rm} calls you` : "We call you"}`, "To confirm the details — dates, venues, and anything you'd like to change."],
        ["Your final quotation", "Shared here in your account, ready to accept when you are."],
      ];

  return (
    <main className={s.page}>
      <div className={s.card}>
        <div className={s.seal} aria-hidden="true">
          <svg viewBox="0 0 120 120">
            <circle className={s.ring} cx="60" cy="60" r="54" pathLength={1} />
            <circle className={s.ringInner} cx="60" cy="60" r="46" />
            <path className={s.tick} d="M40 61 L54 75 L82 46" pathLength={1} />
          </svg>
        </div>

        <p className={s.kicker}>{changes ? "Changes received" : "Quotation received"}</p>
        <h1 className={s.title}>
          Thank you, <em>{first}.</em>
        </h1>
        <p className={s.lead}>
          {changes
            ? "Your changes are with the studio. We'll look them over and update your quotation."
            : `Your quotation${couple ? ` for ${couple}` : ""} is now with 24 Frames. It is the first step of something we'll take great care of.`}
        </p>

        <dl className={s.facts}>
          <div>
            <dt>Reference</dt>
            <dd>{reference}</dd>
          </div>
          <div>
            <dt>Events</dt>
            <dd>{events}</dd>
          </div>
          <div>
            <dt>Estimate</dt>
            <dd>{formatINR(estimate)}</dd>
          </div>
        </dl>

        <ol className={s.steps}>
          {steps.map(([t, d], i) => (
            <li key={t} style={{ "--i": i } as React.CSSProperties}>
              <span className={s.stepNo}>{String(i + 1).padStart(2, "0")}</span>
              <span>
                <b>{t}</b>
                {d}
              </span>
            </li>
          ))}
        </ol>

        {manager && (
          <div className={s.rm}>
            <span className={s.rmMono} aria-hidden="true">
              {manager.name.slice(0, 1)}
            </span>
            <span className={s.rmText}>
              <b>{manager.name}</b>
              Your relationship manager
            </span>
            <span className={s.rmActions}>
              {wa && (
                <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>
              )}
              <a href={`tel:${manager.phone}`}>Call</a>
            </span>
          </div>
        )}

        <div className={s.actions}>
          <Link href="/account" className={s.primary}>
            View my quotations
          </Link>
          <Link href="/" className={s.secondary}>
            Back to 24 Frames
          </Link>
        </div>
        <p className={s.fine}>The estimate is indicative; the studio confirms your final price after reviewing your selections.</p>
      </div>
    </main>
  );
}
