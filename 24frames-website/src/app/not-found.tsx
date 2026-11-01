import Link from "next/link";
import styles from "./not-found.module.css";

export const metadata = {
  title: "Frame Not Found — 24 Frames Photography",
  description: "The requested archive frame does not exist or has been relocated.",
};

export default function NotFound() {
  return (
    <main className={styles.container}>
      <div className={styles.inner}>
        <span className={styles.kicker}>ARCHIVE SYSTEM · 24 FRAMES</span>
        <h1 className={styles.code}>404</h1>
        <div className={styles.divider} />
        <h2 className={styles.title}>This Frame Does Not Exist</h2>
        <p className={styles.description}>
          The archive frame you are looking for has been relocated, archived, or is currently unavailable in the public gallery.
        </p>
        <div className={styles.actions}>
          <Link href="/" className={styles.btnPrimary}>
            Return to Homepage
          </Link>
          <Link href="/collection" className={styles.btnSecondary}>
            View Collection
          </Link>
          <Link href="/stories" className={styles.btnSecondary}>
            Read Stories
          </Link>
        </div>
      </div>
    </main>
  );
}

