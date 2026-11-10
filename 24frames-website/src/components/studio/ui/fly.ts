/* Add-to-folio flourish: a copy of the photo glides into the bill button,
   which answers with a small pulse. Purely decorative. */
export function flyToFolio(source: HTMLElement | null) {
  if (!source || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const target = document.querySelector<HTMLElement>('aside[aria-label="Live commission estimate"] button');
  if (!target) return;
  const a = source.getBoundingClientRect();
  const b = target.getBoundingClientRect();
  const ghost = source.cloneNode(true) as HTMLElement;
  Object.assign(ghost.style, {
    position: "fixed",
    left: `${a.left}px`,
    top: `${a.top}px`,
    width: `${a.width}px`,
    height: `${a.height}px`,
    margin: "0",
    zIndex: "200",
    pointerEvents: "none",
    objectFit: "cover",
    borderRadius: "4px",
    boxShadow: "0 30px 60px -20px rgba(16,48,42,0.5)",
  });
  document.body.appendChild(ghost);
  const dx = b.left + b.width / 2 - (a.left + a.width / 2);
  const dy = b.top + b.height / 2 - (a.top + a.height / 2);
  const anim = ghost.animate(
    [
      { transform: "translate(0,0) scale(1)", opacity: 1, borderRadius: "4px" },
      { transform: `translate(${dx * 0.5}px, ${dy * 0.5 - 120}px) scale(0.45)`, opacity: 0.95, offset: 0.55 },
      { transform: `translate(${dx}px, ${dy}px) scale(0.06)`, opacity: 0.2, borderRadius: "50%" },
    ],
    { duration: 900, easing: "cubic-bezier(0.55, 0, 0.25, 1)" },
  );
  anim.onfinish = () => {
    ghost.remove();
    target.animate(
      [{ transform: "scale(1)" }, { transform: "scale(1.07)" }, { transform: "scale(1)" }],
      { duration: 450, easing: "cubic-bezier(0.16, 1, 0.3, 1)" },
    );
  };
}
