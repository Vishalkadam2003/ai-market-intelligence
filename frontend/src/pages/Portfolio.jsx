// src/pages/Portfolio.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { TrendingUp, TrendingDown, DollarSign, PieChart, Activity, ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function Portfolio() {
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalValue, setTotalValue] = useState(0);
  const [totalInvested, setTotalInvested] = useState(0);
  const [totalPnL, setTotalPnL] = useState(0);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/portfolio")
      .then(res => {
        const data = res.data;
        setPortfolio(data);

        // Calculate totals
        const invested = data.reduce((sum, p) => sum + (p.buy_price * p.quantity), 0);
        const current = data.reduce((sum, p) => sum + (p.current_price * p.quantity), 0);
        const pnl = current - invested;

        setTotalInvested(invested);
        setTotalValue(current);
        setTotalPnL(pnl);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const formatINR = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading portfolio...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter',system-ui,sans-serif] antialiased">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-11 h-11 bg-gradient-to-br from-blue-700 to-indigo-800 rounded-xl flex items-center justify-center shadow-md">
              <PieChart className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">My Portfolio</h1>
              <p className="text-sm text-gray-600 font-medium">Real-time performance & allocation</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Total Value</p>
              <p className="text-2xl font-black text-gray-900">{formatINR(totalValue)}</p>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold ${totalPnL >= 0 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
              {totalPnL >= 0 ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
              {formatINR(Math.abs(totalPnL))} ({((totalPnL / totalInvested) * 100).toFixed(2)}%)
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <SummaryCard
            title="Total Invested"
            value={formatINR(totalInvested)}
            icon={<DollarSign className="w-6 h-6" />}
            color="blue"
          />
          <SummaryCard
            title="Current Value"
            value={formatINR(totalValue)}
            icon={<TrendingUp className="w-6 h-6" />}
            color="emerald"
            highlight
          />
          <SummaryCard
            title="Total P&L"
            value={formatINR(totalPnL)}
            change={`${((totalPnL / totalInvested) * 100).toFixed(2)}%`}
            positive={totalPnL >= 0}
            icon={<Activity className="w-6 h-6" />}
            color="purple"
          />
          <SummaryCard
            title="Positions"
            value={portfolio.length}
            subtitle="Active holdings"
            icon={<PieChart className="w-6 h-6" />}
            color="indigo"
          />
        </div>

        {/* Portfolio Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-8 py-5 border-b border-gray-200 bg-gray-50/70">
            <h2 className="text-xl font-bold text-gray-900">Holdings</h2>
          </div>

          {portfolio.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <p className="text-lg font-medium">No positions found</p>
              <p className="text-sm mt-2">Your portfolio will appear here once positions are added</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50/50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <th className="px-8 py-5">Asset</th>
                    <th className="px-8 py-5">Quantity</th>
                    <th className="px-8 py-5 text-right">Avg Buy Price</th>
                    <th className="px-8 py-5 text-right">Invested</th>
                    <th className="px-8 py-5 text-right">Current Price</th>
                    <th className="px-8 py-5 text-right">Market Value</th>
                    <th className="px-8 py-5 text-right">P&L</th>
                    <th className="px-8 py-5 text-right">Return %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {portfolio.map((p) => {
                    const invested = p.buy_price * p.quantity;
                    const marketValue = p.current_price * p.quantity;
                    const pnl = marketValue - invested;
                    const pnlPercent = (pnl / invested) * 100;

                    return (
                      <tr key={p.id} className="hover:bg-gray-50/50 transition">
                        <td className="px-8 py-6">
                          <div>
                            <p className="font-mono font-bold text-lg text-gray-900">{p.symbol}</p>
                            <p className="text-sm text-gray-500">{p.name || "Equity"}</p>
                          </div>
                        </td>
                        <td className="px-8 py-6 font-medium">{p.quantity.toLocaleString()}</td>
                        <td className="px-8 py-6 text-right font-medium">{formatINR(p.buy_price)}</td>
                        <td className="px-8 py-6 text-right font-medium">{formatINR(invested)}</td>
                        <td className="px-8 py-6 text-right font-medium">{formatINR(p.current_price)}</td>
                        <td className="px-8 py-6 text-right font-bold text-gray-900">{formatINR(marketValue)}</td>
                        <td className={`px-8 py-6 text-right font-bold ${pnl >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                          {pnl >= 0 ? "+" : ""}{formatINR(pnl)}
                        </td>
                        <td className={`px-8 py-6 text-right font-bold ${pnl >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                          {pnl >= 0 ? "↑" : "↓"} {Math.abs(pnlPercent).toFixed(2)}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Reusable Summary Card
function SummaryCard({ title, value, change, positive, subtitle, icon, color, highlight }) {
  const colorMap = {
    blue: "text-blue-700 bg-blue-50",
    emerald: "text-emerald-700 bg-emerald-50",
    purple: "text-purple-700 bg-purple-50",
    indigo: "text-indigo-700 bg-indigo-50",
  };

  return (
    <div className={`bg-white rounded-2xl border ${highlight ? "border-emerald-200 shadow-lg" : "border-gray-200"} p-6 transition-shadow hover:shadow-md`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${colorMap[color] || colorMap.blue}`}>
          {icon}
        </div>
        {change && (
          <div className={`flex items-center text-sm font-bold ${positive ? "text-emerald-600" : "text-red-600"}`}>
            {positive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            {change}
          </div>
        )}
      </div>
      <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">{title}</p>
      <p className="mt-2 text-3xl font-black text-gray-900">{value}</p>
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );
}
