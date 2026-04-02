import importlib
import os
import sys
import types
import unittest


REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
BACKEND_ROOT = os.path.join(REPO_ROOT, "back-end")
if BACKEND_ROOT not in sys.path:
    sys.path.insert(0, BACKEND_ROOT)


class FakeYoutubeDL:
    last_options = None
    last_urls = None

    def __init__(self, options):
        FakeYoutubeDL.last_options = options

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc, tb):
        return False

    def download(self, urls):
        FakeYoutubeDL.last_urls = urls


def install_ytdlp_stub():
    yt_dlp = types.ModuleType("yt_dlp")
    yt_dlp.YoutubeDL = FakeYoutubeDL
    sys.modules["yt_dlp"] = yt_dlp


class MusicControllerTests(unittest.TestCase):
    def setUp(self):
        install_ytdlp_stub()
        sys.modules.pop("api.controllers.music", None)
        self.mod = importlib.import_module("api.controllers.music")

    def test_download_audio_builds_expected_ytdlp_options(self):
        self.mod.download_audio("https://youtu.be/test123", format="wav")

        options = FakeYoutubeDL.last_options
        self.assertIsNotNone(options)
        self.assertEqual(options["format"], "bestaudio/best")
        self.assertEqual(options["outtmpl"], ".temp/%(title)s.%(ext)s")
        self.assertEqual(options["postprocessors"][0]["preferredcodec"], "wav")
        self.assertEqual(FakeYoutubeDL.last_urls, ["https://youtu.be/test123"])


if __name__ == "__main__":
    unittest.main()
