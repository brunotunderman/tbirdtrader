# backend/main.py
from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any, Literal, Optional
import time
import math
import random
import httpx

app = FastAPI(
    title="TbirdTrader Backend",
    version="1.0.0",
    description="Serves real Binance candles and demo endpoints for the trading dashboard.",
)

# ------------------------------------------------------------------------------
# CORS (relax for local dev; tighten allow_origins in production)
# ------------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # e.g. ["http://localhost:3000"] in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------------------------------------------------------------------
# Health
# ------------------------------------------------------------------------------
@app.get("/health")
def health() -> Dict[str, str]:
    return {"status": "ok"}

# ------------------------------------------------------------------------------
# Intervals & Types
# ------------------------------------------------------------------------------
Interval = Literal[
    "1m", "3m", "5m", "15m", "30m",
    "1h", "2h", "4h", "6h", "8h", "12h",
    "1d", "3d", "1w", "1M"
]

# Binance supports many; we at least map those we use: 5m / 1h / 4h / 1d (+ others)
BINANCE_INTERVAL_MAP: Dict[str, str] = {
    "1m": "1m",
    "3m": "3m",
    "5m": "5m",
    "15m": "15m",
    "30m": "30m",
    "1h": "1h",
    "2h": "2h",
    "4h": "4h",
    "6h": "6h",
    "8h": "8h",
    "12h": "12h",
    "1d": "1d",
    "3d": "3d",
    "1w": "1w",
    "1M": "1M",
}

# ------------------------------------------------------------------------------
# /paper/candles — REAL candles from Binance (BTCEUR)
# ------------------------------------------------------------------------------
@app.get("/paper/candles")
async def get_candles(
    symbol: str = Query(default="BTC-EUR", description="Trading pair label, e.g. BTC-EUR"),
    interval: Interval = Query(default="1m", description="Bar interval"),
    limit: int = Query(default=200, ge=1, le=1000, description="Number of candles (Binance max 1000)"),
) -> List[Dict[str, Any]]:
    """
    Returns real market candles from Binance, mapped to your frontend shape:

      [
        {"timestamp": <epoch_seconds>, "open": float, "high": float, "low": float, "close": float},
        ...
      ]

    Sorted ascending by timestamp.
    """
    if interval not in BINANCE_INTERVAL_MAP:
        raise HTTPException(status_code=400, detail=f"Unsupported interval: {interval}")

    # Binance uses no hyphen in symbol, e.g. "BTCEUR" not "BTC-EUR"
    binance_symbol = symbol.replace("-", "")
    binance_interval = BINANCE_INTERVAL_MAP[interval]

    url = (
        "https://api.binance.com/api/v3/klines"
        f"?symbol={binance_symbol}&interval={binance_interval}&limit={limit}"
    )

    try:
        async with httpx.AsyncClient(timeout=20.0) as client:
            resp = await client.get(url)
            resp.raise_for_status()
            data = resp.json()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch Binance data: {e}")

    # Binance klines format:
    # [
    #   [
    #     0 open time (ms),
    #     1 open,
    #     2 high,
    #     3 low,
    #     4 close,
    #     5 volume,
    #     6 close time (ms),
    #     ...
    #   ],
    #   ...
    # ]
    candles: List[Dict[str, Any]] = []
    for row in data:
        try:
            candles.append({
                "timestamp": int(row[0] // 1000),  # open time ms -> seconds
                "open": float(row[1]),
                "high": float(row[2]),
                "low": float(row[3]),
                "close": float(row[4]),
            })
        except Exception:
            # Skip malformed rows
            continue

    # Ensure ascending
    candles.sort(key=lambda x: x["timestamp"])
    return candles

# ------------------------------------------------------------------------------
# /paper/account — matches BalancesCard (demo/mocked values, stable shape)
# ------------------------------------------------------------------------------
_eur_balance = 1234.56
_btc_balance = 0.05231

@app.get("/paper/account")
def get_account() -> Dict[str, Any]:
    global _eur_balance, _btc_balance
    # Small wobble for demo effect (optional)
    _eur_balance = max(0.0, _eur_balance + random.uniform(-5.0, 5.0))
    _btc_balance = max(0.0, _btc_balance + random.uniform(-0.00001, 0.00001))
    # If your real account endpoint includes trade_history, you can add it here.
    # For now, return balances only (your TradeHistory component has been updated to its own source).
    return {
        "balances": {
            "EUR": round(_eur_balance, 2),
            "BTC": float(f"{_btc_balance:.8f}"),
        }
    }

# ------------------------------------------------------------------------------
# /paper/positions — matches OpenPositions (demo/mocked)
# ------------------------------------------------------------------------------
@app.get("/paper/positions")
def get_positions() -> List[Dict[str, Any]]:
    now = int(time.time())
    positions = [
        {
            "id": 1,
            "symbol": "BTC-EUR",
            "size": 0.015,
            "entry_price": 59850.25,
            "pnl": random.uniform(-25.0, 45.0),
            "timestamp": now - 3600,
        },
        {
            "id": 2,
            "symbol": "BTC-EUR",
            "size": 0.010,
            "entry_price": 60210.75,
            "pnl": random.uniform(-15.0, 30.0),
            "timestamp": now - 1800,
        },
    ]
    return positions

# ------------------------------------------------------------------------------
# /paper/trades — matches TradeHistory (demo/mocked)
# ------------------------------------------------------------------------------
@app.get("/paper/trades")
def get_trades() -> List[Dict[str, Any]]:
    now = int(time.time())
    trades = [
        {"id": 101, "side": "BUY",  "amount": 0.005, "price": 60012.12, "timestamp": (now - 7200)},
        {"id": 102, "side": "SELL", "amount": 0.003, "price": 60105.50, "timestamp": (now - 5600)},
        {"id": 103, "side": "BUY",  "amount": 0.004, "price": 59975.90, "timestamp": (now - 4200)},
        {"id": 104, "side": "SELL", "amount": 0.002, "price": 60088.40, "timestamp": (now - 2400)},
    ]
    return trades

# ------------------------------------------------------------------------------
# /paper/logs — matches BotLog (array of strings, ring buffer style)
# ------------------------------------------------------------------------------
_logs_ring: List[str] = [
    "Bot initialized.",
    "Connected to exchange.",
    "No trade signal (neutral).",
    "Heartbeat OK.",
]

@app.get("/paper/logs")
def get_logs() -> List[str]:
    ts = time.strftime("%H:%M:%S")
    # Rotate a new heartbeat line into the ring
    _logs_ring.append(f"[{ts}] Heartbeat OK.")
    return _logs_ring[-50:]  # cap to last 50 server-side

# ------------------------------------------------------------------------------
# /model/predict — baseline predictions for band overlay (works with frontend)
# ------------------------------------------------------------------------------
@app.get("/model/predict")
def model_predict(
    symbol: str = Query(default="BTC-EUR"),
    model: str = Query(default="baseline"),
    interval: Literal["1m", "5m", "15m", "1h", "4h", "1d"] = Query(default="1h"),
    horizon: int = Query(default=10, ge=1, le=500),
    last_price: Optional[float] = Query(default=None),
    band_pct: float = Query(default=0.01, ge=0.0, le=0.2),
) -> Dict[str, Any]:
    """
    Returns arrays used by the frontend for the prediction band:

      {
        "symbol": "BTC-EUR",
        "model": "baseline",
        "predicted_prices": [...],
        "upper_band": [...],
        "lower_band": [...]
      }

    The frontend anchors timestamps for these values after the last candle based on `interval`.
    """
    # If last_price is not provided, approximate it via a quick 1m fetch (or fallback)
    anchor = last_price
    if anchor is None:
        try:
            # Quick 1m fetch from Binance for anchor
            binance_symbol = symbol.replace("-", "")
            url = f"https://api.binance.com/api/v3/klines?symbol={binance_symbol}&interval=1m&limit=1"
            r = httpx.get(url, timeout=10.0)
            r.raise_for_status()
            arr = r.json()
            if isinstance(arr, list) and len(arr) > 0:
                anchor = float(arr[-1][4])  # close
        except Exception:
            anchor = None
    if anchor is None:
        anchor = 60000.0  # final fallback

    # Simple baseline drift + sine wiggle demo model
    predicted: List[float] = []
    for i in range(1, horizon + 1):
        drift = 0.00025 * i               # ~0.025% per step
        wiggle = 0.0035 * math.sin(i / 3.5)
        price = anchor * (1.0 + drift) * (1.0 + wiggle)
        predicted.append(float(price))

    upper = [float(p * (1.0 + band_pct)) for p in predicted]
    lower = [float(p * (1.0 - band_pct)) for p in predicted]

    return {
        "symbol": symbol,
        "model": model,
        "predicted_prices": predicted,
        "upper_band": upper,
        "lower_band": lower,
    }

# ------------------------------------------------------------------------------
# Run (local dev):
#   uvicorn main:app --host 127.0.0.1 --port 8000
# With hot-reload (watchfiles):
#   $env:UVICORN_RELOAD="watchfiles"
#   uvicorn main:app --reload --reload-dir . --host 127.0.0.1 --port 8000
# Test:
#   http://127.0.0.1:8000/health
#   http://127.0.0.1:8000/paper/candles?symbol=BTC-EUR&interval=1h&limit=168
#   http://127.0.0.1:8000/paper/account
#   http://127.0.0.1:8000/paper/positions
#   http://127.0.0.1:8000/paper/trades
#   http://127.0.0.1:8000/paper/logs
#   http://127.0.0.1:8000/model/predict?interval=1h&horizon=10
# ------------------------------------------------------------------------------