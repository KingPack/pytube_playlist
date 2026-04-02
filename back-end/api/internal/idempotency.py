import hashlib

from .config_redis import redis_client


IDEMPOTENCY_TTL = 60 * 60 * 1 # 3,600 Seconds


def make_payload_hash(payload: dict) -> str:
    return hashlib.sha256(repr(payload).encode("utf-8")).hexdigest()


def check_and_set_idempotency(key: str, payload_hash: str) -> bool:

    exists = redis_client.get(key)
    if exists and exists == payload_hash:
        return False

    redis_client.set(key, payload_hash, ex=IDEMPOTENCY_TTL)
    return True
