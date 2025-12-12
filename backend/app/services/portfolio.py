# backend/app/services/portfolio.py
from typing import List, Dict, Any
from statistics import pstdev

from app.db import SessionLocal
from app.models.symbols import Symbol
from app.models.prices import Price


def _get_symbol_and_prices(symbol: str, window: int = 60):
    """
    Helper: get Symbol object + recent price history.
    """
    db = SessionLocal()

    symbol_obj = db.query(Symbol).filter(Symbol.ticker == symbol).first()
    if not symbol_obj:
        db.close()
        return None, [], "symbol_not_found"

    prices = (
        db.query(Price)
        .filter(Price.symbol_id == symbol_obj.id)
        .order_by(Price.date.desc())
        .limit(window)
        .all()
    )

    if not prices:
        db.close()
        return symbol_obj, [], "no_price_data"

    # reverse to oldest -> newest
    prices = list(reversed(prices))
    db.close()
    return symbol_obj, prices, None


def _compute_volatility_risk(prices: List[Price]) -> Dict[str, Any]:
    """
    Compute simple volatility & risk bucket from close prices.
    """
    if len(prices) < 10:
        return {
            "volatility_pct": None,
            "risk_bucket": "UNKNOWN (not enough data)"
        }

    closes = [p.close for p in prices]
    current_price = closes[-1]

    # population standard deviation
    sigma = pstdev(closes)
    vol_pct = (sigma / current_price) * 100 if current_price else None

    if vol_pct is None:
        bucket = "UNKNOWN"
    elif vol_pct < 2:
        bucket = "LOW"
    elif vol_pct < 5:
        bucket = "MEDIUM"
    else:
        bucket = "HIGH"

    return {
        "volatility_pct": round(vol_pct, 2) if vol_pct is not None else None,
        "risk_bucket": bucket,
    }


def analyze_portfolio(holdings: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Main portfolio analytics engine.

    holdings = [
        {"symbol": "TCS", "quantity": 5, "avg_price": 3200},
        {"symbol": "INFY", "quantity": 10, "avg_price": 1500},
        ...
    ]
    """
    results = []
    total_invested = 0.0
    total_value = 0.0

    for h in holdings:
        symbol = h.get("symbol")
        qty = float(h.get("quantity", 0) or 0)
        avg_price = float(h.get("avg_price", 0) or 0)

        if not symbol or qty <= 0 or avg_price <= 0:
            results.append({
                "symbol": symbol,
                "error": "invalid_holding_data",
            })
            continue

        symbol = symbol.upper()
        symbol_obj, prices, err = _get_symbol_and_prices(symbol)

        if err == "symbol_not_found":
            results.append({
                "symbol": symbol,
                "error": "symbol_not_found_in_db",
            })
            continue

        if err == "no_price_data":
            results.append({
                "symbol": symbol,
                "error": "no_price_history_for_symbol",
            })
            continue

        latest = prices[-1]
        current_price = latest.close

        invested_amount = qty * avg_price
        current_value = qty * current_price
        pnl = current_value - invested_amount
        pnl_pct = (pnl / invested_amount * 100) if invested_amount > 0 else 0.0

        vol_info = _compute_volatility_risk(prices)

        results.append({
            "symbol": symbol,
            "name": symbol_obj.name if hasattr(symbol_obj, "name") else symbol,
            "quantity": qty,
            "avg_price": round(avg_price, 2),
            "current_price": round(current_price, 2),
            "invested_amount": round(invested_amount, 2),
            "current_value": round(current_value, 2),
            "pnl": round(pnl, 2),
            "pnl_pct": round(pnl_pct, 2),
            "volatility_pct": vol_info["volatility_pct"],
            "risk_bucket": vol_info["risk_bucket"],
        })

        total_invested += invested_amount
        total_value += current_value

    total_pnl = total_value - total_invested
    total_pnl_pct = (total_pnl / total_invested * 100) if total_invested > 0 else 0.0

    # simple portfolio health score (0–100)
    # lower volatility & positive P/L increases score
    base_score = 50.0
    if total_pnl_pct > 0:
        base_score += min(total_pnl_pct, 25)   # cap gain impact
    else:
        base_score += max(total_pnl_pct, -25)  # negative impact

    # cap & floor
    portfolio_score = max(0, min(100, round(base_score, 1)))

    return {
        "holdings": results,
        "total_invested": round(total_invested, 2),
        "total_value": round(total_value, 2),
        "total_pnl": round(total_pnl, 2),
        "total_pnl_pct": round(total_pnl_pct, 2) if total_invested > 0 else 0.0,
        "portfolio_score": portfolio_score,
    }
