import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { noStore, requireStudio, storageError } from "@/lib/studio/server/guard";
import { getCommission, saveMedia } from "@/lib/studio/server/repository";

/* Store the proposal PDF behind an unguessable link so it can travel in a
   WhatsApp message. The link is public (couples have no studio login) but
   carries 192 bits of randomness and is never listed anywhere. */

const MAX_BYTES = 4_400_000; // under Vercel's 4.5 MB request limit

export async function POST(request: Request, ctx: RouteContext<"/api/studio/commissions/[id]/pdf">) {
  const session = await requireStudio();
  if (session instanceof NextResponse) return session;
  const { id } = await ctx.params;
  try {
    const record = await getCommission(id);
    if (!record) return noStore(NextResponse.json({ error: "Commission not found." }, { status: 404 }));
    const form = await request.formData().catch(() => null);
    const file = form?.get("pdf");
    if (!(file instanceof Blob) || file.type !== "application/pdf") {
      return noStore(NextResponse.json({ error: "Attach the proposal PDF." }, { status: 400 }));
    }
    if (file.size > MAX_BYTES) {
      return noStore(NextResponse.json({ error: "The PDF is too large to link (over 4.4 MB)." }, { status: 413 }));
    }
    const bytes = new Uint8Array(await file.arrayBuffer());
    if (String.fromCharCode(...bytes.slice(0, 5)) !== "%PDF-") {
      return noStore(NextResponse.json({ error: "That file is not a PDF." }, { status: 400 }));
    }
    const token = randomBytes(24).toString("hex");
    await saveMedia(`proposal-${token}.pdf`, "application/pdf", bytes);
    const origin = new URL(request.url).origin;
    return noStore(NextResponse.json({ url: `${origin}/api/proposal/${token}` }));
  } catch (err) {
    return storageError(err);
  }
}
