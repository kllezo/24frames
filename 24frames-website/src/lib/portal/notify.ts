/* Desk notifications — written for each team member who needs to know. */

import { randomUUID } from "node:crypto";
import { putDocs } from "./store";
import type { DeskNotification } from "./types";

export async function notify(
  to: (string | null | undefined)[],
  kind: DeskNotification["kind"],
  text: string,
  refs: { quoteId?: string | null; clientId?: string | null } = {},
) {
  const at = new Date().toISOString();
  const ids = Array.from(new Set(to.filter((x): x is string => !!x)));
  await putDocs<DeskNotification>(
    "notification",
    ids.map((id) => ({ id: randomUUID(), to: id, at, kind, text: text.slice(0, 400), quoteId: refs.quoteId ?? null, clientId: refs.clientId ?? null, read: false })),
  ).catch((err) => console.error("[portal] notification not saved", err));
}
