import csv
import os
from app.db import SessionLocal
from app.models.symbols import Symbol

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSV_FILE = os.path.join(BASE_DIR, "data", "symbols.csv")

db = SessionLocal()

with open(CSV_FILE, "r", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for row in reader:
        ticker = row["ticker"].strip().upper()
        name = row["name"].strip()
        if db.query(Symbol).filter(Symbol.ticker == ticker).first():
            continue
        sym = Symbol(ticker=ticker, name=name)
        db.add(sym)
    db.commit()

print("✔ Imported all symbols successfully!")
