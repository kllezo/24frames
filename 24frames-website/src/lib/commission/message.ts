/* WhatsApp-ready commission message. Built from the same quote object as the
   live ledger and the PDF, so every figure matches. WhatsApp formatting:
   *bold*, _italic_. Kept concise: one line per event, one per service. */

import { formatDateLong, formatINR, formatTimeRange, groupIndian, plural } from "./format";
import { coupleNames, eventDisplayName, weddingDateLabel } from "./model";
import type { CommissionDraft, CommissionQuote, StudioConfig } from "./types";

export function buildWhatsAppMessage(
  draft: CommissionDraft,
  quote: CommissionQuote,
  config: StudioConfig,
  reference: string | null,
): string {
  const names = coupleNames(draft.couple);
  const date = weddingDateLabel(draft.couple, formatDateLong);
  const L: string[] = [];

  L.push(`*24 FRAMES · WEDDING COMMISSION*`);
  L.push(`_${names}_`);
  if (reference) L.push(`Ref. ${reference}`);
  L.push("");
  if (date || draft.couple.city) L.push([date, draft.couple.city].filter(Boolean).join(" · "));
  L.push(`${plural(draft.events.length, "event")} · ${plural(quote.totalProfessionals, "professional")}`);
  L.push("");

  draft.events.forEach((event, i) => {
    const priced = quote.events.find((e) => e.eventId === event.id);
    const when = [event.date ? formatDateLong(event.date) : "", formatTimeRange(event.startTime, event.endTime)]
      .filter(Boolean)
      .join(", ");
    L.push(`*${i + 1}. ${eventDisplayName(event, config)}*`);
    const meta = [when, event.venue, event.guestCount ? `${groupIndian(event.guestCount)} guests` : ""].filter(Boolean).join(" · ");
    if (meta) L.push(meta);
    if (!priced || priced.lines.length === 0) {
      L.push("— No creative team selected");
    } else {
      for (const line of priced.lines) {
        L.push(`• ${line.serviceName} × ${line.quantity} — ${formatINR(line.lineTotal)}`);
      }
      L.push(`Event subtotal: ${formatINR(priced.subtotal)}`);
    }
    L.push("");
  });

  const pp = quote.postProduction;
  L.push(`*Post-production*`);
  L.push(
    pp.tierLabel
      ? `${pp.priorityName} — ${pp.tierLabel}${pp.multiplier !== null ? ` (${pp.multiplier}×)` : ""}`
      : "Delivery timeline not yet chosen",
  );
  L.push("");
  L.push(`Creative production: ${formatINR(quote.productionSubtotal)}`);
  L.push(`Post-production: ${formatINR(pp.finalFee)}${pp.overridden ? " (studio adjusted)" : ""}`);
  for (const c of quote.charges) L.push(`${c.label}: ${formatINR(c.amount)}`);
  if (quote.tax) L.push(`${quote.tax.label} (${quote.tax.ratePercent}%): ${formatINR(quote.tax.amount)}`);
  L.push(`*Estimated total: ${formatINR(quote.grandTotal)}*`);
  if (quote.illustrative) L.push(`_Illustrative pricing — to be confirmed by the studio._`);
  L.push("");
  L.push(config.proposal.closingMessage);
  L.push(`— ${config.studio.name} · ${config.studio.phoneDisplay}`);

  return L.join("\n");
}

/** wa.me only accepts digits. Indian 10-digit numbers get the 91 prefix. */
export function toWhatsAppDigits(phone: string): string | null {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `91${digits}`;
  if (digits.length >= 11 && digits.length <= 15) return digits.replace(/^0+/, "");
  return null;
}

export function whatsAppLink(phoneDigits: string | null, message: string): string {
  const text = encodeURIComponent(message);
  return phoneDigits ? `https://wa.me/${phoneDigits}?text=${text}` : `https://wa.me/?text=${text}`;
}
