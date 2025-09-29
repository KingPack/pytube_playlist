import React, { useState } from "react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

export default function MusicCard({ nome, url, number, thumbnails = [], duration, viewCount }) {
  const [selected, setSelected] = useState(false);

  return (
    <button
      id={url || `music-${number}`}
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
        <h2 className="text-lg font-semibold text-center truncate">{nome || "Sem título"}</h2>
        <p className="text-xs text-gray-400 text-center mt-1">
          {duration ? `${Math.floor(duration / 60)}:${String(duration % 60).padStart(2, "0")} min` : "Duração desconhecida"}
        </p>
        {viewCount != null && (
          <p className="text-xs text-gray-400 text-center mt-1">
            {viewCount.toLocaleString()} visualizações
          </p>
        )}
      </div>
    </button>
  );
}
