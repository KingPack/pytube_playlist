import os
import redis.asyncio as redis


redis_client: redis.Redis = None


def init_app(app):
    @app.on_event("startup")
    async def startup_event():
        global redis_client
        redis_client = redis.Redis(host='redis', port=6379, decode_responses=True)
        try:
            await redis_client.ping()
            print("Connected to Redis!")
        except redis.exceptions.ConnectionError as e:
            print(f"Could not connect to Redis: {e}")

    @app.on_event("shutdown")
    async def shutdown_event():
        if redis_client:
            await redis_client.close()
            print("Disconnected from Redis.")