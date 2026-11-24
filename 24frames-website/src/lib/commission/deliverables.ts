/* What the couple receives — printed on the "Deliverables" page of the
   proposal. The studio's standard list is the starting point; after a
   quotation is composed the sales team can tailor it per couple. */

export interface Deliverable {
  title: string;
  detail: string;
}

export const MAX_DELIVERABLES = 6;

export const DEFAULT_DELIVERABLES: Deliverable[] = [
  {
    title: "Photos",
    detail:
      "Approximately 1000-1500 meticulously edited photos will be provided on your hard drive, all raw images from your events will be included on the hard drive",
  },
  {
    title: "Wedding Film 4K",
    detail:
      "Around 2-3 minutes engagement teaser & Around 5-8 minutes wedding film showcasing the highlights of your over all wedding will be available on the cloud.",
  },
  { title: "Traditional Video", detail: "Fully edited, 4K videos of your events will be delivered on the hard drive." },
  { title: "Luxury Albums", detail: "Complimentary four luxury albums (Physical & Digital) each with 30 sheets, will be provided." },
  { title: "Pic-Time Link", detail: "Get all your pictures, reels & teasers in a link which is an AI based luxurious online gallery." },
];

/** Trims, drops empty rows and caps the list — safe to store. */
export function cleanDeliverables(input: unknown): Deliverable[] | null {
  if (!Array.isArray(input)) return null;
  const out = input
    .map((d) => ({
      title: String((d as Deliverable)?.title ?? "").trim().slice(0, 60),
      detail: String((d as Deliverable)?.detail ?? "").trim().slice(0, 320),
    }))
    .filter((d) => d.title || d.detail)
    .slice(0, MAX_DELIVERABLES);
  return out.length ? out : null;
}

/** A short fingerprint, so a changed list re-renders the PDF. */
export const deliverablesKey = (list: Deliverable[] | null | undefined) =>
  list ? list.map((d) => `${d.title}:${d.detail.length}`).join("|") : "std";
