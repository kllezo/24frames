/* Draft factories and pure helpers for working with a commission. */

import { CUSTOM_EVENT_TYPE } from "./defaults";
import type {
  CelebrationEvent,
  CommissionDraft,
  CoupleDetails,
  ServiceAssignment,
  StudioConfig,
} from "./types";

export function uid(prefix = "id"): string {
  const rand =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().replace(/-/g, "").slice(0, 12)
      : Math.random().toString(36).slice(2, 14);
  return `${prefix}_${rand}`;
}

export const emptyCouple = (): CoupleDetails => ({
  brideName: "",
  groomName: "",
  phone: "",
  email: "",
  weddingDate: "",
  approximateDate: "",
  city: "",
  preferredContact: "whatsapp",
  notes: "",
});

export function createDraft(config: StudioConfig): CommissionDraft {
  const now = new Date().toISOString();
  const defaultTier = config.deliveryTiers.find(
    (t) => t.id === config.defaultDeliveryTierId && t.available,
  );
  return {
    id: uid("draft"),
    schemaVersion: 1,
    couple: emptyCouple(),
    events: [],
    assignments: [],
    deliveryTierId: defaultTier?.id ?? null,
    appliedChargeIds: [],
    postProductionOverride: null,
    createdAt: now,
    updatedAt: now,
    duplicatedFrom: null,
  };
}

export function createEvent(type: string, config: StudioConfig, overrides: Partial<CelebrationEvent> = {}): CelebrationEvent {
  const preset = config.eventPresets.find((p) => p.id === type);
  return {
    id: uid("evt"),
    name: preset?.label ?? "",
    type: preset ? preset.id : CUSTOM_EVENT_TYPE,
    customType: "",
    date: "",
    startTime: "",
    endTime: "",
    venue: "",
    location: "",
    guestCount: null,
    venueSetting: "",
    venueScale: "",
    parallelActivities: false,
    specialRequirements: "",
    notes: "",
    ...overrides,
  };
}

export function eventTypeLabel(event: CelebrationEvent, config: StudioConfig): string {
  if (event.type === CUSTOM_EVENT_TYPE) return event.customType || "Custom event";
  return config.eventPresets.find((p) => p.id === event.type)?.label ?? "Event";
}

export function eventDisplayName(event: CelebrationEvent, config: StudioConfig): string {
  return event.name.trim() || eventTypeLabel(event, config);
}

export function coupleNames(couple: CoupleDetails, fallback = "The Couple"): string {
  const a = couple.brideName.trim();
  const b = couple.groomName.trim();
  if (a && b) return `${a} & ${b}`;
  return a || b || fallback;
}

export function weddingDateLabel(couple: CoupleDetails, formatter: (iso: string) => string): string {
  if (couple.weddingDate) return formatter(couple.weddingDate);
  return couple.approximateDate.trim();
}

export function getAssignment(
  draft: CommissionDraft,
  eventId: string,
  serviceId: string,
): ServiceAssignment | undefined {
  return draft.assignments.find((a) => a.eventId === eventId && a.serviceId === serviceId);
}

/** Events sorted chronologically for display when dates exist, else by
 *  the couple's own ordering. The stored order is never mutated here. */
export function eventsInOrder(draft: CommissionDraft): CelebrationEvent[] {
  return draft.events;
}

/** Identify pairs of events on the same date whose times overlap. */
export function overlappingEventIds(events: CelebrationEvent[]): Set<string> {
  const toMin = (t: string) => {
    const m = /^(\d{1,2}):(\d{2})$/.exec(t);
    return m ? +m[1] * 60 + +m[2] : null;
  };
  const ids = new Set<string>();
  for (let i = 0; i < events.length; i++) {
    for (let j = i + 1; j < events.length; j++) {
      const a = events[i];
      const b = events[j];
      if (!a.date || a.date !== b.date) continue;
      const as = toMin(a.startTime), ae = toMin(a.endTime), bs = toMin(b.startTime), be = toMin(b.endTime);
      if (as === null || ae === null || bs === null || be === null) continue;
      const aEnd = ae <= as ? ae + 1440 : ae;
      const bEnd = be <= bs ? be + 1440 : be;
      if (as < bEnd && bs < aEnd) {
        ids.add(a.id);
        ids.add(b.id);
      }
    }
  }
  return ids;
}

/** Normalise a draft coming from storage / the network so later code can
 *  trust its shape (missing fields filled, orphans removed). */
export function normaliseDraft(input: CommissionDraft, config: StudioConfig): CommissionDraft {
  const base = createDraft(config);
  const couple = { ...emptyCouple(), ...(input.couple ?? {}) };
  const events = (input.events ?? []).map((e) => ({ ...createEvent(e.type, config), ...e }));
  const eventIds = new Set(events.map((e) => e.id));
  const serviceIds = new Set(config.services.map((s) => s.id));
  const assignments = (input.assignments ?? []).filter(
    (a) => eventIds.has(a.eventId) && serviceIds.has(a.serviceId) && a.quantity > 0,
  );
  return {
    ...base,
    ...input,
    couple,
    events,
    assignments,
    appliedChargeIds: Array.isArray(input.appliedChargeIds) ? input.appliedChargeIds : [],
    postProductionOverride: input.postProductionOverride ?? null,
    schemaVersion: 1,
  };
}
