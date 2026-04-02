import importlib
import os
import sys
import types
import unittest


REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
BACKEND_ROOT = os.path.join(REPO_ROOT, "back-end")
if BACKEND_ROOT not in sys.path:
    sys.path.insert(0, BACKEND_ROOT)


class FakeHTTPException(Exception):
    def __init__(self, status_code: int, detail: str):
        super().__init__(detail)
        self.status_code = status_code
        self.detail = detail


def install_fastapi_stub():
    fastapi = types.ModuleType("fastapi")
    fastapi.HTTPException = FakeHTTPException
    sys.modules["fastapi"] = fastapi


class ValidateIpTests(unittest.TestCase):
    def setUp(self):
        install_fastapi_stub()
        sys.modules.pop("api.utils.validate_ip", None)
        self.mod = importlib.import_module("api.utils.validate_ip")

    def test_returns_same_value_for_valid_ipv4(self):
        ip = "127.0.0.1"
        self.assertEqual(self.mod.validate_ip(ip), ip)

    def test_raises_400_for_invalid_ip(self):
        with self.assertRaises(FakeHTTPException) as ctx:
            self.mod.validate_ip("999.999.999.999")
        self.assertEqual(ctx.exception.status_code, 400)
        self.assertEqual(ctx.exception.detail, "IP not valid.")


if __name__ == "__main__":
    unittest.main()
