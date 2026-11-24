/* The quotation journey as one pure function, so every route applies
   exactly the same rules:
     client   save · submit · share_update · accept
     sales    price · send_for_approval · forward · assign · log_consultation · seen
     owner    everything sales can do, plus approve · reject            */

import type { Deliverable } from "@/lib/commission/deliverables";
import type { CommissionDraft, CommissionQuote } from "@/lib/commission/types";
import {
  CONSULT_LABEL,
  LOST_LABEL,
  PRODUCTION_LABEL,
  type ConsultMode,
  type LostReason,
  type PortalAccount,
  type PortalQuote,
  type Production,
  type ProductionStatus,
  type QuoteEvent,
} from "./types";

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
  | { type: "log_consultation"; id: string; mode: ConsultMode; at: string; note: string }
  | { type: "confirm_booking"; note: string }
  | { type: "mark_lost"; reason: LostReason; detail: string }
  | { type: "revive"; note: string }
  | { type: "production"; status?: ProductionStatus; crew?: string; notes?: string; dueDate?: string | null; note?: string }
  | { type: "record_payment"; id: string; amount: number; note: string; at: string }
  | { type: "deliverables"; items: Deliverable[] | null; note: string }
  | { type: "deliverables_seen" };

const addDays = (iso: string, d: number) => {
  const t = new Date(`${iso}T00:00:00Z`);
  t.setUTCDate(t.getUTCDate() + d);
  return t.toISOString().slice(0, 10);
};

/** The operations team's starting point when a booking is confirmed. */
export function newProduction(q: PortalQuote, deliveryDays: number | null, by: string, now: string): Production {
  const dates = q.draft.events.map((e) => e.date).filter(Boolean).sort();
  const last = dates[dates.length - 1] || q.draft.couple.weddingDate || "";
  return {
    status: "awaiting_assignment",
    createdAt: now,
    crew: "",
    notes: "",
    dueDate: last && deliveryDays ? addDays(last, deliveryDays) : null,
    deliveredAt: null,
    log: [{ at: now, by, status: "awaiting_assignment", note: "Production brief generated from the confirmed quotation." }],
  };
}

const MAX_PRICE = 1_000_000_000;

/** Same couple, occasions, crew, delivery and planning — timestamps aside. */
function sameSelections(a: CommissionDraft, b: CommissionDraft) {
  const pick = (d: CommissionDraft) =>
    JSON.stringify([d.couple, d.events, d.assignments.map((x) => [x.eventId, x.serviceId, x.quantity]), d.deliveryTierId, d.planning ?? null]);
  return pick(a) === pick(b);
}

export function applyAction(
  q: PortalQuote,
  action: QuoteAction,
  by: PortalAccount,
  now = new Date().toISOString(),
  deliveryDays: number | null = null,
): PortalQuote | Error {
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
        return new Error("We are finalising this quotation — it can be edited again once it is shared with you.");
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
      if (!isClient) return new Error("Only the client can send their quotation to 24 Frames.");
      if (q.status !== "draft") return new Error("This quotation has already been sent to 24 Frames.");
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
        lost: null,
        bookedAt: now,
        production: q.production ?? newProduction(q, deliveryDays, "24 Frames", now),
        attention: { at: now, kind: "accepted", note: "" },
        history: log({ action: "accepted" }),
        updatedAt: now,
      };
    }
    case "price": {
      if (!isStaff) return new Error("Only the 24 Frames team can set the price.");
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
      if (!isStaff) return new Error("Only the 24 Frames team can request approval.");
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
      if (!isStaff) return new Error("Only the 24 Frames team can share the quotation.");
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
      if (!isStaff) return new Error("Only the 24 Frames team can reopen a quotation.");
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
      if (!isStaff) return new Error("Only the 24 Frames team can clear a notification.");
      return { ...q, attention: null };
    }
    case "assign": {
      if (by.role !== "owner") return new Error("Only the founder assigns relationship managers.");
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
      if (!isStaff) return new Error("Only the 24 Frames team logs consultations.");
      const entry = { id: action.id, at: action.at, mode: action.mode, by: by.name, note: action.note.trim().slice(0, 1000) };
      return {
        ...q,
        consultations: [...(q.consultations ?? []), entry].sort((a, b) => a.at.localeCompare(b.at)),
        history: log({ action: "consultation", note: [CONSULT_LABEL[entry.mode], entry.note].filter(Boolean).join(" — ") }),
        updatedAt: now,
      };
    }
    case "confirm_booking": {
      if (!isStaff) return new Error("Only the 24 Frames team confirms a booking.");
      if (!["approved", "sent"].includes(q.status)) return new Error("Only an approved quotation can be confirmed as a booking.");
      return {
        ...q,
        status: "accepted",
        lost: null,
        bookedAt: now,
        production: q.production ?? newProduction(q, deliveryDays, by.name, now),
        attention: null,
        history: log({ action: "booked", price: q.finalPrice ?? q.quote.grandTotal, note: action.note.trim().slice(0, 500) || undefined }),
        updatedAt: now,
      };
    }
    case "mark_lost": {
      if (!isStaff) return new Error("Only the 24 Frames team closes an enquiry.");
      if (q.status === "accepted") return new Error("A confirmed booking can't be marked as lost.");
      if (!Object.hasOwn(LOST_LABEL, action.reason)) return new Error("Choose why the enquiry was lost.");
      const detail = action.detail.trim().slice(0, 1000);
      return {
        ...q,
        lost: { at: now, by: by.name, reason: action.reason, detail },
        attention: null,
        history: log({ action: "lost", note: [LOST_LABEL[action.reason], detail].filter(Boolean).join(" — ") }),
        updatedAt: now,
      };
    }
    case "revive": {
      if (!isStaff) return new Error("Only the 24 Frames team reopens an enquiry.");
      if (!q.lost) return q;
      return { ...q, lost: null, history: log({ action: "revived", note: action.note.trim().slice(0, 500) || undefined }), updatedAt: now };
    }
    case "production": {
      if (!isStaff) return new Error("Only the 24 Frames team updates production.");
      if (!q.production) return new Error("Production starts once the booking is confirmed.");
      const p = q.production;
      const status = action.status ?? p.status;
      const changed = status !== p.status;
      const next: Production = {
        ...p,
        status,
        crew: action.crew !== undefined ? action.crew.slice(0, 1000) : p.crew,
        notes: action.notes !== undefined ? action.notes.slice(0, 3000) : p.notes,
        dueDate: action.dueDate !== undefined ? action.dueDate : p.dueDate,
        deliveredAt: status === "delivered" ? p.deliveredAt ?? now : null,
        log: changed ? [...p.log, { at: now, by: by.name, status, note: action.note?.slice(0, 500) || undefined }] : p.log,
      };
      return {
        ...q,
        production: next,
        history: changed ? log({ action: "production", note: PRODUCTION_LABEL[status] }) : q.history,
        updatedAt: now,
      };
    }
    case "record_payment": {
      if (!isStaff) return new Error("Only the 24 Frames team records payments.");
      if (q.status !== "accepted") return new Error("Payments are recorded against a confirmed booking.");
      const amount = Math.round(action.amount);
      if (!Number.isFinite(amount) || amount <= 0 || amount > MAX_PRICE) return new Error("Enter a valid amount.");
      const entry = { id: action.id, at: action.at, amount, note: action.note.trim().slice(0, 300), by: by.name };
      return {
        ...q,
        payments: [...(q.payments ?? []), entry].sort((a, b) => a.at.localeCompare(b.at)),
        history: log({ action: "payment", price: amount, note: entry.note || undefined }),
        updatedAt: now,
      };
    }
    case "deliverables": {
      if (!isStaff) return new Error("Only the 24 Frames team can change the deliverables.");
      if (q.status === "draft") return new Error("Deliverables can be tailored once the client has sent the quotation.");
      if (q.lost) return new Error("This enquiry was marked lost.");
      const note = action.note.trim().slice(0, 400);
      return {
        ...q,
        deliverables: action.items,
        deliverablesUpdate: { at: now, by: by.name, note, seenByClient: false },
        history: log({ action: "deliverables", note: note || (action.items ? "Deliverables tailored for this couple." : "Deliverables reset to the standard list.") }),
        updatedAt: now,
      };
    }
    case "deliverables_seen": {
      if (!isClient || !q.deliverablesUpdate || q.deliverablesUpdate.seenByClient) return q;
      return { ...q, deliverablesUpdate: { ...q.deliverablesUpdate, seenByClient: true } };
    }
  }
}
