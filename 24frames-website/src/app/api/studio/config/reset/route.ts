import { NextResponse } from "next/server";
import { resetConfig } from "@/lib/studio/server/repository";
import { noStore, storageError, requireAdmin } from "@/lib/studio/server/guard";

export async function POST() {
  const session = await requireAdmin();
  if (session instanceof NextResponse) return session;
  try {
    return noStore(NextResponse.json({ config: await resetConfig(), stored: true }));
  } catch (err) {
    return storageError(err);
  }
}
