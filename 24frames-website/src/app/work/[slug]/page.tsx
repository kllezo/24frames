import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { PROJECTS_DATA } from "@/data/projects";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import styles from "./ProjectDetail.module.css";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = PROJECTS_DATA[slug];

  if (!project) {
    return {
      title: "Project Not Found — 24 Frames",
    };
  }

  return {
    title: `${project.title} — ${project.subtitle} | 24 Frames Photography`,
    description: project.overview,
    openGraph: {
      title: `${project.title} — 24 Frames Photography`,
      description: project.overview,
      images: [{ url: project.coverImage }],
    },
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = PROJECTS_DATA[slug];

  if (!project) {
    notFound();
  }

  // Find next project for continuous navigation
  const projectKeys = Object.keys(PROJECTS_DATA);
  const currentIndex = projectKeys.indexOf(slug);
  const nextSlug = projectKeys[(currentIndex + 1) % projectKeys.length];
  const nextProject = PROJECTS_DATA[nextSlug];

  return (
    <>
      <Navigation />

      <main className={styles.main}>
        {/* Cinematic Hero Frame with Expanding Continuity */}
        <section className={styles.heroSection} aria-label={project.title}>
          <div className={styles.heroImageWrap}>
            <img
              src={project.coverImage}
              alt={project.title}
              className={styles.heroImage}
              loading="eager"
            />
            <div className={styles.letterboxTop} />
            <div className={styles.letterboxBottom} />
            <div className={styles.heroGradient} />
          </div>

          <div className={styles.heroContent}>
            <div className={styles.heroMetaTop}>
              <Link href="/#exhibition" className={styles.backLink}>
                <span className={styles.backArrow}>←</span> Back to Portfolio
              </Link>
              <span className={styles.categoryBadge}>{project.category}</span>
            </div>

            <div className={styles.heroHeadingBlock}>
              <h1 className={styles.title}>{project.title}</h1>
              <p className={styles.subtitle}>{project.subtitle}</p>
            </div>

            <div className={styles.locationStrip}>
              <span className={styles.locationItem}>
                <strong>Location:</strong> {project.location}
              </span>
              <span className={styles.locationDivider}>·</span>
              <span className={styles.locationItem}>
                <strong>Venue:</strong> {project.venue}
              </span>
              <span className={styles.locationDivider}>·</span>
              <span className={styles.locationItem}>
                <strong>Year:</strong> {project.year}
              </span>
            </div>
          </div>
        </section>

        {/* Narrative & Film Reel Specifications */}
        <section className={styles.storySection}>
          <div className={styles.container}>
            <div className={styles.storyGrid}>
              {/* Left Column: The Narrative Story */}
              <div className={styles.storyContent}>
                <span className={styles.sectionLabel}>The Commission</span>
                <p className={styles.leadText}>{project.overview}</p>
                <div className={styles.paragraphs}>
                  {project.story.map((paragraph, i) => (
                    <p key={i} className={styles.bodyText}>
                      {paragraph}
                    </p>
                  ))}
                </div>

                {project.clientQuote && (
                  <blockquote className={styles.quoteCard}>
                    <p className={styles.quoteText}>&ldquo;{project.clientQuote.text}&rdquo;</p>
                    <footer className={styles.quoteAuthor}>— {project.clientQuote.author}</footer>
                  </blockquote>
                )}
              </div>

              {/* Right Column: Cinema Film Strip Metadata */}
              {project.filmReel && (
                <div className={styles.specsSidebar}>
                  <div className={styles.specsCard}>
                    <div className={styles.specsHeader}>
                      <span className={styles.specsLed} />
                      <h3 className={styles.specsTitle}>CINEMA REEL SPEC</h3>
                    </div>

                    <dl className={styles.specsList}>
                      <div className={styles.specItem}>
                        <dt>Camera Systems</dt>
                        <dd>{project.filmReel.camera}</dd>
                      </div>
                      <div className={styles.specItem}>
                        <dt>Optical Glass</dt>
                        <dd>{project.filmReel.lens}</dd>
                      </div>
                      <div className={styles.specItem}>
                        <dt>Aspect Ratio</dt>
                        <dd>{project.filmReel.aspectRatio}</dd>
                      </div>
                      <div className={styles.specItem}>
                        <dt>Color Science</dt>
                        <dd>{project.filmReel.colorProfile}</dd>
                      </div>
                      <div className={styles.specItem}>
                        <dt>Master Archive</dt>
                        <dd>{project.filmReel.framesCount}</dd>
                      </div>
                    </dl>

                    <div className={styles.specsFooter}>
                      <span>24 FRAMES ARCHIVE CODE</span>
                      <strong>{project.slug.toUpperCase()}</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Curated Gallery Exhibition */}
        {project.gallery && project.gallery.length > 0 && (
          <section className={styles.gallerySection}>
            <div className={styles.container}>
              <div className={styles.galleryHeader}>
                <span className={styles.sectionLabel}>Selected Stills</span>
                <h2 className={styles.galleryTitle}>Frames from the archive</h2>
              </div>

              <div className={styles.galleryGrid}>
                {project.gallery.map((item, idx) => (
                  <figure
                    key={idx}
                    className={`${styles.galleryItem} ${styles[`aspect_${item.aspect}`]}`}
                  >
                    <div className={styles.galleryImageWrap}>
                      <img
                        src={item.url}
                        alt={item.caption}
                        className={styles.galleryImage}
                        loading="lazy"
                      />
                    </div>
                    {item.caption && (
                      <figcaption className={styles.galleryCaption}>
                        <span className={styles.captionFrameNo}>FRAME {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}</span>
                        <span className={styles.captionText}>{item.caption}</span>
                      </figcaption>
                    )}
                  </figure>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Next Project Teaser */}
        {nextProject && (
          <section className={styles.nextProjectSection}>
            <Link href={`/work/${nextProject.slug}`} className={styles.nextProjectCard}>
              <div className={styles.nextImageWrap}>
                <img
                  src={nextProject.coverImage}
                  alt={nextProject.title}
                  className={styles.nextImage}
                  loading="lazy"
                />
                <div className={styles.nextOverlay} />
              </div>

              <div className={styles.nextContent}>
                <span className={styles.nextTag}>Next Visual World →</span>
                <h3 className={styles.nextTitle}>{nextProject.title}</h3>
                <p className={styles.nextSubtitle}>{nextProject.subtitle}</p>
              </div>
            </Link>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
