import pandas as pd
from app.db import SessionLocal
from app.models.symbols import Symbol
from app.models.prices import Price

def calculate_indicators(symbol: str):
    db = SessionLocal()

    symbol_obj = db.query(Symbol).filter(Symbol.ticker == symbol).first()
    if not symbol_obj:
        db.close()
        return {"error": "symbol not found"}

    prices = (
        db.query(Price)
        .filter(Price.symbol_id == symbol_obj.id)
        .order_by(Price.date.asc())
        .all()
    )

    if len(prices) < 30:
        db.close()
        return {"error": "not enough data for indicators (need >= 30)"}

    df = pd.DataFrame(
        [{"date": p.date, "close": p.close} for p in prices]
    )

    # Simple Moving Averages
    df["SMA20"] = df["close"].rolling(window=20).mean()
    df["SMA50"] = df["close"].rolling(window=50).mean()

    # Exponential Moving Averages
    df["EMA9"] = df["close"].ewm(span=9, adjust=False).mean()
    df["EMA21"] = df["close"].ewm(span=21, adjust=False).mean()

    # RSI (14)
    delta = df["close"].diff()
    gain = (delta.where(delta > 0, 0).rolling(14).mean())
    loss = (-delta.where(delta < 0, 0).rolling(14).mean())
    rs = gain / loss
    df["RSI14"] = 100 - (100 / (1 + rs))

    # MACD (12,26,9)
    df["EMA12"] = df["close"].ewm(span=12, adjust=False).mean()
    df["EMA26"] = df["close"].ewm(span=26, adjust=False).mean()
    df["MACD"] = df["EMA12"] - df["EMA26"]
    df["Signal"] = df["MACD"].ewm(span=9, adjust=False).mean()

    db.close()

    df = df.replace({float("nan"): None})
    df["date"] = df["date"].astype(str)
    return df.to_dict(orient="records")


# 🔹 Helper for voice agent: history + indicators together
def get_history_and_indicators(symbol: str):
    """
    Returns:
    {
      "symbol": "TCS",
      "history": [...],
      "indicators": [...]
    }
    """
    db = SessionLocal()

    symbol_obj = db.query(Symbol).filter(Symbol.ticker == symbol).first()
    if not symbol_obj:
        db.close()
        return {"error": "symbol not found"}

    prices = (
        db.query(Price)
        .filter(Price.symbol_id == symbol_obj.id)
        .order_by(Price.date.asc())
        .all()
    )

    history = [
        {
            "date": p.date.strftime("%Y-%m-%d"),
            "open": p.open,
            "high": p.high,
            "low": p.low,
            "close": p.close,
            "volume": p.volume,
        }
        for p in prices
    ]

    db.close()

    indicators = calculate_indicators(symbol)
    if isinstance(indicators, dict) and "error" in indicators:
        return indicators

    return {
        "symbol": symbol,
        "history": history,
        "indicators": indicators
    }
