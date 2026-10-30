export interface StoryFrame {
  id: string;
  frameNo: string;
  filename: string;
  url: string;
  webpUrl: string;
  width: number;
  height: number;
  aspect: "portrait" | "landscape";
  caption: string;
}

export interface StoryQuoteFragment {
  chapter: string;
  note: string;
  position?: "left" | "right" | "center";
}

export interface StoryEditorialSection {
  chapterBadge: string;
  chapterTitle: string;
  handwrittenQuote: {
    kicker: string;
    text: string;
  };
  provenance: {
    label: string;
    value: string;
  };
  exhibitionFocus: {
    label: string;
    value: string;
  };
  narrativeLead: string;
  curatorialStatement: string[];
}

export interface StoryGalleryEditorial {
  badge: string;
  title: string;
  subtitle: string;
  narrativeFragments: StoryQuoteFragment[];
}

export interface StoryInquiryCta {
  tag: string;
  heading: string;
  body: string;
  primaryButtonText: string;
  secondaryButtonText: string;
}

export interface StoryDetail {
  slug: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  coupleNames: string;
  category: string;
  location: string;
  venue: string;
  year: string;
  chapterKicker: string;
  coverImage: string;
  coverWebp: string;
  coverPosition?: string;
  coverCaption: string;
  narrativeOverview: string;
  curatorialStatement: string[];
  editorialSection: StoryEditorialSection;
  galleryEditorial: StoryGalleryEditorial;
  inquiryCta: StoryInquiryCta;
  framesCount: number;
  frames: StoryFrame[];
  nextStorySlug: string;
  prevStorySlug: string;
}

export const STORIES_DATA: Record<string, StoryDetail> = {
  "bellam-srikonda": {
    slug: "bellam-srikonda",
    title: "Bellamkonda Sai Sreenivas & Kavya Reddy",
    shortTitle: "Bellamkonda Sai Sreenivas & Kavya Reddy",
    subtitle: "Celebrity Wedding Reception · Hyderabad",
    coupleNames: "Bellamkonda Sai Sreenivas & Kavya Reddy",
    category: "Celebrity Wedding Reception",
    location: "Shamshabad, Hyderabad",
    venue: "GMR Arena & Shamshabad Grounds",
    year: "2025",
    chapterKicker: "THE MONUMENTAL RECEPTION",
    coverImage: "/images/stories/bellam-srikonda/IMG_6339.jpg",
    coverWebp: "/images/stories/bellam-srikonda/IMG_6339.webp",
    coverPosition: "center 18%",
    coverCaption: "An intimate whisper amidst the grand celebration — Kavya Reddy & Bellamkonda Sai Sreenivas",
    narrativeOverview:
      "When the scale of celebration reaches thousands and luminaries of cinema gather under cathedral chandeliers, the rarest art is discovering the quiet, unscripted glance where two people remain entirely alone together.",
    curatorialStatement: [
      "Documenting the union of Telugu cinema actor Bellamkonda Sai Sreenivas and Kavya Reddy demanded an artful duality: honoring the sheer architectural amplitude designed by Design by Raja, while preserving the fragile, authentic tenderness between bride and groom.",
      "As Megastar Chiranjeevi stepped forward with congratulations and cinema icons gathered across the stage, our cameras maintained a discreet distance. We chose long focal lengths and ambient-light preservation to let real laughter breathe without the stiffness of posed protocol.",
      "From the soaring ballerina installation and cascading white florals at the ballroom entrance to the resonant notes of a live concert grand piano, every still holds the kinetic heartbeat of a night where public spectacle met profound family warmth."
    ],
    editorialSection: {
      chapterBadge: "PUBLIC SPLENDOR, PRIVATE POISE",
      chapterTitle: "The Grace of Quiet Grounding",
      handwrittenQuote: {
        kicker: "A whisper against the symphony",
        text: "“Amidst thousands of applauding voices and towering chandeliers, forever was chosen in a single quiet breath.”"
      },
      provenance: {
        label: "Master Inscription",
        value: "Theatrical Production Archive"
      },
      exhibitionFocus: {
        label: "Optical Discipline",
        value: "Large-Format Cinema Glass · Prime Portraits"
      },
      narrativeLead:
        "A monumental evening where cathedral crystal, sweeping floral staircases, and the warmth of cinema icons surrounded a couple wholly anchored in each other.",
      curatorialStatement: [
        "Documenting the union of Telugu cinema actor Bellamkonda Sai Sreenivas and Kavya Reddy demanded an artful duality: honoring the sheer architectural amplitude designed by Design by Raja, while preserving the fragile, authentic tenderness between bride and groom.",
        "As Megastar Chiranjeevi stepped forward with congratulations and cinema icons gathered across the stage, our cameras maintained a discreet distance. We chose long focal lengths and ambient-light preservation to let real laughter breathe without the stiffness of posed protocol.",
        "From the soaring ballerina installation and cascading white florals at the ballroom entrance to the resonant notes of a live concert grand piano, every still holds the kinetic heartbeat of a night where public spectacle met profound family warmth."
      ]
    },
    galleryEditorial: {
      badge: "ARCHIVAL EXHIBITION STILLS",
      title: "The Ballroom Chronicles",
      subtitle:
        "Curated medium-format stills capturing the equilibrium between monumental public scale and unguarded personal affection.",
      narrativeFragments: [
        {
          chapter: "The Threshold",
          note: "Under cascading florals and crystal light, every step felt like walking into history.",
          position: "right"
        },
        {
          chapter: "Shared Poise",
          note: "Surrounded by a sea of well-wishers, their eyes never lost each other.",
          position: "left"
        },
        {
          chapter: "The Resonant Chord",
          note: "The grand piano played softly through the hall, turning grandeur into poetry.",
          position: "left"
        },
        {
          chapter: "Unhurried Devotion",
          note: "A gentle touch on the shoulder. More powerful than any theatrical spotlight.",
          position: "right"
        }
      ]
    },
    inquiryCta: {
      tag: "Bespoke Commissions",
      heading: "Crafting Your Unrepeatable Evening",
      body:
        "Whether your wedding hosts an intimate gathering or an opulent gala attended by generations, 24 Frames approaches every celebration with cinematographic poise, quiet discretion, and timeless optical craft.",
      primaryButtonText: "Begin an Observational Dialogue →",
      secondaryButtonText: "Return to All Stories"
    },
    framesCount: 7,
    nextStorySlug: "sirish-and-harshitha",
    prevStorySlug: "karthik-and-gayathri",
    frames: [
      {
        id: "bs-01",
        frameNo: "01",
        filename: "IMG_6340.jpg",
        url: "/images/stories/bellam-srikonda/IMG_6340.jpg",
        webpUrl: "/images/stories/bellam-srikonda/IMG_6340.webp",
        width: 1168,
        height: 1713,
        aspect: "portrait",
        caption: "Grand ballroom entrance flanked by a classical ballerina sculpture, tiered floral cascades, crystal chandeliers, and emerald reflective walkway"
      },
      {
        id: "bs-02",
        frameNo: "02",
        filename: "IMG_6341.jpg",
        url: "/images/stories/bellam-srikonda/IMG_6341.jpg",
        webpUrl: "/images/stories/bellam-srikonda/IMG_6341.webp",
        width: 1168,
        height: 1693,
        aspect: "portrait",
        caption: "Kavya Reddy in custom silver embroidered couture ascending the monumental floral staircase"
      },
      {
        id: "bs-03",
        frameNo: "03",
        filename: "IMG_6342.jpg",
        url: "/images/stories/bellam-srikonda/IMG_6342.jpg",
        webpUrl: "/images/stories/bellam-srikonda/IMG_6342.webp",
        width: 1168,
        height: 1694,
        aspect: "portrait",
        caption: "Bellamkonda Sai Sreenivas in bespoke midnight velvet tuxedo with structured textured lapels beside the illuminated floral tree"
      },
      {
        id: "bs-04",
        frameNo: "04",
        filename: "IMG_6339.jpg",
        url: "/images/stories/bellam-srikonda/IMG_6339.jpg",
        webpUrl: "/images/stories/bellam-srikonda/IMG_6339.webp",
        width: 1108,
        height: 1490,
        aspect: "portrait",
        caption: "An intimate whisper amidst the grand celebration — Kavya Reddy & Bellamkonda Sai Sreenivas"
      },
      {
        id: "bs-05",
        frameNo: "05",
        filename: "IMG_6343.jpg",
        url: "/images/stories/bellam-srikonda/IMG_6343.jpg",
        webpUrl: "/images/stories/bellam-srikonda/IMG_6343.webp",
        width: 1170,
        height: 769,
        aspect: "landscape",
        caption: "Megastar Chiranjeevi congratulating the newlyweds on stage with a bouquet of pink roses"
      },
      {
        id: "bs-06",
        frameNo: "06",
        filename: "IMG_6344.jpg",
        url: "/images/stories/bellam-srikonda/IMG_6344.jpg",
        webpUrl: "/images/stories/bellam-srikonda/IMG_6344.webp",
        width: 1170,
        height: 776,
        aspect: "landscape",
        caption: "Akkineni Nagarjuna and Naga Chaitanya sharing celebratory laughter with the couple on stage"
      },
      {
        id: "bs-07",
        frameNo: "07",
        filename: "IMG_6345.jpg",
        url: "/images/stories/bellam-srikonda/IMG_6345.jpg",
        webpUrl: "/images/stories/bellam-srikonda/IMG_6345.webp",
        width: 1170,
        height: 774,
        aspect: "landscape",
        caption: "Live classical grand piano performance lending melodic intimacy to the ballroom reception"
      }
    ]
  },
  "sirish-and-harshitha": {
    slug: "sirish-and-harshitha",
    title: "Sireesh & Harshitha",
    shortTitle: "Sireesh & Harshitha",
    subtitle: "Sacred Union & Royal Celebration · Hyderabad",
    coupleNames: "Sireesh & Harshitha",
    category: "Sacred Wedding Union",
    location: "Hyderabad, Telangana",
    venue: "Heritage Palace Grounds & Sacred Pavilion",
    year: "2025",
    chapterKicker: "THE SACRED & THE CELEBRATORY",
    coverImage: "/images/stories/sirish-and-harshitha/IMG_6353.jpg",
    coverWebp: "/images/stories/sirish-and-harshitha/IMG_6353.webp",
    coverPosition: "center 22%",
    coverCaption: "Sacred wedding portrait before Lord Venkateswara: దైవ సంకల్పంతో కలిసిన బంధం",
    narrativeOverview:
      "Anchored in the timeless sanctity of ancient Telugu Vedic customs and crowned by jubilant royal festivities, Sireesh and Harshitha's wedding moved from reverent temple devotion to an exhilarating confetti-lit celebration.",
    curatorialStatement: [
      "Sireesh and Harshitha's union opened with deep devotional quietude. Standing hand-in-hand before the consecrated idol of Lord Venkateswara, the weight of generational blessings, silk zari weaves, and sacred chants set a solemn, transcendent tone.",
      "Our framing honored the heirloom tactile details—the antique gold vaddanam tracing generations of artistry, the hand-embroidered border of Harshitha's wedding saree, and the crisp geometric daylight filtering across Sireesh's architectural portrait.",
      "As dusk transitioned into night at the heritage palace grounds, the atmosphere erupted into unrestrained joy under wisteria floral ceilings and purple neon corridors, culminating in golden confetti falling over a couple dancing without reservation."
    ],
    editorialSection: {
      chapterBadge: "THE VEDIC PLEDGE & PALACE NIGHT",
      chapterTitle: "The Sanctity of Divine Accord",
      handwrittenQuote: {
        kicker: "దైవ సంకల్పం · Sacred Destiny",
        text: "“Bound not merely by celebration, but by a timeless promise sanctified in the presence of the divine.”"
      },
      provenance: {
        label: "Ceremonial Lineage",
        value: "Traditional Telugu Vedic Registry"
      },
      exhibitionFocus: {
        label: "Visual Narrative",
        value: "Heirloom Gold, Sacred Fire & Nocturnal Revelry"
      },
      narrativeLead:
        "A devotional pilgrimage of emotion: beginning before the holy shrine of Lord Venkateswara and culminating in an exuberant burst of stage confetti.",
      curatorialStatement: [
        "Sireesh and Harshitha's union opened with deep devotional quietude. Standing hand-in-hand before the consecrated idol of Lord Venkateswara, the weight of generational blessings, silk zari weaves, and sacred chants set a solemn, transcendent tone.",
        "Our framing honored the heirloom tactile details—the antique gold vaddanam tracing generations of artistry, the hand-embroidered border of Harshitha's wedding saree, and the crisp geometric daylight filtering across Sireesh's architectural portrait.",
        "As dusk transitioned into night at the heritage palace grounds, the atmosphere erupted into unrestrained joy under wisteria floral ceilings and purple neon corridors, culminating in golden confetti falling over a couple dancing without reservation."
      ]
    },
    galleryEditorial: {
      badge: "SACRED TO CELEBRATORY RECORD",
      title: "The Two Halves of a Legacy",
      subtitle:
        "An editorial progression from solemn temple vows and quiet tree-lined strolls to the vivid exuberance of midnight revelry.",
      narrativeFragments: [
        {
          chapter: "The Heirloom Adornment",
          note: "Gold passed through caring maternal hands, carrying decades of whispered blessings.",
          position: "right"
        },
        {
          chapter: "The Quiet Promenade",
          note: "Golden trees, autumn air, and footsteps that knew they were walking home.",
          position: "left"
        },
        {
          chapter: "The Temple Blessing",
          note: "Before the sacred deity, two lives dissolved their separate pasts.",
          position: "left"
        },
        {
          chapter: "The Golden Shower",
          note: "Confetti in the air, music in the chest, and pure uncontainable joy.",
          position: "right"
        }
      ]
    },
    inquiryCta: {
      tag: "Vows Held in Reverence",
      heading: "Preserve What Matters Most",
      body:
        "We honor the sanctity of your customs and the unbridled spirit of your festivities, documenting sacred family ceremonies with documentary respect and cinematic beauty.",
      primaryButtonText: "Inquire for Your Ceremony →",
      secondaryButtonText: "Explore More Stories"
    },
    framesCount: 7,
    nextStorySlug: "hrithika-abhishek",
    prevStorySlug: "bellam-srikonda",
    frames: [
      {
        id: "sh-01",
        frameNo: "01",
        filename: "IMG_6356.jpg",
        url: "/images/stories/sirish-and-harshitha/IMG_6356.jpg",
        webpUrl: "/images/stories/sirish-and-harshitha/IMG_6356.webp",
        width: 1170,
        height: 1901,
        aspect: "portrait",
        caption: "Bridal heirloom montage: antique gold vaddanam waist belt, crimson-and-gold Telugu silk border, and fragrant fresh jasmine"
      },
      {
        id: "sh-02",
        frameNo: "02",
        filename: "IMG_6350.jpg",
        url: "/images/stories/sirish-and-harshitha/IMG_6350.jpg",
        webpUrl: "/images/stories/sirish-and-harshitha/IMG_6350.webp",
        width: 1113,
        height: 1409,
        aspect: "portrait",
        caption: "Architectural portrait of Sireesh leaning against rough-hewn stone masonry in crisp natural morning daylight"
      },
      {
        id: "sh-03",
        frameNo: "03",
        filename: "IMG_6347.jpg",
        url: "/images/stories/sirish-and-harshitha/IMG_6347.jpg",
        webpUrl: "/images/stories/sirish-and-harshitha/IMG_6347.webp",
        width: 1170,
        height: 1426,
        aspect: "portrait",
        caption: "Sireesh & Harshitha walking hand-in-hand through an open meadow lined with golden autumn trees"
      },
      {
        id: "sh-04",
        frameNo: "04",
        filename: "IMG_6353.jpg",
        url: "/images/stories/sirish-and-harshitha/IMG_6353.jpg",
        webpUrl: "/images/stories/sirish-and-harshitha/IMG_6353.webp",
        width: 1116,
        height: 1425,
        aspect: "portrait",
        caption: "Sacred union portrait before Lord Venkateswara: దైవ సంకల్పంతో కలిసిన బంధం"
      },
      {
        id: "sh-05",
        frameNo: "05",
        filename: "IMG_6346.jpg",
        url: "/images/stories/sirish-and-harshitha/IMG_6346.jpg",
        webpUrl: "/images/stories/sirish-and-harshitha/IMG_6346.webp",
        width: 1168,
        height: 1724,
        aspect: "portrait",
        caption: "Royal reception stage enveloped by a dense lilac wisteria ceiling and multi-tiered crystal chandeliers"
      },
      {
        id: "sh-06",
        frameNo: "06",
        filename: "IMG_6348.jpg",
        url: "/images/stories/sirish-and-harshitha/IMG_6348.jpg",
        webpUrl: "/images/stories/sirish-and-harshitha/IMG_6348.webp",
        width: 1170,
        height: 1385,
        aspect: "portrait",
        caption: "Sireesh in evening velvet tuxedo framed within the geometric glow of an illuminated violet light tunnel"
      },
      {
        id: "sh-07",
        frameNo: "07",
        filename: "IMG_6349.jpg",
        url: "/images/stories/sirish-and-harshitha/IMG_6349.jpg",
        webpUrl: "/images/stories/sirish-and-harshitha/IMG_6349.webp",
        width: 1170,
        height: 701,
        aspect: "landscape",
        caption: "Joyous celebration dance as golden confetti cannons shower the couple on stage"
      }
    ]
  },
  "hrithika-abhishek": {
    slug: "hrithika-abhishek",
    title: "Hrithika & Abhishek",
    shortTitle: "Hrithika & Abhishek",
    subtitle: "Sacred Traditions & Multi-Scene Celebrations · Hyderabad",
    coupleNames: "Hrithika & Abhishek",
    category: "Ceremony & Multi-Scene Celebrations",
    location: "Hyderabad, Telangana",
    venue: "Hyderabad Celebration Estate",
    year: "2025",
    chapterKicker: "RITUALS, REVELRY & RUNWAY",
    coverImage: "/images/stories/hrithika-abhishek/IMG_6333.jpg",
    coverWebp: "/images/stories/hrithika-abhishek/IMG_6333.webp",
    coverPosition: "center 18%",
    coverCaption: "Editorial harmony: Hrithika & Abhishek in bespoke lavender evening couture",
    narrativeOverview:
      "A luminous multi-chapter wedding capturing the contrast between ancient ceremonial grace and modern festival exuberance—from the sacred purifying droplets of Mangalasnanam to an electrified celestial Sangeet.",
    curatorialStatement: [
      "Hrithika and Abhishek's celebration embraced a vivid kaleidoscope of atmospheres. It began at a traditional carved temple entrance with golden brass urulis, leading to the intimate, sacred morning ritual of Mangalasnanam.",
      "Our high-speed cinema optics froze the sacred holy water as it streamed through a perforated brass plate, turning airborne water droplets into suspended liquid pearls that framed Hrithika's radiant smile.",
      "By nightfall, the tempo surged into arena-scale grandeur. Beneath a surreal ceiling installation of hundreds of suspended mirror disco spheres, the Sangeet stage ignited with illuminated monogram initials and vibrant dance choreography, culminating in soft couture portraits in harmonized pastel tones."
    ],
    editorialSection: {
      chapterBadge: "DUAL SPECTRUMS OF CELEBRATION",
      chapterTitle: "Where Water Blessings Meet Starlit Stages",
      handwrittenQuote: {
        kicker: "Echoes of joy",
        text: "“From the sacred coolness of morning turmeric water to midnight dancing under mirrored skies, love was celebrated in every color.”"
      },
      provenance: {
        label: "Celebration Scope",
        value: "Nine-Scene Multi-Day Master Archive"
      },
      exhibitionFocus: {
        label: "Optical Dynamic",
        value: "High-Speed Shutter Drops to Arena Strobe Control"
      },
      narrativeLead:
        "Spanning the solemn quietude of auspicious South Indian rituals and the stadium-wattage euphoria of an all-night concert sangeet.",
      curatorialStatement: [
        "Hrithika and Abhishek's celebration embraced a vivid kaleidoscope of atmospheres. It began at a traditional carved temple entrance with golden brass urulis, leading to the intimate, sacred morning ritual of Mangalasnanam.",
        "Our high-speed cinema optics froze the sacred holy water as it streamed through a perforated brass plate, turning airborne water droplets into suspended liquid pearls that framed Hrithika's radiant smile.",
        "By nightfall, the tempo surged into arena-scale grandeur. Beneath a surreal ceiling installation of hundreds of suspended mirror disco spheres, the Sangeet stage ignited with illuminated monogram initials and vibrant dance choreography, culminating in soft couture portraits in harmonized pastel tones."
      ]
    },
    galleryEditorial: {
      badge: "RITUAL & STAGE SEQUENCE",
      title: "The Multi-Atmosphere Narrative",
      subtitle:
        "Tracing the emotional continuum between devotional water blessings, regal silk portraiture, and high-energy festival nights.",
      narrativeFragments: [
        {
          chapter: "The Auspicious Welcome",
          note: "Carved teak doors, yellow marigolds, and the fragrant welcome of home.",
          position: "right"
        },
        {
          chapter: "The Water Blessing",
          note: "Droplets suspended in time like frozen wishes falling from the sky.",
          position: "left"
        },
        {
          chapter: "The Crimson Silk",
          note: "Kanjeevaram silk draped with quiet poise beside the sacred floral tapestry.",
          position: "left"
        },
        {
          chapter: "Under Mirrored Skies",
          note: "Hundreds of crystal globes turning midnight into an endless starlit dance.",
          position: "right"
        }
      ]
    },
    inquiryCta: {
      tag: "Multi-Day Celebrations",
      heading: "Document Your Full Continuum",
      body:
        "From sunrise ritual baths to late-night dance stages, 24 Frames crafts a unified visual language across every day, ceremony, and mood of your wedding festival.",
      primaryButtonText: "Commission Multi-Event Coverage →",
      secondaryButtonText: "Browse All Wedding Stories"
    },
    framesCount: 8,
    nextStorySlug: "karthik-and-gayathri",
    prevStorySlug: "sirish-and-harshitha",
    frames: [
      {
        id: "ha-01",
        frameNo: "01",
        filename: "IMG_6324.jpg",
        url: "/images/stories/hrithika-abhishek/IMG_6324.jpg",
        webpUrl: "/images/stories/hrithika-abhishek/IMG_6324.webp",
        width: 1170,
        height: 1737,
        aspect: "portrait",
        caption: "Auspicious welcome: hand-carved heritage wooden temple doorway flanked by brass urulis and marigold garlands"
      },
      {
        id: "ha-02",
        frameNo: "02",
        filename: "IMG_6337.jpg",
        url: "/images/stories/hrithika-abhishek/IMG_6337.jpg",
        webpUrl: "/images/stories/hrithika-abhishek/IMG_6337.webp",
        width: 1170,
        height: 1747,
        aspect: "portrait",
        caption: "Sacred Mangalasnanam: holy water streaming through a perforated brass plate, freezing crystalline droplets around the smiling bride"
      },
      {
        id: "ha-03",
        frameNo: "03",
        filename: "IMG_6334.jpg",
        url: "/images/stories/hrithika-abhishek/IMG_6334.jpg",
        webpUrl: "/images/stories/hrithika-abhishek/IMG_6334.webp",
        width: 1050,
        height: 1415,
        aspect: "portrait",
        caption: "Bridal portrait of Hrithika in deep crimson Kanjeevaram silk saree and heritage gold jewelry beside a woven floral art tapestry"
      },
      {
        id: "ha-04",
        frameNo: "04",
        filename: "IMG_6338.jpg",
        url: "/images/stories/hrithika-abhishek/IMG_6338.jpg",
        webpUrl: "/images/stories/hrithika-abhishek/IMG_6338.webp",
        width: 1168,
        height: 1736,
        aspect: "portrait",
        caption: "Groom portrait of Abhishek in an ivory-and-gold zardozi sherwani paired with a layered emerald haar"
      },
      {
        id: "ha-05",
        frameNo: "05",
        filename: "IMG_6325.jpg",
        url: "/images/stories/hrithika-abhishek/IMG_6325.jpg",
        webpUrl: "/images/stories/hrithika-abhishek/IMG_6325.webp",
        width: 1170,
        height: 766,
        aspect: "landscape",
        caption: "Sunlit daytime ceremony pavilion with cane lounge seating and pastel watercolor fabric streamers"
      },
      {
        id: "ha-06",
        frameNo: "06",
        filename: "IMG_6322.jpg",
        url: "/images/stories/hrithika-abhishek/IMG_6322.jpg",
        webpUrl: "/images/stories/hrithika-abhishek/IMG_6322.webp",
        width: 1170,
        height: 744,
        aspect: "landscape",
        caption: "Monochrome ceiling installation featuring suspended mirror disco balls and crystal chains above the Sangeet floor"
      },
      {
        id: "ha-07",
        frameNo: "07",
        filename: "IMG_6323.jpg",
        url: "/images/stories/hrithika-abhishek/IMG_6323.jpg",
        webpUrl: "/images/stories/hrithika-abhishek/IMG_6323.webp",
        width: 1170,
        height: 765,
        aspect: "landscape",
        caption: "Concert Sangeet stage illuminated by intelligent beam lighting and a monumental glowing H & A monogram"
      },
      {
        id: "ha-08",
        frameNo: "08",
        filename: "IMG_6333.jpg",
        url: "/images/stories/hrithika-abhishek/IMG_6333.jpg",
        webpUrl: "/images/stories/hrithika-abhishek/IMG_6333.webp",
        width: 1170,
        height: 1434,
        aspect: "portrait",
        caption: "Editorial couple portrait: Hrithika & Abhishek in harmonized lavender evening couture"
      }
    ]
  },
  "karthik-and-gayathri": {
    slug: "karthik-and-gayathri",
    title: "Karthik & Gayathri",
    shortTitle: "Karthik & Gayathri",
    subtitle: "Botanical Splendor & Fine-Art Wedding · Hyderabad",
    coupleNames: "Karthik & Gayathri",
    category: "Fine-Art Botanical Wedding",
    location: "Hyderabad, Telangana",
    venue: "Botanical Glasshouse & Pavilion",
    year: "2025",
    chapterKicker: "BOTANICAL HARMONY & UNREHEARSED JOY",
    coverImage: "/images/stories/karthik-and-gayathri/IMG_6330.jpg",
    coverWebp: "/images/stories/karthik-and-gayathri/IMG_6330.webp",
    coverPosition: "60% 16%",
    coverCaption: "Intimate forehead embrace: Gayathri in emerald silk & Karthik in ceremonial ivory",
    narrativeOverview:
      "Set against a sun-drenched conservatory of cascading blush blooms, terracotta urns, and open verandas, Karthik and Gayathri's wedding unfolded with breezy elegance, spontaneous dance, and quiet, soulful intimacy.",
    curatorialStatement: [
      "Karthik and Gayathri envisioned a wedding unburdened by rigid formality. Nestled within an open-air pavilion and sunlit glasshouse, their mandap was constructed from natural timber and draped with thousands of cascading pink and peach blossoms.",
      "Our lens celebrated tactile, organic details: the rough terracotta urns wrapped in trailing vines, Gayathri's graceful stride along the classical columned veranda in her blush lehenga, and the rich macro texture where fresh varmala rose petals touched ornate gold embroidery.",
      "Rather than stiffly orchestrated poses, the defining moments were purely spontaneous—an exuberant, joyous dance before the mandap, a vintage field camera standing guard on the lawn, and a tender forehead-to-forehead embrace where time simply paused."
    ],
    editorialSection: {
      chapterBadge: "ORGANIC SCENOGRAPHY & LAUGHTER",
      chapterTitle: "The Poetry of Botanical Light",
      handwrittenQuote: {
        kicker: "Light among the leaves",
        text: "“No scripts, no stiff postures—just two souls laughing freely under trailing vines and the open morning sky.”"
      },
      provenance: {
        label: "Natural Scenography",
        value: "Glasshouse Conservatory & Garden Pavilion"
      },
      exhibitionFocus: {
        label: "Editorial Style",
        value: "Natural Daylight, Tactile Weaves & Candid Motion"
      },
      narrativeLead:
        "Where fresh garden air, handcrafted wooden pavilions, and uninhibited celebration replaced traditional ballroom confinement.",
      curatorialStatement: [
        "Karthik and Gayathri envisioned a wedding unburdened by rigid formality. Nestled within an open-air pavilion and sunlit glasshouse, their mandap was constructed from natural timber and draped with thousands of cascading pink and peach blossoms.",
        "Our lens celebrated tactile, organic details: the rough terracotta urns wrapped in trailing vines, Gayathri's graceful stride along the classical columned veranda in her blush lehenga, and the rich macro texture where fresh varmala rose petals touched ornate gold embroidery.",
        "Rather than stiffly orchestrated poses, the defining moments were purely spontaneous—an exuberant, joyous dance before the mandap, a vintage field camera standing guard on the lawn, and a tender forehead-to-forehead embrace where time simply paused."
      ]
    },
    galleryEditorial: {
      badge: "BOTANICAL STILLS PORTFOLIO",
      title: "The Conservatory Chapters",
      subtitle:
        "A fine-art sequence celebrating organic light, textural floral craft, and the infectious joy of shared laughter.",
      narrativeFragments: [
        {
          chapter: "The Living Pavilion",
          note: "Terracotta, pearl spheres, and green vines climbing toward the morning light.",
          position: "right"
        },
        {
          chapter: "The Veranda Walk",
          note: "Blush silk floating effortlessly with every breeze along the open corridor.",
          position: "left"
        },
        {
          chapter: "The Unplanned Dance",
          note: "Two people forgetting the cameras entirely, caught up in pure celebration.",
          position: "left"
        },
        {
          chapter: "The Quiet Forehead Touch",
          note: "Holding hands in the garden shade. The whole world suddenly completely quiet.",
          position: "right"
        }
      ]
    },
    inquiryCta: {
      tag: "Fine-Art Union",
      heading: "Celebrate With Organic Grace",
      body:
        "If your vision embraces natural light, authentic laughter, and refined photographic sensibility that values raw feeling over artificial sets, we would love to document your story.",
      primaryButtonText: "Explore Commission Availability →",
      secondaryButtonText: "Return to All Stories"
    },
    framesCount: 9,
    nextStorySlug: "bellam-srikonda",
    prevStorySlug: "hrithika-abhishek",
    frames: [
      {
        id: "kg-01",
        frameNo: "01",
        filename: "IMG_6328.jpg",
        url: "/images/stories/karthik-and-gayathri/IMG_6328.jpg",
        webpUrl: "/images/stories/karthik-and-gayathri/IMG_6328.webp",
        width: 1170,
        height: 1715,
        aspect: "portrait",
        caption: "Botanical conservatory installation with peach terracotta urns, pearl glass spheres, and trailing verdant vines"
      },
      {
        id: "kg-02",
        frameNo: "02",
        filename: "IMG_6329.jpg",
        url: "/images/stories/karthik-and-gayathri/IMG_6329.jpg",
        webpUrl: "/images/stories/karthik-and-gayathri/IMG_6329.webp",
        width: 1170,
        height: 1710,
        aspect: "portrait",
        caption: "Vertical vista of the open-air wooden mandap pergola draped in cascading blush-pink floral garlands"
      },
      {
        id: "kg-03",
        frameNo: "03",
        filename: "IMG_6327.jpg",
        url: "/images/stories/karthik-and-gayathri/IMG_6327.jpg",
        webpUrl: "/images/stories/karthik-and-gayathri/IMG_6327.webp",
        width: 1168,
        height: 760,
        aspect: "landscape",
        caption: "Panoramic ceremony setting featuring natural woven cane seating and organic floor-level floral runners"
      },
      {
        id: "kg-04",
        frameNo: "04",
        filename: "IMG_6336.jpg",
        url: "/images/stories/karthik-and-gayathri/IMG_6336.jpg",
        webpUrl: "/images/stories/karthik-and-gayathri/IMG_6336.webp",
        width: 1107,
        height: 1475,
        aspect: "portrait",
        caption: "Gayathri walking gracefully along the neoclassical sunlit veranda in an ethereal blush pink lehenga"
      },
      {
        id: "kg-05",
        frameNo: "05",
        filename: "IMG_6335.jpg",
        url: "/images/stories/karthik-and-gayathri/IMG_6335.jpg",
        webpUrl: "/images/stories/karthik-and-gayathri/IMG_6335.webp",
        width: 1168,
        height: 1533,
        aspect: "portrait",
        caption: "Fine-art monochrome portrait of Karthik in ceremonial silks, layered emerald necklace, and pocket watch"
      },
      {
        id: "kg-06",
        frameNo: "06",
        filename: "IMG_6331.jpg",
        url: "/images/stories/karthik-and-gayathri/IMG_6331.jpg",
        webpUrl: "/images/stories/karthik-and-gayathri/IMG_6331.webp",
        width: 969,
        height: 1415,
        aspect: "portrait",
        caption: "Tactile macro detail: fresh varmala rose petals meeting intricate gold zardozi embroidery"
      },
      {
        id: "kg-07",
        frameNo: "07",
        filename: "IMG_6326.jpg",
        url: "/images/stories/karthik-and-gayathri/IMG_6326.jpg",
        webpUrl: "/images/stories/karthik-and-gayathri/IMG_6326.webp",
        width: 1124,
        height: 1525,
        aspect: "portrait",
        caption: "Spontaneous celebration dance by Karthik & Gayathri before the flower-draped mandap"
      },
      {
        id: "kg-08",
        frameNo: "08",
        filename: "IMG_6330.jpg",
        url: "/images/stories/karthik-and-gayathri/IMG_6330.jpg",
        webpUrl: "/images/stories/karthik-and-gayathri/IMG_6330.webp",
        width: 1170,
        height: 1523,
        aspect: "portrait",
        caption: "Quiet emotional grounding: forehead-to-forehead embrace with clasped hands in the garden shade"
      },
      {
        id: "kg-09",
        frameNo: "09",
        filename: "IMG_6332.jpg",
        url: "/images/stories/karthik-and-gayathri/IMG_6332.jpg",
        webpUrl: "/images/stories/karthik-and-gayathri/IMG_6332.webp",
        width: 1170,
        height: 1579,
        aspect: "portrait",
        caption: "Artisanal heritage detail: a vintage folding field camera resting on a wooden tripod on the lawn"
      }
    ]
  }
};

// Compatibility route aliases so both canonical folder slugs and portfolio slugs resolve directly
STORIES_DATA["bellamkonda-kavya"] = { ...STORIES_DATA["bellam-srikonda"], slug: "bellamkonda-kavya" };
STORIES_DATA["bellamkonda-kavya-reception"] = { ...STORIES_DATA["bellam-srikonda"], slug: "bellamkonda-kavya-reception" };
STORIES_DATA["sireesh-harshitha"] = { ...STORIES_DATA["sirish-and-harshitha"], slug: "sireesh-harshitha" };
STORIES_DATA["karthik-gayathri"] = { ...STORIES_DATA["karthik-and-gayathri"], slug: "karthik-gayathri" };

export const STORIES_LIST: StoryDetail[] = [
  STORIES_DATA["bellam-srikonda"],
  STORIES_DATA["sirish-and-harshitha"],
  STORIES_DATA["hrithika-abhishek"],
  STORIES_DATA["karthik-and-gayathri"],
];
