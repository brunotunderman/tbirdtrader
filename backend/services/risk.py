from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from typing import Protocol, Tuple


# --- Interfaces the RiskManager depends on --- #

class AccountRepo(Protocol):
    async def get_position_value_eur(self, symbol: str) -> float:
        ...


class TradeRepo(Protocol):
    async def get_today_realized_pnl_eur(self) -> float:
        ...

    async def get_trades_count_today(self) -> int:
        ...

    async def get_last_trade(self, symbol: str):
        ...


class MarketDataService(Protocol):
    async def get_orderbook_top(self, symbol: str) -> tuple[float, float]:
        """
        Returns (best_bid, best_ask)
        """
        ...


# --- Risk configuration --- #

@dataclass
class RiskConfig:
    max_position_eur: float
    max_daily_loss_eur: float
    max_trades_per_day: int
    trade_cooldown_seconds: int
    min_signal_confidence: float
    max_spread_pct: float


# --- Risk manager --- #

class RiskManager:
    def __init__(
        self,
        config: RiskConfig,
        account_repo: AccountRepo,
        trade_repo: TradeRepo,
        market_data: MarketDataService,
    ) -> None:
        self.config = config
        self.account_repo = account_repo
        self.trade_repo = trade_repo
        self.market_data = market_data

    async def can_open_position(
        self,
        symbol: str,
        side: str,
        size_eur: float,
        signal_conf: float,
    ) -> Tuple[bool, str]:
        """
        Returns (allowed, reason)
        """

        # 1) Signal confidence
        if signal_conf < self.config.min_signal_confidence:
            return False, "Signal confidence too low"

        # 2) Max position size
        current_pos_eur = await self.account_repo.get_position_value_eur(symbol)
        if current_pos_eur + size_eur > self.config.max_position_eur:
            return False, "Max position size exceeded"

        # 3) Max daily loss
        daily_pnl = await self.trade_repo.get_today_realized_pnl_eur()
        if daily_pnl < -self.config.max_daily_loss_eur:
            return False, "Max daily loss exceeded"

        # 4) Max trades per day
        trades_today = await self.trade_repo.get_trades_count_today()
        if trades_today >= self.config.max_trades_per_day:
            return False, "Max trades per day reached"

        # 5) Trade cooldown
        last_trade = await self.trade_repo.get_last_trade(symbol)
        if last_trade:
            # assuming last_trade has a .timestamp: datetime
            delta = datetime.utcnow() - last_trade.timestamp
            if delta.total_seconds() < self.config.trade_cooldown_seconds:
                return False, "Trade cooldown active"

        # 6) Spread check
        best_bid, best_ask = await self.market_data.get_orderbook_top(symbol)
        if best_bid and best_ask:
            spread_pct = (best_ask - best_bid) / best_bid * 100
            if spread_pct > self.config.max_spread_pct:
                return False, "Spread too wide"

        return True, "OK"


# --- Default config for now (can later be loaded from env/db/UI) --- #

DEFAULT_RISK_CONFIG = RiskConfig(
    max_position_eur=2000.0,
    max_daily_loss_eur=200.0,
    max_trades_per_day=10,
    trade_cooldown_seconds=300,  # 5 minutes
    min_signal_confidence=0.6,
    max_spread_pct=0.3,
)
