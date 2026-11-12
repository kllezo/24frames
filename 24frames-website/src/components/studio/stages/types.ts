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
  portal?: PortalInfo;
}

/** The online client portal: this quotation lives in the client's account. */
export interface PortalInfo {
  quoteId: string;
  reference: string;
  status: string;
  editable: boolean;
  clientName: string;
  initialDraft: CommissionDraft | null;
}
