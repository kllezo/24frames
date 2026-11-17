import { redirect } from "next/navigation";
import PortalAuth from "@/components/portal/PortalAuth";
import { currentAccount } from "@/lib/portal/guard";

export const dynamic = "force-dynamic";

export default async function AccountLogin({ searchParams }: { searchParams: Promise<{ next?: string; mode?: string; invite?: string; price?: string }> }) {
  const me = await currentAccount();
  const { next, mode, invite, price } = await searchParams;
  const priceToken = typeof price === "string" && /^[\w-]{10,60}$/.test(price) ? price : null;
  // A signed-in client opening a price link is moved onto that rate card straight away.
  if (me && me.role === "client" && priceToken) redirect(`/account/apply-rates?price=${priceToken}`);
  if (me) redirect(me.role === "client" ? "/account" : "/desk");
  const safeNext = next && next.startsWith("/account") ? next : "/account";
  const token = typeof invite === "string" && invite.length < 400 ? invite : null;
  return <PortalAuth audience="client" next={safeNext} initialMode={mode === "signup" || token ? "signup" : "login"} invite={token} price={priceToken} />;
}
