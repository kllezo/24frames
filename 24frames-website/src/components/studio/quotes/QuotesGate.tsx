"use client";

import { useState } from "react";
import cx from "../cinema.module.css";
import base from "../studio.module.css";
import qx from "./quotes.module.css";

export default function QuotesGate({ consultant: initial }: { consultant: string }) {
  const [name, setName] = useState(initial);
  const [pin, setPin] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function enter(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !pin.trim()) {
      setError("Enter your name and the studio PIN.");
      return;
    }
    setBusy(true);
    setError(null);
    const post = (body: object) =>
      fetch("/api/studio/auth", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    const a = await post({ pin, consultant: name.trim() }).catch(() => null);
    if (!a?.ok) {
      const data = a ? await a.json().catch(() => ({})) : {};
      setError(data.error ?? "Could not sign in. Check your connection.");
      setBusy(false);
      return;
    }
    const b = await post({ pin, scope: "admin" }).catch(() => null);
    if (!b?.ok) {
      setError("Signed in, but the quote book needs the PIN again.");
      setBusy(false);
      return;
    }
    window.location.reload();
  }

  return (
    <div className={`${cx.cinema} ${qx.page}`}>
      <form className={qx.gate} onSubmit={enter}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={qx.gateLogo} src="/images/logo-dark-header.png" alt="24 Frames" />
        <p className={base.kicker}>The quote book</p>
        <h1 className={qx.gateTitle}>Every commission, <em>in one place.</em></h1>
        <label className={cx.lux}>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder=" " maxLength={60} autoComplete="name" />
          <span>Consultant name</span>
        </label>
        <label className={cx.lux}>
          <input type="password" inputMode="numeric" value={pin} onChange={(e) => setPin(e.target.value)} placeholder=" " maxLength={32} autoComplete="current-password" />
          <span>Studio PIN</span>
        </label>
        {error && <p className={qx.error} role="alert">{error}</p>}
        <button className={base.btnPrimary} disabled={busy}>
          {busy ? "Opening…" : "Open the quote book"}
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M14 6l6 6-6 6" /></svg>
        </button>
        <p className={qx.fine}>For the 24 Frames studio only. Access lasts 15 minutes.</p>
      </form>
    </div>
  );
}
