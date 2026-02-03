from fastapi import APIRouter

from backend.services.paper_trading import trade_history

router = APIRouter()

@router.get("/paper/trades/last")
async def last_trade():
    if not trade_history:
        return None
    return trade_history[-1]

