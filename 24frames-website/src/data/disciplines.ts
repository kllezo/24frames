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
      disciplineNumber: "01 / 06",
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
        id: "w-02",
        title: "Hrithika & Abhishek — Sacred Fire & Vedic Vows",
        client: "Hrithika & Abhishek",
        location: "Celebration Estate, Hyderabad",
        year: "2024",
        image: "/images/stories/hrithika-abhishek/IMG_6324.jpg",
        webp: "/images/stories/hrithika-abhishek/IMG_6324.webp",
        caption: "Holy Akshata blessings and generational prayer at the sacred Mandapam.",
        aspect: "portrait",
        storySlug: "hrithika-abhishek"
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
        id: "w-04",
        title: "Sirish & Harshitha — The Emotional Farewell",
        client: "Sirish & Harshitha",
        location: "Heritage Pavilion, Hyderabad",
        year: "2024",
        image: "/images/stories/sirish-and-harshitha/IMG_6346.jpg",
        webp: "/images/stories/sirish-and-harshitha/IMG_6346.webp",
        caption: "An unscripted, tender embrace between father and bride at the conclusion of the Muhurtham.",
        aspect: "portrait",
        storySlug: "sirish-and-harshitha"
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
        id: "w-06",
        title: "Karthik & Gayathri — Sangeet Evening Radiance",
        client: "Karthik & Gayathri",
        location: "The Conservatory Grounds",
        year: "2024",
        image: "/images/stories/karthik-and-gayathri/IMG_6329.jpg",
        webp: "/images/stories/karthik-and-gayathri/IMG_6329.webp",
        caption: "Vibrant familial warmth and musical celebration under warm architectural illumination.",
        aspect: "portrait",
        storySlug: "karthik-and-gayathri"
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
    heroImage: "/images/portfolio/bellamkonda-kavya-reception/cover.jpg",
    heroWebp: "/images/portfolio/bellamkonda-kavya-reception/cover.webp",
    heroAspect: "cinematic",
    href: "/disciplines/celebrities",
    metadata: {
      disciplineNumber: "02 / 06",
      leadArtist: "Phani Gogireddy",
      opticsProfile: "Medium Format 100MP & ARRI Cinema Lighting",
      established: "2014",
      archiveVolume: "15+ Public Figure & Celebrity Commissions",
      primaryLocations: ["Jubilee Hills", "Banjara Hills", "Shamshabad", "Chennai"]
    },
    gallery: [
      {
        id: "c-01",
        title: "Bellamkonda Sai Sreenivas & Kavya Reddy",
        client: "Bellamkonda Family",
        location: "GMR Arena / Shamshabad Estate",
        year: "2024",
        image: "/images/stories/bellam-srikonda/IMG_6339.jpg",
        webp: "/images/stories/bellam-srikonda/IMG_6339.webp",
        caption: "Indian cinema actor Bellamkonda Sai Sreenivas & Kavya Reddy in custom reception couture.",
        aspect: "landscape",
        storySlug: "bellam-srikonda"
      },
      {
        id: "c-02",
        title: "Kavya Reddy — Grand Staircase Portrait",
        client: "Kavya Reddy",
        location: "GMR Arena Grand Foyer",
        year: "2024",
        image: "/images/stories/bellam-srikonda/IMG_6341.jpg",
        webp: "/images/stories/bellam-srikonda/IMG_6341.webp",
        caption: "Sculptural silver couture portraiture composed along the sweeping floral grand staircase.",
        aspect: "portrait",
        storySlug: "bellam-srikonda"
      },
      {
        id: "c-03",
        title: "Private Family Poise — Quiet Majesty",
        client: "Bellamkonda Family & Guests",
        location: "VIP Reception Enclave",
        year: "2024",
        image: "/images/stories/bellam-srikonda/IMG_6342.jpg",
        webp: "/images/stories/bellam-srikonda/IMG_6342.webp",
        caption: "Quiet dignity and intimate stage celebration between luminaries and welcoming families.",
        aspect: "landscape",
        storySlug: "bellam-srikonda"
      },
      {
        id: "c-04",
        title: "Bridal Character Study in Gold",
        client: "Hrithika",
        location: "Private Bridal Suite",
        year: "2024",
        image: "/images/stories/hrithika-abhishek/IMG_6322.jpg",
        webp: "/images/stories/hrithika-abhishek/IMG_6322.webp",
        caption: "Medium-format bridal study capturing temple jewellery detailing and serene composure.",
        aspect: "portrait",
        storySlug: "hrithika-abhishek"
      },
      {
        id: "c-05",
        title: "Quiet Reflection — Monochrome Elegance",
        client: "Gayathri",
        location: "Hyderabad Estate",
        year: "2024",
        image: "/images/stories/karthik-and-gayathri/IMG_6330.jpg",
        webp: "/images/stories/karthik-and-gayathri/IMG_6330.webp",
        caption: "Chiaroscuro shadow-play highlighting handcrafted bridal silks and heirloom gemstones.",
        aspect: "portrait",
        storySlug: "karthik-and-gayathri"
      },
      {
        id: "c-06",
        title: "Grand Stage Lighting Discipline",
        client: "Bellamkonda Sai Sreenivas Reception",
        location: "Shamshabad Estate",
        year: "2024",
        image: "/images/stories/bellam-srikonda/IMG_6344.jpg",
        webp: "/images/stories/bellam-srikonda/IMG_6344.webp",
        caption: "Master cinema fixtures casting volumetric light across the monumental reception stage.",
        aspect: "landscape",
        storySlug: "bellam-srikonda"
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
    heroImage: "/images/stories/bellam-srikonda/IMG_6340.jpg",
    heroWebp: "/images/stories/bellam-srikonda/IMG_6340.webp",
    heroAspect: "cinematic",
    href: "/disciplines/events",
    metadata: {
      disciplineNumber: "03 / 06",
      leadArtist: "Phani Gogireddy & Production Crew",
      opticsProfile: "Multi-Angle Cinema Rigs & High-Speed Optical Primes",
      established: "2013",
      archiveVolume: "120+ Grand Scale Galas & Sangeet Stages",
      primaryLocations: ["Novotel HICC", "GMR Arena", "Taj Falaknama", "Bengaluru Palace"]
    },
    gallery: [
      {
        id: "e-01",
        title: "Monumental Ballroom Scenography",
        client: "Royal Reception Gala",
        location: "GMR Arena, Hyderabad",
        year: "2024",
        image: "/images/stories/bellam-srikonda/IMG_6340.jpg",
        webp: "/images/stories/bellam-srikonda/IMG_6340.webp",
        caption: "Grand ballroom entrance installation featuring ballerina sculpture, cascading floral canopies, and crystal chandeliers.",
        aspect: "landscape"
      },
      {
        id: "e-02",
        title: "Architectural Stage Installation",
        client: "Grand Wedding Reception",
        location: "Shamshabad Estate",
        year: "2024",
        image: "/images/stories/bellam-srikonda/IMG_6343.jpg",
        webp: "/images/stories/bellam-srikonda/IMG_6343.webp",
        caption: "Bespoke floral architecture and custom scenic backdrops illuminated by master lighting design.",
        aspect: "landscape"
      },
      {
        id: "e-03",
        title: "Live Sangeet Choreography & Energy",
        client: "Karthik & Gayathri",
        location: "Glasshouse Conservatory",
        year: "2024",
        image: "/images/stories/karthik-and-gayathri/IMG_6328.jpg",
        webp: "/images/stories/karthik-and-gayathri/IMG_6328.webp",
        caption: "Dynamic choreography and family celebrations captured under warm festive lights.",
        aspect: "landscape"
      },
      {
        id: "e-04",
        title: "Intimate Dinner Gala Gathering",
        client: "Hrithika & Abhishek",
        location: "Celebration Estate Grounds",
        year: "2024",
        image: "/images/stories/hrithika-abhishek/IMG_6333.jpg",
        webp: "/images/stories/hrithika-abhishek/IMG_6333.webp",
        caption: "Generational family gathering and joyous dinner hospitality under heritage chandeliers.",
        aspect: "landscape"
      },
      {
        id: "e-05",
        title: "Evening Conservatory Illumination",
        client: "Karthik & Gayathri",
        location: "The Conservatory Grounds",
        year: "2024",
        image: "/images/stories/karthik-and-gayathri/IMG_6332.jpg",
        webp: "/images/stories/karthik-and-gayathri/IMG_6332.webp",
        caption: "Ambient evening gala lighting highlighting glasshouse architectural symmetry and guest arrivals.",
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
    heroImage: "/images/stories/bellam-srikonda/IMG_6341.jpg",
    heroWebp: "/images/stories/bellam-srikonda/IMG_6341.webp",
    heroAspect: "cinematic",
    href: "/disciplines/fashion",
    metadata: {
      disciplineNumber: "04 / 06",
      leadArtist: "Phani Gogireddy",
      opticsProfile: "Medium Format 100MP & Macro Optical Primes",
      established: "2016",
      archiveVolume: "10+ Dedicated Editorial Lookbooks",
      primaryLocations: ["Hyderabad", "Mumbai", "Chennai"]
    },
    gallery: [
      {
        id: "f-01",
        title: "Couture Silver Embellishments",
        client: "Kavya Reddy Custom Couture",
        location: "GMR Grand Foyer",
        year: "2024",
        image: "/images/stories/bellam-srikonda/IMG_6341.jpg",
        webp: "/images/stories/bellam-srikonda/IMG_6341.webp",
        caption: "Tactile study of hand-embellished crystal embroidery, metallic threadwork, and sculptural bridal silhouettes.",
        aspect: "portrait"
      },
      {
        id: "f-02",
        title: "Heritage Jewelry & Heirloom Craftsmanship",
        client: "Fine Bridal Adornment",
        location: "Editorial Suite",
        year: "2024",
        image: "/images/stories/bellam-srikonda/IMG_6345.jpg",
        webp: "/images/stories/bellam-srikonda/IMG_6345.webp",
        caption: "Macro optical capture of uncut diamond chokers, Colombian emerald beads, and artisanal gold filigree.",
        aspect: "portrait"
      },
      {
        id: "f-03",
        title: "Sacred Handloom Silk & Temple Border",
        client: "Harshitha Heritage Lookbook",
        location: "Palace Grounds",
        year: "2024",
        image: "/images/stories/sirish-and-harshitha/IMG_6356.jpg",
        webp: "/images/stories/sirish-and-harshitha/IMG_6356.webp",
        caption: "Pure Kanjeevaram silk weave documented in directional natural morning light.",
        aspect: "portrait"
      },
      {
        id: "f-04",
        title: "Botanical Conservatory Editorial",
        client: "Gayathri Bridal Spread",
        location: "The Glasshouse",
        year: "2024",
        image: "/images/stories/karthik-and-gayathri/IMG_6326.jpg",
        webp: "/images/stories/karthik-and-gayathri/IMG_6326.webp",
        caption: "Natural daylight filtering through greenhouse architectural glass, creating soft botanical highlights.",
        aspect: "portrait"
      },
      {
        id: "f-05",
        title: "Bridal Veil & Sheer Texture Study",
        client: "Hrithika Couture Portrait",
        location: "Celebration Estate",
        year: "2024",
        image: "/images/stories/hrithika-abhishek/IMG_6337.jpg",
        webp: "/images/stories/hrithika-abhishek/IMG_6337.webp",
        caption: "High-contrast chiaroscuro study of gossamer veil embroidery and quiet contemplation.",
        aspect: "portrait"
      }
    ],
    relatedSlugs: ["celebrities", "weddings", "archive"]
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
    heroImage: "/videos/portfolio/nishanth-sanzena/poster.jpg",
    heroWebp: "/videos/portfolio/nishanth-sanzena/poster.webp",
    heroAspect: "cinematic",
    href: "/disciplines/cinema",
    metadata: {
      disciplineNumber: "05 / 06",
      leadArtist: "Phani Gogireddy & Cinema Unit",
      opticsProfile: "Sony FX6 / FX3 Cinema Line & Anamorphic Primes",
      established: "2012",
      archiveVolume: "50+ Theatrical Widescreen Wedding Films",
      primaryLocations: ["Hyderabad", "Dubai", "Goa", "Bengaluru", "Chennai"]
    },
    videos: [
      {
        id: "vid-01",
        title: "Nishanth X Sanzena — Couple Shoot Film",
        client: "Nishanth & Sanzena",
        embedUrl: "https://www.youtube-nocookie.com/embed/s32UT21hnBg",
        poster: "/videos/portfolio/nishanth-sanzena/poster.jpg",
        posterWebp: "/videos/portfolio/nishanth-sanzena/poster.webp",
        duration: "04:17",
        description:
          "The unfolding love story of Nishanth & Sanzena. Captured with lyrical motion, natural intimacy, and rich anamorphic color tones."
      },
      {
        id: "vid-02",
        title: "Vinitha & Vivekananda — Two Years, One Question",
        client: "Vinitha & Vivekananda",
        embedUrl: "https://www.youtube-nocookie.com/embed/LNtlLgfT5uY",
        poster: "/videos/portfolio/vinitha-vivekananda/poster.jpg",
        posterWebp: "/videos/portfolio/vinitha-vivekananda/poster.webp",
        duration: "02:33",
        description:
          "A journey of love, patience, and devotion—witness the cinematic narrative where two years of togetherness lead to one life-changing question."
      },
      {
        id: "vid-03",
        title: "Bellamkonda Sai Sreenivas & Kavya Reddy — Reception Film",
        client: "Bellamkonda Family & Kavya Reddy",
        embedUrl: "https://www.youtube-nocookie.com/embed/2EICGi0eENA",
        poster: "/images/portfolio/bellamkonda-kavya-reception/cover.jpg",
        posterWebp: "/images/portfolio/bellamkonda-kavya-reception/cover.webp",
        duration: "03:45",
        description:
          "Official cinematic wedding reception film for Telugu cinema star Bellamkonda Sai Sreenivas, featuring distinguished guests and royal stage florals (193k+ views)."
      },
      {
        id: "vid-04",
        title: "Siril Verma & Devi Poojitha — Thambhulam Ceremony Film",
        client: "Siril Verma (World Jr. No.1) & Devi Poojitha",
        embedUrl: "https://www.youtube-nocookie.com/embed/wfgKx4j70i4",
        poster: "/images/portfolio/sireesh-harshitha/cover.jpg",
        duration: "03:12",
        description:
          "Official cinematic pre-wedding event film for international sports personality Siril Verma, directed and filmed by 24 Frames Wedding Films."
      }
    ],
    gallery: [
      {
        id: "film-still-01",
        title: "Nishanth & Sanzena — Cinema Poster Frame",
        client: "Nishanth & Sanzena",
        location: "Heritage Villa Grounds",
        year: "2025",
        image: "/videos/portfolio/nishanth-sanzena/poster.jpg",
        webp: "/videos/portfolio/nishanth-sanzena/poster.webp",
        caption: "Widescreen couple cinema frame captured on 50mm anamorphic prime.",
        aspect: "landscape"
      },
      {
        id: "film-still-02",
        title: "Vinitha & Vivekananda — Feature Teaser Frame",
        client: "Vinitha & Vivekananda",
        location: "Hyderabad Estate",
        year: "2025",
        image: "/videos/portfolio/vinitha-vivekananda/poster.jpg",
        webp: "/videos/portfolio/vinitha-vivekananda/poster.webp",
        caption: "Quiet dawn golden hour cinema capture with natural depth of field.",
        aspect: "landscape"
      },
      {
        id: "film-still-03",
        title: "Bellamkonda Reception — Theatrical Cinema Coverage",
        client: "Bellamkonda Family",
        location: "GMR Arena",
        year: "2024",
        image: "/images/portfolio/bellamkonda-kavya-reception/cover.jpg",
        webp: "/images/portfolio/bellamkonda-kavya-reception/cover.webp",
        caption: "Master camera dolly movement across the royal reception stage.",
        aspect: "landscape"
      }
    ],
    relatedSlugs: ["weddings", "celebrities", "events"]
  },

  archive: {
    id: "archive",
    slug: "archive",
    number: "06",
    title: "The Complete Archive",
    shortTitle: "Archive",
    count: "500+ Commissions",
    tagline: "Fourteen years of optical storytelling across South India and abroad.",
    heroDescription:
      "A continuous visual lineage established in 2012 by founder Phani Gogireddy, preserving over 500 bespoke commissions.",
    fullDescription:
      "Founded in 2012 by Phani Gogireddy, 24 Frames has meticulously preserved fourteen continuous years of visual heritage. Over five hundred private wedding commissions, celebrity character studies, and cultural galas constitute our permanent archival ledger, maintained under strict standards of museum-grade preservation.",
    curatorialNotes: [
      "Every frame in the 24 Frames archive is stored on dual-redundant cold storage arrays with verified checksum audits, ensuring clients' most precious memories remain intact for generations.",
      "Our archival methodology prioritizes historical truth over transient visual trends: natural skin tones, timeless contrast curves, and unscripted human emotion that never grow dated.",
      "Explore individual curated stories below, or contact our Hyderabad studio to request access to specific regional or historical portfolios."
    ],
    heroImage: "/images/stories/sirish-and-harshitha/IMG_6346.jpg",
    heroWebp: "/images/stories/sirish-and-harshitha/IMG_6346.webp",
    heroAspect: "cinematic",
    href: "/disciplines/archive",
    metadata: {
      disciplineNumber: "06 / 06",
      leadArtist: "Phani Gogireddy (Founder)",
      opticsProfile: "Full Optical Vault & 4K Cinema Preservation",
      established: "2012",
      archiveVolume: "500+ Commissions & Over 250,000 Curated Frames",
      primaryLocations: ["Hyderabad", "Bengaluru", "Chennai", "Delhi", "Global"]
    },
    gallery: [
      {
        id: "a-01",
        title: "Bellamkonda Sai Sreenivas & Kavya Reddy Story",
        client: "Bellamkonda Family",
        location: "Shamshabad, Hyderabad",
        year: "2024",
        image: "/images/stories/bellam-srikonda/IMG_6339.jpg",
        webp: "/images/stories/bellam-srikonda/IMG_6339.webp",
        caption: "Master Commission 01 — Seven curated frames in full archival preservation.",
        aspect: "landscape",
        storySlug: "bellam-srikonda"
      },
      {
        id: "a-02",
        title: "Hrithika & Abhishek Story",
        client: "Hrithika & Abhishek",
        location: "Celebration Estate",
        year: "2024",
        image: "/images/stories/hrithika-abhishek/IMG_6324.jpg",
        webp: "/images/stories/hrithika-abhishek/IMG_6324.webp",
        caption: "Master Commission 02 — Nine dedicated scenes documenting Vedic rituals and emotional joy.",
        aspect: "portrait",
        storySlug: "hrithika-abhishek"
      },
      {
        id: "a-03",
        title: "Karthik & Gayathri Story",
        client: "Karthik & Gayathri",
        location: "Glasshouse Conservatory",
        year: "2024",
        image: "/images/stories/karthik-and-gayathri/IMG_6326.jpg",
        webp: "/images/stories/karthik-and-gayathri/IMG_6326.webp",
        caption: "Master Commission 03 — Classical South Indian temple heritage documented under conservatory daylight.",
        aspect: "portrait",
        storySlug: "karthik-and-gayathri"
      },
      {
        id: "a-04",
        title: "Sirish & Harshitha Story",
        client: "Sirish & Harshitha",
        location: "Heritage Pavilion",
        year: "2024",
        image: "/images/stories/sirish-and-harshitha/IMG_6346.jpg",
        webp: "/images/stories/sirish-and-harshitha/IMG_6346.webp",
        caption: "Master Commission 04 — Authentic Dravidian temple stone textures and sacred firelight.",
        aspect: "portrait",
        storySlug: "sirish-and-harshitha"
      },
      {
        id: "a-05",
        title: "Nishanth & Sanzena Cinema Archive",
        client: "Nishanth & Sanzena",
        location: "Heritage Villa",
        year: "2025",
        image: "/videos/portfolio/nishanth-sanzena/poster.jpg",
        webp: "/videos/portfolio/nishanth-sanzena/poster.webp",
        caption: "Cinema Archive 01 — Theatrical 2.39:1 anamorphic motion picture.",
        aspect: "landscape"
      },
      {
        id: "a-06",
        title: "Vinitha & Vivekananda Cinema Archive",
        client: "Vinitha & Vivekananda",
        location: "Hyderabad Estate",
        year: "2025",
        image: "/videos/portfolio/vinitha-vivekananda/poster.jpg",
        webp: "/videos/portfolio/vinitha-vivekananda/poster.webp",
        caption: "Cinema Archive 02 — Authentic wedding vows and documentary cinema feature.",
        aspect: "landscape"
      }
    ],
    relatedSlugs: ["weddings", "celebrities", "cinema"]
  }
};

export const DISCIPLINES_LIST = Object.values(DISCIPLINES_DATA);
