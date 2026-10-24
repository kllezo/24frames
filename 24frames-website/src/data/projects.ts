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
        url: "https://images.unsplash.com/photo-1585071550721-fdb362ae2b8a?w=1200&q=85&auto=format",
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
    coverImage: "https://images.unsplash.com/photo-1585071550721-fdb362ae2b8a?w=2400&q=85&auto=format",
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
    coverImage: "https://images.unsplash.com/photo-1585071550721-fdb362ae2b8a?w=2400&q=85&auto=format",
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
  }
};
