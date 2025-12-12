// src/components/ForecastChart.jsx
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
  ReferenceDot,
} from "recharts";
import { TrendingUp, Brain, AlertCircle } from "lucide-react";

export default function ForecastChart({ symbol }) {
  const [forecast, setForecast] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!symbol) {
      setForecast([]);
      setCurrentPrice(null);
      setError("");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    API.get(`/forecast/${symbol}?days=7`)
      .then((res) => {
        if (res.data.error) {
          setError(res.data.error);
        } else {
          setCurrentPrice(res.data.current_price);
          setForecast(res.data.forecast || []);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Forecast error:", err);
        setError("Unable to generate forecast");
        setLoading(false);
      });
  }, [symbol]);

  if (!symbol) return null;

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-80 mb-6"></div>
          <div className="h-96 bg-gray-100 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl border border-orange-200 shadow-sm p-8 text-center">
        <AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
        <p className="text-lg font-medium text-gray-700">Forecast Unavailable</p>
        <p className="text-sm text-gray-500 mt-2">{error}</p>
      </div>
    );
  }

  if (!forecast.length) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">
        <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 font-medium">No forecast data</p>
        <p className="text-sm text-gray-500 mt-2">AI model may need more data</p>
      </div>
    );
  }

  const lastPoint = forecast[forecast.length - 1];
  const predictedChange = lastPoint?.close - currentPrice;
  const predictedChangePct = ((predictedChange / currentPrice) * 100).toFixed(2);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-8 py-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <Brain className="w-7 h-7 text-indigo-600" />
              <h2 className="text-2xl font-black text-gray-900">{symbol}</h2>
            </div>
            <p className="text-sm text-gray-600 mt-1">AI-Powered 7-Day Price Forecast</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-black text-gray-900">
              ₹{lastPoint?.close.toFixed(2)}
            </p>
            <div className={`flex items-center gap-2 mt-2 text-lg font-bold ${predictedChange >= 0 ? "text-emerald-600" : "text-red-600"}`}>
              <TrendingUp className={`w-5 h-5 ${predictedChange < 0 && "rotate-180"}`} />
              {predictedChange >= 0 ? "+" : ""}{predictedChangePct}%
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="p-6">
        <ResponsiveContainer width="100%" height={480}>
          <AreaChart data={forecast} margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
            <defs>
              <linearGradient id="forecastFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="confidenceFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="4 4" stroke="#f3f4f6" />
            
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: "#6b7280" }}
              tickLine={false}
            />
            
            <YAxis
              tick={{ fontSize: 12, fill: "#6b7280" }}
              tickLine={false}
              domain={["dataMin - 100", "dataMax + 100"]}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "13px",
              }}
              labelStyle={{ fontWeight: "bold", color: "#1f2937" }}
              formatter={(value) => `₹${Number(value).toFixed(2)}`}
            />

            {/* Confidence Band */}
            {forecast[0]?.upper && forecast[0]?.lower && (
              <>
                <Area
                  type="monotone"
                  dataKey="upper"
                  stroke="none"
                  fill="url(#confidenceFill)"
                />
                <Area
                  type="monotone"
                  dataKey="lower"
                  stroke="none"
                  fill="url(#confidenceFill)"
                />
              </>
            )}

            {/* Forecast Line */}
            <Area
              type="monotone"
              dataKey="close"
              stroke="#8b5cf6"
              strokeWidth={3}
              fill="url(#forecastFill)"
              dot={{ fill: "#8b5cf6", r: 5 }}
              activeDot={{ r: 7 }}
            />

            {/* Current Price Line */}
            {currentPrice && (
              <ReferenceLine
                y={currentPrice}
                stroke="#ef4444"
                strokeDasharray="6 6"
                strokeWidth={2}
                label={{
                  value: `Current ₹${currentPrice.toFixed(2)}`,
                  position: "insideTopLeft",
                  fill: "#ef4444",
                  fontSize: 12,
                  fontWeight: "bold",
                }}
              />
            )}

            {/* Current Price Dot */}
            {currentPrice && (
              <ReferenceDot
                x={forecast[0]?.date}
                y={currentPrice}
                r={8}
                fill="#ef4444"
                stroke="#fff"
                strokeWidth={3}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footer */}
      <div className="px-8 py-5 bg-gradient-to-r from-indigo-50 to-purple-50 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-indigo-500 rounded"></div>
              <span className="text-gray-700 font-medium">AI Forecast</span>
            </div>
            {forecast[0]?.upper && (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-indigo-300 rounded opacity-50"></div>
                <span className="text-gray-600">95% Confidence</span>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500">
            Powered by proprietary LSTM + Transformer model
          </p>
        </div>
      </div>
    </div>
  );
}