/* ============================================================
   DEFAULT STUDIO CONFIGURATION — ILLUSTRATIVE / DEMO VALUES
   ------------------------------------------------------------
   Every price, multiplier and budget band below is a fictional
   placeholder supplied for testing. None of them are approved
   24 Frames prices. The studio replaces them from /studio/admin;
   the stored configuration then overrides this file entirely.
   This file is the ONLY place these demo values live.
   ============================================================ */

import type { StudioConfig } from "./types";

export const DEFAULT_STUDIO_CONFIG: StudioConfig = {
  version: 1,
  updatedAt: "2026-11-07T00:00:00.000Z",
  pricingIsIllustrative: true,

  studio: {
    name: "24 Frames Photography",
    tagline: "Cinematic wedding films & photography",
    phoneDisplay: "+91 90144 33074",
    whatsappNumber: "919014433074",
    email: "hello@24framesphotography.com",
    website: "24framesphotography.com",
    instagram: "@24framesphotography_official",
    address: "Hyderabad, Telangana, India",
  },

  services: [
    {
      id: "traditional-photographer",
      order: 1,
      name: "Traditional Photographer",
      epithet: "The Record",
      introduction:
        "The keeper of every ritual, every blessing and every family that came to stand beside you.",
      role:
        "Works alongside the priest and the families to document each ceremony in sequence, composing formal portraits and group photographs with precision lighting.",
      captures: [
        "Every important ritual, in order",
        "Formal family portraits and generations together",
        "Group photographs with guests on stage",
        "Formal wedding documentation for the family archive",
        "Essential moments throughout the celebration",
      ],
      whyItMatters:
        "Decades from now, these are the photographs families return to — who was present, who blessed you, how each ritual unfolded. Candid work tells the feeling; traditional work guarantees nothing important is missed.",
      deliverables: [
        "Complete edited ritual and portrait collection",
        "Colour-corrected high-resolution images",
        "Family and group photographs, named by event",
        "Album-ready selection",
      ],
      suitableFor: ["engagement", "haldi", "mehendi", "wedding", "reception", "post-wedding"],
      recommendedNote:
        "One photographer for up to 150 guests; add one for roughly every 300–400 additional guests or for each parallel ritual.",
      price: 60000,
      unitLabel: "per photographer · per event",
      unitNoun: "photographer",
      minQuantity: 0,
      maxQuantity: 6,
      image: "/images/disciplines/weddings/IMG_6277.jpg",
      imageAlt: "Couple walking together with family through a garden ceremony",
      postProductionGroup: "photo",
      active: true,
    },
    {
      id: "traditional-videographer",
      order: 2,
      name: "Traditional Videographer",
      epithet: "The Chronicle",
      introduction:
        "Unbroken, faithful coverage of the ceremony — every vow, every speech, every mantra, as it happened.",
      role:
        "Films the full length of each event from stable, well-placed positions so the complete ceremony can be watched again from beginning to end.",
      captures: [
        "Complete event coverage",
        "Ritual documentation in full",
        "Important speeches, toasts and ceremonies",
        "Full-length wedding footage",
        "A traditional wedding film for the family",
      ],
      whyItMatters:
        "A highlight film is a memory; the full ceremony is a record. Elders, relatives abroad and future generations will want to see the rituals exactly as they were performed.",
      deliverables: [
        "Full-length edited ceremony film",
        "Speeches and key rituals as chapters",
        "Colour-corrected footage with cleaned audio",
      ],
      suitableFor: ["engagement", "haldi", "mehendi", "sangeet", "wedding", "reception"],
      recommendedNote:
        "One videographer for most events; two when the ceremony and guest areas need simultaneous coverage or guests exceed ~400.",
      price: 70000,
      unitLabel: "per videographer · per event",
      unitNoun: "videographer",
      minQuantity: 0,
      maxQuantity: 4,
      image: "/images/portfolio/bellamkonda-kavya-reception/cover.jpg",
      imageAlt: "Reception stage with the couple receiving guests",
      postProductionGroup: "video",
      active: true,
    },
    {
      id: "candid-photographer",
      order: 3,
      name: "Candid Photographer",
      epithet: "The Witness",
      introduction:
        "Unposed, unhurried, unseen — the photographer who catches the moments nobody planned.",
      role:
        "Moves quietly through the celebration reading people rather than schedules, anticipating laughter, tears and the glances between you.",
      captures: [
        "Unposed emotions and genuine expressions",
        "Family interactions between the rituals",
        "Spontaneous moments and guest reactions",
        "Emotional details — hands, jewellery, fabric, light",
      ],
      whyItMatters:
        "These are the photographs that make you feel the day again. A grandmother's smile, your father turning away to wipe his eyes — moments that never appear in a formal frame.",
      deliverables: [
        "Curated, editorially graded candid collection",
        "Story-sequenced highlights per event",
        "Social-ready preview selection",
      ],
      suitableFor: [],
      recommendedNote:
        "One candid photographer for intimate events; two for 200–700 guests; three for grand celebrations with many simultaneous moments.",
      price: 80000,
      unitLabel: "per photographer · per event",
      unitNoun: "photographer",
      minQuantity: 0,
      maxQuantity: 5,
      image: "/images/stories/hrithika-abhishek/IMG_6337.jpg",
      imageAlt: "Bride laughing as water is poured during the haldi ceremony",
      postProductionGroup: "photo",
      active: true,
    },
    {
      id: "candid-videographer",
      order: 4,
      name: "Candid Videographer",
      epithet: "The Storyteller",
      introduction:
        "Documentary-style filmmaking that follows emotion, not the programme.",
      role:
        "Films natural, unscripted interactions with cinema lenses and gimbals, building the raw material for your story film.",
      captures: [
        "Cinematic candid footage",
        "Emotional moments as they unfold",
        "Unscripted interactions between family and friends",
        "Natural, documentary-style storytelling sequences",
      ],
      whyItMatters:
        "Video holds what stills cannot — voices, movement, the sound of a room laughing. Candid film is how your celebration will feel when you watch it in twenty years.",
      deliverables: [
        "Story-led candid film per event",
        "Teaser cut for sharing",
        "Graded footage with designed sound",
      ],
      suitableFor: [],
      recommendedNote:
        "One candid videographer for most events; two when guests exceed ~300 or multiple stories unfold at once.",
      price: 95000,
      unitLabel: "per videographer · per event",
      unitNoun: "videographer",
      minQuantity: 0,
      maxQuantity: 4,
      image: "/images/portfolio/hrithika-abhishek/cover.jpg",
      imageAlt: "Couple seated on a garden bench at dusk",
      postProductionGroup: "video",
      active: true,
    },
    {
      id: "aerial-drone",
      order: 5,
      name: "Aerial Photography & Drone",
      epithet: "The Horizon",
      introduction:
        "The view nobody at the celebration gets to see — the whole of it, from above.",
      role:
        "A licensed pilot captures aerial stills and footage of the venue, the procession and the scale of the gathering, coordinated with the ground crew.",
      captures: [
        "Aerial venue photographs",
        "Wedding venue architecture",
        "Large-scale celebrations and processions",
        "Outdoor ceremonies",
        "Elevated establishing perspectives for the film",
      ],
      whyItMatters:
        "Aerial frames give your collection a sense of place and scale — the mandap within the palace, the baraat winding down the road — and open your film like cinema.",
      deliverables: [
        "Edited aerial stills",
        "Aerial footage integrated into your films",
        "Venue establishing sequences",
      ],
      suitableFor: ["sangeet", "wedding", "reception", "pre-wedding"],
      recommendedNote:
        "One drone operator for outdoor or large venues. Subject to local airspace permissions, weather and venue approval.",
      price: 45000,
      unitLabel: "per operator · per event",
      unitNoun: "operator",
      minQuantity: 0,
      maxQuantity: 2,
      image: "/images/disciplines/cinema/IMG_6289.jpg",
      imageAlt: "Silhouetted couple framed by grand stone arches at sunset",
      postProductionGroup: "video",
      technicalNotes: [
        "Requires venue permission and permissible airspace (Digital Sky / local authority).",
        "Indoor venues and high wind or rain may limit flight time.",
      ],
      active: true,
    },
    {
      id: "creative-cinematography",
      order: 6,
      name: "Creative Cinematography",
      epithet: "The Auteur",
      introduction:
        "A premium cinematic production — directed, composed and lit like film.",
      role:
        "A cinematographer-director designs artistic sequences with deliberate camera movement, composed frames and dramatic light, creating the signature 24 Frames wedding film.",
      captures: [
        "Artistic cinematic sequences",
        "Creative camera movement and composed shots",
        "Dramatic visual storytelling",
        "Special creative sequences with the couple",
        "The cinematic wedding film",
      ],
      whyItMatters:
        "This is the film you will show your children. Where documentation records the day, cinematography interprets it — with intention, rhythm and artistry.",
      deliverables: [
        "Cinematic wedding film",
        "Cinematic teaser / trailer",
        "Directed couple sequences",
        "Colour-graded master with designed sound",
      ],
      suitableFor: ["pre-wedding", "sangeet", "wedding", "reception"],
      recommendedNote:
        "One cinematographer for most events; two for grand weddings or long ceremonies where the story moves between spaces.",
      price: 150000,
      unitLabel: "per cinematographer · per event",
      unitNoun: "cinematographer",
      minQuantity: 0,
      maxQuantity: 3,
      image: "/images/portfolio/sireesh-harshitha/cover.jpg",
      imageAlt: "Couple embracing beneath a sweeping rose silk drape",
      postProductionGroup: "video",
      signature: true,
      active: true,
    },
    {
      id: "web-live-stream",
      order: 7,
      name: "Web Live Stream",
      epithet: "The Bridge",
      introduction:
        "For everyone who cannot be in the room — the celebration, live, wherever they are.",
      role:
        "A streaming technician runs a multi-camera live broadcast to a private link, so family abroad and elders at home can take part in real time.",
      captures: [
        "Live broadcast of selected events",
        "Remote participation for family and friends",
        "Access for guests unable to attend physically",
        "Configurable coverage — full event or key rituals",
      ],
      whyItMatters:
        "Some of the people who matter most may be oceans away. A stream lets them witness the muhurtham as it happens rather than weeks later.",
      deliverables: [
        "Private live stream link",
        "Recorded stream file after the event",
      ],
      suitableFor: ["wedding", "reception", "engagement"],
      recommendedNote:
        "One stream setup per event. Requires a stable wired internet connection of at least 20 Mbps upload at the venue.",
      price: 40000,
      unitLabel: "per stream setup · per event",
      unitNoun: "stream setup",
      minQuantity: 0,
      maxQuantity: 2,
      image: "/images/disciplines/events/IMG_6487.jpg",
      imageAlt: "Live performance captured with stage cameras",
      postProductionGroup: "none",
      technicalNotes: [
        "Venue must provide a stable wired connection — minimum 20 Mbps upload recommended.",
        "Power backup near the broadcast desk.",
        "Stream quality depends on venue connectivity, which the studio cannot guarantee.",
      ],
      active: true,
    },
  ],

  eventPresets: [
    { id: "engagement", label: "Engagement", typicalHours: 4, ritual: true },
    { id: "haldi", label: "Haldi", typicalHours: 3, ritual: true },
    { id: "mehendi", label: "Mehendi", typicalHours: 4, ritual: false },
    { id: "sangeet", label: "Sangeet", typicalHours: 5, ritual: false },
    { id: "cocktail", label: "Cocktail", typicalHours: 4, ritual: false },
    { id: "wedding", label: "Wedding", typicalHours: 8, ritual: true },
    { id: "reception", label: "Reception", typicalHours: 5, ritual: false },
    { id: "pre-wedding", label: "Pre-wedding celebration", typicalHours: 6, ritual: false },
    { id: "post-wedding", label: "Post-wedding celebration", typicalHours: 4, ritual: true },
  ],

  postProduction: {
    mode: "combined",
    combined: {
      bands: [
        { threshold: 100000, fee: 10000 },
        { threshold: 200000, fee: 15000 },
        { threshold: 300000, fee: 12000 },
        { threshold: 400000, fee: 10000 },
        { threshold: 500000, fee: 8000 },
        { threshold: 600000, fee: 7000 },
      ],
      interpolation: "linear",
      belowFirstBand: "proportional",
      minFee: null,
      maxFee: null,
    },
    photo: {
      bands: [
        { threshold: 50000, fee: 5000 },
        { threshold: 150000, fee: 8000 },
        { threshold: 300000, fee: 6000 },
      ],
      interpolation: "linear",
      belowFirstBand: "proportional",
      minFee: null,
      maxFee: null,
    },
    video: {
      bands: [
        { threshold: 100000, fee: 8000 },
        { threshold: 250000, fee: 12000 },
        { threshold: 500000, fee: 9000 },
      ],
      interpolation: "linear",
      belowFirstBand: "proportional",
      minFee: null,
      maxFee: null,
    },
    roundTo: 100,
  },

  deliveryTiers: [
    {
      id: "express-15",
      label: "Within 15 days",
      days: 15,
      priorityName: "Express Priority",
      multiplier: 2.0,
      meaning: "Your collection moves to the front of the edit suite the morning after the celebration.",
      whyPrice:
        "Editors, colourists and sound designers are dedicated to your commission ahead of the queue, often working extended hours.",
      covers: ["Edited photographs", "Highlight film", "Teaser"],
      expectations:
        "Final photographs and the highlight film within 15 days of your last event. Full-length films may follow if the studio confirms otherwise.",
      conditions: "Subject to studio capacity during peak season. Confirmed at booking.",
      available: true,
    },
    {
      id: "priority-30",
      label: "Within 30 days",
      days: 30,
      priorityName: "Priority Delivery",
      multiplier: 1.5,
      meaning: "A reserved place in the edit calendar with an accelerated review cycle.",
      whyPrice: "Your project is scheduled ahead of standard commissions with a dedicated review slot.",
      covers: ["Edited photographs", "Highlight film", "Full-length films"],
      expectations: "Your complete collection within a month of your final event.",
      conditions: "Subject to studio capacity. Confirmed at booking.",
      available: true,
    },
    {
      id: "standard-60",
      label: "Within 60 days",
      days: 60,
      priorityName: "Standard Delivery",
      multiplier: 1.0,
      meaning: "The studio's considered pace — every frame selected, graded and finished with care.",
      whyPrice: "The baseline post-production fee. No priority surcharge.",
      covers: ["Edited photographs", "Highlight film", "Full-length films", "Album selection"],
      expectations: "Complete delivery within two months of your final event.",
      conditions: "Standard studio timeline.",
      available: true,
    },
    {
      id: "extended-90",
      label: "Within 3 months",
      days: 90,
      priorityName: "Extended Production",
      multiplier: 0.8,
      meaning: "A relaxed production window that lets the studio schedule your edit flexibly.",
      whyPrice: "Flexible scheduling lets the studio balance its calendar — reflected in a lower fee.",
      covers: ["Edited photographs", "Highlight film", "Full-length films", "Album selection"],
      expectations: "Complete delivery within three months of your final event.",
      conditions: "Delivery dates are scheduled by the studio within the window.",
      available: true,
    },
    {
      id: "archival-180",
      label: "Within 6 months",
      days: 180,
      priorityName: "Archival Timeline",
      multiplier: 0.6,
      meaning: "The most economical timeline, for couples in no hurry.",
      whyPrice: "Your edit is scheduled in the studio's quieter periods, lowering production cost.",
      covers: ["Edited photographs", "Highlight film", "Full-length films", "Album selection"],
      expectations: "Complete delivery within six months of your final event.",
      conditions: "Delivery dates are scheduled by the studio within the window.",
      available: true,
    },
  ],
  defaultDeliveryTierId: "standard-60",

  charges: [
    {
      id: "outstation-travel",
      label: "Outstation travel & accommodation",
      description: "Crew travel and stay for celebrations outside the studio's home city.",
      kind: "fixed",
      amount: 25000,
      available: true,
    },
    {
      id: "same-day-edit",
      label: "Same-day edit screening",
      description: "A short film cut and screened at the reception on the same day.",
      kind: "fixed",
      amount: 35000,
      available: true,
    },
  ],

  tax: {
    enabled: false,
    label: "GST",
    ratePercent: 18,
    note: "Tax is not applied until the studio confirms its tax treatment.",
  },

  proposal: {
    validityDays: 14,
    introduction:
      "Thank you for inviting 24 Frames into your celebration. This proposal sets out the creative team, coverage and post-production you have composed with us, event by event.",
    closingMessage:
      "Every celebration deserves its own visual legacy. We would be honoured to create yours.",
    terms: [
      "This proposal is an estimate based on the selections made during your consultation. It is not an invoice.",
      "Dates are reserved only on receipt of the booking advance and a signed agreement.",
      "Travel, accommodation and venue fees outside the selections listed here are not included unless stated.",
      "Delivery timelines begin after the final event and are subject to the conditions of the chosen tier.",
      "Aerial coverage and live streaming depend on venue permissions, weather and connectivity.",
    ],
    coverImage: "/images/portfolio/sireesh-harshitha/cover.jpg",
    celebrationImage: "/images/disciplines/weddings/IMG_6277.jpg",
    closingImage: "/images/disciplines/cinema/IMG_6289.jpg",
    referencePrefix: "24F",
  },
};

export const CUSTOM_EVENT_TYPE = "custom";
