from fastapi import APIRouter
from app.db import SessionLocal
from app.models.symbols import Symbol
from app.models.prices import Price

router = APIRouter()

@router.get("/history/{symbol}")
def get_stock_history(symbol: str):
    db = SessionLocal()
    symbol_obj = db.query(Symbol).filter(Symbol.ticker == symbol).first()
    if not symbol_obj:
        db.close()
        return {"error": "symbol not found"}

    rows = (
        db.query(Price)
        .filter(Price.symbol_id == symbol_obj.id)
        .order_by(Price.date.asc())
        .all()
    )

    db.close()

    return [
        {
            "date": row.date.strftime("%Y-%m-%d"),
            "open": row.open,
            "high": row.high,
            "low": row.low,
            "close": row.close,
            "volume": row.volume,
        }
        for row in rows
    ]
