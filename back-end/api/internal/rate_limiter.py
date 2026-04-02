import time

from .config_redis import redis_client


def allow_request(key: str, rate: float = 1.0, burst: int = 5) -> bool:
    now = time.time()

    data = redis_client.hmget(key, "tokens", "last")
    tokens = float(data[0]) if data[0] else burst
    last = float(data[1]) if data[1] else now

    delta = max(0, now - last)
    tokens = min(burst, tokens + delta * rate)

    if tokens < 1:
        redis_client.hmset(key, {"tokens": tokens, "last": now})
        redis_client.expire(key, 3600)

        return False

    else:
        tokens -= 1
        redis_client.hmset(key, {"tokens": tokens, "last": now})
        redis_client.expire(key, 3600)

        return True
