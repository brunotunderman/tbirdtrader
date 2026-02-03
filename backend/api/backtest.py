from fastapi import APIRouter
from core.backtesting.backtester import Backtester
from core.data.market_data import MarketData

router = APIRouter()
market = MarketData()

@router.get("/run")
def run_backtest(symbol: str = "BTC-EUR"):
    df = market.get_historical_data(symbol)
    bt = Backtester()
    results = bt.run(df)
    return results.to_dict(orient="records")
