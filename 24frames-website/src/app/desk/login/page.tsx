import { redirect } from "next/navigation";
import PortalAuth from "@/components/portal/PortalAuth";
import { currentAccount } from "@/lib/portal/guard";
import { countOwners } from "@/lib/portal/store";

export const dynamic = "force-dynamic";

export default async function DeskLogin() {
  const me = await currentAccount();
  if (me) redirect(me.role === "client" ? "/account" : "/desk");
  let ownerExists = true;
  let issue: string | null = null;
  try {
    ownerExists = (await countOwners()) > 0;
  } catch (err) {
    issue = (err as Error).message;
  }
  return <PortalAuth audience="staff" next="/desk" initialMode={ownerExists ? "login" : "setup"} storageIssue={issue} />;
}
