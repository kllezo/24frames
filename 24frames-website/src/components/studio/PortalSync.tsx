"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./studio.module.css";
import type { CommissionDraft } from "@/lib/commission/types";
import type { PortalInfo } from "./stages/types";
import ShareUpdate from "../portal/ShareUpdate";

/* Keeps an online client's quotation saved to their account as they
   compose it — quietly, a moment after each change. Once the quotation
   is with the studio, unsent changes surface a "Send update" button so the
   client can tell their relationship manager. */
export default function PortalSync({ portal, draft }: { portal: PortalInfo; draft: CommissionDraft }) {
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error" | "locked">(portal.editable ? "idle" : "locked");
  const [unshared, setUnshared] = useState(portal.unshared);
  const [sharing, setSharing] = useState(false);
  const [shared, setShared] = useState(false);
  const first = useRef(true);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (!portal.editable) return;
    if (first.current) {
      first.current = false;
      return;
    }
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(async () => {
      setStatus("saving");
      try {
        const res = await fetch(`/api/portal/quotes/${portal.quoteId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "save", draft }),
          keepalive: true,
        });
        if (res.status === 401) {
          window.location.assign(`/account/login?next=/account/quote/${portal.quoteId}`);
          return;
        }
        if (res.ok) {
          const data = (await res.json().catch(() => ({}))) as { quote?: { unshared?: boolean } };
          setUnshared(!!data.quote?.unshared);
          setShared(false);
        }
        setStatus(res.ok ? "saved" : res.status === 409 ? "locked" : "error");
      } catch {
        setStatus("error");
      }
    }, 1200);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [draft, portal.editable, portal.quoteId]);

  const text = {
    idle: shared ? "Update sent to the studio" : "Saved to your account",
    saving: "Saving…",
    saved: shared ? "Update sent to the studio" : unshared ? "Saved · not yet sent to the studio" : "Saved to your account",
    error: "Not saved — check your connection",
    locked: "With the studio · view only",
  }[status];
  const firstName = portal.manager?.name.split(" ")[0];

  return (
    <>
      <span className={styles.consultant} role="status" aria-live="polite" title={text}>
        {text}
      </span>
      {unshared && status !== "locked" && status !== "saving" && (
        <button className={styles.btnPrimary} onClick={() => setSharing(true)}>
          {firstName ? `Send update to ${firstName}` : "Send update to the studio"}
        </button>
      )}
      <ShareUpdate
        open={sharing}
        quoteId={portal.quoteId}
        reference={portal.reference}
        manager={portal.manager}
        onClose={() => setSharing(false)}
        onShared={() => {
          setUnshared(false);
          setShared(true);
        }}
      />
    </>
  );
}
