from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import date
from app.db import SessionLocal
from app.models.symbols import Symbol
from app.models.prices import Price

router = APIRouter(prefix="/prices", tags=["Prices"])


class PriceCreate(BaseModel):
    symbol: str
    date: date
    open: float
    high: float
    low: float
    close: float
    volume: float


# ------------------------------
# Add OHLC data
# ------------------------------
@router.post("/add")
def add_price(data: PriceCreate):
    db = SessionLocal()

    symbol = db.query(Symbol).filter(Symbol.ticker == data.symbol.upper()).first()
    if not symbol:
        db.close()
        raise HTTPException(status_code=404, detail="Symbol not found")

    price = Price(
        symbol_id=symbol.id,
        date=data.date,
        open=data.open,
        high=data.high,
        low=data.low,
        close=data.close,
        volume=data.volume,
    )

    db.add(price)
    db.commit()

    db.refresh(price)
    db.close()

    return {"message": "Price added successfully"}


# ------------------------------
# Get OHLC data for any symbol
# ------------------------------
@router.get("/{symbol}")
def get_prices(symbol: str):
    db = SessionLocal()

    symbol_obj = db.query(Symbol).filter(Symbol.ticker == symbol.upper()).first()
    if not symbol_obj:
        db.close()
        raise HTTPException(status_code=404, detail="Symbol not found")

    rows = (
        db.query(Price)
        .filter(Price.symbol_id == symbol_obj.id)
        .order_by(Price.date.asc())
        .all()
    )

    db.close()

    result = [
        {
            "date": r.date.strftime("%Y-%m-%d"),
            "open": r.open,
            "high": r.high,
            "low": r.low,
            "close": r.close,
            "volume": r.volume,
        }
        for r in rows
    ]

    return {"symbol": symbol, "prices": result}
