from datetime import datetime
from typing import List, Dict

# ---------------------------------------------------------
# In-memory account state
# ---------------------------------------------------------

balances = {
    "EUR": 10_000.0,   # starting cash
    "BTC": 0.0,
}

# Trade history list
# Each trade is:
# {
#   "timestamp": "2025-01-01T12:34:56.789Z",
#   "type": "BUY" or "SELL",
#   "amount": float,
#   "price": float,
#   "eur_value": float,
#   "pnl": float (only for SELL)
# }
trade_history: List[Dict] = []


# ---------------------------------------------------------
# Helpers
# ---------------------------------------------------------

def _now_iso() -> str:
    return datetime.utcnow().isoformat()


def _record_trade(trade: Dict):
    """Append trade to history and keep only last 500."""
    trade_history.append(trade)
    if len(trade_history) > 500:
        trade_history.pop(0)


# ---------------------------------------------------------
# BUY logic (EUR → BTC)
# ---------------------------------------------------------

def execute_buy(symbol: str, eur_amount: float, price: float):
    """
    Buy BTC with EUR at the given price.
    """
    if eur_amount <= 0:
        return {"error": "Invalid EUR amount"}

    if balances["EUR"] < eur_amount:
        return {"error": "Insufficient EUR balance"}

    btc_amount = eur_amount / price

    # Update balances
    balances["EUR"] -= eur_amount
    balances["BTC"] += btc_amount

    trade = {
        "timestamp": _now_iso(),
        "type": "BUY",
        "amount": btc_amount,
        "price": price,
        "eur_value": eur_amount,
        "pnl": 0.0,
    }

    _record_trade(trade)
    return {"status": "ok", "trade": trade}


# ---------------------------------------------------------
# SELL logic (BTC → EUR)
# ---------------------------------------------------------

def execute_sell(symbol: str, btc_amount: float, price: float):
    """
    Sell BTC for EUR at the given price.
    """
    if btc_amount <= 0:
        return {"error": "Invalid BTC amount"}

    if balances["BTC"] < btc_amount:
        return {"error": "Insufficient BTC balance"}

    eur_value = btc_amount * price

    # Realized PnL calculation
    # We assume FIFO: average cost basis
    avg_cost = _average_cost_basis()
    pnl = (price - avg_cost) * btc_amount if avg_cost is not None else 0.0

    # Update balances
    balances["BTC"] -= btc_amount
    balances["EUR"] += eur_value

    trade = {
        "timestamp": _now_iso(),
        "type": "SELL",
        "amount": btc_amount,
        "price": price,
        "eur_value": eur_value,
        "pnl": pnl,
    }

    _record_trade(trade)
    return {"status": "ok", "trade": trade}


# ---------------------------------------------------------
# Cost basis (for PnL)
# ---------------------------------------------------------

def _average_cost_basis():
    """
    Compute average BTC cost basis from BUY trades.
    """
    total_btc = 0.0
    total_cost = 0.0

    for t in trade_history:
        if t["type"] == "BUY":
            total_btc += t["amount"]
            total_cost += t["eur_value"]

    if total_btc == 0:
        return None

    return total_cost / total_btc


# ---------------------------------------------------------
# Query helpers used by RiskManager
# ---------------------------------------------------------

def get_last_trade():
    if not trade_history:
        return None
    return trade_history[-1]


def get_trades_today():
    today = datetime.utcnow().date()
    return [
        t for t in trade_history
        if datetime.fromisoformat(t["timestamp"]).date() == today
    ]


def get_realized_pnl_today():
    today = datetime.utcnow().date()
    pnl = 0.0

    for t in trade_history:
        ts = datetime.fromisoformat(t["timestamp"]).date()
        if ts == today and t["type"] == "SELL":
            pnl += t.get("pnl", 0.0)

    return pnl
