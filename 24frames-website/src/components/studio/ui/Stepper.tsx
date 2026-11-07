"use client";

import styles from "../studio.module.css";

export default function Stepper({
  value,
  min = 0,
  max,
  onChange,
  label,
  size = "md",
}: {
  value: number;
  min?: number;
  max: number;
  onChange: (n: number) => void;
  label: string;
  size?: "sm" | "md";
}) {
  return (
    <div
      className={`${styles.stepper} ${size === "sm" ? styles.stepperSm : ""} ${value > 0 ? styles.stepperOn : ""}`}
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label={`Fewer — ${label}`}
      >
        <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8h9" /></svg>
      </button>
      <output aria-live="polite" aria-label={`${label}: ${value}`}>{value}</output>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label={`More — ${label}`}
      >
        <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8h9M8 3.5v9" /></svg>
      </button>
    </div>
  );
}
