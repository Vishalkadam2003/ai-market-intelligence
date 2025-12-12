import yfinance as yf
from datetime import datetime, date
from apscheduler.schedulers.background import BackgroundScheduler

from app.db import SessionLocal
from app.models.symbols import Symbol
from app.models.prices import Price
from app.models.patterns import PatternSignal

from app.services.pattern_engine import analyze_patterns
import pandas as pd


# --------------------------------------------------------
# 1️⃣ UPDATE LIVE PRICES (with weekend + fallback safety)
# --------------------------------------------------------
def update_intraday_prices():

    # 📌 Skip updates on Saturday (5) and Sunday (6)
    if datetime.today().weekday() >= 5:
        print("⏸ Market closed (Weekend) — Skipping live update")
        return

    print("⏳ Updating live prices...")

    db = SessionLocal()
    symbols = db.query(Symbol).all()

    for sym in symbols:
        try:
            yf_symbol = f"{sym.ticker}.NS"
            ticker = yf.Ticker(yf_symbol)

            # Try 1-minute first
            hist = ticker.history(period="1d", interval="1m")

            # If empty → fallback to 5-minute
            if hist.empty:
                hist = ticker.history(period="1d", interval="5m")

            # If still empty → skip this symbol
            if hist.empty:
                print(f"⚠️ No intraday data for {yf_symbol}")
                continue

            last = hist.iloc[-1]
            ts = last.name.to_pydatetime()

            price_open = float(last["Open"])
            price_high = float(last["High"])
            price_low = float(last["Low"])
            price_close = float(last["Close"])
            volume = float(last["Volume"])

            # Check existing candle
            today_row = (
                db.query(Price)
                .filter(Price.symbol_id == sym.id)
                .filter(Price.date == ts.date())
                .first()
            )

            if today_row:
                today_row.high = max(today_row.high, price_high)
                today_row.low = min(today_row.low, price_low)
                today_row.close = price_close
                today_row.volume = volume
                db.commit()
            else:
                db.add(
                    Price(
                        symbol_id=sym.id,
                        date=ts.date(),
                        open=price_open,
                        high=price_high,
                        low=price_low,
                        close=price_close,
                        volume=volume,
                    )
                )
                db.commit()

        except Exception as e:
            print(f"❌ Error updating {sym.ticker}: {e}")

    db.close()
    print("✅ Live OHLC updated.")

    # Run pattern detector after price update
    run_pattern_detector()



# --------------------------------------------------------
# 2️⃣ PATTERN RECOGNIZER (runs after price updates)
# --------------------------------------------------------
def run_pattern_detector():
    print("🔍 Running Pattern Recognition...")

    db = SessionLocal()
    symbols = db.query(Symbol).all()

    for sym in symbols:

        prices = (
            db.query(Price)
            .filter(Price.symbol_id == sym.id)
            .order_by(Price.date.asc())
            .all()
        )

        if not prices:
            continue

        df = pd.DataFrame(
            [
                {
                    "date": p.date,
                    "open": p.open,
                    "high": p.high,
                    "low": p.low,
                    "close": p.close,
                    "volume": p.volume,
                }
                for p in prices
            ]
        )

        result = analyze_patterns(sym.ticker, df)

        # Clear old pattern signals
        db.query(PatternSignal).filter(PatternSignal.symbol_id == sym.id).delete()

        # Insert new patterns
        for p in result["patterns"]:
            db.add(
                PatternSignal(
                    symbol_id=sym.id,
                    symbol=sym.ticker,
                    pattern_type=p["type"],
                    confidence=p["confidence"],
                    timeframe="1D",
                )
            )

    db.commit()
    db.close()

    print("✅ Pattern Recognition Updated.")



# --------------------------------------------------------
# 3️⃣ SCHEDULER STARTER
# --------------------------------------------------------
scheduler = BackgroundScheduler()

def start_scheduler():
    scheduler.add_job(update_intraday_prices, "interval", minutes=5, id="live_price_job")
    scheduler.start()
    print("🚀 Scheduler started: fetching live OHLC + patterns every 5 minutes")
