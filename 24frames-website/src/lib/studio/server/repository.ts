/* ============================================================
   Studio repository — server only.
   Picks the storage adapter at runtime:
     · DATABASE_URL (or POSTGRES_URL) set → Postgres (Supabase or any host)
     · otherwise                           → local JSON file store
   Nothing here depends on the site's domain, so the app and its
   data move freely between Vercel URLs and a custom domain.
   ============================================================ */

import * as fileStore from "./file-store";
import { databaseUrl, pgStore } from "./pg-store";
import type { StudioStore } from "./store-types";

export { StorageUnavailableError } from "./store-types";

const store = (): StudioStore => (databaseUrl() ? pgStore : fileStore);

export const storageKind = () => (databaseUrl() ? "postgres" : "file");

export const getConfig: StudioStore["getConfig"] = () => store().getConfig();
export const saveConfig: StudioStore["saveConfig"] = (next) => store().saveConfig(next);
export const resetConfig: StudioStore["resetConfig"] = () => store().resetConfig();
export const createCommission: StudioStore["createCommission"] = (input) => store().createCommission(input);
export const getCommission: StudioStore["getCommission"] = (id) => store().getCommission(id);
export const listCommissions: StudioStore["listCommissions"] = (search) => store().listCommissions(search);
export const logActivity: StudioStore["logActivity"] = (entry) => store().logActivity(entry);
export const saveMedia: StudioStore["saveMedia"] = (name, type, bytes) => store().saveMedia(name, type, bytes);
export const getMedia: StudioStore["getMedia"] = (name) => store().getMedia(name);
