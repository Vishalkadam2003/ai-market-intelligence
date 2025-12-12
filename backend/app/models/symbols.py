# app/models/symbols.py
from sqlalchemy import Column, Integer, String
from app.db import Base

class Symbol(Base):
    __tablename__ = "symbols"

    id = Column(Integer, primary_key=True, index=True)
    ticker = Column(String, unique=True, index=True)
    name = Column(String)
