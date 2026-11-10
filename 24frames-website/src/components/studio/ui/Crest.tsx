/* The 24 Frames crest: a small crown over a laurel wreath around the
   numeral. Drawn in SVG so it stays crisp at any size; the laurel
   leaves are placed along two arcs in code. Decorative only. */

const LEAVES = 9;

function leaves(side: 1 | -1) {
  const out: { x: number; y: number; r: number }[] = [];
  for (let i = 0; i < LEAVES; i++) {
    // Arc from the bottom stem (angle 100°) up the side to ~ -20°.
    const t = i / (LEAVES - 1);
    const a = ((100 - t * 125) * Math.PI) / 180;
    const x = 60 + side * Math.cos(a) * 40;
    const y = 64 + Math.sin(a) * 40;
    // Long axis follows the arc, tipped slightly outward like a laurel.
    const deg = 100 - t * 125;
    const r = side === 1 ? deg - 18 : -deg + 18;
    out.push({ x: +x.toFixed(2), y: +y.toFixed(2), r: +r.toFixed(1) });
  }
  return out;
}

const LEFT = leaves(-1);
const RIGHT = leaves(1);

export default function Crest({ className, numeral }: { className?: string; numeral?: string }) {
  // The studio's own mark wherever the brand is meant; the laurel monogram
  // is kept only for a couple's initials (the invitation card).
  if (!numeral) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img className={`${className ?? ""} studio-logo-mark`} src="/images/logo-dark-header.png" alt="" aria-hidden="true" data-logo-mark />
    );
  }
  return (
    <svg className={className} viewBox="0 0 120 120" aria-hidden="true" focusable="false">
      <g fill="none" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round">
        {/* crown */}
        <path d="M44 22 L48 10 L54 18 L60 6 L66 18 L72 10 L76 22 Z" />
        <path d="M44 22 H76" />
        <path d="M45.5 25.5 H74.5" />
        <circle cx="48" cy="9" r="1.4" fill="currentColor" />
        <circle cx="60" cy="5" r="1.6" fill="currentColor" />
        <circle cx="72" cy="9" r="1.4" fill="currentColor" />
        {/* wreath stems */}
        <path d="M53 104 C 30 96, 18 76, 22 50" />
        <path d="M67 104 C 90 96, 102 76, 98 50" />
        <path d="M53 104 L60 108 L67 104" />
        {/* rings */}
        <circle cx="60" cy="64" r="28" />
        <circle cx="60" cy="64" r="25" strokeWidth="0.5" />
      </g>
      <g fill="currentColor" opacity="0.9">
        {[...LEFT, ...RIGHT].map((l, i) => (
          <ellipse key={i} cx={l.x} cy={l.y} rx="2.4" ry="6" transform={`rotate(${l.r} ${l.x} ${l.y})`} />
        ))}
      </g>
      <text
        x="60"
        y="73"
        textAnchor="middle"
        fontFamily="var(--serif)"
        fontSize="27"
        fontStyle="italic"
        fill="var(--forest, #0f3d35)"
      >
        {numeral}
      </text>
    </svg>
  );
}
