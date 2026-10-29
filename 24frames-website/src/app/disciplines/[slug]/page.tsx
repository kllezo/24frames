import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { DISCIPLINES_DATA, DisciplineItem } from "@/data/disciplines";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import DisciplineInteractiveMedia from "@/components/disciplines/DisciplineInteractiveMedia";
import styles from "./DisciplineDetail.module.css";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return Object.keys(DISCIPLINES_DATA).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const discipline = DISCIPLINES_DATA[slug];

  if (!discipline) {
    return {
      title: "Discipline Not Found — 24 Frames",
    };
  }

  return {
    title: `${discipline.title} — Practice of Optics | 24 Frames Photography`,
    description: discipline.heroDescription,
    openGraph: {
      title: `${discipline.title} — 24 Frames Photography`,
      description: discipline.heroDescription,
      images: [{ url: discipline.heroImage }],
    },
  };
}

export default async function DisciplineDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const discipline: DisciplineItem | undefined = DISCIPLINES_DATA[slug];

  if (!discipline) {
    notFound();
  }

  const relatedDisciplines = discipline.relatedSlugs
    .map((relSlug) => DISCIPLINES_DATA[relSlug])
    .filter(Boolean);

  return (
    <>
      <Navigation />

      <main className={styles.main}>
        {/* ── Return Navigation Bar ──────────────────────────────── */}
        <div className={styles.topBar}>
          <div className={styles.container}>
            <Link href="/#collection" className={styles.backLink}>
              <span className={styles.backArrow} aria-hidden="true">
                ←
              </span>{" "}
              Return to The Collection
            </Link>
            <span className={styles.disciplineIndexBadge}>
              PRACTICE {discipline.number} OF 05
            </span>
          </div>
        </div>

        {/* ── Monumental Hero Section ────────────────────────────── */}
        <section className={styles.heroSection} aria-label={discipline.title}>
          <div className={styles.container}>
            <div className={styles.heroMetaRow}>
              <span className={styles.heroCategoryPill}>
                DISCIPLINE {discipline.number}
              </span>
              <span className={styles.heroCountPill}>{discipline.count}</span>
            </div>

            <h1 className={styles.heroTitle}>{discipline.title}</h1>
            <p className={styles.heroTagline}>{discipline.tagline}</p>
            <p className={styles.heroLead}>{discipline.fullDescription}</p>

            {/* Monumental Hero Photograph Canvas */}
            <div
              className={`${styles.heroCanvas} ${
                slug === "celebrities" ? styles.celebritiesHeroCanvas : ""
              }`}
            >
              {slug === "celebrities" && (
                <div className={styles.mandalaArtWrap} aria-hidden="true">
                  <svg
                    viewBox="0 0 400 400"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={styles.mandalaSvg}
                  >
                    {/* Concentric rings */}
                    <circle cx="200" cy="200" r="190" stroke="#D4AF37" strokeWidth="0.75" strokeDasharray="3 4" opacity="0.5" />
                    <circle cx="200" cy="200" r="176" stroke="#8EA89D" strokeWidth="0.8" opacity="0.4" />
                    <circle cx="200" cy="200" r="150" stroke="#D4AF37" strokeWidth="0.75" opacity="0.6" />
                    <circle cx="200" cy="200" r="120" stroke="#8EA89D" strokeWidth="0.75" strokeDasharray="2 3" opacity="0.5" />
                    <circle cx="200" cy="200" r="80" stroke="#D4AF37" strokeWidth="0.75" opacity="0.6" />
                    <circle cx="200" cy="200" r="45" stroke="#8EA89D" strokeWidth="0.8" opacity="0.5" />
                    <circle cx="200" cy="200" r="16" stroke="#D4AF37" strokeWidth="1" opacity="0.8" />
                    <circle cx="200" cy="200" r="4" fill="#D4AF37" opacity="0.9" />

                    {/* 12 Radial Rays & Star Accents */}
                    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                      <g key={deg} transform={`rotate(${deg} 200 200)`}>
                        <line x1="200" y1="200" x2="200" y2="10" stroke="#D4AF37" strokeWidth="0.6" opacity="0.45" />
                        <circle cx="200" cy="24" r="2.5" fill="#D4AF37" opacity="0.7" />
                        <circle cx="200" cy="50" r="1.5" fill="#8EA89D" opacity="0.6" />
                        {/* Elegant Petal Arcs */}
                        <path
                          d="M 200 80 C 185 115 185 140 200 150 C 215 140 215 115 200 80 Z"
                          stroke="#D4AF37"
                          strokeWidth="0.75"
                          opacity="0.5"
                          fill="none"
                        />
                        <path
                          d="M 200 120 C 175 145 175 170 200 180 C 225 170 225 145 200 120 Z"
                          stroke="#8EA89D"
                          strokeWidth="0.6"
                          opacity="0.4"
                          fill="none"
                        />
                      </g>
                    ))}

                    {/* Interlocking 8-Point Sacred Octagram */}
                    <polygon
                      points="200,60 299,101 340,200 299,299 200,340 101,299 60,200 101,101"
                      stroke="#D4AF37"
                      strokeWidth="0.6"
                      opacity="0.35"
                    />
                    <polygon
                      points="200,80 285,115 320,200 285,285 200,320 115,285 80,200 115,115"
                      stroke="#8EA89D"
                      strokeWidth="0.6"
                      opacity="0.3"
                    />
                  </svg>
                </div>
              )}
              <picture>
                {discipline.heroWebp && (
                  <source srcSet={discipline.heroWebp} type="image/webp" />
                )}
                <img
                  src={discipline.heroImage}
                  alt={discipline.title}
                  className={`${styles.heroImg} ${
                    slug === "celebrities" ? styles.celebritiesHeroImg : ""
                  } ${slug === "events" ? styles.eventsHeroImg : ""}`}
                />
              </picture>
              <div className={styles.heroVignette} aria-hidden="true" />

              <div className={styles.heroImageCaption}>
                <span className={styles.captionTag}>FEATURED ARCHIVE STILL</span>
                <span className={styles.captionText}>
                  {discipline.title} · Documented by 24 Frames
                </span>
              </div>
            </div>

            {/* Archival Specification Grid */}
            <div className={styles.specGrid}>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>LEAD ARTIST</span>
                <span className={styles.specValue}>{discipline.metadata.leadArtist}</span>
              </div>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>OPTICS & PROFILE</span>
                <span className={styles.specValue}>
                  {discipline.metadata.opticsProfile}
                </span>
              </div>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>ARCHIVE ESTABLISHED</span>
                <span className={styles.specValue}>{discipline.metadata.established}</span>
              </div>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>DOCUMENTED COMMISSIONS</span>
                <span className={styles.specValue}>
                  {discipline.metadata.archiveVolume}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Curatorial Philosophy (Unboxed Organic Editorial Narrative) ── */}
        <section
          className={styles.curatorialSection}
          aria-label="Curatorial Philosophy"
        >
          <div className={styles.container}>
            <div className={styles.curatorialNarrativeNote}>
              <p className={styles.curatorialNotePoem}>
                “A day passes in an instant. The way it made you feel deserves to endure.”
              </p>
            </div>

            <div className={styles.curatorialBox}>
              <div className={styles.curatorialHeader}>
                <span className={styles.curatorialLabel}>CURATORIAL PHILOSOPHY</span>
                <h2 className={styles.curatorialTitle}>The Philosophy of the Frame</h2>
              </div>
              <div className={styles.curatorialBody}>
                {discipline.curatorialNotes.map((paragraph, idx) => (
                  <p key={idx} className={styles.curatorialParagraph}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Interactive Cinema Motion Pictures & Full-Screen Gallery ── */}
        <DisciplineInteractiveMedia
          videos={discipline.videos}
          gallery={discipline.gallery}
          shortTitle={discipline.shortTitle}
        />

        {/* ── Related Editorial Disciplines ───────────────────────── */}
        <section
          className={styles.relatedSection}
          aria-label="Related Editorial Disciplines"
        >
          <div className={styles.container}>
            <div className={styles.relatedHeader}>
              <span className={styles.relatedLabel}>CONTINUE EXPLORING</span>
              <h2 className={styles.relatedTitle}>Other Practices of Optics</h2>
            </div>

            <div className={styles.relatedGrid}>
              {relatedDisciplines.map((related) => (
                <Link
                  key={related.id}
                  href={related.href}
                  className={styles.relatedCard}
                >
                  <div className={styles.relatedImgWrap}>
                    <img
                      src={related.heroImage}
                      alt={related.title}
                      className={styles.relatedImg}
                      loading="lazy"
                    />
                    <div className={styles.relatedOverlay} />
                  </div>
                  <div className={styles.relatedContent}>
                    <span className={styles.relatedNumber}>
                      DISCIPLINE {related.number}
                    </span>
                    <h3 className={styles.relatedName}>{related.title}</h3>
                    <p className={styles.relatedTagline}>{related.tagline}</p>
                    <span className={styles.relatedCta}>
                      Explore Discipline <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Restrained Commission Inquiry CTA ───────────────────── */}
        <section className={styles.inquirySection} aria-label="Commission Inquiry">
          <div className={styles.container}>
            <div className={styles.inquiryBox}>
              <span className={styles.inquiryLabel}>COMMISSION INQUIRY</span>
              <h2 className={styles.inquiryTitle}>
                Commission 24 Frames for Your Celebration
              </h2>
              <p className={styles.inquiryText}>
                We accept a limited ledger of bespoke master commissions each season to
                guarantee uncompromising visual and curatorial dedication.
              </p>
              <div className={styles.inquiryActions}>
                <Link href="/#inquire" className={styles.inquiryBtn}>
                  Inquire for Bespoke Dates →
                </Link>
                <Link href="/#collection" className={styles.inquirySecondaryBtn}>
                  View The Collection ↗
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
