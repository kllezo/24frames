import { getConfig } from "@/lib/studio/server/repository";
import { validateDraftForSubmit } from "@/lib/commission/validation";
import { randomUUID } from "node:crypto";
import { getAccount, getQuote, listAccounts, managerCard, mutateQuote } from "@/lib/portal/store";
import { cleanDeliverables } from "@/lib/commission/deliverables";
import { body, deskAllowed, json, leadVisible, portalError, requireRole, sameOrigin } from "@/lib/portal/guard";
import { configFor } from "@/lib/portal/pricing";
import { notify } from "@/lib/portal/notify";
import { prepareClientDraft } from "@/lib/portal/drafts";
import { applyAction, type QuoteAction } from "@/lib/portal/workflow";
import { CONSULT_LABEL, LOST_LABEL, PRODUCTION_LABEL, forClient, type ConsultMode, type LostReason, type PortalAccount, type PortalQuote, type ProductionStatus } from "@/lib/portal/types";
import type { CommissionDraft } from "@/lib/commission/types";

type Ctx = { params: Promise<{ id: string }> };

const view = async (q: PortalQuote, me: PortalAccount) =>
  me.role === "client" ? forClient(q, await managerCard(me.managerId)) : q;

export async function GET(_request: Request, ctx: Ctx) {
  const me = await requireRole();
  if (me instanceof Response) return me;
  const { id } = await ctx.params;
  try {
    const q = await getQuote(id);
    if (!q || (me.role === "client" && q.clientId !== me.id) || (me.role !== "client" && !leadVisible(me, q.managerId))) {
      return json({ error: "Quotation not found." }, 404);
    }
    return json({ quote: await view(q, me) });
  } catch (err) {
    return portalError(err);
  }
}

/* Every change to a quotation goes through the workflow rules. */
export async function POST(request: Request, ctx: Ctx) {
  if (!sameOrigin(request)) return json({ error: "Not allowed." }, 403);
  const me = await requireRole();
  if (me instanceof Response) return me;
  const { id } = await ctx.params;
  const b = await body<{
    action?: QuoteAction["type"];
    draft?: CommissionDraft;
    finalPrice?: number | null;
    note?: string;
    comment?: string;
    via?: string;
    managerId?: string | null;
    mode?: string;
    at?: string;
    reason?: string;
    detail?: string;
    status?: string;
    crew?: string;
    notes?: string;
    dueDate?: string | null;
    amount?: number;
    deliverables?: unknown;
  }>(request);
  if (!b?.action) return json({ error: "Missing action." }, 400);

  try {
    let action: QuoteAction;
    if (b.action === "save" || b.action === "submit") {
      if (!b.draft || typeof b.draft !== "object") return json({ error: "Missing selections." }, 400);
      const config = configFor((await getConfig()).config, me);
      const { draft, quote } = prepareClientDraft(b.draft, config);
      if (b.action === "submit") {
        const issues = validateDraftForSubmit(draft, config);
        if (issues.length) return json({ error: "Please complete your quotation.", issues }, 422);
      }
      action = { type: b.action, draft, quote, configVersion: config.version };
    } else if (b.action === "price" || b.action === "send_for_approval") {
      const p = b.finalPrice;
      if (p !== null && p !== undefined && (typeof p !== "number" || !Number.isFinite(p) || p < 0)) {
        return json({ error: "Enter a valid price." }, 422);
      }
      action = { type: b.action, finalPrice: p ?? null, note: String(b.note ?? "") };
    } else if (b.action === "approve" || b.action === "reject") {
      action = { type: b.action, comment: String(b.comment ?? "") };
    } else if (b.action === "forward") {
      action = { type: "forward", note: String(b.note ?? "") };
    } else if (b.action === "accept") {
      action = { type: "accept" };
    } else if (b.action === "share_update") {
      action = { type: "share_update", note: String(b.note ?? ""), via: b.via === "whatsapp" ? "whatsapp" : "studio" };
    } else if (b.action === "seen") {
      action = { type: "seen" };
    } else if (b.action === "reopen") {
      action = { type: "reopen", note: String(b.note ?? "") };
    } else if (b.action === "assign") {
      let managerName: string | null = null;
      const managerId = b.managerId || null;
      if (managerId) {
        const m = await getAccount(managerId);
        if (!m || !m.active || m.role === "client" || !(await deskAllowed(m))) return json({ error: "Choose an active team member." }, 422);
        managerName = m.name;
      }
      action = { type: "assign", managerId, managerName };
    } else if (b.action === "log_consultation") {
      const mode = String(b.mode ?? "") as ConsultMode;
      if (!Object.hasOwn(CONSULT_LABEL, mode)) return json({ error: "Choose how the session took place." }, 422);
      const at = typeof b.at === "string" && !Number.isNaN(Date.parse(b.at)) ? new Date(b.at).toISOString() : new Date().toISOString();
      action = { type: "log_consultation", id: randomUUID(), mode, at, note: String(b.note ?? "") };
    } else if (b.action === "confirm_booking") {
      action = { type: "confirm_booking", note: String(b.note ?? "") };
    } else if (b.action === "mark_lost") {
      const reason = String(b.reason ?? "") as LostReason;
      if (!Object.hasOwn(LOST_LABEL, reason)) return json({ error: "Choose why the enquiry was lost." }, 422);
      action = { type: "mark_lost", reason, detail: String(b.detail ?? "") };
    } else if (b.action === "revive") {
      action = { type: "revive", note: String(b.note ?? "") };
    } else if (b.action === "production") {
      const status = b.status === undefined ? undefined : (String(b.status) as ProductionStatus);
      if (status !== undefined && !Object.hasOwn(PRODUCTION_LABEL, status)) return json({ error: "Unknown production stage." }, 422);
      const dueDate = b.dueDate === undefined ? undefined : b.dueDate && /^\d{4}-\d{2}-\d{2}$/.test(b.dueDate) ? b.dueDate : null;
      action = {
        type: "production",
        status,
        crew: b.crew === undefined ? undefined : String(b.crew),
        notes: b.notes === undefined ? undefined : String(b.notes),
        dueDate,
        note: String(b.note ?? ""),
      };
    } else if (b.action === "record_payment") {
      const amount = Number(b.amount);
      if (!Number.isFinite(amount) || amount <= 0) return json({ error: "Enter a valid amount." }, 422);
      const at = typeof b.at === "string" && !Number.isNaN(Date.parse(b.at)) ? new Date(b.at).toISOString() : new Date().toISOString();
      action = { type: "record_payment", id: randomUUID(), amount, note: String(b.note ?? ""), at };
    } else if (b.action === "deliverables") {
      action = { type: "deliverables", items: cleanDeliverables(b.deliverables), note: String(b.note ?? "") };
    } else if (b.action === "deliverables_seen") {
      action = { type: "deliverables_seen" };
    } else {
      return json({ error: "Unknown action." }, 400);
    }

    // Booking confirmations need the delivery tier to date the production timeline.
    let deliveryDays: number | null = null;
    if (action.type === "accept" || action.type === "confirm_booking") {
      const { config } = await getConfig();
      const cur = await getQuote(id);
      deliveryDays = config.deliveryTiers.find((t) => t.id === cur?.draft.deliveryTierId)?.days ?? null;
    }

    const result = await mutateQuote(id, (q) => {
      if (me.role === "client" && q.clientId !== me.id) return new Error("Quotation not found.");
      if (me.role !== "client" && !leadVisible(me, q.managerId)) return new Error("Quotation not found.");
      return applyAction(q, action, me, undefined, deliveryDays);
    });
    if (result === null) return json({ error: "Quotation not found." }, 404);
    if (result instanceof Error) return json({ error: result.message }, 409);
    if (action.type === "accept" || action.type === "confirm_booking") {
      // A confirmed booking reaches the relationship manager and the founder (even when no manager is assigned).
      const owners = (await listAccounts()).filter((a) => a.role === "owner" && a.active).map((a) => a.id);
      await notify([result.managerId, ...owners].filter((id) => id && id !== me.id), "booking", `${result.clientName}'s booking (${result.reference}) is confirmed — the production brief is ready.`, {
        quoteId: result.id,
        clientId: result.clientId,
      });
    }
    if (action.type === "deliverables") {
      // The founder and the relationship manager hear about it on the desk; the client sees it on their quotation.
      const owners = (await listAccounts()).filter((a) => a.role === "owner" && a.active).map((a) => a.id);
      await notify(
        [...owners, result.managerId].filter((id) => id !== me.id),
        "deliverables",
        `${me.name} updated the deliverables on ${result.clientName}'s quotation (${result.reference}) — the PDF now reflects them.`,
        { quoteId: result.id, clientId: result.clientId },
      );
    }
    return json({ quote: await view(result, me) });
  } catch (err) {
    return portalError(err);
  }
}
