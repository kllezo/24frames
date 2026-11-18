import { getDoc, putDoc } from "./store";
import { DEFAULT_SETTINGS, type SalesSettings } from "./types";

/* Targets and commission — one settings document. */
export async function getSettings(): Promise<SalesSettings> {
  const s = await getDoc<SalesSettings & { id: string }>("settings", "sales");
  return { ...DEFAULT_SETTINGS, ...(s ?? {}) };
}

export async function saveSettings(next: SalesSettings): Promise<SalesSettings> {
  await putDoc("settings", { ...next, id: "sales" });
  return next;
}
