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
  /** A photograph shown beside the flower when the partner is opened. */
  photo?: string;
  /** Two or three lines about the place or the brand, shown with the photo. */
  about?: string;
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
      { name: "Glass houses", perk: "Engagements", photo: "/images/stories/karthik-and-gayathri/IMG_6328.jpg", about: "Glass-walled venues filled with daylight and greenery on the edges of Hyderabad — our favourite setting for engagements and intimate ceremonies, beautiful by day and lit up after dark." },
      { name: "Farmhouses", photo: "/images/stories/karthik-and-gayathri/IMG_6332.jpg", about: "Private farmhouses just outside the city, with open lawns for haldi, mehendi and sangeet — and room for the whole family to stay over the weekend." },
      { name: "Lakefront venues", perk: "Gandipet", photo: "/images/stories/sirish-and-harshitha/IMG_6347.jpg", about: "Venues along Gandipet (Osman Sagar) lake, west of the city — golden-hour ceremonies and receptions with the water and open sky behind you." },
      { name: "Luxury resorts", photo: "/images/disciplines/weddings/IMG_6274.jpg", about: "Resorts with heritage courtyards, pools and suites, so every function of a destination-style wedding can happen in one place." },
      { name: "Convention centres", photo: "/images/stories/hrithika-abhishek/IMG_6323.jpg", about: "Large halls for grand receptions of a thousand guests and more, with the stage, lighting and parking that big celebrations need." },
      { name: "Hotels & banquets", perk: "Luxury hotels", photo: "/images/stories/sirish-and-harshitha/IMG_6346.jpg", about: "Ballrooms and banquet halls in the city\u2019s luxury hotels — elegant for receptions and sangeet nights, with stays for out-of-town guests." },
    ],
  },
  {
    id: "decor",
    title: "Event décor",
    line: "Mandaps, florals and lighting from designers we trust",
    image: "/images/stories/karthik-and-gayathri/IMG_6329-mobile.webp",
    partners: fill([
      { name: "Design by Raja", perk: "Wedding décor", image: "/images/partners/design-by-raja.png", fit: "contain", photo: "/images/stories/hrithika-abhishek/IMG_6324.jpg", about: "Wedding décor — mandaps, florals and stage design built around your celebration. Mention 24 Frames when you meet the team." },
      { name: "Alankara", photo: "/images/stories/karthik-and-gayathri/IMG_6327.jpg", about: "Décor for every function, from intimate haldi set-ups to full reception stages. Mention 24 Frames when you visit." },
      { name: "Marvam", photo: "/images/stories/hrithika-abhishek/IMG_6325.jpg", about: "Décor and styling with colour, fabric and florals. Mention 24 Frames when you visit." },
    ]),
  },
  {
    id: "costumes",
    title: "Costumes & bridal designers",
    line: "Bridal couture, sarees and family outfits from labels we work with",
    image: "/images/disciplines/fashion/IMG_6280-mobile.webp",
    partners: fill([
      { name: "Sowmya Reddy", perk: "Bridal couture", image: "/images/partners/sowmya-reddy-symbol.svg", fit: "contain", photo: "/images/disciplines/celebrities/IMG_6472.jpg", about: "Bridal couture and occasion wear. Mention 24 Frames at your appointment — your relationship manager will share the current privilege." },
      { name: "Suvarna Mandir", perk: "Sarees", photo: "/images/disciplines/celebrities/IMG_6476.jpg", about: "Bridal and family sarees for every function of the wedding. Mention 24 Frames when you visit." },
      { name: "Reshu Varma", perk: "Designer wear", image: "/images/partners/reshu-varma.jpg", photo: "/images/disciplines/celebrities/IMG_6477.jpg", about: "Designer outfits for the bride and family. Mention 24 Frames at your appointment." },
    ]),
  },
  {
    id: "jewellery",
    title: "Jewellery curation",
    line: "Bridal sets and heirlooms from houses we work with",
    image: "/images/disciplines/fashion/IMG_6279-mobile.webp",
    // Petals fan lower-left → top → lower-right; index 2 is the top centre.
    partners: [
      { name: "Emmadi Silver", perk: "Silver jewellery", image: "/images/partners/emmadi-silver.png", fit: "contain", photo: "/images/disciplines/fashion/IMG_6286.jpg", about: "Silver jewellery and articles — for the bride, and for the gifts and rituals of the wedding. Mention 24 Frames when you visit." },
      { name: "SKT", perk: "Gold & Diamonds", image: "/images/partners/skt.png", fit: "contain", photo: "/images/disciplines/fashion/IMG_6285.jpg", about: "Gold and diamond bridal jewellery. Mention 24 Frames when you visit." },
      { name: "PMJ Jewels", perk: "3–4% off", image: "/images/partners/pmj.webp", fit: "contain", photo: "/images/disciplines/fashion/IMG_6321.jpg", about: "Bridal jewellery in gold, diamonds and polki. 24 Frames couples receive 3–4% off — mention our name at the store." },
      { name: "Devi Pavitra", perk: "Gold & Diamonds", image: "/images/partners/devi-pavitra.png", fit: "contain", photo: "/images/disciplines/fashion/IMG_6279.jpg", about: "Gold and diamond jewellery for the bride and family. Mention 24 Frames when you visit." },
      { name: "Malabar Gold & Diamonds", perk: "Gold & Diamonds", photo: "/images/disciplines/fashion/IMG_6280.jpg", about: "Gold and diamond jewellery, with bridal collections for every tradition. Mention 24 Frames when you visit." },
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
