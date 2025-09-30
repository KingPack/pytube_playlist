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
  const [selectedItems, setSelectedItems] = useState([]);
  const [viewMode, setViewMode] = useState("grid");

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
      .catch(() => setError("Não foi possível carregar a playlist"))
      .finally(() => setLoading(false));
  }, [playlistUrl]);

  const toggleSelect = (number) => {
    setSelectedItems((prev) =>
      prev.includes(number)
        ? prev.filter((n) => n !== number)
        : [...prev, number]
    );
  };

  const selectAll = () => {
    if (playlist?.musics) setSelectedItems(playlist.musics.map((m) => m.number));
  };

  const deselectAll = () => setSelectedItems([]);

  const toggleViewMode = () => {
    setViewMode((prev) => (prev === "grid" ? "list" : "grid"));
  };

  const handleDownload = () => {
    alert(`Baixando ${selectedItems.length} músicas...`);
    console.log(selectedItems)
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <LoadingCircle />
      </div>
    );

  if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;
  if (!playlist?.musics?.length)
    return (
      <div className="text-center text-gray-400 mt-10">
        Nenhuma música encontrada na playlist.
      </div>
    );

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
        {playlist.description && <p className="text-gray-300 text-sm">{playlist.description}</p>}
      </div>

      <UtilityMenu
        selectedCount={selectedItems.length}
        onSelectAll={selectAll}
        onDeselectAll={deselectAll}
        onDownload={handleDownload}
        onToggleView={toggleViewMode}
        viewMode={viewMode}
      />

      <div
        className={`grid gap-4 ${
          viewMode === "grid"
            ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
            : "grid-cols-1"
        }`}
      >
        {playlist.musics.map((song) => (
          <MusicCard
            key={song.number}
            nome={song.name}
            url={song.link}
            number={song.number}
            thumbnails={song.thumbnails}
            duration={song.duration}
            viewCount={song.view_count}
            selected={selectedItems.includes(song.number)}
            onSelect={() => toggleSelect(song.number)}
            viewMode={viewMode}
          />
        ))}
      </div>
    </div>
  );
}
