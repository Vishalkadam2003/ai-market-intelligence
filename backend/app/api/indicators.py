from fastapi import APIRouter
from app.services.indicators import calculate_indicators

router = APIRouter()

@router.get("/indicators/{symbol}")
def get_indicators(symbol: str):
    return calculate_indicators(symbol)
