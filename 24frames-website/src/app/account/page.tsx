import { redirect } from "next/navigation";
import ClientHome from "@/components/portal/ClientHome";
import { currentAccount } from "@/lib/portal/guard";
import { listQuotesForClient, managerCard } from "@/lib/portal/store";
import { getConfig } from "@/lib/studio/server/repository";
import { DEFAULT_STUDIO_CONFIG } from "@/lib/commission/defaults";
import { forClient, publicAccount } from "@/lib/portal/types";

export const dynamic = "force-dynamic";

export default async function AccountPage({ searchParams }: { searchParams: Promise<{ sent?: string; updated?: string }> }) {
  const me = await currentAccount();
  if (!me) redirect("/account/login");
  if (me.role !== "client") redirect("/desk");
  const { sent, updated } = await searchParams;
  let quotes: ReturnType<typeof forClient>[] = [];
  let issue: string | null = null;
  const manager = await managerCard(me.managerId).catch(() => null);
  try {
    quotes = (await listQuotesForClient(me.id)).map((q) => forClient(q, manager));
  } catch (err) {
    issue = (err as Error).message;
  }
  const config = await getConfig().then((r) => r.config).catch(() => DEFAULT_STUDIO_CONFIG);
  return <ClientHome account={publicAccount(me)} manager={manager} quotes={quotes} config={config} sentRef={sent ?? null} updatedRef={updated ?? null} storageIssue={issue} />;
}
