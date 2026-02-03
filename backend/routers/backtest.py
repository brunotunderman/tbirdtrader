from fastapi import APIRouter, Query
from core.market.data_loader import load_historical_data
from core.backtesting.backtester import Backtester

router = APIRouter()


@router.get("/run")
def run_backtest(symbol: str = Query("BTC-EUR", description="Trading pair symbol")):
    """
    Run a full backtest for the given symbol.
    Returns metrics, equity curve, trades, and step-by-step results.
    """
    try:
        df = load_historical_data(symbol)
        bt = Backtester()
        result = bt.run(df, symbol=symbol)

        return {
            "symbol": symbol,
            "metrics": result["metrics"],
            "equity_curve": result["equity_curve"],
            "trades": result["trades"],
            "results": result["results"],
        }

    except Exception as e:
        return {"error": str(e)}

