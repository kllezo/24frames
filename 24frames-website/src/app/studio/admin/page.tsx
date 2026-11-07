import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import StudioAdmin from "@/components/studio/admin/StudioAdmin";
import { getConfig } from "@/lib/studio/server/repository";
import { SESSION_COOKIE, sessionSecret, verifySession } from "@/lib/studio/session";

export const dynamic = "force-dynamic";

export default async function StudioAdminPage() {
  const secret = sessionSecret();
  const session = secret ? await verifySession((await cookies()).get(SESSION_COOKIE)?.value, secret) : null;
  if (!session) redirect("/studio/login?next=/studio/admin");
  let initial;
  let storageIssue: string | null = null;
  try {
    initial = await getConfig();
  } catch (err) {
    const { DEFAULT_STUDIO_CONFIG } = await import("@/lib/commission/defaults");
    initial = { config: DEFAULT_STUDIO_CONFIG, stored: false };
    storageIssue = (err as Error).message;
  }
  return <StudioAdmin initialConfig={initial.config} stored={initial.stored} consultant={session.consultant} storageIssue={storageIssue} />;
}
