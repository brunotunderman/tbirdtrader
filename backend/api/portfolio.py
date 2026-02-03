from fastapi import APIRouter

router = APIRouter()

@router.get("/wallet")
def wallet():
    return {"wallet_balance": 12000, "mock": True}

@router.get("/trades")
def trades():
    return {"trades": [], "mock": True}
