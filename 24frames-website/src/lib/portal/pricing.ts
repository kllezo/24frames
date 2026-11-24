/* Custom rate cards. A client on a custom rate card sees — everywhere, on
   every visit and every new quotation — a studio configuration whose
   prices are already adjusted. They never receive the normal rates, so
   reopening or redoing a proposal can't reveal them. */

import type { StudioConfig } from "@/lib/commission/types";
import type { PortalAccount } from "./types";

export const MIN_FACTOR = 0.5;
export const MAX_FACTOR = 3;

export const cleanFactor = (f: unknown): number | null => {
  /* No value means the normal rates — Number(null) is 0, which must not be read as a 50% card. */
  if (f === null || f === undefined || f === "") return null;
  const n = typeof f === "number" ? f : Number(f);
  if (!Number.isFinite(n) || n <= 0) return null;
  if (Math.abs(n - 1) < 0.0001) return null;
  return Math.round(Math.min(Math.max(n, MIN_FACTOR), MAX_FACTOR) * 1000) / 1000;
};

/** "+20%" / "−5%" for a factor. */
export const factorLabel = (f: number | null | undefined) => {
  if (!f || Math.abs(f - 1) < 0.0001) return "Standard rates";
  const pct = Math.round((f - 1) * 1000) / 10;
  return `${pct > 0 ? "+" : "−"}${Math.abs(pct)}% custom rates`;
};

const round100 = (n: number) => Math.round(n / 100) * 100;

/** The configuration with every rupee figure scaled by `factor`. */
export function scaleConfig(config: StudioConfig, factor: number | null | undefined): StudioConfig {
  const f = cleanFactor(factor);
  if (!f) return config;
  const bands = (t: StudioConfig["postProduction"]["combined"]) => ({
    ...t,
    bands: t.bands.map((b) => ({ ...b, fee: round100(b.fee * f) })),
    minFee: t.minFee === null ? null : round100(t.minFee * f),
    maxFee: t.maxFee === null ? null : round100(t.maxFee * f),
  });
  return {
    ...config,
    services: config.services.map((s) => ({ ...s, price: round100(s.price * f) })),
    postProduction: {
      ...config.postProduction,
      combined: bands(config.postProduction.combined),
      photo: bands(config.postProduction.photo),
      video: bands(config.postProduction.video),
    },
    charges: config.charges.map((c) => (c.kind === "fixed" ? { ...c, amount: round100(c.amount * f) } : c)),
    deliveryTiers: config.deliveryTiers.map((t) => (typeof t.fee === "number" ? { ...t, fee: round100(t.fee * f) } : t)),
  };
}

/** Keep only real services and sensible rupee amounts. */
export function cleanOverrides(input: unknown, config: StudioConfig): Record<string, number> | null {
  if (!input || typeof input !== "object") return null;
  const known = new Set(config.services.map((s) => s.id));
  const out: Record<string, number> = {};
  for (const [id, v] of Object.entries(input as Record<string, unknown>)) {
    const n = typeof v === "number" ? v : Number(v);
    if (!known.has(id) || !Number.isFinite(n) || n < 0 || n > 100_000_000) continue;
    out[id] = Math.round(n);
  }
  return Object.keys(out).length ? out : null;
}

/** The configuration with exact per-service prices put in place. */
export function applyOverrides(config: StudioConfig, overrides: Record<string, number> | null | undefined): StudioConfig {
  if (!overrides || !Object.keys(overrides).length) return config;
  return {
    ...config,
    services: config.services.map((s) => (typeof overrides[s.id] === "number" ? { ...s, price: overrides[s.id] } : s)),
  };
}

/** "Exact prices · 3 services" or "+20% custom rates". */
export const rateLabel = (r: { factor?: number | null; prices?: Record<string, number> | null }) => {
  const n = r.prices ? Object.keys(r.prices).length : 0;
  if (n) return `Exact prices · ${n} service${n === 1 ? "" : "s"}${r.factor && Math.abs(r.factor - 1) > 0.0001 ? ` · ${factorLabel(r.factor).replace(" custom rates", "")} on the rest` : ""}`;
  return factorLabel(r.factor);
};

export const configFor = (config: StudioConfig, account: Pick<PortalAccount, "priceFactor" | "priceOverrides"> | null | undefined) =>
  applyOverrides(scaleConfig(config, account?.priceFactor ?? null), account?.priceOverrides ?? null);
