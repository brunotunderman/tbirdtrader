import requests

API_URL = "http://127.0.0.1:8000"

def get_prediction(symbol="BTC-EUR"):
    response = requests.get(f"{API_URL}/model/predict", params={"symbol": symbol})
    return response.json()

prediction = get_prediction("BTC-EUR")

st.metric("Signal", prediction["signal"])
st.metric("Confidence", f"{prediction['confidence']:.2f}")
st.metric("Expected Return", f"{prediction['expected_return']:.4f}")

def get_price(symbol="BTC-EUR"):
    response = requests.get(f"{API_URL}/market/price", params={"symbol": symbol})
    return response.json()

price = get_price("BTC-EUR")
st.metric("Live Price", price["price"])

def run_backtest(symbol="BTC-EUR"):
    response = requests.get(f"{API_URL}/backtest/run", params={"symbol": symbol})
    return response.json()

results = run_backtest("BTC-EUR")
df = pd.DataFrame(results)
st.line_chart(df["capital"])
