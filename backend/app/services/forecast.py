import numpy as np
import pandas as pd
from datetime import timedelta
from app.db import SessionLocal
from app.models.symbols import Symbol
from app.models.prices import Price
from sklearn.linear_model import LinearRegression


def forecast_prices(symbol: str, days: int = 7):
    db = SessionLocal()

    symbol_obj = db.query(Symbol).filter(Symbol.ticker == symbol).first()
    if not symbol_obj:
        db.close()
        return {"error": "symbol not found"}

    prices = (
        db.query(Price)
        .filter(Price.symbol_id == symbol_obj.id)
        .order_by(Price.date.asc())
        .all()
    )

    if len(prices) < 10:
        db.close()
        return {"error": "not enough data to forecast (need >= 10 points)"}

    df = pd.DataFrame(
        [{"date": p.date, "close": p.close} for p in prices]
    )

    df["t"] = np.arange(len(df))
    X = df[["t"]].values
    y = df["close"].values

    model = LinearRegression()
    model.fit(X, y)

    last_t = int(df["t"].iloc[-1])
    last_date = df["date"].iloc[-1]

    forecast_points = []
    for i in range(1, days + 1):
        t_future = last_t + i
        y_pred = model.predict([[t_future]])[0]
        future_date = last_date + timedelta(days=i)
        forecast_points.append(
            {
                "date": future_date.strftime("%Y-%m-%d"),
                "close": round(float(y_pred), 2),
            }
        )

    db.close()

    return {
        "symbol": symbol_obj.ticker,
        "days": days,
        "forecast": forecast_points,
    }
