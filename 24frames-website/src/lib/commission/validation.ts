/* Input validation shared by the client (inline hints) and the server
   (authoritative checks before anything is stored). Hand-rolled to avoid a
   new dependency; every check is explicit. */

import type { CommissionDraft, StudioConfig, BandTable } from "./types";

const MAX_TEXT = 2000;
const MAX_SHORT = 160;

export interface ValidationIssue {
  path: string;
  message: string;
}

const isStr = (v: unknown): v is string => typeof v === "string";
const isNum = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);

export const PHONE_RE = /^\+?[0-9 ()-]{7,20}$/;
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^([01]?\d|2[0-3]):[0-5]\d$/;

/** Earliest acceptable celebration date. One day of grace absorbs the
    difference between the server's UTC clock and the studio's local day. */
function earliestDate(): string {
  return new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
}

export function coupleHints(draft: CommissionDraft): Record<string, string> {
  const c = draft.couple;
  const hints: Record<string, string> = {};
  if (c.phone && !PHONE_RE.test(c.phone.trim())) hints.phone = "Check the number — digits, spaces and + only.";
  if (c.email && !EMAIL_RE.test(c.email.trim())) hints.email = "This doesn't look like an email address yet.";
  return hints;
}

/** Authoritative structural validation before a commission is stored. */
export function validateDraftForSubmit(draft: unknown, config: StudioConfig): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const d = draft as CommissionDraft;
  if (!d || typeof d !== "object") return [{ path: "", message: "Missing commission." }];
  if (d.schemaVersion !== 1) issues.push({ path: "schemaVersion", message: "Unsupported commission format." });

  const c = d.couple;
  if (!c || typeof c !== "object") {
    issues.push({ path: "couple", message: "Missing couple details." });
  } else {
    const names = [c.brideName, c.groomName].filter((n) => isStr(n) && n.trim());
    if (names.length === 0) issues.push({ path: "couple.names", message: "Add at least one name for the couple." });
    for (const key of ["brideName", "groomName", "phone", "email", "city", "approximateDate"] as const) {
      if (!isStr(c[key]) || c[key].length > MAX_SHORT) issues.push({ path: `couple.${key}`, message: "Invalid value." });
    }
    if (!isStr(c.notes) || c.notes.length > MAX_TEXT) issues.push({ path: "couple.notes", message: "Notes are too long." });
    if (c.phone && !PHONE_RE.test(c.phone.trim())) issues.push({ path: "couple.phone", message: "Invalid phone number." });
    if (c.email && !EMAIL_RE.test(c.email.trim())) issues.push({ path: "couple.email", message: "Invalid email address." });
    if (c.weddingDate && !DATE_RE.test(c.weddingDate)) issues.push({ path: "couple.weddingDate", message: "Invalid date." });
    else if (c.weddingDate && c.weddingDate < earliestDate()) {
      issues.push({ path: "couple.weddingDate", message: "The wedding date has already passed." });
    }
    if (!["whatsapp", "call", "email"].includes(c.preferredContact)) {
      issues.push({ path: "couple.preferredContact", message: "Invalid contact preference." });
    }
  }

  if (!Array.isArray(d.events) || d.events.length === 0) {
    issues.push({ path: "events", message: "Add at least one event." });
  } else if (d.events.length > 40) {
    issues.push({ path: "events", message: "Too many events." });
  } else {
    d.events.forEach((e, i) => {
      if (!isStr(e.id) || !e.id) issues.push({ path: `events.${i}.id`, message: "Invalid event." });
      for (const key of ["name", "customType", "venue", "location"] as const) {
        if (!isStr(e[key]) || e[key].length > MAX_SHORT) issues.push({ path: `events.${i}.${key}`, message: "Invalid value." });
      }
      for (const key of ["specialRequirements", "notes"] as const) {
        if (!isStr(e[key]) || e[key].length > MAX_TEXT) issues.push({ path: `events.${i}.${key}`, message: "Text too long." });
      }
      if (e.date && !DATE_RE.test(e.date)) issues.push({ path: `events.${i}.date`, message: "Invalid date." });
      else if (e.date && e.date < earliestDate()) {
        issues.push({ path: `events.${i}.date`, message: `${e.name || "An event"} is dated in the past.` });
      }
      if (e.startTime && !TIME_RE.test(e.startTime)) issues.push({ path: `events.${i}.startTime`, message: "Invalid time." });
      if (e.endTime && !TIME_RE.test(e.endTime)) issues.push({ path: `events.${i}.endTime`, message: "Invalid time." });
      if (e.guestCount !== null && (!isNum(e.guestCount) || e.guestCount < 0 || e.guestCount > 100000)) {
        issues.push({ path: `events.${i}.guestCount`, message: "Invalid guest count." });
      }
    });
  }

  const serviceById = new Map(config.services.map((s) => [s.id, s]));
  const eventIds = new Set((d.events ?? []).map((e) => e.id));
  if (!Array.isArray(d.assignments)) {
    issues.push({ path: "assignments", message: "Invalid creative team." });
  } else {
    const seen = new Set<string>();
    d.assignments.forEach((a, i) => {
      const s = serviceById.get(a.serviceId);
      if (!s) issues.push({ path: `assignments.${i}`, message: "Unknown service." });
      if (!eventIds.has(a.eventId)) issues.push({ path: `assignments.${i}`, message: "Assignment refers to a missing event." });
      const key = `${a.eventId}:${a.serviceId}`;
      if (seen.has(key)) issues.push({ path: `assignments.${i}`, message: "Duplicate assignment." });
      seen.add(key);
      if (!isNum(a.quantity) || !Number.isInteger(a.quantity) || a.quantity < 0) {
        issues.push({ path: `assignments.${i}.quantity`, message: "Invalid quantity." });
      } else if (a.quantity > 99) {
        issues.push({ path: `assignments.${i}.quantity`, message: `${s?.name ?? "Service"}: at most 99 per event.` });
      }
      if (a.unitPriceOverride !== null && (!isNum(a.unitPriceOverride) || a.unitPriceOverride < 0)) {
        issues.push({ path: `assignments.${i}.unitPriceOverride`, message: "Invalid price override." });
      }
      if (a.unitPriceOverride !== null && !(isStr(a.overrideReason) && a.overrideReason.trim())) {
        issues.push({ path: `assignments.${i}.overrideReason`, message: "A price override needs a reason." });
      }
    });
    if (!d.assignments.some((a) => a.quantity > 0)) {
      issues.push({ path: "assignments", message: "Select at least one creative professional." });
    }
  }

  if (d.deliveryTierId !== null && !config.deliveryTiers.some((t) => t.id === d.deliveryTierId && t.available)) {
    issues.push({ path: "deliveryTierId", message: "The chosen delivery timeline is no longer available." });
  }
  if (!d.deliveryTierId) issues.push({ path: "deliveryTierId", message: "Choose a delivery timeline." });

  const o = d.postProductionOverride;
  if (o !== null && o !== undefined) {
    if (!isNum(o.amount) || o.amount < 0) issues.push({ path: "postProductionOverride", message: "Invalid override amount." });
    if (!isStr(o.reason) || !o.reason.trim()) issues.push({ path: "postProductionOverride", message: "An override needs a reason." });
  }
  if (!Array.isArray(d.appliedChargeIds)) issues.push({ path: "appliedChargeIds", message: "Invalid charges." });

  return issues;
}

function validateBandTable(t: BandTable, path: string, issues: ValidationIssue[]) {
  if (!t || !Array.isArray(t.bands) || t.bands.length === 0) {
    issues.push({ path, message: "At least one budget band is required." });
    return;
  }
  const thresholds = new Set<number>();
  t.bands.forEach((b, i) => {
    if (!isNum(b.threshold) || b.threshold <= 0) issues.push({ path: `${path}.bands.${i}`, message: "Threshold must be positive." });
    if (!isNum(b.fee) || b.fee < 0) issues.push({ path: `${path}.bands.${i}`, message: "Fee cannot be negative." });
    if (thresholds.has(b.threshold)) issues.push({ path: `${path}.bands.${i}`, message: "Duplicate threshold." });
    thresholds.add(b.threshold);
  });
  if (!["step", "linear"].includes(t.interpolation)) issues.push({ path, message: "Invalid interpolation." });
  if (!["first_band_fee", "proportional"].includes(t.belowFirstBand)) issues.push({ path, message: "Invalid lower-band rule." });
  if (t.minFee !== null && (!isNum(t.minFee) || t.minFee < 0)) issues.push({ path, message: "Invalid minimum fee." });
  if (t.maxFee !== null && (!isNum(t.maxFee) || t.maxFee < 0)) issues.push({ path, message: "Invalid maximum fee." });
  if (isNum(t.minFee) && isNum(t.maxFee) && t.minFee > t.maxFee) issues.push({ path, message: "Minimum fee exceeds maximum." });
}

export function validateConfig(input: unknown): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const c = input as StudioConfig;
  if (!c || typeof c !== "object") return [{ path: "", message: "Missing configuration." }];

  if (!Array.isArray(c.services) || c.services.length === 0) {
    issues.push({ path: "services", message: "At least one service is required." });
  } else {
    const ids = new Set<string>();
    c.services.forEach((s, i) => {
      const p = `services.${i}`;
      if (!isStr(s.id) || !/^[a-z0-9-]{2,60}$/.test(s.id)) issues.push({ path: p, message: "Service id must be lowercase letters, numbers and dashes." });
      if (ids.has(s.id)) issues.push({ path: p, message: "Duplicate service id." });
      ids.add(s.id);
      if (!isStr(s.name) || !s.name.trim()) issues.push({ path: p, message: "Service name is required." });
      if (!isNum(s.price) || s.price < 0) issues.push({ path: p, message: `${s.name || "Service"}: price must be zero or more.` });
      if (!Number.isInteger(s.minQuantity) || !Number.isInteger(s.maxQuantity) || s.minQuantity < 0 || s.maxQuantity < 1 || s.minQuantity > s.maxQuantity) {
        issues.push({ path: p, message: `${s.name || "Service"}: check the minimum and maximum crew quantity.` });
      }
      if (!["photo", "video", "none"].includes(s.postProductionGroup)) issues.push({ path: p, message: "Invalid post-production group." });
      if (!Array.isArray(s.captures) || !Array.isArray(s.deliverables) || !Array.isArray(s.suitableFor)) {
        issues.push({ path: p, message: "Invalid lists." });
      }
    });
  }

  if (!Array.isArray(c.deliveryTiers) || c.deliveryTiers.length === 0) {
    issues.push({ path: "deliveryTiers", message: "At least one delivery tier is required." });
  } else {
    const ids = new Set<string>();
    c.deliveryTiers.forEach((t, i) => {
      if (!isStr(t.id) || !t.id || ids.has(t.id)) issues.push({ path: `deliveryTiers.${i}`, message: "Tier ids must be unique." });
      ids.add(t.id);
      if (!isNum(t.days) || t.days <= 0) issues.push({ path: `deliveryTiers.${i}`, message: `${t.label}: days must be positive.` });
      if (!isNum(t.multiplier) || t.multiplier < 0 || t.multiplier > 10) issues.push({ path: `deliveryTiers.${i}`, message: `${t.label}: multiplier must be between 0 and 10.` });
    });
    if (c.defaultDeliveryTierId !== null && !c.deliveryTiers.some((t) => t.id === c.defaultDeliveryTierId)) {
      issues.push({ path: "defaultDeliveryTierId", message: "Default tier does not exist." });
    }
  }

  if (!c.postProduction || !["combined", "split"].includes(c.postProduction.mode)) {
    issues.push({ path: "postProduction", message: "Invalid post-production configuration." });
  } else {
    validateBandTable(c.postProduction.combined, "postProduction.combined", issues);
    validateBandTable(c.postProduction.photo, "postProduction.photo", issues);
    validateBandTable(c.postProduction.video, "postProduction.video", issues);
    if (!isNum(c.postProduction.roundTo) || c.postProduction.roundTo < 0) issues.push({ path: "postProduction.roundTo", message: "Invalid rounding." });
  }

  if (!c.tax || !isNum(c.tax.ratePercent) || c.tax.ratePercent < 0 || c.tax.ratePercent > 100) {
    issues.push({ path: "tax", message: "Tax rate must be between 0 and 100." });
  }
  if (!Array.isArray(c.charges)) issues.push({ path: "charges", message: "Invalid charges." });
  else c.charges.forEach((ch, i) => {
    if (!isNum(ch.amount) || ch.amount < 0) issues.push({ path: `charges.${i}`, message: `${ch.label}: amount must be zero or more.` });
  });

  if (!c.studio || !/^\d{8,15}$/.test(c.studio.whatsappNumber ?? "")) {
    issues.push({ path: "studio.whatsappNumber", message: "WhatsApp number must be digits only, including country code (e.g. 919014433074)." });
  }
  if (!c.proposal || !isNum(c.proposal.validityDays) || c.proposal.validityDays < 1) {
    issues.push({ path: "proposal.validityDays", message: "Proposal validity must be at least one day." });
  }
  if (!Array.isArray(c.eventPresets)) issues.push({ path: "eventPresets", message: "Invalid event presets." });

  return issues;
}
