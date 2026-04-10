import os

from fastapi import FastAPI, Request

from .core import config
from .internal import config_redis
from .routers import music, playlist

app = FastAPI()
DOWNLOAD_DIR = "downloads"
os.makedirs(DOWNLOAD_DIR, exist_ok=True)

config.init_app(app)
config_redis.init_app(app)

app.include_router(music.router)
app.include_router(playlist.router)
