import Link from "next/link";
import styles from "./Footer.module.css";

const NAV_LINKS = [
  { label: "The Vows", href: "/#vows" },
  { label: "The Collection", href: "/#collection" },
  { label: "Stories", href: "/stories" },
  { label: "The Artist", href: "/#artist" },
  { label: "Client Gallery", href: "/client-gallery" },
  { label: "Identity & Heritage", href: "/identity" },
];

const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://www.instagram.com/24framesphotography_", icon: "Instagram" },
  { label: "YouTube", href: "https://www.youtube.com/@24framesweddingfilms", icon: "YouTube" },
  { label: "WhatsApp", href: "https://wa.me/919959664567", icon: "WhatsApp" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.container}>
        {/* Editorial Top / Brand Closing Statement Banner */}
        <div className={styles.editorialStatement}>
          <p className={styles.closingQuote}>
            “Some moments deserve to outlive time.”
          </p>
          <div className={styles.commissionInvite}>
            <span className={styles.inviteLead}>Commission atelier open for upcoming seasons</span>
            <Link href="/inquire" className={styles.commissionBtn}>
              <span>BEGIN A COMMISSION</span>
              <span className={styles.commissionArrow} aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        {/* Multi-column Editorial Grid */}
        <div className={styles.mainGrid}>
          {/* Brand Column */}
          <div className={styles.brandCol}>
            <Link href="/" className={styles.logo}>
              <span className={styles.logoMark}>24 FRAMES</span>
              <span className={styles.logoSub}>PHOTOGRAPHY & CINEMA</span>
            </Link>
            <p className={styles.brandBio}>
              Bespoke royal wedding cinema and editorial photography founded by Phani Gogireddy.
              Official Nikon India Partner and recipient of the ET Excellence Award 2025.
            </p>
            <div className={styles.accreditations}>
              <span className={styles.accreditationBadge}>Nikon India Partner</span>
              <span className={styles.accreditationBadge}>ET Excellence 2025</span>
            </div>
          </div>

          {/* Navigation Column */}
          <nav className={styles.navCol} aria-label="Footer Navigation">
            <h3 className={styles.colHeading}>EXPLORE ARCHIVE</h3>
            <ul className={styles.navList}>
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={styles.navLink}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Studio Atelier Column */}
          <div className={styles.studioCol}>
            <h3 className={styles.colHeading}>STUDIO ATELIER</h3>
            <address className={styles.address}>
              <p className={styles.studioName}>24 Frames Creative Studio</p>
              <p>Jubilee Hills, Hyderabad</p>
              <p>Telangana 500033, India</p>
              <p className={styles.studioNotice}>Private consultations by bespoke appointment</p>
            </address>
          </div>

          {/* Direct Concierge Column */}
          <div className={styles.contactCol}>
            <h3 className={styles.colHeading}>DIRECT CONCIERGE</h3>
            <p className={styles.contactItem}>
              <span className={styles.contactLabel}>Inquiries:</span>
              <a href="mailto:hello@24framesphotography.com" className={styles.contactLink}>
                hello@24framesphotography.com
              </a>
            </p>
            <p className={styles.contactItem}>
              <span className={styles.contactLabel}>WhatsApp Concierge:</span>
              <a href="https://wa.me/919959664567" target="_blank" rel="noopener noreferrer" className={styles.contactLink}>
                +91 99596 64567
              </a>
            </p>
            <div className={styles.socialRow}>
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className={styles.socialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Signature Line */}
        <div className={styles.bottomBar}>
          <p className={styles.copyright}>
            © {currentYear} 24 Frames Photography. All rights reserved. Registered trademark.
          </p>
          <div className={styles.bottomLinks}>
            <Link href="/identity" className={styles.bottomLink}>The Heritage</Link>
            <span className={styles.bottomDot}>·</span>
            <Link href="/client-gallery" className={styles.bottomLink}>Client Archive</Link>
            <span className={styles.bottomDot}>·</span>
            <Link href="/inquire" className={styles.bottomLink}>Commence Dialogue</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
