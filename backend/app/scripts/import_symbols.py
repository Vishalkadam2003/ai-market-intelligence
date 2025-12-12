import csv
from app.db import SessionLocal
from app.models.symbols import Symbol

CSV_FILE = r"D:\6. PROJECT FOLDER\ai-market-intelligence\backend\app\data\symbols.csv"

db = SessionLocal()

with open(CSV_FILE, "r", encoding="utf-8") as f:
    reader = csv.DictReader(f)

    for row in reader:
        ticker = row["ticker"].strip().upper()
        name = row["name"].strip()

        # Skip duplicates
        if db.query(Symbol).filter(Symbol.ticker == ticker).first():
            continue

        sym = Symbol(ticker=ticker, name=name)
        db.add(sym)

    db.commit()

print("✔ Imported all symbols successfully!")
