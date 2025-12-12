// src/components/TradingSignals.jsx
import { useEffect, useState } from "react";
import { API } from "../utils/backend";
import { TrendingUp, TrendingDown, Activity, Zap } from "lucide-react";

export default function TradingSignals({ symbol }) {
  const [signals, setSignals] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!symbol) {
      setSignals(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    API.get(`/signals/${symbol}`)
      .then((res) => {
        setSignals(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Signals error:", err);
        setLoading(false);
      });
  }, [symbol]);

  if (!symbol) return null;

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-96 mb-8"></div>
          <div className="grid grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-100 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!signals) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">
        <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-lg font-medium text-gray-700">No AI signals available</p>
      </div>
    );
  }

  const { signals: signalMap, final_decision, final_score, average_sentiment } = signals;

  const signalConfig = {
    BUY: { color: "emerald", label: "Strong Buy", icon: TrendingUp },
    SELL: { color: "red", label: "Strong Sell", icon: TrendingDown },
    HOLD: { color: "amber", label: "Hold", icon: Activity },
  };

  const config = signalConfig[final_decision] || signalConfig.HOLD;
  const Icon = config.icon;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600 rounded-xl">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900">{symbol}</h2>
              <p className="text-sm text-gray-600 font-medium">AI-Powered Trading Intelligence</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Model Confidence</p>
            <p className="text-3xl font-black text-blue-700">
              {(final_score * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      {/* Signal Grid */}
      <div className="p-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {Object.entries(signalMap).map(([key, value]) => {
            const isActive = value === final_decision;
            const bg = value === "BUY" ? "bg-emerald-50 border-emerald-200" :
                     value === "SELL" ? "bg-red-50 border-red-200" :
                     "bg-gray-50 border-gray-200";
            const text = value === "BUY" ? "text-emerald-700" :
                        value === "SELL" ? "text-red-700" : "text-gray-700";

            return (
              <div
                key={key}
                className={`p-6 rounded-2xl border-2 ${bg} ${isActive ? "ring-4 ring-blue-200" : ""} transition-all`}
              >
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider">{key}</p>
                <p className={`mt-3 text-2xl font-black ${text}`}>
                  {value}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Final Decision */}
      <div className={`px-8 py-10 border-t border-gray-200 bg-gradient-to-r 
        ${final_decision === "BUY" ? "from-emerald-50 to-green-50" : 
          final_decision === "SELL" ? "from-red-50 to-rose-50" : 
          "from-amber-50 to-yellow-50"}`}
      >
        <div className="text-center">
          <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-2">
            Final AI Recommendation
          </p>
          <div className="flex items-center justify-center gap-4">
            <Icon className={`w-10 h-10 ${final_decision === "BUY" ? "text-emerald-600" : 
              final_decision === "SELL" ? "text-red-600" : "text-amber-600"}`} />
            <span className={`text-4xl font-black ${
              final_decision === "BUY" ? "text-emerald-700" : 
              final_decision === "SELL" ? "text-red-700" : "text-amber-700"
            }`}>
              {config.label}
            </span>
          </div>

          {/* Confidence Bar */}
          <div className="mt-6 max-w-2xl mx-auto">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>0%</span>
              <span>100%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden shadow-inner">
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-out ${
                  final_decision === "BUY" ? "bg-gradient-to-r from-emerald-500 to-emerald-600" :
                  final_decision === "SELL" ? "bg-gradient-to-r from-red-500 to-red-600" :
                  "bg-gradient-to-r from-amber-500 to-yellow-600"
                }`}
                style={{ width: `${final_score * 100}%` }}
              />
            </div>
            <p className="mt-3 text-sm text-gray-600">
              Average Sentiment: <span className="font-bold text-blue-700">
                {(average_sentiment * 100).toFixed(1)}%
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-8 py-4 bg-gray-50 border-t border-gray-200 text-center">
        <p className="text-xs text-gray-500">
          Powered by Multi-Factor AI Engine • Technical + Sentiment + Forecast Fusion
        </p>
      </div>
    </div>
  );
}