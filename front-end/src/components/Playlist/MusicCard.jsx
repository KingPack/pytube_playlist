export default function MusicCard({ nome, link, index, thumbnails, duration, viewCount }) {
  const [selected, setSelected] = useState(false);

  return (
    <button
      id={link}
      onClick={() => setSelected(!selected)}
      className={`relative bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition w-full text-left ${
        selected ? "ring-4 ring-blue-500" : ""
      }`}
    >
      <span className="absolute top-2 left-2 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded">
        {index}
      </span>

      {selected && (
        <CheckCircleIcon
          className="absolute top-2 right-2 w-6 h-6 text-blue-500 drop-shadow-lg"
        />
      )}

      <div className="w-full h-48 overflow-hidden rounded-t-lg">
        <img
          src={thumbnails?.[0]?.url || ""}
          alt={nome}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-4">
        <h2 className="text-lg font-semibold text-center">{nome}</h2>
      </div>
    </button>
  );
}
