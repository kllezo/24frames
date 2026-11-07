import type { CommissionDraft, CommissionQuote, CommissionRecord, StudioConfig } from "@/lib/commission/types";
import type { StageId, StudioActions } from "../state/store";

export interface StageProps {
  config: StudioConfig;
  draft: CommissionDraft;
  quote: CommissionQuote;
  actions: StudioActions;
  go: (stage: StageId) => void;
  consultant: string;
  submitted: CommissionRecord | null;
  onConfigRefresh: (config: StudioConfig) => void;
}
