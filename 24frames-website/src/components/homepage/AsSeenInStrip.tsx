"use client";

import styles from "./AsSeenInStrip.module.css";

interface PressLogo {
  name: string;
  src: string;
  alt: string;
  heightRatio?: number;
}

const PRESS_LOGOS: PressLogo[] = [
  { name: "The Indian Express", src: "/images/press/indian-express.png", alt: "The Indian Express editorial feature" },
  { name: "Telangana Today", src: "/images/press/telangana-today.png", alt: "Telangana Today feature coverage" },
  { name: "The Times of India", src: "/images/press/times-of-india.png", alt: "The Times of India spotlight feature" },
  { name: "The Hindu", src: "/images/press/the-hindu.png", alt: "The Hindu publication feature" },
  { name: "Vogue", src: "/images/press/vogue.png", alt: "Vogue India editorial feature" },
  { name: "Nikon", src: "/images/press/nikon.png", alt: "Nikon creator community & optical imaging partner" },
  { name: "Times Business Awards", src: "/images/press/times-business-awards.png", alt: "Times Business Awards distinction" },
  { name: "ET Excellence", src: "/images/press/et-excellence.png", alt: "Economic Times Excellence Awards" },
  { name: "Inovexia International", src: "/images/press/inovexia.png", alt: "Indian Eminent Awards presented by Inovexia International" },
  { name: "WPPI", src: "/images/press/wppi.png", alt: "WPPI international wedding & portrait photography association" },
  { name: "TCEI", src: "/images/press/tcei.png", alt: "Telangana Chamber of Events Industry distinction" },
  { name: "PIC-TIME", src: "/images/press/pic-time.png", alt: "Pic-Time global client gallery delivery platform" },
];

export default function AsSeenInStrip() {
  return (
    <section className={styles.section} aria-label="Media Publications, Industry Affiliations and Creative Platforms">
      <div className={styles.container}>
        {/* Editorial Heading */}
        <div className={styles.header}>
          <div className={styles.kickerRow}>
            <span className={styles.ruleLine} aria-hidden="true" />
            <h2 className={styles.title}>AS SEEN IN &amp; AFFILIATIONS</h2>
            <span className={styles.ruleLine} aria-hidden="true" />
          </div>
          <p className={styles.subtitle}>
            Press features, creator community partnerships, juried awards, and archival delivery platforms.
          </p>
        </div>

        {/* Seamless Continuous Marquee Strip */}
        <div className={styles.marqueeWrapper}>
          <div className={styles.marqueeTrack} aria-hidden="true">
            {/* Set 1 */}
            {PRESS_LOGOS.map((logo, idx) => (
              <div key={`logo-1-${idx}`} className={styles.logoItem}>
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className={styles.logoImg}
                  loading="lazy"
                />
              </div>
            ))}

            {/* Set 2 (for seamless infinite loop) */}
            {PRESS_LOGOS.map((logo, idx) => (
              <div key={`logo-2-${idx}`} className={styles.logoItem}>
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className={styles.logoImg}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

