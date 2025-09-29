from fastapi import FastAPI

from .core import config
from .routers import music, playlist


app = FastAPI()

config.init_app(app)

app.include_router(music.router)
app.include_router(playlist.router)
