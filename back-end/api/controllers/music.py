import yt_dlp


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
