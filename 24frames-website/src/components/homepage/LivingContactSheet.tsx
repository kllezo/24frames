"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./LivingContactSheet.module.css";

gsap.registerPlugin(ScrollTrigger);

/* ── Content Interfaces ────────────────────────────────────────── */
export interface GalleryProjectItem {
  id: string;
  orderNumber: string;
  categoryLabel: string;
  clientNames: string;
  captionTitle: string;
  captionSub: string;
  category: string;
  location: string;
  image: string;
  webpImage: string;
  aspectRatio: string;
  storyUrl: string;
  objectPosition?: string;
  narrative?: string;
}

export interface GalleryFilmItem {
  id: string;
  orderNumber: string;
  categoryLabel: string;
  filmTitle: string;
  category: string;
  duration: string;
  youtubeId: string;
  embedUrl: string;
  poster: string;
  webpPoster: string;
  description: string;
}

/* ── Six Verified Client Commissions ────────────────────────────── */

/* Item 1: Dominant Featured Story — Bellamkonda Sai Sreenivas & Kavya Reddy */
export const ITEM_PROJECT_01: GalleryProjectItem = {
  id: "project-01",
  orderNumber: "01",
  categoryLabel: "Featured Commission · Celebrity Wedding Reception",
  clientNames: "Bellamkonda Sai Sreenivas & Kavya Reddy",
  captionTitle: "Bellamkonda Sai Sreenivas & Kavya Reddy",
  captionSub: "Celebrity Wedding Reception · Hyderabad",
  category: "Celebrity Wedding Reception",
  location: "GMR ARENA & SHAMSHABAD ESTATE, HYDERABAD",
  image: "/images/stories/bellam-srikonda/IMG_6339.jpg",
  webpImage: "/images/stories/bellam-srikonda/IMG_6339.webp",
  aspectRatio: "3 / 4",
  storyUrl: "/stories/bellam-srikonda",
  objectPosition: "center 18%",
  narrative:
    "Monumental ballroom scale meets quiet, unhurried poise. Documented with large-format cinema glass across a grand gathering of Indian cinema.",
};

/* Item 2: Master Cinema Feature — Vinitha & Vivekananda */
export const ITEM_VIDEO_01: GalleryFilmItem = {
  id: "video-01",
  orderNumber: "01",
  categoryLabel: "01 —— WEDDING FILM",
  filmTitle: "Vinitha & Vivekananda",
  category: "Wedding Feature Film",
  duration: "14:55",
  youtubeId: "LNtlLgfT5uY",
  embedUrl:
    "https://www.youtube-nocookie.com/embed/LNtlLgfT5uY?autoplay=1&rel=0&playsinline=1&modestbranding=1",
  poster: "/videos/portfolio/vinitha-vivekananda/poster.jpg",
  webpPoster: "/videos/portfolio/vinitha-vivekananda/poster.webp",
  description:
    "A beautiful film that unfolds a soulful celebration — where two journeys became one.",
};

/* Item 3: Sacred Wedding Union — Sireesh & Harshitha */
export const ITEM_PROJECT_02: GalleryProjectItem = {
  id: "project-02",
  orderNumber: "02",
  categoryLabel: "02 —— TRADITIONAL WEDDING",
  clientNames: "Sireesh & Harshitha",
  captionTitle: "Sireesh & Harshitha",
  captionSub: "Sacred Wedding Union · Telangana",
  category: "Sacred Wedding Union",
  location: "Hyderabad, Telangana",
  image: "/images/stories/sirish-and-harshitha/IMG_6347.jpg",
  webpImage: "/images/stories/sirish-and-harshitha/IMG_6347.webp",
  aspectRatio: "3 / 4",
  storyUrl: "/stories/sirish-and-harshitha",
  objectPosition: "center 22%",
  narrative:
    "Sacred temple vows before Lord Venkateswara transitioning into sunlit meadow strolls and an electric midnight confetti celebration.",
};

/* Supporting Still: Mandapam Architecture — Sireesh & Harshitha */
export const ITEM_PROJECT_02_MANDAP: GalleryProjectItem = {
  id: "project-02-mandap",
  orderNumber: "02B",
  categoryLabel: "Mandapam Heritage Stage",
  clientNames: "Sireesh & Harshitha Mandapam",
  captionTitle: "Royal Mandapam Under Golden Chandeliers",
  captionSub: "Sacred Mandapam Architecture",
  category: "Traditional Wedding",
  location: "Hyderabad, Telangana",
  image: "/images/stories/sirish-and-harshitha/IMG_6353.jpg",
  webpImage: "/images/stories/sirish-and-harshitha/IMG_6353.webp",
  aspectRatio: "16 / 9",
  storyUrl: "/stories/sirish-and-harshitha",
  objectPosition: "center 24%",
};

/* Item 4: Royal Couture Portrait — Hrithika & Abhishek */
export const ITEM_PROJECT_03: GalleryProjectItem = {
  id: "project-03",
  orderNumber: "03",
  categoryLabel: "03 —— PRE-WEDDING COLLECTION",
  clientNames: "Hrithika & Abhishek",
  captionTitle: "Hrithika & Abhishek",
  captionSub: "Nine-Scene Celebration · Hyderabad",
  category: "Ceremony & Celebrations",
  location: "Hyderabad, Telangana",
  image: "/images/stories/hrithika-abhishek/IMG_6333_cropped.jpg",
  webpImage: "/images/stories/hrithika-abhishek/IMG_6333_cropped.webp",
  aspectRatio: "4 / 5",
  storyUrl: "/stories/hrithika-abhishek",
  objectPosition: "center 18%",
  narrative:
    "From frozen droplets of morning Mangalasnanam water blessings to an arena Sangeet stage under a ceiling of mirrored spheres.",
};

/* Item 5: Fine-Art Heritage Embrace — Karthik & Gayathri */
export const ITEM_PROJECT_04: GalleryProjectItem = {
  id: "project-04",
  orderNumber: "04",
  categoryLabel: "04 —— FINE-ART HERITAGE WEDDING",
  clientNames: "Karthik & Gayathri",
  captionTitle: "Karthik & Gayathri",
  captionSub: "Fine-Art Wedding · Botanical Glasshouse",
  category: "Fine-Art Heritage Wedding",
  location: "Botanical Glasshouse · Hyderabad",
  image: "/images/stories/karthik-and-gayathri/IMG_6330.jpg",
  webpImage: "/images/stories/karthik-and-gayathri/IMG_6330.webp",
  aspectRatio: "16 / 10",
  storyUrl: "/stories/karthik-and-gayathri",
  objectPosition: "center 20%",
  narrative:
    "Sun-drenched botanical glasshouse sceneries, breezy columned verandas, and spontaneous dance before cascading blush florals.",
};

/* Item 6: Couple Shoot Signature Film — Nishanth X Sanzena */
export const ITEM_VIDEO_02: GalleryFilmItem = {
  id: "video-02",
  orderNumber: "05",
  categoryLabel: "05 —— SIGNATURE FILM",
  filmTitle: "Nishanth X Sanzena",
  category: "Couple Shoot Cinema Film",
  duration: "03:12",
  youtubeId: "s32UT21hnBg",
  embedUrl:
    "https://www.youtube-nocookie.com/embed/s32UT21hnBg?autoplay=1&rel=0&playsinline=1&modestbranding=1",
  poster: "/videos/portfolio/nishanth-sanzena/poster.jpg",
  webpPoster: "/videos/portfolio/nishanth-sanzena/poster.webp",
  description:
    "A story of finding home in the most unexpected places — where love felt inevitable, every frame a new chapter, and real emotions took center stage.",
};

/* ── Nishanth Liquid Wave Reveal Geometry & Types ───────────────────────── */
interface WaveCoords {
  xTop: number;
  c1x: number;
  c1y: number;
  c2x: number;
  c2y: number;
  mx: number;
  my: number;
  c3x: number;
  c3y: number;
  c4x: number;
  c4y: number;
  xBot: number;
}

interface GreenBottomCoords {
  yLeft: number;
  cp1x: number;
  cp1y: number;
  cp2x: number;
  cp2y: number;
  mx: number;
  my: number;
  cp3x: number;
  cp3y: number;
  cp4x: number;
  cp4y: number;
  endX: number;
  endY: number;
}

// Stage 1: Off-screen right (Concealed behind opaque flowing wave cover)
const APERTURE_STAGE_1: WaveCoords = {
  xTop: 1520,
  c1x: 1480,
  c1y: 190,
  c2x: 1560,
  c2y: 310,
  mx: 1500,
  my: 400,
  c3x: 1560,
  c3y: 520,
  c4x: 1490,
  c4y: 690,
  xBot: 1520,
};

// Stage 2: First Reveal (Organic aperture uncovers couple's faces in center-right)
const APERTURE_STAGE_2: WaveCoords = {
  xTop: 660,
  c1x: 540,
  c1y: 180,
  c2x: 710,
  c2y: 300,
  mx: 780,
  my: 390,
  c3x: 850,
  c3y: 510,
  c4x: 670,
  c4y: 680,
  xBot: 710,
};

// Stage 3: Building Depth (Aperture sweeps wider across frame, revealing embrace & landscape)
const APERTURE_STAGE_3: WaveCoords = {
  xTop: 280,
  c1x: 180,
  c1y: 200,
  c2x: 340,
  c2y: 320,
  mx: 400,
  my: 410,
  c3x: 480,
  c3y: 530,
  c4x: 240,
  c4y: 700,
  xBot: 260,
};

// Stage 4 & 5: Settled / Nearing Completion (Aperture flows completely beyond left border)
const APERTURE_STAGE_4: WaveCoords = {
  xTop: -220,
  c1x: -280,
  c1y: 200,
  c2x: -200,
  c2y: 320,
  mx: -180,
  my: 410,
  c3x: -160,
  c3y: 530,
  c4x: -240,
  c4y: 700,
  xBot: -210,
};

// Secondary Trailing Wave (Phase-offset fluid depth)
const SEC_STAGE_1: WaveCoords = {
  xTop: 1680,
  c1x: 1620,
  c1y: 200,
  c2x: 1720,
  c2y: 330,
  mx: 1660,
  my: 410,
  c3x: 1740,
  c3y: 540,
  c4x: 1640,
  c4y: 690,
  xBot: 1680,
};

const SEC_STAGE_2: WaveCoords = {
  xTop: 820,
  c1x: 700,
  c1y: 190,
  c2x: 870,
  c2y: 310,
  mx: 940,
  my: 400,
  c3x: 1020,
  c3y: 520,
  c4x: 830,
  c4y: 690,
  xBot: 870,
};

const SEC_STAGE_3: WaveCoords = {
  xTop: 440,
  c1x: 320,
  c1y: 210,
  c2x: 500,
  c2y: 330,
  mx: 560,
  my: 420,
  c3x: 640,
  c3y: 540,
  c4x: 390,
  c4y: 700,
  xBot: 420,
};

const SEC_STAGE_4: WaveCoords = {
  xTop: -100,
  c1x: -160,
  c1y: 210,
  c2x: -80,
  c2y: 330,
  mx: -50,
  my: 420,
  c3x: -30,
  c3y: 540,
  c4x: -120,
  c4y: 700,
  xBot: -90,
};

// Bottom Forest-Green Wave
const GREEN_BOT_STAGE_1: GreenBottomCoords = {
  yLeft: 600,
  cp1x: 280,
  cp1y: 540,
  cp2x: 560,
  cp2y: 680,
  mx: 860,
  my: 650,
  cp3x: 1100,
  cp3y: 620,
  cp4x: 1320,
  cp4y: 720,
  endX: 1440,
  endY: 710,
};

const GREEN_BOT_STAGE_2: GreenBottomCoords = {
  yLeft: 580,
  cp1x: 240,
  cp1y: 520,
  cp2x: 480,
  cp2y: 640,
  mx: 740,
  my: 690,
  cp3x: 960,
  cp3y: 740,
  cp4x: 1180,
  cp4y: 780,
  endX: 1440,
  endY: 770,
};

const GREEN_BOT_STAGE_FINAL: GreenBottomCoords = {
  yLeft: 560,
  cp1x: 180,
  cp1y: 500,
  cp2x: 380,
  cp2y: 610,
  mx: 600,
  my: 720,
  cp3x: 720,
  cp3y: 780,
  cp4x: 820,
  cp4y: 800,
  endX: 880,
  endY: 800,
};

const buildAperturePath = (w: WaveCoords, width = 1440, height = 800) => {
  return `M ${w.xTop.toFixed(1)} 0 C ${w.c1x.toFixed(1)} ${w.c1y.toFixed(1)}, ${w.c2x.toFixed(1)} ${w.c2y.toFixed(1)}, ${w.mx.toFixed(1)} ${w.my.toFixed(1)} C ${w.c3x.toFixed(1)} ${w.c3y.toFixed(1)}, ${w.c4x.toFixed(1)} ${w.c4y.toFixed(1)}, ${w.xBot.toFixed(1)} ${height} L ${width} ${height} L ${width} 0 Z`;
};

const buildWaveStroke = (w: WaveCoords, height = 800) => {
  return `M ${w.xTop.toFixed(1)} 0 C ${w.c1x.toFixed(1)} ${w.c1y.toFixed(1)}, ${w.c2x.toFixed(1)} ${w.c2y.toFixed(1)}, ${w.mx.toFixed(1)} ${w.my.toFixed(1)} C ${w.c3x.toFixed(1)} ${w.c3y.toFixed(1)}, ${w.c4x.toFixed(1)} ${w.c4y.toFixed(1)}, ${w.xBot.toFixed(1)} ${height}`;
};

const buildGreenBottomPath = (g: GreenBottomCoords, height = 800) => {
  return `M 0 ${height} L 0 ${g.yLeft.toFixed(1)} C ${g.cp1x.toFixed(1)} ${g.cp1y.toFixed(1)}, ${g.cp2x.toFixed(1)} ${g.cp2y.toFixed(1)}, ${g.mx.toFixed(1)} ${g.my.toFixed(1)} C ${g.cp3x.toFixed(1)} ${g.cp3y.toFixed(1)}, ${g.cp4x.toFixed(1)} ${g.cp4y.toFixed(1)}, ${g.endX.toFixed(1)} ${g.endY.toFixed(1)} L ${g.endX.toFixed(1)} ${height} Z`;
};

const buildGreenBottomStroke = (g: GreenBottomCoords) => {
  return `M 0 ${g.yLeft.toFixed(1)} C ${g.cp1x.toFixed(1)} ${g.cp1y.toFixed(1)}, ${g.cp2x.toFixed(1)} ${g.cp2y.toFixed(1)}, ${g.mx.toFixed(1)} ${g.my.toFixed(1)} C ${g.cp3x.toFixed(1)} ${g.cp3y.toFixed(1)}, ${g.cp4x.toFixed(1)} ${g.cp4y.toFixed(1)}, ${g.endX.toFixed(1)} ${g.endY.toFixed(1)}`;
};

/* ── Continuous Interpolation & Mathematical Deformation Engine ── */
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const lerpWave = (w1: WaveCoords, w2: WaveCoords, t: number): WaveCoords => ({
  xTop: lerp(w1.xTop, w2.xTop, t),
  c1x: lerp(w1.c1x, w2.c1x, t),
  c1y: lerp(w1.c1y, w2.c1y, t),
  c2x: lerp(w1.c2x, w2.c2x, t),
  c2y: lerp(w1.c2y, w2.c2y, t),
  mx: lerp(w1.mx, w2.mx, t),
  my: lerp(w1.my, w2.my, t),
  c3x: lerp(w1.c3x, w2.c3x, t),
  c3y: lerp(w1.c3y, w2.c3y, t),
  c4x: lerp(w1.c4x, w2.c4x, t),
  c4y: lerp(w1.c4y, w2.c4y, t),
  xBot: lerp(w1.xBot, w2.xBot, t),
});

const lerpGreenBottom = (g1: GreenBottomCoords, g2: GreenBottomCoords, t: number): GreenBottomCoords => ({
  yLeft: lerp(g1.yLeft, g2.yLeft, t),
  cp1x: lerp(g1.cp1x, g2.cp1x, t),
  cp1y: lerp(g1.cp1y, g2.cp1y, t),
  cp2x: lerp(g1.cp2x, g2.cp2x, t),
  cp2y: lerp(g1.cp2y, g2.cp2y, t),
  mx: lerp(g1.mx, g2.mx, t),
  my: lerp(g1.my, g2.my, t),
  cp3x: lerp(g1.cp3x, g2.cp3x, t),
  cp3y: lerp(g1.cp3y, g2.cp3y, t),
  cp4x: lerp(g1.cp4x, g2.cp4x, t),
  cp4y: lerp(g1.cp4y, g2.cp4y, t),
  endX: lerp(g1.endX, g2.endX, t),
  endY: lerp(g1.endY, g2.endY, t),
});

const sampleAperture = (p: number): WaveCoords => {
  if (p <= 0.35) {
    return lerpWave(APERTURE_STAGE_1, APERTURE_STAGE_2, p / 0.35);
  } else if (p <= 0.70) {
    return lerpWave(APERTURE_STAGE_2, APERTURE_STAGE_3, (p - 0.35) / 0.35);
  } else {
    return lerpWave(APERTURE_STAGE_3, APERTURE_STAGE_4, Math.min(1, (p - 0.70) / 0.30));
  }
};

const sampleSecondary = (p: number): WaveCoords => {
  if (p <= 0.35) {
    return lerpWave(SEC_STAGE_1, SEC_STAGE_2, p / 0.35);
  } else if (p <= 0.70) {
    return lerpWave(SEC_STAGE_2, SEC_STAGE_3, (p - 0.35) / 0.35);
  } else {
    return lerpWave(SEC_STAGE_3, SEC_STAGE_4, Math.min(1, (p - 0.70) / 0.30));
  }
};

const sampleGreenBottom = (p: number): GreenBottomCoords => {
  if (p <= 0.5) {
    return lerpGreenBottom(GREEN_BOT_STAGE_1, GREEN_BOT_STAGE_2, p / 0.5);
  } else {
    return lerpGreenBottom(GREEN_BOT_STAGE_2, GREEN_BOT_STAGE_FINAL, (p - 0.5) / 0.5);
  }
};

/* 2. Vinitha & Vivekananda Fluid Silk Veil (viewBox 0 0 1600 900) */
const buildVinithaSilkPaths = (p: number) => {
  const sweep = -600 + 2800 * Math.pow(p, 0.95);
  const wave1 = Math.sin(p * Math.PI) * 55;
  const wave2 = Math.sin(p * Math.PI * 1.5) * 40;

  const p0 = { x: sweep - 450, y: -80 };
  const p1 = { x: sweep - 120 + wave1, y: 260 };
  const p2 = { x: sweep + 180 - wave2, y: 580 };
  const p3 = { x: sweep + 520, y: 980 };

  const edgeD = `M ${p0.x.toFixed(1)} ${p0.y.toFixed(1)} C ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}, ${p3.x.toFixed(1)} ${p3.y.toFixed(1)}`;
  const fillD = `${edgeD} L 2400 980 L 2400 -80 Z`;

  const rSweep = sweep - 140;
  const rp0 = { x: rSweep - 450, y: -60 };
  const rp1 = { x: rSweep - 100 + wave1 * 0.8, y: 280 };
  const rp2 = { x: rSweep + 210 - wave2 * 0.8, y: 600 };
  const rp3 = { x: rSweep + 550, y: 980 };
  const rippleD = `M ${rp0.x.toFixed(1)} ${rp0.y.toFixed(1)} C ${rp1.x.toFixed(1)} ${rp1.y.toFixed(1)}, ${rp2.x.toFixed(1)} ${rp2.y.toFixed(1)}, ${rp3.x.toFixed(1)} ${rp3.y.toFixed(1)}`;

  return { edgeD, fillD, rippleD };
};

/* 3. Hrithika & Abhishek Diagonal Fabric Drape (viewBox 0 0 1000 1333) */
const buildHrithikaDrapePaths = (p: number) => {
  const t = Math.pow(p, 1.05);
  const pStart = {
    x: 1350 - t * 1600,
    y: -80,
  };
  const pEnd = {
    x: 1150 - t * 1400,
    y: 1450,
  };

  const wave = Math.sin(p * Math.PI) * 75;
  const c1 = {
    x: pStart.x * 0.7 + pEnd.x * 0.3 + wave,
    y: 420,
  };
  const c2 = {
    x: pStart.x * 0.3 + pEnd.x * 0.7 - wave * 0.6,
    y: 920,
  };

  const trimD = `M ${pStart.x.toFixed(1)} ${pStart.y.toFixed(1)} C ${c1.x.toFixed(1)} ${c1.y.toFixed(1)}, ${c2.x.toFixed(1)} ${c2.y.toFixed(1)}, ${pEnd.x.toFixed(1)} ${pEnd.y.toFixed(1)}`;
  const fillD = `M -60 1450 L ${pEnd.x.toFixed(1)} ${pEnd.y.toFixed(1)} C ${c2.x.toFixed(1)} ${c2.y.toFixed(1)}, ${c1.x.toFixed(1)} ${c1.y.toFixed(1)}, ${pStart.x.toFixed(1)} ${pStart.y.toFixed(1)} L -60 -80 Z`;

  const rt = Math.max(0, t - 0.08);
  const rpStart = { x: 1350 - rt * 1600, y: -80 };
  const rpEnd = { x: 1150 - rt * 1400, y: 1450 };
  const rwave = Math.sin(p * Math.PI + 0.3) * 55;
  const rc1 = { x: rpStart.x * 0.7 + rpEnd.x * 0.3 + rwave, y: 440 };
  const rc2 = { x: rpStart.x * 0.3 + rpEnd.x * 0.7 - rwave * 0.6, y: 940 };
  const rippleD = `M ${rpStart.x.toFixed(1)} ${rpStart.y.toFixed(1)} C ${rc1.x.toFixed(1)} ${rc1.y.toFixed(1)}, ${rc2.x.toFixed(1)} ${rc2.y.toFixed(1)}, ${rpEnd.x.toFixed(1)} ${rpEnd.y.toFixed(1)}`;

  return { trimD, fillD, rippleD };
};

export default function LivingContactSheet() {
  const sectionRef = useRef<HTMLElement>(null);
  const hrithikaCanvasRef = useRef<HTMLDivElement>(null);
  const karthikCanvasRef = useRef<HTMLDivElement>(null);
  const sireeshCanvasRef = useRef<HTMLDivElement>(null);

  /* Vinitha Liquid Silk Veil References */
  const vinithaSilkFillPathRef = useRef<SVGPathElement>(null);
  const vinithaSilkEdgePathRef = useRef<SVGPathElement>(null);
  const vinithaSilkRipplePathRef = useRef<SVGPathElement>(null);
  const vinithaVeilOverlayRef = useRef<HTMLDivElement>(null);
  const vinithaVeilSvgRef = useRef<SVGSVGElement>(null);

  /* Hrithika Diagonal Drape References */
  const hrithikaDrapeFillPathRef = useRef<SVGPathElement>(null);
  const hrithikaDrapeTrimPathRef = useRef<SVGPathElement>(null);
  const hrithikaDrapeRipplePathRef = useRef<SVGPathElement>(null);
  const hrithikaDrapeRef = useRef<HTMLDivElement>(null);
  const hrithikaPhotoImgRef = useRef<HTMLImageElement>(null);

  /* Karthik Painterly Brush References */
  const karthikBrushOverlayRef = useRef<HTMLDivElement>(null);
  const karthikPhotoImgRef = useRef<HTMLImageElement>(null);

  /* Sireesh Memory Reveal References */
  const sireeshImgRef = useRef<HTMLImageElement>(null);
  const sireeshSunlightRef = useRef<HTMLDivElement>(null);
  const sireeshVeilRef = useRef<HTMLDivElement>(null);
  const sireeshPetalsRef = useRef<HTMLDivElement>(null);

  /* Nishanth Liquid Wave Reveal References */
  const waveSvgRef = useRef<SVGSVGElement>(null);
  const waveCutoutMaskRef = useRef<SVGPathElement>(null);
  const wavePrimaryStrokeRef = useRef<SVGPathElement>(null);
  const wavePrimaryGlowRef = useRef<SVGPathElement>(null);
  const waveSecondaryPathRef = useRef<SVGPathElement>(null);
  const waveSecondaryStrokeRef = useRef<SVGPathElement>(null);
  const waveGreenBottomPathRef = useRef<SVGPathElement>(null);
  const waveGreenBottomStrokeRef = useRef<SVGPathElement>(null);
  const waveWatermarkRef = useRef<SVGTextElement>(null);
  const nishanthLeftControlRef = useRef<HTMLDivElement>(null);
  const nishanthRightNarrativeRef = useRef<HTMLDivElement>(null);
  
  /* Vinitha SVG Morph References */
  const vinithaPathRef = useRef<SVGPathElement>(null);
  const vinithaStageRef = useRef<HTMLDivElement>(null);
  const vinithaOverlaysRef = useRef<HTMLDivElement>(null);
  const vinithaIframeRef = useRef<HTMLDivElement>(null);
  const [vinithaVideoActive, setVinithaVideoActive] = useState(false);
  const vinithaMorphingRef = useRef(false);

  /* Nishanth SVG Morph References */
  const nishanthPathRef = useRef<SVGPathElement>(null);
  const nishanthStageRef = useRef<HTMLDivElement>(null);
  const nishanthPosterRef = useRef<HTMLImageElement>(null);
  const nishanthOverlaysRef = useRef<HTMLDivElement>(null);
  const nishanthIframeRef = useRef<HTMLDivElement>(null);
  const [nishanthVideoActive, setNishanthVideoActive] = useState(false);
  const nishanthMorphingRef = useRef(false);

  /* Curved shape normalized coordinates [0, 1] for objectBoundingBox */
  const CURVED_COORDS = {
    topY0: 0.11,
    topCp1Y: 0.18,
    topCp2Y: 0.02,
    topY1: 0.09,
    botY1: 0.89,
    botCp2Y: 0.98,
    botCp1Y: 0.80,
    botY0: 0.88,
  };

  const NISHANTH_CURVED_COORDS = {
    topY0: 0.06,
    topCp1Y: 0.01,
    topCp2Y: 0.10,
    topY1: 0.07,
    botY1: 0.95,
    botCp2Y: 0.91,
    botCp1Y: 0.98,
    botY0: 0.94,
  };

  const RECT_COORDS = {
    topY0: 0.00,
    topCp1Y: 0.00,
    topCp2Y: 0.00,
    topY1: 0.00,
    botY1: 1.00,
    botCp2Y: 1.00,
    botCp1Y: 1.00,
    botY0: 1.00,
  };

  // Helper to build SVG path data string for Vinitha
  const buildPathData = (c: typeof CURVED_COORDS) => {
    return `M 0 ${c.topY0.toFixed(4)} C 0.32 ${c.topCp1Y.toFixed(4)}, 0.68 ${c.topCp2Y.toFixed(4)}, 1 ${c.topY1.toFixed(4)} L 1 ${c.botY1.toFixed(4)} C 0.68 ${c.botCp2Y.toFixed(4)}, 0.32 ${c.botCp1Y.toFixed(4)}, 0 ${c.botY0.toFixed(4)} Z`;
  };

  // Helper to build SVG path data string for Nishanth
  const buildNishanthPathData = (c: typeof NISHANTH_CURVED_COORDS) => {
    return `M 0 ${c.topY0.toFixed(4)} C 0.35 ${c.topCp1Y.toFixed(4)}, 0.65 ${c.topCp2Y.toFixed(4)}, 1 ${c.topY1.toFixed(4)} L 1 ${c.botY1.toFixed(4)} C 0.65 ${c.botCp2Y.toFixed(4)}, 0.35 ${c.botCp1Y.toFixed(4)}, 0 ${c.botY0.toFixed(4)} Z`;
  };

  // Calculate centered 60% viewport playback dimensions (preserving 16:9)
  const getPlaybackDimensions = () => {
    if (typeof window === "undefined") return { width: 960, height: 540 };
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const isMobile = vw < 768;
    const maxW = isMobile ? vw * 0.88 : vw * 0.60;
    const maxH = isMobile ? vh * 0.58 : vh * 0.60;
    let targetW = Math.min(maxW, maxH * (16 / 9));
    if (!isMobile) targetW = Math.min(targetW, 1040);
    const targetH = targetW * (9 / 16);
    return { width: Math.round(targetW), height: Math.round(targetH) };
  };

  // Trigger Vinitha Video Morph (Curved -> Centered 60% Viewport Player)
  const openVinithaVideo = useCallback(() => {
    if (vinithaMorphingRef.current || vinithaVideoActive) return;
    vinithaMorphingRef.current = true;

    const path = vinithaPathRef.current;
    const stage = vinithaStageRef.current;
    const overlays = vinithaOverlaysRef.current;
    if (!path || !stage) {
      setVinithaVideoActive(true);
      vinithaMorphingRef.current = false;
      return;
    }

    const { width: targetW, height: targetH } = getPlaybackDimensions();
    const currentCoords = { ...CURVED_COORDS };
    const tl = gsap.timeline({
      onComplete: () => {
        setVinithaVideoActive(true);
        vinithaMorphingRef.current = false;
      },
    });

    // 1. Fade out text overlays & play beacon gracefully
    if (overlays) {
      tl.to(overlays, {
        opacity: 0,
        duration: 0.45,
        ease: "power2.out",
      }, 0);
    }

    // 2. Smoothly morph SVG clipPath from curve to flat rectangle
    tl.to(currentCoords, {
      ...RECT_COORDS,
      duration: 1.05,
      ease: "power2.inOut",
      onUpdate: () => {
        path.setAttribute("d", buildPathData(currentCoords));
      },
    }, 0);

    // 3. Smoothly animate stage dimensions and shape into centered 60% viewport frame
    tl.to(stage, {
      width: `${targetW}px`,
      height: `${targetH}px`,
      borderRadius: "12px",
      boxShadow: "0 24px 64px rgba(0, 0, 0, 0.28)",
      duration: 1.05,
      ease: "power2.inOut",
    }, 0);
  }, [vinithaVideoActive]);

  // Close Vinitha Video Morph (60% Frame -> Original Full-Bleed Curved Poster)
  const closeVinithaVideo = useCallback(() => {
    if (vinithaMorphingRef.current) return;
    vinithaMorphingRef.current = true;

    setVinithaVideoActive(false);

    const path = vinithaPathRef.current;
    const stage = vinithaStageRef.current;
    const overlays = vinithaOverlaysRef.current;
    if (!path || !stage) {
      vinithaMorphingRef.current = false;
      return;
    }

    const currentCoords = { ...RECT_COORDS };
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(stage, { clearProps: "width,height" });
        vinithaMorphingRef.current = false;
      },
    });

    // 1. Smoothly morph SVG clipPath from flat rectangle back to curve
    tl.to(currentCoords, {
      ...CURVED_COORDS,
      duration: 0.95,
      ease: "power2.inOut",
      onUpdate: () => {
        path.setAttribute("d", buildPathData(currentCoords));
      },
    }, 0);

    // 2. Animate container back to original poster dimensions
    tl.to(stage, {
      width: "100%",
      height: "",
      borderRadius: "0px",
      boxShadow: "0 24px 64px rgba(0, 0, 0, 0.18)",
      duration: 0.95,
      ease: "power2.inOut",
    }, 0);

    // 3. Fade text overlays & play beacon back in as unified single element
    if (overlays) {
      tl.to(overlays, {
        opacity: 1,
        duration: 0.55,
        ease: "power2.in",
      }, 0.45);
    }
  }, []);

  // Trigger Nishanth Video Morph (Curved -> Centered 60% Viewport Player)
  const openNishanthVideo = useCallback(() => {
    if (nishanthMorphingRef.current || nishanthVideoActive) return;
    nishanthMorphingRef.current = true;

    const path = nishanthPathRef.current;
    const stage = nishanthStageRef.current;
    const overlays = nishanthOverlaysRef.current;
    const waveSvg = waveSvgRef.current;
    if (!path || !stage) {
      setNishanthVideoActive(true);
      nishanthMorphingRef.current = false;
      return;
    }

    const { width: targetW, height: targetH } = getPlaybackDimensions();
    const currentCoords = { ...NISHANTH_CURVED_COORDS };
    const tl = gsap.timeline({
      onComplete: () => {
        setNishanthVideoActive(true);
        nishanthMorphingRef.current = false;
      },
    });

    // 1. Fade out text overlays & play beacon gracefully
    if (overlays) {
      tl.to(overlays, {
        opacity: 0,
        duration: 0.45,
        ease: "power2.out",
      }, 0);
    }
    if (waveSvg) {
      tl.to(waveSvg, {
        opacity: 0,
        duration: 0.45,
        ease: "power2.out",
      }, 0);
    }

    // 2. Smoothly morph SVG clipPath from curve to flat rectangle
    tl.to(currentCoords, {
      ...RECT_COORDS,
      duration: 1.05,
      ease: "power2.inOut",
      onUpdate: () => {
        path.setAttribute("d", buildNishanthPathData(currentCoords));
      },
    }, 0);

    // 3. Smoothly animate stage dimensions and shape into centered 60% viewport frame
    tl.to(stage, {
      width: `${targetW}px`,
      height: `${targetH}px`,
      borderRadius: "12px",
      boxShadow: "0 24px 64px rgba(0, 0, 0, 0.28)",
      duration: 1.05,
      ease: "power2.inOut",
    }, 0);
  }, [nishanthVideoActive]);

  // Close Nishanth Video Morph (60% Frame -> Original Full-Bleed Curved Poster)
  const closeNishanthVideo = useCallback(() => {
    if (nishanthMorphingRef.current) return;
    nishanthMorphingRef.current = true;

    setNishanthVideoActive(false);

    const path = nishanthPathRef.current;
    const stage = nishanthStageRef.current;
    const overlays = nishanthOverlaysRef.current;
    const waveSvg = waveSvgRef.current;
    if (!path || !stage) {
      nishanthMorphingRef.current = false;
      return;
    }

    const currentCoords = { ...RECT_COORDS };
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(stage, { clearProps: "width,height" });
        nishanthMorphingRef.current = false;
      },
    });

    // 1. Smoothly morph SVG clipPath from flat rectangle back to curve
    tl.to(currentCoords, {
      ...NISHANTH_CURVED_COORDS,
      duration: 0.95,
      ease: "power2.inOut",
      onUpdate: () => {
        path.setAttribute("d", buildNishanthPathData(currentCoords));
      },
    }, 0);

    // 2. Animate container back to original poster dimensions
    tl.to(stage, {
      width: "100%",
      height: "",
      borderRadius: "0px",
      boxShadow: "0 24px 64px rgba(0, 0, 0, 0.18)",
      duration: 0.95,
      ease: "power2.inOut",
    }, 0);

    // 3. Fade text overlays & play beacon back in as unified single element
    if (overlays) {
      tl.to(overlays, {
        opacity: 1,
        duration: 0.55,
        ease: "power2.in",
      }, 0.45);
    }
    if (waveSvg) {
      tl.to(waveSvg, {
        opacity: 1,
        duration: 0.55,
        ease: "power2.in",
      }, 0.45);
    }
  }, []);

  /* GSAP scroll-triggered entrance animations */
  useEffect(() => {
    const isReduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReduced) return;

    const ctx = gsap.context(() => {
      // 1. The Vows opening composition is seamlessly orchestrated via HeroLogoTransition
      // 2. Cinema Passage 01 — Vinitha & Vivekananda: Fluid Champagne Silk Veil (Continuous Viewport-Scrubbed)
      if (vinithaStageRef.current) {
        const vinithaProxy = { val: 0 };
        const vinithaImg = vinithaStageRef.current.querySelector<HTMLImageElement>(`.${styles.curvedPosterImg}`);
        const narrativeItems = vinithaStageRef.current.querySelectorAll<HTMLElement>(`.${styles.filmNarrativeSide} > *`);
        const playBeacon = vinithaStageRef.current.querySelector<HTMLElement>(`.${styles.filmPlaySide}`);

        const renderVinitha = (p: number) => {
          const { edgeD, fillD, rippleD } = buildVinithaSilkPaths(p);
          if (vinithaSilkFillPathRef.current) {
            vinithaSilkFillPathRef.current.setAttribute("d", fillD);
          }
          if (vinithaSilkEdgePathRef.current) {
            vinithaSilkEdgePathRef.current.setAttribute("d", edgeD);
            vinithaSilkEdgePathRef.current.style.opacity = p > 0.85 ? `${Math.max(0, 1 - (p - 0.85) / 0.15)}` : "1";
          }
          if (vinithaSilkRipplePathRef.current) {
            vinithaSilkRipplePathRef.current.setAttribute("d", rippleD);
            vinithaSilkRipplePathRef.current.style.opacity = p > 0.85 ? `${Math.max(0, 1 - (p - 0.85) / 0.15)}` : "0.75";
          }
          if (vinithaVeilOverlayRef.current) {
            const op = p > 0.85 ? Math.max(0, 1 - (p - 0.85) / 0.15) : 1;
            vinithaVeilOverlayRef.current.style.opacity = `${op}`;
            vinithaVeilOverlayRef.current.style.display = op <= 0.005 ? "none" : "block";
          }
          if (vinithaImg) {
            if (p >= 0.98) {
              vinithaImg.style.filter = "none";
              vinithaImg.style.transform = "none";
            } else {
              const blur = Math.max(0, (1 - p) * 6);
              const bright = 0.65 + p * 0.35;
              const scale = 1.06 - p * 0.06;
              vinithaImg.style.filter = `blur(${blur.toFixed(1)}px) brightness(${bright.toFixed(2)})`;
              vinithaImg.style.transform = `scale(${scale.toFixed(3)})`;
            }
          }
          if (narrativeItems.length) {
            const textP = Math.max(0, Math.min(1, (p - 0.48) / 0.45));
            narrativeItems.forEach((item, idx) => {
              const itemP = Math.max(0, Math.min(1, (textP - idx * 0.08) / 0.7));
              item.style.opacity = `${itemP}`;
              item.style.transform = `translateY(${(14 * (1 - itemP)).toFixed(1)}px)`;
            });
          }
          if (playBeacon) {
            const playP = Math.max(0, Math.min(1, (p - 0.58) / 0.35));
            playBeacon.style.opacity = `${playP}`;
            playBeacon.style.transform = `scale(${0.85 + playP * 0.15})`;
          }
        };

        renderVinitha(0);

        gsap.to(vinithaProxy, {
          val: 1,
          ease: "none",
          scrollTrigger: {
            trigger: vinithaStageRef.current,
            start: "top 88%",
            end: "center 50%",
            scrub: 0.5,
            onUpdate: () => renderVinitha(vinithaProxy.val),
          },
        });
      }

      // 3. Featured Story 03 — Hrithika & Abhishek: Continuous Flowing Diagonal Silk Drape
      if (hrithikaCanvasRef.current) {
        const hrithikaProxy = { val: 0 };
        const renderHrithika = (p: number) => {
          const { trimD, fillD, rippleD } = buildHrithikaDrapePaths(p);
          if (hrithikaDrapeFillPathRef.current) {
            hrithikaDrapeFillPathRef.current.setAttribute("d", fillD);
          }
          if (hrithikaDrapeTrimPathRef.current) {
            hrithikaDrapeTrimPathRef.current.setAttribute("d", trimD);
            hrithikaDrapeTrimPathRef.current.style.opacity = p > 0.85 ? `${Math.max(0, 1 - (p - 0.85) / 0.15)}` : "1";
          }
          if (hrithikaDrapeRipplePathRef.current) {
            hrithikaDrapeRipplePathRef.current.setAttribute("d", rippleD);
            hrithikaDrapeRipplePathRef.current.style.opacity = p > 0.85 ? `${Math.max(0, 1 - (p - 0.85) / 0.15)}` : "0.7";
          }
          if (hrithikaDrapeRef.current) {
            const op = p > 0.85 ? Math.max(0, 1 - (p - 0.85) / 0.15) : 1;
            hrithikaDrapeRef.current.style.opacity = `${op}`;
            hrithikaDrapeRef.current.style.display = op <= 0.005 ? "none" : "block";
          }
          if (hrithikaPhotoImgRef.current) {
            if (p >= 0.98) {
              hrithikaPhotoImgRef.current.style.filter = "none";
              hrithikaPhotoImgRef.current.style.transform = "none";
            } else {
              const blur = Math.max(0, (1 - p) * 3);
              const bright = 0.8 + p * 0.2;
              const scale = 1.06 - p * 0.06;
              hrithikaPhotoImgRef.current.style.filter = `blur(${blur.toFixed(1)}px) brightness(${bright.toFixed(2)})`;
              hrithikaPhotoImgRef.current.style.transform = `scale(${scale.toFixed(3)})`;
            }
          }
        };

        renderHrithika(0);

        gsap.to(hrithikaProxy, {
          val: 1,
          ease: "none",
          scrollTrigger: {
            trigger: hrithikaCanvasRef.current,
            start: "top 88%",
            end: "center 50%",
            scrub: 0.5,
            onUpdate: () => renderHrithika(hrithikaProxy.val),
          },
        });
      }

      // 4. Featured Story 04 — Karthik & Gayathri: Painterly Brush Reveal (Top-Right towards Center)
      if (karthikCanvasRef.current) {
        const karthikTl = gsap.timeline({
          scrollTrigger: {
            trigger: karthikCanvasRef.current,
            start: "top 88%",
            once: true,
          },
          onComplete: () => {
            if (karthikBrushOverlayRef.current) karthikBrushOverlayRef.current.style.display = "none";
            if (karthikPhotoImgRef.current) {
              karthikPhotoImgRef.current.style.filter = "none";
              karthikPhotoImgRef.current.style.transform = "none";
            }
          },
        });

        if (karthikPhotoImgRef.current) {
          karthikTl.fromTo(
            karthikPhotoImgRef.current,
            { scale: 1.05, filter: "blur(2px) brightness(0.95)" },
            { scale: 1.0, filter: "blur(0px) brightness(1.0)", duration: 0.55, ease: "power2.out" },
            0.05
          );
        }

        // Diagonal brush strokes sweep from top-right towards center
        if (karthikBrushOverlayRef.current) {
          karthikTl.fromTo(
            karthikBrushOverlayRef.current,
            { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", opacity: 1 },
            { clipPath: "polygon(0 0, 46% 0, 100% 48%, 100% 100%, 0 100%)", duration: 0.22, ease: "power2.out" },
            0.02
          );
          karthikTl.to(
            karthikBrushOverlayRef.current,
            { clipPath: "polygon(0 0, 0% 32%, 58% 85%, 100% 100%, 0 100%)", duration: 0.22, ease: "power2.inOut" },
            0.20
          );
          karthikTl.to(
            karthikBrushOverlayRef.current,
            { clipPath: "polygon(0 80%, 20% 100%, 0 100%)", duration: 0.18, ease: "power2.out" },
            0.40
          );
          karthikTl.to(
            karthikBrushOverlayRef.current,
            { opacity: 0, duration: 0.15, ease: "power1.out" },
            0.55
          );
        }
      }

      // 5. Featured Story 05 — Sireesh & Harshitha: Soft-Focus Memory Reveal (6 Stages)
      if (sireeshCanvasRef.current) {
        const sireeshTl = gsap.timeline({
          scrollTrigger: {
            trigger: sireeshCanvasRef.current,
            start: "top 88%",
            once: true,
          },
          onComplete: () => {
            if (sireeshImgRef.current) {
              sireeshImgRef.current.style.filter = "none";
              sireeshImgRef.current.style.transform = "none";
            }
            if (sireeshSunlightRef.current) sireeshSunlightRef.current.style.display = "none";
            if (sireeshVeilRef.current) sireeshVeilRef.current.style.display = "none";
            if (sireeshPetalsRef.current) sireeshPetalsRef.current.style.display = "none";
          },
        });

        // Stage 01 - 04: Focus pull from soft dreamlike impression to crisp image
        if (sireeshImgRef.current) {
          sireeshTl.fromTo(
            sireeshImgRef.current,
            { filter: "blur(10px) brightness(1.08)", scale: 1.05 },
            { filter: "blur(3px) brightness(1.03)", scale: 1.02, duration: 0.40, ease: "power2.out" },
            0.02
          );
          sireeshTl.to(
            sireeshImgRef.current,
            { filter: "blur(0px) brightness(1.0)", scale: 1.0, duration: 0.30, ease: "power1.out" },
            0.42
          );
        }

        // Stage 02: Ribbon of golden sunlight sweeps across from top-left
        if (sireeshSunlightRef.current) {
          sireeshTl.fromTo(
            sireeshSunlightRef.current,
            { x: "-60%", y: "-50%", opacity: 0 },
            { x: "-10%", y: "-10%", opacity: 0.85, duration: 0.40, ease: "power2.out" },
            0.02
          );
          sireeshTl.to(
            sireeshSunlightRef.current,
            { x: "35%", y: "25%", opacity: 0, duration: 0.35, ease: "power2.in" },
            0.42
          );
        }

        // Stage 03 - 04: Breeze veil flows diagonally across
        if (sireeshVeilRef.current) {
          sireeshTl.fromTo(
            sireeshVeilRef.current,
            { x: "-40%", y: "-35%", opacity: 0 },
            { x: "15%", y: "15%", opacity: 0.65, duration: 0.40, ease: "power2.inOut" },
            0.12
          );
          sireeshTl.to(
            sireeshVeilRef.current,
            { x: "65%", y: "55%", opacity: 0, duration: 0.30, ease: "power2.in" },
            0.48
          );
        }

        // Stage 05: Subtle drifting rose/bougainvillea petals
        if (sireeshPetalsRef.current) {
          const petals = sireeshPetalsRef.current.querySelectorAll(`.${styles.petal}`);
          if (petals.length) {
            sireeshTl.fromTo(
              petals,
              { opacity: 0, y: -25, x: -18, rotate: -30 },
              { opacity: 0.85, y: 30, x: 20, rotate: 45, duration: 0.45, stagger: 0.04, ease: "sine.inOut" },
              0.25
            );
            sireeshTl.to(
              petals,
              { opacity: 0, y: 65, x: 45, rotate: 95, duration: 0.25, stagger: 0.03, ease: "power1.in" },
              0.62
            );
          }
        }
      }

      // 6. Animate general narrative text blocks
      const textBlocks = gsap.utils.toArray<HTMLElement>(`.${styles.duoContentSide}, .${styles.sireeshContentCol}`);
      textBlocks.forEach((block) => {
        gsap.fromTo(
          block,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: "power2.out",
            scrollTrigger: {
              trigger: block,
              start: "top 88%",
              once: true,
            },
          }
        );
      });

      // ══════════════════════════════════════════════════════════════════════
      // NISHANTH & SANZENA: CINEMATIC LIQUID WAVE REVEAL (Continuous Viewport-Scrubbed)
      // ══════════════════════════════════════════════════════════════════════
      if (nishanthStageRef.current) {
        const nishanthProxy = { val: 0 };
        const narrativeItems = nishanthStageRef.current.querySelectorAll<HTMLElement>(
          `.${styles.nishanthRightNarrative} > *`
        );

        const renderNishanth = (p: number) => {
          const ap = sampleAperture(p);
          const sec = sampleSecondary(p);
          const greenBot = sampleGreenBottom(p);

          const apPath = buildAperturePath(ap);
          const apStroke = buildWaveStroke(ap);
          const secPath = buildAperturePath(sec);
          const secStroke = buildWaveStroke(sec);
          const greenPath = buildGreenBottomPath(greenBot);
          const greenStroke = buildGreenBottomStroke(greenBot);

          if (waveCutoutMaskRef.current) {
            waveCutoutMaskRef.current.setAttribute("d", apPath);
          }
          if (wavePrimaryStrokeRef.current) {
            wavePrimaryStrokeRef.current.setAttribute("d", apStroke);
            wavePrimaryStrokeRef.current.style.opacity = p > 0.75 ? `${Math.max(0, 1 - (p - 0.75) / 0.25)}` : "1";
          }
          if (wavePrimaryGlowRef.current) {
            wavePrimaryGlowRef.current.setAttribute("d", apStroke);
            wavePrimaryGlowRef.current.style.opacity = p > 0.75 ? `${Math.max(0, 1 - (p - 0.75) / 0.25) * 0.85}` : "0.85";
          }
          if (waveSecondaryPathRef.current) {
            waveSecondaryPathRef.current.setAttribute("d", secPath);
          }
          if (waveSecondaryStrokeRef.current) {
            waveSecondaryStrokeRef.current.setAttribute("d", secStroke);
            waveSecondaryStrokeRef.current.style.opacity = p > 0.75 ? `${Math.max(0, 1 - (p - 0.75) / 0.25) * 0.7}` : "0.7";
          }
          if (waveGreenBottomPathRef.current) {
            waveGreenBottomPathRef.current.setAttribute("d", greenPath);
            waveGreenBottomPathRef.current.style.opacity = p > 0.70 ? `${Math.max(0, 1 - (p - 0.70) / 0.30)}` : "1";
          }
          if (waveGreenBottomStrokeRef.current) {
            waveGreenBottomStrokeRef.current.setAttribute("d", greenStroke);
            waveGreenBottomStrokeRef.current.style.opacity = p > 0.70 ? `${Math.max(0, 1 - (p - 0.70) / 0.30) * 0.85}` : "0.85";
          }
          if (waveWatermarkRef.current) {
            waveWatermarkRef.current.style.opacity = `${Math.max(0, 0.24 * (1 - p / 0.75))}`;
          }
          if (waveSvgRef.current) {
            if (p >= 0.98) {
              waveSvgRef.current.style.display = "none";
            } else {
              waveSvgRef.current.style.display = "block";
              waveSvgRef.current.style.opacity = p > 0.85 ? `${Math.max(0, 1 - (p - 0.85) / 0.15)}` : "1";
            }
          }
          if (nishanthLeftControlRef.current) {
            const ctrlP = Math.max(0, Math.min(1, (p - 0.62) / 0.35));
            nishanthLeftControlRef.current.style.opacity = `${ctrlP}`;
            nishanthLeftControlRef.current.style.transform = `translateY(${(18 * (1 - ctrlP)).toFixed(1)}px)`;
          }
          if (narrativeItems.length) {
            const textP = Math.max(0, Math.min(1, (p - 0.65) / 0.32));
            narrativeItems.forEach((item, idx) => {
              const itemP = Math.max(0, Math.min(1, (textP - idx * 0.08) / 0.7));
              item.style.opacity = `${itemP}`;
              item.style.transform = `translateY(${(18 * (1 - itemP)).toFixed(1)}px)`;
            });
          }
        };

        renderNishanth(0);

        gsap.to(nishanthProxy, {
          val: 1,
          ease: "none",
          scrollTrigger: {
            trigger: nishanthStageRef.current,
            start: "top 88%",
            end: "center 50%",
            scrub: 0.5,
            onUpdate: () => renderNishanth(nishanthProxy.val),
          },
        });
      }


    }, sectionRef);

    return () => ctx.revert();
  }, []);

  /* Recalculate target playback frame on viewport resize */
  useEffect(() => {
    const handleResize = () => {
      const dims = getPlaybackDimensions();
      if (vinithaVideoActive && vinithaStageRef.current) {
        gsap.to(vinithaStageRef.current, {
          width: `${dims.width}px`,
          height: `${dims.height}px`,
          duration: 0.2,
          ease: "power1.out",
        });
      }
      if (nishanthVideoActive && nishanthStageRef.current) {
        gsap.to(nishanthStageRef.current, {
          width: `${dims.width}px`,
          height: `${dims.height}px`,
          duration: 0.2,
          ease: "power1.out",
        });
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [vinithaVideoActive, nishanthVideoActive]);

  /* Escape key closes inline video players */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (vinithaVideoActive) closeVinithaVideo();
        if (nishanthVideoActive) closeNishanthVideo();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [vinithaVideoActive, nishanthVideoActive, closeVinithaVideo, closeNishanthVideo]);

  return (
    <section
      ref={sectionRef}
      id="vows"
      className={styles.section}
      aria-label="The Vows"
    >
      {/* ── Hidden SVG Definition for Smooth Mathematical Path Morphing ── */}
      <svg
        className={styles.svgClipDefs}
        width="1"
        height="1"
        viewBox="0 0 1 1"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          {/* Authentic South Indian Mandapam Cusped Torana Arch Silhouette: Derived directly from mandapp.png */}
          <clipPath id="mandapamArchClip" clipPathUnits="objectBoundingBox">
            <path
              d="M 0 1 L 0 0.32 C 0 0.24, 0.08 0.24, 0.14 0.20 C 0.18 0.17, 0.24 0.18, 0.28 0.14 C 0.33 0.09, 0.40 0.08, 0.46 0.03 C 0.48 0.01, 0.49 0.00, 0.50 0.00 C 0.51 0.00, 0.52 0.01, 0.54 0.03 C 0.60 0.08, 0.67 0.09, 0.72 0.14 C 0.76 0.18, 0.82 0.17, 0.86 0.20 C 0.92 0.24, 1.00 0.24, 1.00 0.32 L 1 1 Z"
            />
          </clipPath>
          {/* Backward-compatible alias */}
          <clipPath id="palaceArchClip" clipPathUnits="objectBoundingBox">
            <path
              d="M 0 1 L 0 0.32 C 0 0.24, 0.08 0.24, 0.14 0.20 C 0.18 0.17, 0.24 0.18, 0.28 0.14 C 0.33 0.09, 0.40 0.08, 0.46 0.03 C 0.48 0.01, 0.49 0.00, 0.50 0.00 C 0.51 0.00, 0.52 0.01, 0.54 0.03 C 0.60 0.08, 0.67 0.09, 0.72 0.14 C 0.76 0.18, 0.82 0.17, 0.86 0.20 C 0.92 0.24, 1.00 0.24, 1.00 0.32 L 1 1 Z"
            />
          </clipPath>
          <clipPath id="vinithaMorphClip" clipPathUnits="objectBoundingBox">
            <path
              ref={vinithaPathRef}
              d="M 0 0.11 C 0.32 0.18, 0.68 0.02, 1 0.09 L 1 0.89 C 0.68 0.98, 0.32 0.80, 0 0.88 Z"
            />
          </clipPath>
          <clipPath id="nishanthMorphClip" clipPathUnits="objectBoundingBox">
            <path
              ref={nishanthPathRef}
              d="M 0 0.06 C 0.35 0.01, 0.65 0.10, 1 0.07 L 1 0.95 C 0.65 0.91, 0.35 0.98, 0 0.94 Z"
            />
          </clipPath>
        </defs>
      </svg>

      <div className={styles.mainContainer}>
        {/* Curated Exhibition Anchors */}
        <div id="exhibition" className={styles.anchorOffset} aria-hidden="true" />
        <div id="stories-showcase" className={styles.anchorOffset} aria-hidden="true" />
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          02 — VINITHA & VIVEKANANDA: FULL-BLEED CURVED CINEMA SECTION
      ══════════════════════════════════════════════════════════════════════ */}
      <div className={`${styles.editorialBlock} ${styles.fullBleedFilmBlock} ${styles.vinithaSectionBlock}`}>
        <div
          ref={vinithaStageRef}
          className={`${styles.curvedPanelStage} ${
            vinithaVideoActive ? styles.curvedPanelStageActive : ""
          }`}
        >
          {/* Background Poster Image */}
          <picture>
            <source srcSet={ITEM_VIDEO_01.webpPoster} type="image/webp" />
            <img
              src={ITEM_VIDEO_01.poster}
              alt={ITEM_VIDEO_01.filmTitle}
              className={styles.curvedPosterImg}
              loading="lazy"
            />
          </picture>

          {/* Gradient Scrim for Film Typography Legibility */}
          <div className={styles.filmGradientScrim} />

          {/* Liquid Silk Veil Overlay Layer */}
          <div ref={vinithaVeilOverlayRef} className={styles.vinithaVeilOverlay} aria-hidden="true">
            <svg
              ref={vinithaVeilSvgRef}
              className={styles.vinithaVeilSvg}
              viewBox="0 0 1600 900"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="champagneSilkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F5ECE1" stopOpacity="0.88" />
                  <stop offset="35%" stopColor="#DFC89A" stopOpacity="0.82" />
                  <stop offset="70%" stopColor="#B39356" stopOpacity="0.75" />
                  <stop offset="100%" stopColor="#EAD8B5" stopOpacity="0.9" />
                </linearGradient>
                <linearGradient id="silkEdgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.9" />
                  <stop offset="50%" stopColor="#FFF2D6" stopOpacity="1" />
                  <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.85" />
                </linearGradient>
              </defs>
              {/* Primary Silk Veil Fill */}
              <path
                ref={vinithaSilkFillPathRef}
                fill="url(#champagneSilkGrad)"
              />
              {/* Primary Silk Gold Hem */}
              <path
                ref={vinithaSilkEdgePathRef}
                fill="none"
                stroke="url(#silkEdgeGrad)"
                strokeWidth="2.8"
                filter="drop-shadow(0 4px 14px rgba(212, 175, 55, 0.4))"
              />
              {/* Secondary Flowing Ripple */}
              <path
                ref={vinithaSilkRipplePathRef}
                fill="none"
                stroke="rgba(255, 245, 220, 0.75)"
                strokeWidth="1.8"
              />
            </svg>
          </div>

          {/* Overlay Elements (Fade out when morphing to video) */}
          <div ref={vinithaOverlaysRef} className={styles.filmOverlaysLayer}>
            <div className={styles.filmOverlaysInnerContainer}>
              <div className={styles.filmNarrativeSide}>
                <span className={styles.filmIndexLabel}>01 —— WEDDING FILM</span>
                <h3 className={styles.filmHeading}>{ITEM_VIDEO_01.filmTitle}</h3>
                <p className={styles.filmExcerpt}>{ITEM_VIDEO_01.description}</p>
                <button
                  type="button"
                  className={styles.btnWatchFilmText}
                  onClick={openVinithaVideo}
                  aria-label={`Watch cinema film: ${ITEM_VIDEO_01.filmTitle}`}
                >
                  WATCH FILM <span className={styles.actionArrow}>——→</span>
                </button>
              </div>

              <div className={styles.filmPlaySide}>
                <button
                  type="button"
                  className={styles.circularPlayBeacon}
                  onClick={openVinithaVideo}
                  aria-label="Play Vinitha & Vivekananda wedding film"
                >
                  <svg className={styles.playBeaconIcon} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Embedded Cinema Player (Revealed upon morph completion) */}
          {vinithaVideoActive && (
            <div ref={vinithaIframeRef} className={styles.embeddedPlayerStage}>
              <iframe
                src={ITEM_VIDEO_01.embedUrl}
                title={ITEM_VIDEO_01.filmTitle}
                className={styles.cinemaIframe}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
              <button
                type="button"
                className={styles.btnCloseCinema}
                onClick={closeVinithaVideo}
                aria-label="Close cinema film player"
              >
                ✕ Close Film
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          SUPPORTING STORIES GRID (RESTRICTED TO EDITORIAL CONTAINER)
      ══════════════════════════════════════════════════════════════════════ */}
      <div className={styles.mainContainer}>
        {/* 03 — HRITHIKA & ABHISHEK (PHOTO ON LEFT, TEXT ON RIGHT) */}
        <div className={`${styles.editorialBlock} ${styles.duoSpreadBlock}`}>
          <div className={styles.duoGridHrithika}>
            {/* LEFT: Photograph */}
            <div className={styles.duoVisualSide}>
              <Link
                href={ITEM_PROJECT_03.storyUrl}
                className={styles.cardImageLink}
                aria-label={`Open story: ${ITEM_PROJECT_03.clientNames}`}
              >
                <div
                  ref={hrithikaCanvasRef}
                  className={styles.roundedImageCanvas}
                  style={{ aspectRatio: ITEM_PROJECT_03.aspectRatio }}
                >
                  <picture>
                    <source srcSet={ITEM_PROJECT_03.webpImage} type="image/webp" />
                    <img
                      ref={hrithikaPhotoImgRef}
                      src={ITEM_PROJECT_03.image}
                      alt={ITEM_PROJECT_03.clientNames}
                      className={styles.storyCoverImg}
                      style={{ objectPosition: ITEM_PROJECT_03.objectPosition }}
                      loading="lazy"
                    />
                  </picture>
                  <div className={styles.imageHoverShimmer} />

                  {/* Continuous Diagonal Silk Drape Reveal (Top-Right to Bottom-Left) */}
                  <div ref={hrithikaDrapeRef} className={styles.fabricDrapeOverlay}>
                    <svg
                      className={styles.hrithikaDrapeSvg}
                      viewBox="0 0 1000 1333"
                      preserveAspectRatio="none"
                      aria-hidden="true"
                    >
                      <defs>
                        <linearGradient id="hrithikaDrapeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#F7F0E6" />
                          <stop offset="35%" stopColor="#E9DEBF" />
                          <stop offset="70%" stopColor="#D5C49C" />
                          <stop offset="100%" stopColor="#BEAC82" />
                        </linearGradient>
                        <linearGradient id="hrithikaTrimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#FFF2D6" />
                          <stop offset="50%" stopColor="#D4AF37" />
                          <stop offset="100%" stopColor="#AA8222" />
                        </linearGradient>
                      </defs>
                      <path
                        ref={hrithikaDrapeFillPathRef}
                        fill="url(#hrithikaDrapeGrad)"
                      />
                      <path
                        ref={hrithikaDrapeTrimPathRef}
                        fill="none"
                        stroke="url(#hrithikaTrimGrad)"
                        strokeWidth="3.2"
                      />
                      <path
                        ref={hrithikaDrapeRipplePathRef}
                        fill="none"
                        stroke="rgba(255, 255, 255, 0.55)"
                        strokeWidth="1.8"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            </div>

            {/* RIGHT: Text and Story Details */}
            <div className={styles.duoContentSide}>
              <span className={styles.storySerialTag}>{ITEM_PROJECT_03.categoryLabel}</span>
              <h4 className={styles.storyTitleLarge}>
                <Link href={ITEM_PROJECT_03.storyUrl} className={styles.nameLink}>
                  {ITEM_PROJECT_03.clientNames}
                </Link>
              </h4>
              <p className={styles.storyDescription}>{ITEM_PROJECT_03.narrative}</p>
              <Link href={ITEM_PROJECT_03.storyUrl} className={styles.btnViewStoryText}>
                VIEW STORY <span className={styles.actionArrow}>——→</span>
              </Link>

              {/* Delicate handwritten accent floating beside */}
              <div className={styles.floatingCursiveAccent} aria-hidden="true">
                and somehow,
                <br />
                time stood still
              </div>
            </div>
          </div>
        </div>

        {/* Narrative Cursive Bridge Line */}
        <div className={styles.cursiveBridge} aria-hidden="true">
          Where two journeys became one unbroken legacy.
        </div>

        {/* 04 — KARTHIK & GAYATRI (TEXT ON LEFT, PHOTO ON RIGHT) */}
        <div className={`${styles.editorialBlock} ${styles.duoSpreadBlock}`}>
          <div className={styles.duoGridKarthik}>
            {/* LEFT: Text and Story Details */}
            <div className={styles.duoContentSide}>
              <span className={styles.storySerialTag}>{ITEM_PROJECT_04.categoryLabel}</span>
              <h4 className={styles.storyTitleLarge}>
                <Link href={ITEM_PROJECT_04.storyUrl} className={styles.nameLink}>
                  {ITEM_PROJECT_04.clientNames}
                </Link>
              </h4>
              <p className={styles.storyDescription}>{ITEM_PROJECT_04.narrative}</p>
              <Link href={ITEM_PROJECT_04.storyUrl} className={styles.btnViewStoryText}>
                VIEW STORY <span className={styles.actionArrow}>——→</span>
              </Link>
            </div>

            {/* RIGHT: Photograph */}
            <div className={styles.duoVisualSide}>
              <Link
                href={ITEM_PROJECT_04.storyUrl}
                className={styles.cardImageLink}
                aria-label={`Open story: ${ITEM_PROJECT_04.clientNames}`}
              >
                <div
                  ref={karthikCanvasRef}
                  className={styles.roundedImageCanvas}
                  style={{ aspectRatio: ITEM_PROJECT_04.aspectRatio }}
                >
                  <picture>
                    <source srcSet={ITEM_PROJECT_04.webpImage} type="image/webp" />
                    <img
                      ref={karthikPhotoImgRef}
                      src={ITEM_PROJECT_04.image}
                      alt={ITEM_PROJECT_04.clientNames}
                      className={styles.storyCoverImg}
                      style={{ objectPosition: ITEM_PROJECT_04.objectPosition }}
                      loading="lazy"
                    />
                  </picture>
                  <div className={styles.imageHoverShimmer} />

                  {/* Living Painterly Brush Reveal (Top-Right towards Center) */}
                  <div ref={karthikBrushOverlayRef} className={styles.painterlyBrushOverlay}>
                    <svg
                      className={styles.painterlyBrushSvg}
                      viewBox="0 0 1000 625"
                      preserveAspectRatio="none"
                      aria-hidden="true"
                    >
                      <defs>
                        <linearGradient id="brushIvoryGrad" x1="100%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#FAF8F5" />
                          <stop offset="60%" stopColor="#EAE5DC" />
                          <stop offset="100%" stopColor="#09453E" stopOpacity="0.15" />
                        </linearGradient>
                      </defs>
                      {/* Painterly brush strokes sweeping diagonally from top-right towards center */}
                      <path
                        d="M 1050 -60 Q 750 180, 360 480 Q 280 540, 180 580"
                        fill="none"
                        stroke="url(#brushIvoryGrad)"
                        strokeWidth="260"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 1120 120 Q 820 320, 480 560"
                        fill="none"
                        stroke="#FAF8F5"
                        strokeWidth="220"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Narrative Cursive Bridge Line */}
        <div className={styles.cursiveBridge} aria-hidden="true">
          In the sacred flame, promises made to outlive generations.
        </div>

        {/* 05 — SIREESH & HARSHITHA (ASYMMETRIC EDITORIAL STILLS COMPOSITION) */}
        <div className={`${styles.editorialBlock} ${styles.layeredSireeshBlock}`}>
          <div className={styles.layeredGrid}>
            {/* Left: Sacred Wedding Couple Walking on Tree-Lined Pathway */}
            <div className={styles.layeredPortraitCol}>
              <Link
                href={ITEM_PROJECT_02.storyUrl}
                className={styles.cardImageLink}
                aria-label={`Open traditional wedding: ${ITEM_PROJECT_02.clientNames}`}
              >
                <div ref={sireeshCanvasRef} className={styles.tallPortraitCanvas}>
                  <picture>
                    <source srcSet={ITEM_PROJECT_02.webpImage} type="image/webp" />
                    <img
                      ref={sireeshImgRef}
                      src={ITEM_PROJECT_02.image}
                      alt={ITEM_PROJECT_02.clientNames}
                      className={styles.storyCoverImg}
                      style={{ objectPosition: ITEM_PROJECT_02.objectPosition }}
                      loading="lazy"
                    />
                  </picture>
                  <div className={styles.imageHoverShimmer} />

                  {/* Soft-Focus Memory Reveal Layers */}
                  <div ref={sireeshSunlightRef} className={styles.memorySunlightBeam} />
                  <div ref={sireeshVeilRef} className={styles.memoryBreezeVeil} />
                  <div ref={sireeshPetalsRef} className={styles.memoryPetalsGroup}>
                    <span className={`${styles.petal} ${styles.petal1}`} />
                    <span className={`${styles.petal} ${styles.petal2}`} />
                    <span className={`${styles.petal} ${styles.petal3}`} />
                    <span className={`${styles.petal} ${styles.petal4}`} />
                    <span className={`${styles.petal} ${styles.petal5}`} />
                  </div>
                </div>
              </Link>
            </div>

            {/* Right: Editorial Narrative Details (Rebalanced layout with wide image removed) */}
            <div className={styles.sireeshContentCol}>
              <span className={styles.storySerialTag}>{ITEM_PROJECT_02.categoryLabel}</span>
              <h4 className={styles.storyTitleLarge}>
                <Link href={ITEM_PROJECT_02.storyUrl} className={styles.nameLink}>
                  {ITEM_PROJECT_02.clientNames}
                </Link>
              </h4>
              <p className={styles.storyDescription}>{ITEM_PROJECT_02.narrative}</p>
              <Link href={ITEM_PROJECT_02.storyUrl} className={styles.btnViewStoryText}>
                VIEW STORY <span className={styles.actionArrow}>——→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          06 — NISHANTH X SANZENA: FULL-BLEED CINEMATIC CLOSING WITH GSAP MORPH
      ══════════════════════════════════════════════════════════════════════ */}
      <div className={`${styles.editorialBlock} ${styles.fullBleedFilmBlock} ${styles.nishanthClosingBlock}`}>
        <div
          ref={nishanthStageRef}
          className={`${styles.nishanthCurvedStage} ${
            nishanthVideoActive ? styles.nishanthCurvedStageActive : ""
          }`}
        >
          {/* Sunset Mountain Landscape Poster */}
          <picture>
            <source srcSet={ITEM_VIDEO_02.webpPoster} type="image/webp" />
            <img
              ref={nishanthPosterRef}
              src={ITEM_VIDEO_02.poster}
              alt={ITEM_VIDEO_02.filmTitle}
              className={styles.nishanthPosterImg}
              loading="lazy"
            />
          </picture>

          {/* Gradient Scrim */}
          <div className={styles.nishanthGradientScrim} />

          {/* Nishanth & Sanzena: Cinematic Liquid Wave Reveal SVG Layer */}
          <svg
            ref={waveSvgRef}
            className={styles.nishanthWaveRevealSvg}
            viewBox="0 0 1440 800"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="champagneGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E5D192" stopOpacity="0.95" />
                <stop offset="50%" stopColor="#C8A84E" stopOpacity="1" />
                <stop offset="100%" stopColor="#9E7E32" stopOpacity="0.9" />
              </linearGradient>

              <linearGradient id="champagneAuraGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#F5EFE0" stopOpacity="0" />
                <stop offset="40%" stopColor="#DFC882" stopOpacity="0.3" />
                <stop offset="70%" stopColor="#C8A84E" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
              </linearGradient>

              <linearGradient id="ivorySilkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F9F7F1" />
                <stop offset="50%" stopColor="#F4EFE6" />
                <stop offset="100%" stopColor="#E9E2D2" />
              </linearGradient>

              <linearGradient id="deepGreenWaveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0B1511" stopOpacity="0.98" />
                <stop offset="60%" stopColor="#0E1B15" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#07100D" stopOpacity="1" />
              </linearGradient>

              <filter id="champagneGlowFilter" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>

              <mask id="nishanthWaveCoverMask">
                <rect x="0" y="0" width="1440" height="800" fill="#FFFFFF" />
                <path
                  ref={waveCutoutMaskRef}
                  d={buildAperturePath(APERTURE_STAGE_1)}
                  fill="#000000"
                />
              </mask>
            </defs>

            {/* Wave Cover Group (Masked by waveCutoutMask) */}
            <g mask="url(#nishanthWaveCoverMask)">
              <rect x="0" y="0" width="1440" height="800" fill="url(#ivorySilkGrad)" />

              {/* Watermark Typography visible on ivory layer in Stage 1 and settling gracefully */}
              <g className={styles.waveWatermarkGroup}>
                <text
                  ref={waveWatermarkRef}
                  x="80"
                  y="290"
                  className={styles.waveWatermarkText}
                >
                  <tspan x="80" dy="0">NISHANTH</tspan>
                  <tspan x="80" dy="130">SANZENA</tspan>
                </text>
              </g>

              {/* Upper flowing dark green wave */}
              <path
                d="M 0 0 L 1440 0 L 1440 180 C 1100 110, 780 230, 480 150 C 240 80, 90 140, 0 110 Z"
                fill="url(#deepGreenWaveGrad)"
                opacity="0.88"
              />

              {/* Secondary trailing wave */}
              <path
                ref={waveSecondaryPathRef}
                d={buildAperturePath(SEC_STAGE_1)}
                fill="#EDE6D8"
                opacity="0.65"
              />
              <path
                ref={waveSecondaryStrokeRef}
                d={buildWaveStroke(SEC_STAGE_1)}
                stroke="#DFCA86"
                strokeWidth="1.5"
                fill="none"
                opacity="0.7"
              />
            </g>

            {/* Atmosphere & Leading Contour Highlights */}
            <path
              ref={wavePrimaryGlowRef}
              d={buildWaveStroke(APERTURE_STAGE_1)}
              stroke="url(#champagneAuraGrad)"
              strokeWidth="26"
              fill="none"
              filter="url(#champagneGlowFilter)"
              opacity="0.85"
            />
            <path
              ref={wavePrimaryStrokeRef}
              d={buildWaveStroke(APERTURE_STAGE_1)}
              stroke="url(#champagneGoldGrad)"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />

            {/* Settled Deep Forest Green Framing Wave at Bottom-Left */}
            <path
              ref={waveGreenBottomPathRef}
              d={buildGreenBottomPath(GREEN_BOT_STAGE_1)}
              fill="url(#deepGreenWaveGrad)"
            />
            <path
              ref={waveGreenBottomStrokeRef}
              d={buildGreenBottomStroke(GREEN_BOT_STAGE_1)}
              stroke="#C8A84E"
              strokeWidth="1.5"
              fill="none"
              opacity="0.85"
            />
          </svg>

          {/* Overlays Layer (Smoothly fades out during GSAP morph) */}
          <div ref={nishanthOverlaysRef} className={styles.nishanthOverlaysLayer}>
            <div className={styles.nishanthOverlaysInnerContainer}>
              {/* Left Play Control */}
              <div ref={nishanthLeftControlRef} className={styles.nishanthLeftControl}>
                <button
                  type="button"
                  className={styles.circularPlayBeacon}
                  onClick={openNishanthVideo}
                  aria-label={`Play signature film: ${ITEM_VIDEO_02.filmTitle}`}
                >
                  <svg className={styles.playBeaconIcon} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
                <div className={styles.nishanthFilmLabelGroup}>
                  <span className={styles.nishanthFilmSub}>SIGNATURE FILM</span>
                  <span className={styles.nishanthFilmName}>NISHANTH X SANZENA</span>
                </div>
              </div>

              {/* Right Narrative Overlay */}
              <div ref={nishanthRightNarrativeRef} className={styles.nishanthRightNarrative}>
                <span className={styles.nishanthTag}>05 —— SIGNATURE FILM</span>
                <h3 className={styles.nishanthTitle}>{ITEM_VIDEO_02.filmTitle}</h3>
                <p className={styles.nishanthExcerpt}>{ITEM_VIDEO_02.description}</p>
                <button
                  type="button"
                  className={styles.btnNishanthPill}
                  onClick={openNishanthVideo}
                >
                  WATCH THE FULL FILM <span className={styles.pillArrow}>——→</span>
                </button>
              </div>
            </div>
          </div>

          {/* Inline Cinema Player Modal / Overlay (Revealed upon morph completion) */}
          {nishanthVideoActive && (
            <div ref={nishanthIframeRef} className={styles.embeddedPlayerStage}>
              <iframe
                src={ITEM_VIDEO_02.embedUrl}
                title={ITEM_VIDEO_02.filmTitle}
                className={styles.cinemaIframe}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
              <button
                type="button"
                className={styles.btnCloseCinema}
                onClick={closeNishanthVideo}
                aria-label="Close signature film player"
              >
                ✕ Close Film
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          07 — SECTION ENDING / BRAND FOOTER BAR
      ══════════════════════════════════════════════════════════════════════ */}
      <div className={styles.mainContainer}>
        <div className={styles.sectionEndingBar}>
          <span className={styles.endingBrand}>24 FRAMES PHOTOGRAPHY</span>
          <span className={styles.endingDividerLine} />
          <span className={styles.endingCursivePhrase}>Real people. Timeless stories.</span>
          <span className={styles.endingDividerLine} />
          <Link href="/disciplines/weddings" className={styles.endingExploreLink}>
            Bespoke Wedding Photography & Films <span className={styles.linkArrow}>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
