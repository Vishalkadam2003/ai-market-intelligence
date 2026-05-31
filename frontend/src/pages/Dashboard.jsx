// frontend/src/pages/Dashboard.jsx
import { useState, useEffect } from "react";
import {
  TrendingUp,
  Activity,
  Brain,
  Zap,
  MessageCircle,
  AlertTriangle,
  ArrowUpRight,
} from "lucide-react";

import SymbolSelector from "../components/SymbolSelector";
import PriceChart from "../components/PriceChart";
import CandlestickChart from "../components/CandlestickChart";
import ForecastChart from "../components/ForecastChart";
import IndicatorsChart from "../components/IndicatorsChart";
import SentimentChart from "../components/SentimentChart";
import TradingSignals from "../components/TradingSignals";

import MarketOverview from "../components/MarketOverview";
import WatchlistPanel from "../components/WatchlistPanel";
import AiStockSearch from "../components/AiStockSearch";
import ThemeToggle from "../components/ThemeToggle"; // You can keep or remove this

export default function Dashboard() {
  const [selectedSymbol, setSelectedSymbol] = useState("");
  const [activeTab, setActiveTab] = useState("price");
  const [refreshTick, setRefreshTick] = useState(0);

  const [kpi, setKpi] = useState({
    price: null,
    change: null,
    volume: null,
    aiConfidence: null,
    sentiment: "Neutral",
  });

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!selectedSymbol) {
      setRefreshTick(0);
      return;
    }
    const id = setInterval(() => setRefreshTick((t) => t + 1), 30000);
    return () => clearInterval(id);
  }, [selectedSymbol]);

  // Load live KPIs
  useEffect(() => {
    if (!selectedSymbol) {
      setKpi({ price: null, change: null, volume: null, aiConfidence: null, sentiment: "Neutral" });
      return;
    }

    async function loadKPI() {
      try {
        const [liveRes, histRes, signalRes, sentRes] = await Promise.all([
          fetch(`https://ai-market-intelligence-backend.onrender.com/api/live-price/${selectedSymbol}`),
          fetch(`https://ai-market-intelligence-backend.onrender.com/api/prices/${selectedSymbol}`),
          fetch(`https://ai-market-intelligence-backend.onrender.com/api/signals/${selectedSymbol}`),
          fetch(`https://ai-market-intelligence-backend.onrender.com/api/sentiment/${selectedSymbol}`),
        ]);

        const live = await liveRes.json();
        const hist = await histRes.json();
        const signal = await signalRes.json();
        const sent = await sentRes.json();

        const prices = hist?.prices || hist || [];
        let prevClose = null;
        let volume = 0;

        if (prices.length >= 2) {
          prevClose = prices[prices.length - 2].close || prices[prices.length - 2].price;
          volume = prices[prices.length - 1].volume || 0;
        }

        const currentPrice = live?.price || prices[prices.length - 1]?.close;
        const changePercent = prevClose ? ((currentPrice - prevClose) / prevClose) * 100 : null;

        const aiConfidence = signal?.final_score ?? null;

        let sentimentDisplay = "Neutral";
        if (sent?.sentiment) {
          sentimentDisplay = sent.sentiment;
        } else if (signal?.signals?.Sentiment) {
          const sig = signal.signals.Sentiment;
          if (sig === "BUY") sentimentDisplay = "Bullish";
          else if (sig === "SELL") sentimentDisplay = "Bearish";
        }

        setKpi({
          price: currentPrice,
          change: changePercent,
          volume,
          aiConfidence,
          sentiment: sentimentDisplay,
        });
      } catch (err) {
        console.error("KPI load failed:", err);
      }
    }

    loadKPI();
  }, [selectedSymbol, refreshTick]);

  const tabs = [
    { id: "price", label: "Price", icon: TrendingUp },
    { id: "candle", label: "Candlestick", icon: Activity },
    { id: "forecast", label: "AI Forecast", icon: Brain },
    { id: "indicators", label: "Indicators", icon: Zap },
    { id: "sentiment", label: "Sentiment", icon: MessageCircle },
    { id: "signals", label: "Signals", icon: AlertTriangle },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter',system-ui,sans-serif] antialiased">
      {/* HEADER — Clean light mode only */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          {/* Left Side */}
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">Dashboard</h1>
              <p className="text-sm text-gray-600 font-medium">Real-time market intelligence</p>
            </div>

            {selectedSymbol && (
              <div className="flex items-center gap-3 text-sm font-medium text-gray-600">
                <span className="text-gray-400">•</span>
                <span className="font-mono font-bold text-gray-900">{selectedSymbol}</span>
                <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-semibold">LIVE</span>
                <span className="text-xs text-gray-500">(Updates every 30s)</span>
              </div>
            )}
          </div>

          {/* Right Side — Keep toggle if you want, or remove it */}
          <div className="flex items-center">
            <ThemeToggle /> {/* Optional: remove this line if you don't want any toggle */}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Select Instrument</h2>
            <SymbolSelector setSymbol={setSelectedSymbol} />
          </div>
          <MarketOverview onSelect={(s) => setSelectedSymbol(s)} />
        </div>

        {!selectedSymbol && (
          <div className="text-center py-32 bg-white rounded-2xl border border-gray-200">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
              <Activity className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-lg text-gray-600 font-medium">Select a symbol to begin</p>
          </div>
        )}

        {selectedSymbol && (
          <div className="grid grid-cols-1 2xl:grid-cols-4 gap-8">
            <div className="2xl:col-span-3 space-y-10">
              {/* KPI Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <KPICard
                  title="Current Price"
                  value={kpi.price ? `₹${Number(kpi.price).toLocaleString("en-IN", { maximumFractionDigits: 2 })}` : "⋯"}
                  change={kpi.change !== null ? `${kpi.change >= 0 ? "+" : ""}${kpi.change.toFixed(2)}%` : null}
                  positive={kpi.change >= 0}
                />
                <KPICard title="Daily Volume" value={kpi.volume ? Number(kpi.volume).toLocaleString("en-IN") : "⋯"} />
                <KPICard
                  title="AI Confidence"
                  value={kpi.aiConfidence !== null ? `${Math.round(kpi.aiConfidence * 100)}%` : "⋯"}
                  positive={kpi.aiConfidence >= 0.6}
                />
                <KPICard
                  title="Sentiment Score"
                  value={kpi.sentiment}
                  positive={kpi.sentiment === "Bullish" || kpi.sentiment === "Very Bullish"}
                />
              </div>

              {/* Tabs & Charts */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="flex items-center border-b border-gray-200 bg-gray-50/50">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-3 px-6 py-4 font-medium text-sm transition-all ${
                          isActive
                            ? "text-blue-700 border-b-2 border-blue-700 bg-white"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                <div className="p-6 bg-gray-50/30 min-h-96">
                  <div className="bg-white rounded-xl border border-gray-200 min-h-96 p-6 shadow-inner">
                    {activeTab === "price" && <PriceChart symbol={selectedSymbol} />}
                    {activeTab === "candle" && <CandlestickChart symbol={selectedSymbol} />}
                    {activeTab === "forecast" && <ForecastChart symbol={selectedSymbol} refreshTick={refreshTick} />}
                    {activeTab === "indicators" && <IndicatorsChart symbol={selectedSymbol} refreshTick={refreshTick} />}
                    {activeTab === "sentiment" && <SentimentChart symbol={selectedSymbol} />}
                    {activeTab === "signals" && <TradingSignals symbol={selectedSymbol} refreshTick={refreshTick} />}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <WatchlistPanel onSelect={(s) => setSelectedSymbol(s)} />
              <AiStockSearch />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Clean light-mode KPI Card
function KPICard({ title, value, change, positive }) {
  const isLoading = value === "⋯";

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">{title}</p>
      <div className="mt-3 flex items-end justify-between">
        <p className={`text-2xl font-bold ${isLoading ? "text-gray-400" : "text-gray-900"}`}>
          {value}
        </p>
        {change && !isLoading && (
          <div className={`flex items-center text-sm font-semibold ${positive ? "text-green-600" : "text-red-600"}`}>
            <ArrowUpRight className={`w-4 h-4 ${!positive && "rotate-180"}`} />
            {change}
          </div>
        )}
      </div>
    </div>
  );
}
