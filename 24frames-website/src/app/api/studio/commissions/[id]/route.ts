import { NextResponse } from "next/server";
import { getCommission } from "@/lib/studio/server/repository";
import { noStore, storageError, requireAdmin } from "@/lib/studio/server/guard";

export async function GET(_request: Request, ctx: RouteContext<"/api/studio/commissions/[id]">) {
  const session = await requireAdmin();
  if (session instanceof NextResponse) return session;
  const { id } = await ctx.params;
  try {
    const record = await getCommission(id);
    if (!record) return noStore(NextResponse.json({ error: "Commission not found." }, { status: 404 }));
    return noStore(NextResponse.json({ record }));
  } catch (err) {
    return storageError(err);
  }
}
