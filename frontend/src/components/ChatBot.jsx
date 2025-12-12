// src/components/ChatBot.jsx
import { useState, useEffect, useRef } from "react";
import { Send, Copy, Bot, User, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ChatBot() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      content:
        "Hi! I'm your **AI Stock Market Assistant** 📈\n\nAsk me anything like:\n- *What is RSI?*\n- *Analyze TCS*\n- *Give sentiment for INFY*",
      timestamp: new Date(),
    },
  ]);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ----------------------------------------------------
  // CALL BACKEND /voice API
  // ----------------------------------------------------
  const callBackendAssistant = async (text) => {
    const res = await fetch("http://127.0.0.1:8000/voice/voice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    return await res.json();
  };

  // ----------------------------------------------------
  // FORMAT BACKEND RESPONSE INTO CLEAN MESSAGE
  // ----------------------------------------------------
  const formatResponse = (data) => {
    switch (data.mode) {
      case "education":
        return (
          `📘 **Educational Answer**\n\n` +
          `**Q:** ${data.question}\n\n` +
          `${data.explanation}\n\n` +
          `💬 *Sentiment:* **${data.sentiment.sentiment_label}**\n\n` +
          `⚠️ ${data.note}`
        );

      case "symbol_analysis":
        return (
          `📊 **Stock Analysis — ${data.symbol}**\n\n` +
          `### 🔍 Technical View\n${data.technical_view}\n\n` +
          `### 📰 News Sentiment\n${data.news_summary}\n\n` +
          `### 🤖 AI Interpretation\n${data.reply}`
        );

      case "no_symbol":
        return `⚠️ ${data.reply}`;

      case "error":
        return `❌ Error: ${data.error}`;

      default:
        return JSON.stringify(data, null, 2);
    }
  };

  // ----------------------------------------------------
  // SEND MESSAGE
  // ----------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg = {
      id: Date.now(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const apiData = await callBackendAssistant(input);
      const formatted = formatResponse(apiData);

      const botMsg = {
        id: Date.now() + 1,
        role: "assistant",
        content: formatted,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          role: "assistant",
          content:
            "❌ Error connecting to AI Assistant. Ensure backend is running.",
          timestamp: new Date(),
        },
      ]);
    }

    setIsTyping(false);
  };

  const copyText = (text) => navigator.clipboard.writeText(text);

  // ----------------------------------------------------
  // UI
  // ----------------------------------------------------
  return (
    <div className="flex flex-col h-full bg-white">

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-4 ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.role === "assistant" && (
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
            )}

            <div
              className={`max-w-2xl px-5 py-4 rounded-2xl shadow-sm border ${
                msg.role === "user"
                  ? "bg-blue-600 text-white border-transparent"
                  : "bg-gray-50 text-gray-900 border-gray-200"
              }`}
            >
              {/* Assistant Bubble */}
              {msg.role === "assistant" ? (
                <>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs text-gray-500">AI Assistant</span>
                    <button
                      onClick={() => copyText(msg.content)}
                      className="p-1 hover:bg-gray-300/40 rounded"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>

                  <ReactMarkdown
                    className="prose prose-sm text-gray-900"
                    remarkPlugins={[remarkGfm]}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </>
              ) : (
                /* User Message */
                <p className="text-sm">{msg.content}</p>
              )}

              <div className="text-xs opacity-60 mt-2">
                {msg.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>

            {msg.role === "user" && (
              <div className="w-10 h-10 rounded-xl bg-gray-200 flex items-center justify-center">
                <User className="w-6 h-6 text-gray-700" />
              </div>
            )}
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div className="bg-gray-100 rounded-2xl px-5 py-4 border flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
              <span className="text-sm text-gray-600">Analyzing...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form
        onSubmit={handleSubmit}
        className="border-t bg-gray-50 px-6 py-5 flex gap-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask stock questions: 'Analyze TCS', 'What is RSI', 'Sentiment INFY'..."
          className="flex-1 px-5 py-3.5 bg-white border rounded-xl focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          disabled={!input.trim() || isTyping}
          className="px-6 py-3.5 bg-blue-600 text-white rounded-xl flex items-center gap-2 hover:bg-blue-700"
        >
          <Send className="w-4 h-4" />
          Send
        </button>
      </form>
    </div>
  );
}
