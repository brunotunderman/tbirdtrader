from fastapi import APIRouter

router = APIRouter()

@router.get("/wallet")
def wallet():
    # Placeholder wallet
    return {
        "balance": 10000,
        "positions": [
            {"symbol": "BTC-EUR", "amount": 0.1, "value": 3500},
            {"symbol": "ETH-EUR", "amount": 1.5, "value": 2500}
        ]
    }

@router.get("/trades")
def trades():
    # Placeholder trade history
    return [
        {"symbol": "BTC-EUR", "side": "BUY", "amount": 0.05, "price": 30000},
        {"symbol": "ETH-EUR", "side": "SELL", "amount": 0.2, "price": 1800}
    ]
