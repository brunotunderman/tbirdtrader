from fastapi import APIRouter, HTTPException
import aiohttp

router = APIRouter()

# Coinbase granularity options (in seconds)
VALID_GRANULARITIES = [60, 300, 900, 3600, 21600, 86400]


@router.get("/candles")
async def get_candles(symbol: str = "BTC-EUR", granularity: int = 300):
    """
    Returns OHLC candles for a symbol.
    Granularity options (seconds):
    60, 300, 900, 3600, 21600, 86400
    """

    if granularity not in VALID_GRANULARITIES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid granularity. Must be one of: {VALID_GRANULARITIES}"
        )

    url = (
        f"https://api.exchange.coinbase.com/products/"
        f"{symbol}/candles?granularity={granularity}"
    )

    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(url, timeout=10) as resp:
                if resp.status != 200:
                    raise HTTPException(
                        status_code=resp.status,
                        detail="Failed to fetch candles from Coinbase"
                    )

                data = await resp.json()

                # Coinbase returns:
                # [ timestamp, low, high, open, close, volume ]
                candles = [
                    {
                        "timestamp": c[0],
                        "low": c[1],
                        "high": c[2],
                        "open": c[3],
                        "close": c[4],
                        "volume": c[5],
                    }
                    for c in data
                ]

                # Reverse to chronological order (Coinbase returns newest first)
                candles.reverse()

                return {"symbol": symbol, "granularity": granularity, "candles": candles}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
