from fastapi import APIRouter
from app.db import SessionLocal
from app.models.symbols import Symbol

router = APIRouter()


@router.get("/symbols")
def list_symbols():
    db = SessionLocal()
    symbols = db.query(Symbol).all()
    return symbols
