from fastapi import APIRouter
from app.services.ingest_prices import fetch_and_store

router = APIRouter()

@router.get("/ingest/{symbol}")
def ingest(symbol: str):
    return fetch_and_store(symbol)
