import { notFound, redirect } from "next/navigation";
import CommissionStudio from "@/components/studio/CommissionStudio";
import { currentAccount } from "@/lib/portal/guard";
import { getQuote } from "@/lib/portal/store";
import { getConfig } from "@/lib/studio/server/repository";
import { DEFAULT_STUDIO_CONFIG } from "@/lib/commission/defaults";
import { forClient } from "@/lib/portal/types";

export const dynamic = "force-dynamic";

export default async function ClientQuotePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const me = await currentAccount();
  if (!me) redirect(`/account/login?next=/account/quote/${id}`);
  if (me.role !== "client") redirect("/desk");
  const q = await getQuote(id).catch(() => null);
  if (!q || q.clientId !== me.id) notFound();
  const view = forClient(q);
  let storageIssue: string | null = null;
  let config = DEFAULT_STUDIO_CONFIG;
  try {
    config = (await getConfig()).config;
  } catch (err) {
    storageIssue = (err as Error).message;
  }
  return (
    <CommissionStudio
      config={config}
      consultant={me.name}
      storageIssue={storageIssue}
      portal={{
        quoteId: q.id,
        reference: q.reference,
        status: q.status,
        editable: view.editable,
        clientName: me.name,
        initialDraft: q.draft,
      }}
    />
  );
}
