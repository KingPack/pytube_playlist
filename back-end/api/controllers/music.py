import yt_dlp
import uuid
import os



def get_audio_filename(info):
    title = info.get("title", "audio")
    safe_title = "".join(c for c in title if c.isalnum() or c in " -_").rstrip()
    return f"{safe_title}.mp3"


def download_audio(url: str) -> str:
    ydl_opts = {
        'format': 'bestaudio/best',
        'outtmpl': os.path.join('downloads', "%(title)s.%(ext)s"),
        'quiet': True,
        'noplaylist': True,
        'restrictfilenames': True,
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }],
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=False)

        filename = get_audio_filename(info)
        final_path = os.path.join('downloads', filename)

        if os.path.exists(final_path):
            return final_path

        ydl.download([url])

        if not os.path.exists(final_path):
            raise Exception("Falha ao gerar o arquivo")

        return final_path
