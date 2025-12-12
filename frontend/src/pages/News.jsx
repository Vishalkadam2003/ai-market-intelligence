// src/pages/News.jsx
import { useState } from "react";
import {
  Newspaper,
  Search,
  Clock,
  AlertCircle,
  TrendingUp,
  Globe,
  Filter,
} from "lucide-react";

import SymbolSelector from "../components/SymbolSelector";
import NewsFeed from "../components/NewsFeed";

export default function News() {
  const [symbol, setSymbol] = useState("");

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter',system-ui,sans-serif] antialiased">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-11 h-11 bg-gradient-to-br from-blue-700 to-indigo-800 rounded-xl flex items-center justify-center shadow-md">
              <Newspaper className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">Market News</h1>
              <p className="text-sm text-gray-600 font-medium">Institutional News & Intelligence Feed</p>
            </div>
          </div>
          {symbol && (
            <div className="flex items-center gap-3 text-sm font-medium">
              <span className="text-gray-500">Tracking:</span>
              <span className="font-mono font-bold text-gray-900 text-lg">{symbol}</span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-semibold">LIVE</span>
            </div>
          )}
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        {/* Symbol Selector */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Search className="w-6 h-6 text-gray-600" />
              <h2 className="text-xl font-bold text-gray-900">Select Instrument</h2>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <Filter className="w-4 h-4" />
              <span>Impact: High+</span>
              <span>•</span>
              <span>Sources: 40+ institutional feeds</span>
            </div>
          </div>
          <SymbolSelector setSymbol={setSymbol} />
        </div>

        {/* Empty State */}
        {!symbol && (
          <div className="text-center py-32 bg-white rounded-2xl border border-gray-200">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-8">
              <Globe className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              Select a symbol to view real-time news
            </h3>
            <p className="text-lg text-gray-600 max-w-md mx-auto">
              Access AI-curated headlines, earnings, filings, analyst notes, and market-moving events.
            </p>
          </div>
        )}

        {/* Active News Feed */}
        {symbol && (
          <>
            {/* Feed Header */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="border-b border-gray-200 bg-gray-50/70 px-8 py-5 flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-6 h-6 text-emerald-600" />
                    <h2 className="text-xl font-bold text-gray-900">{symbol}</h2>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>Updated {new Date().toLocaleTimeString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-orange-600" />
                      <span>High-impact events only</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-semibold">
                    127 headlines today
                  </span>
                </div>
              </div>

              {/* News Feed */}
              <div className="bg-white">
                <NewsFeed symbol={symbol} />
              </div>
            </div>

            {/* Optional: Quick Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
                <p className="text-sm font-medium text-gray-600">News Sentiment</p>
                <p className="mt-2 text-2xl font-bold text-emerald-600">+68</p>
                <p className="text-xs text-gray-500 mt-1">Strongly Bullish</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
                <p className="text-sm font-medium text-gray-600">Volume Spike</p>
                <p className="mt-2 text-2xl font-bold text-orange-600">+184%</p>
                <p className="text-xs text-gray-500 mt-1">vs 7d avg</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
                <p className="text-sm font-medium text-gray-600">Analyst Changes</p>
                <p className="mt-2 text-2xl font-bold text-blue-700">12</p>
                <p className="text-xs text-gray-500 mt-1">Today</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
                <p className="text-sm font-medium text-gray-600">Filing Alerts</p>
                <p className="mt-2 text-2xl font-bold text-purple-700">3</p>
                <p className="text-xs text-gray-500 mt-1">8-K, 10-Q, Insider</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}