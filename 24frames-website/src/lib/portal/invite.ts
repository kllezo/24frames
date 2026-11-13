/* Client invite links. A relationship manager shares their personal link
   with a new lead; whoever signs up through it is looked after by that
   manager from the first minute. The token only names the manager (no
   personal details travel in the URL) and is signed, so it can't be forged. */

import { sessionSecret, signToken, verifyToken } from "@/lib/studio/session";

interface InviteToken {
  k: "invite";
  rm: string;
  iat: number;
}

const INVITE_TTL_MS = 180 * 24 * 60 * 60 * 1000;

export async function signInvite(managerId: string): Promise<string | null> {
  const secret = sessionSecret();
  if (!secret) return null;
  return signToken({ k: "invite", rm: managerId, iat: Date.now() } satisfies InviteToken, secret);
}

/** The manager id an invite names, or null when it is invalid or expired. */
export async function readInvite(token: string | undefined | null): Promise<string | null> {
  const secret = sessionSecret();
  if (!secret || !token || token.length > 400) return null;
  const t = await verifyToken<InviteToken>(token, secret);
  if (!t || t.k !== "invite" || typeof t.rm !== "string") return null;
  if (Date.now() - t.iat > INVITE_TTL_MS) return null;
  return t.rm;
}
