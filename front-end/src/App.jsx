import React from "react";
import Playlist from "./components/Playlist";
import Navbar from "./components/Navbar/Navbar"

function App() {
  const playlistUrl =
    "https://youtube.com/playlist?list=PLgOTmTz9Gp0hAdnZ4B1QmQfhRgTq_62jF";

  return (
    <div style={{ fontFamily: "Arial" }}>
      <Navbar />
      <div style={{ padding: "20px" }}>
        <h1>Minha Playlist</h1>
        <Playlist playlistUrl={playlistUrl} />
      </div>
    </div>
  );
}

export default App;
