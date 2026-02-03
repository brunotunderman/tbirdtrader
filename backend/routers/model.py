from fastapi import APIRouter
from fastapi.responses import JSONResponse
from core.model.predictor import predict
import numpy as np

router = APIRouter()


def _to_json(obj):
    """
    Recursively convert NumPy, Pandas, and other non-JSON types
    into JSON-serializable Python types.
    """
    if isinstance(obj, dict):
        return {k: _to_json(v) for k, v in obj.items()}

    if isinstance(obj, list):
        return [_to_json(v) for v in obj]

    if isinstance(obj, np.ndarray):
        return obj.tolist()

    if isinstance(obj, (np.float32, np.float64)):
        return float(obj)

    if isinstance(obj, (np.int32, np.int64)):
        return int(obj)

    return obj


@router.get("/predict")
def predict_signal(symbol: str = "BTC-EUR", model: str = "baseline"):
    """
    Returns a trading signal and model features for the given symbol.
    Ensures the response is JSON-serializable.
    """
    try:
        raw = predict(symbol, model)
        safe = _to_json(raw)
        return JSONResponse(content=safe)

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)


