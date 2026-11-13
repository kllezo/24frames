"use client";

import { useEffect, useMemo, useState } from "react";
import cx from "../studio/cinema.module.css";
import base from "../studio/studio.module.css";
import qx from "../studio/quotes/quotes.module.css";
import px from "./portal.module.css";
import DeskTop from "./DeskTop";
import { formatDateLong, formatINR, plural } from "@/lib/commission/format";
import { coupleNames, eventDisplayName } from "@/lib/commission/model";
import type { StudioConfig } from "@/lib/commission/types";
import type { PortalQuote, PublicAccount } from "@/lib/portal/types";

type Bucket = "current" | "future" | "past";

const SECTIONS: { id: Bucket; title: string; line: string }[] = [
  { id: "current", title: "Current", line: "Celebrating now or within the next 30 days — crews, call sheets and final calls." },
  { id: "future", title: "Future", line: "Booked and coming up — keep in touch, confirm details as dates near." },
  { id: "past", title: "Past", line: "Celebrations we've filmed — deliveries, albums, reviews and referrals." },
];

const WINDOW_DAYS = 30;
const todayISO = () => new Date().toISOString().slice(0, 10);
const addDays = (iso: string, d: number) => {
  const t = new Date(`${iso}T00:00:00Z`);
  t.setUTCDate(t.getUTCDate() + d);
  return t.toISOString().slice(0, 10);
};
const daysBetween = (a: string, b: string) => Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86400000);

/** First and last celebration date (falling back to the wedding date). */
function span(q: PortalQuote) {
  const dates = q.draft.events.map((e) => e.date).filter(Boolean).sort();
  const wedding = q.draft.couple.weddingDate || "";
  const first = dates[0] || wedding;
  const last = dates[dates.length - 1] || wedding;
  return { first, last };
}

function bucketOf(q: PortalQuote, today: string): Bucket {
  const { first, last } = span(q);
  if (!first) return "future"; // date to be confirmed
  if (last < today) return "past";
  if (first <= addDays(today, WINDOW_DAYS)) return "current";
  return "future";
}

/* Converted clients: every accepted quotation, grouped by where the
   celebration sits in time — current, future and past. */
export default function ConvertedClients({ me, config }: { me: PublicAccount; config: StudioConfig }) {
  const [quotes, setQuotes] = useState<PortalQuote[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mine, setMine] = useState(false);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<Bucket>("current");

  useEffect(() => {
    let alive = true;
    (async () => {
      const res = await fetch("/api/portal/quotes", { cache: "no-store" }).catch(() => null);
      if (res?.status === 401) return window.location.assign("/desk/login");
      const data = res ? ((await res.json().catch(() => ({}))) as { quotes?: PortalQuote[]; error?: string }) : {};
      if (!alive) return;
      if (res?.ok && data.quotes) setQuotes(data.quotes.filter((q) => q.status === "accepted"));
      else setError(data.error ?? "Could not load converted clients.");
    })();
    return () => {
      alive = false;
    };
  }, []);

  const today = todayISO();
  const grouped = useMemo(() => {
    const t = search.trim().toLowerCase();
    const g: Record<Bucket, PortalQuote[]> = { current: [], future: [], past: [] };
    for (const q of quotes ?? []) {
      if (mine && q.managerId !== me.id) continue;
      if (t && ![q.reference, q.clientName, q.clientPhone, q.clientEmail, coupleNames(q.draft.couple, "")].join(" ").toLowerCase().includes(t)) continue;
      g[bucketOf(q, today)].push(q);
    }
    const by = (a: PortalQuote, b: PortalQuote) => (span(a).first || "9999").localeCompare(span(b).first || "9999");
    g.current.sort(by);
    g.future.sort(by);
    g.past.sort((a, b) => by(b, a)); // most recent first
    return g;
  }, [quotes, mine, search, me.id, today]);

  const value = (qs: PortalQuote[]) => qs.reduce((n, q) => n + (q.finalPrice ?? q.quote.grandTotal), 0);
  const section = SECTIONS.find((s) => s.id === tab)!;
  const rows = grouped[tab];

  return (
    <div className={`${cx.cinema} ${qx.page}`}>
      <DeskTop me={me} current="converted" />
      <main className={qx.main}>
        <div className={qx.head}>
          <div>
            <p className={base.kicker}>Converted clients</p>
            <h1 className={qx.title}>
              Every couple who <em>said yes.</em>
            </h1>
          </div>
          <dl className={qx.stats}>
            <div><dt>Converted</dt><dd>{quotes ? quotes.length : "—"}</dd></div>
            <div><dt>Booked value</dt><dd>{quotes ? formatINR(value(quotes)) : "—"}</dd></div>
            <div><dt>Next 30 days</dt><dd>{quotes ? grouped.current.length : "—"}</dd></div>
          </dl>
        </div>

        <div className={qx.tools}>
          <div className={px.tabs} role="tablist" aria-label="When">
            {SECTIONS.map((s) => (
              <button key={s.id} role="tab" aria-selected={tab === s.id} className={`${px.tab} ${tab === s.id ? px.tabOn : ""}`} onClick={() => setTab(s.id)}>
                {s.title}
                {grouped[s.id].length ? <span className={px.tabCount}>{grouped[s.id].length}</span> : null}
              </button>
            ))}
          </div>
          <label className={px.mineToggle}>
            <input type="checkbox" checked={mine} onChange={(e) => setMine(e.target.checked)} />
            <span>Only my clients</span>
          </label>
          <input className={px.searchInput} type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search couple, client or reference" aria-label="Search converted clients" />
        </div>

        {error && <p className={qx.error} role="alert">{error}</p>}

        <section className={px.convSection}>
          <div className={px.convHead}>
            <h2 className={px.convTitle}>{section.title}</h2>
            <p className={qx.fine}>
              {section.line} {rows.length > 0 && <b>{plural(rows.length, "client")} · {formatINR(value(rows))}</b>}
            </p>
          </div>
          {quotes === null && !error && <p className={qx.fine}>Loading…</p>}
          {quotes !== null && rows.length === 0 && <p className={px.convEmpty}>No {section.title.toLowerCase()} celebrations{mine ? " for your clients" : ""}.</p>}
          <ul className={px.convList}>
            {rows.map((q) => {
              const { first, last } = span(q);
              const until = first ? daysBetween(today, first) : null;
              const when =
                !first ? "Date to be confirmed"
                : first === last ? formatDateLong(first)
                : `${formatDateLong(first)} – ${formatDateLong(last)}`;
              const badge =
                tab === "past" ? (last ? `${daysBetween(last, today)} days ago` : "")
                : until === null ? "Date TBC"
                : until <= 0 ? "Underway"
                : until === 1 ? "Tomorrow"
                : `In ${until} days`;
              const wa = q.clientPhone.replace(/[^\d]/g, "");
              return (
                <li key={q.id} className={px.convCard}>
                  <div className={px.convMain}>
                    <p className={px.cardRef}>{q.reference} · {q.draft.couple.city || "City TBC"}</p>
                    <h3 className={px.cardTitle}>{coupleNames(q.draft.couple, q.clientName)}</h3>
                    <p className={px.convWhen}>{when}</p>
                    <p className={px.cardEvents}>
                      {q.draft.events.map((e) => eventDisplayName(e, config)).join(" · ") || "No occasions"} · {plural(q.quote.totalProfessionals, "professional")}
                    </p>
                    <p className={px.convContact}>
                      {q.clientName}
                      {q.clientPhone && <> · <a href={`tel:${q.clientPhone}`}>{q.clientPhone}</a></>}
                      {wa && <> · <a href={`https://wa.me/${wa}`} target="_blank" rel="noreferrer">WhatsApp</a></>}
                      {" "}· RM {q.managerName ?? "not assigned"}
                    </p>
                  </div>
                  <div className={px.convSide}>
                    <span className={`${px.convBadge} ${px[`convBadge_${tab}`] ?? ""}`}>{badge}</span>
                    <p className={px.cardPrice}>
                      {formatINR(q.finalPrice ?? q.quote.grandTotal)}
                      <small>Booked</small>
                    </p>
                    <a className={base.btnSecondary} href={`/desk?q=${q.id}`} data-no-transition>
                      Open quotation
                    </a>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </main>
    </div>
  );
}
