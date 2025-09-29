import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import AboutPage from "../pages/AboutPage";
import ContactPage from "../pages/ContactPage";
import PlaylistPage from "../pages/PlaylistPage";
import MusicPage from "../pages/MusicPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/playlist" element={<PlaylistPage />} />
      <Route path="/music" element={<MusicPage />} />
    </Routes>
  );
}
