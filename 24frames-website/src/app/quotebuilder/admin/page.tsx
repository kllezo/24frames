import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import StudioAdmin from "@/components/studio/admin/StudioAdmin";
import AdminGate from "@/components/studio/admin/AdminGate";
import { getConfig } from "@/lib/studio/server/repository";
import { ADMIN_COOKIE, SESSION_COOKIE, sessionSecret, verifyAdmin, verifySession } from "@/lib/studio/session";

export const dynamic = "force-dynamic";

export default async function StudioAdminPage() {
  const secret = sessionSecret();
  const jar = await cookies();
  const session = secret ? await verifySession(jar.get(SESSION_COOKIE)?.value, secret) : null;
  if (!session) redirect("/quotebuilder/login?next=/quotebuilder/admin");
  // The admin always asks for the PIN again (valid for 15 minutes).
  if (!(await verifyAdmin(jar.get(ADMIN_COOKIE)?.value, secret!))) return <AdminGate />;
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
