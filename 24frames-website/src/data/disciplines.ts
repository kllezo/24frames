export interface DisciplineGalleryImage {
  id: string;
  title: string;
  client?: string;
  location?: string;
  year?: string;
  image: string;
  webp?: string;
  caption: string;
  aspect: "landscape" | "portrait" | "panoramic";
  storySlug?: string;
}

export interface DisciplineVideo {
  id: string;
  title: string;
  client: string;
  embedUrl: string;
  poster: string;
  posterWebp?: string;
  duration: string;
  description: string;
}

export interface DisciplineMetadata {
  disciplineNumber: string;
  leadArtist: string;
  opticsProfile: string;
  established: string;
  archiveVolume: string;
  primaryLocations: string[];
}

export interface DisciplineItem {
  id: string;
  slug: string;
  number: string;
  title: string;
  shortTitle: string;
  count: string;
  tagline: string;
  heroDescription: string;
  fullDescription: string;
  curatorialNotes: string[];
  heroImage: string;
  heroWebp?: string;
  heroAspect?: "wide" | "cinematic" | "portrait";
  href: string;
  metadata: DisciplineMetadata;
  gallery: DisciplineGalleryImage[];
  videos?: DisciplineVideo[];
  relatedSlugs: string[];
}

export const DISCIPLINES_DATA: Record<string, DisciplineItem> = {
  weddings: {
    id: "weddings",
    slug: "weddings",
    number: "01",
    title: "Weddings & Royal Unions",
    shortTitle: "Weddings",
    count: "40+ Master Stories",
    tagline: "Sacred Telugu traditions, royal muhurthams & emotional generational tears.",
    heroDescription:
      "Multi-day coverage spanning Mangalasnanam, Sangeet galas, and dawn ceremonies. Documented without invasive lighting or forced poses.",
    fullDescription:
      "From intimate dawn Muhurthams under Vedic chanting to monumental multi-day palace unions, 24 Frames captures the timeless sanctity of South Indian wedding heritage. We work like silent observers, honoring sacred family rituals and spontaneous generational emotion without disruptive artificial rigs.",
    curatorialNotes: [
      "Every wedding is approached not as an event, but as a living family archive. Our cinematography team records the intricate sacred rituals—Mangalasnanam, Jeelakarra Bellam, Talambralu, and Kanyadanam—with quiet veneration.",
      "By utilizing ultra-fast prime cinema lenses and available ambient light, we preserve the authentic textures of marigold garlands, sacred homam fire, and pure Kanjeevaram silks.",
      "The result is a timeless photographic testament that balances monumental architectural scale with tender, unscripted human joy."
    ],
    heroImage: "/images/portfolio/sireesh-harshitha/cover.jpg",
    heroWebp: "/images/portfolio/sireesh-harshitha/cover.webp",
    heroAspect: "cinematic",
    href: "/disciplines/weddings",
    metadata: {
      disciplineNumber: "01 / 05",
      leadArtist: "Phani Gogireddy",
      opticsProfile: "Leica Summilux & Zeiss Supreme Cinema Primes",
      established: "2012",
      archiveVolume: "350+ Vedic Ceremonies Documented",
      primaryLocations: ["Hyderabad", "Bengaluru", "Chennai", "Udaipur", "Tirupati"]
    },
    gallery: [
      {
        id: "w-01",
        title: "Sireesh & Harshitha — The Royal Muhurtham",
        client: "Sireesh & Harshitha",
        location: "Palace Grounds, Hyderabad",
        year: "2024",
        image: "/images/portfolio/sireesh-harshitha/cover.jpg",
        webp: "/images/portfolio/sireesh-harshitha/cover.webp",
        caption: "Sacred Telugu wedding rituals documented in natural dawn light at the heritage pavilion.",
        aspect: "portrait",
        storySlug: "sirish-and-harshitha"
      },
      {
        id: "w-03",
        title: "Karthik & Gayathri — Classical Temple Grandeur",
        client: "Karthik & Gayathri",
        location: "Glasshouse Conservatory, Hyderabad",
        year: "2024",
        image: "/images/portfolio/karthik-gayathri/cover.jpg",
        webp: "/images/portfolio/karthik-gayathri/cover.webp",
        caption: "Fine-art South Indian wedding coverage featuring classical temple silk and heritage florals.",
        aspect: "portrait",
        storySlug: "karthik-and-gayathri"
      },
      {
        id: "w-05",
        title: "Hrithika & Abhishek — Golden Hour Reflections",
        client: "Hrithika & Abhishek",
        location: "Hyderabad Estate Grounds",
        year: "2024",
        image: "/images/stories/hrithika-abhishek/IMG_6334.jpg",
        webp: "/images/stories/hrithika-abhishek/IMG_6334.webp",
        caption: "Candid laughter and sacred firelight reflections amidst heritage stone pillars.",
        aspect: "landscape",
        storySlug: "hrithika-abhishek"
      },
      {
        id: "w-07",
        title: "Generational Vedic Muhurtham & Sacred Blessings",
        client: "Royal Vedic Commission",
        location: "Heritage Palace Grounds",
        year: "2024",
        image: "/images/disciplines/weddings/IMG_6277.jpg",
        caption: "Akshata blessings showered under the sacred mandapam in natural architectural dawn light.",
        aspect: "portrait"
      },
      {
        id: "w-08",
        title: "Sacred Floral Muhurtham Rites & Devotion",
        client: "Traditional Telugu Union",
        location: "Pavilion Mandapam",
        year: "2024",
        image: "/images/disciplines/weddings/IMG_6274.jpg",
        caption: "Deep devotion and sacred mantras preserved with cinema-grade optical precision.",
        aspect: "portrait"
      },
      {
        id: "w-09",
        title: "Royal Architectural Silhouette & Evening Poise",
        client: "Grand Heritage Celebration",
        location: "Courtyard Arcade",
        year: "2024",
        image: "/images/disciplines/weddings/IMG_6275.jpg",
        caption: "Monumental arches and regal bridal composure documented under soft dusk illumination.",
        aspect: "portrait"
      }
    ],
    relatedSlugs: ["celebrities", "events", "cinema"]
  },

  celebrities: {
    id: "celebrities",
    slug: "celebrities",
    number: "02",
    title: "Celebrities & Portraits",
    shortTitle: "Celebrities",
    count: "15+ Character Studies",
    tagline: "High-fashion bridal couture, Tollywood actors, and private family patriarchs.",
    heroDescription:
      "Medium-format optical portraits lit with master cinema fixtures. Preserving quiet dignity, sculptural elegance, and commanding presence.",
    fullDescription:
      "24 Frames has earned the enduring trust of South Indian cinema stars, public luminaries, and esteemed private families. We craft character studies that balance the gravitas of iconic personalities with the vulnerability of intimate family milestones.",
    curatorialNotes: [
      "Our celebrity portraiture eschews superficial studio gloss in favor of cinema-grade key lighting, dimensional shadows, and honest expressions.",
      "Verified historical commissions include the grand reception coverage of Indian cinema star Bellamkonda Sai Sreenivas & Kavya Reddy, longstanding mentorship associations with Tollywood actor Manchu Manoj, and official collaborations honored by industry stalwarts such as Dia Mirza and veteran cinematographer K.K. Senthil Kumar (ISC).",
      "Every portrait is captured using Hasselblad medium format and custom-calibrated cinema lenses to render nuanced skin tones and authentic textile textures."
    ],
    heroImage: "/images/disciplines/celebrities/IMG_6472.jpg",
    heroAspect: "cinematic",
    href: "/disciplines/celebrities",
    metadata: {
      disciplineNumber: "02 / 05",
      leadArtist: "Phani Gogireddy",
      opticsProfile: "Medium Format 100MP & ARRI Cinema Lighting",
      established: "2014",
      archiveVolume: "15+ Public Figure & Celebrity Commissions",
      primaryLocations: ["Jubilee Hills", "Banjara Hills", "Shamshabad", "Chennai"]
    },
    gallery: [
      {
        id: "c-01",
        title: "Tollywood Luminary & Cinema Icon",
        client: "Bellamkonda Sai Sreenivas Milestone",
        location: "Grand Reception Stage, Shamshabad",
        year: "2024",
        image: "/images/disciplines/celebrities/IMG_6472.jpg",
        caption: "Actor Bellamkonda Sai Sreenivas captured with nuanced cinema-grade key illumination and commanding presence.",
        aspect: "portrait"
      },
      {
        id: "c-02",
        title: "Sculptural Key Light Portraiture & Gaze",
        client: "Tollywood Celebrity Study",
        location: "GMR Arena VIP Suite",
        year: "2024",
        image: "/images/disciplines/celebrities/IMG_6473.jpg",
        caption: "Deliberate chiaroscuro shadow-play rendering sculpted jawlines and introspective depth.",
        aspect: "portrait"
      },
      {
        id: "c-03",
        title: "Grand Reception Character Study in Black Tie",
        client: "Indian Cinema Gala Feature",
        location: "Grand Foyer",
        year: "2024",
        image: "/images/disciplines/celebrities/IMG_6477.jpg",
        caption: "Formal black-tie elegance documented with optical precision and natural poise.",
        aspect: "portrait"
      },
      {
        id: "c-04",
        title: "VIP Luminary Milestone & Stage Presence",
        client: "Celebrity Reception Gathering",
        location: "VIP Enclave",
        year: "2024",
        image: "/images/disciplines/celebrities/IMG_6474.jpg",
        caption: "Quiet dignity and warm engagement captured between high-profile dignitaries and hosts.",
        aspect: "portrait"
      },
      {
        id: "c-05",
        title: "Celebrity Family Milestone & Quiet Poise",
        client: "Distinguished Family Portrait",
        location: "Private Presidential Suite",
        year: "2024",
        image: "/images/disciplines/celebrities/IMG_6476.jpg",
        caption: "Generational family warmth documented with respectful restraint and archival clarity.",
        aspect: "portrait"
      },
      {
        id: "c-06",
        title: "Classical Bridal Couture & Temple Adornment",
        client: "High-Profile Bridal Commission",
        location: "Heritage Suite",
        year: "2024",
        image: "/images/disciplines/celebrities/IMG_6278.jpg",
        caption: "Medium-format bridal study highlighting handwoven gold silks and traditional uncut gemstone heritage.",
        aspect: "portrait"
      },
      {
        id: "c-07",
        title: "Nuanced Chiaroscuro Lighting & Character Study",
        client: "Cinema Luminary Portraiture",
        location: "24 Frames Production Stage",
        year: "2024",
        image: "/images/disciplines/celebrities/IMG_6468.jpg",
        caption: "Rich directional lighting revealing nuanced emotional sensitivity and cinematic framing.",
        aspect: "portrait"
      }
    ],
    relatedSlugs: ["weddings", "fashion", "cinema"]
  },

  events: {
    id: "events",
    slug: "events",
    number: "03",
    title: "Events & Cultural Galas",
    shortTitle: "Events",
    count: "20+ Grand Celebrations",
    tagline: "High-octane Sangeet stages, milestone anniversaries, and national events.",
    heroDescription:
      "Capturing the electric choreography, live orchestral music, and grand architectural ambiance of premier celebration venues.",
    fullDescription:
      "Grand galas and cultural celebrations are symphonies of movement, sound, and architectural scenography. 24 Frames documents monumental events with immersive scale, capturing both the sweeping spectacle of thousand-guest ballrooms and the spontaneous spark of live performance.",
    curatorialNotes: [
      "Our multi-camera setups are strategically positioned to cover sweeping wide establishing shots, soaring crane angles, and razor-sharp telephoto details of live stage performances.",
      "From high-octane Sangeet choreographies to prestigious institutional galas—such as the ET Excellence Awards and Sree Vidyanikethan Annual Day celebrations—we document the electric energy of cultural gatherings.",
      "Our proprietary low-light colour science ensures that stage lighting, laser arrays, and floral projections are rendered with cinematic fidelity without blown highlights."
    ],
    heroImage: "/images/disciplines/events/IMG_6487.jpg",
    heroAspect: "cinematic",
    href: "/disciplines/events",
    metadata: {
      disciplineNumber: "03 / 05",
      leadArtist: "Phani Gogireddy & Production Crew",
      opticsProfile: "Multi-Angle Cinema Rigs & High-Speed Optical Primes",
      established: "2013",
      archiveVolume: "120+ Grand Scale Galas & Sangeet Stages",
      primaryLocations: ["Novotel HICC", "GMR Arena", "Taj Falaknama", "Bengaluru Palace"]
    },
    gallery: [
      {
        id: "e-01",
        title: "Monumental Ballroom Scenography & Light",
        client: "Royal Reception Gala",
        location: "GMR Arena Grand Ballroom, Hyderabad",
        year: "2024",
        image: "/images/disciplines/events/IMG_6487.jpg",
        caption: "Monumental floral arches, crystal chandelier arrays, and tiered architectural lighting illuminating the grand ballroom.",
        aspect: "portrait"
      },
      {
        id: "e-02",
        title: "Grand Cultural Gala Stage Performance",
        client: "Live Sangeet & Orchestral Evening",
        location: "Grand Ballroom Stage",
        year: "2024",
        image: "/images/disciplines/events/IMG_6492.jpg",
        caption: "Electric stage energy and live choreography documented with multi-track musical synchronization.",
        aspect: "portrait"
      },
      {
        id: "e-03",
        title: "Architectural Floral Canopy & Lighting Symmetry",
        client: "Grand Reception Gala",
        location: "Shamshabad Estate",
        year: "2024",
        image: "/images/disciplines/events/IMG_6486.jpg",
        caption: "Bespoke scenic backdrop installations and cascading florals illuminated by master theatrical fixtures.",
        aspect: "portrait"
      },
      {
        id: "e-04",
        title: "Sangeet Dance Energy & Spectacle",
        client: "Celebration Gala Evening",
        location: "Main Stage Pavilion",
        year: "2024",
        image: "/images/disciplines/events/IMG_6490.jpg",
        caption: "High-octane celebratory movement and joyous familial engagement captured from prime optical angles.",
        aspect: "portrait"
      },
      {
        id: "e-05",
        title: "Widescreen Panoramic Ballroom Perspective",
        client: "Grand Gala Scenography",
        location: "GMR Grand Ballroom",
        year: "2024",
        image: "/images/disciplines/events/IMG_6485.jpg",
        caption: "Expansive 2.39:1 scope revealing the full architectural grandeur of thousands of guests gathered in celebration.",
        aspect: "landscape"
      },
      {
        id: "e-06",
        title: "Live Stage Performance & Orchestration",
        client: "Cultural Evening Gala",
        location: "Theatrical Pavilion Stage",
        year: "2024",
        image: "/images/disciplines/events/IMG_6491.jpg",
        caption: "Dynamic rhythm and dramatic key lighting captured during live musical and dance performances.",
        aspect: "portrait"
      },
      {
        id: "e-07",
        title: "Evening Celebration Glow & Scenography",
        client: "Grand Reception Evening",
        location: "Estate Grounds",
        year: "2024",
        image: "/images/disciplines/events/IMG_6482.jpg",
        caption: "Ambient dusk illumination highlighting illuminated floral towers and guest reception pathways.",
        aspect: "portrait"
      }
    ],
    relatedSlugs: ["weddings", "celebrities", "cinema"]
  },

  fashion: {
    id: "fashion",
    slug: "fashion",
    number: "04",
    title: "Fashion & Editorial",
    shortTitle: "Fashion",
    count: "10+ Editorial Spreads",
    tagline: "Bespoke designer lookbooks and high-jewelry editorial campaigns.",
    heroDescription:
      "Crafted for prestigious publications and couture designers, combining experimental art direction with sharp optical discipline.",
    fullDescription:
      "Where heritage craftsmanship meets high-fashion editorial rigor. 24 Frames produces lookbooks, bridal couture campaigns, and jewelry spreads that celebrate the tactile poetry of handwoven textiles, precious stones, and architectural silhouetting.",
    curatorialNotes: [
      "Our editorial lighting emphasizes textile texture—from the delicate metallic sheen of zari weaving to the deep refractive depth of emerald and uncut diamond jewelry.",
      "Working closely with renowned stylists and designers across Hyderabad, Mumbai, and Chennai, our creative direction fuses classical Indian motifs with stark, modern compositional geometry.",
      "Every frame is retouched with restraint: honoring authentic skin textures and natural fabric movement while maintaining magazine-cover polish."
    ],
    heroImage: "/images/disciplines/fashion/IMG_6288.jpg",
    heroAspect: "cinematic",
    href: "/disciplines/fashion",
    metadata: {
      disciplineNumber: "04 / 05",
      leadArtist: "Phani Gogireddy",
      opticsProfile: "Medium Format 100MP & Macro Optical Primes",
      established: "2016",
      archiveVolume: "10+ Dedicated Editorial Lookbooks",
      primaryLocations: ["Hyderabad", "Mumbai", "Chennai"]
    },
    gallery: [
      {
        id: "f-01",
        title: "High-Fashion Bridal Couture & Zari Weave",
        client: "Haute Couture Lookbook",
        location: "Heritage Suite, Hyderabad",
        year: "2024",
        image: "/images/disciplines/fashion/IMG_6288.jpg",
        caption: "Tactile study of hand-embellished metallic threadwork, pure silk draping, and sculptural bridal silhouettes.",
        aspect: "portrait"
      },
      {
        id: "f-02",
        title: "Couture Silhouette in Natural Directional Light",
        client: "Designer Lookbook Spread",
        location: "Courtyard Arcade",
        year: "2024",
        image: "/images/disciplines/fashion/IMG_6285.jpg",
        caption: "Soft directional morning daylight capturing pure textile texture, metallic sheen, and architectural lines.",
        aspect: "portrait"
      },
      {
        id: "f-03",
        title: "Tactile Embroidery & Handwoven Silk Study",
        client: "Archival Textile Campaign",
        location: "Studio Stage",
        year: "2024",
        image: "/images/disciplines/fashion/IMG_6280.jpg",
        caption: "Macro optical focus preserving intricate gold zardozi motifs and artisanal heritage weaving.",
        aspect: "portrait"
      },
      {
        id: "f-04",
        title: "Architectural Draping & Heritage Jewelry",
        client: "Fine Bridal Adornment",
        location: "Palace Pavilion",
        year: "2024",
        image: "/images/disciplines/fashion/IMG_6321.jpg",
        caption: "Modern compositional geometry paired with classical temple jewelry and pure Kanjeevaram silk.",
        aspect: "portrait"
      },
      {
        id: "f-05",
        title: "Chiaroscuro Veil & Textural Depth",
        client: "Bridal Editorial Campaign",
        location: "Editorial Suite",
        year: "2024",
        image: "/images/disciplines/fashion/IMG_6286.jpg",
        caption: "Dramatic chiaroscuro shadow-play rendering delicate veil embroidery and reflective diamond detailing.",
        aspect: "portrait"
      },
      {
        id: "f-06",
        title: "Modern Editorial Composition & Poise",
        client: "Contemporary Couture Feature",
        location: "Conservatory Grounds",
        year: "2024",
        image: "/images/disciplines/fashion/IMG_6279.jpg",
        caption: "Minimalist editorial framing honoring authentic model poise, unhurried posture, and clean lines.",
        aspect: "portrait"
      },
      {
        id: "f-07",
        title: "Heirloom Adornment & Diamond Detail",
        client: "High-Jewelry Editorial Spread",
        location: "24 Frames Archive",
        year: "2024",
        image: "/images/disciplines/fashion/be3a19a9-179c-42a3-b47e-6b9fa7fb2ee8.JPG",
        caption: "Optical macro clarity capturing uncut emeralds, heritage choker geometry, and fine artisanal setting.",
        aspect: "portrait"
      }
    ],
    relatedSlugs: ["celebrities", "weddings", "cinema"]
  },

  cinema: {
    id: "cinema",
    slug: "cinema",
    number: "05",
    title: "Cinema & Feature Films",
    shortTitle: "Cinema",
    count: "50+ Anamorphic Films",
    tagline: "2.39:1 Anamorphic motion pictures paired with orchestral audio scores.",
    heroDescription:
      "Shot with dedicated cinema crews on ARRI and Sony FX cinema lines. Edited as theatrical-grade wedding features.",
    fullDescription:
      "Cinema is the heartbeat of 24 Frames. Founded by Phani Gogireddy with roots in Telugu feature cinema, we craft widescreen motion pictures that reject standard videography conventions. Each film is shot on genuine cinema lenses, recorded with multi-track orchestral audio, and edited with theatrical narrative discipline.",
    curatorialNotes: [
      "Our cinematography units utilize Sony FX6 and FX3 cinema cameras mounted with anamorphic lenses to deliver true 2.39:1 widescreen scope with cinematic oval bokeh and flare characteristics.",
      "Audio is recorded on 32-bit float wireless systems, ensuring sacred Vedic mantras, emotional parental toasts, and delicate acoustic performances are preserved with pristine clarity.",
      "Color grading is performed in DaVinci Resolve using our proprietary custom 24F film emulsion look, honoring organic skin tones while lending timeless celluloid warmth."
    ],
    heroImage: "/images/disciplines/cinema/IMG_6471.jpg",
    heroAspect: "cinematic",
    href: "/disciplines/cinema",
    metadata: {
      disciplineNumber: "05 / 05",
      leadArtist: "Phani Gogireddy & Cinema Unit",
      opticsProfile: "Sony FX6 / FX3 Cinema Line & Anamorphic Primes",
      established: "2012",
      archiveVolume: "50+ Theatrical Widescreen Wedding Films",
      primaryLocations: ["Hyderabad", "Dubai", "Goa", "Bengaluru", "Chennai"]
    },
    videos: [
      {
        id: "vid-01",
        title: "A Grand Housewarming Ceremony | Celebrating Dileep & Alekhya’s New Beginning",
        client: "Dileep & Alekhya",
        embedUrl: "https://www.youtube-nocookie.com/embed/N7DYak71gu0",
        poster: "https://i.ytimg.com/vi/N7DYak71gu0/hqdefault.jpg",
        duration: "03:42",
        description:
          "A grand housewarming ceremony and celebration of new beginnings, filmed with architectural elegance, familial joy, and radiant festive light."
      },
      {
        id: "vid-02",
        title: "Manoj X Snigdha | Wedding Story | 24Frames Wedding Films",
        client: "Manoj & Snigdha",
        embedUrl: "https://www.youtube-nocookie.com/embed/ASLHqobh4xs",
        poster: "https://i.ytimg.com/vi/ASLHqobh4xs/hqdefault.jpg",
        duration: "04:15",
        description:
          "The unfolding wedding chapter of Manoj & Snigdha. Documented with tender intimacy, sacred Telugu traditions, and rich cinematic color science."
      },
      {
        id: "vid-03",
        title: "రెండు హృదయాలు కలిసిన ఒక అందమైన ప్రేమకథ | Deekshitha & Rohith Varma",
        client: "Deekshitha & Rohith Varma",
        embedUrl: "https://www.youtube-nocookie.com/embed/mOK3Abk1meg",
        poster: "https://i.ytimg.com/vi/mOK3Abk1meg/hqdefault.jpg",
        duration: "03:50",
        description:
          "Two hearts united in a beautiful love story — cinematic wedding film captured with rich emotion, timeless framing, and celebratory grace."
      },
      {
        id: "vid-04",
        title: "SREE VIDYANIKETHAN INTERNATIONAL SCHOOL | ANNUAL DAY 2020 | MANCHU MOHANBABU | MANOJ MANCHU",
        client: "Dr. M. Mohan Babu & Manchu Manoj / Sree Vidyanikethan",
        embedUrl: "https://www.youtube-nocookie.com/embed/zOXP_UHtc-M",
        poster: "https://i.ytimg.com/vi/zOXP_UHtc-M/hqdefault.jpg",
        duration: "05:10",
        description:
          "Monumental annual day celebration featuring iconic Telugu cinema legend Dr. M. Mohan Babu and actor Manchu Manoj, captured with multi-camera scale."
      }
    ],
    gallery: [
      {
        id: "film-still-01",
        title: "Theatrical Cinema Scenography & Volumetric Contrast",
        client: "Feature Cinema Unit",
        location: "Hyderabad Studio Stage",
        year: "2024",
        image: "/images/disciplines/cinema/IMG_6471.jpg",
        caption: "Widescreen anamorphic cinema frame demonstrating volumetric key lighting and dimensional contrast.",
        aspect: "landscape"
      },
      {
        id: "film-still-02",
        title: "Anamorphic Scope & Compositional Geometry",
        client: "24 Frames Production",
        location: "Location Set",
        year: "2024",
        image: "/images/disciplines/cinema/IMG_6467.jpg",
        caption: "True 2.39:1 widescreen frame composed on cinema prime optics.",
        aspect: "landscape"
      },
      {
        id: "film-still-03",
        title: "Dynamic Camera Movement & Cinematic Focus",
        client: "Production Unit",
        location: "Heritage Pavilion",
        year: "2024",
        image: "/images/disciplines/cinema/IMG_6469.jpg",
        caption: "Precision camera dolly track capturing emotional human expressions with organic lens flares.",
        aspect: "landscape"
      },
      {
        id: "film-still-04",
        title: "Architectural Silhouette Through Triple Arches",
        client: "Widescreen Feature Commission",
        location: "Palace Courtyard",
        year: "2024",
        image: "/images/disciplines/cinema/IMG_6289.jpg",
        caption: "Dramatic sunset silhouette portrait composed through heritage palace arches.",
        aspect: "portrait"
      },
      {
        id: "film-still-05",
        title: "Chiaroscuro Studio Character Lighting",
        client: "Tollywood Character Study",
        location: "24 Frames Studio",
        year: "2024",
        image: "/images/disciplines/cinema/IMG_6319.jpg",
        caption: "Sculptural portrait lighting highlighting emotional poise and deep textured shadows.",
        aspect: "portrait"
      }
    ],
    relatedSlugs: ["weddings", "celebrities", "events"]
  }
};

export const DISCIPLINES_LIST = Object.values(DISCIPLINES_DATA);
