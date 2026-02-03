"""
RSI Indicator
-------------
Computes Relative Strength Index for a price series.
"""

import pandas as pd

def compute_rsi(prices: pd.Series, period: int = 14) -> pd.Series:
    """
    Compute RSI values.
    """
    delta = prices.diff()
    gain = delta.clip(lower=0)
    loss = -delta.clip(upper=0)

    avg_gain = gain.rolling(period).mean()
    avg_loss = loss.rolling(period).mean()

    rs = avg_gain / avg_loss.replace(0, 1e-10)
    rsi = 100 - (100 / (1 + rs))

    return rsi
