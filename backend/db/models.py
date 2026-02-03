from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class Trade(Base):
    __tablename__ = "trades"

    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String)
    side = Column(String)
    amount = Column(Float)
    price = Column(Float)
    timestamp = Column(DateTime)
