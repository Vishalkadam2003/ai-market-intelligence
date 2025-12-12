import yfinance as yf
import pandas as pd
from app.db import SessionLocal
from app.models.symbols import Symbol
from app.models.prices import Price

db = SessionLocal()

print("📡 Fetching symbols...")
symbols = db.query(Symbol).all()
print("Total symbols:", len(symbols), "\n")

for sym in symbols:
    ticker = sym.ticker + ".NS"
    print(f"⬇ Downloading {ticker}...")

    try:
        data = yf.download(ticker, period="6mo", interval="1d")

        # If empty skip
        if data.empty:
            print(f"⚠ No price data for {ticker}\n")
            continue

        # FIX FOR MULTI-INDEX COLUMNS
        if isinstance(data.columns, pd.MultiIndex):
            data.columns = data.columns.get_level_values(0)

        data = data.reset_index().copy()

    except Exception as e:
        print(f"❌ Error downloading {ticker}: {e}\n")
        continue

    rows = 0

    for _, row in data.iterrows():

        # Skip missing rows
        if pd.isna(row.get("Open")) or pd.isna(row.get("Close")):
            continue

        try:
            price = Price(
                symbol_id=sym.id,
                date=row["Date"].to_pydatetime(),
                open=float(row["Open"]),
                high=float(row["High"]),
                low=float(row["Low"]),
                close=float(row["Close"]),
                volume=float(row.get("Volume", 0) or 0)
            )

            db.add(price)
            rows += 1

        except Exception as e:
            print(f"❌ DB insert error ({ticker}): {e}")

    db.commit()
    print(f"✅ Imported {rows} rows for {ticker}\n")

db.close()
print("🎉 DONE — All price imports completed!")
