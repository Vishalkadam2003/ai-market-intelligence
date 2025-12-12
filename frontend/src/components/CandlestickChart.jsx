// src/components/CandlestickChart.jsx
import { useEffect, useState } from "react";
import { API } from "../utils/backend";
import {
  ResponsiveContainer,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Bar,
  Line,
  Cell,
} from "recharts";
import { Activity } from "lucide-react";

export default function CandlestickChart({ symbol }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!symbol) {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    API.get(`/history/${symbol}`)
      .then((res) => {
        const formatted = (res.data || []).map((d) => ({
          date: new Date(d.date).toLocaleDateString("en-IN", {
            month: "short",
            day: "numeric",
          }),
          open: parseFloat(d.open),
          high: parseFloat(d.high),
          low: parseFloat(d.low),
          close: parseFloat(d.close),
        }));
        setData(formatted);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Candlestick error:", err);
        setLoading(false);
      });
  }, [symbol]);

  if (!symbol) return null;

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="h-96 bg-gray-100 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">
        <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 font-medium">No OHLC data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-8 py-6 border-b border-gray-200">
        <h2 className="text-2xl font-black text-gray-900">{symbol}</h2>
        <p className="text-sm text-gray-600 mt-1">Candlestick Chart • Daily</p>
      </div>

      <div className="p-6">
        <ResponsiveContainer width="100%" height={480}>
          <ComposedChart data={data} margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="4 4" stroke="#f3f4f6" />
            
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: "#6b7280" }}
              tickLine={false}
            />
            
            <YAxis
              tick={{ fontSize: 12, fill: "#6b7280" }}
              tickLine={false}
              domain={[(dataMin) => dataMin * 0.98, (dataMax) => dataMax * 1.02]}
            />

            <Tooltip
              contentStyle={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "8px" }}
              labelStyle={{ fontWeight: "bold" }}
              formatter={(value) => `₹${Number(value).toFixed(2)}`}
            />

            {/* Wick: High → Low */}
            <Line
              type="linear"
              dataKey="high"
              stroke="#6b7280"
              strokeWidth={1}
              dot={false}
              isAnimationActive={false}
            />
            <Line
              type="linear"
              dataKey="low"
              stroke="#6b7280"
              strokeWidth={1}
              dot={false}
              isAnimationActive={false}
            />

            {/* Candle Body: Open → Close */}
            <Bar dataKey={(d) => [d.open, d.close]} barSize={16}>
              {data.map((entry, index) => {
                const isGreen = entry.close >= entry.open;
                return (
                  <Cell
                    key={index}
                    fill={isGreen ? "#10b981" : "#ef4444"}
                    stroke={isGreen ? "#059669" : "#dc2626"}
                    strokeWidth={1.5}
                  />
                );
              })}
            </Bar>
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}