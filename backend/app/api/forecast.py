from fastapi import APIRouter, Query
from app.services.forecast import forecast_prices

router = APIRouter()


@router.get("/forecast/{symbol}")
def get_forecast(symbol: str, days: int = Query(7, ge=1, le=60)):
    return forecast_prices(symbol, days)
