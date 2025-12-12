def ai_trading_brain(indicators, avg_sentiment):
    """
    Extra intelligence layer: creates a more advanced interpretive summary.
    Works ON TOP of your existing logic.
    """

    last = indicators[-1]

    sma20 = last.get("SMA20")
    sma50 = last.get("SMA50")
    rsi = last.get("RSI14")
    macd = last.get("MACD")
    signal = last.get("Signal")

    thoughts = []

    # Trend logic
    if sma20 and sma50:
        if sma20 > sma50:
            thoughts.append("The stock is in an upward trend as the 20-day MA is above 50-day MA.")
        else:
            thoughts.append("The stock is in a downtrend because the 20-day MA is below 50-day MA.")

    # RSI logic
    if rsi:
        if rsi > 70:
            thoughts.append("RSI indicates overbought conditions. A correction is possible.")
        elif rsi < 30:
            thoughts.append("RSI suggests oversold conditions — potential bounce area.")
        else:
            thoughts.append("RSI is neutral, suggesting balanced momentum.")

    # MACD logic
    if macd and signal:
        if macd > signal:
            thoughts.append("MACD crossover is bullish and may support upward momentum.")
        else:
            thoughts.append("MACD is below the signal line, showing weakening momentum.")

    # Sentiment logic
    if avg_sentiment > 0.05:
        thoughts.append("Recent news sentiment is positive, which may support bullish movement.")
    elif avg_sentiment < -0.05:
        thoughts.append("News sentiment is negative which may influence downward pressure.")
    else:
        thoughts.append("News sentiment is neutral or mixed.")

    return " ".join(thoughts)
