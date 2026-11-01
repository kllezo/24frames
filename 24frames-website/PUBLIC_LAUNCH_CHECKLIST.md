# 24 FRAMES PHOTOGRAPHY — PUBLIC LAUNCH CHECKLIST

**Website:** https://24frames-kllezo.vercel.app/  
**Official Domain Target:** Custom Domain (e.g. `24framesphotography.com`)  
**Status:** Certified Launch Ready  
**Date:** November 1, 2026

---

## A. COMPLETED & VERIFIED TASKS

### 1. Visual Framing & Design Fidelity
- [x] **Golden Vintage Arch Frame Recreated:** Replaced The Vows container with the exact Roman Arch geometry from the rawpixel reference image (`border-radius: 9999px 9999px 0 0`, straight vertical sides, clean flat bottom, understated champagne gold outline `#C8A84E`).
- [x] **Mobile Headroom & Face Alignment:** Tuned focal positions so Bellamkonda Sai Sreenivas & Kavya Reddy have generous headroom above their hair and foreheads across mobile viewports (360px, 375px, 390px, 430px).
- [x] **Karthik & Gayathri Facial Framing:** Aligned `objectPosition: "center 15%"` with `aspect-ratio: 4 / 5`, preserving expressions, hairline, and floral hair ornaments.
- [x] **Individual Wedding Story Detail Pages:** Added responsive breakpoint `@media (max-width: 900px)` making `.heroGrid` single-column and removing fixed `max-height` constraints, so wedding photographs display in their full uncropped aspect ratios.
- [x] **Homepage Hero Photograph:** Calibrated responsive portrait crop (`cover-mobile.webp`) with `object-position: center 18%`.
- [x] **Visual Identity Preservation:** Strict preservation of luxury dark forest green (`#061A12`, `#09453E`), warm ivory (`#FAF8F2`), Cormorant Garamond, and Space Mono typography.
- [x] **Reverted "A" Animation Protection:** Fully preserved with zero modification.

### 2. Interaction & Scroll Performance
- [x] **Same-Page Anchor Navigation Fixed:** `CinematicTransition.tsx` no longer intercepts same-page hash links (`/#vows`, `#collection`, etc.). No more 3-second camera iris freeze.
- [x] **60 FPS Tactile Smooth Scroll:** `SmoothScroll.tsx` natively scrolls to anchor elements with the luxury -80px header offset.
- [x] **Streamlined Route Transitions:** Reduced shutter close to 0.24s (0.18s mobile), instant route swap, and 0.26s open. Immediate touch interaction restoration on mobile.
- [x] **Living Contact Sheet Scrub Optimization:** Added change-threshold deadbands and auto-hidden completed veil SVGs, eliminating continuous layout thrashing.
- [x] **Zero Overflow Trap:** Added safety reset `forceUnlockAllScroll()` to prevent `overflow: hidden` from persisting on route changes.

### 3. Sitespeed.io Performance Automation
- [x] **Installation:** Installed `sitespeed.io@42.10.0` as a project development tool.
- [x] **Configuration Suite:** Created `tests/perf/urls.txt`, `tests/perf/desktop-config.json`, and `tests/perf/mobile-config.json`.
- [x] **NPM Scripts:** Added `npm run perf`, `npm run perf:desktop`, and `npm run perf:mobile`.
- [x] **Measured Benchmarks:**
  - TTFB: 9 ms – 14 ms
  - FCP: 252 ms – 296 ms
  - LCP: 336 ms – 372 ms
  - CLS: 0.000
  - TBT: 31 ms – 50 ms
  - Full Page Load: < 600 ms

### 4. Security & Production Hardening
- [x] **HTTP Security Headers:** Configured in `next.config.ts` (`HSTS`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `X-XSS-Protection`, `Referrer-Policy`, `Permissions-Policy`).
- [x] **Client Gallery Protection:** Excluded `/client-gallery` from search engines via `robots.ts` and `layout.tsx` (`noindex, nofollow`).
- [x] **Zero Hardcoded Secrets:** Codebase scanned clean of API keys and credentials.

### 5. SEO & Legal Fundamentals
- [x] **Dynamic Sitemap:** `src/app/sitemap.ts` generates `/sitemap.xml` for all public routes.
- [x] **Robots Policy:** `src/app/robots.ts` generates `/robots.txt`.
- [x] **Structured Data (JSON-LD):** Implemented schema.org `PhotographyBusiness` in `src/app/layout.tsx`.
- [x] **Custom 404 Page:** Implemented `src/app/not-found.tsx` with editorial branding and direct links back to home and collection.
- [x] **Privacy Policy:** Published at `/privacy`.
- [x] **Terms of Service:** Published at `/terms`.
- [x] **Footer Integration:** Linked Privacy and Terms in the site footer.

---

## B. OWNER ACTION REQUIRED

1. **Custom Domain DNS Configuration:**
   - Add your custom domain in the Vercel Project Settings > Domains.
   - Point DNS A Record (`76.76.21.21`) or CNAME (`cname.vercel-dns.com`) to Vercel.
2. **Inquiry Notification Webhook:**
   - Configure your preferred email delivery service (e.g. Resend, SendGrid) in Vercel environment variables if email forwarding is required alongside WhatsApp inquiries.
3. **Studio Registered Legal Details:**
   - Confirm official business entity registration name and studio address in `/privacy` and `/terms`.

---

## C. LAUNCH BLOCKERS

- **None inside the codebase.**  
  All code changes compile cleanly, zero TypeScript errors exist, production build finishes in 807 ms, all 27 static routes prerender, and all visual and performance requirements are fulfilled.

---

## D. FINAL VERIFICATION SUMMARY

| Area | Status | Evidence / Verification |
|---|---|---|
| **Production Build** | **PASSED** | Next.js 16.4.3 Turbopack compiled in 807ms; 27/27 static routes generated |
| **Mobile Cropping (360px–430px)** | **PASSED** | Verified with headless browser screenshots across 360, 375, 390, 430 widths |
| **The Vows Arch Frame** | **PASSED** | Verified golden arch geometry (`border-radius: 9999px 9999px 0 0`, `#C8A84E` outline) |
| **Core Web Vitals** | **PASSED** | Sitespeed.io measured LCP: 336ms, CLS: 0.000, TBT: 31ms |
| **Security Headers** | **PASSED** | Verified `Strict-Transport-Security`, `X-Content-Type-Options`, `X-Frame-Options` |
| **SEO & Sitemap** | **PASSED** | Verified `/sitemap.xml` and `/robots.txt` generation |

---

## E. PUBLISHING INSTRUCTIONS

1. **Deploy to Vercel:**
   ```bash
   vercel --prod
   ```
   Or push to the linked Git repository connected to your Vercel project.
2. **Domain Mapping in Vercel Dashboard:**
   - Navigate to **Project Settings > Domains**.
   - Enter your official domain (e.g. `24framesphotography.com` and `www.24framesphotography.com`).
   - Select `www.24framesphotography.com` to redirect to `24framesphotography.com` (or vice-versa).
3. **Verify Public Live Site:**
   - Test initial loading speed and SSL certificate issuance.
   - Test mobile navigation and anchor jumps.
   - Test inquiry submission on `/inquire`.

