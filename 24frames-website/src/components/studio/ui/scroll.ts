/* Scrolling helpers that cooperate with the studio's Lenis instance
   (falls back to native scrolling when Lenis is off, e.g. reduced motion). */

type StudioLenis = {
  scrollTo: (target: number | HTMLElement, opts?: { offset?: number; immediate?: boolean; duration?: number }) => void;
};

const lenis = () => (window as unknown as { __studioLenis?: StudioLenis }).__studioLenis;

export function scrollToTop() {
  const l = lenis();
  if (l) l.scrollTo(0, { immediate: true });
  else window.scrollTo({ top: 0, behavior: "auto" });
}

export function scrollToElement(el: HTMLElement | null | undefined, offset = -90) {
  if (!el) return;
  const l = lenis();
  if (l) l.scrollTo(el, { offset, duration: 1.6 });
  else el.scrollIntoView({ behavior: "smooth", block: "start" });
}
