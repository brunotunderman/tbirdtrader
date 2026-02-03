# routes_paper.py

from fastapi import APIRouter
from paper_state import paper_state
from paper_engine import execute_market_buy, execute_market_sell
from price_feed import get_current_price

router = APIRouter(prefix="/paper", tags=["Paper Trading"])

@router.get("/account")
def get_account():
    return paper_state.snapshot()

@router.post("/buy")
def paper_buy(symbol: str, eur_amount: float):
    price = get_current_price(symbol)
    trade = execute_market_buy(symbol, eur_amount, price)
    return {"trade": trade, "price": price}

@router.post("/sell")
def paper_sell(symbol: str, btc_amount: float):
    price = get_current_price(symbol)
    trade = execute_market_sell(symbol, btc_amount, price)
    return {"trade": trade, "price": price}
