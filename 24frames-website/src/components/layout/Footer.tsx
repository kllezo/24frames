"use client";

import Link from "next/link";
import styles from "./Footer.module.css";

const EXPLORE_LINKS = [
  { label: "The Vows", href: "/#vows" },
  { label: "The Collection", href: "/#collection" },
  { label: "Stories", href: "/stories" },
  { label: "The Artist", href: "/artist" },
  { label: "Client Gallery", href: "/client-gallery" },
];

interface FooterProps {
  hideCommissionCta?: boolean;
}

export default function Footer({ hideCommissionCta = false }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const handleScrollToTop = () => {
    if (typeof window !== "undefined") {
      const lenis = (
        window as unknown as {
          __lenis?: {
            scrollTo: (
              target: number | string | HTMLElement,
              options?: { duration?: number }
            ) => void;
          };
        }
      ).__lenis;

      if (lenis) {
        lenis.scrollTo(0, { duration: 1.2 });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.container}>
        {/* ── 1. MONUMENTAL BRAND HEADER ROW ── */}
        <div className={styles.topRow}>
          {/* Huge condensed 24 FRAMES title */}
          <div className={styles.brandTitleBlock}>
            <h1 className={styles.monumentalLogo}>24 FRAMES</h1>
          </div>

          {/* Right statement column */}
          <div className={styles.statementCol}>
            <p className={styles.editorialQuote}>
              Stories made
              <br />
              to <span className={styles.editorialQuoteItalic}>outlive time.</span>
            </p>
            <div className={styles.quoteDivider} aria-hidden="true" />
            <span className={styles.brandMotto}>PEOPLE · FILMS · LEGACIES</span>
          </div>
        </div>

        {/* ── 2. FIVE-COLUMN EDITORIAL ARCHIVE MATRIX ── */}
        <div className={styles.columnsGrid}>
          {/* Column 01 — CONTACT */}
          <div className={styles.gridCol}>
            <div className={styles.colHeader}>
              <span className={styles.colNum}>01 —</span>
              <span className={styles.colTitle}>CONTACT</span>
            </div>
            <div className={styles.colContent}>
              <a
                href="mailto:hello@24framesphotography.com"
                className={styles.emailBigLink}
              >
                <span>Email</span>
                <span className={styles.emailArrow} aria-hidden="true">
                  →
                </span>
              </a>
              <a
                href="mailto:hello@24framesphotography.com"
                className={styles.contactEmail}
              >
                hello@24framesphotography.com
              </a>
              <a href="tel:+919014433074" className={styles.contactPhone}>
                +91 90144 33074
              </a>
            </div>
          </div>

          {/* Column 02 — EXPLORE */}
          <div className={styles.gridCol}>
            <div className={styles.colHeader}>
              <span className={styles.colNum}>02 —</span>
              <span className={styles.colTitle}>EXPLORE</span>
            </div>
            <nav className={styles.colContent} aria-label="Explore Archive">
              <ul className={styles.navList}>
                {EXPLORE_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={styles.navLink}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Column 03 — STUDIO ATELIER */}
          <div className={styles.gridCol}>
            <div className={styles.colHeader}>
              <span className={styles.colNum}>03 —</span>
              <span className={styles.colTitle}>STUDIO ATELIER</span>
            </div>
            <address className={styles.colContent}>
              <p className={styles.studioName}>24 Frames Creative Studio</p>
              <a
                href="https://maps.app.goo.gl/ttz9jqZsHW9cSJdt9"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.studioAddressLink}
                aria-label="View 24 Frames Studio Atelier on Google Maps"
              >
                <span className={styles.studioLine}>Jubilee Hills, Hyderabad</span>
                <span className={styles.studioLine}>Telangana 500033, India</span>
                <span className={styles.studioMapBadge}>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={styles.mapPinSvg}
                    aria-hidden="true"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>VIEW ON MAP ↗</span>
                </span>
              </a>
              <div className={styles.studioSeparator} aria-hidden="true" />
              <p className={styles.studioConsult}>
                Private consultations
                <br />
                by bespoke appointment.
              </p>
            </address>
          </div>

          {/* Column 04 — CONNECT */}
          <div className={styles.gridCol}>
            <div className={styles.colHeader}>
              <span className={styles.colNum}>04 —</span>
              <span className={styles.colTitle}>CONNECT</span>
            </div>
            <div className={styles.colContent}>
              <ul className={styles.socialList}>
                <li>
                  <a
                    href="https://www.instagram.com/24framesphotography_official/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialLink}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={styles.socialSvg}
                      aria-hidden="true"
                    >
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                    <span>Instagram</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://youtube.com/@24framesphotography"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialLink}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={styles.socialSvg}
                      aria-hidden="true"
                    >
                      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                      <polygon
                        points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"
                        fill="currentColor"
                      />
                    </svg>
                    <span>YouTube</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://wa.me/919014433074"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialLink}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={styles.socialSvg}
                      aria-hidden="true"
                    >
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                    </svg>
                    <span>WhatsApp</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Column 05 — BEGIN A COMMISSION */}
          <div className={styles.gridCol}>
            <div className={styles.colHeader}>
              <span className={styles.colNum}>05 —</span>
              <span className={styles.colTitle}>BEGIN A COMMISSION</span>
            </div>
            <div className={styles.colContent}>
              {hideCommissionCta ? (
                <span className={styles.closingRefinedNote}>YOUR STORY, CONSIDERED.</span>
              ) : (
                <Link href="/inquire" className={styles.commissionPillBtn}>
                  <span className={styles.commissionBtnText}>BEGIN A COMMISSION</span>
                  <span
                    className={styles.commissionCircleBadge}
                    aria-hidden="true"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* ── 3. BOTTOM SUB-FOOTER LINE & CREST DIVIDER ── */}
        <div className={styles.bottomCrestDivider} aria-hidden="true">
          <span className={styles.bottomCrestLine} />
          <div className={styles.bottomCrestCenter}>
            <span className={styles.bottomStar}>✦</span>
            <span className={styles.bottomCrestText}>PEOPLE · FILMS · LEGACIES</span>
          </div>
          <span className={styles.bottomCrestLine} />
        </div>

        <div className={styles.bottomBar}>
          <p className={styles.copyright}>
            © {currentYear} 24 Frames Photography &amp; Cinema.
            <br />
            All rights reserved.
          </p>

          <div className={styles.bottomCenterMotto} aria-hidden="true">
            <span className={styles.mottoStar}>✦</span>
            <span>PEOPLE · FILMS · LEGACIES</span>
          </div>

          <div className={styles.bottomRightGroup}>
            <div className={styles.bottomLinks}>
              <Link href="/client-gallery" className={styles.bottomLink}>
                Client Archive
              </Link>
              <span className={styles.bottomDot}>·</span>
              <Link href="/inquire" className={styles.bottomLink}>
                Commence Dialogue
              </Link>
            </div>

            <button
              onClick={handleScrollToTop}
              className={styles.backToTopBtn}
              aria-label="Scroll back to top of page"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="19" x2="12" y2="5" />
                <polyline points="5 12 12 5 19 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
