from dataclasses import dataclass, field
from typing import Optional, List


@dataclass
class Trade:
    timestamp: str
    symbol: str
    side: str          # "BUY" or "SELL"
    size: float
    price: float
    pnl: float = 0.0


@dataclass
class Position:
    symbol: str
    side: Optional[str] = None      # "LONG", "SHORT", or None
    size: float = 0.0
    entry_price: float = 0.0
    unrealized_pnl: float = 0.0
    realized_pnl: float = 0.0


class PositionManager:
    def __init__(self):
        self.position: Optional[Position] = None
        self.trades: List[Trade] = []

    def _open_position(self, timestamp: str, symbol: str, side: str, size: float, price: float):
        pos_side = "LONG" if side == "BUY" else "SHORT"
        self.position = Position(
            symbol=symbol,
            side=pos_side,
            size=size,
            entry_price=price,
            unrealized_pnl=0.0,
            realized_pnl=0.0
        )

    def _close_position(self, timestamp: str, price: float):
        if not self.position:
            return 0.0

        pos = self.position
        if pos.side == "LONG":
            pnl = (price - pos.entry_price) * pos.size
        else:  # SHORT
            pnl = (pos.entry_price - price) * pos.size

        pos.realized_pnl += pnl
        self.position = None
        return pnl

    def update_unrealized(self, price: float):
        if not self.position:
            return 0.0

        pos = self.position
        if pos.side == "LONG":
            pos.unrealized_pnl = (price - pos.entry_price) * pos.size
        else:
            pos.unrealized_pnl = (pos.entry_price - price) * pos.size

        return pos.unrealized_pnl

    def execute_signal(self, timestamp: str, symbol: str, signal: str, size: float, price: float):
        """
        Basic position logic:
        - If flat and signal is BUY/SELL → open position
        - If in position and signal flips (LONG→SELL or SHORT→BUY) → close and reverse
        - If HOLD → do nothing
        """
        realized_pnl = 0.0

        if signal == "HOLD" or size <= 0:
            self.update_unrealized(price)
            return realized_pnl

        # No open position → open one
        if not self.position:
            self._open_position(timestamp, symbol, signal, size, price)
            self.trades.append(Trade(timestamp, symbol, signal, size, price, pnl=0.0))
            return realized_pnl

        # Existing position
        pos = self.position

        # Same direction → for now, do nothing (could scale in/out later)
        if (pos.side == "LONG" and signal == "BUY") or (pos.side == "SHORT" and signal == "SELL"):
            self.update_unrealized(price)
            return realized_pnl

        # Opposite direction → close and reverse
        realized_pnl = self._close_position(timestamp, price)
        self.trades.append(Trade(timestamp, symbol, "CLOSE", pos.size, price, pnl=realized_pnl))

        # Open new position in opposite direction
        self._open_position(timestamp, symbol, signal, size, price)
        self.trades.append(Trade(timestamp, symbol, signal, size, price, pnl=0.0))

        return realized_pnl
