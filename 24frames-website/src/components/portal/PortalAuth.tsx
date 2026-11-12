"use client";

import Link from "next/link";
import { useState } from "react";
import cx from "../studio/cinema.module.css";
import base from "../studio/studio.module.css";
import qx from "../studio/quotes/quotes.module.css";
import px from "./portal.module.css";

type Mode = "login" | "signup" | "setup" | "activate";

/* One sign-in surface for the whole portal.
   · clients: sign in or create an account to compose their quotation
   · studio:  sales & founder sign in; the very first visit sets up the
              founder account with the studio PIN */
export default function PortalAuth({
  audience,
  next,
  initialMode,
  storageIssue = null,
}: {
  audience: "client" | "staff";
  next: string;
  initialMode: Mode;
  storageIssue?: string | null;
}) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [f, setF] = useState({ name: "", email: "", phone: "", location: "", password: "", pin: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF((v) => ({ ...v, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/portal/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: mode, ...f }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string; next?: string; role?: string };
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      const dest = data.role === "client" ? (audience === "client" ? next : "/account") : "/desk";
      window.location.assign(dest);
    } catch {
      setError("We couldn't reach 24 Frames. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  const copy = {
    client: {
      login: { kicker: "Your quotations", title: <>Welcome <em>back.</em></>, cta: "Sign in" },
      signup: { kicker: "Begin online", title: <>Compose your wedding, <em>at your pace.</em></>, cta: "Create my account" },
      setup: { kicker: "", title: null, cta: "" },
      activate: { kicker: "", title: null, cta: "" },
    },
    staff: {
      login: { kicker: "The studio desk", title: <>Every quotation, <em>in one place.</em></>, cta: "Enter the desk" },
      signup: { kicker: "", title: null, cta: "" },
      setup: { kicker: "First visit", title: <>Set up the <em>founder account.</em></>, cta: "Create founder account" },
      activate: { kicker: "Authorised by the founder", title: <>Activate your <em>desk access.</em></>, cta: "Activate my access" },
    },
  }[audience][mode];

  return (
    <div className={`${cx.cinema} ${qx.page} ${px.authPage}`}>
      <aside className={px.authArt} aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={audience === "client" ? "/images/proposal/cover-photo.jpg" : "/images/proposal/workflow-photo.jpg"} alt="" />
        <span className={px.authArtCaption}>Photography · Cinema · Legacies</span>
      </aside>

      <form className={`${qx.gate} ${px.authForm}`} onSubmit={submit}>
        <Link href="/" className={px.authHome} aria-label="24 Frames home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={qx.gateLogo} src="/images/logo-dark-header.png" alt="24 Frames" />
        </Link>
        <p className={base.kicker}>{copy.kicker}</p>
        <h1 className={qx.gateTitle}>{copy.title}</h1>

        {audience === "client" && (
          <div className={`${base.segmented} ${px.authSwitch}`} role="tablist" aria-label="Account">
            <button type="button" role="tab" aria-selected={mode === "login"} className={mode === "login" ? base.segOn : ""} onClick={() => setMode("login")}>
              Sign in
            </button>
            <button type="button" role="tab" aria-selected={mode === "signup"} className={mode === "signup" ? base.segOn : ""} onClick={() => setMode("signup")}>
              Create account
            </button>
          </div>
        )}

        {audience === "staff" && mode !== "setup" && (
          <div className={`${base.segmented} ${px.authSwitch}`} role="tablist" aria-label="Desk access">
            <button type="button" role="tab" aria-selected={mode === "login"} className={mode === "login" ? base.segOn : ""} onClick={() => setMode("login")}>
              Sign in
            </button>
            <button type="button" role="tab" aria-selected={mode === "activate"} className={mode === "activate" ? base.segOn : ""} onClick={() => setMode("activate")}>
              First time here?
            </button>
          </div>
        )}
        {mode === "activate" && (
          <p className={qx.fine}>Use the exact email the founder authorised. Unauthorised emails can&apos;t get in.</p>
        )}

        {storageIssue && <p className={qx.error}>Accounts are unavailable on this server: {storageIssue}</p>}

        {(mode === "signup" || mode === "setup" || mode === "activate") && (
          <label className={cx.lux}>
            <input value={f.name} onChange={set("name")} placeholder=" " maxLength={80} autoComplete="name" required />
            <span>{mode === "setup" ? "Founder's name" : "Your name"}</span>
          </label>
        )}
        <label className={cx.lux}>
          <input type="email" value={f.email} onChange={set("email")} placeholder=" " maxLength={120} autoComplete="email" required />
          <span>Email</span>
        </label>
        {(mode === "signup" || mode === "activate") && (
          <label className={cx.lux}>
            <input type="tel" value={f.phone} onChange={set("phone")} placeholder=" " maxLength={20} autoComplete="tel" required={mode === "signup"} />
            <span>Mobile / WhatsApp</span>
          </label>
        )}
        {mode === "signup" && (
          <label className={cx.lux}>
            <input value={f.location} onChange={set("location")} placeholder=" " maxLength={120} autoComplete="address-level2" required />
            <span>City / location</span>
          </label>
        )}
        <label className={cx.lux}>
          <input
            type="password"
            value={f.password}
            onChange={set("password")}
            placeholder=" "
            maxLength={200}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            required
          />
          <span>{mode === "login" ? "Password" : "Choose a password"}</span>
        </label>
        {mode !== "login" && <p className={qx.fine}>At least 8 characters, with letters and a number.</p>}
        {mode === "setup" && (
          <label className={cx.lux}>
            <input type="password" inputMode="numeric" value={f.pin} onChange={set("pin")} placeholder=" " maxLength={32} autoComplete="off" required />
            <span>Studio PIN</span>
          </label>
        )}

        {error && <p className={qx.error} role="alert">{error}</p>}
        <button className={base.btnPrimary} disabled={busy}>
          {busy ? "One moment…" : copy.cta}
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M14 6l6 6-6 6" /></svg>
        </button>

        <p className={qx.fine}>
          {audience === "client" ? (
            <>Studio team? <a href="/desk/login">Sign in to the desk</a>.</>
          ) : (
            <>Planning your wedding? <a href="/account/login">Client sign-in</a>.</>
          )}
        </p>
      </form>
    </div>
  );
}
