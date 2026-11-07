"use client";

import { useState } from "react";
import styles from "../admin.module.css";
import base from "../studio.module.css";
import { Area, Check, Lines, Num, Select, Text } from "./fields";
import { resolveBandFee } from "@/lib/commission/pricing";
import { formatINR } from "@/lib/commission/format";
import type {
  BandTable,
  ChargeDefinition,
  DeliveryTier,
  EventPreset,
  ServiceDefinition,
  StudioConfig,
} from "@/lib/commission/types";

type Props = { config: StudioConfig; setConfig: (c: StudioConfig) => void };

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 50);

/* ---------------- Services ---------------- */

export function ServicesEditor({ config, setConfig }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);
  const services = [...config.services].sort((a, b) => a.order - b.order);
  const update = (id: string, patch: Partial<ServiceDefinition>) =>
    setConfig({ ...config, services: config.services.map((s) => (s.id === id ? { ...s, ...patch } : s)) });

  function add() {
    const id = `service-${Date.now().toString(36)}`;
    const svc: ServiceDefinition = {
      id,
      order: services.length + 1,
      name: "New service",
      epithet: "",
      introduction: "",
      role: "",
      captures: [],
      whyItMatters: "",
      deliverables: [],
      suitableFor: [],
      recommendedNote: "",
      price: 0,
      unitLabel: "per professional · per event",
      unitNoun: "professional",
      minQuantity: 0,
      maxQuantity: 3,
      image: "/images/disciplines/weddings/IMG_6274.jpg",
      imageAlt: "",
      postProductionGroup: "photo",
      active: false,
    };
    setConfig({ ...config, services: [...config.services, svc] });
    setOpenId(id);
  }

  return (
    <div className={styles.stack}>
      <p className={styles.fine}>
        Prices are per pricing unit and multiply by the crew quantity chosen for each event. Inactive services are hidden from new
        consultations; stored commissions keep the version they were priced with.
      </p>
      {services.map((s) => (
        <div key={s.id} className={`${styles.item} ${openId === s.id ? styles.itemOpen : ""}`}>
          <button className={styles.itemHead} onClick={() => setOpenId(openId === s.id ? null : s.id)} aria-expanded={openId === s.id}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.image} alt="" />
            <span>
              <b>{s.name}</b>
              <small>{formatINR(s.price)} {s.unitLabel} · crew {s.minQuantity}–{s.maxQuantity}{s.active ? "" : " · inactive"}</small>
            </span>
          </button>
          {openId === s.id && (
            <div className={styles.itemBody}>
              <Text label="Name" value={s.name} onChange={(v) => update(s.id, { name: v })} />
              <Text label="Epithet" value={s.epithet} onChange={(v) => update(s.id, { epithet: v })} />
              <Num label="Price" suffix="₹ per unit" value={s.price} onChange={(v) => update(s.id, { price: v ?? 0 })} step={1000} />
              <Text label="Pricing unit" value={s.unitLabel} onChange={(v) => update(s.id, { unitLabel: v })} />
              <Text label="Unit noun (singular)" value={s.unitNoun} onChange={(v) => update(s.id, { unitNoun: v })} />
              <Num label="Display order" value={s.order} onChange={(v) => update(s.id, { order: v ?? 0 })} />
              <Num label="Minimum crew" value={s.minQuantity} onChange={(v) => update(s.id, { minQuantity: Math.floor(v ?? 0) })} />
              <Num label="Maximum crew per event" value={s.maxQuantity} min={1} onChange={(v) => update(s.id, { maxQuantity: Math.floor(v ?? 1) })} />
              <Select
                label="Post-production pool"
                value={s.postProductionGroup}
                options={[
                  { value: "photo", label: "Photography" },
                  { value: "video", label: "Video" },
                  { value: "none", label: "None (no post-production)" },
                ]}
                onChange={(v) => update(s.id, { postProductionGroup: v })}
              />
              <Check label="Active in consultations" checked={s.active} onChange={(v) => update(s.id, { active: v })} />
              <Check label="Signature (premium) presentation" checked={!!s.signature} onChange={(v) => update(s.id, { signature: v })} />
              <Area label="Introduction" value={s.introduction} onChange={(v) => update(s.id, { introduction: v })} rows={2} />
              <Area label="What the professional does" value={s.role} onChange={(v) => update(s.id, { role: v })} />
              <Lines label="What they capture" value={s.captures} onChange={(v) => update(s.id, { captures: v })} />
              <Area label="Why it matters" value={s.whyItMatters} onChange={(v) => update(s.id, { whyItMatters: v })} />
              <Lines label="Deliverables" value={s.deliverables} onChange={(v) => update(s.id, { deliverables: v })} />
              <Area label="Recommended team note" value={s.recommendedNote} onChange={(v) => update(s.id, { recommendedNote: v })} rows={2} />
              <Lines label="Technical requirements" value={s.technicalNotes ?? []} onChange={(v) => update(s.id, { technicalNotes: v })} rows={2} />
              <fieldset className={`${base.field} ${styles.wide}`}>
                <legend className={base.fieldLabel}>Suited to (none ticked = every event)</legend>
                <div className={styles.chips}>
                  {config.eventPresets.map((p) => (
                    <label key={p.id} className={styles.chip}>
                      <input
                        type="checkbox"
                        checked={s.suitableFor.includes(p.id)}
                        onChange={(e) =>
                          update(s.id, {
                            suitableFor: e.target.checked ? [...s.suitableFor, p.id] : s.suitableFor.filter((x) => x !== p.id),
                          })
                        }
                      />
                      {p.label}
                    </label>
                  ))}
                </div>
              </fieldset>
              <ImageField value={s.image} onChange={(v) => update(s.id, { image: v })} />
              <Text label="Image description (alt text)" value={s.imageAlt} onChange={(v) => update(s.id, { imageAlt: v })} wide />
              <div className={styles.wide}>
                <button
                  className={base.btnText}
                  onClick={() => {
                    if (window.confirm(`Remove ${s.name} from the catalogue? Stored commissions are unaffected.`)) {
                      setConfig({ ...config, services: config.services.filter((x) => x.id !== s.id) });
                    }
                  }}
                >
                  Remove this service
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
      <button className={base.btnSecondary} onClick={add}>Add a creative service</button>
    </div>
  );
}

function ImageField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [msg, setMsg] = useState<string | null>(null);
  async function upload(file: File) {
    setMsg("Uploading…");
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/studio/media", { method: "POST", body: form }).catch(() => null);
    const data = res ? await res.json().catch(() => ({})) : {};
    if (res?.ok) {
      onChange(data.url);
      setMsg("Uploaded. Save the configuration to keep it.");
    } else setMsg(data.error ?? "Upload failed.");
  }
  return (
    <div className={`${styles.imageField} ${styles.wide}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={value} alt="" />
      <div>
        <Text label="Image path (JPEG/PNG — used in the PDF)" value={value} onChange={onChange} />
        <label className={base.btnSecondary}>
          Upload photograph
          <input type="file" accept="image/jpeg,image/png" hidden onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
        </label>
        {msg && <p className={styles.fine}>{msg}</p>}
      </div>
    </div>
  );
}

/* ---------------- Post-production & delivery ---------------- */

function BandEditor({ title, table, onChange }: { title: string; table: BandTable; onChange: (t: BandTable) => void }) {
  const [probe, setProbe] = useState(250000);
  const bands = [...table.bands].sort((a, b) => a.threshold - b.threshold);
  const r = resolveBandFee(table, probe, "combined");
  return (
    <div className={styles.band}>
      <h3>{title}</h3>
      <table className={styles.table}>
        <thead><tr><th scope="col">Creative subtotal (₹)</th><th scope="col">Base fee (₹)</th><th /></tr></thead>
        <tbody>
          {bands.map((b, i) => (
            <tr key={i}>
              <td>
                <input className={base.input} type="number" min={1} step={10000} value={b.threshold} aria-label="Threshold"
                  onChange={(e) => onChange({ ...table, bands: bands.map((x, k) => (k === i ? { ...x, threshold: Number(e.target.value) } : x)) })} />
              </td>
              <td>
                <input className={base.input} type="number" min={0} step={500} value={b.fee} aria-label="Fee"
                  onChange={(e) => onChange({ ...table, bands: bands.map((x, k) => (k === i ? { ...x, fee: Number(e.target.value) } : x)) })} />
              </td>
              <td><button className={base.btnText} onClick={() => onChange({ ...table, bands: bands.filter((_, k) => k !== i) })}>Remove</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        className={base.btnText}
        onClick={() => {
          const last = bands[bands.length - 1];
          onChange({ ...table, bands: [...bands, { threshold: (last?.threshold ?? 0) + 100000, fee: last?.fee ?? 0 }] });
        }}
      >
        + Add band
      </button>
      <div className={styles.grid}>
        <Select
          label="Between bands"
          value={table.interpolation}
          options={[
            { value: "linear", label: "Interpolate linearly" },
            { value: "step", label: "Hold the lower band's fee" },
          ]}
          onChange={(v) => onChange({ ...table, interpolation: v })}
        />
        <Select
          label="Below the first band"
          value={table.belowFirstBand}
          options={[
            { value: "proportional", label: "Scale proportionally" },
            { value: "first_band_fee", label: "Charge the first band's fee" },
          ]}
          onChange={(v) => onChange({ ...table, belowFirstBand: v })}
        />
        <Num label="Minimum fee" nullable value={table.minFee} onChange={(v) => onChange({ ...table, minFee: v })} step={500} />
        <Num label="Maximum fee" nullable value={table.maxFee} onChange={(v) => onChange({ ...table, maxFee: v })} step={500} />
      </div>
      <div className={styles.probe}>
        <Num label="Try a subtotal" value={probe} onChange={(v) => setProbe(v ?? 0)} step={10000} />
        <p>Base fee <b>{formatINR(r.fee)}</b> — {r.explanation}</p>
      </div>
    </div>
  );
}

export function PostProductionEditor({ config, setConfig }: Props) {
  const pp = config.postProduction;
  const setPP = (patch: Partial<typeof pp>) => setConfig({ ...config, postProduction: { ...pp, ...patch } });
  const tiers = [...config.deliveryTiers].sort((a, b) => a.days - b.days);
  const updateTier = (id: string, patch: Partial<DeliveryTier>) =>
    setConfig({ ...config, deliveryTiers: config.deliveryTiers.map((t) => (t.id === id ? { ...t, ...patch } : t)) });

  return (
    <div className={styles.stack}>
      <p className={styles.fine}>
        Final post-production fee = base fee from the budget bands × the delivery multiplier, rounded. Live streaming and other
        services in the “None” pool never count towards the band.
      </p>
      <div className={styles.grid}>
        <Select
          label="Pricing mode"
          value={pp.mode}
          options={[
            { value: "combined", label: "One band table on the whole production" },
            { value: "split", label: "Separate photography and video tables" },
          ]}
          onChange={(v) => setPP({ mode: v })}
        />
        <Num label="Round final fee to nearest" suffix="₹" value={pp.roundTo} onChange={(v) => setPP({ roundTo: v ?? 0 })} step={50} />
      </div>
      {pp.mode === "combined" ? (
        <BandEditor title="Budget bands" table={pp.combined} onChange={(t) => setPP({ combined: t })} />
      ) : (
        <>
          <BandEditor title="Photography bands" table={pp.photo} onChange={(t) => setPP({ photo: t })} />
          <BandEditor title="Video bands" table={pp.video} onChange={(t) => setPP({ video: t })} />
        </>
      )}

      <h2 className={styles.h2}>Delivery tiers</h2>
      {tiers.map((t) => (
        <div key={t.id} className={styles.tier}>
          <div className={styles.grid}>
            <Text label="Label" value={t.label} onChange={(v) => updateTier(t.id, { label: v })} />
            <Text label="Priority name" value={t.priorityName} onChange={(v) => updateTier(t.id, { priorityName: v })} />
            <Num label="Days" value={t.days} min={1} onChange={(v) => updateTier(t.id, { days: v ?? 1 })} />
            <Num label="Multiplier" value={t.multiplier} step={0.05} onChange={(v) => updateTier(t.id, { multiplier: v ?? 1 })} />
            <Check label="Available" checked={t.available} onChange={(v) => updateTier(t.id, { available: v })} />
            <label className={`${base.field} ${base.checkField}`}>
              <input type="radio" name="defaultTier" checked={config.defaultDeliveryTierId === t.id} onChange={() => setConfig({ ...config, defaultDeliveryTierId: t.id })} />
              <span>Pre-selected in new consultations</span>
            </label>
            <Area label="What it means" value={t.meaning} onChange={(v) => updateTier(t.id, { meaning: v })} rows={2} />
            <Area label="Why it costs more or less" value={t.whyPrice} onChange={(v) => updateTier(t.id, { whyPrice: v })} rows={2} />
            <Lines label="Deliverables covered" value={t.covers} onChange={(v) => updateTier(t.id, { covers: v })} rows={3} />
            <Area label="What the couple can expect" value={t.expectations} onChange={(v) => updateTier(t.id, { expectations: v })} rows={2} />
            <Area label="Conditions" value={t.conditions} onChange={(v) => updateTier(t.id, { conditions: v })} rows={2} />
            <div className={styles.wide}>
              <button className={base.btnText} onClick={() => setConfig({
                ...config,
                deliveryTiers: config.deliveryTiers.filter((x) => x.id !== t.id),
                defaultDeliveryTierId: config.defaultDeliveryTierId === t.id ? null : config.defaultDeliveryTierId,
              })}>Remove tier</button>
            </div>
          </div>
        </div>
      ))}
      <div className={styles.row}>
        <button
          className={base.btnSecondary}
          onClick={() => {
            const id = `tier-${Date.now().toString(36)}`;
            setConfig({
              ...config,
              deliveryTiers: [
                ...config.deliveryTiers,
                { id, label: "Within N days", days: 45, priorityName: "New tier", multiplier: 1, meaning: "", whyPrice: "", covers: [], expectations: "", conditions: "", available: false },
              ],
            });
          }}
        >
          Add delivery tier
        </button>
        <label className={`${base.field} ${base.checkField}`}>
          <input type="radio" name="defaultTier" checked={config.defaultDeliveryTierId === null} onChange={() => setConfig({ ...config, defaultDeliveryTierId: null })} />
          <span>No pre-selected tier (couple must choose)</span>
        </label>
      </div>
    </div>
  );
}

/* ---------------- Studio & proposal ---------------- */

export function StudioEditor({ config, setConfig }: Props) {
  const st = config.studio;
  const setStudio = (patch: Partial<typeof st>) => setConfig({ ...config, studio: { ...st, ...patch } });
  const pr = config.proposal;
  const setProposal = (patch: Partial<typeof pr>) => setConfig({ ...config, proposal: { ...pr, ...patch } });
  const updateCharge = (id: string, patch: Partial<ChargeDefinition>) =>
    setConfig({ ...config, charges: config.charges.map((c) => (c.id === id ? { ...c, ...patch } : c)) });
  const updatePreset = (id: string, patch: Partial<EventPreset>) =>
    setConfig({ ...config, eventPresets: config.eventPresets.map((p) => (p.id === id ? { ...p, ...patch } : p)) });

  return (
    <div className={styles.stack}>
      <h2 className={styles.h2}>Pricing status</h2>
      <Check
        label="Label all prices as illustrative (turn off only once real studio prices are entered)"
        checked={config.pricingIsIllustrative}
        onChange={(v) => setConfig({ ...config, pricingIsIllustrative: v })}
      />

      <h2 className={styles.h2}>Studio contact</h2>
      <div className={styles.grid}>
        <Text label="Studio name" value={st.name} onChange={(v) => setStudio({ name: v })} />
        <Text label="Phone (display)" value={st.phoneDisplay} onChange={(v) => setStudio({ phoneDisplay: v })} />
        <Text label="WhatsApp number (digits with country code)" value={st.whatsappNumber} onChange={(v) => setStudio({ whatsappNumber: v.replace(/\D/g, "") })} />
        <Text label="Email" value={st.email} onChange={(v) => setStudio({ email: v })} />
        <Text label="Website" value={st.website} onChange={(v) => setStudio({ website: v })} />
        <Text label="Instagram" value={st.instagram} onChange={(v) => setStudio({ instagram: v })} />
        <Text label="Address" value={st.address} onChange={(v) => setStudio({ address: v })} wide />
      </div>

      <h2 className={styles.h2}>Taxes</h2>
      <div className={styles.grid}>
        <Check label="Apply tax to estimates" checked={config.tax.enabled} onChange={(v) => setConfig({ ...config, tax: { ...config.tax, enabled: v } })} />
        <Text label="Tax label" value={config.tax.label} onChange={(v) => setConfig({ ...config, tax: { ...config.tax, label: v } })} />
        <Num label="Rate" suffix="%" step={0.5} value={config.tax.ratePercent} onChange={(v) => setConfig({ ...config, tax: { ...config.tax, ratePercent: v ?? 0 } })} />
        <Text label="Note when not applied" value={config.tax.note} onChange={(v) => setConfig({ ...config, tax: { ...config.tax, note: v } })} wide />
      </div>

      <h2 className={styles.h2}>Additional charges</h2>
      <p className={styles.fine}>Charges are offered to the consultant and only added when ticked during a consultation.</p>
      {config.charges.map((c) => (
        <div key={c.id} className={styles.tier}>
          <div className={styles.grid}>
            <Text label="Label" value={c.label} onChange={(v) => updateCharge(c.id, { label: v })} />
            <Select label="Type" value={c.kind} options={[{ value: "fixed", label: "Fixed amount" }, { value: "percent_of_production", label: "% of creative production" }]} onChange={(v) => updateCharge(c.id, { kind: v })} />
            <Num label={c.kind === "fixed" ? "Amount (₹)" : "Percent"} value={c.amount} onChange={(v) => updateCharge(c.id, { amount: v ?? 0 })} step={c.kind === "fixed" ? 1000 : 0.5} />
            <Check label="Available" checked={c.available} onChange={(v) => updateCharge(c.id, { available: v })} />
            <Text label="Description" value={c.description} onChange={(v) => updateCharge(c.id, { description: v })} wide />
            <div className={styles.wide}><button className={base.btnText} onClick={() => setConfig({ ...config, charges: config.charges.filter((x) => x.id !== c.id) })}>Remove charge</button></div>
          </div>
        </div>
      ))}
      <div className={styles.row}>
        <button className={base.btnSecondary} onClick={() => setConfig({ ...config, charges: [...config.charges, { id: `charge-${Date.now().toString(36)}`, label: "New charge", description: "", kind: "fixed", amount: 0, available: false }] })}>
          Add charge
        </button>
      </div>

      <h2 className={styles.h2}>Event presets</h2>
      <div className={styles.presetTable}>
        {config.eventPresets.map((p) => (
          <div key={p.id} className={styles.presetRow}>
            <Text label="Label" value={p.label} onChange={(v) => updatePreset(p.id, { label: v })} />
            <Num label="Typical hours" value={p.typicalHours} onChange={(v) => updatePreset(p.id, { typicalHours: v ?? 1 })} />
            <Check label="Ritual-led" checked={p.ritual} onChange={(v) => updatePreset(p.id, { ritual: v })} />
            <button className={base.btnText} onClick={() => setConfig({ ...config, eventPresets: config.eventPresets.filter((x) => x.id !== p.id) })}>Remove</button>
          </div>
        ))}
        <button
          className={base.btnSecondary}
          onClick={() => {
            const label = window.prompt("Name of the new event preset");
            if (!label) return;
            const id = slug(label) || `preset-${Date.now().toString(36)}`;
            if (config.eventPresets.some((p) => p.id === id)) return;
            setConfig({ ...config, eventPresets: [...config.eventPresets, { id, label, typicalHours: 4, ritual: false }] });
          }}
        >
          Add event preset
        </button>
      </div>

      <h2 className={styles.h2}>Proposal</h2>
      <div className={styles.grid}>
        <Num label="Valid for" suffix="days" value={pr.validityDays} min={1} onChange={(v) => setProposal({ validityDays: v ?? 14 })} />
        <Text label="Reference prefix" value={pr.referencePrefix} onChange={(v) => setProposal({ referencePrefix: v.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6) })} />
        <Area label="Introduction" value={pr.introduction} onChange={(v) => setProposal({ introduction: v })} />
        <Area label="Closing message" value={pr.closingMessage} onChange={(v) => setProposal({ closingMessage: v })} rows={2} />
        <Lines label="Proposal notes & terms" value={pr.terms} onChange={(v) => setProposal({ terms: v })} rows={6} />
        <Text label="Cover photograph" value={pr.coverImage} onChange={(v) => setProposal({ coverImage: v })} wide />
        <Text label="Celebration page photograph" value={pr.celebrationImage} onChange={(v) => setProposal({ celebrationImage: v })} wide />
        <Text label="Closing page photograph" value={pr.closingImage} onChange={(v) => setProposal({ closingImage: v })} wide />
      </div>
    </div>
  );
}
