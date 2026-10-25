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
  coverImage: string;
  coverWebp: string;
  coverCaption: string;
  narrativeOverview: string;
  curatorialStatement: string[];
  framesCount: number;
  frames: StoryFrame[];
  nextStorySlug: string;
  prevStorySlug: string;
}

export const STORIES_DATA: Record<string, StoryDetail> = {
  "bellam-srikonda": {
    slug: "bellam-srikonda",
    title: "Bellamkonda Sai Sreenivas & Kavya Reddy",
    shortTitle: "Bellam Srikonda",
    subtitle: "Celebrity Wedding Reception · Hyderabad",
    coupleNames: "Bellamkonda Sai Sreenivas & Kavya Reddy",
    category: "Celebrity Wedding Reception",
    location: "Shamshabad, Hyderabad",
    venue: "GMR Arena & Shamshabad Estate",
    year: "2025",
    coverImage: "/images/stories/bellam-srikonda/IMG_6339.jpg",
    coverWebp: "/images/stories/bellam-srikonda/IMG_6339.webp",
    coverCaption: "Intimate celebration embrace: Kavya Reddy & Bellamkonda Sai Sreenivas",
    narrativeOverview:
      "The monumental wedding reception of Indian cinema actor Bellamkonda Sai Sreenivas and Kavya Reddy, documented by 24 Frames with theatrical lighting discipline, quiet poise, and medium-format optics.",
    curatorialStatement: [
      "Set against grand floral architecture, cascading crystal chandeliers, and welcoming luminaries of Indian cinema, this celebration commanded both monumental public scale and intimate family warmth.",
      "Every frame was curated directly from the handpicked client archives, balancing the theatrical grandeur of the ballroom with subtle, candid expressions of genuine love."
    ],
    framesCount: 7,
    nextStorySlug: "hrithika-abhishek",
    prevStorySlug: "sirish-and-harshitha",
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
        caption: "Grand ballroom reception entrance with ballerina sculpture, floral cascades, and crystal chandeliers"
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
        caption: "Kavya Reddy in custom silver embellished couture ascending the grand floral staircase"
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
        caption: "Bellamkonda Sai Sreenivas in bespoke embroidered velvet tuxedo by the floral installation"
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
        caption: "An intimate kiss of affection — Kavya & Sai Sreenivas"
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
        caption: "Megastar Chiranjeevi congratulating the newlyweds on stage with pink roses"
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
        caption: "Akkineni Nagarjuna and Naga Chaitanya on stage alongside the couple"
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
        caption: "Live classical grand piano performance amidst the reception hall"
      }
    ]
  },
  "hrithika-abhishek": {
    slug: "hrithika-abhishek",
    title: "Hrithika & Abhishek",
    shortTitle: "Hrithika Abhishek",
    subtitle: "Sacred Traditions & Grand Celebrations · Hyderabad",
    coupleNames: "Hrithika & Abhishek",
    category: "Wedding & Multi-Scene Celebrations",
    location: "Hyderabad, Telangana",
    venue: "Hyderabad Celebration Estate",
    year: "2025",
    coverImage: "/images/stories/hrithika-abhishek/IMG_6333.jpg",
    coverWebp: "/images/stories/hrithika-abhishek/IMG_6333.webp",
    coverCaption: "Editorial portrait of Hrithika & Abhishek in harmonized lavender couture",
    narrativeOverview:
      "A rich multi-chapter wedding celebration chronicling sacred Telugu rituals, vibrant family galas, and quiet architectural portraits, captured with 24 Frames' signature warmth and fine-art framing.",
    curatorialStatement: [
      "From the timeless sacred Mangalasnanam holy water bath to the electrified energy of the concert Sangeet stage, Hrithika & Abhishek's wedding transitions seamlessly across rituals and moods.",
      "Each photograph in this exhibition preserves natural moments of devotion, laughter, and generational legacy."
    ],
    framesCount: 8,
    nextStorySlug: "karthik-and-gayathri",
    prevStorySlug: "bellam-srikonda",
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
        caption: "Traditional heritage wooden temple doorway with brass urulis and marigold garlands"
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
        caption: "Sacred Mangalasnanam ritual — holy water poured through perforated brass plate with frozen droplets"
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
        caption: "Bridal solo portrait of Hrithika in crimson Kanjeevaram silk saree beside floral art tapestry"
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
        caption: "Groom portrait of Abhishek in regal gold embroidered sherwani and multi-strand emerald haar"
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
        caption: "Pastel ceremony day stage with cane sofa and draped colorful fabric streamers"
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
        caption: "Monochrome celestial ceiling installation with suspended mirror disco balls and crystal chains"
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
        caption: "Sangeet concert stage featuring illuminated H & A monogram and concert lighting"
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
        caption: "Editorial couple portrait of Hrithika & Abhishek in harmonized lavender couture"
      }
    ]
  },
  "karthik-and-gayathri": {
    slug: "karthik-and-gayathri",
    title: "Karthik & Gayathri",
    shortTitle: "Karthik and Gayathri",
    subtitle: "Botanical Splendor & Fine-Art Wedding · Hyderabad",
    coupleNames: "Karthik & Gayathri",
    category: "Fine-Art Wedding Celebrations",
    location: "Hyderabad, Telangana",
    venue: "Botanical Pavilion & Glasshouse",
    year: "2025",
    coverImage: "/images/stories/karthik-and-gayathri/IMG_6330.jpg",
    coverWebp: "/images/stories/karthik-and-gayathri/IMG_6330.webp",
    coverCaption: "Intimate forehead-to-forehead embrace: Gayathri in emerald silk & Karthik in ivory",
    narrativeOverview:
      "An enchanting fine-art wedding set in lush botanical grounds, weaving vibrant floral craftsmanship, classical temple attire, and exuberant celebratory dance into a timeless visual poem.",
    curatorialStatement: [
      "Captured within a sunlit glasshouse pavilion adorned with cascades of pink floral hangings and classical terracotta urns, Karthik & Gayathri's wedding honors timeless South Indian heritage.",
      "The photographic narrative highlights both the solemn intimacy of sacred promises and spontaneous moments of joyous celebration."
    ],
    framesCount: 9,
    nextStorySlug: "sirish-and-harshitha",
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
        caption: "Botanical glasshouse installation with peach urns, pearl spheres, and trailing vines"
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
        caption: "Full vertical vista of the botanical mandap with cascading pink floral hangings"
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
        caption: "Wide mandap perspective with woven cane sofa and floral arrangements"
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
        caption: "Gayathri walking gracefully down the architectural veranda in blush pink lehenga"
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
        caption: "Monochrome portrait of Karthik in traditional ceremonial attire and emerald haar"
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
        caption: "Textural crop of varmala floral garlands and intricate lehenga zardozi embroidery"
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
        caption: "Exuberant celebration dance by Karthik & Gayathri in front of the mandap"
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
        caption: "Intimate forehead-to-forehead moment holding hands"
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
        caption: "Vintage wooden tripod photobooth on the garden lawn"
      }
    ]
  },
  "sirish-and-harshitha": {
    slug: "sirish-and-harshitha",
    title: "Sireesh & Harshitha",
    shortTitle: "Sirish and Harshitha",
    subtitle: "Sacred Union & Royal Celebration · Hyderabad",
    coupleNames: "Sireesh & Harshitha",
    category: "Sacred Wedding Union",
    location: "Hyderabad, Telangana",
    venue: "Palace Grounds & Temple Pavilion",
    year: "2025",
    coverImage: "/images/stories/sirish-and-harshitha/IMG_6353.jpg",
    coverWebp: "/images/stories/sirish-and-harshitha/IMG_6353.webp",
    coverCaption: "Sacred union in front of Lord Venkateswara: దైవ సంకల్పంతో కలిసిన బంధం",
    narrativeOverview:
      "A deeply reverent Telugu wedding ceremony anchored in ancient Vedic sanctity and royal palace celebrations, captured with devotional reverence and contemporary cinematic grace.",
    curatorialStatement: [
      "Framed before a sanctified idol of Lord Venkateswara, this celebration captures the eternal bond between Sireesh & Harshitha, surrounded by family blessings and traditional iconography.",
      "The visual sequence moves from serene bridal adornments and quiet architectural portraits to the explosive joy of stage festivities."
    ],
    framesCount: 7,
    nextStorySlug: "bellam-srikonda",
    prevStorySlug: "karthik-and-gayathri",
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
        caption: "Editorial bridal preparation montage: jewelry, embroidered Telugu heirloom border, and antique vaddanam"
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
        caption: "Architectural portrait of Sireesh leaning against textured wall with dramatic shadow geometry"
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
        caption: "Couple walking hand in hand through an ethereal meadow lined with golden autumnal trees"
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
        caption: "Sacred wedding portrait of Sireesh & Harshitha in front of the Lord Venkateswara deity"
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
        caption: "Grand palace reception stage with wisteria floral ceiling and crystal chandeliers"
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
        caption: "Sireesh solo portrait in embellished velvet tuxedo in neon purple light tunnel"
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
        caption: "Confetti explosion during couple stage dance"
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
