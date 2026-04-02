import importlib
import os
import sys
import tempfile
import types
import unittest
import zipfile


REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if REPO_ROOT not in sys.path:
    sys.path.insert(0, REPO_ROOT)


class FakeCelery:
    def __init__(self, *args, **kwargs):
        pass

    def autodiscover_tasks(self, *_args, **_kwargs):
        return None

    def task(self, func=None, **_kwargs):
        if func is not None:
            return func

        def decorator(fn):
            return fn

        return decorator


class FakeYoutubeDL:
    def __init__(self, options):
        self.options = options

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc, tb):
        return False

    def download(self, urls):
        output_template = self.options["outtmpl"]
        target_dir = os.path.dirname(output_template)
        os.makedirs(target_dir, exist_ok=True)
        for idx, _ in enumerate(urls, start=1):
            filename = os.path.join(target_dir, f"track_{idx}.webm")
            with open(filename, "w", encoding="utf-8") as f:
                f.write("dummy-media")


def install_stubs():
    celery = types.ModuleType("celery")
    celery.Celery = FakeCelery
    sys.modules["celery"] = celery

    yt_dlp = types.ModuleType("yt_dlp")
    yt_dlp.YoutubeDL = FakeYoutubeDL
    sys.modules["yt_dlp"] = yt_dlp


class WorkerTaskTests(unittest.TestCase):
    def setUp(self):
        install_stubs()
        sys.modules.pop("worker.celery_app", None)
        sys.modules.pop("worker.tasks", None)
        self.tasks = importlib.import_module("worker.tasks")

    def test_download_and_zip_playlist_creates_zip_with_downloaded_files(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            self.tasks.BASE_DIR = tmpdir
            zip_path = self.tasks.download_and_zip_playlist(
                ["https://youtu.be/a", "https://youtu.be/b"],
                "my_playlist",
            )

            self.assertTrue(os.path.exists(zip_path))
            self.assertTrue(zip_path.endswith("my_playlist.zip"))

            with zipfile.ZipFile(zip_path, "r") as zf:
                names = sorted(zf.namelist())
                self.assertEqual(names, ["track_1.webm", "track_2.webm"])


if __name__ == "__main__":
    unittest.main()
