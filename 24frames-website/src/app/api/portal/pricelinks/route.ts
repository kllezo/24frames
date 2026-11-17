import { body, json, portalError, requireRole, sameOrigin } from "@/lib/portal/guard";
import { getDoc, listDocs, putDoc } from "@/lib/portal/store";
import { cleanFactor } from "@/lib/portal/pricing";
import { newLinkId } from "@/lib/portal/pricelinks";
import type { PriceLink } from "@/lib/portal/types";

/* Custom price links. The founder sees every link; a salesperson sees the
   links they made. Each link carries a rate card (a percentage on the
   studio's normal rates) and can be limited to one email. */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const urlFor = (request: Request, id: string) => `${request.headers.get("origin") || new URL(request.url).origin}/account/login?price=${id}`;

export async function GET(request: Request) {
  const me = await requireRole("owner", "sales");
  if (me instanceof Response) return me;
  try {
    const links = (await listDocs<PriceLink>("pricelink"))
      .filter((l) => me.role === "owner" || l.createdById === me.id)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .map((l) => ({ ...l, url: urlFor(request, l.id) }));
    return json({ links });
  } catch (err) {
    return portalError(err);
  }
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ error: "Not allowed." }, 403);
  const me = await requireRole("owner", "sales");
  if (me instanceof Response) return me;
  const b = await body<{ percent?: number; label?: string; email?: string }>(request, 2000);
  const pct = Number(b?.percent);
  if (!Number.isFinite(pct) || pct < -50 || pct > 200) return json({ error: "Enter an adjustment between −50% and +200%." }, 422);
  const factor = cleanFactor(1 + pct / 100);
  if (!factor) return json({ error: "Choose an adjustment other than 0% — that is the normal rate card." }, 422);
  const label = (b?.label ?? "").trim().slice(0, 80);
  if (label.length < 2) return json({ error: "Name the client or occasion this link is for." }, 422);
  const email = (b?.email ?? "").trim().toLowerCase();
  if (email && !EMAIL.test(email)) return json({ error: "Enter a valid email, or leave it blank." }, 422);
  try {
    const link: PriceLink = {
      id: newLinkId(),
      factor,
      label,
      email: email || null,
      createdById: me.id,
      createdByName: me.name,
      createdAt: new Date().toISOString(),
      usedBy: null,
      usedByName: null,
      usedAt: null,
      active: true,
    };
    await putDoc("pricelink", link);
    return json({ link: { ...link, url: urlFor(request, link.id) } }, 201);
  } catch (err) {
    return portalError(err);
  }
}

/* Switch a link off (or back on). */
export async function PATCH(request: Request) {
  if (!sameOrigin(request)) return json({ error: "Not allowed." }, 403);
  const me = await requireRole("owner", "sales");
  if (me instanceof Response) return me;
  const b = await body<{ id?: string; active?: boolean }>(request, 1000);
  if (!b?.id || typeof b.active !== "boolean") return json({ error: "Missing details." }, 400);
  try {
    const link = await getDoc<PriceLink>("pricelink", b.id);
    if (!link || (me.role !== "owner" && link.createdById !== me.id)) return json({ error: "Link not found." }, 404);
    const next = await putDoc("pricelink", { ...link, active: b.active });
    return json({ link: { ...next, url: urlFor(request, next.id) } });
  } catch (err) {
    return portalError(err);
  }
}
