/* ============================================================
   24 FRAMES — Commission domain model
   ------------------------------------------------------------
   Pure types shared by the consultation UI, the pricing engine,
   the server repository, the PDF proposal and WhatsApp builder.
   ============================================================ */

export type ISODate = string; // "2027-02-14"
export type ISODateTime = string; // full ISO timestamp

/* ---------- Studio configuration (admin-managed) ---------- */

/** Which post-production pool a service's cost feeds when the studio
 *  prices photography and video post-production separately. */
export type PostProductionGroup = "photo" | "video" | "none";

export interface ServiceDefinition {
  id: string;
  /** Display order in the catalogue. */
  order: number;
  name: string;
  /** Short editorial kicker, e.g. "The Record". */
  epithet: string;
  introduction: string;
  role: string;
  /** What the professional actually does — bullet list. */
  captures: string[];
  whyItMatters: string;
  deliverables: string[];
  /** Event preset ids this service is especially suited to. Empty = all. */
  suitableFor: string[];
  /** Human sentence about recommended team size. */
  recommendedNote: string;
  /** Price per pricing unit in rupees. */
  price: number;
  /** e.g. "per professional · per event". */
  unitLabel: string;
  /** Singular noun for quantity, e.g. "photographer". */
  unitNoun: string;
  minQuantity: number;
  maxQuantity: number;
  image: string;
  imageAlt: string;
  postProductionGroup: PostProductionGroup;
  /** Technical notes shown in the dossier (e.g. live stream bandwidth). */
  technicalNotes?: string[];
  active: boolean;
  /** Premium positioning flag for editorial treatment. */
  signature?: boolean;
}

export interface EventPreset {
  id: string;
  label: string;
  /** Default duration in hours when the couple has not set times. */
  typicalHours: number;
  /** Ritual-heavy events get formal-coverage recommendations. */
  ritual: boolean;
}

export type BandInterpolation = "step" | "linear";

export interface BudgetBand {
  /** Creative production subtotal threshold in rupees. */
  threshold: number;
  /** Base post-production fee at that threshold. */
  fee: number;
}

export interface BandTable {
  bands: BudgetBand[];
  /** How subtotals between two thresholds are priced. */
  interpolation: BandInterpolation;
  /** Below the lowest threshold: use the first band's fee, or scale it
   *  proportionally from zero. */
  belowFirstBand: "first_band_fee" | "proportional";
  /** Above the highest threshold: hold the last band's fee. */
  minFee: number | null;
  maxFee: number | null;
}

export interface PostProductionConfig {
  /** "combined" uses one band table on the whole production subtotal.
   *  "split" prices photo and video pools separately. */
  mode: "combined" | "split";
  combined: BandTable;
  photo: BandTable;
  video: BandTable;
  /** Round final post-production fee to the nearest N rupees. */
  roundTo: number;
}

export interface DeliveryTier {
  id: string;
  /** "Within 15 days" */
  label: string;
  days: number;
  /** "Express Priority" */
  priorityName: string;
  multiplier: number;
  meaning: string;
  whyPrice: string;
  covers: string[];
  expectations: string;
  conditions: string;
  available: boolean;
}

export type ChargeKind = "fixed" | "percent_of_production";

export interface ChargeDefinition {
  id: string;
  label: string;
  description: string;
  kind: ChargeKind;
  /** Rupees for fixed, percentage for percent_of_production. */
  amount: number;
  /** Available to the consultant in this studio. Never auto-applied. */
  available: boolean;
}

export interface TaxConfig {
  enabled: boolean;
  label: string;
  ratePercent: number;
  note: string;
}

export interface StudioDetails {
  name: string;
  tagline: string;
  phoneDisplay: string;
  /** Digits only, with country code, e.g. 919014433074. */
  whatsappNumber: string;
  email: string;
  website: string;
  instagram: string;
  address: string;
}

export interface ProposalSettings {
  validityDays: number;
  introduction: string;
  closingMessage: string;
  terms: string[];
  coverImage: string;
  celebrationImage: string;
  closingImage: string;
  referencePrefix: string;
}

export interface StudioConfig {
  version: number;
  updatedAt: ISODateTime;
  /** While true every price surface is labelled "Illustrative pricing". */
  pricingIsIllustrative: boolean;
  studio: StudioDetails;
  services: ServiceDefinition[];
  eventPresets: EventPreset[];
  postProduction: PostProductionConfig;
  deliveryTiers: DeliveryTier[];
  defaultDeliveryTierId: string | null;
  charges: ChargeDefinition[];
  tax: TaxConfig;
  proposal: ProposalSettings;
}

/* ---------- Commission draft (consultation state) ---------- */

export type PreferredContact = "whatsapp" | "call" | "email";

export interface CoupleDetails {
  brideName: string;
  groomName: string;
  phone: string;
  email: string;
  weddingDate: ISODate | "";
  /** Free text when the exact date is unknown, e.g. "Late February 2027". */
  approximateDate: string;
  city: string;
  preferredContact: PreferredContact;
  notes: string;
}

export type VenueSetting = "indoor" | "outdoor" | "mixed" | "";
export type VenueScale = "intimate" | "medium" | "grand" | "";

export interface CelebrationEvent {
  id: string;
  name: string;
  /** EventPreset id or "custom". */
  type: string;
  /** Free label when type === "custom". */
  customType: string;
  date: ISODate | "";
  startTime: string; // "18:30"
  endTime: string;
  venue: string;
  location: string;
  guestCount: number | null;
  venueSetting: VenueSetting;
  venueScale: VenueScale;
  /** Overlaps with another ceremony at the same time (e.g. parallel rituals). */
  parallelActivities: boolean;
  specialRequirements: string;
  notes: string;
}

export interface ServiceAssignment {
  id: string;
  eventId: string;
  serviceId: string;
  quantity: number;
  /** Consultant-entered unit price override in rupees. */
  unitPriceOverride: number | null;
  overrideReason: string;
}

export interface ManualOverride {
  amount: number;
  reason: string;
}

export interface CommissionDraft {
  id: string;
  schemaVersion: 1;
  couple: CoupleDetails;
  events: CelebrationEvent[];
  assignments: ServiceAssignment[];
  deliveryTierId: string | null;
  /** Charges the consultant explicitly added. */
  appliedChargeIds: string[];
  postProductionOverride: ManualOverride | null;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
  /** When duplicated from a stored record. */
  duplicatedFrom: string | null;
  /** Event-planning services the couple would like help with (optional). */
  planning?: PlanningRequest;
}

/** Beyond photography: planning services the couple ticked, and a note. */
export interface PlanningRequest {
  services: string[];
  note: string;
}

/* ---------- Pricing output ---------- */

export interface PricedLine {
  assignmentId: string;
  eventId: string;
  serviceId: string;
  serviceName: string;
  unitNoun: string;
  unitLabel: string;
  quantity: number;
  unitPrice: number;
  catalogueUnitPrice: number;
  overridden: boolean;
  overrideReason: string;
  lineTotal: number;
  postProductionGroup: PostProductionGroup;
}

export interface PricedEvent {
  eventId: string;
  lines: PricedLine[];
  subtotal: number;
  professionals: number;
}

export interface BandResolution {
  pool: "combined" | "photo" | "video";
  subtotal: number;
  fee: number;
  /** Human explanation, e.g. "Between ₹2,00,000 and ₹3,00,000 bands". */
  explanation: string;
  lowerBand: BudgetBand | null;
  upperBand: BudgetBand | null;
  clamped: "min" | "max" | null;
}

export interface PostProductionQuote {
  mode: "combined" | "split";
  resolutions: BandResolution[];
  baseFee: number;
  tierId: string | null;
  tierLabel: string | null;
  priorityName: string | null;
  multiplier: number | null;
  /** baseFee × multiplier, rounded — before any manual override. */
  computedFee: number;
  finalFee: number;
  overridden: boolean;
  overrideReason: string;
}

export interface PricedCharge {
  id: string;
  label: string;
  description: string;
  amount: number;
}

export interface CommissionQuote {
  events: PricedEvent[];
  lines: PricedLine[];
  productionSubtotal: number;
  photoSubtotal: number;
  videoSubtotal: number;
  otherSubtotal: number;
  totalProfessionals: number;
  postProduction: PostProductionQuote;
  charges: PricedCharge[];
  chargesTotal: number;
  taxableAmount: number;
  tax: { label: string; ratePercent: number; amount: number } | null;
  grandTotal: number;
  illustrative: boolean;
  issues: string[];
}

/* ---------- Stored records (server) ---------- */

export type ShareChannel =
  | "pdf_download"
  | "whatsapp_click_to_chat"
  | "native_share"
  | "whatsapp_cloud_api"
  | "message_copied";

export type ShareStatus = "completed" | "opened" | "failed" | "handed_to_device" | "accepted_by_api";

export interface ShareActivity {
  id: string;
  commissionId: string;
  channel: ShareChannel;
  status: ShareStatus;
  detail: string;
  at: ISODateTime;
  by: string;
}

export interface CommissionSummaryRow {
  id: string;
  reference: string;
  coupleNames: string;
  weddingDate: string;
  city: string;
  eventCount: number;
  grandTotal: number;
  deliveryLabel: string | null;
  consultant: string;
  createdAt: ISODateTime;
}

/** Full record as reconstructed from normalised tables. */
export interface CommissionRecord {
  id: string;
  reference: string;
  status: "submitted";
  consultant: string;
  createdAt: ISODateTime;
  configVersion: number;
  draft: CommissionDraft;
  quote: CommissionQuote;
  /** Snapshot of the services / tier / studio used to price this record so
   *  historical proposals render exactly as they were submitted. */
  configSnapshot: StudioConfig;
  activity: ShareActivity[];
}
