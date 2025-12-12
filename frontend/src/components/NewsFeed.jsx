import { useEffect, useState } from "react";
import { API } from "../utils/backend";

function NewsFeed({ symbol }) {
  const [news, setNews] = useState([]);

  useEffect(() => {
    if (!symbol) return;

    API.get(`/sentiment/${symbol}`)
      .then((res) => setNews(res.data))
      .catch((err) => console.error("Sentiment error:", err));
  }, [symbol]);

  if (!symbol) return <p className="text-gray-500">Select a stock to view news.</p>;

  return (
    <div className="mt-6 bg-white p-4 rounded-lg shadow w-full max-w-4xl">
      <h2 className="text-xl font-bold mb-3">Latest News & Sentiment — {symbol}</h2>

      {news.length === 0 && (
        <p className="text-gray-500">No news found.</p>
      )}

      <ul className="space-y-4">
        {news.map((item, idx) => (
          <li key={idx} className="border-b pb-3">
            {/* News Title */}
            <a
              href={item.link}
              target="_blank"
              className="text-blue-600 font-medium hover:underline"
            >
              {item.title}
            </a>

            {/* Publisher + Date */}
            <p className="text-sm text-gray-600">
              {item.publisher || "Unknown"} — {item.published_at}
            </p>

            {/* FIXED: correct sentiment fields */}
            <div className="mt-1 flex items-center gap-3">
              <span
                className={`px-3 py-1 rounded text-sm font-bold ${
                  item.sentiment_label === "POSITIVE"
                    ? "bg-green-100 text-green-700"
                    : item.sentiment_label === "NEGATIVE"
                    ? "bg-red-100 text-red-700"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {item.sentiment_label}
              </span>

              <span className="text-gray-700 text-sm">
                Sentiment Score: {item.sentiment_score.toFixed(3)}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NewsFeed;
