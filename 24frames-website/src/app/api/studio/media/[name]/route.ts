import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";
import { requireStudio } from "@/lib/studio/server/guard";
import { mediaDir } from "@/lib/studio/server/media";

export async function GET(_request: Request, ctx: RouteContext<"/api/studio/media/[name]">) {
  const session = await requireStudio();
  if (session instanceof NextResponse) return session;
  const { name } = await ctx.params;
  if (!/^[a-f0-9-]{36}\.(jpg|png)$/.test(name)) return new NextResponse(null, { status: 404 });
  try {
    const data = await fs.readFile(path.join(mediaDir(), name));
    return new NextResponse(new Uint8Array(data), {
      headers: {
        "Content-Type": name.endsWith(".png") ? "image/png" : "image/jpeg",
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}
