import React, { useState } from "react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

const formatNumber = (num) => {
  if (num >= 1_000_000_000) return Math.floor(num / 1_000_000_000) + "B";
  if (num >= 1_000_000) return Math.floor(num / 1_000_000) + "M";
  if (num >= 1_000) return Math.floor(num / 1_000) + "K";
  return num.toString();
};

export default function MusicCard({ nome, link, number, thumbnails = [], duration, viewCount }) {
  const [selected, setSelected] = useState(false);

  const formatDuration = (seconds) => {
    if (!seconds) return "Duração desconhecida";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${String(s).padStart(2, "0")} min`;
  };

  return (
    <button
      id={link || `music-${number}`}
      onClick={() => setSelected(!selected)}
      className={`relative bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition w-full text-left ${
        selected ? "ring-4 ring-blue-500" : ""
      }`}
    >
      <span className="absolute top-2 left-2 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded">
        {number}
      </span>

      {selected && (
        <CheckCircleIcon
          className="absolute top-2 right-2 w-6 h-6 text-blue-500 drop-shadow-lg"
        />
      )}

      <div className="w-full h-48 overflow-hidden rounded-t-lg bg-gray-700 flex items-center justify-center">
        {thumbnails[0]?.url ? (
          <img
            src={thumbnails[0].url}
            alt={nome}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-gray-400 text-sm">Sem imagem</span>
        )}
      </div>

      <div className="p-4">
        <h2 className="text-base font-semibold text-center break-words line-clamp-2">
          {nome || "Sem título"}
        </h2>

        <div className="flex justify-center gap-4 mt-2 text-xs text-gray-400">
          <span>{formatDuration(duration)}</span>
          {viewCount != null && <span>{formatNumber(viewCount)} visualizações</span>}
        </div>
      </div>
    </button>
  );
}
