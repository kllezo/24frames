"use client";

import { useEffect, useRef, useState } from "react";
import base from "../studio/studio.module.css";
import px from "./portal.module.css";
import type { ManagerCard } from "@/lib/portal/types";

/* After a client changes a quotation that is already with the studio,
   they choose how their relationship manager hears about it:
     · a notification on the studio desk, or
     · a WhatsApp message to the manager (the desk is notified as well). */
export default function ShareUpdate({
  open,
  quoteId,
  reference,
  manager,
  onClose,
  onShared,
  request = false,
}: {
  /** Locked quotation: ask the relationship manager to reopen it instead. */
  request?: boolean;
  open: boolean;
  quoteId: string;
  reference: string;
  manager: ManagerCard | null;
  onClose: () => void;
  onShared: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const first = manager?.name.split(" ")[0] ?? null;
  const wa = manager?.phone.replace(/[^\d]/g, "") ?? "";

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  async function share(via: "studio" | "whatsapp") {
    if (request && !note.trim()) {
      setError("Tell us what you'd like to change.");
      return;
    }
    setBusy(true);
    setError(null);
    // Open WhatsApp synchronously (inside the click) so pop-up blockers allow it.
    if (via === "whatsapp" && wa) {
      const text = request
        ? `Hi ${first}, I'd like to make a change to my 24 Frames quotation (${reference}): ${note.trim()}`
        : `Hi ${first}, I've updated my 24 Frames quotation (${reference}).${note.trim() ? ` ${note.trim()}` : ""}`;
      window.open(`https://wa.me/${wa}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
    }
    const res = await fetch(`/api/portal/quotes/${quoteId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "share_update", note, via }),
    }).catch(() => null);
    setBusy(false);
    if (res?.status === 401) {
      window.location.assign(`/account/login?next=/account/quote/${quoteId}`);
      return;
    }
    if (res?.ok) {
      setNote("");
      onShared();
      onClose();
      return;
    }
    const data = res ? ((await res.json().catch(() => ({}))) as { error?: string }) : {};
    setError(data.error ?? "We couldn't reach the studio. Your changes are saved — please try again.");
  }

  return (
    <dialog data-lenis-prevent ref={ref} className={base.dialog} onClose={onClose} aria-labelledby="share-title">
      {request ? (
        <>
          <h2 id="share-title">{first ? `Ask ${first} to change your quotation` : "Ask the studio to change your quotation"}</h2>
          <p>
            {reference} is locked while the studio finalises it, or once it&apos;s accepted. Tell{" "}
            {first ?? "your relationship manager"} what you&apos;d like to change — they&apos;ll reopen it so you can edit, or update it for you.
          </p>
        </>
      ) : (
        <>
          <h2 id="share-title">{first ? `Let ${first} know about your changes` : "Send your changes to the studio"}</h2>
          <p>
            Your changes to {reference} are saved.{" "}
            {first
              ? `${first}, your relationship manager, will review the latest version and confirm the price with you.`
              : "Your relationship manager will review the latest version and confirm the price with you."}
          </p>
        </>
      )}
      <label className={px.field} style={{ marginTop: 6 }}>
        <span>{request ? "What would you like to change?" : "A note (optional)"}</span>
        <textarea
          rows={3}
          maxLength={1000}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={request ? "e.g. We'd like to add a Mehendi and drop the drone at the reception." : "e.g. We added a Sangeet and one more photographer for the reception."}
        />
      </label>
      {error && <p className={base.error} role="alert">{error}</p>}
      <div className={base.dialogActions}>
        <button className={base.btnSecondary} onClick={onClose} disabled={busy}>
          Later
        </button>
        {wa && (
          <button className={base.btnSecondary} onClick={() => share("whatsapp")} disabled={busy}>
            Send on WhatsApp
          </button>
        )}
        <button className={base.btnPrimary} onClick={() => share("studio")} disabled={busy}>
          {busy ? "Sending…" : request ? "Send request" : first ? `Notify ${first}` : "Notify the studio"}
        </button>
      </div>
    </dialog>
  );
}
