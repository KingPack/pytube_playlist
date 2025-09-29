import { CheckCircleIcon } from "@heroicons/react/24/solid";

const formatNumber = (num) => {
  if (num >= 1_000_000_000) return Math.floor(num / 1_000_000_000) + "B";
  if (num >= 1_000_000) return Math.floor(num / 1_000_000) + "M";
  if (num >= 1_000) return Math.floor(num / 1_000) + "K";
  return num.toString();
};

export default function MusicCard({
  nome,
  url,
  number,
  thumbnails = [],
  duration,
  viewCount,
  selected = false,
  onSelect,
  viewMode = "grid",
}) {
  const formattedDuration = duration
    ? `${Math.floor(duration / 60)}:${String(duration % 60).padStart(2, "0")} min`
    : "Duração desconhecida";

  return (
    <button
      onClick={onSelect}
      className={`relative bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition w-full text-left flex ${
        viewMode === "list" ? "flex-row h-24" : "flex-col h-auto"
      } ${selected ? "ring-4 ring-blue-500" : ""}`}
    >
      <span className="absolute top-2 left-2 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded">
        {number}
      </span>

      {selected && (
        <CheckCircleIcon className="absolute top-2 right-2 w-6 h-6 text-blue-500 drop-shadow-lg" />
      )}

      <div
        className={`overflow-hidden rounded-t-lg bg-gray-700 flex items-center justify-center ${
          viewMode === "list" ? "w-24 h-full rounded-l-lg" : "w-full h-48"
        }`}
      >
        {thumbnails[0]?.url ? (
          <img
            src={thumbnails[0].url}
            alt={nome}
            className={`object-cover w-full h-full`}
          />
        ) : (
          <span className="text-gray-400 text-sm">Sem imagem</span>
        )}
      </div>

      <div
        className={`p-2 flex flex-col justify-center ${
          viewMode === "list" ? "flex-1 pl-4" : ""
        }`}
      >
        <h2
          className={`text-sm font-semibold ${
            viewMode === "grid" ? "text-center truncate" : "truncate"
          }`}
        >
          {nome || "Sem título"}
        </h2>
        <div
          className={`mt-1 text-xs text-gray-400 flex ${
            viewMode === "list" ? "flex-row gap-4" : "flex-col items-center gap-1"
          }`}
        >
          <span>{formattedDuration}</span>
          {viewCount != null && <span>{formatNumber(viewCount)} visualizações</span>}
        </div>
      </div>
    </button>
  );
}
