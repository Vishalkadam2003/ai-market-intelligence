// src/pages/Assistant.jsx
import { useState } from "react";
import { Mic, MicOff, Send, Brain, ShieldCheck } from "lucide-react";
import VoiceAssistant from "../components/VoiceAssistant";

export default function Assistant() {
  const [isListening, setIsListening] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello. I'm your institutional-grade AI Financial Analyst. Ask me about markets, forecasts, risk, sentiment, or strategy.",
      timestamp: new Date(),
    },
  ]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: "user", content: input, timestamp: new Date() }]);
    setInput("");
    // Simulate response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: `Analyzing "${input}" across 40+ data sources including Bloomberg, Refinitiv, on-chain metrics, and sentiment feeds...`,
        timestamp: new Date(),
      }]);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter',system-ui,sans-serif] antialiased">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-11 h-11 bg-gradient-to-br from-blue-700 to-indigo-800 rounded-xl flex items-center justify-center shadow-md">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">AI Financial Analyst</h1>
              <p className="text-sm text-gray-600 font-medium">Institutional Intelligence Engine</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2 text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-medium">Live</span>
            </div>
            <ShieldCheck className="w-5 h-5 text-green-600" />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-10 flex gap-8">
        {/* Main Chat Area */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="flex-1 p-8 space-y-8 overflow-y-auto">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-3xl px-6 py-4 rounded-2xl ${
                    msg.role === "user"
                      ? "bg-blue-700 text-white"
                      : "bg-gray-100 text-gray-900 border border-gray-200"
                  }`}
                >
                  <p className="text-sm font-medium leading-relaxed">{msg.content}</p>
                  <p className={`text-xs mt-2 ${msg.role === "user" ? "text-blue-200" : "text-gray-500"}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 bg-gray-50/50 p-6">
            <div className="flex items-center gap-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask about markets, forecasts, risk, or strategy..."
                className="flex-1 px-5 py-4 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent transition"
              />
              
              <button
                onClick={() => setIsListening(!isListening)}
                className={`p-4 rounded-xl transition-all ${
                  isListening
                    ? "bg-red-600 hover:bg-red-700 text-white shadow-lg"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                }`}
              >
                {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </button>

              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="p-4 bg-blue-700 hover:bg-blue-800 disabled:bg-gray-300 text-white rounded-xl shadow-lg disabled:shadow-none transition-all"
              >
                <Send className="w-6 h-6" />
              </button>
            </div>

            {isListening && (
              <div className="mt-4 text-center">
                <p className="text-sm font-medium text-red-600 animate-pulse">
                  Listening... Speak your query
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Context & Capabilities */}
        <div className="w-80 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="font-bold text-gray-900 mb-4">Capabilities</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start gap-3"><span className="text-blue-700 mt-0.5">•</span> Real-time price & volume analysis</li>
              <li className="flex items-start gap-3"><span className="text-blue-700 mt-0.5">•</span> AI-powered 7-day price forecasts</li>
              <li className="flex items-start gap-3"><span className="text-blue-700 mt-0.5">•</span> Sentiment from news & social</li>
              <li className="flex items-start gap-3"><span className="text-blue-700 mt-0.5">•</span> Risk & volatility modeling</li>
              <li className="flex items-start gap-3"><span className="text-blue-700 mt-0.5">•</span> Portfolio strategy suggestions</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-blue-700 to-indigo-800 text-white rounded-2xl p-6">
            <h3 className="font-bold text-lg mb-2">Data Sources</h3>
            <p className="text-sm opacity-90">Bloomberg • Refinitiv • CoinGecko • Twitter • SEC Filings • Options Flow</p>
          </div>
        </div>
      </div>

      {/* Voice Assistant Hidden Component */}
      <VoiceAssistant isListening={isListening} setIsListening={setIsListening} />
    </div>
  );
}