/* Slow-drifting motes of gilded light. Positions are derived from the
   index (no randomness), so server and client render identically. */
const COUNT = 16;

export default function Motes({ className }: { className?: string }) {
  return (
    <div className={className} aria-hidden="true">
      {Array.from({ length: COUNT }, (_, i) => {
        const left = (i * 37 + 11) % 100;
        const top = (i * 53 + 7) % 100;
        const size = 2 + ((i * 7) % 5);
        const dur = 14 + ((i * 11) % 12);
        const delay = -((i * 13) % 20);
        return (
          <i
            key={i}
            style={{
              left: `${left}%`,
              top: `${top}%`,
              width: size,
              height: size,
              animationDuration: `${dur}s`,
              animationDelay: `${delay}s`,
            }}
          />
        );
      })}
    </div>
  );
}
