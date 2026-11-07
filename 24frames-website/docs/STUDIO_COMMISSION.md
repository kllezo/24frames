# 24 Frames — Private Wedding Commission Studio

A private consultation tool at **`/studio`**: the consultant signs in with a PIN, the couple composes their commission across six "frames", the studio submits it, and a personalised PDF proposal plus a WhatsApp summary are prepared.

Not linked from the public site, not in the sitemap, and every response carries `X-Robots-Tag: noindex` plus `<meta name="robots" content="noindex">`. It is deliberately **not** listed in `robots.txt`, because that would publish the URL.

---

## Run it

```bash
cp .env.example .env.local   # then set STUDIO_PIN and STUDIO_SESSION_SECRET
npm run dev                  # open http://localhost:3000/studio
npm run test:studio          # pricing engine, validation, session tests
```

A development `.env.local` with a generated PIN already exists on this machine. Read the PIN there.

## The journey

| Frame | Stage | What happens |
|---|---|---|
| 00 | Overture | Cinematic opening reel, "Begin your commission", resume an in-progress consultation |
| 01 | The Couple | Names, contact, date (exact or approximate), city, preference, notes. Only a name is needed to submit |
| 02 | The Celebration | Add, edit, duplicate, reorder, remove (with undo) and date-sort events; custom event types; overlap detection |
| 03 | The Ensemble | Seven-service catalogue with dossiers, per-event composition, full matrix view, studio guidance, consultant price adjustments |
| 04 | The Delivery | Lock-milestone timeline (horizontal or vertical by available width), band chart, base fee × multiplier, explicit charges, post-production override |
| 05 | The Commission | Editorial review document with "Revise" links into every stage |
| 06 | The Proposal | Live PDF preview → **Submit my commission** → stored record → confirmation and sharing |

The live ledger is visible throughout: a right-hand column on laptops, and a sticky bar that opens into a sheet on tablets and phones.

## Architecture

```
src/lib/commission/      Pure domain: types, demo config, pricing engine,
                         recommendations, validation, WhatsApp message, formatting
src/lib/studio/          session.ts (signed cookie), server/repository.ts (storage)
src/proxy.ts             Guards /studio/** and /api/studio/**
src/app/studio/          login, consultation, admin pages
src/app/api/studio/      auth, session, config, commissions, activity, whatsapp, media
src/components/studio/   UI: stages, ledger, dossier, timeline, PDF, admin
tests/studio/            node:test suite (npm run test:studio)
```

**One pricing engine.** `quoteCommission(draft, config)` in `src/lib/commission/pricing.ts` drives the ledger, review, PDF, WhatsApp message and server verification. On submit, the server re-prices the draft with the current configuration. If the total differs from what the couple saw, it refuses with `pricing_changed`, so a stored record can never disagree with the estimate shown.

**Formula**

```
production   = Σ unit price × crew quantity        (every event × service assignment)
base fee     = band table(production subtotal)     (non-linear; linear interpolation by default)
post fee     = round(base fee × delivery multiplier)    or a recorded manual override
charges      = only those the consultant ticks
tax          = rate × (production + post + charges)     only when enabled
grand total  = production + post + charges + tax
```

Bands support step or linear interpolation, a proportional or flat rule below the first band, a held fee above the last band, min/max clamps, rounding, and separate photography and video tables (`mode: "split"`). Live streaming sits in the "none" post-production pool, so it does not feed the band. That is a studio setting per service.

**Data model.** The data is normalised into tables: `couples`, `commissions`, `events`, `assignments` (event × service × quantity, priced at submission), `quotes` (the priced snapshot plus the configuration snapshot used), `activity` (the sharing log) and `config`. Historical proposals are re-rendered from their own snapshot, so later price changes never alter them.

**Security**

- Sign-in uses a PIN, compared in constant time. After 5 failed attempts the client is locked out for 5 minutes.
- The session is an HMAC-SHA256 signed http-only, `SameSite=Strict` cookie. It expires after 30 minutes idle (sliding) or 12 hours in total.
- The proxy checks the session, and every route handler checks it again.
- After 25 minutes without interaction the screen locks behind a veil and asks for the PIN again.
- Drafts live in `sessionStorage`, so closing the tab clears them. "New consultation" wipes the draft explicitly.
- Records are stored with file mode `0600` in a `0700` directory and are git-ignored (`/.studio-data`).

**Honest sharing**

- The PDF is generated on the device.
- WhatsApp click-to-chat carries text only. The UI says so, and logs the action as "opened", never "sent".
- Native share is logged as "handed to device".
- WhatsApp Cloud API deliveries are logged as "accepted by WhatsApp", which is not the same as delivered.
- Client code cannot write Cloud API log entries.

---

## Needs the studio before going live

### 1. Real prices (business decision)
Every figure in `src/lib/commission/defaults.ts` is **fictional demo data**:

- service prices
- budget bands
- delivery multipliers
- the travel and same-day-edit charges
- the 18% GST rate, which is disabled

Enter the real values in **Studio admin**, then untick *"Label all prices as illustrative"* (Studio & proposal tab). Until then, every price surface and the PDF carry an "Illustrative pricing" label.

Decisions needed:

- the real post-production formula and band table
- interpolation between bands: linear or step
- the rule below the first band
- whether photo and video post-production should be priced separately
- whether live streaming should count towards the band
- GST treatment
- which delivery tiers are offered, and the default tier (currently 60 days, pre-selected and visibly marked)
- proposal validity (14 days) and the terms text

### 2. Storage for deployment (integration point)
Records are kept in a JSON file through `src/lib/studio/server/repository.ts`. This works locally and on any server with a writable disk. **Serverless hosts such as Vercel have a read-only filesystem.** There, submissions fail with a clear "storage unavailable" message rather than pretending to save. Before deploying there, implement the same exported functions against Postgres (or similar). Nothing else changes.

Uploaded service photographs (`/api/studio/media`) have the same constraint.

### 3. Credentials (environment variables)

| Variable | Purpose |
|---|---|
| `STUDIO_PIN` | Consultant sign-in PIN, at least 6 characters recommended |
| `STUDIO_SESSION_SECRET` | 32+ random characters (`openssl rand -hex 32`) |
| `STUDIO_DATA_DIR` | Optional storage directory |
| `WHATSAPP_CLOUD_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID` | Optional: enables automated PDF delivery |

WhatsApp Business only allows free-form document messages inside a 24-hour customer-service window. Outside that window it needs an approved template, which is not built yet. Delivery receipts need a webhook, also not built.

### 4. Accounts
There is one shared studio PIN; the consultant types their name at sign-in, and it is recorded on each commission. If individual consultant accounts or roles (admin vs consultant) are wanted, that is the next step for `session.ts` and the admin routes.

### 5. Imagery
The library has no aerial photograph, so *Aerial Photography & Drone* currently shows the arches image. Upload a real aerial frame in Studio admin → Creative services. PDF imagery must be JPEG or PNG. The PDF embeds full-resolution photographs, so a typical proposal is about 2–2.5 MB.

---

## Verified

**Automated tests** (`npm run test:studio`, 11 passing):

- the brief's example: ₹6,15,000 production → ₹7,000 post-production → ₹6,22,000 total, and ₹14,000 post-production at Express
- non-linear bands, interpolation, clamps
- overrides, charges and tax
- validation
- recommendations
- session tampering and idle expiry

**Browser walkthrough:**

- sign-in, including rejection of a wrong PIN
- four events: add, duplicate, reorder, remove, undo, sort
- per-event team composition, dossier, matrix, price override
- tier switching with keyboard support, explicit charge
- review, PDF generation and submission, then the stored record checked on disk
- admin search, record view, duplicate into a new consultation
- reload keeps the stage and every selection
- unauthenticated and forged-cookie requests get 401
- invalid or stale configuration saves are rejected
- a stale-price submission is refused

**Layout:** no horizontal overflow at 360, 375, 768, 1024, 1180, 1440 and 1920 px. The timeline switches to vertical whenever its own column is narrow.

**Production:** `next build` passes.

**Not verified:** a real WhatsApp Cloud API send (no credentials), iPad Safari's inline PDF preview (it may show only the first page; "Open full screen" is provided), and the 25-minute lock screen in real time (its expiry logic is unit-tested).

## Pre-existing issues noticed (not changed)

- `src/app/globals.css` defines `--font-cormorant` and `--font-allura` in terms of themselves, so both resolve to nothing. Site headings that use `--font-headline` / `--font-serif` therefore fall back to the body font. The studio loads its own font variables to avoid this.
- The public homepage logs a React hydration mismatch in development (Preloader vs Navigation markup).
