import { useState } from "react";
import { API } from "../utils/backend";
import { Bot, Loader2, Send } from "lucide-react";

export default function AiStockSearch() {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleAsk(e) {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setAnswer(null);

    try {
      const res = await API.post("/voice", { text: query });
      setAnswer(res.data);
    } catch (err) {
      console.error(err);
      setAnswer({ reply: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-xl shadow p-5 space-y-4">
      <div className="flex items-center gap-2">
        <Bot className="w-5 h-5 text-blue-600" />
        <h3 className="font-semibold text-gray-800">
          AI Stock Q&A Assistant
        </h3>
      </div>

      <form onSubmit={handleAsk} className="flex gap-2">
        <input
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
          placeholder="Ask anything: 'Analyze TCS', 'What is RSI?', 'Is INFY bullish?'"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="submit"
          className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm flex items-center gap-1 disabled:opacity-60"
          disabled={loading}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          Ask
        </button>
      </form>

      {answer && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm whitespace-pre-line">
          {answer.reply || JSON.stringify(answer, null, 2)}
        </div>
      )}
    </div>
  );
}
