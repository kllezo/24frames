"use client";

/* A count you can type into as well as step: tap it, type a number,
   press Return or tap away. Clamped to min..max; anything else reverts. */
export const MAX_QTY = 99;

export default function QtyInput({
  value,
  onChange,
  label,
  className,
  min = 0,
  max = MAX_QTY,
}: {
  value: number;
  onChange: (n: number) => void;
  label: string;
  className?: string;
  min?: number;
  max?: number;
}) {
  function commit(el: HTMLInputElement) {
    const n = Number.parseInt(el.value.replace(/\D/g, ""), 10);
    if (!Number.isFinite(n)) {
      el.value = String(value);
      return;
    }
    const v = Math.max(min, Math.min(max, n));
    el.value = String(v);
    if (v !== value) onChange(v);
  }
  return (
    <input
      key={value}
      className={className}
      defaultValue={value}
      inputMode="numeric"
      pattern="[0-9]*"
      maxLength={2}
      aria-label={label}
      onFocus={(e) => e.currentTarget.select()}
      onBlur={(e) => commit(e.currentTarget)}
      onKeyDown={(e) => {
        if (e.key === "Enter") e.currentTarget.blur();
        if (e.key === "Escape") { e.currentTarget.value = String(value); e.currentTarget.blur(); }
      }}
    />
  );
}
