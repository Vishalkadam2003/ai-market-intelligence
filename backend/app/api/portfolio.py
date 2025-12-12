# backend/app/api/portfolio.py
from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

from app.services.portfolio import analyze_portfolio

router = APIRouter()

class Holding(BaseModel):
    symbol: str
    quantity: float
    avg_price: float

class PortfolioRequest(BaseModel):
    holdings: List[Holding]



@router.post("/portfolio/analyze")
def analyze_portfolio_endpoint(request: PortfolioRequest):
    """
    Analyze user's portfolio: P/L, risk, score, per-stock breakdown.
    """
    data = [h.dict() for h in request.holdings]
    result = analyze_portfolio(data)
    return result
