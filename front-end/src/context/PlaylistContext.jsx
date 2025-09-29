import { createContext, useState } from "react";

export const PlaylistContext = createContext();

export function PlaylistProvider({ children }) {
  const [playlist, setPlaylist] = useState(null);

  return (
    <PlaylistContext.Provider value={{ playlist, setPlaylist }}>
      {children}
    </PlaylistContext.Provider>
  );
}
