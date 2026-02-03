import pandas as pd

def compute_equity_curve(prices: list[float], signal: str):
    df = pd.DataFrame({"price": prices})
    df["return"] = df["price"].pct_change().fillna(0)

    # Simple strategy:
    # BUY → long
    # SELL → short
    # HOLD → flat
    if signal == "BUY":
        df["strategy_return"] = df["return"]
    elif signal == "SELL":
        df["strategy_return"] = -df["return"]
    else:
        df["strategy_return"] = 0

    df["equity"] = (1 + df["strategy_return"]).cumprod()
    df["drawdown"] = df["equity"] / df["equity"].cummax() - 1

    return {
        "equity_curve": df["equity"].round(4).tolist(),
        "drawdown": df["drawdown"].round(4).tolist(),
        "max_drawdown": float(df["drawdown"].min()),
    }
