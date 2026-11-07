"use client";

/* ============================================================
   Session guard for an unattended studio screen.
   · Real interaction pings /api/studio/session at most every
     2 minutes → the proxy slides the 30-minute server session.
   · 25 minutes without interaction → the screen locks behind a
     veil (customer data hidden) and asks for the PIN again.
   · A 401 from the keep-alive (server session expired) also locks.
   The draft stays in this tab's sessionStorage; the consultant can
   choose "New consultation" from the lock screen to wipe it.
   ============================================================ */

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "../studio.module.css";

const LOCK_AFTER_MS = 25 * 60 * 1000;
const PING_EVERY_MS = 2 * 60 * 1000;

export default function IdleLock({ onWipe }: { onWipe: () => void }) {
  const [locked, setLocked] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const lastActivity = useRef(0);
  const lastPing = useRef(0);

  useEffect(() => {
    lastActivity.current = Date.now();
    lastPing.current = Date.now();
  }, []);

  const ping = useCallback(async () => {
    lastPing.current = Date.now();
    try {
      const res = await fetch("/api/studio/session", { cache: "no-store" });
      if (res.status === 401) setLocked(true);
    } catch {
      /* offline — keep working locally */
    }
  }, []);

  useEffect(() => {
    if (locked) return;
    const onActivity = () => {
      lastActivity.current = Date.now();
      if (Date.now() - lastPing.current > PING_EVERY_MS) void ping();
    };
    const events = ["pointerdown", "keydown", "wheel", "touchstart"] as const;
    events.forEach((e) => window.addEventListener(e, onActivity, { passive: true }));
    const timer = window.setInterval(() => {
      if (Date.now() - lastActivity.current > LOCK_AFTER_MS) setLocked(true);
    }, 15000);
    return () => {
      events.forEach((e) => window.removeEventListener(e, onActivity));
      window.clearInterval(timer);
    };
  }, [locked, ping]);

  async function unlock(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await fetch("/api/studio/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin }),
    }).catch(() => null);
    if (!res) return setError("The studio server could not be reached.");
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setPin("");
      return setError(data.error ?? "That PIN isn't right.");
    }
    setPin("");
    lastActivity.current = Date.now();
    lastPing.current = Date.now();
    setLocked(false);
  }

  if (!locked) return null;
  return (
    <div className={styles.lockVeil} role="dialog" aria-modal="true" aria-labelledby="lock-title">
      <form className={styles.lockCard} onSubmit={unlock}>
        <svg className={styles.lockGlyph} viewBox="0 0 48 48" aria-hidden="true">
          <path d="M15 21v-6a9 9 0 0 1 18 0v6" />
          <rect x="10" y="21" width="28" height="20" rx="1.5" />
          <circle cx="24" cy="30" r="2.2" />
          <path d="M24 32v4" />
        </svg>
        <h2 id="lock-title">The studio is paused</h2>
        <p>For the couple&apos;s privacy, this consultation locked after a period of inactivity.</p>
        <input
          className={`${styles.input} ${styles.pinInput}`}
          type="password"
          inputMode="numeric"
          aria-label="Studio PIN"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          autoFocus
        />
        {error && <p className={styles.error} role="alert">{error}</p>}
        <button className={styles.btnPrimary} type="submit">Resume consultation</button>
        <button
          className={styles.btnText}
          type="button"
          onClick={async () => {
            onWipe();
            await fetch("/api/studio/auth", { method: "DELETE" }).catch(() => null);
            window.location.assign("/studio/login");
          }}
        >
          Discard this consultation &amp; sign out
        </button>
      </form>
    </div>
  );
}
