import requests
import pandas as pd
from datetime import datetime

COINBASE_SPOT_URL = "https://api.coinbase.com/v2/prices/{symbol}/spot"
COINBASE_CANDLES_URL = "https://api.exchange.coinbase.com/products/{symbol}/candles"


def load_price(symbol: str) -> float:
    """
    Loads the latest spot price from Coinbase.
    Example symbol: BTC-EUR
    """
    url = COINBASE_SPOT_URL.format(symbol=symbol)
    data = requests.get(url).json()

    return float(data["data"]["amount"])


def load_historical_data(
    symbol: str,
    granularity: int = 60,  # 1-minute candles
    limit: int = 300        # Coinbase returns up to 300 candles
) -> pd.DataFrame:
    """
    Loads historical OHLCV candles from Coinbase.
    Output format matches your frontend expectations.
    """

    url = COINBASE_CANDLES_URL.format(symbol=symbol)
    params = {"granularity": granularity}

    raw = requests.get(url, params=params).json()

    if not isinstance(raw, list) or len(raw) == 0:
        raise ValueError(f"No candle data returned for {symbol}")

    # Coinbase format: [ time, low, high, open, close, volume ]
    df = pd.DataFrame(
        raw,
        columns=["timestamp", "low", "high", "open", "close", "volume"]
    )

    # Coinbase returns newest → oldest, so reverse
    df = df.iloc[::-1].reset_index(drop=True)

    # Convert timestamp to int (seconds)
    df["timestamp"] = df["timestamp"].astype(int)

    # Ensure numeric types
    for col in ["open", "high", "low", "close", "volume"]:
        df[col] = df[col].astype(float)

    return df
