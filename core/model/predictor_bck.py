"""
Model Predictor
---------------
Handles feature engineering, predictions, comparison, and ranking.
"""

import numpy as np
import pandas as pd
import math
from core.market.data_loader import load_historical_data


# ---------------------------------------------------------
# Technical Indicators
# ---------------------------------------------------------

def compute_rsi(series: pd.Series, period: int = 14) -> float:
    delta = series.diff()
    gain = delta.clip(lower=0).rolling(period).mean()
    loss = -delta.clip(upper=0).rolling(period).mean()

    rs = gain / loss.replace(0, np.nan)
    rsi = 100 - (100 / (1 + rs))

    value = rsi.iloc[-1]
    return float(value) if not np.isnan(value) else 0.0


def compute_macd(series: pd.Series):
    ema12 = series.ewm(span=12, adjust=False).mean()
    ema26 = series.ewm(span=26, adjust=False).mean()

    macd = ema12 - ema26
    signal = macd.ewm(span=9, adjust=False).mean()

    return float(macd.iloc[-1]), float(signal.iloc[-1])


def compute_bollinger(series: pd.Series, period: int = 20, num_std: float = 2.0):
    sma = series.rolling(period).mean()
    std = series.rolling(period).std()

    upper = sma + num_std * std
    lower = sma - num_std * std

    return (
        float(upper.iloc[-1]) if not np.isnan(upper.iloc[-1]) else 0.0,
        float(lower.iloc[-1]) if not np.isnan(lower.iloc[-1]) else 0.0,
        float(sma.iloc[-1]) if not np.isnan(sma.iloc[-1]) else 0.0,
    )


# ---------------------------------------------------------
# Feature Engineering
# ---------------------------------------------------------

def compute_features(df: pd.DataFrame) -> dict:
    df = df.copy()

    df["return"] = df["close"].pct_change()
    df["volatility"] = df["return"].rolling(5).std()
    df["sma"] = df["close"].rolling(10).mean()

    rsi = compute_rsi(df["close"])
    macd, macd_signal = compute_macd(df["close"])
    bb_upper, bb_lower, bb_mid = compute_bollinger(df["close"])

    df = df.fillna(0)
    latest = df.iloc[-1]

    return {
        "return": float(latest["return"]),
        "volatility": float(latest["volatility"]),
        "sma": float(latest["sma"]),
        "price": float(latest["close"]),
        "rsi": float(rsi),
        "macd": float(macd),
        "macd_signal": float(macd_signal),
        "bb_upper": float(bb_upper),
        "bb_lower": float(bb_lower),
        "bb_mid": float(bb_mid),
    }


# ---------------------------------------------------------
# Feature Series (Step 4)
# ---------------------------------------------------------

def compute_feature_series(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()

    df["return"] = df["close"].pct_change()
    df["volatility"] = df["return"].rolling(5).std()
    df["sma"] = df["close"].rolling(10).mean()

    delta = df["close"].diff()
    gain = delta.clip(lower=0).rolling(14).mean()
    loss = -delta.clip(upper=0).rolling(14).mean()
    rs = gain / loss.replace(0, np.nan)
    df["rsi"] = 100 - (100 / (1 + rs))

    df["ema12"] = df["close"].ewm(span=12, adjust=False).mean()
    df["ema26"] = df["close"].ewm(span=26, adjust=False).mean()
    df["macd"] = df["ema12"] - df["ema26"]
    df["macd_signal"] = df["macd"].ewm(span=9, adjust=False).mean()

    df["bb_mid"] = df["close"].rolling(20).mean()
    df["bb_std"] = df["close"].rolling(20).std()
    df["bb_upper"] = df["bb_mid"] + 2 * df["bb_std"]
    df["bb_lower"] = df["bb_mid"] - 2 * df["bb_std"]

    return df.fillna(0)


def extract_feature_series(df: pd.DataFrame) -> dict:
    return {
        "rsi": df["rsi"].round(4).tolist(),
        "macd": df["macd"].round(4).tolist(),
        "macd_signal": df["macd_signal"].round(4).tolist(),
        "sma": df["sma"].round(4).tolist(),
        "bb_upper": df["bb_upper"].round(4).tolist(),
        "bb_lower": df["bb_lower"].round(4).tolist(),
        "bb_mid": df["bb_mid"].round(4).tolist(),
        "volatility": df["volatility"].round(4).tolist(),
    }


# ---------------------------------------------------------
# Signal Generation
# ---------------------------------------------------------

def generate_signal(features: dict):
    price = features["price"]
    sma = features["sma"]
    rsi = features["rsi"]
    macd = features["macd"]
    macd_signal = features["macd_signal"]

    if rsi < 30:
        return "BUY", 0.70
    if rsi > 70:
        return "SELL", 0.70

    if macd > macd_signal:
        return "BUY", 0.60
    if macd < macd_signal:
        return "SELL", 0.60

    if price > sma:
        return "BUY", 0.55
    if price < sma:
        return "SELL", 0.55

    return "HOLD", 0.50


# ---------------------------------------------------------
# Model Implementations
# ---------------------------------------------------------

def baseline_predict(df):
    last = float(df["close"].iloc[-1])
    return [last * (1 + 0.002 * i) for i in range(1, 11)]


def lstm_predict(df):
    last = float(df["close"].iloc[-1])
    return [last * (1 + 0.003 * i) for i in range(1, 11)]


def xgboost_predict(df):
    last = float(df["close"].iloc[-1])
    return [last * (1 + 0.0015 * i) for i in range(1, 11)]


def transformer_predict(df):
    last = float(df["close"].iloc[-1])
    return [last * (1 + 0.0025 * i) for i in range(1, 11)]


def ensemble_predict(df):
    last = float(df["close"].iloc[-1])
    return [last * (1 + 0.0022 * i) for i in range(1, 11)]


# ---------------------------------------------------------
# Equity Curve
# ---------------------------------------------------------

def compute_equity_curve(prices, signal):
    df = pd.DataFrame({"price": prices})
    df["return"] = df["price"].pct_change().fillna(0)

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


# ---------------------------------------------------------
# Full Prediction Pipeline
# ---------------------------------------------------------

def predict(symbol: str, model: str = "baseline") -> dict:
    df = load_historical_data(symbol).tail(200)

    features = compute_features(df)
    df_series = compute_feature_series(df)
    feature_series = extract_feature_series(df_series)

    signal, confidence = generate_signal(features)

    actual_prices = df["close"].astype(float).tolist()

    if model == "baseline":
        predicted_prices = baseline_predict(df)
    elif model == "lstm":
        predicted_prices = lstm_predict(df)
    elif model == "xgboost":
        predicted_prices = xgboost_predict(df)
    elif model == "transformer":
        predicted_prices = transformer_predict(df)
    elif model == "ensemble":
        predicted_prices = ensemble_predict(df)
    else:
        raise ValueError(f"Unknown model: {model}")

    upper_band = [p * 1.02 for p in predicted_prices]
    lower_band = [p * 0.98 for p in predicted_prices]

    feature_importance = {k: abs(v) for k, v in features.items()}

    equity = compute_equity_curve(actual_prices, signal)

    return {
        "symbol": symbol,
        "model": model,
        "actual_prices": actual_prices,
        "predicted_prices": predicted_prices,
        "upper_band": upper_band,
        "lower_band": lower_band,
        "signal": signal,
        "confidence": float(confidence),
        "features_used": features,
        "feature_series": feature_series,
        "feature_importance": feature_importance,
        "equity_curve": equity["equity_curve"],
        "drawdown": equity["drawdown"],
        "max_drawdown": equity["max_drawdown"],
    }


# ---------------------------------------------------------
# Model Comparison (Step 5)
# ---------------------------------------------------------

def compare_models(symbol: str, models: list[str]) -> dict:
    results = {}
    for m in models:
        try:
            results[m] = predict(symbol, m)
        except Exception as e:
            print(">>> Compare failed for model:", m, "error:", e)
            results[m] = {"error": str(e)}
    return {"symbol": symbol, "models": results}


# ---------------------------------------------------------
# SAFE Model Evaluation & Ranking (Step 7)
# ---------------------------------------------------------

def evaluate_model_from_df(df: pd.DataFrame, symbol: str, model: str) -> dict:
    print(">>> Evaluating model:", model)

    df = df.tail(210)

    actual_returns = df["close"].pct_change().shift(-1).dropna().tolist()
    predicted_returns = []

    closes = df["close"].tolist()

    for i in range(len(closes) - 1):
        try:
            pred = predict(symbol, model)["predicted_prices"][0]
            last = float(closes[i])
            predicted_returns.append((pred - last) / last)
        except Exception as e:
            print(">>> Prediction failed inside evaluation:", model, "error:", e)
            predicted_returns.append(0.0)

    n = min(len(actual_returns), len(predicted_returns))
    if n == 0:
        return {"model": model, "rmse": 999, "mae": 999, "max_drawdown": 0}

    rmse = math.sqrt(sum((p - a) ** 2 for p, a in zip(predicted_returns, actual_returns)) / n)
    mae = sum(abs(p - a) for p, a in zip(predicted_returns, actual_returns)) / n

    try:
        dd = predict(symbol, model)["max_drawdown"]
    except Exception as e:
        print(">>> Drawdown failed for model:", model, "error:", e)
        dd = 0.0

    return {"model": model, "rmse": rmse, "mae": mae, "max_drawdown": dd}


def rank_models(symbol: str, models: list[str]) -> dict:
    print(">>> Ranking models:", models)

    df = load_historical_data(symbol)

    evaluations = []
    for m in models:
        try:
            evaluations.append(evaluate_model_from_df(df, symbol, m))
        except Exception as e:
            print(">>> Evaluation failed for model:", m, "error:", e)

    ranked = sorted(evaluations, key=lambda x: (x["rmse"], abs(x["max_drawdown"])))

    print(">>> Ranking complete:", ranked)
    return {"symbol": symbol, "ranking": ranked}


# ---------------------------------------------------------
# Compatibility Wrapper
# ---------------------------------------------------------

class Predictor:
    def predict(self, symbol: str, model: str = "baseline"):
        return predict(symbol, model)

    def compare(self, symbol: str, models: list[str]):
        return compare_models(symbol, models)

    def rank(self, symbol: str, models: list[str]):
        return rank_models(symbol, models)
