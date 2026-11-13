import { getConfig } from "@/lib/studio/server/repository";
import { validateDraftForSubmit } from "@/lib/commission/validation";
import { randomUUID } from "node:crypto";
import { getAccount, getQuote, managerCard, mutateQuote } from "@/lib/portal/store";
import { body, deskAllowed, json, portalError, requireRole, sameOrigin } from "@/lib/portal/guard";
import { prepareClientDraft } from "@/lib/portal/drafts";
import { applyAction, type QuoteAction } from "@/lib/portal/workflow";
import { CONSULT_LABEL, forClient, type ConsultMode, type PortalAccount, type PortalQuote } from "@/lib/portal/types";
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
    if (!q || (me.role === "client" && q.clientId !== me.id)) return json({ error: "Quotation not found." }, 404);
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
  }>(request);
  if (!b?.action) return json({ error: "Missing action." }, 400);

  try {
    let action: QuoteAction;
    if (b.action === "save" || b.action === "submit") {
      if (!b.draft || typeof b.draft !== "object") return json({ error: "Missing selections." }, 400);
      const { config } = await getConfig();
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
    } else {
      return json({ error: "Unknown action." }, 400);
    }

    const result = await mutateQuote(id, (q) => {
      if (me.role === "client" && q.clientId !== me.id) return new Error("Quotation not found.");
      return applyAction(q, action, me);
    });
    if (result === null) return json({ error: "Quotation not found." }, 404);
    if (result instanceof Error) return json({ error: result.message }, 409);
    return json({ quote: await view(result, me) });
  } catch (err) {
    return portalError(err);
  }
}
