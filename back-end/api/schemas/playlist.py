from typing import List
from pydantic import BaseModel
from .music import Music


class PlaylistInfo(BaseModel):
    name: str
    description: str
    name_uploader: str
    playlist_count: int
    playlist_view: int
    playlist_link: str
    musics: list[Music]
    current_page: int
    total_pages: int
    _type: int


class MusicItem(BaseModel):
    name: str
    number: int
    url: str


class PlaylistRequest(BaseModel):
    title: str
    url: str
    id_session: str | None = None
    musics: List[MusicItem]
