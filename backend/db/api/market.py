from fastapi import APIRouter
from core.data.market_data import MarketData

router = APIRouter()
market = MarketData()

@router.get("/price")
def get_price(symbol: str = "BTC-EUR"):
    price = market.get_live_price(symbol)
    return {"symbol": symbol, "price": price}

# ⭐ This is the endpoint your frontend expects
@router.get("/candles")
def get_candles(
    symbol: str = "BTC-EUR",
    interval: str = "1h",
    limit: int = 200
):
    df = market.get_historical_data(symbol, interval, limit=limit)
    return {"candles": df.to_dict(orient="records")}

@router.get("/market/price")
def get_price(symbol: str = "BTC-EUR"):
    price = load_price(symbol)
    return {"symbol": symbol, "price": price}
