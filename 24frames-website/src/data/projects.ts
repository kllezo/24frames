export interface ProjectDetail {
  slug: string;
  title: string;
  subtitle: string;
  client: string;
  category: string;
  location: string;
  venue: string;
  year: string;
  coverImage: string;
  heroAspect: "wide" | "tall" | "cinematic";
  overview: string;
  story: string[];
  gallery: {
    url: string;
    caption: string;
    aspect: "landscape" | "portrait" | "panoramic";
  }[];
  filmReel?: {
    camera: string;
    lens: string;
    aspectRatio: string;
    colorProfile: string;
    framesCount: string;
  };
  clientQuote?: {
    text: string;
    author: string;
  };
}

export const PROJECTS_DATA: Record<string, ProjectDetail> = {
  "bellamkonda-kavya": {
    slug: "bellamkonda-kavya",
    title: "A Royal Union",
    subtitle: "Bellamkonda Sai Sreenivas & Kavya Reddy",
    client: "Bellamkonda Family & Kavya Reddy",
    category: "Celebrity Wedding Reception",
    location: "Shamshabad, Hyderabad",
    venue: "GMR Arena / Shamshabad Estate",
    year: "2025",
    coverImage: "/images/stories/bellam-srikonda/IMG_6339.jpg",
    heroAspect: "cinematic",
    overview:
      "A grand multi-day celebration blending royal Telugu heritage with contemporary cinematic grandeur. Curated coverage documented with theatrical lighting discipline, quiet poise, and prime cinema optics.",
    story: [
      "Prime cinema lenses balanced the monumental ballroom architecture with unguarded family greetings and tender couple embraces.",
      "The ballroom reception gathered leading luminaries of Indian cinema, documented with quiet observational poise and rich amber color grading.",
      "From Megastar Chiranjeevi to Akkineni Nagarjuna and Naga Chaitanya, dignitaries joined on stage to celebrate the union of Bellamkonda Sai Sreenivas & Kavya Reddy."
    ],
    filmReel: {
      camera: "Sony FX6 & FX3 Cinema Line",
      lens: "Zeiss Supreme Primes & G-Master 50mm f/1.2",
      aspectRatio: "2.39:1 Anamorphic",
      colorProfile: "S-Cinetone / Custom 24F Film Emulsion",
      framesCount: "4,200 curated still frames"
    },
    clientQuote: {
      text: "Phani and the 24 Frames team moved like ghosts throughout our celebrations. You never felt like you were posing for a camera; you were living your wedding, and the frames they delivered look like an epic cinema film.",
      author: "Bellamkonda Family"
    },
    gallery: [
      {
        url: "/images/stories/bellam-srikonda/IMG_6340.jpg",
        caption: "Grand ballroom reception entrance with ballerina sculpture and chandeliers",
        aspect: "portrait"
      },
      {
        url: "/images/stories/bellam-srikonda/IMG_6341.jpg",
        caption: "Kavya Reddy in custom couture ascending the grand floral staircase",
        aspect: "portrait"
      },
      {
        url: "/images/stories/bellam-srikonda/IMG_6342.jpg",
        caption: "Bellamkonda Sai Sreenivas in bespoke velvet tuxedo",
        aspect: "portrait"
      },
      {
        url: "/images/stories/bellam-srikonda/IMG_6343.jpg",
        caption: "Megastar Chiranjeevi congratulating the newlyweds",
        aspect: "landscape"
      },
      {
        url: "/images/stories/bellam-srikonda/IMG_6344.jpg",
        caption: "Akkineni Nagarjuna and Naga Chaitanya on stage with the couple",
        aspect: "landscape"
      }
    ]
  },
  "sireesh-harshitha": {
    slug: "sireesh-harshitha",
    title: "Sacred Telugu Union",
    subtitle: "Sireesh & Harshitha",
    client: "Sireesh & Harshitha",
    category: "Sacred Wedding Union",
    location: "Hyderabad, Telangana",
    venue: "Palace Grounds & Heritage Pavilion",
    year: "2025",
    coverImage: "/images/stories/sirish-and-harshitha/IMG_6353.jpg",
    heroAspect: "tall",
    overview:
      "A deeply reverent Telugu wedding ceremony anchored in ancient Vedic sanctity and royal palace celebrations, captured with devotional reverence and contemporary cinematic grace.",
    story: [
      "Documented with absolute documentary reverence before the sanctified idol of Lord Venkateswara, where family elders bestowed Vedic blessings.",
      "The visual arc moves from quiet morning architectural stone portraits and an autumn meadow walk to the radiant euphoria of an evening stage celebration showered in golden confetti."
    ],
    filmReel: {
      camera: "Nikon Z9 & Z8 Studio Flagships",
      lens: "Nikkor Z 35mm f/1.8 S & 85mm f/1.2 S",
      aspectRatio: "16:9 Cinema Wide",
      colorProfile: "N-Log 10-bit Raw",
      framesCount: "3,100 curated still frames"
    },
    gallery: [
      {
        url: "/images/stories/sirish-and-harshitha/IMG_6346.jpg",
        caption: "Grand palace reception stage with wisteria ceiling and chandeliers",
        aspect: "portrait"
      },
      {
        url: "/images/stories/sirish-and-harshitha/IMG_6347.jpg",
        caption: "Couple walking hand in hand through golden tree meadow",
        aspect: "portrait"
      },
      {
        url: "/images/stories/sirish-and-harshitha/IMG_6350.jpg",
        caption: "Architectural portrait of Sireesh leaning against textured wall",
        aspect: "portrait"
      },
      {
        url: "/images/stories/sirish-and-harshitha/IMG_6356.jpg",
        caption: "Editorial bridal preparation montage: heirloom jewelry and border",
        aspect: "portrait"
      }
    ]
  },
  "hrithika-abhishek": {
    slug: "hrithika-abhishek",
    title: "Sacred Traditions & Grand Celebrations",
    subtitle: "Hrithika & Abhishek",
    client: "Hrithika & Abhishek",
    category: "Luxury Wedding",
    location: "Hyderabad, Telangana",
    venue: "Hyderabad Celebration Estate",
    year: "2025",
    coverImage: "/images/stories/hrithika-abhishek/IMG_6333.jpg",
    heroAspect: "wide",
    overview:
      "A rich multi-chapter wedding celebration chronicling sacred Telugu rituals, vibrant family galas, and quiet architectural portraits, captured with 24 Frames' signature warmth.",
    story: [
      "Custom vintage optical coatings preserved warm skin tones during the sacred Mangalasnanam holy water blessing, freezing airborne droplets in crystal clarity.",
      "The celebration transitioned seamlessly from traditional temple entryway florals to an electrifying concert Sangeet stage beneath hundreds of mirror disco spheres."
    ],
    filmReel: {
      camera: "Sony FX3 & A1 Flagships",
      lens: "Leica R Vintage Primes",
      aspectRatio: "16:9 Cinema Wide",
      colorProfile: "Custom 24F Emulsion",
      framesCount: "2,800 curated still frames"
    },
    gallery: [
      {
        url: "/images/stories/hrithika-abhishek/IMG_6337.jpg",
        caption: "Sacred Mangalasnanam ritual with frozen holy water droplets",
        aspect: "portrait"
      },
      {
        url: "/images/stories/hrithika-abhishek/IMG_6334.jpg",
        caption: "Bridal portrait in crimson Kanjeevaram silk saree",
        aspect: "portrait"
      },
      {
        url: "/images/stories/hrithika-abhishek/IMG_6338.jpg",
        caption: "Groom portrait in gold embroidered sherwani",
        aspect: "portrait"
      },
      {
        url: "/images/stories/hrithika-abhishek/IMG_6323.jpg",
        caption: "Sangeet concert stage featuring illuminated H & A monogram",
        aspect: "landscape"
      }
    ]
  },
  "karthik-gayathri": {
    slug: "karthik-gayathri",
    title: "Botanical Splendor & Fine-Art Wedding",
    subtitle: "Karthik & Gayathri",
    client: "Karthik & Gayathri",
    category: "Fine-Art Wedding Celebrations",
    location: "Hyderabad, Telangana",
    venue: "Botanical Pavilion & Glasshouse",
    year: "2025",
    coverImage: "/images/stories/karthik-and-gayathri/IMG_6330.jpg",
    heroAspect: "tall",
    overview:
      "An enchanting fine-art wedding set in lush botanical grounds, weaving vibrant floral craftsmanship, classical temple attire, and exuberant celebratory dance into a timeless visual poem.",
    story: [
      "A sunlit botanical glasshouse framed in natural timber pergolas and cascading blush-pink garlands, prioritizing unhurried ease over stiff ceremony.",
      "From fine-art macro captures of varmala florals against intricate zardozi weaves to an exuberant couple dance before the mandap, every frame celebrates organic emotion."
    ],
    filmReel: {
      camera: "Hasselblad X2D 100C",
      lens: "Hasselblad XCD 55V & 90V",
      aspectRatio: "3:4 Fine Art Portrait",
      colorProfile: "Natural Color Solution (HNCS)",
      framesCount: "Curated Master Selection"
    },
    gallery: [
      {
        url: "/images/stories/karthik-and-gayathri/IMG_6328.jpg",
        caption: "Botanical glasshouse installation with peach urns and trailing vines",
        aspect: "portrait"
      },
      {
        url: "/images/stories/karthik-and-gayathri/IMG_6329.jpg",
        caption: "Full vertical vista of the botanical mandap with cascading pink florals",
        aspect: "portrait"
      },
      {
        url: "/images/stories/karthik-and-gayathri/IMG_6336.jpg",
        caption: "Gayathri walking gracefully down the architectural veranda in blush lehenga",
        aspect: "portrait"
      },
      {
        url: "/images/stories/karthik-and-gayathri/IMG_6326.jpg",
        caption: "Exuberant celebration dance by Karthik & Gayathri in front of the mandap",
        aspect: "portrait"
      }
    ]
  },
  "karthik-falaknama": {
    slug: "karthik-falaknama",
    title: "Taj Falaknuma Palace Film",
    subtitle: "Karthik & Vijayalakshmi",
    client: "Karthik & Vijayalakshmi",
    category: "Cinema & Feature Film",
    location: "Hyderabad, Telangana",
    venue: "Taj Falaknuma Palace",
    year: "2024",
    coverImage: "/images/portfolio/karthik-falaknama/cover.jpg",
    heroAspect: "cinematic",
    overview:
      "A royal palace wedding feature film shot on optical cinema primes across the Nizam's mirror palace, marble colonnades, and 101-seat dining hall at Taj Falaknuma.",
    story: [
      "Access to Falaknama's private royal courtyards allowed us to compose frames reminiscent of royal paintings and European court portraiture.",
      "Graded with archival film print curves and accompanied by an orchestral audio master."
    ],
    filmReel: {
      camera: "Sony FX6 & FX3 Multi-Cam Cinema Rig",
      lens: "Cooke Anamorphic /i Cinema Primes",
      aspectRatio: "2.39:1 Anamorphic Cinema",
      colorProfile: "Custom 24F Warm Master LUT",
      framesCount: "4K Theatrical Feature"
    },
    gallery: [
      {
        url: "/images/portfolio/karthik-falaknama/cover.jpg",
        caption: "The royal courtyards and marble terraces of Taj Falaknuma",
        aspect: "landscape"
      }
    ]
  },
  "vinitha-vivekananda": {
    slug: "vinitha-vivekananda",
    title: "Vinitha & Vivekananda",
    subtitle: "Wedding Feature Film",
    client: "Vinitha & Vivekananda",
    category: "Wedding Feature Film",
    location: "Hyderabad, Telangana",
    venue: "Grand Heritage Convention Center",
    year: "2024",
    coverImage: "/videos/portfolio/vinitha-vivekananda/poster.jpg",
    heroAspect: "cinematic",
    overview:
      "A 14-minute 55-second theatrical-grade wedding feature film. Chronicling the grand ceremonies, heartfelt speeches, and cinematic spectacle of Vinitha and Vivekananda's wedding.",
    story: [
      "Streamed in 4K UHD via YouTube: https://youtu.be/LNtlLgfT5uY",
      "Produced and edited by 24 Frames Wedding Films."
    ],
    filmReel: {
      camera: "Sony FX9 & Sony FX6 Multi-Cam Cinema Rig",
      lens: "Angénieux EZ-1 & Sony G-Master Primes",
      aspectRatio: "2.39:1 Cinema",
      colorProfile: "S-Gamut3.Cine / S-Log3 Grade",
      framesCount: "Duration: 14m 55s Feature Length"
    },
    gallery: [
      {
        url: "/videos/portfolio/vinitha-vivekananda/poster.jpg",
        caption: "Vinitha & Vivekananda — Theatrical Poster",
        aspect: "landscape"
      }
    ]
  },
  "nishanth-sanzena": {
    slug: "nishanth-sanzena",
    title: "Nishanth X Sanzena",
    subtitle: "Couple Shoot Film",
    client: "Nishanth & Sanzena",
    category: "Couple Shoot Film",
    location: "Hyderabad, India",
    venue: "Outdoor Editorial Location",
    year: "2024",
    coverImage: "/videos/portfolio/nishanth-sanzena/poster.jpg",
    heroAspect: "cinematic",
    overview:
      "A 3-minute 12-second cinematic couple shoot film directed and produced by 24 Frames Wedding Films. Combining intimate handheld framing with sweeping widescreen compositions.",
    story: [
      "Streamed in 4K UHD via YouTube: https://youtu.be/s32UT21hnBg",
      "Directed and graded by 24 Frames Wedding Films."
    ],
    filmReel: {
      camera: "ARRI Alexa Mini LF / Sony FX6",
      lens: "Cooke Anamorphic /i Full Frame Plus",
      aspectRatio: "2.39:1 Anamorphic Cinema",
      colorProfile: "Arri LogC to 24F Film Print Emulation",
      framesCount: "Duration: 3m 12s (4K UHD)"
    },
    gallery: [
      {
        url: "/videos/portfolio/nishanth-sanzena/poster.jpg",
        caption: "Nishanth X Sanzena — Theatrical Poster",
        aspect: "landscape"
      }
    ]
  }
};
