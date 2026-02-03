"""
Backtester
----------
Simulates trades over historical data using the AI model.
Produces equity curve, trade log, and performance metrics.
"""

import pandas as pd
from core.model.predictor import compute_features, generate_signal
from core.trading.trade_sizer import TradeSizer
from core.trading.position_manager import PositionManager
from core.backtesting.metrics import (
    compute_total_return,
    compute_max_drawdown,
    compute_sharpe_ratio,
    compute_win_rate,
    compute_profit_factor,
)


class Backtester:
    def __init__(self, initial_capital: float = 10000):
        self.initial_capital = initial_capital
        self.trade_sizer = TradeSizer()
        self.position_manager = PositionManager()

    # ---------------------------------------------------------
    # Helpers
    # ---------------------------------------------------------
    def _prepare_dataframe(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Ensure the DataFrame is safe to work with and has a timestamp column.
        """
        df = df.copy()
        if "timestamp" not in df.columns:
            df["timestamp"] = df.index.astype(str)
        return df

    # ---------------------------------------------------------
    # Main Backtest Loop
    # ---------------------------------------------------------
    def run(self, df: pd.DataFrame, symbol: str = "UNKNOWN") -> dict:
        """
        Run a full backtest over the provided DataFrame.

        Returns:
            {
                "metrics": {...},
                "equity_curve": [...],
                "trades": [...],
                "results": [...]
            }
        """
        df = self._prepare_dataframe(df)

        capital = self.initial_capital
        equity_curve: list[float] = []
        results: list[dict] = []

        # Start after enough data exists for indicators
        for i in range(50, len(df)):
            window = df.iloc[:i].copy()
            row = df.iloc[i]

            # Feature engineering + signal generation
            features = compute_features(window)
            signal, confidence = generate_signal(features)

            prediction = {
                "signal": signal,
                "confidence": confidence,
            }

            # Position sizing
            size = self.trade_sizer.compute_size(capital, prediction)

            # Market data at this step
            price = float(row["close"])
            timestamp = str(row["timestamp"])

            # Execute signal via Position Manager
            realized_pnl = self.position_manager.execute_signal(
                timestamp=timestamp,
                symbol=symbol,
                signal=signal,
                size=size,
                price=price,
            )

            # Update capital with realized PnL
            capital += realized_pnl

            # Update unrealized PnL and equity
            unrealized_pnl = self.position_manager.update_unrealized(price)
            equity = capital + unrealized_pnl
            equity_curve.append(equity)

            # Log step
            results.append({
                "timestamp": timestamp,
                "price": price,
                "signal": signal,
                "confidence": confidence,
                "size": size,
                "capital": float(capital),
                "unrealized_pnl": unrealized_pnl,
                "realized_pnl": realized_pnl,
                "equity": equity,
            })

        # -----------------------------------------------------
        # Metrics
        # -----------------------------------------------------
        equity_series = pd.Series(equity_curve)
        returns = equity_series.pct_change().fillna(0)

        trades = [t.__dict__ for t in self.position_manager.trades]

        metrics = {
            "total_return": compute_total_return(equity_series),
            "max_drawdown": compute_max_drawdown(equity_series),
            "sharpe_ratio": compute_sharpe_ratio(returns),
            "win_rate": compute_win_rate(trades),
            "profit_factor": compute_profit_factor(trades),
        }

        return {
            "metrics": metrics,
            "equity_curve": equity_curve,
            "trades": trades,
            "results": results,
        }
