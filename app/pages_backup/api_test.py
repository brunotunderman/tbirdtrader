import streamlit as st
import requests

API_URL = "http://127.0.0.1:8000"

st.title("Backend Connectivity Test")

# Test prediction endpoint
if st.button("Test /model/predict"):
    try:
        r = requests.get(f"{API_URL}/model/predict", params={"symbol": "BTC-EUR"})
        st.json(r.json())
    except Exception as e:
        st.error(f"Error: {e}")

# Test price endpoint
if st.button("Test /market/price"):
    try:
        r = requests.get(f"{API_URL}/market/price", params={"symbol": "BTC-EUR"})
        st.json(r.json())
    except Exception as e:
        st.error(f"Error: {e}")

# Test backtest endpoint
if st.button("Test /backtest/run"):
    try:
        r = requests.get(f"{API_URL}/backtest/run", params={"symbol": "BTC-EUR"})
        st.json(r.json())
    except Exception as e:
        st.error(f"Error: {e}")
