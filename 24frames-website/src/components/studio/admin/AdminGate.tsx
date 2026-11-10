"use client";

import { useState } from "react";
import styles from "../studio.module.css";
import cx from "../cinema.module.css";
import Crest from "../ui/Crest";

/* The studio admin asks for the PIN again, even inside a signed-in
   session, so a consultation left open on a couple's screen never
   exposes prices, bands or other couples' records. */
export default function AdminGate() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!pin.trim()) return setError("Enter the studio PIN.");
    setBusy(true);
    setError(null);
    const res = await fetch("/api/studio/auth", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ pin, scope: "admin" }),
    }).catch(() => null);
    if (res?.ok) {
      window.location.reload();
      return;
    }
    const data = res ? await res.json().catch(() => null) : null;
    setError(data?.error ?? "The studio server could not be reached.");
    setPin("");
    setBusy(false);
  }

  return (
    <main className={`${cx.cinema} ${cx.gate}`}>
      <form className={cx.gateCard} onSubmit={submit}>
        <Crest className={cx.gateCrest} />
        <p className={styles.kicker}>Studio admin</p>
        <h1 className={cx.gateTitle}>
          The <em>private</em> rooms
        </h1>
        <span className={cx.ornament} aria-hidden="true"><i /></span>
        <p className={cx.gateLead}>Prices, delivery bands and every couple&apos;s records live here. Confirm the studio PIN to enter.</p>
        <label className={styles.field}>
          <span className={styles.fieldLabel}>Studio PIN</span>
          <input
            className={`${styles.input} ${styles.pinInput}`}
            type="password"
            inputMode="numeric"
            autoComplete="current-password"
            autoFocus
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            aria-invalid={!!error || undefined}
          />
        </label>
        {error && <p className={styles.error} role="alert">{error}</p>}
        <button className={styles.btnPrimaryLg} disabled={busy}>{busy ? "Confirming…" : "Enter the admin"}</button>
        <a className={styles.btnText} href="/quotebuilder" data-no-transition>Return to the consultation</a>
      </form>
    </main>
  );
}
