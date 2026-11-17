import { redirect } from "next/navigation";
import Analytics from "@/components/portal/Analytics";
import { currentAccount } from "@/lib/portal/guard";
import { publicAccount } from "@/lib/portal/types";


export const dynamic = "force-dynamic";

export default async function Page() {
  const me = await currentAccount();
  if (!me) redirect("/desk/login");
  if (me.role === "client") redirect("/account");
  if (!me.superadmin) redirect("/desk/dashboard");

  return <Analytics me={publicAccount(me)} />;
}
