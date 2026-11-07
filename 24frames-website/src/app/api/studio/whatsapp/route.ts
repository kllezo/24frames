import { NextResponse } from "next/server";
import { getCommission, logActivity } from "@/lib/studio/server/repository";
import { noStore, requireStudio, storageError } from "@/lib/studio/server/guard";

/* ============================================================
   WhatsApp Business Cloud API — automated PDF delivery.
   INTEGRATION POINT: requires studio-authorised credentials
     WHATSAPP_CLOUD_TOKEN, WHATSAPP_PHONE_NUMBER_ID
   When not configured, GET reports { configured: false } and the
   UI falls back to the manual workflow (click-to-chat + attach).

   Note: WhatsApp only allows free-form document messages inside a
   24-hour customer-service window. Outside it, an approved message
   template is required — the API error is surfaced verbatim.
   A successful response means "accepted by WhatsApp", not "read" or
   "delivered"; delivery receipts require a webhook (not built).
   ============================================================ */

const version = () => process.env.WHATSAPP_API_VERSION || "v21.0";
const configured = () => !!(process.env.WHATSAPP_CLOUD_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID);

export async function GET() {
  const session = await requireStudio();
  if (session instanceof NextResponse) return session;
  return noStore(NextResponse.json({ configured: configured() }));
}

export async function POST(request: Request) {
  const session = await requireStudio();
  if (session instanceof NextResponse) return session;
  if (!configured()) {
    return noStore(
      NextResponse.json(
        { error: "WhatsApp Business Cloud API is not configured for this studio.", code: "not_configured" },
        { status: 501 },
      ),
    );
  }

  const form = await request.formData().catch(() => null);
  const commissionId = form?.get("commissionId");
  const to = form?.get("to");
  const file = form?.get("pdf");
  if (typeof commissionId !== "string" || typeof to !== "string" || !/^\d{10,15}$/.test(to) || !(file instanceof Blob)) {
    return noStore(NextResponse.json({ error: "Missing commission, recipient or PDF." }, { status: 400 }));
  }
  if (file.type !== "application/pdf" || file.size > 15 * 1024 * 1024) {
    return noStore(NextResponse.json({ error: "The proposal must be a PDF under 15 MB." }, { status: 400 }));
  }

  try {
    const record = await getCommission(commissionId);
    if (!record) return noStore(NextResponse.json({ error: "Commission not found." }, { status: 404 }));

    const base = `https://graph.facebook.com/${version()}/${process.env.WHATSAPP_PHONE_NUMBER_ID}`;
    const auth = { Authorization: `Bearer ${process.env.WHATSAPP_CLOUD_TOKEN}` };
    const filename = `24-Frames-Proposal-${record.reference}.pdf`;

    const upload = new FormData();
    upload.append("messaging_product", "whatsapp");
    upload.append("type", "application/pdf");
    upload.append("file", file, filename);
    const mediaRes = await fetch(`${base}/media`, { method: "POST", headers: auth, body: upload });
    const media = (await mediaRes.json().catch(() => ({}))) as { id?: string; error?: { message?: string } };
    if (!mediaRes.ok || !media.id) {
      const detail = media.error?.message ?? `Media upload failed (${mediaRes.status}).`;
      await logActivity({ commissionId: record.id, channel: "whatsapp_cloud_api", status: "failed", detail, by: session.consultant });
      return noStore(NextResponse.json({ error: detail }, { status: 502 }));
    }

    const msgRes = await fetch(`${base}/messages`, {
      method: "POST",
      headers: { ...auth, "Content-Type": "application/json" },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "document",
        document: { id: media.id, filename, caption: `Your 24 Frames commission proposal · ${record.reference}` },
      }),
    });
    const msg = (await msgRes.json().catch(() => ({}))) as { messages?: { id: string }[]; error?: { message?: string } };
    if (!msgRes.ok || !msg.messages?.[0]?.id) {
      const detail = msg.error?.message ?? `Message send failed (${msgRes.status}).`;
      await logActivity({ commissionId: record.id, channel: "whatsapp_cloud_api", status: "failed", detail, by: session.consultant });
      return noStore(NextResponse.json({ error: detail }, { status: 502 }));
    }

    const activity = await logActivity({
      commissionId: record.id,
      channel: "whatsapp_cloud_api",
      status: "accepted_by_api",
      detail: `Accepted by WhatsApp for +${to} (message ${msg.messages[0].id}). Delivery is not yet confirmed.`,
      by: session.consultant,
    });
    return noStore(NextResponse.json({ ok: true, messageId: msg.messages[0].id, activity }));
  } catch (err) {
    return storageError(err);
  }
}
