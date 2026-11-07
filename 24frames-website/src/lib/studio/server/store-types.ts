/* Contract every studio storage adapter implements. The app only talks to
   ./repository.ts, which picks an adapter at runtime. */

import type {
  CommissionDraft,
  CommissionQuote,
  CommissionRecord,
  CommissionSummaryRow,
  ShareActivity,
  StudioConfig,
} from "@/lib/commission/types";

export class StorageUnavailableError extends Error {}

export interface StudioStore {
  getConfig(): Promise<{ config: StudioConfig; stored: boolean }>;
  saveConfig(next: StudioConfig): Promise<StudioConfig>;
  resetConfig(): Promise<StudioConfig>;
  createCommission(input: {
    draft: CommissionDraft;
    quote: CommissionQuote;
    config: StudioConfig;
    consultant: string;
  }): Promise<CommissionRecord>;
  getCommission(idOrReference: string): Promise<CommissionRecord | null>;
  listCommissions(search?: string): Promise<CommissionSummaryRow[]>;
  logActivity(entry: Omit<ShareActivity, "id" | "at">): Promise<ShareActivity | null>;
  saveMedia(name: string, contentType: string, bytes: Uint8Array): Promise<void>;
  getMedia(name: string): Promise<{ contentType: string; bytes: Uint8Array } | null>;
}

const REF_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/** "24F-2611-K7QM" — prefix, year+month, 4 unambiguous characters. */
export function makeReference(prefix: string, random: Uint8Array): string {
  const now = new Date();
  const yymm = `${String(now.getFullYear()).slice(2)}${String(now.getMonth() + 1).padStart(2, "0")}`;
  const code = Array.from(random.slice(0, 4), (b) => REF_ALPHABET[b % REF_ALPHABET.length]).join("");
  return `${prefix || "24F"}-${yymm}-${code}`;
}
