import { redirect } from "next/navigation";
import SalesDashboard from "@/components/portal/SalesDashboard";
import FounderDesk from "@/components/portal/FounderDesk";
import { currentAccount } from "@/lib/portal/guard";
import { publicAccount } from "@/lib/portal/types";


export const dynamic = "force-dynamic";

export default async function Page() {
  const me = await currentAccount();
  if (!me) redirect("/desk/login");
  if (me.role === "client") redirect("/account");


  return me.role === "owner" ? <FounderDesk me={publicAccount(me)} /> : <SalesDashboard me={publicAccount(me)} />;
}
