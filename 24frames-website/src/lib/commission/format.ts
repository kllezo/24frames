/* Formatting helpers — deterministic (no locale/ICU dependence) so the
   browser, the server and the PDF renderer always print identical figures. */

/** 150000 → "1,50,000" (Indian digit grouping). */
export function groupIndian(value: number): string {
  const negative = value < 0;
  const digits = Math.round(Math.abs(value)).toString();
  if (digits.length <= 3) return (negative ? "-" : "") + digits;
  const last3 = digits.slice(-3);
  const rest = digits.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  return (negative ? "-" : "") + rest + "," + last3;
}

/** 150000 → "₹1,50,000" */
export function formatINR(value: number): string {
  return "₹" + groupIndian(value);
}

/** Compact: 150000 → "₹1.5L", 12500000 → "₹1.25Cr" */
export function formatINRCompact(value: number): string {
  if (value >= 1_00_00_000) return `₹${trim(value / 1_00_00_000)}Cr`;
  if (value >= 1_00_000) return `₹${trim(value / 1_00_000)}L`;
  if (value >= 1_000) return `₹${trim(value / 1_000)}K`;
  return formatINR(value);
}

const trim = (n: number) => (Math.round(n * 100) / 100).toString();

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function parseISODate(iso: string): { y: number; m: number; d: number } | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!match) return null;
  return { y: +match[1], m: +match[2], d: +match[3] };
}

/** "2027-02-14" → "14 February 2027" */
export function formatDateLong(iso: string): string {
  const p = parseISODate(iso);
  if (!p) return "";
  return `${p.d} ${MONTHS[p.m - 1]} ${p.y}`;
}

/** "2027-02-14" → "Sunday" */
export function weekdayOf(iso: string): string {
  const p = parseISODate(iso);
  if (!p) return "";
  return WEEKDAYS[new Date(Date.UTC(p.y, p.m - 1, p.d)).getUTCDay()];
}

/** "2027-02-14" → { day: "14", month: "Feb", year: "2027" } */
export function dateParts(iso: string): { day: string; month: string; year: string } | null {
  const p = parseISODate(iso);
  if (!p) return null;
  return { day: String(p.d).padStart(2, "0"), month: MONTHS[p.m - 1].slice(0, 3), year: String(p.y) };
}

/** "18:30" → "6:30 pm" */
export function formatTime(hhmm: string): string {
  const match = /^(\d{1,2}):(\d{2})$/.exec(hhmm);
  if (!match) return "";
  const h = +match[1];
  const suffix = h >= 12 ? "pm" : "am";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${match[2]} ${suffix}`;
}

export function formatTimeRange(start: string, end: string): string {
  const s = formatTime(start);
  const e = formatTime(end);
  if (s && e) return `${s} – ${e}`;
  return s || e || "";
}

/** Duration in hours between two HH:MM strings (handles past-midnight). */
export function durationHours(start: string, end: string): number | null {
  const a = /^(\d{1,2}):(\d{2})$/.exec(start);
  const b = /^(\d{1,2}):(\d{2})$/.exec(end);
  if (!a || !b) return null;
  let mins = +b[1] * 60 + +b[2] - (+a[1] * 60 + +a[2]);
  if (mins <= 0) mins += 24 * 60;
  return Math.round((mins / 60) * 10) / 10;
}

export function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getDate()} ${MONTHS[d.getMonth()].slice(0, 3)} ${d.getFullYear()}, ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX"];
export const roman = (i: number) => ROMAN[i] ?? String(i + 1);

export function plural(n: number, noun: string): string {
  if (n === 1) return `1 ${noun}`;
  if (noun.endsWith("y") && !/[aeiou]y$/.test(noun)) return `${n} ${noun.slice(0, -1)}ies`;
  return `${n} ${noun}s`;
}
