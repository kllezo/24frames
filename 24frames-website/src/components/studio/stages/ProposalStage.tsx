"use client";

import { useMemo, useState } from "react";
import st from "../stages.module.css";
import styles from "../proposal.module.css";
import base from "../studio.module.css";
import { StageFooter, StageHeader } from "./StageChrome";
import ProposalPreview, { downloadBlob, useProposalPdf } from "../ProposalPreview";
import { validateDraftForSubmit } from "@/lib/commission/validation";
import { buildWhatsAppMessage } from "@/lib/commission/message";
import { formatINR } from "@/lib/commission/format";
import { coupleNames } from "@/lib/commission/model";
import type { CommissionRecord, StudioConfig } from "@/lib/commission/types";
import type { StageProps } from "./types";

export default function ProposalStage({ config, draft, quote, actions, go, consultant, onConfigRefresh }: StageProps) {
  const issues = validateDraftForSubmit(draft, config);
  const messages = Array.from(new Set(issues.map((i) => i.message)));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const issuedAt = useMemo(() => new Date().toISOString(), []);
  const { state, render } = useProposalPdf({ draft, quote, config, reference: null, issuedAt, consultant });
  const message = buildWhatsAppMessage(draft, quote, config, null);

  async function submit() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/studio/commissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ draft, expectedGrandTotal: quote.grandTotal, configVersion: config.version }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        record?: CommissionRecord;
        error?: string;
        code?: string;
        config?: StudioConfig;
        issues?: { message: string }[];
      };
      if (res.status === 201 && data.record) {
        actions.submitted(data.record);
        return;
      }
      if (res.status === 409 && data.code === "pricing_changed" && data.config) {
        onConfigRefresh(data.config);
      }
      if (res.status === 401) {
        setError("The studio session has expired. Sign in again — this commission is kept on this screen.");
      } else {
        setError(
          [data.error ?? `Submission failed (${res.status}).`, ...(data.issues?.map((i) => i.message) ?? [])].join(" "),
        );
      }
    } catch {
      setError("The studio server could not be reached. Nothing was submitted — please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={st.stageInner}>
      <StageHeader
        frame="06"
        kicker="Frame 06 · The Proposal"
        title={<>A proposal, composed <em>for {coupleNames(draft.couple, "you")}.</em></>}
        lead="Preview the proposal exactly as it will be shared. Submitting records the commission with the studio and issues its reference."
      />

      <div className={styles.proposalGrid}>
        <ProposalPreview state={state} onRetry={render} draftLabel="DRAFT PREVIEW · REFERENCE ISSUED ON SUBMISSION" />

        <aside className={styles.submitPanel}>
          <p className={base.kicker}>Estimated commission</p>
          <p className={styles.submitTotal}>{formatINR(quote.grandTotal)}</p>
          <p className={st.muted}>
            {quote.postProduction.tierLabel ? `${quote.postProduction.priorityName} · ${quote.postProduction.tierLabel}` : "No delivery timeline chosen"}
          </p>

          {messages.length > 0 ? (
            <div className={st.checklist} role="status">
              <p><b>To submit, please complete:</b></p>
              <ul>{messages.map((m) => <li key={m}>{m}</li>)}</ul>
            </div>
          ) : null}

          <button className={`${base.btnPrimaryLg} ${styles.submitBtn}`} onClick={submit} disabled={busy || messages.length > 0}>
            {busy ? "Recording your commission…" : "Submit my commission"}
          </button>
          {error && <p className={base.error} role="alert">{error}</p>}

          <button
            className={base.btnSecondary}
            disabled={state.status !== "ready"}
            onClick={() => state.status === "ready" && downloadBlob(state.blob, state.filename)}
          >
            Download draft PDF
          </button>

          <details className={styles.messagePreview}>
            <summary>WhatsApp message preview</summary>
            <pre>{message}</pre>
          </details>
          <p className={styles.fine}>
            Submitting stores this commission in the studio records. The PDF and WhatsApp message are prepared next —
            nothing is sent automatically.
          </p>
        </aside>
      </div>

      <StageFooter onBack={() => go("commission")} backLabel="Back to the commission" />
    </div>
  );
}
