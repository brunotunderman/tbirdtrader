from fastapi import APIRouter
from pydantic import BaseModel, Field

router = APIRouter()

class TradeRequest(BaseModel):
    symbol: str = Field(..., example="BTC-EUR")
    side: str = Field(..., example="BUY")
    amount: float = Field(..., example=0.01)
    price: float | None = Field(None, example=30000.0)


@router.post("/execute")
def execute_trade(request: TradeRequest):
    """
    Mock trade execution endpoint.
    """
    try:
        trade = {
            "symbol": request.symbol.upper(),
            "side": request.side.upper(),
            "amount": request.amount,
            "price": request.price if request.price is not None else 0.0,
            "status": "executed"
        }

        return trade

    except Exception as e:
        return {"error": str(e)}
