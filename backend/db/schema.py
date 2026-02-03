from pydantic import BaseModel

class TradeSchema(BaseModel):
    symbol: str
    side: str
    amount: float
    price: float

    class Config:
        orm_mode = True
