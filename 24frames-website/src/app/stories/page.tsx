import Link from "next/link";
import { Metadata } from "next";
import { STORIES_LIST } from "@/data/stories";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import styles from "./StoriesIndex.module.css";

export const metadata: Metadata = {
  title: "Archival Wedding Stories — 24 Frames Photography",
  description:
    "An intimate anthology of sacred promises, royal celebrations, and handpicked client archives documented by 24 Frames Photography.",
};

export default function StoriesPage() {
  return (
    <>
      <Navigation />

      <main className={styles.main}>
        {/* ── Page Header ────────────────────────────────────────── */}
        <header className={styles.headerSection}>
          <div className={styles.headerPattern} />
          <div className={styles.container}>
            <div className={styles.headerContent}>
              <Link href="/#vows" className={styles.topBackLink}>
                <span>←</span> Back to The Vows Collection
              </Link>
              <span className={styles.label}>ARCHIVAL WEDDING ANTHOLOGY · CURATED COMMISSIONS</span>
              <h1 className={styles.title}>CLIENT WEDDING STORIES</h1>
              <p className={styles.subtitle}>
                Each wedding is an unrepeatable tapestry of sacred rituals, quiet intimate glances, and monumental family celebrations. Explore each commissioned story below.
              </p>
            </div>
          </div>
        </header>

        {/* ── Stories Grid ───────────────────────────────────────── */}
        <section className={styles.storiesSection}>
          <div className={styles.container}>
            <div className={styles.storiesGrid}>
              {STORIES_LIST.map((story) => (
                <Link
                  key={story.slug}
                  href={`/stories/${story.slug}`}
                  className={styles.storyCard}
                  aria-label={`View ${story.title} story`}
                >
                  <div className={styles.storyImageWrap}>
                    <picture>
                      <source srcSet={story.coverWebp} type="image/webp" />
                      <img
                        src={story.coverImage}
                        alt={story.title}
                        className={styles.storyImg}
                        style={{ objectPosition: story.coverPosition || "center 20%" }}
                        loading="lazy"
                      />
                    </picture>
                    <div className={styles.storyOverlay} />
                    <span className={styles.badgeTopRight}>
                      {story.framesCount} CURATED FRAMES
                    </span>
                    <span className={styles.badgeBottomLeft}>
                      {story.venue}
                    </span>
                  </div>

                  <div className={styles.storyCardBody}>
                    <div className={styles.storyMetaRow}>
                      <span className={styles.storyCategory}>{story.category}</span>
                      <span className={styles.storyYear}>{story.year}</span>
                    </div>

                    <h2 className={styles.storyTitle}>{story.title}</h2>
                    <h3 className={styles.storySubtitle}>{story.subtitle}</h3>

                    <p className={styles.storyExcerpt}>{story.narrativeOverview}</p>

                    <div className={styles.storyCardFooter}>
                      <span className={styles.locationSpan}>{story.location}</span>
                      <span className={styles.explorePrompt}>
                        Step Inside Story →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
