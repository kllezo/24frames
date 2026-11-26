"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import s from "./ArtistChapter.module.css";
import { VERIFIED_RECOGNITIONS } from "./FounderRecognitionSection";

/* Chapter II — The Artist. An editorial spread rather than a profile card:
   his own words lead, the portrait sits like a print beside a frame he
   made, and the honours read as a quiet typographic index.
   The portrait is a placeholder until the studio sends an on-set photo. */

const STORY_LINES = ["I started 24 Frames in 2016,", "in a small room with two computers", "and one belief —"];

export default function ArtistChapter() {
  const root = useRef<HTMLElement>(null);
  const print = useRef<HTMLDivElement>(null);
  const [preview, setPreview] = useState<number | null>(null);

  /* Reveal on entry + a slow drift on the portrait while scrolling. */
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add(s.in);
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.18 },
    );
    el.querySelectorAll(`.${s.reveal}`).forEach((n) => (reduce ? n.classList.add(s.in) : io.observe(n)));
    if (reduce) return () => io.disconnect();

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const p = Math.max(-1, Math.min(1, (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight));
        print.current?.style.setProperty("--drift", `${(p * 28).toFixed(1)}px`);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <section ref={root} id="artist" className={s.chapter} data-header-theme="light" aria-label="The Artist — Phani Gogireddy">
      <div id="founder" className={s.anchor} aria-hidden="true" />

      {/* Chapter marker */}
      <div className={`${s.marker} ${s.reveal}`}>
        <span className={s.rule} />
        <span className={s.markerText}>
          <i>II</i> The Artist
        </span>
        <span className={s.rule} />
      </div>

      {/* His words, set large */}
      <h2 className={s.statement} aria-label="I started 24 Frames in 2016, in a small room with two computers and one belief — a wedding is the first chapter of a family's legacy.">
        {STORY_LINES.map((line, i) => (
          <span key={line} className={`${s.line} ${s.reveal}`} style={{ transitionDelay: `${i * 140}ms` }} aria-hidden="true">
            {line}
          </span>
        ))}
        <span className={`${s.line} ${s.lineAccent} ${s.reveal}`} style={{ transitionDelay: "420ms" }} aria-hidden="true">
          <em>a wedding is the first chapter of a family&apos;s legacy.</em>
        </span>
      </h2>

      {/* Spread: prints on the left, the letter on the right */}
      <div className={s.spread}>
        <div ref={print} className={`${s.prints} ${s.reveal}`}>
          <figure className={s.behind}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/stories/bellam-srikonda/album/album-02.webp" alt="" loading="lazy" decoding="async" />
          </figure>
          <figure className={s.portrait}>
            <picture>
              <source type="image/avif" srcSet="/images/founder-portrait-mobile.avif 720w, /images/founder-portrait.avif 1200w" sizes="(max-width: 900px) 70vw, 32vw" />
              <source type="image/webp" srcSet="/images/founder-portrait-mobile.webp 720w, /images/founder-portrait.webp 1200w" sizes="(max-width: 900px) 70vw, 32vw" />
              { }
              <img src="/images/founder-portrait.jpg" alt="Phani Gogireddy" loading="lazy" decoding="async" />
            </picture>
            <figcaption>Phani Gogireddy · Hyderabad</figcaption>
          </figure>
        </div>

        <div className={s.letter}>
          <p className={`${s.para} ${s.reveal}`}>
            Ten years and more than a thousand weddings later, that belief still decides every frame. My team and I bring the light,
            framing and patience of Telugu cinema to real celebrations.
          </p>
          <p className={`${s.para} ${s.reveal}`}>
            We take the time to know your families first — so that on the day, it never feels like being photographed.
            It simply feels like your wedding.
          </p>
          <p className={`${s.signature} ${s.reveal}`} aria-label="Signed, Phani Gogireddy and the 24 Frames team">
            Phani Gogireddy
            <span className={s.signTeam}>&amp; the 24 Frames team</span>
          </p>

          <dl className={`${s.figures} ${s.reveal}`}>
            <div>
              <dt>Since</dt>
              <dd>2016</dd>
            </div>
            <div>
              <dt>Weddings</dt>
              <dd>1,000+</dd>
            </div>
            <div>
              <dt>Office, sq. ft.</dt>
              <dd>6,000</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Honours — a typographic index; hover shows the cover */}
      <div className={`${s.honours} ${s.reveal}`}>
        <p className={s.honoursKicker}>Honours &amp; press</p>
        <ol className={s.index} onMouseLeave={() => setPreview(null)}>
          {VERIFIED_RECOGNITIONS.map((r, i) => (
            <li key={r.id} onMouseEnter={() => setPreview(i)} onFocus={() => setPreview(i)}>
              <a href={r.sourceUrl} target="_blank" rel="noopener noreferrer">
                <span className={s.year}>{r.year}</span>
                <span className={s.title}>{r.milestoneTitle}</span>
                <span className={s.body}>{r.conferringBody.split("·")[0].trim()}</span>
              </a>
            </li>
          ))}
        </ol>
        {VERIFIED_RECOGNITIONS.map((r, i) => (
          <div key={r.id} className={`${s.cover} ${preview === i ? s.coverOn : ""}`} aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={r.imageSrc} alt="" loading="lazy" decoding="async" />
          </div>
        ))}
      </div>

      <div className={`${s.cta} ${s.reveal}`}>
        <Link href="/inquire" className={s.ctaLink}>
          Begin your story with Phani
        </Link>
      </div>
    </section>
  );
}
