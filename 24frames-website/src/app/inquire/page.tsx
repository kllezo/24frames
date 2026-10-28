"use client";

import { useState } from "react";
import Link from "next/link";
import DatePickerPopover from "./DatePickerPopover";
import Footer from "@/components/layout/Footer";
import styles from "./Inquire.module.css";

/* ════════════════════════════════════════════════════════════════════════════
   24 FRAMES — THE COMMISSION ATELIER
   A bespoke, royal wedding photography and cinema commissioning journey.
   Warm Ivory, Parchment, Deep Forest Green (#09453E), Antique Gold (#C8A84E).
   ════════════════════════════════════════════════════════════════════════════ */

export interface EventTimelineEntry {
  id: string;
  name: string;
  date: string;
  startDate?: string;
  endDate?: string;
  isTBD?: boolean;
  city: string;
  venue: string;
  coverage: string;
}

export interface CommissionCategory {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  isWeddingLike: boolean;
}

export interface VisualDirectionItem {
  id: string;
  title: string;
  description: string;
  image: string;
}

export interface ServiceOption {
  id: string;
  name: string;
  description: string;
  tag: string;
}

const COMMISSION_CATEGORIES: CommissionCategory[] = [
  {
    id: "weddings",
    title: "Weddings & Celebrations",
    subtitle: "Multi-day royal celebrations, sacred muhurthams, destination unions & generational memories.",
    image: "/images/portfolio/sireesh-harshitha/cover.jpg",
    isWeddingLike: true,
  },
  {
    id: "pre-wedding",
    title: "Pre-wedding Photography & Films",
    subtitle: "Cinematic portrait films, destination love stories, and intimate visual poetry on cinema primes.",
    image: "/videos/portfolio/vinitha-vivekananda/poster.jpg",
    isWeddingLike: true,
  },
  {
    id: "events",
    title: "Events & Cultural Galas",
    subtitle: "High-octane Sangeet galas, milestone celebrations, anniversary festivals & national galas.",
    image: "/images/stories/bellam-srikonda/IMG_6340.jpg",
    isWeddingLike: true,
  },
  {
    id: "fashion",
    title: "Fashion & Editorial",
    subtitle: "Bespoke designer lookbooks, high-jewelry campaigns, and avant-garde couture spreads.",
    image: "/images/stories/bellam-srikonda/IMG_6341.jpg",
    isWeddingLike: false,
  },
  {
    id: "commercial",
    title: "Commercial Campaigns",
    subtitle: "Brand visual direction, luxury hospitality motion pictures, and architectural commercial narratives.",
    image: "/images/portfolio/bellamkonda-kavya-reception/cover.jpg",
    isWeddingLike: false,
  },
  {
    id: "other",
    title: "Other Bespoke Commissions",
    subtitle: "Private family heritage vaults, cultural documentaries, and custom fine-art commissions.",
    image: "/images/stories/sirish-and-harshitha/IMG_6346.jpg",
    isWeddingLike: false,
  },
];

const VISUAL_DIRECTIONS: VisualDirectionItem[] = [
  {
    id: "cinematic",
    title: "Cinematic & Atmospheric",
    description: "Rich optical anamorphic depth, natural dusk flares, and chiaroscuro emotional lighting.",
    image: "/images/portfolio/karthik-falaknama/cover.jpg",
  },
  {
    id: "documentary",
    title: "Documentary & Candid",
    description: "Unobtrusive observational mastery capturing unscripted tears, laughter, and family warmth.",
    image: "/images/stories/bellam-srikonda/IMG_6339.jpg",
  },
  {
    id: "royal",
    title: "Royal & Editorial",
    description: "Monumental palace architecture, sculpted royal bridal portraits, and timeless regal composure.",
    image: "/images/portfolio/sireesh-harshitha/cover.jpg",
  },
  {
    id: "intimate",
    title: "Intimate & Emotional",
    description: "Quiet ritual details, shared family glances, sacred promises, and generational tenderness.",
    image: "/images/portfolio/hrithika-abhishek/cover.jpg",
  },
  {
    id: "fashion-led",
    title: "Fashion-Led & Art Directed",
    description: "High-couture lighting, sculptural silhouettes, and avant-garde optical framing.",
    image: "/images/stories/bellam-srikonda/IMG_6341.jpg",
  },
  {
    id: "balanced",
    title: "A Harmonious Blend",
    description: "A balanced symphony combining master cinema films, authentic documentary, and fine-art portraits.",
    image: "/images/stories/sirish-and-harshitha/IMG_6346.jpg",
  },
];

const SERVICE_OPTIONS: ServiceOption[] = [
  {
    id: "optical-photo",
    name: "Optical Cinema Master Photography",
    description: "Medium-format and optical cinema prime stills, color-calibrated and delivered in master high resolution.",
    tag: "STILLS ARCHIVE",
  },
  {
    id: "theatrical-cinema",
    name: "Theatrical 4K Master Cinema Film",
    description: "Feature-length wedding motion picture edited with bespoke orchestral sound design and cinema color grading.",
    tag: "MASTER CINEMA",
  },
  {
    id: "signature-reels",
    name: "Signature Teasers & 4K Vertical Reels",
    description: "Social-first 9:16 cinematic master cuts delivered within 48–72 hours of major rituals.",
    tag: "SOCIAL MASTER",
  },
  {
    id: "heirloom-albums",
    name: "Generational Heirloom Bound Albums",
    description: "Hand-crafted Italian archival leather fine-art books engineered for multi-generational longevity.",
    tag: "HEIRLOOM VAULT",
  },
  {
    id: "aerial-cinema",
    name: "Architectural Drone & Aerial Cinematography",
    description: "Licensed optical cinema drone sweeps capturing grand palace courtyards and monumental settings.",
    tag: "AERIAL SUITE",
  },
  {
    id: "extended-crew",
    name: "Extended Multi-Crew Production",
    description: "Dedicated parallel cinema teams for extensive guest lists and simultaneous bride and groom celebrations.",
    tag: "PRODUCTION SCALE",
  },
];

const INVESTMENT_RANGES = [
  { id: "tier1", label: "₹12,00,000 – ₹20,00,000", desc: "Essential Master Commission Suite" },
  { id: "tier2", label: "₹20,00,000 – ₹35,00,000", desc: "Signature Royal Multi-Day Archive" },
  { id: "tier3", label: "₹35,00,000 – ₹50,00,000+", desc: "Monumental Grand Production Suite" },
  { id: "custom", label: "Discuss a Custom Commission", desc: "Tailored to your specific creative scope" },
];

export default function InquirePage() {
  // Stages:
  // 0: The Invitation (Opening)
  // 1: The Commission Category
  // 2: The Occasion Timeline / Project Scope
  // 3: Visual Direction & Craft Services
  // 4: The Living Brief & Present Commission
  // 5: Personalized Confirmation Folio
  const [stage, setStage] = useState<number>(0);

  // Commission selections
  const [selectedCategory, setSelectedCategory] = useState<string>("weddings");

  // Timeline events
  const [events, setEvents] = useState<EventTimelineEntry[]>([
    {
      id: "event-1",
      name: "Sacred Muhurtham & Wedding Ceremony",
      date: "",
      city: "Hyderabad",
      venue: "Grand Palace / Heritage Venue",
      coverage: "Master Photography & Theatrical Cinema",
    },
    {
      id: "event-2",
      name: "Sangeet Gala & Celebrations",
      date: "",
      city: "Hyderabad",
      venue: "",
      coverage: "Evening Celebration Coverage",
    },
  ]);

  // Non-wedding project scope
  const [projectScope, setProjectScope] = useState<string>("");

  // Creative direction
  const [selectedDirections, setSelectedDirections] = useState<string[]>(["cinematic", "royal"]);
  const [inspirationNote, setInspirationNote] = useState<string>("");

  // Services & Investment
  const [selectedServices, setSelectedServices] = useState<string[]>([
    "optical-photo",
    "theatrical-cinema",
    "signature-reels",
  ]);
  const [selectedInvestment, setSelectedInvestment] = useState<string>("tier2");

  // Client Details
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [memoriesToRemember, setMemoriesToRemember] = useState<string>("");

  // Validation
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  /* ── Event Composer Actions ── */
  const handleAddEvent = () => {
    const newId = `event-${Date.now()}`;
    setEvents((prev) => [
      ...prev,
      {
        id: newId,
        name: "Ritual / Celebration",
        date: "",
        city: prev[0]?.city || "",
        venue: "",
        coverage: "Full Photography & Cinema",
      },
    ]);
  };

  const handleUpdateEvent = (id: string, field: keyof EventTimelineEntry, value: string) => {
    setEvents((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleUpdateEventDate = (
    id: string,
    formattedSummary: string,
    startDate?: string,
    endDate?: string,
    isTBD?: boolean
  ) => {
    setEvents((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              date: formattedSummary,
              startDate,
              endDate,
              isTBD,
            }
          : item
      )
    );
  };

  const handleRemoveEvent = (id: string) => {
    if (events.length <= 1) return;
    setEvents((prev) => prev.filter((item) => item.id !== id));
  };

  /* ── Visual Direction & Service Toggles ── */
  const toggleDirection = (id: string) => {
    setSelectedDirections((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const toggleService = (id: string) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  /* ── Navigation & Validation ── */
  const handleNext = () => {
    setStage((prev) => Math.min(5, prev + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setStage((prev) => Math.max(0, prev - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleJumpToStage = (targetStage: number) => {
    setStage(targetStage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const validateAndPresentCommission = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) newErrors.fullName = "Please provide your full name";
    if (!email.trim()) {
      newErrors.email = "Please provide your email address";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!phone.trim()) newErrors.phone = "Please provide your phone or WhatsApp number";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setStage(5);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 600);
  };

  /* ── Current Category Metadata ── */
  const currentCategory =
    COMMISSION_CATEGORIES.find((c) => c.id === selectedCategory) || COMMISSION_CATEGORIES[0];
  const isWeddingLike = currentCategory.isWeddingLike;

  const currentInvestment =
    INVESTMENT_RANGES.find((r) => r.id === selectedInvestment) || INVESTMENT_RANGES[1];

  /* ── Formatted WhatsApp Dispatch Brief ── */
  const formattedBriefText =
    `*ROYAL COMMISSION BRIEF — 24 FRAMES PHOTOGRAPHY*\n` +
    `----------------------------------------\n` +
    `• *Client Name:* ${fullName || "Patron"}\n` +
    `• *Commission Category:* ${currentCategory.title}\n` +
    (isWeddingLike && events.length > 0
      ? `• *Occasion Timeline (${events.length} Events):*\n` +
        events
          .map(
            (ev, i) =>
              `  ${i + 1}. ${ev.name} | ${ev.date || "Date TBD"} | ${ev.city || "City TBD"}${
                ev.venue ? ` (${ev.venue})` : ""
              }`
          )
          .join("\n") +
        "\n"
      : projectScope
      ? `• *Project Scope:* ${projectScope}\n`
      : "") +
    `• *Visual Direction:* ${selectedDirections
      .map((d) => VISUAL_DIRECTIONS.find((vd) => vd.id === d)?.title || d)
      .join(", ")}\n` +
    `• *Requested Craft Services:* ${selectedServices
      .map((s) => SERVICE_OPTIONS.find((so) => so.id === s)?.name || s)
      .join(", ")}\n` +
    `• *Investment Scope:* ${currentInvestment.label}\n` +
    `• *Contact:* ${email} | ${phone}\n` +
    (memoriesToRemember ? `• *Memories to Remember:* "${memoriesToRemember}"\n` : "") +
    (inspirationNote ? `• *Creative Notes:* ${inspirationNote}\n` : "") +
    `----------------------------------------\n` +
    `Presented via 24 Frames Commission Atelier.`;

  const whatsappHref = `https://wa.me/919959664567?text=${encodeURIComponent(formattedBriefText)}`;

  return (
    <div className={styles.atelierPage}>
      {/* ── ATELIER MASTHEAD ── */}
      <header className={styles.atelierHeader} role="banner">
        <div className={styles.headerInner}>
          <Link href="/" className={styles.backLink} aria-label="Return to 24 Frames website">
            <span className={styles.backArrow} aria-hidden="true">←</span>
            <span>24 FRAMES ARCHIVE</span>
          </Link>

          <div className={styles.headerCrest}>
            <span className={styles.crestText}>24 FRAMES ATELIER</span>
            <span className={styles.crestDivider}>·</span>
            <span className={styles.crestSub}>HYDERABAD</span>
          </div>

          <div className={styles.folioIndicator}>
            <span className={styles.folioTag}>COMMISSION FOLIO</span>
            <span className={styles.folioId}>24F-2026</span>
          </div>
        </div>

        {/* Refined Luxury Editorial Journey Indicator (Active Stages 1–4) */}
        {stage >= 1 && stage <= 4 && (
          <nav className={styles.editorialJourneyTracker} aria-label="Commission Progress">
            <div className={styles.journeyTrack}>
              {[
                { step: 1, label: "Commission" },
                { step: 2, label: "Timeline" },
                { step: 3, label: "Direction & Craft" },
                { step: 4, label: "Living Brief" },
              ].map((s, idx) => (
                <div key={s.step} className={styles.journeyStageWrapper}>
                  {idx > 0 && (
                    <span
                      className={`${styles.journeyConnector} ${
                        stage >= s.step ? styles.journeyConnectorActive : ""
                      }`}
                      aria-hidden="true"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => s.step <= stage && handleJumpToStage(s.step)}
                    disabled={s.step > stage}
                    className={`${styles.journeyTab} ${
                      s.step === stage
                        ? styles.journeyTabActive
                        : s.step < stage
                        ? styles.journeyTabComplete
                        : styles.journeyTabUpcoming
                    }`}
                    aria-current={s.step === stage ? "step" : undefined}
                  >
                    <span className={styles.journeyStepNumber}>
                      {s.step < stage ? "✓" : `0${s.step}`}
                    </span>
                    <span className={styles.journeyStepLabel}>{s.label}</span>
                  </button>
                </div>
              ))}
            </div>
          </nav>
        )}
      </header>

      <main className={styles.atelierMain}>
        {/* ════════════════════════════════════════════════════════════
           STAGE 0: THE INVITATION (OPENING CINEMATIC EXPERIENCE)
           ════════════════════════════════════════════════════════════ */}
        {stage === 0 && (
          <section className={styles.invitationSection} aria-label="The Invitation">
            <div className={styles.invitationCard}>
              <div className={styles.invitationMediaSide}>
                <img
                  src="/images/portfolio/sireesh-harshitha/cover.jpg"
                  alt="Sireesh & Harshitha Sacred Wedding Union by 24 Frames"
                  className={styles.invitationHeroImg}
                />
                <div className={styles.invitationVignette} aria-hidden="true" />
                <div className={styles.invitationImageTag}>
                  <span className={styles.tagDot} />
                  <span>24 FRAMES ARCHIVAL MASTER COMMISSION</span>
                </div>
              </div>

              <div className={styles.invitationContentSide}>
                <div className={styles.invitationEyebrowRow}>
                  <span className={styles.goldDash} />
                  <span className={styles.invitationEyebrow}>PRIVATE COMMISSIONS ATELIER</span>
                </div>

                <h1 className={styles.invitationTitle}>
                  Tell us what you want to remember.
                </h1>

                <p className={styles.invitationNarrative}>
                  A master wedding film is not simply recorded; it is commissioned with purpose.
                  Through natural light, optical cinema primes, and quiet observation, Phani Gogireddy
                  and the 24 Frames studio preserve the sacred weight, spontaneous tears, and regal
                  elegance of your family’s most defining celebration.
                </p>

                <p className={styles.invitationSubtext}>
                  This interactive atelier allows you to compose your visual preferences, outline your
                  celebration rituals, and assemble a live commission brief tailored for your family.
                </p>

                <div className={styles.invitationActions}>
                  <button
                    onClick={handleNext}
                    className={styles.primaryAtelierBtn}
                    aria-label="Begin your bespoke commission"
                  >
                    <span>BEGIN YOUR COMMISSION</span>
                    <span className={styles.btnArrowIcon}>→</span>
                  </button>

                  <Link href="/" className={styles.secondaryAtelierBtn}>
                    <span>Explore Visual Archive</span>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ════════════════════════════════════════════════════════════
           STAGE 1: SELECT THE COMMISSION
           ════════════════════════════════════════════════════════════ */}
        {stage === 1 && (
          <section className={styles.stageSection} aria-label="Select Your Commission">
            <div className={styles.stageHeader}>
              <div className={styles.stageEyebrowRow}>
                <span className={styles.stageEyebrow}>STAGE I · THE COMMISSION</span>
                <span className={styles.stageStepMarker}>01 / 04</span>
              </div>
              <h2 className={styles.stageHeadline}>What sacred story shall we document?</h2>
              <p className={styles.stageSubtitle}>
                Choose the commission that reflects your celebration. Your selection shapes the timeline and creative direction that follow.
              </p>
              <div className={styles.goldDividerRule} aria-hidden="true" />
            </div>

            <div className={styles.categoryGrid}>
              {COMMISSION_CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`${styles.categoryCard} ${isSelected ? styles.categoryCardSelected : ""}`}
                    aria-pressed={isSelected}
                  >
                    <div className={styles.categoryImageWrap}>
                      <img src={cat.image} alt={cat.title} className={styles.categoryCoverImg} />
                      <div className={styles.categoryOverlay} />
                      {isSelected && (
                        <div className={styles.selectedBadge}>
                          <span>SELECTED</span>
                          <span className={styles.selectedCheck}>✓</span>
                        </div>
                      )}
                    </div>

                    <div className={styles.categoryInfo}>
                      <h3 className={styles.categoryTitle}>{cat.title}</h3>
                      <p className={styles.categorySubtitle}>{cat.subtitle}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className={styles.stageFooterNav}>
              <button onClick={handleBack} className={styles.backStepQuietBtn} type="button">
                <span className={styles.backArrowIcon}>←</span>
                <span>Back</span>
              </button>

              <button onClick={handleNext} className={styles.primaryAtelierBtn} type="button">
                <span>Continue to Timeline</span>
                <span className={styles.btnArrowIcon}>→</span>
              </button>
            </div>
          </section>
        )}

        {/* ════════════════════════════════════════════════════════════
           STAGE 2: BUILD THE OCCASION TIMELINE / SCOPE
           ════════════════════════════════════════════════════════════ */}
        {stage === 2 && (
          <section className={styles.stageSection} aria-label="Build the Occasion Timeline">
            <div className={styles.stageHeader}>
              <div className={styles.stageEyebrowRow}>
                <span className={styles.stageEyebrow}>STAGE II · THE OCCASION TIMELINE</span>
                <span className={styles.stageStepMarker}>02 / 04</span>
              </div>
              <h2 className={styles.stageHeadline}>
                {isWeddingLike ? "Compose your ritual timeline." : "Define your creative project scope."}
              </h2>
              <p className={styles.stageSubtitle}>
                {isWeddingLike
                  ? "From intimate ceremonies to multi-day celebrations, map the moments you want us to preserve. Dates and venues can remain undecided while plans take shape."
                  : "Detail your campaign timeline, estimated shoot dates, and key shooting destinations."}
              </p>
              <div className={styles.goldDividerRule} aria-hidden="true" />
            </div>

            {isWeddingLike ? (
              <div className={styles.timelineComposer}>
                <div className={styles.timelineList}>
                  {events.map((ev, index) => (
                    <div key={ev.id} className={styles.timelineEntryCard}>
                      <div className={styles.entryHeaderRow}>
                        <div className={styles.entryNumberBadge}>
                          <span className={styles.romanDigit}>{String(index + 1).padStart(2, "0")}</span>
                          <span className={styles.entryTag}>CELEBRATION EVENT</span>
                        </div>

                        {events.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveEvent(ev.id)}
                            className={styles.removeEventBtn}
                            aria-label={`Remove event ${index + 1}`}
                          >
                            <span>✕ Remove</span>
                          </button>
                        )}
                      </div>

                      <div className={styles.entryFieldsGrid}>
                        {/* Left Column: Event Name & Date Calendar */}
                        <div className={styles.entrySubCol}>
                          <div className={styles.fieldGroup}>
                            <label className={styles.fieldLabel}>Event / Ritual Name</label>
                            <input
                              type="text"
                              value={ev.name}
                              onChange={(e) => handleUpdateEvent(ev.id, "name", e.target.value)}
                              placeholder="e.g. Sacred Muhurtham, Sangeet Gala, Pellikuthuru, Reception"
                              className={styles.atelierInput}
                            />
                          </div>

                          <div className={styles.fieldGroup}>
                            <label className={styles.fieldLabel}>Event Date</label>
                            <DatePickerPopover
                              value={ev.date}
                              startDate={ev.startDate}
                              endDate={ev.endDate}
                              isTBD={ev.isTBD}
                              onChange={(dateSummary, startDate, endDate, isTBD) =>
                                handleUpdateEventDate(ev.id, dateSummary, startDate, endDate, isTBD)
                              }
                            />
                          </div>
                        </div>

                        {/* Right Column: Destination City & Optional Venue */}
                        <div className={styles.entrySubCol}>
                          <div className={styles.fieldGroup}>
                            <label className={styles.fieldLabel}>City / Destination</label>
                            <input
                              type="text"
                              value={ev.city}
                              onChange={(e) => handleUpdateEvent(ev.id, "city", e.target.value)}
                              placeholder="e.g. Hyderabad, Udaipur, Bengaluru, Falaknuma"
                              className={styles.atelierInput}
                            />
                          </div>

                          <div className={styles.fieldGroup}>
                            <label className={styles.fieldLabel}>Venue (Optional)</label>
                            <input
                              type="text"
                              value={ev.venue}
                              onChange={(e) => handleUpdateEvent(ev.id, "venue", e.target.value)}
                              placeholder="e.g. Taj Falaknuma Palace, ITC Kohenur, Private Estate"
                              className={styles.atelierInput}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className={styles.addEventRow}>
                  <button
                    type="button"
                    onClick={handleAddEvent}
                    className={styles.addEventBtn}
                    aria-label="Add another event or celebration"
                  >
                    <span className={styles.plusIcon}>+</span>
                    <span className={styles.addEventLabel}>Add another event or ritual</span>
                  </button>
                  <p className={styles.addEventHelperText}>
                    Wedding day · Pre-wedding event · Reception · Personal shoot
                  </p>
                </div>
              </div>
            ) : (
              <div className={styles.scopeComposer}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Project Scope &amp; Anticipated Shoot Dates</label>
                  <textarea
                    rows={6}
                    value={projectScope}
                    onChange={(e) => setProjectScope(e.target.value)}
                    placeholder="Describe your campaign concept, preferred shooting dates, desired locations, and core deliverable requirements..."
                    className={styles.atelierTextarea}
                  />
                </div>
              </div>
            )}

            <div className={styles.stageFooterNav}>
              <button onClick={handleBack} className={styles.backStepQuietBtn} type="button">
                <span className={styles.backArrowIcon}>←</span>
                <span>Back</span>
              </button>

              <button onClick={handleNext} className={styles.primaryAtelierBtn} type="button">
                <span>Continue to Direction &amp; Craft</span>
                <span className={styles.btnArrowIcon}>→</span>
              </button>
            </div>
          </section>
        )}

        {/* ════════════════════════════════════════════════════════════
           STAGE 3: VISUAL DIRECTION & CRAFT SERVICES
           ════════════════════════════════════════════════════════════ */}
        {stage === 3 && (
          <section className={styles.stageSection} aria-label="Visual Direction & Craft Services">
            <div className={styles.stageHeader}>
              <span className={styles.stageEyebrow}>STAGE III · VISUAL DIRECTION &amp; CRAFT</span>
              <h2 className={styles.stageHeadline}>Compose your aesthetic &amp; craft suite.</h2>
              <p className={styles.stageSubtitle}>
                Select the visual styles that resonate with your family, and tailor the cinema and
                photography services required for your commission.
              </p>
            </div>

            {/* Part A: Visual Direction Board */}
            <div className={styles.subSectionBlock}>
              <div className={styles.subSectionTitleRow}>
                <h3 className={styles.subSectionTitle}>Visual Direction Preferences</h3>
                <span className={styles.subSectionNote}>Select one or several creative directions</span>
              </div>

              <div className={styles.directionGrid}>
                {VISUAL_DIRECTIONS.map((dir) => {
                  const isSelected = selectedDirections.includes(dir.id);

                  return (
                    <button
                      key={dir.id}
                      type="button"
                      onClick={() => toggleDirection(dir.id)}
                      className={`${styles.directionCard} ${isSelected ? styles.directionCardSelected : ""}`}
                      aria-pressed={isSelected}
                    >
                      <div className={styles.directionImgWrap}>
                        <img src={dir.image} alt={dir.title} className={styles.directionImg} />
                        <div className={styles.directionOverlay} />
                        {isSelected && <span className={styles.checkBadge}>✓</span>}
                      </div>

                      <div className={styles.directionContent}>
                        <h4 className={styles.directionCardTitle}>{dir.title}</h4>
                        <p className={styles.directionCardDesc}>{dir.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className={styles.optionalInspoRow}>
                <label className={styles.fieldLabel}>Specific Visual References or Pinterest / Inspiration Link (Optional)</label>
                <input
                  type="text"
                  value={inspirationNote}
                  onChange={(e) => setInspirationNote(e.target.value)}
                  placeholder="Paste reference link or mention specific films, styles, or aesthetics you love..."
                  className={styles.atelierInput}
                />
              </div>
            </div>

            {/* Part B: Craft Services Selection */}
            <div className={styles.subSectionBlock}>
              <div className={styles.subSectionTitleRow}>
                <h3 className={styles.subSectionTitle}>Selectable Craft Services</h3>
                <span className={styles.subSectionNote}>Curated for uncompromised archival quality</span>
              </div>

              <div className={styles.servicesGrid}>
                {SERVICE_OPTIONS.map((srv) => {
                  const isChecked = selectedServices.includes(srv.id);

                  return (
                    <button
                      key={srv.id}
                      type="button"
                      onClick={() => toggleService(srv.id)}
                      className={`${styles.serviceCard} ${isChecked ? styles.serviceCardChecked : ""}`}
                      aria-pressed={isChecked}
                    >
                      <div className={styles.serviceTopRow}>
                        <span className={styles.serviceTag}>{srv.tag}</span>
                        <div className={styles.serviceCheckbox}>
                          {isChecked ? <span>✓</span> : null}
                        </div>
                      </div>

                      <h4 className={styles.serviceName}>{srv.name}</h4>
                      <p className={styles.serviceDesc}>{srv.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Part C: Investment Scope */}
            <div className={styles.subSectionBlock}>
              <div className={styles.subSectionTitleRow}>
                <h3 className={styles.subSectionTitle}>Investment Scope</h3>
                <span className={styles.subSectionNote}>Helps our studio tailor appropriate optical crew &amp; equipment</span>
              </div>

              <div className={styles.investmentGrid}>
                {INVESTMENT_RANGES.map((inv) => {
                  const isChosen = selectedInvestment === inv.id;

                  return (
                    <button
                      key={inv.id}
                      type="button"
                      onClick={() => setSelectedInvestment(inv.id)}
                      className={`${styles.investmentCard} ${isChosen ? styles.investmentCardChosen : ""}`}
                      aria-pressed={isChosen}
                    >
                      <div className={styles.investmentTop}>
                        <span className={styles.investmentLabel}>{inv.label}</span>
                        {isChosen && <span className={styles.goldRadioDot} />}
                      </div>
                      <span className={styles.investmentDesc}>{inv.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className={styles.stageFooterNav}>
              <button onClick={handleBack} className={styles.backStepQuietBtn} type="button">
                <span className={styles.backArrowIcon}>←</span>
                <span>Back</span>
              </button>

              <button onClick={handleNext} className={styles.primaryAtelierBtn} type="button">
                <span>Continue to Living Brief</span>
                <span className={styles.btnArrowIcon}>→</span>
              </button>
            </div>
          </section>
        )}

        {/* ════════════════════════════════════════════════════════════
           STAGE 4: THE LIVING BRIEF & PRESENT COMMISSION
           ════════════════════════════════════════════════════════════ */}
        {stage === 4 && (
          <section className={styles.stageSection} aria-label="The Living Brief">
            <div className={styles.stageHeader}>
              <span className={styles.stageEyebrow}>STAGE IV · THE LIVING BRIEF</span>
              <h2 className={styles.stageHeadline}>Your Master Commission Brief.</h2>
              <p className={styles.stageSubtitle}>
                This archival document has been live-assembled from your selections. Review your
                brief, provide your essential contact details, and present your commission to the studio.
              </p>
            </div>

            <div className={styles.briefAndContactLayout}>
              {/* Left Column: The Living Brief Editorial Folio Document */}
              <div className={styles.folioDocument}>
                <div className={styles.folioDocHeader}>
                  <div className={styles.folioDocBrandRow}>
                    <span className={styles.docBrandTitle}>24 FRAMES PHOTOGRAPHY &amp; MASTER CINEMA</span>
                    <span className={styles.docBrandSeal}>ARCHIVAL REGISTER</span>
                  </div>

                  <h3 className={styles.docMainHeading}>Commission Brief Folio</h3>
                  <div className={styles.docRule} aria-hidden="true" />
                </div>

                <div className={styles.folioDocBody}>
                  {/* Category Section */}
                  <div className={styles.docSection}>
                    <div className={styles.docSectionTitleRow}>
                      <span className={styles.docSectionKicker}>I. COMMISSION TYPE</span>
                      <button onClick={() => handleJumpToStage(1)} className={styles.editSectionBtn}>
                        Edit ↗
                      </button>
                    </div>
                    <div className={styles.docValueHighlighted}>{currentCategory.title}</div>
                    <div className={styles.docValueMuted}>{currentCategory.subtitle}</div>
                  </div>

                  {/* Timeline Section */}
                  <div className={styles.docSection}>
                    <div className={styles.docSectionTitleRow}>
                      <span className={styles.docSectionKicker}>
                        II. {isWeddingLike ? `RITUAL TIMELINE (${events.length} EVENTS)` : "PROJECT SCOPE"}
                      </span>
                      <button onClick={() => handleJumpToStage(2)} className={styles.editSectionBtn}>
                        Edit ↗
                      </button>
                    </div>

                    {isWeddingLike ? (
                      <div className={styles.docTimelineList}>
                        {events.map((ev, i) => (
                          <div key={ev.id} className={styles.docTimelineItem}>
                            <span className={styles.docItemIndex}>0{i + 1}</span>
                            <div className={styles.docItemDetails}>
                              <div className={styles.docItemName}>{ev.name}</div>
                              <div className={styles.docItemMeta}>
                                <span>{ev.date || "Date Pending"}</span>
                                <span className={styles.docDot}>·</span>
                                <span>{ev.city || "City Pending"}</span>
                                {ev.venue ? <span> ({ev.venue})</span> : null}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className={styles.docScopeText}>
                        {projectScope || "Scope description provided upon consultation."}
                      </p>
                    )}
                  </div>

                  {/* Visual Direction Section */}
                  <div className={styles.docSection}>
                    <div className={styles.docSectionTitleRow}>
                      <span className={styles.docSectionKicker}>III. VISUAL DIRECTION</span>
                      <button onClick={() => handleJumpToStage(3)} className={styles.editSectionBtn}>
                        Edit ↗
                      </button>
                    </div>
                    <div className={styles.docTagsRow}>
                      {selectedDirections.map((d) => {
                        const dir = VISUAL_DIRECTIONS.find((vd) => vd.id === d);
                        return (
                          <span key={d} className={styles.docPillTag}>
                            {dir?.title || d}
                          </span>
                        );
                      })}
                    </div>
                    {inspirationNote && (
                      <div className={styles.docInspoNote}>“{inspirationNote}”</div>
                    )}
                  </div>

                  {/* Craft Services Section */}
                  <div className={styles.docSection}>
                    <div className={styles.docSectionTitleRow}>
                      <span className={styles.docSectionKicker}>IV. CRAFT SERVICES &amp; SCOPE</span>
                      <button onClick={() => handleJumpToStage(3)} className={styles.editSectionBtn}>
                        Edit ↗
                      </button>
                    </div>
                    <ul className={styles.docServicesList}>
                      {selectedServices.map((s) => {
                        const srv = SERVICE_OPTIONS.find((so) => so.id === s);
                        return (
                          <li key={s} className={styles.docServiceBullet}>
                            <span>• {srv?.name || s}</span>
                          </li>
                        );
                      })}
                    </ul>
                    <div className={styles.docInvestmentTag}>
                      <span>Scope: {currentInvestment.label}</span>
                    </div>
                  </div>
                </div>

                <div className={styles.folioDocFooter}>
                  <span className={styles.folioDocSealText}>OFFICIAL 24 FRAMES ARCHIVAL SPECIFICATION</span>
                </div>
              </div>

              {/* Right Column: Contact Details & Submit Form */}
              <div className={styles.contactDetailsSide}>
                <div className={styles.contactHeader}>
                  <h3 className={styles.contactTitle}>Present Your Commission</h3>
                  <p className={styles.contactSubtitle}>
                    Enter your contact details so founder Phani Gogireddy and our executive team can
                    personally review your celebration and respond.
                  </p>
                </div>

                <form onSubmit={validateAndPresentCommission} className={styles.contactForm}>
                  <div className={styles.formGroup}>
                    <label htmlFor="fullName" className={styles.inputLabel}>
                      Full Name <span className={styles.reqStar}>*</span>
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: "" }));
                      }}
                      placeholder="e.g. Hrithika Reddy & Abhishek Rao"
                      className={`${styles.atelierFormInput} ${errors.fullName ? styles.inputError : ""}`}
                    />
                    {errors.fullName && <span className={styles.errorText}>{errors.fullName}</span>}
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="email" className={styles.inputLabel}>
                      Email Address <span className={styles.reqStar}>*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
                      }}
                      placeholder="e.g. abhishek@family.com"
                      className={`${styles.atelierFormInput} ${errors.email ? styles.inputError : ""}`}
                    />
                    {errors.email && <span className={styles.errorText}>{errors.email}</span>}
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="phone" className={styles.inputLabel}>
                      Phone / WhatsApp Number <span className={styles.reqStar}>*</span>
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (errors.phone) setErrors((prev) => ({ ...prev, phone: "" }));
                      }}
                      placeholder="e.g. +91 98765 43210"
                      className={`${styles.atelierFormInput} ${errors.phone ? styles.inputError : ""}`}
                    />
                    {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="memories" className={styles.inputLabel}>
                      What do you want to remember? (Personal Reflections)
                    </label>
                    <textarea
                      id="memories"
                      rows={4}
                      value={memoriesToRemember}
                      onChange={(e) => setMemoriesToRemember(e.target.value)}
                      placeholder="Tell us about the people, rituals, or feelings that matter most to you..."
                      className={styles.atelierFormTextarea}
                    />
                  </div>

                  <div className={styles.formActionGroup}>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={styles.presentCommissionBtn}
                      aria-label="Present my commission to 24 Frames"
                    >
                      {isSubmitting ? (
                        <span>TRANSMITTING COMMISSION BRIEF...</span>
                      ) : (
                        <>
                          <span>PRESENT MY COMMISSION</span>
                          <span className={styles.btnArrowIcon}>→</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>

                <div className={styles.privacyNote}>
                  <span>Strictly confidential · Your details are shared only with the founding team</span>
                </div>
              </div>
            </div>

            <div className={styles.stageFooterNav}>
              <button onClick={handleBack} className={styles.backStepQuietBtn} type="button">
                <span className={styles.backArrowIcon}>←</span>
                <span>Back</span>
              </button>
            </div>
          </section>
        )}

        {/* ════════════════════════════════════════════════════════════
           STAGE 5: PERSONALIZED CONFIRMATION FOLIO
           ════════════════════════════════════════════════════════════ */}
        {stage === 5 && (
          <section className={styles.confirmationSection} aria-label="Commission Formatted & Presented">
            <div className={styles.confirmationCard}>
              <div className={styles.confirmationHeader}>
                <div className={styles.sealIconWrap}>
                  <span className={styles.sealCheckMark}>✓</span>
                </div>

                <span className={styles.confirmationEyebrow}>COMMISSION BRIEF REGISTERED</span>

                <h1 className={styles.confirmationTitle}>
                  Thank you, {fullName || "Distinguished Patron"}.
                </h1>

                <p className={styles.confirmationSubtitle}>
                  Your bespoke brief for <strong>{currentCategory.title}</strong> has been formatted
                  and presented to Phani Gogireddy and the 24 Frames executive studio team.
                </p>
              </div>

              {/* Presented Brief Summary Box */}
              <div className={styles.confirmationSummaryBox}>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Folio Reference:</span>
                  <span className={styles.summaryValue}>24F-2026-COMMISSION</span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Commission Scope:</span>
                  <span className={styles.summaryValue}>{currentInvestment.label}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Client Contact:</span>
                  <span className={styles.summaryValue}>{email} · {phone}</span>
                </div>
                {isWeddingLike && (
                  <div className={styles.summaryRow}>
                    <span className={styles.summaryLabel}>Ritual Count:</span>
                    <span className={styles.summaryValue}>{events.length} celebrations scheduled</span>
                  </div>
                )}
              </div>

              <div className={styles.confirmationActions}>
                {/* Direct WhatsApp Instant Connect with Preformatted Brief */}
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.whatsAppDispatchBtn}
                  aria-label="Dispatch commission brief directly via WhatsApp"
                >
                  <span>DISPATCH COMMISSION VIA WHATSAPP</span>
                  <span className={styles.btnArrowIcon}>↗</span>
                </a>

                <Link href="/" className={styles.returnHomeBtn}>
                  <span>RETURN TO 24 FRAMES HOME</span>
                </Link>
              </div>

              <p className={styles.confirmationClosing}>
                “From reel to real, every dream pursued with heart becomes a timeless shot.”
                <br />
                <strong>— Phani Gogireddy, Managing Director</strong>
              </p>
            </div>
          </section>
        )}
      </main>
      <Footer hideCommissionCta />
    </div>
  );
}
