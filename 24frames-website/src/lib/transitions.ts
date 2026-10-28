import { DISCIPLINES_DATA } from "@/data/disciplines";
import { STORIES_DATA } from "@/data/stories";

export type TransitionEffect = "camera-shutter";

export interface RouteVisualMeta {
  image: string;
  webp?: string;
  title: string;
  subtitle?: string;
}

// Fallback visual representations for primary core routes
const STATIC_ROUTE_MAP: Record<string, RouteVisualMeta> = {
  "/": {
    image: "/images/stories/sirish-and-harshitha/IMG_6346.webp",
    title: "24 Frames Photography",
    subtitle: "Cinematic Wedding Films & Curated Archives",
  },
  "/stories": {
    image: "/images/stories/sirish-and-harshitha/IMG_6346.webp",
    title: "Archival Wedding Stories",
    subtitle: "Client Portfolio Chapters",
  },
  "/disciplines": {
    image: "/images/portfolio/sireesh-harshitha/cover.jpg",
    webp: "/images/portfolio/sireesh-harshitha/cover.webp",
    title: "Editorial Disciplines",
    subtitle: "Five Practices of Cinema & Optics",
  },
  "/identity": {
    image: "/images/founder-portrait.jpg",
    title: "The Atelier & Identity",
    subtitle: "Phani Gogireddy · 24 Frames",
  },
};

/**
 * Resolves any internal route pathname into its associated photograph and editorial title.
 */
export function resolveRouteVisual(pathname: string): RouteVisualMeta {
  const clean = pathname.split("?")[0].split("#")[0].replace(/\/$/, "") || "/";

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
