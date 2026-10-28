"use client";

import styles from "@/app/stories/[slug]/StoryDetail.module.css";

interface Props {
  framesCount: number;
  targetId?: string;
}

export default function StoryExploreStillsButton({
  framesCount,
  targetId = "stills",
}: Props) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (!target) return;

    // Update URL hash without causing page reload or transition trigger
    if (typeof window !== "undefined") {
      window.history.pushState(null, "", `#${targetId}`);

      // Coordinate with Lenis if active on window
      const lenis = (window as unknown as { __lenis?: { scrollTo: (t: HTMLElement | string, opt?: object) => void } }).__lenis;
      if (lenis) {
        lenis.scrollTo(target, { offset: -90 });
      } else {
        const top = target.getBoundingClientRect().top + window.scrollY - 90;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }
  };

  return (
    <a
      href={`#${targetId}`}
      onClick={handleClick}
      className={styles.primaryActionBtn}
      aria-label={`Explore curated stills (${framesCount})`}
    >
      EXPLORE CURATED STILLS ({framesCount}) <span aria-hidden="true">↓</span>
    </a>
  );
}

