import { randomUUID } from "node:crypto";
import { body, json, leadVisible, portalError, requireRole, sameOrigin } from "@/lib/portal/guard";
import { getAccount, getDoc, listDocs, putDoc } from "@/lib/portal/store";
import type { FollowUp } from "@/lib/portal/types";

/* Follow-ups: what each salesperson owes their leads. A salesperson sees
   their own; the founder sees everyone's. */

const KINDS = ["call", "meeting", "message", "task"] as const;

export async function GET() {
  const me = await requireRole("owner", "sales");
  if (me instanceof Response) return me;
  try {
    const all = await listDocs<FollowUp>("followup");
    const shown = me.role === "owner" ? all : all.filter((f) => f.ownerId === me.id);
    return json({ followups: shown.sort((a, b) => a.due.localeCompare(b.due)) });
  } catch (err) {
    return portalError(err);
  }
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ error: "Not allowed." }, 403);
  const me = await requireRole("owner", "sales");
  if (me instanceof Response) return me;
  const b = await body<{ clientId?: string; quoteId?: string | null; kind?: string; due?: string; note?: string }>(request, 4000);
  if (!b?.clientId) return json({ error: "Choose the client." }, 400);
  if (!b.due || !/^\d{4}-\d{2}-\d{2}$/.test(b.due)) return json({ error: "Choose a due date." }, 422);
  const kind = KINDS.includes(b.kind as (typeof KINDS)[number]) ? (b.kind as FollowUp["kind"]) : "call";
  try {
    const client = await getAccount(b.clientId);
    if (!client || client.role !== "client" || !leadVisible(me, client.managerId)) return json({ error: "Client not found." }, 404);
    const f: FollowUp = {
      id: randomUUID(),
      ownerId: me.id,
      ownerName: me.name,
      clientId: client.id,
      clientName: client.name,
      quoteId: b.quoteId ?? null,
      kind,
      due: b.due,
      note: (b.note ?? "").trim().slice(0, 600),
      done: false,
      doneAt: null,
      createdAt: new Date().toISOString(),
    };
    await putDoc("followup", f);
    return json({ followup: f }, 201);
  } catch (err) {
    return portalError(err);
  }
}

export async function PATCH(request: Request) {
  if (!sameOrigin(request)) return json({ error: "Not allowed." }, 403);
  const me = await requireRole("owner", "sales");
  if (me instanceof Response) return me;
  const b = await body<{ id?: string; done?: boolean }>(request, 1000);
  if (!b?.id || typeof b.done !== "boolean") return json({ error: "Missing details." }, 400);
  try {
    const f = await getDoc<FollowUp>("followup", b.id);
    if (!f || (me.role !== "owner" && f.ownerId !== me.id)) return json({ error: "Follow-up not found." }, 404);
    const next = await putDoc("followup", { ...f, done: b.done, doneAt: b.done ? new Date().toISOString() : null });
    return json({ followup: next });
  } catch (err) {
    return portalError(err);
  }
}
