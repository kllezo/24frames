import { redirect } from "next/navigation";
import Team from "@/components/portal/Team";
import { currentAccount } from "@/lib/portal/guard";
import { publicAccount } from "@/lib/portal/types";


export const dynamic = "force-dynamic";

export default async function Page() {
  const me = await currentAccount();
  if (!me) redirect("/desk/login");
  if (me.role === "client") redirect("/account");
  if (!me.superadmin) redirect("/desk/dashboard");

  return <Team me={publicAccount(me)} />;
}
