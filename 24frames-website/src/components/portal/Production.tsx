"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import cx from "../studio/cinema.module.css";
import base from "../studio/studio.module.css";
import qx from "../studio/quotes/quotes.module.css";
import ix from "./insights.module.css";
import DeskTop from "./DeskTop";
import { formatDateLong, formatINR, formatTimeRange, plural } from "@/lib/commission/format";
import { coupleNames, eventDisplayName, weddingDateLabel } from "@/lib/commission/model";
import { planningTitles } from "@/lib/commission/planning";
import type { StudioConfig } from "@/lib/commission/types";
import { PRODUCTION_LABEL, PRODUCTION_STEPS, type PortalQuote, type ProductionStatus, type PublicAccount } from "@/lib/portal/types";

const CONTACT = { whatsapp: "WhatsApp", call: "Phone call", email: "Email" } as const;

/* Production: every confirmed booking, as a brief generated from the
   quotation — the couple, schedule, venues, services, crew, deliverables,
   instructions, timeline and preferences — moving through the stages from
   assignment to delivery. Nobody re-types anything. */
export default function Production({ me, config }: { me: PublicAccount; config: StudioConfig }) {
  const [quotes, setQuotes] = useState<PortalQuote[] | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/portal/quotes", { cache: "no-store" }).catch(() => null);
    if (res?.status === 401) return window.location.assign("/desk/login");
    const d = res ? ((await res.json().catch(() => ({}))) as { quotes?: PortalQuote[]; error?: string }) : {};
    if (res?.ok && d.quotes) setQuotes(d.quotes.filter((q) => q.status === "accepted" && q.production));
    else setError(d.error ?? "Could not load production.");
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
    const id = new URLSearchParams(window.location.search).get("q");
    if (id) setOpenId(id);
  }, [load]);

  const lanes = useMemo(
    () =>
      PRODUCTION_STEPS.map((s) => ({
        ...s,
        jobs: (quotes ?? []).filter((q) => q.production!.status === s.id).sort((a, b) => firstDate(a).localeCompare(firstDate(b))),
      })),
    [quotes],
  );
  const open = quotes?.find((q) => q.id === openId) ?? null;
  const today = new Date().toISOString().slice(0, 10);
  const [stage, setStage] = useState<ProductionStatus | "all">("all");
  const shownJobs = stage === "all" ? lanes.flatMap((l) => l.jobs) : lanes.find((l) => l.id === stage)?.jobs ?? [];
  const overdue = (quotes ?? []).filter((q) => q.production!.status !== "delivered" && q.production!.dueDate && q.production!.dueDate < today).length;

  return (
    <div className={`${cx.cinema} ${qx.page}`}>
      <DeskTop me={me} current="production" />
      <main className={qx.main}>
        <header className={ix.hero} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "1.5rem", flexWrap: "wrap" }}>
          <div>
            <p className={ix.heroKicker}>Operations</p>
            <h1 className={ix.heroTitle}>
              From booking <em>to delivery.</em>
            </h1>
          </div>
          <ul className={ix.strip} style={{ margin: 0 }}>
            <li>
              Bookings <b>{quotes?.length ?? "—"}</b>
            </li>
            <li className={overdue ? ix.stripHot : ""}>
              Overdue <b>{overdue}</b>
            </li>
            <li>
              Delivered <b>{lanes.find((l) => l.id === "delivered")?.jobs.length ?? 0}</b>
            </li>
          </ul>
        </header>
        {error && <p className={qx.error}>{error}</p>}

        {/* The seven stages as one rail — tap a stage to filter. */}
        <ol className={ix.rail} aria-label="Production stages">
          <li>
            <button className={`${ix.railStep} ${stage === "all" ? ix.railOn : ""}`} onClick={() => setStage("all")}>
              <b>
                {quotes?.length ?? 0}
                <small>{(quotes?.length ?? 0) === 1 ? "booking" : "bookings"}</small>
              </b>
              <span>All</span>
            </button>
          </li>
          {lanes.map((l, i) => (
            <li key={l.id}>
              <button className={`${ix.railStep} ${stage === l.id ? ix.railOn : ""} ${l.jobs.length ? ix.railBusy : ""}`} onClick={() => setStage(l.id)}>
                <b>
                  {l.jobs.length}
                  <small>{l.jobs.length === 1 ? "booking" : "bookings"}</small>
                </b>
                <span>
                  {i + 1}. {l.label}
                </span>
              </button>
            </li>
          ))}
        </ol>

        {quotes && quotes.length === 0 && (
          <p className={ix.empty}>No confirmed bookings yet. When a client accepts — or you confirm a booking — its brief appears here, already written.</p>
        )}
        {quotes && quotes.length > 0 && shownJobs.length === 0 && <p className={ix.empty}>Nothing at this stage.</p>}

        <div className={ix.jobs}>
          {shownJobs.map((q) => {
            const p = q.production!;
            const idx = PRODUCTION_STEPS.findIndex((s) => s.id === p.status);
            const due = p.dueDate;
            const late = !!due && p.status !== "delivered" && due < today;
            return (
              <button
                key={q.id}
                className={`${ix.jobCard} ${q.id === openId ? ix.jobOn : ""}`}
                onClick={() => {
                  setOpenId(q.id);
                  window.setTimeout(() => document.getElementById("brief")?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
                }}
              >
                <span className={ix.jobTop}>
                  <span className={ix.jobName}>{coupleNames(q.draft.couple, q.clientName)}</span>
                  <span className={`${ix.pill} ${p.status === "delivered" ? ix.pillGreen : late ? ix.pillRed : ix.pillGold}`}>{PRODUCTION_LABEL[p.status]}</span>
                </span>
                <span className={ix.jobMeta}>
                  {firstDate(q) ? formatDateLong(firstDate(q)) : "Date TBC"} · {plural(q.draft.events.length, "occasion")}
                  {q.draft.couple.city ? ` · ${q.draft.couple.city}` : ""}
                </span>
                <span className={ix.progressWrap}>
                  <span className={ix.progressCaption} aria-hidden="true">
                    <span>Stage {idx + 1} of {PRODUCTION_STEPS.length}</span>
                    {idx + 1 < PRODUCTION_STEPS.length ? <span>Next · {PRODUCTION_STEPS[idx + 1].label}</span> : <span>Complete</span>}
                  </span>
                  <span className={ix.progress} aria-label={`Stage ${idx + 1} of ${PRODUCTION_STEPS.length}: ${PRODUCTION_LABEL[p.status]}`}>
                    {PRODUCTION_STEPS.map((s, i) => (
                      <i key={s.id} className={i <= idx ? ix.progressOn : ""} title={`${i + 1}. ${s.label}`} />
                    ))}
                  </span>
                </span>
                <span className={ix.jobFoot}>
                  <span>{q.managerName ? `RM · ${q.managerName}` : "No RM"}</span>
                  {due && p.status !== "delivered" && <span className={late ? ix.overdue : ""}>Delivery {late ? "was due" : "due"} {formatDateLong(due)}</span>}
                  {p.crew && <span>Crew · {p.crew}</span>}
                </span>
              </button>
            );
          })}
        </div>

        {open && <Brief key={open.id} q={open} config={config} onSaved={(q) => setQuotes((qs) => (qs ?? []).map((x) => (x.id === q.id ? q : x)))} />}
      </main>
    </div>
  );
}

function firstDate(q: PortalQuote) {
  const d = q.draft.events.map((e) => e.date).filter(Boolean).sort();
  return d[0] || q.draft.couple.weddingDate || "";
}

function Brief({ q, config, onSaved }: { q: PortalQuote; config: StudioConfig; onSaved: (q: PortalQuote) => void }) {
  const p = q.production!;
  const [crew, setCrew] = useState(p.crew);
  const [notes, setNotes] = useState(p.notes);
  const [due, setDue] = useState(p.dueDate ?? "");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const c = q.draft.couple;
  const tier = config.deliveryTiers.find((t) => t.id === q.draft.deliveryTierId) ?? null;
  const events = [...q.draft.events].sort((a, b) => `${a.date || "9"}${a.startTime}`.localeCompare(`${b.date || "9"}${b.startTime}`));
  const stepIndex = PRODUCTION_STEPS.findIndex((s) => s.id === p.status);
  const planning = planningTitles(q.draft.planning);

  // Crew requirements: how many of each role, across all occasions.
  const crewNeed = new Map<string, number>();
  for (const l of q.quote.lines) crewNeed.set(`${l.serviceName}`, Math.max(crewNeed.get(l.serviceName) ?? 0, l.quantity));
  const deliverables = Array.from(
    new Set(
      q.quote.lines.flatMap((l) => config.services.find((s) => s.id === l.serviceId)?.deliverables ?? []),
    ),
  );
  const instructions = [
    c.notes,
    ...events.flatMap((e) => [e.specialRequirements && `${eventDisplayName(e, config)}: ${e.specialRequirements}`, e.notes && `${eventDisplayName(e, config)}: ${e.notes}`]),
    q.draft.planning?.note,
  ].filter(Boolean) as string[];
  const lastEvent = events.map((e) => e.date).filter(Boolean).pop() ?? c.weddingDate ?? "";

  async function save(extra: Record<string, unknown>, ok: string) {
    setBusy(true);
    setMsg(null);
    const res = await fetch(`/api/portal/quotes/${q.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "production", ...extra }),
    }).catch(() => null);
    const d = res ? ((await res.json().catch(() => ({}))) as { quote?: PortalQuote; error?: string }) : {};
    setBusy(false);
    if (res?.ok && d.quote) {
      onSaved(d.quote);
      setMsg({ ok: true, text: ok });
    } else setMsg({ ok: false, text: d.error ?? "Could not save." });
  }

  return (
    <section className={`${ix.panel} ${ix.panelWide}`} id="brief">
      <div className={ix.panelHead}>
        <div>
          <p className={base.kicker}>
            Production brief · {q.reference} · generated {formatDateLong(p.createdAt.slice(0, 10))}
          </p>
          <h2 className={ix.panelTitle} style={{ fontSize: "clamp(28px, 3vw, 38px)" }}>
            {coupleNames(c, q.clientName)}
          </h2>
        </div>
        <button className={base.btnGhost} onClick={() => window.print()}>
          Print brief
        </button>
      </div>

      <ol className={ix.steps} aria-label="Production stage">
        {PRODUCTION_STEPS.map((s, i) => (
          <li key={s.id}>
            <button
              className={i === stepIndex ? ix.stepOn : i < stepIndex ? ix.stepDone : ""}
              disabled={busy || i === stepIndex}
              onClick={() => save({ status: s.id as ProductionStatus }, `Moved to ${s.label}.`)}
            >
              {i + 1}. {s.label}
            </button>
          </li>
        ))}
      </ol>

      <div className={ix.brief}>
        <dl className={ix.briefGrid}>
          <div>
            <dt>Couple</dt>
            <dd>
              {coupleNames(c, q.clientName)}
              <br />
              {q.clientPhone} · {q.clientEmail}
            </dd>
          </div>
          <div>
            <dt>Wedding</dt>
            <dd>
              {weddingDateLabel(c, formatDateLong) || "Date to be confirmed"}
              {c.city ? ` · ${c.city}` : ""}
            </dd>
          </div>
          <div>
            <dt>Relationship manager</dt>
            <dd>{q.managerName ?? "—"}</dd>
          </div>
          <div>
            <dt>Booked value</dt>
            <dd>{formatINR(q.finalPrice ?? q.quote.grandTotal)}</dd>
          </div>
        </dl>

        <div className={ix.briefSection}>
          <h4>Event schedule, venues and locations</h4>
          <div className={ix.tableWrap}>
            <table className={ix.table}>
              <thead>
                <tr>
                  <th>Occasion</th>
                  <th>When</th>
                  <th>Venue</th>
                  <th>Guests</th>
                  <th>Services</th>
                </tr>
              </thead>
              <tbody>
                {events.map((e) => {
                  const priced = q.quote.events.find((x) => x.eventId === e.id);
                  return (
                    <tr key={e.id}>
                      <td>{eventDisplayName(e, config)}</td>
                      <td>
                        {e.date ? formatDateLong(e.date) : "Date TBC"}
                        {(e.startTime || e.endTime) && <div className={ix.jobMeta}>{formatTimeRange(e.startTime, e.endTime)}</div>}
                      </td>
                      <td>
                        {e.venue || "—"}
                        {(e.location || e.venueSetting || e.venueScale) && (
                          <div className={ix.jobMeta}>{[e.location, e.venueSetting, e.venueScale].filter(Boolean).join(" · ")}</div>
                        )}
                      </td>
                      <td>{e.guestCount ?? "—"}</td>
                      <td>{priced?.lines.map((l) => `${l.quantity}× ${l.serviceName}`).join(", ") || "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className={ix.grid3} style={{ marginBottom: 0 }}>
          <div className={ix.briefSection}>
            <h4>Selected services & crew</h4>
            <ul>
              {[...crewNeed.entries()].map(([name, n]) => (
                <li key={name}>
                  {name} — up to {n} on a single occasion
                </li>
              ))}
              <li>{plural(q.quote.totalProfessionals, "professional")} across all occasions</li>
            </ul>
          </div>
          <div className={ix.briefSection}>
            <h4>Deliverables</h4>
            <ul>
              {deliverables.map((d) => (
                <li key={d}>{d}</li>
              ))}
              {tier && <li>{tier.priorityName} — {tier.label}</li>}
            </ul>
          </div>
          <div className={ix.briefSection}>
            <h4>Post-production timeline</h4>
            <ul>
              <li>Last celebration: {lastEvent ? formatDateLong(lastEvent) : "to be confirmed"}</li>
              <li>Delivery promise: {tier ? `${tier.days} days (${tier.label})` : "standard"}</li>
              <li>Delivery due: {p.dueDate ? formatDateLong(p.dueDate) : "set below"}</li>
              {p.deliveredAt && <li>Delivered {formatDateLong(p.deliveredAt.slice(0, 10))}</li>}
            </ul>
          </div>
        </div>

        <div className={ix.grid2} style={{ marginBottom: 0 }}>
          <div className={ix.briefSection}>
            <h4>Special instructions</h4>
            {instructions.length ? (
              <ul>
                {instructions.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            ) : (
              <p className={ix.empty}>None from the client.</p>
            )}
          </div>
          <div className={ix.briefSection}>
            <h4>Client preferences</h4>
            <ul>
              <li>Prefers to be reached by {CONTACT[c.preferredContact] ?? "—"}</li>
              {planning.length > 0 && <li>Planning help: {planning.join(", ")}</li>}
              {(q.consultations ?? []).slice(-2).map((s) => (
                <li key={s.id}>
                  Session with {s.by}
                  {s.note ? ` — ${s.note}` : ""}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={ix.form}>
          <div className={ix.formRow}>
            <label>
              Crew assigned
              <input value={crew} onChange={(e) => setCrew(e.target.value)} placeholder="Names and roles, e.g. Ravi (lead photo), Sana (film)…" />
            </label>
            <label>
              Delivery due
              <input type="date" value={due} onChange={(e) => setDue(e.target.value)} />
            </label>
          </div>
          <label>
            Operations notes
            <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Call times, travel, equipment, contacts at the venue…" />
          </label>
          <div className={ix.listActions}>
            <button className={base.btnPrimary} disabled={busy} onClick={() => save({ crew, notes, dueDate: due || null }, "Brief saved.")}>
              Save brief
            </button>
            {msg && <span className={msg.ok ? ix.msgOk : ix.msgErr}>{msg.text}</span>}
          </div>
        </div>

        <div className={ix.briefSection}>
          <h4>Stage history</h4>
          <ul>
            {[...p.log].reverse().map((l, i) => (
              <li key={i}>
                {new Date(l.at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })} — {PRODUCTION_LABEL[l.status]} · {l.by}
                {l.note ? ` — ${l.note}` : ""}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
