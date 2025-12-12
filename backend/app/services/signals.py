from app.services.indicators import calculate_indicators
from app.services.news import fetch_company_news

def get_trading_signals(symbol: str):
    """
    Combine technical indicators + sentiment 
    to generate a final Buy/Sell/Hold signal.
    """

    # Get indicator data
    data = calculate_indicators(symbol)

    if not data:
        return {"error": "No indicator data found"}

    last = data[-1]  # Most recent day

    # ---------------------------
    # 1️⃣ SMA SIGNAL
    # ---------------------------
    sma_signal = "HOLD"
    if last["SMA20"] and last["SMA50"]:
        if last["SMA20"] > last["SMA50"]:
            sma_signal = "BUY"
        elif last["SMA20"] < last["SMA50"]:
            sma_signal = "SELL"

    # ---------------------------
    # 2️⃣ RSI SIGNAL
    # ---------------------------
    rsi_signal = "HOLD"
    if last["RSI14"] is not None:
        if last["RSI14"] < 30:
            rsi_signal = "BUY"
        elif last["RSI14"] > 70:
            rsi_signal = "SELL"

    # ---------------------------
    # 3️⃣ MACD SIGNAL
    # ---------------------------
    macd_signal = "HOLD"
    if last["MACD"] is not None and last["Signal"] is not None:
        if last["MACD"] > last["Signal"]:
            macd_signal = "BUY"
        elif last["MACD"] < last["Signal"]:
            macd_signal = "SELL"

    # ---------------------------
    # 4️⃣ Sentiment Score
    # ---------------------------
    news = fetch_company_news(symbol)
    sentiment_scores = [n["sentiment_score"] for n in news if n.get("sentiment_score") is not None]

    if sentiment_scores:
        avg_sentiment = sum(sentiment_scores) / len(sentiment_scores)
    else:
        avg_sentiment = 0  # no news available

    sentiment_signal = "HOLD"
    if avg_sentiment > 0.15:
        sentiment_signal = "BUY"
    elif avg_sentiment < -0.15:
        sentiment_signal = "SELL"

    # ---------------------------
    # 5️⃣ Weighted AI Score
    # ---------------------------
    weights = {
        "BUY": 1,
        "HOLD": 0.5,
        "SELL": 0,
    }

    final_score = (
        0.30 * weights[sma_signal] +
        0.25 * weights[rsi_signal] +
        0.25 * weights[macd_signal] +
        0.20 * weights[sentiment_signal]
    )

    if final_score > 0.65:
        final_decision = "BUY"
    elif final_score < 0.35:
        final_decision = "SELL"
    else:
        final_decision = "HOLD"

    return {
        "symbol": symbol,
        "signals": {
            "SMA": sma_signal,
            "RSI": rsi_signal,
            "MACD": macd_signal,
            "Sentiment": sentiment_signal,
        },
        "average_sentiment": avg_sentiment,
        "confidence": round(final_score, 3),        
        "final_score": round(final_score, 3),
        "final_decision": final_decision
    }
