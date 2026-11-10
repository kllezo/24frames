import { NextResponse } from "next/server";
import { getConfig, saveConfig } from "@/lib/studio/server/repository";
import { noStore, readJson, requireStudio, storageError, requireAdmin } from "@/lib/studio/server/guard";
import { validateConfig } from "@/lib/commission/validation";
import type { StudioConfig } from "@/lib/commission/types";

export async function GET() {
  const session = await requireStudio();
  if (session instanceof NextResponse) return session;
  try {
    return noStore(NextResponse.json(await getConfig()));
  } catch (err) {
    return storageError(err);
  }
}

export async function PUT(request: Request) {
  const session = await requireAdmin();
  if (session instanceof NextResponse) return session;
  const body = await readJson<{ config: StudioConfig; baseVersion: number }>(request);
  if (!body?.config) return noStore(NextResponse.json({ error: "Missing configuration." }, { status: 400 }));
  const issues = validateConfig(body.config);
  if (issues.length) return noStore(NextResponse.json({ error: "Configuration is invalid.", issues }, { status: 422 }));
  try {
    const { config: current } = await getConfig();
    if (typeof body.baseVersion === "number" && body.baseVersion !== current.version) {
      return noStore(
        NextResponse.json(
          { error: "The configuration was changed elsewhere. Reload before saving.", current },
          { status: 409 },
        ),
      );
    }
    const saved = await saveConfig(body.config);
    return noStore(NextResponse.json({ config: saved, stored: true }));
  } catch (err) {
    return storageError(err);
  }
}
