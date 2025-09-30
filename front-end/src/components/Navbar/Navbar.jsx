import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-900 text-white shadow-md z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold hover:text-blue-400 transition">
          Pytube Downloader
        </Link>

        {/* Links em linha */}
        <div className="flex space-x-8 text-lg font-medium">
          <Link to="/" className="hover:text-blue-400 transition">
            Inicio
          </Link>
          <Link to="/about" className="hover:text-blue-400 transition">
            Sobre
          </Link>
          <Link to="/contact" className="hover:text-blue-400 transition">
            Contato
          </Link>
        </div>
      </div>
    </nav>
  );
}
