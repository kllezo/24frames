import { redirect } from "next/navigation";
import PriceLinks from "@/components/portal/PriceLinks";
import { currentAccount } from "@/lib/portal/guard";
import { publicAccount } from "@/lib/portal/types";


export const dynamic = "force-dynamic";

export default async function Page() {
  const me = await currentAccount();
  if (!me) redirect("/desk/login");
  if (me.role === "client") redirect("/account");


  return <PriceLinks me={publicAccount(me)} />;
}
