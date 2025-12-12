from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Your PostgreSQL database connection
DATABASE_URL = "postgresql://postgres:Vishal123%40@localhost:5432/ai_market_db"

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


# ⭐ REQUIRED FOR FastAPI DEPENDENCY
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
