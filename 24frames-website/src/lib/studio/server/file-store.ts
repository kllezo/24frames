/* ============================================================
   File store — local development / self-hosted fallback.
   Used when no DATABASE_URL is configured.
   ------------------------------------------------------------
   Normalised tables persisted as one JSON document on disk
   (STUDIO_DATA_DIR, default ./.studio-data, file mode 0600):

     config        → current StudioConfig (admin-managed)
     couples       → one row per couple
     commissions   → one row per submitted commission (FK couple)
     events        → one row per celebration event (FK commission)
     assignments   → one row per event × service (FK commission, event)
     quotes        → priced snapshot + config snapshot per commission
     activity      → sharing / PDF / WhatsApp log (FK commission)

   INTEGRATION POINT: to deploy on a serverless host, implement
   the same exported functions against Postgres (or similar).
   The rest of the app only talks to these functions.
   ============================================================ */

import { promises as fs } from "node:fs";
import path from "node:path";
import { randomBytes, randomUUID } from "node:crypto";
import { DEFAULT_STUDIO_CONFIG, reviseConfig } from "@/lib/commission/defaults";
import { coupleNames } from "@/lib/commission/model";
import { StorageUnavailableError } from "./store-types";
import type {
  CelebrationEvent,
  CommissionDraft,
  CommissionQuote,
  CommissionRecord,
  CommissionSummaryRow,
  CoupleDetails,
  ShareActivity,
  StudioConfig,
} from "@/lib/commission/types";

interface CoupleRow extends CoupleDetails {
  id: string;
  createdAt: string;
}
interface CommissionRow {
  id: string;
  reference: string;
  coupleId: string;
  status: "submitted";
  consultant: string;
  deliveryTierId: string | null;
  appliedChargeIds: string[];
  postProductionOverride: CommissionDraft["postProductionOverride"];
  grandTotal: number;
  configVersion: number;
  draftId: string;
  duplicatedFrom: string | null;
  draftCreatedAt: string;
  createdAt: string;
}
interface EventRow extends CelebrationEvent {
  commissionId: string;
  sortOrder: number;
}
interface AssignmentRow {
  id: string;
  commissionId: string;
  eventId: string;
  serviceId: string;
  quantity: number;
  unitPriceOverride: number | null;
  overrideReason: string;
  /** Priced at submission. */
  unitPrice: number;
  lineTotal: number;
}
interface QuoteRow {
  commissionId: string;
  quote: CommissionQuote;
  configSnapshot: StudioConfig;
}

interface Database {
  schema: 1;
  config: StudioConfig | null;
  couples: CoupleRow[];
  commissions: CommissionRow[];
  events: EventRow[];
  assignments: AssignmentRow[];
  quotes: QuoteRow[];
  activity: ShareActivity[];
}

const emptyDb = (): Database => ({
  schema: 1,
  config: null,
  couples: [],
  commissions: [],
  events: [],
  assignments: [],
  quotes: [],
  activity: [],
});


const dataDir = () => path.resolve(process.env.STUDIO_DATA_DIR || path.join(process.cwd(), ".studio-data"));
const dbFile = () => path.join(dataDir(), "studio-db.json");

let queue: Promise<unknown> = Promise.resolve();
/** Serialise all writes within this process (read-modify-write safety). */
function exclusive<T>(fn: () => Promise<T>): Promise<T> {
  const run = queue.then(fn, fn);
  queue = run.catch(() => undefined);
  return run;
}

async function load(): Promise<Database> {
  try {
    const raw = await fs.readFile(dbFile(), "utf8");
    return { ...emptyDb(), ...(JSON.parse(raw) as Database) };
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return emptyDb();
    throw new StorageUnavailableError(`Studio records could not be read: ${(err as Error).message}`);
  }
}

async function save(db: Database): Promise<void> {
  try {
    await fs.mkdir(dataDir(), { recursive: true, mode: 0o700 });
    const tmp = `${dbFile()}.${process.pid}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(db, null, 2), { mode: 0o600 });
    await fs.rename(tmp, dbFile());
  } catch (err) {
    throw new StorageUnavailableError(
      `Studio records could not be saved (${(err as NodeJS.ErrnoException).code ?? "error"}). ` +
        "Configure a writable STUDIO_DATA_DIR or a database adapter.",
    );
  }
}

/* ---------------- Configuration ---------------- */

export async function getConfig(): Promise<{ config: StudioConfig; stored: boolean }> {
  const db = await load();
  return db.config ? { config: reviseConfig(db.config), stored: true } : { config: DEFAULT_STUDIO_CONFIG, stored: false };
}

export function saveConfig(next: StudioConfig): Promise<StudioConfig> {
  return exclusive(async () => {
    const db = await load();
    const current = db.config ?? DEFAULT_STUDIO_CONFIG;
    const saved: StudioConfig = { ...next, version: current.version + 1, updatedAt: new Date().toISOString() };
    db.config = saved;
    await save(db);
    return saved;
  });
}

export function resetConfig(): Promise<StudioConfig> {
  return exclusive(async () => {
    const db = await load();
    const current = db.config ?? DEFAULT_STUDIO_CONFIG;
    const saved: StudioConfig = {
      ...DEFAULT_STUDIO_CONFIG,
      version: current.version + 1,
      updatedAt: new Date().toISOString(),
    };
    db.config = saved;
    await save(db);
    return saved;
  });
}

/* ---------------- Commissions ---------------- */

const REF_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
function makeReference(prefix: string, existing: Set<string>): string {
  const now = new Date();
  const yymm = `${String(now.getFullYear()).slice(2)}${String(now.getMonth() + 1).padStart(2, "0")}`;
  for (;;) {
    const bytes = randomBytes(4);
    const code = Array.from(bytes, (b) => REF_ALPHABET[b % REF_ALPHABET.length]).join("");
    const ref = `${prefix}-${yymm}-${code}`;
    if (!existing.has(ref)) return ref;
  }
}

export function createCommission(input: {
  draft: CommissionDraft;
  quote: CommissionQuote;
  config: StudioConfig;
  consultant: string;
}): Promise<CommissionRecord> {
  return exclusive(async () => {
    const db = await load();
    const now = new Date().toISOString();
    const commissionId = randomUUID();
    const coupleId = randomUUID();
    const { draft, quote, config } = input;
    const reference = makeReference(config.proposal.referencePrefix || "24F", new Set(db.commissions.map((c) => c.reference)));

    db.couples.push({ ...draft.couple, id: coupleId, createdAt: now });
    db.commissions.push({
      id: commissionId,
      reference,
      coupleId,
      status: "submitted",
      consultant: input.consultant,
      deliveryTierId: draft.deliveryTierId,
      appliedChargeIds: draft.appliedChargeIds,
      postProductionOverride: draft.postProductionOverride,
      grandTotal: quote.grandTotal,
      configVersion: config.version,
      draftId: draft.id,
      duplicatedFrom: draft.duplicatedFrom,
      draftCreatedAt: draft.createdAt,
      createdAt: now,
    });
    draft.events.forEach((e, i) => db.events.push({ ...e, commissionId, sortOrder: i }));
    const lineByAssignment = new Map(quote.lines.map((l) => [l.assignmentId, l]));
    for (const a of draft.assignments) {
      const line = lineByAssignment.get(a.id);
      if (!line) continue; // zero-quantity or orphaned rows are not stored
      db.assignments.push({
        id: a.id,
        commissionId,
        eventId: a.eventId,
        serviceId: a.serviceId,
        quantity: line.quantity,
        unitPriceOverride: a.unitPriceOverride,
        overrideReason: a.overrideReason,
        unitPrice: line.unitPrice,
        lineTotal: line.lineTotal,
      });
    }
    db.quotes.push({ commissionId, quote, configSnapshot: config });
    await save(db);
    return assemble(db, commissionId)!;
  });
}

function assemble(db: Database, id: string): CommissionRecord | null {
  const row = db.commissions.find((c) => c.id === id || c.reference === id);
  if (!row) return null;
  const couple = db.couples.find((c) => c.id === row.coupleId);
  const q = db.quotes.find((x) => x.commissionId === row.id);
  if (!couple || !q) return null;
  const events = db.events
    .filter((e) => e.commissionId === row.id)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .map(({ commissionId: _c, sortOrder: _s, ...e }) => e);
  const assignments = db.assignments
    .filter((a) => a.commissionId === row.id)
    .map((a) => ({
      id: a.id,
      eventId: a.eventId,
      serviceId: a.serviceId,
      quantity: a.quantity,
      unitPriceOverride: a.unitPriceOverride,
      overrideReason: a.overrideReason,
    }));
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id: _id, createdAt: _ca, ...coupleDetails } = couple;
  const draft: CommissionDraft = {
    id: row.draftId,
    schemaVersion: 1,
    couple: coupleDetails,
    events,
    assignments,
    deliveryTierId: row.deliveryTierId,
    appliedChargeIds: row.appliedChargeIds,
    postProductionOverride: row.postProductionOverride,
    createdAt: row.draftCreatedAt,
    updatedAt: row.createdAt,
    duplicatedFrom: row.duplicatedFrom,
  };
  return {
    id: row.id,
    reference: row.reference,
    status: row.status,
    consultant: row.consultant,
    createdAt: row.createdAt,
    configVersion: row.configVersion,
    draft,
    quote: q.quote,
    configSnapshot: q.configSnapshot,
    activity: db.activity.filter((a) => a.commissionId === row.id).sort((a, b) => a.at.localeCompare(b.at)),
  };
}

export async function getCommission(idOrReference: string): Promise<CommissionRecord | null> {
  return assemble(await load(), idOrReference);
}

export async function listCommissions(search = ""): Promise<CommissionSummaryRow[]> {
  const db = await load();
  const needle = search.trim().toLowerCase();
  const rows: CommissionSummaryRow[] = [];
  for (const c of db.commissions) {
    const couple = db.couples.find((x) => x.id === c.coupleId);
    if (!couple) continue;
    const names = coupleNames(couple, "Unnamed couple");
    if (
      needle &&
      !`${names} ${c.reference} ${couple.phone} ${couple.email} ${couple.city}`.toLowerCase().includes(needle)
    ) {
      continue;
    }
    const tier = db.quotes.find((q) => q.commissionId === c.id)?.quote.postProduction.tierLabel ?? null;
    rows.push({
      id: c.id,
      reference: c.reference,
      coupleNames: names,
      weddingDate: couple.weddingDate || couple.approximateDate,
      city: couple.city,
      eventCount: db.events.filter((e) => e.commissionId === c.id).length,
      grandTotal: c.grandTotal,
      deliveryLabel: tier,
      consultant: c.consultant,
      createdAt: c.createdAt,
    });
  }
  return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function logActivity(entry: Omit<ShareActivity, "id" | "at">): Promise<ShareActivity | null> {
  return exclusive(async () => {
    const db = await load();
    if (!db.commissions.some((c) => c.id === entry.commissionId)) return null;
    const row: ShareActivity = { ...entry, id: randomUUID(), at: new Date().toISOString() };
    db.activity.push(row);
    await save(db);
    return row;
  });
}

/* ---------------- Media ---------------- */

const mediaDir = () => path.join(dataDir(), "media");

export async function saveMedia(name: string, _contentType: string, bytes: Uint8Array): Promise<void> {
  try {
    await fs.mkdir(mediaDir(), { recursive: true, mode: 0o700 });
    await fs.writeFile(path.join(mediaDir(), name), bytes, { mode: 0o600 });
  } catch (err) {
    throw new StorageUnavailableError(`File could not be stored (${(err as NodeJS.ErrnoException).code ?? "error"}).`);
  }
}

export async function getMedia(name: string): Promise<{ contentType: string; bytes: Uint8Array } | null> {
  try {
    const data = await fs.readFile(path.join(mediaDir(), name));
    const contentType = name.endsWith(".pdf") ? "application/pdf" : name.endsWith(".png") ? "image/png" : "image/jpeg";
    return { contentType, bytes: new Uint8Array(data) };
  } catch {
    return null;
  }
}
