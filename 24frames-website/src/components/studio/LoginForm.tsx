"use client";

import { useState } from "react";
import styles from "./studio.module.css";
import cx from "./cinema.module.css";

export default function LoginForm({
  next,
  configured,
  reason,
}: {
  next: string;
  configured: boolean;
  reason: string | null;
}) {
  const [pin, setPin] = useState("");
  const [consultant, setConsultant] = useState("");
  const [error, setError] = useState<string | null>(
    reason === "timeout" ? "Your studio session timed out. Sign in to continue." : null,
  );
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!pin.trim()) return setError("Enter the studio PIN.");
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/studio/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin, consultant }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Sign-in failed.");
        setPin("");
        setBusy(false);
        return;
      }
      window.location.assign(next);
    } catch {
      setError("The studio server could not be reached.");
      setBusy(false);
    }
  }

  return (
    <main className={`${styles.login} ${cx.cinema}`}>
      <div className={styles.loginVisual} aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/portfolio/sireesh-harshitha/cover.jpg" alt="" />
        <div className={styles.loginVisualCaption}>
          <span className={styles.mono}>24 FRAMES · PRIVATE ATELIER</span>
        </div>
      </div>
      <section className={styles.loginPanel}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={styles.loginLogo} src="/images/logo-dark-header.png" alt="24 Frames" />
        <p className={styles.kicker}>Studio access</p>
        <h1 className={styles.loginTitle}>
          Enter the <em>atelier</em>
        </h1>
        <p className={styles.loginLead}>
          This consultation space is reserved for the 24 Frames studio. Sign in to begin a couple&apos;s commission.
        </p>

        {!configured ? (
          <div className={styles.notice} role="alert">
            Studio access has not been configured on this server. Set <code>STUDIO_PIN</code> and{" "}
            <code>STUDIO_SESSION_SECRET</code> (see <code>.env.example</code>).
          </div>
        ) : (
          <form className={styles.loginForm} onSubmit={submit} noValidate>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>Consultant name</span>
              <input
                className={styles.input}
                value={consultant}
                onChange={(e) => setConsultant(e.target.value)}
                autoComplete="name"
                placeholder="e.g. Phani"
                maxLength={60}
              />
            </label>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>Studio PIN</span>
              <input
                className={`${styles.input} ${styles.pinInput}`}
                type="password"
                inputMode="numeric"
                autoComplete="current-password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                aria-invalid={!!error}
                aria-describedby={error ? "login-error" : undefined}
                autoFocus
              />
            </label>
            {error && (
              <p id="login-error" className={styles.error} role="alert">
                {error}
              </p>
            )}
            <button className={styles.btnPrimary} type="submit" disabled={busy}>
              {busy ? "Opening…" : "Enter the studio"}
            </button>
          </form>
        )}
        <p className={styles.loginFoot}>Sessions close automatically after 30 minutes of inactivity.</p>
      </section>
    </main>
  );
}
