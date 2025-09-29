import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingCircle from "../components/Loading/LoadingCircle";
import { detectSearchType } from "../hooks/useSearchRedirect";

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query) return;

    setLoading(true);
    const type = detectSearchType(query);

    switch (type.type) {
      case "playlist":
        navigate(`/playlist?url=${encodeURIComponent(query)}`);
        break;
      case "video":
        navigate(`/music?url=${encodeURIComponent(query)}`);
        break;
      case "search":
        navigate(`/search?name=${encodeURIComponent(query)}`);
        break;
      default:
        break;
    }

    setLoading(false);
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center">
      {loading && <LoadingCircle />}
      <h1 className="text-4xl font-bold mb-6 text-center">
        Pesquise sua Música ou Playlist
      </h1>
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cole um link ou digite o nome da música"
          className="px-4 py-2 rounded-lg text-black w-80"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg"
        >
          Buscar
        </button>
      </form>
    </div>
  );
}
