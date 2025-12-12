// frontend/src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import {
  BarChart3,
  Newspaper,
  Wallet,
  Brain,
  User,
  ArrowRight,
  ShieldCheck,
  LineChart,
  BarChart,
  MessageSquare,
  TrendingUp,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 font-['Inter',system-ui,sans-serif] antialiased">

      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">

          {/* Left Logo */}
          <div className="flex items-center space-x-4">
            <div className="w-11 h-11 bg-gradient-to-br from-blue-700 to-indigo-800 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-black text-2xl tracking-tighter">A</span>
            </div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">
              AI-FinanceMI
            </h1>
          </div>

          {/* Navigation + Auth Buttons */}
          <div className="flex items-center space-x-10">
            <nav className="hidden md:flex items-center space-x-10">
              <Link to="/dashboard" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition">Dashboard</Link>
              <Link to="/news" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition">News</Link>
              <Link to="/portfolio" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition">Portfolio</Link>
              <Link to="/assistant" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition">AI Assistant</Link>
              <Link to="/profile" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition">Profile</Link>
            </nav>

            {/* LOGIN + SIGNUP */}
            <div className="hidden md:flex items-center space-x-5">
              <Link
                to="/login"
                className="px-5 py-2 text-sm font-semibold text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-100 transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-5 py-2 text-sm font-semibold text-white bg-blue-700 rounded-xl hover:bg-blue-800 transition"
              >
                Signup
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-28">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold tracking-wider mb-8">
            <ShieldCheck className="w-4 h-4" />
            INSTITUTIONAL GRADE • SOC 2 COMPLIANT
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 leading-tight max-w-5xl mx-auto">
            AI-Powered Finance Market
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-800">
              Intelligence Platform
            </span>
          </h1>

          <p className="mt-8 text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Real-time predictive signals, sentiment analysis, risk modeling, and institutional-grade data —
            built for professional traders and serious capital.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row gap-5 justify-center">
            <Link
              to="/dashboard"
              className="group px-10 py-5 bg-gray-900 hover:bg-black text-white font-semibold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3"
            >
              Access Terminal <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
            </Link>
            <Link
              to="/assistant"
              className="px-10 py-5 border-2 border-gray-300 hover:border-gray-400 text-gray-800 font-semibold text-lg rounded-2xl transition-all flex items-center justify-center gap-3"
            >
              <Brain className="w-5 h-5" /> Open AI Analyst
            </Link>
          </div>
        </div>
      </section>

            {/* 🌟 NEW — Interactive Visual Demo Carousel */}
      <section className="py-24 bg-gradient-to-bl from-white to-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-black text-center text-gray-900 mb-10">
            Explore the Platform in Action
          </h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-10">
            Swipe or scroll horizontally to preview live trading charts, AI sentiment, assistants, and smart trade ideas.
          </p>

          {/* Horizontal scroll + snap */}
          <div className="relative">
            {/* Gradient edges */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-gray-50 to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-gray-50 to-transparent z-10" />

            <motion.div
              className="flex gap-8 overflow-x-auto snap-x snap-mandatory pb-4 px-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.2 }}
            >
              {/* Slide 1 – Trading Charts */}
              <motion.div
                className="min-w-[90%] md:min-w-[70%] lg:min-w-[55%] snap-center bg-white border border-gray-200 rounded-3xl shadow-xl p-8 flex flex-col lg:flex-row gap-8 items-center"
                whileHover={{ scale: 1.02, y: -6 }}
                transition={{ type: "spring", stiffness: 220, damping: 20 }}
              >
                <div className="flex-1 space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
                    <LineChart className="w-4 h-4" />
                    Live Trading Charts
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Institutional‑grade real‑time charting
                  </h3>
                  <p className="text-gray-600">
                    Watch live candles, depth, and volatility visualizations with AI overlays that highlight potential breakout and reversal zones.
                  </p>
                </div>

                {/* Fake chart visual */}
                <motion.div
                  className="flex-1 w-full h-72 bg-gradient-to-br from-gray-900 via-slate-900 to-slate-800 rounded-2xl p-4 flex flex-col justify-between"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  {/* Top bar */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-xs text-gray-300">
                      <span className="h-2 w-2 rounded-full bg-red-500" />
                      <span className="h-2 w-2 rounded-full bg-yellow-400" />
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      <span className="ml-3">BTC‑USD · 1m</span>
                    </div>
                    <span className="text-emerald-400 text-xs font-semibold">
                      +2.41% · AI: Bullish
                    </span>
                  </div>

                  {/* Candle chart mock */}
                  <div className="relative flex-1 flex items-center gap-1">
                    {Array.from({ length: 30 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className={`w-2 rounded-full ${
                          i % 5 === 0
                            ? "bg-emerald-500/80"
                            : i % 3 === 0
                            ? "bg-red-500/80"
                            : "bg-slate-500/70"
                        }`}
                        style={{
                          height: `${30 + Math.sin(i / 2) * 20 + (i % 7) * 4}px`,
                        }}
                        initial={{ scaleY: 0.2, opacity: 0 }}
                        animate={{ scaleY: 1, opacity: 1 }}
                        transition={{ delay: i * 0.03, duration: 0.4 }}
                      />
                    ))}
                    {/* AI zone highlight */}
                    <motion.div
                      className="absolute inset-y-6 right-6 w-16 rounded-xl border border-emerald-400/70 bg-emerald-400/10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8, duration: 0.6 }}
                    />
                  </div>

                  {/* Bottom stats */}
                  <div className="flex justify-between pt-3 border-t border-slate-700/70 text-xs text-gray-300">
                    <span>Vol: 18.3k</span>
                    <span>AI Confidence: 82%</span>
                    <span>Next signal in 00:11</span>
                  </div>
                </motion.div>
              </motion.div>

              {/* Slide 2 – AI News Sentiment */}
              <motion.div
                className="min-w-[90%] md:min-w-[70%] lg:min-w-[55%] snap-center bg-white border border-gray-200 rounded-3xl shadow-xl p-8 flex flex-col lg:flex-row gap-8 items-center"
                whileHover={{ scale: 1.02, y: -6 }}
                transition={{ type: "spring", stiffness: 220, damping: 20 }}
              >
                <div className="flex-1 space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-50 text-pink-700 text-xs font-semibold">
                    <Newspaper className="w-4 h-4" />
                    AI News Sentiment
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Real‑time market narrative tracking
                  </h3>
                  <p className="text-gray-600">
                    Stream global headlines, cluster them by ticker, and see sentiment curves that flag regime shifts before price reacts.
                  </p>
                </div>

                {/* Sentiment visual */}
                <motion.div
                  className="flex-1 w-full h-72 bg-gradient-to-tr from-slate-900 via-slate-800 to-rose-900 rounded-2xl p-5 flex flex-col gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <div className="flex justify-between items-center text-xs text-gray-200">
                    <span>AI News Stream</span>
                    <span className="text-emerald-300 font-semibold">Net: Bullish</span>
                  </div>

                  {/* Sentiment line */}
                  <div className="flex-1 flex items-end gap-1">
                    {Array.from({ length: 40 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className={`w-1 rounded-full ${
                          i > 25 ? "bg-emerald-400" : "bg-rose-400"
                        }`}
                        style={{
                          height: `${20 + Math.sin(i / 3) * 18 + (i > 25 ? 18 : 0)}px`,
                        }}
                        initial={{ scaleY: 0.2, opacity: 0 }}
                        animate={{ scaleY: 1, opacity: 1 }}
                        transition={{ delay: 0.02 * i, duration: 0.35 }}
                      />
                    ))}
                  </div>

                  {/* Headlines pills */}
                  <div className="flex flex-wrap gap-2 text-[11px]">
                    <span className="px-2 py-1 rounded-full bg-emerald-500/15 text-emerald-200 border border-emerald-400/40">
                      Large inflows into tech ETFs · +0.83
                    </span>
                    <span className="px-2 py-1 rounded-full bg-rose-500/15 text-rose-100 border border-rose-400/40">
                      Macro risk: inflation surprise · −0.41
                    </span>
                    <span className="px-2 py-1 rounded-full bg-slate-700/70 text-slate-100 border border-slate-500/60">
                      Fed commentary stabilizing · +0.23
                    </span>
                  </div>
                </motion.div>
              </motion.div>

              {/* Slide 3 – AI Chatbot Assistant */}
              <motion.div
                className="min-w-[90%] md:min-w-[70%] lg:min-w-[55%] snap-center bg-white border border-gray-200 rounded-3xl shadow-xl p-8 flex flex-col lg:flex-row gap-8 items-center"
                whileHover={{ scale: 1.02, y: -6 }}
                transition={{ type: "spring", stiffness: 220, damping: 20 }}
              >
                <div className="flex-1 space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold">
                    <MessageSquare className="w-4 h-4" />
                    AI Market Assistant
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Ask anything about markets
                  </h3>
                  <p className="text-gray-600">
                    Chat with an agent that combines live data, risk metrics, and macro context to produce concise, tradeable answers.
                  </p>
                </div>

                {/* Chat UI mock */}
                <motion.div
                  className="flex-1 w-full h-72 bg-gradient-to-bl from-slate-900 via-slate-900 to-indigo-900 rounded-2xl p-4 flex flex-col gap-3"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center gap-2 text-xs text-gray-200 mb-1">
                    <div className="h-6 w-6 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] font-bold">
                      AI
                    </div>
                    <span>AI‑FinanceMI · Live</span>
                  </div>

                  <div className="flex-1 flex flex-col gap-2 text-[13px] overflow-hidden">
                    <motion.div
                      className="self-start max-w-[80%] bg-slate-800 rounded-2xl rounded-bl-sm px-3 py-2 text-gray-100"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      What is the risk if I add more exposure to large‑cap tech this week?
                    </motion.div>
                    <motion.div
                      className="self-end max-w-[80%] bg-indigo-600 rounded-2xl rounded-br-sm px-3 py-2 text-white"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      Portfolio VaR rises from 5.2% to 7.1%. Correlation to Nasdaq climbs to 0.88. Consider hedging via index puts or sizing down to 60% of intended allocation.
                    </motion.div>
                    <motion.div
                      className="self-start max-w-[80%] bg-slate-800 rounded-2xl rounded-bl-sm px-3 py-2 text-gray-100"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      Show me three alternative trades with lower drawdown but similar upside.
                    </motion.div>
                  </div>

                  <div className="mt-auto flex items-center gap-2 bg-slate-800/80 rounded-xl px-3 py-2 text-xs text-slate-300">
                    <span className="flex-1 truncate">Ask about any asset, strategy, or risk scenario…</span>
                    <div className="h-7 w-7 rounded-full bg-indigo-500 flex items-center justify-center">
                      <ArrowRight className="w-3 h-3 text-white" />
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Slide 4 – AI Trade Recommendations */}
              <motion.div
                className="min-w-[90%] md:min-w-[70%] lg:min-w-[55%] snap-center bg-white border border-gray-200 rounded-3xl shadow-xl p-8 flex flex-col lg:flex-row gap-8 items-center"
                whileHover={{ scale: 1.02, y: -6 }}
                transition={{ type: "spring", stiffness: 220, damping: 20 }}
              >
                <div className="flex-1 space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                    <BarChart3 className="w-4 h-4" />
                    AI Trade Ideas
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Structured, risk‑aware recommendations
                  </h3>
                  <p className="text-gray-600">
                    Get entry, target, stop, and sizing logic automatically calibrated to your risk tolerance and portfolio context.
                  </p>
                </div>

                {/* Trade cards mock */}
                <motion.div
                  className="flex-1 w-full h-72 bg-gradient-to-tr from-slate-900 via-slate-900 to-emerald-900 rounded-2xl p-4 flex flex-col gap-3"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <div className="flex justify-between items-center text-xs text-gray-200">
                    <span>Top AI Opportunities</span>
                    <span className="text-emerald-300">Updated 12s ago</span>
                  </div>

                  <div className="grid grid-rows-3 gap-2 text-[12px]">
                    <motion.div
                      className="rounded-xl bg-slate-800/80 border border-emerald-400/40 px-3 py-2"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-emerald-200">Long NDX basket</span>
                        <span className="text-emerald-400 font-semibold">+3.4% edge</span>
                      </div>
                      <div className="flex justify-between text-slate-200/90">
                        <span>Entry: 1.2% pullback</span>
                        <span>Stop: −1.8%</span>
                        <span>TP: +4.5%</span>
                      </div>
                    </motion.div>

                    <motion.div
                      className="rounded-xl bg-slate-800/80 border border-amber-400/40 px-3 py-2"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.35 }}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-amber-200">Pairs: Growth vs Value</span>
                        <span className="text-amber-300 font-semibold">Market‑neutral</span>
                      </div>
                      <div className="flex justify-between text-slate-200/90">
                        <span>Beta: 0.08</span>
                        <span>Horizon: 5–10 days</span>
                      </div>
                    </motion.div>

                    <motion.div
                      className="rounded-xl bg-slate-800/80 border border-rose-400/40 px-3 py-2"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-rose-200">Hedge: Macro shock</span>
                        <span className="text-rose-300 font-semibold">Drawdown buffer</span>
                      </div>
                      <div className="flex justify-between text-slate-200/90">
                        <span>Max loss: 0.7%</span>
                        <span>Protects: 6–8% selloff</span>
                      </div>
                    </motion.div>
                  </div>

                  <div className="mt-auto flex items-center justify-between text-[11px] text-slate-300 pt-1 border-t border-slate-700/70">
                    <span>Aligned with your risk profile</span>
                    <span>One‑click to send to watchlist</span>
                  </div>
                </motion.div>
              </motion.div>

              {/* Slide 5 – Portfolio & Risk Overview (optional extra) */}
              <motion.div
                className="min-w-[90%] md:min-w-[70%] lg:min-w-[55%] snap-center bg-white border border-gray-200 rounded-3xl shadow-xl p-8 flex flex-col lg:flex-row gap-8 items-center"
                whileHover={{ scale: 1.02, y: -6 }}
                transition={{ type: "spring", stiffness: 220, damping: 20 }}
              >
                <div className="flex-1 space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-semibold">
                    <Wallet className="w-4 h-4" />
                    Portfolio & Risk
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    See your risk in one glance
                  </h3>
                  <p className="text-gray-600">
                    Track P&amp;L, factor exposures, and concentration so you instantly spot when a position is outside your risk rails.
                  </p>
                </div>

                {/* Radial / bars mock */}
                <motion.div
                  className="flex-1 w-full h-72 bg-gradient-to-br from-slate-900 via-slate-900 to-sky-900 rounded-2xl p-5 flex flex-col gap-4"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <div className="flex justify-between items-center text-xs text-gray-200">
                    <span>Portfolio Overview</span>
                    <span className="text-sky-300 font-semibold">Risk: Moderate</span>
                  </div>

                  <div className="flex flex-1 items-center gap-6">
                    {/* Radial mock */}
                    <div className="relative h-28 w-28 rounded-full bg-slate-800 flex items-center justify-center">
                      <div className="absolute inset-1 rounded-full border-4 border-sky-400/60 border-t-emerald-400/80 border-b-rose-400/70 rotate-[-35deg]" />
                      <div className="relative text-center">
                        <div className="text-xl font-bold text-white">63%</div>
                        <div className="text-[10px] text-slate-300">Capital deployed</div>
                      </div>
                    </div>

                    {/* Bars */}
                    <div className="flex-1 space-y-2 text-[12px]">
                      <div>
                        <div className="flex justify-between text-slate-200 mb-1">
                          <span>Equities</span>
                          <span>48%</span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                          <div className="h-full w-[48%] bg-sky-400" />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-slate-200 mb-1">
                          <span>Crypto</span>
                          <span>22%</span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                          <div className="h-full w-[22%] bg-emerald-400" />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-slate-200 mb-1">
                          <span>Derivatives</span>
                          <span>15%</span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                          <div className="h-full w-[15%] bg-rose-400" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between text-[11px] text-slate-300 pt-1 border-t border-slate-700/70">
                    <span>Max 1‑day VaR: 3.1%</span>
                    <span>Largest position: 8.4% of equity</span>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Small helper indicator */}
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
              <span className="h-[1px] w-10 bg-gray-300" />
              Scroll or swipe horizontally to explore the platform
              <span className="h-[1px] w-10 bg-gray-300" />
            </div>
          </div>
        </div>
      </section>


      {/* Why Traders Love Us */}
      <section className="py-20 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-black text-center text-gray-900 mb-16">Why Traders Choose AI-FinanceMI</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

            <div className="p-8 bg-gray-50 rounded-2xl hover:shadow-md transition hover:-translate-y-1">
              <TrendingUp className="w-10 h-10 text-blue-700 mb-4" />
              <h3 className="font-bold text-xl">Data-Driven Decisions</h3>
              <p className="mt-2 text-gray-600">
                High-quality charting, forecasting, news analysis & AI guidance.
              </p>
            </div>

            <div className="p-8 bg-gray-50 rounded-2xl hover:shadow-md transition hover:-translate-y-1">
              <BarChart className="w-10 h-10 text-indigo-700 mb-4" />
              <h3 className="font-bold text-xl">Institutional Data</h3>
              <p className="mt-2 text-gray-600">
                Live market feeds, sentiment scoring & smart indicators.
              </p>
            </div>

            <div className="p-8 bg-gray-50 rounded-2xl hover:shadow-md transition hover:-translate-y-1">
              <Brain className="w-10 h-10 text-purple-700 mb-4" />
              <h3 className="font-bold text-xl">AI-Powered Insights</h3>
              <p className="mt-2 text-gray-600">
                A trading assistant that explains markets like a human expert.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Meet the Creator */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
            Built by Passionate Developers
          </h2>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            From real-time AI signals to institutional-grade charts — every line of code was written with precision and a mission to democratize advanced financial intelligence.
          </p>

          <Link
            to="/about"
            className="group inline-flex items-center gap-4 px-10 py-5 bg-gradient-to-r from-blue-700 to-indigo-800 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            About Us
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm text-gray-600">
            © 2025 AI Market Pro • Built with passion by Vishal Kadam
          </p>
        </div>
      </footer>

    </div>
  );
}
