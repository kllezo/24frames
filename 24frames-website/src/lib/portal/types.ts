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
}

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
    | "note";
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
