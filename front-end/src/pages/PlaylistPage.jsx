import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import MusicCard from "../components/MusicCard/MusicCard";
import UtilityMenu from "../components/UtilityMenu/UtilityMenu";
import { LoadingCircle } from "../components/Loading";
import { fetchPlaylist } from "../services/playlistService";

const formatNumber = (num) => {
  if (num >= 1_000_000_000) return Math.floor(num / 1_000_000_000) + "B";
  if (num >= 1_000_000) return Math.floor(num / 1_000_000) + "M";
  if (num >= 1_000) return Math.floor(num / 1_000) + "K";
  return num.toString();
};

export default function PlaylistPage() {
  const location = useLocation();
  const playlistUrl = new URLSearchParams(location.search).get("url");

  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedItems, setSelectedItems] = useState({});

  useEffect(() => {
    if (!playlistUrl) {
      setError("URL da playlist não fornecida");
      setLoading(false);
      return;
    }

    setLoading(true);
    fetchPlaylist(playlistUrl)
      .then((data) => {
        setPlaylist(data);
        setError("");
      })
      .catch((err) => {
        console.error(err);
        setError("Não foi possível carregar a playlist");
      })
      .finally(() => setLoading(false));
  }, [playlistUrl]);

  const handleSelectAll = () => {
    if (!playlist) return;
    const allSelected = playlist.musics.reduce((acc, music) => {
      acc[music.number] = true;
      return acc;
    }, {});
    setSelectedItems(allSelected);
  };

  const handleDeselectAll = () => {
    setSelectedItems({});
  };

  const handleSelect = (number, value) => {
    setSelectedItems((prev) => ({ ...prev, [number]: value }));
  };

  const handleDownload = () => {
    const selectedMusic = playlist.musics.filter(
      (m) => selectedItems[m.number]
    );
    alert(`Download de ${selectedMusic.length} músicas selecionadas (simulado)`);
  };

  const toggleView = () => {
    setViewMode((prev) => (prev === "grid" ? "list" : "grid"));
  };

  const selectedCount = Object.values(selectedItems).filter(Boolean).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <LoadingCircle />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  }

  if (!playlist?.musics?.length) {
    return (
      <div className="text-center text-gray-400 mt-10">
        Nenhuma música encontrada na playlist.
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen pt-24 px-4">
      <div className="bg-gray-800 rounded-xl p-4 mb-4 shadow-md inline-block">
        <h1 className="text-xl font-semibold mb-1 truncate sm:truncate-none">
          {playlist.name || "Sem título"}
        </h1>

        <div className="flex flex-wrap gap-1 text-gray-400 text-sm mb-1">
          <span>{playlist.name_uploader || "Desconhecido"}</span>
          <span>
            • {playlist.playlist_count} músicas • {formatNumber(playlist.playlist_view)} visualizações
          </span>
        </div>

        {playlist.description && (
          <p className="text-gray-300 text-sm">{playlist.description}</p>
        )}
      </div>

      <UtilityMenu
        selectedCount={selectedCount}
        onSelectAll={handleSelectAll}
        onDeselectAll={handleDeselectAll}
        onDownload={handleDownload}
        onToggleView={toggleView}
        viewMode={viewMode}
      />

      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6"
            : "flex flex-col gap-2"
        }
      >
        {playlist.musics.map((song) => (
          <MusicCard
            key={song.number}
            nome={song.name}
            url={song.url}
            number={song.number}
            thumbnails={song.thumbnails}
            duration={song.duration}
            viewCount={song.view_count}
            viewMode={viewMode}
            selected={!!selectedItems[song.number]}
            onSelect={(val) => handleSelect(song.number, val)}
          />
        ))}
      </div>
    </div>
  );
}
