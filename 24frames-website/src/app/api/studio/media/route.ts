import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { noStore, storageError, requireAdmin } from "@/lib/studio/server/guard";
import { saveMedia } from "@/lib/studio/server/repository";

/* Studio image uploads for service imagery. JPEG/PNG only — the PDF
   renderer cannot embed WebP/AVIF. Stored with the studio records (database
   or local files) and served back only to signed-in studio sessions. */

const TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png" };

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (session instanceof NextResponse) return session;
  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof Blob) || !TYPES[file.type]) {
    return noStore(NextResponse.json({ error: "Upload a JPEG or PNG image." }, { status: 400 }));
  }
  if (file.size > 4 * 1024 * 1024) {
    return noStore(NextResponse.json({ error: "Images must be under 4 MB." }, { status: 400 }));
  }
  try {
    const name = `${randomUUID()}.${TYPES[file.type]}`;
    await saveMedia(name, file.type, new Uint8Array(await file.arrayBuffer()));
    return noStore(NextResponse.json({ url: `/api/studio/media/${name}` }, { status: 201 }));
  } catch (err) {
    return storageError(err);
  }
}
