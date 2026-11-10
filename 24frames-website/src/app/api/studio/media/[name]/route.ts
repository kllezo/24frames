import { NextResponse } from "next/server";
import { requireStudio } from "@/lib/studio/server/guard";
import { getMedia } from "@/lib/studio/server/repository";

export async function GET(_request: Request, ctx: RouteContext<"/api/studio/media/[name]">) {
  const session = await requireStudio();
  if (session instanceof NextResponse) return session;
  const { name } = await ctx.params;
  if (!/^[a-f0-9-]{36}\.(jpg|png)$/.test(name)) return new NextResponse(null, { status: 404 });
  try {
    const media = await getMedia(name);
    if (!media) return new NextResponse(null, { status: 404 });
    return new NextResponse(new Uint8Array(media.bytes), {
      headers: { "Content-Type": media.contentType, "Cache-Control": "private, max-age=3600" },
    });
  } catch {
    return new NextResponse(null, { status: 503 });
  }
}
