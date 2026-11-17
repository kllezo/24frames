"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { AlbumFrame, StoryAlbum as Album } from "@/data/storyAlbums";
import s from "./StoryAlbum.module.css";

/* The album: the couple's own edit, laid out like the pages of an heirloom
   book — a single plate given a whole spread, then pairs, then a plate set
   off to one side with its number, with plenty of air between them.
   Every plate opens in a quiet full-screen viewer. */

type Spread = { kind: "single" | "offsetL" | "offsetR" | "pair" | "trio"; frames: { f: AlbumFrame; n: number }[] };

const RHYTHM: Spread["kind"][] = ["single", "pair", "offsetL", "trio", "offsetR", "pair"];
const SIZE: Record<Spread["kind"], number> = { single: 1, offsetL: 1, offsetR: 1, pair: 2, trio: 3 };

function spreads(frames: AlbumFrame[]): Spread[] {
  const out: Spread[] = [];
  let i = 0;
  let r = 0;
  while (i < frames.length) {
    let kind = RHYTHM[r % RHYTHM.length];
    const left = frames.length - i;
    if (SIZE[kind] > left) kind = left === 2 ? "pair" : "single";
    const take = SIZE[kind];
    out.push({ kind, frames: frames.slice(i, i + take).map((f, k) => ({ f, n: i + k + 1 })) });
    i += take;
    r++;
  }
  return out;
}

const plate = (n: number) => `Plate ${String(n).padStart(2, "0")}`;

export default function StoryAlbum({ album, couple }: { album: Album; couple: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const groups = useMemo(() => spreads(album.frames), [album.frames]);
  const total = album.frames.length;

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback((d: number) => setOpen((o) => (o === null ? o : (o + d + total) % total)), [total]);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = prev;
    };
  }, [open, close, step]);

  const Img = ({ f, n, eager = false }: { f: AlbumFrame; n: number; eager?: boolean }) => (
    <button type="button" className={s.plate} onClick={() => setOpen(n - 1)} aria-label={`Open ${plate(n)} of ${total}`}>
      <picture>
        <source type="image/webp" srcSet={f.webp} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={f.src} alt={`${couple} — ${plate(n)}`} width={f.w} height={f.h} loading={eager ? "eager" : "lazy"} decoding="async" />
      </picture>
    </button>
  );

  return (
    <section className={s.album} id="album" aria-label={`${couple} — the album`}>
      <header className={s.head}>
        <p className={s.kicker}>{album.kicker}</p>
        <h2 className={s.title}>{album.title}</h2>
        <span className={s.rule} aria-hidden="true" />
        <p className={s.intro}>{album.intro}</p>
        <p className={s.count}>
          {total} plates{album.film ? " · one film" : ""}
        </p>
      </header>

      {album.film && (
        <figure className={s.film}>
          <video src={album.film} autoPlay muted loop playsInline preload="metadata" aria-label={`${couple} — a moment in motion`} />
          <figcaption>In motion</figcaption>
        </figure>
      )}

      <div className={s.pages}>
        {groups.map((g, gi) => (
          <div key={gi} className={`${s.spread} ${s[g.kind]}`}>
            {g.frames.map(({ f, n }) => (
              <figure key={n} className={s.fig}>
                <Img f={f} n={n} eager={gi === 0} />
                <figcaption className={s.cap}>{plate(n)}</figcaption>
              </figure>
            ))}
            {(g.kind === "offsetL" || g.kind === "offsetR") && (
              <p className={s.aside}>
                <span>{plate(g.frames[0].n)}</span>
                <em>{couple}</em>
              </p>
            )}
          </div>
        ))}
      </div>

      {open !== null && (
        <div className={s.viewer} role="dialog" aria-modal="true" aria-label={`${plate(open + 1)} of ${total}`} onClick={close}>
          <button type="button" className={s.vClose} onClick={close} aria-label="Close">
            Close
          </button>
          <button type="button" className={`${s.vNav} ${s.vPrev}`} onClick={(e) => (e.stopPropagation(), step(-1))} aria-label="Previous plate">
            ←
          </button>
          <picture onClick={(e) => e.stopPropagation()}>
            <source type="image/webp" srcSet={album.frames[open].webp} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={s.vImg} src={album.frames[open].src} alt={`${couple} — ${plate(open + 1)}`} />
          </picture>
          <button type="button" className={`${s.vNav} ${s.vNext}`} onClick={(e) => (e.stopPropagation(), step(1))} aria-label="Next plate">
            →
          </button>
          <p className={s.vCount}>
            {plate(open + 1)} <span>/ {total}</span>
          </p>
        </div>
      )}
    </section>
  );
}
