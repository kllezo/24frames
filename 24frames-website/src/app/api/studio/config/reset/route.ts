import { NextResponse } from "next/server";
import { resetConfig } from "@/lib/studio/server/repository";
import { noStore, requireStudio, storageError } from "@/lib/studio/server/guard";

export async function POST() {
  const session = await requireStudio();
  if (session instanceof NextResponse) return session;
  try {
    return noStore(NextResponse.json({ config: await resetConfig(), stored: true }));
  } catch (err) {
    return storageError(err);
  }
}
