import { NextResponse } from "next/server";
import { ABSOLUTE_TIMEOUT_MS, IDLE_TIMEOUT_MS } from "@/lib/studio/session";
import { noStore, requireStudio } from "@/lib/studio/server/guard";

/* Keep-alive. Called by the client only after real interaction; the proxy
   re-signs the cookie, extending the idle window. */
export async function GET() {
  const session = await requireStudio();
  if (session instanceof NextResponse) return session;
  return noStore(
    NextResponse.json({
      consultant: session.consultant,
      idleTimeoutMs: IDLE_TIMEOUT_MS,
      absoluteExpiresAt: session.iat + ABSOLUTE_TIMEOUT_MS,
    }),
  );
}
