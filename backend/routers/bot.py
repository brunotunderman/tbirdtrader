from fastapi import APIRouter
from backend.services.bot_engine import bot

router = APIRouter(tags=["Bot"])


@router.post("/start")
async def start_bot():
    await bot.start()
    return {"running": bot.running}


@router.post("/stop")
async def stop_bot():
    await bot.stop()
    return {"running": bot.running}


@router.get("/status")
async def bot_status():
    return {
        "running": bot.running,
        "trades_today": bot.trades_today,
        "trades_this_week": bot.trades_this_week,
        "max_trades_per_day": bot.max_trades_per_day,
        "max_trades_per_week": bot.max_trades_per_week,
    }


@router.get("/log")
async def bot_log():
    return {"log": bot.log}

