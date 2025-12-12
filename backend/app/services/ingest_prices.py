import yfinance as yf
from datetime import datetime
from app.db import SessionLocal
from app.models.symbols import Symbol
from app.models.prices import Price

def fetch_and_store(symbol: str, period="1y"):
    db = SessionLocal()

    symbol_obj = db.query(Symbol).filter(Symbol.ticker == symbol).first()
    if not symbol_obj:
        return {"error": "symbol not found"}

    ticker = yf.Ticker(symbol + ".NS")
    hist = ticker.history(period=period)

    for idx, row in hist.iterrows():
        price = Price(
            symbol_id=symbol_obj.id,
            date=idx.date(),
            open=row["Open"],
            high=row["High"],
            low=row["Low"],
            close=row["Close"],
            volume=row["Volume"]
        )
        db.add(price)

    db.commit()
    db.close()
    return {"message": f"data_ingested_for_{symbol}"}

