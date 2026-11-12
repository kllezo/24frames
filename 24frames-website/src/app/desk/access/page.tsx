import { redirect } from "next/navigation";
import AccessManager from "@/components/portal/AccessManager";
import { currentAccount } from "@/lib/portal/guard";
import { publicAccount } from "@/lib/portal/types";

export const dynamic = "force-dynamic";

/* Superadmin only: authorise, revoke and review studio desk access. */
export default async function DeskAccessPage() {
  const me = await currentAccount();
  if (!me) redirect("/desk/login");
  if (me.role === "client") redirect("/account");
  if (!me.superadmin) redirect("/desk");
  return <AccessManager me={publicAccount(me)} />;
}
