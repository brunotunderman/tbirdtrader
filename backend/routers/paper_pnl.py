from fastapi import APIRouter
from datetime import datetime, date

from backend.services.paper_trading import trade_history

router = APIRouter()

@router.get("/paper/pnl/today")
async def pnl_today():
    today = date.today()
    realized = 0.0

    for trade in trade_history:
        ts = datetime.fromisoformat(trade["timestamp"]).date()
        realized += trade.get("pnl", 0.0) if ts == today else 0.0

    return {"realized_pnl": realized}

    return {"realized_pnl": realized}
