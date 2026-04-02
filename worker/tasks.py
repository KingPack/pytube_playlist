import os
from yt_dlp import YoutubeDL
from zipfile import ZipFile
from worker.celery_app import celery_app


BASE_DIR = "/app/downloads"


@celery_app.task
def download_and_zip_playlist(video_links, playlist_name="playlist"):
    playlist_dir = os.path.join(BASE_DIR, playlist_name)
    os.makedirs(playlist_dir, exist_ok=True)
    
    ydl_opts = {
        "format": "bestaudio/best",
        "outtmpl": os.path.join(playlist_dir, "%(title)s.%(ext)s"),
        "noplaylist": True,
    }

    with YoutubeDL(ydl_opts) as ydl:
        ydl.download(video_links)
    
    zip_path = os.path.join(BASE_DIR, f"{playlist_name}.zip")
    with ZipFile(zip_path, "w") as zipf:
        for root, _, files in os.walk(playlist_dir):
            for file in files:
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, playlist_dir)
                zipf.write(file_path, arcname=arcname)
    
    return zip_path
