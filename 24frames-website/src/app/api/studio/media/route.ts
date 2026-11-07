import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { noStore, requireStudio } from "@/lib/studio/server/guard";
import { mediaDir } from "@/lib/studio/server/media";

/* Studio image uploads for service imagery. JPEG/PNG only — the PDF
   renderer cannot embed WebP/AVIF. Stored beside the studio records and
   served back only to signed-in studio sessions. */

const TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png" };

export async function POST(request: Request) {
  const session = await requireStudio();
  if (session instanceof NextResponse) return session;
  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof Blob) || !TYPES[file.type]) {
    return noStore(NextResponse.json({ error: "Upload a JPEG or PNG image." }, { status: 400 }));
  }
  if (file.size > 8 * 1024 * 1024) {
    return noStore(NextResponse.json({ error: "Images must be under 8 MB." }, { status: 400 }));
  }
  try {
    const name = `${randomUUID()}.${TYPES[file.type]}`;
    await fs.mkdir(mediaDir(), { recursive: true, mode: 0o700 });
    await fs.writeFile(path.join(mediaDir(), name), Buffer.from(await file.arrayBuffer()), { mode: 0o600 });
    return noStore(NextResponse.json({ url: `/api/studio/media/${name}` }, { status: 201 }));
  } catch (err) {
    return noStore(
      NextResponse.json(
        { error: `Image could not be stored (${(err as NodeJS.ErrnoException).code ?? "error"}).` },
        { status: 503 },
      ),
    );
  }
}
