// src/components/SymbolSelector.jsx
import { useEffect, useState, useMemo } from "react";
import { Search, TrendingUp, ChevronDown, Check, Star } from "lucide-react";
import { API } from "../utils/backend";

// Optional: simple logo map (you can add more)
const LOGO_MAP = {
  TCS: "/logos/TCS.png",
  INFY: "/logos/INFY.png",
  RELIANCE: "/logos/RELIANCE.png",
  HDFCBANK: "/logos/HDFCBANK.png",
  ICICIBANK: "/logos/ICICIBANK.png",
  SBIN: "/logos/SBIN.png",
};

export default function SymbolSelector({ setSymbol }) {
  const [symbols, setSymbols] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [activeTab, setActiveTab] = useState("all"); // all | watchlist | recent
  const [watchlist, setWatchlist] = useState([]);
  const [recent, setRecent] = useState([]);

  // Load symbols + local watchlist + recent
  useEffect(() => {
    API.get("/symbols")
      .then((res) => {
        setSymbols(res.data || []);
      })
      .catch((err) => {
        console.error("Error loading symbols:", err);
      })
      .finally(() => setLoading(false));

    const storedWatchlist = JSON.parse(localStorage.getItem("watchlist") || "[]");
    const storedRecent = JSON.parse(localStorage.getItem("recentSymbols") || "[]");
    setWatchlist(storedWatchlist);
    setRecent(storedRecent);
  }, []);

  // Save watchlist/recent whenever they change
  useEffect(() => {
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    localStorage.setItem("recentSymbols", JSON.stringify(recent));
  }, [recent]);

  const isInWatchlist = (ticker) => watchlist.includes(ticker);

  const toggleWatchlist = (ticker) => {
    setWatchlist((prev) =>
      prev.includes(ticker) ? prev.filter((t) => t !== ticker) : [...prev, ticker]
    );
  };

  const handleSelect = (symbol) => {
    setSelected(symbol);
    setSymbol(symbol.ticker);
    setIsOpen(false);
    setQuery("");

    // update recent (keep max 10)
    setRecent((prev) => {
      const updated = [symbol.ticker, ...prev.filter((t) => t !== symbol.ticker)];
      return updated.slice(0, 10);
    });
  };

  // Filter symbols by active tab + query
  const filtered = useMemo(() => {
    let base = symbols;

    if (activeTab === "watchlist") {
      base = symbols.filter((s) => watchlist.includes(s.ticker));
    } else if (activeTab === "recent") {
      base = symbols.filter((s) => recent.includes(s.ticker));
      // sort recent order
      base = base.sort(
        (a, b) => recent.indexOf(a.ticker) - recent.indexOf(b.ticker)
      );
    }

    if (!query.trim()) return base;

    return base.filter(
      (s) =>
        s.ticker.toLowerCase().includes(query.toLowerCase()) ||
        s.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [symbols, watchlist, recent, activeTab, query]);

  return (
    <div className="relative">
      {/* Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-4 bg-white border border-gray-300 rounded-xl text-left font-medium text-gray-900 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent transition"
      >
        <div className="flex items-center gap-4">
          {selected?.ticker && LOGO_MAP[selected.ticker] && (
            <img
              src={LOGO_MAP[selected.ticker]}
              alt={selected.ticker}
              className="w-7 h-7 rounded-full object-contain bg-gray-100"
            />
          )}
          {!selected?.ticker && (
            <TrendingUp className="w-5 h-5 text-blue-600" />
          )}

          <span>
            {selected ? (
              <>
                <span className="font-mono font-bold">{selected.ticker}</span>
                <span className="text-gray-600 ml-2 truncate max-w-[220px] inline-block align-middle">
                  — {selected.name}
                </span>
              </>
            ) : (
              "Select Instrument"
            )}
          </span>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 transition ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div className="absolute top-full mt-2 w-full min-w-96 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-gray-200 text-sm font-medium">
              {["all", "watchlist", "recent"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2.5 capitalize ${
                    activeTab === tab
                      ? "text-blue-700 border-b-2 border-blue-700"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  {tab === "all" && "All"}
                  {tab === "watchlist" && "Watchlist"}
                  {tab === "recent" && "Recently Viewed"}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search ticker or company name..."
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm font-medium placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-700"
                  autoFocus
                />
              </div>
            </div>

            {/* Loading */}
            {loading && (
              <div className="p-8 text-center text-gray-500">
                <p className="text-sm">Loading instruments...</p>
              </div>
            )}

            {/* No results */}
            {!loading && filtered.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                <p className="text-sm font-medium">No results found</p>
              </div>
            )}

            {/* List */}
            {!loading && filtered.length > 0 && (
              <div className="max-h-96 overflow-y-auto">
                {filtered.map((s) => (
                  <div
                    key={s.id}
                    className={`flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition ${
                      selected?.id === s.id ? "bg-blue-50" : ""
                    }`}
                  >
                    <button
                      onClick={() => handleSelect(s)}
                      className="flex items-center gap-3 flex-1 text-left"
                    >
                      {LOGO_MAP[s.ticker] && (
                        <img
                          src={LOGO_MAP[s.ticker]}
                          alt={s.ticker}
                          className="w-7 h-7 rounded-full object-contain bg-gray-100"
                        />
                      )}
                      <div>
                        <p className="font-mono font-bold text-gray-900 text-sm">
                          {s.ticker}
                        </p>
                        <p className="text-xs text-gray-600">{s.name}</p>
                      </div>
                    </button>

                    <button
                      onClick={() => toggleWatchlist(s.ticker)}
                      className="ml-3 p-2 rounded-full hover:bg-gray-100"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          isInWatchlist(s.ticker)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-400"
                        }`}
                      />
                    </button>

                    {selected?.id === s.id && (
                      <Check className="w-4 h-4 text-blue-700 ml-2" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
