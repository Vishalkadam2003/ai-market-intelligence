// src/components/PriceChart.jsx
import { useEffect, useState } from "react";
import { API } from "../utils/backend";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, Activity } from "lucide-react";

export default function PriceChart({ symbol }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!symbol) {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(false);

    // 1. Fetch historical data once
    API.get(`/prices/${symbol}`)
      .then((res) => {
        const raw = res.data?.prices || [];

        const formatted = raw.map((d) => ({
          date: new Date(d.date).toLocaleDateString("en-IN", {
            month: "short",
            day: "numeric",
          }),
          close: d.close || d.price,
          open: d.open || d.close || d.price,
          high: d.high || d.close || d.price,
          low: d.low || d.close || d.price,
          volume: d.volume || 0,
        }));

        setData(formatted);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load historical prices:", err);
        setError(true);
        setLoading(false);
      });

    // 2. Live price polling every 5 seconds
    const interval = setInterval(() => {
      API.get(`/live-price/${symbol}`)
        .then((res) => {
          const live = res.data;
          if (!live?.price) return;

          const ts = live.timestamp ? new Date(live.timestamp) : new Date();
          const label = ts.toLocaleDateString("en-IN", {
            month: "short",
            day: "numeric",
          });

          setData((prev) => {
            if (!prev.length) return prev;

            const last = prev[prev.length - 1];

            // If same day → update the current day's candle (intraday aggregation)
            if (last.date === label) {
              const updatedCandle = {
                ...last,
                close: live.price,
                high: Math.max(last.high, live.price),
                low: Math.min(last.low, live.price),
                // volume: last.volume + (live.volume || 0), // if volume available
              };

              const copy = [...prev];
              copy[copy.length - 1] = updatedCandle;
              return copy;
            }

            // New day → append new point
            const newPoint = {
              date: label,
              open: live.price,
              high: live.price,
              low: live.price,
              close: live.price,
              volume: live.volume || 0,
            };

            return [...prev.slice(-199), newPoint]; // keep max 200 points
          });
        })
        .catch((err) => {
          console.error("Live price fetch failed:", err);
        });
    }, 5000);

    return () => clearInterval(interval);
  }, [symbol]); // Only re-run when symbol changes

  if (!symbol) return null;

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="h-96 bg-gray-100 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (error || !data.length) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">
        <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 font-medium">No price data available</p>
        <p className="text-sm text-gray-500 mt-2">
          Try selecting a different instrument
        </p>
      </div>
    );
  }

  const latest = data[data.length - 1];
  const first = data[0];
  const change = latest.close - first.close;
  const changePercent = ((change / first.close) * 100).toFixed(2);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-8 py-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-gray-900">{symbol}</h2>
            <p className="text-sm text-gray-600 mt-1">Live Price Action • Updates every 5s</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-black text-gray-900">
              ₹{latest.close.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
            </p>
            <div
              className={`flex items-center gap-2 mt-2 text-lg font-bold ${
                change >= 0 ? "text-emerald-600" : "text-red-600"
              }`}
            >
              <TrendingUp className={`w-5 h-5 ${change < 0 ? "rotate-180" : ""}`} />
              {change >= 0 ? "+" : ""}{change.toFixed(2)} ({change >= 0 ? "+" : ""}{changePercent}%)
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="p-6">
        <ResponsiveContainer width="100%" height={420}>
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 4" stroke="#f3f4f6" />
            <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#6b7280" }} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} tickLine={false} domain={["dataMin - 50", "dataMax + 50"]} />
            <Tooltip
              contentStyle={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "13px" }}
              labelStyle={{ fontWeight: "bold", color: "#1f2937" }}
              formatter={(value) => `₹${Number(value).toLocaleString("en-IN")}`}
            />
            <Area
              type="monotone"
              dataKey="close"
              stroke="#2563eb"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorPrice)"
              dot={false}
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Stats */}
      <div className="px-8 py-5 bg-gray-50/70 border-t border-gray-200">
        <div className="grid grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-xs text-gray-600 uppercase tracking-wider">Open</p>
            <p className="font-bold text-gray-900">₹{first.open.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 uppercase tracking-wider">High</p>
            <p className="font-bold text-gray-900">₹{Math.max(...data.map(d => d.high)).toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 uppercase tracking-wider">Low</p>
            <p className="font-bold text-gray-900">₹{Math.min(...data.map(d => d.low)).toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 uppercase tracking-wider">Current</p>
            <p className="font-bold text-gray-900">₹{latest.close.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}