import { cookies } from "next/headers";
import QuotesGate from "@/components/studio/quotes/QuotesGate";
import QuotesBoard from "@/components/studio/quotes/QuotesBoard";
import { ADMIN_COOKIE, SESSION_COOKIE, sessionSecret, verifyAdmin, verifySession } from "@/lib/studio/session";

export const dynamic = "force-dynamic";

/* /quotes — every submitted quote, for the studio. Asks for the consultant's
   name and the studio PIN; the admin pass lasts 15 minutes. */
export default async function QuotesPage() {
  const secret = sessionSecret();
  const jar = await cookies();
  const session = secret ? await verifySession(jar.get(SESSION_COOKIE)?.value, secret) : null;
  const admin = secret ? await verifyAdmin(jar.get(ADMIN_COOKIE)?.value, secret) : false;
  if (!session || !admin) return <QuotesGate consultant={session?.consultant ?? ""} />;
  return <QuotesBoard consultant={session.consultant} />;
}
