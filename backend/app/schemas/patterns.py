# app/schemas/patterns.py
from datetime import datetime
from pydantic import BaseModel
from typing import List

class PatternOut(BaseModel):
    type: str
    confidence: float

class PatternResponse(BaseModel):
    symbol: str
    patterns: List[PatternOut]
    detected_at: datetime | None = None

class Config:
    from_attributes = True

