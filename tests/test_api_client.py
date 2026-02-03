import requests

API = "http://127.0.0.1:8000"

def test_predict():
    r = requests.get(f"{API}/model/predict", params={"symbol": "BTC-EUR"})
    print("Predict:", r.json())

def test_price():
    r = requests.get(f"{API}/market/price", params={"symbol": "BTC-EUR"})
    print("Price:", r.json())

def test_backtest():
    r = requests.get(f"{API}/backtest/run", params={"symbol": "BTC-EUR"})
    print("Backtest:", r.json())

if __name__ == "__main__":
    test_predict()
    test_price()
    test_backtest()
