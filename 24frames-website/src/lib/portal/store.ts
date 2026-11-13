/* ============================================================
   Portal storage — server only.
   Same rule as the studio records: Postgres (Supabase) when
   DATABASE_URL is set, otherwise a local JSON file beside the
   studio file store (STUDIO_DATA_DIR, default ./.studio-data).
   ============================================================ */

import { promises as fs } from "node:fs";
import path from "node:path";
import { randomBytes, randomUUID } from "node:crypto";
import { databaseUrl, portalSql } from "@/lib/studio/server/pg-store";
import { makeReference, StorageUnavailableError } from "@/lib/studio/server/store-types";
import type { ManagerCard, PortalAccount, PortalQuote, PortalRole, StaffAccess } from "./types";

export { StorageUnavailableError };

const pgEnabled = () => !!databaseUrl();

/* ---------------- file adapter ---------------- */

interface FileDb {
  accounts: PortalAccount[];
  quotes: PortalQuote[];
  access: StaffAccess[];
}
const dataDir = () => path.resolve(process.env.STUDIO_DATA_DIR || path.join(process.cwd(), ".studio-data"));
const dbFile = () => path.join(dataDir(), "portal-db.json");

let queue: Promise<unknown> = Promise.resolve();
function exclusive<T>(fn: () => Promise<T>): Promise<T> {
  const run = queue.then(fn, fn);
  queue = run.catch(() => undefined);
  return run;
}

async function load(): Promise<FileDb> {
  try {
    const raw = await fs.readFile(dbFile(), "utf8");
    const parsed = JSON.parse(raw) as Partial<FileDb>;
    return { accounts: parsed.accounts ?? [], quotes: parsed.quotes ?? [], access: parsed.access ?? [] };
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return { accounts: [], quotes: [], access: [] };
    throw new StorageUnavailableError(`Portal records could not be read: ${(err as Error).message}`);
  }
}

async function save(db: FileDb) {
  try {
    await fs.mkdir(dataDir(), { recursive: true, mode: 0o700 });
    const tmp = `${dbFile()}.${process.pid}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(db, null, 2), { mode: 0o600 });
    await fs.rename(tmp, dbFile());
  } catch (err) {
    throw new StorageUnavailableError(
      `Portal records could not be saved (${(err as NodeJS.ErrnoException).code ?? "error"}). Configure DATABASE_URL or a writable STUDIO_DATA_DIR.`,
    );
  }
}

/* ---------------- accounts ---------------- */

export const normaliseEmail = (email: string) => email.trim().toLowerCase();

export async function findAccountByEmail(email: string): Promise<PortalAccount | null> {
  const e = normaliseEmail(email);
  if (pgEnabled()) {
    return portalSql(async (s) => {
      const rows = await s<{ data: PortalAccount }[]>`select data from portal.accounts where email = ${e}`;
      return rows[0]?.data ?? null;
    });
  }
  return (await load()).accounts.find((a) => a.email === e) ?? null;
}

export async function getAccount(id: string): Promise<PortalAccount | null> {
  if (pgEnabled()) {
    return portalSql(async (s) => {
      const rows = await s<{ data: PortalAccount }[]>`select data from portal.accounts where id = ${id}`;
      return rows[0]?.data ?? null;
    });
  }
  return (await load()).accounts.find((a) => a.id === id) ?? null;
}

export async function countOwners(): Promise<number> {
  if (pgEnabled()) {
    return portalSql(async (s) => {
      const rows = await s<{ n: number }[]>`select count(*)::int as n from portal.accounts where role = 'owner'`;
      return rows[0]?.n ?? 0;
    });
  }
  return (await load()).accounts.filter((a) => a.role === "owner").length;
}

export async function listStaff(): Promise<PortalAccount[]> {
  if (pgEnabled()) {
    return portalSql(async (s) => {
      const rows = await s<{ data: PortalAccount }[]>`select data from portal.accounts where role <> 'client' order by created_at`;
      return rows.map((r) => r.data);
    });
  }
  return (await load()).accounts.filter((a) => a.role !== "client");
}

export class DuplicateEmailError extends Error {}

export async function createAccount(input: {
  role: PortalRole;
  name: string;
  email: string;
  phone: string;
  location?: string;
  superadmin?: boolean;
  passwordHash: string;
  createdBy: string | null;
}): Promise<PortalAccount> {
  const account: PortalAccount = {
    id: randomUUID(),
    role: input.role,
    name: input.name.trim().slice(0, 80),
    email: normaliseEmail(input.email),
    phone: input.phone.trim().slice(0, 30),
    location: (input.location ?? "").trim().slice(0, 120),
    ...(input.superadmin ? { superadmin: true } : {}),
    passwordHash: input.passwordHash,
    active: true,
    createdAt: new Date().toISOString(),
    createdBy: input.createdBy,
    // Creating an account signs the person in, so it counts as their first visit.
    lastLoginAt: new Date().toISOString(),
  };
  if (pgEnabled()) {
    return portalSql(async (s) => {
      const existing = await s`select 1 from portal.accounts where email = ${account.email}`;
      if (existing.length) throw new DuplicateEmailError();
      await s`insert into portal.accounts (id, email, role, data) values (${account.id}, ${account.email}, ${account.role}, ${s.json(account as never)})`;
      return account;
    });
  }
  return exclusive(async () => {
    const db = await load();
    if (db.accounts.some((a) => a.email === account.email)) throw new DuplicateEmailError();
    db.accounts.push(account);
    await save(db);
    return account;
  });
}

export async function updateAccount(id: string, patch: Partial<PortalAccount>): Promise<PortalAccount | null> {
  if (pgEnabled()) {
    return portalSql(async (s) => {
      const rows = await s<{ data: PortalAccount }[]>`select data from portal.accounts where id = ${id}`;
      if (!rows[0]) return null;
      const next = { ...rows[0].data, ...patch, id };
      await s`update portal.accounts set data = ${s.json(next as never)}, role = ${next.role} where id = ${id}`;
      return next;
    });
  }
  return exclusive(async () => {
    const db = await load();
    const i = db.accounts.findIndex((a) => a.id === id);
    if (i < 0) return null;
    db.accounts[i] = { ...db.accounts[i], ...patch, id };
    await save(db);
    return db.accounts[i];
  });
}

/* ---------------- quotations ---------------- */

export function newQuoteReference(existing: Set<string> = new Set()): string {
  for (let i = 0; i < 20; i++) {
    const ref = makeReference("24Q", randomBytes(4));
    if (!existing.has(ref)) return ref;
  }
  return makeReference("24Q", randomBytes(4));
}

export async function insertQuote(q: PortalQuote): Promise<PortalQuote> {
  if (pgEnabled()) {
    return portalSql(async (s) => {
      await s`insert into portal.quotes (id, client_id, status, data, updated_at) values (${q.id}, ${q.clientId}, ${q.status}, ${s.json(q as never)}, ${q.updatedAt})`;
      return q;
    });
  }
  return exclusive(async () => {
    const db = await load();
    db.quotes.push(q);
    await save(db);
    return q;
  });
}

export async function getQuote(id: string): Promise<PortalQuote | null> {
  if (pgEnabled()) {
    return portalSql(async (s) => {
      const rows = await s<{ data: PortalQuote }[]>`select data from portal.quotes where id = ${id}`;
      return rows[0]?.data ?? null;
    });
  }
  return (await load()).quotes.find((q) => q.id === id) ?? null;
}

/** Read-modify-write a quotation atomically. `change` returns the next value, or an Error to abort. */
export async function mutateQuote(id: string, change: (q: PortalQuote) => PortalQuote | Error): Promise<PortalQuote | Error | null> {
  if (pgEnabled()) {
    return portalSql((s) =>
      s.begin(async (tx) => {
        const rows = await tx<{ data: PortalQuote }[]>`select data from portal.quotes where id = ${id} for update`;
        if (!rows[0]) return null;
        const next = change(rows[0].data);
        if (next instanceof Error) return next;
        await tx`update portal.quotes set data = ${tx.json(next as never)}, status = ${next.status}, updated_at = ${next.updatedAt} where id = ${id}`;
        return next;
      }) as Promise<PortalQuote | Error | null>,
    );
  }
  return exclusive(async () => {
    const db = await load();
    const i = db.quotes.findIndex((q) => q.id === id);
    if (i < 0) return null;
    const next = change(db.quotes[i]);
    if (next instanceof Error) return next;
    db.quotes[i] = next;
    await save(db);
    return next;
  });
}

export async function listQuotesForClient(clientId: string): Promise<PortalQuote[]> {
  if (pgEnabled()) {
    return portalSql(async (s) => {
      const rows = await s<{ data: PortalQuote }[]>`select data from portal.quotes where client_id = ${clientId} order by updated_at desc`;
      return rows.map((r) => r.data);
    });
  }
  return (await load()).quotes.filter((q) => q.clientId === clientId).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function listAllQuotes(): Promise<PortalQuote[]> {
  if (pgEnabled()) {
    return portalSql(async (s) => {
      const rows = await s<{ data: PortalQuote }[]>`select data from portal.quotes order by updated_at desc limit 1000`;
      return rows.map((r) => r.data);
    });
  }
  return (await load()).quotes.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

/* ---------------- clients (CRM) ---------------- */

export async function listClients(): Promise<PortalAccount[]> {
  if (pgEnabled()) {
    return portalSql(async (s) => {
      const rows = await s<{ data: PortalAccount }[]>`select data from portal.accounts where role = 'client' order by created_at desc limit 5000`;
      return rows.map((r) => r.data);
    });
  }
  return (await load()).accounts.filter((a) => a.role === "client").sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/* ---------------- desk access (superadmin allowlist) ---------------- */

export async function getAccess(email: string): Promise<StaffAccess | null> {
  const e = normaliseEmail(email);
  if (pgEnabled()) {
    return portalSql(async (s) => {
      const rows = await s<{ data: StaffAccess }[]>`select data from portal.access where email = ${e}`;
      return rows[0]?.data ?? null;
    });
  }
  return (await load()).access.find((a) => a.email === e) ?? null;
}

export async function listAccess(): Promise<StaffAccess[]> {
  if (pgEnabled()) {
    return portalSql(async (s) => {
      const rows = await s<{ data: StaffAccess }[]>`select data from portal.access order by updated_at desc`;
      return rows.map((r) => r.data);
    });
  }
  return [...(await load()).access].sort((a, b) => b.grantedAt.localeCompare(a.grantedAt));
}

export async function saveAccess(entry: StaffAccess): Promise<StaffAccess> {
  const next = { ...entry, email: normaliseEmail(entry.email) };
  if (pgEnabled()) {
    return portalSql(async (s) => {
      await s`insert into portal.access (email, data, updated_at) values (${next.email}, ${s.json(next as never)}, now())
              on conflict (email) do update set data = excluded.data, updated_at = now()`;
      return next;
    });
  }
  return exclusive(async () => {
    const db = await load();
    const i = db.access.findIndex((a) => a.email === next.email);
    if (i >= 0) db.access[i] = next;
    else db.access.push(next);
    await save(db);
    return next;
  });
}

/* ---------------- relationship managers ---------------- */

/** What a client may see of their relationship manager. */
export async function managerCard(id: string | null | undefined): Promise<ManagerCard | null> {
  if (!id) return null;
  const m = await getAccount(id);
  if (!m || !m.active || m.role === "client") return null;
  return { name: m.name, phone: m.phone, email: m.email };
}
