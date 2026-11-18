/* Custom price links: a team member sets a rate card for a client they
   know, shares the link, and whoever signs up or signs in through it is
   priced on that card from then on — on every visit and every new
   quotation. */

import { randomBytes } from "node:crypto";
import { getConfig } from "@/lib/studio/server/repository";
import { getAccount, getDoc, listQuotesForClient, mutateQuote, putDoc, updateAccount } from "./store";
import { prepareClientDraft } from "./drafts";
import { cleanFactor, configFor } from "./pricing";
import type { PortalAccount, PriceLink } from "./types";

export const newLinkId = () => randomBytes(18).toString("base64url");

/** The link a token names, if it may still be used by this email. */
export async function usableLink(token: string | null | undefined, email: string, accountId: string | null = null): Promise<PriceLink | null> {
  if (!token || token.length > 60 || !/^[\w-]+$/.test(token)) return null;
  const link = await getDoc<PriceLink>("pricelink", token);
  if (!link || !link.active) return null;
  if (link.email && link.email !== email.trim().toLowerCase()) return null;
  if (link.usedBy && link.usedBy !== accountId) return null;
  return link;
}

/** Put a client on a link's rate card and re-price the quotations they can still edit. */
export async function applyLink(account: PortalAccount, link: PriceLink): Promise<PortalAccount> {
  const creator = await getAccount(link.createdById);
  const patch: Partial<PortalAccount> = { priceFactor: cleanFactor(link.factor), priceOverrides: link.prices ?? null, priceLinkId: link.id };
  if (!account.managerId && creator && creator.active && creator.role !== "client") patch.managerId = creator.id;
  if (!account.source || account.source === "website") patch.source = "price_link";
  const next = (await updateAccount(account.id, patch)) ?? { ...account, ...patch };
  const now = new Date().toISOString();
  await putDoc<PriceLink>("pricelink", { ...link, usedBy: account.id, usedByName: account.name, usedAt: link.usedAt ?? now });
  const config = configFor((await getConfig()).config, next);
  for (const q of await listQuotesForClient(account.id)) {
    if (q.status !== "draft" && q.status !== "submitted") continue;
    await mutateQuote(q.id, (cur) => {
      const { draft, quote } = prepareClientDraft(cur.draft, config);
      return { ...cur, draft, quote, configVersion: config.version, managerId: cur.managerId ?? patch.managerId ?? null, updatedAt: now };
    });
  }
  return next;
}
