import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import MusicCard from "../components/Playlist/MusicCard";
import { LoadingCircle } from "../components/Loading";
import { fetchPlaylist } from "../services/playlistService";

export default function PlaylistPage() {
  const location = useLocation();
  const playlistUrl = new URLSearchParams(location.search).get("url");

  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!playlistUrl) return;

    setLoading(true);
    fetchPlaylist(playlistUrl)
      .then((data) => setPlaylist(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [playlistUrl]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <LoadingCircle />
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="text-center text-red-500 mt-10">
        Não foi possível carregar a playlist.
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen pt-24 px-6">
      <h1 className="text-3xl font-bold mb-6">{playlist.name}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {playlist.musics.map((song) => (
          <MusicCard
            key={song.link}
            nome={song.name}
            link={song.link}
            index={song.number}
            thumbnails={song.thumbnails}
            duration={song.duration}
            viewCount={song.view_count}
          />
        ))}
      </div>
    </div>
  );
}
