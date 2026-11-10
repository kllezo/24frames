/* ============================================================
   The 24 Frames proposal — an editorial PDF built with
   @react-pdf/renderer. Every figure comes from the stored /
   live quote (single pricing engine). Fonts are embedded
   (Cormorant Garamond + Inter, OFL) from /public/studio-fonts.
   ============================================================ */

import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import {
  formatDateLong,
  formatINR,
  formatTimeRange,
  groupIndian,
  plural,
  roman,
  weekdayOf,
} from "@/lib/commission/format";
import { coupleNames, eventDisplayName, eventTypeLabel, weddingDateLabel } from "@/lib/commission/model";
import type { CommissionDraft, CommissionQuote, StudioConfig } from "@/lib/commission/types";

export interface ProposalInput {
  draft: CommissionDraft;
  quote: CommissionQuote;
  config: StudioConfig;
  reference: string | null;
  issuedAt: string;
  consultant: string;
  origin: string;
}

const C = {
  ivory: "#fbf5e9",
  paper: "#fffcf5",
  forest: "#09453e",
  forestDeep: "#062e29",
  sage: "#687b75",
  gold: "#b0915a",
  ink: "#1a2622",
  line: "#d9d0bd",
  lineSoft: "#ebe3d2",
};
const SERIF = ["Cormorant", "CormorantExt"];
const SANS = ["Inter", "InterExt"];

const s = StyleSheet.create({
  page: { backgroundColor: C.ivory, color: C.ink, fontFamily: SANS, fontSize: 9, lineHeight: 1.55, paddingTop: 58, paddingBottom: 64, paddingHorizontal: 56 },
  pageBare: { backgroundColor: C.ivory, color: C.ink, fontFamily: SANS, fontSize: 9 },
  mono: { fontFamily: SANS, fontSize: 6.5, letterSpacing: 2, color: C.sage, textTransform: "uppercase" },
  kicker: { fontFamily: SANS, fontSize: 7, letterSpacing: 2.4, color: C.gold, textTransform: "uppercase", marginBottom: 8 },
  h1: { fontFamily: SERIF, fontSize: 34, fontWeight: 500, color: C.forest, lineHeight: 1.08, marginBottom: 14 },
  h2: { fontFamily: SERIF, fontSize: 22, fontWeight: 500, color: C.forest, lineHeight: 1.15, marginBottom: 6 },
  h3: { fontFamily: SERIF, fontSize: 15, fontWeight: 600, color: C.forest, lineHeight: 1.2 },
  lead: { fontFamily: SERIF, fontSize: 13, fontStyle: "italic", color: C.ink, lineHeight: 1.45, marginBottom: 18 },
  body: { fontSize: 9, color: C.ink, lineHeight: 1.6 },
  muted: { color: C.sage },
  rule: { height: 0.6, backgroundColor: C.line, marginVertical: 14 },
  goldRule: { width: 34, height: 1, backgroundColor: C.gold, marginBottom: 14 },
  header: { position: "absolute", top: 26, left: 56, right: 56, flexDirection: "row", justifyContent: "space-between" },
  footer: { position: "absolute", bottom: 28, left: 56, right: 56, flexDirection: "row", justifyContent: "space-between", borderTopWidth: 0.5, borderTopColor: C.line, paddingTop: 8 },
  illustrative: { fontSize: 6.5, letterSpacing: 1.6, color: "#8a6a2e", textTransform: "uppercase" },
});

function Chrome({ names, reference }: { names: string; reference: string | null }) {
  return (
    <>
      <View style={s.header} fixed>
        <Text style={s.mono}>24 Frames · Wedding Commission</Text>
        <Text style={s.mono}>{names}</Text>
      </View>
      <View style={s.footer} fixed>
        <Text style={s.mono}>{reference ? `Ref. ${reference}` : "Draft proposal"}</Text>
        <Text style={s.mono} render={({ pageNumber, totalPages }) => `${String(pageNumber).padStart(2, "0")} / ${String(totalPages).padStart(2, "0")}`} />
      </View>
    </>
  );
}

function Fact({ label, value, width = "50%" }: { label: string; value: string; width?: string }) {
  return (
    <View style={{ width, paddingRight: 14, marginBottom: 12 }}>
      <Text style={[s.mono, { marginBottom: 3 }]}>{label}</Text>
      <Text style={{ fontFamily: SERIF, fontSize: 12.5, color: C.ink, lineHeight: 1.3 }}>{value || "—"}</Text>
    </View>
  );
}

function MoneyRow({ label, value, strong = false, note }: { label: string; value: string; strong?: boolean; note?: string }) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        paddingVertical: strong ? 12 : 7,
        borderBottomWidth: strong ? 0 : 0.5,
        borderBottomColor: C.lineSoft,
        borderTopWidth: strong ? 1 : 0,
        borderTopColor: C.forest,
        marginTop: strong ? 6 : 0,
      }}
      wrap={false}
    >
      <View style={{ flex: 1, paddingRight: 12 }}>
        <Text style={strong ? { fontFamily: SERIF, fontSize: 15, color: C.forest, fontWeight: 600 } : { fontSize: 9.5 }}>{label}</Text>
        {note ? <Text style={[s.muted, { fontSize: 7.5, marginTop: 2 }]}>{note}</Text> : null}
      </View>
      <Text style={strong ? { fontFamily: SERIF, fontSize: 20, color: C.forest, fontWeight: 600 } : { fontFamily: SERIF, fontSize: 12.5 }}>{value}</Text>
    </View>
  );
}

export default function ProposalDocument({ draft, quote, config, reference, issuedAt, consultant, origin }: ProposalInput) {
  const c = draft.couple;
  const names = coupleNames(c);
  const date = weddingDateLabel(c, formatDateLong);
  const issued = formatDateLong(issuedAt.slice(0, 10));
  const pp = quote.postProduction;
  const img = (p: string) => (p.startsWith("http") ? p : `${origin}${p}`);
  const serviceById = new Map(config.services.map((x) => [x.id, x]));
  const tier = config.deliveryTiers.find((t) => t.id === pp.tierId) ?? null;
  const validUntil = (() => {
    const d = new Date(issuedAt);
    d.setDate(d.getDate() + (config.proposal.validityDays || 14));
    return formatDateLong(d.toISOString().slice(0, 10));
  })();

  const usedServices = config.services
    .filter((x) => quote.lines.some((l) => l.serviceId === x.id))
    .sort((a, b) => a.order - b.order)
    .map((svc) => {
      const ls = quote.lines.filter((l) => l.serviceId === svc.id);
      return {
        svc,
        count: ls.reduce((a, l) => a + l.quantity, 0),
        events: ls.map((l) => eventDisplayName(draft.events.find((e) => e.id === l.eventId)!, config)),
        total: ls.reduce((a, l) => a + l.lineTotal, 0),
      };
    });

  const dated = draft.events.filter((e) => e.date).map((e) => e.date).sort();
  const span =
    dated.length > 1 && dated[0] !== dated[dated.length - 1]
      ? `${formatDateLong(dated[0])} – ${formatDateLong(dated[dated.length - 1])}`
      : dated[0]
        ? formatDateLong(dated[0])
        : date || "Dates to be confirmed";

  return (
    <Document title={`24 Frames — ${names} — Wedding Commission`} author="24 Frames Photography" subject="Wedding commission proposal" creator="24 Frames Private Studio">
      {/* ── Cover ─────────────────────────────── */}
      <Page size="A4" style={s.pageBare}>
        {/* The studio's mark on ivory, inside a fine gold frame — no photograph. */}
        <View style={{ height: 520, padding: 28 }}>
          <View style={{ flex: 1, borderWidth: 0.8, borderColor: C.gold, alignItems: "center", justifyContent: "center" }}>
            <View style={{ position: "absolute", top: 6, left: 6, right: 6, bottom: 6, borderWidth: 0.4, borderColor: C.gold, opacity: 0.6 }} />
            <Image src={img("/images/logo-dark-header.png")} style={{ width: 300, objectFit: "contain" }} />
            <View style={{ width: 120, height: 0.6, backgroundColor: C.gold, marginTop: 26, marginBottom: 14 }} />
            <Text style={[s.mono, { letterSpacing: 3 }]}>PHOTOGRAPHY · CINEMA · LEGACIES</Text>
          </View>
        </View>
        <View style={{ paddingHorizontal: 56, paddingTop: 34, flex: 1 }}>
          <Text style={s.kicker}>A private wedding commission</Text>
          <Text style={{ fontFamily: SERIF, fontSize: 44, fontWeight: 500, color: C.forest, lineHeight: 1.02 }}>{names}</Text>
          <View style={[s.goldRule, { marginTop: 16 }]} />
          <Text style={{ fontFamily: SERIF, fontSize: 14, fontStyle: "italic", color: C.ink }}>
            {date ? `Celebrating ${date}${c.city ? ` · ${c.city}` : ""}` : c.city || "Your celebration"}
          </Text>
          <View style={{ position: "absolute", bottom: 34, left: 56, right: 56, flexDirection: "row", justifyContent: "flex-end", alignItems: "flex-end" }}>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={s.mono}>{reference ? `Ref. ${reference}` : "Draft proposal"}</Text>
              <Text style={[s.mono, { marginTop: 3 }]}>Prepared {issued}</Text>
            </View>
          </View>
        </View>
      </Page>

      {/* ── The Celebration ───────────────────── */}
      <Page size="A4" style={s.page}>
        <Chrome names={names} reference={reference} />
        <View style={{ flexDirection: "row" }}>
          <View style={{ width: "58%", paddingRight: 26 }}>
            <Text style={s.kicker}>I · The Celebration</Text>
            <Text style={s.h1}>A visual legacy, composed for two.</Text>
            <Text style={s.lead}>{config.proposal.introduction}</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              <Fact label="The couple" value={names} width="100%" />
              <Fact label="Wedding" value={date || "To be confirmed"} />
              <Fact label="City" value={c.city} />
              <Fact label="Contact" value={[c.phone, c.email].filter(Boolean).join("\n")} width="100%" />
            </View>
          </View>
          <View style={{ width: "42%" }}>
            <Image src={img(config.proposal.celebrationImage)} style={{ width: "100%", height: 300, objectFit: "cover" }} />
          </View>
        </View>
        <View style={s.rule} />
        <View style={{ flexDirection: "row" }}>
          {[
            [String(draft.events.length).padStart(2, "0"), draft.events.length === 1 ? "Event" : "Events"],
            [String(quote.totalProfessionals).padStart(2, "0"), "Professionals"],
            [String(usedServices.length).padStart(2, "0"), "Disciplines"],
          ].map(([n, l]) => (
            <View key={l} style={{ width: "25%" }}>
              <Text style={{ fontFamily: SERIF, fontSize: 30, lineHeight: 1.1, color: C.forest, marginBottom: 2 }}>{n}</Text>
              <Text style={s.mono}>{l}</Text>
            </View>
          ))}
          <View style={{ width: "25%" }}>
            <Text style={{ fontFamily: SERIF, fontSize: 12, lineHeight: 1.3, color: C.forest, marginTop: 6, marginBottom: 4 }}>{span}</Text>
            <Text style={s.mono}>The celebration</Text>
          </View>
        </View>
        <View style={s.rule} />
        <Text style={[s.kicker, { marginTop: 4 }]}>The schedule at a glance</Text>
        {draft.events.map((e, i) => (
          <View key={e.id} style={{ flexDirection: "row", paddingVertical: 6, borderBottomWidth: 0.5, borderBottomColor: C.lineSoft }} wrap={false}>
            <Text style={{ width: 28, fontFamily: SERIF, fontSize: 11, color: C.gold }}>{roman(i)}</Text>
            <Text style={{ width: 150, fontFamily: SERIF, fontSize: 12, color: C.forest }}>{eventDisplayName(e, config)}</Text>
            <Text style={{ flex: 1, fontSize: 8.5 }}>
              {[e.date ? formatDateLong(e.date) : "Date TBC", formatTimeRange(e.startTime, e.endTime), e.venue].filter(Boolean).join("  ·  ")}
            </Text>
          </View>
        ))}
        {c.notes ? (
          <View style={{ marginTop: 16 }} wrap={false}>
            <Text style={s.mono}>Notes from the couple</Text>
            <Text style={[s.body, { marginTop: 4 }]}>{c.notes}</Text>
          </View>
        ) : null}
      </Page>

      {/* ── Event schedule ─────────────────────── */}
      <Page size="A4" style={s.page}>
        <Chrome names={names} reference={reference} />
        <Text style={s.kicker}>II · Event by event</Text>
        <Text style={s.h1}>The schedule &amp; your creative team</Text>
        {draft.events.map((e, i) => {
          const pe = quote.events.find((x) => x.eventId === e.id);
          return (
            <View key={e.id} style={{ marginBottom: 20 }} wrap={!!pe && pe.lines.length > 4}>
              <View
                style={{ flexDirection: "row", alignItems: "flex-start", borderBottomWidth: 1, borderBottomColor: C.forest, paddingBottom: 6, marginBottom: 6 }}
                wrap={false}
                minPresenceAhead={70}
              >
                <Text style={{ fontFamily: SERIF, fontSize: 22, lineHeight: 1, color: C.gold, width: 40, paddingTop: 2 }}>{roman(i)}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={s.h3}>{eventDisplayName(e, config)}</Text>
                  <Text style={[s.muted, { fontSize: 8 }]}>
                    {[
                      eventTypeLabel(e, config),
                      e.date ? `${weekdayOf(e.date)}, ${formatDateLong(e.date)}` : "Date to be confirmed",
                      formatTimeRange(e.startTime, e.endTime),
                    ].filter(Boolean).join("  ·  ")}
                  </Text>
                  <Text style={[s.muted, { fontSize: 8 }]}>
                    {[e.venue, e.location, e.guestCount ? `${groupIndian(e.guestCount)} guests` : ""].filter(Boolean).join("  ·  ")}
                  </Text>
                </View>
                <Text style={{ fontFamily: SERIF, fontSize: 15, color: C.forest, alignSelf: "flex-end" }}>{formatINR(pe?.subtotal ?? 0)}</Text>
              </View>
              {e.specialRequirements ? <Text style={[s.body, { fontSize: 8, marginBottom: 4 }]}>Requirements: {e.specialRequirements}</Text> : null}
              {pe && pe.lines.length > 0 ? (
                pe.lines.map((l) => {
                  const svc = serviceById.get(l.serviceId);
                  return (
                    <View key={l.assignmentId} style={{ flexDirection: "row", paddingVertical: 5, borderBottomWidth: 0.5, borderBottomColor: C.lineSoft }} wrap={false}>
                      <View style={{ flex: 1, paddingRight: 10 }}>
                        <Text style={{ fontSize: 9.5, fontWeight: 600, color: C.ink }}>{l.serviceName}</Text>
                        {svc ? <Text style={[s.muted, { fontSize: 7.5 }]}>{svc.deliverables.slice(0, 3).join(" · ")}</Text> : null}
                        {l.overridden ? <Text style={{ fontSize: 7, color: "#8a6a2e" }}>Studio adjusted price · {l.overrideReason}</Text> : null}
                      </View>
                      <Text style={{ width: 90, fontSize: 8.5 }}>{plural(l.quantity, l.unitNoun)}</Text>
                      <Text style={{ width: 70, fontSize: 8.5, textAlign: "right" }}>{formatINR(l.unitPrice)}</Text>
                      <Text style={{ width: 76, fontSize: 9.5, textAlign: "right", fontWeight: 600 }}>{formatINR(l.lineTotal)}</Text>
                    </View>
                  );
                })
              ) : (
                <Text style={[s.muted, { fontStyle: "italic" }]}>No creative team selected for this event.</Text>
              )}
            </View>
          );
        })}

        {/* ── Creative team overview (continues the flow to avoid empty pages) ── */}
        <View style={{ marginTop: 18 }} minPresenceAhead={160}>
          <Text style={s.kicker}>III · The Ensemble</Text>
          <Text style={s.h1}>Who will be telling your story</Text>
        </View>
        {usedServices.map(({ svc, count, events, total }) => (
          <View key={svc.id} style={{ flexDirection: "row", marginBottom: 16 }} wrap={false}>
            <Image src={img(svc.image)} style={{ width: 96, height: 120, objectFit: "cover", marginRight: 18 }} />
            <View style={{ flex: 1 }}>
              <Text style={[s.mono, { color: C.gold }]}>{svc.epithet}</Text>
              <Text style={s.h3}>{svc.name}</Text>
              <Text style={[s.body, { marginTop: 3 }]}>{svc.role}</Text>
              <Text style={[s.body, { marginTop: 3, color: C.sage }]}>You receive: {svc.deliverables.join(" · ")}</Text>
              <Text style={[s.mono, { marginTop: 5 }]}>
                {plural(count, svc.unitNoun)} · {events.join(", ")} · {formatINR(total)}
              </Text>
            </View>
          </View>
        ))}
      </Page>

      {/* ── Post-production & financial summary ── */}
      <Page size="A4" style={s.page}>
        <Chrome names={names} reference={reference} />
        <Text style={s.kicker}>IV · Post-production &amp; delivery</Text>
        <Text style={s.h1}>{pp.priorityName ?? "Delivery to be chosen"}</Text>
        {tier ? (
          <>
            <Text style={s.lead}>{tier.meaning}</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              <Fact label="Timeline" value={tier.label} />
              <Fact label="Covers" value={tier.covers.join(", ")} />
              <Fact label="What to expect" value={tier.expectations} width="100%" />
              <Fact label="Conditions" value={tier.conditions} width="100%" />
            </View>
          </>
        ) : null}
        <View style={{ backgroundColor: C.paper, padding: 16, marginTop: 4, borderWidth: 0.5, borderColor: C.line }} wrap={false}>
          <MoneyRow label="Standard post-production fee" value={formatINR(pp.baseFee)} note={pp.resolutions.map((r) => r.explanation).join(" ")} />
          <MoneyRow label="Priority adjustment" value={pp.multiplier !== null ? `${pp.multiplier}×` : "—"} note={pp.priorityName ?? undefined} />
          <MoneyRow
            label="Post-production fee"
            value={formatINR(pp.finalFee)}
            note={pp.overridden ? `Studio adjusted from ${formatINR(pp.computedFee)} · ${pp.overrideReason}` : undefined}
          />
        </View>

        <View style={{ marginTop: 26 }} wrap={false}>
          <Text style={s.kicker}>V · Financial summary</Text>
          <MoneyRow label="Creative production" value={formatINR(quote.productionSubtotal)} note={`${plural(quote.totalProfessionals, "professional")} across ${plural(draft.events.length, "event")}`} />
          <MoneyRow label="Post-production" value={formatINR(pp.finalFee)} />
          {quote.charges.map((ch) => <MoneyRow key={ch.id} label={ch.label} value={formatINR(ch.amount)} note={ch.description} />)}
          {quote.tax ? (
            <MoneyRow label={`${quote.tax.label} (${quote.tax.ratePercent}%)`} value={formatINR(quote.tax.amount)} />
          ) : (
            <MoneyRow label="Taxes" value="Not applied" note={config.tax.note} />
          )}
          <MoneyRow label="Estimated total commission" value={formatINR(quote.grandTotal)} strong />
          {quote.illustrative ? (
            <Text style={[s.illustrative, { marginTop: 8 }]}>Illustrative pricing — demonstration values, not approved studio rates.</Text>
          ) : null}
          <Text style={[s.muted, { fontSize: 7.5, marginTop: 6 }]}>This is an estimate, not an invoice. Valid until {validUntil}.</Text>
        </View>
      </Page>

      {/* ── Closing ───────────────────────────── */}
      <Page size="A4" style={s.pageBare}>
        <Image src={img(config.proposal.closingImage)} style={{ width: "100%", height: 400, objectFit: "cover" }} />
        <View style={{ paddingHorizontal: 56, paddingTop: 30, flex: 1 }}>
          <Text style={s.kicker}>With gratitude</Text>
          <Text style={{ fontFamily: SERIF, fontSize: 24, fontStyle: "italic", color: C.forest, lineHeight: 1.25, marginBottom: 18 }}>
            {config.proposal.closingMessage}
          </Text>
          <View style={{ flexDirection: "row" }}>
            <View style={{ width: "45%", paddingRight: 20 }}>
              <Text style={s.mono}>{config.studio.name}</Text>
              <Text style={[s.body, { marginTop: 4 }]}>{config.studio.phoneDisplay}</Text>
              <Text style={s.body}>{config.studio.email}</Text>
              <Text style={s.body}>{config.studio.website}</Text>
              <Text style={s.body}>{config.studio.instagram}</Text>
              <Text style={[s.body, s.muted]}>{config.studio.address}</Text>
              <Text style={[s.mono, { marginTop: 14 }]}>{reference ? `Ref. ${reference}` : "Draft — not yet submitted"}</Text>
              <Text style={[s.mono, { marginTop: 3 }]}>Prepared by {consultant} · {issued}</Text>
            </View>
            <View style={{ width: "55%" }}>
              <Text style={s.mono}>Proposal notes</Text>
              {config.proposal.terms.map((t, i) => (
                <Text key={i} style={{ fontSize: 7.2, color: C.sage, marginTop: 4, lineHeight: 1.45 }}>
                  {i + 1}. {t}
                </Text>
              ))}
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
