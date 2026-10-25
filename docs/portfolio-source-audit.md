# 24 Frames — Portfolio Source Audit & Asset Manifest

**Audit Date:** 2026-10-25  
**Auditor:** 24 Frames Engineering Team  
**Scope:** Client Portfolio Ingestion, Asset Packaging, and Website Integration

---

## 1. Source Investigation & Project Mapping

The client provided six unique URLs (four Pic-Time client galleries and two YouTube cinematic wedding films). Each source was audited for title, client names, event type, media availability, download permissions, and resolution.

| ID | Verified Title | Source Platform & URL | Client / Couple | Category & Location | Resolution & Assets Available | Download Permission Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **gallery-01** | `SIREESH & HARSHITHA` | Pic-Time: [8Nq0pv3SJbxKn](https://24frames.pic-time.com/8Nq0pv3SJbxKn) | Sireesh & Harshitha | Wedding Celebration<br>Hyderabad, Telangana | 1280×1600 (4:5)<br>Original Cover (522 KB) + WebP (262 KB) | **RESTRICTED** (`freeDownloadsActive: False`). Client PIN/Store required for full batch ZIP. Cover image public. |
| **gallery-02** | `24 FRAMES BELLAMKONDA SAI SRINIVAS & KAVYA REDDY RECEPTION` | Pic-Time: [8P0kK5ZUmew5F](https://24frames.pic-time.com/8P0kK5ZUmew5F) | Bellamkonda Sai Sreenivas & Kavya Reddy | Celebrity Wedding Reception<br>Hyderabad, Telangana | 1280×720 (16:9)<br>Original Cover (295 KB) + WebP (131 KB) | **RESTRICTED** (`freeDownloadsActive: False`). Client PIN/Store required for full batch ZIP. Cover image public. |
| **gallery-03** | `HRITHIKA & ABHISHEK` | Pic-Time: [whZsXRiO6XgQn](https://24frames.pic-time.com/whZsXRiO6XgQn) | Hrithika & Abhishek | Wedding & Celebrations<br>Hyderabad, Telangana | 2400×1255 (~1.91:1)<br>Original Cover (451 KB) + WebP (187 KB) | **RESTRICTED** (`freeDownloadsActive: False`). 9 scenes detected. Client PIN/Store required for batch ZIP. |
| **gallery-04** | `KARTHIK & GAYATHRI` | Pic-Time: [yBCmkKcczvWql](https://24frames.pic-time.com/yBCmkKcczvWql) | Karthik & Gayathri | Wedding Celebrations<br>Hyderabad, Telangana | 1800×2400 (3:4)<br>Original Cover (1.43 MB) + WebP (800 KB) | **RESTRICTED** (`freeDownloadsActive: False`). Client PIN/Store required for full batch ZIP. Cover image public. |
| **film-01** | `Nishanth X Sanzena \| Couple Shoot Film \| 24Frames Wedding Films` | YouTube: [s32UT21hnBg](https://youtu.be/s32UT21hnBg) | Nishanth & Sanzena | Couple Shoot Cinema Film<br>4m 17s (257s) | 1280×720 (16:9)<br>Poster Thumbnail (79 KB) + WebP (55 KB) | **PUBLIC EMBED**. YouTube standard license. Embeddable via `youtube-nocookie.com/embed/s32UT21hnBg`. |
| **film-02** | `Vinitha & Vivekananda \| Two Years, One Question \| 24Frames Wedding Films` | YouTube: [LNtlLgfT5uY](https://youtu.be/LNtlLgfT5uY) | Vinitha & Vivekananda | Wedding Teaser & Feature Film<br>2m 33s (153s) | 1280×720 (16:9)<br>Poster Thumbnail (93 KB) + WebP (116 KB) | **PUBLIC EMBED**. YouTube standard license. Embeddable via `youtube-nocookie.com/embed/LNtlLgfT5uY`. |

---

## 2. Access Controls & Permissions Analysis

### Pic-Time Galleries
- **Download Policy Verification:** Direct JSON inspection of Pic-Time's `initParams` confirmed that all 4 galleries are set to:
  ```json
  "downloadPolicy": {
    "freeDownloadsCount": 0,
    "freeDownloadsActive": false,
    "videoDownloadResolution": null,
    "hiresScope": 100,
    "lowresScope": 0,
    "isDirect": false
  }
  ```
- **Permission Boundary:** Free public downloads are **inactive** on all 4 client galleries.
  - As instructed in the client brief: *“Do not bypass passwords, gallery permissions, payment gates, or other access controls. If a gallery does not expose an authorized download option, stop and document exactly what access or client-supplied files are needed.”*
  - The authorized, highest-quality cover photograph (`homepage.jpg`) for each gallery is hosted on Pic-Time's Azure Front Door CDN without authentication boundaries and has been ingested at full fidelity.
  - To download the complete multi-hundred photograph raw archives, the client/photographer must supply either the **Client Download PIN** or direct client ZIP archives.

### YouTube Films
- Both films were published on the official **24 Frames Photography** YouTube channel on **September 18, 2025**.
- Videos are embedded using privacy-enhanced `youtube-nocookie.com` mode with local high-resolution poster images to prevent third-party tracking before play.

---

## 3. Ingested Assets & Verification Table

All files were ingested to `tools/portfolio-ingestion/raw/` and synchronized to the website under `24frames-website/public/images/portfolio/` and `public/videos/portfolio/`:

| Project Slug | Local Public Path | WebP Derivative | Resolution | File Size | SHA-256 Checksum (Prefix) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `sireesh-harshitha` | `/images/portfolio/sireesh-harshitha/cover.jpg` | `/images/portfolio/sireesh-harshitha/cover.webp` | 1280×1600 | 522,670 B | `9765e22f` |
| `bellamkonda-kavya-reception` | `/images/portfolio/bellamkonda-kavya-reception/cover.jpg` | `/images/portfolio/bellamkonda-kavya-reception/cover.webp` | 1280×720 | 294,695 B | `8961489e` |
| `hrithika-abhishek` | `/images/portfolio/hrithika-abhishek/cover.jpg` | `/images/portfolio/hrithika-abhishek/cover.webp` | 2400×1255 | 450,937 B | `f9944db8` |
| `karthik-gayathri` | `/images/portfolio/karthik-gayathri/cover.jpg` | `/images/portfolio/karthik-gayathri/cover.webp` | 1800×2400 | 1,434,625 B | `47f70912` |
| `nishanth-sanzena` | `/videos/portfolio/nishanth-sanzena/poster.jpg` | `/videos/portfolio/nishanth-sanzena/poster.webp` | 1280×720 | 78,576 B | `c2d34c32` |
| `vinitha-vivekananda` | `/videos/portfolio/vinitha-vivekananda/poster.jpg` | `/videos/portfolio/vinitha-vivekananda/poster.webp` | 1280×720 | 93,451 B | `e18977de` |

The structured manifest is saved at [`24frames-website/public/data/portfolio-projects.json`](file:///Users/praneethchavana/Documents/24%20frames/24frames-website/public/data/portfolio-projects.json).
