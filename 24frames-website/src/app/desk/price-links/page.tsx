import { redirect } from "next/navigation";
import PriceLinks from "@/components/portal/PriceLinks";
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
  const services = [...config.services].sort((a, b) => a.order - b.order).map((s) => ({ id: s.id, name: s.name, price: s.price }));
  return <PriceLinks me={publicAccount(me)} services={services} />;
}
