import api from "./api";

/**
 * Busca uma playlist pelo link do YouTube
 * @param {string} playlistUrl - URL da playlist
 * @param {number} page - Página atual
 * @param {number} pageSize - Quantidade de itens por página
 * @param {boolean} isPagination - Ativa/desativa paginação
 * @returns {Promise<Object>} - Dados da playlist atualizados
 */

export const fetchPlaylist = async (
  playlistUrl,
  page = 1,
  pageSize = 50,
  isPagination = false
) => {
  try {
    const params = new URLSearchParams({
      url: playlistUrl,
      page: page.toString(),
      page_size: pageSize.toString(),
      is_pagination: isPagination ? "true" : "false",
    });

    const response = await api.get(`/playlist/?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar playlist:", error);
    throw error;
  }
};
