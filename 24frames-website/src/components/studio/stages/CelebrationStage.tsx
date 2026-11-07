"use client";

import { useEffect, useRef, useState } from "react";
import styles from "../stages.module.css";
import base from "../studio.module.css";
import { StageFooter, StageHeader } from "./StageChrome";
import { CUSTOM_EVENT_TYPE } from "@/lib/commission/defaults";
import { dateParts, durationHours, formatDateLong, formatTimeRange, groupIndian, weekdayOf } from "@/lib/commission/format";
import { eventDisplayName, eventTypeLabel, overlappingEventIds } from "@/lib/commission/model";
import type { CelebrationEvent, CommissionDraft } from "@/lib/commission/types";
import type { StageProps } from "./types";

interface Removed {
  event: CelebrationEvent;
  index: number;
  assignments: CommissionDraft["assignments"];
}

export default function CelebrationStage({ config, draft, actions, go }: StageProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [removed, setRemoved] = useState<Removed | null>(null);
  const undoTimer = useRef<number | null>(null);
  const overlaps = overlappingEventIds(draft.events);

  useEffect(() => () => { if (undoTimer.current) window.clearTimeout(undoTimer.current); }, []);

  function add(type: string) {
    const lastDated = [...draft.events].reverse().find((e) => e.date);
    const id = actions.addEvent(type, {
      date: lastDated?.date ?? draft.couple.weddingDate ?? "",
      location: draft.couple.city,
    });
    setOpenId(id);
    requestAnimationFrame(() => {
      document.getElementById(`event-${id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  function remove(event: CelebrationEvent) {
    const index = draft.events.findIndex((e) => e.id === event.id);
    setRemoved({ event, index, assignments: draft.assignments.filter((a) => a.eventId === event.id) });
    actions.removeEvent(event.id);
    if (undoTimer.current) window.clearTimeout(undoTimer.current);
    undoTimer.current = window.setTimeout(() => setRemoved(null), 8000);
  }

  const dated = draft.events.filter((e) => e.date);
  const dates = Array.from(new Set(dated.map((e) => e.date))).sort();

  return (
    <div className={styles.stageInner}>
      <StageHeader
        frame="02"
        kicker="Frame 02 · The Celebration"
        title={<>Every wedding has its own <em>shape.</em></>}
        lead="Add each occasion of your celebration. Every event is composed independently — its own date, venue and creative team."
      />

      <section className={styles.presets} aria-label="Add an occasion">
        <p className={base.fieldLabel}>Add an occasion</p>
        <div className={styles.presetRow}>
          {config.eventPresets.map((p) => (
            <button key={p.id} className={styles.presetChip} onClick={() => add(p.id)}>
              <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 3v10M3 8h10" /></svg>
              {p.label}
            </button>
          ))}
          <button className={`${styles.presetChip} ${styles.presetCustom}`} onClick={() => add(CUSTOM_EVENT_TYPE)}>
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 3v10M3 8h10" /></svg>
            Custom event
          </button>
        </div>
      </section>

      {dates.length > 1 && (
        <section className={styles.ribbon} aria-label="Celebration across dates">
          {dates.map((d) => {
            const p = dateParts(d)!;
            const evs = dated.filter((e) => e.date === d);
            return (
              <div key={d} className={styles.ribbonDay}>
                <span className={styles.ribbonDate}>
                  <b>{p.day}</b> {p.month}
                </span>
                <span className={styles.ribbonDots}>
                  {evs.map((e) => (
                    <i key={e.id} title={eventDisplayName(e, config)} />
                  ))}
                </span>
                <span className={styles.ribbonNames}>{evs.map((e) => eventDisplayName(e, config)).join(" · ")}</span>
              </div>
            );
          })}
        </section>
      )}

      {draft.events.length === 0 ? (
        <div className={styles.emptyState}>
          <svg viewBox="0 0 120 60" aria-hidden="true">
            <path d="M4 30h112" />
            <circle cx="20" cy="30" r="4" />
            <circle cx="60" cy="30" r="4" />
            <circle cx="100" cy="30" r="4" />
          </svg>
          <p>Your celebration timeline is waiting for its first occasion.</p>
          <p className={styles.muted}>Choose Engagement, Haldi, Wedding — or create something entirely your own.</p>
        </div>
      ) : (
        <>
          <div className={styles.timelineTools}>
            <span className={base.mono}>{draft.events.length} {draft.events.length === 1 ? "OCCASION" : "OCCASIONS"}</span>
            {dated.length > 1 && (
              <button className={base.btnText} onClick={actions.sortEventsByDate}>Arrange by date &amp; time</button>
            )}
          </div>
          <ol className={styles.timeline}>
            {draft.events.map((event, i) => (
              <EventEntry
                key={event.id}
                event={event}
                index={i}
                total={draft.events.length}
                open={openId === event.id}
                overlapping={overlaps.has(event.id)}
                onToggle={() => setOpenId(openId === event.id ? null : event.id)}
                onRemove={() => remove(event)}
                {...{ config, actions }}
              />
            ))}
          </ol>
        </>
      )}

      {removed && (
        <div className={base.toast} role="status">
          <span>{eventDisplayName(removed.event, config)} removed{removed.assignments.length ? " with its creative team" : ""}.</span>
          <button
            className={base.btnTextLight}
            onClick={() => {
              actions.restoreEvent(removed.event, removed.index, removed.assignments);
              setRemoved(null);
            }}
          >
            Undo
          </button>
        </div>
      )}

      <StageFooter
        onBack={() => go("couple")}
        onNext={() => go("ensemble")}
        nextLabel="Compose the creative team"
        nextDisabled={draft.events.length === 0}
        hint={draft.events.length === 0 ? "Add at least one occasion to continue." : undefined}
      />
    </div>
  );
}

function EventEntry({
  event,
  index,
  total,
  open,
  overlapping,
  onToggle,
  onRemove,
  config,
  actions,
}: {
  event: CelebrationEvent;
  index: number;
  total: number;
  open: boolean;
  overlapping: boolean;
  onToggle: () => void;
  onRemove: () => void;
} & Pick<StageProps, "config" | "actions">) {
  const p = event.date ? dateParts(event.date) : null;
  const up = (patch: Partial<CelebrationEvent>) => actions.updateEvent(event.id, patch);
  const hours = durationHours(event.startTime, event.endTime);
  const name = eventDisplayName(event, config);
  const meta = [
    formatTimeRange(event.startTime, event.endTime),
    event.venue,
    event.guestCount ? `${groupIndian(event.guestCount)} guests` : "",
  ].filter(Boolean);

  return (
    <li className={`${styles.entry} ${open ? styles.entryOpen : ""}`} id={`event-${event.id}`}>
      <div className={styles.entryDate} aria-hidden="true">
        {p ? (
          <>
            <b>{p.day}</b>
            <span>{p.month}</span>
            <span>{p.year}</span>
          </>
        ) : (
          <span className={styles.entryTbd}>Date<br />TBC</span>
        )}
      </div>
      <div className={styles.entryNode} aria-hidden="true"><i /></div>
      <div className={styles.entryBody}>
        <div className={styles.entryHead}>
          <button className={styles.entryToggle} onClick={onToggle} aria-expanded={open} aria-controls={`edit-${event.id}`}>
            <span className={base.mono}>{String(index + 1).padStart(2, "0")} · {eventTypeLabel(event, config).toUpperCase()}</span>
            <span className={styles.entryName}>{name}</span>
            <span className={styles.entryMeta}>
              {p ? `${weekdayOf(event.date)}, ${formatDateLong(event.date)}` : "Date to be confirmed"}
              {meta.length > 0 && ` · ${meta.join(" · ")}`}
            </span>
            {overlapping && <span className={styles.flag}>Overlaps another event</span>}
          </button>
          <div className={styles.entryActions}>
            <button className={base.iconBtn} onClick={() => actions.moveEvent(event.id, -1)} disabled={index === 0} aria-label={`Move ${name} earlier`}>
              <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 10l4-4 4 4" /></svg>
            </button>
            <button className={base.iconBtn} onClick={() => actions.moveEvent(event.id, 1)} disabled={index === total - 1} aria-label={`Move ${name} later`}>
              <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 6l4 4 4-4" /></svg>
            </button>
            <button className={base.iconBtn} onClick={() => actions.duplicateEvent(event.id)} aria-label={`Duplicate ${name}`} title="Duplicate">
              <svg viewBox="0 0 16 16" aria-hidden="true"><rect x="5" y="5" width="8" height="8" /><path d="M3 11V3h8" /></svg>
            </button>
            <button className={base.iconBtn} onClick={onRemove} aria-label={`Remove ${name}`} title="Remove">
              <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" /></svg>
            </button>
          </div>
        </div>

        {open && (
          <div className={styles.entryEditor} id={`edit-${event.id}`}>
            <label className={base.field}>
              <span className={base.fieldLabel}>Event name</span>
              <input className={base.input} value={event.name} maxLength={80} onChange={(e) => up({ name: e.target.value })} placeholder={eventTypeLabel(event, config)} />
            </label>
            <label className={base.field}>
              <span className={base.fieldLabel}>Event type</span>
              <select className={base.input} value={event.type} onChange={(e) => up({ type: e.target.value })}>
                {config.eventPresets.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
                <option value={CUSTOM_EVENT_TYPE}>Custom…</option>
              </select>
            </label>
            {event.type === CUSTOM_EVENT_TYPE && (
              <label className={base.field}>
                <span className={base.fieldLabel}>Custom type</span>
                <input className={base.input} value={event.customType} maxLength={60} onChange={(e) => up({ customType: e.target.value })} placeholder="e.g. Pellikuthuru" />
              </label>
            )}
            <label className={base.field}>
              <span className={base.fieldLabel}>Date</span>
              <input className={base.input} type="date" value={event.date} onChange={(e) => up({ date: e.target.value })} />
            </label>
            <div className={styles.timePair}>
              <label className={base.field}>
                <span className={base.fieldLabel}>Starts</span>
                <input className={base.input} type="time" value={event.startTime} onChange={(e) => up({ startTime: e.target.value })} />
              </label>
              <label className={base.field}>
                <span className={base.fieldLabel}>Ends</span>
                <input className={base.input} type="time" value={event.endTime} onChange={(e) => up({ endTime: e.target.value })} />
              </label>
              {hours !== null && <span className={styles.duration}>{hours} hrs</span>}
            </div>
            <label className={base.field}>
              <span className={base.fieldLabel}>Venue</span>
              <input className={base.input} value={event.venue} maxLength={120} onChange={(e) => up({ venue: e.target.value })} placeholder="e.g. Taj Falaknuma Palace" />
            </label>
            <label className={base.field}>
              <span className={base.fieldLabel}>Location</span>
              <input className={base.input} value={event.location} maxLength={120} onChange={(e) => up({ location: e.target.value })} placeholder="City / area" />
            </label>
            <label className={base.field}>
              <span className={base.fieldLabel}>Approximate guests</span>
              <input
                className={base.input}
                type="number"
                inputMode="numeric"
                min={0}
                max={100000}
                value={event.guestCount ?? ""}
                onChange={(e) => {
                  const v = e.target.value === "" ? null : Math.max(0, Math.min(100000, Math.floor(Number(e.target.value))));
                  up({ guestCount: Number.isFinite(v as number) || v === null ? v : null });
                }}
                placeholder="e.g. 400"
              />
            </label>
            <label className={base.field}>
              <span className={base.fieldLabel}>Venue setting</span>
              <select className={base.input} value={event.venueSetting} onChange={(e) => up({ venueSetting: e.target.value as CelebrationEvent["venueSetting"] })}>
                <option value="">Not sure yet</option>
                <option value="indoor">Indoor</option>
                <option value="outdoor">Outdoor</option>
                <option value="mixed">Indoor &amp; outdoor</option>
              </select>
            </label>
            <label className={base.field}>
              <span className={base.fieldLabel}>Venue scale</span>
              <select className={base.input} value={event.venueScale} onChange={(e) => up({ venueScale: e.target.value as CelebrationEvent["venueScale"] })}>
                <option value="">Not sure yet</option>
                <option value="intimate">Intimate</option>
                <option value="medium">Medium</option>
                <option value="grand">Grand</option>
              </select>
            </label>
            <label className={`${base.field} ${base.checkField}`}>
              <input type="checkbox" checked={event.parallelActivities} onChange={(e) => up({ parallelActivities: e.target.checked })} />
              <span>Simultaneous activities in different spaces (e.g. parallel rituals for each family)</span>
            </label>
            <label className={`${base.field} ${styles.span2}`}>
              <span className={base.fieldLabel}>Special requirements</span>
              <textarea className={base.textarea} rows={2} maxLength={2000} value={event.specialRequirements} onChange={(e) => up({ specialRequirements: e.target.value })} placeholder="Rituals, entrances, performances, restrictions…" />
            </label>
            <label className={`${base.field} ${styles.span2}`}>
              <span className={base.fieldLabel}>Additional notes</span>
              <textarea className={base.textarea} rows={2} maxLength={2000} value={event.notes} onChange={(e) => up({ notes: e.target.value })} />
            </label>
            <div className={styles.span2}>
              <button className={base.btnSecondary} onClick={onToggle}>Done</button>
            </div>
          </div>
        )}
      </div>
    </li>
  );
}
