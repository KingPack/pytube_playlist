import { useNavigate } from "react-router-dom";

export function detectSearchType(input) {
  if (!input || input.trim() === "") return { type: "empty" };

  try {
    const url = new URL(input);
    if (url.hostname.includes("youtube.com") || url.hostname.includes("youtu.be")) {
      const listId = url.searchParams.get("list");
      const videoId = url.searchParams.get("v") || url.pathname.replace("/", "");
      if (listId) return { type: "playlist", listId };
      if (videoId) return { type: "video", videoId };
    }
    return { type: "search", query: input };
  } catch {
    return { type: "search", query: input };
  }
}

export function useSearchRedirect() {
  const navigate = useNavigate();

  return (query) => {
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
  };
}
