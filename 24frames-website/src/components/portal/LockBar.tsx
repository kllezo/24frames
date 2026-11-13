"use client";

import { useState } from "react";
import base from "../studio/studio.module.css";
import px from "./portal.module.css";
import ShareUpdate from "./ShareUpdate";
import type { PortalInfo } from "../studio/stages/types";

/* Shown across a quotation the client can't edit right now, so the page
   never feels broken: why it is locked, and how to ask for a change. */
export default function LockBar({ portal }: { portal: PortalInfo }) {
  const [asking, setAsking] = useState(false);
  const [sent, setSent] = useState(false);
  const first = portal.manager?.name.split(" ")[0] ?? null;
  const accepted = portal.status === "accepted";
  return (
    <div className={px.lockBar} role="status">
      <p>
        {sent ? (
          <>
            <b>Request sent.</b> {first ?? "Your relationship manager"} will reopen the quotation or update it for you.
          </>
        ) : accepted ? (
          <>
            <b>You&apos;ve accepted this quotation, so it&apos;s locked.</b> You can look through every page; to change
            anything, ask {first ?? "your relationship manager"} and they&apos;ll reopen it for you.
          </>
        ) : (
          <>
            <b>The studio is finalising your quotation, so it&apos;s view-only for now.</b> You can edit it again once
            it&apos;s shared with you — or ask {first ?? "your relationship manager"} for a change.
          </>
        )}
      </p>
      {!sent && (
        <button className={base.btnPrimary} onClick={() => setAsking(true)}>
          Request a change
        </button>
      )}
      <ShareUpdate
        request
        open={asking}
        quoteId={portal.quoteId}
        reference={portal.reference}
        manager={portal.manager}
        onClose={() => setAsking(false)}
        onShared={() => setSent(true)}
      />
    </div>
  );
}
