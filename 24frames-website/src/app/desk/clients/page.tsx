import { redirect } from "next/navigation";
import ClientsCrm from "@/components/portal/ClientsCrm";
import { currentAccount } from "@/lib/portal/guard";
import { publicAccount } from "@/lib/portal/types";

export const dynamic = "force-dynamic";

export default async function DeskClientsPage() {
  const me = await currentAccount();
  if (!me) redirect("/desk/login");
  if (me.role === "client") redirect("/account");
  return <ClientsCrm me={publicAccount(me)} />;
}
