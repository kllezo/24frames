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
            <div className={styles.heroCanvas}>
              <picture>
                {discipline.heroWebp && (
                  <source srcSet={discipline.heroWebp} type="image/webp" />
                )}
                <img
                  src={discipline.heroImage}
                  alt={discipline.title}
                  className={styles.heroImg}
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
              <span className={styles.curatorialNoteChapter}>
                Chapter IV · The Art of Remembering
              </span>
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
