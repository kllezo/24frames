"use client";

import styles from "./FilmGrain.module.css";

export default function FilmGrain() {
  return (
    <div className={styles.grainContainer} aria-hidden="true">
      <svg className={styles.svgFilter}>
        <filter id="film-grain-filter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.045 0"
          />
        </filter>
      </svg>
      <div className={styles.grainOverlay} />
    </div>
  );
}
