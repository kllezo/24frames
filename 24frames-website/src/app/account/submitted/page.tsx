import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Submitted from "@/components/portal/Submitted";
import { currentAccount } from "@/lib/portal/guard";
import { listQuotesForClient, managerCard } from "@/lib/portal/store";
import { coupleNames } from "@/lib/commission/model";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Thank you — 24 Frames", robots: { index: false, follow: false } };

/* The moment after a couple sends their quotation: a calm thank-you with
   the reference, what happens next, and their relationship manager. */
export default async function SubmittedPage({ searchParams }: { searchParams: Promise<{ ref?: string; changes?: string }> }) {
  const me = await currentAccount();
  if (!me) redirect("/account/login");
  if (me.role !== "client") redirect("/desk");
  const { ref, changes } = await searchParams;
  const quote = ref ? (await listQuotesForClient(me.id).catch(() => [])).find((q) => q.reference === ref) : undefined;
  if (!quote) redirect("/account");
  const manager = await managerCard(me.managerId).catch(() => null);
  return (
    <Submitted
      first={me.name.split(" ")[0]}
      couple={coupleNames(quote.draft.couple, "")}
      reference={quote.reference}
      estimate={quote.quote.grandTotal}
      events={quote.draft.events.length}
      changes={changes === "1"}
      manager={manager}
    />
  );
}
