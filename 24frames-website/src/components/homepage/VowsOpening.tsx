import Link from "next/link";
import MobileStoryStrip from "./MobileStoryStrip";
import s from "./VowsOpening.module.css";

/* The opening of The Vows — chapter heading set to the left over a
   hairline, one wide photograph of the featured Bellamkonda wedding,
   then a short note about it. */
export default function VowsOpening() {
  return (
    <div className={s.opening} id="vows" data-header-theme="light">
      <header className={s.head}>
        <h2 className={s.title}>
          The <span className={s.cursive}>Vows</span>
        </h2>
        <p className={s.subtitle}>Love, in its truest form.</p>
      </header>
      <div className={s.rule} aria-hidden="true" />

      <Link href="/stories/bellam-srikonda" className={s.frame} aria-label="Bellamkonda Sai Sreenivas & Kavya Reddy — view the story">
        <picture>
          <source type="image/avif" srcSet="/images/v3/stories/bellamkonda-wide.avif" />
          <source type="image/webp" srcSet="/images/v3/stories/bellamkonda-wide.webp" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/v3/stories/bellamkonda-wide.jpg"
            alt="Bellamkonda Sai Sreenivas and Kavya Reddy on their reception stage"
            loading="lazy"
            decoding="async"
          />
        </picture>
      </Link>

      <div className={s.feature}>
        <div>
          <p className={s.kicker}>Featured wedding</p>
          <h3 className={s.names}>
            <Link href="/stories/bellam-srikonda">Bellamkonda Sai Sreenivas &amp; Kavya Reddy</Link>
          </h3>
        </div>
        <div>
          <p className={s.copy}>A grand celebration — and the quiet moments only the two of them shared.</p>
          <MobileStoryStrip
            images={["/images/stories/bellam-srikonda/IMG_6340-mobile.webp", "/images/stories/bellam-srikonda/IMG_6341-mobile.webp", "/images/stories/bellam-srikonda/IMG_6342-mobile.webp", "/images/stories/bellam-srikonda/IMG_6343-mobile.webp"]}
            href="/stories/bellam-srikonda"
            names="Bellamkonda Sai Sreenivas & Kavya Reddy"
          />
          <Link href="/stories/bellam-srikonda" className={s.link}>
            View the story
          </Link>
        </div>
      </div>
    </div>
  );
}
