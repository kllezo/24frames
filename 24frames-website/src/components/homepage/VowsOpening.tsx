import Link from "next/link";
import s from "./VowsOpening.module.css";

/* The opening of The Vows — the chapter title, a line about the work and
   the featured Bellamkonda wedding — as a calm, static composition
   (it used to live inside the pinned hero-to-logo transition). */
export default function VowsOpening() {
  return (
    <div className={s.opening} id="vows" data-header-theme="light">
      <div className={s.intro}>
        <p className={s.kicker}>The Vows</p>
        <h2 className={s.title}>
          Love, in its <em>truest form.</em>
        </h2>
        <p className={s.lead}>
          Intimate stories and iconic days — real people, photographed honestly and filmed with a cinematographer&apos;s
          patience.
        </p>
        <a href="#stories-showcase" className={s.link}>
          Explore the stories
        </a>
      </div>

      <Link href="/stories/bellam-srikonda" className={s.arch} aria-label="Bellamkonda Sai Sreenivas & Kavya Reddy — view the story">
        <picture>
          <source
            type="image/avif"
            srcSet="/images/stories/bellam-srikonda/IMG_6339-mobile.avif 720w, /images/stories/bellam-srikonda/IMG_6339.avif 1108w"
            sizes="(max-width: 900px) 80vw, 30vw"
          />
          <source
            type="image/webp"
            srcSet="/images/stories/bellam-srikonda/IMG_6339-mobile.webp 720w, /images/stories/bellam-srikonda/IMG_6339.webp 1108w"
            sizes="(max-width: 900px) 80vw, 30vw"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/stories/bellam-srikonda/IMG_6339.jpg"
            alt="Bellamkonda Sai Sreenivas and Kavya Reddy at their reception"
            loading="lazy"
            decoding="async"
          />
        </picture>
      </Link>

      <div className={s.feature}>
        <p className={s.kicker}>Featured wedding</p>
        <h3 className={s.names}>
          <Link href="/stories/bellam-srikonda">Bellamkonda Sai Sreenivas &amp; Kavya Reddy</Link>
        </h3>
        <p className={s.venue}>GMR Arena &amp; Shamshabad Estate, Hyderabad</p>
        <p className={s.copy}>
          The quiet, overwhelming union of two people, set against the grandeur of a celebration — and every personal
          moment in between, captured with honesty and cinematic depth.
        </p>
        <Link href="/stories/bellam-srikonda" className={s.link}>
          View the story
        </Link>
      </div>
    </div>
  );
}
