"use client";

/* ============================================================
   Sharing a submitted commission — honestly.
   · The PDF is generated locally from the STORED record.
   · wa.me click-to-chat can carry text only; the PDF must be
     attached by hand. We say so, and log "opened", not "sent".
   · Native share hands the file to the device's share sheet;
     we log "handed to device" — we can't know what happened next.
   · WhatsApp Business Cloud API (when configured) uploads and
     sends the document; logged as "accepted by WhatsApp".
   ============================================================ */

import { useEffect, useMemo, useState } from "react";
import styles from "./proposal.module.css";
import base from "./studio.module.css";
import ProposalPreview, { downloadBlob, useProposalPdf } from "./ProposalPreview";
import { buildWhatsAppMessage, toWhatsAppDigits, whatsAppLink } from "@/lib/commission/message";
import { formatTimestamp } from "@/lib/commission/format";
import type { CommissionRecord, ShareActivity } from "@/lib/commission/types";

const STATUS_LABEL: Record<ShareActivity["status"], string> = {
  completed: "Done",
  opened: "Opened",
  failed: "Failed",
  handed_to_device: "Handed to device",
  accepted_by_api: "Accepted by WhatsApp",
};
const CHANNEL_LABEL: Record<ShareActivity["channel"], string> = {
  pdf_download: "PDF downloaded",
  whatsapp_click_to_chat: "WhatsApp message",
  native_share: "Device share",
  whatsapp_cloud_api: "WhatsApp Business API",
  message_copied: "Message copied",
};

export default function ShareCenter({ record }: { record: CommissionRecord }) {
  const config = record.configSnapshot;
  const input = useMemo(
    () => ({
      draft: record.draft,
      quote: record.quote,
      config,
      reference: record.reference,
      issuedAt: record.createdAt,
      consultant: record.consultant,
    }),
    [record, config],
  );
  const { state, render } = useProposalPdf(input);
  const [activity, setActivity] = useState<ShareActivity[]>(record.activity);
  const [cloud, setCloud] = useState<"unknown" | "configured" | "not_configured">("unknown");
  const [cloudBusy, setCloudBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [recipient, setRecipient] = useState(record.draft.couple.phone);

  const message = buildWhatsAppMessage(record.draft, record.quote, config, record.reference);
  const coupleDigits = toWhatsAppDigits(recipient);
  const canNativeShare =
    typeof navigator !== "undefined" &&
    state.status === "ready" &&
    typeof navigator.canShare === "function" &&
    navigator.canShare({ files: [new File([state.blob], state.filename, { type: "application/pdf" })] });

  useEffect(() => {
    fetch("/api/studio/whatsapp", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { configured: false }))
      .then((d: { configured: boolean }) => setCloud(d.configured ? "configured" : "not_configured"))
      .catch(() => setCloud("not_configured"));
  }, []);

  async function log(channel: ShareActivity["channel"], status: ShareActivity["status"], detail: string) {
    const res = await fetch(`/api/studio/commissions/${record.id}/activity`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ channel, status, detail }),
    }).catch(() => null);
    const data = res?.ok ? ((await res.json()) as { activity: ShareActivity }) : null;
    if (data) setActivity((a) => [...a, data.activity]);
    else setNote("This action happened on this device but could not be recorded in the studio log.");
  }

  function download() {
    if (state.status !== "ready") return;
    downloadBlob(state.blob, state.filename);
    void log("pdf_download", "completed", state.filename);
  }

  async function nativeShare() {
    if (state.status !== "ready") return;
    const file = new File([state.blob], state.filename, { type: "application/pdf" });
    try {
      await navigator.share({ files: [file], title: `24 Frames — ${record.reference}`, text: message });
      void log("native_share", "handed_to_device", "PDF and message passed to the device share sheet.");
    } catch (err) {
      if ((err as DOMException).name !== "AbortError") {
        void log("native_share", "failed", (err as Error).message.slice(0, 200));
      }
    }
  }

  function openWhatsApp(to: "couple" | "studio") {
    const digits = to === "couple" ? coupleDigits : config.studio.whatsappNumber;
    window.open(whatsAppLink(digits, message), "_blank", "noopener");
    void log(
      "whatsapp_click_to_chat",
      "opened",
      `WhatsApp opened for ${to === "couple" ? `the couple (+${digits})` : "the studio number"} with the summary. PDF to be attached manually.`,
    );
    setNote("WhatsApp is open with the summary. Attach the downloaded PDF in the chat before sending — it is not attached automatically.");
  }

  async function copyMessage() {
    try {
      await navigator.clipboard.writeText(message);
      setNote("Message copied.");
      void log("message_copied", "completed", "WhatsApp summary copied to clipboard.");
    } catch {
      setNote("Copy failed — select the message text instead.");
    }
  }

  async function sendViaCloud() {
    if (state.status !== "ready" || !coupleDigits) return;
    setCloudBusy(true);
    setNote(null);
    const form = new FormData();
    form.append("commissionId", record.id);
    form.append("to", coupleDigits);
    form.append("pdf", state.blob, state.filename);
    const res = await fetch("/api/studio/whatsapp", { method: "POST", body: form }).catch(() => null);
    const data = res ? await res.json().catch(() => ({})) : {};
    setCloudBusy(false);
    if (res?.ok && data.activity) {
      setActivity((a) => [...a, data.activity]);
      setNote("Accepted by WhatsApp. Delivery has not been confirmed yet.");
    } else {
      setNote(`WhatsApp Business could not send the PDF: ${data.error ?? "unknown error"}`);
      if (res && res.status !== 501) {
        // failures are logged server-side; refresh is enough
      }
    }
  }

  return (
    <section className={styles.share} aria-label="Proposal and sharing">
      <ProposalPreview state={state} onRetry={render} draftLabel={`PROPOSAL · ${record.reference}`} />

      <div className={styles.sharePanel}>
        <h2 className={styles.shareTitle}>Share the proposal</h2>

        <div className={styles.shareStep}>
          <span className={base.mono}>01</span>
          <div>
            <h3>Keep the studio copy</h3>
            <button className={base.btnPrimary} onClick={download} disabled={state.status !== "ready"}>
              Download PDF
            </button>
          </div>
        </div>

        <div className={styles.shareStep}>
          <span className={base.mono}>02</span>
          <div>
            <h3>Send on WhatsApp</h3>
            <label className={base.field}>
              <span className={base.fieldLabel}>Couple&apos;s WhatsApp number</span>
              <input className={base.input} value={recipient} onChange={(e) => setRecipient(e.target.value)} inputMode="tel" />
            </label>
            <div className={styles.shareRow}>
              <button className={base.btnSecondary} onClick={() => openWhatsApp("couple")} disabled={!coupleDigits}>
                Message the couple
              </button>
              <button className={base.btnSecondary} onClick={() => openWhatsApp("studio")}>
                Send to studio WhatsApp
              </button>
              {canNativeShare && (
                <button className={base.btnSecondary} onClick={nativeShare}>Share PDF from this device</button>
              )}
              <button className={base.btnText} onClick={copyMessage}>Copy message</button>
            </div>
            <p className={styles.fine}>
              WhatsApp links carry the text summary only. Attach the downloaded PDF in the chat
              {canNativeShare ? ", or use “Share PDF” to send the file directly from this device" : ""}.
            </p>
          </div>
        </div>

        <div className={styles.shareStep}>
          <span className={base.mono}>03</span>
          <div>
            <h3>Automated delivery</h3>
            {cloud === "configured" ? (
              <>
                <button className={base.btnSecondary} onClick={sendViaCloud} disabled={cloudBusy || !coupleDigits || state.status !== "ready"}>
                  {cloudBusy ? "Sending…" : "Send PDF via WhatsApp Business"}
                </button>
                <p className={styles.fine}>Requires an open 24-hour conversation with the couple or an approved template.</p>
              </>
            ) : (
              <p className={styles.fine}>
                {cloud === "unknown"
                  ? "Checking WhatsApp Business configuration…"
                  : "WhatsApp Business Cloud API is not configured for this studio, so PDFs are never sent automatically. Use the steps above."}
              </p>
            )}
          </div>
        </div>

        {note && <p className={styles.shareNote} role="status">{note}</p>}

        <div className={styles.activity}>
          <h3>Sharing status</h3>
          {activity.length === 0 ? (
            <p className={styles.fine}>Generated on this device. Not yet downloaded or shared.</p>
          ) : (
            <ol>
              {activity.map((a) => (
                <li key={a.id}>
                  <span className={`${styles.pill} ${a.status === "failed" ? styles.pillFail : ""}`}>{STATUS_LABEL[a.status]}</span>
                  <span>
                    <b>{CHANNEL_LABEL[a.channel]}</b> — {a.detail}
                    <small>{formatTimestamp(a.at)} · {a.by}</small>
                  </span>
                </li>
              ))}
            </ol>
          )}
        </div>
        <details className={styles.messagePreview}>
          <summary>WhatsApp message</summary>
          <pre>{message}</pre>
        </details>
      </div>
    </section>
  );
}
