import numpy as np
import pandas as pd


def compute_total_return(equity_curve: pd.Series) -> float:
    if len(equity_curve) < 2:
        return 0.0
    return float(equity_curve.iloc[-1] / equity_curve.iloc[0] - 1)


def compute_max_drawdown(equity_curve: pd.Series) -> float:
    if equity_curve.empty:
        return 0.0
    rolling_max = equity_curve.cummax()
    drawdowns = (equity_curve - rolling_max) / rolling_max
    return float(drawdowns.min())


def compute_sharpe_ratio(returns: pd.Series, risk_free_rate: float = 0.0) -> float:
    if returns.std() == 0:
        return 0.0
    excess_returns = returns - risk_free_rate
    return float(np.sqrt(252) * excess_returns.mean() / excess_returns.std())


def compute_win_rate(trades: list) -> float:
    if not trades:
        return 0.0
    # Only look at trades with realized PnL (CLOSE events)
    realized = [t["pnl"] for t in trades if t["side"] == "CLOSE"]
    if not realized:
        return 0.0
    wins = sum(1 for pnl in realized if pnl > 0)
    return float(wins / len(realized))


def compute_profit_factor(trades: list) -> float:
    realized = [t["pnl"] for t in trades if t["side"] == "CLOSE"]
    if not realized:
        return 0.0
    gains = sum(p for p in realized if p > 0)
    losses = abs(sum(p for p in realized if p < 0))
    if losses == 0:
        return float("inf") if gains > 0 else 0.0
    return float(gains / losses)
