"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./Navigation.module.css";

const NAV_LINKS = [
  { label: "The Vows", href: "/#vows" },
  { label: "24 Frames", href: "/identity" },
  { label: "The Artist", href: "/#artist" },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isLightSection, setIsLightSection] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 50);

      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress(Math.min(1, Math.max(0, scrollY / totalHeight)));
      }

      // Check current section under navigation header (~70px from top)
      const navTarget = document.elementFromPoint(window.innerWidth / 2, 70);
      if (navTarget) {
        const obsidianAncestor = navTarget.closest('[data-theme="obsidian"]');
        setIsLightSection(!obsidianAncestor);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
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
          isLightSection && scrolled ? styles.themeLight : styles.themeDark
        }`}
        role="banner"
      >
        {/* Scroll Progress Bar */}
        <div
          className={styles.progressBar}
          style={{ transform: `scaleX(${scrollProgress})` }}
          aria-hidden="true"
        />

        <nav className={styles.nav} aria-label="Main navigation">
          <Link href="/" className={styles.logo} aria-label="24 Frames — Home">
            <span className={styles.logoMark}>24</span>
            <span className={styles.logoText}>Frames</span>
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

          <Link href="/#inquire" className={styles.cta}>
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
                href="/#inquire"
                className={`${styles.mobileLink} ${styles.mobileLinkCta}`}
                onClick={() => setMenuOpen(false)}
              >
                Begin Your Story
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}
