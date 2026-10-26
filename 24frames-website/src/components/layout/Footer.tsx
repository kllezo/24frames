import Link from "next/link";
import styles from "./Footer.module.css";

const NAV_LINKS = [
  { label: "The Vows", href: "/#vows" },
  { label: "The Collection", href: "/#collection" },
  { label: "Stories", href: "/stories" },
  { label: "The Artist", href: "/#artist" },
  { label: "24 Frames Identity", href: "/identity" },
  { label: "Inquire", href: "/#inquire" },
];

const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://www.instagram.com/24framesphotography_", icon: "IG" },
  { label: "YouTube", href: "https://www.youtube.com/@24framesweddingfilms", icon: "YT" },
];

export default function Footer() {
  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.container}>
        <div className={styles.top}>
          {/* Brand */}
          <div className={styles.brand}>
            <Link href="/" className={styles.logo}>
              <span className={styles.logoText}>24 Frames</span>
            </Link>
            <p className={styles.tagline}>
              Cinematic Wedding Photography & Films
            </p>
            <p className={styles.location}>
              Jubilee Hills, Hyderabad, Telangana, India
            </p>
          </div>

          {/* Navigation */}
          <nav className={styles.nav} aria-label="Footer navigation">
            <h3 className={styles.navHeading}>Navigate</h3>
            <ul className={styles.navList}>
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className={styles.navLink}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div className={styles.contact}>
            <h3 className={styles.navHeading}>Get in Touch</h3>
            <a href="mailto:hello@24framesphotography.com" className={styles.contactLink}>
              hello@24framesphotography.com
            </a>
            <div className={styles.socials}>
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

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} 24 Frames Photography. All rights reserved.
          </p>
          <a href="/privacy" className={styles.privacyLink}>
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  );
}
