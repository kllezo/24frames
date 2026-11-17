import { body, json, portalError, requireRole, sameOrigin } from "@/lib/portal/guard";
import { listDocs, putDocs } from "@/lib/portal/store";
import type { DeskNotification } from "@/lib/portal/types";

/* The signed-in team member's notifications, newest first. */
export async function GET() {
  const me = await requireRole("owner", "sales");
  if (me instanceof Response) return me;
  try {
    const mine = (await listDocs<DeskNotification>("notification")).filter((n) => n.to === me.id).sort((a, b) => b.at.localeCompare(a.at)).slice(0, 60);
    return json({ notifications: mine, unread: mine.filter((n) => !n.read).length });
  } catch (err) {
    return portalError(err);
  }
}

/* Mark some (or all) as read. */
export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ error: "Not allowed." }, 403);
  const me = await requireRole("owner", "sales");
  if (me instanceof Response) return me;
  const b = await body<{ ids?: string[]; all?: boolean }>(request, 20000);
  try {
    const ids = new Set(b?.ids ?? []);
    const mine = (await listDocs<DeskNotification>("notification")).filter((n) => n.to === me.id && !n.read && (b?.all || ids.has(n.id)));
    await putDocs("notification", mine.map((n) => ({ ...n, read: true })));
    return json({ ok: true, marked: mine.length });
  } catch (err) {
    return portalError(err);
  }
}
