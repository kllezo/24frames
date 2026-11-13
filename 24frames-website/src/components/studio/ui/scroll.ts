/* Scrolling helpers that cooperate with the studio's Lenis instance
   (falls back to native scrolling when Lenis is off, e.g. reduced motion). */

type StudioLenis = {
  scrollTo: (target: number | HTMLElement, opts?: { offset?: number; immediate?: boolean; duration?: number; force?: boolean }) => void;
  stop: () => void;
  start: () => void;
  isStopped: boolean;
};

const lenis = () => (window as unknown as { __studioLenis?: StudioLenis }).__studioLenis;

/* Jump to the top of a new stage. A wheel glide still in flight would
   otherwise carry on to its old target and drop the reader at the bottom
   of the next stage, so the glide is cancelled first and the top is held
   for two frames. */
export function scrollToTop() {
  const l = lenis();
  const pin = () => {
    if (l) l.scrollTo(0, { immediate: true, force: true });
    window.scrollTo({ top: 0, behavior: "auto" });
  };
  if (l) {
    const wasStopped = l.isStopped;
    l.stop();
    pin();
    if (!wasStopped) l.start();
  }
  pin();
  requestAnimationFrame(() => {
    pin();
    requestAnimationFrame(pin);
  });
}

export function scrollToElement(el: HTMLElement | null | undefined, offset = -90) {
  if (!el) return;
  const l = lenis();
  if (l) l.scrollTo(el, { offset, duration: 1.6 });
  else el.scrollIntoView({ behavior: "smooth", block: "start" });
}
