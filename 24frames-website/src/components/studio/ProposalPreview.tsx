"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./proposal.module.css";
import base from "./studio.module.css";
import { proposalFilename, renderProposalPdf } from "./pdf/generate";
import type { ProposalInput } from "./pdf/ProposalDocument";
import { coupleNames } from "@/lib/commission/model";

export type PdfState =
  | { status: "idle" | "rendering" }
  | { status: "ready"; blob: Blob; url: string; filename: string }
  | { status: "error"; message: string };

/* Generates the proposal PDF for an input and keeps an object URL alive. */
export function useProposalPdf(input: Omit<ProposalInput, "origin"> | null, auto = true) {
  const [state, setState] = useState<PdfState>({ status: "idle" });
  const urlRef = useRef<string | null>(null);
  const inputRef = useRef(input);
  useEffect(() => {
    inputRef.current = input;
  });

  const render = useCallback(async () => {
    const current = inputRef.current;
    if (!current) return;
    setState({ status: "rendering" });
    try {
      const blob = await renderProposalPdf({ ...current, origin: window.location.origin });
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
      const url = URL.createObjectURL(blob);
      urlRef.current = url;
      setState({
        status: "ready",
        blob,
        url,
        filename: proposalFilename(coupleNames(current.draft.couple), current.reference),
      });
    } catch (err) {
      console.error("[proposal] PDF render failed", err);
      setState({ status: "error", message: (err as Error).message || "The proposal could not be composed." });
    }
  }, []);

  const key = input ? `${input.reference}|${input.draft.updatedAt}|${input.quote.grandTotal}|${input.config.version}|${input.finalPrice ?? ""}` : "";
  useEffect(() => {
    if (auto && key) void render();
  }, [auto, key, render]);

  useEffect(() => () => { if (urlRef.current) URL.revokeObjectURL(urlRef.current); }, []);

  return { state, render };
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.setAttribute("data-no-transition", "");
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 4000);
}

export default function ProposalPreview({
  state,
  onRetry,
  draftLabel,
}: {
  state: PdfState;
  onRetry: () => void;
  draftLabel?: string;
}) {
  return (
    <div className={styles.preview}>
      <div className={styles.previewBar}>
        <span className={base.mono}>{draftLabel ?? "PROPOSAL PREVIEW"}</span>
        {state.status === "ready" && (
          <a className={base.btnText} href={state.url} target="_blank" rel="noopener" data-no-transition>
            Open full screen ↗
          </a>
        )}
      </div>
      <div className={styles.previewFrame}>
        {state.status === "ready" ? (
          <iframe src={`${state.url}#view=FitH`} title="Proposal PDF preview" />
        ) : state.status === "error" ? (
          <div className={styles.previewMsg} role="alert">
            <p>The proposal could not be composed.</p>
            {/chunk/i.test(state.message) ? (
              <>
                <small>The studio was updated while this page was open. Reload to continue — your commission is kept.</small>
                <button className={base.btnSecondary} onClick={() => window.location.reload()}>Reload the studio</button>
              </>
            ) : (
              <>
                <small>{state.message}</small>
                <button className={base.btnSecondary} onClick={onRetry}>Try again</button>
              </>
            )}
          </div>
        ) : (
          <div className={styles.previewMsg} aria-live="polite">
            <span className={styles.develop} aria-hidden="true" />
            <p>Composing your proposal…</p>
            <small>Setting type, placing photographs, binding pages.</small>
          </div>
        )}
      </div>
    </div>
  );
}
