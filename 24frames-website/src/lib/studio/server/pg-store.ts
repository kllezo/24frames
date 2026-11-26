/* ============================================================
   Postgres store — production storage (Supabase or any Postgres).
   Configure with DATABASE_URL (Supabase: the "Transaction pooler"
   connection string, port 6543). POSTGRES_URL is accepted too, so
   the Supabase ↔ Vercel integration works without renaming.
   ============================================================ */

import postgres from "postgres";
import { randomBytes, randomUUID } from "node:crypto";
import { DEFAULT_STUDIO_CONFIG, reviseConfig } from "@/lib/commission/defaults";
import { coupleNames } from "@/lib/commission/model";
import type {
  CelebrationEvent,
  CommissionDraft,
  CommissionRecord,
  CommissionSummaryRow,
  CoupleDetails,
  PreferredContact,
  ShareActivity,
  StudioConfig,
} from "@/lib/commission/types";
import { STUDIO_SCHEMA_SQL } from "./schema.sql";
import { makeReference, StorageUnavailableError, type StudioStore } from "./store-types";

export const databaseUrl = () => process.env.DATABASE_URL || process.env.POSTGRES_URL || "";

type Sql = ReturnType<typeof postgres>;
let client: Sql | null = null;
let schemaChecked = false;
let ready: Promise<void> | null = null;
/** Calls currently running, and when the last one touched the database. */
let inFlight = 0;
let lastUsed = 0;

/* Hostinger pauses idle Node processes between visits. A paused process's
   sockets are usually cut by the time it wakes, and postgres.js would wait
   on them forever. Two defences:
   1. If the client has sat idle longer than STALE_AFTER_MS (by wall clock,
      which jumps across a pause), it is replaced before use, so a woken
      process starts on fresh connections instead of dead ones.
   2. Every call still has a deadline; on a timeout or a dropped connection
      the client is replaced (once per client, even when several parallel
      calls fail together) and the call is retried on the fresh one. */
const STALE_AFTER_MS = 15_000;
const QUERY_TIMEOUT_MS = 12_000;

function createClient(): Sql {
  const url = databaseUrl();
  const local = /@(localhost|127\.0\.0\.1)(:|\/)/.test(url);
  return postgres(url, {
    // Supabase's transaction pooler does not support prepared statements.
    prepare: false,
    // A handful of parallel queries per page (the team view runs six).
    max: 6,
    idle_timeout: 20,
    // Recycle connections regularly so none outlives a paused process.
    max_lifetime: 60 * 5,
    connect_timeout: 8,
    ssl: local ? false : "require",
    onnotice: () => undefined,
  });
}

function sql(): Sql {
  if (client && inFlight === 0 && Date.now() - lastUsed > STALE_AFTER_MS) replaceClient(client);
  if (!client) client = createClient();
  return client;
}

/** Retires `stale` if it is still the current client; a no-op otherwise, so
    parallel failures on one client trigger a single replacement. */
function replaceClient(stale: Sql) {
  if (client !== stale) return;
  client = null;
  ready = null;
  stale.end({ timeout: 0 }).catch(() => undefined);
}

class DbTimeoutError extends Error {
  code = "DB_TIMEOUT";
  constructor() {
    super("Database call timed out");
  }
}

const CONNECTION_CODES = new Set([
  "DB_TIMEOUT",
  "CONNECTION_CLOSED",
  "CONNECTION_ENDED",
  "CONNECTION_DESTROYED",
  "CONNECT_TIMEOUT",
  "ECONNRESET",
  "ECONNREFUSED",
  "ETIMEDOUT",
  "EPIPE",
]);
const isConnectionError = (err: unknown) => CONNECTION_CODES.has(String((err as { code?: string })?.code ?? ""));

async function withDeadline<T>(work: Promise<T>): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      work,
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new DbTimeoutError()), QUERY_TIMEOUT_MS);
      }),
    ]);
  } finally {
    clearTimeout(timer);
  }
}

/** Ensures the schema exists. The setup SQL takes exclusive table locks
    (enable row level security), so it runs only when the schema is missing,
    in a transaction with a short lock timeout. portal.docs is the last table
    the schema creates; update this check when adding newer tables. */
async function ensureSchema(s: Sql): Promise<void> {
  if (schemaChecked) return;
  if (!ready) {
    ready = s<{ t: string | null }[]>`select to_regclass('portal.docs')::text as t`
      .then((rows) =>
        rows[0]?.t
          ? undefined
          : s.unsafe(`begin; set local lock_timeout = '4s'; ${STUDIO_SCHEMA_SQL}; commit;`).then(() => undefined),
      )
      .then(() => {
        schemaChecked = true;
      })
      .catch((err) => {
        ready = null;
        throw err;
      });
  }
  await ready;
}

function unavailable(err: unknown): StorageUnavailableError {
  if (err instanceof StorageUnavailableError) return err;
  console.error("[studio] database error", err);
  const code = (err as { code?: string }).code;
  return new StorageUnavailableError(
    `The database could not be reached${code ? ` (${code})` : ""}. Check DATABASE_URL.`,
  );
}

async function guarded<T>(fn: (s: Sql) => Promise<T>): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    const s = sql();
    inFlight++;
    lastUsed = Date.now();
    try {
      await withDeadline(ensureSchema(s));
      return await withDeadline(fn(s));
    } catch (err) {
      if (isConnectionError(err)) {
        replaceClient(s);
        if (attempt < 2) continue;
      }
      throw unavailable(err);
    } finally {
      inFlight--;
      lastUsed = Date.now();
    }
  }
}

/** Shared, schema-ready connection for the client & studio portal. */
export function portalSql<T>(fn: (s: Sql) => Promise<T>): Promise<T> {
  return guarded(fn);
}

const iso = (v: Date | string) => (v instanceof Date ? v.toISOString() : new Date(v).toISOString());

/* ---------------- Configuration ---------------- */

async function getConfig() {
  return guarded(async (s) => {
    const rows = await s<{ config: StudioConfig }[]>`select config from studio.config where id = 1`;
    return rows[0] ? { config: reviseConfig(rows[0].config), stored: true } : { config: DEFAULT_STUDIO_CONFIG, stored: false };
  });
}

async function writeConfig(build: (current: StudioConfig) => StudioConfig): Promise<StudioConfig> {
  return guarded((s) =>
    s.begin(async (tx) => {
      const rows = await tx<{ config: StudioConfig }[]>`select config from studio.config where id = 1 for update`;
      const current = rows[0]?.config ?? DEFAULT_STUDIO_CONFIG;
      const next: StudioConfig = {
        ...build(current),
        version: current.version + 1,
        updatedAt: new Date().toISOString(),
      };
      await tx`
        insert into studio.config (id, version, config, updated_at)
        values (1, ${next.version}, ${tx.json(next as never)}, now())
        on conflict (id) do update set version = excluded.version, config = excluded.config, updated_at = now()`;
      return next;
    }) as Promise<StudioConfig>,
  );
}

/* ---------------- Commissions ---------------- */

async function createCommission(input: {
  draft: CommissionDraft;
  quote: CommissionRecord["quote"];
  config: StudioConfig;
  consultant: string;
}): Promise<CommissionRecord> {
  const { draft, quote, config, consultant } = input;
  const id = await guarded((s) =>
    s.begin(async (tx) => {
      const commissionId = randomUUID();
      const coupleId = randomUUID();
      const c = draft.couple;
      let reference = "";
      for (let i = 0; i < 8 && !reference; i++) {
        const candidate = makeReference(config.proposal.referencePrefix, randomBytes(4));
        const clash = await tx`select 1 from studio.commissions where reference = ${candidate}`;
        if (clash.length === 0) reference = candidate;
      }
      if (!reference) throw new Error("Could not allocate a commission reference.");

      await tx`
        insert into studio.couples (id, bride_name, groom_name, phone, email, wedding_date, approximate_date,
                                    city, preferred_contact, notes)
        values (${coupleId}, ${c.brideName}, ${c.groomName}, ${c.phone}, ${c.email}, ${c.weddingDate},
                ${c.approximateDate}, ${c.city}, ${c.preferredContact}, ${c.notes})`;
      await tx`
        insert into studio.commissions (id, reference, couple_id, consultant, delivery_tier_id, applied_charge_ids,
                                        post_production_override, grand_total, config_version, draft_id,
                                        duplicated_from, draft_created_at)
        values (${commissionId}, ${reference}, ${coupleId}, ${consultant}, ${draft.deliveryTierId},
                ${tx.json(draft.appliedChargeIds as never)},
                ${draft.postProductionOverride ? tx.json(draft.postProductionOverride as never) : null},
                ${quote.grandTotal}, ${config.version}, ${draft.id}, ${draft.duplicatedFrom},
                ${draft.createdAt})`;

      for (const [i, e] of draft.events.entries()) {
        await tx`
          insert into studio.events (commission_id, id, sort_order, name, type, custom_type, date, start_time,
                                     end_time, venue, location, guest_count, venue_setting, venue_scale,
                                     parallel_activities, special_requirements, notes)
          values (${commissionId}, ${e.id}, ${i}, ${e.name}, ${e.type}, ${e.customType}, ${e.date}, ${e.startTime},
                  ${e.endTime}, ${e.venue}, ${e.location}, ${e.guestCount}, ${e.venueSetting}, ${e.venueScale},
                  ${e.parallelActivities}, ${e.specialRequirements}, ${e.notes})`;
      }

      const lineByAssignment = new Map(quote.lines.map((l) => [l.assignmentId, l]));
      for (const a of draft.assignments) {
        const line = lineByAssignment.get(a.id);
        if (!line) continue;
        await tx`
          insert into studio.assignments (commission_id, id, event_id, service_id, quantity, unit_price_override,
                                          override_reason, unit_price, line_total)
          values (${commissionId}, ${a.id}, ${a.eventId}, ${a.serviceId}, ${line.quantity}, ${a.unitPriceOverride},
                  ${a.overrideReason}, ${line.unitPrice}, ${line.lineTotal})`;
      }

      await tx`
        insert into studio.quotes (commission_id, quote, config_snapshot)
        values (${commissionId}, ${tx.json(quote as never)}, ${tx.json(config as never)})`;
      return commissionId;
    }) as Promise<string>,
  );
  const record = await getCommission(id);
  if (!record) throw new StorageUnavailableError("The commission was saved but could not be read back.");
  return record;
}

interface CommissionRow {
  id: string;
  reference: string;
  status: "submitted";
  consultant: string;
  delivery_tier_id: string | null;
  applied_charge_ids: string[];
  post_production_override: CommissionDraft["postProductionOverride"];
  config_version: number;
  draft_id: string;
  duplicated_from: string | null;
  draft_created_at: Date;
  created_at: Date;
  bride_name: string;
  groom_name: string;
  phone: string;
  email: string;
  wedding_date: string;
  approximate_date: string;
  city: string;
  preferred_contact: string;
  couple_notes: string;
  quote: CommissionRecord["quote"];
  config_snapshot: StudioConfig;
}

async function getCommission(idOrReference: string): Promise<CommissionRecord | null> {
  const isUuid = /^[0-9a-f-]{36}$/i.test(idOrReference);
  return guarded(async (s) => {
    const rows = await s<CommissionRow[]>`
      select c.*, p.bride_name, p.groom_name, p.phone, p.email, p.wedding_date, p.approximate_date, p.city,
             p.preferred_contact, p.notes as couple_notes, q.quote, q.config_snapshot
      from studio.commissions c
      join studio.couples p on p.id = c.couple_id
      join studio.quotes q on q.commission_id = c.id
      where ${isUuid ? s`c.id = ${idOrReference}::uuid` : s`c.reference = ${idOrReference}`}`;
    const r = rows[0];
    if (!r) return null;

    const [events, assignments, activity] = await Promise.all([
      s`select * from studio.events where commission_id = ${r.id} order by sort_order`,
      s`select * from studio.assignments where commission_id = ${r.id}`,
      s`select * from studio.activity where commission_id = ${r.id} order by at`,
    ]);

    const couple: CoupleDetails = {
      brideName: r.bride_name,
      groomName: r.groom_name,
      phone: r.phone,
      email: r.email,
      weddingDate: r.wedding_date,
      approximateDate: r.approximate_date,
      city: r.city,
      preferredContact: r.preferred_contact as PreferredContact,
      notes: r.couple_notes,
    };
    const draft: CommissionDraft = {
      id: r.draft_id,
      schemaVersion: 1,
      couple,
      events: events.map(
        (e): CelebrationEvent => ({
          id: e.id,
          name: e.name,
          type: e.type,
          customType: e.custom_type,
          date: e.date,
          startTime: e.start_time,
          endTime: e.end_time,
          venue: e.venue,
          location: e.location,
          guestCount: e.guest_count,
          venueSetting: e.venue_setting,
          venueScale: e.venue_scale,
          parallelActivities: e.parallel_activities,
          specialRequirements: e.special_requirements,
          notes: e.notes,
        }),
      ),
      assignments: assignments.map((a) => ({
        id: a.id,
        eventId: a.event_id,
        serviceId: a.service_id,
        quantity: a.quantity,
        unitPriceOverride: a.unit_price_override,
        overrideReason: a.override_reason,
      })),
      deliveryTierId: r.delivery_tier_id,
      appliedChargeIds: r.applied_charge_ids ?? [],
      postProductionOverride: r.post_production_override,
      createdAt: iso(r.draft_created_at),
      updatedAt: iso(r.created_at),
      duplicatedFrom: r.duplicated_from,
    };
    return {
      id: r.id,
      reference: r.reference,
      status: r.status,
      consultant: r.consultant,
      createdAt: iso(r.created_at),
      configVersion: r.config_version,
      draft,
      quote: r.quote,
      configSnapshot: r.config_snapshot,
      activity: activity.map(
        (a): ShareActivity => ({
          id: a.id,
          commissionId: a.commission_id,
          channel: a.channel,
          status: a.status,
          detail: a.detail,
          at: iso(a.at),
          by: a.by_name,
        }),
      ),
    };
  });
}

async function listCommissions(search = ""): Promise<CommissionSummaryRow[]> {
  const needle = `%${search.trim().replace(/[\\%_]/g, (m) => `\\${m}`)}%`;
  return guarded(async (s) => {
    const rows = await s`
      select c.id, c.reference, c.grand_total, c.consultant, c.created_at,
             p.bride_name, p.groom_name, p.wedding_date, p.approximate_date, p.city,
             (select count(*)::int from studio.events e where e.commission_id = c.id) as event_count,
             q.quote -> 'postProduction' ->> 'tierLabel' as delivery_label
      from studio.commissions c
      join studio.couples p on p.id = c.couple_id
      join studio.quotes q on q.commission_id = c.id
      where ${search.trim() ? s`(
        p.bride_name ilike ${needle} or p.groom_name ilike ${needle} or c.reference ilike ${needle}
        or p.phone ilike ${needle} or p.email ilike ${needle} or p.city ilike ${needle})` : s`true`}
      order by c.created_at desc
      limit 500`;
    return rows.map((r) => ({
      id: r.id,
      reference: r.reference,
      coupleNames: coupleNames({ brideName: r.bride_name, groomName: r.groom_name } as CoupleDetails, "Unnamed couple"),
      weddingDate: r.wedding_date || r.approximate_date,
      city: r.city,
      eventCount: r.event_count,
      grandTotal: r.grand_total,
      deliveryLabel: r.delivery_label,
      consultant: r.consultant,
      createdAt: iso(r.created_at),
    }));
  });
}

async function logActivity(entry: Omit<ShareActivity, "id" | "at">): Promise<ShareActivity | null> {
  return guarded(async (s) => {
    const exists = await s`select 1 from studio.commissions where id = ${entry.commissionId}::uuid`;
    if (exists.length === 0) return null;
    const id = randomUUID();
    const rows = await s<{ at: Date }[]>`
      insert into studio.activity (id, commission_id, channel, status, detail, by_name)
      values (${id}, ${entry.commissionId}, ${entry.channel}, ${entry.status}, ${entry.detail}, ${entry.by})
      returning at`;
    return { ...entry, id, at: iso(rows[0].at) };
  });
}

/* ---------------- Media ---------------- */

async function saveMedia(name: string, contentType: string, bytes: Uint8Array) {
  await guarded(async (s) => {
    await s`
      insert into studio.media (name, content_type, bytes)
      values (${name}, ${contentType}, ${Buffer.from(bytes)})
      on conflict (name) do nothing`;
  });
}

async function getMedia(name: string) {
  return guarded(async (s) => {
    const rows = await s<{ content_type: string; bytes: Buffer }[]>`
      select content_type, bytes from studio.media where name = ${name}`;
    return rows[0] ? { contentType: rows[0].content_type, bytes: new Uint8Array(rows[0].bytes) } : null;
  });
}

export const pgStore: StudioStore = {
  getConfig,
  saveConfig: (next) => writeConfig(() => next),
  resetConfig: () => writeConfig(() => DEFAULT_STUDIO_CONFIG),
  createCommission,
  getCommission,
  listCommissions,
  logActivity,
  saveMedia,
  getMedia,
};
