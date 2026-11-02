"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./Navigation.module.css";

const NAV_LINKS = [
  { label: "The Vows", href: "/#vows" },
  { label: "The Collection", href: "/#collection" },
  { label: "Stories", href: "/stories" },
  { label: "The Artist", href: "/#artist" },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [isLightSection, setIsLightSection] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const scrolledRef = useRef(false);
  const isLightRef = useRef(false);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    let cachedHeroHeight = 0;
    const measureHero = () => {
      const heroEl = document.getElementById("hero");
      if (heroEl) {
        cachedHeroHeight = heroEl.offsetHeight;
      }
    };
    measureHero();

    const updateNavigation = () => {
      const scrollY = window.scrollY;
      const isNowScrolled = scrollY > 50;

      if (scrolledRef.current !== isNowScrolled) {
        scrolledRef.current = isNowScrolled;
        setScrolled(isNowScrolled);
      }

      // Fast direct DOM update for scroll progress bar (zero React re-renders during active scroll)
      if (progressBarRef.current) {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = totalHeight > 0 ? Math.min(1, Math.max(0, scrollY / totalHeight)) : 0;
        progressBarRef.current.style.transform = `scaleX(${progress})`;
      }

      // Check current section under navigation header (~45px from top)
      const explicitHeroTheme = document.documentElement.dataset.heroHeaderTheme;
      const heroEl = document.getElementById("hero");
      let nextIsLight = isLightRef.current;

      if (heroEl && explicitHeroTheme && scrollY < (cachedHeroHeight || heroEl.offsetHeight) - 70) {
        nextIsLight = explicitHeroTheme === "light";
      } else {
        const navHeader = document.querySelector('header[role="banner"]');
        const elements = document.elementsFromPoint(window.innerWidth / 2, 45);
        const target = elements.find((el) => el !== navHeader && !navHeader?.contains(el));

        if (target) {
          const themedAncestor = target.closest("[data-header-theme]");
          if (themedAncestor) {
            nextIsLight = themedAncestor.getAttribute("data-header-theme") === "light";
          } else {
            let curr: Element | null = target;
            let foundBg = false;
            while (curr && curr !== document.documentElement) {
              const bg = window.getComputedStyle(curr).backgroundColor;
              if (bg && bg !== "transparent" && bg !== "rgba(0, 0, 0, 0)") {
                const match = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
                if (match) {
                  const r = parseInt(match[1], 10);
                  const g = parseInt(match[2], 10);
                  const b = parseInt(match[3], 10);
                  const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
                  nextIsLight = brightness >= 135;
                  foundBg = true;
                  break;
                }
              }
              curr = curr.parentElement;
            }
            if (!foundBg) {
              nextIsLight = true;
            }
          }
        } else {
          nextIsLight = true;
        }
      }

      if (isLightRef.current !== nextIsLight) {
        isLightRef.current = nextIsLight;
        setIsLightSection(nextIsLight);
      }
    };

    const handleScroll = () => {
      if (rafIdRef.current !== null) return;
      rafIdRef.current = requestAnimationFrame(() => {
        rafIdRef.current = null;
        updateNavigation();
      });
    };

    const handleResize = () => {
      measureHero();
      updateNavigation();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });
    updateNavigation();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`${styles.header} ${scrolled ? styles.scrolled : ""} ${
          isLightSection ? styles.themeLight : styles.themeDark
        }`}
        role="banner"
      >
        {/* Scroll Progress Bar */}
        <div
          ref={progressBarRef}
          className={styles.progressBar}
          style={{ transform: "scaleX(0)" }}
          aria-hidden="true"
        />

        <nav className={styles.nav} aria-label="Main navigation">
          <Link href="/" className={styles.logo} aria-label="24 Frames Photography — Home">
            <picture className={styles.logoPicture}>
              <source srcSet="/images/logo-dark-header.avif" type="image/avif" />
              <source srcSet="/images/logo-dark-header.webp" type="image/webp" />
              <img
                src="/images/logo-dark-header.png"
                alt="24 Frames — Phani Gogireddy"
                className={`${styles.logoImg} ${styles.logoImgDark}`}
                decoding="async"
              />
            </picture>
            <picture className={styles.logoPicture}>
              <source srcSet="/images/logo-light-header.avif" type="image/avif" />
              <source srcSet="/images/logo-light-header.webp" type="image/webp" />
              <img
                src="/images/logo-light-header.png"
                alt="24 Frames — Phani Gogireddy"
                className={`${styles.logoImg} ${styles.logoImgLight}`}
                decoding="async"
              />
            </picture>
          </Link>

          <ul className={styles.links}>
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} className={styles.link}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <Link href="/inquire" className={styles.cta}>
            Inquire
          </Link>

          <button
            className={`${styles.burger} ${menuOpen ? styles.burgerOpen : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            <span className={styles.burgerLine} />
            <span className={styles.burgerLine} />
          </button>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        id="mobile-menu"
        className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ""}`}
        aria-hidden={!menuOpen}
      >
        <nav className={styles.mobileNav} aria-label="Mobile navigation">
          <ul className={styles.mobileLinks}>
            {NAV_LINKS.map((link, i) => (
              <li
                key={link.href}
                className={styles.mobileLinkItem}
                style={{ transitionDelay: `${(i + 1) * 80}ms` }}
              >
                <a
                  href={link.href}
                  className={styles.mobileLink}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li
              className={styles.mobileLinkItem}
              style={{ transitionDelay: `${(NAV_LINKS.length + 1) * 80}ms` }}
            >
              <Link
                href="/inquire"
                className={`${styles.mobileLink} ${styles.mobileLinkCta}`}
                onClick={() => setMenuOpen(false)}
              >
                Inquire
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}
