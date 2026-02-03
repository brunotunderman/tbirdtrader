from fastapi import APIRouter
from datetime import datetime, date

from backend.services.paper_trading import trade_history

router = APIRouter()

@router.get("/paper/trades/today")
async def trades_today():
    today = date.today()
    count = 0

    for trade in trade_history:
        ts = datetime.fromisoformat(trade["timestamp"]).date()
        if ts == today:
            count += 1

    return {"count": count}

