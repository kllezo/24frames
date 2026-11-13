import { getAccount } from "@/lib/portal/store";
import { deskAllowed, json, portalError, requireRole } from "@/lib/portal/guard";
import { readInvite, signInvite } from "@/lib/portal/invite";

/* GET  ?token=…  → who the invite is from (public; shown on the sign-up page)
   POST           → the signed-in team member's personal client link */

export async function GET(request: Request) {
  try {
    const id = await readInvite(new URL(request.url).searchParams.get("token"));
    const m = id ? await getAccount(id) : null;
    if (!m || !m.active || m.role === "client" || !(await deskAllowed(m))) return json({ error: "This invitation link is no longer valid." }, 404);
    return json({ manager: { name: m.name } });
  } catch (err) {
    return portalError(err);
  }
}

export async function POST(request: Request) {
  const me = await requireRole("owner", "sales");
  if (me instanceof Response) return me;
  const token = await signInvite(me.id);
  if (!token) return json({ error: "Invites need STUDIO_SESSION_SECRET to be configured." }, 503);
  const origin = request.headers.get("origin") || new URL(request.url).origin;
  return json({ url: `${origin}/account/login?invite=${encodeURIComponent(token)}` });
}
