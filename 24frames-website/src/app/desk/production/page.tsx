import { redirect } from "next/navigation";
import Production from "@/components/portal/Production";
import { currentAccount } from "@/lib/portal/guard";
import { publicAccount } from "@/lib/portal/types";
import { getConfig } from "@/lib/studio/server/repository";
import { DEFAULT_STUDIO_CONFIG } from "@/lib/commission/defaults";

export const dynamic = "force-dynamic";

export default async function Page() {
  const me = await currentAccount();
  if (!me) redirect("/desk/login");
  if (me.role === "client") redirect("/account");

  const config = await getConfig().then((r) => r.config).catch(() => DEFAULT_STUDIO_CONFIG);
  return <Production me={publicAccount(me)} config={config} />;
}
