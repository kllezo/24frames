"use client";

/* Small, typed form helpers for the admin editors. */

import base from "../studio.module.css";
import styles from "../admin.module.css";

export function Text({
  label,
  value,
  onChange,
  wide,
  placeholder,
  maxLength = 200,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  wide?: boolean;
  placeholder?: string;
  maxLength?: number;
}) {
  return (
    <label className={`${base.field} ${wide ? styles.wide : ""}`}>
      <span className={base.fieldLabel}>{label}</span>
      <input className={base.input} value={value} placeholder={placeholder} maxLength={maxLength} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

export function Area({ label, value, onChange, rows = 3 }: { label: string; value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <label className={`${base.field} ${styles.wide}`}>
      <span className={base.fieldLabel}>{label}</span>
      <textarea className={base.textarea} rows={rows} value={value} maxLength={4000} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

/** A list of strings edited one per line. */
export function Lines({ label, value, onChange, rows = 4 }: { label: string; value: string[]; onChange: (v: string[]) => void; rows?: number }) {
  return (
    <label className={`${base.field} ${styles.wide}`}>
      <span className={base.fieldLabel}>{label} <small>(one per line)</small></span>
      <textarea
        className={base.textarea}
        rows={rows}
        value={value.join("\n")}
        onChange={(e) => onChange(e.target.value.split("\n").map((l) => l.replace(/\s+$/, "")))}
        onBlur={(e) => onChange(e.target.value.split("\n").map((l) => l.trim()).filter(Boolean))}
      />
    </label>
  );
}

export function Num({
  label,
  value,
  onChange,
  step = 1,
  min = 0,
  nullable = false,
  suffix,
}: {
  label: string;
  value: number | null;
  onChange: (v: number | null) => void;
  step?: number;
  min?: number;
  nullable?: boolean;
  suffix?: string;
}) {
  return (
    <label className={base.field}>
      <span className={base.fieldLabel}>{label}{suffix ? <small> {suffix}</small> : null}</span>
      <input
        className={base.input}
        type="number"
        step={step}
        min={min}
        value={value ?? ""}
        placeholder={nullable ? "None" : undefined}
        onChange={(e) => {
          if (e.target.value === "") return onChange(nullable ? null : 0);
          const n = Number(e.target.value);
          if (Number.isFinite(n)) onChange(n);
        }}
      />
    </label>
  );
}

export function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className={`${base.field} ${base.checkField}`}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span>{label}</span>
    </label>
  );
}

export function Select<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <label className={base.field}>
      <span className={base.fieldLabel}>{label}</span>
      <select className={base.input} value={value} onChange={(e) => onChange(e.target.value as T)}>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  );
}
