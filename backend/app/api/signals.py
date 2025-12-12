from fastapi import APIRouter
from app.services.signals import get_trading_signals

router = APIRouter()

@router.get("/signals/{symbol}")
def signals(symbol: str):
    return get_trading_signals(symbol)
