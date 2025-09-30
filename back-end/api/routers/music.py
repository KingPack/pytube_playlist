from fastapi import APIRouter

from ..controllers.music import download_audio


router = APIRouter(
    prefix="/api/music",
    tags=["music"],
)


@router.post("/download")
def download(link: str = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"):

    download_audio(link=link)
