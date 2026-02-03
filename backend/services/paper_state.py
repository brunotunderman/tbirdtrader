# paper_state.py

from typing import Dict, List
from datetime import datetime
from uuid import uuid4

class PaperTradingState:
    def __init__(self):
        self.balances: Dict[str, float] = {
            "EUR": 10000.0,
            "BTC": 0.0
        }
        self.positions: List[dict] = []
        self.trade_history: List[dict] = []

    def snapshot(self):
        return {
            "balances": self.balances,
            "positions": self.positions,
            "trade_history": self.trade_history
        }

    def add_trade(self, symbol, side, amount, price):
        trade = {
            "id": str(uuid4()),
            "symbol": symbol,
            "side": side,
            "amount": amount,
            "price": price,
            "timestamp": datetime.utcnow().isoformat()
        }
        self.trade_history.append(trade)
        return trade

# Global instance
paper_state = PaperTradingState()
