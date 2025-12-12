// src/components/IndicatorsChart.jsx
import { useEffect, useState } from "react";
import { API } from "../utils/backend";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Activity, TrendingUp, TrendingDown } from "lucide-react";

export default function IndicatorsChart({ symbol }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!symbol) {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    API.get(`/indicators/${symbol}`)
      .then((res) => {
        setData(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Indicators error:", err);
        setLoading(false);
      });
  }, [symbol]);

  if (!symbol) return null;

  if (loading) {
    return (
      <div className="space-y-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
              <div className="h-64 bg-gray-100 rounded-xl"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">
        <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 font-medium">No indicator data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">

      {/* Price + Moving Averages */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-200">
          <h2 className="text-2xl font-black text-gray-900">{symbol}</h2>
          <p className="text-sm text-gray-600 mt-1">Price & Moving Averages</p>
        </div>
        <div className="p-6">
          <ResponsiveContainer width="100%" height={420}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="priceFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke="#f3f4f6" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "8px" }}
                formatter={(v) => `₹${Number(v).toFixed(2)}`}
              />
              <Area type="monotone" dataKey="close" stroke="#2563eb" strokeWidth={2.5} fill="url(#priceFill)" />
              <Line type="monotone" dataKey="SMA20" stroke="#10b981" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="SMA50" stroke="#f97316" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="EMA12" stroke="#ec4899" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="EMA26" stroke="#8b5cf6" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="px-8 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2"><div className="w-4 h-4 bg-blue-600 rounded"></div><span className="font-medium">Close</span></div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 bg-emerald-500 rounded"></div><span>SMA 20</span></div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 bg-orange-500 rounded"></div><span>SMA 50</span></div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 bg-pink-500 rounded"></div><span>EMA 12</span></div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 bg-purple-500 rounded"></div><span>EMA 26</span></div>
          </div>
        </div>
      </div>

      {/* RSI */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">RSI (14)</h2>
          <p className="text-sm text-gray-600">Relative Strength Index</p>
        </div>
        <div className="p-6">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="4 4" stroke="#f3f4f6" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} tickLine={false} />
              <Tooltip formatter={(v) => v.toFixed(2)} />
              <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="6 6" label={{ value: "Overbought", position: "insideTopRight", fill: "#ef4444" }} />
              <ReferenceLine y={30} stroke="#10b981" strokeDasharray="6 6" label={{ value: "Oversold", position: "insideBottomRight", fill: "#10b981" }} />
              <Line type="monotone" dataKey="RSI14" stroke="#fb7185" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* MACD */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">MACD</h2>
          <p className="text-sm text-gray-600">Moving Average Convergence Divergence</p>
        </div>
        <div className="p-6">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="4 4" stroke="#f3f4f6" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} tickLine={false} />
              <Tooltip formatter={(v) => v.toFixed(4)} />
              <Line type="monotone" dataKey="MACD" stroke="#0ea5e9" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="Signal" stroke="#f59e0b" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="Histogram" stroke="#8b5cf6" strokeWidth={8} dot={false} opacity={0.6} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="px-8 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2"><div className="w-4 h-4 bg-sky-500 rounded"></div><span>MACD Line</span></div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 bg-amber-500 rounded"></div><span>Signal Line</span></div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 bg-purple-500 rounded"></div><span>Histogram</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}