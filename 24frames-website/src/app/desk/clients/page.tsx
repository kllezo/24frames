import { redirect } from "next/navigation";
import ClientsCrm from "@/components/portal/ClientsCrm";
import { currentAccount } from "@/lib/portal/guard";
import { publicAccount } from "@/lib/portal/types";
import { getConfig } from "@/lib/studio/server/repository";
import { DEFAULT_STUDIO_CONFIG } from "@/lib/commission/defaults";

export const dynamic = "force-dynamic";

export default async function DeskClientsPage() {
  const me = await currentAccount();
  if (!me) redirect("/desk/login");
  if (me.role === "client") redirect("/account");
  const config = await getConfig().then((r) => r.config).catch(() => DEFAULT_STUDIO_CONFIG);
  return <ClientsCrm me={publicAccount(me)} config={config} />;
}
