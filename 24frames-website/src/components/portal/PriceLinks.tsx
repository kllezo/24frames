"use client";

import { useCallback, useEffect, useState } from "react";
import cx from "../studio/cinema.module.css";
import base from "../studio/studio.module.css";
import qx from "../studio/quotes/quotes.module.css";
import ix from "./insights.module.css";
import DeskTop from "./DeskTop";
import { formatDateLong } from "@/lib/commission/format";
import { rateLabel } from "@/lib/portal/pricing";
import { formatINR } from "@/lib/commission/format";
import type { PriceLink, PublicAccount } from "@/lib/portal/types";

type Link = PriceLink & { url: string };
type Svc = { id: string; name: string; price: number };

/* Custom price links: for a client who can invest more (or deserves a
   gesture), set a rate card and share the link. Whoever signs up — or
   signs in — through it sees those prices everywhere, every time; the
   studio's normal rates never reach them. */
export default function PriceLinks({ me, services }: { me: PublicAccount; services: Svc[] }) {
  const [links, setLinks] = useState<Link[] | null>(null);
  const [label, setLabel] = useState("");
  const [mode, setMode] = useState<"percent" | "exact">("percent");
  const [percent, setPercent] = useState("15");
  const [prices, setPrices] = useState<Record<string, string>>({});
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
      body: JSON.stringify(
        mode === "exact"
          ? { mode, label, prices: Object.fromEntries(Object.entries(prices).filter(([, v]) => v.trim() !== "").map(([k, v]) => [k, Number(v.replace(/[^\d.]/g, ""))])) }
          : { mode, label, percent: Number(percent) },
      ),
    }).catch(() => null);
    const d = res ? ((await res.json().catch(() => ({}))) as { link?: Link; error?: string }) : {};
    if (res?.ok && d.link) {
      setLabel("");
      setPrices({});
      await load();
      await copy(d.link.url);
    } else setMsg({ ok: false, text: d.error ?? "Could not create the link." });
  }

  async function toggle(l: Link) {
    await fetch("/api/portal/pricelinks", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: l.id, active: !l.active }) }).catch(() => null);
    void load();
  }

  const pct = Number(percent);
  const changed = services.filter((s) => {
    const v = (prices[s.id] ?? "").replace(/[^\d.]/g, "");
    return v !== "" && Number(v) !== s.price;
  }).length;
  const ready = !!label.trim() && (mode === "exact" ? changed > 0 : Number.isFinite(pct) && pct !== 0);
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
              <div className={ix.seg} role="tablist" aria-label="How to set the prices">
                <button role="tab" aria-selected={mode === "percent"} className={mode === "percent" ? ix.segOn : ""} onClick={() => setMode("percent")}>
                  % on normal rates
                </button>
                <button role="tab" aria-selected={mode === "exact"} className={mode === "exact" ? ix.segOn : ""} onClick={() => setMode("exact")}>
                  Exact prices
                </button>
              </div>
              <div className={ix.formRow}>
                {mode === "percent" && (
                  <label>
                    Adjustment on normal rates (%)
                    <input inputMode="decimal" value={percent} onChange={(e) => setPercent(e.target.value)} />
                  </label>
                )}
              </div>
              {mode === "exact" && (
                <div className={ix.priceTable}>
                  <div className={ix.priceHead}>
                    <span>Service · per professional, per event</span>
                    <span>Normal</span>
                    <span>For this client</span>
                  </div>
                  {services.map((s) => (
                    <label key={s.id} className={ix.priceRow}>
                      <span>{s.name}</span>
                      <span className={ix.priceStd}>{formatINR(s.price)}</span>
                      <input
                        inputMode="numeric"
                        placeholder={String(s.price)}
                        value={prices[s.id] ?? ""}
                        onChange={(e) => setPrices((p) => ({ ...p, [s.id]: e.target.value }))}
                        aria-label={`Price of ${s.name} for this client`}
                      />
                    </label>
                  ))}
                </div>
              )}
              <p className={ix.panelNote}>
                {mode === "exact"
                  ? changed
                    ? `${changed} service${changed === 1 ? "" : "s"} repriced; everything left blank stays at the normal rate.`
                    : "Type the price you want for any service — leave the rest blank to keep the normal rate."
                  : Number.isFinite(pct) && pct !== 0
                    ? `A ₹1,00,000 package becomes ₹${Math.round(100000 * (1 + pct / 100)).toLocaleString("en-IN")} for this client.`
                    : "Enter a percentage — positive for a premium, negative for a gesture."}{" "}
                Leads who sign up through your link are assigned to you.
              </p>
              <button className={base.btnPrimary} onClick={create} disabled={!ready}>
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
                  {l.label} <span className={`${ix.pill} ${ix.pillGold}`}>{rateLabel(l)}</span>
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
                  {(() => {
                    const n = l.usedByIds?.length ?? (l.usedBy ? 1 : 0);
                    return n === 0 ? " · not used yet" : n === 1 ? ` · used by ${l.usedByName}` : ` · used by ${n} accounts, latest ${l.usedByName}`;
                  })()}
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
