from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from app.db import Base, engine
from app.routers import auth, profile
from app.api import market
from app.api import patterns as patterns_router

from app.api.symbols import router as symbols_router
from app.api.prices import router as prices_router
from app.api.ingest import router as ingest_router
from app.api.history import router as history_router
from app.api.forecast import router as forecast_router
from app.api.indicators import router as indicators_router
from app.api.news import router as news_router
from app.api.sentiment import router as sentiment_router
from app.api.signals import router as signals_router
from app.api.voice import router as voice_router
from app.api.portfolio import router as portfolio_router
from app.api.live_price import router as live_price_router

from apscheduler.schedulers.background import BackgroundScheduler
from app.services.scheduler_live import update_intraday_prices


# -------------------------------------------------
# Create App FIRST (Do NOT overwrite later)
# -------------------------------------------------
app = FastAPI(title="AI Financial Market Intelligence API")

# -------------------------------------------------
# Database Tables
# -------------------------------------------------
Base.metadata.create_all(bind=engine)

# -------------------------------------------------
# CORS
# -------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------------------------
# Static Files
# -------------------------------------------------
app.mount("/static", StaticFiles(directory="app/static"), name="static")

# -------------------------------------------------
# Routers
# -------------------------------------------------
app.include_router(auth.router)         # Signup/Login
app.include_router(profile.router)      # User Profile

app.include_router(symbols_router, prefix="/api")
app.include_router(prices_router, prefix="/api")
app.include_router(ingest_router, prefix="/api")
app.include_router(history_router, prefix="/api")
app.include_router(forecast_router, prefix="/api")
app.include_router(indicators_router, prefix="/api")
app.include_router(news_router, prefix="/api")
app.include_router(sentiment_router, prefix="/api")
app.include_router(signals_router, prefix="/api")
app.include_router(voice_router, prefix="/api")
app.include_router(portfolio_router, prefix="/api")
app.include_router(live_price_router, prefix="/api")
app.include_router(market.router)
app.include_router(patterns_router.router)

# -------------------------------------------------
# Scheduler (ONE instance only)
# -------------------------------------------------
scheduler = BackgroundScheduler()
scheduler.add_job(update_intraday_prices, "interval", minutes=1)

@app.on_event("startup")
def start_event():
    scheduler.start()

@app.on_event("shutdown")
def shutdown_event():
    scheduler.shutdown(wait=False)

# -------------------------------------------------
# Root Routes
# -------------------------------------------------
@app.get("/")
def root():
    return {"message": "API Running"}

@app.get("/favicon.ico")
def favicon():
    return FileResponse("app/static/favicon.ico")
