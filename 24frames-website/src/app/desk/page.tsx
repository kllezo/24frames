import { redirect } from "next/navigation";
import Desk from "@/components/portal/Desk";
import { currentAccount } from "@/lib/portal/guard";
import { getConfig } from "@/lib/studio/server/repository";
import { DEFAULT_STUDIO_CONFIG } from "@/lib/commission/defaults";
import { publicAccount } from "@/lib/portal/types";

export const dynamic = "force-dynamic";

export default async function DeskPage() {
  const me = await currentAccount();
  if (!me) redirect("/desk/login");
  if (me.role === "client") redirect("/account");
  const config = await getConfig().then((r) => r.config).catch(() => DEFAULT_STUDIO_CONFIG);
  return <Desk me={publicAccount(me)} config={config} />;
}
