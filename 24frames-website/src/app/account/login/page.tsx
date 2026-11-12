import { redirect } from "next/navigation";
import PortalAuth from "@/components/portal/PortalAuth";
import { currentAccount } from "@/lib/portal/guard";

export const dynamic = "force-dynamic";

export default async function AccountLogin({ searchParams }: { searchParams: Promise<{ next?: string; mode?: string }> }) {
  const me = await currentAccount();
  const { next, mode } = await searchParams;
  if (me) redirect(me.role === "client" ? "/account" : "/desk");
  const safeNext = next && next.startsWith("/account") ? next : "/account";
  return <PortalAuth audience="client" next={safeNext} initialMode={mode === "signup" ? "signup" : "login"} />;
}
