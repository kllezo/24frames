import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { STORIES_DATA, StoryDetail } from "@/data/stories";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import StoryExploreStillsButton from "@/components/stories/StoryExploreStillsButton";
import StoryStillsGallery from "@/components/stories/StoryStillsGallery";
import styles from "./StoryDetail.module.css";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return Object.keys(STORIES_DATA).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const story = STORIES_DATA[slug];

  if (!story) {
    return {
      title: "Story Not Found — 24 Frames",
    };
  }

  return {
    title: `${story.title} — ${story.subtitle} | 24 Frames Photography`,
    description: story.narrativeOverview,
    openGraph: {
      title: `${story.title} — 24 Frames Photography`,
      description: story.narrativeOverview,
      images: [{ url: story.coverImage }],
    },
  };
}

export default async function StoryDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const story: StoryDetail | undefined = STORIES_DATA[slug];

  if (!story) {
    notFound();
  }

  const prevStory = STORIES_DATA[story.prevStorySlug];
  const nextStory = STORIES_DATA[story.nextStorySlug];

  return (
    <>
      <Navigation />

      <main className={styles.main}>
        {/* ── Editorial Hero Cover (Balanced Two-Column Composition) ── */}
        <section className={styles.heroSection} aria-label={story.title}>
          <div className={styles.container}>
            {/* Top Navigation Row */}
            <div className={styles.heroNavRow}>
              <Link href="/stories" className={styles.backLink}>
                <span>←</span> Back to All Stories
              </Link>
              <div className={styles.heroNavBadges}>
                <span className={styles.chapterKicker}>{story.chapterKicker}</span>
                <span className={styles.categoryBadge}>{story.category}</span>
              </div>
            </div>

            {/* Two-Column Grid: Controlled Editorial Photo (Left) + Story Details (Right) */}
            <div className={styles.heroGrid}>
              {/* Left: Controlled Editorial Photograph */}
              <div className={styles.heroVisualCol}>
                <div className={styles.heroImageFrame}>
                  <picture>
                    <source srcSet={story.coverWebp} type="image/webp" />
                    <img
                      src={story.coverImage}
                      alt={story.coverCaption || story.title}
                      className={styles.heroImage}
                      style={{ objectPosition: story.coverPosition || "center 25%" }}
                      loading="eager"
                    />
                  </picture>
                </div>
                {story.coverCaption && (
                  <span className={styles.heroImageCaption}>{story.coverCaption}</span>
                )}
              </div>

              {/* Right: Editorial Information */}
              <div className={styles.heroInfoCol}>
                <div className={styles.heroTitleBlock}>
                  <h1 className={styles.heroTitle}>{story.title}</h1>
                  <p className={styles.heroSubtitle}>{story.subtitle}</p>
                </div>

                <div className={styles.metadataGrid}>
                  <div className={styles.metaCell}>
                    <span className={styles.metaLabel}>LOCATION</span>
                    <span className={styles.metaVal}>{story.location}</span>
                  </div>
                  <div className={styles.metaCell}>
                    <span className={styles.metaLabel}>VENUE</span>
                    <span className={styles.metaVal}>{story.venue}</span>
                  </div>
                  <div className={styles.metaCell}>
                    <span className={styles.metaLabel}>ARCHIVE YEAR</span>
                    <span className={styles.metaVal}>{story.year}</span>
                  </div>
                  <div className={styles.metaCell}>
                    <span className={styles.metaLabel}>CURATED FRAMES</span>
                    <span className={styles.metaVal}>{story.framesCount} Stills</span>
                  </div>
                </div>

                <p className={styles.heroNarrativeLead}>{story.narrativeOverview}</p>

                <div className={styles.heroActionRow}>
                  <StoryExploreStillsButton framesCount={story.frames.length} targetId="stills" />
                  <a href="#inquire" className={styles.secondaryActionBtn}>
                    COMMISSION 24 FRAMES <span>→</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Editorial Narrative & Curatorial Statement ─────────── */}
        <section className={styles.narrativeSection}>
          <div className={styles.container}>
            {/* Organic Handwritten Transition */}
            <div className={styles.narrativePoemNote}>
              <span className={styles.narrativePoemChapter}>
                {story.editorialSection.handwrittenQuote.kicker}
              </span>
              <p className={styles.narrativePoemText}>
                {story.editorialSection.handwrittenQuote.text}
              </p>
            </div>

            <div className={styles.narrativeGrid}>
              <div className={styles.narrativeHeader}>
                <span className={styles.sectionBadge}>
                  {story.editorialSection.chapterBadge}
                </span>
                <h2 className={styles.narrativeHeading}>
                  {story.editorialSection.chapterTitle}
                </h2>
                <div className={styles.archiveStatsBox}>
                  <div>
                    <span className={styles.archiveStatLabel}>
                      {story.editorialSection.provenance.label}
                    </span>
                    <div className={styles.archiveStatValue}>
                      {story.editorialSection.provenance.value}
                    </div>
                  </div>
                  <div>
                    <span className={styles.archiveStatLabel}>
                      {story.editorialSection.exhibitionFocus.label}
                    </span>
                    <div className={styles.archiveStatValue}>
                      {story.editorialSection.exhibitionFocus.value}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <p className={styles.narrativeLead}>{story.editorialSection.narrativeLead}</p>
                <div className={styles.narrativeParagraphs}>
                  {story.editorialSection.curatorialStatement.map((paragraph, idx) => (
                    <p key={idx} className={styles.narrativeBody}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Curated Exhibition Stills Gallery (Alternating Editorial Composition) ── */}
        <StoryStillsGallery
          frames={story.frames}
          storyTitle={story.title}
          editorial={story.galleryEditorial}
        />

        {/* ── Story Navigation (Prev / Next) ───────────────────── */}
        <section className={styles.storyNavSection}>
          <div className={styles.container}>
            <div className={styles.storyNavGrid}>
              {prevStory && (
                <Link
                  href={`/stories/${prevStory.slug}`}
                  className={styles.navCard}
                  aria-label={`Previous story: ${prevStory.title}`}
                >
                  <span className={styles.navDirection}>← Previous Story</span>
                  <h3 className={styles.navTitle}>{prevStory.title}</h3>
                  <span className={styles.navMeta}>{prevStory.subtitle}</span>
                </Link>
              )}

              {nextStory && (
                <Link
                  href={`/stories/${nextStory.slug}`}
                  className={`${styles.navCard} ${styles.navCardRight}`}
                  aria-label={`Next story: ${nextStory.title}`}
                >
                  <span className={styles.navDirection}>Next Story →</span>
                  <h3 className={styles.navTitle}>{nextStory.title}</h3>
                  <span className={styles.navMeta}>{nextStory.subtitle}</span>
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* ── Subtle Storytelling Inquiry CTA ────────────────────── */}
        <section id="inquire" className={styles.ctaSection} aria-label="Commission Inquiry">
          <div className={styles.container}>
            <div className={styles.ctaBox}>
              <span className={styles.ctaTag}>{story.inquiryCta.tag}</span>
              <h2 className={styles.ctaHeading}>{story.inquiryCta.heading}</h2>
              <p className={styles.ctaBody}>{story.inquiryCta.body}</p>
              <div className={styles.ctaActions}>
                <Link href="/inquire" className={styles.primaryCtaBtn}>
                  {story.inquiryCta.primaryButtonText}
                </Link>
                <Link href="/stories" className={styles.secondaryCtaBtn}>
                  {story.inquiryCta.secondaryButtonText}
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
