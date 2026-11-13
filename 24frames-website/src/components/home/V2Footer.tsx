import Link from "next/link";
import s from "./chrome.module.css";

/* Footer for the redesigned homepage — same contact details as the
   current site footer, in the new palette. */
export default function V2Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={s.footer}>
      <div className={s.footTop}>
        <div className={s.footBrand}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo-ink-header.webp" alt="24 Frames" className={s.footLogo} />
          <p>People · Films · Legacies</p>
        </div>
        <div className={s.footCols}>
          <div>
            <h3>Contact</h3>
            <a href="mailto:hello@24framesphotography.com">hello@24framesphotography.com</a>
            <a href="tel:+919014433074">+91 90144 33074</a>
          </div>
          <div>
            <h3>Studio</h3>
            <p>Jubilee Hills, Hyderabad<br />Telangana 500033</p>
            <a href="https://maps.app.goo.gl/ttz9jqZsHW9cSJdt9" target="_blank" rel="noreferrer">View on map</a>
          </div>
          <div>
            <h3>Follow</h3>
            <a href="https://www.instagram.com/24framesphotography_official/" target="_blank" rel="noreferrer">Instagram</a>
            <a href="https://youtube.com/@24framesphotography" target="_blank" rel="noreferrer">YouTube</a>
            <a href="https://wa.me/919014433074" target="_blank" rel="noreferrer">WhatsApp</a>
          </div>
          <div>
            <h3>Explore</h3>
            <Link href="/stories">Wedding stories</Link>
            <Link href="/collection">The collection</Link>
            <Link href="/client-gallery">Client gallery</Link>
            <Link href="/inquire">Inquire</Link>
          </div>
        </div>
      </div>
      <div className={s.footBottom}>
        <span>© {year} 24 Frames Photography &amp; Cinema</span>
        <span className={s.footLegal}>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </span>
      </div>
    </footer>
  );
}
