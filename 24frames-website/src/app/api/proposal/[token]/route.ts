import { NextResponse } from "next/server";
import { getMedia } from "@/lib/studio/server/repository";

/* Public, unlisted proposal PDF. Only reachable with the exact 48-hex token
   the studio sent to the couple; never indexed. */
export async function GET(_request: Request, ctx: RouteContext<"/api/proposal/[token]">) {
  const { token } = await ctx.params;
  if (!/^[a-f0-9]{48}$/.test(token)) return new NextResponse(null, { status: 404 });
  try {
    const media = await getMedia(`proposal-${token}.pdf`);
    if (!media) return new NextResponse(null, { status: 404 });
    return new NextResponse(new Uint8Array(media.bytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'inline; filename="24-Frames-Proposal.pdf"',
        "Cache-Control": "private, max-age=86400",
        "X-Robots-Tag": "noindex, nofollow",
        "Referrer-Policy": "no-referrer",
      },
    });
  } catch {
    return new NextResponse(null, { status: 503 });
  }
}
