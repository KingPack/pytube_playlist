from typing import List, Optional
from pydantic import BaseModel


class Thumbnail(BaseModel):
    url: str
    height: int
    width: int


class Music(BaseModel):
    name: str
    number: int
    url: str
    link: str
    thumbnails: List[Thumbnail]
    duration: Optional[int] = 0
    view_count: Optional[int] = 0
