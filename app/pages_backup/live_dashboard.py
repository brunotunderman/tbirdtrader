import streamlit as st
import requests
import pandas as pd

API_URL = "http://127.0.0.1:8000"

st.title("📈 Live Market Dashboard")

symbol = st.selectbox("Select Symbol", ["BTC-EUR", "ETH-EUR"])

# --- Fetch live price ---
price_res = requests.get(f"{API_URL}/market/price", params={"symbol": symbol})
price_data = price_res.json()

st.subheader("Live Price")
st.metric("Price", f"{price_data['price']:.2f}")

# --- Fetch prediction ---
pred_res = requests.get(f"{API_URL}/model/predict", params={"symbol": symbol})
pred = pred_res.json()

st.subheader("Model Prediction")
col1, col2, col3 = st.columns(3)
col1.metric("Signal", pred["signal"])
col2.metric("Confidence", f"{pred['confidence']:.2f}")
col3.metric("Expected Return", f"{pred['expected_return']:.4f}")

# --- Show features ---
st.subheader("Features Used")
st.json(pred["features_used"])

# --- Fetch historical data ---
hist_res = requests.get(f"{API_URL}/market/historical", params={"symbol": symbol})
hist = pd.DataFrame(hist_res.json())

st.subheader("Recent Price History")
st.line_chart(hist["close"])
