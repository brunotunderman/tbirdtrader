from fastapi import APIRouter, HTTPException
import aiohttp

router = APIRouter()

@router.get("/orderbook")
async def orderbook(symbol: str):
    url = f"https://api.exchange.coinbase.com/products/{symbol}/book?level=1"

    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(url, timeout=10) as resp:
                if resp.status != 200:
                    raise HTTPException(status_code=resp.status, detail="Coinbase error")

                data = await resp.json()

                best_bid = float(data["bids"][0][0])
                best_ask = float(data["asks"][0][0])

                return {
                    "best_bid": best_bid,
                    "best_ask": best_ask,
                }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
