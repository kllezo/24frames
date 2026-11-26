import Link from "next/link";
import s from "./MobileStoryStrip.module.css";

/* Phones only: a swipeable row of a few more photographs from the story,
   shown in place of the long description so the Vows reads as pictures
   first. Hidden on tablets and desktops, where the full text has room. */
export default function MobileStoryStrip({ images, href, names }: { images: string[]; href: string; names: string }) {
  return (
    <div className={s.strip} aria-label={`More from ${names}`}>
      {images.map((src) => (
        <Link key={src} href={href} className={s.shot} aria-label={`Open story: ${names}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="" loading="lazy" decoding="async" />
        </Link>
      ))}
    </div>
  );
}
