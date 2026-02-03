# paper_engine.py

from backend.services.paper_state import paper_state

def execute_market_buy(symbol: str, amount_eur: float, price: float):
    btc_amount = amount_eur / price

    if paper_state.balances["EUR"] < amount_eur:
        raise ValueError("Insufficient EUR balance")

    paper_state.balances["EUR"] -= amount_eur
    paper_state.balances["BTC"] += btc_amount

    return paper_state.add_trade(symbol, "buy", btc_amount, price)


def execute_market_sell(symbol: str, amount_btc: float, price: float):
    if paper_state.balances["BTC"] < amount_btc:
        raise ValueError("Insufficient BTC balance")

    eur_amount = amount_btc * price

    paper_state.balances["BTC"] -= amount_btc
    paper_state.balances["EUR"] += eur_amount

    return paper_state.add_trade(symbol, "sell", amount_btc, price)
