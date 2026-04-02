import yt_dlp

from math import ceil

from fastapi import HTTPException, Query, APIRouter, Request

from ..schemas.playlist import PlaylistInfo, PlaylistRequest
from ..schemas.music import Music, Thumbnail
from ..utils.validate_ip import validate_ip
from ..internal.rate_limiter import allow_request
from ..internal.idempotency import make_payload_hash, check_and_set_idempotency
from worker.tasks import download_and_zip_playlist


router = APIRouter(
    prefix="/api/playlist",
    tags=["playlist"],
)


@router.get("/", response_model=PlaylistInfo)
async def get_playlist_info(
    url: str = Query(...,
                     example="https://www.youtube.com/playlist?list=PLgOTmTz9Gp0joP1E9-gy4UjCchdTB6teR",
                     description="URL da playlist do YouTube"
                    ),
    page: int = Query(1,
                      ge=1,
                      example=1,
                      description="Número da página"
                    ),
    page_size: int = Query(50,
                           ge=1,
                           le=100,
                           example=50,
                           description="Quantidade de músicas por página"
                        ),
    is_pagination: bool = Query(...,
                                example=False,
                                description="Ativar Paginação"
                            )
):
    try:
        ydl_opts = {
            "quiet": True,
            "extract_flat": True,
        }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)

        if 'entries' not in info:
            raise HTTPException(status_code=400, detail="URL fornecida não é uma playlist válida")

        all_musics = []
        for idx, entry in enumerate(info["entries"], start=1):
            thumbnails = []

            for t in entry.get("thumbnails", []):
                thumbnails.append(Thumbnail(url=t.get("url", ""), width=t.get("width", 0), height=t.get("height", 0)))

            all_musics.append(
                Music(
                    name=entry.get("title", "Sem título"),
                    number=idx,
                    link=entry.get("url", ""),
                    thumbnails=thumbnails,
                    duration=entry.get("duration", 0),
                    view_count=entry.get("view_count", 0),
                )
            )

        if is_pagination:
            total_pages = ceil(len(all_musics) / page_size)

            if page > total_pages and total_pages != 0:
                raise HTTPException(status_code=404, detail="Página não encontrada")

            start_idx = (page - 1) * page_size
            end_idx = start_idx + page_size
            musics_pag = all_musics[start_idx:end_idx]

        else:
            musics_pag = all_musics
            total_pages = 1
            page = 1

        return PlaylistInfo(
            name=info.get("title", "Sem título"),
            description=info.get("description", ""),
            name_uploader=info.get("uploader", ""),
            playlist_count=len(all_musics),
            playlist_view=info.get("view_count", 0),
            playlist_link=url,
            musics=musics_pag,
            current_page=page,
            total_pages=total_pages,
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/download_playlist")
def download_playlist(req: PlaylistRequest, request: Request):

    client_ip = validate_ip(request.client.host)

    allowed = allow_request(f"rate:ip:{client_ip}", rate=0.2, burst=5)

    if not allowed:
        raise HTTPException(status_code=429, detail="Many Requests, wait a time and try again.")

    payload_hash = make_payload_hash(req.dict())
    key = f"idempotency: {req.id_session or client_ip}"
    is_new = check_and_set_idempotency(key, payload_hash)

    if not is_new:
        raise HTTPException(status_code=409, detail="Request Duplicate.")

    task = download_and_zip_playlist.apply_async(
        args=[[m.link for m in req.musics], req.title, client_ip],
        expires=60 * 60 * 6,  # 6 Hours
        retry=False
    )

    return {
        "task_id": task.id,
        "status": "queued",
        "client_ip": client_ip
    }
