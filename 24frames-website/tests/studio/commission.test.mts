/* Studio commission engine tests — run with `npm run test:studio`.
   Uses Node's built-in test runner and TypeScript type-stripping. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { DEFAULT_STUDIO_CONFIG as C } from "@/lib/commission/defaults";
import { quoteCommission, resolveBandFee } from "@/lib/commission/pricing";
import { createDraft, createEvent } from "@/lib/commission/model";
import { formatINR } from "@/lib/commission/format";
import { buildWhatsAppMessage, toWhatsAppDigits } from "@/lib/commission/message";
import { validateConfig, validateDraftForSubmit } from "@/lib/commission/validation";
import { guidanceFor } from "@/lib/commission/recommendations";
import { IDLE_TIMEOUT_MS, signSession, verifySession } from "@/lib/studio/session";
import type { CommissionDraft } from "@/lib/commission/types";

function briefExample(): CommissionDraft {
  const d = createDraft(C);
  d.couple.brideName = "Ananya";
  const eng = createEvent("engagement", C), wed = createEvent("wedding", C), rec = createEvent("reception", C);
  d.events = [eng, wed, rec];
  const A = (eventId: string, serviceId: string, quantity: number) => ({
    id: `${eventId}:${serviceId}`, eventId, serviceId, quantity, unitPriceOverride: null, overrideReason: "",
  });
  d.assignments = [
    A(wed.id, "traditional-photographer", 2),
    A(wed.id, "candid-photographer", 1),
    A(eng.id, "traditional-videographer", 1),
    A(wed.id, "creative-cinematography", 2),
    A(rec.id, "aerial-drone", 1),
  ];
  return d;
}

test("brief example: event-wise totals and production subtotal", () => {
  const q = quoteCommission(briefExample(), C);
  assert.equal(q.events[0].subtotal, 70_000);
  assert.equal(q.events[1].subtotal, 5_00_000);
  assert.equal(q.events[2].subtotal, 45_000);
  assert.equal(q.productionSubtotal, 6_15_000);
  assert.equal(q.totalProfessionals, 7);
});

test("post-production = band fee × delivery multiplier", () => {
  const d = briefExample();
  const fees: Record<string, number> = {};
  for (const t of C.deliveryTiers) {
    d.deliveryTierId = t.id;
    fees[t.id] = quoteCommission(d, C).postProduction.finalFee;
  }
  assert.deepEqual(fees, { "express-15": 14_000, "priority-30": 10_500, "standard-60": 7_000, "extended-90": 5_600, "archival-180": 4_200 });
});

test("non-linear band table: exact bands, interpolation, edges, clamps", () => {
  const T = C.postProduction.combined;
  const f = (s: number) => resolveBandFee(T, s, "combined").fee;
  assert.equal(f(1_00_000), 10_000);
  assert.equal(f(2_00_000), 15_000);
  assert.equal(f(3_00_000), 12_000); // fee falls as budget rises
  assert.equal(f(2_50_000), 13_500); // linear between bands
  assert.equal(f(50_000), 5_000); // proportional below the first band
  assert.equal(f(9_00_000), 7_000); // held above the last band
  assert.equal(f(0), 0);
  assert.equal(resolveBandFee({ ...T, interpolation: "step" }, 2_50_000, "combined").fee, 15_000);
  assert.equal(resolveBandFee({ ...T, maxFee: 12_000 }, 2_00_000, "combined").fee, 12_000);
  assert.equal(resolveBandFee({ ...T, minFee: 9_000 }, 6_00_000, "combined").fee, 9_000);
});

test("overrides, explicit charges and tax", () => {
  const d = briefExample();
  d.assignments[0].unitPriceOverride = 50_000;
  d.assignments[0].overrideReason = "Returning family";
  d.appliedChargeIds = ["outstation-travel"];
  const q = quoteCommission(d, { ...C, tax: { ...C.tax, enabled: true } });
  assert.equal(q.productionSubtotal, 5_95_000);
  assert.equal(q.charges[0].amount, 25_000);
  assert.equal(q.tax?.amount, Math.round((q.productionSubtotal + q.postProduction.finalFee + 25_000) * 0.18));
  d.postProductionOverride = { amount: 5_000, reason: "Goodwill" };
  assert.equal(quoteCommission(d, C).postProduction.finalFee, 5_000);
});

test("charges are never added unless applied", () => {
  assert.equal(quoteCommission(briefExample(), C).chargesTotal, 0);
});

test("removing an event's assignments never leaves orphans priced", () => {
  const d = briefExample();
  d.events = d.events.filter((e) => e.type !== "wedding");
  assert.equal(quoteCommission(d, C).productionSubtotal, 1_15_000);
});

test("Indian currency formatting", () => {
  assert.equal(formatINR(1_50_000), "₹1,50,000");
  assert.equal(formatINR(1_23_45_678), "₹1,23,45,678");
  assert.equal(formatINR(999), "₹999");
});

test("WhatsApp message carries the same totals", () => {
  const d = briefExample();
  const q = quoteCommission(d, C);
  const m = buildWhatsAppMessage(d, q, C, "24F-TEST");
  assert.match(m, /Estimated total: ₹6,22,000/);
  assert.match(m, /Creative production: ₹6,15,000/);
  assert.equal(toWhatsAppDigits("98765 43210"), "919876543210");
  assert.equal(toWhatsAppDigits("+44 20 7946 0958"), "442079460958");
});

test("validation", () => {
  assert.deepEqual(validateConfig(C), []);
  assert.deepEqual(validateDraftForSubmit(briefExample(), C), []);
  const empty = createDraft(C);
  const msgs = validateDraftForSubmit(empty, C).map((i) => i.message);
  assert.ok(msgs.includes("Add at least one event."));
  assert.ok(msgs.includes("Add at least one name for the couple."));
});

test("recommendations scale with guests and never mutate the draft", () => {
  const d = briefExample();
  d.events[1].guestCount = 1200;
  d.events[1].parallelActivities = true;
  const before = JSON.stringify(d);
  const g = guidanceFor(d, C).get(d.events[1].id)!;
  assert.equal(g.suggestions.find((s) => s.serviceId === "traditional-photographer")?.quantity, 5);
  assert.equal(JSON.stringify(d), before);
});

test("studio session: signature, idle timeout, tampering", async () => {
  const secret = "x".repeat(40);
  const now = Date.now();
  const token = await signSession({ v: 1, consultant: "Phani", iat: now, last: now }, secret);
  assert.equal((await verifySession(token, secret, now))?.consultant, "Phani");
  assert.equal(await verifySession(token, secret, now + IDLE_TIMEOUT_MS + 1), null);
  assert.equal(await verifySession(token, "y".repeat(40), now), null);
  const [body, sig] = token.split(".");
  assert.equal(await verifySession(`${body}x.${sig}`, secret, now), null);
});
