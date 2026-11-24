/* Camera and crew totals for a quotation — how many cameras and how
   many camera operators the studio sends, across all events and on the
   busiest day. Every booked professional runs one camera (a drone pilot
   flies one aerial camera; a live-stream setup is counted as one rig). */

import type { CommissionQuote } from "./types";

export interface CrewTotals {
  /** Camera operators summed over every event. */
  operators: number;
  /** Cameras summed over every event. */
  cameras: number;
  photo: number;
  video: number;
  aerial: number;
  stream: number;
  /** The single event with the largest crew. */
  peak: { eventId: string; operators: number } | null;
  events: number;
}

function kind(unitNoun: string, serviceId: string): "photo" | "video" | "aerial" | "stream" {
  const n = `${unitNoun} ${serviceId}`.toLowerCase();
  if (n.includes("stream")) return "stream";
  if (n.includes("drone") || n.includes("aerial") || unitNoun.toLowerCase() === "operator") return "aerial";
  if (n.includes("photo")) return "photo";
  return "video";
}

export function crewTotals(quote: CommissionQuote): CrewTotals {
  const t: CrewTotals = { operators: 0, cameras: 0, photo: 0, video: 0, aerial: 0, stream: 0, peak: null, events: 0 };
  for (const ev of quote.events) {
    let onDay = 0;
    for (const l of ev.lines) {
      if (l.quantity <= 0) continue;
      t[kind(l.unitNoun, l.serviceId)] += l.quantity;
      onDay += l.quantity;
    }
    if (onDay > 0) t.events += 1;
    if (onDay > 0 && (!t.peak || onDay > t.peak.operators)) t.peak = { eventId: ev.eventId, operators: onDay };
    t.operators += onDay;
  }
  t.cameras = t.photo + t.video + t.aerial + t.stream;
  return t;
}

/** "6 photo · 8 video · 1 drone" */
export function cameraBreakdown(t: CrewTotals): string {
  return [
    t.photo ? `${t.photo} photo` : "",
    t.video ? `${t.video} video` : "",
    t.aerial ? `${t.aerial} drone` : "",
    t.stream ? `${t.stream} live-stream` : "",
  ].filter(Boolean).join(" · ");
}
