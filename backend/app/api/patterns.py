# app/api/patterns.py
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from datetime import datetime
import pandas as pd

from app.db import get_db
from app.models.prices import Price
from app.models.patterns import PatternSignal
from app.schemas.patterns import PatternResponse, PatternOut
from app.services.pattern_engine import analyze_patterns

router = APIRouter(prefix="/api/patterns", tags=["patterns"])


@router.get("/{symbol}", response_model=PatternResponse)
def get_patterns_for_symbol(
    symbol: str,
    mode: str = Query("cached", pattern="^(cached|live)$"),
    db: Session = Depends(get_db),
):
    symbol = symbol.upper()

    # -------------------------------------
    # LIVE MODE
    # -------------------------------------
    if mode == "live":
        prices = (
            db.query(Price)
            .filter(Price.symbol_id == None)  # FIX THIS IF YOU USE symbol_id
            .all()
        )

        prices = (
            db.query(Price)
            .filter(Price.symbol == symbol)
            .order_by(Price.date.asc())
            .all()
        )

        if not prices:
            raise HTTPException(status_code=404, detail="No price data found")

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

        result = analyze_patterns(symbol, df)

        return PatternResponse(
            symbol=symbol,
            patterns=[PatternOut(**p) for p in result["patterns"]],
            detected_at=datetime.utcnow(),
        )

    # -------------------------------------
    # CACHED MODE
    # -------------------------------------
    latest = (
        db.query(PatternSignal)
        .filter(PatternSignal.symbol == symbol)
        .order_by(PatternSignal.detected_at.desc())
        .all()
    )

    if latest:
        return PatternResponse(
            symbol=symbol,
            patterns=[
                PatternOut(type=s.pattern_type, confidence=s.confidence)
                for s in latest
            ],
            detected_at=latest[0].detected_at,
        )

    # -------------------------------------
    # FALLBACK TO LIVE IF NO CACHE
    # -------------------------------------

    prices = (
        db.query(Price)
        .filter(Price.symbol == symbol)
        .order_by(Price.date.asc())
        .all()
    )

    if not prices:
        raise HTTPException(status_code=404, detail="No pattern or price data")

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

    result = analyze_patterns(symbol, df)

    return PatternResponse(
        symbol=symbol,
        patterns=[PatternOut(**p) for p in result["patterns"]],
        detected_at=datetime.utcnow(),
    )
