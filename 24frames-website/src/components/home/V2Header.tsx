"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import s from "./chrome.module.css";

const LINKS = [
  { label: "Weddings", href: "#weddings" },
  { label: "Experience", href: "#experience" },
  { label: "Stories", href: "/stories" },
  { label: "The Artist", href: "#artist" },
];

/* Header for the redesigned homepage: transparent with a white logo over
   the hero, ivory with the ink logo once the page moves on. */
export default function V2Header() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const update = () => {
      const hero = document.getElementById("hero");
      const bottom = hero ? hero.getBoundingClientRect().bottom : 0;
      setSolid(bottom < 80);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <header className={`${s.header} ${solid || open ? s.solid : ""}`} role="banner">
      <a href="#hero" className={s.logo} aria-label="24 Frames — back to top" onClick={() => setOpen(false)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/logo-light-header.webp" alt="24 Frames" className={s.logoLight} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/logo-ink-header.webp" alt="" aria-hidden="true" className={s.logoInk} />
      </a>
      <nav className={s.nav} aria-label="Main">
        {LINKS.map((l) => (
          <a key={l.label} href={l.href} className={s.link}>
            {l.label}
          </a>
        ))}
      </nav>
      <Link href="/inquire" className={s.cta}>
        Inquire
      </Link>
      <button
        type="button"
        className={`${s.burger} ${open ? s.burgerOpen : ""}`}
        aria-expanded={open}
        aria-controls="v2-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((o) => !o)}
      >
        <span />
        <span />
      </button>
      <div id="v2-menu" className={`${s.menu} ${open ? s.menuOpen : ""}`} hidden={!open}>
        {LINKS.map((l) => (
          <a key={l.label} href={l.href} className={s.menuLink} onClick={() => setOpen(false)}>
            {l.label}
          </a>
        ))}
        <Link href="/inquire" className={s.menuCta} onClick={() => setOpen(false)}>
          Begin your enquiry
        </Link>
      </div>
    </header>
  );
}
