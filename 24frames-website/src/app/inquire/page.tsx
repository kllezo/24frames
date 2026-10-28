"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import DatePickerPopover from "./DatePickerPopover";
import Footer from "@/components/layout/Footer";
import styles from "./Inquire.module.css";

/* ════════════════════════════════════════════════════════════════════════════
   24 FRAMES — THE CINEMATIC EQUIPMENT ATELIER
   Five-stage interactive enquiry experience.
   Warm Ivory · Forest Green (#09453E) · Muted Gold (#C8A84E)
   ════════════════════════════════════════════════════════════════════════════ */

gsap.registerPlugin(useGSAP);

/* ── Types ── */
export interface EventTimelineEntry {
  id: string;
  name: string;
  date: string;
  startDate?: string;
  endDate?: string;
  isTBD?: boolean;
  city: string;
  venue: string;
}

interface EquipmentState {
  photoCamera: number;
  videoCamera: number;
  drone: number;
  lighting: number;
}

type LightingMood = "palace-glow" | "soft-romance" | "cinematic-contrast" | "natural-elegance";

interface LightingMoodOption {
  id: LightingMood;
  title: string;
  subtitle: string;
  description: string;
  gradient: string;
  accent: string;
}

const LIGHTING_MOODS: LightingMoodOption[] = [
  {
    id: "palace-glow",
    title: "Palace Glow",
    subtitle: "Warm · Opulent · Golden",
    description: "Warm, opulent illumination that bathes every frame in regal golden light.",
    gradient: "linear-gradient(135deg, #F5E6C8 0%, #D4A84E 50%, #C8923A 100%)",
    accent: "#D4A84E",
  },
  {
    id: "soft-romance",
    title: "Soft Romance",
    subtitle: "Gentle · Diffused · Intimate",
    description: "Gentle diffusion and intimate highlights that soften every detail.",
    gradient: "linear-gradient(135deg, #F7E8E0 0%, #E8C4B8 50%, #D4A89C 100%)",
    accent: "#D4A89C",
  },
  {
    id: "cinematic-contrast",
    title: "Cinematic Contrast",
    subtitle: "Dramatic · Directional · Bold",
    description: "Dramatic shadows and directional light for bold, film-like depth.",
    gradient: "linear-gradient(135deg, #2A2A2A 0%, #09453E 50%, #1A3A35 100%)",
    accent: "#09453E",
  },
  {
    id: "natural-elegance",
    title: "Natural Elegance",
    subtitle: "Balanced · Restrained · Clean",
    description: "Restrained, balanced lighting that lets the moment speak for itself.",
    gradient: "linear-gradient(135deg, #F4EFE6 0%, #E8E2D6 50%, #D5CEBE 100%)",
    accent: "#B5A88A",
  },
];

/* ── Stage Metadata ── */
const STAGE_LABELS = [
  { step: 0, num: "01", label: "Atelier" },
  { step: 1, num: "02", label: "Equipment" },
  { step: 2, num: "03", label: "Direction" },
  { step: 3, num: "04", label: "Blueprint" },
  { step: 4, num: "05", label: "Commission" },
];

/* ═══════════════════════════════════════════════════════════════════════════
   EQUIPMENT STAGE SVG COMPONENT
   Renders the interactive equipment composition with animations
   ═══════════════════════════════════════════════════════════════════════════ */
function EquipmentStage({
  equipment,
  mood,
  isCompact,
  onPhotoFlash,
}: {
  equipment: EquipmentState;
  mood: LightingMood;
  isCompact?: boolean;
  onPhotoFlash?: () => void;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const droneRef = useRef<SVGGElement>(null);
  const recTimerRef = useRef<HTMLSpanElement>(null);
  const [recSeconds, setRecSeconds] = useState(0);
  const recIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* ── Lighting warmth level (clamped 0–1) ── */
  const lightLevel = useMemo(() => Math.min(equipment.lighting / 4, 1), [equipment.lighting]);

  /* ── Mood-based background tint ── */
  const moodConfig = useMemo(() => {
    switch (mood) {
      case "palace-glow":
        return { bg: `rgba(212, 168, 78, ${0.04 + lightLevel * 0.12})`, shadow: "rgba(212, 168, 78, 0.25)" };
      case "soft-romance":
        return { bg: `rgba(212, 164, 156, ${0.04 + lightLevel * 0.10})`, shadow: "rgba(212, 164, 156, 0.25)" };
      case "cinematic-contrast":
        return { bg: `rgba(9, 69, 62, ${0.06 + lightLevel * 0.10})`, shadow: "rgba(9, 69, 62, 0.3)" };
      case "natural-elegance":
      default:
        return { bg: `rgba(181, 168, 138, ${0.03 + lightLevel * 0.08})`, shadow: "rgba(181, 168, 138, 0.2)" };
    }
  }, [mood, lightLevel]);

  /* ── REC timer for video cameras ── */
  useEffect(() => {
    if (equipment.videoCamera > 0 && !recIntervalRef.current) {
      recIntervalRef.current = setInterval(() => {
        setRecSeconds((prev) => prev + 1);
      }, 1000);
    } else if (equipment.videoCamera === 0 && recIntervalRef.current) {
      clearInterval(recIntervalRef.current);
      recIntervalRef.current = null;
      setRecSeconds(0);
    }
    return () => {
      if (recIntervalRef.current) clearInterval(recIntervalRef.current);
    };
  }, [equipment.videoCamera]);

  const formatRecTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  /* ── Equipment SVG viewBox ── */
  const svgSize = isCompact ? { w: 320, h: 220 } : { w: 600, h: 380 };

  return (
    <div
      ref={stageRef}
      className={`${styles.equipmentStage} ${isCompact ? styles.equipmentStageCompact : ""}`}
      style={{
        background: moodConfig.bg,
        boxShadow: `inset 0 0 ${60 + lightLevel * 80}px ${moodConfig.shadow}`,
      }}
    >
      {/* Flash overlay for photo camera */}
      <div ref={flashRef} className={styles.flashOverlay} aria-hidden="true" />

      <svg
        viewBox={`0 0 ${svgSize.w} ${svgSize.h}`}
        className={styles.equipmentSvg}
        aria-label="Equipment composition"
        role="img"
      >
        {/* ── Stage floor / shelf ── */}
        <line
          x1={svgSize.w * 0.1}
          y1={svgSize.h * 0.82}
          x2={svgSize.w * 0.9}
          y2={svgSize.h * 0.82}
          stroke="#D5CEBE"
          strokeWidth="1"
          opacity="0.6"
        />

        {/* ── Lighting glow circle (behind equipment) ── */}
        {equipment.lighting > 0 && (
          <circle
            cx={svgSize.w * 0.5}
            cy={svgSize.h * 0.5}
            r={80 + lightLevel * 60}
            fill="none"
            stroke={moodConfig.shadow}
            strokeWidth={2 + lightLevel * 4}
            opacity={0.15 + lightLevel * 0.25}
            className={styles.lightGlow}
          />
        )}

        {/* ── PHOTO CAMERA ── */}
        {equipment.photoCamera > 0 && (
          <g
            className={styles.equipmentItem}
            transform={`translate(${svgSize.w * 0.15}, ${svgSize.h * 0.42})`}
          >
            {/* Camera body */}
            <rect x="0" y="12" width="58" height="38" rx="5" fill="#2A2D2B" stroke="#444" strokeWidth="1" />
            {/* Lens */}
            <circle cx="29" cy="31" r="14" fill="#1A1C1A" stroke="#555" strokeWidth="1.5" />
            <circle cx="29" cy="31" r="9" fill="#0D0F0D" stroke="#666" strokeWidth="0.5" />
            <circle cx="29" cy="31" r="4" fill="#09453E" opacity="0.5" />
            {/* Viewfinder */}
            <rect x="40" y="4" width="14" height="10" rx="2" fill="#333" stroke="#555" strokeWidth="0.5" />
            {/* Flash hotshoe */}
            <rect x="18" y="8" width="12" height="4" rx="1" fill="#444" />
            {/* Count badge */}
            <circle cx="54" cy="8" r="8" fill="#09453E" />
            <text x="54" y="12" textAnchor="middle" fill="#FAF8F2" fontSize="9" fontWeight="700" fontFamily="Inter, sans-serif">
              {equipment.photoCamera}
            </text>
          </g>
        )}

        {/* ── VIDEO CAMERA ── */}
        {equipment.videoCamera > 0 && (
          <g
            className={styles.equipmentItem}
            transform={`translate(${svgSize.w * 0.40}, ${svgSize.h * 0.38})`}
          >
            {/* Cinema body */}
            <rect x="0" y="14" width="72" height="44" rx="4" fill="#1F2220" stroke="#444" strokeWidth="1" />
            {/* Lens barrel */}
            <rect x="-12" y="24" width="14" height="24" rx="3" fill="#2A2D2B" stroke="#555" strokeWidth="0.8" />
            <circle cx="-5" cy="36" r="8" fill="#111" stroke="#666" strokeWidth="0.5" />
            {/* Handle */}
            <rect x="20" y="4" width="28" height="10" rx="3" fill="#333" stroke="#555" strokeWidth="0.5" />
            <rect x="30" y="0" width="8" height="6" rx="2" fill="#444" />
            {/* Monitor */}
            <rect x="74" y="16" width="22" height="16" rx="2" fill="#111" stroke="#555" strokeWidth="0.5" />
            <rect x="76" y="18" width="18" height="12" rx="1" fill="#09453E" opacity="0.3" />
            {/* Record indicator light */}
            <circle cx="8" cy="52" r="3" fill="#C62828" className={styles.recLight} />
            {/* Count badge */}
            <circle cx="68" cy="10" r="8" fill="#09453E" />
            <text x="68" y="14" textAnchor="middle" fill="#FAF8F2" fontSize="9" fontWeight="700" fontFamily="Inter, sans-serif">
              {equipment.videoCamera}
            </text>
          </g>
        )}

        {/* ── DRONE ── */}
        {equipment.drone > 0 && (
          <g
            ref={droneRef}
            className={styles.droneItem}
            transform={`translate(${svgSize.w * 0.68}, ${svgSize.h * 0.22})`}
          >
            {/* Main body */}
            <ellipse cx="24" cy="20" rx="16" ry="8" fill="#333" stroke="#555" strokeWidth="0.8" />
            {/* Arms */}
            <line x1="8" y1="14" x2="-8" y2="6" stroke="#444" strokeWidth="2" />
            <line x1="40" y1="14" x2="56" y2="6" stroke="#444" strokeWidth="2" />
            <line x1="8" y1="26" x2="-8" y2="34" stroke="#444" strokeWidth="2" />
            <line x1="40" y1="26" x2="56" y2="34" stroke="#444" strokeWidth="2" />
            {/* Rotors */}
            <ellipse cx="-8" cy="6" rx="10" ry="3" fill="none" stroke="#666" strokeWidth="0.5" opacity="0.6" className={styles.rotor} />
            <ellipse cx="56" cy="6" rx="10" ry="3" fill="none" stroke="#666" strokeWidth="0.5" opacity="0.6" className={styles.rotor} />
            <ellipse cx="-8" cy="34" rx="10" ry="3" fill="none" stroke="#666" strokeWidth="0.5" opacity="0.6" className={styles.rotor} />
            <ellipse cx="56" cy="34" rx="10" ry="3" fill="none" stroke="#666" strokeWidth="0.5" opacity="0.6" className={styles.rotor} />
            {/* Camera gimbal */}
            <rect x="18" y="28" width="12" height="6" rx="2" fill="#222" stroke="#555" strokeWidth="0.5" />
            <circle cx="24" cy="36" r="3" fill="#111" stroke="#444" strokeWidth="0.5" />
            {/* Count badge */}
            <circle cx="48" cy="0" r="8" fill="#09453E" />
            <text x="48" y="4" textAnchor="middle" fill="#FAF8F2" fontSize="9" fontWeight="700" fontFamily="Inter, sans-serif">
              {equipment.drone}
            </text>
          </g>
        )}

        {/* ── LIGHTING ── */}
        {equipment.lighting > 0 && (
          <g
            className={styles.equipmentItem}
            transform={`translate(${svgSize.w * 0.78}, ${svgSize.h * 0.30})`}
          >
            {/* Stand pole */}
            <line x1="12" y1="14" x2="12" y2={svgSize.h * 0.52} stroke="#888" strokeWidth="2" />
            {/* Base tripod */}
            <line x1="0" y1={svgSize.h * 0.52} x2="24" y2={svgSize.h * 0.52} stroke="#888" strokeWidth="1.5" />
            {/* Softbox */}
            <rect x="0" y="0" width="24" height="18" rx="2" fill="#F5F0E4" stroke="#D5CEBE" strokeWidth="1" />
            <rect x="3" y="3" width="18" height="12" rx="1" fill={moodConfig.shadow} opacity={0.3 + lightLevel * 0.4} />
            {/* Warm glow rays */}
            <line x1="12" y1="18" x2="0" y2="40" stroke={moodConfig.shadow} strokeWidth="0.5" opacity={0.2 + lightLevel * 0.3} />
            <line x1="12" y1="18" x2="24" y2="40" stroke={moodConfig.shadow} strokeWidth="0.5" opacity={0.2 + lightLevel * 0.3} />
            <line x1="12" y1="18" x2="12" y2="44" stroke={moodConfig.shadow} strokeWidth="0.5" opacity={0.15 + lightLevel * 0.2} />
            {/* Count badge */}
            <circle cx="24" cy="0" r="8" fill="#09453E" />
            <text x="24" y="4" textAnchor="middle" fill="#FAF8F2" fontSize="9" fontWeight="700" fontFamily="Inter, sans-serif">
              {equipment.lighting}
            </text>
          </g>
        )}

        {/* ── Empty state message ── */}
        {equipment.photoCamera === 0 &&
          equipment.videoCamera === 0 &&
          equipment.drone === 0 &&
          equipment.lighting === 0 && (
            <text
              x={svgSize.w / 2}
              y={svgSize.h / 2}
              textAnchor="middle"
              fill="#888E87"
              fontSize="14"
              fontFamily="Inter, sans-serif"
              fontStyle="italic"
            >
              Select equipment to begin composing
            </text>
          )}
      </svg>

      {/* REC indicator bar */}
      {equipment.videoCamera > 0 && (
        <div className={styles.recIndicatorBar}>
          <span className={styles.recDot} aria-hidden="true" />
          <span className={styles.recLabel}>REC</span>
          <span ref={recTimerRef} className={styles.recTimer}>
            {formatRecTime(recSeconds)}
          </span>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   EQUIPMENT SELECTOR CARD
   ═══════════════════════════════════════════════════════════════════════════ */
function EquipmentCard({
  icon,
  label,
  sublabel,
  count,
  onAdd,
  onRemove,
  animClass,
}: {
  icon: React.ReactNode;
  label: string;
  sublabel: string;
  count: number;
  onAdd: () => void;
  onRemove: () => void;
  animClass?: string;
}) {
  return (
    <div className={`${styles.equipCard} ${count > 0 ? styles.equipCardActive : ""} ${animClass || ""}`}>
      <button
        type="button"
        onClick={onAdd}
        className={styles.equipCardMain}
        aria-label={`Add one ${label}`}
      >
        <div className={styles.equipIconWrap}>{icon}</div>
        <div className={styles.equipInfo}>
          <span className={styles.equipLabel}>{label}</span>
          <span className={styles.equipSublabel}>{sublabel}</span>
        </div>
      </button>

      <div className={styles.equipQtyControls}>
        <button
          type="button"
          onClick={onRemove}
          className={styles.qtyBtn}
          aria-label={`Remove one ${label}`}
          disabled={count === 0}
        >
          −
        </button>
        <span className={styles.qtyValue} aria-live="polite">
          {count}
        </span>
        <button
          type="button"
          onClick={onAdd}
          className={styles.qtyBtn}
          aria-label={`Add one ${label}`}
        >
          +
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT — THE EQUIPMENT ATELIER
   ═══════════════════════════════════════════════════════════════════════════ */
export default function InquirePage() {
  /* ── Stage State (0–4) ── */
  const [stage, setStage] = useState<number>(0);

  /* ── Equipment Configuration ── */
  const [equipment, setEquipment] = useState<EquipmentState>({
    photoCamera: 0,
    videoCamera: 0,
    drone: 0,
    lighting: 0,
  });

  /* ── Lighting Mood ── */
  const [selectedMood, setSelectedMood] = useState<LightingMood>("natural-elegance");

  /* ── Event Timeline ── */
  const [events, setEvents] = useState<EventTimelineEntry[]>([
    {
      id: "event-1",
      name: "",
      date: "",
      city: "",
      venue: "",
    },
  ]);

  /* ── Client Details ── */
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  /* ── Validation & Submission ── */
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  /* ── Animation refs ── */
  const mainRef = useRef<HTMLDivElement>(null);
  const stageContentRef = useRef<HTMLDivElement>(null);
  const flashTlRef = useRef<gsap.core.Tween | null>(null);
  const droneTlRef = useRef<gsap.core.Timeline | null>(null);
  const isReducedMotion = useRef(false);

  useEffect(() => {
    isReducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  /* ── Stage transitions with GSAP ── */
  useGSAP(
    () => {
      if (!stageContentRef.current || isReducedMotion.current) return;
      gsap.fromTo(
        stageContentRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
      );
    },
    { dependencies: [stage], scope: mainRef }
  );

  /* ── Equipment Actions ── */
  const handleAddEquipment = useCallback(
    (type: keyof EquipmentState) => {
      setEquipment((prev) => ({ ...prev, [type]: prev[type] + 1 }));

      if (type === "photoCamera" && !isReducedMotion.current) {
        // Camera flash effect
        const flashEl = document.querySelector(`.${styles.flashOverlay}`) as HTMLElement;
        if (flashEl) {
          if (flashTlRef.current) flashTlRef.current.kill();
          flashTlRef.current = gsap.fromTo(
            flashEl,
            { opacity: 0.7 },
            {
              opacity: 0,
              duration: 0.45,
              ease: "power2.out",
              onStart: () => {
                flashEl.style.display = "block";
              },
              onComplete: () => {
                flashEl.style.display = "none";
              },
            }
          );
        }
      }

      if (type === "drone" && !isReducedMotion.current) {
        // Drone orbit animation
        const droneEl = document.querySelector(`.${styles.droneItem}`) as SVGGElement;
        if (droneEl && !droneTlRef.current?.isActive()) {
          droneTlRef.current = gsap.timeline();
          droneTlRef.current
            .to(droneEl, { y: -20, duration: 0.4, ease: "power2.out" })
            .to(droneEl, { x: 15, rotation: 5, duration: 0.5, ease: "sine.inOut" })
            .to(droneEl, { x: -15, rotation: -5, duration: 1.0, ease: "sine.inOut" })
            .to(droneEl, { x: 0, y: 0, rotation: 0, duration: 0.5, ease: "power2.inOut" });
        }
      }
    },
    []
  );

  const handleRemoveEquipment = useCallback((type: keyof EquipmentState) => {
    setEquipment((prev) => ({
      ...prev,
      [type]: Math.max(0, prev[type] - 1),
    }));
  }, []);

  /* ── Event Timeline Actions ── */
  const handleAddEvent = useCallback(() => {
    setEvents((prev) => [
      ...prev,
      {
        id: `event-${Date.now()}`,
        name: "",
        date: "",
        city: prev[0]?.city || "",
        venue: "",
      },
    ]);
  }, []);

  const handleUpdateEvent = useCallback(
    (id: string, field: keyof EventTimelineEntry, value: string) => {
      setEvents((prev) =>
        prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
      );
    },
    []
  );

  const handleUpdateEventDate = useCallback(
    (
      id: string,
      formattedSummary: string,
      startDate?: string,
      endDate?: string,
      isTBD?: boolean
    ) => {
      setEvents((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, date: formattedSummary, startDate, endDate, isTBD }
            : item
        )
      );
    },
    []
  );

  const handleRemoveEvent = useCallback(
    (id: string) => {
      if (events.length <= 1) return;
      setEvents((prev) => prev.filter((item) => item.id !== id));
    },
    [events.length]
  );

  /* ── Navigation ── */
  const handleNext = useCallback(() => {
    setStage((prev) => Math.min(4, prev + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleBack = useCallback(() => {
    setStage((prev) => Math.max(0, prev - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleJumpToStage = useCallback((targetStage: number) => {
    setStage(targetStage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  /* ── Mood label ── */
  const currentMood = useMemo(
    () => LIGHTING_MOODS.find((m) => m.id === selectedMood) || LIGHTING_MOODS[3],
    [selectedMood]
  );

  /* ── Equipment summary ── */
  const totalEquipment = useMemo(
    () =>
      equipment.photoCamera + equipment.videoCamera + equipment.drone + equipment.lighting,
    [equipment]
  );

  /* ── WhatsApp Brief ── */
  const formattedBriefText = useMemo(() => {
    const lines: string[] = [
      `*EQUIPMENT ATELIER COMMISSION — 24 FRAMES*`,
      `────────────────────────────────`,
      `• *Client:* ${fullName || "—"}`,
      `• *Email:* ${email || "—"}`,
      `• *Phone:* ${phone || "—"}`,
      ``,
      `*CREW & EQUIPMENT:*`,
    ];
    if (equipment.photoCamera > 0)
      lines.push(`  📷 Photography Cameras: ${equipment.photoCamera}`);
    if (equipment.videoCamera > 0)
      lines.push(`  🎬 Cinema Cameras: ${equipment.videoCamera}`);
    if (equipment.drone > 0) lines.push(`  ✈ Drones: ${equipment.drone}`);
    if (equipment.lighting > 0)
      lines.push(`  💡 Lighting Units: ${equipment.lighting}`);

    lines.push(``, `• *Visual Mood:* ${currentMood.title}`);

    if (events.length > 0 && events.some((e) => e.name || e.date || e.city)) {
      lines.push(``, `*EVENT TIMELINE:*`);
      events.forEach((ev, i) => {
        if (ev.name || ev.date || ev.city) {
          lines.push(
            `  ${i + 1}. ${ev.name || "Event"} | ${ev.date || "Date TBD"} | ${ev.city || "City TBD"}${ev.venue ? ` (${ev.venue})` : ""}`
          );
        }
      });
    }

    if (notes) lines.push(``, `• *Notes:* "${notes}"`);
    lines.push(``, `────────────────────────────────`, `Composed via 24 Frames Equipment Atelier`);

    return lines.join("\n");
  }, [fullName, email, phone, equipment, currentMood, events, notes]);

  const whatsappHref = `https://wa.me/919959664567?text=${encodeURIComponent(formattedBriefText)}`;

  /* ── Submit handler ── */
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const newErrors: Record<string, string> = {};

      if (!fullName.trim()) newErrors.fullName = "Please provide your full name";
      if (!email.trim()) {
        newErrors.email = "Please provide your email address";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        newErrors.email = "Please enter a valid email address";
      }
      if (!phone.trim()) newErrors.phone = "Please provide your phone number";

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      setErrors({});
      setIsSubmitting(true);

      // Submit completes → show final state
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
      }, 600);
    },
    [fullName, email, phone]
  );

  /* ═══════════════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════════════ */
  return (
    <div className={styles.atelierPage} ref={mainRef}>
      {/* ── ATELIER MASTHEAD ── */}
      <header className={styles.atelierHeader} role="banner">
        <div className={styles.headerInner}>
          <Link href="/" className={styles.backLink} aria-label="Return to 24 Frames">
            <span className={styles.backArrow} aria-hidden="true">
              ←
            </span>
            <span>24 FRAMES</span>
          </Link>

          <div className={styles.headerCrest}>
            <span className={styles.crestText}>EQUIPMENT ATELIER</span>
            <span className={styles.crestDivider}>·</span>
            <span className={styles.crestSub}>HYDERABAD</span>
          </div>

          <div className={styles.folioIndicator}>
            <span className={styles.folioTag}>CREW BUILDER</span>
            <span className={styles.folioId}>24F-2026</span>
          </div>
        </div>

        {/* ── Five-Stage Progress Indicator ── */}
        {stage >= 0 && (
          <nav className={styles.progressNav} aria-label="Atelier Progress">
            <div className={styles.progressTrack}>
              {STAGE_LABELS.map((s, idx) => (
                <div key={s.step} className={styles.progressStageWrap}>
                  {idx > 0 && (
                    <span
                      className={`${styles.progressConnector} ${
                        stage >= s.step ? styles.progressConnectorActive : ""
                      }`}
                      aria-hidden="true"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => s.step <= stage && handleJumpToStage(s.step)}
                    disabled={s.step > stage}
                    className={`${styles.progressTab} ${
                      s.step === stage
                        ? styles.progressTabActive
                        : s.step < stage
                        ? styles.progressTabComplete
                        : styles.progressTabUpcoming
                    }`}
                    aria-current={s.step === stage ? "step" : undefined}
                  >
                    <span className={styles.progressNum}>
                      {s.step < stage ? "✓" : s.num}
                    </span>
                    <span className={styles.progressLabel}>{s.label}</span>
                  </button>
                </div>
              ))}
            </div>
          </nav>
        )}
      </header>

      <main className={styles.atelierMain}>
        <div ref={stageContentRef} key={stage}>
          {/* ══════════════════════════════════════════════════════════
             STAGE 0: ENTER THE ATELIER
             ══════════════════════════════════════════════════════════ */}
          {stage === 0 && (
            <section className={styles.atelierIntro} aria-label="Enter the Atelier">
              <div className={styles.introLayout}>
                {/* Equipment composition hero */}
                <div className={styles.introEquipSide}>
                  <div className={styles.introEquipScene}>
                    {/* Stylized equipment composition using CSS/SVG */}
                    <svg
                      viewBox="0 0 480 360"
                      className={styles.introEquipSvg}
                      aria-label="Studio equipment composition"
                      role="img"
                    >
                      {/* Ambient glow */}
                      <defs>
                        <radialGradient id="studioGlow" cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stopColor="#C8A84E" stopOpacity="0.08" />
                          <stop offset="100%" stopColor="#C8A84E" stopOpacity="0" />
                        </radialGradient>
                        <filter id="softShadow">
                          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#09453E" floodOpacity="0.12" />
                        </filter>
                      </defs>
                      <circle cx="240" cy="180" r="140" fill="url(#studioGlow)" />

                      {/* Photo Camera */}
                      <g filter="url(#softShadow)" transform="translate(60, 120)">
                        <rect x="0" y="12" width="72" height="48" rx="6" fill="#2A2D2B" stroke="#555" strokeWidth="0.8" />
                        <circle cx="36" cy="36" r="17" fill="#1A1C1A" stroke="#666" strokeWidth="1" />
                        <circle cx="36" cy="36" r="11" fill="#0D0F0D" />
                        <circle cx="36" cy="36" r="5" fill="#09453E" opacity="0.6" />
                        <rect x="48" y="2" width="18" height="12" rx="3" fill="#333" stroke="#555" strokeWidth="0.5" />
                        <rect x="22" y="8" width="14" height="4" rx="1" fill="#444" />
                      </g>

                      {/* Cinema Camera */}
                      <g filter="url(#softShadow)" transform="translate(180, 100)">
                        <rect x="0" y="16" width="88" height="52" rx="5" fill="#1F2220" stroke="#444" strokeWidth="1" />
                        <rect x="-16" y="28" width="18" height="28" rx="4" fill="#2A2D2B" stroke="#555" strokeWidth="0.8" />
                        <circle cx="-7" cy="42" r="10" fill="#111" stroke="#666" strokeWidth="0.5" />
                        <rect x="24" y="4" width="34" height="12" rx="3" fill="#333" stroke="#555" strokeWidth="0.5" />
                        <rect x="90" y="20" width="26" height="18" rx="2" fill="#111" stroke="#555" strokeWidth="0.5" />
                        <rect x="93" y="23" width="20" height="12" rx="1" fill="#09453E" opacity="0.25" />
                      </g>

                      {/* Drone */}
                      <g filter="url(#softShadow)" transform="translate(330, 60)">
                        <ellipse cx="36" cy="28" rx="22" ry="10" fill="#333" stroke="#555" strokeWidth="0.8" />
                        <line x1="14" y1="20" x2="-6" y2="10" stroke="#444" strokeWidth="2.5" />
                        <line x1="58" y1="20" x2="78" y2="10" stroke="#444" strokeWidth="2.5" />
                        <line x1="14" y1="36" x2="-6" y2="46" stroke="#444" strokeWidth="2.5" />
                        <line x1="58" y1="36" x2="78" y2="46" stroke="#444" strokeWidth="2.5" />
                        <ellipse cx="-6" cy="10" rx="14" ry="4" fill="none" stroke="#888" strokeWidth="0.6" opacity="0.5" />
                        <ellipse cx="78" cy="10" rx="14" ry="4" fill="none" stroke="#888" strokeWidth="0.6" opacity="0.5" />
                        <ellipse cx="-6" cy="46" rx="14" ry="4" fill="none" stroke="#888" strokeWidth="0.6" opacity="0.5" />
                        <ellipse cx="78" cy="46" rx="14" ry="4" fill="none" stroke="#888" strokeWidth="0.6" opacity="0.5" />
                        <rect x="28" y="38" width="16" height="8" rx="2" fill="#222" />
                        <circle cx="36" cy="50" r="4" fill="#111" stroke="#555" strokeWidth="0.5" />
                      </g>

                      {/* Lighting softbox */}
                      <g filter="url(#softShadow)" transform="translate(380, 140)">
                        <line x1="20" y1="20" x2="20" y2="180" stroke="#AAA" strokeWidth="2" />
                        <line x1="6" y1="180" x2="34" y2="180" stroke="#AAA" strokeWidth="1.5" />
                        <rect x="2" y="0" width="36" height="24" rx="3" fill="#F5F0E4" stroke="#D5CEBE" strokeWidth="1" />
                        <rect x="6" y="4" width="28" height="16" rx="1" fill="rgba(200, 168, 78, 0.15)" />
                        {/* Light rays */}
                        <line x1="20" y1="24" x2="4" y2="60" stroke="rgba(200, 168, 78, 0.2)" strokeWidth="0.6" />
                        <line x1="20" y1="24" x2="36" y2="60" stroke="rgba(200, 168, 78, 0.2)" strokeWidth="0.6" />
                        <line x1="20" y1="24" x2="20" y2="64" stroke="rgba(200, 168, 78, 0.15)" strokeWidth="0.6" />
                      </g>

                      {/* Studio floor line */}
                      <line x1="40" y1="320" x2="440" y2="320" stroke="#D5CEBE" strokeWidth="1" opacity="0.5" />
                    </svg>
                  </div>
                </div>

                {/* Content side */}
                <div className={styles.introContentSide}>
                  <div className={styles.introEyebrowRow}>
                    <span className={styles.goldDash} aria-hidden="true" />
                    <span className={styles.introEyebrow}>PRIVATE EQUIPMENT ATELIER</span>
                  </div>

                  <h1 className={styles.introTitle}>
                    Every story deserves its own crew.
                  </h1>

                  <p className={styles.introNarrative}>
                    Build the creative team and visual direction for your celebration.
                    Select cameras, cinema rigs, aerial drones, and studio lighting
                    to compose the perfect production crew for your story.
                  </p>

                  <p className={styles.introSubtext}>
                    This interactive atelier lets you assemble your equipment configuration,
                    choose a visual mood, and present your commission brief directly to our studio.
                  </p>

                  <div className={styles.introActions}>
                    <button
                      onClick={handleNext}
                      className={styles.primaryBtn}
                      aria-label="Build your crew"
                    >
                      <span>BUILD YOUR CREW</span>
                      <span className={styles.btnArrow}>→</span>
                    </button>

                    <Link href="/" className={styles.secondaryBtn}>
                      <span>Explore Our Work</span>
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ══════════════════════════════════════════════════════════
             STAGE 1: ASSEMBLE THE EQUIPMENT
             ══════════════════════════════════════════════════════════ */}
          {stage === 1 && (
            <section className={styles.stageSection} aria-label="Assemble Equipment">
              <div className={styles.stageHeader}>
                <div className={styles.stageEyebrowRow}>
                  <span className={styles.stageEyebrow}>STAGE II · ASSEMBLE THE EQUIPMENT</span>
                  <span className={styles.stageStep}>02 / 05</span>
                </div>
                <h2 className={styles.stageHeadline}>Select your production crew.</h2>
                <p className={styles.stageSubtitle}>
                  Choose the cameras, drones, and lighting that will shape your visual story.
                  Click equipment to add, use +/− to adjust quantities.
                </p>
                <div className={styles.goldRule} aria-hidden="true" />
              </div>

              <div className={styles.equipmentLayout}>
                {/* Central Equipment Stage */}
                <div className={styles.equipStageWrap}>
                  <EquipmentStage equipment={equipment} mood={selectedMood} />
                </div>

                {/* Equipment Selection Cards */}
                <div className={styles.equipGrid}>
                  <EquipmentCard
                    icon={
                      <svg viewBox="0 0 32 32" className={styles.equipSvgIcon}>
                        <rect x="4" y="8" width="24" height="16" rx="3" fill="currentColor" opacity="0.8" />
                        <circle cx="16" cy="16" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
                        <circle cx="16" cy="16" r="3" fill="currentColor" opacity="0.4" />
                        <rect x="20" y="4" width="6" height="5" rx="1.5" fill="currentColor" opacity="0.6" />
                      </svg>
                    }
                    label="Photography Camera"
                    sublabel="Still frames · Master portraits"
                    count={equipment.photoCamera}
                    onAdd={() => handleAddEquipment("photoCamera")}
                    onRemove={() => handleRemoveEquipment("photoCamera")}
                  />

                  <EquipmentCard
                    icon={
                      <svg viewBox="0 0 32 32" className={styles.equipSvgIcon}>
                        <rect x="2" y="9" width="22" height="14" rx="2" fill="currentColor" opacity="0.8" />
                        <polygon points="24,12 30,8 30,24 24,20" fill="currentColor" opacity="0.6" />
                        <circle cx="8" cy="20" r="2" fill="#C62828" />
                      </svg>
                    }
                    label="Cinema Camera"
                    sublabel="4K film · Theatrical motion"
                    count={equipment.videoCamera}
                    onAdd={() => handleAddEquipment("videoCamera")}
                    onRemove={() => handleRemoveEquipment("videoCamera")}
                  />

                  <EquipmentCard
                    icon={
                      <svg viewBox="0 0 32 32" className={styles.equipSvgIcon}>
                        <ellipse cx="16" cy="16" rx="8" ry="4" fill="currentColor" opacity="0.7" />
                        <line x1="8" y1="13" x2="3" y2="8" stroke="currentColor" strokeWidth="1.5" />
                        <line x1="24" y1="13" x2="29" y2="8" stroke="currentColor" strokeWidth="1.5" />
                        <line x1="8" y1="19" x2="3" y2="24" stroke="currentColor" strokeWidth="1.5" />
                        <line x1="24" y1="19" x2="29" y2="24" stroke="currentColor" strokeWidth="1.5" />
                        <circle cx="3" cy="8" r="3" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
                        <circle cx="29" cy="8" r="3" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
                        <circle cx="3" cy="24" r="3" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
                        <circle cx="29" cy="24" r="3" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
                      </svg>
                    }
                    label="Drone"
                    sublabel="Aerial · Architectural sweeps"
                    count={equipment.drone}
                    onAdd={() => handleAddEquipment("drone")}
                    onRemove={() => handleRemoveEquipment("drone")}
                  />

                  <EquipmentCard
                    icon={
                      <svg viewBox="0 0 32 32" className={styles.equipSvgIcon}>
                        <rect x="10" y="4" width="12" height="10" rx="2" fill="currentColor" opacity="0.7" />
                        <line x1="16" y1="14" x2="16" y2="28" stroke="currentColor" strokeWidth="1.5" />
                        <line x1="10" y1="28" x2="22" y2="28" stroke="currentColor" strokeWidth="1.5" />
                        <line x1="12" y1="14" x2="6" y2="20" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
                        <line x1="20" y1="14" x2="26" y2="20" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
                      </svg>
                    }
                    label="Lighting"
                    sublabel="Studio · Softbox · Warmth"
                    count={equipment.lighting}
                    onAdd={() => handleAddEquipment("lighting")}
                    onRemove={() => handleRemoveEquipment("lighting")}
                  />
                </div>

                {/* Live Configuration Summary */}
                {totalEquipment > 0 && (
                  <div className={styles.configSummary}>
                    <span className={styles.configLabel}>YOUR CREW</span>
                    <div className={styles.configItems}>
                      {equipment.photoCamera > 0 && (
                        <span className={styles.configItem}>
                          📷 {equipment.photoCamera} Photo{equipment.photoCamera > 1 ? "s" : ""}
                        </span>
                      )}
                      {equipment.videoCamera > 0 && (
                        <span className={styles.configItem}>
                          🎬 {equipment.videoCamera} Cinema{equipment.videoCamera > 1 ? "s" : ""}
                        </span>
                      )}
                      {equipment.drone > 0 && (
                        <span className={styles.configItem}>
                          ✈ {equipment.drone} Drone{equipment.drone > 1 ? "s" : ""}
                        </span>
                      )}
                      {equipment.lighting > 0 && (
                        <span className={styles.configItem}>
                          💡 {equipment.lighting} Light{equipment.lighting > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className={styles.stageFooterNav}>
                <button onClick={handleBack} className={styles.backBtn} type="button">
                  <span className={styles.backArrowIcon}>←</span>
                  <span>Back</span>
                </button>
                <button onClick={handleNext} className={styles.primaryBtn} type="button">
                  <span>Continue to Direction</span>
                  <span className={styles.btnArrow}>→</span>
                </button>
              </div>
            </section>
          )}

          {/* ══════════════════════════════════════════════════════════
             STAGE 2: DIRECT THE LOOK — SET THE SCENE
             ══════════════════════════════════════════════════════════ */}
          {stage === 2 && (
            <section className={styles.stageSection} aria-label="Set the Scene">
              <div className={styles.stageHeader}>
                <div className={styles.stageEyebrowRow}>
                  <span className={styles.stageEyebrow}>STAGE III · SET THE SCENE</span>
                  <span className={styles.stageStep}>03 / 05</span>
                </div>
                <h2 className={styles.stageHeadline}>Direct the visual mood.</h2>
                <p className={styles.stageSubtitle}>
                  Choose a lighting and visual atmosphere that reflects the feeling of your celebration.
                  Each mood guides our creative direction.
                </p>
                <div className={styles.goldRule} aria-hidden="true" />
              </div>

              <div className={styles.moodGrid}>
                {LIGHTING_MOODS.map((mood) => {
                  const isSelected = selectedMood === mood.id;
                  return (
                    <button
                      key={mood.id}
                      type="button"
                      onClick={() => setSelectedMood(mood.id)}
                      className={`${styles.moodCard} ${isSelected ? styles.moodCardSelected : ""}`}
                      aria-pressed={isSelected}
                    >
                      <div
                        className={styles.moodPreview}
                        style={{ background: mood.gradient }}
                      >
                        {isSelected && (
                          <span className={styles.moodCheck} aria-hidden="true">
                            ✓
                          </span>
                        )}
                      </div>
                      <div className={styles.moodContent}>
                        <h3 className={styles.moodTitle}>{mood.title}</h3>
                        <span className={styles.moodSubtitle}>{mood.subtitle}</span>
                        <p className={styles.moodDesc}>{mood.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Live preview of selected mood on equipment */}
              <div className={styles.moodPreviewStage}>
                <span className={styles.moodPreviewLabel}>
                  PREVIEW — {currentMood.title.toUpperCase()}
                </span>
                <EquipmentStage
                  equipment={equipment}
                  mood={selectedMood}
                  isCompact
                />
              </div>

              {/* Event timeline section */}
              <div className={styles.timelineSection}>
                <div className={styles.subSectionHeader}>
                  <h3 className={styles.subSectionTitle}>Occasion Details</h3>
                  <span className={styles.subSectionNote}>Optional — helps us prepare</span>
                </div>

                <div className={styles.timelineList}>
                  {events.map((ev, index) => (
                    <div key={ev.id} className={styles.timelineCard}>
                      <div className={styles.timelineCardHead}>
                        <span className={styles.timelineNum}>
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        {events.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveEvent(ev.id)}
                            className={styles.removeBtn}
                          >
                            ✕ Remove
                          </button>
                        )}
                      </div>

                      <div className={styles.timelineFields}>
                        <div className={styles.fieldGroup}>
                          <label className={styles.fieldLabel}>Event Name</label>
                          <input
                            type="text"
                            value={ev.name}
                            onChange={(e) => handleUpdateEvent(ev.id, "name", e.target.value)}
                            placeholder="e.g. Wedding Ceremony, Sangeet, Reception"
                            className={styles.input}
                          />
                        </div>
                        <div className={styles.fieldGroup}>
                          <label className={styles.fieldLabel}>Date</label>
                          <DatePickerPopover
                            value={ev.date}
                            startDate={ev.startDate}
                            endDate={ev.endDate}
                            isTBD={ev.isTBD}
                            onChange={(dateSummary, startDate, endDate, isTBD) =>
                              handleUpdateEventDate(ev.id, dateSummary, startDate, endDate, isTBD)
                            }
                          />
                        </div>
                        <div className={styles.fieldGroup}>
                          <label className={styles.fieldLabel}>City</label>
                          <input
                            type="text"
                            value={ev.city}
                            onChange={(e) => handleUpdateEvent(ev.id, "city", e.target.value)}
                            placeholder="e.g. Hyderabad, Udaipur"
                            className={styles.input}
                          />
                        </div>
                        <div className={styles.fieldGroup}>
                          <label className={styles.fieldLabel}>Venue (Optional)</label>
                          <input
                            type="text"
                            value={ev.venue}
                            onChange={(e) => handleUpdateEvent(ev.id, "venue", e.target.value)}
                            placeholder="e.g. Taj Falaknuma Palace"
                            className={styles.input}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleAddEvent}
                  className={styles.addEventBtn}
                >
                  <span>+ Add another event</span>
                </button>
              </div>

              <div className={styles.stageFooterNav}>
                <button onClick={handleBack} className={styles.backBtn} type="button">
                  <span className={styles.backArrowIcon}>←</span>
                  <span>Back</span>
                </button>
                <button onClick={handleNext} className={styles.primaryBtn} type="button">
                  <span>Continue to Blueprint</span>
                  <span className={styles.btnArrow}>→</span>
                </button>
              </div>
            </section>
          )}

          {/* ══════════════════════════════════════════════════════════
             STAGE 3: REVIEW THE PRODUCTION BLUEPRINT
             ══════════════════════════════════════════════════════════ */}
          {stage === 3 && (
            <section className={styles.stageSection} aria-label="Production Blueprint">
              <div className={styles.stageHeader}>
                <div className={styles.stageEyebrowRow}>
                  <span className={styles.stageEyebrow}>STAGE IV · YOUR PRODUCTION BLUEPRINT</span>
                  <span className={styles.stageStep}>04 / 05</span>
                </div>
                <h2 className={styles.stageHeadline}>Review your production configuration.</h2>
                <p className={styles.stageSubtitle}>
                  Everything you've selected is summarized below. Edit any section or proceed to compose your commission.
                </p>
                <div className={styles.goldRule} aria-hidden="true" />
              </div>

              <div className={styles.blueprintLayout}>
                {/* Equipment visual composition */}
                <div className={styles.blueprintStage}>
                  <EquipmentStage equipment={equipment} mood={selectedMood} isCompact />
                </div>

                {/* Blueprint document */}
                <div className={styles.blueprintDoc}>
                  <div className={styles.blueprintDocHeader}>
                    <span className={styles.blueprintBrand}>24 FRAMES EQUIPMENT ATELIER</span>
                    <span className={styles.blueprintSeal}>PRODUCTION BLUEPRINT</span>
                  </div>

                  {/* Equipment Section */}
                  <div className={styles.blueprintSection}>
                    <div className={styles.blueprintSectionHead}>
                      <span className={styles.blueprintKicker}>I. CREW & EQUIPMENT</span>
                      <button
                        onClick={() => handleJumpToStage(1)}
                        className={styles.editBtn}
                      >
                        Edit ↗
                      </button>
                    </div>
                    <div className={styles.blueprintEquipList}>
                      <div className={styles.blueprintEquipRow}>
                        <span className={styles.blueprintEquipLabel}>Photography Cameras</span>
                        <div className={styles.blueprintEquipQty}>
                          <button type="button" onClick={() => handleRemoveEquipment("photoCamera")} className={styles.qtyBtnSm} disabled={equipment.photoCamera === 0}>−</button>
                          <span>{equipment.photoCamera}</span>
                          <button type="button" onClick={() => handleAddEquipment("photoCamera")} className={styles.qtyBtnSm}>+</button>
                        </div>
                      </div>
                      <div className={styles.blueprintEquipRow}>
                        <span className={styles.blueprintEquipLabel}>Cinema Cameras</span>
                        <div className={styles.blueprintEquipQty}>
                          <button type="button" onClick={() => handleRemoveEquipment("videoCamera")} className={styles.qtyBtnSm} disabled={equipment.videoCamera === 0}>−</button>
                          <span>{equipment.videoCamera}</span>
                          <button type="button" onClick={() => handleAddEquipment("videoCamera")} className={styles.qtyBtnSm}>+</button>
                        </div>
                      </div>
                      <div className={styles.blueprintEquipRow}>
                        <span className={styles.blueprintEquipLabel}>Drones</span>
                        <div className={styles.blueprintEquipQty}>
                          <button type="button" onClick={() => handleRemoveEquipment("drone")} className={styles.qtyBtnSm} disabled={equipment.drone === 0}>−</button>
                          <span>{equipment.drone}</span>
                          <button type="button" onClick={() => handleAddEquipment("drone")} className={styles.qtyBtnSm}>+</button>
                        </div>
                      </div>
                      <div className={styles.blueprintEquipRow}>
                        <span className={styles.blueprintEquipLabel}>Lighting Units</span>
                        <div className={styles.blueprintEquipQty}>
                          <button type="button" onClick={() => handleRemoveEquipment("lighting")} className={styles.qtyBtnSm} disabled={equipment.lighting === 0}>−</button>
                          <span>{equipment.lighting}</span>
                          <button type="button" onClick={() => handleAddEquipment("lighting")} className={styles.qtyBtnSm}>+</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Visual Mood Section */}
                  <div className={styles.blueprintSection}>
                    <div className={styles.blueprintSectionHead}>
                      <span className={styles.blueprintKicker}>II. VISUAL MOOD</span>
                      <button
                        onClick={() => handleJumpToStage(2)}
                        className={styles.editBtn}
                      >
                        Edit ↗
                      </button>
                    </div>
                    <div className={styles.blueprintMoodRow}>
                      <div
                        className={styles.blueprintMoodSwatch}
                        style={{ background: currentMood.gradient }}
                      />
                      <div>
                        <div className={styles.blueprintMoodName}>{currentMood.title}</div>
                        <div className={styles.blueprintMoodDesc}>{currentMood.description}</div>
                      </div>
                    </div>
                  </div>

                  {/* Event Timeline Section */}
                  {events.some((e) => e.name || e.date || e.city) && (
                    <div className={styles.blueprintSection}>
                      <div className={styles.blueprintSectionHead}>
                        <span className={styles.blueprintKicker}>
                          III. OCCASION TIMELINE ({events.filter((e) => e.name || e.date || e.city).length} EVENTS)
                        </span>
                        <button
                          onClick={() => handleJumpToStage(2)}
                          className={styles.editBtn}
                        >
                          Edit ↗
                        </button>
                      </div>
                      <div className={styles.blueprintTimeline}>
                        {events.map((ev, i) => {
                          if (!ev.name && !ev.date && !ev.city) return null;
                          return (
                            <div key={ev.id} className={styles.blueprintTimelineItem}>
                              <span className={styles.blueprintTimelineNum}>
                                {String(i + 1).padStart(2, "0")}
                              </span>
                              <div className={styles.blueprintTimelineInfo}>
                                <div className={styles.blueprintTimelineName}>
                                  {ev.name || "Celebration Event"}
                                </div>
                                <div className={styles.blueprintTimelineMeta}>
                                  {ev.date || "Date Pending"}
                                  {ev.city && <> · {ev.city}</>}
                                  {ev.venue && <> ({ev.venue})</>}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.stageFooterNav}>
                <button onClick={handleBack} className={styles.backBtn} type="button">
                  <span className={styles.backArrowIcon}>←</span>
                  <span>Back to Edit</span>
                </button>
                <button onClick={handleNext} className={styles.primaryBtn} type="button">
                  <span>COMPOSE MY COMMISSION</span>
                  <span className={styles.btnArrow}>→</span>
                </button>
              </div>
            </section>
          )}

          {/* ══════════════════════════════════════════════════════════
             STAGE 4: COMPOSE THE COMMISSION
             ══════════════════════════════════════════════════════════ */}
          {stage === 4 && !isSubmitted && (
            <section className={styles.stageSection} aria-label="Compose the Commission">
              <div className={styles.stageHeader}>
                <div className={styles.stageEyebrowRow}>
                  <span className={styles.stageEyebrow}>STAGE V · COMPOSE THE COMMISSION</span>
                  <span className={styles.stageStep}>05 / 05</span>
                </div>
                <h2 className={styles.stageHeadline}>Your story is ready to be composed.</h2>
                <p className={styles.stageSubtitle}>
                  Review your final configuration and provide your contact details to present your commission.
                </p>
                <div className={styles.goldRule} aria-hidden="true" />
              </div>

              <div className={styles.commissionLayout}>
                {/* Final Equipment Scene */}
                <div className={styles.commissionStage}>
                  <EquipmentStage equipment={equipment} mood={selectedMood} isCompact />
                  <div className={styles.commissionSummaryInline}>
                    {equipment.photoCamera > 0 && (
                      <span>📷 {equipment.photoCamera} Photo Camera{equipment.photoCamera > 1 ? "s" : ""}</span>
                    )}
                    {equipment.videoCamera > 0 && (
                      <span>🎬 {equipment.videoCamera} Cinema Camera{equipment.videoCamera > 1 ? "s" : ""}</span>
                    )}
                    {equipment.drone > 0 && (
                      <span>✈ {equipment.drone} Drone{equipment.drone > 1 ? "s" : ""}</span>
                    )}
                    {equipment.lighting > 0 && (
                      <span>💡 {equipment.lighting} Lighting Unit{equipment.lighting > 1 ? "s" : ""}</span>
                    )}
                    <span className={styles.commissionMoodTag}>
                      Mood: {currentMood.title}
                    </span>
                  </div>
                </div>

                {/* Contact Form */}
                <div className={styles.commissionFormWrap}>
                  <div className={styles.commissionFormHeader}>
                    <h3 className={styles.commissionFormTitle}>Present Your Commission</h3>
                    <p className={styles.commissionFormSubtitle}>
                      Provide your contact details so founder Phani Gogireddy and our
                      executive team can personally review your brief.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className={styles.commissionForm}>
                    <div className={styles.formGroup}>
                      <label htmlFor="fullName" className={styles.inputLabel}>
                        Full Name <span className={styles.reqStar}>*</span>
                      </label>
                      <input
                        id="fullName"
                        type="text"
                        value={fullName}
                        onChange={(e) => {
                          setFullName(e.target.value);
                          if (errors.fullName) setErrors((p) => ({ ...p, fullName: "" }));
                        }}
                        placeholder="e.g. Hrithika Reddy & Abhishek Rao"
                        className={`${styles.input} ${errors.fullName ? styles.inputError : ""}`}
                      />
                      {errors.fullName && <span className={styles.errorText}>{errors.fullName}</span>}
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="email" className={styles.inputLabel}>
                        Email <span className={styles.reqStar}>*</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errors.email) setErrors((p) => ({ ...p, email: "" }));
                        }}
                        placeholder="e.g. contact@family.com"
                        className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
                      />
                      {errors.email && <span className={styles.errorText}>{errors.email}</span>}
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="phone" className={styles.inputLabel}>
                        Phone / WhatsApp <span className={styles.reqStar}>*</span>
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          if (errors.phone) setErrors((p) => ({ ...p, phone: "" }));
                        }}
                        placeholder="e.g. +91 98765 43210"
                        className={`${styles.input} ${errors.phone ? styles.inputError : ""}`}
                      />
                      {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="notes" className={styles.inputLabel}>
                        Additional Notes
                      </label>
                      <textarea
                        id="notes"
                        rows={3}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Tell us about your celebration, rituals, or any special requests..."
                        className={styles.textarea}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={styles.submitBtn}
                    >
                      {isSubmitting ? (
                        <span>TRANSMITTING BRIEF...</span>
                      ) : (
                        <>
                          <span>CONTINUE TO ENQUIRY</span>
                          <span className={styles.btnArrow}>→</span>
                        </>
                      )}
                    </button>
                  </form>

                  <div className={styles.privacyNote}>
                    Strictly confidential · Shared only with the founding team
                  </div>
                </div>
              </div>

              <div className={styles.stageFooterNav}>
                <button onClick={handleBack} className={styles.backBtn} type="button">
                  <span className={styles.backArrowIcon}>←</span>
                  <span>Back</span>
                </button>
              </div>
            </section>
          )}

          {/* ══════════════════════════════════════════════════════════
             STAGE 4 — SUBMITTED: CONFIRMATION
             ══════════════════════════════════════════════════════════ */}
          {stage === 4 && isSubmitted && (
            <section className={styles.confirmationSection} aria-label="Commission Submitted">
              <div className={styles.confirmationCard}>
                <div className={styles.confirmationHeader}>
                  <div className={styles.sealWrap}>
                    <span className={styles.sealCheck}>✓</span>
                  </div>
                  <span className={styles.confirmEyebrow}>COMMISSION BRIEF REGISTERED</span>
                  <h1 className={styles.confirmTitle}>
                    Thank you, {fullName || "Distinguished Patron"}.
                  </h1>
                  <p className={styles.confirmSubtitle}>
                    Your equipment configuration and production brief have been composed. 
                    Dispatch it directly to Phani Gogireddy via WhatsApp to begin your collaboration.
                  </p>
                </div>

                <div className={styles.confirmSummary}>
                  <div className={styles.confirmRow}>
                    <span className={styles.confirmLabel}>Equipment Crew:</span>
                    <span className={styles.confirmValue}>
                      {totalEquipment} unit{totalEquipment !== 1 ? "s" : ""} configured
                    </span>
                  </div>
                  <div className={styles.confirmRow}>
                    <span className={styles.confirmLabel}>Visual Mood:</span>
                    <span className={styles.confirmValue}>{currentMood.title}</span>
                  </div>
                  <div className={styles.confirmRow}>
                    <span className={styles.confirmLabel}>Contact:</span>
                    <span className={styles.confirmValue}>
                      {email} · {phone}
                    </span>
                  </div>
                </div>

                <div className={styles.confirmActions}>
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.whatsappBtn}
                  >
                    <span>DISPATCH VIA WHATSAPP</span>
                    <span className={styles.btnArrow}>↗</span>
                  </a>

                  <Link href="/" className={styles.returnBtn}>
                    <span>RETURN TO 24 FRAMES</span>
                  </Link>
                </div>

                <p className={styles.confirmClosing}>
                  "From reel to real, every dream pursued with heart becomes a timeless shot."
                  <br />
                  <strong>— Phani Gogireddy, Managing Director</strong>
                </p>
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
