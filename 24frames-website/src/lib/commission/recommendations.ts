/* ============================================================
   Creative team recommendations
   ------------------------------------------------------------
   Advisory only. Nothing here ever changes the commission —
   the UI shows these as suggestions the couple may apply with
   an explicit action. Rules are illustrative and transparent.
   ============================================================ */

import { durationHours, groupIndian } from "./format";
import { overlappingEventIds } from "./model";
import type { CelebrationEvent, CommissionDraft, StudioConfig } from "./types";

export interface ServiceSuggestion {
  serviceId: string;
  quantity: number;
  reason: string;
}

export interface EventGuidance {
  eventId: string;
  suggestions: ServiceSuggestion[];
  notes: string[];
}

const BIG_EVENT_TYPES = new Set(["wedding", "reception", "sangeet"]);

function suggestForEvent(
  event: CelebrationEvent,
  config: StudioConfig,
  overlapping: boolean,
): EventGuidance {
  const guests = event.guestCount ?? 0;
  const hasGuests = event.guestCount !== null && event.guestCount > 0;
  const preset = config.eventPresets.find((p) => p.id === event.type);
  const ritual = preset?.ritual ?? false;
  const hours = durationHours(event.startTime, event.endTime) ?? preset?.typicalHours ?? null;
  const grand = event.venueScale === "grand" || guests > 700;
  const outdoor = event.venueSetting === "outdoor" || event.venueSetting === "mixed";
  const suggestions: ServiceSuggestion[] = [];
  const notes: string[] = [];
  const active = new Set(config.services.filter((s) => s.active).map((s) => s.id));
  const push = (serviceId: string, quantity: number, reason: string) => {
    if (active.has(serviceId) && quantity > 0) suggestions.push({ serviceId, quantity, reason });
  };

  // Traditional photography
  if (ritual || hasGuests) {
    let q = 1;
    if (guests > 150) q = 2;
    if (guests > 500) q = 3;
    if (guests > 1000) q = 4;
    if (event.parallelActivities) q += 1;
    push(
      "traditional-photographer",
      q,
      hasGuests
        ? `${groupIndian(guests)} guests${event.parallelActivities ? " with parallel activities" : ""} — ${q} ${q === 1 ? "photographer keeps" : "photographers keep"} every ritual and family group covered.`
        : "Ritual events benefit from a dedicated photographer for formal documentation.",
    );
  }

  // Candid photography
  {
    let q = 1;
    if (guests > 200) q = 2;
    if (guests > 700) q = 3;
    push(
      "candid-photographer",
      q,
      q === 1
        ? "One candid photographer captures the emotion of an intimate gathering."
        : `With ${groupIndian(guests)} guests, ${q} candid photographers can follow different moments at once.`,
    );
  }

  // Traditional video
  if (ritual || guests > 100) {
    const q = guests > 400 || event.parallelActivities ? 2 : 1;
    push(
      "traditional-videographer",
      q,
      q === 2
        ? "A second videographer covers the stage and the guest areas simultaneously."
        : "Full-length coverage of the ceremony for the family archive.",
    );
  }

  // Candid video
  if (hasGuests && guests > 50) {
    const q = guests > 300 ? 2 : 1;
    push(
      "candid-videographer",
      q,
      q === 2
        ? "Larger celebrations unfold in several places at once — two storytellers keep the film complete."
        : "Documentary footage of the unscripted moments.",
    );
  }

  // Cinematography
  if (BIG_EVENT_TYPES.has(event.type) || event.type === "pre-wedding") {
    const q = grand || (hours !== null && hours > 7) ? 2 : 1;
    push(
      "creative-cinematography",
      q,
      q === 2
        ? "A grand, long celebration gives a second cinematographer room to build the film across spaces."
        : "The signature cinematic film is usually built around this event.",
    );
  }

  // Drone
  if (outdoor && (grand || BIG_EVENT_TYPES.has(event.type) || event.type === "pre-wedding")) {
    push("aerial-drone", 1, "An outdoor venue at this scale gains a great deal from aerial perspectives.");
  }

  // Notes (never suggestions)
  if (hours !== null && hours >= 8) {
    notes.push(`At roughly ${hours} hours, crews rotate during the day — larger teams keep coverage continuous.`);
  }
  if (overlapping) {
    notes.push(
      "This event overlaps another on the same day. Professionals cannot be in two places at once — each needs its own crew.",
    );
  }
  if (event.parallelActivities) {
    notes.push("Parallel activities within the event usually need one extra photographer per simultaneous space.");
  }
  if (guests > 1000) {
    notes.push("Above 1,000 guests, parallel crews prevent missed family groups and stage queues.");
  }
  if (hasGuests && guests <= 80) {
    notes.push("An intimate gathering — a compact team keeps the atmosphere personal and unobtrusive.");
  }
  if (event.venueSetting === "indoor") {
    notes.push("Indoor venue — aerial coverage is usually limited to exterior establishing shots.");
  }
  if (!hasGuests) {
    notes.push("Add an approximate guest count for a more precise recommendation.");
  }

  return { eventId: event.id, suggestions, notes };
}

export function guidanceFor(draft: CommissionDraft, config: StudioConfig): Map<string, EventGuidance> {
  const overlaps = overlappingEventIds(draft.events);
  const map = new Map<string, EventGuidance>();
  for (const event of draft.events) {
    map.set(event.id, suggestForEvent(event, config, overlaps.has(event.id)));
  }
  return map;
}

export function commissionNotes(draft: CommissionDraft): string[] {
  const notes: string[] = [];
  if (draft.events.length >= 5) {
    notes.push(
      `${draft.events.length} events — keeping the same core team across them gives your collection a consistent visual voice.`,
    );
  }
  const overlaps = overlappingEventIds(draft.events);
  if (overlaps.size > 0) {
    notes.push("Some events overlap in time. Each needs an independent crew.");
  }
  return notes;
}
