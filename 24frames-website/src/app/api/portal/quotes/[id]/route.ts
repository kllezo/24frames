import { getConfig } from "@/lib/studio/server/repository";
import { validateDraftForSubmit } from "@/lib/commission/validation";
import { getQuote, mutateQuote } from "@/lib/portal/store";
import { body, json, portalError, requireRole, sameOrigin } from "@/lib/portal/guard";
import { prepareClientDraft } from "@/lib/portal/drafts";
import { applyAction, type QuoteAction } from "@/lib/portal/workflow";
import { forClient, type PortalAccount, type PortalQuote } from "@/lib/portal/types";
import type { CommissionDraft } from "@/lib/commission/types";

type Ctx = { params: Promise<{ id: string }> };

const view = (q: PortalQuote, me: PortalAccount) => (me.role === "client" ? forClient(q) : q);

export async function GET(_request: Request, ctx: Ctx) {
  const me = await requireRole();
  if (me instanceof Response) return me;
  const { id } = await ctx.params;
  try {
    const q = await getQuote(id);
    if (!q || (me.role === "client" && q.clientId !== me.id)) return json({ error: "Quotation not found." }, 404);
    return json({ quote: view(q, me) });
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
    } else {
      return json({ error: "Unknown action." }, 400);
    }

    const result = await mutateQuote(id, (q) => {
      if (me.role === "client" && q.clientId !== me.id) return new Error("Quotation not found.");
      return applyAction(q, action, me);
    });
    if (result === null) return json({ error: "Quotation not found." }, 404);
    if (result instanceof Error) return json({ error: result.message }, 409);
    return json({ quote: view(result, me) });
  } catch (err) {
    return portalError(err);
  }
}
