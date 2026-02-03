import streamlit as st
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

st.set_page_config(page_title="AI Trading Platform", layout="wide")

# ---------------------------
# Mock helpers
# ---------------------------
def mock_price_data(days=90):
    dates = pd.date_range(end=datetime.now(), periods=days, freq="H")
    prices = 20000 + np.cumsum(np.random.randn(len(dates)) * 50)
    return pd.DataFrame({"time": dates, "close": prices})

def mock_trades(n=10):
    now = datetime.now()
    data = []
    for i in range(n):
        side = np.random.choice(["BUY", "SELL"])
        price = 20000 + np.random.randn() * 200
        size = round(np.random.uniform(0.001, 0.02), 4)
        value = price * size
        pnl = np.random.randn() * 20
        data.append({
            "time": now - timedelta(hours=i * 6),
            "side": side,
            "size": size,
            "price": round(price, 2),
            "value_eur": round(value, 2),
            "pnl_eur": round(pnl, 2),
            "reason": "Mock AI signal"
        })
    return pd.DataFrame(data)

price_df = mock_price_data()
trade_df = mock_trades()

# ---------------------------
# Sidebar navigation
# ---------------------------
st.sidebar.title("Navigation")
page = st.sidebar.radio(
    "Go to",
    ["Live Trading", "Backtesting", "Portfolio", "Settings", "Subscription"]
)

# Global sidebar controls (asset/timeframe)
st.sidebar.markdown("---")
asset = st.sidebar.selectbox("Asset", ["BTC/EUR", "BTC/USD", "ETH/EUR", "ETH/USD"])
timeframe = st.sidebar.selectbox("Timeframe", ["1h", "4h", "1d", "1w"])

# ---------------------------
# Page: Live Trading
# ---------------------------
if page == "Live Trading":
    st.title("Live Trading Dashboard")

    # Asset & timeframe bar
    st.subheader(f"{asset} — {timeframe} (mock data)")
    st.caption(f"Last updated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

    # Metric cards
    col1, col2, col3, col4, col5, col6 = st.columns(6)
    last_price = price_df["close"].iloc[-1]
    change_24h = np.random.randn() * 3
    wallet_balance = 12000.0
    portfolio_value = 18000.0
    growth_abs = portfolio_value - 10000
    growth_pct = (portfolio_value / 10000 - 1) * 100
    drawdown = 8.5

    with col1:
        st.metric("Price", f"€{last_price:,.2f}")
    with col2:
        st.metric("24h Change", f"{change_24h:.2f}%")
    with col3:
        st.metric("Wallet Balance", f"€{wallet_balance:,.2f}")
    with col4:
        st.metric("Portfolio Value", f"€{portfolio_value:,.2f}")
    with col5:
        st.metric("Growth Since Start", f"€{growth_abs:,.2f}")
    with col6:
        st.metric("Drawdown", f"{drawdown:.2f}%")

    # AI Signal Panel
    st.markdown("### AI Signal")
    signal_col1, signal_col2 = st.columns([2, 1])

    with signal_col1:
        # Mock signal
        signal = "BUY"
        confidence = 0.78
        expected_return = 0.124
        suggested_trade = 250.0
        constraints = ["Wallet above threshold", "Kill switch OFF"]

        color = "green" if signal == "BUY" else "red" if signal == "SELL" else "gray"
        st.markdown(
            f"<h2 style='color:{color};'>Signal: {signal}</h2>",
            unsafe_allow_html=True
        )
        st.write(f"Confidence: {confidence:.1%}")
        st.write(f"Expected return: {expected_return:.1%}")
        st.write(f"Suggested trade size: €{suggested_trade:,.2f}")

        st.write("**Top reasons (mock):**")
        st.write("- RSI oversold")
        st.write("- Positive momentum")
        st.write("- Fear & Greed in fear zone")

        st.write("**Constraints:**")
        for c in constraints:
            st.write(f"- {c}")

    with signal_col2:
        st.markdown("**Sentiment & Indicators**")
        rsi = 32.5
        fear_greed = 28
        vol = 0.045
        st.write(f"RSI: {rsi:.1f}")
        st.write(f"Fear & Greed: {fear_greed}/100")
        st.write(f"Volatility (mock): {vol:.2%}")

    # Price chart
    st.markdown("### Price Chart")
    chart_df = price_df.set_index("time")[["close"]]
    st.line_chart(chart_df)

    # Auto-trading panel
    st.markdown("### Auto-Trading")
    auto_col1, auto_col2, auto_col3 = st.columns(3)
    with auto_col1:
        auto_enabled = st.checkbox("Enable Auto-Trading", value=False)
    with auto_col2:
        exec_mode = st.selectbox("Execution Mode", ["AI-only", "AI + Risk Filters", "Manual Confirmation"])
    with auto_col3:
        st.write("API Status: ✅ Connected (mock)")

    at_col1, at_col2 = st.columns(2)
    with at_col1:
        if st.button("Test API Connection"):
            st.success("API connection successful (mock).")
    with at_col2:
        if st.button("Emergency Kill Switch"):
            st.error("Kill switch activated (mock).")

    # Recent trades
    st.markdown("### Recent Trades")
    st.dataframe(trade_df.sort_values("time", ascending=False))

# ---------------------------
# Page: Backtesting
# ---------------------------
elif page == "Backtesting":
    st.title("Backtesting")

    st.subheader("Backtest Controls")
    col1, col2 = st.columns(2)
    with col1:
        start_date = st.date_input("Start Date", datetime.now() - timedelta(days=90))
    with col2:
        end_date = st.date_input("End Date", datetime.now())

    col3, col4, col5 = st.columns(3)
    with col3:
        starting_capital = st.number_input("Starting Capital (€)", value=10000.0, min_value=0.0)
    with col4:
        fee_model = st.selectbox("Fee Model", ["0.1%", "0.05%", "0.2%"])
    with col5:
        slippage = st.selectbox("Slippage", ["0.0%", "0.05%", "0.1%"])

    st.markdown("**Strategy Settings (mock)**")
    st.text("Here you’ll later configure profit target, trade frequency, etc.")

    if st.button("Run Backtest"):
        st.success("Backtest completed (mock).")

    st.markdown("### Equity Curve (mock)")
    eq_dates = pd.date_range(start=start_date, end=end_date, freq="D")
    eq_values = starting_capital * (1 + np.cumsum(np.random.randn(len(eq_dates)) * 0.01))
    eq_df = pd.DataFrame({"time": eq_dates, "equity": eq_values}).set_index("time")
    st.line_chart(eq_df)

    st.markdown("### Performance Metrics (mock)")
    col1, col2, col3, col4, col5 = st.columns(5)
    with col1:
        st.metric("Total Return", "24.5%")
    with col2:
        st.metric("Max Drawdown", "12.3%")
    with col3:
        st.metric("Win Rate", "57.8%")
    with col4:
        st.metric("Avg Return/Trade", "0.8%")
    with col5:
        st.metric("Sharpe-like", "1.4")

    st.markdown("### Trade List (mock)")
    st.dataframe(trade_df)

# ---------------------------
# Page: Portfolio
# ---------------------------
elif page == "Portfolio":
    st.title("Portfolio")

    st.subheader("Wallet Overview (mock)")
    col1, col2, col3, col4 = st.columns(4)
    with col1:
        st.metric("Total Value", "€18,000")
    with col2:
        st.metric("Crypto Holdings", "€15,000")
    with col3:
        st.metric("Fiat Balance", "€3,000")
    with col4:
        st.metric("Available Funds", "€2,500")

    st.markdown("### Holdings (mock)")
    holdings = pd.DataFrame([
        {"asset": "BTC", "amount": 0.35, "value_eur": 10500, "cost_basis": 9000, "unrealized_pnl": 1500},
        {"asset": "ETH", "amount": 4.2, "value_eur": 4500, "cost_basis": 4000, "unrealized_pnl": 500},
    ])
    st.dataframe(holdings)

    st.markdown("### Trade History (mock)")
    st.dataframe(trade_df)
    if st.button("Export CSV"):
        st.info("Export not implemented in prototype.")

# ---------------------------
# Page: Settings
# ---------------------------
elif page == "Settings":
    st.title("Settings")

    st.subheader("Strategy Settings")
    desired_return = st.number_input("Desired Return (%)", value=20.0)
    max_trades = st.number_input("Max Trades per Period", value=5, min_value=1)
    prob_threshold = st.slider("Probability Threshold for BUY", 0.5, 0.99, 0.7)
    max_trade_pct = st.slider("Max Trade Size (% of assets)", 1, 100, 25)
    min_wallet = st.number_input("Minimum Wallet Threshold (€)", value=500.0)
    min_order = st.number_input("Minimum Order Value (€)", value=50.0)
    kill_switch = st.checkbox("Enable Kill Switch", value=True)
    kill_dd = st.number_input("Kill Switch Drawdown (%)", value=30.0)

    st.subheader("Indicator Settings")
    enable_rsi = st.checkbox("Enable RSI", value=True)
    rsi_overbought = st.number_input("RSI Overbought Level", value=70)
    rsi_oversold = st.number_input("RSI Oversold Level", value=30)
    enable_fg = st.checkbox("Enable Fear & Greed", value=True)

    st.subheader("Model Settings (mock)")
    st.write("Model Version: v1.0")
    st.write("Retraining Schedule: Weekly")
    if st.button("Save Settings"):
        st.success("Settings saved (mock).")

# ---------------------------
# Page: Subscription
# ---------------------------
elif page == "Subscription":
    st.title("Subscription & Account")

    st.subheader("Current Plan (mock)")
    col1, col2, col3 = st.columns(3)
    with col1:
        st.metric("Plan", "Pro")
    with col2:
        st.metric("Renewal", "2026-02-12")
    with col3:
        st.metric("Status", "Active")

    col4, col5 = st.columns(2)
    with col4:
        st.button("Upgrade")
    with col5:
        st.button("Downgrade")

    st.subheader("Billing History (mock)")
    billing = pd.DataFrame([
        {"date": "2025-12-12", "amount": "€29.00", "status": "Paid"},
        {"date": "2025-11-12", "amount": "€29.00", "status": "Paid"},
    ])
    st.dataframe(billing)

    st.subheader("Account Settings (mock)")
    st.text_input("Email", value="user@example.com")
    st.text_input("Password", type="password", value="********")
    st.info("API tokens and advanced account settings will be added later.")
