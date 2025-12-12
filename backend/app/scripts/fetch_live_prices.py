import yfinance as yf
from datetime import datetime
from app.db import SessionLocal
from app.models.symbols import Symbol
from app.models.prices import Price

def fetch_live_price(ticker):
    """Fetch the latest (1-minute) quote."""
    try:
        data = yf.Ticker(ticker).history(period="1d", interval="1m")

        if data.empty:
            return None

        latest = data.iloc[-1]
        return {
            "date": latest.name.to_pydatetime(),
            "open": float(latest["Open"]),
            "high": float(latest["High"]),
            "low": float(latest["Low"]),
            "close": float(latest["Close"]),
            "volume": float(latest["Volume"]),
        }

    except Exception as e:
        print(f"Error for {ticker}: {e}")
        return None


def save_price_to_db(symbol, data):
    db = SessionLocal()

    price = Price(
        symbol_id=symbol.id,
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


if __name__ == "__main__":
    print("\n📡 Fetching LIVE prices...")

    db = SessionLocal()
    symbols = db.query(Symbol).all()
    db.close()

    print(f"Total symbols: {len(symbols)}")

    for sym in symbols:
        ticker = sym.ticker + ".NS"  
        print(f"⬇ Fetching live price for {ticker}...")

        live = fetch_live_price(ticker)

        if live:
            save_price_to_db(sym, live)
            print(f"✔ Saved: {ticker} @ {live['close']}")
        else:
            print(f"⚠ No data for {ticker}")

    print("\n🎉 LIVE Price Update Complete!")
