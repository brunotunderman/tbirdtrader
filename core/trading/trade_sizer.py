"""
Trade Sizer
-----------
Determines how large a trade should be based on capital and model signal.
"""

class TradeSizer:
    def __init__(self, risk_pct: float = 2.0):
        """
        risk_pct: percentage of capital to risk per trade.
        """
        self.risk_pct = risk_pct

    def compute_size(self, capital: float, signal: dict) -> float:
        """
        Compute trade size based on capital and model signal.

        signal example:
        {
            "signal": "BUY",
            "confidence": 0.65,
            "expected_return": 0.012
        }
        """
        if signal["signal"] == "HOLD":
            return 0.0

        # Basic sizing: risk % * confidence
        size = capital * (self.risk_pct / 100) * signal["confidence"]

        return round(size, 2)
