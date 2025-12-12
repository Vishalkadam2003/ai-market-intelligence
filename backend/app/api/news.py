from fastapi import APIRouter
from app.services.news import fetch_company_news

router = APIRouter()

@router.get("/news/{symbol}")
def get_stock_news(symbol: str):
    return fetch_company_news(symbol)
