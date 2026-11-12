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
    | "note";
  note?: string;
  price?: number;
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
}

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
export function forClient(q: PortalQuote) {
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
  };
}
export type ClientQuote = ReturnType<typeof forClient>;

export function publicAccount(a: PortalAccount): PublicAccount {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash, ...rest } = a;
  return rest;
}
