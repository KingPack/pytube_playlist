import React, { useState } from "react";

export default function MusicSearch({ onPlaylistChange }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!input.trim()) {
      setError("Digite algo ou cole um link.");
      return;
    }

    setLoading(true);
    try {
      const isUrl = /^https?:\/\//.test(input);

      if (isUrl) {
        onPlaylistChange(input);
      } else {
        const response = await fetch("/api/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: input }),
        });

        if (!response.ok) throw new Error("Erro ao buscar música/playlist");

        const data = await response.json();
        if (!data.playlist_url) throw new Error("Nenhuma playlist encontrada");

        onPlaylistChange(data.playlist_url);
      }

      setInput("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto my-6">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Nome da música, artista ou link"
          className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-4 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "Buscando..." : "Buscar"}
        </button>
      </form>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
