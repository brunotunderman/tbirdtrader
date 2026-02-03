import asyncio
import aiohttp
from datetime import datetime

from backend.services.risk import RiskManager, DEFAULT_RISK_CONFIG


class AsyncBotEngine:
    def __init__(self):
        self.running = False
        self.session = None

        # Bot limits (still used for UI display)
        self.max_trades_per_day = 20
        self.max_trades_per_week = 60
        self.trades_today = 0
        self.trades_this_week = 0

        # Config
        self.symbol = "BTC-EUR"
        self.model = "baseline"

        # Log buffer
        self.log = []

        # Background task
        self._task = None

        # Risk manager (injected later when session starts)
        self.risk_manager = None

    def log_message(self, msg: str):
        timestamp = datetime.utcnow().isoformat()
        line = f"{timestamp} - {msg}"
        self.log.append(line)
        self.log = self.log[-200:]  # keep last 200 lines

    async def start(self):
        if self.running:
            return

        self.running = True
        self.session = aiohttp.ClientSession()
        self.log_message("Bot started")

        # Initialize risk manager with API-backed repos
        self.risk_manager = RiskManager(
            config=DEFAULT_RISK_CONFIG,
            account_repo=self,
            trade_repo=self,
            market_data=self,
        )

        # Launch background loop
        self._task = asyncio.create_task(self.run_loop())

    async def stop(self):
        self.running = False
        self.log_message("Bot stopping...")

        if self._task:
            self._task.cancel()
            try:
                await self._task
            except asyncio.CancelledError:
                pass

        if self.session:
            await self.session.close()

        self.log_message("Bot stopped")

    # ---------------------------------------------------------
    # API helpers for RiskManager (account_repo / trade_repo)
    # ---------------------------------------------------------

    async def get_position_value_eur(self, symbol: str) -> float:
        """Return total EUR value of open positions."""
        try:
            async with self.session.get("http://localhost:8000/paper/account") as resp:
                data = await resp.json()
                btc = data["balances"]["BTC"]
                price = await self.fetch_price()
                return btc * price["price"]
        except Exception:
            return 0.0

    async def get_today_realized_pnl_eur(self) -> float:
        """Return realized PnL for today."""
        try:
            async with self.session.get("http://localhost:8000/paper/pnl/today") as resp:
                data = await resp.json()
                return data.get("realized_pnl", 0.0)
        except Exception:
            return 0.0

    async def get_trades_count_today(self) -> int:
        try:
            async with self.session.get("http://localhost:8000/paper/trades/today") as resp:
                data = await resp.json()
                return data.get("count", 0)
        except Exception:
            return 0

    async def get_last_trade(self, symbol: str):
        """Return last trade object with .timestamp."""
        try:
            async with self.session.get("http://localhost:8000/paper/trades/last") as resp:
                data = await resp.json()
                if not data:
                    return None

                class TradeObj:
                    timestamp = datetime.fromisoformat(data["timestamp"])

                return TradeObj()
        except Exception:
            return None

    async def get_orderbook_top(self, symbol: str):
        """Return (best_bid, best_ask)."""
        try:
            async with self.session.get(f"http://localhost:8000/market/orderbook?symbol={symbol}") as resp:
                data = await resp.json()
                return data["best_bid"], data["best_ask"]
        except Exception:
            return (None, None)

    # ---------------------------------------------------------
    # Prediction + price fetch
    # ---------------------------------------------------------

    async def fetch_prediction(self):
        url = f"http://localhost:8000/model/predict?symbol={self.symbol}&model={self.model}"

        try:
            async with self.session.get(url, timeout=15) as resp:
                if resp.status != 200:
                    self.log_message(f"Prediction error: HTTP {resp.status}")
                    return None
                return await resp.json()

        except asyncio.TimeoutError:
            self.log_message("Prediction error: Timeout")
            return None

        except Exception as e:
            self.log_message(f"Prediction error: {e}")
            return None

    async def fetch_price(self):
        url = f"http://localhost:8000/market/price?symbol={self.symbol}"

        try:
            async with self.session.get(url, timeout=10) as resp:
                if resp.status != 200:
                    self.log_message(f"Price error: HTTP {resp.status}")
                    return None
                return await resp.json()

        except Exception as e:
            self.log_message(f"Price error: {e}")
            return None

    # ---------------------------------------------------------
    # Trade execution
    # ---------------------------------------------------------

    async def execute_buy(self, eur_amount: float):
        url = f"http://localhost:8000/paper/buy?symbol={self.symbol}&eur_amount={eur_amount}"

        try:
            async with self.session.post(url) as resp:
                if resp.status == 200:
                    self.log_message(f"BUY executed: {eur_amount} EUR")
                else:
                    self.log_message(f"BUY failed: HTTP {resp.status}")
        except Exception as e:
            self.log_message(f"BUY error: {e}")

    async def execute_sell(self, btc_amount: float):
        url = f"http://localhost:8000/paper/sell?symbol={self.symbol}&btc_amount={btc_amount}"

        try:
            async with self.session.post(url) as resp:
                if resp.status == 200:
                    self.log_message(f"SELL executed: {btc_amount} BTC")
                else:
                    self.log_message(f"SELL failed: HTTP {resp.status}")
        except Exception as e:
            self.log_message(f"SELL error: {e}")

    # ---------------------------------------------------------
    # Main loop
    # ---------------------------------------------------------

    async def run_loop(self):
        self.log_message("Bot loop started")

        while self.running:
            prediction = await self.fetch_prediction()

            if not prediction:
                await asyncio.sleep(5)
                continue

            signal = prediction.get("signal")
            confidence = prediction.get("confidence")
            size_eur = prediction.get("size_eur", 50)  # fallback
            size_btc = prediction.get("size_btc", 0.001)

            self.log_message(f"Signal: {signal} (conf {confidence})")

            # Only trade on BUY/SELL signals
            if signal in ("BUY", "SELL") and confidence:

                ok, reason = await self.risk_manager.can_open_position(
                    symbol=self.symbol,
                    side=signal.lower(),
                    size_eur=size_eur,
                    signal_conf=confidence,
                )

                if not ok:
                    self.log_message(f"Risk blocked {signal}: {reason}")
                    await asyncio.sleep(10)
                    continue

                # Execute trade
                if signal == "BUY":
                    await self.execute_buy(size_eur)

                elif signal == "SELL":
                    await self.execute_sell(size_btc)

            await asyncio.sleep(10)  # loop interval


# Export bot instance
bot = AsyncBotEngine()
