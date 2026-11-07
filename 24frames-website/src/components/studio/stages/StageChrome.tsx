"use client";

import styles from "../stages.module.css";
import base from "../studio.module.css";

export function StageHeader({
  frame,
  kicker,
  title,
  lead,
  children,
}: {
  frame: string;
  kicker: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <header className={styles.stageHeader}>
      <span className={styles.frameNo} aria-hidden="true">{frame}</span>
      <p className={base.kicker}>{kicker}</p>
      <h1 className={styles.stageTitle} tabIndex={-1}>{title}</h1>
      {lead && <p className={styles.stageLead}>{lead}</p>}
      {children}
    </header>
  );
}

export function StageFooter({
  onBack,
  backLabel = "Back",
  onNext,
  nextLabel,
  nextDisabled,
  hint,
}: {
  onBack?: () => void;
  backLabel?: string;
  onNext?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  hint?: React.ReactNode;
}) {
  return (
    <footer className={styles.stageFooter}>
      {onBack ? (
        <button className={base.btnSecondary} onClick={onBack}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12H5M10 6l-6 6 6 6" /></svg>
          {backLabel}
        </button>
      ) : <span />}
      {hint && <p className={styles.footerHint}>{hint}</p>}
      {onNext && nextLabel && (
        <button className={base.btnPrimary} onClick={onNext} disabled={nextDisabled}>
          {nextLabel}
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M14 6l6 6-6 6" /></svg>
        </button>
      )}
    </footer>
  );
}
