/* Beyond photography — the event-planning services 24 Frames can arrange.
   Shown to couples in the quotebuilder (Frame 02); what they tick reaches
   their relationship manager as a lead, separate from the photography price. */

import type { PlanningRequest } from "./types";

export interface PlanningPartner {
  name: string;
  /** What a 24 Frames couple gets there, e.g. "3–4% off". */
  perk?: string;
  /** Round logo or photo; leave empty until the brand sends one. */
  image?: string;
  /** "contain" sits a wordmark logo inside the pearl disc instead of filling the circle. */
  fit?: "contain";
  /** Not confirmed yet — shown as an empty logo circle with no name. */
  placeholder?: boolean;
}

export interface PlanningService {
  id: string;
  title: string;
  /** One line under the title. */
  line: string;
  image: string;
  /** Five partner brands; couples mention 24 Frames there to redeem the privilege. */
  partners: PlanningPartner[];
}

/* Partner brands: replace each placeholder with the brand's name, its
   privilege and a square logo in /public/images/partners/ as the studio
   confirms them. */
const soon = (n: number): PlanningPartner => ({ name: `Partner ${n}`, placeholder: true });
const fill = (known: PlanningPartner[]): PlanningPartner[] => [...known, ...Array.from({ length: 5 - known.length }, (_, i) => soon(known.length + i + 1))];

export const PLANNING_SERVICES: PlanningService[] = [
  {
    id: "venues",
    title: "Venue selection",
    line: "Glass houses, farmhouses, lakefronts and resorts that welcome our couples",
    image: "/images/disciplines/weddings/IMG_6320-mobile.webp",
    partners: [
      { name: "Glass houses", perk: "Engagements" },
      { name: "Farmhouses" },
      { name: "Lakefront venues", perk: "Gandipet" },
      { name: "Luxury resorts" },
      { name: "Convention centres" },
      { name: "Hotels & banquets", perk: "Luxury hotels" },
    ],
  },
  {
    id: "decor",
    title: "Event décor",
    line: "Mandaps, florals and lighting from designers we trust",
    image: "/images/stories/karthik-and-gayathri/IMG_6329-mobile.webp",
    partners: fill([
      { name: "Design by Raja", perk: "Wedding décor studio", image: "/images/partners/design-by-raja.png", fit: "contain" },
      { name: "Alankara" },
      { name: "Marvam" },
    ]),
  },
  {
    id: "costumes",
    title: "Costumes & bridal designers",
    line: "Bridal couture, sarees and family outfits from labels we work with",
    image: "/images/disciplines/fashion/IMG_6280-mobile.webp",
    partners: fill([
      { name: "Sowmya Reddy", image: "/images/partners/sowmya-reddy-symbol.svg", fit: "contain" },
      { name: "Suvarna Mandir" },
      { name: "Reshu Varma", image: "/images/partners/reshu-varma.jpg" },
    ]),
  },
  {
    id: "jewellery",
    title: "Jewellery curation",
    line: "Bridal sets and heirlooms from houses we work with",
    image: "/images/disciplines/fashion/IMG_6279-mobile.webp",
    // Petals fan lower-left → top → lower-right; index 2 is the top centre.
    partners: [
      { name: "Emmadi Silver", perk: "Silver jewellery", image: "/images/partners/emmadi-silver.png", fit: "contain" },
      { name: "SKT", perk: "Gold & Diamonds", image: "/images/partners/skt.png", fit: "contain" },
      { name: "PMJ Jewels", perk: "3–4% off", image: "/images/partners/pmj.webp", fit: "contain" },
      { name: "Devi Pavitra", perk: "Gold & Diamonds", image: "/images/partners/devi-pavitra.png", fit: "contain" },
      { name: "Malabar Gold & Diamonds", perk: "Gold & Diamonds" },
    ],
  },
  {
    id: "makeup",
    title: "Professional makeup artistry",
    line: "Bridal artists, hair and draping, trialled in advance",
    image: "/images/disciplines/fashion/IMG_6285-mobile.webp",
    partners: fill([]),
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

/* Titles for services retired from the list, so older quotations still read well. */
const LEGACY_TITLES: Record<string, string> = { planning: "Planning & management" };

export const planningTitles = (p: PlanningRequest | undefined) =>
  (p?.services ?? []).map((id) => PLANNING_SERVICES.find((s) => s.id === id)?.title ?? LEGACY_TITLES[id] ?? id);
