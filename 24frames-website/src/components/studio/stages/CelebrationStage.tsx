"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { scrollToElement } from "../ui/scroll";
import styles from "../stages.module.css";
import cx from "../cinema.module.css";
import base from "../studio.module.css";
import { StageFooter, StageHeader } from "./StageChrome";
import DatePicker from "../ui/DatePicker";
import TimePicker from "../ui/TimePicker";
import { CUSTOM_EVENT_TYPE } from "@/lib/commission/defaults";
import { isPastDate, roman, todayISO } from "@/lib/commission/format";
import { occasionImage, occasionLine } from "@/lib/commission/stories";
import { eventDisplayName, eventTypeLabel, overlappingEventIds } from "@/lib/commission/model";
import type { CelebrationEvent, CommissionDraft } from "@/lib/commission/types";
import type { StageProps } from "./types";

interface Removed {
  event: CelebrationEvent;
  index: number;
  assignments: CommissionDraft["assignments"];
}

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const SWEEP = "cubic-bezier(0.65, 0, 0.35, 1)";
const DUR = 720;
const SWEEP_DUR = 900;

/** A soft band of light that crosses an element, left to right (or back). */
function lightBand(host: HTMLElement, reverse = false) {
  const band = document.createElement("span");
  band.className = cx.lightBand;
  host.appendChild(band);
  const w = host.getBoundingClientRect().width;
  const from = reverse ? w : -140;
  const to = reverse ? -140 : w;
  band
    .animate([{ transform: `translateX(${from}px) skewX(-16deg)` }, { transform: `translateX(${to}px) skewX(-16deg)` }], {
      duration: SWEEP_DUR,
      easing: SWEEP,
      fill: "forwards",
    })
    .finished.finally(() => band.remove());
}

/** Place a still copy of a tile over the grid at a given rect. */
function ghostAt(grid: HTMLElement, node: HTMLElement, rect: DOMRect) {
  const g = grid.getBoundingClientRect();
  const ghost = node.cloneNode(true) as HTMLElement;
  ghost.removeAttribute("data-occ");
  ghost.removeAttribute("data-occ-open");
  Object.assign(ghost.style, {
    position: "absolute",
    left: `${rect.left - g.left}px`,
    top: `${rect.top - g.top}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    margin: "0",
    zIndex: "9",
    pointerEvents: "none",
    animation: "none",
    gridRow: "auto",
  });
  grid.appendChild(ghost);
  return ghost;
}

/** Open or close an occasion with a light sweep: a band of light crosses
    the card and the details appear in its wake; neighbouring cards glide
    to their new places. Closing sweeps back the other way. */
function morph(update: () => void, after?: () => void) {
  const grid = document.querySelector<HTMLElement>("[data-occ-grid]");
  if (!grid || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    update();
    after?.();
    return;
  }
  const tiles = () => [...grid.querySelectorAll<HTMLElement>("[data-occ]")];
  const before = new Map(tiles().map((el) => [el.dataset.occ!, el.getBoundingClientRect()]));
  const copies = new Map(tiles().filter((el) => !el.hasAttribute("data-occ-open")).map((el) => [el.dataset.occ!, el.cloneNode(true) as HTMLElement]));
  const closing = grid.querySelector<HTMLElement>("[data-occ-open]");
  const closingKey = closing?.dataset.occ;
  const closingRect = closing?.getBoundingClientRect();
  const closingCopy = closing ? (closing.cloneNode(true) as HTMLElement) : null;

  flushSync(update);

  const opened = grid.querySelector<HTMLElement>("[data-occ-open]");
  const openedKey = opened && opened.dataset.occ !== closingKey ? opened.dataset.occ : undefined;

  for (const el of tiles()) {
    const key = el.dataset.occ!;
    const a = before.get(key);
    const b = el.getBoundingClientRect();
    if (!a) {
      el.animate([{ opacity: 0, transform: "scale(0.96)" }, { opacity: 1, transform: "none" }], { duration: DUR, easing: EASE });
      continue;
    }
    if (key === openedKey) {
      // The details are revealed in the wake of the light.
      el.animate([{ clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)" }], { duration: SWEEP_DUR, easing: SWEEP });
      lightBand(el);
      const copy = copies.get(key);
      if (copy) {
        const ghost = ghostAt(grid, copy, a);
        ghost
          .animate([{ opacity: 1 }, { opacity: 0 }], { duration: 380, delay: 120, easing: EASE, fill: "forwards" })
          .finished.finally(() => ghost.remove());
      }
      continue;
    }
    if (key === closingKey) {
      // The small card returns once the light has passed back over it.
      el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 420, delay: SWEEP_DUR * 0.55, easing: EASE, fill: "backwards" });
      continue;
    }
    const dx = a.left - b.left;
    const dy = a.top - b.top;
    if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
      el.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: "none" }], { duration: DUR, easing: EASE });
    }
  }

  // Closing: the open card is swept away, right to left.
  if (closingCopy && closingRect) {
    const ghost = ghostAt(grid, closingCopy, closingRect);
    ghost.style.zIndex = "8";
    lightBand(ghost, true);
    ghost
      .animate([{ clipPath: "inset(0 0% 0 0)" }, { clipPath: "inset(0 100% 0 0)" }], {
        duration: SWEEP_DUR,
        easing: SWEEP,
        fill: "forwards",
      })
      .finished.finally(() => ghost.remove());
  }

  if (after) window.setTimeout(after, SWEEP_DUR + 80);
}

export default function CelebrationStage({ config, draft, actions, go }: StageProps) {
  const [removed, setRemoved] = useState<Removed | null>(null);
  const undoTimer = useRef<number | null>(null);
  const overlaps = overlappingEventIds(draft.events);

  useEffect(() => () => { if (undoTimer.current) window.clearTimeout(undoTimer.current); }, []);

  const [pop, setPop] = useState<{ id: string; row: number } | null>(null);
  const [customOpen, setCustomOpen] = useState(false);
  const [customName, setCustomName] = useState("");

  function add(type: string, name?: string) {
    const lastDated = [...draft.events].reverse().find((e) => e.date && !isPastDate(e.date));
    const wedding = isPastDate(draft.couple.weddingDate) ? "" : draft.couple.weddingDate;
    return actions.addEvent(type, {
      date: lastDated?.date ?? wedding ?? "",
      location: draft.couple.city,
      ...(name ? { name, customType: name } : {}),
    });
  }

  /** Select (if needed) and grow that card into its details. */
  /** The grid row a tile sits on when nothing is open — the card opens on
      exactly that row, so it grows where it is instead of jumping. */
  function rowOf(key: string) {
    const grid = document.querySelector<HTMLElement>("[data-occ-grid]");
    if (!grid) return 1;
    const tiles = [...grid.querySelectorAll<HTMLElement>("[data-occ]")];
    const idx = tiles.findIndex((t) => t.dataset.occ === key);
    const cols = getComputedStyle(grid).gridTemplateColumns.split(" ").filter(Boolean).length || 1;
    return Math.floor(Math.max(0, idx) / cols) + 1;
  }

  function toggle(key: string, select: () => string) {
    let opened = "";
    const row = rowOf(key);
    morph(
      () => {
        const id = select();
        setPop((cur) => {
          if (cur?.id === id) return null;
          opened = id;
          return { id, row };
        });
      },
      () => {
        if (!opened) return;
        const el = document.querySelector<HTMLElement>(`[data-occ="${key}"]`);
        if (!el) return;
        const r = el.getBoundingClientRect();
        if (r.top < 120 || r.bottom > window.innerHeight - 40) scrollToElement(el, -150);
      },
    );
  }
  const close = () => morph(() => setPop(null));

  function addCustom(e: React.FormEvent) {
    e.preventDefault();
    const name = customName.trim();
    if (!name) return;
    const id = add(CUSTOM_EVENT_TYPE, name);
    setCustomName("");
    setCustomOpen(false);
    setPop({ id, row: rowOf(`e-${id}`) });
  }

  function remove(event: CelebrationEvent) {
    const index = draft.events.findIndex((e) => e.id === event.id);
    setRemoved({ event, index, assignments: draft.assignments.filter((a) => a.eventId === event.id) });
    actions.removeEvent(event.id);
    if (undoTimer.current) window.clearTimeout(undoTimer.current);
    undoTimer.current = window.setTimeout(() => setRemoved(null), 8000);
  }

  const pastEvents = draft.events.filter((e) => isPastDate(e.date));

  /** The tapped card itself, grown into the occasion's details. */
  /** Save this occasion, fold it away, then open the next one. */
  function saveNext(event: CelebrationEvent) {
    const idx = draft.events.findIndex((e) => e.id === event.id);
    const next = draft.events[idx + 1];
    close();
    if (!next) return;
    const key = next.type === CUSTOM_EVENT_TYPE ? `e-${next.id}` : `p-${next.type}`;
    window.setTimeout(() => toggle(key, () => next.id), SWEEP_DUR + 140);
  }

  function details(event: CelebrationEvent) {
    const idx = draft.events.findIndex((e) => e.id === event.id);
    const next = draft.events[idx + 1];
    return (
      <SceneCard
        event={event}
        nextName={next ? eventDisplayName(next, config) : ""}
        onSaveNext={() => saveNext(event)}
        index={draft.events.findIndex((e) => e.id === event.id)}
        overlapping={overlaps.has(event.id)}
        onRemove={() => morph(() => { remove(event); setPop(null); })}
        onDone={close}
        {...{ config, actions }}
      />
    );
  }
  const complete = draft.events.filter((e) => e.date && e.venue.trim()).length;

  return (
    <div className={styles.stageInner}>
      <StageHeader
        frame="02"
        kicker="Frame 02 · The Celebration"
        title={<>Every wedding has its own <em>shape.</em></>}
        lead="First, choose every occasion you are celebrating. Once the list is complete, we will introduce the crew — and only then decide who joins each one."
      />

      <section className={cx.picker} aria-label="Choose your occasions">
        <div className={cx.pickerHead}>
          <span className={cx.step}>I</span>
          <div>
            <p className={base.kicker}>Choose your occasions</p>
            <p className={styles.muted}>Tap an occasion to add it — its details open right there.</p>
          </div>
          <span className={base.mono}>
            {draft.events.length} SELECTED{draft.events.length > 0 ? ` · ${complete} WITH DETAILS` : ""}
          </span>
        </div>
        <div className={cx.occasionGrid} data-occ-grid>
          {config.eventPresets.map((p, i) => {
            const count = draft.events.filter((e) => e.type === p.id).length;
            const latest = [...draft.events].reverse().find((e) => e.type === p.id);
            const key = `p-${p.id}`;
            const open = !!latest && pop?.id === latest.id;
            return (
              <div
                key={p.id}
                data-occ={key}
                data-tilt={open ? undefined : "6"}
                className={`${cx.occasion} ${count ? cx.occasionOn : ""} ${open ? cx.occasionExpanded : ""}`}
                data-occ-open={open || undefined}
                style={{ "--i": i, gridRow: open && pop ? String(pop.row) : undefined } as React.CSSProperties}
              >
                {open && latest ? details(latest) : (
                  <>
                    <button
                      className={cx.occasionMain}
                      aria-pressed={count > 0}
                      aria-expanded={false}
                      onClick={() => toggle(key, () => (latest ? latest.id : add(p.id)))}
                    >
                      <span className={cx.occasionPhoto}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={occasionImage(p.id)} alt="" loading="lazy" />
                      </span>
                      <span className={cx.occasionNo}>{roman(i)}</span>
                      <span className={cx.occasionName}>{p.label}</span>
                      <span className={cx.occasionLine}>{occasionLine(p.id)}</span>
                      {latest && <TileStatus event={latest} />}
                      <span className={cx.occasionTick} aria-hidden="true">
                        <svg viewBox="0 0 16 16"><path d="M3.5 8.5l3 3 6-7" /></svg>
                      </span>
                    </button>
                    {latest && (
                      <button className={cx.tileRemove} onClick={() => remove(latest)} aria-label={`Remove ${p.label}`} title="Remove">
                        <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" /></svg>
                      </button>
                    )}
                  </>
                )}
              </div>
            );
          })}
          {draft.events
            .filter((e) => e.type === CUSTOM_EVENT_TYPE)
            .map((e, j) => {
              const key = `e-${e.id}`;
              const open = pop?.id === e.id;
              return (
                <div
                  key={e.id}
                  data-occ={key}
                  data-tilt={open ? undefined : "6"}
                  className={`${cx.occasion} ${cx.occasionOn} ${open ? cx.occasionExpanded : ""}`}
                  data-occ-open={open || undefined}
                  style={{ "--i": config.eventPresets.length + j, gridRow: open && pop ? String(pop.row) : undefined } as React.CSSProperties}
                >
                  {open ? details(e) : (
                    <>
                      <button className={cx.occasionMain} aria-pressed aria-expanded={false} onClick={() => toggle(key, () => e.id)}>
                        <span className={cx.occasionPhoto}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={occasionImage(e.type)} alt="" loading="lazy" />
                        </span>
                        <span className={cx.occasionNo}>{roman(config.eventPresets.length + j)}</span>
                        <span className={cx.occasionName}>{eventDisplayName(e, config)}</span>
                        <span className={cx.occasionLine}>Your own occasion.</span>
                        <TileStatus event={e} />
                        <span className={cx.occasionTick} aria-hidden="true">
                          <svg viewBox="0 0 16 16"><path d="M3.5 8.5l3 3 6-7" /></svg>
                        </span>
                      </button>
                      <button className={cx.tileRemove} onClick={() => remove(e)} aria-label={`Remove ${eventDisplayName(e, config)}`} title="Remove">
                        <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" /></svg>
                      </button>
                    </>
                  )}
                </div>
              );
            })}
          <div className={`${cx.occasion} ${cx.occasionCustom}`}>
            {customOpen ? (
              <form className={cx.customForm} onSubmit={addCustom}>
                <span className={cx.occasionNo}>+</span>
                <label className={cx.customLabel} htmlFor="custom-occasion">Name your occasion</label>
                <input
                  id="custom-occasion"
                  className={cx.customInput}
                  value={customName}
                  maxLength={60}
                  autoFocus
                  placeholder="e.g. Pellikuthuru"
                  onChange={(e) => setCustomName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Escape") setCustomOpen(false); }}
                />
                <div className={cx.customActions}>
                  <button className={base.btnPrimary} disabled={!customName.trim()}>Add occasion</button>
                  <button type="button" className={base.btnText} onClick={() => setCustomOpen(false)}>Cancel</button>
                </div>
              </form>
            ) : (
              <button className={cx.occasionMain} onClick={() => setCustomOpen(true)}>
                <span className={cx.occasionNo}>+</span>
                <span className={cx.occasionName}>Your own occasion</span>
                <span className={cx.occasionLine}>A ritual, a gathering, anything that is yours alone.</span>
              </button>
            )}
          </div>
        </div>
      </section>


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
        onNext={() => go("crew")}
        nextLabel="Meet your crew"
        nextDisabled={draft.events.length === 0 || pastEvents.length > 0}
        hint={
          draft.events.length === 0
            ? "Add at least one occasion to continue."
            : pastEvents.length > 0
              ? `${eventDisplayName(pastEvents[0], config)} is dated in the past — choose today or a later date.`
              : undefined
        }
      />
    </div>
  );
}

function SceneCard({
  event,
  index,
  overlapping,
  onRemove,
  onDone,
  nextName,
  onSaveNext,
  config,
  actions,
}: {
  event: CelebrationEvent;
  index: number;
  overlapping: boolean;
  onRemove: () => void;
  onDone: () => void;
  nextName: string;
  onSaveNext: () => void;
} & Pick<StageProps, "config" | "actions">) {
  const [more, setMore] = useState(false);
  const up = (patch: Partial<CelebrationEvent>) => actions.updateEvent(event.id, patch);
  const name = eventDisplayName(event, config);
  const steps = [!!event.date, !!event.venue.trim(), event.guestCount !== null];
  const past = isPastDate(event.date);

  return (
    <div className={`${cx.sceneCard} ${cx.scenePop} ${steps.every(Boolean) ? cx.sceneDone : ""}`}>
      <div className={cx.scenePhoto}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={occasionImage(event.type)} alt="" loading="lazy" />
        <span className={cx.sceneIdx}>{roman(index)}</span>
        <span className={cx.sceneSteps} aria-label={`${steps.filter(Boolean).length} of 3 details added`}>
          {steps.map((on, k) => <i key={k} className={on ? cx.stepOn : ""} />)}
        </span>
      </div>
      <div className={cx.sceneBody}>
        <div className={cx.sceneHead}>
          <div>
            <p className={cx.sceneType}>{eventTypeLabel(event, config)}</p>
            <input
              className={cx.sceneName}
              value={event.name}
              maxLength={80}
              onChange={(e) => up({ name: e.target.value })}
              placeholder={eventTypeLabel(event, config)}
              aria-label="Occasion name"
            />
          </div>
          <div className={cx.sceneActions}>
            <button className={base.iconBtn} onClick={() => actions.duplicateEvent(event.id)} aria-label={`Duplicate ${name}`} title="Duplicate">
              <svg viewBox="0 0 16 16" aria-hidden="true"><rect x="5" y="5" width="8" height="8" /><path d="M3 11V3h8" /></svg>
            </button>
            <button className={base.iconBtn} onClick={onRemove} aria-label={`Remove ${name}`} title="Remove">
              <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" /></svg>
            </button>
          </div>
        </div>

        <div className={cx.sceneFields}>
          <DatePicker
            label="Date"
            value={event.date}
            min={todayISO()}
            invalid={past}
            onChange={(v) => up({ date: v && isPastDate(v) ? "" : v })}
          />
          <div className={cx.timePair}>
            <TimePicker label="From" value={event.startTime} suggest={TIMES[event.type]?.[0] ?? "18:00"} onChange={(v) => up({ startTime: v })} />
            <TimePicker label="Until" value={event.endTime} suggest={TIMES[event.type]?.[1] ?? "23:00"} onChange={(v) => up({ endTime: v })} />
          </div>
          <label className={cx.lux}>
            <input value={event.venue} maxLength={120} onChange={(e) => up({ venue: e.target.value })} placeholder=" " />
            <span>Venue</span>
          </label>
          <label className={cx.lux}>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              max={100000}
              value={event.guestCount ?? ""}
              placeholder=" "
              onChange={(e) => {
                const v = e.target.value === "" ? null : Math.max(0, Math.min(100000, Math.floor(Number(e.target.value))));
                up({ guestCount: v === null || Number.isFinite(v) ? v : null });
              }}
            />
            <span>Guests</span>
          </label>
        </div>

        {(past || overlapping) && (
          <p className={cx.sceneFlag} role={past ? "alert" : undefined}>
            {past ? "This date has passed — choose today or later." : "Overlaps another occasion."}
          </p>
        )}

        <button type="button" className={cx.sceneMore} onClick={() => setMore((m) => !m)} aria-expanded={more}>
          {more ? "Fewer details" : "More details"} <span aria-hidden="true">{more ? "−" : "+"}</span>
        </button>

        {more && (
          <div className={`${cx.sceneExtra} ${cx.sceneExtraGrid}`}>
            <div className={cx.sceneExtraCol}>
              {event.type === CUSTOM_EVENT_TYPE && (
                <label className={cx.lux}>
                  <input value={event.customType} maxLength={60} onChange={(e) => up({ customType: e.target.value })} placeholder=" " />
                  <span>Kind of occasion</span>
                </label>
              )}
              <label className={cx.lux}>
                <input value={event.location} maxLength={120} onChange={(e) => up({ location: e.target.value })} placeholder=" " />
                <span>Area or city</span>
              </label>
              <label className={`${base.checkField} ${cx.sceneCheck}`}>
                <input type="checkbox" checked={event.parallelActivities} onChange={(e) => up({ parallelActivities: e.target.checked })} />
                <span>Things happen in different spaces at once</span>
              </label>
            </div>
            <div className={cx.sceneExtraCol}>
              <ChipChoice
                label="Setting"
                value={event.venueSetting}
                options={[["indoor", "Indoor"], ["outdoor", "Outdoor"], ["mixed", "Both"]]}
                onChange={(v) => up({ venueSetting: v as CelebrationEvent["venueSetting"] })}
              />
              <ChipChoice
                label="Scale"
                value={event.venueScale}
                options={[["intimate", "Intimate"], ["medium", "Medium"], ["grand", "Grand"]]}
                onChange={(v) => up({ venueScale: v as CelebrationEvent["venueScale"] })}
              />
            </div>
            <label className={`${cx.lux} ${cx.luxArea} ${cx.sceneExtraWide}`}>
              <textarea rows={2} maxLength={2000} value={event.specialRequirements} onChange={(e) => up({ specialRequirements: e.target.value })} placeholder=" " />
              <span>Rituals, entrances, performances…</span>
            </label>
          </div>
        )}

        <div className={cx.sceneDoneRow}>
          <button type="button" className={cx.sceneRemoveLink} onClick={onRemove}>Remove occasion</button>
          <button type="button" className={base.btnPrimary} onClick={nextName ? onSaveNext : onDone}>
            {nextName ? <>Save · next: {nextName}</> : "Save"}
          </button>
        </div>
        <button type="button" className={cx.sceneMin} onClick={onDone} aria-label="Minimise">
          <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 10l4-4 4 4" /></svg>
          Minimise
        </button>
      </div>
    </div>
  );
}

/** Suggested hours per occasion, shown in the time fields until chosen. */
const TIMES: Record<string, [string, string]> = {
  haldi: ["09:00", "13:00"],
  mehendi: ["15:00", "21:00"],
  sangeet: ["19:00", "23:30"],
  cocktail: ["20:00", "23:59"],
  wedding: ["07:00", "14:00"],
  reception: ["19:00", "23:00"],
  engagement: ["11:00", "15:00"],
  "pre-wedding": ["06:00", "10:00"],
  "post-wedding": ["16:00", "19:00"],
};

function TileStatus({ event }: { event: CelebrationEvent }) {
  const ready = !!event.date && !!event.venue.trim();
  return (
    <span className={`${cx.tileStatus} ${ready ? cx.tileReady : ""}`}>
      {ready ? `${event.venue.trim()} · ${event.date.split("-").reverse().slice(0, 2).join("/")}` : "Add date & venue →"}
    </span>
  );
}

function ChipChoice({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: [string, string][];
  onChange: (v: string) => void;
}) {
  return (
    <fieldset className={cx.chips}>
      <legend>{label}</legend>
      <div>
        {options.map(([v, l]) => (
          <button key={v} type="button" aria-pressed={value === v} className={value === v ? cx.chipOn : ""} onClick={() => onChange(value === v ? "" : v)}>
            {l}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
