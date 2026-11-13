import { countOwners, createAccount, DuplicateEmailError, findAccountByEmail, getAccess, getAccount, updateAccount } from "@/lib/portal/store";
import { readInvite } from "@/lib/portal/invite";
import { hashPassword, passwordProblem, verifyPassword } from "@/lib/portal/password";
import { PORTAL_COOKIE, portalCookieOptions, signPortal } from "@/lib/portal/session";
import { body, deskAllowed, json, portalError, sameOrigin } from "@/lib/portal/guard";
import { safeEqual } from "@/lib/studio/session";
import type { PortalAccount } from "@/lib/portal/types";

/* Portal sign-in, client sign-up and the one-time founder set-up.
   Failed attempts are throttled per address: 6 failures → 10 minutes. */

const attempts = new Map<string, { count: number; until: number }>();
const MAX_FAILURES = 6;
const LOCKOUT_MS = 10 * 60 * 1000;
const clientKey = (r: Request) =>
  r.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || r.headers.get("x-real-ip") || "local";
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Body = {
  action?: "login" | "signup" | "setup" | "activate";
  location?: string;
  email?: string;
  password?: string;
  name?: string;
  phone?: string;
  pin?: string;
  invite?: string;
};

function home(a: PortalAccount) {
  return a.role === "client" ? "/account" : "/desk";
}

async function signedIn(account: PortalAccount, status = 200) {
  const token = await signPortal(account.id, account.role);
  if (!token) return json({ error: "Sign-in is not configured on this server (STUDIO_SESSION_SECRET)." }, 503);
  const res = json({ ok: true, role: account.role, name: account.name, next: home(account) }, status);
  res.cookies.set(PORTAL_COOKIE, token, portalCookieOptions(account.role));
  return res;
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ error: "Not allowed." }, 403);
  const key = clientKey(request);
  const now = Date.now();
  const state = attempts.get(key);
  if (state && state.until > now) {
    return json({ error: `Too many attempts. Try again in ${Math.ceil((state.until - now) / 60000)} min.` }, 429);
  }
  const fail = (message: string, status = 401) => {
    const count = (state && state.until <= now && state.count >= MAX_FAILURES ? 0 : state?.count ?? 0) + 1;
    attempts.set(key, { count, until: count >= MAX_FAILURES ? now + LOCKOUT_MS : 0 });
    return json({ error: message }, status);
  };

  const b = await body<Body>(request, 4000);
  const email = (b?.email ?? "").trim().toLowerCase();
  const password = b?.password ?? "";

  try {
    if (b?.action === "login") {
      const account = email ? await findAccountByEmail(email) : null;
      const ok = account && account.active && (await verifyPassword(password, account.passwordHash));
      if (!ok || !account) return fail("That email and password don't match.");
      attempts.delete(key);
      if (!(await deskAllowed(account))) {
        return json({ error: "This email no longer has access to the studio desk. Please contact the founder." }, 403);
      }
      await updateAccount(account.id, { lastLoginAt: new Date().toISOString() });
      return signedIn(account);
    }

    if (b?.action === "signup") {
      const name = (b.name ?? "").trim();
      const phone = (b.phone ?? "").trim();
      const location = (b.location ?? "").trim();
      if (name.length < 2) return json({ error: "Please tell us your name." }, 422);
      if (!EMAIL.test(email)) return json({ error: "Please enter a valid email address." }, 422);
      if (!/^[+\d][\d\s-]{6,}$/.test(phone)) return json({ error: "Please enter a valid mobile number." }, 422);
      if (location.length < 2) return json({ error: "Please tell us your city or location." }, 422);
      const problem = passwordProblem(password);
      if (problem) return json({ error: problem }, 422);
      const staff = await getAccess(email);
      if (staff?.active) return json({ error: "This email is authorised for the studio desk — activate it at /desk/login." }, 409);
      // Signed up through a relationship manager's link → they look after this client.
      const invitedBy = await readInvite(b.invite);
      const manager = invitedBy ? await getAccount(invitedBy) : null;
      const managerId = manager && manager.active && manager.role !== "client" && (await deskAllowed(manager)) ? manager.id : null;
      const created = await createAccount({ role: "client", name, email, phone, location, passwordHash: await hashPassword(password), createdBy: managerId });
      const account = managerId ? (await updateAccount(created.id, { managerId })) ?? created : created;
      return signedIn(account, 201);
    }

    if (b?.action === "setup") {
      const pin = process.env.STUDIO_PIN;
      if (!pin || pin.length < 4) return json({ error: "Founder set-up needs STUDIO_PIN to be configured." }, 503);
      if ((await countOwners()) > 0) return json({ error: "The founder account already exists. Sign in instead." }, 409);
      if (!safeEqual((b.pin ?? "").trim(), pin)) return fail("That studio PIN isn't right.");
      const name = (b.name ?? "").trim();
      if (name.length < 2) return json({ error: "Please enter the founder's name." }, 422);
      if (!EMAIL.test(email)) return json({ error: "Please enter a valid email address." }, 422);
      const problem = passwordProblem(password);
      if (problem) return json({ error: problem }, 422);
      attempts.delete(key);
      const account = await createAccount({ role: "owner", name, email, phone: (b.phone ?? "").trim(), superadmin: true, passwordHash: await hashPassword(password), createdBy: null });
      return signedIn(account, 201);
    }

    /* A team member whose email the superadmin has authorised sets their own password. */
    if (b?.action === "activate") {
      const access = EMAIL.test(email) ? await getAccess(email) : null;
      if (!access || !access.active) return fail("This email hasn't been given access to the studio desk. Ask the founder to authorise it.", 403);
      if (await findAccountByEmail(email)) return json({ error: "This email is already activated — sign in instead." }, 409);
      const name = (b.name ?? "").trim() || access.name;
      if (name.length < 2) return json({ error: "Please enter your name." }, 422);
      const problem = passwordProblem(password);
      if (problem) return json({ error: problem }, 422);
      attempts.delete(key);
      const account = await createAccount({ role: access.role, name, email, phone: (b.phone ?? "").trim(), passwordHash: await hashPassword(password), createdBy: access.grantedBy });
      return signedIn(account, 201);
    }

    return json({ error: "Unknown request." }, 400);
  } catch (err) {
    if (err instanceof DuplicateEmailError) return json({ error: "An account with this email already exists. Sign in instead." }, 409);
    return portalError(err);
  }
}

export async function GET() {
  try {
    return json({ ownerExists: (await countOwners()) > 0 });
  } catch (err) {
    return portalError(err);
  }
}

export async function DELETE() {
  const res = json({ ok: true });
  res.cookies.set(PORTAL_COOKIE, "", { ...portalCookieOptions("client"), maxAge: 0 });
  return res;
}
