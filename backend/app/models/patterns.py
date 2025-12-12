from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime
from app.db import Base

class PatternSignal(Base):
    __tablename__ = "pattern_signals"

    id = Column(Integer, primary_key=True, index=True)
    symbol_id = Column(Integer, index=True)
    symbol = Column(String, index=True)
    pattern_type = Column(String, index=True)
    confidence = Column(Float)
    timeframe = Column(String, default="1D")
    detected_at = Column(DateTime, default=datetime.utcnow)
