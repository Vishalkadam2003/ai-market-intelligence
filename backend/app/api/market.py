from fastapi import APIRouter

router = APIRouter(prefix="/api/market", tags=["Market"])

@router.get("/movers")
def market_movers():
    return {
        "gainers": [
            {"ticker": "TCS", "change": 3.4},
            {"ticker": "INFY", "change": 2.8},
            {"ticker": "HDFCBANK", "change": 2.3},
        ],
        "losers": [
            {"ticker": "RELIANCE", "change": -1.9},
            {"ticker": "SBIN", "change": -1.5},
        ],
        "active": [
            {"ticker": "RELIANCE", "volume": 1.2},
            {"ticker": "TCS", "volume": 0.9},
        ],
    }
