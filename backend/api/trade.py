from fastapi import APIRouter
from core.trading.trade_executor import TradeExecutor

router = APIRouter()
executor = TradeExecutor()

@router.post("/execute")
def execute(side: str, amount: float, symbol: str = "BTC-EUR"):
    result = executor.execute_trade(side, amount, symbol)
    return result
