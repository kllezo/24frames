"use client";

import { useCallback, useEffect, useState } from "react";
import cx from "../studio/cinema.module.css";
import base from "../studio/studio.module.css";
import qx from "../studio/quotes/quotes.module.css";
import ix from "./insights.module.css";
import DeskTop from "./DeskTop";
import { formatDateLong } from "@/lib/commission/format";
import { factorLabel } from "@/lib/portal/pricing";
import type { PriceLink, PublicAccount } from "@/lib/portal/types";

type Link = PriceLink & { url: string };

/* Custom price links: for a client who can invest more (or deserves a
   gesture), set a rate card and share the link. Whoever signs up — or
   signs in — through it sees those prices everywhere, every time; the
   studio's normal rates never reach them. */
export default function PriceLinks({ me }: { me: PublicAccount }) {
  const [links, setLinks] = useState<Link[] | null>(null);
  const [label, setLabel] = useState("");
  const [percent, setPercent] = useState("15");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/portal/pricelinks", { cache: "no-store" }).catch(() => null);
    if (res?.status === 401) return window.location.assign("/desk/login");
    const d = res?.ok ? ((await res.json()) as { links: Link[] }) : { links: [] };
    setLinks(d.links);
  }, []);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  async function copy(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      setMsg({ ok: true, text: "Link copied — share it with the client on WhatsApp or email." });
    } catch {
      window.prompt("Custom price link", url);
    }
  }

  async function create() {
    setMsg(null);
    const res = await fetch("/api/portal/pricelinks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label, percent: Number(percent), email }),
    }).catch(() => null);
    const d = res ? ((await res.json().catch(() => ({}))) as { link?: Link; error?: string }) : {};
    if (res?.ok && d.link) {
      setLabel("");
      setEmail("");
      await load();
      await copy(d.link.url);
    } else setMsg({ ok: false, text: d.error ?? "Could not create the link." });
  }

  async function toggle(l: Link) {
    await fetch("/api/portal/pricelinks", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: l.id, active: !l.active }) }).catch(() => null);
    void load();
  }

  const pct = Number(percent);
  return (
    <div className={`${cx.cinema} ${qx.page}`}>
      <DeskTop me={me} current="links" />
      <main className={qx.main}>
        <section className={ix.hero}>
          <p className={ix.heroKicker}>Custom price links</p>
          <h1 className={ix.heroTitle}>
            A rate card <em>made for one client.</em>
          </h1>
          <p className={ix.heroLine}>
            When you know a client can invest more — or deserves a gesture — set their rates and share the link. They sign up or sign in through it and
            are priced on that card from then on: every visit, every new quotation, every redo. They never see the studio&apos;s normal rates, and the
            link names nothing in its address.
          </p>
        </section>

        <div className={ix.grid2}>
          <section className={ix.panel}>
            <div className={ix.panelHead}>
              <h2 className={ix.panelTitle}>Create a link</h2>
            </div>
            <div className={ix.form}>
              <label>
                For
                <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. Reddy family — destination wedding" maxLength={80} />
              </label>
              <div className={ix.formRow}>
                <label>
                  Adjustment on normal rates (%)
                  <input inputMode="decimal" value={percent} onChange={(e) => setPercent(e.target.value)} />
                </label>
                <label>
                  Only for this email (optional)
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="client@example.com" />
                </label>
              </div>
              <p className={ix.panelNote}>
                {Number.isFinite(pct) && pct !== 0
                  ? `A ₹1,00,000 package becomes ₹${Math.round(100000 * (1 + pct / 100)).toLocaleString("en-IN")} for this client.`
                  : "Enter a percentage — positive for a premium, negative for a gesture."}{" "}
                Leads who sign up through your link are assigned to you.
              </p>
              <button className={base.btnPrimary} onClick={create} disabled={!label.trim() || !Number.isFinite(pct) || pct === 0}>
                Create & copy link
              </button>
              {msg && <p className={msg.ok ? ix.msgOk : ix.msgErr}>{msg.text}</p>}
            </div>
          </section>
          <section className={ix.panel}>
            <div className={ix.panelHead}>
              <h2 className={ix.panelTitle}>How it works for the client</h2>
            </div>
            <ul className={ix.list}>
              <li>
                <span className={ix.listTitle}>They open your link</span>
                <span className={ix.listSub}>It lands on the client sign-in — new clients create an account, existing ones simply sign in.</span>
              </li>
              <li>
                <span className={ix.listTitle}>Their rate card is attached to their account</span>
                <span className={ix.listSub}>Every quotation they start, reopen or redo is priced on it — on any device, from then on.</span>
              </li>
              <li>
                <span className={ix.listTitle}>You can change it later</span>
                <span className={ix.listSub}>Adjust or remove a client&apos;s rates from their page in Clients.</span>
              </li>
            </ul>
          </section>
        </div>

        <section className={`${ix.panel} ${ix.panelWide}`}>
          <div className={ix.panelHead}>
            <h2 className={ix.panelTitle}>{me.role === "owner" ? "All links" : "Your links"}</h2>
            <span className={ix.panelNote}>{links?.length ?? 0}</span>
          </div>
          {links && links.length === 0 && <p className={ix.empty}>No links yet.</p>}
          <ul className={ix.list}>
            {links?.map((l) => (
              <li key={l.id} style={l.active ? undefined : { opacity: 0.55 }}>
                <span className={ix.listTitle}>
                  {l.label} <span className={`${ix.pill} ${ix.pillGold}`}>{factorLabel(l.factor)}</span>
                </span>
                <span className={ix.listActions}>
                  {l.active && (
                    <button className={base.btnSecondary} onClick={() => copy(l.url)}>
                      Copy link
                    </button>
                  )}
                  <button className={base.btnGhost} onClick={() => toggle(l)}>
                    {l.active ? "Switch off" : "Switch on"}
                  </button>
                </span>
                <span className={ix.listSub}>
                  By {l.createdByName} · {formatDateLong(l.createdAt.slice(0, 10))}
                  {l.email ? ` · only for ${l.email}` : ""}
                  {l.usedByName ? ` · used by ${l.usedByName}` : " · not used yet"}
                  <span className={ix.linkUrl}>{l.url}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
