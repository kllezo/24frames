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
    category: "Celebrity Wedding",
    location: "Hyderabad, Telangana",
    venue: "GMR Arena / Shamshabad Estate",
    year: "2024",
    coverImage: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=2400&q=85&auto=format",
    heroAspect: "cinematic",
    overview:
      "A grand three-day celebration blending royal Telugu heritage with contemporary cinematic grandeur. Over seventy hours of bespoke coverage across traditional Mangalasnanam, Sangeet, and the sacred Muhurtham.",
    story: [
      "Every frame was captured using prime cinema lenses to balance the monumental scale of the setting with intimate, unguarded family moments.",
      "The Muhurtham at dawn presented extraordinary natural lighting across the Mandapam, requiring zero artificial disruption to preserve the sanctity of Vedic rituals.",
      "From the rhythmic shower of holy akshatas to the emotional farewell, the film and still coverage honoured legacy over spectacle."
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
        url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=85&auto=format",
        caption: "The sacred Muhurtham Mandapam illuminated by first morning light",
        aspect: "landscape"
      },
      {
        url: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=1200&q=85&auto=format",
        caption: "Bridal portrait in traditional Kanjeevaram gold drape",
        aspect: "portrait"
      },
      {
        url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&q=85&auto=format",
        caption: "Quiet reflection before the arrival of the Baraat",
        aspect: "portrait"
      },
      {
        url: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1600&q=85&auto=format",
        caption: "Jeelakarra Bellam ceremony in full focus",
        aspect: "panoramic"
      }
    ]
  },
  "manoj-snigdha": {
    slug: "manoj-snigdha",
    title: "Temple Grandeur",
    subtitle: "Manoj & Snigdha",
    client: "Manoj & Snigdha",
    category: "Luxury Wedding",
    location: "Hyderabad, Telangana",
    venue: "Chilkur Balaji Vicinity Heritage Pavilion",
    year: "2024",
    coverImage: "https://images.unsplash.com/photo-1519741497674-611481863552?w=2400&q=85&auto=format",
    heroAspect: "wide",
    overview:
      "Steeped in ancient Dravidian temple architecture and classical Carnatic instrumentation, this celebration honoured timeless Telugu tradition with understated luxury.",
    story: [
      "The couple desired absolute documentary authenticity without posed interference. Our visual strategy focused on natural light, temple stone textures, and sacred geometry.",
      "The transition from sunset Vratham to midnight ceremony captured deep ochre, marigold, and incense-hazed light."
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
        url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1600&q=85&auto=format",
        caption: "The entrance courtyard bathed in marigold and temple stone tones",
        aspect: "landscape"
      },
      {
        url: "https://images.unsplash.com/photo-1604017011826-d3b4c23f8914?w=1200&q=85&auto=format",
        caption: "Snigdha in heirloom temple jewellery",
        aspect: "portrait"
      }
    ]
  },
  "dhamini-goutham": {
    slug: "dhamini-goutham",
    title: "A Journey of Love",
    subtitle: "Dhamini & Goutham",
    client: "Dhamini & Goutham",
    category: "Wedding Film & Stills",
    location: "Bengaluru & Hyderabad",
    venue: "The Tamarind Tree Heritage Estate",
    year: "2023",
    coverImage: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=2400&q=85&auto=format",
    heroAspect: "wide",
    overview:
      "A celebration defined by lush canopy foliage, brass urns, and open-sky mandapam courtyards. Crafted as a seamless feature film pairing cinematic sound design with stills.",
    story: [
      "Every element was planned to feel like a visual poem. We utilized vintage optical coatings to soften highlights and emphasize warm skin tones."
    ],
    filmReel: {
      camera: "Sony FX3 & A1 Flagships",
      lens: "Leica R Vintage Primes",
      aspectRatio: "2.35:1 Anamorphic",
      colorProfile: "Custom 35mm Print LUT",
      framesCount: "2,800 curated still frames"
    },
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=1600&q=85&auto=format",
        caption: "Lantern-lit evening garden reception",
        aspect: "landscape"
      }
    ]
  },
  "karthik-vijayalakshmi": {
    slug: "karthik-vijayalakshmi",
    title: "Taj Falaknama",
    subtitle: "Karthik & Vijayalakshmi",
    client: "Karthik & Vijayalakshmi",
    category: "Pre-Wedding & Royal Commission",
    location: "Hyderabad, Telangana",
    venue: "Taj Falaknama Palace",
    year: "2024",
    coverImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=2400&q=85&auto=format",
    heroAspect: "wide",
    overview:
      "Set against the 101-seat dining table and marble colonnades of the Nizam's mirror palace, this visual story reflects high-fashion editorial discipline with regal poise.",
    story: [
      "Access to Falaknama's private royal apartments allowed us to compose frames reminiscent of Renaissance oil masterworks and 1950s European court portraiture."
    ],
    filmReel: {
      camera: "Hasselblad X2D & Nikon Z9",
      lens: "Hasselblad XCD 55V & Nikkor Z 50mm f/1.2 S",
      aspectRatio: "4:5 Medium Format & 16:9 Cinema",
      colorProfile: "Natural Color Solution (HNCS)",
      framesCount: "1,400 medium format frames"
    },
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=85&auto=format",
        caption: "Marble corridors and chandelier reflections",
        aspect: "landscape"
      }
    ]
  },
  "divya-federico": {
    slug: "divya-federico",
    title: "Cross-Cultural",
    subtitle: "Divya & Federico",
    client: "Divya & Federico",
    category: "Destination Wedding",
    location: "Tuscany & Hyderabad",
    venue: "Villa di Catignano & ITC Kohenur",
    year: "2023",
    coverImage: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=2400&q=85&auto=format",
    heroAspect: "wide",
    overview:
      "A cross-continental synthesis: classical Italian Renaissance garden festivities paired with Telugu Brahmin traditions. A study in dual aesthetics and family unity.",
    story: [
      "Translating two distinct visual worlds into one harmonious exhibition: olive groves of Siena meeting the temple silk and Jasmine garlands of Hyderabad."
    ],
    filmReel: {
      camera: "Sony FX6 & A7S III",
      lens: "Cooke S4/i Cinema Primes",
      aspectRatio: "2.39:1",
      colorProfile: "Kodak Vision3 5219 Emulation",
      framesCount: "3,400 curated still frames"
    },
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1600&q=85&auto=format",
        caption: "Sunset toast overlooking the cypress alleys",
        aspect: "landscape"
      }
    ]
  },
  "taj-falaknuma-royal-wedding": {
    slug: "taj-falaknuma-royal-wedding",
    title: "Taj Falaknama",
    subtitle: "Karthik & Vijayalakshmi",
    client: "Karthik & Vijayalakshmi",
    category: "Pre-Wedding & Royal Commission",
    location: "Hyderabad, Telangana",
    venue: "Taj Falaknama Palace",
    year: "2024",
    coverImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=2400&q=85&auto=format",
    heroAspect: "wide",
    overview:
      "Set against the 101-seat dining table and marble colonnades of the Nizam's mirror palace, this visual story reflects high-fashion editorial discipline with regal poise.",
    story: [
      "Access to Falaknama's private royal apartments allowed us to compose frames reminiscent of Renaissance oil masterworks and 1950s European court portraiture."
    ],
    filmReel: {
      camera: "Hasselblad X2D & Nikon Z9",
      lens: "Hasselblad XCD 55V & Nikkor Z 50mm f/1.2 S",
      aspectRatio: "4:5 Medium Format & 16:9 Cinema",
      colorProfile: "Natural Color Solution (HNCS)",
      framesCount: "1,400 medium format frames"
    },
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=85&auto=format",
        caption: "Marble corridors and chandelier reflections",
        aspect: "landscape"
      }
    ]
  },
  "bellamkonda-kavya-reception": {
    slug: "bellamkonda-kavya-reception",
    title: "Bellamkonda Sai Sreenivas & Kavya Reddy",
    subtitle: "Celebrity Wedding Reception",
    client: "Bellamkonda Sai Sreenivas & Kavya Reddy",
    category: "Celebrity Wedding Reception",
    location: "Hyderabad, Telangana",
    venue: "GMR Arena / Shamshabad Estate",
    year: "2024",
    coverImage: "/images/portfolio/bellamkonda-kavya-reception/cover.jpg",
    heroAspect: "wide",
    overview:
      "The grand wedding reception of Telugu cinema star Bellamkonda Sai Sreenivas and Kavya Reddy. Documented by 24 Frames with theatrical lighting discipline and high-resolution optical portraiture.",
    story: [
      "Set against monumental floral installations and welcoming luminaries of Indian cinema, this celebration captured both high-glamour public staging and intimate family warmth.",
      "Archived on Pic-Time under 24 Frames client delivery portal: https://24frames.pic-time.com/8P0kK5ZUmew5F"
    ],
    filmReel: {
      camera: "Sony FX6 & FX3 Cinema Line",
      lens: "Sony G-Master Cinema Primes",
      aspectRatio: "16:9 / 2.39:1",
      colorProfile: "S-Cinetone & 24F Custom Warm Grade",
      framesCount: "Pic-Time Authorized Client Gallery"
    },
    gallery: [
      {
        url: "/images/portfolio/bellamkonda-kavya-reception/cover.jpg",
        caption: "Bellamkonda Sai Sreenivas & Kavya Reddy — Reception Centerpiece",
        aspect: "landscape"
      }
    ]
  },
  "sireesh-harshitha": {
    slug: "sireesh-harshitha",
    title: "Sireesh & Harshitha",
    subtitle: "Sacred Wedding Celebration",
    client: "Sireesh & Harshitha",
    category: "Wedding Celebration",
    location: "Hyderabad, Telangana",
    venue: "Private Estate & Heritage Mandapam",
    year: "2024",
    coverImage: "/images/portfolio/sireesh-harshitha/cover.jpg",
    heroAspect: "tall",
    overview:
      "A sacred union celebrating authentic Telugu wedding rituals, recorded with quiet observational poise and rich warmth by 24 Frames Photography.",
    story: [
      "From traditional Vedic chants to heartfelt family blessings, every ritual frame was composed to preserve generational permanence.",
      "Archived on Pic-Time under 24 Frames client delivery portal: https://24frames.pic-time.com/8Nq0pv3SJbxKn"
    ],
    filmReel: {
      camera: "Nikon Z9 & Leica SL2",
      lens: "Nikkor Z 50mm f/1.2 S & 85mm f/1.2 S",
      aspectRatio: "4:5 Medium Format Stills",
      colorProfile: "24F Bespoke Warm Emulsion",
      framesCount: "Pic-Time Authorized Client Gallery"
    },
    gallery: [
      {
        url: "/images/portfolio/sireesh-harshitha/cover.jpg",
        caption: "Sireesh & Harshitha — Editorial Portrait",
        aspect: "portrait"
      }
    ]
  },
  "hrithika-abhishek": {
    slug: "hrithika-abhishek",
    title: "Hrithika & Abhishek",
    subtitle: "Wedding Celebrations & Rituals",
    client: "Hrithika & Abhishek",
    category: "Wedding & Celebrations",
    location: "Hyderabad, Telangana",
    venue: "Heritage Convention & Private Residence",
    year: "2024",
    coverImage: "/images/portfolio/hrithika-abhishek/cover.jpg",
    heroAspect: "wide",
    overview:
      "Spanning nine distinct event scenes, Hrithika & Abhishek's wedding was captured as an editorial visual tapestry balancing candid energy with regal quietude.",
    story: [
      "Documenting multi-day ceremonies including Haldi, Sangeet galas, and traditional rites across Telangana.",
      "Archived on Pic-Time under 24 Frames client delivery portal: https://24frames.pic-time.com/whZsXRiO6XgQn"
    ],
    filmReel: {
      camera: "Sony Alpha 1 & A7R V",
      lens: "Sony G-Master 35mm f/1.4 & 85mm f/1.4 GM",
      aspectRatio: "16:9 Wide Editorial",
      colorProfile: "Kodak Portra 400 Curve",
      framesCount: "9 Dedicated Scenes on Pic-Time"
    },
    gallery: [
      {
        url: "/images/portfolio/hrithika-abhishek/cover.jpg",
        caption: "Hrithika & Abhishek — Wedding Portrait",
        aspect: "landscape"
      }
    ]
  },
  "karthik-gayathri": {
    slug: "karthik-gayathri",
    title: "Karthik & Gayathri",
    subtitle: "Wedding & Reception Celebrations",
    client: "Karthik & Gayathri",
    category: "Wedding & Celebrations",
    location: "Hyderabad, Telangana",
    venue: "Royal Palace & Heritage Lawn",
    year: "2024",
    coverImage: "/images/portfolio/karthik-gayathri/cover.jpg",
    heroAspect: "tall",
    overview:
      "A timeless celebration documented with fine-art photographic discipline, capturing moments of elegance, sacred rites, and joyful family fellowship.",
    story: [
      "Highlights and multi-day ceremonies curated with 24 Frames' signature warmth and natural light mastery.",
      "Archived on Pic-Time under 24 Frames client delivery portal: https://24frames.pic-time.com/yBCmkKcczvWql"
    ],
    filmReel: {
      camera: "Hasselblad X2D 100C",
      lens: "Hasselblad XCD 55V & 90V",
      aspectRatio: "3:4 Fine Art Portrait",
      colorProfile: "Natural Color Solution (HNCS)",
      framesCount: "Pic-Time Curated Highlights"
    },
    gallery: [
      {
        url: "/images/portfolio/karthik-gayathri/cover.jpg",
        caption: "Karthik & Gayathri — Classical Fine-Art Frame",
        aspect: "portrait"
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
    coverImage: "/images/portfolio/nishanth-sanzena/poster.jpg",
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
        url: "/images/portfolio/nishanth-sanzena/poster.jpg",
        caption: "Nishanth X Sanzena — Theatrical Poster",
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
    coverImage: "/images/portfolio/vinitha-vivekananda/poster.jpg",
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
        url: "/images/portfolio/vinitha-vivekananda/poster.jpg",
        caption: "Vinitha & Vivekananda — Theatrical Poster",
        aspect: "landscape"
      }
    ]
  }
};
