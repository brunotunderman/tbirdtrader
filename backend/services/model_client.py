import requests

MODEL_URL = "http://localhost:8000/model/predict"

def predict_price(symbol: str) -> float:
    """
    Calls your FastAPI model endpoint and returns the predicted price.
    """
    try:
        res = requests.post(
            MODEL_URL,
            json={"symbol": symbol},
            timeout=5
        )
        res.raise_for_status()
        data = res.json()

        # Expecting: { "predicted_price": 12345.67 }
        return float(data["predicted_price"])

    except Exception as e:
        print(f"Prediction error: {e}")
        raise
