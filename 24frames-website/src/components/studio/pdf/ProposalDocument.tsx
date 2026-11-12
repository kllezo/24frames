/* ============================================================
   The 24 Frames proposal — laid out page for page after the
   studio's own quotation format (the Prem & Ravali proposal):
     01 Cover · 02 About us · 03 Our Specialities ·
     04 Masterpiece · 05 Our Workflow · 06 Scope: Pre-Wedding ·
     07 Scope: The Grand Wedding · 08 Deliverables · 09 Quote ·
     10 Thank you
   Artwork in /public/images/proposal is cropped from that
   proposal; scope, prices and timelines come from the live quote.
   Built with @react-pdf/renderer.
   ============================================================ */

import { Document, Image, Page, Svg, Path, Text, View } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import { coupleNames, eventDisplayName } from "@/lib/commission/model";
import type { CelebrationEvent, CommissionDraft, CommissionQuote, StudioConfig } from "@/lib/commission/types";

export interface ProposalInput {
  draft: CommissionDraft;
  quote: CommissionQuote;
  config: StudioConfig;
  reference: string | null;
  issuedAt: string;
  consultant: string;
  origin: string;
  /** Price agreed by the studio (after sales adjustment / founder approval). */
  finalPrice?: number | null;
}

/* Page geometry and palette taken from the reference proposal. */
const W = 599;
const H = 848;
const SIZE: [number, number] = [W, H];
const C = {
  page: "#fff9f4",
  box: "#faf3ec",
  forest: "#0e3b30",
  ink: "#141414",
  grey: "#8b8b8b",
};
const SERIF = ["Cormorant", "CormorantExt"];
const SANS = "Helvetica";
const SANS_BOLD = "Helvetica-Bold";

const page: Style = { backgroundColor: C.page, color: C.ink, fontFamily: SANS, position: "relative" };
const abs = (left: number, top: number, width?: number, height?: number): Style => ({
  position: "absolute",
  left,
  top,
  ...(width !== undefined ? { width } : {}),
  ...(height !== undefined ? { height } : {}),
});
const heading: Style = { fontFamily: SERIF, fontSize: 26, color: C.forest, lineHeight: 1.1 };
const rule: Style = { width: 50, height: 1, backgroundColor: C.forest };
const label: Style = { fontFamily: SANS_BOLD, fontSize: 10.5, letterSpacing: 0.9, color: C.forest, textTransform: "uppercase" };
const body: Style = { fontSize: 11.2, lineHeight: 1.42, color: C.ink };

/* ---------- formatting in the reference's own voice ---------- */

const MONTHS = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
function ordinal(n: number) {
  const s = n % 100 >= 11 && n % 100 <= 13 ? "th" : (["th", "st", "nd", "rd"][n % 10] ?? "th");
  return `${n}${s}`;
}
/** "25th, Dec 2026" — or the couple's approximate wording when no exact date. */
function eventDate(e: CelebrationEvent, fallback: string) {
  if (e.date) {
    const [y, m, d] = e.date.split("-").map(Number);
    return `${ordinal(d)}, ${MONTHS[m - 1]} ${y}`;
  }
  return fallback || "Date TBD";
}
/** 820000 → "8.2L", 45000 → "45K". */
function lakh(n: number) {
  if (n >= 100000) return `${(Math.round(n / 10000) / 10).toString().replace(/\.0$/, "")}L`;
  if (n >= 1000) return `${Math.round(n / 1000)}K`;
  return String(Math.round(n));
}

const PHOTO_IDS = ["candid-photographer", "traditional-photographer"];
const VIDEO_IDS = ["candid-videographer", "creative-cinematography", "traditional-videographer"];
const EXTRA_IDS = ["web-live-stream", "aerial-drone"];
const short = (name: string) => name.replace(/\s+(Photographer|Videographer)$/i, "");

/* ---------- small pieces ---------- */

function Pin() {
  return (
    <Svg width={9} height={12} viewBox="0 0 24 32" style={{ marginRight: 8 }}>
      <Path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 20 12 20s12-11 12-20C24 5.4 18.6 0 12 0zm0 16.5a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9z" fill="#111" />
    </Svg>
  );
}

function Bullets({ items, size = 11.2, gap = 4 }: { items: string[]; size?: number; gap?: number }) {
  return (
    <View>
      {items.map((t, i) => (
        <View key={i} style={{ flexDirection: "row", marginBottom: gap }}>
          <Text style={{ width: 11, fontSize: size }}>•</Text>
          <Text style={{ flex: 1, fontSize: size, lineHeight: 1.4 }}>{t}</Text>
        </View>
      ))}
    </View>
  );
}

function ScopeTitle({ subtitle }: { subtitle: string }) {
  return (
    <View style={{ alignItems: "center", marginBottom: 46 }}>
      <Text style={{ fontFamily: SERIF, fontSize: 44, color: C.forest, letterSpacing: 1, lineHeight: 1 }}>SCOPE</Text>
      <View style={[rule, { marginTop: 22, marginBottom: 20 }]} />
      <Text style={{ fontFamily: SERIF, fontSize: 25, color: C.ink, lineHeight: 1 }}>{subtitle}</Text>
    </View>
  );
}

interface ScopeBlock {
  e: CelebrationEvent;
  name: string;
  date: string;
  place: string;
  guests: string;
  pros: string[];
  extras: string[];
}

function ScopeGrid({ list }: { list: ScopeBlock[] }) {
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 41 }}>
      {list.map((b) => (
        <View key={b.e.id} style={{ width: "50%", paddingRight: 18, marginBottom: 46 }} wrap={false}>
          <Text style={[label, { fontSize: 11.5, marginBottom: 8 }]}>{b.name}</Text>
          <Text style={[body, { marginBottom: 5 }]}>{b.date}</Text>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 5 }}>
            <Pin />
            <Text style={body}>{b.place}</Text>
          </View>
          <Text style={[body, { marginBottom: 9 }]}>No. of Guests:  {b.guests}</Text>
          <Text style={{ fontFamily: SANS_BOLD, fontSize: 11, marginBottom: 8 }}>PROFESSIONALS:</Text>
          {b.pros.length ? (
            b.pros.map((p, i) => (
              <Text key={i} style={[body, { marginBottom: 5 }]}>{p}</Text>
            ))
          ) : (
            <Text style={[body, { color: C.grey }]}>To be confirmed</Text>
          )}
        </View>
      ))}
    </View>
  );
}

export default function ProposalDocument({ draft, quote, config, reference, issuedAt, origin, finalPrice }: ProposalInput) {
  const c = draft.couple;
  const names = coupleNames(c);
  const img = (p: string) => (p.startsWith("http") ? p : `${origin}${p}`);
  const art = (name: string) => img(`/images/proposal/${name}`);
  const logo = art("logo.jpg");
  const serviceName = new Map(config.services.map((s) => [s.id, s.name]));
  const tier = config.deliveryTiers.find((t) => t.id === quote.postProduction.tierId) ?? null;

  /* Scope blocks — one per occasion, written the way the studio writes them. */
  const blocks = draft.events.map((e) => {
    const lines = quote.lines.filter((l) => l.eventId === e.id && l.quantity > 0);
    const group = (ids: string[]) =>
      ids
        .map((id) => ({ id, q: lines.filter((l) => l.serviceId === id).reduce((a, l) => a + l.quantity, 0) }))
        .filter((g) => g.q > 0);
    const photo = group(PHOTO_IDS);
    const video = group(VIDEO_IDS);
    const extras = group(EXTRA_IDS);
    const others = lines.filter((l) => ![...PHOTO_IDS, ...VIDEO_IDS, ...EXTRA_IDS].includes(l.serviceId));
    const sum = (g: { q: number }[]) => g.reduce((a, x) => a + x.q, 0);
    const detail = (g: { id: string; q: number }[]) => g.map((x) => `${x.q} ${short(serviceName.get(x.id) ?? x.id)}`).join(", ");
    const pros: string[] = [];
    if (photo.length) pros.push(`${sum(photo)} Photographer${sum(photo) > 1 ? "s" : ""} ( ${detail(photo)} )`);
    if (video.length) pros.push(`${sum(video)} Videographer${sum(video) > 1 ? "s" : ""} ( ${detail(video)} )`);
    others.forEach((l) => pros.push(`${l.quantity} ${l.serviceName}`));
    return {
      e,
      name: eventDisplayName(e, config),
      date: eventDate(e, c.approximateDate),
      place: e.location || c.city || "Venue TBD",
      guests: e.guestCount ? String(e.guestCount) : "TBD",
      pros,
      extras: extras.map((x) => serviceName.get(x.id) ?? x.id),
    };
  });
  const grandTypes = new Set(["wedding", "reception"]);
  const pre = blocks.filter((b) => !grandTypes.has(b.e.type));
  const grand = blocks.filter((b) => grandTypes.has(b.e.type));
  const extrasNote = blocks
    .filter((b) => b.extras.length)
    .map((b) => `${b.name}( ${b.extras.join("& ")} included )`)
    .join("   ");

  const total = quote.grandTotal;
  const discounted = finalPrice && finalPrice > 0 && finalPrice !== total ? finalPrice : null;

  return (
    <Document title={`24 Frames — ${names} — Quotation`} author="24 Frames Photography" subject="Wedding quotation" creator="24 Frames">
      {/* 01 · Cover */}
      <Page size={SIZE} style={page}>
        <Image src={art("cover-floral.jpg")} style={abs(486.2, 0, 112.8, 118)} />
        <Image src={logo} style={abs((W - 232) / 2, 140, 232)} />
        <Text style={[abs(0, 222, W), { textAlign: "center", fontSize: 8.5, letterSpacing: 3.2, color: C.forest }]}>
          {names.toUpperCase()}
        </Text>
        <Image src={art("cover-photo.jpg")} style={abs(71.3, 272.3, 456.4, 575)} />
      </Page>

      {/* 02 · About us */}
      <Page size={SIZE} style={page}>
        <Text style={[heading, abs(40, 52)]}>About us</Text>
        <View style={[rule, abs(41, 104)]} />
        <View style={abs(41, 137, 300)}>
          <Text style={[body, { fontSize: 12.6 }]}>
            Experience unparalleled artistry and excellence with <Text style={{ fontFamily: SANS_BOLD, color: C.forest }}>24 Frames</Text> where your moments become timeless masterpieces...
          </Text>
          <Text style={[body, { fontSize: 12.6, marginTop: 16 }]}>
            We pride ourselves on delivering exceptional photography and videography services to a diverse clientele. Our company is rapidly growing, Thanks to our team of talented professionals who excel in their respective fields.
          </Text>
        </View>
        <Image src={art("about-photos.jpg")} style={abs(35.7, 356.5, 528.3, 463.6)} />
      </Page>

      {/* 03 · Our Specialities */}
      <Page size={SIZE} style={page}>
        <Image src={art("spec-floral.jpg")} style={abs(208.7, 0, 185.4, 67.4)} />
        <Text style={[heading, abs(40, 52)]}>Our Specialities</Text>
        <View style={[rule, abs(41, 104)]} />
        {[
          { x: 40, y: 124, t: "High-End Equipment", d: "Utilizing the latest technology for unparalleled quality." },
          { x: 40, y: 203, t: "Creative Vision", d: "Dynamic team a flair for innovative and artistic shots." },
          { x: 40, y: 282, t: "Punctual Delivery", d: "Premium experience delivered on time, every time. Within 60-90 days." },
          { x: 299, y: 227, t: "Lead Professional Shoots", d: "Captured by top professionals & experts in the field." },
          { x: 299, y: 306, t: "Award-Winning Team", d: "Recognized for excellence and dedication." },
          { x: 299, y: 369, t: "Proven Expertise", d: "Having captured over 1,100 weddings, our experience is unrivalled." },
        ].map((it) => (
          <View key={it.t} style={abs(it.x, it.y, 240)}>
            <Text style={[label, { marginBottom: 7 }]}>{it.t}</Text>
            <Text style={body}>{it.d}</Text>
          </View>
        ))}
        <Image src={art("spec-photo.jpg")} style={abs(0, 487.5, 557.5, 319.6)} />
      </Page>

      {/* 04 · Where every moment becomes a masterpiece */}
      <Page size={SIZE} style={page}>
        <Image src={logo} style={abs((W - 118) / 2, 48, 118)} />
        <Image src={art("masterpiece.jpg")} style={abs(82.3, 125.8, 431.8, 721.5)} />
      </Page>

      {/* 05 · Our Workflow */}
      <Page size={SIZE} style={page}>
        <Text style={[heading, abs(40, 52)]}>Our Workflow</Text>
        <View style={[rule, abs(41, 104)]} />
        <Image src={logo} style={abs(441, 52, 118)} />
        <View style={abs(41, 131, 230)}>
          {[
            ["Understanding Your Vision", "We listen to your preferences, theme, and requirements."],
            ["Professional Deployment", "We assign skilled professionals tailored to your event."],
            ["Pre-Event Planning", "We arrive at the venue in advance to plan and execute flawlessly."],
            ["Timely Delivery", "Enjoy seamless delivery of your memories via HDD or cloud, right on time."],
            ["Creative Planning", "We conduct creative brainstorming and mind-mapping to achieve the best results."],
            ["Personal CRM", "A dedicated client relationship manager is available for you at all times."],
            ["Post-Production Excellence", "We enhance the best shots and apply colour grading to bring out the beauty."],
          ].map(([t, d]) => (
            <View key={t} style={{ marginBottom: 27 }}>
              <Text style={[label, { marginBottom: 7 }]}>{t}</Text>
              <Text style={body}>{d}</Text>
            </View>
          ))}
        </View>
        <Image src={art("workflow-photo.jpg")} style={abs(312.5, 160.8, 286.5, 561.4)} />
        <Image src={art("workflow-floral.jpg")} style={abs(424.6, 724.8, 174.4, 122.5)} />
      </Page>

      {/* 06 · Scope — Pre-Wedding Events */}
      {pre.length > 0 && (
        <Page size={SIZE} style={[page, { paddingTop: 22, paddingBottom: 40 }]}>
          <ScopeTitle subtitle="Pre-Wedding Events" />
          <ScopeGrid list={pre} />
        </Page>
      )}

      {/* 07 · Scope — The Grand Wedding, notes and the couple shoot */}
      <Page size={SIZE} style={[page, { paddingTop: 22, paddingBottom: 40 }]}>
        <ScopeTitle subtitle="The Grand Wedding" />
        {grand.length > 0 ? (
          <ScopeGrid list={grand} />
        ) : (
          <Text style={[body, { paddingHorizontal: 41, color: C.grey }]}>The wedding day itself is not part of this quotation.</Text>
        )}
        <View style={{ paddingHorizontal: 47, marginTop: 24 }} wrap={false}>
          {extrasNote ? (
            <View style={{ flexDirection: "row", alignItems: "flex-end", marginBottom: 26 }}>
              <Text style={{ fontFamily: SANS_BOLD, fontSize: 13, marginRight: 9 }}>Note:</Text>
              <Text style={body}>{extrasNote}</Text>
            </View>
          ) : null}
          <Text style={{ fontFamily: SERIF, fontSize: 20, color: C.forest, marginBottom: 8 }}>Couple Photoshoot</Text>
          <Text style={body}>
            Get 30-50 photos as <Text style={{ fontFamily: SANS_BOLD, fontSize: 13 }}>complimentary</Text> at any one location of your choice
          </Text>
          <Text style={[body, { marginBottom: 12 }]}>& a complimentary reel</Text>
          <Text style={{ fontFamily: SANS_BOLD, fontSize: 11, marginBottom: 8 }}>NOTE:</Text>
          <Bullets
            size={10.6}
            gap={2}
            items={[
              "Any location fees for pre or post-wedding photoshoots, as well as costume and makeup artist charges, must be covered by the client.",
              "Transportation is not included in the couple shoot.",
            ]}
          />
        </View>
      </Page>

      {/* 08 · Deliverables */}
      <Page size={SIZE} style={page}>
        <Image src={art("deliver-floral.jpg")} style={abs(495.9, 0, 103.1, 121.9)} />
        <Text style={[heading, abs(42, 34)]}>Deliverables</Text>
        <View style={[rule, abs(43, 76)]} />
        {[
          { x: 31, y: 102, t: "Photos", d: "Approximately 1000-1500 meticulously edited photos will be provided on your hard drive, all raw images from your events will be included on the hard drive" },
          { x: 207, y: 245, t: "Wedding Film 4K", d: "Around 2-3 minutes engagement teaser & Around 5-8 minutes wedding film showcasing the highlights of your over all wedding will be available on the cloud." },
          { x: 31, y: 388, t: "Traditional Video", d: "Fully edited, 4K videos of your events will be delivered on the hard drive." },
          { x: 207, y: 531, t: "Luxury Albums", d: "Complimentary four luxury albums (Physical & Digital) each with 30 sheets, will be provided." },
          { x: 34, y: 674, t: "Pic-Time Link", d: "Get all your pictures, reels & teasers in a link which is an AI based luxurious online gallery." },
        ].map((b) => (
          <View key={b.t} style={[abs(b.x, b.y, 364, 130), { backgroundColor: C.box, borderRadius: 20, paddingTop: 22, paddingLeft: 38, paddingRight: 30 }]}>
            <Text style={[label, { marginBottom: 9 }]}>{b.t}</Text>
            <Text style={body}>{b.d}</Text>
          </View>
        ))}
        <Image src={art("arrow-right.jpg")} style={abs(412.3, 172.4, 25.9, 55.8)} />
        <Image src={art("arrow-left.jpg")} style={abs(163.4, 317.7, 25.9, 53.1)} />
        <Image src={art("arrow-right.jpg")} style={abs(412.3, 458, 25.9, 55.8)} />
        <Image src={art("arrow-left.jpg")} style={abs(163.4, 612, 25.9, 53.1)} />
      </Page>

      {/* 09 · Quote */}
      <Page size={SIZE} style={[page, { paddingTop: 40, paddingHorizontal: 50, paddingBottom: 30 }]}>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 30 }}>
          <Text style={{ fontFamily: SERIF, fontSize: 52, color: C.forest, lineHeight: 1 }}>QUOTE</Text>
          <View style={{ width: 48, height: 1, backgroundColor: C.forest, marginLeft: 18, marginTop: 4 }} />
        </View>
        <Text style={{ fontSize: 14.5, marginBottom: 3 }}>
          Total price: {discounted ? <Text style={{ textDecoration: "line-through", color: C.grey }}>{lakh(total)}</Text> : <Text style={{ fontFamily: SANS_BOLD }}>{lakh(total)}</Text>}
        </Text>
        {discounted ? <Text style={{ fontFamily: SANS_BOLD, fontSize: 14.5 }}>Discounted price : {lakh(discounted)}</Text> : null}
        {quote.illustrative ? (
          <Text style={{ fontSize: 7.5, color: "#8a6a2e", marginTop: 4, letterSpacing: 1 }}>ILLUSTRATIVE PRICING — NOT APPROVED STUDIO RATES</Text>
        ) : null}

        <Text style={[label, { fontSize: 11, marginTop: 30, marginBottom: 9 }]}>Payment Terms</Text>
        <Bullets items={["10% Advance for booking the dates and hiring the equipment", "40% Before the wedding", "50% Last day of the event"]} gap={3} />

        <Text style={[label, { fontSize: 11, marginTop: 18, marginBottom: 9 }]}>Note</Text>
        <Bullets
          gap={3}
          items={[
            "Transportation and Accommodation: To be provided by the client.",
            "Additional Events: This quotation covers the specified events; coverage costs may differ for any additional events.",
            `${config.tax.label || "GST"}: The above charges are exclusive of ${config.tax.ratePercent || 18}% ${config.tax.label || "GST"}.`,
            "Advance Payment: Non-refundable.",
            "Copyrights: We hold all rights to use the images on our websites and blogs.",
            "Event Changes: Any changes or postponements will be accommodated based on our availability.",
            "Storage: Please provide three hard drives before the first event for storing all photos and videos",
          ]}
        />

        <Text style={[label, { fontSize: 10, marginTop: 22, marginBottom: 9 }]}>Delivery Timelines</Text>
        <Bullets
          size={10.4}
          gap={3}
          items={[
            ...(tier ? [`Chosen timeline: ${tier.priorityName} — ${tier.label.toLowerCase()} of the final event.`] : []),
            "Receive 300-500 candid photos and reels & teaser via AI based Pic-Time link within 30-40 days post-payment. Remaining photos will be on hard drives at final delivery.",
            "Full-length 4K videos provided on hard drive within 30-40 days",
            "Complimentary luxury albums (Physical & Digital) each with 30 sheets, will be provided with in 30-40 days after selection.",
          ]}
        />

        <Text style={[label, { fontSize: 10.5, marginTop: 20, marginBottom: 9 }]}>Additional Offerings (Optional)</Text>
        <Bullets
          gap={3}
          items={["One Luxury album 30 sheets each - INR 20K", "Weblive per event - INR 15K", "LED’s Size 8*12 - INR 20K", "Drone - INR 15K"]}
        />
        <Image src={art("quote-floral.jpg")} style={abs(461.6 - 50, 732.5 - 40, 137.4, 115)} fixed />
        {reference ? <Text style={[abs(50, 812), { fontSize: 7, color: C.grey, letterSpacing: 1 }]} fixed>REF. {reference}</Text> : null}
      </Page>

      {/* 10 · Thank you */}
      <Page size={SIZE} style={page}>
        <Image src={art("closing-floral.jpg")} style={abs(0, 0, 115.4, 154.3)} />
        <Image src={logo} style={abs((W - 118) / 2, 64, 118)} />
        <Text style={[abs(0, 218, W), { textAlign: "center", fontSize: 11.5 }]}>
          Have questions or need clarification about this quote? Reach out to us anytime!
        </Text>
        <Text style={[abs(60, 248, W - 120), { textAlign: "center", fontFamily: SERIF, fontSize: 23, color: C.forest, lineHeight: 1.2 }]}>
          We can&apos;t wait to be a part of your special day and capture memories that last a lifetime
        </Text>
        <View style={[rule, abs((W - 50) / 2, 330)]} />
        <Text style={[abs(0, 354, W), { textAlign: "center", fontFamily: SERIF, fontSize: 23, color: C.forest }]}>Thank you for choosing 24 Frames</Text>
        <Text style={[abs(0, 400, W), { textAlign: "center", fontSize: 9, color: C.grey, letterSpacing: 1 }]}>
          {[config.studio.phoneDisplay, config.studio.email, config.studio.instagram].filter(Boolean).join("   ·   ")}
        </Text>
        <Image src={art("closing-photo.jpg")} style={abs(0, 506.9, W, H - 507.6)} />
      </Page>
    </Document>
  );
}

