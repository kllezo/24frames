/* ============================================================
   The 24 Frames client & studio portal — shared types.
   ------------------------------------------------------------
   Roles
     client — signs up online, composes and edits their own quotations
     sales  — reviews quotations, adjusts the final price, confirms with
              the client and sends it to the founder for approval
     owner  — the founder: approves or rejects with a comment, manages
              the sales team
   Quotation journey
     draft → submitted → pending_approval → approved → sent → accepted
                                   ↘ rejected → (sales revises) → pending_approval
   ============================================================ */

import type { CommissionDraft, CommissionQuote } from "@/lib/commission/types";

export type PortalRole = "client" | "sales" | "owner";

export interface PortalAccount {
  id: string;
  role: PortalRole;
  name: string;
  email: string;
  phone: string;
  /** City / location given at sign-up (clients). */
  location: string;
  /** The founder account created at set-up: grants and revokes desk access. */
  superadmin?: boolean;
  /** Clients: the studio team member who looks after them (their relationship manager). */
  managerId?: string | null;
  /** Clients: how the enquiry reached the studio. */
  source?: LeadSource;
  /** Clients: a custom rate card (1 = the studio's normal rates). Never shown to the client. */
  priceFactor?: number | null;
  /** Clients: the custom price link they arrived through, if any. */
  priceLinkId?: string | null;
  /** Sales: the superadmin lets them see every lead, not only their own. */
  seeAllLeads?: boolean;
  /** Clients: created from a website enquiry — they set their password when they first sign up. */
  pendingSignup?: boolean;
  /** Clients: what they told us in the website enquiry. */
  enquiry?: EnquiryBrief | null;
  /** scrypt$N$r$p$salt$hash */
  passwordHash: string;
  active: boolean;
  createdAt: string;
  createdBy: string | null;
  lastLoginAt: string | null;
}

export type PublicAccount = Omit<PortalAccount, "passwordHash">;

/** An email the superadmin has authorised to use the studio desk. */
export interface StaffAccess {
  email: string;
  name: string;
  role: "sales" | "owner";
  note: string;
  active: boolean;
  grantedBy: string;
  grantedAt: string;
  revokedBy: string | null;
  revokedAt: string | null;
}

/** One client row in the CRM. */
export interface CrmClient {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  managerId: string | null;
  managerName: string | null;
  createdAt: string;
  lastLoginAt: string | null;
  quotes: number;
  latestStatus: QuoteStatus | null;
  latestReference: string | null;
  latestValue: number | null;
  latestUpdatedAt: string | null;
  source: LeadSource;
  priceFactor: number | null;
  enquiry: EnquiryBrief | null;
}

/** A website enquiry, summarised for the relationship manager. */
export interface EnquiryBrief {
  at: string;
  category: string;
  events: { name: string; date: string; city: string; venue: string }[];
  directions: string[];
  services: string[];
  scale: string;
  investment: string;
  notes: string;
  memories: string;
  /** One paragraph the RM can read before the first call. */
  summary: string;
}

/* ---------------- leads, bookings and production ---------------- */

export type LeadSource = "website" | "enquiry" | "rm_link" | "price_link" | "referral" | "instagram" | "walk_in" | "other";
export const SOURCE_LABEL: Record<LeadSource, string> = {
  website: "Website sign-up",
  enquiry: "Website enquiry form",
  rm_link: "Relationship manager link",
  price_link: "Custom price link",
  referral: "Referral",
  instagram: "Instagram",
  walk_in: "Walk-in / call",
  other: "Other",
};

export type LostReason = "budget" | "date_unavailable" | "competitor" | "no_response" | "postponed" | "scope" | "other";
export const LOST_LABEL: Record<LostReason, string> = {
  budget: "Over their budget",
  date_unavailable: "Date unavailable",
  competitor: "Chose another studio",
  no_response: "Stopped responding",
  postponed: "Wedding postponed / cancelled",
  scope: "Needs we don't cover",
  other: "Other",
};

export type ProductionStatus =
  | "awaiting_assignment"
  | "crew_assigned"
  | "ready"
  | "event_completed"
  | "post_production"
  | "quality_review"
  | "delivered";
export const PRODUCTION_STEPS: { id: ProductionStatus; label: string }[] = [
  { id: "awaiting_assignment", label: "Awaiting assignment" },
  { id: "crew_assigned", label: "Crew assigned" },
  { id: "ready", label: "Ready for event" },
  { id: "event_completed", label: "Event completed" },
  { id: "post_production", label: "Post-production" },
  { id: "quality_review", label: "Quality review" },
  { id: "delivered", label: "Delivered" },
];
export const PRODUCTION_LABEL = Object.fromEntries(PRODUCTION_STEPS.map((s) => [s.id, s.label])) as Record<ProductionStatus, string>;

export interface Production {
  status: ProductionStatus;
  createdAt: string;
  /** Who is shooting — free text the operations team fills in. */
  crew: string;
  /** Operations notes added on top of the client's own instructions. */
  notes: string;
  /** Promised delivery date (last celebration + the chosen delivery tier). */
  dueDate: string | null;
  deliveredAt: string | null;
  log: { at: string; by: string; status: ProductionStatus; note?: string }[];
}

export interface Payment {
  id: string;
  at: string;
  amount: number;
  note: string;
  by: string;
}

/** A desk notification for one team member. */
export interface DeskNotification {
  id: string;
  to: string;
  at: string;
  kind: "rm_changed" | "lead_assigned" | "lead_removed" | "booking" | "target" | "price_link" | "enquiry";
  text: string;
  quoteId?: string | null;
  clientId?: string | null;
  read: boolean;
}

/** A follow-up a salesperson owes a lead. */
export interface FollowUp {
  id: string;
  ownerId: string;
  ownerName: string;
  clientId: string;
  clientName: string;
  quoteId: string | null;
  kind: "call" | "meeting" | "message" | "task";
  due: string;
  note: string;
  done: boolean;
  doneAt: string | null;
  createdAt: string;
}

/** A custom rate card shared as a link. */
export interface PriceLink {
  id: string;
  factor: number;
  label: string;
  email: string | null;
  createdById: string;
  createdByName: string;
  createdAt: string;
  usedBy: string | null;
  usedByName: string | null;
  usedAt: string | null;
  active: boolean;
}

/** Targets and incentives the superadmin sets. */
export interface SalesSettings {
  /** Monthly booking target in rupees, per team member. */
  targets: Record<string, number>;
  /** Commission on booked value, in percent. */
  commissionPct: number;
  /** Per-person commission overrides, in percent. */
  commissionOverrides: Record<string, number>;
  /** Extra percent on the value booked beyond the monthly target. */
  bonusPctAboveTarget: number;
  updatedAt: string | null;
  updatedBy: string | null;
}
export const DEFAULT_SETTINGS: SalesSettings = {
  targets: {},
  commissionPct: 2,
  commissionOverrides: {},
  bonusPctAboveTarget: 1,
  updatedAt: null,
  updatedBy: null,
};

export type QuoteStatus = "draft" | "submitted" | "pending_approval" | "approved" | "rejected" | "sent" | "accepted";

export interface QuoteEvent {
  at: string;
  by: string;
  role: PortalRole;
  action:
    | "created"
    | "saved"
    | "submitted"
    | "revised"
    | "priced"
    | "sent_for_approval"
    | "approved"
    | "rejected"
    | "forwarded"
    | "accepted"
    | "update_shared"
    | "change_requested"
    | "reopened"
    | "assigned"
    | "consultation"
    | "note"
    | "booked"
    | "lost"
    | "revived"
    | "production"
    | "payment";
  note?: string;
  price?: number;
}

/** How a relationship manager walked the client through the quotation. */
export type ConsultMode = "studio" | "video" | "phone" | "whatsapp";
export const CONSULT_LABEL: Record<ConsultMode, string> = {
  studio: "In the studio",
  video: "Zoom / video call",
  phone: "Phone call",
  whatsapp: "WhatsApp",
};

export interface Consultation {
  id: string;
  at: string;
  mode: ConsultMode;
  by: string;
  note: string;
}

/** Something the client did that the studio hasn't looked at yet. */
export interface Attention {
  at: string;
  kind: "submitted" | "update" | "accepted" | "change_request";
  note: string;
}

/** What a client sees of their relationship manager. */
export interface ManagerCard {
  name: string;
  phone: string;
  email: string;
}

export interface PortalQuote {
  id: string;
  reference: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  status: QuoteStatus;
  draft: CommissionDraft;
  /** Studio-engine estimate at the last save (what the client saw). */
  quote: CommissionQuote;
  configVersion: number;
  /** Price set by the sales team (null = the computed estimate). */
  finalPrice: number | null;
  salesNote: string;
  salesOwner: string | null;
  founderComment: string;
  decidedBy: string | null;
  decidedAt: string | null;
  history: QuoteEvent[];
  createdAt: string;
  updatedAt: string;
  /** Relationship manager (copied from the client's account). */
  managerId?: string | null;
  managerName?: string | null;
  /** Unseen client activity — the studio's notification. */
  attention?: Attention | null;
  /** Guided sessions logged by the relationship manager. */
  consultations?: Consultation[];
  /** Bumped on every saved change; `sharedRevision` is the last one the client sent to the studio. */
  revision?: number;
  sharedRevision?: number;
  lastSharedAt?: string | null;
  /** The enquiry did not go ahead. */
  lost?: { at: string; by: string; reason: LostReason; detail: string } | null;
  /** When the booking was confirmed (accepted by the client or confirmed by the studio). */
  bookedAt?: string | null;
  /** Generated when the booking is confirmed — the operations team's brief. */
  production?: Production | null;
  /** Payments received against the booking. */
  payments?: Payment[];
}

/** True when the client has saved changes the studio hasn't been told about. */
export const hasUnsharedChanges = (q: PortalQuote) =>
  q.status === "submitted" && (q.revision ?? 0) > (q.sharedRevision ?? 0);

export const STATUS_LABEL: Record<QuoteStatus, string> = {
  draft: "In progress",
  submitted: "With the studio",
  pending_approval: "Awaiting founder",
  approved: "Approved",
  rejected: "Returned",
  sent: "Quotation ready",
  accepted: "Accepted",
};

/** What the client sees — internal steps read as "being prepared". */
export const CLIENT_STATUS_LABEL: Record<QuoteStatus, string> = {
  draft: "In progress",
  submitted: "Being prepared by the studio",
  pending_approval: "Being prepared by the studio",
  approved: "Being prepared by the studio",
  rejected: "Being prepared by the studio",
  sent: "Your quotation is ready",
  accepted: "Accepted",
};

/** Client view of a quotation: internal notes and decisions removed. */
export function forClient(q: PortalQuote, manager: ManagerCard | null = null) {
  const ready = q.status === "sent" || q.status === "accepted";
  return {
    id: q.id,
    reference: q.reference,
    status: q.status,
    statusLabel: CLIENT_STATUS_LABEL[q.status],
    draft: q.draft,
    quote: q.quote,
    finalPrice: ready ? q.finalPrice ?? q.quote.grandTotal : null,
    createdAt: q.createdAt,
    updatedAt: q.updatedAt,
    editable: q.status === "draft" || q.status === "submitted" || q.status === "sent",
    manager,
    unshared: hasUnsharedChanges(q),
    lastSharedAt: q.lastSharedAt ?? null,
    consultations: (q.consultations ?? []).map((c) => ({ at: c.at, mode: c.mode, by: c.by })),
  };
}
export type ClientQuote = ReturnType<typeof forClient>;

export function publicAccount(a: PortalAccount): PublicAccount {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash, ...rest } = a;
  return rest;
}
