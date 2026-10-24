# REPORT 15: EVIDENCE GAPS, LIMITATIONS AND STRATEGIC RECOMMENDATIONS

**Investigation Target:** 24 Frames Photography / 24 Frames Wedding Films & Luxe Events  
**Document ID:** REP-15-EVIDENCE-GAPS  
**Date:** October 23, 2026  
**Status:** COMPLETE / EVIDENCE-BACKED  

---

## 1. Executive Gap Audit Summary

This investigation conducted an exhaustive, multi-channel research sweep covering official websites, Instagram profiles, 107 YouTube videos and shorts, industry registries (WedMeGood, WeddingWire), local business directories, and news media features. 

While core brand claims (including the **Times of India ET Excellence Award 2025**, the **Nikon India Influencer** appointment, the **6,000 sq. ft. Jubilee Hills studio**, and the **flawless 5.0 WedMeGood rating**) have been conclusively **VERIFIED**, certain technical, organizational, and operational details remain unconfirmed or require direct client input.

---

## 2. Evidence Status Summary Matrix

| Research Area | Verification Status | Primary Evidence / Source | Remaining Gap / Action Item |
| :--- | :--- | :--- | :--- |
| **Founder Identity (Phani Gogireddy)** | `VERIFIED` | Instagram, YouTube, ET Award, TV9, Nikon | None; 100% verified as founder & lead director. |
| **ET Excellence Award 2025** | `VERIFIED` | YouTube: `Lh45ZBRJ1b8` (Dia Mirza presentation) | Retrieve high-res photographic scan of certificate. |
| **Nikon India Influencer Status** | `VERIFIED` | Instagram: `CqovGPUoPle` (Joint announcement) | Confirm whether contract renewal covers 2026–2027. |
| **Studio Facility (Jubilee Hills)** | `VERIFIED` | YouTube: `WcHOfR2e_uQ` (Manchu Manoj launch) | Confirm complete postal address & PIN code for map embed. |
| **Luxe Events / Alankara Relationship** | `VERIFIED` | YouTube: `WcHOfR2e_uQ`, Instagram co-posts | Determine whether billing is joint or legally segregated. |
| **Primary Domain (`24framesphotography.com`)**| `CONFLICTING / BLOCKED`| DNS WHOIS, GoDaddy `/lander` redirect | Domain is parked; urgent DNS repointing required. |
| **Secondary Domain (`24framesweddingfilms.com`)**| `SUPPORTED` | Active GoDaddy site ("Launching Soon") | Evaluate whether to merge or redirect into primary domain. |
| **Legal Registration / Entity Type** | `UNVERIFIED` | Proprietary brand listings | Obtain MCA CIN or GST registration during onboarding. |
| **Core Crew Roster Names** | `SUPPORTED` | Credited collectively as "Team 24 Frames" | Request individual names & headshots for "Team" page. |
| **Private Client Gallery System** | `NOT FOUND` | No public client portal indexed | Determine if studio uses Pic-Time, Pixieset, or cloud links. |

---

## 3. Deep Dive into Strategic Gaps

### Gap 1: Domain Redirection & Infrastructure Fragmentation
* **The Finding:** The primary target URL [https://www.24framesphotography.com/](https://www.24framesphotography.com/) was created in 2019 and remains registered through 2027, but currently resolves to a GoDaddy parked lander (`/lander`). Concurrently, [https://www.24framesweddingfilms.com/](https://www.24framesweddingfilms.com/) hosts an unreleased GoDaddy builder template stating *"Launching Soon"*, while [https://24frames.in/](https://24frames.in/) operates as a WordPress portal for 24 Frames Production Company.
* **The Risk:** High-net-worth clients searching for 24 Frames online encounter a dead lander, bleeding organic search traffic and undermining brand authority.
* **Recommendation:** Consolidate all digital properties under `24framesphotography.com` (or 301-redirect all secondary domains to the primary new web platform).

### Gap 2: Legal Entity Structuring & Organizational Clarity
* **The Finding:** The business operates commercially under multiple names: *24 Frames Photography*, *24 Frames Wedding Films*, *Luxe Events by 24 Frames*, and *Alankara Event Decor Company*. Public registries indicate these operate as sole proprietorships or closely held partnerships under Phani Gogireddy.
* **Recommendation:** For website legal disclaimers, privacy policies, and client contracts, obtain the exact GSTIN and legal entity name to ensure compliance with Indian commercial regulations.

### Gap 3: Core Crew Member Identification
* **The Finding:** Across social media captions and film credits, specific creative leads (Chief Editor, Senior Colorist, Head of Candid Photography, Lead Floral Architect) are rarely credited by their full names; they are referenced as *"Team 24 Frames"*.
* **Recommendation:** Luxury clients value knowing the specific artists who will be on-site at their weddings. Request a roster of 4–6 key department heads with professional bios and headshots for the "About Our Masters" section.

### Gap 4: Instagram Access via Unauthenticated APIs
* **The Finding:** Direct HTTP requests to Instagram endpoints returned HTTP 401/302 login walls due to Meta's aggressive anti-scraping protocols. While public data was successfully gathered via secondary caches, directory profiles, and cross-referenced YouTube media, an authenticated Instagram session or official Meta Graph API connection should be utilized for live social feed embedding on the website.

---

## 4. Actionable Next Steps for Web Design & Development Team

To move smoothly from this brand intelligence phase into website design and engineering:

1. **Phase 1: Domain & Host Resolution (Immediate):**
   - Access the GoDaddy DNS zone file for `24framesphotography.com`.
   - Update A-records / CNAME to point to the production hosting provider (e.g., Vercel, Cloudflare Pages, or AWS).
2. **Phase 2: High-Resolution Asset Retrieval:**
   - Request original uncompressed 4K video exports from Phani Gogireddy's editorial suite for the 4 hero projects identified in Report 14 (`2EICGi0eENA`, `E7d0Q-p-D6U`, `W5k81tq8uSg`, `WcHOfR2e_uQ`).
   - Request high-resolution scans of the *Times of India ET Excellence Award 2025* certificate and trophy photo with Dia Mirza.
3. **Phase 3: Client Onboarding Questionnaire:**
   - Execute a 15-minute alignment interview with Phani Gogireddy to finalize:
     - Pricing wording preferences (e.g., display starting base rates or strictly bespoke quotes).
     - Full team roster and official studio address in Jubilee Hills.
     - Integration preferences for client proofing (e.g., embedding a private client login button).

---

*Verified by Quality Assurance & Intelligence Lead — Antigravity Research Engine*  
*Cross-References: [unresolved-questions.md](file:///Users/praneethchavana/Documents/24%20frames/24frames-research/unresolved-questions.md), [limitations.md](file:///Users/praneethchavana/Documents/24%20frames/24frames-research/limitations.md)*
