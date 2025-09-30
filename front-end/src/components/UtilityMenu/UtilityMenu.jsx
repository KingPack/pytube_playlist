import { CheckCircleIcon, Squares2X2Icon, Bars3Icon, ArrowDownTrayIcon, XCircleIcon } from "@heroicons/react/24/solid";

export default function UtilityMenu({
  selectedCount = 0,
  onSelectAll,
  onDeselectAll,
  onDownload,
  onToggleView,
  viewMode = "grid",
}) {
  return (
    <div className="flex flex-wrap items-center justify-between bg-gray-800 text-white p-3 rounded-lg mb-4 shadow-md gap-2">
      <div className="flex items-center gap-2">
        <button
          onClick={onSelectAll}
          className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
        >
          <CheckCircleIcon className="w-5 h-5" />
          Selecionar tudo
        </button>
        <button
          onClick={onDeselectAll}
          className="flex items-center gap-1 px-3 py-1 bg-gray-600 hover:bg-gray-700 rounded text-sm"
        >
          <XCircleIcon className="w-5 h-5" />
          Desmarcar tudo
        </button>
        <span className="text-sm text-gray-300">{selectedCount} selecionados</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onDownload}
          className="flex items-center gap-1 px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm"
        >
          <ArrowDownTrayIcon className="w-5 h-5" />
          Download
        </button>
        <button
          onClick={onToggleView}
          className="flex items-center gap-1 px-3 py-1 bg-gray-600 hover:bg-gray-700 rounded text-sm"
        >
          {viewMode === "grid" ? (
            <>
              <Bars3Icon className="w-5 h-5" />
              Listagem
            </>
          ) : (
            <>
              <Squares2X2Icon className="w-5 h-5" />
              Grade
            </>
          )}
        </button>
      </div>
    </div>
  );
}
