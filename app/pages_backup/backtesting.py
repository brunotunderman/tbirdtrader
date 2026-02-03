import streamlit as st
import requests
import pandas as pd

API_URL = "http://127.0.0.1:8000"

st.title("📉 Strategy Backtesting")

symbol = st.selectbox("Select Symbol", ["BTC-EUR", "ETH-EUR"])

if st.button("Run Backtest"):
    with st.spinner("Running backtest..."):
        r = requests.get(f"{API_URL}/backtest/run", params={"symbol": symbol})
        results = r.json()

    st.subheader("Equity Curve")
    df = pd.DataFrame(results)
    st.line_chart(df["capital"])

    st.subheader("Trade Log")
    st.dataframe(df[["timestamp", "signal", "price", "capital"]])

    st.subheader("Performance Metrics")
    total_return = df["capital"].iloc[-1] - df["capital"].iloc[0]
    max_capital = df["capital"].max()
    min_capital = df["capital"].min()

    st.metric("Total Return", f"{total_return:.2f}")
    st.metric("Max Capital", f"{max_capital:.2f}")
    st.metric("Min Capital", f"{min_capital:.2f}")
