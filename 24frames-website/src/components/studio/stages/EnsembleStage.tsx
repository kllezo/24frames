"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styles from "../ensemble.module.css";
import st from "../stages.module.css";
import base from "../studio.module.css";
import { StageFooter, StageHeader } from "./StageChrome";
import Stepper from "../ui/Stepper";
import IllustrativeTag from "../ui/IllustrativeTag";
import AnimatedNumber from "../ui/AnimatedNumber";
import { formatINR, groupIndian, plural } from "@/lib/commission/format";
import { eventDisplayName, getAssignment } from "@/lib/commission/model";
import { commissionNotes, guidanceFor, type EventGuidance } from "@/lib/commission/recommendations";
import type { CelebrationEvent, ServiceDefinition } from "@/lib/commission/types";
import type { StageProps } from "./types";

type View = "catalogue" | "matrix";

export default function EnsembleStage(props: StageProps) {
  const { config, draft, quote, actions, go } = props;
  const services = useMemo(
    () => config.services.filter((s) => s.active).sort((a, b) => a.order - b.order),
    [config.services],
  );
  const guidance = useMemo(() => guidanceFor(draft, config), [draft, config]);
  const [view, setView] = useState<View>("catalogue");
  const [chosenEvent, setFocusEvent] = useState<string>(draft.events[0]?.id ?? "");
  const [dossier, setDossier] = useState<string | null>(null);
  // Fall back to the first event if the chosen one was removed.
  const focusEvent = draft.events.some((e) => e.id === chosenEvent) ? chosenEvent : (draft.events[0]?.id ?? "");

  const event = draft.events.find((e) => e.id === focusEvent) ?? null;
  const eventQuote = quote.events.find((e) => e.eventId === focusEvent);
  const g = event ? guidance.get(event.id) : undefined;
  const notes = commissionNotes(draft);
  const openService = services.find((s) => s.id === dossier) ?? null;

  return (
    <div className={st.stageInner}>
      <StageHeader
        frame="03"
        kicker="Frame 03 · The Ensemble"
        title={<>Compose your <em>creative team.</em></>}
        lead="Seven disciplines, each with its own way of seeing. Choose who joins each event — and how many."
      >
        <IllustrativeTag show={config.pricingIsIllustrative} />
      </StageHeader>

      <div className={styles.toolbar}>
        <div className={base.segmented} role="tablist" aria-label="View">
          <button role="tab" aria-selected={view === "catalogue"} className={view === "catalogue" ? base.segOn : ""} onClick={() => setView("catalogue")}>
            Event by event
          </button>
          <button role="tab" aria-selected={view === "matrix"} className={view === "matrix" ? base.segOn : ""} onClick={() => setView("matrix")}>
            Full composition
          </button>
        </div>
        <span className={base.mono}>
          {plural(quote.totalProfessionals, "PROFESSIONAL").toUpperCase()} · {formatINR(quote.productionSubtotal)}
        </span>
      </div>

      {notes.length > 0 && (
        <ul className={styles.commissionNotes}>
          {notes.map((n) => <li key={n}>{n}</li>)}
        </ul>
      )}

      {view === "catalogue" ? (
        <>
          <div className={styles.eventTabs} role="tablist" aria-label="Composing for event">
            {draft.events.map((e, i) => {
              const pe = quote.events.find((x) => x.eventId === e.id);
              return (
                <button
                  key={e.id}
                  role="tab"
                  aria-selected={e.id === focusEvent}
                  className={`${styles.eventTab} ${e.id === focusEvent ? styles.eventTabOn : ""}`}
                  onClick={() => setFocusEvent(e.id)}
                >
                  <span className={base.mono}>{String(i + 1).padStart(2, "0")}</span>
                  <span className={styles.eventTabName}>{eventDisplayName(e, config)}</span>
                  <span className={styles.eventTabMeta}>
                    {pe && pe.professionals > 0 ? `${pe.professionals} · ${formatINR(pe.subtotal)}` : "No team yet"}
                  </span>
                </button>
              );
            })}
          </div>

          {event && (
            <section className={styles.focusHead} aria-live="polite">
              <div>
                <p className={base.kicker}>Composing for</p>
                <h2 className={styles.focusTitle}>{eventDisplayName(event, config)}</h2>
                <p className={st.muted}>
                  {[event.guestCount ? `${groupIndian(event.guestCount)} guests` : "Guest count not set", event.venue].filter(Boolean).join(" · ")}
                </p>
              </div>
              <div className={styles.focusTotal}>
                <span>Event subtotal</span>
                <AnimatedNumber value={eventQuote?.subtotal ?? 0} />
              </div>
            </section>
          )}

          {g && <GuidancePanel guidance={g} event={event!} {...props} />}

          <div className={styles.catalogue}>
            {services.map((s, i) => {
              const a = event ? getAssignment(draft, event.id, s.id) : undefined;
              const q = a?.quantity ?? 0;
              const sug = g?.suggestions.find((x) => x.serviceId === s.id);
              const suitable = !event || s.suitableFor.length === 0 || s.suitableFor.includes(event.type);
              const line = eventQuote?.lines.find((l) => l.serviceId === s.id);
              return (
                <article key={s.id} className={`${styles.card} ${q > 0 ? styles.cardOn : ""} ${s.signature ? styles.cardSignature : ""}`} style={{ animationDelay: `${i * 60}ms` }}>
                  <button className={styles.cardMedia} onClick={() => setDossier(s.id)} aria-label={`Explore ${s.name}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.image} alt={s.imageAlt} loading="lazy" />
                    <span className={styles.cardNo}>No. {String(s.order).padStart(2, "0")}</span>
                    {s.signature && <span className={styles.cardBadge}>Signature</span>}
                    {q > 0 && <span className={styles.cardCount} aria-hidden="true">×{q}</span>}
                  </button>
                  <div className={styles.cardBody}>
                    <p className={styles.cardEpithet}>{s.epithet}</p>
                    <h3 className={styles.cardName}>{s.name}</h3>
                    <p className={styles.cardIntro}>{s.introduction}</p>
                    <p className={styles.cardPrice}>
                      {formatINR(s.price)} <small>{s.unitLabel}</small>
                    </p>
                    {event && (
                      <div className={styles.cardControls}>
                        <Stepper
                          value={q}
                          max={s.maxQuantity}
                          min={0}
                          label={`${s.name} for ${eventDisplayName(event, config)}`}
                          onChange={(n) => actions.setQuantity(event.id, s.id, n)}
                        />
                        <span className={styles.cardLine}>{line ? formatINR(line.lineTotal) : "—"}</span>
                      </div>
                    )}
                    <div className={styles.cardFoot}>
                      {sug ? (
                        sug.quantity === q ? (
                          <span className={styles.sugMatched}>Matches the studio suggestion</span>
                        ) : (
                          <button className={styles.sugChip} onClick={() => event && actions.setQuantity(event.id, s.id, Math.min(sug.quantity, s.maxQuantity))} title={sug.reason}>
                            Suggested {sug.quantity} · apply
                          </button>
                        )
                      ) : !suitable ? (
                        <span className={styles.sugQuiet}>Less typical for this event</span>
                      ) : <span />}
                      <button className={base.btnText} onClick={() => setDossier(s.id)}>Discover →</button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </>
      ) : (
        <Matrix {...props} services={services} guidance={guidance} onOpen={setDossier} />
      )}

      {openService && (
        <Dossier service={openService} onClose={() => setDossier(null)} guidance={guidance} {...props} />
      )}

      <StageFooter
        onBack={() => go("celebration")}
        onNext={() => go("delivery")}
        nextLabel="Choose your delivery"
        hint={quote.lines.length === 0 ? "Select at least one professional for any event." : undefined}
        nextDisabled={quote.lines.length === 0}
      />
    </div>
  );
}

function GuidancePanel({ guidance, event, config }: { guidance: EventGuidance; event: CelebrationEvent } & StageProps) {
  const [open, setOpen] = useState(false);
  if (guidance.suggestions.length === 0 && guidance.notes.length === 0) return null;
  const names = new Map(config.services.map((s) => [s.id, s.name]));
  return (
    <section className={styles.guidance} aria-label={`Studio guidance for ${eventDisplayName(event, config)}`}>
      <button className={styles.guidanceHead} onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 11v6M12 7.5v.5" /></svg>
        <span>
          <b>Studio guidance</b> — a suggested team of{" "}
          {plural(guidance.suggestions.reduce((s, x) => s + x.quantity, 0), "professional")}. Suggestions are never added for you.
        </span>
        <span className={base.mono}>{open ? "HIDE" : "WHY"}</span>
      </button>
      {open && (
        <div className={styles.guidanceBody}>
          <ul>
            {guidance.suggestions.map((s) => (
              <li key={s.serviceId}>
                <b>{s.quantity} × {names.get(s.serviceId)}</b> — {s.reason}
              </li>
            ))}
          </ul>
          {guidance.notes.length > 0 && (
            <ul className={styles.guidanceNotes}>
              {guidance.notes.map((n) => <li key={n}>{n}</li>)}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}

function Matrix({
  config,
  draft,
  quote,
  actions,
  services,
  guidance,
  onOpen,
}: StageProps & { services: ServiceDefinition[]; guidance: Map<string, EventGuidance>; onOpen: (id: string) => void }) {
  return (
    <div className={styles.matrixWrap} tabIndex={0} aria-label="Composition matrix — scroll horizontally on small screens">
      <table className={styles.matrix}>
        <thead>
          <tr>
            <th scope="col" className={styles.matrixCorner}>Event</th>
            {services.map((s) => (
              <th key={s.id} scope="col">
                <button className={styles.matrixSvc} onClick={() => onOpen(s.id)}>
                  <span>{s.name}</span>
                  <small>{formatINR(s.price)}</small>
                </button>
              </th>
            ))}
            <th scope="col" className={styles.matrixTotalHead}>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {draft.events.map((e) => {
            const pe = quote.events.find((x) => x.eventId === e.id);
            const g = guidance.get(e.id);
            return (
              <tr key={e.id}>
                <th scope="row">
                  <span className={styles.matrixEvent}>{eventDisplayName(e, config)}</span>
                  <small>{e.guestCount ? `${groupIndian(e.guestCount)} guests` : ""}</small>
                </th>
                {services.map((s) => {
                  const q = getAssignment(draft, e.id, s.id)?.quantity ?? 0;
                  const sug = g?.suggestions.find((x) => x.serviceId === s.id);
                  return (
                    <td key={s.id} className={q > 0 ? styles.matrixOn : ""}>
                      <Stepper size="sm" value={q} max={s.maxQuantity} label={`${s.name}, ${eventDisplayName(e, config)}`} onChange={(n) => actions.setQuantity(e.id, s.id, n)} />
                      {sug && sug.quantity !== q && (
                        <button className={styles.matrixSug} onClick={() => actions.setQuantity(e.id, s.id, Math.min(sug.quantity, s.maxQuantity))} title={sug.reason}>
                          suggest {sug.quantity}
                        </button>
                      )}
                    </td>
                  );
                })}
                <td className={styles.matrixTotal}><AnimatedNumber value={pe?.subtotal ?? 0} /></td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <th scope="row">Creative production</th>
            {services.map((s) => {
              const total = quote.lines.filter((l) => l.serviceId === s.id).reduce((a, l) => a + l.lineTotal, 0);
              return <td key={s.id}>{total ? formatINR(total) : "—"}</td>;
            })}
            <td className={styles.matrixTotal}><AnimatedNumber value={quote.productionSubtotal} /></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

function Dossier({
  service: s,
  onClose,
  guidance,
  config,
  draft,
  quote,
  actions,
}: { service: ServiceDefinition; onClose: () => void; guidance: Map<string, EventGuidance> } & StageProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const [editing, setEditing] = useState<string | null>(null);
  useEffect(() => {
    const d = ref.current;
    if (d && !d.open) d.showModal();
    document.documentElement.style.overflow = "hidden";
    return () => { document.documentElement.style.overflow = ""; };
  }, []);
  const lines = quote.lines.filter((l) => l.serviceId === s.id);
  const total = lines.reduce((a, l) => a + l.lineTotal, 0);
  const suitableLabels = s.suitableFor.length
    ? s.suitableFor.map((id) => config.eventPresets.find((p) => p.id === id)?.label).filter(Boolean).join(", ")
    : "Every occasion";

  return (
    <dialog ref={ref} className={styles.dossier} onClose={onClose} aria-labelledby="dossier-title" onClick={(e) => { if (e.target === ref.current) ref.current?.close(); }}>
      <div className={styles.dossierInner}>
        <div className={styles.dossierMedia}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={s.image} alt={s.imageAlt} />
          <div className={styles.dossierMediaCap}>
            <span className={base.mono}>No. {String(s.order).padStart(2, "0")} · {s.epithet.toUpperCase()}</span>
          </div>
        </div>
        <div className={styles.dossierText}>
          <button className={styles.dossierClose} onClick={() => ref.current?.close()} aria-label="Close">
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" /></svg>
          </button>
          <p className={base.kicker}>{s.epithet}</p>
          <h2 id="dossier-title" className={styles.dossierTitle}>{s.name}</h2>
          <p className={styles.dossierIntro}>{s.introduction}</p>
          <p>{s.role}</p>

          <div className={styles.dossierCols}>
            <div>
              <h3>What they capture</h3>
              <ul>{s.captures.map((c) => <li key={c}>{c}</li>)}</ul>
            </div>
            <div>
              <h3>What you receive</h3>
              <ul>{s.deliverables.map((c) => <li key={c}>{c}</li>)}</ul>
            </div>
          </div>
          <blockquote className={styles.dossierWhy}>{s.whyItMatters}</blockquote>
          <dl className={styles.dossierFacts}>
            <div><dt>Suited to</dt><dd>{suitableLabels}</dd></div>
            <div><dt>Recommended team</dt><dd>{s.recommendedNote}</dd></div>
            <div><dt>Investment</dt><dd>{formatINR(s.price)} <small>{s.unitLabel}</small> <IllustrativeTag show={config.pricingIsIllustrative} compact /></dd></div>
            {s.technicalNotes?.length ? (
              <div><dt>Requirements</dt><dd><ul>{s.technicalNotes.map((n) => <li key={n}>{n}</li>)}</ul></dd></div>
            ) : null}
          </dl>

          <h3 className={styles.assignTitle}>Assign to your events</h3>
          <ul className={styles.assignList}>
            {draft.events.map((e) => {
              const a = getAssignment(draft, e.id, s.id);
              const q = a?.quantity ?? 0;
              const sug = guidance.get(e.id)?.suggestions.find((x) => x.serviceId === s.id);
              const line = lines.find((l) => l.eventId === e.id);
              return (
                <li key={e.id} className={q > 0 ? styles.assignOn : ""}>
                  <div className={styles.assignRow}>
                    <span className={styles.assignEvent}>
                      {eventDisplayName(e, config)}
                      {sug && <small title={sug.reason}>Suggested: {sug.quantity}{sug.quantity !== q && (
                        <button className={base.btnText} onClick={() => actions.setQuantity(e.id, s.id, Math.min(sug.quantity, s.maxQuantity))}>apply</button>
                      )}</small>}
                    </span>
                    <Stepper value={q} max={s.maxQuantity} label={`${s.name}, ${eventDisplayName(e, config)}`} onChange={(n) => actions.setQuantity(e.id, s.id, n)} />
                    <span className={styles.assignAmt}>
                      {line ? formatINR(line.lineTotal) : "—"}
                      {line?.overridden && <small>adjusted</small>}
                    </span>
                  </div>
                  {q > 0 && (
                    editing === e.id ? (
                      <PriceOverride
                        initial={a?.unitPriceOverride ?? null}
                        reason={a?.overrideReason ?? ""}
                        catalogue={s.price}
                        onSave={(price, reason) => { actions.setPriceOverride(e.id, s.id, price, reason); setEditing(null); }}
                        onCancel={() => setEditing(null)}
                      />
                    ) : (
                      <button className={styles.overrideLink} onClick={() => setEditing(e.id)}>
                        {a?.unitPriceOverride != null ? `Studio price ${formatINR(a.unitPriceOverride)} — ${a.overrideReason} · change` : "Studio price adjustment"}
                      </button>
                    )
                  )}
                </li>
              );
            })}
          </ul>
          <div className={styles.dossierTotal}>
            <span>{s.name} across your celebration</span>
            <AnimatedNumber value={total} />
          </div>
          <button className={base.btnPrimary} onClick={() => ref.current?.close()}>Return to the ensemble</button>
        </div>
      </div>
    </dialog>
  );
}

function PriceOverride({
  initial,
  reason: initialReason,
  catalogue,
  onSave,
  onCancel,
}: {
  initial: number | null;
  reason: string;
  catalogue: number;
  onSave: (price: number | null, reason: string) => void;
  onCancel: () => void;
}) {
  const [price, setPrice] = useState(initial === null ? "" : String(initial));
  const [reason, setReason] = useState(initialReason);
  const n = Number(price);
  const valid = price !== "" && Number.isFinite(n) && n >= 0 && reason.trim().length > 0;
  return (
    <div className={styles.override}>
      <p className={st.muted}>For the consultant: record a negotiated unit price. It appears on the proposal as a studio adjustment. Catalogue price {formatINR(catalogue)}.</p>
      <label className={base.field}>
        <span className={base.fieldLabel}>Unit price (₹)</span>
        <input className={base.input} type="number" min={0} inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value)} />
      </label>
      <label className={base.field}>
        <span className={base.fieldLabel}>Reason</span>
        <input className={base.input} value={reason} maxLength={120} onChange={(e) => setReason(e.target.value)} placeholder="e.g. Returning family" />
      </label>
      <div className={styles.overrideActions}>
        <button className={base.btnPrimary} disabled={!valid} onClick={() => onSave(Math.round(n), reason.trim())}>Apply price</button>
        {initial !== null && <button className={base.btnSecondary} onClick={() => onSave(null, "")}>Restore catalogue price</button>}
        <button className={base.btnText} onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}
