import { DISCIPLINES_DATA } from "@/data/disciplines";
import { STORIES_DATA } from "@/data/stories";

export type TransitionEffect = "camera-shutter" | "camera-orbit";

export interface CameraOrbitConfig {
  startRotateY: number; // degrees e.g. -3.5
  startRotateX: number; // degrees e.g. 2.0
  startScale: number;   // e.g. 1.08
  startX: number;       // px e.g. 22
  startY: number;       // px e.g. -14
}

export interface RouteVisualMeta {
  image: string;
  webp?: string;
  title: string;
  subtitle?: string;
  focalPoint?: string;
  cameraOrbit?: CameraOrbitConfig;
}

// ── Exact Route-to-Subject Visual Target Directory ──────────────────────────
const STATIC_ROUTE_MAP: Record<string, RouteVisualMeta> = {
  "/": {
    image: "/images/portfolio/hrithika-abhishek/cover.jpg",
    title: "24 FRAMES · THE MASTER FILM",
    subtitle: "Hrithika & Abhishek · Editorial Wedding Heritage",
    focalPoint: "center 35%",
    cameraOrbit: {
      startRotateY: -3,
      startRotateX: 2,
      startScale: 1.08,
      startX: 24,
      startY: -16,
    },
  },
  "/#vows": {
    image: "/images/stories/bellam-srikonda/IMG_6339.jpg",
    webp: "/images/stories/bellam-srikonda/IMG_6339.webp",
    title: "THE VOWS",
    subtitle: "Bellamkonda Sai Sreenivas & Kavya Reddy",
    focalPoint: "center 24%",
    cameraOrbit: {
      startRotateY: 3,
      startRotateX: -2,
      startScale: 1.07,
      startX: -20,
      startY: 14,
    },
  },
  "/collection": {
    image: "/images/portfolio/sireesh-harshitha/cover.jpg",
    webp: "/images/portfolio/sireesh-harshitha/cover.webp",
    title: "THE COLLECTION",
    subtitle: "Weddings & Celebrations · Five Practices of Optics",
    focalPoint: "center 22%",
    cameraOrbit: {
      startRotateY: -3.5,
      startRotateX: 1.8,
      startScale: 1.08,
      startX: 22,
      startY: -12,
    },
  },
  "/#collection": {
    image: "/images/portfolio/sireesh-harshitha/cover.jpg",
    webp: "/images/portfolio/sireesh-harshitha/cover.webp",
    title: "THE COLLECTION",
    subtitle: "Weddings & Celebrations · Five Practices of Optics",
    focalPoint: "center 22%",
    cameraOrbit: {
      startRotateY: -3.5,
      startRotateX: 1.8,
      startScale: 1.08,
      startX: 22,
      startY: -12,
    },
  },
  "/#artist": {
    image: "/images/founder-portrait.jpg",
    title: "THE ARTIST & VISIONARY",
    subtitle: "Phani Gogireddy · Managing Director",
    focalPoint: "center 20%",
    cameraOrbit: {
      startRotateY: 2.5,
      startRotateX: -1.5,
      startScale: 1.06,
      startX: -18,
      startY: 10,
    },
  },
  "/stories": {
    image: "/images/stories/sirish-and-harshitha/IMG_6353.jpg",
    webp: "/images/stories/sirish-and-harshitha/IMG_6353.webp",
    title: "SACRED WEDDING STORIES",
    subtitle: "Sireesh & Harshitha · Heritage Palace Grounds",
    focalPoint: "center 58%",
    cameraOrbit: {
      startRotateY: -2.8,
      startRotateX: 2.2,
      startScale: 1.08,
      startX: 20,
      startY: -14,
    },
  },
  "/inquire": {
    image: "/images/stories/karthik-and-gayathri/IMG_6330.jpg",
    webp: "/images/stories/karthik-and-gayathri/IMG_6330.webp",
    title: "THE COMMISSION ATELIER",
    subtitle: "Tell Us What You Want To Remember",
    focalPoint: "62% top",
    cameraOrbit: {
      startRotateY: -2.5,
      startRotateX: 1.5,
      startScale: 1.06,
      startX: 16,
      startY: -12,
    },
  },
  "/client-gallery": {
    image: "/images/gallery-experience/the-private-archive-primary.png",
    title: "PRIVATE CLIENT SUITE",
    subtitle: "Archival Client Gallery Suite & 4K Cinema Room",
    focalPoint: "center 20%",
    cameraOrbit: {
      startRotateY: 2,
      startRotateX: -2,
      startScale: 1.06,
      startX: -15,
      startY: 12,
    },
  },
  "/disciplines": {
    image: "/images/portfolio/sireesh-harshitha/cover.jpg",
    webp: "/images/portfolio/sireesh-harshitha/cover.webp",
    title: "EDITORIAL DISCIPLINES",
    subtitle: "Five Practices of Cinema & Optics",
    focalPoint: "center 22%",
    cameraOrbit: {
      startRotateY: -3,
      startRotateX: 2,
      startScale: 1.08,
      startX: 22,
      startY: -12,
    },
  },
};

/**
 * Resolves any internal route pathname into its deliberate visual target and camera orbit parameters.
 */
export function resolveRouteVisual(pathname: string): RouteVisualMeta {
  const cleanWithHash = pathname.split("?")[0].replace(/\/$/, "");
  const clean = cleanWithHash.split("#")[0] || "/";

  // Check exact full path including hash (e.g. /#vows, /#artist)
  if (STATIC_ROUTE_MAP[cleanWithHash]) {
    return STATIC_ROUTE_MAP[cleanWithHash];
  }

  // Check direct static routes
  if (STATIC_ROUTE_MAP[clean]) {
    return STATIC_ROUTE_MAP[clean];
  }

  // Check disciplines (/disciplines/[slug])
  if (clean.startsWith("/disciplines/")) {
    const slug = clean.replace("/disciplines/", "");
    const discipline = DISCIPLINES_DATA[slug];
    if (discipline) {
      return {
        image: discipline.heroImage || discipline.gallery?.[0]?.image || "",
        webp: discipline.heroWebp || discipline.gallery?.[0]?.webp,
        title: discipline.title,
        subtitle: discipline.tagline,
        focalPoint: "center 25%",
        cameraOrbit: {
          startRotateY: 3,
          startRotateX: -2,
          startScale: 1.07,
          startX: -20,
          startY: 12,
        },
      };
    }
  }

  // Check stories (/stories/[slug])
  if (clean.startsWith("/stories/")) {
    const slug = clean.replace("/stories/", "");
    const story = STORIES_DATA[slug];
    if (story) {
      return {
        image: story.coverWebp || story.coverImage,
        webp: story.coverWebp,
        title: story.title,
        subtitle: story.subtitle,
        focalPoint: story.coverPosition || "center 25%",
        cameraOrbit: {
          startRotateY: -3,
          startRotateX: 2,
          startScale: 1.08,
          startX: 22,
          startY: -14,
        },
      };
    }
  }

  // Default fallback to master hero still
  return STATIC_ROUTE_MAP["/"];
}

/**
 * Dispatches a camera transition navigation event for programmatic callers.
 */
export function navigateWithCameraTransition(
  url: string,
  options?: {
    image?: string;
    effect?: TransitionEffect;
  }
) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("24f-navigate", {
      detail: {
        url,
        image: options?.image,
        effect: options?.effect,
      },
    })
  );
}
