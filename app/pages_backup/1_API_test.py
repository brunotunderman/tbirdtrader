import streamlit as st
import requests

st.title("Backend API Test Panel")

BASE_URL = "http://127.0.0.1:8000"

st.subheader("Test Market Endpoints")

if st.button("Get Price (BTC-EUR)"):
    r = requests.get(f"{BASE_URL}/market/price", params={"symbol": "BTC-EUR"})
    st.json(r.json())

if st.button("Get Historical Data (BTC-EUR)"):
    r = requests.get(f"{BASE_URL}/market/historical", params={"symbol": "BTC-EUR"})
    st.json(r.json())


st.subheader("Test Model Endpoints")

if st.button("Predict Signal (BTC-EUR)"):
    r = requests.get(f"{BASE_URL}/model/predict", params={"symbol": "BTC-EUR"})
    st.json(r.json())


st.subheader("Test Backtesting")

if st.button("Run Backtest (BTC-EUR)"):
    r = requests.get(f"{BASE_URL}/backtest/run", params={"symbol": "BTC-EUR"})
    st.json(r.json())


st.subheader("Test Portfolio Endpoints")

if st.button("Get Wallet"):
    r = requests.get(f"{BASE_URL}/portfolio/wallet")
    st.json(r.json())

if st.button("Get Trade History"):
    r = requests.get(f"{BASE_URL}/portfolio/trades")
    st.json(r.json())


st.subheader("Test Trading Endpoint")

if st.button("Execute Mock Trade"):
    r = requests.post(
        f"{BASE_URL}/trade/execute",
        params={"symbol": "BTC-EUR", "side": "BUY", "amount": 0.01}
    )
    st.json(r.json())


st.subheader("Test Auth Endpoints")

if st.button("Login (Mock)"):
    r = requests.post(
        f"{BASE_URL}/auth/login",
        params={"username": "test", "password": "1234"}
    )
    st.json(r.json())

if st.button("Register (Mock)"):
    r = requests.post(
        f"{BASE_URL}/auth/register",
        params={"username": "newuser", "password": "abcd"}
    )
    st.json(r.json())
