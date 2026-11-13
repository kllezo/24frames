/* Server-side handling of client drafts: normalise against the live
   studio configuration, strip anything only the studio may set (price
   overrides, studio charges), and re-price with the single engine. */

import { normaliseDraft } from "@/lib/commission/model";
import { quoteCommission } from "@/lib/commission/pricing";
import { cleanPlanning } from "@/lib/commission/planning";
import type { CommissionDraft, StudioConfig } from "@/lib/commission/types";

export function prepareClientDraft(input: CommissionDraft, config: StudioConfig) {
  const normalised = normaliseDraft(input, config);
  const draft: CommissionDraft = {
    ...normalised,
    assignments: normalised.assignments.map((a) => ({ ...a, unitPriceOverride: null, overrideReason: "" })),
    postProductionOverride: null,
    appliedChargeIds: [],
    planning: cleanPlanning(normalised.planning),
    // Keep the client's own timestamp: the browser compares it with its local
    // copy to decide which is newer (e.g. edits made on another device).
    updatedAt: typeof input.updatedAt === "string" ? input.updatedAt.slice(0, 40) : new Date().toISOString(),
  };
  return { draft, quote: quoteCommission(draft, config) };
}
