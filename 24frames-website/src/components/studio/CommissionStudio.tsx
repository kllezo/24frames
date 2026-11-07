"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./studio.module.css";
import { STAGES, clearStoredConsultation, useStudioStore, type StageId } from "./state/store";
import type { StudioConfig } from "@/lib/commission/types";
import { coupleNames } from "@/lib/commission/model";
import Ledger from "./Ledger";
import IdleLock from "./ui/IdleLock";
import Overture from "./stages/Overture";
import CoupleStage from "./stages/CoupleStage";
import CelebrationStage from "./stages/CelebrationStage";
import EnsembleStage from "./stages/EnsembleStage";
import DeliveryStage from "./stages/DeliveryStage";
import ReviewStage from "./stages/ReviewStage";
import ProposalStage from "./stages/ProposalStage";
import ComposedStage from "./stages/ComposedStage";
import type { StageProps } from "./stages/types";

export default function CommissionStudio({
  config: initialConfig,
  consultant,
  storageIssue,
}: {
  config: StudioConfig;
  consultant: string;
  storageIssue: string | null;
}) {
  const [config, setConfig] = useState(initialConfig);
  const { state, quote, actions } = useStudioStore(config);
  const [confirmReset, setConfirmReset] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const stageRef = useRef<HTMLElement>(null);

  const stageIdx = STAGES.findIndex((s) => s.id === state.stage);
  const current = STAGES[stageIdx];

  // Each stage change returns the reader to its top and moves focus to the
  // stage heading for screen-reader users.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    stageRef.current?.querySelector<HTMLElement>("h1, h2")?.focus({ preventScroll: true });
  }, [state.stage]);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (confirmReset && !d.open) d.showModal();
    if (!confirmReset && d.open) d.close();
  }, [confirmReset]);

  const go = (stage: StageId) => actions.go(stage);
  const props: StageProps = {
    config,
    draft: state.draft,
    quote,
    actions,
    go,
    consultant,
    submitted: state.submitted,
    onConfigRefresh: setConfig,
  };

  const names = coupleNames(state.draft.couple, "");
  const inJourney = state.stage !== "overture" && state.stage !== "composed";

  return (
    <div className={styles.shell} data-stage={state.stage}>
      <header className={styles.topbar}>
        <button className={styles.brand} onClick={() => go("overture")} aria-label="Return to the opening">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo-dark-header.png" alt="24 Frames" />
        </button>
        <div className={styles.topbarCenter}>
          {inJourney && current ? (
            <span className={styles.mono}>
              FRAME {current.frame} <span aria-hidden="true">/</span> 06 · {current.title.toUpperCase()}
            </span>
          ) : (
            <span className={styles.mono}>PRIVATE COMMISSION STUDIO</span>
          )}
          {names && <span className={styles.topbarNames}>{names}</span>}
        </div>
        <nav className={styles.topbarActions} aria-label="Studio">
          <span className={styles.consultant} title="Signed-in consultant">
            {consultant}
          </span>
          <a className={styles.btnGhost} href="/studio/admin" data-no-transition>
            Studio admin
          </a>
          <button className={styles.btnGhost} onClick={() => setConfirmReset(true)}>
            New consultation
          </button>
          <button
            className={styles.btnGhost}
            onClick={async () => {
              await fetch("/api/studio/auth", { method: "DELETE" }).catch(() => null);
              window.location.assign("/studio/login");
            }}
          >
            Sign out
          </button>
        </nav>
      </header>

      {storageIssue && (
        <div className={styles.banner} role="alert">
          Commission records are unavailable on this server: {storageIssue} Proposals can still be composed and
          downloaded, but they cannot be submitted until storage is configured.
        </div>
      )}

      {state.stage === "overture" ? (
        <Overture {...props} hasProgress={state.reached > 0} />
      ) : state.stage === "composed" ? (
        <ComposedStage {...props} />
      ) : (
        <div className={styles.workspace}>
          <nav className={styles.rail} aria-label="Commission stages">
            <ol>
              {STAGES.slice(1).map((s, i) => {
                const idx = i + 1;
                const reachable = idx <= state.reached || idx <= stageIdx + 1;
                const isCurrent = s.id === state.stage;
                return (
                  <li key={s.id}>
                    <button
                      className={`${styles.railItem} ${isCurrent ? styles.railCurrent : ""} ${idx < stageIdx ? styles.railDone : ""}`}
                      onClick={() => go(s.id)}
                      disabled={!reachable}
                      aria-current={isCurrent ? "step" : undefined}
                    >
                      <span className={styles.railFrame}>{s.frame}</span>
                      <span className={styles.railTitle}>{s.title}</span>
                      <span className={styles.railShort}>{s.short}</span>
                    </button>
                  </li>
                );
              })}
            </ol>
            <div className={styles.railFilm} aria-hidden="true">
              <span style={{ height: `${(Math.max(stageIdx, 1) / 6) * 100}%` }} />
            </div>
          </nav>

          <main className={styles.stage} ref={stageRef} key={state.stage}>
            {state.stage === "couple" && <CoupleStage {...props} />}
            {state.stage === "celebration" && <CelebrationStage {...props} />}
            {state.stage === "ensemble" && <EnsembleStage {...props} />}
            {state.stage === "delivery" && <DeliveryStage {...props} />}
            {state.stage === "commission" && <ReviewStage {...props} />}
            {state.stage === "proposal" && <ProposalStage {...props} />}
          </main>

          <Ledger config={config} draft={state.draft} quote={quote} onReview={() => go("commission")} />
        </div>
      )}

      <dialog
        ref={dialogRef}
        className={styles.dialog}
        onClose={() => setConfirmReset(false)}
        aria-labelledby="reset-title"
      >
        <h2 id="reset-title">Begin a new consultation?</h2>
        <p>
          {names ? `${names}'s` : "The current"} commission will be cleared from this screen.
          {state.submitted ? " It has been submitted and remains in the studio records." : " It has not been submitted."}
        </p>
        <div className={styles.dialogActions}>
          <button className={styles.btnSecondary} onClick={() => setConfirmReset(false)}>
            Keep working
          </button>
          <button
            className={styles.btnPrimary}
            onClick={() => {
              clearStoredConsultation();
              actions.reset();
              setConfirmReset(false);
            }}
          >
            Clear &amp; begin anew
          </button>
        </div>
      </dialog>

      <IdleLock onWipe={() => clearStoredConsultation()} />
    </div>
  );
}
