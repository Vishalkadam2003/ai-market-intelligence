import { useEffect, useState } from "react";
import { API } from "../utils/backend";
import { ArrowUpRight, ArrowDownRight, Activity } from "lucide-react";

export default function MarketOverview({ onSelect }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    API.get("/market/movers")
      .then((res) => setData(res.data))
      .catch((e) => console.error("Error loading movers", e));
  }, []);

  if (!data) {
    return (
      <div className="bg-white rounded-xl shadow p-4 text-sm text-gray-500">
        Loading market overview...
      </div>
    );
  }

  const { gainers = [], losers = [], active = [] } = data;

  return (
    <div className="bg-white rounded-xl shadow p-4 text-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-800">Market Overview</h3>
        <span className="text-xs text-gray-500">Top movers</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Gainers */}
        <Section
          title="Top Gainers"
          icon={<ArrowUpRight className="w-4 h-4 text-green-500" />}
          items={gainers}
          color="text-green-600"
          onSelect={onSelect}
          valueKey="change"
          suffix="%"
        />

        {/* Losers */}
        <Section
          title="Top Losers"
          icon={<ArrowDownRight className="w-4 h-4 text-red-500" />}
          items={losers}
          color="text-red-600"
          onSelect={onSelect}
          valueKey="change"
          suffix="%"
        />

        {/* Most Active */}
        <Section
          title="Most Active"
          icon={<Activity className="w-4 h-4 text-blue-500" />}
          items={active}
          color="text-blue-600"
          onSelect={onSelect}
          valueKey="volume"
          suffix="M"
        />
      </div>
    </div>
  );
}

function Section({ title, icon, items, color, onSelect, valueKey, suffix }) {
  return (
    <div>
      <div className="flex items-center gap-1 mb-2 text-xs font-semibold text-gray-700">
        {icon}
        <span>{title}</span>
      </div>
      <div className="space-y-1">
        {items.map((item) => (
          <button
            key={item.ticker}
            onClick={() => onSelect?.(item.ticker)}
            className="w-full flex justify-between items-center text-xs px-2 py-1.5 rounded hover:bg-gray-50"
          >
            <span className="font-mono font-semibold">{item.ticker}</span>
            <span className={color}>
              {item[valueKey]}
              {suffix}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
