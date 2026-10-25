"""
Unit Tests for Instagram Downloader CLI
=======================================
Tests URL extraction, integrity verification, metadata generation,
and failure handling.
"""

import hashlib
import json
import os
import tempfile
import unittest
from pathlib import Path
from unittest.mock import MagicMock, patch

from download_post import (
    compute_sha256,
    download_file,
    extract_shortcode,
    run_downloader,
)


class TestShortcodeExtraction(unittest.TestCase):
    def test_standard_post_url(self):
        self.assertEqual(
            extract_shortcode("https://www.instagram.com/p/C_N5m68M1kE/"),
            "C_N5m68M1kE",
        )

    def test_reel_url_with_query_params(self):
        self.assertEqual(
            extract_shortcode("https://instagram.com/reel/DXZlTiKEpxw/?igsh=NTc4MTIwNjQ2YQ=="),
            "DXZlTiKEpxw",
        )

    def test_tv_url(self):
        self.assertEqual(
            extract_shortcode("https://www.instagram.com/tv/B_12345XYZ/"),
            "B_12345XYZ",
        )

    def test_bare_shortcode(self):
        self.assertEqual(extract_shortcode("C_N5m68M1kE"), "C_N5m68M1kE")

    def test_invalid_url(self):
        with self.assertRaises(ValueError):
            extract_shortcode("https://www.google.com/search?q=instagram")


class TestFileVerification(unittest.TestCase):
    def setUp(self):
        self.temp_dir = tempfile.TemporaryDirectory()
        self.temp_path = Path(self.temp_dir.name)

    def tearDown(self):
        self.temp_dir.cleanup()

    def test_compute_sha256(self):
        test_file = self.temp_path / "sample.jpg"
        content = b"fake-jpeg-image-bytes-24frames"
        test_file.write_bytes(content)

        expected_hash = hashlib.sha256(content).hexdigest()
        self.assertEqual(compute_sha256(test_file), expected_hash)

    def test_empty_file_rejected(self):
        test_file = self.temp_path / "empty.jpg"
        mock_session = MagicMock()
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.iter_content.return_value = [b""]  # empty
        mock_response.__enter__.return_value = mock_response
        mock_session.get.return_value = mock_response

        success, size, error = download_file(
            url="https://mock.cdn/empty.jpg",
            target_path=test_file,
            session=mock_session,
            max_retries=1,
        )
        self.assertFalse(success)
        self.assertEqual(size, 0)
        self.assertIn("0 bytes", error)
        # Verify empty file was cleaned up and removed
        self.assertFalse(test_file.exists())


class TestMetadataAndCarouselWorkflow(unittest.TestCase):
    def setUp(self):
        self.temp_dir = tempfile.TemporaryDirectory()
        self.output_base = Path(self.temp_dir.name)

    def tearDown(self):
        self.temp_dir.cleanup()

    @patch("instaloader.Post.from_shortcode")
    @patch("download_post.download_file")
    def test_carousel_download_plan_and_completeness(self, mock_download, mock_post_fetch):
        # Create a mock carousel Post with 3 items (2 images, 1 video)
        mock_post = MagicMock()
        mock_post.typename = "GraphSidecar"
        mock_post.shortcode = "TEST_CAROUSEL_123"
        mock_post.owner_username = "test_creator"
        mock_post.owner_id = 987654321
        mock_post.date_utc = MagicMock()
        mock_post.date_utc.replace.return_value.isoformat.return_value = "2026-10-25T12:00:00+00:00"
        mock_post.date_utc.timestamp.return_value = 1792929600.0
        mock_post.caption = "Exploring creative frames #photography"
        mock_post.likes = 150
        mock_post.comments = 25

        node1 = MagicMock(is_video=False, display_url="https://cdn/img1.jpg")
        node2 = MagicMock(is_video=True, video_url="https://cdn/vid2.mp4")
        node3 = MagicMock(is_video=False, display_url="https://cdn/img3.jpg")
        mock_post.get_sidecar_nodes.return_value = [node1, node2, node3]
        mock_post_fetch.return_value = mock_post

        # Mock download_file returning success for all 3 items
        mock_download.side_effect = [
            (True, 102400, "hash_01"),
            (True, 2048000, "hash_02"),
            (True, 153600, "hash_03"),
        ]

        result = run_downloader(
            input_url_or_code="https://www.instagram.com/p/TEST_CAROUSEL_123/",
            output_base_dir=self.output_base,
            quiet=True,
        )

        # Assert status and counts
        self.assertEqual(result["status"], "complete")
        self.assertEqual(result["media_count_expected"], 3)
        self.assertEqual(result["media_count_downloaded"], 3)
        self.assertEqual(result["media_count_failed"], 0)
        self.assertTrue(result["is_carousel"])

        # Check directory and metadata file creation
        target_dir = self.output_base / "test_creator_TEST_CAROUSEL_123"
        self.assertTrue(target_dir.is_dir())
        metadata_file = target_dir / "metadata.json"
        caption_file = target_dir / "caption.txt"
        self.assertTrue(metadata_file.exists())
        self.assertTrue(caption_file.exists())

        # Verify metadata content
        with open(metadata_file) as f:
            meta = json.load(f)
            self.assertEqual(meta["shortcode"], "TEST_CAROUSEL_123")
            self.assertEqual(len(meta["media_items"]), 3)
            self.assertEqual(meta["media_items"][0]["filename"], "01_TEST_CAROUSEL_123_image.jpg")
            self.assertEqual(meta["media_items"][1]["filename"], "02_TEST_CAROUSEL_123_video.mp4")
            self.assertEqual(meta["media_items"][2]["filename"], "03_TEST_CAROUSEL_123_image.jpg")

    @patch("instaloader.Post.from_shortcode")
    @patch("download_post.download_file")
    def test_partial_download_never_claims_complete(self, mock_download, mock_post_fetch):
        # Create a mock carousel Post with 2 items, where item 2 fails
        mock_post = MagicMock()
        mock_post.typename = "GraphSidecar"
        mock_post.shortcode = "PARTIAL_POST"
        mock_post.owner_username = "artist"
        mock_post.owner_id = 11111
        mock_post.date_utc = MagicMock()
        mock_post.date_utc.replace.return_value.isoformat.return_value = "2026-10-25T12:00:00+00:00"
        mock_post.date_utc.timestamp.return_value = 1792929600.0
        mock_post.caption = "Partial test"
        mock_post.likes = 10
        mock_post.comments = 2

        node1 = MagicMock(is_video=False, display_url="https://cdn/img1.jpg")
        node2 = MagicMock(is_video=False, display_url="https://cdn/img2.jpg")
        mock_post.get_sidecar_nodes.return_value = [node1, node2]
        mock_post_fetch.return_value = mock_post

        # Item 1 succeeds, Item 2 fails
        mock_download.side_effect = [
            (True, 50000, "hash_01"),
            (False, 0, "HTTP 500 CDN Error"),
        ]

        result = run_downloader(
            input_url_or_code="PARTIAL_POST",
            output_base_dir=self.output_base,
            quiet=True,
        )

        # Must report partial and NEVER complete
        self.assertEqual(result["status"], "partial")
        self.assertEqual(result["media_count_expected"], 2)
        self.assertEqual(result["media_count_downloaded"], 1)
        self.assertEqual(result["media_count_failed"], 1)
        self.assertEqual(len(result["failed_items"]), 1)
        self.assertIn("HTTP 500", result["failed_items"][0]["error"])


if __name__ == "__main__":
    unittest.main()
