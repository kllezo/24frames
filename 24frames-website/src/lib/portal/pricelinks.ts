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

/** The link a token names, if it is valid and switched on. A link works for
    anyone who opens it — any number of accounts, on any email or phone. */
export async function usableLink(token: string | null | undefined): Promise<PriceLink | null> {
  if (!token || token.length > 60 || !/^[\w-]+$/.test(token)) return null;
  const link = await getDoc<PriceLink>("pricelink", token);
  if (!link || !link.active) return null;
  return link;
}

/** Why a link can't be used, in the couple's words — null when it can (or the email isn't known yet). */
export async function linkProblem(token: string | null | undefined): Promise<string | null> {
  if (!token) return null;
  const link = token.length <= 60 && /^[\w-]+$/.test(token) ? await getDoc<PriceLink>("pricelink", token) : null;
  if (!link) return "This personal price link isn't valid. Please ask 24 Frames to send it again.";
  if (!link.active) return "This personal price link has been switched off. Please ask 24 Frames for a new one.";
  return null;
}

/** Put a client on a link's rate card and re-price the quotations they can still edit. */
export async function applyLink(account: PortalAccount, link: PriceLink): Promise<PortalAccount> {
  const creator = await getAccount(link.createdById);
  const patch: Partial<PortalAccount> = { priceFactor: cleanFactor(link.factor), priceOverrides: link.prices ?? null, priceLinkId: link.id };
  if (!account.managerId && creator && creator.active && creator.role !== "client") patch.managerId = creator.id;
  if (!account.source || account.source === "website") patch.source = "price_link";
  const next = (await updateAccount(account.id, patch)) ?? { ...account, ...patch };
  const now = new Date().toISOString();
  const ids = Array.from(new Set([...(link.usedByIds ?? (link.usedBy ? [link.usedBy] : [])), account.id]));
  await putDoc<PriceLink>("pricelink", { ...link, usedBy: account.id, usedByName: account.name, usedAt: link.usedAt ?? now, usedByIds: ids });
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
