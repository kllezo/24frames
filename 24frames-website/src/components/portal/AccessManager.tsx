"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import cx from "../studio/cinema.module.css";
import base from "../studio/studio.module.css";
import qx from "../studio/quotes/quotes.module.css";
import px from "./portal.module.css";
import DeskTop from "./DeskTop";
import { formatDateLong } from "@/lib/commission/format";
import type { PublicAccount, StaffAccess } from "@/lib/portal/types";

type Entry = StaffAccess & {
  account: { name: string; phone: string; createdAt: string; lastLoginAt: string | null; role: string } | null;
};

const when = (iso: string | null) => (iso ? formatDateLong(iso.slice(0, 10)) : "—");

/* The superadmin's page: authorise an email for the studio desk, revoke
   or restore it, and see who each person is and when they last signed in. */
export default function AccessManager({ me }: { me: PublicAccount }) {
  const [list, setList] = useState<Entry[] | null>(null);
  const [f, setF] = useState({ email: "", name: "", role: "sales", note: "" });
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [filter, setFilter] = useState<"active" | "revoked" | "all">("active");

  const load = useCallback(async () => {
    const res = await fetch("/api/portal/access", { cache: "no-store" }).catch(() => null);
    if (res?.status === 401) return window.location.assign("/desk/login");
    const data = res ? ((await res.json().catch(() => ({}))) as { access?: Entry[]; error?: string }) : {};
    if (res?.ok && data.access) setList(data.access);
    else setMsg({ kind: "err", text: data.error ?? "Could not load the access list." });
  }, []);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  async function grant(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const res = await fetch("/api/portal/access", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) }).catch(() => null);
    const data = res ? ((await res.json().catch(() => ({}))) as { error?: string }) : {};
    setBusy(false);
    if (res?.ok) {
      setMsg({ kind: "ok", text: `${f.email} is authorised. They can now activate their account at /desk/login with this email.` });
      setF({ email: "", name: "", role: "sales", note: "" });
      void load();
    } else setMsg({ kind: "err", text: data.error ?? "Could not authorise that email." });
  }

  async function setActive(entry: Entry, active: boolean) {
    if (!active && !window.confirm(`Revoke desk access for ${entry.name} (${entry.email})? They will be signed out immediately.`)) return;
    const res = await fetch("/api/portal/access", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: entry.email, active }) }).catch(() => null);
    const data = res ? ((await res.json().catch(() => ({}))) as { error?: string }) : {};
    if (res?.ok) {
      setMsg({ kind: "ok", text: active ? `Access restored for ${entry.email}.` : `Access revoked for ${entry.email}.` });
      void load();
    } else setMsg({ kind: "err", text: data.error ?? "That didn't go through." });
  }

  const shown = useMemo(
    () => (list ?? []).filter((e) => filter === "all" || (filter === "active" ? e.active : !e.active)),
    [list, filter],
  );
  const activeCount = (list ?? []).filter((e) => e.active).length;

  return (
    <div className={`${cx.cinema} ${qx.page}`}>
      <DeskTop me={me} current="access" />
      <main className={qx.main}>
        <div className={qx.head}>
          <div>
            <p className={base.kicker}>Superadmin</p>
            <h1 className={qx.title}>
              Who holds a key <em>to the studio desk.</em>
            </h1>
          </div>
          <dl className={qx.stats}>
            <div><dt>Authorised</dt><dd>{list ? activeCount : "—"}</dd></div>
            <div><dt>Revoked</dt><dd>{list ? list.length - activeCount : "—"}</dd></div>
          </dl>
        </div>

        <div className={qx.tools}>
          <div className={px.tabs} role="tablist" aria-label="Filter">
            {(["active", "revoked", "all"] as const).map((k) => (
              <button key={k} role="tab" aria-selected={filter === k} className={`${px.tab} ${filter === k ? px.tabOn : ""}`} onClick={() => setFilter(k)}>
                {{ active: "Authorised", revoked: "Revoked", all: "All" }[k]}
              </button>
            ))}
          </div>
        </div>

        {msg && <p className={msg.kind === "ok" ? px.flash : qx.error} role="status">{msg.text}</p>}

        <div className={px.accessLayout}>
          <div className={px.tableWrap}>
            <table className={px.table}>
              <thead>
                <tr>
                  <th>Person</th>
                  <th>Level</th>
                  <th>Account</th>
                  <th>Access</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {list === null && (
                  <tr><td colSpan={5}>Loading…</td></tr>
                )}
                {list !== null && shown.length === 0 && (
                  <tr><td colSpan={5}>No one here yet. Authorise an email to give someone desk access.</td></tr>
                )}
                {shown.map((e) => (
                  <tr key={e.email} className={e.active ? "" : px.revoked}>
                    <td>
                      <span className={px.cellName}>{e.account?.name ?? e.name}</span>
                      <span className={px.cellSub}>
                        <a href={`mailto:${e.email}`}>{e.email}</a>
                        {e.account?.phone ? <> · <a href={`tel:${e.account.phone}`}>{e.account.phone}</a></> : null}
                      </span>
                      {e.note && <span className={px.cellSub}>{e.note}</span>}
                    </td>
                    <td>{e.role === "owner" ? "Founder level" : "Sales"}</td>
                    <td>
                      {e.account ? (
                        <>
                          Activated {when(e.account.createdAt)}
                          <span className={px.cellSub}>Last in {when(e.account.lastLoginAt)}</span>
                        </>
                      ) : (
                        <span className={px.cellSub}>Not activated yet</span>
                      )}
                    </td>
                    <td>
                      <span className={`${px.chip} ${e.active ? px.chip_approved : px.chip_rejected}`}>{e.active ? "Authorised" : "Revoked"}</span>
                      <span className={px.cellSub}>
                        {e.active ? `By ${e.grantedBy} · ${when(e.grantedAt)}` : `By ${e.revokedBy ?? "—"} · ${when(e.revokedAt)}`}
                      </span>
                    </td>
                    <td>
                      {e.active ? (
                        <button className={base.btnGhost} onClick={() => setActive(e, false)}>Revoke</button>
                      ) : (
                        <button className={base.btnSecondary} onClick={() => setActive(e, true)}>Restore</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <form className={px.teamForm} onSubmit={grant}>
            <p className={base.kicker}>Authorise an email</p>
            <label className={cx.lux}>
              <input type="email" value={f.email} onChange={(e) => setF((v) => ({ ...v, email: e.target.value }))} placeholder=" " required autoComplete="off" />
              <span>Email</span>
            </label>
            <label className={cx.lux}>
              <input value={f.name} onChange={(e) => setF((v) => ({ ...v, name: e.target.value }))} placeholder=" " required autoComplete="off" />
              <span>Name</span>
            </label>
            <label className={cx.lux}>
              <input value={f.note} onChange={(e) => setF((v) => ({ ...v, note: e.target.value }))} placeholder=" " maxLength={300} autoComplete="off" />
              <span>Note (optional) — e.g. Vijayawada sales</span>
            </label>
            <div className={base.segmented} role="radiogroup" aria-label="Level">
              {(["sales", "owner"] as const).map((r) => (
                <button key={r} type="button" className={f.role === r ? base.segOn : ""} onClick={() => setF((v) => ({ ...v, role: r }))}>
                  {r === "sales" ? "Sales team" : "Founder level"}
                </button>
              ))}
            </div>
            <button className={base.btnPrimary} disabled={busy}>{busy ? "Authorising…" : "Give access"}</button>
            <p className={qx.fine}>
              They activate their own account at /desk/login → &ldquo;First time here?&rdquo; with this exact email. Founder level can approve
              quotations; only you manage access.
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}
