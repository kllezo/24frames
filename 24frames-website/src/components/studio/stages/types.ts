import type { CommissionDraft, CommissionQuote, CommissionRecord, StudioConfig } from "@/lib/commission/types";
import type { StageId, StudioActions } from "../state/store";
import type { ManagerCard } from "@/lib/portal/types";

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
  /** Their relationship manager, once assigned. */
  manager: ManagerCard | null;
  /** Saved changes the studio hasn't been told about yet. */
  unshared: boolean;
}
