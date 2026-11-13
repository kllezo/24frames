"use client";

import { optimised } from "../ui/optimised";
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "../ensemble.module.css";
import cx from "../cinema.module.css";
import st from "../stages.module.css";
import base from "../studio.module.css";
import { StageFooter, StageHeader } from "./StageChrome";
import Stepper from "../ui/Stepper";
import QtyInput, { MAX_QTY } from "../ui/QtyInput";
import { scrollToElement } from "../ui/scroll";
import { flyToFolio } from "../ui/fly";
import IllustrativeTag from "../ui/IllustrativeTag";
import AnimatedNumber from "../ui/AnimatedNumber";
import { formatDateLong, formatINR, groupIndian, plural, roman } from "@/lib/commission/format";
import { occasionImage, occasionLine, storyFor } from "@/lib/commission/stories";
import { eventDisplayName, getAssignment } from "@/lib/commission/model";
import { guidanceFor, type EventGuidance } from "@/lib/commission/recommendations";
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
  const openService = services.find((s) => s.id === dossier) ?? null;

  return (
    <div className={st.stageInner}>
      <div className={cx.castHead}>
        <StageHeader
          frame="05"
          kicker="Frame 05 · The Casting"
          title={<>Cast your crew, <em>occasion by occasion.</em></>}
        />
        <div className={cx.castTools}>
          <div className={base.segmented} role="tablist" aria-label="View">
            <button role="tab" aria-selected={view === "catalogue"} className={view === "catalogue" ? base.segOn : ""} onClick={() => setView("catalogue")}>
              Occasion by occasion
            </button>
            <button role="tab" aria-selected={view === "matrix"} className={view === "matrix" ? base.segOn : ""} onClick={() => setView("matrix")}>
              Full composition
            </button>
          </div>
          <span className={base.mono}>
            {plural(quote.totalProfessionals, "PROFESSIONAL").toUpperCase()} · {formatINR(quote.productionSubtotal)}
          </span>
        </div>
      </div>

      {view === "catalogue" ? (
        <>
          <div className={styles.eventTabs} role="tablist" aria-label="Casting for occasion" data-cast-top>
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
            <section className={`${cx.scene} ${cx.sceneThemed}`} data-theme={event.type} key={event.id} aria-live="polite">
              <span className={cx.scenePattern} aria-hidden="true" />
              <p className={cx.sceneKicker}>
                Occasion {draft.events.findIndex((e) => e.id === event.id) + 1} of {draft.events.length}
              </p>
              <h2 className={cx.sceneTitle} data-depth="6">{eventDisplayName(event, config)}</h2>
              <span className={cx.ornament} aria-hidden="true"><i /></span>
              <p className={cx.sceneLine}>{occasionLine(event.type)}</p>
              <p className={cx.sceneMeta}>
                {[
                  event.date ? formatDateLong(event.date) : "",
                  event.guestCount ? `${groupIndian(event.guestCount)} guests` : "",
                  event.venue,
                ].filter(Boolean).join("  ·  ") || "Date and venue to be confirmed"}
              </p>
              <div className={cx.sceneTotal}>
                <span>
                  {(eventQuote?.professionals ?? 0) === 0
                    ? "No one cast yet"
                    : `${eventQuote!.professionals} ${eventQuote!.professionals === 1 ? "person" : "people"} cast`}
                </span>
                <AnimatedNumber value={eventQuote?.subtotal ?? 0} />
              </div>
            </section>
          )}

          {g && <GuidancePanel guidance={g} event={event!} {...props} />}

          <div className={cx.posterGrid} data-theme={event?.type}>
            {services.map((s, i) => {
              const a = event ? getAssignment(draft, event.id, s.id) : undefined;
              const q = a?.quantity ?? 0;
              const sug = g?.suggestions.find((x) => x.serviceId === s.id);
              const suitable = !event || s.suitableFor.length === 0 || s.suitableFor.includes(event.type);
              const line = eventQuote?.lines.find((l) => l.serviceId === s.id);
              const story = event ? storyFor(s.id, event.type, eventDisplayName(event, config)) : null;
              return (
                <article
                  key={`${focusEvent}-${s.id}`}
                  className={`${cx.poster} ${q > 0 ? cx.posterOn : ""}`}
                  style={{ "--i": i } as React.CSSProperties}
                  data-tilt="5"
                  onClick={(ev) => {
                    if ((ev.target as HTMLElement).closest("button, input")) return;
                    setDossier(s.id);
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className={cx.posterImg} src={optimised(s.image, 640)} alt={s.imageAlt} loading="lazy" decoding="async" id={`img-${s.id}`} />
                  <span className={cx.posterShade} aria-hidden="true" />
                  <span className={cx.posterNo}>{roman(i)}</span>
                  {s.signature && <span className={cx.posterBadge}>Signature</span>}
                  {q > 0 && <span className={cx.posterCount} aria-hidden="true">×{q}</span>}
                  <div className={cx.posterBody}>
                    <h3 className={cx.posterName}>
                      <button className={cx.posterNameBtn} onClick={() => setDossier(s.id)} aria-label={`${s.name} — full profile`}>{s.name}</button>
                    </h3>
                    <p className={cx.posterLine}>{story?.headline ?? s.introduction}</p>
                    {sug && sug.quantity !== q && (
                      <button className={cx.posterSug} onClick={() => event && actions.setQuantity(event.id, s.id, Math.min(sug.quantity, MAX_QTY))} title={sug.reason}>
                        ✦ Studio suggests {sug.quantity}
                      </button>
                    )}
                    {event && (
                      <div className={cx.posterFoot}>
                        <span className={cx.posterPrice}>
                          {formatINR(s.price)}
                          <small>{line ? `${formatINR(line.lineTotal)} total` : "per person"}</small>
                        </span>
                        {q === 0 ? (
                          <button
                            className={cx.posterAdd}
                            onClick={() => {
                              actions.setQuantity(event.id, s.id, 1);
                              flyToFolio(document.getElementById(`img-${s.id}`));
                            }}
                          >
                            <span aria-hidden="true">+</span> Add
                          </button>
                        ) : (
                          <div className={cx.posterStep}>
                            <button onClick={() => actions.setQuantity(event.id, s.id, q - 1)} aria-label={`One fewer ${s.name}`}>−</button>
                            <QtyInput className={cx.posterQty} value={q} label={`Number of ${s.name}`} onChange={(n) => actions.setQuantity(event.id, s.id, n)} />
                            <button
                              onClick={() => { if (q < MAX_QTY) { actions.setQuantity(event.id, s.id, q + 1); flyToFolio(document.getElementById(`img-${s.id}`)); } }}
                              disabled={q >= MAX_QTY}
                              aria-label={`One more ${s.name}`}
                            >+</button>
                          </div>
                        )}
                      </div>
                    )}
                    {!sug && !suitable && <span className={cx.posterQuiet}>Less typical for this occasion</span>}
                  </div>
                </article>
              );
            })}
          </div>

          {event && draft.events.length > 1 && (
            <div className={cx.nextScene}>
              {(() => {
                const idx = draft.events.findIndex((e) => e.id === event.id);
                const next = draft.events[idx + 1];
                return next ? (
                  <button
                    className={cx.nextSceneBtn}
                    data-theme={next.type}
                    onClick={() => {
                      setFocusEvent(next.id);
                      scrollToElement(document.querySelector<HTMLElement>("[data-cast-top]"), -110);
                    }}
                  >
                    <span className={base.mono}>Next occasion</span>
                    <b>{eventDisplayName(next, config)}</b>
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M14 6l6 6-6 6" /></svg>
                  </button>
                ) : (
                  <p className={st.muted}>That was your last occasion. Review the full composition, or continue to delivery.</p>
                );
              })()}
            </div>
          )}
        </>
      ) : (
        <Matrix {...props} services={services} guidance={guidance} onOpen={setDossier} />
      )}

      {openService && (
        <Dossier service={openService} onClose={() => setDossier(null)} guidance={guidance} {...props} />
      )}

      <StageFooter
        onBack={() => go("crew")}
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
    <div className={`${styles.matrixWrap} ${cx.mxWrap}`} data-lenis-prevent tabIndex={0} aria-label="Composition matrix — scroll horizontally on small screens">
      <table className={`${styles.matrix} ${cx.mx}`}>
        <thead>
          <tr>
            <th scope="col" className={styles.matrixCorner}>Event</th>
            {services.map((s) => (
              <th key={s.id} scope="col">
                <button className={`${styles.matrixSvc} ${cx.mxSvc}`} onClick={() => onOpen(s.id)}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={optimised(s.image, 256)} alt="" loading="lazy" decoding="async" />
                  <span>{s.name.replace(/ (Photographer|Videographer)$/, (m) => m === " Photographer" ? " Photo" : " Video").replace("Aerial Photography & Drone", "Aerial").replace("Creative Cinematography", "Cinematography")}</span>
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
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className={cx.mxThumb} src={optimised(occasionImage(e.type), 256)} alt="" loading="lazy" decoding="async" />
                  <span className={styles.matrixEvent}>{eventDisplayName(e, config)}</span>
                  <small>{e.guestCount ? `${groupIndian(e.guestCount)} guests` : ""}</small>
                </th>
                {services.map((s) => {
                  const q = getAssignment(draft, e.id, s.id)?.quantity ?? 0;
                  const sug = g?.suggestions.find((x) => x.serviceId === s.id);
                  return (
                    <td key={s.id} className={q > 0 ? styles.matrixOn : ""}>
                      <Stepper size="sm" value={q} label={`${s.name}, ${eventDisplayName(e, config)}`} onChange={(n) => actions.setQuantity(e.id, s.id, n)} />
                      {sug && sug.quantity !== q && (
                        <button className={styles.matrixSug} onClick={() => actions.setQuantity(e.id, s.id, Math.min(sug.quantity, MAX_QTY))} title={sug.reason}>
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
  portal,
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

  return (
    <dialog data-lenis-prevent ref={ref} className={styles.dossier} onClose={onClose} aria-labelledby="dossier-title" onClick={(e) => { if (e.target === ref.current) ref.current?.close(); }}>
      <div className={styles.dossierInner}>
        <div className={styles.dossierMedia}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={optimised(s.image, 828)} alt={s.imageAlt} decoding="async" />
          <div className={styles.dossierMediaCap}>
            <span className={base.mono}>No. {String(s.order).padStart(2, "0")} · {s.epithet.toUpperCase()}</span>
          </div>
        </div>
        <div className={`${styles.dossierText} ${cx.dos}`}>
          <button className={styles.dossierClose} onClick={() => ref.current?.close()} aria-label="Close">
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" /></svg>
          </button>
          <p className={cx.dosEpithet}>{s.epithet}</p>
          <h2 id="dossier-title" className={cx.dosName}>{s.name}</h2>
          <p className={cx.dosIntro}>{s.introduction}</p>

          <div className={cx.dosChips}>
            {s.deliverables.slice(0, 3).map((c) => <span key={c}>{c}</span>)}
          </div>

          <div className={cx.dosPrice}>
            <span>{formatINR(s.price)}</span>
            <small>{s.unitLabel}</small>
            <IllustrativeTag show={config.pricingIsIllustrative} compact />
          </div>

          <div className={cx.dosAssignHead}>
            <h3>Add to your occasions</h3>
            {draft.events.some((e) => !getAssignment(draft, e.id, s.id)) && (
              <button
                className={cx.addBtn}
                onClick={() => draft.events.forEach((e) => { if (!getAssignment(draft, e.id, s.id)) actions.setQuantity(e.id, s.id, 1); })}
              >
                <span aria-hidden="true">+</span> Every occasion
              </button>
            )}
          </div>
          <ul className={cx.dosList}>
            {draft.events.map((e) => {
              const a = getAssignment(draft, e.id, s.id);
              const q = a?.quantity ?? 0;
              const sug = guidance.get(e.id)?.suggestions.find((x) => x.serviceId === s.id);
              const line = lines.find((l) => l.eventId === e.id);
              return (
                <li key={e.id} className={q > 0 ? cx.dosOn : ""}>
                  <div className={cx.dosRow}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={optimised(occasionImage(e.type), 256)} alt="" loading="lazy" decoding="async" />
                    <span className={cx.dosEvent}>
                      <b>{eventDisplayName(e, config)}</b>
                      {sug && sug.quantity !== q ? (
                        <button className={cx.dosSug} onClick={() => actions.setQuantity(e.id, s.id, Math.min(sug.quantity, MAX_QTY))} title={sug.reason}>
                          Suggested {sug.quantity}
                        </button>
                      ) : (
                        <small>{line ? formatINR(line.lineTotal) : "Not added"}</small>
                      )}
                    </span>
                    <Stepper value={q} size="sm" label={`${s.name}, ${eventDisplayName(e, config)}`} onChange={(n) => actions.setQuantity(e.id, s.id, n)} />
                  </div>
                  {q > 0 && !portal && (
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
                        {a?.unitPriceOverride != null ? `Studio price ${formatINR(a.unitPriceOverride)} · change` : "Adjust price"}
                      </button>
                    )
                  )}
                </li>
              );
            })}
          </ul>
          <div className={cx.dosTotal}>
            <span>Across your celebration</span>
            <AnimatedNumber value={total} />
          </div>
          <button className={base.btnPrimary} onClick={() => ref.current?.close()}>
            Done
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M14 6l6 6-6 6" /></svg>
          </button>
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
