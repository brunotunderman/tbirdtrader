from fastapi import APIRouter
from core.data.market_data import MarketData  # <-- you forgot this import
from core.market.data_loader import load_price

router = APIRouter()

# IMPORTANT: define the MarketData instance
market = MarketData()

@router.get("/price")
def get_price(symbol: str = "BTC-EUR"):
    return {"symbol": symbol, "price": load_price(symbol)}

@router.get("/historical")
def get_historical(symbol: str = "BTC-EUR", interval: str = "1h"):
    df = market.get_historical_data(symbol, interval)
    return {"candles": df.to_dict(orient="records")}
