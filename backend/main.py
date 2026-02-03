from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import traceback
import logging
import pandas as pd

# ---------------------------------------------------------
# App setup
# ---------------------------------------------------------
app = FastAPI(
    title="AI Trading Backend",
    version="1.0.0",
    debug=True
)

logging.basicConfig(level=logging.INFO)

# ---------------------------------------------------------
# Debug middleware
# ---------------------------------------------------------
@app.middleware("http")
async def debug_middleware(request, call_next):
    try:
        return await call_next(request)
    except Exception as e:
        print("\n\n🔥 REAL ERROR BELOW 🔥")
        traceback.print_exc()
        print("🔥 END REAL ERROR 🔥\n\n")
        return JSONResponse(
            status_code=500,
            content={"error": str(e)}
        )

# ---------------------------------------------------------
# CORS
# ---------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------
# Routers
# ---------------------------------------------------------
from backend.routers.market import router as market_router
from backend.routers.backtest import router as backtest_router
from backend.routers.model import router as model_router
from backend.routers.trade import router as trade_router
from backend.routers.portfolio import router as portfolio_router
from backend.routers.auth import router as auth_router
from backend.routers.paper import router as paper_router
from backend.routers.bot import router as bot_router
import backend.api.compare as compare

from backend.routers.paper_pnl import router as pnl_router
from backend.routers.paper_trades_today import router as trades_today_router
from backend.routers.paper_trades_last import router as trades_last_router
from backend.routers.market_orderbook import router as orderbook_router

# ---------------------------------------------------------
# NEW: Real Candlestick Data Endpoint
# ---------------------------------------------------------
from core.data.market_data import MarketData

candles_router = APIRouter()
market = MarketData()


@candles_router.get("/candles")
async def get_candles(
    symbol: str = "BTC-EUR",
    interval: str = "1m",
    limit: int = 200
):
    # ⭐ THIS WAS THE MISSING PIECE ⭐
    df = market.get_historical_data(symbol, interval, limit=limit)

    # ---------------------------------------------------------
    # 1. Normalize timestamp column
    # ---------------------------------------------------------
    if "timestamp" not in df.columns:
        df = df.reset_index()

    rename_map = {}
    for col in df.columns:
        if col.lower() in ["time", "timestamp", "date"]:
            rename_map[col] = "timestamp"
    df = df.rename(columns=rename_map)

    if "timestamp" not in df.columns:
        raise ValueError("No timestamp column found in market data")

    # Convert timestamps to UNIX seconds safely
    def to_unix(ts):
        if hasattr(ts, "timestamp"):
            return int(ts.timestamp())
        try:
            return int(ts)
        except Exception:
            return int(pd.to_datetime(ts).timestamp())

    df["timestamp"] = df["timestamp"].apply(to_unix)

    # ---------------------------------------------------------
    # 2. Build OHLC candles (fallback if only close exists)
    # ---------------------------------------------------------
    candles = []
    prev_close = None

    has_ohlc = all(col in df.columns for col in ["open", "high", "low"])

    for _, row in df.iterrows():
        ts = int(row["timestamp"])
        close = float(row["close"])

        if has_ohlc:
            open_price = float(row["open"])
            high = float(row["high"])
            low = float(row["low"])
        else:
            open_price = prev_close if prev_close is not None else close
            high = max(open_price, close)
            low = min(open_price, close)

        candles.append({
            "timestamp": ts,
            "open": open_price,
            "high": high,
            "low": low,
            "close": close,
        })

        prev_close = close

    candles.sort(key=lambda x: x["timestamp"])

    # ---------------------------------------------------------
    # 3. Simple prediction mock
    # ---------------------------------------------------------
    last_timestamp = candles[-1]["timestamp"]
    last_close = candles[-1]["close"]

    prediction = []
    for i in range(10):
        future_ts = last_timestamp + (i + 1) * 60
        base = last_close + (i + 1) * 0.1
        prediction.append({
            "timestamp": future_ts,
            "price": base,
            "high": base + 0.3,
            "low": base - 0.3,
        })

    return {"candles": candles, "prediction": prediction}


# ---------------------------------------------------------
# Router registration
# ---------------------------------------------------------
app.include_router(market_router, prefix="/market", tags=["Market Data"])
app.include_router(backtest_router, prefix="/backtest", tags=["Backtesting"])
app.include_router(model_router, prefix="/model", tags=["Model"])
app.include_router(trade_router, prefix="/trade", tags=["Trading"])
app.include_router(portfolio_router, prefix="/portfolio", tags=["Portfolio"])
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(compare.router, prefix="/compare", tags=["Model Comparison"])
app.include_router(paper_router, prefix="/paper", tags=["Paper Trading"])
app.include_router(bot_router, prefix="/bot", tags=["Bot"])

app.include_router(pnl_router, tags=["Paper Trading"])
app.include_router(trades_today_router, tags=["Paper Trading"])
app.include_router(trades_last_router, tags=["Paper Trading"])
app.include_router(orderbook_router, prefix="/market", tags=["Market Data"])
app.include_router(candles_router, prefix="/market", tags=["Market Data"])


# ---------------------------------------------------------
# Root
# ---------------------------------------------------------
@app.get("/")
def root():
    return {"status": "ok", "message": "AI Trading Backend is running"}
