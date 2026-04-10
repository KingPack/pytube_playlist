from fastapi import APIRouter
from fastapi.responses import FileResponse
from fastapi import HTTPException
import os
from ..controllers.music import download_audio


router = APIRouter(
    prefix="/api/music",
    tags=["music"],
)


@router.get("/download")
def get_audio(url: str = 'https://www.youtube.com/watch?v=asB23WeoyM0&list=RDasB23WeoyM0&start_radio=1'):
    try:
        file_path = download_audio(url)

        return FileResponse(
            file_path,
            media_type="audio/mpeg",
            filename=os.path.basename(file_path)
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))