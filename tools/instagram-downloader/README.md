# Instagram Post & Carousel Downloader CLI

A standalone, verified Python CLI tool to download complete Instagram posts, Reels, and multi-item carousels (albums) with guaranteed file integrity and structured metadata sidecars.

Created in an isolated directory to avoid touching or disrupting the `24frames-website` application.

---

## 1. Features

- **Full Carousel Support**: Extracts and downloads **every** image and video item from multi-slide carousel posts, not just the first image or thumbnail.
- **Reel & Single Post Support**: Downloads high-resolution videos from Reels and single photo posts.
- **Strict Integrity Verification**:
  - Verifies that every file exists on disk and is non-empty (`> 0 bytes`).
  - Generates SHA-256 checksums for each retrieved asset.
  - Applies the original Instagram post timestamp (`taken_at_utc`) to file modification times.
- **Never Fails Silently**: If any media item fails or is truncated, the CLI explicitly reports the missing item, marks the job as `partial`, and exits with an error status code (`2`).
- **Structured Metadata**: Saves `metadata.json` sidecar and human-readable `caption.txt` next to the media files.
- **Safe & Credential-Free Default**: Runs without accounts or API keys for public posts whenever Meta permits unauthenticated access.
- **Session/Cookie Support**: Accepts exported cookies or Instaloader sessions when Instagram enforces login walls or bot protection on an IP.

---

## 2. Directory Structure

All files reside inside `tools/instagram-downloader/`:

```
tools/instagram-downloader/
├── .gitignore               # Ignores .venv, downloads/, sessions, and cookies
├── README.md                # This documentation
├── requirements.txt         # Frozen dependencies
├── download_post.py         # Main CLI script
├── test_downloader.py       # Automated unit test suite
├── .venv/                   # Isolated Python 3.14 virtual environment
└── downloads/               # Default output directory (ignored by git)
    └── <username>_<shortcode>/
        ├── 01_<shortcode>_image.jpg
        ├── 02_<shortcode>_video.mp4
        ├── ...
        ├── caption.txt
        └── metadata.json
```

---

## 3. Installation & Setup

From the root of the `24 frames` workspace:

```bash
# 1. Navigate to tool directory (optional)
cd tools/instagram-downloader

# 2. Virtual environment is already prepared at:
#    tools/instagram-downloader/.venv/

# If setting up on a new machine:
python3 -m venv .venv
.venv/bin/pip install --upgrade pip
.venv/bin/pip install -r requirements.txt
```

---

## 4. Usage Examples

### A. Download a Public Carousel or Single Post

```bash
tools/instagram-downloader/.venv/bin/python tools/instagram-downloader/download_post.py "https://www.instagram.com/p/SHORTCODE/"
```

Or using shortcode directly:

```bash
tools/instagram-downloader/.venv/bin/python tools/instagram-downloader/download_post.py SHORTCODE
```

### B. Custom Output Directory

Specify `-o` / `--output-dir` to save media to a specific folder:

```bash
tools/instagram-downloader/.venv/bin/python tools/instagram-downloader/download_post.py "https://www.instagram.com/p/SHORTCODE/" -o ./my_archive
```

### C. Output Clean JSON (For Scripting / Automation)

```bash
tools/instagram-downloader/.venv/bin/python tools/instagram-downloader/download_post.py "https://www.instagram.com/p/SHORTCODE/" --json
```

### D. Running with Authentication (When Meta blocks anonymous IP access)

Due to Instagram's aggressive anti-scraping policies, Meta often returns `401 Unauthorized` / `Login Required` or `BadResponseException` to unauthenticated scripts. If this occurs on your network:

1. **Option 1: Netscape Cookie File (Recommended)**
   Export cookies from your desktop browser (via browser extensions like "Get cookies.txt LOCALLY") to a file (e.g. `cookies.txt`):
   ```bash
   tools/instagram-downloader/.venv/bin/python tools/instagram-downloader/download_post.py "https://www.instagram.com/p/SHORTCODE/" --cookies /path/to/cookies.txt
   ```

2. **Option 2: Instaloader Saved Session**
   Create a session file once:
   ```bash
   tools/instagram-downloader/.venv/bin/instaloader -l YOUR_INSTAGRAM_USERNAME
   ```
   Then pass your username to `download_post.py`:
   ```bash
   tools/instagram-downloader/.venv/bin/python tools/instagram-downloader/download_post.py "https://www.instagram.com/p/SHORTCODE/" --login YOUR_INSTAGRAM_USERNAME
   ```

*(Note: `.gitignore` is pre-configured to ensure no `.session` or `cookies*.txt` files are ever committed.)*

---

## 5. Output Metadata Schema (`metadata.json`)

```json
{
  "status": "complete",
  "shortcode": "C_N5m68M1kE",
  "source_url": "https://www.instagram.com/p/C_N5m68M1kE/",
  "canonical_url": "https://www.instagram.com/p/C_N5m68M1kE/",
  "owner_username": "photographer",
  "owner_id": "12345678",
  "taken_at_utc": "2026-10-25T12:00:00+00:00",
  "caption": "Golden hour frames...",
  "likes": 412,
  "comments": 38,
  "post_type": "GraphSidecar",
  "is_carousel": true,
  "media_count_expected": 3,
  "media_count_downloaded": 3,
  "media_count_failed": 0,
  "post_directory": "/.../downloads/photographer_C_N5m68M1kE",
  "caption_file": "/.../downloads/photographer_C_N5m68M1kE/caption.txt",
  "media_items": [
    {
      "index": 1,
      "type": "image",
      "filename": "01_C_N5m68M1kE_image.jpg",
      "relative_path": "photographer_C_N5m68M1kE/01_C_N5m68M1kE_image.jpg",
      "size_bytes": 1420850,
      "sha256": "3a1f9e...",
      "download_status": "verified"
    },
    {
      "index": 2,
      "type": "video",
      "filename": "02_C_N5m68M1kE_video.mp4",
      "relative_path": "photographer_C_N5m68M1kE/02_C_N5m68M1kE_video.mp4",
      "size_bytes": 8421092,
      "sha256": "b8d2a1...",
      "download_status": "verified"
    }
  ],
  "failed_items": [],
  "retrieval_timestamp_utc": "2026-10-25T13:10:00+00:00"
}
```

---

## 6. Exit Codes

| Code | Meaning |
| :--- | :--- |
| `0` | **Complete**: All expected media items verified, non-empty, and saved with metadata. |
| `1` | **Failed**: Post could not be retrieved (e.g. rate-limited, deleted, invalid URL). |
| `2` | **Partial**: Some items downloaded, but one or more carousel items failed or were empty. |
| `3` | **Private Account**: Target account is private and restricted. |

---

## 7. Running Unit Tests

To verify the test suite:

```bash
tools/instagram-downloader/.venv/bin/python tools/instagram-downloader/test_downloader.py
```
