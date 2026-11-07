import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import CommissionStudio from "@/components/studio/CommissionStudio";
import { getConfig } from "@/lib/studio/server/repository";
import { SESSION_COOKIE, sessionSecret, verifySession } from "@/lib/studio/session";

export const dynamic = "force-dynamic";

export default async function StudioPage() {
  const secret = sessionSecret();
  const session = secret ? await verifySession((await cookies()).get(SESSION_COOKIE)?.value, secret) : null;
  if (!session) redirect("/studio/login");

  let config;
  let storageIssue: string | null = null;
  try {
    config = (await getConfig()).config;
  } catch (err) {
    const { DEFAULT_STUDIO_CONFIG } = await import("@/lib/commission/defaults");
    config = DEFAULT_STUDIO_CONFIG;
    storageIssue = (err as Error).message;
  }
  return <CommissionStudio config={config} consultant={session.consultant} storageIssue={storageIssue} />;
}
