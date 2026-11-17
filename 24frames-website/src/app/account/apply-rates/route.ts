import { NextResponse } from "next/server";
import { currentAccount } from "@/lib/portal/guard";
import { applyLink, usableLink } from "@/lib/portal/pricelinks";

/* A client who is already signed in opens a custom price link: put them on
   that rate card and take them to their quotations. */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const me = await currentAccount();
  if (!me || me.role !== "client") return NextResponse.redirect(new URL(`/account/login?price=${encodeURIComponent(url.searchParams.get("price") ?? "")}`, url));
  try {
    const link = await usableLink(url.searchParams.get("price"), me.email, me.id);
    if (link && link.id !== me.priceLinkId) await applyLink(me, link);
  } catch (err) {
    console.error("[portal] price link not applied", err);
  }
  return NextResponse.redirect(new URL("/account", url));
}
