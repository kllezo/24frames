import { listStaff } from "@/lib/portal/store";
import { deskAllowed, json, portalError, requireRole } from "@/lib/portal/guard";

/* The team members a client can be assigned to (active, with desk access). */
export async function GET() {
  const me = await requireRole("owner", "sales");
  if (me instanceof Response) return me;
  try {
    const staff = [];
    for (const a of await listStaff()) {
      if (a.active && (await deskAllowed(a))) staff.push({ id: a.id, name: a.name, role: a.role, phone: a.phone, email: a.email });
    }
    return json({ staff });
  } catch (err) {
    return portalError(err);
  }
}
