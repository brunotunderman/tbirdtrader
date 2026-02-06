from fastapi import APIRouter
from core.model.predictor import Predictor
from core.data.market_data import MarketData

router = APIRouter()
predictor = Predictor()
market = MarketData()

@router.get("/predict")
def predict(symbol: str = "BTC-EUR"):
    df = market.get_historical_data(symbol)
    result = predictor.predict_signal(df)
    return result

@router.get("/model/predict")
def predict(symbol: str = "BTC-EUR"):
    df = load_historical_data(symbol)
    prediction = predict_next_points(df)
    return {
        "symbol": symbol,
        "prediction": prediction
    }

