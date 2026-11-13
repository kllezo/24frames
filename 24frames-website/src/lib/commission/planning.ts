/* Beyond photography — the event-planning services 24 Frames can arrange.
   Shown to couples in the quotebuilder (Frame 02); what they tick reaches
   their relationship manager as a lead, separate from the photography price. */

import type { PlanningRequest } from "./types";

export interface PlanningService {
  id: string;
  title: string;
  /** Short line under the title. */
  line: string;
  /** What we actually help with. */
  detail: string;
  tags: string[];
  image: string;
}

export const PLANNING_SERVICES: PlanningService[] = [
  {
    id: "venues",
    title: "Venues",
    line: "Farmhouses, resorts & open-air estates",
    detail: "A shortlist matched to your guest count, season and ceremony — from a farmhouse for the Haldi to the wedding venue itself.",
    tags: ["Farmhouses", "Resorts", "Palaces", "Outdoor lawns"],
    image: "/images/disciplines/weddings/IMG_6320-mobile.webp",
  },
  {
    id: "planning",
    title: "Planning & management",
    line: "One team for the whole celebration",
    detail: "Timelines, vendors, hospitality and the flow of each day — run by one team so your family can simply be present.",
    tags: ["Timelines", "Vendors", "Guest hospitality", "On-the-day crew"],
    image: "/images/disciplines/weddings/IMG_6275-mobile.webp",
  },
  {
    id: "decor",
    title: "Décor & theming",
    line: "Mandaps, florals, lighting & stages",
    detail: "Every space designed around one idea — and designed to photograph beautifully, because we know how it will be filmed.",
    tags: ["Mandap", "Florals", "Lighting", "Stage design"],
    image: "/images/stories/karthik-and-gayathri/IMG_6329-mobile.webp",
  },
  {
    id: "jewellery",
    title: "Jewellery",
    line: "Bridal sets, heirlooms & rentals",
    detail: "Introductions to jewellers we trust for bridal sets, statement pieces and rentals for each occasion.",
    tags: ["Bridal sets", "Heirloom pieces", "Rentals"],
    image: "/images/disciplines/fashion/IMG_6279-mobile.webp",
  },
  {
    id: "makeup",
    title: "Makeup & styling",
    line: "Artists, hair & draping",
    detail: "Bridal makeup artists, hair and saree draping — trialled in advance and timed to your shoot schedule.",
    tags: ["Bridal makeup", "Hair", "Draping", "Family styling"],
    image: "/images/disciplines/fashion/IMG_6285-mobile.webp",
  },
];

const KNOWN = new Set(PLANNING_SERVICES.map((s) => s.id));

/** Keep only known services and a bounded note (server and client). */
export function cleanPlanning(input: unknown): PlanningRequest | undefined {
  if (!input || typeof input !== "object") return undefined;
  const p = input as Partial<PlanningRequest>;
  const services = Array.isArray(p.services) ? Array.from(new Set(p.services.filter((s) => typeof s === "string" && KNOWN.has(s)))) : [];
  const note = typeof p.note === "string" ? p.note.slice(0, 1500) : "";
  if (!services.length && !note.trim()) return undefined;
  return { services, note };
}

export const planningTitles = (p: PlanningRequest | undefined) =>
  (p?.services ?? []).map((id) => PLANNING_SERVICES.find((s) => s.id === id)?.title ?? id);
