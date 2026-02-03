"""
Feature Engineering
-------------------
Transforms raw market data into model‑ready features.
This module is imported by the Predictor and Backtester.
"""

import pandas as pd
from core.indicators.rsi import compute_rsi


def build_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Build model-ready features from OHLCV data.

    Parameters
    ----------
    df : pd.DataFrame
        Must contain at least a 'close' column.

    Returns
    -------
    pd.DataFrame
        DataFrame with engineered features.
    """

    df = df.copy()

    # --- Basic safety check ---
    if "close" not in df.columns:
        raise ValueError("DataFrame must contain a 'close' column")

    # --- RSI ---
    df["rsi"] = compute_rsi(df["close"])

    # --- Moving Averages ---
    df["ma_20"] = df["close"].rolling(20).mean()
    df["ma_50"] = df["close"].rolling(50).mean()

    # --- Momentum ---
    df["momentum_5"] = df["close"].pct_change(5)

    # --- Volatility ---
    df["volatility_20"] = df["close"].pct_change().rolling(20).std()

    # --- Price-to-MA ratios ---
    df["price_over_ma20"] = df["close"] / df["ma_20"]
    df["price_over_ma50"] = df["close"] / df["ma_50"]

    # --- Drop rows with NaN (from rolling windows) ---
    df = df.dropna()

    return df
