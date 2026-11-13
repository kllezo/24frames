"use client";

import st from "../stages.module.css";
import CommissionSheet, { type SheetSection } from "../CommissionSheet";
import { StageFooter, StageHeader } from "./StageChrome";
import { validateDraftForSubmit } from "@/lib/commission/validation";
import type { StageProps } from "./types";

export default function ReviewStage({ config, draft, quote, go }: StageProps) {
  const issues = validateDraftForSubmit(draft, config);
  const onEdit = (s: SheetSection) => go(s);
  return (
    <div className={st.stageInner}>
      <StageHeader
        frame="07"
        kicker="Frame 07 · The Commission"
        title={<>Your celebration, <em>composed.</em></>}
        lead="Read it through together. Anything can be revised — every change carries through to the proposal."
      />
      <CommissionSheet config={config} draft={draft} quote={quote} onEdit={onEdit} />
      {issues.length > 0 && (
        <div className={st.checklist} role="status">
          <p><b>Before the proposal can be submitted</b></p>
          <ul>{Array.from(new Set(issues.map((i) => i.message))).map((m) => <li key={m}>{m}</li>)}</ul>
        </div>
      )}
      <StageFooter onBack={() => go("delivery")} onNext={() => go("proposal")} nextLabel="Compose the proposal" />
    </div>
  );
}
