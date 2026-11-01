"use client";

import styles from "./FilmGrain.module.css";

export default function FilmGrain() {
  return (
    <div className={styles.grainContainer} aria-hidden="true">
      <div className={styles.grainOverlay} />
    </div>
  );
}
