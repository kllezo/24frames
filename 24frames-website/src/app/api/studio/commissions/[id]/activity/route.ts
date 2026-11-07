import { NextResponse } from "next/server";
import { logActivity } from "@/lib/studio/server/repository";
import { noStore, readJson, requireStudio, storageError } from "@/lib/studio/server/guard";
import type { ShareActivity } from "@/lib/commission/types";

const CHANNELS = new Set(["pdf_download", "whatsapp_click_to_chat", "native_share", "message_copied"]);
const STATUSES = new Set(["completed", "opened", "failed", "handed_to_device"]);

/* Records what the studio did with a proposal. Client-side actions can only
   be recorded honestly as what the device reported (e.g. "WhatsApp opened"),
   never as "delivered". Cloud API deliveries are logged by the WhatsApp route. */
export async function POST(request: Request, ctx: RouteContext<"/api/studio/commissions/[id]/activity">) {
  const session = await requireStudio();
  if (session instanceof NextResponse) return session;
  const { id } = await ctx.params;
  const body = await readJson<Pick<ShareActivity, "channel" | "status" | "detail">>(request, 4000);
  if (!body || !CHANNELS.has(body.channel) || !STATUSES.has(body.status)) {
    return noStore(NextResponse.json({ error: "Invalid activity." }, { status: 400 }));
  }
  try {
    const row = await logActivity({
      commissionId: id,
      channel: body.channel,
      status: body.status,
      detail: String(body.detail ?? "").slice(0, 300),
      by: session.consultant,
    });
    if (!row) return noStore(NextResponse.json({ error: "Commission not found." }, { status: 404 }));
    return noStore(NextResponse.json({ activity: row }, { status: 201 }));
  } catch (err) {
    return storageError(err);
  }
}
