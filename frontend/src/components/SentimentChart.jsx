// src/components/SentimentChart.jsx
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
  ReferenceLine,
  ReferenceArea,
} from "recharts";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";

export default function SentimentChart({ symbol }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!symbol) {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    API.get(`/sentiment/${symbol}`)
      .then((res) => {
        if (!res.data || res.data.length === 0) {
          setError("No sentiment data available");
          setData([]);
        } else {
          const formatted = res.data.map((item) => ({
            date: new Date(item.published_at).toLocaleDateString("en-IN", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
            }),
            score: parseFloat(item.sentiment_score.toFixed(3)),
            title: item.title || "News",
          }));
          setData(formatted.reverse());
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Sentiment error:", err);
        setError("Failed to load sentiment");
        setLoading(false);
      });
  }, [symbol]);

  if (!symbol) return null;

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-72 mb-6"></div>
          <div className="h-80 bg-gray-100 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (error || !data.length) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">
        <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-lg font-medium text-gray-700">No Sentiment Data</p>
        <p className="text-sm text-gray-500 mt-2">
          {error || "News sentiment not available for this instrument"}
        </p>
      </div>
    );
  }

  const latestScore = data[data.length - 1]?.score;
  const sentimentLabel = latestScore > 0.1 ? "Bullish" : latestScore < -0.1 ? "Bearish" : "Neutral";

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-8 py-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${latestScore > 0 ? "bg-emerald-100" : latestScore < 0 ? "bg-red-100" : "bg-gray-100"}`}>
              {latestScore > 0 ? <TrendingUp className="w-6 h-6 text-emerald-600" /> : latestScore < 0 ? <TrendingDown className="w-6 h-6 text-red-600" /> : <Activity className="w-6 h-6 text-gray-600" />}
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900">{symbol}</h2>
              <p className="text-sm text-gray-600 mt-1">News & Social Sentiment Trend</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-black text-gray-900">
              {(latestScore * 100).toFixed(1)}%
            </p>
            <p className={`text-lg font-bold ${latestScore > 0 ? "text-emerald-600" : latestScore < 0 ? "text-red-600" : "text-gray-600"}`}>
              {sentimentLabel}
            </p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="p-6">
        <ResponsiveContainer width="100%" height={420}>
          <AreaChart data={data} margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
            <defs>
              <linearGradient id="bullishFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="bearishFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="4 4" stroke="#f3f4f6" />
            
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: "#6b7280" }}
              tickLine={false}
            />
            
            <YAxis
              domain={[-1, 1]}
              ticks={[-1, -0.5, 0, 0.5, 1]}
              tick={{ fontSize: 12, fill: "#6b7280" }}
              tickLine={false}
              tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "13px",
              }}
              labelStyle={{ fontWeight: "bold", color: "#1f2937" }}
              formatter={(value) => `${(value * 100).toFixed(2)}%`}
              labelFormatter={(label) => `Date: ${label}`}
            />

            {/* Sentiment Zones */}
            <ReferenceArea y1={0.1} y2={1} fill="#10b981" fillOpacity={0.08} />
            <ReferenceArea y1={-1} y2={-0.1} fill="#ef4444" fillOpacity={0.08} />
            <ReferenceLine y={0} stroke="#6b7280" strokeDasharray="6 6" />
            <ReferenceLine y={0.1} stroke="#10b981" strokeDasharray="4 4" strokeWidth={1.5} />
            <ReferenceLine y={-0.1} stroke="#ef4444" strokeDasharray="4 4" strokeWidth={1.5} />

            {/* Sentiment Line + Area */}
            <Area
              type="monotone"
              dataKey="score"
              stroke="#0ea5e9"
              strokeWidth={3}
              fill={latestScore >= 0 ? "url(#bullishFill)" : "url(#bearishFill)"}
              dot={{ fill: "#0ea5e9", r: 5 }}
              activeDot={{ r: 7 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend — FIXED LINE HERE */}
      <div className="px-8 py-5 bg-gradient-to-r from-cyan-50 to-blue-50 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-emerald-500 rounded" />
              <span className="font-medium text-gray-700">Bullish Zone (&gt; +10%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded" />
              <span className="font-medium text-gray-700">Bearish Zone (&lt; -10%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-cyan-500 rounded" />
              <span className="font-medium text-gray-700">Current Sentiment</span>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            Powered by NLP + Real-time News Analysis
          </p>
        </div>
      </div>
    </div>
  );
}