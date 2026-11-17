/* Custom rate cards. A client on a custom rate card sees — everywhere, on
   every visit and every new quotation — a studio configuration whose
   prices are already adjusted. They never receive the normal rates, so
   reopening or redoing a proposal can't reveal them. */

import type { StudioConfig } from "@/lib/commission/types";
import type { PortalAccount } from "./types";

export const MIN_FACTOR = 0.5;
export const MAX_FACTOR = 3;

export const cleanFactor = (f: unknown): number | null => {
  const n = typeof f === "number" ? f : Number(f);
  if (!Number.isFinite(n)) return null;
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
  };
}

export const configFor = (config: StudioConfig, account: Pick<PortalAccount, "priceFactor"> | null | undefined) =>
  scaleConfig(config, account?.priceFactor ?? null);
