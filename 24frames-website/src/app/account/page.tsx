import { redirect } from "next/navigation";
import ClientHome from "@/components/portal/ClientHome";
import { currentAccount } from "@/lib/portal/guard";
import { listQuotesForClient } from "@/lib/portal/store";
import { getConfig } from "@/lib/studio/server/repository";
import { DEFAULT_STUDIO_CONFIG } from "@/lib/commission/defaults";
import { forClient, publicAccount } from "@/lib/portal/types";

export const dynamic = "force-dynamic";

export default async function AccountPage({ searchParams }: { searchParams: Promise<{ sent?: string }> }) {
  const me = await currentAccount();
  if (!me) redirect("/account/login");
  if (me.role !== "client") redirect("/desk");
  const { sent } = await searchParams;
  let quotes: ReturnType<typeof forClient>[] = [];
  let issue: string | null = null;
  try {
    quotes = (await listQuotesForClient(me.id)).map(forClient);
  } catch (err) {
    issue = (err as Error).message;
  }
  const config = await getConfig().then((r) => r.config).catch(() => DEFAULT_STUDIO_CONFIG);
  return <ClientHome account={publicAccount(me)} quotes={quotes} config={config} sentRef={sent ?? null} storageIssue={issue} />;
}
