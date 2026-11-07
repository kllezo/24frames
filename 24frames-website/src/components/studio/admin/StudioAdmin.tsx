"use client";

import { useEffect, useState } from "react";
import styles from "../admin.module.css";
import base from "../studio.module.css";
import RecordsPanel from "./RecordsPanel";
import { ServicesEditor, PostProductionEditor, StudioEditor } from "./ConfigEditors";
import IllustrativeTag from "../ui/IllustrativeTag";
import { formatTimestamp } from "@/lib/commission/format";
import type { StudioConfig } from "@/lib/commission/types";

type Tab = "records" | "services" | "post" | "studio";
const TABS: { id: Tab; label: string }[] = [
  { id: "records", label: "Commission records" },
  { id: "services", label: "Creative services" },
  { id: "post", label: "Post-production & delivery" },
  { id: "studio", label: "Studio & proposal" },
];

export default function StudioAdmin({
  initialConfig,
  stored,
  consultant,
  storageIssue,
}: {
  initialConfig: StudioConfig;
  stored: boolean;
  consultant: string;
  storageIssue: string | null;
}) {
  const [tab, setTab] = useState<Tab>("records");
  const [saved, setSaved] = useState(initialConfig);
  const [config, setConfig] = useState(initialConfig);
  const [isStored, setIsStored] = useState(stored);
  const [status, setStatus] = useState<{ kind: "ok" | "error"; text: string; issues?: string[] } | null>(null);
  const [busy, setBusy] = useState(false);
  const dirty = JSON.stringify(config) !== JSON.stringify(saved);

  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => { if (dirty) e.preventDefault(); };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  async function save() {
    setBusy(true);
    setStatus(null);
    const res = await fetch("/api/studio/config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ config, baseVersion: saved.version }),
    }).catch(() => null);
    const data = res ? await res.json().catch(() => ({})) : {};
    setBusy(false);
    if (res?.ok) {
      setSaved(data.config);
      setConfig(data.config);
      setIsStored(true);
      setStatus({ kind: "ok", text: `Saved — configuration version ${data.config.version}. New consultations use it immediately.` });
    } else {
      setStatus({
        kind: "error",
        text: data.error ?? "The configuration could not be saved.",
        issues: data.issues?.map((i: { message: string }) => i.message),
      });
    }
  }

  async function resetDefaults() {
    if (!window.confirm("Replace the entire studio configuration with the illustrative demo defaults?")) return;
    setBusy(true);
    const res = await fetch("/api/studio/config/reset", { method: "POST" }).catch(() => null);
    const data = res ? await res.json().catch(() => ({})) : {};
    setBusy(false);
    if (res?.ok) {
      setSaved(data.config);
      setConfig(data.config);
      setIsStored(true);
      setStatus({ kind: "ok", text: "Demo defaults restored." });
    } else {
      setStatus({ kind: "error", text: data.error ?? "Reset failed." });
    }
  }

  return (
    <div className={styles.admin}>
      <header className={styles.head}>
        <div>
          <a className={base.btnText} href="/quotebuilder" data-no-transition>← Back to the consultation</a>
          <p className={base.kicker}>Studio administration</p>
          <h1 className={styles.title}>The atelier ledger</h1>
          <p className={styles.meta}>
            Signed in as {consultant} · Configuration v{saved.version}
            {isStored ? ` · saved ${formatTimestamp(saved.updatedAt)}` : " · using built-in demo defaults (not yet saved)"}
          </p>
          <IllustrativeTag show={config.pricingIsIllustrative} />
        </div>
        {tab !== "records" && (
          <div className={styles.saveBar}>
            {dirty && <span className={styles.dirty}>Unsaved changes</span>}
            <button className={base.btnText} onClick={() => setConfig(saved)} disabled={!dirty || busy}>Discard</button>
            <button className={base.btnSecondary} onClick={resetDefaults} disabled={busy}>Restore demo defaults</button>
            <button className={base.btnPrimary} onClick={save} disabled={!dirty || busy}>{busy ? "Saving…" : "Save configuration"}</button>
          </div>
        )}
      </header>

      {storageIssue && <div className={base.banner} role="alert">{storageIssue}</div>}
      {status && (
        <div className={status.kind === "ok" ? styles.ok : base.banner} role="status">
          {status.text}
          {status.issues && <ul>{status.issues.map((i, k) => <li key={k}>{i}</li>)}</ul>}
        </div>
      )}

      <nav className={styles.tabs} role="tablist">
        {TABS.map((t) => (
          <button key={t.id} role="tab" aria-selected={tab === t.id} className={tab === t.id ? styles.tabOn : ""} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </nav>

      <section className={styles.panel}>
        {tab === "records" && <RecordsPanel />}
        {tab === "services" && <ServicesEditor config={config} setConfig={setConfig} />}
        {tab === "post" && <PostProductionEditor config={config} setConfig={setConfig} />}
        {tab === "studio" && <StudioEditor config={config} setConfig={setConfig} />}
      </section>
    </div>
  );
}
