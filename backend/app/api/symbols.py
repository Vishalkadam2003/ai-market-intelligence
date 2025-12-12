from fastapi import APIRouter
from pydantic import BaseModel
from app.db import SessionLocal
from app.models.symbols import Symbol

router = APIRouter()

class SymbolCreate(BaseModel):
    ticker: str
    name: str

@router.post("/add-symbol")
def add_symbol(symbol: SymbolCreate):
    db = SessionLocal()
    db_symbol = Symbol(ticker=symbol.ticker, name=symbol.name)
    db.add(db_symbol)
    db.commit()
    db.refresh(db_symbol)
    return {"message": "symbol added", "symbol": db_symbol}

@router.get("/symbols")
def list_symbols():
    db = SessionLocal()
    symbols = db.query(Symbol).all()
    return symbols
