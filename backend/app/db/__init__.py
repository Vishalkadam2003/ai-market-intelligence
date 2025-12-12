from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from .database import Base, engine, SessionLocal, get_db

DATABASE_URL = "postgresql://postgres:Vishal123%40@localhost:5432/ai_market_db"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
