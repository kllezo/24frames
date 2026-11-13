/* The quotation journey as one pure function, so every route applies
   exactly the same rules:
     client   save · submit · share_update · accept
     sales    price · send_for_approval · forward · assign · log_consultation · seen
     owner    everything sales can do, plus approve · reject            */

import type { CommissionDraft, CommissionQuote } from "@/lib/commission/types";
import { CONSULT_LABEL, type ConsultMode, type PortalAccount, type PortalQuote, type QuoteEvent } from "./types";

export type QuoteAction =
  | { type: "save"; draft: CommissionDraft; quote: CommissionQuote; configVersion: number }
  | { type: "submit"; draft: CommissionDraft; quote: CommissionQuote; configVersion: number }
  | { type: "accept" }
  | { type: "price"; finalPrice: number | null; note: string }
  | { type: "send_for_approval"; finalPrice: number | null; note: string }
  | { type: "approve"; comment: string }
  | { type: "reject"; comment: string }
  | { type: "forward"; note: string }
  | { type: "share_update"; note: string; via: "studio" | "whatsapp" }
  | { type: "seen" }
  | { type: "reopen"; note: string }
  | { type: "assign"; managerId: string | null; managerName: string | null }
  | { type: "log_consultation"; id: string; mode: ConsultMode; at: string; note: string };

const MAX_PRICE = 1_000_000_000;

/** Same couple, occasions, crew, delivery and planning — timestamps aside. */
function sameSelections(a: CommissionDraft, b: CommissionDraft) {
  const pick = (d: CommissionDraft) =>
    JSON.stringify([d.couple, d.events, d.assignments.map((x) => [x.eventId, x.serviceId, x.quantity]), d.deliveryTierId, d.planning ?? null]);
  return pick(a) === pick(b);
}

export function applyAction(q: PortalQuote, action: QuoteAction, by: PortalAccount, now = new Date().toISOString()): PortalQuote | Error {
  const isClient = by.role === "client";
  const isStaff = by.role === "sales" || by.role === "owner";
  const log = (entry: Omit<QuoteEvent, "at" | "by" | "role">): QuoteEvent[] => [
    ...q.history,
    { at: now, by: by.name, role: by.role, ...entry },
  ];
  const cleanPrice = (p: number | null) => (p === null ? null : Math.round(Math.min(Math.max(p, 0), MAX_PRICE)));

  if (isClient && q.clientId !== by.id) return new Error("This quotation belongs to another account.");

  switch (action.type) {
    case "save": {
      if (!isClient) return new Error("Only the client edits their own selections.");
      if (!["draft", "submitted", "sent"].includes(q.status)) {
        return new Error("The studio is finalising this quotation — it can be edited again once it is shared with you.");
      }
      // Opening a quotation re-saves it; only a real change counts as a revision
      // (and only a real change reopens a quotation the studio has shared).
      if (sameSelections(q.draft, action.draft)) return q;
      const reopened = q.status === "sent";
      const last = q.history[q.history.length - 1];
      const recentlyLogged = last && last.action === "revised" && Date.parse(now) - Date.parse(last.at) < 15 * 60 * 1000;
      return {
        ...q,
        draft: action.draft,
        quote: action.quote,
        configVersion: action.configVersion,
        status: reopened ? "submitted" : q.status,
        finalPrice: reopened ? null : q.finalPrice,
        revision: (q.revision ?? 0) + 1,
        history:
          q.status === "draft" || recentlyLogged
            ? q.history
            : log({ action: "revised", note: reopened ? "The client changed their selections after receiving the quotation." : undefined }),
        updatedAt: now,
      };
    }
    case "submit": {
      if (!isClient) return new Error("Only the client can send their quotation to the studio.");
      if (q.status !== "draft") return new Error("This quotation has already been sent to the studio.");
      return {
        ...q,
        draft: action.draft,
        quote: action.quote,
        configVersion: action.configVersion,
        status: "submitted",
        revision: (q.revision ?? 0) + 1,
        sharedRevision: (q.revision ?? 0) + 1,
        lastSharedAt: now,
        attention: { at: now, kind: "submitted", note: "" },
        history: log({ action: "submitted", price: action.quote.grandTotal }),
        updatedAt: now,
      };
    }
    case "accept": {
      if (!isClient) return new Error("Only the client can accept the quotation.");
      if (q.status !== "sent") return new Error("This quotation is not ready to accept yet.");
      return {
        ...q,
        status: "accepted",
        attention: { at: now, kind: "accepted", note: "" },
        history: log({ action: "accepted" }),
        updatedAt: now,
      };
    }
    case "price": {
      if (!isStaff) return new Error("Only the studio can set the price.");
      if (!["submitted", "rejected"].includes(q.status)) return new Error("The price can be changed while the quotation is with sales.");
      const price = cleanPrice(action.finalPrice);
      return {
        ...q,
        finalPrice: price,
        salesNote: action.note.slice(0, 2000),
        salesOwner: by.name,
        history: log({ action: "priced", price: price ?? q.quote.grandTotal, note: action.note.slice(0, 500) || undefined }),
        updatedAt: now,
      };
    }
    case "send_for_approval": {
      if (!isStaff) return new Error("Only the studio can request approval.");
      if (!["submitted", "rejected"].includes(q.status)) return new Error("This quotation is not with sales.");
      const price = cleanPrice(action.finalPrice);
      return {
        ...q,
        status: "pending_approval",
        finalPrice: price,
        salesNote: action.note.slice(0, 2000),
        salesOwner: by.name,
        attention: null,
        founderComment: "",
        decidedBy: null,
        decidedAt: null,
        history: log({ action: "sent_for_approval", price: price ?? q.quote.grandTotal, note: action.note.slice(0, 500) || undefined }),
        updatedAt: now,
      };
    }
    case "approve":
    case "reject": {
      if (by.role !== "owner") return new Error("Only the founder can approve or reject a quotation.");
      if (q.status !== "pending_approval") return new Error("This quotation is not awaiting approval.");
      const comment = action.comment.trim().slice(0, 2000);
      if (action.type === "reject" && !comment) return new Error("Add a comment so the team knows what to change.");
      return {
        ...q,
        status: action.type === "approve" ? "approved" : "rejected",
        founderComment: comment,
        decidedBy: by.name,
        decidedAt: now,
        history: log({ action: action.type === "approve" ? "approved" : "rejected", note: comment || undefined }),
        updatedAt: now,
      };
    }
    case "forward": {
      if (!isStaff) return new Error("Only the studio can share the quotation.");
      if (q.status !== "approved") return new Error("Only an approved quotation can be shared with the client.");
      return {
        ...q,
        status: "sent",
        attention: null,
        history: log({ action: "forwarded", note: action.note.trim().slice(0, 500) || undefined }),
        updatedAt: now,
      };
    }
    case "share_update": {
      if (!isClient) return new Error("Only the client shares their changes.");
      // A locked quotation (with the founder, approved, shared or accepted):
      // the client asks their relationship manager to reopen it.
      if (["pending_approval", "approved", "rejected", "sent", "accepted"].includes(q.status)) {
        const ask = action.note.trim().slice(0, 1000);
        if (!ask) return new Error("Tell us what you'd like to change.");
        return {
          ...q,
          attention: { at: now, kind: "change_request", note: ask },
          history: log({ action: "change_requested", note: [action.via === "whatsapp" ? "Also sent on WhatsApp." : "", ask].filter(Boolean).join(" ") }),
          updatedAt: now,
        };
      }
      if (q.status !== "submitted") return new Error("There are no changes to share right now.");
      const note = action.note.trim().slice(0, 1000);
      return {
        ...q,
        sharedRevision: q.revision ?? 0,
        lastSharedAt: now,
        attention: { at: now, kind: "update", note },
        history: log({
          action: "update_shared",
          note: [action.via === "whatsapp" ? "Also sent on WhatsApp." : "", note].filter(Boolean).join(" ") || undefined,
        }),
        updatedAt: now,
      };
    }
    case "reopen": {
      if (!isStaff) return new Error("Only the studio can reopen a quotation.");
      if (!["pending_approval", "approved", "rejected", "sent", "accepted"].includes(q.status)) return new Error("This quotation is already open for changes.");
      return {
        ...q,
        status: "submitted",
        finalPrice: null,
        founderComment: "",
        decidedBy: null,
        decidedAt: null,
        attention: null,
        history: log({ action: "reopened", note: action.note.trim().slice(0, 500) || undefined }),
        updatedAt: now,
      };
    }
    case "seen": {
      if (!isStaff) return new Error("Only the studio can clear a notification.");
      return { ...q, attention: null };
    }
    case "assign": {
      if (!isStaff) return new Error("Only the studio assigns relationship managers.");
      if ((q.managerId ?? null) === action.managerId) return q;
      return {
        ...q,
        managerId: action.managerId,
        managerName: action.managerName,
        history: log({ action: "assigned", note: action.managerName ?? "Unassigned" }),
        updatedAt: now,
      };
    }
    case "log_consultation": {
      if (!isStaff) return new Error("Only the studio logs consultations.");
      const entry = { id: action.id, at: action.at, mode: action.mode, by: by.name, note: action.note.trim().slice(0, 1000) };
      return {
        ...q,
        consultations: [...(q.consultations ?? []), entry].sort((a, b) => a.at.localeCompare(b.at)),
        history: log({ action: "consultation", note: [CONSULT_LABEL[entry.mode], entry.note].filter(Boolean).join(" — ") }),
        updatedAt: now,
      };
    }
  }
}
