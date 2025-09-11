import React, { useEffect, useState } from "react";

const Playlist = ({ playlistUrl }) => {
  const [musicas, setMusicas] = useState([]);
  const [playlistNome, setPlaylistNome] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPagina = async (pagina = 1) => {
    if (!playlistUrl) return;

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        url: playlistUrl,
        page: pagina,
        page_size: 50,
      });

      const response = await fetch(`/api/playlist?${params.toString()}`, {
        headers: { accept: "application/json" },
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar playlist (status ${response.status})`);
      }

      const data = await response.json();

      setPlaylistNome(data.playlist);
      setMusicas(data.musicas);
      setPaginaAtual(data.pagina_atual);
      setTotalPaginas(data.total_paginas);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // busca a página atual sempre que mudar
  useEffect(() => {
    fetchPagina(paginaAtual);
  }, [playlistUrl, paginaAtual]);

  const handlePrev = () => {
    if (paginaAtual > 1) setPaginaAtual(paginaAtual - 1);
  };

  const handleNext = () => {
    if (paginaAtual < totalPaginas) setPaginaAtual(paginaAtual + 1);
  };

  return (
    <div style={{ fontFamily: "Arial", padding: "20px" }}>
      <h2>{playlistNome || "Minha Playlist"}</h2>

      {loading && <p>Carregando músicas...</p>}
      {error && <p style={{ color: "red" }}>Erro: {error}</p>}

      {!loading && !error && (
        <>
          <ul>
            {musicas.map((musica, index) => (
              <li key={index}>
                <a
                  href={musica.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none", color: "blue" }}
                >
                  {musica.nome}
                </a>
              </li>
            ))}
          </ul>

          <div style={{ marginTop: "10px" }}>
            <button onClick={handlePrev} disabled={paginaAtual === 1}>
              Anterior
            </button>
            <span style={{ margin: "0 10px" }}>
              Página {paginaAtual} de {totalPaginas}
            </span>
            <button onClick={handleNext} disabled={paginaAtual === totalPaginas}>
              Próxima
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Playlist;
