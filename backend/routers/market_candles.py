from fastapi import APIRouter, HTTPException, Query
import aiohttp
from datetime import datetime, timedelta

router = APIRouter()

# Coinbase granularity options (in seconds)
VALID_GRANULARITIES = [60, 300, 900, 3600, 21600, 86400]


@router.get("/market/candles")
async def get_candles(
    symbol: str = Query(..., description="Trading pair, e.g. BTC-EUR"),
    granularity: int = Query(300, description="Candle size in seconds"),
    limit: int = Query(200, description="Number of candles")
):
    if granularity not in VALID_GRANULARITIES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid granularity. Allowed: {VALID_GRANULARITIES}"
        )

    end_time = datetime.utcnow()
    start_time = end_time - timedelta(seconds=granularity * limit)

    url = (
        f"https://api.exchange.coinbase.com/products/{symbol}/candles"
        f"?granularity={granularity}"
        f"&start={start_time.isoformat()}"
        f"&end={end_time.isoformat()}"
    )

    async with aiohttp.ClientSession() as session:
        async with session.get(url) as resp:
            if resp.status != 200:
                raise HTTPException(
                    status_code=resp.status,
                    detail=f"Coinbase error: {await resp.text()}"
                )

            raw = await resp.json()

    # Coinbase returns: [time, low, high, open, close, volume]
    candles = [
        {
            "timestamp": c[0],
            "open": c[3],
            "high": c[2],
            "low": c[1],
            "close": c[4],
            "volume": c[5],
        }
        for c in raw
    ]

    return {"candles": candles}
