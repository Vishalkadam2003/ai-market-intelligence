import feedparser
from datetime import datetime
from urllib.parse import quote
from app.services.sentiment import analyze_sentiment

def fetch_company_news(symbol: str):
    query = quote(f"{symbol} stock")
    url = f"https://news.google.com/rss/search?q={query}"

    feed = feedparser.parse(url)
    news_list = []

    for entry in feed.entries:
        published = entry.get("published", None)

        # Parse date safely
        try:
            published_dt = datetime.strptime(published, "%a, %d %b %Y %H:%M:%S %Z")
            published_str = published_dt.strftime("%Y-%m-%d %H:%M:%S")
        except Exception:
            published_str = published

        title = entry.get("title", "")
        sent = analyze_sentiment(title)

        news_list.append({
            "title": title,
            "link": entry.get("link"),
            "publisher": entry.get("source", {}).get("title"),
            "published_at": published_str,
            "sentiment_score": sent["sentiment_score"],
            "sentiment_label": sent["sentiment_label"],
        })

    return news_list
