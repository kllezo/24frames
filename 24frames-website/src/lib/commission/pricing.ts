/* ============================================================
   24 FRAMES — Commission pricing engine
   ------------------------------------------------------------
   Pure, deterministic functions. No React, no I/O.
   The SAME function powers the live ledger, the review page,
   the PDF proposal, the WhatsApp message and the server-side
   verification on submit — so they can never disagree.

   Formula
     Creative production subtotal = Σ (unit price × quantity)
                                     over every event × service assignment
     Base post-production fee     = BandTable(subtotal)      (non-linear)
     Final post-production fee    = round(Base × tier multiplier)
                                     (or a recorded manual override)
     Charges                      = consultant-applied charges only
     Tax                          = rate × (production + post + charges), if enabled
     Grand total                  = production + post + charges + tax
   ============================================================ */

import { formatINR } from "./format";
import type {
  BandResolution,
  BandTable,
  CommissionDraft,
  CommissionQuote,
  PostProductionQuote,
  PricedCharge,
  PricedEvent,
  PricedLine,
  StudioConfig,
} from "./types";

const roundTo = (value: number, step: number) =>
  step > 0 ? Math.round(value / step) * step : Math.round(value);

const isFiniteNumber = (n: unknown): n is number => typeof n === "number" && Number.isFinite(n);

/**
 * Resolve a base fee from a non-linear band table.
 *
 * - Bands are sorted by threshold.
 * - "step":   use the fee of the highest band whose threshold ≤ subtotal.
 * - "linear": interpolate linearly between the two surrounding bands.
 * - Below the first threshold: either the first band's fee, or that fee
 *   scaled proportionally (subtotal / first threshold).
 * - Above the last threshold: the last band's fee is held.
 * - minFee / maxFee clamp the result when configured.
 * - A zero subtotal always yields a zero fee (nothing to post-produce).
 */
export function resolveBandFee(
  table: BandTable,
  subtotal: number,
  pool: BandResolution["pool"],
): BandResolution {
  const bands = [...table.bands]
    .filter((b) => isFiniteNumber(b.threshold) && isFiniteNumber(b.fee) && b.threshold > 0)
    .sort((a, b) => a.threshold - b.threshold);

  const base: BandResolution = {
    pool,
    subtotal,
    fee: 0,
    explanation: "",
    lowerBand: null,
    upperBand: null,
    clamped: null,
  };

  if (subtotal <= 0) {
    return { ...base, explanation: "No creative services selected yet." };
  }
  if (bands.length === 0) {
    return { ...base, explanation: "No post-production bands are configured." };
  }

  let fee: number;
  let explanation: string;
  const first = bands[0];
  const last = bands[bands.length - 1];

  if (subtotal < first.threshold) {
    if (table.belowFirstBand === "proportional") {
      fee = first.fee * (subtotal / first.threshold);
      explanation = `Below the ${formatINR(first.threshold)} band — scaled proportionally from ${formatINR(first.fee)}.`;
    } else {
      fee = first.fee;
      explanation = `Below the ${formatINR(first.threshold)} band — the first band fee applies.`;
    }
    base.upperBand = first;
  } else if (subtotal >= last.threshold) {
    fee = last.fee;
    explanation = `At or above the ${formatINR(last.threshold)} band.`;
    base.lowerBand = last;
  } else {
    const upperIndex = bands.findIndex((b) => b.threshold > subtotal);
    const lower = bands[upperIndex - 1];
    const upper = bands[upperIndex];
    base.lowerBand = lower;
    base.upperBand = upper;
    if (table.interpolation === "linear" && subtotal !== lower.threshold) {
      const t = (subtotal - lower.threshold) / (upper.threshold - lower.threshold);
      fee = lower.fee + (upper.fee - lower.fee) * t;
      explanation = `Between the ${formatINR(lower.threshold)} and ${formatINR(upper.threshold)} bands — interpolated.`;
    } else {
      fee = lower.fee;
      explanation =
        subtotal === lower.threshold
          ? `Exactly on the ${formatINR(lower.threshold)} band.`
          : `Within the ${formatINR(lower.threshold)} band.`;
    }
  }

  if (isFiniteNumber(table.minFee) && fee < table.minFee) {
    fee = table.minFee;
    base.clamped = "min";
    explanation += ` Raised to the minimum fee of ${formatINR(table.minFee)}.`;
  }
  if (isFiniteNumber(table.maxFee) && fee > table.maxFee) {
    fee = table.maxFee;
    base.clamped = "max";
    explanation += ` Capped at the maximum fee of ${formatINR(table.maxFee)}.`;
  }

  return { ...base, fee: Math.round(fee), explanation };
}

export function priceLines(draft: CommissionDraft, config: StudioConfig): PricedLine[] {
  const serviceById = new Map(config.services.map((s) => [s.id, s]));
  const eventIds = new Set(draft.events.map((e) => e.id));
  const lines: PricedLine[] = [];

  for (const a of draft.assignments) {
    const service = serviceById.get(a.serviceId);
    if (!service || !eventIds.has(a.eventId)) continue; // orphaned → ignored
    const quantity = Math.max(0, Math.floor(a.quantity || 0));
    if (quantity === 0) continue;
    const overridden = isFiniteNumber(a.unitPriceOverride) && a.unitPriceOverride >= 0;
    const unitPrice = overridden ? (a.unitPriceOverride as number) : service.price;
    lines.push({
      assignmentId: a.id,
      eventId: a.eventId,
      serviceId: service.id,
      serviceName: service.name,
      unitNoun: service.unitNoun,
      unitLabel: service.unitLabel,
      quantity,
      unitPrice,
      catalogueUnitPrice: service.price,
      overridden,
      overrideReason: overridden ? a.overrideReason : "",
      lineTotal: unitPrice * quantity,
      postProductionGroup: service.postProductionGroup,
    });
  }

  const order = new Map(config.services.map((s) => [s.id, s.order]));
  return lines.sort((x, y) => (order.get(x.serviceId) ?? 0) - (order.get(y.serviceId) ?? 0));
}

export function quotePostProduction(
  config: StudioConfig,
  subtotals: { production: number; photo: number; video: number; postEligible: number },
  draft: Pick<CommissionDraft, "deliveryTierId" | "postProductionOverride">,
): PostProductionQuote {
  const pp = config.postProduction;
  const resolutions: BandResolution[] =
    pp.mode === "split"
      ? [
          resolveBandFee(pp.photo, subtotals.photo, "photo"),
          resolveBandFee(pp.video, subtotals.video, "video"),
        ]
      : [resolveBandFee(pp.combined, subtotals.postEligible, "combined")];

  const baseFee = resolutions.reduce((sum, r) => sum + r.fee, 0);
  const tier = config.deliveryTiers.find((t) => t.id === draft.deliveryTierId && t.available) ?? null;
  const multiplier = tier ? tier.multiplier : null;
  const computedFee = tier ? roundTo(baseFee * tier.multiplier, pp.roundTo) : 0;

  const override = draft.postProductionOverride;
  const overridden = !!override && isFiniteNumber(override.amount) && override.amount >= 0;

  return {
    mode: pp.mode,
    resolutions,
    baseFee,
    tierId: tier?.id ?? null,
    tierLabel: tier?.label ?? null,
    priorityName: tier?.priorityName ?? null,
    multiplier,
    computedFee,
    finalFee: overridden ? Math.round(override!.amount) : computedFee,
    overridden,
    overrideReason: overridden ? override!.reason : "",
  };
}

export function quoteCommission(draft: CommissionDraft, config: StudioConfig): CommissionQuote {
  const lines = priceLines(draft, config);
  const issues: string[] = [];

  const events: PricedEvent[] = draft.events.map((event) => {
    const eventLines = lines.filter((l) => l.eventId === event.id);
    return {
      eventId: event.id,
      lines: eventLines,
      subtotal: eventLines.reduce((s, l) => s + l.lineTotal, 0),
      professionals: eventLines.reduce((s, l) => s + l.quantity, 0),
    };
  });

  const sumBy = (pred: (l: PricedLine) => boolean) =>
    lines.filter(pred).reduce((s, l) => s + l.lineTotal, 0);

  const productionSubtotal = sumBy(() => true);
  const photoSubtotal = sumBy((l) => l.postProductionGroup === "photo");
  const videoSubtotal = sumBy((l) => l.postProductionGroup === "video");
  const otherSubtotal = sumBy((l) => l.postProductionGroup === "none");

  // Combined mode: the band applies to the creative production subtotal of
  // services that require post-production (live stream excluded by config).
  const postEligible = photoSubtotal + videoSubtotal;

  const postProduction = quotePostProduction(
    config,
    { production: productionSubtotal, photo: photoSubtotal, video: videoSubtotal, postEligible },
    draft,
  );

  if (lines.length > 0 && !postProduction.tierId) {
    issues.push("Choose a delivery timeline to complete the post-production estimate.");
  }

  const chargeById = new Map(config.charges.map((c) => [c.id, c]));
  const charges: PricedCharge[] = [];
  for (const id of draft.appliedChargeIds) {
    const c = chargeById.get(id);
    if (!c || !c.available) continue;
    const amount =
      c.kind === "fixed" ? c.amount : roundTo((productionSubtotal * c.amount) / 100, config.postProduction.roundTo);
    charges.push({ id: c.id, label: c.label, description: c.description, amount });
  }
  const chargesTotal = charges.reduce((s, c) => s + c.amount, 0);

  const taxableAmount = productionSubtotal + postProduction.finalFee + chargesTotal;
  const tax =
    config.tax.enabled && config.tax.ratePercent > 0
      ? {
          label: config.tax.label,
          ratePercent: config.tax.ratePercent,
          amount: Math.round((taxableAmount * config.tax.ratePercent) / 100),
        }
      : null;

  return {
    events,
    lines,
    productionSubtotal,
    photoSubtotal,
    videoSubtotal,
    otherSubtotal,
    totalProfessionals: lines.reduce((s, l) => s + l.quantity, 0),
    postProduction,
    charges,
    chargesTotal,
    taxableAmount,
    tax,
    grandTotal: taxableAmount + (tax?.amount ?? 0),
    illustrative: config.pricingIsIllustrative,
    issues,
  };
}

/** Two quotes agree on every figure the couple sees. */
export function quotesMatch(a: CommissionQuote, b: CommissionQuote): boolean {
  return (
    a.productionSubtotal === b.productionSubtotal &&
    a.postProduction.finalFee === b.postProduction.finalFee &&
    a.chargesTotal === b.chargesTotal &&
    (a.tax?.amount ?? 0) === (b.tax?.amount ?? 0) &&
    a.grandTotal === b.grandTotal &&
    a.lines.length === b.lines.length
  );
}
