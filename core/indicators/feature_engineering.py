"""
Feature Engineering
-------------------
Builds model-ready features from market data and indicators.
"""

import pandas as pd
from core.indicators.rsi import compute_rsi

def build_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Add technical indicators and engineered features.
    """
    df = df.copy()

    # RSI
    df["rsi"] = compute_rsi(df["close"])

    # Moving averages
    df["ma_20"] = df["close"].rolling(20).mean()
    df["ma_50"] = df["close"].rolling(50).mean()

    # Momentum
    df["momentum"] = df["close"].pct_change(5)

    # Volatility
    df["volatility"] = df["close"].pct_change().rolling(20).std()

    # TODO: Add Fear & Greed
    # TODO: Add volume-based features

    df = df.dropna()
    return df
