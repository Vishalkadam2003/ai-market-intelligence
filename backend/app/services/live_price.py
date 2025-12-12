import yfinance as yf
from datetime import datetime
from app.db import SessionLocal
from app.models.symbols import Symbol
from app.models.prices import Price


def fetch_latest_price(symbol):
    ticker = f"{symbol}.NS"

    try:
        df = yf.download(ticker, period="1d", interval="1m")
        if df.empty:
            return None

        latest = df.iloc[-1]

        return {
            "date": latest.name.to_pydatetime(),
            "open": float(latest["Open"]),
            "high": float(latest["High"]),
            "low": float(latest["Low"]),
            "close": float(latest["Close"]),
            "volume": float(latest["Volume"]),
        }

    except Exception as e:
        print("Error fetching:", symbol, e)
        return None


def update_all_prices():
    print("⏳ Fetching live prices...")

    db = SessionLocal()
    symbols = db.query(Symbol).all()

    for sym in symbols:
        data = fetch_latest_price(sym.ticker)
        if not data:
            continue

        price = Price(
            symbol_id=sym.id,
            date=data["date"],
            open=data["open"],
            high=data["high"],
            low=data["low"],
            close=data["close"],
            volume=data["volume"],
        )

        db.add(price)
        db.commit()

    db.close()
    print("✅ Live prices updated.")
