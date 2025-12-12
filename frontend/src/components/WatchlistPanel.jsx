import { useEffect, useState } from "react";
import { API } from "../utils/backend";
import { Star } from "lucide-react";

export default function WatchlistPanel({ onSelect }) {
  const [symbols, setSymbols] = useState([]);
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    const wl = JSON.parse(localStorage.getItem("watchlist") || "[]");
    setWatchlist(wl);

    API.get("/symbols")
      .then((res) => setSymbols(res.data || []))
      .catch((err) => console.error("Error loading symbols:", err));
  }, []);

  const items = symbols.filter((s) => watchlist.includes(s.ticker));

  if (items.length === 0)
    return (
      <div className="bg-white rounded-xl shadow p-4 text-sm text-gray-500">
        <div className="flex items-center gap-2 mb-2">
          <Star className="w-4 h-4 text-yellow-400" />
          <h3 className="font-semibold text-gray-800">Watchlist</h3>
        </div>
        <p>No symbols in watchlist. Use ⭐ in the selector to add.</p>
      </div>
    );

  return (
    <div className="bg-white rounded-xl shadow p-4 text-sm">
      <div className="flex items-center gap-2 mb-3">
        <Star className="w-4 h-4 text-yellow-400" />
        <h3 className="font-semibold text-gray-800">Watchlist</h3>
      </div>

      <div className="space-y-2">
        {items.map((s) => (
          <button
            key={s.id}
            onClick={() => onSelect?.(s.ticker)}
            className="w-full flex justify-between items-center px-2 py-1.5 rounded hover:bg-gray-50 text-left"
          >
            <span className="font-mono text-xs font-semibold">{s.ticker}</span>
            <span className="text-xs text-gray-500 truncate max-w-[140px]">
              {s.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
