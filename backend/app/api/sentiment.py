from fastapi import APIRouter
from app.services.news import fetch_company_news

router = APIRouter()

@router.get("/sentiment/{symbol}")
def sentiment_for_symbol(symbol: str):
    return fetch_company_news(symbol)
