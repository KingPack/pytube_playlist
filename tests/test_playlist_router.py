import asyncio
import importlib
import os
import sys
import types
import unittest


REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
BACKEND_ROOT = os.path.join(REPO_ROOT, "back-end")
if REPO_ROOT not in sys.path:
    sys.path.insert(0, REPO_ROOT)
if BACKEND_ROOT not in sys.path:
    sys.path.insert(0, BACKEND_ROOT)


class FakeHTTPException(Exception):
    def __init__(self, status_code: int, detail: str):
        super().__init__(detail)
        self.status_code = status_code
        self.detail = detail


class FakeAPIRouter:
    def __init__(self, **_kwargs):
        pass

    def get(self, *_args, **_kwargs):
        def decorator(fn):
            return fn

        return decorator

    def post(self, *_args, **_kwargs):
        def decorator(fn):
            return fn

        return decorator


def fake_query(default=None, **_kwargs):
    return default


class FakeBaseModel:
    def __init__(self, **kwargs):
        for k, v in kwargs.items():
            setattr(self, k, v)

    def dict(self):
        return dict(self.__dict__)


class FakeYoutubeDL:
    playlist_info = None

    def __init__(self, _options):
        pass

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc, tb):
        return False

    def extract_info(self, _url, download=False):
        if download:
            raise AssertionError("download should be False for extraction")
        return FakeYoutubeDL.playlist_info


class _FakeTask:
    @staticmethod
    def apply_async(*_args, **_kwargs):
        class Result:
            id = "fake-task-id"

        return Result()


def install_stubs():
    fastapi = types.ModuleType("fastapi")
    fastapi.HTTPException = FakeHTTPException
    fastapi.Query = fake_query
    fastapi.APIRouter = FakeAPIRouter
    fastapi.Request = object
    sys.modules["fastapi"] = fastapi

    pydantic = types.ModuleType("pydantic")
    pydantic.BaseModel = FakeBaseModel
    sys.modules["pydantic"] = pydantic

    yt_dlp = types.ModuleType("yt_dlp")
    yt_dlp.YoutubeDL = FakeYoutubeDL
    sys.modules["yt_dlp"] = yt_dlp

    worker_tasks = types.ModuleType("worker.tasks")
    worker_tasks.download_and_zip_playlist = _FakeTask()
    sys.modules["worker.tasks"] = worker_tasks

    rate_limiter = types.ModuleType("api.internal.rate_limiter")
    rate_limiter.allow_request = lambda *_args, **_kwargs: True
    sys.modules["api.internal.rate_limiter"] = rate_limiter

    idempotency = types.ModuleType("api.internal.idempotency")
    idempotency.make_payload_hash = lambda payload: f"hash-{len(str(payload))}"
    idempotency.check_and_set_idempotency = lambda *_args, **_kwargs: True
    sys.modules["api.internal.idempotency"] = idempotency


def build_playlist_entries(total):
    return [
        {
            "title": f"Track {i}",
            "url": f"https://youtu.be/{i}",
            "duration": 100 + i,
            "view_count": 1000 + i,
            "thumbnails": [{"url": f"https://img/{i}.jpg", "width": 120, "height": 90}],
        }
        for i in range(1, total + 1)
    ]


class PlaylistRouterTests(unittest.TestCase):
    def setUp(self):
        install_stubs()
        for key in [
            "api.schemas.music",
            "api.schemas.playlist",
            "api.routers.playlist",
        ]:
            sys.modules.pop(key, None)
        self.mod = importlib.import_module("api.routers.playlist")

    def test_extract_playlist_without_pagination_returns_all_items(self):
        FakeYoutubeDL.playlist_info = {
            "title": "My Playlist",
            "description": "Demo",
            "uploader": "Tester",
            "view_count": 9999,
            "entries": build_playlist_entries(3),
        }

        result = asyncio.run(
            self.mod.get_playlist_info(
                url="https://youtube.com/playlist?list=abc",
                is_pagination=False,
            )
        )

        self.assertEqual(result.name, "My Playlist")
        self.assertEqual(result.playlist_count, 3)
        self.assertEqual(result.current_page, 1)
        self.assertEqual(result.total_pages, 1)
        self.assertEqual(len(result.musics), 3)
        self.assertEqual(result.musics[0].name, "Track 1")

    def test_extract_playlist_with_pagination_returns_requested_slice(self):
        FakeYoutubeDL.playlist_info = {
            "title": "Paginated",
            "description": "",
            "uploader": "Tester",
            "view_count": 123,
            "entries": build_playlist_entries(5),
        }

        result = asyncio.run(
            self.mod.get_playlist_info(
                url="https://youtube.com/playlist?list=abc",
                page=2,
                page_size=2,
                is_pagination=True,
            )
        )

        self.assertEqual(result.current_page, 2)
        self.assertEqual(result.total_pages, 3)
        self.assertEqual(len(result.musics), 2)
        self.assertEqual(result.musics[0].name, "Track 3")
        self.assertEqual(result.musics[1].name, "Track 4")


if __name__ == "__main__":
    unittest.main()
