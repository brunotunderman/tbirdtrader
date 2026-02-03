import requests
import pandas as pd
from typing import Optional


# ---------------------------------------------------------
# Base Provider Interface
# ---------------------------------------------------------
class ExchangeProvider:
    def get_ohlc(self, symbol: str, interval: str, limit: int = 200) -> pd.DataFrame:
        raise NotImplementedError


# ---------------------------------------------------------
# Binance Provider
# ---------------------------------------------------------
class BinanceProvider(ExchangeProvider):
    INTERVAL_MAP = {
        "1m": "1m",
        "5m": "5m",
        "15m": "15m",
        "1h": "1h",
        "4h": "4h",
        "1d": "1d",
    }

    def get_ohlc(self, symbol: str, interval: str, limit: int = 200) -> pd.DataFrame:
        binance_symbol = symbol.replace("-", "")

        url = "https://api.binance.com/api/v3/klines"
        params = {
            "symbol": binance_symbol,
            "interval": self.INTERVAL_MAP.get(interval, "1m"),
            "limit": min(limit, 1000),
        }

        resp = requests.get(url, params=params)
        resp.raise_for_status()
        data = resp.json()

        df = pd.DataFrame(data, columns=[
            "open_time", "open", "high", "low", "close", "volume",
            "close_time", "qav", "num_trades", "taker_base",
            "taker_quote", "ignore"
        ])

        df["timestamp"] = df["open_time"] // 1000
        df["open"] = df["open"].astype(float)
        df["high"] = df["high"].astype(float)
        df["low"] = df["low"].astype(float)
        df["close"] = df["close"].astype(float)

        return df[["timestamp", "open", "high", "low", "close"]]

    def get_ohlc_paginated(self, symbol: str, interval: str, limit: int) -> pd.DataFrame:
        binance_symbol = symbol.replace("-", "")
        url = "https://api.binance.com/api/v3/klines"

        all_rows = []
        remaining = limit
        end_time = None

        while remaining > 0:
            batch = min(1000, remaining)

            params = {
                "symbol": binance_symbol,
                "interval": self.INTERVAL_MAP.get(interval, "1d"),
                "limit": batch,
            }

            if end_time is not None:
                params["endTime"] = end_time

            resp = requests.get(url, params=params)
            resp.raise_for_status()
            data = resp.json()

            if not data:
                break

            all_rows.extend(data)

            end_time = data[0][0] - 1
            remaining -= batch

        if not all_rows:
            return pd.DataFrame(columns=["timestamp", "open", "high", "low", "close"])

        df = pd.DataFrame(all_rows, columns=[
            "open_time", "open", "high", "low", "close", "volume",
            "close_time", "qav", "num_trades", "taker_base",
            "taker_quote", "ignore"
        ])

        df["timestamp"] = df["open_time"] // 1000
        df["open"] = df["open"].astype(float)
        df["high"] = df["high"].astype(float)
        df["low"] = df["low"].astype(float)
        df["close"] = df["close"].astype(float)

        return df[["timestamp", "open", "high", "low", "close"]]


# ---------------------------------------------------------
# Coinbase Provider
# ---------------------------------------------------------
class CoinbaseProvider(ExchangeProvider):
    INTERVAL_MAP = {
        "1m": 60,
        "5m": 300,
        "15m": 900,
        "1h": 3600,
        "6h": 21600,
        "1d": 86400,
    }

    def get_ohlc(self, symbol: str, interval: str, limit: int = 200) -> pd.DataFrame:
        granularity = self.INTERVAL_MAP.get(interval, 60)

        url = f"https://api.exchange.coinbase.com/products/{symbol}/candles"
        params = {"granularity": granularity}

        resp = requests.get(url, params=params)
        resp.raise_for_status()
        data = resp.json()

        df = pd.DataFrame(data, columns=[
            "timestamp", "low", "high", "open", "close", "volume"
        ])

        df["timestamp"] = df["timestamp"].astype(int)

        return df[["timestamp", "open", "high", "low", "close"]]


# ---------------------------------------------------------
# Kraken Provider
# ---------------------------------------------------------
class KrakenProvider(ExchangeProvider):
    INTERVAL_MAP = {
        "1m": 1,
        "5m": 5,
        "15m": 15,
        "1h": 60,
        "4h": 240,
        "1d": 1440,
    }

    def get_ohlc(self, symbol: str, interval: str, limit: int = 200) -> pd.DataFrame:
        kraken_symbol = symbol.replace("-", "")

        url = "https://api.kraken.com/0/public/OHLC"
        params = {
            "pair": kraken_symbol,
            "interval": self.INTERVAL_MAP.get(interval, 1)
        }

        resp = requests.get(url, params=params)
        resp.raise_for_status()
        data = resp.json()

        key = list(data["result"].keys())[0]
        rows = data["result"][key]

        df = pd.DataFrame(rows, columns=[
            "timestamp", "open", "high", "low", "close",
            "vwap", "volume", "count"
        ])

        df["timestamp"] = df["timestamp"].astype(int)
        df["open"] = df["open"].astype(float)
        df["high"] = df["high"].astype(float)
        df["low"] = df["low"].astype(float)
        df["close"] = df["close"].astype(float)

        return df[["timestamp", "open", "high", "low", "close"]]


# ---------------------------------------------------------
# Main MarketData Orchestrator
# ---------------------------------------------------------
class MarketData:
    def __init__(self, source: str = "coinbase"):
        providers = {
            "binance": BinanceProvider(),
            "coinbase": CoinbaseProvider(),
            "kraken": KrakenProvider(),
        }

        if source not in providers:
            raise ValueError(f"Unknown market data source: {source}")

        self.provider = providers[source]

    def get_historical_data(
        self,
        symbol: str,
        interval: str = "1m",
        start: Optional[str] = None,
        end: Optional[str] = None,
        limit: int = 200,
    ) -> pd.DataFrame:

        # Force Binance for long-range daily data
        if interval == "1d" and limit > 1000:
            return BinanceProvider().get_ohlc_paginated(symbol, interval, limit)

        return self.provider.get_ohlc(symbol, interval, limit)
