#!/usr/bin/env python3
"""
24 Frames Portfolio Ingestion & Asset Packaging Script
======================================================
Ingests, downloads, packages, and verifies all six client portfolio sources:
- 4 Pic-Time Galleries
- 2 YouTube Cinematic Wedding Films
"""

import hashlib
import json
import os
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from PIL import Image

# Paths
BASE_DIR = Path(__file__).resolve().parent.parent.parent
INGEST_DIR = BASE_DIR / "tools" / "portfolio-ingestion"
RAW_DIR = INGEST_DIR / "raw"
WEBSITE_DIR = BASE_DIR / "24frames-website"
PUBLIC_IMAGES_DIR = WEBSITE_DIR / "public" / "images" / "portfolio"
PUBLIC_VIDEOS_DIR = WEBSITE_DIR / "public" / "videos" / "portfolio"
PUBLIC_DATA_DIR = WEBSITE_DIR / "public" / "data"
DOCS_DIR = BASE_DIR / "docs"

# 6 Source Projects Definition
SOURCES = [
    {
        "id": "gallery-01",
        "slug": "sireesh-harshitha",
        "type": "pic-time-gallery",
        "title": "Sireesh & Harshitha",
        "client_names": "Sireesh & Harshitha",
        "verified_title": "SIREESH & HARSHITHA",
        "category": "Wedding Celebration",
        "source_url": "https://24frames.pic-time.com/8Nq0pv3SJbxKn",
        "platform": "Pic-Time",
        "project_id": 47138508,
        "location": "Hyderabad, Telangana",
        "description": "Authentic wedding celebrations documented by 24 Frames Photography, celebrating sacred traditions and intimate family moments.",
        "download_policy": {
            "freeDownloadsActive": False,
            "hiresScope": 100,
            "status": "RESTRICTED — Client PIN / Store order required for in-gallery batch zip download"
        },
        "media_assets": [
            {
                "role": "cover",
                "filename": "cover.jpg",
                "remote_url": "https://pictime6eus1public-pub-f5djhafrcqd3djf7.a02.azurefd.net/pictures/47/138/47138508/homepage/homepage.jpg",
                "format": "JPEG",
                "caption": "Sireesh & Harshitha — Editorial Cover Photograph"
            }
        ]
    },
    {
        "id": "gallery-02",
        "slug": "bellamkonda-kavya-reception",
        "type": "pic-time-gallery",
        "title": "Bellamkonda Sai Sreenivas & Kavya Reddy",
        "client_names": "Bellamkonda Sai Sreenivas & Kavya Reddy",
        "verified_title": "24 FRAMES BELLAMKONDA SAI SRINIVAS & KAVYA REDDY RECEPTION",
        "category": "Celebrity Wedding Reception",
        "source_url": "https://24frames.pic-time.com/8P0kK5ZUmew5F",
        "platform": "Pic-Time",
        "project_id": 51869900,
        "location": "Hyderabad, Telangana",
        "description": "High-profile grand wedding reception of Telugu cinema star Bellamkonda Sai Sreenivas and Kavya Reddy, featuring distinguished guests and royal stage florals.",
        "download_policy": {
            "freeDownloadsActive": False,
            "hiresScope": 100,
            "status": "RESTRICTED — Client PIN / Store order required for in-gallery batch zip download"
        },
        "media_assets": [
            {
                "role": "cover",
                "filename": "cover.jpg",
                "remote_url": "https://pictime6eus1public-pub-f5djhafrcqd3djf7.a02.azurefd.net/pictures/51/869/51869900/homepage/homepage.jpg",
                "format": "JPEG",
                "caption": "Bellamkonda Sai Sreenivas & Kavya Reddy — Reception Cover"
            }
        ]
    },
    {
        "id": "gallery-03",
        "slug": "hrithika-abhishek",
        "type": "pic-time-gallery",
        "title": "Hrithika & Abhishek",
        "client_names": "Hrithika & Abhishek",
        "verified_title": "HRITHIKA & ABHISHEK",
        "category": "Wedding & Celebrations",
        "source_url": "https://24frames.pic-time.com/whZsXRiO6XgQn",
        "platform": "Pic-Time",
        "project_id": 50753475,
        "location": "Hyderabad, Telangana",
        "description": "Exquisite wedding rituals and candid family joy documented across nine dedicated multi-day scenes by 24 Frames.",
        "download_policy": {
            "freeDownloadsActive": False,
            "hiresScope": 1,
            "status": "RESTRICTED — Client PIN / Store order required for in-gallery batch zip download"
        },
        "media_assets": [
            {
                "role": "cover",
                "filename": "cover.jpg",
                "remote_url": "https://pictime6eus1public-pub-f5djhafrcqd3djf7.a02.azurefd.net/pictures/50/753/50753475/homepage/homepage.jpg",
                "format": "JPEG",
                "caption": "Hrithika & Abhishek — Wedding Portrait Cover"
            }
        ]
    },
    {
        "id": "gallery-04",
        "slug": "karthik-gayathri",
        "type": "pic-time-gallery",
        "title": "Karthik & Gayathri",
        "client_names": "Karthik & Gayathri",
        "verified_title": "KARTHIK & GAYATHRI",
        "category": "Wedding Celebrations",
        "source_url": "https://24frames.pic-time.com/yBCmkKcczvWql",
        "platform": "Pic-Time",
        "project_id": 52782249,
        "location": "Hyderabad, Telangana",
        "description": "Fine-art South Indian wedding coverage featuring classical decor, traditional silk sarees, and evocative ambient lighting.",
        "download_policy": {
            "freeDownloadsActive": False,
            "hiresScope": 100,
            "status": "RESTRICTED — Client PIN / Store order required for in-gallery batch zip download"
        },
        "media_assets": [
            {
                "role": "cover",
                "filename": "cover.jpg",
                "remote_url": "https://pictime6eus1public-pub-f5djhafrcqd3djf7.a02.azurefd.net/pictures/52/782/52782249/homepage/homepage.jpg",
                "format": "JPEG",
                "caption": "Karthik & Gayathri — Classical Fine-Art Cover"
            }
        ]
    },
    {
        "id": "film-01",
        "slug": "nishanth-sanzena",
        "type": "youtube-film",
        "title": "Nishanth & Sanzena",
        "client_names": "Nishanth & Sanzena",
        "verified_title": "Nishanth X Sanzena | Couple Shoot Film | 24Frames Wedding Films",
        "category": "Couple Shoot Cinema Film",
        "source_url": "https://youtu.be/s32UT21hnBg",
        "embed_url": "https://www.youtube-nocookie.com/embed/s32UT21hnBg",
        "youtube_id": "s32UT21hnBg",
        "duration_seconds": 257,
        "duration_formatted": "04:17",
        "upload_date": "2025-09-18",
        "channel": "24 Frames Photography",
        "platform": "YouTube",
        "location": "Hyderabad, Telangana",
        "description": "The Unfold love story of Nishanth❤️Sanzena. Experience the beautiful chemistry of Nishanth and Sanzena in this stunning couple shoot film — where every moment, every frame, and every smile captures their eternal bond.",
        "download_policy": {
            "status": "AUTHORIZED EMBED — Original video stream hosted on YouTube; poster thumbnail locally packaged"
        },
        "media_assets": [
            {
                "role": "thumbnail",
                "filename": "poster.jpg",
                "remote_url": "https://i.ytimg.com/vi/s32UT21hnBg/maxresdefault.jpg",
                "format": "JPEG",
                "caption": "Nishanth X Sanzena — Film Poster Thumbnail"
            }
        ]
    },
    {
        "id": "film-02",
        "slug": "vinitha-vivekananda",
        "type": "youtube-film",
        "title": "Vinitha & Vivekananda",
        "client_names": "Vinitha & Vivekananda",
        "verified_title": "Vinitha & Vivekananda | Two Years, One Question | 24Frames Wedding Films",
        "category": "Wedding Teaser & Feature Film",
        "source_url": "https://youtu.be/LNtlLgfT5uY",
        "embed_url": "https://www.youtube-nocookie.com/embed/LNtlLgfT5uY",
        "youtube_id": "LNtlLgfT5uY",
        "duration_seconds": 153,
        "duration_formatted": "02:33",
        "upload_date": "2025-09-18",
        "channel": "24 Frames Photography",
        "platform": "YouTube",
        "location": "Hyderabad, Telangana",
        "description": "A journey of love, patience, and devotion — witness the beautiful story of Vinitha and Vivekananda, where two years of togetherness lead to one life-changing moment. This film captures their heartfelt vows and joyful union.",
        "download_policy": {
            "status": "AUTHORIZED EMBED — Original video stream hosted on YouTube; poster thumbnail locally packaged"
        },
        "media_assets": [
            {
                "role": "thumbnail",
                "filename": "poster.jpg",
                "remote_url": "https://i.ytimg.com/vi/LNtlLgfT5uY/maxresdefault.jpg",
                "format": "JPEG",
                "caption": "Vinitha & Vivekananda — Film Poster Thumbnail"
            }
        ]
    }
]


def sha256_file(filepath: Path) -> str:
    h = hashlib.sha256()
    with open(filepath, "rb") as f:
        while chunk := f.read(65536):
            h.update(chunk)
    return h.hexdigest()


def download_asset(url: str, dest_path: Path) -> tuple[bool, int, str]:
    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
    }
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            content = resp.read()
            if len(content) == 0:
                return False, 0, "Empty payload"
            dest_path.parent.mkdir(parents=True, exist_ok=True)
            with open(dest_path, "wb") as f:
                f.write(content)
        return True, len(content), sha256_file(dest_path)
    except Exception as e:
        return False, 0, str(e)


def process_image_with_pillow(src_path: Path, webp_dest_path: Path) -> tuple[int, int, str, bool]:
    """Generates WebP derivative and extracts width, height, and aspect ratio."""
    try:
        with Image.open(src_path) as img:
            width, height = img.size
            aspect = f"{width} / {height}"
            img.save(webp_dest_path, format="WEBP", quality=88, method=6)
            webp_ok = webp_dest_path.exists() and webp_dest_path.stat().st_size > 0
            return width, height, aspect, webp_ok
    except Exception as e:
        print(f"Pillow conversion error for {src_path.name}: {e}")
        return 0, 0, "unknown", False


def main():
    print("=" * 70)
    print("24 FRAMES — PORTFOLIO INGESTION & ASSET PACKAGING")
    print("=" * 70)

    # Ensure directories
    RAW_DIR.mkdir(parents=True, exist_ok=True)
    PUBLIC_IMAGES_DIR.mkdir(parents=True, exist_ok=True)
    PUBLIC_VIDEOS_DIR.mkdir(parents=True, exist_ok=True)
    PUBLIC_DATA_DIR.mkdir(parents=True, exist_ok=True)
    DOCS_DIR.mkdir(parents=True, exist_ok=True)

    packages_manifest = []

    for proj in SOURCES:
        slug = proj["slug"]
        proj_type = proj["type"]
        print(f"\n[*] Processing [{proj['id']}] {proj['title']} ({slug})...")

        raw_proj_dir = RAW_DIR / slug
        raw_proj_dir.mkdir(parents=True, exist_ok=True)

        if proj_type == "pic-time-gallery":
            public_proj_dir = PUBLIC_IMAGES_DIR / slug
        else:
            public_proj_dir = PUBLIC_VIDEOS_DIR / slug
        public_proj_dir.mkdir(parents=True, exist_ok=True)

        ingested_assets = []

        for asset in proj.get("media_assets", []):
            fname = asset["filename"]
            remote_url = asset["remote_url"]
            raw_dest = raw_proj_dir / fname
            pub_dest = public_proj_dir / fname

            print(f"    Downloading {fname} from: {remote_url[:75]}...")
            success, size_bytes, info = download_asset(remote_url, raw_dest)

            if success:
                print(f"    -> OK: {size_bytes:,} bytes (SHA256: {info[:8]}...)")
                # Copy to public folder
                pub_dest.write_bytes(raw_dest.read_bytes())

                # Generate WebP derivative and dimensions via Pillow
                webp_fname = Path(fname).stem + ".webp"
                webp_pub_dest = public_proj_dir / webp_fname
                width, height, aspect, webp_ok = process_image_with_pillow(pub_dest, webp_pub_dest)

                if webp_ok:
                    webp_size = webp_pub_dest.stat().st_size
                    print(f"    -> WebP generated: {webp_size:,} bytes ({width}x{height}, aspect {aspect})")

                asset_record = {
                    "role": asset["role"],
                    "filename": fname,
                    "format": asset["format"],
                    "width": width,
                    "height": height,
                    "aspect_ratio": aspect,
                    "caption": asset["caption"],
                    "raw_path": str(raw_dest.relative_to(BASE_DIR)),
                    "public_path": str(pub_dest.relative_to(WEBSITE_DIR / "public")),
                    "size_bytes": size_bytes,
                    "sha256": info,
                    "webp_derivative": (
                        str(webp_pub_dest.relative_to(WEBSITE_DIR / "public"))
                        if webp_ok else None
                    ),
                    "status": "verified"
                }
                ingested_assets.append(asset_record)
            else:
                print(f"    -> FAILED: {info}")
                ingested_assets.append({
                    "role": asset["role"],
                    "filename": fname,
                    "remote_url": remote_url,
                    "status": "failed",
                    "error": info
                })

        # Assemble package
        package = {
            "id": proj["id"],
            "slug": slug,
            "type": proj_type,
            "title": proj["title"],
            "verified_title": proj["verified_title"],
            "client_names": proj["client_names"],
            "category": proj["category"],
            "source_url": proj["source_url"],
            "platform": proj.get("platform", "Unknown"),
            "description": proj["description"],
            "location": proj.get("location"),
            "embed_url": proj.get("embed_url"),
            "duration": proj.get("duration_formatted"),
            "upload_date": proj.get("upload_date"),
            "download_status": proj.get("download_policy", {}).get("status", "Public Embed"),
            "local_cover": (
                f"/images/portfolio/{slug}/{ingested_assets[0]['filename']}"
                if proj_type == "pic-time-gallery" and ingested_assets
                else f"/videos/portfolio/{slug}/{ingested_assets[0]['filename']}"
            ),
            "local_cover_webp": (
                f"/images/portfolio/{slug}/{Path(ingested_assets[0]['filename']).stem}.webp"
                if proj_type == "pic-time-gallery" and ingested_assets and ingested_assets[0].get("webp_derivative")
                else (
                    f"/videos/portfolio/{slug}/{Path(ingested_assets[0]['filename']).stem}.webp"
                    if ingested_assets and ingested_assets[0].get("webp_derivative")
                    else None
                )
            ),
            "cover_dimensions": {
                "width": ingested_assets[0].get("width") if ingested_assets else None,
                "height": ingested_assets[0].get("height") if ingested_assets else None,
                "aspect_ratio": ingested_assets[0].get("aspect_ratio") if ingested_assets else None,
            },
            "assets": ingested_assets,
            "audit_timestamp": datetime.now(timezone.utc).isoformat()
        }
        packages_manifest.append(package)

    # Save to public/data/portfolio-projects.json
    manifest_file = PUBLIC_DATA_DIR / "portfolio-projects.json"
    with open(manifest_file, "w", encoding="utf-8") as f:
        json.dump({"projects": packages_manifest, "generated_at": datetime.now(timezone.utc).isoformat()}, f, indent=2, ensure_ascii=False)

    print(f"\n[+] Portfolio packages manifest written to: {manifest_file.relative_to(BASE_DIR)}")


if __name__ == "__main__":
    main()
