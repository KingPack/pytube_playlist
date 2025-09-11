import os
import yt_dlp

from math import ceil
from typing import List
from pydantic import BaseModel

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

origins = ["http://localhost:5173"]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/api/download")
def download(link: str = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"):

    download_audio(link=link)


def download_audio(url: str, format:str = "mp3") -> None:
    options = {
        "format": "bestaudio/best",
        "postprocessors": [
            {
                "key": "FFmpegExtractAudio",
                "preferredcodec": format,
                "preferredquality": "0",
            }
        ],
         "outtmpl": f".temp/%(title)s.%(ext)s",
    }

    with yt_dlp.YoutubeDL(options) as ydl:
        ydl.download([url])


def audio_exists(url: str,
                 audio_format: str = 'mp3',
                 dir_path: str = 'back-end/.temp') -> bool:

    content_folder = os.listdir(dir_path)

    opts = {"quiet": True, "skip_download": True}

    with yt_dlp.YoutubeDL(opts) as ydl:
        info = ydl.extract_info(url, download=False)
        title = f'{info.get("title", "").strip()}.{audio_format}'

    for music in content_folder:
        if title == music:
            return True

    return False


@app.get("/links")
def get_links() -> dict:
    links: List[str] = [
        "https://www.google.com",
        "https://www.github.com",
        "https://www.python.org",
        "https://fastapi.tiangolo.com"
    ]
    
    return {"links": links}


class Musica(BaseModel):
    nome: str
    link: str


class PlaylistInfo(BaseModel):
    playlist: str
    musicas: list[Musica]
    pagina_atual: int
    total_paginas: int


@app.get("/api/playlist", response_model=PlaylistInfo)
async def get_playlist_info(
    url: str = Query('https://youtube.com/playlist?list=PLgOTmTz9Gp0hAdnZ4B1QmQfhRgTq_62jF',
                     description="URL da playlist do YouTube"),

    page: int = Query(1, 
                      ge=1, 
                      description="Número da página"
                    ),
    page_size: int = Query(10, 
                           ge=1, 
                           le=50, 
                           description="Quantidade de músicas por página"
                        )
):
    try:
        ydl_opts = {
            'quiet': True,
            'extract_flat': True,  # Não baixa os vídeos, apenas pega informações
        }
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)

        if 'entries' not in info:
            raise HTTPException(status_code=400, detail="URL fornecida não é uma playlist válida")

        todas_musicas = [
            Musica(nome=entry.get('title', 'Sem título'), link=entry.get('url', ''))
            for entry in info['entries']
        ]

        total_paginas = ceil(len(todas_musicas) / page_size)

        if page > total_paginas and total_paginas != 0:
            raise HTTPException(status_code=404, detail="Página não encontrada")

        # Pega apenas a fatia da página atual
        start_idx = (page - 1) * page_size
        end_idx = start_idx + page_size
        musicas_pag = todas_musicas[start_idx:end_idx]

        return PlaylistInfo(
            playlist=info.get('title', 'Sem título'),
            musicas=musicas_pag,
            pagina_atual=page,
            total_paginas=total_paginas
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
