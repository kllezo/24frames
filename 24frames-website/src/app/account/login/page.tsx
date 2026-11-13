import { redirect } from "next/navigation";
import PortalAuth from "@/components/portal/PortalAuth";
import { currentAccount } from "@/lib/portal/guard";

export const dynamic = "force-dynamic";

export default async function AccountLogin({ searchParams }: { searchParams: Promise<{ next?: string; mode?: string; invite?: string }> }) {
  const me = await currentAccount();
  const { next, mode, invite } = await searchParams;
  if (me) redirect(me.role === "client" ? "/account" : "/desk");
  const safeNext = next && next.startsWith("/account") ? next : "/account";
  const token = typeof invite === "string" && invite.length < 400 ? invite : null;
  return <PortalAuth audience="client" next={safeNext} initialMode={mode === "signup" || token ? "signup" : "login"} invite={token} />;
}
