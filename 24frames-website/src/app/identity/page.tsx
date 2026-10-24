import { Metadata } from "next";
import Link from "next/link";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import styles from "./IdentityPage.module.css";

export const metadata: Metadata = {
  title: "24 Frames Identity — The Philosophy & Studio Heritage | 24 Frames",
  description:
    "The story behind the 24-frame philosophy of Phani Gogireddy. Capturing one second of cinema and a lifetime of sacred memories.",
};

const COLOR_STEPS = [
  { frame: "01", color: "#0C3028", name: "Deep Forest" },
  { frame: "04", color: "#245E52", name: "Dark Sage" },
  { frame: "08", color: "#5E9D8E", name: "Muted Jade" },
  { frame: "12", color: "#9EC7BE", name: "Soft Celadon" },
  { frame: "16", color: "#BFC8BB", name: "Stone Moss" },
  { frame: "20", color: "#DBD3C3", name: "Warm Khaki" },
  { frame: "24", color: "#FFFFFF", name: "Pure Ivory Hallmark", isLogo: true },
];

export default function IdentityPage() {
  return (
    <>
      <Navigation />

      <main className={styles.main}>
        {/* Subtle Ambient Aura */}
        <div className={styles.ambientAura} aria-hidden="true" />

        <div className={styles.container}>
          {/* Top Breadcrumb */}
          <div className={styles.breadcrumb}>
            <Link href="/" className={styles.breadcrumbLink}>← Home</Link>
            <span className={styles.breadcrumbDivider}>/</span>
            <span className={styles.breadcrumbCurrent}>The 24 Frames Identity</span>
          </div>

          {/* ── THE MONUMENTAL LOGO TILE HERO ───────────────────────── */}
          <section className={styles.hallmarkSection} aria-label="Brand Hallmark">
            <div className={styles.logoFrameGeometry}>
              <div className={styles.logoFrameInner}>
                <span className={styles.frameAperture}>FRAME 24 OF 24 · THE HALLMARK</span>
                <h1 className={styles.brandTitle}>24 FRAMES</h1>
                <p className={styles.brandSubtitle}>CINEMATIC WEDDING FILMS & PHOTOGRAPHY</p>
                <div className={styles.brandMetaRow}>
                  <span>EST. 2012</span>
                  <span className={styles.dot}>·</span>
                  <span>JUBILEE HILLS, HYDERABAD</span>
                  <span className={styles.dot}>·</span>
                  <span>WORLDWIDE</span>
                </div>
              </div>
            </div>

            <p className={styles.manifestoQuote}>
              &ldquo;Twenty-four still photographs pass through a cinema projector gate in one second
              to create the illusion of living motion. In our house, every single frame is crafted
              with the sacred discipline of an archival oil painting.&rdquo;
            </p>
            <span className={styles.quoteAuthor}>— Phani Gogireddy, Founder & Creative Director</span>
          </section>

          {/* ── THE 24-FRAME COLOR EMULSION JOURNEY ──────────────────── */}
          <section className={styles.paletteSection} aria-label="Color Progression">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionKicker}>ARCHIVAL COLOR DISCIPLINE</span>
              <h2 className={styles.sectionTitle}>The 24-Frame Emulsion Spectrum</h2>
              <p className={styles.sectionSubtitle}>
                The visual rhythm of our studio: transitioning from the deep shadows of the darkroom
                into the radiant warm daylight of royal South Indian weddings.
              </p>
            </div>

            <div className={styles.paletteStrip}>
              {COLOR_STEPS.map((step) => (
                <div
                  key={step.frame}
                  className={`${styles.paletteCard} ${step.isLogo ? styles.paletteCardLogo : ""}`}
                  style={{ "--step-color": step.color } as React.CSSProperties}
                >
                  <div className={styles.cardSwatch} style={{ backgroundColor: step.color }} />
                  <div className={styles.cardMeta}>
                    <span className={styles.cardFrame}>FRAME {step.frame}</span>
                    <span className={styles.cardName}>{step.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── STUDIO PILLARS ───────────────────────────────────────── */}
          <section className={styles.pillarsSection} aria-label="Studio Principles">
            <div className={styles.pillarsGrid}>
              <div className={styles.pillarCard}>
                <span className={styles.pillarNo}>01</span>
                <h3 className={styles.pillarTitle}>Optical Purity</h3>
                <p className={styles.pillarDesc}>
                  We shoot exclusively on high-resolution full-frame sensors and prime cinema lenses.
                  During sacred Telugu wedding rituals like Muhurtham and Jeelakarra Bellam, we eliminate
                  disruptive flashes to preserve the atmospheric sanctity of sacred Vedic fire.
                </p>
              </div>

              <div className={styles.pillarCard}>
                <span className={styles.pillarNo}>02</span>
                <h3 className={styles.pillarTitle}>Generational Heirlooms</h3>
                <p className={styles.pillarDesc}>
                  Every completed commission is delivered as an archival master: 4K feature-length films,
                  hand-bound Italian fine-art albums with archival pigments guaranteed for 100+ years,
                  and curated photographic galleries designed for generations.
                </p>
              </div>

              <div className={styles.pillarCard}>
                <span className={styles.pillarNo}>03</span>
                <h3 className={styles.pillarTitle}>Discreet Presence</h3>
                <p className={styles.pillarDesc}>
                  Our cinematographers and photographers move like observant ghosts. You never pose
                  uncomfortably for hours; you celebrate with your family while our cameras capture
                  unscripted, genuine human truth.
                </p>
              </div>
            </div>
          </section>

          {/* ── STUDIO ATELIER & INQUIRY ──────────────────────────────── */}
          <section className={styles.atelierSection} aria-label="Studio Atelier">
            <div className={styles.atelierCard}>
              <div className={styles.atelierContent}>
                <span className={styles.atelierTag}>THE HYDERABAD ATELIER</span>
                <h3 className={styles.atelierTitle}>A Sanctuary for Cinematic Craft</h3>
                <p className={styles.atelierDesc}>
                  Spanning 6,000 square feet in Jubilee Hills, Hyderabad, our studio houses private
                  screening theaters, archival color-grading suites, and bespoke bridal preview salons.
                  We accept a strictly limited number of commissions each season to maintain uncompromised craft.
                </p>
                <div className={styles.atelierActions}>
                  <Link href="/#inquire" className={styles.primaryBtn}>
                    Inquire for 2026/2027 Commissions →
                  </Link>
                  <Link href="/#collection" className={styles.secondaryBtn}>
                    Return to The 24-Frame Collection
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
