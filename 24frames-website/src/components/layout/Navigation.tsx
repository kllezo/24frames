"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Navigation.module.css";

const NAV_LINKS = [
  { label: "The Vows", href: "/#vows" },
  { label: "The Collection", href: "/#collection" },
  { label: "Stories", href: "/stories" },
  { label: "The Artist", href: "/#artist" },
];

export default function Navigation() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [isLightSection, setIsLightSection] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const scrolledRef = useRef(false);
  const isLightRef = useRef(false);

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    setMenuOpen(false);

    const isHome = pathname === "/" || pathname === "";
    if (isHome) {
      e.preventDefault();

      // Clear any hash in URL without full reload
      if (window.location.hash) {
        try {
          history.pushState(null, "", window.location.pathname);
        } catch {
          // ignore
        }
      }

      // Reset hero dataset attributes to opening state
      document.documentElement.dataset.heroStage = "hero-active";
      document.documentElement.dataset.heroHeaderTheme = "dark";

      // Smooth scroll to absolute top (0)
      const lenis = (
        window as unknown as {
          __lenis?: {
            scrollTo: (
              target: number,
              options?: { duration?: number; immediate?: boolean }
            ) => void;
          };
        }
      ).__lenis;

      if (lenis?.scrollTo) {
        lenis.scrollTo(0, { duration: 1.0 });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }

      window.dispatchEvent(new Event("scroll"));
    }
  };

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
      const heroEl = document.getElementById("hero");
      const heroSpacer = heroEl ? (heroEl.closest(".pin-spacer") as HTMLElement | null) || heroEl : null;
      const heroBottom = heroSpacer ? heroSpacer.getBoundingClientRect().bottom : 0;
      const heroStage = document.documentElement.dataset.heroStage;
      const isVowsHash = typeof window !== "undefined" && window.location.hash === "#vows";

      let isNowScrolled = false;
      let nextIsLight = isLightRef.current;

      if (heroEl && heroBottom > 70) {
        // Controlled Single Header Transition on Homepage:
        // Phase 1 (scrollY < 260px): While 24 FRAMES hero logo is visible,
        // header is completely colourless / transparent (no background, no borders, no flashing).
        // Phase 2 (scrollY >= 260px or #vows): Only after hero logo exits and warm ivory arrives,
        // transition smoothly into solid warm ivory background matching The Vows.
        const isMobile = window.innerWidth < 820;
        const heroExitThreshold = isMobile ? window.innerHeight * 0.75 : window.innerHeight * 0.95;
        const isAtHeroTop = scrollY < 50;
        const heroExited = isVowsHash || (!isAtHeroTop && (scrollY >= heroExitThreshold || heroStage === "hero-exited"));

        if (heroExited) {
          isNowScrolled = true;
          nextIsLight = true;
        } else {
          isNowScrolled = false;
          nextIsLight = false; // crisp white branding over dark hero and green backdrop
        }
      } else {
        // Standard scroll behavior for other pages or below homepage hero
        isNowScrolled = scrollY > 50;

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

      if (isLightRef.current !== nextIsLight) {
        isLightRef.current = nextIsLight;
        setIsLightSection(nextIsLight);
      }
    };

    const handleScroll = () => {
      updateNavigation();
    };

    const handleResize = () => {
      measureHero();
      updateNavigation();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("hashchange", updateNavigation);
    updateNavigation();
    const t1 = setTimeout(updateNavigation, 250);
    const t2 = setTimeout(updateNavigation, 500);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("hashchange", updateNavigation);
      clearTimeout(t1);
      clearTimeout(t2);
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
          <Link
            href="/"
            className={styles.logo}
            aria-label="Go to homepage"
            onClick={handleLogoClick}
          >
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
