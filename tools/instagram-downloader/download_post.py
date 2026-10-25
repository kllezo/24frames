#!/usr/bin/env python3
"""
Instagram Post & Carousel Downloader CLI
========================================
Downloads complete Instagram posts, Reels, and multi-item carousels (albums)
into a dedicated directory, preserving original media formats and capturing
complete JSON metadata and captions.

Author: 24 Frames Team
License: MIT
"""

import argparse
import hashlib
import http.cookiejar
import json
import os
import re
import sys
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple
from urllib.parse import urlparse

import requests

try:
    import instaloader
    from instaloader.exceptions import (
        BadResponseException,
        ConnectionException,
        InstaloaderException,
        LoginRequiredException,
        PrivateProfileNotFollowedException,
        QueryReturnedNotFoundException,
    )
except ImportError as err:
    print(
        f"Error: Dependency import failed ({err}).\n"
        "Run: pip install -r requirements.txt",
        file=sys.stderr,
    )
    sys.exit(1)


def extract_shortcode(url_or_shortcode: str) -> str:
    """Extracts an Instagram shortcode from a URL or bare string."""
    cleaned = url_or_shortcode.strip()
    # Match patterns like:
    # https://www.instagram.com/p/C_N5m68M1kE/
    # https://instagram.com/reel/C_N5m68M1kE/
    # https://www.instagram.com/tv/C_N5m68M1kE/
    pattern = r"(?:instagram\.com/(?:p|reel|tv)/|insta.*/)([A-Za-z0-9_-]+)"
    match = re.search(pattern, cleaned)
    if match:
        return match.group(1)

    # If it's already a clean shortcode (alphanumeric with underscores/dashes, typically 9-13 chars)
    if re.match(r"^[A-Za-z0-9_-]{5,30}$", cleaned) and "instagram" not in cleaned:
        return cleaned

    raise ValueError(
        f"Could not parse a valid Instagram post/reel shortcode from: '{url_or_shortcode}'"
    )


def compute_sha256(filepath: Path) -> str:
    """Computes SHA-256 checksum of a file."""
    h = hashlib.sha256()
    with open(filepath, "rb") as f:
        while chunk := f.read(65536):
            h.update(chunk)
    return h.hexdigest()


def load_cookies_into_session(session: requests.Session, cookie_file_path: Path) -> None:
    """Loads a Netscape/Mozilla formatted cookies.txt file into a requests Session."""
    if not cookie_file_path.exists():
        raise FileNotFoundError(f"Cookie file not found: {cookie_file_path}")

    jar = http.cookiejar.MozillaCookieJar(str(cookie_file_path))
    jar.load(ignore_discard=True, ignore_expires=True)
    session.cookies.update(jar)


def download_file(
    url: str,
    target_path: Path,
    session: requests.Session,
    timestamp: Optional[float] = None,
    timeout: int = 45,
    max_retries: int = 3,
) -> Tuple[bool, int, str]:
    """
    Downloads a single media file with streaming and integrity checks.
    Returns: (success: bool, size_bytes: int, sha256_or_error: str)
    """
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
            "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
        ),
        "Accept": "*/*",
    }

    for attempt in range(1, max_retries + 1):
        try:
            with session.get(url, headers=headers, stream=True, timeout=timeout) as resp:
                resp.raise_for_status()
                with open(target_path, "wb") as f:
                    for chunk in resp.iter_content(chunk_size=32768):
                        if chunk:
                            f.write(chunk)

            # Verify file exists and is non-empty
            if not target_path.exists():
                return False, 0, "Downloaded file does not exist on disk"

            size = target_path.stat().st_size
            if size == 0:
                target_path.unlink(missing_ok=True)
                return False, 0, "Downloaded file is 0 bytes (empty)"

            # Apply original timestamp (mtime) if available
            if timestamp:
                os.utime(target_path, (timestamp, timestamp))

            checksum = compute_sha256(target_path)
            return True, size, checksum

        except Exception as err:
            if attempt == max_retries:
                if target_path.exists():
                    target_path.unlink(missing_ok=True)
                return False, 0, f"Download failed after {max_retries} attempts: {err}"
            time.sleep(1.0 * attempt)

    return False, 0, "Unknown download failure"


def run_downloader(
    input_url_or_code: str,
    output_base_dir: Path,
    cookie_file: Optional[Path] = None,
    session_file: Optional[Path] = None,
    login_user: Optional[str] = None,
    quiet: bool = False,
) -> Dict[str, Any]:
    """
    Core download routine.
    Fetches the post, identifies carousel nodes, downloads every media item,
    verifies file integrity, and writes JSON metadata.
    """
    shortcode = extract_shortcode(input_url_or_code)
    canonical_url = f"https://www.instagram.com/p/{shortcode}/"

    if not quiet:
        print(f"[*] Target Instagram Shortcode: {shortcode}")
        print(f"[*] Canonical URL: {canonical_url}")

    # Initialize Instaloader instance with safe defaults (we do our own controlled downloads)
    loader = instaloader.Instaloader(
        download_pictures=False,
        download_videos=False,
        download_video_thumbnails=False,
        download_geotags=False,
        download_comments=False,
        save_metadata=False,
        compress_json=False,
        quiet=True,
    )

    # Attach authentication credentials if provided
    if cookie_file:
        if not quiet:
            print(f"[*] Attaching Netscape cookies from: {cookie_file}")
        load_cookies_into_session(loader.context._session, cookie_file)

    if session_file:
        if not quiet:
            print(f"[*] Loading session file from: {session_file}")
        loader.load_session_from_file(login_user or "user", filename=str(session_file))
    elif login_user and not cookie_file:
        if not quiet:
            print(f"[*] Loading saved session for user: {login_user}")
        loader.load_session_from_file(login_user)

    # Fetch Post Metadata
    try:
        post = instaloader.Post.from_shortcode(loader.context, shortcode)
    except LoginRequiredException as e:
        error_msg = (
            "Instagram rejected anonymous access (Login Required / 401).\n"
            "Meta frequently restricts unauthenticated access to posts and media.\n"
            "Solution: Export your logged-in cookies to a Netscape file and pass:\n"
            "  --cookies /path/to/cookies.txt\n"
            "Or log in using Instaloader's session manager:\n"
            "  instaloader -l <your_instagram_username>\n"
            "and pass:\n"
            "  --login <your_instagram_username>"
        )
        return {
            "status": "failed",
            "shortcode": shortcode,
            "error_type": "LoginRequiredException",
            "error_message": error_msg,
            "source_url": canonical_url,
        }
    except BadResponseException as e:
        error_msg = (
            f"Instagram API returned an error response: {e}\n"
            "This usually indicates Meta's bot protection or rate-limiting on this IP.\n"
            "Solution: Provide an authenticated session via `--cookies <file>` or `--login <username>`."
        )
        return {
            "status": "failed",
            "shortcode": shortcode,
            "error_type": "BadResponseException",
            "error_message": error_msg,
            "source_url": canonical_url,
        }
    except PrivateProfileNotFollowedException:
        error_msg = (
            f"This post belongs to a private Instagram account.\n"
            "Per safety guidelines, private account restrictions are not bypassed."
        )
        return {
            "status": "failed",
            "shortcode": shortcode,
            "error_type": "PrivateProfileException",
            "error_message": error_msg,
            "source_url": canonical_url,
        }
    except QueryReturnedNotFoundException:
        error_msg = f"Post '{shortcode}' was not found on Instagram (it may have been deleted or archived)."
        return {
            "status": "failed",
            "shortcode": shortcode,
            "error_type": "NotFoundException",
            "error_message": error_msg,
            "source_url": canonical_url,
        }
    except Exception as e:
        return {
            "status": "failed",
            "shortcode": shortcode,
            "error_type": type(e).__name__,
            "error_message": str(e),
            "source_url": canonical_url,
        }

    # Inspect post structure and construct download plan
    typename = getattr(post, "typename", "Unknown")
    is_carousel = typename == "GraphSidecar"
    taken_at_utc = post.date_utc.replace(tzinfo=timezone.utc).isoformat()
    taken_timestamp = post.date_utc.timestamp()
    caption = post.caption or ""
    owner_username = post.owner_username or "unknown"
    owner_id = str(post.owner_id) if post.owner_id else "unknown"

    # Set up dedicated folder: <output_base_dir>/<owner_username>_<shortcode>
    post_dir_name = f"{owner_username}_{shortcode}"
    target_dir = output_base_dir / post_dir_name
    target_dir.mkdir(parents=True, exist_ok=True)

    if not quiet:
        print(f"[*] Post Type: {typename} (Carousel: {is_carousel})")
        print(f"[*] Author: @{owner_username} | Posted: {taken_at_utc}")
        print(f"[*] Saving files into: {target_dir}")

    # Build list of media items to download
    media_plan: List[Dict[str, Any]] = []

    if is_carousel:
        # Extract every child item in the carousel
        nodes = list(post.get_sidecar_nodes())
        for idx, node in enumerate(nodes, start=1):
            if node.is_video:
                url = node.video_url
                ext = ".mp4"
                m_type = "video"
            else:
                url = node.display_url
                ext = ".jpg"
                m_type = "image"

            filename = f"{idx:02d}_{shortcode}_{m_type}{ext}"
            media_plan.append({
                "index": idx,
                "type": m_type,
                "filename": filename,
                "url": url,
            })
    else:
        # Single Image or Video / Reel
        if post.is_video:
            url = post.video_url
            ext = ".mp4"
            m_type = "video"
        else:
            url = post.url
            ext = ".jpg"
            m_type = "image"

        filename = f"01_{shortcode}_{m_type}{ext}"
        media_plan.append({
            "index": 1,
            "type": m_type,
            "filename": filename,
            "url": url,
        })

    expected_count = len(media_plan)
    if not quiet:
        print(f"[*] Identified {expected_count} media item(s) to retrieve.")

    # Execute downloads with verification
    downloaded_items: List[Dict[str, Any]] = []
    failed_items: List[Dict[str, Any]] = []
    session = loader.context._session

    for item in media_plan:
        idx = item["index"]
        m_type = item["type"]
        filename = item["filename"]
        url = item["url"]
        file_path = target_dir / filename

        if not quiet:
            print(f"    -> [{idx}/{expected_count}] Downloading {m_type}: {filename} ... ", end="", flush=True)

        success, size_bytes, info = download_file(
            url=url,
            target_path=file_path,
            session=session,
            timestamp=taken_timestamp,
        )

        if success:
            if not quiet:
                print(f"OK ({size_bytes:,} bytes, sha256={info[:8]}...)")
            downloaded_items.append({
                "index": idx,
                "type": m_type,
                "filename": filename,
                "relative_path": f"{post_dir_name}/{filename}",
                "size_bytes": size_bytes,
                "sha256": info,
                "download_status": "verified",
            })
        else:
            if not quiet:
                print(f"FAILED ({info})")
            failed_items.append({
                "index": idx,
                "type": m_type,
                "filename": filename,
                "error": info,
                "download_status": "failed",
            })

    # Determine final integrity status
    if len(downloaded_items) == expected_count and expected_count > 0:
        retrieval_status = "complete"
    elif len(downloaded_items) > 0:
        retrieval_status = "partial"
    else:
        retrieval_status = "failed"

    # Save caption.txt for direct convenience
    caption_file = target_dir / "caption.txt"
    with open(caption_file, "w", encoding="utf-8") as f:
        f.write(f"Post URL: {canonical_url}\n")
        f.write(f"Author: @{owner_username}\n")
        f.write(f"Date: {taken_at_utc}\n")
        f.write(f"Shortcode: {shortcode}\n")
        f.write("-" * 50 + "\n\n")
        f.write(caption)

    # Save structured metadata.json sidecar
    metadata: Dict[str, Any] = {
        "status": retrieval_status,
        "shortcode": shortcode,
        "source_url": input_url_or_code,
        "canonical_url": canonical_url,
        "owner_username": owner_username,
        "owner_id": owner_id,
        "taken_at_utc": taken_at_utc,
        "caption": caption,
        "likes": post.likes,
        "comments": post.comments,
        "post_type": typename,
        "is_carousel": is_carousel,
        "media_count_expected": expected_count,
        "media_count_downloaded": len(downloaded_items),
        "media_count_failed": len(failed_items),
        "post_directory": str(target_dir),
        "caption_file": str(caption_file),
        "media_items": downloaded_items,
        "failed_items": failed_items,
        "retrieval_timestamp_utc": datetime.now(timezone.utc).isoformat(),
    }

    metadata_file = target_dir / "metadata.json"
    with open(metadata_file, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2, ensure_ascii=False)

    return metadata


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Download complete Instagram posts, Reels, and carousels with verified file integrity.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Download a post/reel to ./downloads:
  python download_post.py "https://www.instagram.com/p/C_N5m68M1kE/"

  # Specify a custom output directory:
  python download_post.py "https://www.instagram.com/p/C_N5m68M1kE/" -o /path/to/archive

  # Supply exported cookies if Instagram restricts anonymous requests:
  python download_post.py "https://www.instagram.com/p/C_N5m68M1kE/" --cookies cookies.txt
""",
    )
    parser.add_argument("url", help="Instagram post URL, Reel URL, or shortcode")
    parser.add_argument(
        "-o",
        "--output-dir",
        default="./downloads",
        help="Base directory for downloaded content (default: ./downloads)",
    )
    parser.add_argument(
        "-c",
        "--cookies",
        help="Path to a Netscape-formatted cookies.txt file",
    )
    parser.add_argument(
        "-s",
        "--session-file",
        help="Path to an Instaloader session file",
    )
    parser.add_argument(
        "-l",
        "--login",
        help="Instagram username whose saved session should be used",
    )
    parser.add_argument(
        "--json",
        action="store_true",
        help="Output result as JSON only",
    )
    parser.add_argument(
        "-q",
        "--quiet",
        action="store_true",
        help="Suppress human-readable progress logs",
    )

    args = parser.parse_args()
    output_dir = Path(args.output_dir).resolve()
    cookie_path = Path(args.cookies).resolve() if args.cookies else None
    session_path = Path(args.session_file).resolve() if args.session_file else None

    result = run_downloader(
        input_url_or_code=args.url,
        output_base_dir=output_dir,
        cookie_file=cookie_path,
        session_file=session_path,
        login_user=args.login,
        quiet=args.quiet or args.json,
    )

    if args.json:
        print(json.dumps(result, indent=2))
    else:
        status = result.get("status")
        if status == "complete":
            print("\n" + "=" * 60)
            print(" DOWNLOAD COMPLETE (All items verified)")
            print("=" * 60)
            print(f"Target Directory: {result.get('post_directory')}")
            print(f"Files Verified:   {result.get('media_count_downloaded')} / {result.get('media_count_expected')}")
            print(f"Metadata File:    {result.get('post_directory')}/metadata.json")
            print(f"Caption File:     {result.get('post_directory')}/caption.txt")
            print("=" * 60)
            sys.exit(0)
        elif status == "partial":
            print("\n" + "!" * 60, file=sys.stderr)
            print(" PARTIAL DOWNLOAD: Some carousel items could not be saved!", file=sys.stderr)
            print("!" * 60, file=sys.stderr)
            print(f"Downloaded: {result.get('media_count_downloaded')} / {result.get('media_count_expected')}", file=sys.stderr)
            print("Failed items:", file=sys.stderr)
            for f_item in result.get("failed_items", []):
                print(f"  - Item #{f_item.get('index')}: {f_item.get('error')}", file=sys.stderr)
            sys.exit(2)
        else:
            print("\n" + "!" * 60, file=sys.stderr)
            print(" DOWNLOAD FAILED", file=sys.stderr)
            print("!" * 60, file=sys.stderr)
            print(f"Error [{result.get('error_type')}]:", file=sys.stderr)
            print(result.get("error_message"), file=sys.stderr)
            sys.exit(1)


if __name__ == "__main__":
    main()
