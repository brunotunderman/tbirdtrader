from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os

# ---------------------------------------------------------
# Database URL
# ---------------------------------------------------------
# If you have a real PostgreSQL DB, replace this with:
# DATABASE_URL = "postgresql://user:password@localhost:5432/tbirdtrader"
#
# For now, we default to SQLite so the backend always boots.
# You can switch to Postgres anytime.
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./tbird.db")

# ---------------------------------------------------------
# SQLAlchemy Engine & Session
# ---------------------------------------------------------
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# ---------------------------------------------------------
# Base Model
# ---------------------------------------------------------
Base = declarative_base()

# ---------------------------------------------------------
# Dependency: DB Session
# ---------------------------------------------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
