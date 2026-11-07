import styles from "../studio.module.css";

export default function IllustrativeTag({ show, compact = false }: { show: boolean; compact?: boolean }) {
  if (!show) return null;
  return (
    <span className={styles.illustrative} title="These are fictional demonstration prices, not approved studio prices.">
      {compact ? "Illustrative" : "Illustrative pricing · not approved studio rates"}
    </span>
  );
}
