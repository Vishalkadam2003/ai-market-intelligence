# app/api/live_price.py
from fastapi import APIRouter, HTTPException
from datetime import datetime
import yfinance as yf

from app.db import SessionLocal
from app.models.symbols import Symbol
from app.models.prices import Price

router = APIRouter(tags=["Live"])


@router.get("/live-price/{symbol}")
def get_live_price(symbol: str):
    """
    Return latest price for a symbol.
    1) Try Yahoo Finance (TICKER.NS)
    2) Fallback to last DB close price
    """

    db = SessionLocal()
    sym = db.query(Symbol).filter(Symbol.ticker == symbol.upper()).first()

    if not sym:
        db.close()
        raise HTTPException(status_code=404, detail="Symbol not found")

    yf_symbol = f"{sym.ticker}.NS"

    latest_price = None
    ts = None

    # 1) Try Yahoo Finance intraday data
    try:
        ticker = yf.Ticker(yf_symbol)
        hist = ticker.history(period="1d", interval="1m")

        if hist is not None and not hist.empty:
            last_row = hist.iloc[-1]
            latest_price = float(last_row["Close"])
            ts = last_row.name.to_pydatetime()
    except Exception:
        # ignore, we will fallback to DB
        pass

    # 2) Fallback to last stored DB price
    if latest_price is None:
        last_price = (
            db.query(Price)
            .filter(Price.symbol_id == sym.id)
            .order_by(Price.date.desc())
            .first()
        )
        if last_price:
            latest_price = float(last_price.close)
            ts = datetime.combine(last_price.date, datetime.min.time())

    db.close()

    if latest_price is None:
        raise HTTPException(status_code=404, detail="No price data available")

    return {
        "symbol": sym.ticker,
        "price": latest_price,
        "timestamp": ts.isoformat() if ts else None,
    }
