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

import { useMemo, useState } from "react";
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
  const [note, setNote] = useState<string | null>(null);
  const [recipient, setRecipient] = useState(record.draft.couple.phone);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [linking, setLinking] = useState(false);

  const message = buildWhatsAppMessage(record.draft, record.quote, config, record.reference);
  const coupleDigits = toWhatsAppDigits(recipient);
  const canNativeShare =
    typeof navigator !== "undefined" &&
    state.status === "ready" &&
    typeof navigator.canShare === "function" &&
    navigator.canShare({ files: [new File([state.blob], state.filename, { type: "application/pdf" })] });

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

  /** Upload the PDF once and return its private link. */
  async function ensureLink(): Promise<string | null> {
    if (pdfUrl) return pdfUrl;
    if (state.status !== "ready") return null;
    const form = new FormData();
    form.append("pdf", state.blob, state.filename);
    const res = await fetch(`/api/studio/commissions/${record.id}/pdf`, { method: "POST", body: form }).catch(() => null);
    const data = res ? await res.json().catch(() => ({})) : {};
    if (!res?.ok || !data.url) {
      setNote(`The PDF link could not be created: ${data.error ?? "the studio server could not be reached"}.`);
      return null;
    }
    setPdfUrl(data.url);
    return data.url as string;
  }

  /** WhatsApp the couple the summary plus a private link to the PDF. */
  async function sendPdfOnWhatsApp(to: "couple" | "studio") {
    const digits = to === "couple" ? coupleDigits : config.studio.whatsappNumber;
    // Open the tab inside the click so pop-up blockers allow it, then fill it.
    const tab = window.open("about:blank", "_blank");
    setLinking(true);
    const url = await ensureLink();
    setLinking(false);
    if (!url) {
      tab?.close();
      return;
    }
    const text = `${message}\n\nYour proposal (PDF): ${url}`;
    if (tab) {
      tab.opener = null;
      tab.location.href = whatsAppLink(digits, text);
    } else {
      window.location.href = whatsAppLink(digits, text);
    }
    void log(
      "whatsapp_click_to_chat",
      "opened",
      `WhatsApp opened for ${to === "couple" ? `the couple (+${digits})` : "the studio number"} with the summary and a private PDF link.`,
    );
    setNote("WhatsApp is open with the message and the PDF link. Press send in WhatsApp to deliver it.");
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

  return (
    <section className={styles.share} aria-label="Proposal and sharing">
      <ProposalPreview state={state} onRetry={render} draftLabel={`PROPOSAL · ${record.reference}`} />

      <div className={styles.sharePanel}>
        <p className={base.kicker}>The proposal is ready</p>
        <h2 className={styles.shareTitle}>Share it with the couple</h2>

        <div className={styles.shareStep}>
          <span className={base.mono}>01</span>
          <div>
            <h3>Download</h3>
            <button className={base.btnPrimary} onClick={download} disabled={state.status !== "ready"}>
              Download PDF
            </button>
          </div>
        </div>

        <div className={styles.shareStep}>
          <span className={base.mono}>02</span>
          <div>
            <h3>WhatsApp</h3>
            <label className={base.field}>
              <span className={base.fieldLabel}>Couple&apos;s WhatsApp number</span>
              <input className={base.input} value={recipient} onChange={(e) => setRecipient(e.target.value)} inputMode="tel" />
            </label>
            <div className={styles.shareRow}>
              <button
                className={base.btnPrimary}
                onClick={() => sendPdfOnWhatsApp("couple")}
                disabled={!coupleDigits || state.status !== "ready" || linking}
              >
                {linking ? "Preparing the PDF…" : "Send PDF on WhatsApp"}
              </button>
              <button className={base.btnSecondary} onClick={() => sendPdfOnWhatsApp("studio")} disabled={state.status !== "ready" || linking}>
                Send to studio WhatsApp
              </button>
            </div>
            <div className={styles.shareRow}>
              {canNativeShare && (
                <button className={base.btnText} onClick={nativeShare}>Attach the PDF file instead</button>
              )}
              <button className={base.btnText} onClick={() => openWhatsApp("couple")} disabled={!coupleDigits}>Message without the PDF</button>
              <button className={base.btnText} onClick={copyMessage}>Copy message</button>
            </div>
            <p className={styles.fine}>Sends the summary with a private link to the PDF.{pdfUrl ? " Link ready." : ""}</p>
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
