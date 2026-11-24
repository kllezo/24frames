import { redirect } from "next/navigation";
import PortalAuth from "@/components/portal/PortalAuth";
import { currentAccount } from "@/lib/portal/guard";
import { linkProblem } from "@/lib/portal/pricelinks";

export const dynamic = "force-dynamic";

export default async function AccountLogin({ searchParams }: { searchParams: Promise<{ next?: string; mode?: string; invite?: string; price?: string }> }) {
  const me = await currentAccount();
  const { next, mode, invite, price } = await searchParams;
  const priceToken = typeof price === "string" && /^[\w-]{10,60}$/.test(price) ? price : null;
  // A signed-in client opening a price link is moved onto that rate card straight away.
  if (me && me.role === "client" && priceToken) redirect(`/account/apply-rates?price=${priceToken}`);
  // Someone signed in to the team desk opening a client's price link: say why it won't apply, instead of bouncing to the desk.
  if (me && me.role !== "client" && !priceToken) redirect("/desk");
  if (me && me.role === "client") redirect("/account");
  const priceProblem =
    me && priceToken
      ? "You're signed in to the team desk, so this client price link can't be applied to you. Send it to the couple — or open it in a private window to test it."
      : await linkProblem(priceToken).catch(() => null);
  const safeNext = next && next.startsWith("/account") ? next : "/account";
  const token = typeof invite === "string" && invite.length < 400 ? invite : null;
  return <PortalAuth audience="client" next={safeNext} initialMode={mode === "signup" || token || priceToken ? "signup" : "login"} invite={token} price={priceProblem ? null : priceToken} priceProblem={priceProblem} />;
}
