
import core.model.predictor as P
print(">>> USING PREDICTOR FROM:", P.__file__)
from fastapi import APIRouter
from core.model.predictor import compare_models, rank_models

router = APIRouter()


# ---------------------------------------------------------
# Compare all models (full prediction output)
# ---------------------------------------------------------
@router.get("/")
def compare(symbol: str):
    models = ["baseline", "lstm", "xgboost", "transformer", "ensemble"]
    return compare_models(symbol, models)


# ---------------------------------------------------------
# Overlay comparison (used for multi-model chart)
# ---------------------------------------------------------
@router.get("/overlay")
def overlay(symbol: str):
    models = ["baseline", "lstm", "xgboost", "transformer", "ensemble"]
    return compare_models(symbol, models)


# ---------------------------------------------------------
# Model Ranking (Step 7)
# ---------------------------------------------------------
@router.get("/rank")
def rank(symbol: str):
    models = ["baseline", "lstm", "xgboost", "transformer", "ensemble"]
    return rank_models(symbol, models)

